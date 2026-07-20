import { useForm } from "@tanstack/react-form";
import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { type ColumnDef, type RowData, type TableMeta } from "@tanstack/react-table";
import axios from "axios";
import {
  AlertTriangle,
  Check,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Tag as TagIcon,
  Trash2,
  Upload,
} from "lucide-react";
import { type ChangeEvent, type MouseEvent, useCallback, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { EmptyState } from "@/components/app/dashboard-events";
import { DataPagination } from "@/components/app/data-pagination";
import {
  type PendingSudo,
  type SudoAction,
  SudoDialog,
  SudoLock,
} from "@/components/app/sudo-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { isSudoActive, sudoQueryOptions } from "@/routes/dashboard/route";

export const Route = createFileRoute("/dashboard/admin/tags")({
  component: TagsPage,
  staticData: {
    area: "Admin",
    title: "Tags",
    sub: "The shared taxonomy referenced by events and projects",
  },
  loader: async ({ context: { queryClient } }) =>
    await queryClient.ensureQueryData(tagsQueryOptions),
});

/// Types and Interfaces

type RowHandler = (event: MouseEvent<HTMLElement>) => void;

interface Tag {
  id: number;
  title: string;
  description: string;
}

interface FullTags extends Tag {
  in_use: boolean;
}

interface AttachedTagEntry {
  id: string;
  name: string;
  type: "Project" | "Event";
}

interface AttachedTagResponse {
  detail: string;
  entries: AttachedTagEntry[];
}

interface Conflict {
  title: string;
  entries: AttachedTagEntry[];
}

interface TagsMeta {
  onEdit: RowHandler;
  onDelete: RowHandler;
}

interface TagVars {
  title: string;
  description: string;
}

interface EditVars extends TagVars {
  id: number;
}

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    tags?: TagsMeta;
  }
}

/// Constants — stable/empty data

type TagFormValues = z.infer<typeof tagFormSchema>;
const BLANK_TAG_FORM: TagFormValues = { title: "", description: "" };

const EMPTY_TAGS: FullTags[] = [];

/// Constants — Table Columns

const ACTIONS_TRIGGER = <Button variant="ghost" size="icon-sm" className="text-brand-text-sub" />;
const DESCRIPTION_MAX = 128;

const TAG_COLUMNS: ColumnDef<FullTags>[] = [
  {
    id: "tag",
    header: "Tag",
    cell: ({ row }) => (
      <span className="text-[13.5px] font-bold text-foreground">{row.original.title}</span>
    ),
  },
  {
    id: "status",
    header: "Status",
    meta: { className: "whitespace-nowrap pr-14 pl-8" },
    cell: ({ row }) =>
      row.original.in_use ? (
        <Badge className="gap-1 bg-[#078c79]/14 text-[#078c79] dark:bg-[#2fead0]/16 dark:text-[#2fead0]">
          <span className="size-1.5 rounded-full bg-current" />
          In use
        </Badge>
      ) : (
        <span className="text-[12.5px] text-muted-foreground">Unattached</span>
      ),
  },
  {
    id: "description",
    header: "Description",
    meta: { className: "hidden w-full @md:table-cell" },
    cell: ({ row }) => {
      const { description } = row.original;
      return (
        <span className="block text-[12.5px] leading-relaxed text-muted-foreground">
          {description.length > DESCRIPTION_MAX
            ? `${description.slice(0, DESCRIPTION_MAX)}...`
            : description}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    meta: { className: "text-right" },
    cell: ({ row, table }) => {
      const meta = table.options.meta?.tags;
      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={ACTIONS_TRIGGER}
              title="Tag actions"
              aria-label="Tag actions"
            >
              <MoreHorizontal />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem data-id={row.original.id} onClick={meta?.onEdit}>
                <Pencil />
                Edit tag
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                data-id={row.original.id}
                onClick={meta?.onDelete}
              >
                <Trash2 />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

/// Constants — regular

const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:8000";
const TAGS_KEY = ["tags", "list"] as const;
const TABLE_PAGE_SIZE = 10;
const CARD_CLASS =
  "rounded-[18px] border border-border bg-card shadow-[0px_4px_14px_rgba(112,144,176,0.14)] dark:shadow-[0px_4px_14px_rgba(0,0,0,0.4)]";
const TEAL_BUTTON_CLASS = "bg-brand-teal font-bold text-primary hover:bg-brand-teal/85";
const SECTION_LABEL_CLASS =
  "mb-1.5 text-[11px] font-bold tracking-[0.06em] text-muted-foreground uppercase";
const FIELD_ERROR_CLASS = "text-[12px] font-semibold text-[#e13737] dark:text-[#ff6b6b]";
const TAG_PILL_CLASS =
  "inline-flex items-center rounded-full border border-border bg-muted px-2 py-0.5 text-[11px] font-semibold text-brand-text-sub";

const SHARED_QUERY_OPTIONS = {
  staleTime: 60_000,
  retry: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  refetchOnMount: false,
} as const;

/// Zod schema

const tagFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "A title is required.")
    .max(80, "Keep the title under 80 characters."),
  description: z.string().trim().max(200, "Keep the description under 200 characters."),
});

/// Tanstack Query options

const tagsQueryOptions = queryOptions({
  queryKey: TAGS_KEY,
  queryFn: async () => {
    const { data } = await axios.get<FullTags[]>(`${API_BASE_URL}/tags`);
    return data;
  },
  ...SHARED_QUERY_OPTIONS,
});

/// Helper functions

function hasTitle(tags: readonly Tag[], title: string) {
  const term = title.trim().toLowerCase();
  return tags.some((tag) => tag.title.toLowerCase() === term);
}

/// Route

function TagsPage() {
  const queryClient = useQueryClient();

  const topRef = useRef<HTMLDivElement>(null);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<FullTags>();
  const [conflict, setConflict] = useState<Conflict>();
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkText, setBulkText] = useState("");
  const [pendingSudo, setPendingSudo] = useState<PendingSudo>();

  const { data: tags, isPending } = useQuery(tagsQueryOptions);
  const { data: sudo } = useQuery(sudoQueryOptions);
  const sudoActive = isSudoActive(sudo);

  const withSudo = useCallback(
    (action: SudoAction, run: () => void) => {
      if (isSudoActive(sudo)) run();
      else setPendingSudo({ ...action, run });
    },
    [sudo],
  );
  const clearSudo = useCallback(() => {
    setPendingSudo(undefined);
  }, []);

  const invalidateTags = useCallback(
    () => queryClient.invalidateQueries({ queryKey: TAGS_KEY }),
    [queryClient],
  );
  const { mutate: createTag } = useMutation({
    mutationFn: async (body: TagVars) => {
      const { data } = await axios.post<Tag>(`${API_BASE_URL}/tags/create`, body);
      return data;
    },
    onSuccess: (created) => {
      queryClient.setQueryData<FullTags[]>(TAGS_KEY, (old) => [
        ...(old ?? EMPTY_TAGS),
        { ...created, in_use: false },
      ]);
      toast.success("Tag created.");
    },
    onError: () => toast.error("Couldn't create the tag. Please try again."),
    onSettled: invalidateTags,
  });

  const { mutate: bulkCreate } = useMutation({
    mutationFn: async (body: TagVars[]) => {
      const { data } = await axios.post<Tag[]>(`${API_BASE_URL}/tags/bulk-create`, body);
      return data;
    },
    onSuccess: (created) => {
      queryClient.setQueryData<FullTags[]>(TAGS_KEY, (old) => [
        ...(old ?? EMPTY_TAGS),
        ...created.map((tag) => ({ ...tag, in_use: false })),
      ]);
      toast.success(`Created ${String(created.length)} tags.`);
    },
    onError: () => toast.error("Couldn't create the tags. Please try again."),
    onSettled: invalidateTags,
  });

  const { mutate: editTag } = useMutation({
    mutationFn: async ({ id, title, description }: EditVars) => {
      await axios.put<Tag>(`${API_BASE_URL}/tags/${String(id)}`, { title, description });
    },
    onMutate: async ({ id, title, description }) => {
      await queryClient.cancelQueries({ queryKey: TAGS_KEY });
      const previous = queryClient.getQueryData<FullTags[]>(TAGS_KEY);
      queryClient.setQueryData<FullTags[]>(TAGS_KEY, (old) =>
        (old ?? EMPTY_TAGS).map((tag) => (tag.id === id ? { ...tag, title, description } : tag)),
      );
      return { previous };
    },
    onError: (_error, _vars, context) => {
      if (context) queryClient.setQueryData(TAGS_KEY, context.previous);
      toast.error("Couldn't save the tag. Please try again.");
    },
    onSuccess: () => toast.success("Tag saved."),
    onSettled: invalidateTags,
  });

  const { mutate: deleteTag } = useMutation({
    mutationFn: async (tag: FullTags) => {
      await axios.delete(`${API_BASE_URL}/tags/${String(tag.id)}`);
    },
    onMutate: async (tag) => {
      await queryClient.cancelQueries({ queryKey: TAGS_KEY });
      const previous = queryClient.getQueryData<FullTags[]>(TAGS_KEY);
      if (!tag.in_use)
        queryClient.setQueryData<FullTags[]>(TAGS_KEY, (old) =>
          (old ?? EMPTY_TAGS).filter((row) => row.id !== tag.id),
        );
      return { previous };
    },
    onError: (error, tag, context) => {
      if (context) queryClient.setQueryData(TAGS_KEY, context.previous);
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        const data = error.response.data as AttachedTagResponse;
        setConflict({ title: tag.title, entries: data.entries });
        return;
      }
      toast.error("Couldn't delete the tag. Please try again.");
    },
    onSuccess: () => toast.success("Tag deleted."),
    onSettled: invalidateTags,
  });

  const form = useForm({
    defaultValues: BLANK_TAG_FORM,
    validators: { onChange: tagFormSchema },
    onSubmit: ({ value }) => {
      const title = value.title.trim();
      const description = value.description.trim() || title;
      if (editingTag === undefined && hasTitle(tags ?? EMPTY_TAGS, title)) {
        toast.error("A tag with that title already exists.");
        return;
      }
      if (editingTag) {
        const target = editingTag;
        withSudo(
          {
            title: "Edit tag",
            detail: `Rename a shared tag to “${title}”.`,
            reason: `Edit tag — ${title}`,
          },
          () => {
            editTag({ id: target.id, title, description });
          },
        );
      } else {
        createTag({ title, description });
      }
      setEditorOpen(false);
    },
  });

  const handleSearch = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(1);
  }, []);
  const goToPage = useCallback((next: number) => {
    setPage(next);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);
  const handleTitle = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      form.setFieldValue("title", event.target.value);
    },
    [form],
  );
  const handleDescription = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      form.setFieldValue("description", event.target.value);
    },
    [form],
  );
  const handleBulkText = useCallback((event: ChangeEvent<HTMLTextAreaElement>) => {
    setBulkText(event.target.value);
  }, []);
  const handleSubmit = useCallback(() => {
    void form.handleSubmit();
  }, [form]);

  const tagForEvent = useCallback(
    (event: MouseEvent<HTMLElement>) =>
      (tags ?? EMPTY_TAGS).find((tag) => tag.id === Number(event.currentTarget.dataset.id)),
    [tags],
  );

  const openCreate = useCallback(() => {
    setEditingTag(undefined);
    form.reset(BLANK_TAG_FORM);
    setEditorOpen(true);
  }, [form]);
  const openEdit = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      const tag = tagForEvent(event);
      if (!tag) return;
      setEditingTag(tag);
      form.reset({ title: tag.title, description: tag.description });
      setEditorOpen(true);
    },
    [tagForEvent, form],
  );
  const closeEditor = useCallback(() => {
    setEditorOpen(false);
  }, []);

  const removeTag = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      const tag = tagForEvent(event);
      if (!tag) return;
      withSudo(
        {
          title: "Delete tag",
          detail: `Delete the “${tag.title}” tag from the shared pool`,
          reason: `Delete tag — ${tag.title}`,
        },
        () => {
          deleteTag(tag);
        },
      );
    },
    [tagForEvent, deleteTag, withSudo],
  );
  const closeConflict = useCallback(() => {
    setConflict(undefined);
  }, []);
  const openBulk = useCallback(() => {
    setBulkText("");
    setBulkOpen(true);
  }, []);
  const closeBulk = useCallback(() => {
    setBulkOpen(false);
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (tags ?? EMPTY_TAGS).filter((tag) => tag.title.toLowerCase().includes(term));
  }, [tags, search]);

  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / TABLE_PAGE_SIZE));
  const pageRows = useMemo(
    () => filtered.slice((page - 1) * TABLE_PAGE_SIZE, page * TABLE_PAGE_SIZE),
    [filtered, page],
  );
  const tableMeta = useMemo<TableMeta<FullTags>>(
    () => ({ tags: { onEdit: openEdit, onDelete: removeTag } }),
    [openEdit, removeTag],
  );

  const bulkTitles = useMemo(() => {
    const seen = new Set<string>();
    return bulkText
      .split(/[\n,]+/)
      .map((title) => title.trim())
      .filter((title) => {
        const key = title.toLowerCase();
        if (!title || seen.has(key) || hasTitle(tags ?? EMPTY_TAGS, title)) return false;
        seen.add(key);
        return true;
      });
  }, [bulkText, tags]);
  const submitBulk = useCallback(() => {
    if (bulkTitles.length === 0) return;
    const titles = bulkTitles;
    withSudo(
      {
        title: "Bulk-create tags",
        detail: `Create ${String(titles.length)} new tag${titles.length === 1 ? "" : "s"} at once`,
        reason: `Bulk-create ${String(titles.length)} tags`,
      },
      () => {
        bulkCreate(titles.map((title) => ({ title, description: title })));
      },
    );
    setBulkOpen(false);
  }, [bulkTitles, bulkCreate, withSudo]);

  return (
    <div className="flex flex-col gap-5">
      <div ref={topRef} className={cn(CARD_CLASS, "scroll-mt-4 p-4")}>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-52 flex-1">
            <Search className="absolute top-1/2 left-3 size-4.25 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={handleSearch}
              placeholder="Search tags by title…"
              className="h-10 rounded-xl bg-muted pl-9.5"
            />
          </div>
          <Button className={cn("h-10", TEAL_BUTTON_CLASS)} onClick={openCreate}>
            <Plus />
            Create tag
          </Button>
          <Button variant="outline" className="h-10 font-bold" onClick={openBulk}>
            <Upload />
            Bulk create
            <SudoLock active={sudoActive} />
          </Button>
        </div>
      </div>

      {isPending && (
        <div className={cn(CARD_CLASS, "flex flex-col gap-3 p-4")}>
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} className="h-12 rounded-xl" />
          ))}
        </div>
      )}
      {!isPending && total === 0 && (
        <div className={CARD_CLASS}>
          <EmptyState
            icon={TagIcon}
            title="No tags match"
            sub="Try a different search, or create a tag."
            className="py-12"
          />
        </div>
      )}
      {!isPending && total > 0 && (
        <div className={cn(CARD_CLASS, "overflow-hidden")}>
          <div className="px-3 sm:px-4">
            <DataTable columns={TAG_COLUMNS} data={pageRows} meta={tableMeta} />
          </div>
        </div>
      )}

      {!isPending && total > 0 && (
        <DataPagination
          page={page}
          pageCount={pageCount}
          total={total}
          pageSize={TABLE_PAGE_SIZE}
          itemCount={pageRows.length}
          onPageChange={goToPage}
        />
      )}

      <Dialog open={editorOpen} onOpenChange={closeEditor}>
        <DialogContent className="sm:max-w-115">
          <DialogHeader>
            <DialogTitle className="text-lg font-extrabold">
              {editingTag ? "Edit tag" : "Create tag"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <form.Field name="title">
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="tag-title" className={SECTION_LABEL_CLASS}>
                    Title
                  </Label>
                  <Input
                    id="tag-title"
                    name="title"
                    value={field.state.value}
                    onChange={handleTitle}
                    placeholder="e.g. Rust"
                    className="border-border"
                  />
                  {field.state.meta.errors[0] && (
                    <span className={FIELD_ERROR_CLASS}>{field.state.meta.errors[0].message}</span>
                  )}
                </div>
              )}
            </form.Field>
            <form.Field name="description">
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="tag-description" className={SECTION_LABEL_CLASS}>
                    Description
                  </Label>
                  <Textarea
                    id="tag-description"
                    name="description"
                    rows={3}
                    value={field.state.value}
                    onChange={handleDescription}
                    placeholder="What it's for (optional)"
                    className="border-border"
                  />
                  {field.state.meta.errors[0] && (
                    <span className={FIELD_ERROR_CLASS}>{field.state.meta.errors[0].message}</span>
                  )}
                </div>
              )}
            </form.Field>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={closeEditor}>
              Cancel
            </Button>
            <form.Subscribe>
              {(state) => (
                <Button
                  className={TEAL_BUTTON_CLASS}
                  disabled={!state.canSubmit}
                  onClick={handleSubmit}
                >
                  {editingTag ? <Check /> : <Plus />}
                  {editingTag ? "Save tag" : "Create tag"}
                </Button>
              )}
            </form.Subscribe>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={conflict !== undefined} onOpenChange={closeConflict}>
        {conflict && (
          <DialogContent className="sm:max-w-110">
            <DialogHeader>
              <DialogTitle className="text-lg font-extrabold">Can't delete tag</DialogTitle>
              <DialogDescription>{conflict.title}</DialogDescription>
            </DialogHeader>
            <div className="flex items-start gap-2.5 rounded-xl border border-[#e0a100]/40 bg-[#f7b731]/12 p-3.5">
              <AlertTriangle className="size-4.5 shrink-0 text-[#e0a100] dark:text-[#f7c948]" />
              <p className="text-[13px]/relaxed text-brand-text-sub">
                <span className="font-bold text-foreground">{conflict.title}</span> is still
                attached to {conflict.entries.length}{" "}
                {conflict.entries.length === 1 ? "item" : "items"}. Detach it there first.
              </p>
            </div>
            {conflict.entries.length > 0 && (
              <ul className="flex max-h-56 flex-col gap-1.5 overflow-y-auto">
                {conflict.entries.map((entry) => (
                  <li
                    key={entry.id}
                    className="flex items-center gap-2.5 rounded-lg border border-border bg-muted/50 px-3 py-2"
                  >
                    <Badge variant="outline" className="shrink-0 text-[11px]">
                      {entry.type}
                    </Badge>
                    <span className="truncate text-[13px] font-semibold text-foreground">
                      {entry.name}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <DialogFooter>
              <Button className={TEAL_BUTTON_CLASS} onClick={closeConflict}>
                Keep tag
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      <Dialog open={bulkOpen} onOpenChange={closeBulk}>
        <DialogContent className="sm:max-w-125">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-extrabold">
              Bulk-create tags
              <SudoLock active={sudoActive} />
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="bulk" className={SECTION_LABEL_CLASS}>
              Tag titles
            </Label>
            <Textarea
              id="bulk"
              rows={6}
              value={bulkText}
              onChange={handleBulkText}
              placeholder={"Rust\nWebAssembly\nKubernetes"}
              className="border-border"
            />
            <span className="text-[11.5px] text-muted-foreground">
              One per line, or comma-separated. Duplicates are skipped.
            </span>
          </div>
          {bulkTitles.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {bulkTitles.map((title) => (
                <span key={title} className={TAG_PILL_CLASS}>
                  {title}
                </span>
              ))}
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={closeBulk}>
              Cancel
            </Button>
            <Button
              className={TEAL_BUTTON_CLASS}
              onClick={submitBulk}
              disabled={bulkTitles.length === 0}
            >
              <Upload />
              Create {bulkTitles.length > 0 ? bulkTitles.length : ""}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <SudoDialog pending={pendingSudo} onClose={clearSudo} />
    </div>
  );
}

import { useForm } from "@tanstack/react-form";
import {
  keepPreviousData,
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  type ColumnDef,
  type RowData,
  type TableFeatures,
  type TableMeta,
} from "@tanstack/react-table";
import axios from "axios";
import { blake3 } from "hash-wasm";
import {
  Activity,
  Archive,
  ArchiveRestore,
  Calendar,
  Check,
  ExternalLink,
  ImageIcon,
  Lock,
  LockOpen,
  Mail,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Trash2,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { type ChangeEvent, type MouseEvent, useCallback, useMemo, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { z } from "zod";

import { DataPagination } from "@/components/app/data-pagination";
import { ThumbnailDropzone } from "@/components/app/thumbnail-dropzone";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type dataTableFeatures, DataTable } from "@/components/ui/data-table";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  JOIN_POLICY_META,
  type JoinPolicy,
  type ProjectType,
  SIG_META,
} from "@/routes/dashboard/projects";
import { meQueryOptions } from "@/routes/dashboard/route";
import { type FullProjects, type ProjectInvite, type ProjectMember } from "@/types/kanae.gen";
import { type KanaePage } from "@/types/pages";

export const Route = createFileRoute("/dashboard/manage/projects")({
  component: ManageProjectsPage,
  staticData: {
    area: "Manage",
    title: "Manage Projects",
    sub: "Create, edit teams, and archive chapter projects",
  },
  loader: async ({ context: { queryClient } }) => {
    await queryClient.prefetchQuery(manageProjectsQueryOptions({ name: "", page: 1 }));
    await queryClient.prefetchQuery(manageInvitesQueryOptions);
  },
});

/// Types and Interfaces

type ManageStatus = "all" | "active" | "archived";
type DetailTab = "details" | "team";
type InviteAction = "accept" | "decline" | "revoke";
type RowHandler = (event: MouseEvent<HTMLElement>) => void;
type ThumbnailUpload = { url: string } | { hash: string; url: string };

interface ProjectPageParams {
  active?: boolean;
  name: string;
  page: number;
}

interface DirectoryMember extends ProjectMember {
  email: string;
}

interface ManageProjectsMeta {
  invites: ProjectInvite[] | undefined;
  onArchive: RowHandler;
  onDelete: RowHandler;
  onDetail: RowHandler;
  onEditor: RowHandler;
  onGallery: RowHandler;
}

interface RespondVars {
  action: InviteAction;
  invite: ProjectInvite;
}
interface InviteVars {
  member: ProjectMember;
  projectId: string;
}
interface SaveVars {
  creating: boolean;
  project: FullProjects;
  removeThumbnail: boolean;
  thumbnailFile?: File;
}
interface Editor {
  creating: boolean;
  founded_at: string;
  hadThumbnail: boolean;
  id: string;
}

declare module "@tanstack/react-table" {
  interface TableMeta<TFeatures extends TableFeatures, TData extends RowData> {
    manage?: ManageProjectsMeta;
  }
}

/// Constants - metadata and presentation

const JOIN_POLICY_ICONS: Record<JoinPolicy, typeof Lock> = {
  open: LockOpen,
  request: UserPlus,
  closed: Lock,
};

const JOIN_POLICY_TONE: Record<JoinPolicy, string> = {
  open: "text-[#15a66e] dark:text-[#3fd68c]",
  request: "text-amber-600 dark:text-amber-400",
  closed: "text-muted-foreground",
};

const RESPOND_TOAST: Record<InviteAction, string> = {
  accept: "Request approved — member added.",
  decline: "Request declined.",
  revoke: "Invite revoked.",
};

const SIG_DOT_CLASS: Record<ProjectType, string> = {
  independent: "bg-[#5b7a93]",
  sig_swe: "bg-[#3da9fc]",
  sig_ai: "bg-[#00c9a7]",
  sig_cyber: "bg-[#ff6b6b]",
  sig_data: "bg-[#f7b731]",
  sig_arch: "bg-[#fc5c7d]",
  sig_graph: "bg-[#a55eea]",
};

const AVATAR_CLASSES = [
  "bg-[#00c9a7]/15 text-[#00c9a7]",
  "bg-[#3da9fc]/15 text-[#3da9fc]",
  "bg-[#f7b731]/15 text-[#f7b731]",
  "bg-[#fc5c7d]/15 text-[#fc5c7d]",
  "bg-[#a55eea]/15 text-[#a55eea]",
  "bg-[#26de81]/15 text-[#26de81]",
  "bg-[#fd9644]/15 text-[#fd9644]",
  "bg-[#ff6b6b]/15 text-[#ff6b6b]",
];

/// Constants - Stable/Empty data

type ProjectFormValues = z.infer<typeof projectFormSchema>;
const BLANK_PROJECT_FORM: ProjectFormValues = {
  name: "",
  description: "",
  link: "",
  type: "sig_swe",
  active: true,
  join_policy: "open",
  tags: [],
  thumbnail: undefined,
};

const EMPTY_INVITES: ProjectInvite[] = [];
const EMPTY_MEMBERS: DirectoryMember[] = [];
const EMPTY_PROJECTS: FullProjects[] = [];
const EMPTY_META: Partial<ManageProjectsMeta> = {};

const PROJECT_TYPES = Object.keys(SIG_META) as ProjectType[];
const JOIN_POLICIES = Object.keys(JOIN_POLICY_META) as JoinPolicy[];

/// Constants - Table Columns

const ACTIONS_TRIGGER = (
  <Button variant="ghost" size="icon-sm" className="relative text-brand-text-sub" />
);
const PROJECT_COLUMNS: ColumnDef<typeof dataTableFeatures, FullProjects>[] = [
  {
    id: "project",
    header: "Project",
    cell: ({ row, table }) => {
      const onDetail = table.options.meta?.manage?.onDetail;
      return (
        <div className="flex items-center gap-2.5">
          <span className={cn("size-2 shrink-0 rounded-full", SIG_DOT_CLASS[row.original.type])} />
          <div className="min-w-0">
            <button
              type="button"
              data-id={row.original.id}
              onClick={onDetail}
              className="block max-w-full truncate text-left text-[13.5px] font-bold text-foreground transition hover:text-brand-teal-alt hover:underline"
            >
              {row.original.name}
            </button>
            <div className="text-[11.5px] text-muted-foreground">
              Founded {fmtMonthYear(row.original.founded_at)}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    id: "category",
    header: "Category",
    meta: { className: "hidden @lg:table-cell" },
    cell: ({ row }) => (
      <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand-text-sub">
        <span className={cn("size-1.75 rounded-full", SIG_DOT_CLASS[row.original.type])} />
        {SIG_META[row.original.type].label}
      </span>
    ),
  },
  {
    id: "team",
    header: "Team",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="flex -space-x-2">
          {row.original.members
            .slice(0, 3)
            .map((member) => renderAvatar(member, "size-6.5 ring-2 ring-card"))}
        </div>
        <span className="text-[11.5px] text-muted-foreground">{row.original.members.length}</span>
      </div>
    ),
  },
  {
    id: "join",
    header: "Join",
    meta: { className: "hidden @xl:table-cell" },
    cell: ({ row }) => {
      const PolicyIcon = JOIN_POLICY_ICONS[row.original.join_policy];
      return (
        <span className={cn(POLICY_CHIP_CLASS, JOIN_POLICY_TONE[row.original.join_policy])}>
          <PolicyIcon className="size-3.5" />
          {JOIN_POLICY_META[row.original.join_policy].label}
        </span>
      );
    },
  },
  {
    id: "status",
    header: "Status",
    meta: { className: "hidden @sm:table-cell" },
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={cn(
          "gap-1 font-bold",
          row.original.active ? "text-[#15a66e] dark:text-[#3fd68c]" : "text-muted-foreground",
        )}
      >
        <span
          className={cn(
            "size-1.5 rounded-full",
            row.original.active ? "bg-[#15a66e] dark:bg-[#3fd68c]" : "bg-muted-foreground",
          )}
        />
        {row.original.active ? "Active" : "Archived"}
      </Badge>
    ),
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row, table }) => {
      const { invites, onArchive, onDelete, onEditor, onGallery } =
        table.options.meta?.manage ?? EMPTY_META;
      const requestCount = (invites ?? []).filter(
        (invite) =>
          invite.project_id === row.original.id &&
          invite.kind === "request" &&
          invite.status === "pending",
      ).length;
      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={ACTIONS_TRIGGER}
              title="Project actions"
              aria-label="Project actions"
            >
              <MoreHorizontal />
              {requestCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 inline-flex min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-extrabold text-white">
                  {requestCount}
                </span>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem data-id={row.original.id} data-tab="team" onClick={onEditor}>
                <Users />
                Manage team
                {requestCount > 0 && (
                  <span className="ml-auto inline-flex min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-extrabold text-white">
                    {requestCount}
                  </span>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem data-id={row.original.id} data-tab="details" onClick={onEditor}>
                <Pencil />
                Edit details
              </DropdownMenuItem>
              <DropdownMenuItem data-id={row.original.id} onClick={onGallery}>
                <ImageIcon />
                Manage gallery
              </DropdownMenuItem>
              <DropdownMenuItem data-id={row.original.id} onClick={onArchive}>
                {row.original.active ? <Archive /> : <ArchiveRestore />}
                {row.original.active ? "Archive" : "Restore"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" data-id={row.original.id} onClick={onDelete}>
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
const THUMBNAIL_ACCEPT = { "image/*": [] };
const THUMBNAIL_MAX_BYTES = 32 * 1024 * 1024;
const MANAGE_PAGE_SIZE = 25;
const MEMBER_DIRECTORY_SIZE = 50;
const CARD_CLASS =
  "rounded-[18px] border border-border bg-card shadow-[0px_4px_14px_rgba(112,144,176,0.14)] dark:shadow-[0px_4px_14px_rgba(0,0,0,0.4)]";
const TEAL_BUTTON_CLASS = "bg-brand-teal font-bold text-primary hover:bg-brand-teal/85";
const SECTION_LABEL_CLASS =
  "mb-1.5 text-[11px] font-bold tracking-[0.06em] text-muted-foreground uppercase";
const TAG_PILL_CLASS =
  "inline-flex items-center rounded-full border border-border bg-muted px-2 py-0.5 text-[11px] font-semibold text-brand-text-sub";
const AVATAR_FALLBACK_CLASS = "text-[11px] font-bold";
const POLICY_CHIP_CLASS = "inline-flex items-center gap-1.5 text-xs font-bold";
const ROW_CLASS = "flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-2";
const MEMBER_LIST_CLASS =
  "flex max-h-72 flex-col overflow-y-auto overscroll-contain [scrollbar-color:auto] [&::-webkit-scrollbar-button]:hidden [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:border-3 [&::-webkit-scrollbar-thumb]:border-transparent [&::-webkit-scrollbar-thumb]:bg-muted-foreground/40 [&::-webkit-scrollbar-thumb]:bg-clip-content [&::-webkit-scrollbar-thumb:hover]:bg-muted-foreground/65 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-2.5";
const FACT_TILE_CLASS = "rounded-xl border border-border bg-muted/60 px-3.5 py-3";
const FACT_LABEL_CLASS =
  "mb-1 text-[10.5px] font-bold tracking-[0.06em] text-muted-foreground uppercase";
const FACT_VALUE_CLASS = "text-[13.5px] font-bold text-foreground";
const FIELD_ERROR_CLASS = "text-[12px] font-semibold text-[#e13737] dark:text-[#ff6b6b]";
const MONTH_YEAR_FMT = new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" });

/// Zod schema

const projectFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "A project name is required.")
    .max(120, "Keep the name under 120 characters."),
  description: z.string().max(2000, "That description is a little too long."),
  link: z.string().max(300, "That link is too long."),
  type: z.enum(PROJECT_TYPES as [ProjectType, ...ProjectType[]]),
  active: z.boolean(),
  join_policy: z.enum(JOIN_POLICIES as [JoinPolicy, ...JoinPolicy[]]),
  tags: z.array(z.string()),
  thumbnail: z
    .object({ hash: z.string(), url: z.string(), file: z.instanceof(File).optional() })
    .nullish(),
});

/// Tanstack Query options

const MANAGE_PROJECTS_KEY = ["projects", "manage"] as const;
const manageProjectsQueryOptions = ({ active, name, page }: ProjectPageParams) =>
  queryOptions({
    queryKey: [...MANAGE_PROJECTS_KEY, { active, name, page }],
    queryFn: async () => {
      const { data } = await axios.get<KanaePage<FullProjects>>(`${API_BASE_URL}/projects`, {
        params: {
          page,
          size: MANAGE_PAGE_SIZE,
          ...(active === undefined ? {} : { active }),
          ...(name.length >= 3 ? { name } : {}),
        },
      });
      return data;
    },
    placeholderData: keepPreviousData,
  });

const memberDirectoryQueryOptions = (query: string) =>
  queryOptions({
    queryKey: ["members", "directory", { query: query.length >= 3 ? query : "" }],
    queryFn: async () => {
      const { data } = await axios.get<KanaePage<DirectoryMember>>(`${API_BASE_URL}/members`, {
        params: {
          page: 1,
          size: MEMBER_DIRECTORY_SIZE,
          ...(query.length >= 3 ? { query } : {}),
        },
      });
      return data.data ?? EMPTY_MEMBERS;
    },
    placeholderData: keepPreviousData,
  });

const manageInvitesQueryOptions = queryOptions({
  queryKey: ["projects", "invites", { scope: "manage" }],
  queryFn: async () => {
    const { data } = await axios.get<ProjectInvite[]>(`${API_BASE_URL}/projects/invites`, {
      params: { status: "pending" },
    });
    return data;
  },
});

/// Helper functions

function fmtMonthYear(iso: string) {
  return MONTH_YEAR_FMT.format(new Date(iso));
}

function renderAvatar(member: ProjectMember, size = "size-8.5") {
  const initials =
    member.name
      .match(/\S+/g)
      ?.slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() ?? "··";

  let hash = 5381;
  for (let i = 0; i < member.id.length; i++)
    hash = ((hash << 5) + hash) ^ (member.id.codePointAt(i) ?? 0);

  const tint = AVATAR_CLASSES[Math.abs(hash) % AVATAR_CLASSES.length];

  return (
    <Avatar key={member.id} className={size} title={member.name}>
      <AvatarFallback className={cn(AVATAR_FALLBACK_CLASS, tint)}>{initials}</AvatarFallback>
    </Avatar>
  );
}

const renderJoinPolicyLabel = (value: JoinPolicy) => JOIN_POLICY_META[value].label;
const renderTypeLabel = (value: ProjectType) => SIG_META[value].label;
const renderLifecycleLabel = (value: string) => (value === "active" ? "Active" : "Archived");

/// Route

function ManageProjectsPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const topRef = useRef<HTMLDivElement>(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ManageStatus>("all");
  const [page, setPage] = useState(1);
  const [confirmId, setConfirmId] = useState<string>();
  const [detailId, setDetailId] = useState<string>();
  const [editor, setEditor] = useState<Editor>();
  const [tab, setTab] = useState<DetailTab>("details");
  const [addingMember, setAddingMember] = useState(false);
  const [memberSearch, setMemberSearch] = useState("");
  const [tagText, setTagText] = useState("");

  const activeFilter = status === "all" ? undefined : status === "active";
  const { data: pageData, isPending } = useQuery(
    manageProjectsQueryOptions({ active: activeFilter, name: search, page }),
  );
  const { data: invites } = useQuery(manageInvitesQueryOptions);
  const { data: me } = useQuery(meQueryOptions);
  const { data: directory, isPending: directoryPending } = useQuery({
    ...memberDirectoryQueryOptions(memberSearch),
    enabled: addingMember,
  });
  const projects = pageData?.data;

  const total = pageData?.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / MANAGE_PAGE_SIZE));

  const findProject = useCallback(
    (id: string | undefined) => {
      if (!id) return;
      for (const [, page] of queryClient.getQueriesData<KanaePage<FullProjects>>({
        queryKey: MANAGE_PROJECTS_KEY,
      })) {
        const hit = (page?.data ?? []).find((item) => item.id === id);
        if (hit) return hit;
      }
    },
    [queryClient],
  );

  const invalidateManage = useCallback(
    () => queryClient.invalidateQueries({ queryKey: MANAGE_PROJECTS_KEY }),
    [queryClient],
  );
  const { mutate: saveProject } = useMutation({
    mutationFn: async ({ creating, project, thumbnailFile, removeThumbnail }: SaveVars) => {
      const details = {
        name: project.name,
        description: project.description,
        link: project.link,
      };
      const { data: saved } = await (creating
        ? axios.post<Pick<FullProjects, "id">>(`${API_BASE_URL}/projects/create`, {
            ...details,
            type: project.type,
            tags: project.tags,
            active: project.active,
            founded_at: project.founded_at,
          })
        : axios.put<Pick<FullProjects, "id">>(`${API_BASE_URL}/projects/${project.id}`, details));

      if (!thumbnailFile) {
        if (removeThumbnail) await axios.delete(`${API_BASE_URL}/projects/${saved.id}/thumbnail`);
        return;
      }

      const body = {
        hash: await blake3(new Uint8Array(await thumbnailFile.arrayBuffer())),
        content_type: thumbnailFile.type,
        size: thumbnailFile.size,
      };
      const { data: upload } = await axios.post<ThumbnailUpload>(
        `${API_BASE_URL}/projects/${saved.id}/thumbnail/upload`,
        body,
      );
      if (!("hash" in upload))
        await axios.put(upload.url, thumbnailFile, {
          headers: { "Content-Type": thumbnailFile.type },
          withCredentials: false,
        });
      await axios.post(`${API_BASE_URL}/projects/${saved.id}/thumbnail/commit`, body);
    },
    onError: () => toast.error("Couldn't save the project. Please try again."),
    onSuccess: (_data, { creating }) =>
      toast.success(creating ? "Project created." : "Project saved."),
    onSettled: invalidateManage,
  });

  const { mutate: archiveProject } = useMutation({
    mutationFn: async (project: FullProjects) => {
      await axios.put(`${API_BASE_URL}/projects/${project.id}/archive`, {
        active: !project.active,
      });
    },
    onError: () => toast.error("Couldn't update the project. Please try again."),
    onSuccess: (_data, project) =>
      toast.success(project.active ? "Project archived." : "Project restored."),
    onSettled: invalidateManage,
  });

  const { mutate: deleteProject } = useMutation({
    mutationFn: async (project: FullProjects) => {
      await axios.delete(`${API_BASE_URL}/projects/${project.id}`);
    },
    onError: () => toast.error("Couldn't delete the project. Please try again."),
    onSuccess: () => toast.success("Project deleted."),
    onSettled: invalidateManage,
  });

  const { mutate: respondInvite } = useMutation({
    mutationFn: async ({ action, invite }: RespondVars) => {
      await (action === "revoke"
        ? axios.delete(`${API_BASE_URL}/projects/${invite.project_id}/invites/${invite.id}/revoke`)
        : axios.post(
            `${API_BASE_URL}/projects/${invite.project_id}/invites/${invite.id}/${action}`,
          ));
    },
    onMutate: async ({ invite }) => {
      await queryClient.cancelQueries({ queryKey: manageInvitesQueryOptions.queryKey });
      const snapshot = queryClient.getQueryData<ProjectInvite[]>(
        manageInvitesQueryOptions.queryKey,
      );
      queryClient.setQueryData<ProjectInvite[]>(manageInvitesQueryOptions.queryKey, (old = []) =>
        old.filter((item) => item.id !== invite.id),
      );
      return { snapshot };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(manageInvitesQueryOptions.queryKey, context?.snapshot);
      toast.error("Couldn't update the invitation. Please try again.");
    },
    onSuccess: (_data, { action }) => toast.success(RESPOND_TOAST[action]),
    onSettled: (_data, _error, { action }) => {
      if (action === "accept") return invalidateManage();
    },
  });

  const {
    mutate: sendInvite,
    isPending: invitePending,
    variables: inviteVars,
  } = useMutation({
    mutationFn: async ({ member, projectId }: InviteVars) => {
      const { data } = await axios.post<ProjectInvite>(
        `${API_BASE_URL}/projects/${projectId}/invites`,
        { member_id: member.id },
      );
      return data;
    },
    onMutate: async ({ member, projectId }) => {
      await queryClient.cancelQueries({ queryKey: manageInvitesQueryOptions.queryKey });
      const snapshot = queryClient.getQueryData<ProjectInvite[]>(
        manageInvitesQueryOptions.queryKey,
      );
      const pendingId = crypto.randomUUID();
      queryClient.setQueryData<ProjectInvite[]>(manageInvitesQueryOptions.queryKey, (old = []) => [
        ...old,
        {
          id: pendingId,
          project_id: projectId,
          kind: "invite",
          status: "pending",
          member,
          created_at: new Date().toISOString(),
        },
      ]);
      return { pendingId, snapshot };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(manageInvitesQueryOptions.queryKey, context?.snapshot);
      toast.error("Couldn't send the invite. Please try again.");
    },
    onSuccess: (invite, _variables, context) => {
      queryClient.setQueryData<ProjectInvite[]>(manageInvitesQueryOptions.queryKey, (old = []) =>
        old.map((item) => (item.id === context.pendingId ? invite : item)),
      );
      toast.success("Invite sent.");
    },
  });

  const form = useForm({
    defaultValues: BLANK_PROJECT_FORM,
    validators: { onChange: projectFormSchema },
    onSubmit: ({ value }) => {
      if (!editor) return;
      const existing = projects?.find((item) => item.id === editor.id);
      const thumbnail = value.thumbnail;
      saveProject({
        creating: editor.creating,
        project: {
          ...value,
          thumbnail: thumbnail ? { hash: thumbnail.hash, url: thumbnail.url } : undefined,
          id: editor.id,
          founded_at: editor.founded_at,
          members: existing?.members ?? (me ? [{ id: me.id, name: me.name }] : EMPTY_MEMBERS),
        },
        thumbnailFile: thumbnail?.file,
        removeThumbnail: !editor.creating && !thumbnail && editor.hadThumbnail,
      });
      closeEditor();
    },
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: THUMBNAIL_ACCEPT,
    maxSize: THUMBNAIL_MAX_BYTES,
    multiple: false,
    onDrop: (accepted, rejections) => {
      if (accepted.length > 0)
        form.setFieldValue("thumbnail", {
          hash: "local",
          url: URL.createObjectURL(accepted[0]),
          file: accepted[0],
        });
      else if (rejections.length > 0) toast.error("That file must be an image under 32 MB.");
    },
  });

  /// Toolbar + dialog open/close

  const closeEditor = useCallback(() => {
    setEditor(undefined);
    setAddingMember(false);
  }, []);
  const openCreate = useCallback(() => {
    form.reset(BLANK_PROJECT_FORM);
    setTagText("");
    setTab("details");
    setAddingMember(false);
    setEditor({
      creating: true,
      id: `new-${String(Date.now())}`,
      founded_at: new Date().toISOString(),
      hadThumbnail: false,
    });
  }, [form]);
  const closeConfirm = useCallback(() => {
    setConfirmId(undefined);
  }, []);
  const openDetail = useCallback((event: MouseEvent<HTMLElement>) => {
    setDetailId(event.currentTarget.dataset.id);
  }, []);
  const closeDetail = useCallback(() => {
    setDetailId(undefined);
  }, []);
  const handleSearch = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(1);
  }, []);
  const handleStatus = useCallback((value: string) => {
    setStatus(value as ManageStatus);
    setPage(1);
  }, []);
  const goToPage = useCallback((next: number) => {
    setPage(next);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);
  const prefetchPage = useCallback(
    (next: number) => {
      queryClient
        .prefetchQuery(
          manageProjectsQueryOptions({ active: activeFilter, name: search, page: next }),
        )
        .catch(() => {});
    },
    [queryClient, activeFilter, search],
  );
  const changeTab = useCallback((value: string) => {
    setTab(value as DetailTab);
  }, []);
  const toggleAdd = useCallback(() => {
    setAddingMember((value) => !value);
    setMemberSearch("");
  }, []);
  const handleMemberSearch = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setMemberSearch(event.target.value);
  }, []);

  /// Row actions

  const openEditor = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      const { id, tab: nextTab } = event.currentTarget.dataset;
      const project = findProject(id);
      if (!project) return;

      form.reset(
        {
          name: project.name,
          description: project.description,
          link: project.link,
          type: project.type,
          active: project.active,
          join_policy: project.join_policy,
          tags: project.tags ?? [],
          thumbnail: project.thumbnail ?? undefined,
        },
        { keepDefaultValues: true },
      );
      setTagText((project.tags ?? []).join(", "));
      setTab(nextTab as DetailTab);
      setAddingMember(false);
      setEditor({
        creating: false,
        id: project.id,
        founded_at: project.founded_at,
        hadThumbnail: !!project.thumbnail,
      });
    },
    [findProject, form],
  );
  const toggleArchive = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      const project = findProject(event.currentTarget.dataset.id);
      if (project) archiveProject(project);
    },
    [findProject, archiveProject],
  );
  const askDelete = useCallback((event: MouseEvent<HTMLElement>) => {
    setConfirmId(event.currentTarget.dataset.id);
  }, []);
  const openGallery = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      const projectId = event.currentTarget.dataset.id;
      if (projectId)
        navigate({
          to: "/dashboard/manage/projects/$projectId/gallery",
          params: { projectId },
        }).catch(() => {});
    },
    [navigate],
  );
  const confirmDelete = useCallback(() => {
    const project = projects?.find((item) => item.id === confirmId);
    if (project) deleteProject(project);
    if ((projects?.length ?? 0) <= 1 && page > 1) setPage((current) => current - 1);
    setConfirmId(undefined);
  }, [projects, confirmId, deleteProject, page]);

  const respond = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      const { id, action } = event.currentTarget.dataset;
      const invite = invites?.find((item) => item.id === id);
      if (invite) respondInvite({ action: action as InviteAction, invite });
    },
    [invites, respondInvite],
  );
  const invitePoolMember = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      const { projectId, memberId } = event.currentTarget.dataset;
      const member = directory?.find((item) => item.id === memberId);
      if (projectId && member) sendInvite({ member, projectId });
    },
    [directory, sendInvite],
  );
  const removeMember = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      const { projectId, memberId } = event.currentTarget.dataset;
      if (!projectId || !memberId) return;
      invalidateManage().catch(() => {});
      toast.success("Member removed.");
    },
    [invalidateManage],
  );

  const removeThumb = useCallback(() => {
    form.setFieldValue("thumbnail", undefined);
  }, [form]);

  /// Editor field handlers

  const handleSubmit = useCallback(() => {
    void form.handleSubmit();
  }, [form]);
  const handleText = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = event.target;
      form.setFieldValue(name as "description" | "link" | "name", value);
    },
    [form],
  );
  const handleTypeChange = useCallback(
    (value: ProjectType | null) => {
      if (value) form.setFieldValue("type", value);
    },
    [form],
  );
  const handlePolicyChange = useCallback(
    (value: JoinPolicy | null) => {
      if (value) form.setFieldValue("join_policy", value);
    },
    [form],
  );
  const handleLifecycleChange = useCallback(
    (value: string | null) => {
      if (value) form.setFieldValue("active", value === "active");
    },
    [form],
  );
  const handleTagsChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setTagText(value);
      form.setFieldValue(
        "tags",
        value
          .split(",")
          .map((part) => part.trim())
          .filter(Boolean),
      );
    },
    [form],
  );

  const tableMeta = useMemo<TableMeta<typeof dataTableFeatures, FullProjects>>(
    () => ({
      manage: {
        invites,
        onArchive: toggleArchive,
        onDelete: askDelete,
        onDetail: openDetail,
        onEditor: openEditor,
        onGallery: openGallery,
      },
    }),
    [invites, toggleArchive, askDelete, openDetail, openEditor, openGallery],
  );

  /// Derived data

  const rows = projects ?? EMPTY_PROJECTS;

  const editingMember = editor && !editor.creating ? editor.id : undefined;
  const live = editingMember
    ? projects?.find((project) => project.id === editingMember)
    : undefined;
  const members = live?.members ?? [];
  const draftInvites = editingMember
    ? (invites ?? EMPTY_INVITES).filter((invite) => invite.project_id === editingMember)
    : EMPTY_INVITES;
  const pendingRequests = draftInvites.filter(
    (invite) => invite.kind === "request" && invite.status === "pending",
  );
  const sentInvites = draftInvites.filter(
    (invite) => invite.kind === "invite" && invite.status === "pending",
  );
  const isSending = (invite: ProjectInvite) =>
    invitePending &&
    inviteVars.projectId === invite.project_id &&
    inviteVars.member.id === invite.member.id;
  const invitePool = editingMember
    ? (directory ?? EMPTY_MEMBERS).filter(
        (member) =>
          !members.some((m) => m.id === member.id) &&
          !sentInvites.some((invite) => invite.member.id === member.id),
      )
    : EMPTY_MEMBERS;
  const invitePoolEmptyLabel =
    memberSearch.length >= 3
      ? "No one matches that search."
      : "Everyone is already on this project or invited.";
  const confirmName = projects?.find((project) => project.id === confirmId)?.name;

  const detailProject = projects?.find((project) => project.id === detailId);
  const DetailPolicyIcon = detailProject ? JOIN_POLICY_ICONS[detailProject.join_policy] : undefined;

  return (
    <div className="flex flex-col gap-5">
      <div ref={topRef} className={cn(CARD_CLASS, "scroll-mt-4 p-4")}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm font-bold text-brand-text-sub">
            {total} project{total === 1 ? "" : "s"} you can manage
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-52 flex-1">
              <Search className="absolute top-1/2 left-3 size-4.25 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={handleSearch}
                placeholder="Search projects, tags…"
                className="h-10 rounded-xl bg-muted pl-9.5"
              />
            </div>
            <Tabs value={status} onValueChange={handleStatus}>
              <TabsList className="h-10 border border-border">
                <TabsTrigger value="all" className="font-bold data-active:border-border">
                  All
                </TabsTrigger>
                <TabsTrigger value="active" className="font-bold data-active:border-border">
                  Active
                </TabsTrigger>
                <TabsTrigger value="archived" className="font-bold data-active:border-border">
                  Archived
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <Button className={TEAL_BUTTON_CLASS} onClick={openCreate}>
              <Plus />
              New project
            </Button>
          </div>
        </div>
      </div>

      <div className={cn(CARD_CLASS, "overflow-hidden")}>
        {isPending ? (
          <div className="flex flex-col gap-3 p-4">
            {Array.from({ length: 5 }, (_, i) => (
              <Skeleton key={i} className="h-12 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="px-3 sm:px-4">
            <DataTable columns={PROJECT_COLUMNS} data={rows} meta={tableMeta} />
          </div>
        )}
      </div>

      {!isPending && total > 0 && (
        <DataPagination
          page={page}
          pageCount={pageCount}
          total={total}
          pageSize={MANAGE_PAGE_SIZE}
          itemCount={rows.length}
          onPageChange={goToPage}
          onPrefetchPage={prefetchPage}
        />
      )}

      <Dialog open={editor !== undefined} onOpenChange={closeEditor}>
        {editor && (
          <DialogContent className="flex max-h-[90svh] flex-col gap-0 overflow-hidden p-0 sm:max-w-160">
            <DialogHeader className="gap-1 border-b border-border p-5">
              <form.Subscribe>
                {(state) => (
                  <>
                    <DialogTitle className="text-xl font-extrabold">
                      {editor.creating ? "New project" : state.values.name || "Untitled project"}
                    </DialogTitle>
                    <DialogDescription className="font-semibold">
                      {editor.creating
                        ? "You'll be the owner; managers are granted editor access."
                        : `${SIG_META[state.values.type].label} · founded ${fmtMonthYear(
                            editor.founded_at,
                          )}`}
                    </DialogDescription>
                  </>
                )}
              </form.Subscribe>
            </DialogHeader>

            <Tabs
              value={tab}
              onValueChange={changeTab}
              className="min-h-0 flex-1 gap-0 overflow-y-auto"
            >
              {!editor.creating && (
                <div className="px-5 pt-4">
                  <TabsList className="h-10 w-full border border-border">
                    <TabsTrigger value="details" className="font-bold data-active:border-border">
                      Details
                    </TabsTrigger>
                    <TabsTrigger value="team" className="font-bold data-active:border-border">
                      Team · {members.length}
                    </TabsTrigger>
                  </TabsList>
                </div>
              )}

              <TabsContent value="details" className="flex flex-col gap-4 p-5">
                <form.Field name="thumbnail">
                  {(field) => (
                    <ThumbnailDropzone
                      label="Thumbnail"
                      value={field.state.value}
                      onRemove={removeThumb}
                      getRootProps={getRootProps}
                      getInputProps={getInputProps}
                      isDragActive={isDragActive}
                    />
                  )}
                </form.Field>

                <form.Field name="name">
                  {(field) => (
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="mp-name" className={SECTION_LABEL_CLASS}>
                        Project name
                      </Label>
                      <Input
                        id="mp-name"
                        name="name"
                        value={field.state.value}
                        onChange={handleText}
                        placeholder="e.g. Course Scheduler"
                        className="border-border"
                      />
                      {field.state.meta.isTouched && !field.state.meta.isValid && (
                        <span className={FIELD_ERROR_CLASS}>
                          {field.state.meta.errors[0]?.message}
                        </span>
                      )}
                    </div>
                  )}
                </form.Field>

                <form.Field name="description">
                  {(field) => (
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="mp-description" className={SECTION_LABEL_CLASS}>
                        Description
                      </Label>
                      <Textarea
                        id="mp-description"
                        name="description"
                        rows={3}
                        value={field.state.value}
                        onChange={handleText}
                        placeholder="What does this project do?"
                        className="border-border"
                      />
                      {field.state.meta.isTouched && !field.state.meta.isValid && (
                        <span className={FIELD_ERROR_CLASS}>
                          {field.state.meta.errors[0]?.message}
                        </span>
                      )}
                    </div>
                  )}
                </form.Field>

                <form.Field name="type">
                  {(field) => (
                    <div className="flex flex-col gap-1.5">
                      <Label className={SECTION_LABEL_CLASS}>SIG / category</Label>
                      {editor.creating ? (
                        <Select value={field.state.value} onValueChange={handleTypeChange}>
                          <SelectTrigger className="w-full border-border font-bold">
                            <SelectValue>{renderTypeLabel}</SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {PROJECT_TYPES.map((type) => (
                              <SelectItem key={type} value={type}>
                                {SIG_META[type].label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="flex h-9 items-center gap-2 rounded-md border border-border bg-muted px-3 text-sm font-bold text-brand-text-sub">
                          <Lock className="size-3.5 text-muted-foreground" />
                          {SIG_META[field.state.value].label}
                        </div>
                      )}
                    </div>
                  )}
                </form.Field>

                <div className="grid grid-cols-2 gap-3">
                  <form.Field name="join_policy">
                    {(field) => (
                      <div className="flex flex-col gap-1.5">
                        <Label className={SECTION_LABEL_CLASS}>Join policy</Label>
                        <Select value={field.state.value} onValueChange={handlePolicyChange}>
                          <SelectTrigger className="w-full border-border font-bold">
                            <SelectValue>{renderJoinPolicyLabel}</SelectValue>
                          </SelectTrigger>
                          <SelectContent
                            align="start"
                            alignItemWithTrigger={false}
                            className="w-80 max-w-(--available-width)"
                          >
                            {JOIN_POLICIES.map((policy) => (
                              <SelectItem key={policy} value={policy}>
                                <span className="flex flex-col gap-0.5">
                                  <span className="font-bold">
                                    {JOIN_POLICY_META[policy].label}
                                  </span>
                                  <span className="text-xs whitespace-normal text-muted-foreground">
                                    {JOIN_POLICY_META[policy].desc}
                                  </span>
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </form.Field>

                  <form.Field name="active">
                    {(field) => (
                      <div className="flex flex-col gap-1.5">
                        <Label className={SECTION_LABEL_CLASS}>Lifecycle</Label>
                        <Select
                          value={field.state.value ? "active" : "archived"}
                          onValueChange={handleLifecycleChange}
                        >
                          <SelectTrigger className="w-full border-border font-bold">
                            <Activity
                              className={cn(
                                "size-4",
                                field.state.value
                                  ? "text-[#15a66e] dark:text-[#3fd68c]"
                                  : "text-muted-foreground",
                              )}
                            />
                            <SelectValue>{renderLifecycleLabel}</SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </form.Field>
                </div>

                <form.Field name="link">
                  {(field) => (
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="mp-link" className={SECTION_LABEL_CLASS}>
                        Link
                      </Label>
                      <Input
                        id="mp-link"
                        name="link"
                        value={field.state.value}
                        onChange={handleText}
                        placeholder="github.com/…"
                        className="border-border"
                      />
                      {field.state.meta.isTouched && !field.state.meta.isValid && (
                        <span className={FIELD_ERROR_CLASS}>
                          {field.state.meta.errors[0]?.message}
                        </span>
                      )}
                    </div>
                  )}
                </form.Field>

                <form.Field name="tags">
                  {(field) => (
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="mp-tags" className={SECTION_LABEL_CLASS}>
                        Tags
                      </Label>
                      <Input
                        id="mp-tags"
                        value={tagText}
                        onChange={handleTagsChange}
                        placeholder="Python, React, Postgres"
                        className="border-border"
                      />
                      {field.state.value.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {field.state.value.map((tag) => (
                            <span key={tag} className={TAG_PILL_CLASS}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </form.Field>
              </TabsContent>

              {!editor.creating && live && (
                <TabsContent value="team" className="flex flex-col gap-5 p-5">
                  <div>
                    <div className={SECTION_LABEL_CLASS}>
                      Requests to join
                      {pendingRequests.length > 0 && (
                        <span className="text-amber-600 dark:text-amber-400">
                          {" · "}
                          {pendingRequests.length}
                        </span>
                      )}
                    </div>
                    {pendingRequests.length === 0 ? (
                      <p className="text-[12.5px] text-muted-foreground">No pending requests.</p>
                    ) : (
                      <div className="flex flex-col gap-1.5">
                        {pendingRequests.map((invite) => (
                          <div
                            key={invite.id}
                            className="flex items-start gap-3 rounded-xl border border-border bg-card px-3 py-2.5"
                          >
                            {renderAvatar(invite.member)}
                            <div className="min-w-0 flex-1">
                              <div className="text-[13.5px] font-bold text-foreground">
                                {invite.member.name}
                              </div>
                              <div className="text-xs text-brand-text-sub">
                                {invite.message ? `“${invite.message}”` : "Requested to join"}
                              </div>
                            </div>
                            <div className="flex gap-1.5">
                              <Button
                                size="sm"
                                className={TEAL_BUTTON_CLASS}
                                data-id={invite.id}
                                data-action="accept"
                                onClick={respond}
                              >
                                <Check />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="font-bold text-brand-text-sub"
                                data-id={invite.id}
                                data-action="decline"
                                onClick={respond}
                              >
                                Decline
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <div className={cn(SECTION_LABEL_CLASS, "mb-0")}>
                        Members · {members.length}
                      </div>
                      <Button variant="outline" size="sm" className="font-bold" onClick={toggleAdd}>
                        <UserPlus />
                        Invite member
                      </Button>
                    </div>
                    {addingMember && (
                      <div className="mb-3 rounded-xl border border-dashed border-border bg-muted/50 p-2">
                        <div className="px-2 py-1 text-[12px] font-bold text-muted-foreground">
                          Send an invite — they accept from their Projects page
                        </div>
                        <div className="relative px-2 py-1.5">
                          <Search className="absolute top-1/2 left-4.5 size-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            value={memberSearch}
                            onChange={handleMemberSearch}
                            placeholder="Search members by name or email…"
                            className="h-9 rounded-lg bg-background pl-8.5"
                          />
                        </div>
                        <div className={MEMBER_LIST_CLASS}>
                          {directoryPending &&
                            Array.from({ length: 3 }, (_, i) => (
                              <div key={i} className="flex items-center gap-2.5 px-2 py-1.5">
                                <Skeleton className="size-7 rounded-full" />
                                <Skeleton className="h-3.5 flex-1" />
                              </div>
                            ))}
                          {!directoryPending && invitePool.length === 0 && (
                            <div className="p-2 text-[12.5px] text-muted-foreground">
                              {invitePoolEmptyLabel}
                            </div>
                          )}
                          {!directoryPending &&
                            invitePool.map((member) => (
                              <button
                                key={member.id}
                                type="button"
                                data-project-id={editor.id}
                                data-member-id={member.id}
                                onClick={invitePoolMember}
                                className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition hover:bg-muted"
                              >
                                {renderAvatar(member, "size-7")}
                                <span className="min-w-0 flex-1">
                                  <span className="block truncate text-[13px] font-bold text-foreground">
                                    {member.name}
                                  </span>
                                  <span className="block truncate text-[11.5px] font-semibold text-muted-foreground">
                                    {member.email}
                                  </span>
                                </span>
                                <Mail className="size-4 text-brand-teal-alt" />
                              </button>
                            ))}
                        </div>
                      </div>
                    )}
                    <div className="flex flex-col gap-1.5">
                      {members.map((member) => (
                        <div key={member.id} className={ROW_CLASS}>
                          {renderAvatar(member)}
                          <div className="min-w-0 flex-1">
                            <div className="text-[13.5px] font-bold text-foreground">
                              {member.name}
                            </div>
                            <div className="text-[11.5px] font-semibold text-muted-foreground">
                              Member
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-destructive"
                            title="Remove member"
                            data-project-id={editor.id}
                            data-member-id={member.id}
                            onClick={removeMember}
                          >
                            <Trash2 />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {sentInvites.length > 0 && (
                    <div>
                      <div className={SECTION_LABEL_CLASS}>Sent invites · {sentInvites.length}</div>
                      <div className="flex flex-col gap-1.5">
                        {sentInvites.map((invite) => (
                          <div key={invite.id} className={ROW_CLASS}>
                            {renderAvatar(invite.member)}
                            <div className="min-w-0 flex-1">
                              <div className="text-[13.5px] font-bold text-foreground">
                                {invite.member.name}
                              </div>
                              <div className="text-[11.5px] text-muted-foreground">
                                {isSending(invite) ? "Sending…" : "Invitation pending"}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="font-bold text-brand-text-sub"
                              data-id={invite.id}
                              data-action="revoke"
                              disabled={isSending(invite)}
                              onClick={respond}
                            >
                              <X />
                              Revoke
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>
              )}
            </Tabs>

            <DialogFooter className="border-t border-border p-4 sm:items-center sm:justify-end">
              {editor.creating || tab === "details" ? (
                <form.Subscribe>
                  {(state) => (
                    <Button
                      className={TEAL_BUTTON_CLASS}
                      onClick={handleSubmit}
                      disabled={!state.canSubmit}
                    >
                      <Check />
                      {editor.creating ? "Create project" : "Save changes"}
                    </Button>
                  )}
                </form.Subscribe>
              ) : (
                <Button variant="outline" className="font-bold" onClick={closeEditor}>
                  Done
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      <Dialog open={detailId !== undefined} onOpenChange={closeDetail}>
        {detailProject && (
          <DialogContent className="flex max-h-[88svh] flex-col gap-0 overflow-hidden p-0 sm:max-w-155">
            <DialogHeader className="gap-1 border-b border-border p-5">
              <DialogTitle className="text-xl font-extrabold">{detailProject.name}</DialogTitle>
              <DialogDescription className="font-semibold">
                {SIG_META[detailProject.type].label} · founded{" "}
                {fmtMonthYear(detailProject.founded_at)}
              </DialogDescription>
            </DialogHeader>

            <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-5">
              {detailProject.thumbnail && (
                <div className="h-40 overflow-hidden rounded-xl border border-border">
                  <img
                    src={detailProject.thumbnail.url}
                    alt=""
                    className="size-full object-cover"
                  />
                </div>
              )}

              <div>
                <div className={SECTION_LABEL_CLASS}>About</div>
                <p className="text-sm/relaxed text-brand-text-sub">{detailProject.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className={FACT_TILE_CLASS}>
                  <div className={FACT_LABEL_CLASS}>Category</div>
                  <div className={FACT_VALUE_CLASS}>
                    <span className="inline-flex items-center gap-2">
                      <span
                        className={cn("size-2.25 rounded-full", SIG_DOT_CLASS[detailProject.type])}
                      />
                      {SIG_META[detailProject.type].label}
                    </span>
                  </div>
                </div>
                <div className={FACT_TILE_CLASS}>
                  <div className={FACT_LABEL_CLASS}>Status</div>
                  <div
                    className={cn(
                      FACT_VALUE_CLASS,
                      detailProject.active
                        ? "text-[#15a66e] dark:text-[#3fd68c]"
                        : "text-muted-foreground",
                    )}
                  >
                    {detailProject.active ? "Active" : "Archived"}
                  </div>
                </div>
                <div className={FACT_TILE_CLASS}>
                  <div className={FACT_LABEL_CLASS}>Founded</div>
                  <div className={cn(FACT_VALUE_CLASS, "inline-flex items-center gap-2")}>
                    <Calendar className="size-3.5 text-muted-foreground" />
                    {fmtMonthYear(detailProject.founded_at)}
                  </div>
                </div>
                <div className={FACT_TILE_CLASS}>
                  <div className={FACT_LABEL_CLASS}>Team size</div>
                  <div className={FACT_VALUE_CLASS}>
                    {detailProject.members.length} member
                    {detailProject.members.length === 1 ? "" : "s"}
                  </div>
                </div>
                <div className={FACT_TILE_CLASS}>
                  <div className={FACT_LABEL_CLASS}>Join policy</div>
                  <div className={FACT_VALUE_CLASS}>
                    <span
                      className={cn(POLICY_CHIP_CLASS, JOIN_POLICY_TONE[detailProject.join_policy])}
                    >
                      {DetailPolicyIcon && <DetailPolicyIcon className="size-3.5" />}
                      {JOIN_POLICY_META[detailProject.join_policy].label}
                    </span>
                  </div>
                </div>
              </div>

              {detailProject.link && (
                <div>
                  <div className={SECTION_LABEL_CLASS}>Link</div>
                  <a
                    href={detailProject.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-[13.5px] font-bold break-all text-brand-teal-alt hover:underline"
                  >
                    <ExternalLink className="size-3.5 shrink-0" />
                    {detailProject.link}
                  </a>
                </div>
              )}

              {(detailProject.tags?.length ?? 0) > 0 && (
                <div>
                  <div className={SECTION_LABEL_CLASS}>Tags</div>
                  <div className="flex flex-wrap gap-1.5">
                    {detailProject.tags?.map((tag) => (
                      <span key={tag} className={TAG_PILL_CLASS}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>

      <Dialog open={confirmId !== undefined} onOpenChange={closeConfirm}>
        <DialogContent className="sm:max-w-110">
          <DialogHeader>
            <DialogTitle className="text-lg font-extrabold">Delete project?</DialogTitle>
            <DialogDescription className="font-semibold">{confirmName}</DialogDescription>
          </DialogHeader>
          <p className="text-sm/relaxed text-brand-text-sub">
            Deleting cascades the team roster, gallery media, and thumbnail. This can't be undone —
            consider <span className="font-bold text-foreground">archiving</span> instead.
          </p>
          <DialogFooter>
            <Button variant="ghost" className="font-bold" onClick={closeConfirm}>
              Cancel
            </Button>
            <Button variant="destructive" className="font-bold" onClick={confirmDelete}>
              <Trash2 />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

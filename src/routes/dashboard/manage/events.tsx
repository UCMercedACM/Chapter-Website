import { useForm } from "@tanstack/react-form";
import {
  queryOptions,
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { type ColumnDef, type RowData, type TableMeta } from "@tanstack/react-table";
import axios from "axios";
import { blake3 } from "hash-wasm";
import {
  Calendar,
  CalendarPlus,
  Check,
  Clock,
  Lock,
  MapPin,
  MoreHorizontal,
  Pencil,
  QrCode,
  Search,
  Trash2,
} from "lucide-react";
import { type ChangeEvent, type MouseEvent, useCallback, useMemo, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Temporal } from "temporal-polyfill";
import { z } from "zod";

import { CheckInPanel } from "@/components/app/check-in-panel";
import { EmptyState } from "@/components/app/dashboard-events";
import { DataPagination } from "@/components/app/data-pagination";
import { ThumbnailDropzone } from "@/components/app/thumbnail-dropzone";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { DatePicker } from "@/components/ui/date-picker";
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
import { Progress } from "@/components/ui/progress";
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
import {
  type EventType,
  type FullEvent,
  type AttendanceMember,
  type KanaePage,
  EVENT_TYPE_CLASSES,
  EVENT_TYPE_META,
  EVENT_TYPES,
  determineCheckIn,
  fmtClock,
  fmtDay,
} from "@/lib/dashboard-events";
import { cn } from "@/lib/utils";
import { RosterRow } from "@/routes/dashboard/events";
import { meQueryOptions } from "@/routes/dashboard/index";

export const Route = createFileRoute("/dashboard/manage/events")({
  component: ManageEventsPage,
  staticData: {
    area: "Manage",
    title: "Manage Events",
    sub: "Create, edit, and track attendance for chapter events",
  },
  loader: async ({ context: { queryClient } }) => {
    await queryClient.prefetchQuery(manageEventsQueryOptions);
    await queryClient.prefetchQuery(meQueryOptions);
  },
});

/// Types and Interfaces

type ThumbnailUpload = { url: string } | { hash: string; url: string };
type RowHandler = (event: MouseEvent<HTMLElement>) => void;
type RosterTab = "qr" | "roster";

interface AttendanceSummary {
  planned: number;
  attended: number;
}

interface ManageEventsMeta {
  now: Date;
  meId?: string;
  attendance: ReadonlyMap<string, AttendanceSummary>;
  onDetail: RowHandler;
  onAttendance: RowHandler;
  onEdit: RowHandler;
  onAskDelete: RowHandler;
}

interface Editor {
  creating: boolean;
  id: string;
  timezone: string;
  type: EventType;
  creatorId?: string | null;
  hadThumbnail: boolean;
}

interface SaveVars {
  creating: boolean;
  event: FullEvent;
  thumbnailFile?: File;
  removeThumbnail?: boolean;
}

interface UndoVars {
  eventId: string;
  memberId: string;
}

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    events?: ManageEventsMeta;
  }
}

/// Constants - stable/empty data

type EventFormValues = z.infer<typeof eventFormSchema>;
const BLANK_EVENT_FORM: EventFormValues = {
  name: "",
  type: "general",
  location: "",
  date: new Date(),
  start: "17:00",
  end: "18:30",
  description: "",
  tags: [],
  thumbnail: undefined,
};

const EMPTY_EVENTS: FullEvent[] = [];
const EMPTY_ATTENDANCE_SUMMARY: AttendanceSummary = { planned: 0, attended: 0 };

/// Constants — Table Columns

const ACTIONS_TRIGGER = <Button variant="ghost" size="icon-sm" className="text-brand-text-sub" />;
const EVENT_COLUMNS: ColumnDef<FullEvent>[] = [
  {
    id: "event",
    header: "Event",
    cell: ({ row, table }) => {
      const { location, name, type } = row.original;
      const onDetail = table.options.meta?.events?.onDetail;
      return (
        <div className="flex items-center gap-2.5">
          <span className={cn("size-2 shrink-0 rounded-full", EVENT_TYPE_CLASSES[type].dot)} />
          <div className="min-w-0">
            <button
              type="button"
              data-id={row.original.id}
              onClick={onDetail}
              className="block max-w-full truncate text-left text-[13.5px] font-bold text-foreground transition hover:text-brand-teal-alt hover:underline"
            >
              {name}
            </button>
            <div className="truncate text-[11.5px] text-muted-foreground">{location}</div>
          </div>
        </div>
      );
    },
  },
  {
    id: "type",
    header: "Type",
    meta: { className: "hidden @md:table-cell" },
    cell: ({ row }) => (
      <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand-text-sub">
        <span className={cn("size-1.75 rounded-full", EVENT_TYPE_CLASSES[row.original.type].dot)} />
        {EVENT_TYPE_META[row.original.type].label}
      </span>
    ),
  },
  {
    id: "when",
    header: "Date & time",
    cell: ({ row }) => {
      const { end_at, start_at, timezone } = row.original;
      return (
        <div className="flex flex-col gap-1 whitespace-nowrap">
          <div className="text-[13.5px] font-bold text-brand-text-sub">
            {fmtDay(start_at, timezone)}
          </div>
          <div className="text-[12px] text-muted-foreground">
            {fmtClock(start_at, timezone)} – {fmtClock(end_at, timezone)}
          </div>
        </div>
      );
    },
  },
  {
    id: "attendance",
    header: "Attendance",
    meta: { className: "hidden @lg:table-cell" },
    cell: ({ row, table }) => {
      const { planned, attended } =
        table.options.meta?.events?.attendance.get(row.original.id) ?? EMPTY_ATTENDANCE_SUMMARY;
      const fillMax = Math.max(attended, planned) || 1;
      return (
        <div
          className="flex w-28 flex-col gap-1.5"
          title={`${String(attended)} checked in · ${String(planned)} planned`}
        >
          <span className="text-[12.5px] font-semibold whitespace-nowrap text-brand-text-sub">
            <span className="font-bold text-[#15a66e] dark:text-[#3fd68c]">{attended}</span> checked
            in
          </span>
          <Progress
            value={attended}
            max={fillMax}
            aria-label={`${String(attended)} checked in of ${String(planned)} planned`}
            className="**:data-[slot=progress-indicator]:bg-[#15a66e] **:data-[slot=progress-track]:bg-[#15a66e]/15 dark:**:data-[slot=progress-indicator]:bg-[#3fd68c] dark:**:data-[slot=progress-track]:bg-[#3fd68c]/20"
          />
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    meta: { className: "text-right" },
    cell: ({ row, table }) => {
      const meta = table.options.meta?.events;
      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={ACTIONS_TRIGGER}
              title="Event actions"
              aria-label="Event actions"
            >
              <MoreHorizontal />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem data-id={row.original.id} onClick={meta?.onAttendance}>
                <QrCode />
                Manage attendance
              </DropdownMenuItem>
              <DropdownMenuItem data-id={row.original.id} onClick={meta?.onEdit}>
                <Pencil />
                Edit event
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                data-id={row.original.id}
                onClick={meta?.onAskDelete}
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
const THUMBNAIL_ACCEPT = { "image/*": [] };
const THUMBNAIL_MAX_BYTES = 32 * 1024 * 1024;
const DEFAULT_TZ = "America/Los_Angeles";
const EVENTS_PAGE_SIZE = 100;
const TABLE_PAGE_SIZE = 10;
const MANAGE_EVENTS_KEY = ["events", "manage"] as const;
const EVENT_MANAGE_ROLES = new Set(["admin", "leads", "manager"]);
const CARD_CLASS =
  "rounded-[18px] border border-border bg-card shadow-[0px_4px_14px_rgba(112,144,176,0.14)] dark:shadow-[0px_4px_14px_rgba(0,0,0,0.4)]";
const TEAL_BUTTON_CLASS = "bg-brand-teal font-bold text-primary hover:bg-brand-teal/85";
const SECTION_LABEL_CLASS =
  "mb-1.5 text-[11px] font-bold tracking-[0.06em] text-muted-foreground uppercase";
const TAG_PILL_CLASS =
  "inline-flex items-center rounded-full border border-border bg-muted px-2 py-0.5 text-[11px] font-semibold text-brand-text-sub";
const TIME_INPUT_CLASS =
  "border-border bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none";
const FIELD_ERROR_CLASS = "text-[12px] font-semibold text-[#e13737] dark:text-[#ff6b6b]";
const ROSTER_STAT_CLASS =
  "flex-1 rounded-xl border border-border bg-card px-3.5 py-3 shadow-[0px_2px_5px_rgba(112,144,176,0.12)] dark:shadow-[0px_2px_5px_rgba(0,0,0,0.3)]";
const FACT_TILE_CLASS = "rounded-xl border border-border bg-muted/60 px-3.5 py-3";
const FACT_LABEL_CLASS =
  "mb-1 text-[10.5px] font-bold tracking-[0.06em] text-muted-foreground uppercase";
const FACT_VALUE_CLASS = "text-[13.5px] font-bold text-foreground";

/// Zod schema

const eventFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "An event name is required.")
      .max(120, "Keep the name under 120 characters."),
    type: z.enum(EVENT_TYPES as [EventType, ...EventType[]]),
    location: z
      .string()
      .trim()
      .min(1, "A location is required.")
      .max(160, "That location is too long."),
    date: z.date({ message: "Pick a date." }),
    start: z.iso.time({ precision: -1, error: "Set a start time." }),
    end: z.iso.time({ precision: -1, error: "Set an end time." }),
    description: z.string().max(2000, "That description is a little too long."),
    tags: z.array(z.string()),
    thumbnail: z
      .object({ hash: z.string(), url: z.string(), file: z.instanceof(File).optional() })
      .nullish(),
  })
  .refine((value) => value.end > value.start, {
    message: "End time must be after the start time.",
    path: ["end"],
  });

/// Tanstack Query options

const manageEventsQueryOptions = queryOptions({
  queryKey: MANAGE_EVENTS_KEY,
  queryFn: async () => {
    const first = await axios.get<KanaePage<FullEvent>>(`${API_BASE_URL}/events`, {
      params: { page: 1, size: EVENTS_PAGE_SIZE },
    });
    const events = [...(first.data.data ?? [])];
    const pageCount = Math.ceil(first.data.total / EVENTS_PAGE_SIZE);
    for (let page = 2; page <= pageCount; page++) {
      const next = await axios.get<KanaePage<FullEvent>>(`${API_BASE_URL}/events`, {
        params: { page, size: EVENTS_PAGE_SIZE },
      });
      events.push(...(next.data.data ?? []));
    }
    return events;
  },
});

const eventAttendanceQueryOptions = (eventId: string) =>
  queryOptions({
    queryKey: ["events", eventId, "attendance"],
    queryFn: async () => {
      const { data } = await axios.get<KanaePage<AttendanceMember>>(
        `${API_BASE_URL}/events/${eventId}/attendance`,
        { params: { page: 1, size: 100 } },
      );
      return data;
    },
  });

const eventAttendanceCodeQueryOptions = (eventId: string) =>
  queryOptions({
    queryKey: ["events", eventId, "attendance-code"],
    queryFn: async () => {
      const { data } = await axios.get<{ code: string }>(
        `${API_BASE_URL}/events/${eventId}/attendance-code`,
      );
      return data;
    },
  });

/// Helper functions

const summaryCache = new WeakMap<readonly AttendanceMember[], AttendanceSummary>();
function summarizeAttendance(members?: readonly AttendanceMember[]): AttendanceSummary {
  if (!members || members.length === 0) return EMPTY_ATTENDANCE_SUMMARY;
  const cached = summaryCache.get(members);
  if (cached) return cached;
  let planned = 0;
  let attended = 0;
  for (const member of members) {
    if (member.planned) planned += 1;
    if (member.attended) attended += 1;
  }
  const summary: AttendanceSummary = { planned, attended };
  summaryCache.set(members, summary);
  return summary;
}

function toInstant(date: Date, time: string, timeZone: string): string {
  return Temporal.PlainDate.from({
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  })
    .toPlainDateTime(Temporal.PlainTime.from(time))
    .toZonedDateTime(timeZone)
    .toInstant()
    .toString();
}

const renderEventTypeLabel = (value: EventType) => EVENT_TYPE_META[value].label;
const renderTypeFilterLabel = (value: "all" | EventType) =>
  value === "all" ? "All types" : EVENT_TYPE_META[value].label;

/// Route

function ManageEventsPage() {
  const queryClient = useQueryClient();

  const topRef = useRef<HTMLDivElement>(null);

  const [now] = useState(() => new Date());
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | EventType>("all");
  const [page, setPage] = useState(1);
  const [editor, setEditor] = useState<Editor>();
  const [tagText, setTagText] = useState("");
  const [detailId, setDetailId] = useState<string>();
  const [confirmId, setConfirmId] = useState<string>();
  const [rosterId, setRosterId] = useState<string>();
  const [rosterTab, setRosterTab] = useState<RosterTab>("qr");
  const [copied, setCopied] = useState(false);

  const { data: events, isPending } = useQuery(manageEventsQueryOptions);
  const { data: me } = useQuery(meQueryOptions);
  const meId = me?.id;

  const codeQuery = useQuery({
    ...eventAttendanceCodeQueryOptions(rosterId ?? ""),
    enabled: !!rosterId && rosterTab === "qr",
  });
  const rosterQuery = useQuery({
    ...eventAttendanceQueryOptions(rosterId ?? ""),
    enabled: !!rosterId && rosterTab === "roster",
  });

  const invalidateManage = useCallback(
    () => queryClient.invalidateQueries({ queryKey: MANAGE_EVENTS_KEY }),
    [queryClient],
  );
  const { mutate: saveEvent } = useMutation({
    mutationFn: async ({ creating, event, thumbnailFile, removeThumbnail }: SaveVars) => {
      const details = {
        name: event.name,
        description: event.description,
        location: event.location,
        start_at: event.start_at,
        end_at: event.end_at,
        timezone: event.timezone,
      };
      await (creating
        ? axios.post<FullEvent>(`${API_BASE_URL}/events/create`, {
            ...details,
            id: event.id,
            type: event.type,
          })
        : axios.put<FullEvent>(`${API_BASE_URL}/events/${event.id}`, details));

      const eventId = event.id;
      if (thumbnailFile) {
        const body = {
          hash: await blake3(new Uint8Array(await thumbnailFile.arrayBuffer())),
          content_type: thumbnailFile.type,
          size: thumbnailFile.size,
        };
        const { data: upload } = await axios.post<ThumbnailUpload>(
          `${API_BASE_URL}/events/${eventId}/thumbnail/upload`,
          body,
        );

        if (!("hash" in upload))
          await axios.put(upload.url, thumbnailFile, {
            headers: { "Content-Type": thumbnailFile.type },
            withCredentials: false,
          });
        await axios.post(`${API_BASE_URL}/events/${eventId}/thumbnail/commit`, body);
      } else if (removeThumbnail) {
        await axios.delete(`${API_BASE_URL}/events/${eventId}/thumbnail`);
      }

      const tags = event.tags ?? [];
      if (tags.length > 0) await axios.put(`${API_BASE_URL}/events/${eventId}/tags`, { tags });
      else if (!creating) await axios.delete(`${API_BASE_URL}/events/${eventId}/tags`);
    },
    onError: () => toast.error("Couldn't save the event. Please try again."),
    onSuccess: (_data, { creating }) =>
      toast.success(creating ? "Event published." : "Event saved."),
    onSettled: invalidateManage,
  });

  const { mutate: deleteEvent } = useMutation({
    mutationFn: async (eventId: string) => {
      await axios.delete(`${API_BASE_URL}/events/${eventId}`);
    },
    onError: () => toast.error("Couldn't delete the event. Please try again."),
    onSuccess: () => toast.success("Event deleted."),
    onSettled: invalidateManage,
  });

  const { mutate: undoCheckin, isPending: isUndoing } = useMutation({
    mutationFn: async ({ eventId, memberId }: UndoVars) => {
      await axios.delete(`${API_BASE_URL}/events/${eventId}/attendance/${memberId}`);
    },
    onError: () => toast.error("Couldn't undo the check-in. Please try again."),
    onSuccess: () => toast.success("Check-in undone."),
    onSettled: (_data, _error, { eventId }) =>
      queryClient.invalidateQueries({ queryKey: eventAttendanceQueryOptions(eventId).queryKey }),
  });

  const form = useForm({
    defaultValues: BLANK_EVENT_FORM,
    validators: { onChange: eventFormSchema },
    onSubmit: ({ value }) => {
      if (!editor) return;
      const timezone = editor.timezone;
      const thumb = value.thumbnail;
      saveEvent({
        creating: editor.creating,
        event: {
          id: editor.id,
          name: value.name.trim(),
          description: value.description,
          location: value.location.trim(),
          start_at: toInstant(value.date, value.start, timezone),
          end_at: toInstant(value.date, value.end, timezone),
          type: editor.creating ? value.type : editor.type,
          timezone,
          tags: value.tags,
          creator_id: editor.creating ? meId : editor.creatorId,
          thumbnail: thumb ? { hash: thumb.hash, url: thumb.url } : undefined,
        },
        thumbnailFile: thumb?.file,
        removeThumbnail: !editor.creating && !thumb && editor.hadThumbnail,
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
  }, []);
  const removeThumb = useCallback(() => {
    form.setFieldValue("thumbnail", undefined);
  }, [form]);

  const openCreate = useCallback(() => {
    form.reset(BLANK_EVENT_FORM);
    setTagText("");
    setEditor({
      creating: true,
      id: crypto.randomUUID(),
      timezone: DEFAULT_TZ,
      type: "general",
      creatorId: meId,
      hadThumbnail: false,
    });
  }, [form, meId]);

  /// Row actions

  const openEditor = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      const target = (events ?? EMPTY_EVENTS).find(
        (item) => item.id === event.currentTarget.dataset.id,
      );
      if (!target) return;
      const zoned = Temporal.Instant.from(target.start_at).toZonedDateTimeISO(target.timezone);
      const end = Temporal.Instant.from(target.end_at).toZonedDateTimeISO(target.timezone);
      form.reset(
        {
          name: target.name,
          type: target.type,
          location: target.location,
          date: new Date(zoned.year, zoned.month - 1, zoned.day),
          start: zoned.toPlainTime().toString({ smallestUnit: "minute" }),
          end: end.toPlainTime().toString({ smallestUnit: "minute" }),
          description: target.description,
          tags: target.tags ?? [],
          thumbnail: target.thumbnail ?? undefined,
        },
        { keepDefaultValues: true },
      );
      setTagText((target.tags ?? []).join(", "));
      setEditor({
        creating: false,
        id: target.id,
        timezone: target.timezone,
        type: target.type,
        creatorId: target.creator_id,
        hadThumbnail: !!target.thumbnail,
      });
    },
    [events, form],
  );
  const openDetail = useCallback((event: MouseEvent<HTMLElement>) => {
    setDetailId(event.currentTarget.dataset.id);
  }, []);
  const closeDetail = useCallback(() => {
    setDetailId(undefined);
  }, []);
  const askDelete = useCallback((event: MouseEvent<HTMLElement>) => {
    setConfirmId(event.currentTarget.dataset.id);
  }, []);
  const closeConfirm = useCallback(() => {
    setConfirmId(undefined);
  }, []);
  const confirmDelete = useCallback(() => {
    if (confirmId) deleteEvent(confirmId);
    setConfirmId(undefined);
  }, [confirmId, deleteEvent]);

  /// Roster actions

  const openRoster = useCallback((event: MouseEvent<HTMLElement>) => {
    setRosterTab("qr");
    setCopied(false);
    setRosterId(event.currentTarget.dataset.id);
  }, []);
  const closeRoster = useCallback((open: boolean) => {
    if (!open) setRosterId(undefined);
  }, []);
  const changeRosterTab = useCallback((value: string) => {
    setRosterTab(value as RosterTab);
  }, []);
  const handleRosterUndo = useCallback(
    (memberId: string) => {
      if (rosterId) undoCheckin({ eventId: rosterId, memberId });
    },
    [rosterId, undoCheckin],
  );

  /// Search actions

  const handleSearch = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(1);
  }, []);
  const handleTypeFilter = useCallback((value: "all" | EventType | null) => {
    if (value) {
      setTypeFilter(value);
      setPage(1);
    }
  }, []);
  const goToPage = useCallback((next: number) => {
    setPage(next);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  /// Form field handlers

  const handleSubmit = useCallback(() => {
    void form.handleSubmit();
  }, [form]);
  const handleText = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = event.target;
      form.setFieldValue(name as "description" | "end" | "location" | "name" | "start", value);
    },
    [form],
  );
  const handleTypeChange = useCallback(
    (value: EventType | null) => {
      if (value) form.setFieldValue("type", value);
    },
    [form],
  );
  const handleDateChange = useCallback(
    (date: Date | undefined) => {
      if (date) form.setFieldValue("date", date);
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

  const code = (codeQuery.data?.code ?? "").slice(0, 8);
  const copyCode = useCallback(() => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 1800);
      })
      .catch(() => {
        toast.error("Couldn't copy the code.");
      });
  }, [code]);

  const manageable = useMemo(() => {
    const hasRole = me?.roles.some((role) => EVENT_MANAGE_ROLES.has(role)) ?? false;
    return (events ?? EMPTY_EVENTS).filter((event) => hasRole || event.creator_id === me?.id);
  }, [events, me]);

  const rows = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return manageable
      .filter((event) => typeFilter === "all" || event.type === typeFilter)
      .filter(
        (event) =>
          !needle ||
          `${event.name} ${event.location} ${(event.tags ?? []).join(" ")}`
            .toLowerCase()
            .includes(needle),
      )
      .toSorted((a, b) => b.start_at.localeCompare(a.start_at));
  }, [manageable, typeFilter, search]);

  const total = rows.length;
  const pageCount = Math.max(1, Math.ceil(total / TABLE_PAGE_SIZE));
  const pageRows = useMemo(
    () => rows.slice((page - 1) * TABLE_PAGE_SIZE, page * TABLE_PAGE_SIZE),
    [rows, page],
  );

  // There is no good place to put this except here
  const attendance = useQueries({
    queries: pageRows.map((event) => eventAttendanceQueryOptions(event.id)),
    combine: (results) => {
      const map = new Map<string, AttendanceSummary>();
      pageRows.forEach((event, index) => {
        map.set(event.id, summarizeAttendance(results[index]?.data?.data));
      });
      return map;
    },
  });

  const tableMeta = useMemo<TableMeta<FullEvent>>(
    () => ({
      events: {
        now,
        meId,
        attendance,
        onDetail: openDetail,
        onAttendance: openRoster,
        onEdit: openEditor,
        onAskDelete: askDelete,
      },
    }),
    [now, meId, attendance, openDetail, openRoster, openEditor, askDelete],
  );

  const rosterMembers = rosterQuery.data?.data ?? [];
  const { planned: plannedCount, attended: attendedCount } = summarizeAttendance(rosterMembers);

  const rosterEvent = (events ?? EMPTY_EVENTS).find((event) => event.id === rosterId);
  const confirmName = (events ?? EMPTY_EVENTS).find((event) => event.id === confirmId)?.name;
  const detailEvent = (events ?? EMPTY_EVENTS).find((event) => event.id === detailId);

  const windowState = rosterEvent ? determineCheckIn(rosterEvent, now) : "ended";

  return (
    <div className="flex flex-col gap-5">
      <div ref={topRef} className={cn(CARD_CLASS, "scroll-mt-4 p-4")}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm font-bold text-brand-text-sub">
            {manageable.length} event{manageable.length === 1 ? "" : "s"} you can manage
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-52 flex-1">
              <Search className="absolute top-1/2 left-3 size-4.25 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={handleSearch}
                placeholder="Search events, tags…"
                className="h-10 rounded-xl bg-muted pl-9.5"
              />
            </div>
            <Select value={typeFilter} onValueChange={handleTypeFilter}>
              <SelectTrigger className="h-10 rounded-xl bg-muted font-bold">
                <SelectValue>{renderTypeFilterLabel}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                {EVENT_TYPES.map((key) => (
                  <SelectItem key={key} value={key}>
                    {EVENT_TYPE_META[key].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button className={TEAL_BUTTON_CLASS} onClick={openCreate}>
              <CalendarPlus />
              Create event
            </Button>
          </div>
        </div>
      </div>

      {isPending && (
        <div className={cn(CARD_CLASS, "flex flex-col gap-3 p-4")}>
          {Array.from({ length: 5 }, (_, index) => (
            <Skeleton key={index} className="h-12 rounded-xl" />
          ))}
        </div>
      )}
      {!isPending && rows.length === 0 && (
        <div className={CARD_CLASS}>
          <EmptyState
            icon={CalendarPlus}
            title="No events to manage"
            sub="Events you own or have permission to edit show up here."
            className="py-12"
          />
        </div>
      )}
      {!isPending && rows.length > 0 && (
        <div className={cn(CARD_CLASS, "overflow-hidden")}>
          <div className="px-3 sm:px-4">
            <DataTable columns={EVENT_COLUMNS} data={pageRows} meta={tableMeta} />
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

      <Dialog open={editor !== undefined} onOpenChange={closeEditor}>
        {editor && (
          <DialogContent className="max-h-[90svh] gap-4 overflow-y-auto sm:max-w-150">
            <DialogHeader>
              <form.Subscribe>
                {(state) => (
                  <DialogTitle className="text-lg font-extrabold">
                    {editor.creating ? "Create event" : state.values.name || "Untitled event"}
                  </DialogTitle>
                )}
              </form.Subscribe>
            </DialogHeader>

            <div className="flex flex-col gap-4">
              <form.Field name="thumbnail">
                {(field) => (
                  <ThumbnailDropzone
                    label="Thumbnail · optional"
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
                    <Label htmlFor="name" className={SECTION_LABEL_CLASS}>
                      Event name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="e.g. Intro to Rust"
                      value={field.state.value}
                      onChange={handleText}
                      className="border-border"
                    />
                  </div>
                )}
              </form.Field>

              <form.Field name="description">
                {(field) => (
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="description" className={SECTION_LABEL_CLASS}>
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      rows={3}
                      placeholder="What's this event about?"
                      value={field.state.value}
                      onChange={handleText}
                      className="border-border"
                    />
                  </div>
                )}
              </form.Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <form.Field name="type">
                  {(field) => (
                    <div className="flex flex-col gap-1.5">
                      <Label className={SECTION_LABEL_CLASS}>Type</Label>
                      {editor.creating ? (
                        <Select value={field.state.value} onValueChange={handleTypeChange}>
                          <SelectTrigger className="w-full border-border font-bold">
                            <SelectValue>{renderEventTypeLabel}</SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {EVENT_TYPES.map((key) => (
                              <SelectItem key={key} value={key}>
                                {EVENT_TYPE_META[key].label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="flex h-9 items-center gap-2 rounded-md border border-border bg-muted px-3 text-sm font-bold text-muted-foreground">
                          <Lock className="size-3.5" />
                          {EVENT_TYPE_META[field.state.value].label}
                        </div>
                      )}
                    </div>
                  )}
                </form.Field>

                <form.Field name="location">
                  {(field) => (
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="location" className={SECTION_LABEL_CLASS}>
                        Location
                      </Label>
                      <Input
                        id="location"
                        name="location"
                        placeholder="COB 263"
                        value={field.state.value}
                        onChange={handleText}
                        className="border-border"
                      />
                    </div>
                  )}
                </form.Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-[1.4fr_1fr_1fr]">
                <form.Field name="date">
                  {(field) => (
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="date" className={SECTION_LABEL_CLASS}>
                        Date
                      </Label>
                      <DatePicker
                        id="date"
                        value={field.state.value}
                        onValueChange={handleDateChange}
                      />
                    </div>
                  )}
                </form.Field>
                <form.Field name="start">
                  {(field) => (
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="start" className={SECTION_LABEL_CLASS}>
                        Start
                      </Label>
                      <Input
                        id="start"
                        name="start"
                        type="time"
                        value={field.state.value}
                        onChange={handleText}
                        className={TIME_INPUT_CLASS}
                      />
                    </div>
                  )}
                </form.Field>
                <form.Field name="end">
                  {(field) => (
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="end" className={SECTION_LABEL_CLASS}>
                        End
                      </Label>
                      <Input
                        id="end"
                        name="end"
                        type="time"
                        value={field.state.value}
                        onChange={handleText}
                        className={TIME_INPUT_CLASS}
                      />
                      {field.state.meta.errors[0] && (
                        <span className={FIELD_ERROR_CLASS}>
                          {field.state.meta.errors[0].message}
                        </span>
                      )}
                    </div>
                  )}
                </form.Field>
              </div>

              <form.Field name="tags">
                {(field) => (
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="tags" className={SECTION_LABEL_CLASS}>
                      Tags
                    </Label>
                    <Input
                      id="tags"
                      placeholder="Workshop, Beginner"
                      value={tagText}
                      onChange={handleTagsChange}
                      className="border-border"
                    />
                    {field.state.value.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {field.state.value.map((tag) => (
                          <span key={tag} className={TAG_PILL_CLASS}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[11.5px] text-muted-foreground">Comma-separated</span>
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
                    <Check />
                    {editor.creating ? "Publish event" : "Save event"}
                  </Button>
                )}
              </form.Subscribe>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      <Dialog open={detailId !== undefined} onOpenChange={closeDetail}>
        {detailEvent && (
          <DialogContent className="flex max-h-[88svh] flex-col gap-0 overflow-hidden p-0 sm:max-w-135">
            <DialogHeader className="gap-1 border-b border-border p-5">
              <DialogTitle className="text-xl font-extrabold">{detailEvent.name}</DialogTitle>
              <DialogDescription className="inline-flex items-center gap-2 font-semibold">
                <span
                  className={cn("size-2.25 rounded-full", EVENT_TYPE_CLASSES[detailEvent.type].dot)}
                />
                {EVENT_TYPE_META[detailEvent.type].label} ·{" "}
                {fmtDay(detailEvent.start_at, detailEvent.timezone)}
              </DialogDescription>
            </DialogHeader>

            <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-5">
              {detailEvent.thumbnail && (
                <div className="h-40 overflow-hidden rounded-xl border border-border">
                  <img src={detailEvent.thumbnail.url} alt="" className="size-full object-cover" />
                </div>
              )}

              {detailEvent.description && (
                <div>
                  <div className={SECTION_LABEL_CLASS}>About</div>
                  <p className="text-sm/relaxed text-brand-text-sub">{detailEvent.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className={FACT_TILE_CLASS}>
                  <div className={FACT_LABEL_CLASS}>Date</div>
                  <div className={cn(FACT_VALUE_CLASS, "inline-flex items-center gap-2")}>
                    <Calendar className="size-3.5 text-muted-foreground" />
                    {fmtDay(detailEvent.start_at, detailEvent.timezone)}
                  </div>
                </div>
                <div className={FACT_TILE_CLASS}>
                  <div className={FACT_LABEL_CLASS}>Time</div>
                  <div className={cn(FACT_VALUE_CLASS, "inline-flex items-center gap-2")}>
                    <Clock className="size-3.5 text-muted-foreground" />
                    {fmtClock(detailEvent.start_at, detailEvent.timezone)} –{" "}
                    {fmtClock(detailEvent.end_at, detailEvent.timezone)}
                  </div>
                </div>
                <div className={cn(FACT_TILE_CLASS, "col-span-2")}>
                  <div className={FACT_LABEL_CLASS}>Location</div>
                  <div className={cn(FACT_VALUE_CLASS, "inline-flex items-center gap-2")}>
                    <MapPin className="size-3.5 shrink-0 text-muted-foreground" />
                    {detailEvent.location}
                  </div>
                </div>
              </div>

              {(detailEvent.tags?.length ?? 0) > 0 && (
                <div>
                  <div className={SECTION_LABEL_CLASS}>Tags</div>
                  <div className="flex flex-wrap gap-1.5">
                    {detailEvent.tags?.map((tag) => (
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
        {confirmId && (
          <DialogContent className="sm:max-w-110">
            <DialogHeader>
              <DialogTitle className="text-lg font-extrabold">Delete event?</DialogTitle>
              <DialogDescription>{confirmName}</DialogDescription>
            </DialogHeader>
            <p className="text-sm/relaxed text-brand-text-sub">
              Deleting cascades attendance records and cleans up the thumbnail. This can't be
              undone.
            </p>
            <DialogFooter>
              <Button variant="ghost" onClick={closeConfirm}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                <Trash2 />
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      <Dialog open={rosterId !== undefined} onOpenChange={closeRoster}>
        {rosterEvent && (
          <DialogContent className="max-h-[88svh] gap-4 overflow-y-auto sm:max-w-135">
            <DialogHeader>
              <DialogTitle className="text-lg font-extrabold">Attendance</DialogTitle>
              <DialogDescription>{rosterEvent.name}</DialogDescription>
            </DialogHeader>

            <Tabs value={rosterTab} onValueChange={changeRosterTab} className="gap-4">
              <TabsList className="h-10 w-full border border-border">
                <TabsTrigger value="qr" className="font-bold data-active:border-border">
                  Check-in QR
                </TabsTrigger>
                <TabsTrigger value="roster" className="font-bold data-active:border-border">
                  Roster · {rosterMembers.length}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="qr" className="flex flex-col items-center gap-4.5">
                <CheckInPanel
                  code={code}
                  copied={copied}
                  onCopy={copyCode}
                  state={windowState}
                  closesAt={fmtClock(rosterEvent.end_at, rosterEvent.timezone)}
                />
              </TabsContent>

              <TabsContent value="roster" className="flex flex-col gap-3">
                <div className="flex gap-3">
                  <div className={ROSTER_STAT_CLASS}>
                    <div className="text-2xl leading-none font-extrabold text-brand-sky">
                      {plannedCount}
                    </div>
                    <div className="mt-1 text-xs font-semibold text-muted-foreground">
                      Planned (RSVP'd)
                    </div>
                  </div>
                  <div className={ROSTER_STAT_CLASS}>
                    <div className="text-2xl leading-none font-extrabold text-[#15a66e] dark:text-[#3fd68c]">
                      {attendedCount}
                    </div>
                    <div className="mt-1 text-xs font-semibold text-muted-foreground">Attended</div>
                  </div>
                </div>
                <div className="-mx-2 flex max-h-72 flex-col gap-2 overflow-y-auto p-2">
                  {rosterQuery.isPending && (
                    <p className="px-2 py-6 text-center text-sm text-muted-foreground">
                      Loading roster…
                    </p>
                  )}
                  {!rosterQuery.isPending && rosterMembers.length === 0 && (
                    <p className="px-2 py-6 text-center text-sm text-muted-foreground">
                      No attendees yet.
                    </p>
                  )}
                  {rosterMembers.map((member) => (
                    <RosterRow
                      key={member.id}
                      member={member}
                      disabled={isUndoing}
                      onUndo={handleRosterUndo}
                    />
                  ))}
                </div>
                <p className="text-[11.5px]/relaxed text-muted-foreground">
                  Undo clears a member's attended flag but keeps their RSVP — for correcting a
                  mistaken check-in.
                </p>
              </TabsContent>
            </Tabs>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}

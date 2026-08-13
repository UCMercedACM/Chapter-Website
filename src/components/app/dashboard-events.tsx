import {
  type LucideIcon,
  Calendar,
  Check,
  Clock,
  Info,
  LayoutGrid,
  List,
  MapPin,
  MinusCircle,
  MoreHorizontal,
  QrCode,
  RotateCcw,
  ScanLine,
  Search,
  Ticket,
  User,
  UserPlus,
  X,
} from "lucide-react";
import {
  type ChangeEvent,
  type ComponentProps,
  type MouseEvent,
  type ReactNode,
  useCallback,
} from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  type DashboardEvent,
  type EventType,
  type EventView,
  EVENT_TYPE_CLASSES,
  EVENT_TYPE_META,
  EVENT_TYPES,
  determineCheckIn,
  fmtClock,
  fmtDay,
  isPastEvent,
  monthDay,
} from "@/lib/dashboard-events";
import { cn } from "@/lib/utils";
import { type AttendanceMember, type FullEvents } from "@/types/kanae.gen";

/// Types & interfaces

type RosterStatus = "checked_in" | "expected" | "no_show" | "walk_in";

export interface EventCallbacks {
  onOpen?: (event: DashboardEvent) => void;
  onRsvp?: (event: DashboardEvent, planned: boolean) => void;
  onCheckin?: (event: DashboardEvent) => void;
}

interface StateMeta {
  label: string;
  icon: LucideIcon;
  className: string;
}

/// Constants

const STATUS_GREEN = "text-[#15a66e] bg-[#15a66e]/15 dark:text-[#3fd68c] dark:bg-[#3fd68c]/15";
const STATUS_RED = "text-[#e13737] bg-[#e13737]/12 dark:text-[#ff6b6b] dark:bg-[#ff6b6b]/15";
const STATUS_MUTED = "text-muted-foreground bg-muted";
const STATUS_TEAL = "text-[#067b6a] bg-brand-teal/15 dark:text-[#2fead0] dark:bg-brand-teal/15";

const STATE_ATTENDED: StateMeta = { label: "Attended", icon: Check, className: STATUS_GREEN };
const STATE_MISSED: StateMeta = { label: "Missed", icon: X, className: STATUS_RED };
const STATE_ENDED: StateMeta = { label: "Ended", icon: Clock, className: STATUS_MUTED };
const STATE_GOING: StateMeta = { label: "Going", icon: Check, className: STATUS_GREEN };
const STATE_OPEN: StateMeta = { label: "Open", icon: Ticket, className: STATUS_TEAL };

export const PILL_CLASS =
  "h-auto gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-bold [&>svg]:size-3.5!";

const ROW_ACTION_WIDTH = "w-20";

const TYPE_FILTER_OPTIONS: readonly { label: string; value: "all" | EventType }[] = [
  { value: "all", label: "All types" },
  ...EVENT_TYPES.map((key) => ({ value: key, label: EVENT_TYPE_META[key].label })),
];

const VIEW_META: Record<EventView, { icon: LucideIcon; label: string }> = {
  calendar: { icon: Calendar, label: "Calendar" },
  grid: { icon: LayoutGrid, label: "Gallery" },
  list: { icon: List, label: "List" },
};

const LONG_DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  weekday: "long",
  month: "long",
  day: "numeric",
};

const ROSTER_STATUS = {
  checked_in: {
    label: "Checked in",
    icon: Check,
    className: "bg-[#15a66e]/15 text-[#15a66e] dark:text-[#3fd68c]",
  },
  walk_in: {
    label: "Walk-in",
    icon: UserPlus,
    className: "bg-[#f7b731]/18 text-[#a06d00] dark:text-[#ffd56b]",
  },
  expected: {
    label: "Expected",
    icon: Clock,
    className: "bg-brand-sky/15 text-brand-sky-text",
  },
  no_show: {
    label: "No-show",
    icon: MinusCircle,
    className: "bg-muted text-muted-foreground",
  },
} satisfies Record<RosterStatus, { className: string; icon: LucideIcon; label: string }>;

/// Helpers

function eventStateMeta(event: DashboardEvent, now: Date): StateMeta {
  if (event.attended) return STATE_ATTENDED;
  if (isPastEvent(event, now)) return event.planned ? STATE_MISSED : STATE_ENDED;
  return event.planned ? STATE_GOING : STATE_OPEN;
}

function getRosterStatus(member: AttendanceMember): RosterStatus {
  if (member.attended) return member.planned ? "checked_in" : "walk_in";
  return member.planned ? "expected" : "no_show";
}

/// EventTypeChip

interface EventTypeChipProps {
  type: EventType;
}

function EventTypeChip({ type }: Readonly<EventTypeChipProps>) {
  return (
    <Badge className={cn(PILL_CLASS, EVENT_TYPE_CLASSES[type].chip)}>
      <span className={cn("size-1.5 rounded-full", EVENT_TYPE_CLASSES[type].dot)} />
      {EVENT_TYPE_META[type].label}
    </Badge>
  );
}

/// TagPill

interface TagPillProps {
  children: ReactNode;
}

function TagPill({ children }: Readonly<TagPillProps>) {
  return (
    <span className="rounded-md border border-border bg-muted px-2.5 py-0.75 text-[11.5px] font-semibold whitespace-nowrap text-brand-text-sub">
      {children}
    </span>
  );
}

/// StatusBadge

interface StatusBadgeProps {
  event: DashboardEvent;
  now: Date;
}

function StatusBadge({ event, now }: Readonly<StatusBadgeProps>) {
  const meta = eventStateMeta(event, now);
  const Icon = meta.icon;
  return (
    <Badge className={cn(PILL_CLASS, meta.className)}>
      <Icon strokeWidth={2.4} />
      {meta.label}
    </Badge>
  );
}

/// EmptyState

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  sub: string;
  className?: string;
}

export function EmptyState({ icon: Icon, title, sub, className }: Readonly<EmptyStateProps>) {
  return (
    <div className={cn("px-5 py-8 text-center", className)}>
      <div className="mx-auto mb-3.5 inline-flex rounded-2xl bg-muted p-3.5 text-muted-foreground">
        <Icon className="size-6" />
      </div>
      <div className="text-[15px] font-bold text-brand-text-sub">{title}</div>
      <div className="mt-1 text-[13px] text-muted-foreground">{sub}</div>
    </div>
  );
}

/// EventMeta

interface EventMetaProps {
  icon: LucideIcon;
  children: ReactNode;
}

function EventMeta({ icon: Icon, children }: Readonly<EventMetaProps>) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
      <Icon className="size-3.5 shrink-0" />
      {children}
    </span>
  );
}

/// DateBlock

function DateBlock({ event }: Readonly<{ event: FullEvents }>) {
  const { mon, day } = monthDay(event.start_at, event.timezone);
  return (
    <div className="flex h-14 w-13 shrink-0 flex-col overflow-hidden rounded-xl border border-border bg-card text-center">
      <div
        className={cn(
          "py-0.75 text-[10px] font-extrabold tracking-[0.08em] text-white",
          EVENT_TYPE_CLASSES[event.type].bar,
        )}
      >
        {mon}
      </div>
      <div className="flex flex-1 items-center justify-center text-[21px] font-extrabold text-foreground">
        {day}
      </div>
    </div>
  );
}

/// EventThumbnail

interface EventThumbnailProps {
  event: FullEvents;
  className?: string;
}

// At some point the svg will be replaced with the proper image stuff
function EventThumbnail({ event, className }: Readonly<EventThumbnailProps>) {
  const meta = EVENT_TYPE_META[event.type];
  const gradId = `evg-${event.id}`;
  const dotId = `evd-${event.id}`;
  return event.thumbnail ? (
    <div className={cn("overflow-hidden bg-muted", className ?? "h-34.5")}>
      <img src={event.thumbnail.url} alt="" loading="lazy" className="size-full object-cover" />
    </div>
  ) : (
    <div className={cn("relative overflow-hidden bg-muted", className ?? "h-34.5")}>
      <svg
        className="absolute inset-0 block size-full"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={meta.color} stopOpacity="0.22" />
            <stop offset="100%" stopColor={meta.color} stopOpacity="0.06" />
          </linearGradient>
          <pattern id={dotId} width="22" height="22" patternUnits="userSpaceOnUse">
            <circle cx="11" cy="11" r="1.1" fill={meta.color} opacity="0.28" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${gradId})`} />
        <rect width="100%" height="100%" fill={`url(#${dotId})`} />
        <circle cx="95%" cy="-5" r="88" fill={meta.color} opacity="0.07" />
        <circle cx="95%" cy="-5" r="55" fill={meta.color} opacity="0.09" />
        <text
          x="50%"
          y="72%"
          textAnchor="middle"
          fill={meta.color}
          opacity="0.11"
          fontWeight="900"
          fontSize="52"
          letterSpacing="2"
        >
          {meta.label.toUpperCase()}
        </text>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className={cn(
            "inline-block rounded-full border px-4 py-1.25 text-[11.5px] font-extrabold tracking-[0.12em] uppercase",
            EVENT_TYPE_CLASSES[event.type].label,
          )}
        >
          {meta.label}
        </span>
      </div>
    </div>
  );
}

/// EventActions

interface EventActionsProps extends EventCallbacks {
  event: DashboardEvent;
  now: Date;
  size?: NonNullable<ComponentProps<typeof Button>["size"]>;
}

function EventActions({ event, now, onRsvp, onCheckin, size = "sm" }: Readonly<EventActionsProps>) {
  const state = determineCheckIn(event, now);
  const past = isPastEvent(event, now);

  const handleCheckin = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      onCheckin?.(event);
    },
    [onCheckin, event],
  );
  const handleRsvp = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      onRsvp?.(event, true);
    },
    [onRsvp, event],
  );

  const showCheckin = state === "open" && !event.attended;
  const showRsvp = !past && !event.attended && !event.planned;

  return showCheckin || showRsvp ? (
    <div className="relative z-2 flex items-center gap-1.5">
      {showCheckin && (
        <Button
          size={size}
          onClick={handleCheckin}
          className="rounded-full bg-brand-teal font-bold text-primary hover:bg-brand-teal/85"
        >
          <ScanLine />
          Check in
        </Button>
      )}
      {showRsvp && (
        <Button
          size={size}
          variant={state === "open" ? "outline" : "default"}
          onClick={handleRsvp}
          className={cn(
            ROW_ACTION_WIDTH,
            "rounded-full font-bold",
            state !== "open" && "bg-brand-teal text-primary hover:bg-brand-teal/85",
          )}
        >
          <Ticket />
          RSVP
        </Button>
      )}
    </div>
  ) : undefined;
}

/// CancelRsvpButton

interface CancelRsvpButtonProps {
  event: DashboardEvent;
  now: Date;
  onRsvp?: (event: DashboardEvent, planned: boolean) => void;
}

// Corner cancel control for the grid card thumbnail. Rows use GoingCancelPill.
function CancelRsvpButton({ event, now, onRsvp }: Readonly<CancelRsvpButtonProps>) {
  const handleCancel = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      onRsvp?.(event, false);
    },
    [onRsvp, event],
  );

  return isPastEvent(event, now) || event.attended || !event.planned ? undefined : (
    <button
      type="button"
      title="Cancel RSVP"
      aria-label="Cancel RSVP"
      onClick={handleCancel}
      className="absolute top-2.5 right-2.5 z-3 flex size-7 shrink-0 items-center justify-center rounded-full bg-black/55 text-white opacity-0 shadow-[0_2px_8px_rgba(0,0,0,0.28)] backdrop-blur-sm transition group-hover:opacity-100 hover:bg-[#e13737] hover:text-white"
    >
      <X className="size-3.5" strokeWidth={2.4} />
    </button>
  );
}

/// GoingCancelPill

function GoingCancelPill({
  event,
  onRsvp,
}: Readonly<{
  event: DashboardEvent;
  onRsvp?: (event: DashboardEvent, planned: boolean) => void;
}>) {
  const handleCancel = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      onRsvp?.(event, false);
    },
    [onRsvp, event],
  );

  return (
    <button
      type="button"
      title="Cancel RSVP"
      aria-label="Cancel RSVP"
      onClick={handleCancel}
      className={cn(
        PILL_CLASS,
        STATUS_GREEN,
        ROW_ACTION_WIDTH,
        "group/going relative z-2 inline-flex items-center justify-center whitespace-nowrap transition-colors hover:bg-[#e13737]/12 hover:text-[#e13737] dark:hover:text-[#ff6b6b]",
      )}
    >
      <Check strokeWidth={2.4} className="group-hover/going:hidden" />
      <X strokeWidth={2.4} className="hidden group-hover/going:inline" />
      <span className="group-hover/going:hidden">Going</span>
      <span className="hidden group-hover/going:inline">Cancel</span>
    </button>
  );
}

/// Clickable

interface ClickableProps {
  event: DashboardEvent;
  onOpen?: (event: DashboardEvent) => void;
  className: string;
  children: ReactNode;
}

function Clickable({ event, onOpen, className, children }: Readonly<ClickableProps>) {
  const handleOpen = useCallback(() => {
    onOpen?.(event);
  }, [onOpen, event]);

  return (
    <div
      className={cn(
        className,
        "has-focus-visible:ring-2 has-focus-visible:ring-brand-sky has-focus-visible:ring-offset-2 has-focus-visible:ring-offset-background",
      )}
    >
      <button
        type="button"
        aria-label={event.name}
        onClick={handleOpen}
        className="absolute inset-0 z-1 cursor-pointer rounded-[inherit] outline-none"
      />
      {children}
    </div>
  );
}

/// EventCard & EventRow

interface EventItemProps extends EventCallbacks {
  event: DashboardEvent;
  now: Date;
}

export function EventCard({ event, now, onOpen, onRsvp, onCheckin }: Readonly<EventItemProps>) {
  return (
    <Clickable
      event={event}
      onOpen={onOpen}
      className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-[20px] border border-border bg-card shadow-[0px_4px_14px_rgba(112,144,176,0.14)] transition hover:-translate-y-0.5 hover:shadow-[0px_16px_40px_rgba(112,144,176,0.2)] dark:shadow-[0px_4px_14px_rgba(0,0,0,0.4)]"
    >
      <div className="relative shrink-0">
        <EventThumbnail event={event} />
        <div className="absolute bottom-2.5 left-3.5">
          <DateBlock event={event} />
        </div>
      </div>
      <CancelRsvpButton event={event} now={now} onRsvp={onRsvp} />
      <div className="flex flex-1 flex-col gap-2.5 px-4.5 py-4">
        <div>
          <div className="mb-2 flex flex-wrap gap-1.5">
            <EventTypeChip type={event.type} />
            {event.tags?.slice(0, 2).map((tag) => (
              <TagPill key={tag}>{tag}</TagPill>
            ))}
          </div>
          <h3 className="text-base/tight font-extrabold text-foreground">{event.name}</h3>
        </div>
        <p className="line-clamp-2 text-[13px]/snug text-brand-text-sub">{event.description}</p>
        <div className="mt-auto flex flex-wrap gap-3.5 pt-0.5">
          <EventMeta icon={Clock}>
            {fmtClock(event.start_at, event.timezone)}–{fmtClock(event.end_at, event.timezone)}
          </EventMeta>
          <EventMeta icon={MapPin}>{event.location}</EventMeta>
        </div>
        <div className="flex items-center justify-between gap-2 border-t border-border pt-3">
          <StatusBadge event={event} now={now} />
          <EventActions event={event} now={now} onRsvp={onRsvp} onCheckin={onCheckin} />
        </div>
      </div>
    </Clickable>
  );
}

function EventRow({ event, now, onOpen, onRsvp, onCheckin }: Readonly<EventItemProps>) {
  const past = isPastEvent(event, now);
  const showStatus = past || event.attended;
  const showGoing =
    !past && !event.attended && event.planned && determineCheckIn(event, now) !== "open";

  return (
    <Clickable
      event={event}
      onOpen={onOpen}
      className="group relative flex cursor-pointer items-center gap-3.5 rounded-xl px-3.5 py-3 transition hover:bg-muted"
    >
      <DateBlock event={event} />
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2">
          <span
            className={cn("size-1.75 shrink-0 rounded-full", EVENT_TYPE_CLASSES[event.type].dot)}
          />
          <h4 className="truncate text-sm font-bold text-foreground">{event.name}</h4>
        </div>
        <div className="flex flex-wrap gap-3.5">
          <EventMeta icon={Calendar}>{fmtDay(event.start_at, event.timezone)}</EventMeta>
          <EventMeta icon={Clock}>{fmtClock(event.start_at, event.timezone)}</EventMeta>
          <EventMeta icon={MapPin}>{event.location}</EventMeta>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        <EventActions event={event} now={now} onRsvp={onRsvp} onCheckin={onCheckin} />
        {showStatus && <StatusBadge event={event} now={now} />}
        {showGoing && <GoingCancelPill event={event} onRsvp={onRsvp} />}
      </div>
    </Clickable>
  );
}

/// StatTile

interface StatTileProps {
  icon: LucideIcon;
  value: number | string;
  label: string;
  accentClassName?: string;
}

export function StatTile({ icon: Icon, value, label, accentClassName }: Readonly<StatTileProps>) {
  return (
    <div className="rounded-[20px] border border-border bg-card p-4.5 shadow-[0px_4px_14px_rgba(112,144,176,0.14)] dark:shadow-[0px_4px_14px_rgba(0,0,0,0.4)]">
      <div
        className={cn(
          "mb-3 flex size-9.5 items-center justify-center rounded-xl bg-brand-teal/12 text-brand-teal",
          accentClassName,
        )}
      >
        <Icon className="size-5" strokeWidth={2} />
      </div>
      <div className="text-[30px] leading-none font-extrabold tracking-tight text-foreground">
        {value}
      </div>
      <div className="mt-1.5 text-[12.5px] font-semibold text-muted-foreground">{label}</div>
    </div>
  );
}

/// EventToolbar

interface EventToolbarProps {
  query: string;
  onQueryChange: (value: string) => void;
  type: "all" | EventType;
  onTypeChange: (value: "all" | EventType) => void;
  view: EventView;
  onViewChange: (value: EventView) => void;
  views: EventView[];
  searchPlaceholder?: string;
}

export function EventToolbar({
  query,
  onQueryChange,
  type,
  onTypeChange,
  view,
  onViewChange,
  views,
  searchPlaceholder = "Search events by name, location, or tag…",
}: Readonly<EventToolbarProps>) {
  const handleQueryChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onQueryChange(e.target.value);
    },
    [onQueryChange],
  );
  const handleTypeChange = useCallback(
    (value: "all" | EventType | null) => {
      if (value) onTypeChange(value);
    },
    [onTypeChange],
  );

  return (
    <div className="rounded-[20px] border border-border bg-card p-4 shadow-[0px_4px_14px_rgba(112,144,176,0.14)] dark:shadow-[0px_4px_14px_rgba(0,0,0,0.4)]">
      <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center">
        <div className="relative w-full min-w-0 lg:min-w-55 lg:flex-1">
          <Search className="absolute top-1/2 left-3 size-4.25 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={handleQueryChange}
            placeholder={searchPlaceholder}
            className="h-10 rounded-xl border border-border bg-muted pl-9.5"
          />
        </div>
        <div className="flex items-center gap-3 lg:contents">
          <Select value={type} onValueChange={handleTypeChange}>
            <SelectTrigger
              aria-label="Filter events by type"
              className="h-10 min-w-0 flex-1 rounded-xl border border-border bg-muted font-bold lg:flex-none"
            >
              <SelectValue>
                {(value: unknown) =>
                  TYPE_FILTER_OPTIONS.find((option) => option.value === value)?.label ?? ""
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent align="end" alignItemWithTrigger={false}>
              {TYPE_FILTER_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Tabs value={view} onValueChange={onViewChange}>
            <TabsList className="h-10 shrink-0 rounded-xl">
              {views.map((key) => {
                const ViewIcon = VIEW_META[key].icon;
                return (
                  <TabsTrigger
                    key={key}
                    value={key}
                    aria-label={VIEW_META[key].label}
                    className="gap-1.5 font-bold"
                  >
                    <ViewIcon className="size-4" />
                    <span className="hidden sm:inline">{VIEW_META[key].label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

/// EventResults

interface EventResultsProps {
  events: DashboardEvent[];
  view: EventView;
  now: Date;
  onOpen: (event: DashboardEvent) => void;
  onRsvp: (event: DashboardEvent, planned: boolean) => void;
  onCheckin: (event: DashboardEvent) => void;
  emptyTitle?: string;
  emptySub?: string;
}

export function EventResults({
  events,
  view,
  now,
  onOpen,
  onRsvp,
  onCheckin,
  emptyTitle = "No upcoming events match",
  emptySub = "Try a different type or clear the search.",
}: Readonly<EventResultsProps>) {
  if (events.length === 0) {
    return (
      <EmptyState
        icon={Search}
        title={emptyTitle}
        sub={emptySub}
        className="rounded-[20px] border border-border bg-card py-12 shadow-[0px_4px_14px_rgba(112,144,176,0.14)] dark:shadow-[0px_4px_14px_rgba(0,0,0,0.4)]"
      />
    );
  }

  if (view === "grid") {
    return (
      <div className="grid gap-4.5 sm:grid-cols-2 xl:grid-cols-3">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            now={now}
            onOpen={onOpen}
            onRsvp={onRsvp}
            onCheckin={onCheckin}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-[20px] border border-border bg-card p-2 shadow-[0px_4px_14px_rgba(112,144,176,0.14)] dark:shadow-[0px_4px_14px_rgba(0,0,0,0.4)]">
      <div className="flex flex-col gap-0.5">
        {events.map((event) => (
          <EventRow
            key={event.id}
            event={event}
            now={now}
            onOpen={onOpen}
            onRsvp={onRsvp}
            onCheckin={onCheckin}
          />
        ))}
      </div>
    </div>
  );
}

/// DetailTile

interface DetailTileProps {
  icon: LucideIcon;
  label: string;
  children: ReactNode;
}

function DetailTile({ icon: Icon, label, children }: Readonly<DetailTileProps>) {
  return (
    <div className="flex items-start gap-2.75 rounded-xl border border-border bg-card p-3.5 shadow-[0px_2px_5px_rgba(112,144,176,0.12)] dark:shadow-[0px_2px_5px_rgba(0,0,0,0.3)]">
      <Icon className="size-4.5 shrink-0 text-[#067b6a] dark:text-[#2fead0]" />
      <div className="min-w-0">
        <div className="text-[11px] font-semibold tracking-[0.06em] text-muted-foreground uppercase">
          {label}
        </div>
        <div className="mt-0.5 text-sm font-bold text-foreground">{children}</div>
      </div>
    </div>
  );
}

/// EventDetailDialog

interface EventDetailDialogProps {
  event: DashboardEvent;
  now: Date;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  canManage: boolean;
  organizerName?: string;
  onRsvp: (event: DashboardEvent, planned: boolean) => void;
  onCheckin: (event: DashboardEvent) => void;
  onManageAttendance?: (event: DashboardEvent) => void;
}

export function EventDetailDialog({
  event,
  now,
  open,
  onOpenChange,
  canManage,
  organizerName,
  onRsvp,
  onCheckin,
  onManageAttendance,
}: Readonly<EventDetailDialogProps>) {
  const handleManage = useCallback(() => {
    onManageAttendance?.(event);
  }, [onManageAttendance, event]);
  const handleCheckin = useCallback(() => {
    onCheckin(event);
  }, [onCheckin, event]);
  const handleRsvpYes = useCallback(() => {
    onRsvp(event, true);
    onOpenChange(false);
  }, [onRsvp, event, onOpenChange]);
  const handleRsvpNo = useCallback(() => {
    onRsvp(event, false);
    onOpenChange(false);
  }, [onRsvp, event, onOpenChange]);

  const meta = EVENT_TYPE_META[event.type];
  const state = determineCheckIn(event, now);
  const past = isPastEvent(event, now);
  const organizer = event.creator_id ? (organizerName ?? "…") : "Unknown organizer";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88svh] gap-4 overflow-y-auto sm:max-w-145">
        <DialogHeader>
          <DialogTitle className="text-lg font-extrabold">{event.name}</DialogTitle>
          <DialogDescription>
            {meta.label} · organized by {organizer}
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-hidden rounded-xl">
          <EventThumbnail event={event} className="h-40" />
        </div>

        <div className="flex flex-wrap gap-2">
          <StatusBadge event={event} now={now} />
          <EventTypeChip type={event.type} />
          {event.tags?.map((tag) => (
            <TagPill key={tag}>{tag}</TagPill>
          ))}
        </div>

        <div className="grid gap-2.5 sm:grid-cols-2">
          <DetailTile icon={Calendar} label="Date">
            {fmtDay(event.start_at, event.timezone, LONG_DATE_OPTIONS)}
          </DetailTile>
          <DetailTile icon={Clock} label="Time">
            {fmtClock(event.start_at, event.timezone)} - {fmtClock(event.end_at, event.timezone)}
          </DetailTile>
          <DetailTile icon={MapPin} label="Location">
            {event.location}
          </DetailTile>
          <DetailTile icon={User} label="Organizer">
            {organizer}
          </DetailTile>
        </div>

        {!event.creator_id && (
          <div className="flex items-center gap-2.25 rounded-xl border border-[#e0a100]/30 bg-[#f7b731]/15 px-3.5 py-2.75">
            <Info className="size-4 shrink-0 text-[#e0a100] dark:text-[#f7c948]" />
            <span className="text-[12.5px] font-semibold text-brand-text-sub">
              This event's creator was removed — organizer is unknown.
            </span>
          </div>
        )}

        <Separator />

        <p className="text-sm/relaxed text-brand-text-sub">{event.description}</p>

        <DialogFooter className="mt-4 sm:justify-between">
          {!past && !event.attended && event.planned ? (
            <Button
              variant="ghost"
              onClick={handleRsvpNo}
              className="text-[#e13737] hover:bg-[#e13737]/10 hover:text-[#e13737] dark:text-[#ff6b6b] dark:hover:bg-[#ff6b6b]/10 dark:hover:text-[#ff6b6b]"
            >
              <X />
              Cancel RSVP
            </Button>
          ) : (
            <span />
          )}
          <div className="flex flex-col-reverse gap-2 sm:flex-row">
            {canManage && (
              <Button variant="outline" onClick={handleManage}>
                <QrCode />
                Manage attendance
              </Button>
            )}
            {state === "open" && !event.attended && (
              <Button
                onClick={handleCheckin}
                className="bg-brand-teal font-bold text-primary hover:bg-brand-teal/85"
              >
                <ScanLine />
                Check in
              </Button>
            )}
            {!past && !event.attended && !event.planned && (
              <Button
                onClick={handleRsvpYes}
                variant={state === "open" ? "outline" : "default"}
                className={cn(
                  "font-bold",
                  state !== "open" && "bg-brand-teal text-primary hover:bg-brand-teal/85",
                )}
              >
                <Ticket />
                RSVP
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/// RosterRow

export function RosterRow({
  disabled,
  member,
  onUndo,
}: Readonly<{
  disabled: boolean;
  member: AttendanceMember;
  onUndo: (memberId: string) => void;
}>) {
  const handleUndo = useCallback(() => {
    onUndo(member.id);
  }, [member.id, onUndo]);

  const status = ROSTER_STATUS[getRosterStatus(member)];
  const initials =
    member.name
      .match(/\S+/g)
      ?.slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() ?? "··";

  const StatusIcon = status.icon;

  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-3.5 py-2.5 shadow-[0px_2px_5px_rgba(112,144,176,0.12)] dark:shadow-[0px_2px_5px_rgba(0,0,0,0.3)]">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-sky/15 text-[12px] font-extrabold text-brand-sky-text">
        {initials}
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-bold text-foreground">{member.name}</div>
      </div>
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-bold",
          status.className,
        )}
      >
        <StatusIcon className="size-3.5" />
        {status.label}
      </span>
      {member.attended && (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="ghost" size="icon-sm" />}
            title="Member actions"
            aria-label="Member actions"
          >
            <MoreHorizontal />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-auto">
            <DropdownMenuItem disabled={disabled} onClick={handleUndo}>
              <RotateCcw />
              Undo check-in
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}

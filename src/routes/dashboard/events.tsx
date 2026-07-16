import "temporal-polyfill/full/global";
import "@schedule-x/theme-shadcn/dist/index.css";
import {
  attendedEventsQueryOptions,
  eventsListQueryOptions,
  meQueryOptions,
  plannedEventsQueryOptions,
} from "./index";

import {
  type CalendarEvent,
  type CalendarType,
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from "@schedule-x/calendar";
import { createCalendarControlsPlugin } from "@schedule-x/calendar-controls";
import { ScheduleXCalendar, useCalendarApp } from "@schedule-x/react";
import { createScrollControllerPlugin } from "@schedule-x/scroll-controller";
import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import axios from "axios";
import {
  type LucideIcon,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  MinusCircle,
  MoreHorizontal,
  RotateCcw,
  ScanLine,
  UserPlus,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

import { CheckInDialog } from "@/components/app/check-in-dialog";
import { CheckInPanel } from "@/components/app/check-in-panel";
import { EventDetailDialog, EventResults, EventToolbar } from "@/components/app/dashboard-events";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "@/components/ui/theme-provider";
import {
  type AttendanceMember,
  type DashboardEvent,
  type KanaePage,
  type EventType,
  type EventView,
  type FullEvent,
  EVENT_TYPE_CLASSES,
  EVENT_TYPE_META,
  EVENT_TYPES,
  determineCheckIn,
  filterEvents,
  fmtClock,
  isPastEvent,
  mergeDashboardEvent,
} from "@/lib/dashboard-events";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/events")({
  component: DashboardEvents,
  staticData: { area: "Member", title: "Events", sub: "Browse, RSVP, and check in" },
  loader: async ({ context: { queryClient } }) => {
    await queryClient.prefetchQuery(eventsListQueryOptions);
    await queryClient.prefetchQuery(meQueryOptions);
    await queryClient.prefetchQuery(plannedEventsQueryOptions);
    await queryClient.prefetchQuery(attendedEventsQueryOptions);
  },
});

/// Types and Interfaces

type RosterStatus = "checked_in" | "expected" | "no_show" | "walk_in";

// Constants

const EVENT_CALENDARS: Record<string, CalendarType> = Object.fromEntries(
  EVENT_TYPES.map((key) => {
    const meta = EVENT_TYPE_META[key];
    return [
      key,
      {
        colorName: key,
        lightColors: { main: meta.color, container: `${meta.color}40`, onContainer: meta.color },
        darkColors: {
          main: meta.darkColor,
          container: `${meta.darkColor}40`,
          onContainer: meta.darkColor,
        },
      },
    ];
  }),
);

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
    className: "bg-brand-sky/15 text-brand-sky",
  },
  no_show: {
    label: "No-show",
    icon: MinusCircle,
    className: "bg-muted text-muted-foreground",
  },
} satisfies Record<RosterStatus, { className: string; icon: LucideIcon; label: string }>;

const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:8000";
const PACIFIC_TZ = "America/Los_Angeles";
const EVENTS_VIEWS: EventView[] = ["calendar", "grid", "list"];

const SHARED_QUERY_OPTIONS = {
  staleTime: 60_000,
  retry: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  refetchOnMount: false,
} as const;

/// Tanstack Query options

const memberQueryOptions = (memberId: string) =>
  queryOptions({
    queryKey: ["members", memberId],
    queryFn: async () => {
      const { data } = await axios.get<{ id: string; name: string }>(
        `${API_BASE_URL}/members/${memberId}`,
      );
      return data;
    },
    ...SHARED_QUERY_OPTIONS,
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
    ...SHARED_QUERY_OPTIONS,
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
    ...SHARED_QUERY_OPTIONS,
  });

/// Route components

function EventsCalendar({
  events,
  onOpen,
}: Readonly<{ events: DashboardEvent[]; onOpen: (event: DashboardEvent) => void }>) {
  const [initialScroll] = useState(() => `${String(new Date().getHours()).padStart(2, "0")}:00`);
  const scrollController = useMemo(
    () => createScrollControllerPlugin({ initialScroll }),
    [initialScroll],
  );
  const calendarControls = useMemo(() => createCalendarControlsPlugin(), []);

  const handlePrevMonth = useCallback(() => {
    calendarControls.setDate(calendarControls.getDate().subtract({ months: 1 }));
  }, [calendarControls]);
  const handleNextMonth = useCallback(() => {
    calendarControls.setDate(calendarControls.getDate().add({ months: 1 }));
  }, [calendarControls]);

  const filteredEvents = useMemo(() => new Map(events.map((event) => [event.id, event])), [events]);
  const calendarEvents = useMemo<CalendarEvent[]>(
    () =>
      events.map((event) => ({
        id: event.id,
        title: event.name,
        description: event.description,
        location: event.location,
        calendarId: event.type,
        start: Temporal.Instant.from(event.start_at).toZonedDateTimeISO(event.timezone),
        end: Temporal.Instant.from(event.end_at).toZonedDateTimeISO(event.timezone),
      })),
    [events],
  );

  const { theme } = useTheme();
  const [prefersDark] = useState(
    () => globalThis.matchMedia("(prefers-color-scheme: dark)").matches,
  );
  const systemTheme: "dark" | "light" = prefersDark ? "dark" : "light";
  const resolvedTheme: "dark" | "light" = theme === "system" ? systemTheme : theme;

  const calendar = useCalendarApp({
    views: [createViewMonthGrid(), createViewWeek(), createViewDay(), createViewMonthAgenda()],
    defaultView: "month-grid",
    weekOptions: { gridHeight: 1200 },
    dayBoundaries: { start: "08:00", end: "24:00" },
    events: calendarEvents,
    calendars: EVENT_CALENDARS,
    theme: "shadcn",
    isDark: resolvedTheme === "dark",
    timezone: PACIFIC_TZ,
    selectedDate: Temporal.Now.plainDateISO(PACIFIC_TZ),
    plugins: [scrollController, calendarControls],
    callbacks: {
      onEventClick: (calendarEvent) => {
        const found = filteredEvents.get(String(calendarEvent.id));
        if (found) onOpen(found);
      },
    },
  });

  calendar?.setTheme(resolvedTheme);

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center gap-2.5 lg:hidden">
        <Button variant="outline" size="sm" onClick={handlePrevMonth} className="flex-1">
          <ChevronLeft />
          Previous month
        </Button>
        <Button variant="outline" size="sm" onClick={handleNextMonth} className="flex-1">
          Next month
          <ChevronRight />
        </Button>
      </div>
      <div
        className={cn(
          "isolate h-160 rounded-[20px] border border-border bg-card p-2",
          "shadow-[0px_4px_14px_rgba(112,144,176,0.14)] dark:shadow-[0px_4px_14px_rgba(0,0,0,0.4)]",
          "[&_.sx-react-calendar-wrapper]:size-full",
          "**:[[class*='-event']]:select-none",
        )}
      >
        <ScheduleXCalendar calendarApp={calendar} />
      </div>
    </div>
  );
}

function getRosterStatus(member: AttendanceMember): RosterStatus {
  if (member.attended) return member.planned ? "checked_in" : "walk_in";
  return member.planned ? "expected" : "no_show";
}

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
      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-sky/15 text-[12px] font-extrabold text-brand-sky">
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

function DashboardEvents() {
  const queryClient = useQueryClient();

  const [now] = useState(() => new Date());
  const [query, setQuery] = useState("");
  const [type, setType] = useState<"all" | EventType>("all");
  const [view, setView] = useState<EventView>("calendar");
  const [detail, setDetail] = useState<DashboardEvent>();
  const [checkin, setCheckin] = useState<DashboardEvent>();
  const [roster, setRoster] = useState<DashboardEvent>();
  const [rosterTab, setRosterTab] = useState<"qr" | "roster">("qr");
  const [copied, setCopied] = useState(false);

  const { data: events } = useQuery(eventsListQueryOptions);
  const { data: me } = useQuery(meQueryOptions);
  const { data: plannedEvents } = useQuery(plannedEventsQueryOptions);
  const { data: attendedEvents } = useQuery(attendedEventsQueryOptions);
  const creatorQuery = useQuery({
    ...memberQueryOptions(detail?.creator_id ?? ""),
    enabled: !!detail?.creator_id,
  });
  const codeQuery = useQuery({
    ...eventAttendanceCodeQueryOptions(roster?.id ?? ""),
    enabled: !!roster && rosterTab === "qr",
  });
  const rosterQuery = useQuery({
    ...eventAttendanceQueryOptions(roster?.id ?? ""),
    enabled: !!roster && rosterTab === "roster",
  });

  const { mutate: joinMutate } = useMutation({
    mutationFn: async (eventId: string) => {
      await axios.post<{ message: string }>(`${API_BASE_URL}/events/${eventId}/join`);
    },
    onSuccess: () => {
      toast.success("You're on the list! We'll see you there.");
      return queryClient.invalidateQueries({ queryKey: plannedEventsQueryOptions.queryKey });
    },
    onError: () => toast.error("Couldn't RSVP. Please try again."),
  });
  const { mutate: removeMutate, isPending: isRemoving } = useMutation({
    mutationFn: async (memberId: string) => {
      await axios.delete(`${API_BASE_URL}/events/${roster?.id ?? ""}/attendance/${memberId}`);
    },
    onSuccess: () => {
      toast.success("Check-in undone.");
      return queryClient.invalidateQueries({
        queryKey: eventAttendanceQueryOptions(roster?.id ?? "").queryKey,
      });
    },
  });

  const handleRsvp = useCallback(
    (event: DashboardEvent, planned: boolean) => {
      if (planned) {
        joinMutate(event.id);
        return;
      }
      queryClient.setQueryData<FullEvent[]>(plannedEventsQueryOptions.queryKey, (old) =>
        (old ?? []).filter((item) => item.id !== event.id),
      );
      toast.success("RSVP cancelled.");
    },
    [joinMutate, queryClient],
  );
  const invalidateAttended = useCallback(
    () => queryClient.invalidateQueries({ queryKey: attendedEventsQueryOptions.queryKey }),
    [queryClient],
  );

  const openCheckinFromDetail = useCallback((event: DashboardEvent) => {
    setDetail(undefined);
    setCheckin(event);
  }, []);
  const openRosterFromDetail = useCallback((event: DashboardEvent) => {
    setDetail(undefined);
    setRosterTab("qr");
    setCopied(false);
    setRoster(event);
  }, []);
  const closeDetail = useCallback((open: boolean) => {
    if (!open) setDetail(undefined);
  }, []);
  const closeCheckin = useCallback((open: boolean) => {
    if (!open) setCheckin(undefined);
  }, []);
  const closeRoster = useCallback((open: boolean) => {
    if (!open) setRoster(undefined);
  }, []);

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

  const dashboardEvents = useMemo<DashboardEvent[]>(
    () =>
      (events ?? []).map((event) =>
        mergeDashboardEvent(
          event,
          plannedEvents?.has(event.id) ?? false,
          attendedEvents?.has(event.id) ?? false,
        ),
      ),
    [events, plannedEvents, attendedEvents],
  );
  const upcoming = useMemo(
    () => filterEvents(dashboardEvents, type, query).filter((event) => !isPastEvent(event, now)),
    [dashboardEvents, type, query, now],
  );
  const checkInOpen = useMemo(
    () =>
      dashboardEvents
        .filter((event) => determineCheckIn(event, now) === "open" && !event.attended)
        .toSorted((a, b) => a.start_at.localeCompare(b.start_at)),
    [dashboardEvents, now],
  );

  const nextCheckIn = checkInOpen.at(0);
  const handleStripCheckin = useCallback(() => {
    if (nextCheckIn) setCheckin(nextCheckIn);
  }, [nextCheckIn]);
  const handleStripMore = useCallback(() => {
    const second = checkInOpen.at(1);
    if (second) setDetail(second);
  }, [checkInOpen]);

  const organizerName = detail?.creator_id ? creatorQuery.data?.name : undefined;
  const canManageDetail =
    !!detail &&
    !!me &&
    (me.roles.includes("admin") || me.roles.includes("leads") || detail.creator_id === me.id);

  const rosterMembers = rosterQuery.data?.data ?? [];
  const plannedCount = rosterMembers.filter((member) => member.planned).length;
  const attendedCount = rosterMembers.filter((member) => member.attended).length;
  const checkIn = roster ? determineCheckIn(roster, now) : "ended";

  return (
    <div className="flex flex-col gap-5">
      {nextCheckIn && (
        <div className="relative overflow-hidden rounded-2xl border border-brand-teal/45 bg-card shadow-[0px_4px_14px_rgba(112,144,176,0.14)] dark:shadow-[0px_4px_14px_rgba(0,0,0,0.4)]">
          <span className="absolute inset-y-0 left-0 w-1.25 bg-brand-teal" />
          <div className="flex flex-wrap items-center gap-4.5 py-4 pr-5 pl-6">
            <div className="inline-flex shrink-0 items-center gap-2.25">
              <span className="relative flex size-2.75">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-teal opacity-60" />
                <span className="relative inline-flex size-2.75 rounded-full bg-brand-teal" />
              </span>
              <span className="text-[11.5px] font-extrabold tracking-[0.12em] text-[#078c79] uppercase dark:text-[#2fead0]">
                Check-in open
              </span>
            </div>
            <div className="min-w-50 flex-1">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "size-1.75 shrink-0 rounded-full",
                    EVENT_TYPE_CLASSES[nextCheckIn.type].dot,
                  )}
                />
                <h3 className="text-[17px] font-extrabold text-foreground">{nextCheckIn.name}</h3>
              </div>
              <div className="mt-1.25 flex flex-wrap gap-4">
                <span className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-muted-foreground">
                  <MapPin className="size-3.5" />
                  {nextCheckIn.location}
                </span>
                <span className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-brand-text-sub">
                  <Clock className="size-3.5 text-[#078c79] dark:text-[#2fead0]" />
                  Closes at {fmtClock(nextCheckIn.end_at, nextCheckIn.timezone)}
                </span>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              {checkInOpen.length > 1 && (
                <button
                  type="button"
                  onClick={handleStripMore}
                  className="text-[12.5px] font-bold text-[#078c79] dark:text-[#2fead0]"
                >
                  +{String(checkInOpen.length - 1)} more open
                </button>
              )}
              <Button
                size="lg"
                onClick={handleStripCheckin}
                className="rounded-full bg-brand-teal font-bold text-primary hover:bg-brand-teal/85"
              >
                <ScanLine />
                Check in
              </Button>
            </div>
          </div>
        </div>
      )}

      <EventToolbar
        query={query}
        onQueryChange={setQuery}
        type={type}
        onTypeChange={setType}
        view={view}
        onViewChange={setView}
        views={EVENTS_VIEWS}
      />

      {view === "calendar" ? (
        <EventsCalendar events={upcoming} onOpen={setDetail} />
      ) : (
        <>
          <div>
            <h2 className="text-[22px] font-bold tracking-tight text-foreground">
              Upcoming events
            </h2>
            <span className="mt-1.75 block h-1.25 w-11 rounded-[9px] bg-brand-sky" />
            <p className="mt-2 text-[13.5px] text-muted-foreground">
              {String(upcoming.length)} event{upcoming.length === 1 ? "" : "s"} scheduled
            </p>
          </div>
          <EventResults
            events={upcoming}
            view={view}
            now={now}
            onOpen={setDetail}
            onRsvp={handleRsvp}
            onCheckin={setCheckin}
          />
        </>
      )}

      {detail && (
        <EventDetailDialog
          event={detail}
          now={now}
          open
          onOpenChange={closeDetail}
          canManage={canManageDetail}
          organizerName={organizerName}
          onRsvp={handleRsvp}
          onCheckin={openCheckinFromDetail}
          onManageAttendance={openRosterFromDetail}
        />
      )}

      {checkin && (
        <CheckInDialog
          event={checkin}
          now={now}
          open
          onOpenChange={closeCheckin}
          onVerified={invalidateAttended}
        />
      )}

      {roster && (
        <Dialog open onOpenChange={closeRoster}>
          <DialogContent className="max-h-[88svh] gap-4 overflow-y-auto sm:max-w-135">
            <DialogHeader>
              <DialogTitle className="text-lg font-extrabold">Attendance</DialogTitle>
              <DialogDescription>{roster.name}</DialogDescription>
            </DialogHeader>

            <Tabs value={rosterTab} onValueChange={setRosterTab} className="gap-4">
              <TabsList className="h-10 w-full border border-border">
                <TabsTrigger value="qr" className="font-bold data-active:border-border">
                  Check-in QR
                </TabsTrigger>
                <TabsTrigger value="roster" className="font-bold data-active:border-border">
                  Roster · {String(rosterMembers.length)}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="qr" className="flex flex-col items-center gap-4.5">
                <CheckInPanel
                  code={code}
                  copied={copied}
                  onCopy={copyCode}
                  state={checkIn}
                  closesAt={fmtClock(roster.end_at, roster.timezone)}
                />
              </TabsContent>

              <TabsContent value="roster" className="flex flex-col gap-3">
                <div className="flex gap-3">
                  <div className="flex-1 rounded-xl border border-border bg-card px-3.5 py-3 shadow-[0px_2px_5px_rgba(112,144,176,0.12)] dark:shadow-[0px_2px_5px_rgba(0,0,0,0.3)]">
                    <div className="text-2xl leading-none font-extrabold text-brand-sky">
                      {String(plannedCount)}
                    </div>
                    <div className="mt-1 text-xs font-semibold text-muted-foreground">
                      Planned (RSVP'd)
                    </div>
                  </div>
                  <div className="flex-1 rounded-xl border border-border bg-card px-3.5 py-3 shadow-[0px_2px_5px_rgba(112,144,176,0.12)] dark:shadow-[0px_2px_5px_rgba(0,0,0,0.3)]">
                    <div className="text-2xl leading-none font-extrabold text-[#15a66e] dark:text-[#3fd68c]">
                      {String(attendedCount)}
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
                      disabled={isRemoving}
                      onUndo={removeMutate}
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
        </Dialog>
      )}
    </div>
  );
}

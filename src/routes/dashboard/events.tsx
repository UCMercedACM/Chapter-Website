import {
  attendedEventsQueryOptions,
  eventsListQueryOptions,
  meQueryOptions,
  plannedEventsQueryOptions,
} from "./index";

import type { CalendarType } from "@schedule-x/calendar";
import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import axios from "axios";
import { Clock, MapPin, ScanLine } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

import { AttendanceDialog } from "@/components/app/attendance-dialog";
import { CheckInDialog } from "@/components/app/check-in-dialog";
import { EventDetailDialog, EventResults, EventToolbar } from "@/components/app/dashboard-events";
import { ManageEventsCalendar } from "@/components/app/events-calendar";
import { Button } from "@/components/ui/button";
import {
  type DashboardEvent,
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

// Constants

const EVENT_CALENDARS: Record<string, CalendarType> = Object.fromEntries(
  EVENT_TYPES.map((key) => {
    const meta = EVENT_TYPE_META[key];
    return [
      key,
      {
        colorName: key,
        lightColors: {
          main: meta.color,
          container: `${meta.color}40`,
          onContainer: meta.containerTextColor,
        },
        darkColors: {
          main: meta.darkColor,
          container: `${meta.darkColor}40`,
          onContainer: meta.darkColor,
        },
      },
    ];
  }),
);

const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:8000";
const EVENTS_VIEWS: EventView[] = ["calendar", "grid", "list"];

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
  });

/// Route components

function DashboardEvents() {
  const queryClient = useQueryClient();

  const [now] = useState(() => new Date());
  const [query, setQuery] = useState("");
  const [type, setType] = useState<"all" | EventType>("all");
  const [view, setView] = useState<EventView>("calendar");
  const [detail, setDetail] = useState<DashboardEvent>();
  const [checkin, setCheckin] = useState<DashboardEvent>();
  const [roster, setRoster] = useState<DashboardEvent>();

  const { data: events } = useQuery(eventsListQueryOptions);
  const { data: me } = useQuery(meQueryOptions);
  const { data: plannedEvents } = useQuery(plannedEventsQueryOptions);
  const { data: attendedEvents } = useQuery(attendedEventsQueryOptions);
  const creatorQuery = useQuery({
    ...memberQueryOptions(detail?.creator_id ?? ""),
    enabled: !!detail?.creator_id,
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

  const handleCalendarOpen = useCallback(
    (id: string) => {
      const event = upcoming.find((item) => item.id === id);
      if (event) setDetail(event);
    },
    [upcoming],
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
              <span className="text-[11.5px] font-extrabold tracking-[0.12em] text-[#067b6a] uppercase dark:text-[#2fead0]">
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
                  <Clock className="size-3.5 text-[#067b6a] dark:text-[#2fead0]" />
                  Closes at {fmtClock(nextCheckIn.end_at, nextCheckIn.timezone)}
                </span>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              {checkInOpen.length > 1 && (
                <button
                  type="button"
                  onClick={handleStripMore}
                  className="text-[12.5px] font-bold text-[#067b6a] dark:text-[#2fead0]"
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
        <ManageEventsCalendar
          events={upcoming}
          calendars={EVENT_CALENDARS}
          onOpen={handleCalendarOpen}
        />
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

      {roster && <AttendanceDialog event={roster} now={now} open onOpenChange={closeRoster} />}
    </div>
  );
}

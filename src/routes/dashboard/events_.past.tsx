import {
  attendedEventsQueryOptions,
  eventsListQueryOptions,
  plannedEventsQueryOptions,
} from "./index";

import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import axios from "axios";
import { Check, Clock } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

import { CheckInDialog } from "@/components/app/check-in-dialog";
import {
  EventDetailDialog,
  EventResults,
  EventToolbar,
  StatTile,
} from "@/components/app/dashboard-events";
import {
  type DashboardEvent,
  type EventType,
  type EventView,
  type FullEvent,
  filterEvents,
  isPastEvent,
  mergeDashboardEvent,
} from "@/lib/dashboard-events";

export const Route = createFileRoute("/dashboard/events_/past")({
  component: DashboardPastEvents,
  staticData: { area: "Member", title: "Past events", sub: "Your attendance history" },
  loader: async ({ context: { queryClient } }) => {
    await queryClient.prefetchQuery(eventsListQueryOptions);
    await queryClient.prefetchQuery(plannedEventsQueryOptions);
    await queryClient.prefetchQuery(attendedEventsQueryOptions);
  },
});

/// Constants

const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:8000";
const PAST_VIEWS: EventView[] = ["list", "grid"];

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

function DashboardPastEvents() {
  const queryClient = useQueryClient();

  const [now] = useState(() => new Date());
  const [query, setQuery] = useState("");
  const [type, setType] = useState<"all" | EventType>("all");
  const [view, setView] = useState<EventView>("list");
  const [detail, setDetail] = useState<DashboardEvent>();
  const [checkin, setCheckin] = useState<DashboardEvent>();

  const { data: events } = useQuery(eventsListQueryOptions);
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
  const past = useMemo(
    () =>
      filterEvents(dashboardEvents, type, query)
        .filter((event) => isPastEvent(event, now))
        .toReversed(),
    [dashboardEvents, type, query, now],
  );

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
  const closeDetail = useCallback((open: boolean) => {
    if (!open) setDetail(undefined);
  }, []);
  const closeCheckin = useCallback((open: boolean) => {
    if (!open) setCheckin(undefined);
  }, []);
  const openCheckinFromDetail = useCallback((event: DashboardEvent) => {
    setDetail(undefined);
    setCheckin(event);
  }, []);

  const attendedCount = past.filter((event) => event.attended).length;
  const organizerName = detail?.creator_id ? creatorQuery.data?.name : undefined;

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-4">
        <StatTile
          icon={Clock}
          value={past.length}
          label="Past events"
          accentClassName="bg-muted text-muted-foreground"
        />
        <StatTile
          icon={Check}
          value={attendedCount}
          label="You attended"
          accentClassName="bg-[#15a66e]/15 text-[#15a66e] dark:text-[#3fd68c]"
        />
      </div>

      <EventToolbar
        query={query}
        onQueryChange={setQuery}
        type={type}
        onTypeChange={setType}
        view={view}
        onViewChange={setView}
        views={PAST_VIEWS}
        searchPlaceholder="Search past events…"
      />

      <div>
        <h2 className="text-[22px] font-bold tracking-tight text-foreground">Past events</h2>
        <span className="mt-1.75 block h-1.25 w-11 rounded-[9px] bg-brand-sky" />
        <p className="mt-2 text-[13.5px] text-muted-foreground">
          {String(past.length)} event{past.length === 1 ? "" : "s"} · attendance history
        </p>
      </div>
      <EventResults
        events={past}
        view={view}
        now={now}
        onOpen={setDetail}
        onRsvp={handleRsvp}
        onCheckin={setCheckin}
        emptyTitle="No past events match"
        emptySub="Try a different type or clear the search."
      />

      {detail && (
        <EventDetailDialog
          event={detail}
          now={now}
          open
          onOpenChange={closeDetail}
          canManage={false}
          organizerName={organizerName}
          onRsvp={handleRsvp}
          onCheckin={openCheckinFromDetail}
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
    </div>
  );
}

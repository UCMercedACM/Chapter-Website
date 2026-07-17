import { type ClientMember, ROLE_META, ROLES_BY_RANK } from "./route";

import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import axios from "axios";
import {
  ArrowRight,
  Calendar,
  Check,
  Clock,
  Folder,
  MapPin,
  ScanLine,
  Shield,
  Ticket,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

import { CheckInDialog } from "@/components/app/check-in-dialog";
import { EventCard, StatTile } from "@/components/app/dashboard-events";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import {
  type DashboardEvent,
  type FullEvent,
  type KanaePage,
  EVENT_TYPE_CLASSES,
  EVENT_TYPE_META,
  determineCheckIn,
  fmtClock,
  fmtDay,
  isPastEvent,
  mergeDashboardEvent,
  monthDay,
} from "@/lib/dashboard-events";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardHome,
  staticData: { area: "Member", title: "Dashboard", home: true },
  loader: async ({ context: { queryClient } }) => {
    await queryClient.prefetchQuery(eventsListQueryOptions);
    await queryClient.prefetchQuery(meQueryOptions);
    await queryClient.prefetchQuery(plannedEventsQueryOptions);
    await queryClient.prefetchQuery(attendedEventsQueryOptions);
  },
});

/// Constants

const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:8000";
const EVENTS_PAGE_SIZE = 50;
const SKELETON_TILES = ["a", "b", "c", "d"];
const CAROUSEL_OPTS = { align: "start", dragFree: true } as const;
const CAROUSEL_NAV_CLASS = "static size-9 translate-0";
const HERO_STYLE = { background: "linear-gradient(135deg, #084778 0%, #0a5a6e 60%, #067b6a 130%)" };
const HERO_META_CLASS =
  "inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-[#eaf6ff]/90";
const PILL_CLASS =
  "inline-flex items-center justify-center gap-1.75 rounded-full border border-white/25 bg-white/15 px-5.5 py-3 text-sm font-bold";
const TEAL_BUTTON_CLASS =
  "rounded-full bg-brand-teal font-bold text-primary hover:bg-brand-teal/85";
const RAIL_CLASS =
  "rounded-[20px] border border-border bg-card p-4 shadow-[0px_4px_14px_rgba(112,144,176,0.14)] dark:shadow-[0px_4px_14px_rgba(0,0,0,0.4)]";

const SHARED_QUERY_OPTIONS = {
  staleTime: 60_000,
  retry: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  refetchOnMount: false,
} as const;

/// Tanstack Query options

export const memberEventsQueryOptions = (filter: "attended" | "planned") =>
  queryOptions({
    queryKey: ["members", "me", "events", filter],
    queryFn: async () => {
      const { data } = await axios.get<FullEvent[]>(`${API_BASE_URL}/members/me/events`, {
        params: { [filter]: true },
      });
      return data;
    },
    select: (events: FullEvent[]) => new Set(events.map((event) => event.id)),
    ...SHARED_QUERY_OPTIONS,
  });

export const eventsListQueryOptions = queryOptions({
  queryKey: ["events", "list", {}],
  queryFn: async () => {
    const fetchPage = (page: number) =>
      axios.get<KanaePage<FullEvent>>(`${API_BASE_URL}/events`, {
        params: { page, size: EVENTS_PAGE_SIZE },
      });
    const first = await fetchPage(1);
    const events = [...(first.data.data ?? [])];
    const pending = Array.from(
      { length: Math.ceil(first.data.total / EVENTS_PAGE_SIZE) - 1 },
      (_, index) => fetchPage(index + 2),
    );
    for (const request of pending) {
      const page = await request;
      events.push(...(page.data.data ?? []));
    }
    return events;
  },
  ...SHARED_QUERY_OPTIONS,
});

export const meQueryOptions = queryOptions({
  queryKey: ["members", "me"],
  queryFn: async () => {
    const { data } = await axios.get<ClientMember>(`${API_BASE_URL}/members/me`);
    return data;
  },
  ...SHARED_QUERY_OPTIONS,
});

export const plannedEventsQueryOptions = memberEventsQueryOptions("planned");
export const attendedEventsQueryOptions = memberEventsQueryOptions("attended");

/// Helper functions

function heroEyebrowText(live: boolean, planned: boolean) {
  if (live) return "Happening now";
  if (planned) return "Your next event";
  return "Next up";
}

/// Route

function DashboardHome() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: events, isPending } = useQuery(eventsListQueryOptions);
  const { data: me } = useQuery(meQueryOptions);
  const { data: plannedEvents } = useQuery(plannedEventsQueryOptions);
  const { data: attendedEvents } = useQuery(attendedEventsQueryOptions);

  const [now] = useState(() => new Date());
  const [checkinEvent, setCheckinEvent] = useState<DashboardEvent>();

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
  const goToEvents = useCallback(() => {
    navigate({ to: "/dashboard/events" }).catch(() => {});
  }, [navigate]);
  const closeCheckin = useCallback((open: boolean) => {
    if (!open) setCheckinEvent(undefined);
  }, []);
  const invalidateAttended = useCallback(
    () => queryClient.invalidateQueries({ queryKey: attendedEventsQueryOptions.queryKey }),
    [queryClient],
  );

  const { hero, heroDate, heroLive, heroEyebrow, myUpcoming, myRsvpsSub, rail, attendedCount } =
    useMemo(() => {
      // Apparently this events ?? [] results in not a function?
      const merged: DashboardEvent[] = (events ?? []).map((event) =>
        mergeDashboardEvent(
          event,
          plannedEvents?.has(event.id) ?? false,
          attendedEvents?.has(event.id) ?? false,
        ),
      );
      const upcoming = merged
        .toSorted((a, b) => a.start_at.localeCompare(b.start_at))
        .filter((event) => !isPastEvent(event, now));
      const live = upcoming.find(
        (event) => determineCheckIn(event, now) === "open" && !event.attended,
      );
      const heroEvent = live ?? upcoming.find((event) => event.planned) ?? upcoming.at(0);
      const heroLive = heroEvent ? determineCheckIn(heroEvent, now) === "open" : false;
      const planned = upcoming.filter((event) => event.planned);
      const plural = planned.length === 1 ? "" : "s";
      return {
        hero: heroEvent,
        heroDate: heroEvent ? monthDay(heroEvent.start_at, heroEvent.timezone) : undefined,
        heroLive,
        heroEyebrow: heroEyebrowText(heroLive, heroEvent?.planned ?? false),
        myUpcoming: planned,
        myRsvpsSub:
          planned.length > 0
            ? `${String(planned.length)} event${plural} you're going to`
            : "Events you RSVP to land here",
        rail: upcoming.filter((event) => event.id !== heroEvent?.id),
        attendedCount: merged.filter((event) => event.attended).length,
      };
    }, [events, plannedEvents, attendedEvents, now]);

  const handleHeroCheckin = useCallback(() => {
    if (hero) setCheckinEvent(hero);
  }, [hero]);
  const handleHeroRsvp = useCallback(() => {
    if (hero) handleRsvp(hero, true);
  }, [hero, handleRsvp]);

  const role = ROLES_BY_RANK.find((item) => me?.roles.includes(item));

  return isPending ? (
    <div className="flex flex-col gap-5.5">
      <Skeleton className="h-44 rounded-[20px]" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {SKELETON_TILES.map((id) => (
          <Skeleton key={id} className="h-28 rounded-[20px]" />
        ))}
      </div>
      <Skeleton className="h-72 rounded-[20px]" />
    </div>
  ) : (
    <div className="flex flex-col gap-5.5">
      {hero ? (
        <div
          className="relative overflow-hidden rounded-[18px] text-[#eaf6ff] shadow-[0px_16px_40px_rgba(112,144,176,0.2)] dark:shadow-[0px_16px_40px_rgba(0,0,0,0.4)]"
          style={HERO_STYLE}
        >
          <div className="pointer-events-none absolute -top-15 -right-10 size-60 rounded-full bg-brand-teal/20 blur-sm" />
          <div className="relative flex flex-wrap items-center gap-5.5 p-6">
            <div className="flex h-24 w-23 shrink-0 flex-col overflow-hidden rounded-2xl border border-white/20 bg-white/10 text-center">
              <div className="bg-white/15 py-1.5 text-[13px] font-extrabold tracking-widest">
                {heroDate?.mon}
              </div>
              <div className="flex flex-1 items-center justify-center text-[40px] leading-none font-extrabold">
                {heroDate?.day}
              </div>
            </div>

            <div className="min-w-55 flex-1">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-extrabold tracking-[0.12em] text-brand-teal uppercase">
                  {heroEyebrow}
                </span>
                <span className={cn("size-1.5 rounded-full", EVENT_TYPE_CLASSES[hero.type].dot)} />
                <span className="text-[11.5px] font-bold text-[#eaf6ff]/80">
                  {EVENT_TYPE_META[hero.type].label}
                </span>
              </div>
              <h2 className="mb-2.5 text-[25px] font-extrabold tracking-tight">{hero.name}</h2>
              <div className="flex flex-wrap gap-4.5">
                <span className={HERO_META_CLASS}>
                  <Calendar className="size-4" />
                  {fmtDay(hero.start_at, hero.timezone)}
                </span>
                <span className={HERO_META_CLASS}>
                  <Clock className="size-4" />
                  {fmtClock(hero.start_at, hero.timezone)}-{fmtClock(hero.end_at, hero.timezone)}
                </span>
                <span className={HERO_META_CLASS}>
                  <MapPin className="size-4" />
                  {hero.location}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-stretch gap-2.5">
              {heroLive && !hero.attended && (
                <Button size="lg" onClick={handleHeroCheckin} className={TEAL_BUTTON_CLASS}>
                  <ScanLine />
                  Check in now
                </Button>
              )}
              {hero.attended && (
                <div className={PILL_CLASS}>
                  <Check className="size-4.5" />
                  Attended
                </div>
              )}
              {hero.planned && !heroLive && !hero.attended && (
                <div className={PILL_CLASS}>
                  <Check className="size-4.5" />
                  You're going
                </div>
              )}
              {!hero.planned && !heroLive && !hero.attended && (
                <Button size="lg" onClick={handleHeroRsvp} className={TEAL_BUTTON_CLASS}>
                  <Ticket />
                  RSVP now
                </Button>
              )}
              <Link
                to="/dashboard/events"
                className="inline-flex items-center justify-center gap-1.25 text-[13px] font-bold text-[#eaf6ff]/85 hover:text-[#eaf6ff]"
              >
                View details
                <ArrowRight className="size-3.75" />
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-[18px] border border-border bg-card p-7 text-center text-brand-text-sub">
          <Calendar className="mx-auto mb-2 size-7 text-muted-foreground" />
          <div className="text-base font-bold text-foreground">No upcoming events</div>
          <p className="mt-1 text-sm text-muted-foreground">New events will appear here soon.</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile icon={Ticket} value={myUpcoming.length} label="Upcoming RSVPs" />
        <StatTile
          icon={Check}
          value={attendedCount}
          label="Events attended"
          accentClassName="bg-[#15a66e]/15 text-[#15a66e] dark:text-[#3fd68c]"
        />
        <StatTile
          icon={Folder}
          value={me?.projects.length ?? 0}
          label="My projects"
          accentClassName="bg-brand-sky/15 text-brand-sky"
        />
        <StatTile
          icon={Shield}
          value={role ? ROLE_META[role].label : "Member"}
          label="Your access"
          accentClassName={cn(
            role ? "bg-brand-sky/15 text-brand-sky" : "bg-muted text-muted-foreground",
          )}
        />
      </div>

      <Carousel opts={CAROUSEL_OPTS} className={RAIL_CLASS}>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-[17px] font-bold tracking-tight text-foreground">My RSVPs</h2>
            <span className="mt-1.75 block h-1 w-8 rounded-[9px] bg-brand-teal" />
            <p className="mt-2 text-[13.5px] text-muted-foreground">{myRsvpsSub}</p>
          </div>
          {myUpcoming.length > 1 && (
            <div className="flex items-center gap-2">
              <CarouselPrevious className={CAROUSEL_NAV_CLASS} />
              <CarouselNext className={CAROUSEL_NAV_CLASS} />
            </div>
          )}
        </div>
        {myUpcoming.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <div className="mx-auto mb-3.5 inline-flex rounded-2xl bg-muted p-3.5 text-muted-foreground">
              <Ticket className="size-6" />
            </div>
            <div className="text-[15px] font-bold text-brand-text-sub">No RSVPs yet</div>
            <div className="mt-1 text-[13px] text-muted-foreground">
              RSVP to an event below and it will show up here.
            </div>
          </div>
        ) : (
          <CarouselContent className="-ml-4">
            {myUpcoming.map((event) => (
              <CarouselItem key={event.id} className="basis-80 pl-4">
                <EventCard
                  event={event}
                  now={now}
                  onOpen={goToEvents}
                  onRsvp={handleRsvp}
                  onCheckin={setCheckinEvent}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        )}
      </Carousel>

      <Carousel opts={CAROUSEL_OPTS} className={RAIL_CLASS}>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-[17px] font-bold tracking-tight text-foreground">
              Upcoming events
            </h2>
            <span className="mt-1.75 block h-1 w-8 rounded-[9px] bg-brand-teal" />
            <p className="mt-2 text-[13.5px] text-muted-foreground">Open across all SIGs</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              nativeButton={false}
              className="hidden font-bold text-brand-text-sub lg:inline-flex"
              render={
                <Link to="/dashboard/events">
                  All events
                  <ArrowRight />
                </Link>
              }
            />
            {rail.length > 1 && (
              <>
                <CarouselPrevious className={CAROUSEL_NAV_CLASS} />
                <CarouselNext className={CAROUSEL_NAV_CLASS} />
              </>
            )}
          </div>
        </div>
        {rail.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <div className="mx-auto mb-3.5 inline-flex rounded-2xl bg-muted p-3.5 text-muted-foreground">
              <Calendar className="size-6" />
            </div>
            <div className="text-[15px] font-bold text-brand-text-sub">Nothing scheduled</div>
            <div className="mt-1 text-[13px] text-muted-foreground">
              New events will appear here.
            </div>
          </div>
        ) : (
          <CarouselContent className="-ml-4">
            {rail.map((event) => (
              <CarouselItem key={event.id} className="basis-80 pl-4">
                <EventCard
                  event={event}
                  now={now}
                  onOpen={goToEvents}
                  onRsvp={handleRsvp}
                  onCheckin={setCheckinEvent}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        )}

        <div className="mt-4 flex lg:hidden">
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            className="w-full font-bold text-brand-text-sub"
            render={
              <Link to="/dashboard/events">
                All events
                <ArrowRight />
              </Link>
            }
          />
        </div>
      </Carousel>

      {checkinEvent && (
        <CheckInDialog
          event={checkinEvent}
          now={now}
          open
          onOpenChange={closeCheckin}
          onVerified={invalidateAttended}
        />
      )}
    </div>
  );
}

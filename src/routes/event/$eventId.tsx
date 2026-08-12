import { queryOptions, skipToken, useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import axios from "axios";
import { ChevronLeft, Clock, MapPin, Ticket } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  type EventType,
  EVENT_TYPE_CLASSES,
  EVENT_TYPE_META,
  fmtClock,
  fmtDay,
  isPastEvent,
  monthDay,
} from "@/lib/dashboard-events";
import { cn } from "@/lib/utils";
import { type FullEvents } from "@/types/kanae.gen";

export const Route = createFileRoute("/event/$eventId")({
  component: Event,
  loader: ({ context: { queryClient }, params: { eventId } }) =>
    queryClient.prefetchQuery(eventDetailQueryOptions(eventId)),
});

/// Types and Interfaces

interface EventOrganizer {
  id: string;
  name: string;
}

/// Constants with data

const EVENT_TYPE_ACCENTS: Record<EventType, string> = {
  general: "[--type-color:#2e7d9a] dark:[--type-color:#5b9bd5]",
  sig_swe: "[--type-color:#3da9fc] dark:[--type-color:#6cbcff]",
  sig_ai: "[--type-color:#00c9a7] dark:[--type-color:#2fdcbb]",
  sig_cyber: "[--type-color:#ff6b6b] dark:[--type-color:#ff9a9a]",
  sig_data: "[--type-color:#f7b731] dark:[--type-color:#ffd56b]",
  sig_arch: "[--type-color:#fc5c7d] dark:[--type-color:#ff8fa6]",
  sig_graph: "[--type-color:#a55eea] dark:[--type-color:#c79bf2]",
  social: "[--type-color:#fd9644] dark:[--type-color:#ffb37a]",
  misc: "[--type-color:#93a3b6] dark:[--type-color:#b4c2d2]",
};

const JOIN_ERRORS: Record<number, string | undefined> = {
  401: "Sign in to join this event.",
  403: "This event has already ended.",
  404: "This event no longer exists.",
  409: "You've already joined this event.",
};

const EVENT_STATUSES = {
  past: { label: "Past", className: "border-border bg-muted text-muted-foreground" },
  live: { label: "Happening now", className: "border-sig-ai/30 bg-sig-ai/15 text-sig-ai" },
  upcoming: { label: "Upcoming", className: "border-sig-swe/30 bg-sig-swe/15 text-sig-swe" },
};

/// Module-scoped constants

const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:8000";

const LONG_DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
};

const PAGE_CLASSES = "mx-auto max-w-225 px-4 md:px-12";
const BADGE_CLASSES = cn(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.75",
  "text-[11px] font-bold tracking-wide uppercase",
);
const DETAIL_PANEL_CLASSES = cn(
  "rounded-[20px] border border-border bg-card p-5",
  "shadow-[0px_4px_14px_rgba(112,144,176,0.14)] dark:shadow-[0px_4px_14px_rgba(0,0,0,0.4)]",
);
const DETAIL_LABEL_CLASSES =
  "text-[11px] font-semibold tracking-[0.06em] text-muted-foreground uppercase";
const DETAIL_VALUE_CLASSES = "mt-1 flex items-start gap-1.75 text-sm font-bold text-foreground";
const SECTION_LABEL_CLASSES =
  "mb-2.5 text-[11px] font-bold tracking-[0.08em] text-muted-foreground uppercase";

/// Tanstack Query options

const eventDetailQueryOptions = (eventId: string) =>
  queryOptions({
    queryKey: ["events", eventId, "detail"],
    queryFn: async () => {
      const { data } = await axios.get<FullEvents>(`${API_BASE_URL}/events/${eventId}`);
      return data;
    },
  });

const eventOrganizerQueryOptions = (memberId: string | null | undefined) =>
  queryOptions({
    queryKey: ["members", memberId],
    queryFn: memberId
      ? async () => {
          const { data } = await axios.get<EventOrganizer>(`${API_BASE_URL}/members/${memberId}`);
          return data;
        }
      : skipToken,
    staleTime: 300_000,
  });

/// Helper functions

function eventStatus(event: FullEvents, now: Date) {
  if (isPastEvent(event, now)) return EVENT_STATUSES.past;
  if (Date.parse(event.start_at) <= now.getTime()) return EVENT_STATUSES.live;
  return EVENT_STATUSES.upcoming;
}

/// Route Component

function Event() {
  const { eventId } = Route.useParams();

  const { data: event, isPending, isError } = useQuery(eventDetailQueryOptions(eventId));
  const { data: organizer } = useQuery(eventOrganizerQueryOptions(event?.creator_id));

  const [now] = useState(() => new Date());

  const { mutate: joinEvent, isPending: isJoining } = useMutation({
    mutationFn: async () => {
      const { data } = await axios.post<{ message: string }>(
        `${API_BASE_URL}/events/${eventId}/join`,
      );
      return data;
    },
    onSuccess: () => {
      toast.success("You're on the list! We'll see you there.");
    },
    onError: (error) => {
      const status = axios.isAxiosError(error) ? error.response?.status : undefined;
      toast.error(JOIN_ERRORS[status ?? 0] ?? "Could not join this event. Please try again.");
    },
  });

  const handleJoin = useCallback(() => {
    joinEvent();
  }, [joinEvent]);

  const organizerName = organizer?.name ?? (event?.creator_id ? "…" : "Unknown organizer");
  const status = event ? eventStatus(event, now) : undefined;
  const startDate = event ? monthDay(event.start_at, event.timezone) : undefined;

  return (
    <div className="bg-background">
      <div className={cn(PAGE_CLASSES, "pt-6 md:pt-10")}>
        <Link
          to="/events"
          className={cn(
            "inline-flex items-center gap-1.5 text-[13px] font-semibold",
            "text-brand-text-sub transition-colors hover:text-foreground",
          )}
        >
          <ChevronLeft className="size-4" />
          Back to Events
        </Link>
      </div>

      {isPending && (
        <div className={cn(PAGE_CLASSES, "flex flex-col gap-5 py-8 md:py-12")}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2.5">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-24 rounded-full" />
            </div>
            <Skeleton className="h-8 w-28 rounded-full" />
          </div>
          <Skeleton className="mt-2 h-9 w-2/3 rounded-md" />
          <Skeleton className="h-1 w-12 rounded-full" />
          <Skeleton className="h-45 rounded-[20px]" />
          <div className="mt-2 flex flex-col gap-2">
            <Skeleton className="h-4 w-full rounded-sm" />
            <Skeleton className="h-4 w-11/12 rounded-sm" />
            <Skeleton className="h-4 w-3/4 rounded-sm" />
          </div>
        </div>
      )}

      {isError && (
        <div className={cn(PAGE_CLASSES, "py-16 text-center text-base text-muted-foreground")}>
          Event not found.
        </div>
      )}

      {event && status && (
        <article
          className={cn(
            PAGE_CLASSES,
            "py-8 md:py-12",
            "[contain-intrinsic-size:auto_900px] [content-visibility:auto]",
            EVENT_TYPE_ACCENTS[event.type],
          )}
        >
          <header className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className={cn(BADGE_CLASSES, EVENT_TYPE_CLASSES[event.type].label)}>
                {EVENT_TYPE_META[event.type].label}
              </span>
              <span className={cn(BADGE_CLASSES, status.className)}>
                <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
                {status.label}
              </span>
            </div>
            {status !== EVENT_STATUSES.past && (
              <Button
                onClick={handleJoin}
                disabled={isJoining}
                className="h-10 rounded-full font-bold sm:ml-auto sm:h-8"
              >
                <Ticket className="size-4" />
                {isJoining ? "Joining…" : "Join Event"}
              </Button>
            )}
          </header>

          {event.thumbnail ? (
            <img
              src={event.thumbnail.url}
              alt=""
              fetchPriority="high"
              decoding="async"
              className={cn(
                "mt-5 w-full rounded-2xl border border-border object-cover",
                "h-45 bg-(--type-color)/15 md:h-70",
              )}
            />
          ) : undefined}

          <h1
            className={cn(
              "mt-5 leading-tight font-extrabold text-foreground",
              "text-[30px] md:text-[44px]",
            )}
          >
            {event.name}
          </h1>

          {event.tags && event.tags.length > 0 ? (
            <ul aria-label="Tags" className="mt-3 flex flex-wrap gap-2">
              {event.tags.map((tag) => (
                <li
                  key={tag}
                  className={cn(
                    "rounded-full border border-border bg-card",
                    "px-3 py-1 text-xs font-semibold text-foreground",
                  )}
                >
                  {tag}
                </li>
              ))}
            </ul>
          ) : undefined}

          <div className="my-6 h-1 w-12 rounded-full bg-(--type-color)" />

          <section>
            <div className={SECTION_LABEL_CLASSES}>Details</div>
            <div className={DETAIL_PANEL_CLASSES}>
              <div className="flex items-center gap-4.5">
                <div
                  className={cn(
                    "flex h-19 w-17 shrink-0 flex-col overflow-hidden text-center",
                    "rounded-2xl border border-border",
                  )}
                >
                  <div className="bg-(--type-color) py-1 text-[11px] font-extrabold tracking-[0.08em] text-white">
                    {startDate?.mon}
                  </div>
                  <div className="flex flex-1 items-center justify-center text-[30px] leading-none font-extrabold text-foreground">
                    {startDate?.day}
                  </div>
                </div>
                <div className="min-w-0">
                  <div className={DETAIL_LABEL_CLASSES}>When</div>
                  <div className="mt-1 text-[15px] font-bold text-foreground md:text-base">
                    {fmtDay(event.start_at, event.timezone, LONG_DATE_OPTIONS)}
                  </div>
                  <div className="mt-0.5 flex items-center gap-1.5 text-sm font-semibold text-brand-text-sub">
                    <Clock className="size-3.5 shrink-0" />
                    {fmtClock(event.start_at, event.timezone)} -{" "}
                    {fmtClock(event.end_at, event.timezone)}
                  </div>
                </div>
              </div>

              <div className="mt-4.5 grid gap-4 border-t border-border pt-4.5 sm:grid-cols-2">
                <div className="min-w-0">
                  <div className={DETAIL_LABEL_CLASSES}>Where</div>
                  <div className={DETAIL_VALUE_CLASSES}>
                    <MapPin className="mt-0.5 size-4 shrink-0 text-(--type-color)" />
                    {event.location}
                  </div>
                </div>
                <div className="min-w-0">
                  <div className={DETAIL_LABEL_CLASSES}>Hosted by</div>
                  <div
                    className={cn(
                      DETAIL_VALUE_CLASSES,
                      !event.creator_id && "font-semibold text-muted-foreground",
                    )}
                  >
                    {organizer ? (
                      <Avatar aria-hidden="true" className="size-5.5 text-[10px] after:hidden">
                        <AvatarFallback className="bg-(--type-color)/20 text-[1em] font-bold text-(--type-color)">
                          {organizer.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    ) : undefined}
                    {organizerName}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-8">
            <div className={SECTION_LABEL_CLASSES}>Description</div>
            <p className={cn("leading-[1.85] text-brand-text-sub", "text-[15px] md:text-[17px]")}>
              {event.description}
            </p>
          </section>

          <footer className="mt-8 border-t border-border pt-5 text-xs text-muted-foreground">
            All times shown in {event.timezone}
          </footer>
        </article>
      )}
    </div>
  );
}

import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import type { CalendarType } from "@schedule-x/calendar";
import { queryOptions, useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import axios from "axios";
import { MapPin } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

import aboutUsThumb from "@/assets/images/about-us.png";
import { PublicEventsCalendar } from "@/components/app/events-calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/events")({
  component: Events,
  loader: ({ context: { queryClient } }) => queryClient.prefetchQuery(eventsQueryOptions),
});

/// Types and Interfaces

type EventType =
  | "general"
  | "misc"
  | "sig_ai"
  | "sig_arch"
  | "sig_cyber"
  | "sig_data"
  | "sig_graph"
  | "sig_swe"
  | "social";

interface ApiEvent {
  id: string;
  name: string;
  description: string;
  start_at: string;
  end_at: string;
  location: string;
  type: EventType;
  timezone: string;
  creator_id: string;
}

interface EventsPage {
  data: ApiEvent[];
  total: number;
}

interface SelectedEvent {
  event: ApiEvent;
  rect: DOMRect;
}

/// Module-scoped constants

const EVENT_TYPES = [
  {
    key: "general",
    label: "General",
    color: "#084778",
    darkColor: "#5b9bd5",
    containerTextColor: "#084778",
  },
  {
    key: "sig_swe",
    label: "SWE",
    color: "#3da9fc",
    darkColor: "#6cbcff",
    containerTextColor: "#256698",
  },
  {
    key: "sig_ai",
    label: "AI",
    color: "#00c9a7",
    darkColor: "#2fdcbb",
    containerTextColor: "#00715e",
  },
  {
    key: "sig_cyber",
    label: "Cyber",
    color: "#ff6b6b",
    darkColor: "#ff9a9a",
    containerTextColor: "#9f4343",
  },
  {
    key: "sig_data",
    label: "Data",
    color: "#f7b731",
    darkColor: "#ffd56b",
    containerTextColor: "#84621a",
  },
  {
    key: "sig_graph",
    label: "Graphics",
    color: "#a55eea",
    darkColor: "#c79bf2",
    containerTextColor: "#7844aa",
  },
  {
    key: "sig_arch",
    label: "Architecture",
    color: "#fc5c7d",
    darkColor: "#ff8fa6",
    containerTextColor: "#a13b50",
  },
  {
    key: "social",
    label: "Social",
    color: "#00e1bf",
    darkColor: "#3df0d6",
    containerTextColor: "#007462",
  },
  {
    key: "misc",
    label: "Misc",
    color: "#93a3b6",
    darkColor: "#b4c2d2",
    containerTextColor: "#5a6470",
  },
] as const satisfies readonly {
  readonly color: string;
  readonly containerTextColor: string;
  readonly darkColor: string;
  readonly key: EventType;
  readonly label: string;
}[];

const EVENT_TYPE_BADGE_CLASSES: Record<EventType, string> = {
  general: "border-[#338acf]/30 bg-[#338acf]/15 text-[#338acf]",
  sig_swe: "border-[#4cb0fc]/30 bg-[#4cb0fc]/15 text-[#4cb0fc]",
  sig_ai: "border-[#00c9a7]/30 bg-[#00c9a7]/15 text-[#00c9a7]",
  sig_cyber: "border-[#ff6b6b]/30 bg-[#ff6b6b]/15 text-[#ff6b6b]",
  sig_data: "border-[#f7b731]/30 bg-[#f7b731]/15 text-[#f7b731]",
  sig_graph: "border-[#a55eea]/30 bg-[#a55eea]/15 text-[#a55eea]",
  sig_arch: "border-[#fc5c7d]/30 bg-[#fc5c7d]/15 text-[#fc5c7d]",
  social: "border-[#00e1bf]/30 bg-[#00e1bf]/15 text-[#00e1bf]",
  misc: "border-[#93a3b6]/30 bg-[#93a3b6]/15 text-[#93a3b6]",
};

const EVENT_CALENDARS: Record<string, CalendarType> = Object.fromEntries(
  EVENT_TYPES.map((meta) => [
    meta.key,
    {
      colorName: meta.key,
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
  ]),
);

const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:8000";

const EVENTS_PAGE_SIZE = 50;
const PACIFIC_TZ = "America/Los_Angeles";

const WEEKDAY_FMT = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
  timeZone: PACIFIC_TZ,
});
const TIME_FMT = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  timeZone: PACIFIC_TZ,
});

const CALENDAR_SECTION_CLASSES = cn(
  "mx-auto flex w-full max-w-[1700px] flex-col",
  "h-[calc(100svh-4rem)] p-4 md:h-[calc(100svh-5.125rem)] md:px-8 md:py-6",
);
/// Tanstack Query keys

const eventsKeys = {
  all: ["events"] as const,
  lists: () => [...eventsKeys.all, "list"] as const,
  list: (params: Record<string, unknown>) => [...eventsKeys.lists(), params] as const,
};

const eventsQueryOptions = queryOptions({
  queryKey: eventsKeys.list({}),
  queryFn: async () => {
    // Until we have date-range paginations on Kanae, we will literally fetch everything
    const first = await axios.get<EventsPage>(`${API_BASE_URL}/events`, {
      params: { page: 1, size: EVENTS_PAGE_SIZE },
    });
    const { total } = first.data;

    const remaining = total - first.data.data.length;
    const leftover = remaining % EVENTS_PAGE_SIZE;
    const remainingPages = (remaining - leftover) / EVENTS_PAGE_SIZE + (leftover > 0 ? 1 : 0);

    const rest = await Promise.all(
      Array.from({ length: remainingPages }, (_, index) =>
        axios.get<EventsPage>(`${API_BASE_URL}/events`, {
          params: { page: index + 2, size: EVENTS_PAGE_SIZE },
        }),
      ),
    );

    return {
      data: [...first.data.data, ...rest.flatMap((response) => response.data.data)],
      total,
    };
  },
  staleTime: 60_000,

  // Remove these when Kanae is live
  retry: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  refetchOnMount: false,
});

/// Route Component

function Events() {
  const { data: eventsPage, isError } = useQuery(eventsQueryOptions);
  const events = useMemo(() => eventsPage?.data ?? [], [eventsPage]);

  const { mutate: joinEvent, isPending: isJoining } = useMutation({
    mutationFn: (eventId: string) => {
      // Until Kanae is up, this goes nowhere for now
      return Promise.resolve(eventId);
    },
    onSuccess: () => {
      toast.success("You're on the list! We'll see you there.");
      setSelected(undefined);
    },
  });

  const [selected, setSelected] = useState<SelectedEvent>();
  const selectedEvent = selected?.event;

  const handleJoinEvent = useCallback(() => {
    if (selectedEvent) {
      joinEvent(selectedEvent.id);
    }
  }, [selectedEvent, joinEvent]);

  const handlePopoverOpenChange = useCallback((open: boolean) => {
    if (!open) {
      setSelected(undefined);
    }
  }, []);

  const handleSelect = useCallback(
    (selection: { id: string; rect: DOMRect }) => {
      const event = events.find((item) => item.id === selection.id);
      if (event) {
        setSelected({ event, rect: selection.rect });
      }
    },
    [events],
  );

  const selectedEventType = useMemo(
    () => EVENT_TYPES.find((meta) => meta.key === selectedEvent?.type) ?? EVENT_TYPES[0],
    [selectedEvent],
  );

  const anchor = useMemo(
    () => (selected ? { getBoundingClientRect: () => selected.rect } : undefined),
    [selected],
  );

  return (
    <div className="isolate bg-background">
      <section
        className={cn(
          "relative flex w-full items-center justify-center overflow-hidden",
          "h-28 border-b-2 border-border shadow-[0_5px_18px_rgba(112,144,176,0.28)] md:h-50",
        )}
      >
        <div className="absolute inset-0 bg-brand-teal" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,71,120,0.55)_0%,rgba(8,71,120,0.62)_60%,rgba(8,71,120,0.85)_100%)]" />
        <div className="relative z-2 px-6 text-center">
          <h1
            className={cn(
              "leading-[1.1] font-extrabold text-brand-text-hero",
              "text-[28px] md:text-[52px]",
            )}
          >
            Events and Activities
          </h1>
          <p
            className={cn(
              "text-brand-text-hero/75",
              "mx-auto mt-3 max-w-130 text-[13px] md:text-[17px]",
            )}
          >
            Keep up to date with our events!
          </p>
        </div>
      </section>

      <section className={CALENDAR_SECTION_CLASSES}>
        {eventsPage ? (
          <PublicEventsCalendar
            events={events}
            calendars={EVENT_CALENDARS}
            onSelect={handleSelect}
          />
        ) : undefined}

        {!eventsPage && isError ? (
          <div className="flex min-h-0 flex-1 items-center justify-center rounded-3xl border border-border bg-card text-center text-base text-muted-foreground">
            Failed to load events
          </div>
        ) : undefined}

        {!eventsPage && !isError ? (
          <Skeleton className="min-h-0 w-full flex-1 rounded-3xl" />
        ) : undefined}
      </section>

      <Popover open={selected !== undefined} onOpenChange={handlePopoverOpenChange} modal>
        <PopoverTrigger aria-hidden tabIndex={-1} className="sr-only" />
        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Positioner
            anchor={anchor}
            disableAnchorTracking
            positionMethod="fixed"
            side="right"
            align="start"
            sideOffset={8}
            className="isolate z-50"
          >
            <PopoverPrimitive.Popup
              className={cn(
                "flex w-64 origin-(--transform-origin) flex-col overflow-hidden rounded-2xl bg-popover text-popover-foreground",
                "shadow-md ring-1 ring-foreground/10 outline-hidden duration-100",
                "data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2",
                "data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95",
                "data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
              )}
            >
              {selectedEvent ? (
                <>
                  <img
                    src={aboutUsThumb}
                    alt=""
                    className="h-28 w-full shrink-0 object-cover"
                    loading="lazy"
                  />

                  <div className="flex flex-col gap-2 p-3.5">
                    <span
                      className={cn(
                        "self-start rounded-full border px-2 py-0.5",
                        "text-[9px] font-bold tracking-wide uppercase",
                        EVENT_TYPE_BADGE_CLASSES[selectedEvent.type],
                      )}
                    >
                      {selectedEventType.label}
                    </span>

                    <h3 className="text-sm/tight font-extrabold text-foreground">
                      {selectedEvent.name}
                    </h3>

                    <div className="flex flex-col gap-0.5 text-xs text-brand-text-sub">
                      <span className="font-semibold text-foreground">
                        {WEEKDAY_FMT.format(new Date(selectedEvent.start_at))}
                      </span>
                      <span>
                        {TIME_FMT.format(new Date(selectedEvent.start_at))} -{" "}
                        {TIME_FMT.format(new Date(selectedEvent.end_at))}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="size-3 shrink-0" />
                        {selectedEvent.location}
                      </span>
                    </div>

                    <p className="line-clamp-3 text-xs/snug text-brand-text-sub">
                      {selectedEvent.description}
                    </p>

                    <Button
                      onClick={handleJoinEvent}
                      disabled={isJoining}
                      className="mt-0.5 h-9 w-full rounded-full text-sm font-bold"
                    >
                      {isJoining ? "Joining…" : "Join Event"}
                    </Button>
                  </div>
                </>
              ) : undefined}
            </PopoverPrimitive.Popup>
          </PopoverPrimitive.Positioner>
        </PopoverPrimitive.Portal>
      </Popover>

      <section className="mx-auto max-w-425 px-4 pb-16 md:px-8 md:pb-24">
        <div
          className={cn(
            "flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-card",
            "border-l-5 border-brand-teal p-6 md:px-10 md:py-8",
            "shadow-[0px_16px_40px_rgba(112,144,176,0.2)]",
          )}
        >
          <div>
            <div className="text-base font-bold text-foreground md:text-xl">
              Never miss an event
            </div>
            <div className="mt-1 text-[13px] text-brand-text-sub md:text-[15px]">
              Subscribe to our newsletter for weekly updates
            </div>
          </div>
          <Button className="rounded-full px-6 font-bold md:px-8">Join Our Newsletter</Button>
        </div>
      </section>
    </div>
  );
}

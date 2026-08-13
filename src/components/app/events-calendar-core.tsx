import "temporal-polyfill/full/global";
import "@schedule-x/theme-shadcn/dist/index.css";

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
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ui/theme-provider";
import { cn } from "@/lib/utils";

/// Types and Interfaces
type CalendarConfig = NonNullable<Parameters<typeof useCalendarApp>[0]>;
type CalendarViews = CalendarConfig["views"];
type CalendarPlugin = NonNullable<CalendarConfig["plugins"]>[number];

export interface CalendarSourceEvent {
  id: string;
  name: string;
  description: string;
  location: string;
  type: string;
  start_at: string;
  end_at: string;
  timezone: string;
}

interface EventsCalendarCoreProps {
  events: readonly CalendarSourceEvent[];
  calendars: Record<string, CalendarType>;
  views: CalendarViews;
  defaultView: string;
  plugins?: CalendarPlugin[];
  onEventClick: (id: string, clickEvent: UIEvent) => void;
  className?: string;
}

export interface PublicEventsCalendarProps {
  events: readonly CalendarSourceEvent[];
  calendars: Record<string, CalendarType>;
  onSelect: (selection: { id: string; rect: DOMRect }) => void;
}

export interface ManageEventsCalendarProps {
  events: readonly CalendarSourceEvent[];
  calendars: Record<string, CalendarType>;
  onOpen: (id: string) => void;
}

/// Constants

// Fixes the positioning clipping issue
const DATE_PICKER_CONFIG = { teleportTo: document.body };
const PACIFIC_TZ = "America/Los_Angeles";

const PUBLIC_SHELL_CLASSES = cn(
  "min-h-0 w-full flex-1 rounded-3xl border border-border bg-card",
  "shadow-[0px_16px_40px_rgba(112,144,176,0.2)]",
  "[&_.sx-react-calendar-wrapper]:size-full",
);
const MANAGE_SHELL_CLASSES = cn(
  "isolate h-160 rounded-[20px] border border-border bg-card p-2",
  "shadow-[0px_4px_14px_rgba(112,144,176,0.14)] dark:shadow-[0px_4px_14px_rgba(0,0,0,0.4)]",
  "[&_.sx-react-calendar-wrapper]:size-full",
  "**:[[class*='-event']]:select-none",
);

/// Shared calendar core

function EventsCalendarCore({
  events,
  calendars,
  views,
  defaultView,
  plugins,
  onEventClick,
  className,
}: Readonly<EventsCalendarCoreProps>) {
  const [initialScroll] = useState(() => `${String(new Date().getHours()).padStart(2, "0")}:00`);
  const scrollController = useMemo(
    () => createScrollControllerPlugin({ initialScroll }),
    [initialScroll],
  );

  const { theme } = useTheme();
  const [prefersDark] = useState(
    () => globalThis.matchMedia("(prefers-color-scheme: dark)").matches,
  );
  const systemTheme: "dark" | "light" = prefersDark ? "dark" : "light";
  const resolvedTheme: "dark" | "light" = theme === "system" ? systemTheme : theme;

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

  const mergedPlugins = useMemo(
    () => [scrollController, ...(plugins ?? [])],
    [scrollController, plugins],
  );

  const calendar = useCalendarApp({
    views,
    defaultView,
    weekOptions: { gridHeight: 1200 },
    dayBoundaries: { start: "08:00", end: "24:00" },
    events: calendarEvents,
    calendars,
    datePicker: DATE_PICKER_CONFIG,
    theme: "shadcn",
    isDark: resolvedTheme === "dark",
    timezone: PACIFIC_TZ,
    selectedDate: Temporal.Now.plainDateISO(PACIFIC_TZ),
    plugins: mergedPlugins,
    callbacks: {
      onEventClick: (calendarEvent, clickEvent) => {
        onEventClick(String(calendarEvent.id), clickEvent);
      },
    },
  });

  calendar?.setTheme(resolvedTheme);

  return (
    <div className={className}>
      <ScheduleXCalendar calendarApp={calendar} />
    </div>
  );
}

export function PublicEventsCalendarView({
  events,
  calendars,
  onSelect,
}: Readonly<PublicEventsCalendarProps>) {
  const views = useMemo<CalendarViews>(
    () => [createViewWeek(), createViewMonthGrid(), createViewDay(), createViewMonthAgenda()],
    [],
  );
  const handleEventClick = useCallback(
    (id: string, clickEvent: UIEvent) => {
      const target = clickEvent.currentTarget;
      if (target instanceof Element) {
        onSelect({ id, rect: target.getBoundingClientRect() });
      }
    },
    [onSelect],
  );

  return (
    <EventsCalendarCore
      events={events}
      calendars={calendars}
      views={views}
      defaultView="week"
      onEventClick={handleEventClick}
      className={PUBLIC_SHELL_CLASSES}
    />
  );
}

export function ManageEventsCalendarView({
  events,
  calendars,
  onOpen,
}: Readonly<ManageEventsCalendarProps>) {
  const views = useMemo<CalendarViews>(
    () => [createViewMonthGrid(), createViewWeek(), createViewDay(), createViewMonthAgenda()],
    [],
  );
  const calendarControls = useMemo(() => createCalendarControlsPlugin(), []);
  const plugins = useMemo(() => [calendarControls], [calendarControls]);

  const handlePrevMonth = useCallback(() => {
    calendarControls.setDate(calendarControls.getDate().subtract({ months: 1 }));
  }, [calendarControls]);
  const handleNextMonth = useCallback(() => {
    calendarControls.setDate(calendarControls.getDate().add({ months: 1 }));
  }, [calendarControls]);

  const handleEventClick = useCallback(
    (id: string) => {
      onOpen(id);
    },
    [onOpen],
  );

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
      <EventsCalendarCore
        events={events}
        calendars={calendars}
        views={views}
        defaultView="month-grid"
        plugins={plugins}
        onEventClick={handleEventClick}
        className={MANAGE_SHELL_CLASSES}
      />
    </div>
  );
}

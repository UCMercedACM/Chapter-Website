/// Types and Interfaces

import type { FullEvents } from "@/types/kanae.gen";

export type CheckInState = "ended" | "open" | "too_early";
export type EventView = "calendar" | "grid" | "list";
export type EventType = FullEvents["type"];


export interface DashboardEvent extends FullEvents {
  planned: boolean;
  attended: boolean;
}


interface EventTypeMeta {
  label: string;
  short: string;
  color: string;
  darkColor: string;
  containerTextColor: string;
}

interface EventTypeClasses {
  bar: string;
  chip: string;
  dot: string;
  label: string;
}

/// Constants

const mergeCache = new WeakMap<
  FullEvents,
  { attended: boolean; merged: DashboardEvent; planned: boolean }
>();

export const EVENT_TYPE_META: Record<EventType, EventTypeMeta> = {
  general: {
    label: "General",
    short: "GEN",
    color: "#2e7d9a",
    darkColor: "#5b9bd5",
    containerTextColor: "#246279",
  },
  sig_swe: {
    label: "SWE",
    short: "SWE",
    color: "#3da9fc",
    darkColor: "#6cbcff",
    containerTextColor: "#256698",
  },
  sig_ai: {
    label: "AI",
    short: "AI",
    color: "#00c9a7",
    darkColor: "#2fdcbb",
    containerTextColor: "#00715e",
  },
  sig_cyber: {
    label: "Cyber",
    short: "CYB",
    color: "#ff6b6b",
    darkColor: "#ff9a9a",
    containerTextColor: "#9f4343",
  },
  sig_data: {
    label: "Data",
    short: "DATA",
    color: "#f7b731",
    darkColor: "#ffd56b",
    containerTextColor: "#84621a",
  },
  sig_arch: {
    label: "Arch",
    short: "ARCH",
    color: "#fc5c7d",
    darkColor: "#ff8fa6",
    containerTextColor: "#a13b50",
  },
  sig_graph: {
    label: "Graphics",
    short: "GFX",
    color: "#a55eea",
    darkColor: "#c79bf2",
    containerTextColor: "#7844aa",
  },
  social: {
    label: "Social",
    short: "SOC",
    color: "#fd9644",
    darkColor: "#ffb37a",
    containerTextColor: "#915627",
  },
  misc: {
    label: "Misc",
    short: "MISC",
    color: "#93a3b6",
    darkColor: "#b4c2d2",
    containerTextColor: "#5a6470",
  },
};

export const EVENT_TYPE_CLASSES: Record<EventType, EventTypeClasses> = {
  general: {
    bar: "bg-[#2e7d9a]",
    chip: "text-[#2e7d9a] bg-[#2e7d9a]/10",
    dot: "bg-[#2e7d9a]",
    label: "text-[#2e7d9a] bg-[#2e7d9a]/15 border-[#2e7d9a]/40",
  },
  sig_swe: {
    bar: "bg-[#3da9fc]",
    chip: "text-[#3da9fc] bg-[#3da9fc]/10",
    dot: "bg-[#3da9fc]",
    label: "text-[#3da9fc] bg-[#3da9fc]/15 border-[#3da9fc]/40",
  },
  sig_ai: {
    bar: "bg-[#00c9a7]",
    chip: "text-[#00c9a7] bg-[#00c9a7]/10",
    dot: "bg-[#00c9a7]",
    label: "text-[#00c9a7] bg-[#00c9a7]/15 border-[#00c9a7]/40",
  },
  sig_cyber: {
    bar: "bg-[#ff6b6b]",
    chip: "text-[#ff6b6b] bg-[#ff6b6b]/10",
    dot: "bg-[#ff6b6b]",
    label: "text-[#ff6b6b] bg-[#ff6b6b]/15 border-[#ff6b6b]/40",
  },
  sig_data: {
    bar: "bg-[#f7b731]",
    chip: "text-[#f7b731] bg-[#f7b731]/10",
    dot: "bg-[#f7b731]",
    label: "text-[#f7b731] bg-[#f7b731]/15 border-[#f7b731]/40",
  },
  sig_arch: {
    bar: "bg-[#fc5c7d]",
    chip: "text-[#fc5c7d] bg-[#fc5c7d]/10",
    dot: "bg-[#fc5c7d]",
    label: "text-[#fc5c7d] bg-[#fc5c7d]/15 border-[#fc5c7d]/40",
  },
  sig_graph: {
    bar: "bg-[#a55eea]",
    chip: "text-[#a55eea] bg-[#a55eea]/10",
    dot: "bg-[#a55eea]",
    label: "text-[#a55eea] bg-[#a55eea]/15 border-[#a55eea]/40",
  },
  social: {
    bar: "bg-[#fd9644]",
    chip: "text-[#fd9644] bg-[#fd9644]/10",
    dot: "bg-[#fd9644]",
    label: "text-[#fd9644] bg-[#fd9644]/15 border-[#fd9644]/40",
  },
  misc: {
    bar: "bg-[#93a3b6]",
    chip: "text-[#93a3b6] bg-[#93a3b6]/10",
    dot: "bg-[#93a3b6]",
    label: "text-[#93a3b6] bg-[#93a3b6]/15 border-[#93a3b6]/40",
  },
};

export const EVENT_TYPES = Object.keys(EVENT_TYPE_META) as EventType[];

const HOUR_MS = 60 * 60 * 1000;

const DAY_FMT_OPTIONS: Intl.DateTimeFormatOptions = {
  weekday: "short",
  month: "short",
  day: "numeric",
};

/// Helpers

export function mergeDashboardEvent(
  event: FullEvents,
  planned: boolean,
  attended: boolean,
): DashboardEvent {
  const cached = mergeCache.get(event);
  if (cached?.planned === planned && cached.attended === attended) return cached.merged;
  const merged: DashboardEvent = { ...event, planned, attended };
  mergeCache.set(event, { attended, merged, planned });
  return merged;
}

export function filterEvents(
  events: DashboardEvent[],
  type: "all" | EventType,
  query: string,
): DashboardEvent[] {
  const normalizedQuery = query.toLowerCase();
  return events
    .filter((event) => type === "all" || event.type === type)
    .filter((event) =>
      `${event.name} ${event.description} ${event.location} ${(event.tags ?? []).join(" ")}`
        .toLowerCase()
        .includes(normalizedQuery),
    )
    .toSorted((a, b) => a.start_at.localeCompare(b.start_at));
}

// Check-in runs from 1h before start through end
export function determineCheckIn(event: FullEvents, now: Date): CheckInState {
  const start = new Date(event.start_at).getTime();
  const end = new Date(event.end_at).getTime();
  const currentTime = now.getTime();
  if (currentTime < start - HOUR_MS) return "too_early";
  if (currentTime > end) return "ended";
  return "open";
}

export function isPastEvent(event: FullEvents, now: Date): boolean {
  return new Date(event.end_at).getTime() < now.getTime();
}

function formatter(timeZone: string, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("en-US", { ...options, timeZone });
}

export function fmtDay(iso: string, timeZone: string, options = DAY_FMT_OPTIONS) {
  return formatter(timeZone, options).format(new Date(iso));
}

export function fmtClock(iso: string, timeZone: string) {
  return formatter(timeZone, { hour: "numeric", minute: "2-digit" }).format(new Date(iso));
}

export function monthDay(iso: string, timeZone: string) {
  const parts = formatter(timeZone, { month: "short", day: "numeric" }).formatToParts(
    new Date(iso),
  );
  const find = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";
  return { mon: find("month").toUpperCase(), day: find("day") };
}

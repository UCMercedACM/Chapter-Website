import type { ManageEventsCalendarProps, PublicEventsCalendarProps } from "./events-calendar-core";

import { lazy, Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";

// To aid in performance, we MUST lazy-load our calendar components
// In addition, the calendar core logic is put in events-calendar-core.tsx
// to not keep it in our critical path, and reduce ~60KiB JS + CSS
const LazyPublicView = lazy(async () => {
  const { PublicEventsCalendarView } = await import("./events-calendar-core");
  return { default: PublicEventsCalendarView };
});
const LazyManageView = lazy(async () => {
  const { ManageEventsCalendarView } = await import("./events-calendar-core");
  return { default: ManageEventsCalendarView };
});

export function PublicEventsCalendar(props: Readonly<PublicEventsCalendarProps>) {
  return (
    <Suspense fallback={<Skeleton className="min-h-0 w-full flex-1 rounded-3xl" />}>
      <LazyPublicView {...props} />
    </Suspense>
  );
}

export function ManageEventsCalendar(props: Readonly<ManageEventsCalendarProps>) {
  return (
    <Suspense fallback={<Skeleton className="h-160 w-full rounded-[20px]" />}>
      <LazyManageView {...props} />
    </Suspense>
  );
}

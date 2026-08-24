import { queryOptions, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import axios from "axios";
import { Calendar, Folder, Shield, Tag, Users } from "lucide-react";
import { lazy, Suspense, useMemo } from "react";

import { StatTile } from "@/components/app/dashboard-events";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { isPastEvent } from "@/lib/dashboard-events";
import { type FullEvents, type MemberRoles, type Role } from "@/types/kanae.gen";
import { type KanaePage } from "@/types/pages";

export const Route = createFileRoute("/dashboard/admin/overview")({
  component: OverviewPage,
  staticData: {
    area: "Admin",
    title: "Overview",
    sub: "A brief overview of the chapter's members and data",
  },
  loader: async ({ context: { queryClient } }) => {
    await queryClient.query({ ...overviewMembersQueryOptions, staleTime: "static" });
    await queryClient.query({ ...overviewProjectsQueryOptions, staleTime: "static" });
    await queryClient.query({ ...overviewEventsQueryOptions, staleTime: "static" });
    await queryClient.query({ ...overviewTagsQueryOptions, staleTime: "static" });
  },
});

/// Types and Interfaces

interface OverviewMember {
  id: string;
  roles: Role[];
}

interface OverviewProject {
  id: string;
  active: boolean;
}

interface RoleBucket {
  key: "admins" | "managers" | "leads" | "members";
  label: string;
  match: (roles: Role[]) => boolean;
}

interface RoleCount {
  key: RoleBucket["key"];
  label: string;
  count: number;
  fill: string;
}

interface RoleChartProps {
  data: RoleCount[];
}

/// Constants — data (chart buckets + config)

const ROLE_BUCKETS: RoleBucket[] = [
  {
    key: "admins",
    label: "Admins",
    match: (roles) => roles.includes("admin"),
  },
  {
    key: "managers",
    label: "Managers",
    match: (roles) => roles.includes("manager"),
  },
  {
    key: "leads",
    label: "Leads",
    match: (roles) => roles.includes("leads"),
  },
  {
    key: "members",
    label: "Members",
    match: () => true,
  },
];

/// Constants - stable/empty data

const EMPTY_ROLES: Role[] = [];
const EMPTY_MEMBERS: OverviewMember[] = [];

/// Constants - metadata and presentation

const CHART_CONFIG: ChartConfig = {
  admins: { label: "Admins", theme: { light: "#084778", dark: "#7fc4ff" } },
  managers: { label: "Managers", theme: { light: "#3da9fc", dark: "#3da9fc" } },
  leads: { label: "Leads", theme: { light: "#078c79", dark: "#2fead0" } },
  members: { label: "Members", theme: { light: "#94a3b8", dark: "#64748b" } },
};
const CHART_MARGIN = { left: 8 } as const;
const CHART_BAR_BACKGROUND = { fill: "var(--muted)", radius: 6 } as const;

/// Constants — regular

const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:8000";
const MEMBERS_PAGE_SIZE = 100;
const PROJECTS_PAGE_SIZE = 100;
const EVENTS_PAGE_SIZE = 50;
const CARD_CLASS =
  "rounded-[18px] border border-border bg-card shadow-[0px_4px_14px_rgba(112,144,176,0.14)] dark:shadow-[0px_4px_14px_rgba(0,0,0,0.4)]";

/// Tanstack Query options

const overviewMembersQueryOptions = queryOptions({
  queryKey: ["overview", "members"],
  queryFn: async () => {
    const members: OverviewMember[] = [];
    let more = true;
    while (more) {
      const { data } = await axios.get<KanaePage<{ id: string }>>(`${API_BASE_URL}/members`, {
        params: { page: members.length / MEMBERS_PAGE_SIZE + 1, size: MEMBERS_PAGE_SIZE },
      });
      for (const { id } of data.data ?? []) {
        const { data: memberRoles } = await axios
          .get<MemberRoles>(`${API_BASE_URL}/members/${id}/roles`)
          .catch(() => ({ data: { roles: EMPTY_ROLES } }));
        members.push({ id, roles: memberRoles.roles });
      }
      more = members.length < data.total;
    }
    return members;
  },
});

const overviewProjectsQueryOptions = queryOptions({
  queryKey: ["overview", "projects"],
  queryFn: async () => {
    const projects: OverviewProject[] = [];
    let more = true;
    while (more) {
      const { data } = await axios.get<KanaePage<OverviewProject>>(`${API_BASE_URL}/projects`, {
        params: { page: projects.length / PROJECTS_PAGE_SIZE + 1, size: PROJECTS_PAGE_SIZE },
      });
      projects.push(...(data.data ?? []));
      more = projects.length < data.total;
    }
    return projects.filter((project) => project.active).length;
  },
});

const overviewEventsQueryOptions = queryOptions({
  queryKey: ["overview", "events"],
  queryFn: async () => {
    const now = new Date();
    const events: FullEvents[] = [];
    let more = true;
    while (more) {
      const { data } = await axios.get<KanaePage<FullEvents>>(`${API_BASE_URL}/events`, {
        params: { page: events.length / EVENTS_PAGE_SIZE + 1, size: EVENTS_PAGE_SIZE },
      });
      events.push(...(data.data ?? []));
      more = events.length < data.total;
    }
    return events.filter((event) => !isPastEvent(event, now)).length;
  },
});

const overviewTagsQueryOptions = queryOptions({
  queryKey: ["overview", "tags"],
  queryFn: async () => {
    // We only care about the array, so unknown is fine here
    const { data } = await axios.get<unknown[]>(`${API_BASE_URL}/tags`);
    return data.length;
  },
});

/// Route components

// Recharts is heavy, so we lazy load it instead for "performance" reasons
const RoleChart = lazy(async () => {
  const { Bar, BarChart, XAxis, YAxis } = await import("recharts");
  const { ChartContainer, ChartTooltip, ChartTooltipContent } =
    await import("@/components/ui/chart");

  return {
    default: ({ data }: Readonly<RoleChartProps>) => (
      <ChartContainer config={CHART_CONFIG} className="aspect-auto h-56 w-full">
        <BarChart accessibilityLayer data={data} layout="vertical" margin={CHART_MARGIN}>
          <XAxis type="number" dataKey="count" allowDecimals={false} hide />
          <YAxis
            dataKey="label"
            type="category"
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            width={80}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel nameKey="key" />} />
          <Bar dataKey="count" barSize={12} radius={6} background={CHART_BAR_BACKGROUND} />
        </BarChart>
      </ChartContainer>
    ),
  };
});

/// Route

function OverviewPage() {
  const { data: members, isPending: membersPending } = useQuery(overviewMembersQueryOptions);
  const { data: activeProjects, isPending: projectsPending } = useQuery(
    overviewProjectsQueryOptions,
  );
  const { data: upcomingEvents, isPending: eventsPending } = useQuery(overviewEventsQueryOptions);
  const { data: tagCount, isPending: tagsPending } = useQuery(overviewTagsQueryOptions);

  const allMembers = members ?? EMPTY_MEMBERS;

  const roleChartData = useMemo<RoleCount[]>(() => {
    const bucketKeys = allMembers.map(
      (member) => ROLE_BUCKETS.find((bucket) => bucket.match(member.roles))?.key,
    );
    return ROLE_BUCKETS.map((bucket) => ({
      key: bucket.key,
      label: bucket.label,
      count: bucketKeys.filter((key) => key === bucket.key).length,
      fill: `var(--color-${bucket.key})`,
    }));
  }, [allMembers]);

  const isPending = membersPending || projectsPending || eventsPending || tagsPending;
  const withRoles = allMembers.filter((member) => member.roles.length > 0).length;

  return (
    <div className="flex flex-col gap-5.5">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {isPending ? (
          Array.from({ length: 5 }, (_, index) => (
            <Skeleton key={index} className="h-28 rounded-[20px]" />
          ))
        ) : (
          <>
            <StatTile icon={Users} value={allMembers.length} label="Registered members" />
            <StatTile
              icon={Shield}
              value={withRoles}
              label="Hold a global role"
              accentClassName="bg-[#084778]/12 text-[#084778] dark:text-[#7fc4ff]"
            />
            <StatTile
              icon={Folder}
              value={activeProjects ?? 0}
              label="Active projects"
              accentClassName="bg-brand-sky/15 text-brand-sky"
            />
            <StatTile
              icon={Calendar}
              value={upcomingEvents ?? 0}
              label="Upcoming events"
              accentClassName="bg-[#15a66e]/15 text-[#15a66e] dark:text-[#3fd68c]"
            />
            <StatTile
              icon={Tag}
              value={tagCount ?? 0}
              label="Tags in taxonomy"
              accentClassName="bg-[#a55eea]/15 text-[#7844aa] dark:text-[#c79bf2]"
            />
          </>
        )}
      </div>

      {isPending ? (
        <Skeleton className="h-80 rounded-[18px]" />
      ) : (
        <Card className={CARD_CLASS}>
          <CardHeader>
            <CardTitle className="text-[17px] font-bold tracking-tight text-foreground">
              Role distribution
            </CardTitle>
            <CardDescription>Members bucketed by their highest role</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Skeleton className="h-64 w-full rounded-xl" />}>
              <RoleChart data={roleChartData} />
            </Suspense>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

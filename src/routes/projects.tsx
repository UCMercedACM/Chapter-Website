import { queryOptions, useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import axios from "axios";
import { Search } from "lucide-react";
import { useCallback, useMemo, useState, type ChangeEvent } from "react";

import sigCard1 from "@/assets/images/sig-card-1.png";
import sigCard2 from "@/assets/images/sig-card-2.png";
import sigCard3 from "@/assets/images/sig-card-3.png";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/// Types & Interfaces

// Mirrors the FullProjects model exposed by the Kanae /projects endpoint.
type ProjectType =
  | "independent"
  | "sig_ai"
  | "sig_swe"
  | "sig_cyber"
  | "sig_data"
  | "sig_arch"
  | "sig_graph";

type FilterKey = "all" | ProjectType;
type ActiveFilter = "all" | "active" | "archived";

interface ProjectMember {
  id: string;
  name: string;
}

interface ApiProject {
  id: string;
  name: string;
  description: string;
  link: string;
  members: ProjectMember[];
  type: ProjectType;
  tags?: string[];
  active: boolean;
  founded_at: string;
}

interface ProjectsPage {
  data: ApiProject[];
  total: number;
}

/// Module-scoped constants

const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:8000";

const SHORT_DATE_FMT = new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" });

const ACTIVE_FILTER_OPTIONS: readonly { value: ActiveFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "● Active" },
  { value: "archived", label: "○ Archived" },
];

// Single source of truth for filter pills (iteration order) AND per-type
// meta lookups in cards/dialogs (via .find on the key). The "all" entry only
// appears in filter pills — `project.type` is always one of the SIG keys, so
// lookups against it always resolve to a real entry.
const PROJECT_TYPES = [
  { key: "all", label: "All Projects", colorClass: "[--type-color:var(--foreground)]" },
  { key: "independent", label: "Independent", colorClass: "[--type-color:var(--foreground)]" },
  { key: "sig_swe", label: "SWE", colorClass: "[--type-color:var(--sig-swe)]" },
  { key: "sig_ai", label: "AI", colorClass: "[--type-color:var(--sig-ai)]" },
  { key: "sig_cyber", label: "Cyber", colorClass: "[--type-color:var(--sig-cyber)]" },
  { key: "sig_data", label: "Data", colorClass: "[--type-color:var(--sig-data)]" },
  { key: "sig_graph", label: "Graph", colorClass: "[--type-color:var(--sig-graph)]" },
  { key: "sig_arch", label: "Arch", colorClass: "[--type-color:var(--sig-arch)]" },
] as const satisfies readonly {
  readonly key: FilterKey;
  readonly label: string;
  readonly colorClass: string;
}[];

// Cycled across projects so each card gets a different cover. Cover images are a
// UI-only concern — the API does not return one.
const CARD_IMGS = [sigCard1, sigCard2, sigCard3] as const;

const GRID_CLASSES = cn("grid grid-cols-1 gap-3.5", "md:grid-cols-2 md:gap-5 lg:grid-cols-3");
// Overrides on top of shadcn Card defaults (gap-6, rounded-xl, py-6, shadow-xs)
// so the project tiles match the chapter design tokens.
const CARD_VISUAL_CLASSES = cn(
  "gap-3.5 rounded-3xl py-0",
  "shadow-[0px_16px_40px_rgba(112,144,176,0.2)]",
);

/// Helpers — Tanstack Query hierarchical key factory + shared options
/// (https://tkdodo.eu/blog/effective-react-query-keys)

const projectsKeys = {
  all: ["projects"] as const,
  lists: () => [...projectsKeys.all, "list"] as const,
  list: (params: Record<string, unknown>) => [...projectsKeys.lists(), params] as const,
};

const projectsQueryOptions = queryOptions({
  queryKey: projectsKeys.list({}),
  queryFn: async () => {
    const { data } = await axios.get<ProjectsPage>(`${API_BASE_URL}/projects`);
    return data;
  },
  // Projects don't change minute-to-minute; treat the cache as fresh for a minute so
  // navigating back/forward doesn't refetch immediately.
  staleTime: 60_000,

  // Once Kanae is live, then these will be removed
  // So we don't send out a ton of API requests for no reason
  retry: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  refetchOnMount: false,
});

/// Route

export const Route = createFileRoute("/projects")({
  component: Projects,
  loader: ({ context: { queryClient } }) => queryClient.prefetchQuery(projectsQueryOptions),
});

function Projects() {
  const { data: projectsPage, isLoading } = useQuery(projectsQueryOptions);
  const projects = projectsPage?.data;

  const [filter, setFilter] = useState<FilterKey>("all");
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>("active");
  const [search, setSearch] = useState("");

  // Each entry carries a pre-built `linkParams` object so the per-card <Link>'s
  // `params` prop is a stable reference — avoids `react-perf/jsx-no-new-object-as-prop`
  // without inline closures or `event.currentTarget` lookups. Rebuilds only when
  // the underlying projects or filter inputs change.
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return (projects ?? [])
      .filter(
        (project) =>
          (filter === "all" || project.type === filter) &&
          (activeFilter === "all" || project.active === (activeFilter === "active")) &&
          (!query ||
            project.name.toLowerCase().includes(query) ||
            project.description.toLowerCase().includes(query) ||
            (project.tags?.some((t) => t.toLowerCase().includes(query)) ?? false)),
      )
      .map((project) => ({
        project,
        linkParams: { projectId: project.id },
      }));
  }, [projects, filter, activeFilter, search]);

  // One stable handler per filter key, built once. JSX references
  // `entry.onSelect` directly — no inline closures, no data-attribute lookups.
  const filterEntries = useMemo(
    () =>
      PROJECT_TYPES.map((option) => ({
        option,
        onSelect: () => {
          setFilter(option.key);
        },
      })),
    [],
  );

  const handleSearchChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  }, []);

  // Widened to `unknown` because base-ui's Select types its `onValueChange`
  // value as `Value | null` and the `unicorn/no-null` rule forbids the literal.
  // Contravariant parameters let this satisfy the prop's narrower signature.
  const handleActiveFilterChange = useCallback((value: unknown) => {
    if (value === "all" || value === "active" || value === "archived") {
      setActiveFilter(value);
    }
  }, []);

  const hasResults = filtered.length > 0;

  return (
    <div className="bg-background">
      <section
        className={cn(
          "relative flex w-full items-center justify-center overflow-hidden",
          "h-35 md:h-65",
        )}
      >
        <div className="absolute inset-0 bg-[url(@/assets/images/hero-bg.jpg)] bg-cover bg-top bg-no-repeat" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,71,120,0.62)_0%,rgba(8,71,120,0.68)_60%,rgba(8,71,120,0.85)_100%)]" />
        <div className="relative z-2 px-6 text-center">
          <h1
            className={cn(
              "leading-[1.1] font-extrabold text-brand-text-hero",
              "text-[28px] md:text-[52px]",
            )}
          >
            Project Showcase
          </h1>
          <p
            className={cn(
              "text-brand-text-hero/75",
              "mx-auto mt-3 max-w-130 text-[13px] md:text-[17px]",
            )}
          >
            Explore what our members are building across every SIG.
          </p>
        </div>
      </section>

      <div className="border-b-2 border-border bg-card shadow-[0_4px_20px_rgba(112,144,176,0.1)]">
        <div className={cn("mx-auto flex max-w-300 flex-col gap-5", "px-4 py-4 md:px-12 md:py-5")}>
          <div
            role="tablist"
            aria-label="Filter by type"
            className="flex flex-wrap items-center justify-center gap-1.5"
          >
            {filterEntries.map(({ option, onSelect }) => {
              const isActive = filter === option.key;
              return (
                <Button
                  key={option.key}
                  variant="ghost"
                  role="tab"
                  aria-selected={isActive}
                  data-active={isActive}
                  onClick={onSelect}
                  className={cn(
                    option.colorClass,
                    // Overrides on shadcn Button defaults — h-auto + bg-transparent
                    // peel the variant styles back, then we layer the original
                    // filter-pill look on top so this matches the previous <button>.
                    "h-auto cursor-pointer rounded-full border border-transparent bg-transparent",
                    "px-3.5 py-1.5 text-[11px] font-bold tracking-wider md:text-xs",
                    "text-brand-text-sub hover:bg-transparent hover:text-foreground",
                    "data-[active=true]:bg-(--type-color) data-[active=true]:text-background",
                    "data-[active=true]:shadow-[0_4px_12px_color-mix(in_srgb,var(--type-color)_26%,transparent)]",
                  )}
                >
                  {option.label}
                </Button>
              );
            })}
          </div>

          <div className="flex w-full items-center gap-2.5">
            <div className="relative min-w-0 flex-1">
              <Search className="absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                value={search}
                onChange={handleSearchChange}
                placeholder="Search projects…"
                aria-label="Search projects"
                className="h-9 rounded-full border border-border bg-input pl-8.5 text-[13px]"
              />
            </div>
            <Select
              value={activeFilter}
              onValueChange={handleActiveFilterChange}
              // Non-modal: base-ui skips the body scroll-lock + padding-right
              // compensation that was exposing a strip of html on the right.
              modal={false}
            >
              <SelectTrigger
                aria-label="Status filter"
                className={cn(
                  "h-9 w-32 shrink-0 rounded-full border border-border bg-input",
                  "gap-2 px-3.5 text-[13px] font-bold text-foreground",
                )}
              >
                <SelectValue>
                  {(value: unknown) =>
                    ACTIVE_FILTER_OPTIONS.find((option) => option.value === value)?.label ?? ""
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent
                // Drop straight below the trigger instead of vertically centring
                // the selected item over it (base-ui's default behaviour).
                alignItemWithTrigger={false}
                className="min-w-32 rounded-xl p-1"
              >
                {ACTIVE_FILTER_OPTIONS.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="rounded-md text-[13px] font-semibold"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <section
        className={cn(
          "mx-auto max-w-300 px-4 pt-8 pb-12 md:px-12 md:pt-12 md:pb-20",
          "[contain-intrinsic-size:auto_900px] [content-visibility:auto]",
        )}
      >
        <div className="mb-6 text-[13px] text-muted-foreground">
          {isLoading
            ? "Loading projects…"
            : `${String(filtered.length)} project${filtered.length === 1 ? "" : "s"} found`}
        </div>

        {isLoading && (
          <div className={GRID_CLASSES}>
            {Array.from({ length: 6 }, (_, i) => (
              <Card key={i} className={CARD_VISUAL_CLASSES}>
                <Skeleton className="h-32 w-full rounded-none md:h-37" />
                <div className="flex flex-col gap-3 px-6 pb-6">
                  <Skeleton className="h-4 w-20 rounded-full" />
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-5/6" />
                  <Skeleton className="h-8 w-full" />
                </div>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && !hasResults && (
          <div className="py-20 text-center text-base text-muted-foreground">
            No projects exists
          </div>
        )}

        {!isLoading && hasResults && (
          <div className={GRID_CLASSES}>
            {filtered.map(({ project, linkParams }, index) => {
              const meta =
                PROJECT_TYPES.find((type) => type.key === project.type) ?? PROJECT_TYPES[0];
              const extraMembers = project.members.length - 3;
              const coverSrc = CARD_IMGS[index % CARD_IMGS.length];
              return (
                // <Link> handles Enter/Space activation + focus rings natively;
                // `group` lets the inner Card mirror this link's focus-visible
                // state for the hover-lift animation.
                <Link
                  key={project.id}
                  to="/project/$projectId"
                  params={linkParams}
                  aria-label={`Open ${project.name} details`}
                  className={cn(
                    "group block w-full cursor-pointer rounded-3xl text-left",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                  )}
                >
                  <Card
                    className={cn(
                      meta.colorClass,
                      CARD_VISUAL_CLASSES,
                      // Transform-only transition keeps the hover-lift on the compositor;
                      // box-shadow snaps instantly (transitioning it forces a paint per
                      // frame). No permanent `will-change` — promoting every grid card to
                      // its own layer inflates layerization/compositing on each filter
                      // change for no real benefit (transforms composite without the hint).
                      "transition-transform duration-200",
                      "hover:-translate-y-0.5 hover:shadow-[0px_24px_50px_rgba(112,144,176,0.3)]",
                      "group-focus-visible:-translate-y-0.5 group-focus-visible:shadow-[0px_24px_50px_rgba(112,144,176,0.3)]",
                    )}
                  >
                    <div className="relative h-32 w-full overflow-hidden bg-(--type-color)/15 md:h-37">
                      <img
                        src={coverSrc}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <span
                        className={cn(
                          "absolute top-2.5 right-2.5 rounded-full px-2.5 py-0.75",
                          "text-[10px] font-bold tracking-wide",
                          // Solid bg instead of backdrop-blur — blur per badge × 9 cards
                          // forces a paint region per badge whenever underlying pixels
                          // shift (e.g. when a modal opens and a scrollbar reflows).
                          "bg-black/70",
                          project.active ? "text-sig-ai" : "text-muted-foreground",
                        )}
                      >
                        {project.active ? "● Active" : "○ Archived"}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col gap-3.5 px-6 pb-6">
                      <span
                        className={cn(
                          "self-start rounded-full px-2.5 py-0.75",
                          "text-[10px] font-bold tracking-wide uppercase",
                          "border border-(--type-color)/30 bg-(--type-color)/15 text-(--type-color)",
                        )}
                      >
                        {meta.label}
                      </span>

                      <h3 className="text-base leading-tight font-extrabold text-foreground md:text-lg">
                        {project.name}
                      </h3>

                      <p className="line-clamp-3 flex-1 text-[13px] leading-[1.65] text-brand-text-sub">
                        {project.description}
                      </p>

                      {project.tags && project.tags.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {project.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className={cn(
                                "rounded-full border border-border bg-background",
                                "px-2 py-0.5 text-[10px] font-semibold text-foreground",
                              )}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      ) : undefined}

                      <div className="flex items-center justify-between gap-2 border-t border-border pt-3">
                        <div className="flex items-center">
                          {project.members.slice(0, 3).map((member, memberIndex) => (
                            <Avatar
                              key={member.id}
                              aria-hidden="true"
                              className={cn(
                                "size-6.5 border-2 border-card text-[10px] after:hidden",
                                memberIndex > 0 && "-ml-2",
                              )}
                            >
                              <AvatarFallback className="bg-(--type-color)/20 text-[1em] font-bold text-(--type-color)">
                                {member.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                          {extraMembers > 0 ? (
                            <span className="ml-1.5 text-[11px] text-muted-foreground">
                              +{extraMembers}
                            </span>
                          ) : undefined}
                        </div>
                        <span className="text-[11px] text-muted-foreground">
                          {SHORT_DATE_FMT.format(new Date(project.founded_at))}
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

import { SiGithub } from "@icons-pack/react-simple-icons";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import axios from "axios";
import { ChevronLeft, Maximize2, Play } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import { MediaLightbox } from "@/components/app/media-lightbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { type MediaRecord, type ProjectDetails } from "@/types/kanae.gen";

export const Route = createFileRoute("/project/$projectId")({
  component: Project,
  loader: async ({ context: { queryClient }, params: { projectId } }) => {
    await queryClient.query({ ...projectDetailQueryOptions(projectId), staleTime: "static" });
  },
});

/// Types and Interfaces

type ProjectType = ProjectDetails["type"];

/// Module-scoped constants

const PROJECT_TYPES: Record<ProjectType, { colorClass: string; label: string }> = {
  independent: { label: "Independent", colorClass: "[--type-color:var(--foreground)]" },
  sig_swe: { label: "SWE", colorClass: "[--type-color:var(--sig-swe)]" },
  sig_ai: { label: "AI", colorClass: "[--type-color:var(--sig-ai)]" },
  sig_cyber: { label: "Cyber", colorClass: "[--type-color:var(--sig-cyber)]" },
  sig_data: { label: "Data", colorClass: "[--type-color:var(--sig-data)]" },
  sig_graph: { label: "Graph", colorClass: "[--type-color:var(--sig-graph)]" },
  sig_arch: { label: "Arch", colorClass: "[--type-color:var(--sig-arch)]" },
};

const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:8000";

const CAROUSEL_OPTS = { align: "start" } as const;

const FULL_DATE_FMT = new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long" });

/// Tanstack Query keys

const projectKeys = {
  all: ["project"] as const,
  detail: (projectId: string) => [...projectKeys.all, projectId, "detail"] as const,
};

const projectDetailQueryOptions = (projectId: string) =>
  queryOptions({
    queryKey: projectKeys.detail(projectId),
    queryFn: async () => {
      const { data } = await axios.get<ProjectDetails>(`${API_BASE_URL}/projects/${projectId}`);
      return data;
    },
    staleTime: 60_000,

    // Once Kanae is live, then these will be removed
    // So we don't send out a ton of API requests for no reason
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

/// Route Component

function Project() {
  const { projectId } = Route.useParams();
  const { data: project, isLoading: isProjectLoading } = useQuery(
    projectDetailQueryOptions(projectId),
  );

  const [lightboxIndex, setLightboxIndex] = useState<number>();

  const mediaItems = useMemo(() => project?.media ?? [], [project?.media]);

  const mediaEntries = useMemo(
    () =>
      mediaItems.map((item, index) => ({
        item,
        onSelect: () => {
          setLightboxIndex(index);
        },
      })),
    [mediaItems],
  );

  const handleLightboxClose = useCallback(() => {
    setLightboxIndex(undefined);
  }, []);
  const mediaSrc = useCallback((item: MediaRecord) => item.url, []);

  const meta = project ? PROJECT_TYPES[project.type] : undefined;

  return (
    <div className="bg-background">
      <div className="mx-auto max-w-225 px-4 pt-6 md:px-12 md:pt-10">
        <Link
          to="/projects"
          className={cn(
            "inline-flex items-center gap-1.5 text-[13px] font-semibold",
            "text-brand-text-sub transition-colors hover:text-foreground",
          )}
        >
          <ChevronLeft className="size-4" />
          Back to Projects
        </Link>
      </div>

      <article
        className={cn(
          "mx-auto max-w-225 px-4 py-8 md:p-12",
          "[contain-intrinsic-size:auto_900px] [content-visibility:auto]",
          meta?.colorClass,
        )}
      >
        {isProjectLoading && (
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2.5">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
              <Skeleton className="h-8 w-28 rounded-full" />
            </div>
            <Skeleton className="mt-2 h-9 w-2/3 rounded-md" />
            <Skeleton className="h-1 w-12 rounded-full" />
            <div className="mt-2 flex flex-col gap-2">
              <Skeleton className="h-4 w-full rounded-sm" />
              <Skeleton className="h-4 w-11/12 rounded-sm" />
              <Skeleton className="h-4 w-3/4 rounded-sm" />
            </div>
          </div>
        )}

        {!isProjectLoading && (!project || !meta) && (
          <div className="py-16 text-center text-base text-muted-foreground">
            Project not found.
          </div>
        )}

        {!isProjectLoading && project && meta && (
          <>
            <header className="flex flex-col gap-2.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.75",
                    "text-[11px] font-bold tracking-wide uppercase",
                    "border border-(--type-color)/30 bg-(--type-color)/15 text-(--type-color)",
                  )}
                >
                  {meta.label}
                </span>
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.75",
                    "text-[11px] font-bold tracking-wide uppercase",
                    project.active
                      ? "border border-sig-ai/30 bg-sig-ai/15 text-sig-ai"
                      : "border border-border bg-muted text-muted-foreground",
                  )}
                >
                  <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
                  {project.active ? "Active" : "Archived"}
                </span>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className={cn(
                    "size-7 rounded-full text-foreground/80",
                    "hover:bg-muted hover:text-foreground",
                  )}
                  render={
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="View on GitHub"
                    />
                  }
                >
                  <SiGithub size={24} />
                </Button>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <ul aria-label="Members" className="flex flex-wrap items-center gap-1.5">
                  {project.members.map((member) => (
                    <li
                      key={member.id}
                      className={cn(
                        "flex items-center gap-1.5 rounded-full border border-border bg-card",
                        "px-2 py-1",
                      )}
                    >
                      <Avatar aria-hidden="true" className="size-5 text-[10px] after:hidden">
                        <AvatarFallback className="bg-(--type-color)/20 text-[1em] font-bold text-(--type-color)">
                          {member.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-[11px] font-semibold text-foreground">
                        {member.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </header>

            {project.thumbnail ? (
              <img
                src={project.thumbnail.url}
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
              {project.name}
            </h1>

            {project.tags && project.tags.length > 0 ? (
              <ul aria-label="Technologies" className="mt-3 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
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
              <div className="mb-2.5 text-[11px] font-bold tracking-[0.08em] text-muted-foreground uppercase">
                Description
              </div>
              <p className={cn("leading-[1.85] text-brand-text-sub", "text-[15px] md:text-[17px]")}>
                {project.description}
              </p>
            </section>

            {mediaEntries.length > 0 ? (
              <section className="mt-8">
                <Carousel opts={CAROUSEL_OPTS} className="w-full">
                  <header className="mb-4 flex items-center justify-between gap-3">
                    <div className="text-[11px] font-bold tracking-[0.08em] text-muted-foreground uppercase">
                      Media
                    </div>
                    <div className="flex gap-2">
                      <CarouselPrevious className="static translate-y-0" />
                      <CarouselNext className="static translate-y-0" />
                    </div>
                  </header>
                  <CarouselContent className="-ml-4">
                    {mediaEntries.map(({ item, onSelect }) => (
                      <CarouselItem
                        key={item.hash}
                        className="basis-full pl-4 md:basis-1/2 xl:basis-1/3"
                      >
                        {item.kind === "video" ? (
                          <div className="group relative overflow-hidden rounded-2xl border border-border bg-card">
                            <video
                              src={item.url}
                              controls
                              preload="metadata"
                              className="aspect-video w-full bg-black object-contain"
                            >
                              <track
                                default
                                kind="captions"
                                srcLang="en"
                                label="Captions unavailable"
                              />
                            </video>
                            <div
                              className={cn(
                                "pointer-events-none absolute top-2.5 left-2.5 flex items-center gap-1 rounded-full",
                                "bg-black/60 px-2 py-0.5 text-[10px] font-bold tracking-wide text-white uppercase",
                              )}
                            >
                              <Play className="size-2.5" />
                              Video
                            </div>
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              onClick={onSelect}
                              aria-label="View at full size"
                              className={cn(
                                "absolute top-2.5 right-2.5 z-10 rounded-full",
                                "bg-black/60 text-white",
                                "hover:bg-black/80 hover:text-white",
                              )}
                            >
                              <Maximize2 className="size-3" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="ghost"
                            onClick={onSelect}
                            aria-label="View at full size"
                            className={cn(
                              "group relative block h-auto w-full gap-0 overflow-hidden p-0",
                              "rounded-2xl border border-border bg-card",
                              "hover:bg-card",
                              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                            )}
                          >
                            <img
                              src={item.url}
                              alt=""
                              loading="lazy"
                              decoding="async"
                              className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                            />
                            <span
                              aria-hidden="true"
                              className={cn(
                                "pointer-events-none absolute top-2.5 right-2.5 inline-flex items-center justify-center",
                                "rounded-full bg-black/50 p-1.5 text-white opacity-50",
                                "transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100",
                              )}
                            >
                              <Maximize2 className="size-3" />
                            </span>
                          </Button>
                        )}
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
              </section>
            ) : undefined}

            <footer className="mt-8 border-t border-border pt-5 text-xs text-muted-foreground">
              Founded {FULL_DATE_FMT.format(new Date(project.founded_at))}
            </footer>
          </>
        )}
      </article>

      <MediaLightbox
        items={mediaItems}
        index={lightboxIndex}
        srcFor={mediaSrc}
        onIndexChange={setLightboxIndex}
        onClose={handleLightboxClose}
      />
    </div>
  );
}

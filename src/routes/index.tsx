import { SiDiscord, SiGithub, SiInstagram, type IconType } from "@icons-pack/react-simple-icons";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import axios from "axios";
import { ChevronDown, Clock, MapPin } from "lucide-react";
import { useMemo, type CSSProperties } from "react";

import beginningsLogo from "@/assets/images/beginnings-logo.png";
import sigAiLogo from "@/assets/logos/sigs/ai.svg";
import sigArchLogo from "@/assets/logos/sigs/arch.svg";
import sigCyberLogo from "@/assets/logos/sigs/cyber.svg";
import sigDataLogo from "@/assets/logos/sigs/data.svg";
import sigGraphLogo from "@/assets/logos/sigs/graph.svg";
import sigSweLogo from "@/assets/logos/sigs/swe.svg";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { EVENT_TYPE_CLASSES, EVENT_TYPE_META, fmtClock, monthDay } from "@/lib/dashboard-events";
import { cn } from "@/lib/utils";
import { type FullEvents } from "@/types/kanae.gen";
import { type KanaePage } from "@/types/pages";

export const Route = createFileRoute("/")({
  component: Index,
  loader: ({ context: { queryClient } }) => queryClient.prefetchQuery(eventsQueryOptions),
});

/// Interfaces & Types


interface SocialLink {
  label: string;
  Icon: IconType;
  style: CSSProperties;
}

/// Module-scoped Constants

const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:8000";

const CAROUSEL_NAV_CLASS = "static size-9 translate-0";

const PAGE_LOADED_AT = new Date().toISOString();

// One transform class shared by every tile. Per-tile angle is supplied via the
// --tile-angle CSS variable (set by `angleClass` below), and CSS cos()/sin() compute
// the orbital position relative to --orbit-size.
const TILE_BASE_CLASSES = cn(
  "absolute top-1/2 left-1/2 flex items-center justify-center rounded-2xl border-2 border-brand-teal/40 bg-card/95 p-1",
  "size-[calc(var(--orbit-size)*0.2)] shadow-[0_8px_32px_rgba(0,0,0,0.3)]",
  "transform-[translate(calc(-50%+cos(var(--tile-angle))*var(--orbit-size)*0.44),calc(-50%+sin(var(--tile-angle))*var(--orbit-size)*0.44))]",
);

/// Static page data

const SIGS = [
  {
    slug: "swe",
    abbrev: "SWE",
    name: "Software Engineering",
    description: "Hands-on workshops in React, Python, APIs, and modern dev practices.",
    logoSrc: sigSweLogo,
  },
  {
    slug: "ai",
    abbrev: "AI",
    name: "Artificial Intelligence",
    description: "Explore ML models, neural networks, and AI applications.",
    logoSrc: sigAiLogo,
  },
  {
    slug: "cyber",
    abbrev: "Cyber",
    name: "Cybersecurity",
    description: "CTF competitions, penetration testing, and security fundamentals.",
    logoSrc: sigCyberLogo,
  },
  {
    slug: "data",
    abbrev: "Data",
    name: "Data Science",
    description: "Data analysis, visualization, and applied statistics projects.",
    logoSrc: sigDataLogo,
  },
  {
    slug: "graph",
    abbrev: "Graph",
    name: "Computer Graphics",
    description: "Computer graphics, rendering, and visual computing topics.",
    logoSrc: sigGraphLogo,
  },
  {
    slug: "arch",
    abbrev: "Arch",
    name: "Systems Architecture",
    description: "Systems architecture, hardware design, and low-level programming.",
    logoSrc: sigArchLogo,
  },
] as const;

const STATS = [
  { value: 200, label: "UCM members" },
  { value: 50, label: "annual events" },
  { value: 6, label: "SIG communities" },
  { value: 3, label: "years running" },
] as const;

const SOCIALS: SocialLink[] = [
  {
    label: "Discord",
    Icon: SiDiscord,
    style: { background: "#5865F222", border: "2px solid #5865F244", color: "#5865F2" },
  },
  {
    label: "GitHub",
    Icon: SiGithub,
    style: { background: "#08477822", border: "2px solid #08477844", color: "#084778" },
  },
  {
    label: "Instagram",
    Icon: SiInstagram,
    style: { background: "#E1306C22", border: "2px solid #E1306C44", color: "#E1306C" },
  },
];

/// Tanstack Query options and keys

// Hierarchical key factory per https://tkdodo.eu/blog/effective-react-query-keys.
const eventsKeys = {
  all: ["events"] as const,
  lists: () => [...eventsKeys.all, "list"] as const,
  list: (params: Record<string, unknown>) => [...eventsKeys.lists(), params] as const,
};

const eventsQueryOptions = queryOptions({
  queryKey: eventsKeys.list({ after: PAGE_LOADED_AT }),
  queryFn: async () => {
    const { data } = await axios.get<KanaePage<FullEvents>>(`${API_BASE_URL}/events`, {
      params: { after: PAGE_LOADED_AT },
    });
    return (data.data ?? []).toReversed();
  },
  // Events don't change minute-to-minute; treat the cache as fresh for a minute so
  // navigating back/forward doesn't refetch immediately.
  staleTime: 60_000,

  // Once Kanae is live, then these will be removed
  // So we don't send out a ton of API requests for no reason
  retry: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  refetchOnMount: false,
});

function Index() {
  const { data: events = [], isLoading: loading } = useQuery(eventsQueryOptions);

  const carouselOptions = useMemo(() => ({ align: "start" as const }), []);

  const orbitTiles = useMemo(
    () => [
      { logo: sigSweLogo, className: `${TILE_BASE_CLASSES} [--tile-angle:0deg]` },
      { logo: sigAiLogo, className: `${TILE_BASE_CLASSES} [--tile-angle:60deg]` },
      { logo: sigCyberLogo, className: `${TILE_BASE_CLASSES} [--tile-angle:120deg]` },
      { logo: sigDataLogo, className: `${TILE_BASE_CLASSES} [--tile-angle:180deg]` },
      { logo: sigGraphLogo, className: `${TILE_BASE_CLASSES} [--tile-angle:240deg]` },
      { logo: sigArchLogo, className: `${TILE_BASE_CLASSES} [--tile-angle:300deg]` },
    ],
    [],
  );

  return (
    <div className="bg-background">
      <section
        className={cn(
          "relative flex w-full overflow-hidden",
          "min-h-[calc(100svh-4rem)] md:min-h-[calc(100svh-82px)]",
        )}
      >
        <div className="absolute inset-0 bg-[url(@/assets/images/hero-bg.jpg)] bg-cover bg-center bg-no-repeat" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(8,71,120,0.85)_0%,rgba(0,100,90,0.7)_100%)]" />

        <div
          className={cn(
            // stacked layout (default + portrait of any size)
            "relative z-2 mx-auto flex w-full max-w-360 flex-col items-center justify-center",
            "gap-8 p-6",
            // side-by-side grid (landscape >= md)
            "md:landscape:grid md:landscape:grid-cols-2 md:landscape:items-center",
            "md:landscape:gap-20 md:landscape:px-20 md:landscape:py-0",
          )}
        >
          <div className="md:landscape:order-2">
            <div
              className={cn(
                "relative mx-auto size-(--orbit-size)",
                // stacked: orbit fits viewport width and at most half the height
                "[--orbit-size:clamp(300px,min(60vw,50vh),540px)]",
                // landscape >= md: orbit fits column width and viewport height (minus navbar)
                "md:landscape:[--orbit-size:clamp(380px,min(40vw,calc(75vh-80px)),560px)]",
              )}
            >
              <div
                className={cn(
                  "absolute top-1/2 left-1/2 z-2 -translate-1/2",
                  "h-[calc(var(--orbit-size)*0.5)] w-[calc(var(--orbit-size)*0.357)]",
                  "flex items-center justify-center",
                )}
              >
                <img
                  src={beginningsLogo}
                  alt="UC Merced Beginnings"
                  className="size-full object-contain"
                />
              </div>

              <div
                className={cn(
                  "absolute top-1/2 left-1/2 -translate-1/2",
                  "size-[calc(var(--orbit-size)*0.857)]",
                )}
              >
                <div className="absolute inset-0 animate-[spin_20s_linear_infinite]">
                  {orbitTiles.map((tile) => (
                    <div key={tile.logo} className={tile.className}>
                      <img
                        src={tile.logo}
                        alt=""
                        loading="lazy"
                        className="size-full animate-[spin_20s_linear_infinite_reverse] object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="text-center md:landscape:order-1 md:landscape:text-left">
            <div
              className={cn(
                "font-bold tracking-[0.12em] text-brand-teal uppercase",
                "mb-3 text-[13px] md:mb-4 md:text-[15px] xl:text-[17px]",
              )}
            >
              UC Merced's Computing Community
            </div>
            <h1
              className={cn(
                "leading-[1.05] font-extrabold tracking-[-0.01em] text-brand-text-hero",
                "mb-4 text-[38px] md:mb-5 md:text-[56px] lg:text-[64px] xl:text-[72px]",
              )}
            >
              code<span className="text-brand-teal">.</span> design
              <span className="text-brand-teal">.</span>
              <br />
              innovate<span className="text-brand-teal">.</span>
            </h1>
            <p
              className={cn(
                "text-brand-text-hero/80",
                // base sizing
                "mx-auto mb-7 max-w-115 text-sm leading-[1.7]",
                // tablet/laptop adjustments
                "md:mx-0 md:text-base lg:text-lg",
                // xl restores the original wider, looser paragraph
                "xl:mb-9 xl:max-w-130 xl:leading-[1.75]",
              )}
            >
              We are UC Merced's student chapter of the world's largest computing society —
              workshops, SIGs, and a community that grows with you.
            </p>
            <div className="flex flex-wrap justify-center gap-3 md:gap-3.5 md:landscape:justify-start">
              <Link
                to="/"
                className={cn(
                  "cursor-pointer rounded-full bg-brand-teal text-foreground",
                  "text-sm font-bold",
                  "px-7 py-3 md:px-9 md:py-3.5 xl:px-10 xl:py-4",
                  "md:text-[15px] xl:text-[17px]",
                  "shadow-[0_6px_24px_rgba(0,225,191,0.35)] transition-opacity hover:opacity-90",
                )}
              >
                Join Us →
              </Link>
              <Link
                to="/"
                className={cn(
                  "cursor-pointer rounded-full border-2 border-brand-text-hero/50 text-brand-text-hero",
                  "text-sm font-semibold",
                  "px-7 py-3 md:px-9 md:py-3 xl:px-10 xl:py-3.75",
                  "md:text-[15px] xl:text-[17px]",
                  "transition-colors hover:bg-brand-text-hero/10",
                )}
              >
                Explore Events →
              </Link>
            </div>
          </div>
        </div>

        <a
          href="#join-us"
          aria-label="Scroll to next section"
          className="absolute bottom-6 left-1/2 animate-[scroll-cue_2.2s_ease-in-out_infinite] text-brand-text-hero"
        >
          <ChevronDown className="size-7" />
        </a>
      </section>

      <section id="join-us" className="border-t-[3px] border-brand-teal bg-card">
        <div className="mx-auto max-w-275 px-6 pt-10 pb-5 md:px-20 md:pt-15 md:pb-8">
          <h2 className="mb-3 text-[26px] font-bold text-foreground md:text-[42px]">Join us.</h2>
          <p className="max-w-155 text-sm leading-[1.75] text-brand-text-sub md:text-[17px]">
            ACM @ UC Merced is an inclusive community of students passionate about technology — no
            experience required.
          </p>
        </div>
        <div className="mx-auto mt-6 grid max-w-275 grid-cols-2 border-t border-border px-2 pb-8 md:grid-cols-4 md:px-12 md:pb-12">
          {STATS.map(({ value, label }) => (
            <div key={label} className="px-4 py-6 text-center md:px-6 md:py-8">
              <div className="text-[44px] leading-none font-extrabold text-foreground md:text-[64px]">
                {value}
                <span className="text-brand-teal">+</span>
              </div>
              <div className="mt-2 text-xs font-semibold tracking-wider text-brand-text-sub lowercase md:text-[15px]">
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-300 px-5 py-12 md:p-20">
        <Carousel opts={carouselOptions}>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="mb-2 text-[26px] font-bold text-foreground md:text-[42px]">Events</h2>
              <p className="text-[13px] text-brand-text-sub md:text-base">
                ACM @ UCM hosts 50+ events for our diverse community of students.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/"
                className={cn(
                  "cursor-pointer rounded-full border-2 border-brand-sky text-brand-sky",
                  "px-5 py-2.5 text-sm font-bold",
                  "transition-colors hover:bg-brand-sky/10",
                )}
              >
                See All Events →
              </Link>
              {events.length > 1 && (
                <>
                  <CarouselPrevious className={CAROUSEL_NAV_CLASS} />
                  <CarouselNext className={CAROUSEL_NAV_CLASS} />
                </>
              )}
            </div>
          </div>
          <CarouselContent className="-ml-4 py-4">
            {loading &&
              Array.from({ length: 4 }, (_, i) => (
                <CarouselItem key={i} className="pl-4 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <div className="flex h-full min-h-93.5 flex-col overflow-hidden rounded-3xl border border-border">
                    <Skeleton className="aspect-video w-full rounded-none" />
                    <div className="flex flex-1 flex-col gap-3 p-5">
                      <Skeleton className="h-3 w-1/2 rounded-sm" />
                      <Skeleton className="h-4 w-3/4 rounded-sm" />
                      <Skeleton className="h-3 w-full rounded-sm" />
                      <Skeleton className="h-3 w-5/6 rounded-sm" />
                      <div className="mt-auto flex items-center justify-between gap-2 border-t border-border pt-3.5">
                        <Skeleton className="h-6 w-16 rounded-full" />
                        <Skeleton className="h-8 w-28 rounded-full" />
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            {!loading && events.length === 0 && (
              <CarouselItem className="pl-4">
                <div className="rounded-3xl border border-border p-6 text-sm text-brand-text-sub">
                  No upcoming events. Check back soon!
                </div>
              </CarouselItem>
            )}
            {events.map((event) => {
              const { mon, day } = monthDay(event.start_at, event.timezone);
              return (
                <CarouselItem
                  key={event.id}
                  className="pl-4 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                >
                  <div className="flex h-full min-h-93.5 flex-col overflow-hidden rounded-3xl border border-border">
                    <div className="relative aspect-video w-full overflow-hidden bg-muted">
                      {event.thumbnail ? (
                        <img
                          src={event.thumbnail.url}
                          alt=""
                          className="size-full object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <div
                          className={cn(
                            "flex size-full items-center justify-center",
                            EVENT_TYPE_CLASSES[event.type].chip,
                          )}
                        >
                          <span
                            className={cn(
                              "rounded-full border px-4 py-1.25",
                              "text-[11.5px] font-extrabold tracking-[0.12em] uppercase",
                              EVENT_TYPE_CLASSES[event.type].label,
                            )}
                          >
                            {EVENT_TYPE_META[event.type].label}
                          </span>
                        </div>
                      )}
                      <div
                        className={cn(
                          "absolute bottom-3 left-3 flex h-14 w-13 flex-col overflow-hidden text-center",
                          "rounded-xl border border-border bg-card shadow-md",
                        )}
                      >
                        <div
                          className={cn(
                            "py-0.75 text-[10px] font-extrabold tracking-[0.08em] text-white",
                            EVENT_TYPE_CLASSES[event.type].bar,
                          )}
                        >
                          {mon}
                        </div>
                        <div className="flex flex-1 items-center justify-center text-[21px] font-extrabold text-foreground">
                          {day}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col gap-2.5 p-5">
                      <div>
                        <span
                          className={cn(
                            "inline-block rounded-full px-2.5 py-1 text-[11.5px] font-bold",
                            EVENT_TYPE_CLASSES[event.type].chip,
                          )}
                        >
                          {EVENT_TYPE_META[event.type].label}
                        </span>
                        <h3 className="mt-2 text-[17px] leading-snug font-bold text-foreground">
                          {event.name}
                        </h3>
                      </div>
                      <p className="line-clamp-2 text-sm/relaxed text-brand-text-sub">
                        {event.description}
                      </p>
                      <div className="mt-auto flex flex-col gap-1.5 border-t border-border pt-3.5">
                        <span className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                          <Clock className="size-3.5 shrink-0" />
                          {fmtClock(event.start_at, event.timezone)} -{" "}
                          {fmtClock(event.end_at, event.timezone)}
                        </span>
                        <span className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                          <MapPin className="size-3.5 shrink-0" />
                          {event.location}
                        </span>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
      </section>

      <section className="bg-card px-5 py-12 md:p-20">
        <div className="mx-auto max-w-300">
          <h2 className="mb-2.5 text-[26px] font-bold text-foreground md:text-[42px]">
            Communities
          </h2>
          <p className="mb-9 max-w-145 text-[13px] text-brand-text-sub md:text-base">
            ACM @ UCM consists of {SIGS.length} Special Interest Groups — each focused on a specific
            area of computing.
          </p>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {SIGS.map((sig) => (
              <Link
                key={sig.slug}
                to="/sigs"
                hash={`sig-${sig.slug}`}
                className={cn(
                  "flex cursor-pointer items-center gap-4",
                  "rounded-2xl bg-background",
                  "p-5 md:px-6 md:py-7",
                  "shadow-[0px_16px_40px_rgba(112,144,176,0.2)]",
                  "transition-transform hover:-translate-y-0.5",
                )}
              >
                <img
                  src={sig.logoSrc}
                  alt={sig.name}
                  loading="lazy"
                  className="size-11 shrink-0 object-contain md:size-14"
                />
                <div>
                  <div className="text-[13px] font-bold text-foreground md:text-base">
                    SIG {sig.abbrev}
                  </div>
                  <div className="mt-0.5 text-[11px] leading-snug text-brand-text-sub md:text-[13px]">
                    {sig.description}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-12 text-center md:p-20">
        <div className="mx-auto max-w-175">
          <h2 className="mb-2.5 text-[26px] font-bold text-foreground md:text-[42px]">
            Connect With Us!
          </h2>
          <p className="mb-9 text-[13px] text-brand-text-sub md:text-base">
            Stay in the loop — follow us on social media and join our Discord.
          </p>
          <div className="mb-12 flex flex-wrap justify-center gap-5 md:gap-7">
            {SOCIALS.map(({ label, Icon, style }) => (
              <div key={label} className="flex cursor-pointer flex-col items-center gap-2">
                <div
                  className="flex size-13 items-center justify-center rounded-2xl md:size-15"
                  style={style}
                >
                  <Icon className="size-6 md:size-7" />
                </div>
                <span className="text-[11px] font-semibold text-brand-text-sub">{label}</span>
              </div>
            ))}
          </div>

          <div className="rounded-3xl bg-card px-5 py-7 shadow-[0px_16px_40px_rgba(112,144,176,0.2)] md:px-12 md:py-10">
            <h3 className="mb-2 text-xl font-bold text-foreground md:text-[26px]">Newsletter</h3>
            <p className="mb-5 text-[13px] text-brand-text-sub md:text-[15px]">
              Receive weekly events and news!
            </p>
            <button
              type="button"
              className={cn(
                "cursor-pointer rounded-full bg-brand-teal text-foreground",
                "px-8 py-3 text-[15px] font-bold md:px-11 md:py-4 md:text-[17px]",
                "shadow-[0_6px_20px_rgba(0,225,191,0.3)] transition-opacity hover:opacity-90",
              )}
            >
              Subscribe!
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

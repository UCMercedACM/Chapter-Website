import { createFileRoute, Link } from "@tanstack/react-router";

import sigAiLogo from "@/assets/images/sig-ai-logo.svg";
import sigArchLogo from "@/assets/images/sig-arch-logo.svg";
import sigCyberLogo from "@/assets/images/sig-cyber-logo.svg";
import sigDataLogo from "@/assets/images/sig-data-logo.svg";
import sigGraphLogo from "@/assets/images/sig-graph-logo.svg";
import sigSweLogo from "@/assets/images/sig-swe-logo.svg";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/sigs")({
  component: Sigs,
});

/// Types and Interfaces

type SigSlug = "swe" | "ai" | "cyber" | "data" | "graph" | "arch";

interface SigDetail {
  slug: SigSlug;
  name: string;
  description: string;
  activities: readonly string[];
  logoSrc: string;
  accentClass: string;
}

/// Module-level constants

const SIG_ACCENT_CLASS = {
  swe: "[--sig-color:var(--sig-swe)]",
  ai: "[--sig-color:var(--sig-ai)]",
  cyber: "[--sig-color:var(--sig-cyber)]",
  data: "[--sig-color:var(--sig-data)]",
  graph: "[--sig-color:var(--sig-graph)]",
  arch: "[--sig-color:var(--sig-arch)]",
} as const satisfies Record<SigSlug, string>;

const SIG_DETAILS: readonly SigDetail[] = [
  {
    slug: "swe",
    name: "Software Engineering",
    description: "Hands-on workshops in React, Python, APIs, and modern dev practices.",
    activities: [
      "React & Node.js workshops",
      "Hackathon prep",
      "Portfolio reviews",
      "Industry speaker panels",
    ],
    logoSrc: sigSweLogo,
    accentClass: SIG_ACCENT_CLASS.swe,
  },
  {
    slug: "ai",
    name: "Artificial Intelligence",
    description: "Explore ML models, neural networks, and AI applications.",
    activities: [
      "ML model building",
      "Neural network tutorials",
      "Kaggle competitions",
      "AI ethics discussions",
    ],
    logoSrc: sigAiLogo,
    accentClass: SIG_ACCENT_CLASS.ai,
  },
  {
    slug: "cyber",
    name: "Cybersecurity",
    description: "CTF competitions, penetration testing, and security fundamentals.",
    activities: [
      "CTF competitions",
      "Penetration testing labs",
      "Security tool workshops",
      "Cryptography deep-dives",
    ],
    logoSrc: sigCyberLogo,
    accentClass: SIG_ACCENT_CLASS.cyber,
  },
  {
    slug: "data",
    name: "Data Science",
    description: "Data analysis, visualization, and applied statistics projects.",
    activities: [
      "Data visualization projects",
      "Python & R workshops",
      "Applied statistics",
      "Real-world datasets",
    ],
    logoSrc: sigDataLogo,
    accentClass: SIG_ACCENT_CLASS.data,
  },
  {
    slug: "graph",
    name: "Computer Graphics",
    description: "Computer graphics, rendering, and visual computing topics.",
    activities: [
      "Rendering & shaders",
      "OpenGL / WebGL labs",
      "Game dev fundamentals",
      "Visual computing research",
    ],
    logoSrc: sigGraphLogo,
    accentClass: SIG_ACCENT_CLASS.graph,
  },
  {
    slug: "arch",
    name: "Systems Architecture",
    description: "Systems architecture, hardware design, and low-level programming.",
    activities: ["CPU & memory design", "Assembly programming", "FPGA projects", "OS internals"],
    logoSrc: sigArchLogo,
    accentClass: SIG_ACCENT_CLASS.arch,
  },
];

// Placeholders for now
const PHOTO_SLOTS = [1, 2, 3, 4] as const;

function Sigs() {
  return (
    <div className="bg-background">
      <section
        className={cn(
          "relative flex w-full items-center justify-center overflow-hidden",
          "h-35 md:h-70",
        )}
      >
        <div className="absolute inset-0 bg-[url(@/assets/images/hero-bg.jpg)] bg-cover bg-center bg-no-repeat" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,71,120,0.6)_0%,rgba(8,71,120,0.65)_60%,rgba(8,71,120,0.85)_100%)]" />

        <div className="relative z-2 px-6 text-center">
          <h1
            className={cn(
              "leading-[1.1] font-extrabold text-brand-text-hero",
              "text-[28px] md:text-[52px]",
            )}
          >
            Special Interest Groups
          </h1>
          <p
            className={cn(
              "text-brand-text-hero/75",
              "mx-auto mt-3 max-w-140 text-[13px] md:text-[17px]",
            )}
          >
            Six communities. One chapter. Find your focus.
          </p>
        </div>
      </section>

      <div
        className={cn(
          "border-b-2 border-brand-teal bg-card shadow-[0_4px_20px_rgba(112,144,176,0.15)]",
        )}
      >
        <nav
          className={cn(
            "mx-auto flex max-w-300 items-center justify-center overflow-x-auto",
            "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            "gap-2 px-3 py-2.5 md:gap-6 md:px-10 md:py-3.5",
          )}
        >
          {SIG_DETAILS.map((sig) => (
            <a
              key={sig.slug}
              href={`#sig-${sig.slug}`}
              className={cn(
                sig.accentClass,
                "flex shrink-0 flex-col items-center gap-1 rounded-xl px-2 py-1 md:px-2.5",
                "transition-colors hover:bg-(--sig-color)/10 focus-visible:bg-(--sig-color)/10",
              )}
            >
              <img src={sig.logoSrc} alt="" className="size-7 object-contain md:size-10" />
              <span
                className={cn(
                  "font-bold tracking-wider text-foreground",
                  "text-[9px] md:text-[11px]",
                )}
              >
                ACM {sig.slug.toUpperCase()}
              </span>
            </a>
          ))}
        </nav>
      </div>

      <section className="mx-auto max-w-215 px-6 pt-10 text-center md:px-10 md:pt-16">
        <p className={cn("leading-[1.8] text-brand-text-sub", "text-sm md:text-[17px]")}>
          ACM&apos;s Special Interest Groups represent major areas of computing, addressing the
          interests of technical communities that drive innovation. Each SIG runs its own workshops,
          events, and projects throughout the semester.
        </p>
      </section>

      {SIG_DETAILS.map((sig) => (
        <section
          key={sig.slug}
          id={`sig-${sig.slug}`}
          className={cn(
            sig.accentClass,
            "mx-auto max-w-300 border-b border-border",
            "px-5 py-12 md:px-12 md:py-18",
            "scroll-mt-35",
          )}
        >
          <div className={cn("grid grid-cols-1 items-center gap-8", "md:grid-cols-2 md:gap-16")}>
            <div>
              <div className="mb-5 flex items-center gap-4">
                <div
                  className={cn(
                    "flex shrink-0 items-center justify-center rounded-[20px]",
                    "size-16 md:size-20",
                    "border-2 border-(--sig-color)/30 bg-(--sig-color)/10",
                  )}
                >
                  <img
                    src={sig.logoSrc}
                    alt={sig.name}
                    loading="lazy"
                    className="size-11 object-contain md:size-14"
                  />
                </div>
                <div>
                  <div
                    className={cn(
                      "mb-1 font-bold tracking-widest text-(--sig-color) uppercase",
                      "text-[11px] md:text-[13px]",
                    )}
                  >
                    {sig.name}
                  </div>
                  <h2
                    className={cn(
                      "leading-[1.1] font-extrabold text-foreground",
                      "text-[22px] md:text-[32px]",
                    )}
                  >
                    ACM {sig.slug.toUpperCase()}
                  </h2>
                </div>
              </div>

              <div className="mb-5 h-1.25 w-12 rounded-[9px] bg-(--sig-color)" />

              <p className={cn("leading-[1.8] text-brand-text-sub", "mb-6 text-sm md:text-base")}>
                {sig.description} Join us to connect with like-minded students, build real projects,
                and grow your skills in a welcoming environment — no prior experience needed.
              </p>

              <div>
                <div
                  className={cn(
                    "mb-3 font-bold tracking-[0.08em] text-muted-foreground uppercase",
                    "text-xs",
                  )}
                >
                  What we do
                </div>
                <div className="flex flex-wrap gap-2">
                  {sig.activities.map((activity) => (
                    <span
                      key={activity}
                      className={cn(
                        "rounded-full border px-3 py-1",
                        "text-xs font-semibold",
                        "border-(--sig-color)/30 bg-(--sig-color)/10 text-(--sig-color)",
                      )}
                    >
                      {activity}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div
              className={cn(
                "ml-auto grid aspect-square w-full max-w-120",
                "grid-cols-2 grid-rows-2 gap-2.5",
              )}
            >
              {PHOTO_SLOTS.map((n) => (
                <div
                  key={n}
                  className={cn(
                    "relative flex items-center justify-center overflow-hidden rounded-2xl",
                    "min-h-30 md:min-h-40",
                    "border border-(--sig-color)/20 bg-(--sig-color)/10",
                  )}
                >
                  <div
                    className={cn(
                      "flex size-3/5 items-center justify-center rounded-xl",
                      "bg-(--sig-color)/20",
                    )}
                  >
                    <img
                      src={sig.logoSrc}
                      alt=""
                      loading="lazy"
                      className="size-1/2 object-contain opacity-30"
                    />
                  </div>
                  <span
                    className={cn(
                      "absolute bottom-2.5 left-3 font-bold tracking-[0.06em] uppercase",
                      "text-[10px] text-(--sig-color) opacity-50",
                    )}
                  >
                    Photo {n}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section
        className={cn(
          "border-t-[3px] border-brand-teal bg-card text-center",
          "px-6 py-12 md:px-12 md:py-18",
        )}
      >
        <div className="mx-auto max-w-150">
          <h2 className={cn("font-extrabold text-foreground", "mb-3 text-[24px] md:text-[36px]")}>
            Not sure which SIG to join?
          </h2>
          <p className={cn("leading-[1.75] text-brand-text-sub", "mb-7 text-sm md:text-base")}>
            Join our Discord and ask around — most members are part of multiple SIGs. You can always
            explore before committing.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/"
              className={cn(
                "cursor-pointer rounded-full bg-brand-teal text-foreground",
                "text-sm font-bold md:text-base",
                "px-7 py-3 md:px-9 md:py-3.75",
                "shadow-[0_6px_20px_rgba(0,225,191,0.3)] transition-opacity hover:opacity-90",
              )}
            >
              Join Our Discord
            </Link>
            <Link
              to="/"
              className={cn(
                "cursor-pointer rounded-full border-2 border-border text-foreground",
                "text-sm font-semibold md:text-base",
                "px-7 py-3 md:px-9 md:py-3.5",
                "transition-colors hover:bg-foreground/5",
              )}
            >
              Join Our Newsletter
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

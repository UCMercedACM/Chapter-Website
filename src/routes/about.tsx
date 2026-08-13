import { SiInstagram } from "@icons-pack/react-simple-icons";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import { useCallback, useState, type CSSProperties, type MouseEvent } from "react";

import aboutPhoto from "@/assets/images/about-photo.jpg";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/about")({
  component: About,
});

/// Types and Interfaces

interface AboutStat {
  value: string;
  label: string;
}

interface Activity {
  icon: string;
  title: string;
  short: string;
  desc: string;
  tags: readonly string[];
}

interface BoardMember {
  name: string;
  role: string;
  initials: string;
  color: string;
  avatarStyle: CSSProperties;
}

interface FaqItem {
  question: string;
  answer: string;
}

interface AboutUsData {
  stats: readonly AboutStat[];
  activities: readonly Activity[];
  board: readonly BoardMember[];
  faq: readonly FaqItem[];
}

/// Module-level constants

const ABOUT_US: AboutUsData = {
  stats: [
    { value: "200+", label: "Members" },
    { value: "6", label: "SIGs" },
    { value: "30+", label: "Events / Year" },
    { value: "2011", label: "Founded" },
  ],

  activities: [
    {
      icon: "🛠",
      title: "Workshops",
      short: "Hands-on technical workshops.",
      desc: "Hands-on technical workshops covering web dev, ML, security, data science, and more — taught by your peers and industry mentors. No prerequisites required.",
      tags: ["Web Dev", "ML", "Security", "Data", "Mobile"],
    },
    {
      icon: "🤝",
      title: "Community",
      short: "A welcoming space for everyone.",
      desc: "A welcoming space for CS students, engineers, designers, and anyone curious about computing at UCM. Find study buddies, mentors, and friends.",
      tags: ["Discord", "Study Halls", "Socials", "Mentorship"],
    },
    {
      icon: "💼",
      title: "Career Prep",
      short: "Resume reviews & interviews.",
      desc: "Resume reviews, mock interviews, LinkedIn workshops, and direct connections to recruiters and industry professionals across tech.",
      tags: ["Resumes", "Mock Interviews", "Recruiters", "Alumni"],
    },
    {
      icon: "🏆",
      title: "Competitions",
      short: "Hackathons, CTFs, and more.",
      desc: "Hackathons, CTFs, and coding competitions where you can put your skills to the test, win prizes, and build resume-worthy projects.",
      tags: ["Hackathons", "CTFs", "LeetCode Nights", "ICPC"],
    },
    {
      icon: "🔬",
      title: "Research",
      short: "Real research, real impact.",
      desc: "Collaborate with faculty and peers on real research projects across our six special interest groups — from AI to systems architecture.",
      tags: ["AI", "Systems", "HCI", "Graphics", "Security"],
    },
    {
      icon: "🌐",
      title: "Networking",
      short: "Industry & alumni connections.",
      desc: "Industry speaker events, alumni mixers, and connections with ACM chapters across the UC system. Open doors before you graduate.",
      tags: ["Speakers", "UC Mixers", "Company Tours", "Alumni Panel"],
    },
  ],

  board: (
    [
      { name: "Alex Rivera", role: "President", initials: "AR", color: "#00E1BF" },
      { name: "Jordan Kim", role: "Vice President", initials: "JK", color: "#3DA9FC" },
      { name: "Priya Nair", role: "Secretary", initials: "PN", color: "#F7B731" },
      { name: "Marcus Chen", role: "Treasurer", initials: "MC", color: "#FC5C65" },
      { name: "Sofia Gomez", role: "Events Director", initials: "SG", color: "#A55EEA" },
      { name: "Tyler Brooks", role: "Webmaster", initials: "TB", color: "#26DE81" },
      { name: "Aisha Patel", role: "Social Media", initials: "AP", color: "#FD9644" },
      { name: "Noah Williams", role: "Outreach Chair", initials: "NW", color: "#45AAF2" },
    ] as const
  ).map((member) => ({
    ...member,
    avatarStyle: {
      background: `${member.color}22`,
      borderColor: member.color,
      color: member.color,
    },
  })),

  faq: [
    {
      question: "Do I need programming experience to join?",
      answer:
        "Not at all! ACM @ UCM welcomes students of all skill levels. We have beginner-friendly workshops and a supportive community ready to help you learn.",
    },
    {
      question: "How do I join a SIG?",
      answer:
        "After joining ACM, you can sign up for any SIG at our general meetings or through our Discord server. There are no prerequisites — just curiosity.",
    },
    {
      question: "Is there a membership fee?",
      answer:
        "General membership is free! We offer an optional paid national ACM membership with additional benefits, but it is never required.",
    },
    {
      question: "When and where do you meet?",
      answer:
        "General meetings are held roughly bi-weekly at COB 263. SIG meetings vary — check the Events page for the latest schedule.",
    },
    {
      question: "Can I join mid-semester?",
      answer:
        "Absolutely. We welcome new members at any point during the semester. Just show up to a meeting or reach out on Discord.",
    },
  ],
};

const SECTION_EYEBROW_CLASSES = cn(
  "font-bold tracking-[0.14em] text-brand-teal uppercase",
  "mb-3 text-[11px] md:mb-4 md:text-[13px]",
);

const SECTION_HEADING_CLASSES = cn(
  "leading-[1.1] font-extrabold text-foreground",
  "text-[26px] md:text-[40px]",
);

function About() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleTabClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    const next = event.currentTarget.dataset.index;
    if (next !== undefined) setActiveIndex(Number(next));
  }, []);

  return (
    <div className="bg-background">
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-300 px-6 py-16 md:px-12 md:py-24">
          <div className={cn("grid grid-cols-1 items-center gap-10", "md:grid-cols-2 md:gap-20")}>
            <div>
              <div className={SECTION_EYEBROW_CLASSES}>Our Mission</div>
              <h2
                className={cn(
                  "leading-[1.15] font-extrabold text-foreground",
                  "mb-7 text-[28px] md:text-[44px]",
                )}
              >
                Connecting students who{" "}
                <span className="text-brand-teal">code, design, and innovate.</span>
              </h2>
              <p
                className={cn(
                  "leading-[1.85] text-brand-text-sub",
                  "mb-4 text-[15px] md:text-[17px]",
                )}
              >
                ACM @ UC Merced is a student-run chapter of the Association for Computing Machinery
                — the world&apos;s largest educational and scientific computing society.
              </p>
              <p className={cn("leading-[1.85] text-brand-text-sub", "text-[15px] md:text-[17px]")}>
                We bring together students across all majors to explore technology, build skills,
                and grow as a community through workshops, projects, and events.
              </p>
            </div>
            <div
              className={cn(
                "relative overflow-hidden rounded-3xl",
                "shadow-[0px_30px_60px_rgba(112,144,176,0.25)]",
                "aspect-4/5 min-h-70",
                "md:aspect-auto md:h-80 md:min-h-0",
              )}
            >
              <img
                src={aboutPhoto}
                alt="ACM members"
                loading="lazy"
                decoding="async"
                className="size-full object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_60%,rgba(8,71,120,0.4)_100%)]" />
            </div>
          </div>
        </div>
      </section>

      <section
        className={cn(
          "mx-auto max-w-300 px-6 py-16 md:px-12 md:py-25",
          // Skip rendering work for sections that aren't on screen yet — big win on
          // hard-refreshes / throttled CPU. `contain-intrinsic-size` reserves space so
          // there's no scroll-position jumping while the browser fills sections in.
          "[contain-intrinsic-size:auto_300px] [content-visibility:auto]",
        )}
      >
        <div className={cn("grid grid-cols-2 gap-5", "md:grid-cols-4 md:gap-8")}>
          {ABOUT_US.stats.map((stat) => (
            <div
              key={stat.label}
              className={cn(
                "rounded-3xl border-t-4 border-brand-teal bg-card text-center",
                "shadow-[0px_16px_40px_rgba(112,144,176,0.2)]",
                "px-4 py-7 md:px-5 md:py-10",
              )}
            >
              <div
                className={cn(
                  "leading-none font-extrabold text-foreground",
                  "text-[40px] md:text-[56px]",
                )}
              >
                {stat.value}
              </div>
              <div
                className={cn(
                  "mt-3 font-semibold tracking-[0.08em] text-brand-text-sub uppercase",
                  "text-[12px] md:text-[13px]",
                )}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        className={cn(
          "border-y border-border bg-card",
          "[contain-intrinsic-size:auto_900px] [content-visibility:auto]",
        )}
      >
        <div className="mx-auto max-w-300 px-6 py-16 md:px-12 md:py-30">
          <div className={SECTION_EYEBROW_CLASSES}>What We Do</div>
          <h2 className={cn(SECTION_HEADING_CLASSES, "mb-9 md:mb-15")}>
            Everything computing, in one place.
          </h2>

          <Accordion className="flex flex-col gap-3 md:hidden">
            {ABOUT_US.activities.map((item, index) => (
              <AccordionItem
                key={item.title}
                value={String(index)}
                className={cn(
                  "overflow-hidden rounded-3xl border-2 border-transparent not-last:border-b-2",
                  "bg-background shadow-[0px_16px_40px_rgba(112,144,176,0.2)]",
                  "data-open:border-brand-teal",
                )}
              >
                <AccordionTrigger
                  className={cn("flex items-center gap-3.5 border-0 px-5 py-4 hover:no-underline")}
                >
                  <span className="text-[28px] leading-none">{item.icon}</span>
                  <span className="flex-1 text-base font-bold text-foreground">{item.title}</span>
                </AccordionTrigger>
                <AccordionContent className="px-5">
                  <p className="mb-3.5 text-[14px] leading-[1.75] text-brand-text-sub">
                    {item.desc}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className={cn(
                          "rounded-full px-2.5 py-1 text-[11px] font-semibold",
                          "bg-brand-teal/15 text-brand-teal",
                        )}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="hidden grid-cols-[1fr_1.4fr] gap-8 md:grid">
            <div className="flex flex-col gap-2.5">
              {ABOUT_US.activities.map((item, index) => {
                const isActive = activeIndex === index;
                return (
                  <button
                    key={item.title}
                    type="button"
                    data-index={index}
                    onClick={handleTabClick}
                    className={cn(
                      "flex w-full cursor-pointer items-center gap-4 rounded-2xl text-left",
                      "border-l-4 p-5 transition-all",
                      isActive
                        ? "border-brand-teal bg-background shadow-[0px_16px_40px_rgba(112,144,176,0.2)]"
                        : "border-transparent bg-transparent hover:bg-background/50",
                    )}
                  >
                    <span
                      className={cn(
                        "text-[28px] leading-none transition-opacity",
                        isActive ? "opacity-100" : "opacity-55",
                      )}
                    >
                      {item.icon}
                    </span>
                    <span className="flex flex-col">
                      <span
                        className={cn(
                          "mb-0.5 text-[17px] font-bold",
                          isActive ? "text-foreground" : "text-brand-text-sub",
                        )}
                      >
                        {item.title}
                      </span>
                      <span className="text-[13px] text-muted-foreground">{item.short}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            {ABOUT_US.activities.map((item, index) =>
              activeIndex === index ? (
                <div
                  key={item.title}
                  className={cn(
                    "flex flex-col rounded-3xl border-t-4 border-brand-teal bg-background",
                    "shadow-[0px_16px_40px_rgba(112,144,176,0.2)]",
                    "px-11 py-10",
                  )}
                >
                  <div className="mb-5 text-[56px] leading-none">{item.icon}</div>
                  <div
                    className={cn(
                      "mb-2.5 font-bold tracking-[0.14em] text-brand-teal uppercase",
                      "text-[11px]",
                    )}
                  >
                    {String(index + 1).padStart(2, "0")} /{" "}
                    {String(ABOUT_US.activities.length).padStart(2, "0")}
                  </div>
                  <h3 className="mb-4.5 text-[32px] font-extrabold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mb-7 text-[16px] leading-[1.85] text-brand-text-sub">{item.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className={cn(
                          "rounded-full px-3.5 py-1.5 text-xs font-semibold",
                          "bg-brand-teal/15 text-brand-teal",
                        )}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ) : undefined,
            )}
          </div>
        </div>
      </section>

      <section className="[contain-intrinsic-size:auto_900px] [content-visibility:auto]">
        <div className="mx-auto max-w-300 px-6 py-16 md:px-12 md:py-30">
          <div className={SECTION_EYEBROW_CLASSES}>The Team</div>
          <h2 className={cn(SECTION_HEADING_CLASSES, "mb-9 md:mb-15")}>Meet the board.</h2>
          <div className={cn("grid grid-cols-2 gap-4.5", "md:grid-cols-4 md:gap-7")}>
            {ABOUT_US.board.map((member) => (
              <div
                key={member.name}
                className={cn(
                  "rounded-3xl bg-card text-center",
                  "shadow-[0px_16px_40px_rgba(112,144,176,0.2)]",
                  "px-4.5 py-6 md:px-6 md:py-9",
                )}
              >
                <div
                  className={cn(
                    "mx-auto mb-4.5 flex items-center justify-center rounded-full border-[3px]",
                    "size-16 md:size-22",
                    "text-[20px] font-extrabold md:text-[26px]",
                  )}
                  style={member.avatarStyle}
                >
                  {member.initials}
                </div>
                <div className={cn("mb-1.5 font-bold text-foreground", "text-sm md:text-base")}>
                  {member.name}
                </div>
                <div className={cn("text-brand-text-sub", "text-xs md:text-[13px]")}>
                  {member.role}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className={cn(
          "border-y border-border bg-card",
          "[contain-intrinsic-size:auto_700px] [content-visibility:auto]",
        )}
      >
        <div className="mx-auto max-w-215 px-6 py-16 md:px-12 md:py-30">
          <div className={SECTION_EYEBROW_CLASSES}>FAQ</div>
          <h2 className={cn(SECTION_HEADING_CLASSES, "mb-8 md:mb-12")}>Common questions.</h2>
          <Accordion className="flex flex-col gap-3.5">
            {ABOUT_US.faq.map((item, index) => (
              <AccordionItem
                key={item.question}
                value={String(index)}
                className={cn(
                  "overflow-hidden rounded-2xl border border-border bg-background",
                  "shadow-[0px_16px_40px_rgba(112,144,176,0.2)]",
                  "data-open:border-brand-teal",
                )}
              >
                <AccordionTrigger
                  className={cn(
                    "border-0 px-4.5 py-4 hover:no-underline md:px-6 md:py-5",
                    "text-sm font-bold text-foreground md:text-base",
                  )}
                >
                  {item.question}
                </AccordionTrigger>
                <AccordionContent
                  className={cn(
                    "px-4.5 md:px-6",
                    "text-[13px] leading-[1.75] text-brand-text-sub md:text-[15px]",
                  )}
                >
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section
        className={cn(
          "mx-auto max-w-225 px-6 py-16 md:px-12 md:py-30",
          "[contain-intrinsic-size:auto_400px] [content-visibility:auto]",
        )}
      >
        <div className={SECTION_EYEBROW_CLASSES}>Contact</div>
        <h2 className={cn(SECTION_HEADING_CLASSES, "mb-8 md:mb-12")}>Get in touch.</h2>
        <div className={cn("grid grid-cols-1 gap-4.5", "md:grid-cols-2")}>
          <Link
            to="/"
            className={cn(
              "flex items-center gap-5 rounded-3xl border border-border bg-card",
              "shadow-[0px_16px_40px_rgba(112,144,176,0.2)]",
              "px-5 py-6 md:px-7 md:py-8",
              "transition-transform hover:-translate-y-0.5",
            )}
          >
            <div
              className={cn(
                "flex size-13 shrink-0 items-center justify-center rounded-2xl",
                "border-2 border-brand-teal/30 bg-brand-teal/15 text-brand-teal",
              )}
            >
              <Mail className="size-5.5" />
            </div>
            <div>
              <div
                className={cn(
                  "mb-1 font-bold tracking-[0.08em] text-muted-foreground uppercase",
                  "text-[11px] md:text-[12px]",
                )}
              >
                Email
              </div>
              <div className={cn("font-bold text-foreground", "text-sm md:text-base")}>
                acm@ucmerced.edu
              </div>
            </div>
          </Link>

          <Link
            to="/"
            className={cn(
              "flex items-center gap-5 rounded-3xl border border-border bg-card",
              "shadow-[0px_16px_40px_rgba(112,144,176,0.2)]",
              "px-5 py-6 md:px-7 md:py-8",
              "transition-transform hover:-translate-y-0.5",
            )}
          >
            <div
              className={cn(
                "flex size-13 shrink-0 items-center justify-center rounded-2xl",
                "border-2 border-[#E1306C]/30 bg-[#E1306C]/15",
              )}
            >
              <SiInstagram className="size-5.5" />
            </div>
            <div>
              <div
                className={cn(
                  "mb-1 font-bold tracking-[0.08em] text-muted-foreground uppercase",
                  "text-[11px] md:text-[12px]",
                )}
              >
                Instagram
              </div>
              <div className={cn("font-bold text-foreground", "text-sm md:text-base")}>
                @acm.ucmerced
              </div>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}

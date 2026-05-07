import { SiInstagram, SiDiscord, SiGithub, type IconType } from "@icons-pack/react-simple-icons";

import { ThemeToggle } from "@/components/app/theme-toggle";

interface SocialEntry {
  label: string;
  href: string;
  Icon: IconType;
}

const SOCIALS: SocialEntry[] = [
  { label: "Discord", href: "https://discord.com", Icon: SiDiscord },
  { label: "GitHub", href: "https://github.com/UCMercedACM", Icon: SiGithub },
  { label: "Instagram", href: "https://instagram.com", Icon: SiInstagram },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-card px-6 py-5 md:px-12 md:py-6">
      <div className="mx-auto flex max-w-300 flex-wrap items-center justify-between gap-3">
        <div className="text-xs font-semibold text-muted-foreground">© 2026 ACM @ UC Merced</div>

        <div className="flex flex-wrap items-center gap-4">
          <ThemeToggle />
          <div className="flex items-center gap-2.5">
            {SOCIALS.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

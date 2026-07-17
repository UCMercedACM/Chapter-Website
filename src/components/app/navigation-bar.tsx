import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { memo, useCallback, useState } from "react";

import acmLogo from "@/assets/logos/acm.svg";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "@/components/ui/sheet";
import { meQueryOptions } from "@/routes/dashboard/route";

interface NavEntry {
  href: string;
  label: string;
}

const NAV_LINKS: NavEntry[] = [
  { href: "/about", label: "About" },
  { href: "/events", label: "Events" },
  { href: "/sigs", label: "SIGs" },
  { href: "/projects", label: "Projects" },
];

const DASHBOARD_ENTRY: NavEntry = { href: "/dashboard", label: "Dashboard" };
const GUEST_ENTRY: NavEntry = { href: "/login", label: "Login" };

const NAV_LINK_CLASSES =
  "relative cursor-pointer pb-1 text-[15px] font-bold tracking-[0.02em] transition-colors text-[#21576c] dark:text-brand-text-sub hover:text-foreground data-[status=active]:text-foreground";
const NAV_LINK_UNDERLINE_CLASSES =
  "absolute -bottom-0.75 left-0 h-1.25 w-full rounded-[9px] bg-brand-sky opacity-0 [[data-status=active]>&]:opacity-100";

const DesktopNavLink = memo(function DesktopNavLink({ entry }: Readonly<{ entry: NavEntry }>) {
  return (
    <Link to={entry.href} className={NAV_LINK_CLASSES}>
      {entry.label}
      <span className={NAV_LINK_UNDERLINE_CLASSES} />
    </Link>
  );
});

interface SheetNavLinkProps {
  entry: NavEntry;
  onNavigate: () => void;
}

const SheetNavLink = memo(function SheetNavLink({
  entry,
  onNavigate,
}: Readonly<SheetNavLinkProps>) {
  return (
    <Link
      to={entry.href}
      onClick={onNavigate}
      className="rounded-md px-2 py-1.5 text-sm font-semibold text-foreground transition-colors hover:bg-foreground/10"
    >
      {entry.label}
    </Link>
  );
});

function MobileNav() {
  const { data: member } = useQuery(meQueryOptions);

  const [open, setOpen] = useState(false);

  const closeSheet = useCallback(() => {
    setOpen(false);
  }, []);

  const entries = [...NAV_LINKS, member ? DASHBOARD_ENTRY : GUEST_ENTRY];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="bg-transparent text-foreground hover:bg-foreground/10 hover:text-foreground md:hidden"
          />
        }
      >
        <Menu className="size-5" />
        <span className="sr-only">Open menu</span>
      </SheetTrigger>
      <SheetContent side="right" className="w-72 bg-brand-navbar">
        <SheetHeader />
        <nav className="flex flex-col gap-2 px-4">
          {entries.map((entry) => (
            <SheetNavLink key={entry.href} entry={entry} onNavigate={closeSheet} />
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}

export function Navbar() {
  const { data: member } = useQuery(meQueryOptions);

  const entries = [...NAV_LINKS, member ? DASHBOARD_ENTRY : GUEST_ENTRY];

  return (
    <nav className="sticky top-0 z-50 flex h-16 w-full items-center justify-between bg-brand-navbar px-5 shadow-[0px_10px_30px_rgba(112,144,176,0.2)] md:h-20.5 md:px-14">
      <Link to="/" className="flex cursor-pointer items-center gap-2">
        <img
          src={acmLogo}
          alt="ACM @ UC Merced"
          className="size-10 object-contain md:size-13"
          loading="lazy"
        />
        <span className="text-[13px] font-semibold text-foreground md:text-[15px]">
          at UC Merced
        </span>
      </Link>

      <div className="hidden gap-9 md:flex">
        {entries.map((entry) => (
          <DesktopNavLink key={entry.href} entry={entry} />
        ))}
      </div>

      <div className="md:hidden">
        <MobileNav />
      </div>
    </nav>
  );
}

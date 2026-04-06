import { Link } from "@tanstack/react-router";
import { ChevronDown, Menu } from "lucide-react";
import { memo, useCallback, useState } from "react";

import Logo from "@/assets/logo-full.svg";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "@/components/ui/sheet";

interface NavItem {
  href: string;
  label: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

type NavEntry = NavItem | NavGroup;

const NAVIGATION_ENTRIES: NavEntry[] = [
  { href: "/events", label: "Events" },
  { href: "/about-us/sigs", label: "SIGs" },
  { href: "/resources", label: "Resources" },
] as const;

function isNavGroup(entry: NavEntry): entry is NavGroup {
  return "items" in entry;
}

function MobileNav() {
  const [open, setOpen] = useState(false);
  const closeSheet = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="outline" size="icon" className="md:hidden" />}>
        <Menu className="size-5" />
        <span className="sr-only">Open menu</span>
      </SheetTrigger>
      <SheetContent side="right" className="w-72">
        <SheetHeader />
        <nav className="flex flex-col gap-2 px-4">
          {NAVIGATION_ENTRIES.map((entry) => {
            if (isNavGroup(entry)) {
              return (
                <Collapsible key={entry.label}>
                  <CollapsibleTrigger
                    type="button"
                    className="flex w-full items-center justify-between text-sm font-semibold px-2 py-1.5 rounded-md hover:bg-accent transition-colors"
                  >
                    {entry.label}
                    <ChevronDown className="size-4 transition-transform duration-200 [[data-state=open]>&]:rotate-180" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="flex flex-col gap-0.5 pl-2 mt-1">
                    {entry.items.map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={closeSheet}
                        className="text-sm font-medium px-2 py-1.5 rounded-md hover:bg-accent transition-colors text-muted-foreground"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              );
            }
            return (
              <Link
                key={entry.href}
                to={entry.href}
                onClick={closeSheet}
                className="text-sm font-semibold px-2 py-1.5 rounded-md hover:bg-accent transition-colors"
              >
                {entry.label}
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}

const DesktopNavItems = memo(function DesktopNavItems() {
  return (
    <NavigationMenuList>
      {NAVIGATION_ENTRIES.map((entry) => {
        if (isNavGroup(entry)) {
          return (
            <NavigationMenuItem key={entry.label}>
              <NavigationMenuTrigger>{entry.label}</NavigationMenuTrigger>
              <NavigationMenuContent className="z-50 group-data-[viewport=false]/navigation-menu:border-0 group-data-[viewport=false]/navigation-menu:shadow-md">
                <ul className="grid w-48 gap-1 p-2">
                  {entry.items.map((item) => (
                    <li key={item.href}>
                      <NavigationMenuLink render={<Link to={item.href} />}>
                        {item.label}
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          );
        }
        return (
          <NavigationMenuItem key={entry.href}>
            <NavigationMenuLink
              render={<Link to={entry.href} />}
              className={navigationMenuTriggerStyle()}
            >
              {entry.label}
            </NavigationMenuLink>
          </NavigationMenuItem>
        );
      })}
    </NavigationMenuList>
  );
});

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-background shadow-[0px_10px_30px_0px_rgba(112,144,176,0.20)]">
      <div className="flex h-18 items-center justify-between px-14 md:px-16">
        <Link to="/" className="flex items-center gap-2">
          <img src={Logo} alt="ACM @ UC Merced Logo" className="size-12" loading="lazy" />
          <span className="font-semibold">at UC Merced</span>
        </Link>

        <div className="hidden md:flex">
          <NavigationMenu viewport={false}>
            <DesktopNavItems />
          </NavigationMenu>
        </div>

        <div className="md:hidden">
          <MobileNav />
        </div>
      </div>
    </nav>
  );
}

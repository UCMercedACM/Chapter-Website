import { queryOptions, useQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
  useLocation,
  useMatches,
} from "@tanstack/react-router";
import axios from "axios";
import {
  type LucideIcon,
  Calendar,
  ChevronRight,
  Folder,
  History,
  Home,
  Settings,
} from "lucide-react";
import { type CSSProperties, useCallback, useState } from "react";

import { Footer } from "@/components/app/footer";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayout,
  beforeLoad: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData(meQueryOptions).catch(() => {
      redirect({ to: "/login", search: {}, throw: true });
    });
  },
});

/// Types and Interfaces

export type Role = "admin" | "leads" | "manager" | "root";

export interface ClientSession {
  aal: "aal1" | "aal2";
  active: boolean;
  authenticated_at: string;
  issued_at: string;
  expires_at: string;
}

export interface ClientMember {
  id: string;
  name: string;
  email: string;
  display_name?: string | null;
  created_at: string;
  projects: unknown[];
  events: unknown[];
  roles: Role[];
  session: ClientSession;
}

interface NavItem {
  to:
    | "/dashboard"
    | "/dashboard/events"
    | "/dashboard/events/past"
    | "/dashboard/projects"
    | "/dashboard/manage/projects";
  label: string;
  icon: LucideIcon;
  sub?: boolean;
}

interface DashboardStaticData {
  area?: string;
  title?: string;
  sub?: string;
  home?: boolean;
}

/// Constants

const EMPTY_STATIC: DashboardStaticData = {};
const GRID_GLYPH = (
  <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2.2}>
    <rect x="4" y="4" width="7" height="7" rx="1.5" />
    <rect x="13" y="4" width="7" height="7" rx="1.5" />
    <rect x="4" y="13" width="7" height="7" rx="1.5" />
    <rect x="13" y="13" width="7" height="7" rx="1.5" />
  </svg>
);
export const ROLE_META: Record<Role, { label: string; rank: number }> = {
  root: { label: "Root", rank: 4 },
  admin: { label: "Admin", rank: 3 },
  manager: { label: "Manager", rank: 2 },
  leads: { label: "Leads", rank: 1 },
};

const NAV_ITEMS: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: Home },
  { to: "/dashboard/events", label: "Events", icon: Calendar },
  { to: "/dashboard/events/past", label: "Past events", icon: History, sub: true },
  { to: "/dashboard/projects", label: "Projects", icon: Folder },
];

const MANAGE_NAV_ITEMS: NavItem[] = [
  { to: "/dashboard/manage/projects", label: "Projects", icon: Folder },
];

const MANAGE_ROLES: Role[] = ["root", "admin", "manager"];

export const ROLES_BY_RANK: Role[] = ["root", "admin", "manager", "leads"];

const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:8000";

const SIDEBAR_STYLE = {
  "--sidebar-width": "16.5rem",
  "--sidebar-width-icon": "3.5rem",
} as CSSProperties;

/// Tanstack Query options

export const meQueryOptions = queryOptions({
  queryKey: ["members", "me"],
  queryFn: async () => {
    const { data } = await axios.get<ClientMember>(`${API_BASE_URL}/members/me`);
    return data;
  },
  staleTime: 60_000,
  retry: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  refetchOnMount: false,
});

/// Route-based components

function SidebarNav({ items, pathname }: Readonly<{ items: NavItem[]; pathname: string }>) {
  const { setOpenMobile } = useSidebar();
  const closeMobile = useCallback(() => {
    setOpenMobile(false);
  }, [setOpenMobile]);

  return (
    <SidebarMenu className="group-data-[collapsible=icon]:items-center">
      {items.map((item) => (
        <SidebarMenuItem
          key={item.to}
          className={cn(item.sub && "ml-4 group-data-[collapsible=icon]:ml-0")}
        >
          <SidebarMenuButton
            isActive={pathname === item.to}
            tooltip={item.label}
            className="data-active:bg-brand-teal/18 data-active:font-semibold"
            render={
              <Link to={item.to} onClick={closeMobile}>
                <item.icon />
                <span>{item.label}</span>
              </Link>
            }
          />
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}

/// Route

function DashboardLayout() {
  const { data: me } = useQuery(meQueryOptions);
  const { pathname } = useLocation();
  const meta = useMatches({ select: (matches) => matches.at(-1)?.staticData ?? EMPTY_STATIC });

  const [collapsed, setCollapsed] = useState(false);

  const handleOpenChange = useCallback((open: boolean) => {
    setCollapsed(!open);
  }, []);
  const toggleSidebar = useCallback(() => {
    setCollapsed((value) => !value);
  }, []);

  const access = ROLES_BY_RANK.find((role) => me?.roles.includes(role));
  const accessLabel = access ? ROLE_META[access].label : "Member";
  const canManage = MANAGE_ROLES.some((role) => me?.roles.includes(role));
  const initials =
    me?.name
      .match(/\S+/g)
      ?.slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() ?? "··";

  const firstName = me?.name.match(/\S+/)?.[0];
  const welcome = firstName ? `Welcome back, ${firstName}!` : "Welcome back!";
  const heading = meta.home ? welcome : (meta.title ?? "Dashboard");
  const sub = meta.home ? `${accessLabel} · Computer Science & Engineering · UC Merced` : meta.sub;

  return (
    <SidebarProvider
      open={!collapsed}
      onOpenChange={handleOpenChange}
      className="h-[calc(100svh-4rem)] min-h-0 md:h-[calc(100svh-5.125rem)]"
      style={SIDEBAR_STYLE}
    >
      <Sidebar collapsible="icon" className="md:top-20.5 md:h-[calc(100svh-5.125rem)]">
        <SidebarHeader className="min-h-16 justify-center border-b border-border">
          <div className="flex items-center gap-2.25 px-1 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
            <button
              type="button"
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
              className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-brand-teal/45 bg-brand-teal/15 text-[#078c79] transition-colors hover:bg-brand-teal/25 dark:text-[#2fead0]"
            >
              {GRID_GLYPH}
            </button>
            <span className="text-[13.5px] font-extrabold whitespace-nowrap text-[#078c79] group-data-[collapsible=icon]:hidden dark:text-[#2fead0]">
              Member Portal
            </span>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="font-extrabold tracking-[0.12em] uppercase">
              Member
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarNav items={NAV_ITEMS} pathname={pathname} />
            </SidebarGroupContent>
          </SidebarGroup>
          {canManage && (
            <SidebarGroup>
              <SidebarGroupLabel className="font-extrabold tracking-[0.12em] uppercase">
                Manage
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarNav items={MANAGE_NAV_ITEMS} pathname={pathname} />
              </SidebarGroupContent>
            </SidebarGroup>
          )}
        </SidebarContent>

        <SidebarFooter className="border-t border-border">
          <SidebarMenu className="group-data-[collapsible=icon]:items-center">
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                className="gap-2.75"
                render={
                  <div>
                    <Avatar className="size-8 shrink-0 border border-brand-sky/30 bg-brand-sky/15">
                      <AvatarFallback className="bg-transparent text-[12px] font-extrabold text-brand-sky">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid min-w-0 flex-1 text-left leading-tight">
                      <span className="truncate text-sm font-bold text-foreground">
                        {me?.name ?? "Member"}
                      </span>
                      <span className="truncate text-[11.5px] font-semibold text-muted-foreground">
                        {accessLabel}
                        {me?.display_name ? ` · ${me.display_name}` : ""}
                      </span>
                    </div>
                    <Settings className="ml-auto size-4.5 shrink-0 text-brand-text-sub group-data-[collapsible=icon]:hidden" />
                  </div>
                }
              />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="min-w-0 overflow-y-auto">
        <div className="mx-auto w-full max-w-310 flex-1 px-4 pt-5 pb-14 md:px-8 md:pt-7">
          <div className="mb-5.5">
            <div className="mb-1.75 flex items-center gap-1.75">
              <SidebarTrigger className="-ml-1 text-brand-text-sub" />
              <span className="text-[11.5px] font-bold tracking-[0.06em] text-muted-foreground uppercase">
                {meta.area ?? "Member"}
              </span>
              <ChevronRight className="size-3.25 text-muted-foreground" />
              <span className="text-[11.5px] font-bold tracking-[0.06em] text-brand-sky uppercase">
                {meta.title ?? "Dashboard"}
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              {heading}
            </h1>
            <span className="mt-2.25 block h-1.25 w-14 rounded-[9px] bg-brand-sky" />
            {sub && <p className="mt-3 text-sm text-brand-text-sub">{sub}</p>}
          </div>

          <Outlet />
        </div>
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
}

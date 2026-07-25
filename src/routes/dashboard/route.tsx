import { useForm } from "@tanstack/react-form";
import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
  useLocation,
  useMatches,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import axios from "axios";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import {
  type LucideIcon,
  Calendar,
  Check,
  ChevronRight,
  Copy,
  Download,
  Folder,
  Gauge,
  History,
  Home,
  KeyRound,
  Lock,
  LogOut,
  Settings,
  Shield,
  ShieldCheck,
  ShieldOff,
  Tag,
  Trash2,
  TriangleAlert,
  Unlock,
  User,
  Users,
  X,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import {
  type CSSProperties,
  type ChangeEvent,
  type MouseEvent,
  type SyntheticEvent,
  Fragment,
  useCallback,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";
import { z } from "zod";

import { Footer } from "@/components/app/footer";
import { type PendingSudo, SudoDialog } from "@/components/app/sudo-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
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
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { type Flow, type SubmitResponse, csrfToken, oryInit, orySubmit } from "@/lib/ory";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayout,
  validateSearch: (search: Record<string, unknown>): { settings?: "profile" } => ({
    settings: search.settings === "profile" ? "profile" : undefined,
  }),
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData(meQueryOptions).catch(() => {
      redirect({ to: "/login", search: {}, throw: true });
    });
  },
});

/// Types and Interfaces

type AccountField = "display_name" | "password";
type TotpStep = "scan" | "verify" | "backup";
type SettingsSection = "account" | "security";

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

export interface Sudo {
  active: boolean;
  expires_at?: string | null;
}

interface NavItem {
  to:
    | "/dashboard"
    | "/dashboard/events"
    | "/dashboard/events/past"
    | "/dashboard/projects"
    | "/dashboard/manage/events"
    | "/dashboard/manage/projects"
    | "/dashboard/admin/overview"
    | "/dashboard/admin/members"
    | "/dashboard/admin/tags";
  label: string;
  icon: LucideIcon;
  sub?: boolean;
  roles?: Role[];
}

interface DashboardStaticData {
  area?: string;
  title?: string;
  sub?: string;
  home?: boolean;
}

interface SettingsSectionItem {
  value: SettingsSection;
  label: string;
  icon: LucideIcon;
}

interface TotpEnrollInput {
  code: string;
  enrollFlow: Flow;
}

interface TotpStepItem {
  value: TotpStep;
  label: string;
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
  {
    to: "/dashboard/manage/events",
    label: "Events",
    icon: Calendar,
    roles: ["root", "admin", "leads"],
  },
  {
    to: "/dashboard/manage/projects",
    label: "Projects",
    icon: Folder,
    roles: ["root", "admin", "manager"],
  },
];

const ADMIN_NAV_ITEMS: NavItem[] = [
  {
    to: "/dashboard/admin/overview",
    label: "Overview",
    icon: Gauge,
    roles: ["root", "admin"],
  },
  {
    to: "/dashboard/admin/members",
    label: "Members & Roles",
    icon: Users,
    roles: ["root", "admin"],
  },
  {
    to: "/dashboard/admin/tags",
    label: "Tags",
    icon: Tag,
    roles: ["root", "admin"],
  },
];

const SETTINGS_SECTIONS: SettingsSectionItem[] = [
  { value: "account", label: "Account", icon: User },
  { value: "security", label: "Security", icon: Shield },
];

const TOTP_STEPS: TotpStepItem[] = [
  { value: "scan", label: "Scan" },
  { value: "verify", label: "Verify" },
  { value: "backup", label: "Backup codes" },
];

export const ROLES_BY_RANK: Role[] = ["root", "admin", "manager", "leads"];

const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:8000";

const SIDEBAR_STYLE = {
  "--sidebar-width": "16.5rem",
  "--sidebar-width-icon": "3.5rem",
} as CSSProperties;

const SHARED_QUERY_OPTIONS = {
  staleTime: 60_000,
  retry: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  refetchOnMount: false,
} as const;

const OPEN_SETTINGS = (): { settings: "profile" } => ({ settings: "profile" });
const SETTINGS_MASK = { to: "/dashboard/settings" } as const;
const BLANK_DELETE_FORM = { email: "" };
const TOTP_PARAMS = { algorithm: "SHA1", digits: "6", issuer: TOTP_ISSUER, period: "30" };
const TOTP_ISSUER = "Kanae";
const BACKUP_CODES_FILE = "ucmacm-backup-codes.txt";
const OTP_SLOT_CLASS = "size-11 rounded-md border-l border-border bg-background text-lg";
const STEP_LABEL_CLASS = "inline-flex items-center gap-1.5 text-[12px] font-bold";
const STEP_BADGE_CLASS =
  "inline-flex size-5 shrink-0 items-center justify-center rounded-full text-[11px]";
const STEP_LINE_CLASS = "h-0.5 flex-1 rounded-full";
const EMPTY_CODES: string[] = [];
const FIELD_ERROR_CLASS = "text-[12px] font-semibold text-[#e13737] dark:text-[#ff6b6b]";

const RAIL_STYLE = { "--sidebar-width": "13.125rem" } as CSSProperties;
const RAIL_BUTTON_CLASS =
  "h-auto gap-3 rounded-xl border border-transparent px-3 py-2.75 text-[14.5px] font-semibold text-brand-text-sub data-active:border-brand-teal/45 data-active:bg-brand-teal/14 data-active:font-bold data-active:text-foreground [&_svg]:size-4.75";
const RAIL_MARKER_CLASS = "absolute top-2 -left-3 bottom-2 w-1 rounded-[9px] bg-brand-sky";
const RAIL_ICON_CLASS =
  "flex size-7.5 shrink-0 items-center justify-center rounded-[9px] group-data-active/menu-button:bg-card group-data-active/menu-button:text-[#078c79] group-data-active/menu-button:ring-1 group-data-active/menu-button:ring-border dark:group-data-active/menu-button:text-[#2fead0]";
const PANEL_CLASS =
  "min-w-0 flex-1 overflow-y-auto bg-background px-7.5 py-6.5 [scrollbar-color:auto] [&::-webkit-scrollbar-button]:hidden [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:border-3 [&::-webkit-scrollbar-thumb]:border-transparent [&::-webkit-scrollbar-thumb]:bg-muted-foreground/40 [&::-webkit-scrollbar-thumb]:bg-clip-content [&::-webkit-scrollbar-thumb:hover]:bg-muted-foreground/65 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-2.5";
const PANEL_HEADING_CLASS = "text-2xl font-bold tracking-tight text-foreground";
const PANEL_RULE_CLASS = "mt-2.25 block h-1.25 w-14 rounded-[9px] bg-brand-sky";
const PANEL_SUB_CLASS = "mt-3 mb-6 text-[13.5px] text-muted-foreground";
const FORM_ROW_CLASS =
  "grid items-center gap-5 rounded-[14px] border border-border bg-card px-5 py-4.5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]";
const SECTION_TITLE_CLASS = "text-base font-extrabold text-foreground";
const SECTION_SUB_CLASS = "mt-0.75 mb-4 text-[13px] text-muted-foreground";
const ROW_TITLE_CLASS = "block text-base font-extrabold text-foreground";
const SECURITY_ROW_CLASS =
  "flex items-center gap-3.5 rounded-[14px] border border-border bg-card px-5 py-4.5";
const SECURITY_ICON_CLASS =
  "flex size-11 shrink-0 items-center justify-center rounded-xl border border-border";
const SECURITY_ROW_TITLE_CLASS =
  "flex flex-wrap items-center gap-2 text-[15px] font-extrabold text-foreground";
const SECURITY_ROW_SUB_CLASS = "mt-1 text-[12.5px]/relaxed text-muted-foreground";
const ROW_SUB_CLASS = "mt-1.25 text-[12.5px]/relaxed text-muted-foreground";
const INPUT_CLASS = "h-11 rounded-xl border-border bg-background px-3.25 text-[15px]";
const TEAL_BUTTON_CLASS =
  "h-11 rounded-full bg-brand-teal px-5.5 text-[15px] font-bold text-primary shadow-[0px_4px_14px_rgba(112,144,176,0.14)] hover:bg-brand-teal/90";
const SIGN_OUT_BUTTON_CLASS =
  "font-bold text-brand-text-sub hover:bg-destructive/8 hover:text-destructive/80 hover:ring-1 hover:ring-destructive/20 hover:shadow-[0_0_16px_-6px_#e1373759] dark:hover:shadow-[0_0_16px_-6px_#ff6b6b45]";
const DANGER_BUTTON_CLASS =
  "h-10 rounded-full border-destructive/55 bg-transparent px-5 font-bold text-destructive hover:bg-destructive/10";

/// Zod schemas

const accountSchema = z.object({
  display_name: z
    .string()
    .trim()
    .min(1, "Enter a display name.")
    .max(64, "Keep it under 64 characters."),
  password: z
    .string()
    .refine((value) => value === "" || value.length >= 16, "Use at least 16 characters."),
});

/// Tanstack Query options

export const meQueryOptions = queryOptions({
  queryKey: ["members", "me"],
  queryFn: async () => {
    const { data } = await axios.get<ClientMember>(`${API_BASE_URL}/members/me`);
    return data;
  },
  ...SHARED_QUERY_OPTIONS,
});

export const sudoQueryOptions = queryOptions({
  queryKey: ["sudo", "status"],
  queryFn: async () => {
    const { data } = await axios.get<Sudo>(`${API_BASE_URL}/sudo`);
    return data;
  },
  ...SHARED_QUERY_OPTIONS,
});

export const settingsFlowQueryOptions = queryOptions({
  queryKey: ["ory", "settings"],
  queryFn: async () => {
    return await oryInit("settings", {});
  },
  ...SHARED_QUERY_OPTIONS,
});

/// Helper functions

export function isSudoActive(sudo: Sudo | undefined): boolean {
  return sudo?.active === true;
}

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
  const navigate = useNavigate();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: me } = useQuery(meQueryOptions);
  const { data: sudo } = useQuery(sudoQueryOptions);
  const { data: flow } = useQuery(settingsFlowQueryOptions);
  const { pathname } = useLocation();
  const { settings } = Route.useSearch();
  const meta = useMatches({ select: (matches) => matches.at(-1)?.staticData ?? EMPTY_STATIC });

  const [collapsed, setCollapsed] = useState(false);
  const [section, setSection] = useState<SettingsSection>("account");
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [pendingSudo, setPendingSudo] = useState<PendingSudo>();
  const [totpStep, setTotpStep] = useState<TotpStep>();
  const [totpCode, setTotpCode] = useState("");
  const [backupFlow, setBackupFlow] = useState<Flow>();

  const { mutate: revokeSudo } = useMutation({
    mutationFn: async () => {
      await axios.delete(`${API_BASE_URL}/sudo/revoke`);
    },
    onMutate: () => {
      queryClient.setQueryData<Sudo>(sudoQueryOptions.queryKey, { active: false });
    },
  });
  const endSudo = useCallback(() => {
    revokeSudo();
  }, [revokeSudo]);

  const { mutate: signOut, isPending: signingOut } = useMutation({
    mutationFn: async () => {
      await axios.post(`${API_BASE_URL}/members/logout`);
    },
    onSuccess: async () => {
      queryClient.clear();
      await navigate({ to: "/login", search: {} });
    },
    onError: () => toast.error("Couldn't sign you out. Please try again."),
  });

  const followOry = useCallback(
    async (result: SubmitResponse) => {
      if (result.kind !== "redirect" && result.kind !== "refresh") return false;
      const target = new URL(result.url);
      if (result.kind === "refresh") {
        // Kanae should be updated to use /dashboard/settings instead
        target.searchParams.set("return_to", `${globalThis.location.origin}/dashboard/settings`);
        toast.info(
          "Your sign-in is too old to change security settings. Sign in again to continue.",
        );
      }
      await navigate({ href: target.href });
      return true;
    },
    [navigate],
  );
  const { mutate: enrollTotp, isPending: enrolling } = useMutation({
    mutationFn: async ({ code, enrollFlow }: TotpEnrollInput) => {
      const enrolled = await orySubmit(enrollFlow.ui.action, {
        method: "totp",
        totp_code: code,
        csrf_token: csrfToken(enrollFlow),
      });
      if (enrolled.kind !== "success" || !enrolled.flow) return enrolled;
      return orySubmit(enrolled.flow.ui.action, {
        method: "lookup_secret",
        lookup_secret_regenerate: true,
        csrf_token: csrfToken(enrolled.flow),
      });
    },
    onSuccess: async (result) => {
      if (await followOry(result)) return;
      if (result.kind !== "success" || !result.flow) {
        toast.error(
          result.kind === "validation"
            ? (result.flow.ui.messages?.at(0)?.text ?? "That code didn't match. Try the next one.")
            : "That setup session expired. Close this and start again.",
        );
        setTotpCode("");
        await queryClient.invalidateQueries({ queryKey: settingsFlowQueryOptions.queryKey });
        return;
      }
      setBackupFlow(result.flow);
      setTotpCode("");
      setTotpStep("backup");
    },
    onError: () => toast.error("Couldn't finish setup. Please try again."),
  });

  const { mutate: regenerateBackup, isPending: regenerating } = useMutation({
    mutationFn: async () => {
      const fresh = await oryInit("settings", {});
      return orySubmit(fresh.ui.action, {
        method: "lookup_secret",
        lookup_secret_regenerate: true,
        csrf_token: csrfToken(fresh),
      });
    },
    onSuccess: async (result) => {
      if (await followOry(result)) return;
      if (result.kind !== "success" || !result.flow) {
        toast.error("Couldn't generate new backup codes. Please try again.");
        return;
      }
      setBackupFlow(result.flow);
      setTotpStep("backup");
    },
    onError: () => toast.error("Couldn't generate new backup codes. Please try again."),
  });

  const { mutate: confirmBackup, isPending: confirmingBackup } = useMutation({
    mutationFn: async (pendingFlow: Flow) =>
      orySubmit(pendingFlow.ui.action, {
        method: "lookup_secret",
        lookup_secret_confirm: true,
        csrf_token: csrfToken(pendingFlow),
      }),
    onSuccess: async (result) => {
      if (await followOry(result)) return;
      if (result.kind !== "success") {
        toast.error("Couldn't save those backup codes. Please try again.");
        return;
      }
      setTotpStep(undefined);
      setBackupFlow(undefined);
      toast.success("Two-factor authentication is on.");
      await queryClient.invalidateQueries({ queryKey: settingsFlowQueryOptions.queryKey });
      await queryClient.invalidateQueries({ queryKey: meQueryOptions.queryKey });
    },
    onError: () => toast.error("Couldn't save those backup codes. Please try again."),
  });

  const { mutate: disableTotp, isPending: disabling } = useMutation({
    mutationFn: async () => {
      const fresh = await oryInit("settings", {});
      return orySubmit(fresh.ui.action, {
        method: "totp",
        totp_unlink: true,
        csrf_token: csrfToken(fresh),
      });
    },
    onSuccess: async (result) => {
      if (await followOry(result)) return;
      if (result.kind !== "success") {
        toast.error("Couldn't turn off two-factor. Please try again.");
        return;
      }
      toast.success("Two-factor authentication is off.");
      await queryClient.invalidateQueries({ queryKey: settingsFlowQueryOptions.queryKey });
      await queryClient.invalidateQueries({ queryKey: meQueryOptions.queryKey });
    },
    onError: () => toast.error("Couldn't turn off two-factor. Please try again."),
  });

  const { mutate: deleteAccount, isPending: deleting } = useMutation({
    mutationFn: async () => {
      await axios.delete(`${API_BASE_URL}/members/me`);
    },
    onSuccess: async () => {
      queryClient.clear();
      toast.success("Your account has been deleted.");
      await navigate({ to: "/" });
    },
    onError: () => toast.error("Couldn't delete your account. Please try again."),
  });

  const deleteSchema = useMemo(
    () =>
      z.object({
        email: z
          .email("Enter a valid email address.")
          .refine(
            (value) => value.trim().toLowerCase() === me?.email.toLowerCase(),
            "That isn't this account's email address.",
          ),
      }),
    [me],
  );
  const accountForm = useForm({
    defaultValues: { display_name: me?.display_name ?? me?.name ?? "", password: "" },
    validators: { onChange: accountSchema },
    onSubmit: async ({ value }) => {
      if (!me || !flow) return;
      const profile = await orySubmit(flow.ui.action, {
        method: "profile",
        csrf_token: csrfToken(flow),
        traits: {
          email: me.email,
          name: me.name,
          display_name: value.display_name.trim() || undefined,
        },
      });
      const passwordFlow =
        profile.kind === "success" && value.password ? await oryInit("settings", {}) : undefined;
      const response = passwordFlow
        ? await orySubmit(passwordFlow.ui.action, {
            method: "password",
            csrf_token: csrfToken(passwordFlow),
            password: value.password,
          })
        : profile;

      if (response.kind === "redirect") {
        toast.error(
          "Your session needs a refresh to change credentials — log out, log back in, then retry within 15 minutes.",
        );
        return;
      }
      if (response.kind !== "success") {
        toast.error(
          response.kind === "validation"
            ? (response.flow.ui.messages?.at(0)?.text ?? "Couldn't save those changes.")
            : "That settings session expired. Reopen settings and try again.",
        );
        await queryClient.invalidateQueries({ queryKey: settingsFlowQueryOptions.queryKey });
        return;
      }
      accountForm.reset({ display_name: value.display_name.trim(), password: "" });
      toast.success("Account updated.");
      await queryClient.invalidateQueries({ queryKey: meQueryOptions.queryKey });
      await queryClient.invalidateQueries({ queryKey: settingsFlowQueryOptions.queryKey });
    },
  });

  const deleteForm = useForm({
    defaultValues: BLANK_DELETE_FORM,
    validators: { onChange: deleteSchema },
    onSubmit: () => {
      if (isSudoActive(sudo)) {
        deleteAccount();
        return;
      }
      setPendingSudo({
        title: "Delete your own account",
        detail:
          "This wipes your sessions, and purges all data assoicated with you. There is no undo and no recovery.",
        run: () => {
          deleteAccount();
        },
      });
    },
  });

  const handleOpenChange = useCallback((open: boolean) => {
    setCollapsed(!open);
  }, []);
  const toggleSidebar = useCallback(() => {
    setCollapsed((value) => !value);
  }, []);
  const closeSettings = useCallback(() => {
    router.history.back();
  }, [router]);
  const handleSettingsOpenChange = useCallback(
    (open: boolean) => {
      if (!open) closeSettings();
    },
    [closeSettings],
  );
  const selectSection = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    setSection(event.currentTarget.dataset.section as SettingsSection);
  }, []);
  const handleAccountText = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      accountForm.setFieldValue(name as AccountField, value);
    },
    [accountForm],
  );
  const submitAccount = useCallback(
    (event: SyntheticEvent<HTMLFormElement>) => {
      event.preventDefault();
      void accountForm.handleSubmit();
    },
    [accountForm],
  );
  const handleDeleteText = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      deleteForm.setFieldValue("email", event.target.value);
    },
    [deleteForm],
  );
  const submitDelete = useCallback(
    (event: SyntheticEvent<HTMLFormElement>) => {
      event.preventDefault();
      void deleteForm.handleSubmit();
    },
    [deleteForm],
  );
  const startDelete = useCallback(() => {
    setConfirmingDelete(true);
  }, []);
  const cancelDelete = useCallback(() => {
    setConfirmingDelete(false);
    deleteForm.reset();
  }, [deleteForm]);
  const submitSignOut = useCallback(() => {
    signOut();
  }, [signOut]);
  const clearSudo = useCallback(() => {
    setPendingSudo(undefined);
  }, []);

  const startTotp = useCallback(() => {
    setTotpCode("");
    setTotpStep("scan");
  }, []);
  const goToVerify = useCallback(() => {
    setTotpStep("verify");
  }, []);
  const submitTotpCode = useCallback(() => {
    if (flow && totpCode.length === 6) enrollTotp({ code: totpCode, enrollFlow: flow });
  }, [flow, totpCode, enrollTotp]);
  const submitBackupConfirm = useCallback(() => {
    if (backupFlow) confirmBackup(backupFlow);
  }, [backupFlow, confirmBackup]);
  const closeTotp = useCallback(() => {
    if (backupFlow) toast.warning("Backup codes discarded — regenerate them from Security.");
    setTotpStep(undefined);
    setBackupFlow(undefined);
    setTotpCode("");
  }, [backupFlow]);
  const handleTotpOpenChange = useCallback(
    (open: boolean) => {
      if (!open) closeTotp();
    },
    [closeTotp],
  );
  const startRegenerate = useCallback(() => {
    if (isSudoActive(sudo)) {
      regenerateBackup();
      return;
    }
    setPendingSudo({
      title: "Regenerate backup codes",
      detail: "The codes you have now stop working the moment new ones are issued.",
      run: () => {
        regenerateBackup();
      },
    });
  }, [sudo, regenerateBackup]);
  const startDisableTotp = useCallback(() => {
    if (isSudoActive(sudo)) {
      disableTotp();
      return;
    }
    setPendingSudo({
      title: "Turn off two-factor authentication",
      detail: "Your account drops back to a password alone, and sudo stops being available.",
      run: () => {
        disableTotp();
      },
    });
  }, [sudo, disableTotp]);

  const backupCodes =
    backupFlow?.ui.nodes
      .find((node) => node.attributes.id === "lookup_secret_codes")
      ?.attributes.text?.context?.secrets?.map((secret) => secret.text ?? "") ?? EMPTY_CODES;
  const copyBackupCodes = useCallback(() => {
    navigator.clipboard
      .writeText(backupCodes.join("\n"))
      .then(() => {
        toast.success("Backup codes copied.");
      })
      .catch(() => {
        toast.error("Couldn't copy the backup codes.");
      });
  }, [backupCodes]);

  const totpEnrolled =
    flow?.ui.nodes.some((node) => node.attributes.name === "totp_unlink") ?? false;
  const totpSecret = flow?.ui.nodes.find((node) => node.attributes.id === "totp_secret_key")
    ?.attributes.text?.text;
  const totpLabel = encodeURIComponent(`${TOTP_ISSUER}:${me?.email ?? ""}`);
  const totpQuery = new URLSearchParams({ ...TOTP_PARAMS, secret: totpSecret ?? "" });
  const totpUri = `otpauth://totp/${totpLabel}?${totpQuery.toString()}`;
  const totpIndex = TOTP_STEPS.findIndex((item) => item.value === totpStep);
  const backupCodesHref = `data:text/plain;charset=utf-8,${encodeURIComponent(backupCodes.join("\n"))}`;

  const access = ROLES_BY_RANK.find((role) => me?.roles.includes(role));
  const accessLabel = access ? ROLE_META[access].label : "Member";
  const manageItems = useMemo(
    () => MANAGE_NAV_ITEMS.filter((item) => item.roles?.some((role) => me?.roles.includes(role))),
    [me],
  );
  const adminItems = useMemo(
    () => ADMIN_NAV_ITEMS.filter((item) => item.roles?.some((role) => me?.roles.includes(role))),
    [me],
  );
  const initials =
    me?.name
      .match(/\S+/g)
      ?.slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() ?? "··";

  const sudoElevated = isSudoActive(sudo);

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
              className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-brand-teal/45 bg-brand-teal/15 text-[#067b6a] transition-colors hover:bg-brand-teal/25 dark:text-[#2fead0]"
            >
              {GRID_GLYPH}
            </button>
            <span className="text-[13.5px] font-extrabold whitespace-nowrap text-[#067b6a] group-data-[collapsible=icon]:hidden dark:text-[#2fead0]">
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
          {manageItems.length > 0 && (
            <SidebarGroup>
              <SidebarGroupLabel className="font-extrabold tracking-[0.12em] uppercase">
                Manage
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarNav items={manageItems} pathname={pathname} />
              </SidebarGroupContent>
            </SidebarGroup>
          )}
          {adminItems.length > 0 && (
            <SidebarGroup>
              <SidebarGroupLabel className="font-extrabold tracking-[0.12em] uppercase">
                Admin
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarNav items={adminItems} pathname={pathname} />
              </SidebarGroupContent>
            </SidebarGroup>
          )}
        </SidebarContent>

        <SidebarFooter className="border-t border-border">
          <SidebarMenu className="group-data-[collapsible=icon]:items-center">
            {sudoElevated && (
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Sudo active — end elevation"
                  onClick={endSudo}
                  className="mb-1 justify-center border border-[#e0a100]/40 font-semibold text-[#a9760a] hover:bg-[#f7b731]/12 hover:text-[#a9760a] dark:border-[#f7c948]/30 dark:text-[#f7c948] dark:hover:text-[#f7c948]"
                >
                  <Unlock />
                  <span>End elevation</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
            <SidebarMenuItem className="flex items-center gap-1">
              <SidebarMenuButton
                size="lg"
                tooltip="Settings"
                className="flex-1 gap-2.75"
                render={
                  <Link from="/dashboard" search={OPEN_SETTINGS} mask={SETTINGS_MASK}>
                    <Avatar className="size-8 shrink-0 border border-brand-sky/30 bg-brand-sky/15">
                      <AvatarFallback className="bg-transparent text-[12px] font-extrabold text-brand-sky-text">
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
                  </Link>
                }
              />
              <SidebarMenuAction
                aria-label="Settings"
                className="static size-8 shrink-0 text-brand-text-sub after:hidden [&>svg]:size-4.5"
                render={
                  <Link from="/dashboard" search={OPEN_SETTINGS} mask={SETTINGS_MASK}>
                    <Settings />
                  </Link>
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
              <span className="text-[11.5px] font-bold tracking-[0.06em] text-brand-sky-text uppercase">
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

      <Dialog open={settings === "profile"} onOpenChange={handleSettingsOpenChange}>
        <DialogContent
          showCloseButton={false}
          className="flex h-[min(660px,88vh)] flex-col gap-0 overflow-hidden rounded-[20px] p-0 sm:max-w-250"
        >
          <div className="flex shrink-0 items-center gap-4 border-b border-border px-5.5 py-4.5">
            <span className="flex size-10.5 shrink-0 items-center justify-center rounded-xl bg-brand-teal/15 text-brand-teal-alt">
              <Settings className="size-5.5" />
            </span>
            <div className="min-w-0 flex-1">
              <DialogTitle className="text-[19px] font-extrabold">Settings</DialogTitle>
              <DialogDescription className="mt-0.5 text-[12.5px]">
                Manage your preferences
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              className={SIGN_OUT_BUTTON_CLASS}
              disabled={signingOut}
              onClick={submitSignOut}
            >
              <LogOut />
              {signingOut ? "Signing out…" : "Sign out"}
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Close settings"
              onClick={closeSettings}
            >
              <X />
            </Button>
          </div>

          <div className="flex min-h-0 flex-1">
            <Sidebar
              collapsible="none"
              style={RAIL_STYLE}
              className="shrink-0 border-r border-border"
            >
              <SidebarContent>
                <SidebarGroup className="px-3.5 py-5.5">
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {SETTINGS_SECTIONS.map((item) => (
                        <SidebarMenuItem key={item.value}>
                          {section === item.value && <span className={RAIL_MARKER_CLASS} />}
                          <SidebarMenuButton
                            isActive={section === item.value}
                            data-section={item.value}
                            className={RAIL_BUTTON_CLASS}
                            onClick={selectSection}
                          >
                            <span className={RAIL_ICON_CLASS}>
                              <item.icon />
                            </span>
                            <span>{item.label}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
            </Sidebar>

            <div className={PANEL_CLASS}>
              {section === "account" ? (
                <>
                  <h2 className={PANEL_HEADING_CLASS}>Account</h2>
                  <span className={PANEL_RULE_CLASS} />
                  <p className={PANEL_SUB_CLASS}>Your account settings.</p>

                  <div className={SECTION_TITLE_CLASS}>Account Information</div>
                  <p className={SECTION_SUB_CLASS}>Manage your display name and credentials.</p>

                  <form onSubmit={submitAccount}>
                    <div className="flex flex-col gap-3.25">
                      <accountForm.Field name="display_name">
                        {(field) => (
                          <div className={FORM_ROW_CLASS}>
                            <div>
                              <Label htmlFor="settings-display-name" className={ROW_TITLE_CLASS}>
                                Display Name
                              </Label>
                              <p className={ROW_SUB_CLASS}>
                                This is how others will see you on the site.
                              </p>
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <Input
                                id="settings-display-name"
                                name="display_name"
                                autoComplete="nickname"
                                value={field.state.value}
                                placeholder="Display name"
                                className={INPUT_CLASS}
                                onChange={handleAccountText}
                              />
                              {field.state.meta.isTouched && !field.state.meta.isValid && (
                                <span className={FIELD_ERROR_CLASS}>
                                  {field.state.meta.errors[0]?.message}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </accountForm.Field>

                      <div className={FORM_ROW_CLASS}>
                        <div>
                          <span className={ROW_TITLE_CLASS}>Email Address</span>
                          <p className={ROW_SUB_CLASS}>
                            Your email address cannot be changed. (Hover to reveal)
                          </p>
                        </div>
                        <div className="truncate rounded-xl border border-border bg-background px-3.25 py-2.75 text-[15px] text-brand-text-sub blur-[7px] transition-[filter] duration-200 select-none hover:blur-none hover:select-auto">
                          {me?.email ?? "—"}
                        </div>
                      </div>

                      <accountForm.Field name="password">
                        {(field) => (
                          <div className={FORM_ROW_CLASS}>
                            <div>
                              <Label htmlFor="settings-password" className={ROW_TITLE_CLASS}>
                                New Password
                              </Label>
                              <p className={ROW_SUB_CLASS}>
                                Leave blank to keep your current one, or use at least 16 characters.
                              </p>
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <Input
                                id="settings-password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                value={field.state.value}
                                placeholder="Password"
                                className={INPUT_CLASS}
                                onChange={handleAccountText}
                              />
                              {field.state.meta.isTouched && !field.state.meta.isValid && (
                                <span className={FIELD_ERROR_CLASS}>
                                  {field.state.meta.errors[0]?.message}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </accountForm.Field>
                    </div>

                    <div className="mt-4.5 flex flex-wrap items-center gap-3.5">
                      <accountForm.Subscribe>
                        {(state) => (
                          <Button
                            type="submit"
                            className={TEAL_BUTTON_CLASS}
                            disabled={!state.canSubmit || state.isSubmitting || !me || !flow}
                          >
                            <Check />
                            {state.isSubmitting ? "Saving…" : "Update Account"}
                          </Button>
                        )}
                      </accountForm.Subscribe>
                    </div>
                  </form>

                  <div className="mt-6.5 border-t border-destructive/25 pt-5.5">
                    <div className="mb-1 text-base font-extrabold text-destructive">
                      Delete Account
                    </div>
                    <p className="mb-3 max-w-140 text-[13px]/relaxed text-brand-text-sub">
                      Permanent. This revokes all sessions, and purges everything assoicated with
                      your user. Events that are created by you stay.
                    </p>
                    {confirmingDelete ? (
                      <form onSubmit={submitDelete} className="flex max-w-100 flex-col gap-2.5">
                        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-3.5 py-3 text-[12.5px]/relaxed text-brand-text-sub">
                          You are deleting{" "}
                          <strong className="text-foreground">{me?.name ?? "your account"}</strong>{" "}
                          ({accessLabel}), along with {me?.projects.length ?? 0} project
                          {me?.projects.length === 1 ? "" : "s"} and {me?.events.length ?? 0} event
                          {me?.events.length === 1 ? "" : "s"} of history. This cannot be undone.
                        </div>
                        <deleteForm.Field name="email">
                          {(field) => (
                            <div className="flex flex-col gap-1.5">
                              <Label
                                htmlFor="settings-delete"
                                className="text-[12.5px] font-bold text-brand-text-sub"
                              >
                                Type your account's email address to confirm
                              </Label>
                              <Input
                                id="settings-delete"
                                name="email"
                                autoComplete="off"
                                value={field.state.value}
                                placeholder="johnsmith@ucmerced.edu"
                                className={INPUT_CLASS}
                                onChange={handleDeleteText}
                              />
                              {field.state.meta.isTouched && !field.state.meta.isValid && (
                                <span className={FIELD_ERROR_CLASS}>
                                  {field.state.meta.errors[0]?.message}
                                </span>
                              )}
                            </div>
                          )}
                        </deleteForm.Field>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            className="font-bold"
                            onClick={cancelDelete}
                          >
                            Cancel
                          </Button>
                          <deleteForm.Subscribe>
                            {(state) => (
                              <Button
                                type="submit"
                                variant="outline"
                                className={DANGER_BUTTON_CLASS}
                                disabled={!state.canSubmit || !state.isDirty || deleting}
                              >
                                <Trash2 />
                                {deleting ? "Deleting…" : "Permanently delete"}
                              </Button>
                            )}
                          </deleteForm.Subscribe>
                        </div>
                      </form>
                    ) : (
                      <Button
                        variant="outline"
                        className={DANGER_BUTTON_CLASS}
                        onClick={startDelete}
                      >
                        <Trash2 />
                        Delete my account
                      </Button>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <h2 className={PANEL_HEADING_CLASS}>Security</h2>
                  <span className={PANEL_RULE_CLASS} />
                  <p className={PANEL_SUB_CLASS}>
                    Protect your account with two-factor authentication.
                  </p>

                  <div className={SECTION_TITLE_CLASS}>Sign-in methods</div>
                  <p className={SECTION_SUB_CLASS}>
                    Second factor sign-in methods. Passkey support will be implemented at some
                    point.
                  </p>

                  <div className={SECURITY_ROW_CLASS}>
                    <span
                      className={cn(
                        SECURITY_ICON_CLASS,
                        totpEnrolled
                          ? "bg-[#15a66e]/15 text-[#15a66e] dark:text-[#3fd68c]"
                          : "bg-background text-brand-text-sub",
                      )}
                    >
                      <Lock className="size-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className={SECURITY_ROW_TITLE_CLASS}>
                        Authenticator app
                        {totpEnrolled && (
                          <Badge className="gap-1.5 border-[#15a66e]/35 bg-[#15a66e]/15 px-2.5 font-bold text-[#15a66e] dark:text-[#3fd68c]">
                            <span className="size-1.5 rounded-full bg-current" />
                            Enabled
                          </Badge>
                        )}
                      </div>
                      <p className={SECURITY_ROW_SUB_CLASS}>
                        {totpEnrolled
                          ? "A 6-digit code from your authenticator is required when you sign in."
                          : "Add a time-based code from Aegis, 1Password, Google Authenticator or similar."}
                      </p>
                    </div>
                    {!totpEnrolled && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="shrink-0 font-bold"
                        disabled={!flow || !totpSecret}
                        onClick={startTotp}
                      >
                        <ShieldCheck />
                        Set up
                      </Button>
                    )}
                  </div>

                  {totpEnrolled && (
                    <>
                      <div className={cn(SECTION_TITLE_CLASS, "mt-6.5")}>Recovery</div>
                      <p className={SECTION_SUB_CLASS}>
                        Options to recover your login if your authenticator is gone.
                      </p>
                      <div className={SECURITY_ROW_CLASS}>
                        <span
                          className={cn(SECURITY_ICON_CLASS, "bg-background text-brand-text-sub")}
                        >
                          <KeyRound className="size-5" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className={SECURITY_ROW_TITLE_CLASS}>Backup codes</div>
                          <p className={SECURITY_ROW_SUB_CLASS}>
                            Single-use codes you saved during setup. Generating a new set retires
                            the old one immediately.
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="shrink-0 font-bold"
                          disabled={regenerating}
                          onClick={startRegenerate}
                        >
                          {regenerating ? "Generating…" : "Regenerate"}
                        </Button>
                      </div>
                    </>
                  )}

                  {totpEnrolled && (
                    <div className="mt-6.5 border-t border-destructive/25 pt-5.5">
                      <div className="mb-1 text-base font-extrabold text-destructive">
                        Turn off two-factor
                      </div>
                      <p className="mb-3 max-w-140 text-[13px]/relaxed text-brand-text-sub">
                        By doing this, your account will now only authenticate via a password,
                        backup codes are purged, and sudo mode will stop
                      </p>
                      <Button
                        variant="outline"
                        className={DANGER_BUTTON_CLASS}
                        disabled={disabling}
                        onClick={startDisableTotp}
                      >
                        <ShieldOff />
                        {disabling ? "Turning off…" : "Turn off two-factor"}
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {totpStep && (
        <Dialog open onOpenChange={handleTotpOpenChange}>
          <DialogContent className="gap-4 sm:max-w-124">
            <DialogHeader>
              <DialogTitle className="text-lg font-extrabold">
                {totpStep === "backup" ? "Save your backup codes" : "Set up two-factor"}
              </DialogTitle>
              <DialogDescription>
                {totpStep === "scan" && "Add the account to your authenticator."}
                {totpStep === "verify" && "Prove the authenticator is working."}
                {totpStep === "backup" && "The only way back in if you lose it."}
              </DialogDescription>
            </DialogHeader>

            <div className="flex items-center gap-2.5">
              {TOTP_STEPS.map((item, index) => (
                <Fragment key={item.value}>
                  {index > 0 && (
                    <span
                      className={cn(
                        STEP_LINE_CLASS,
                        index <= totpIndex ? "bg-brand-teal" : "bg-border",
                      )}
                    />
                  )}
                  <span
                    className={cn(
                      STEP_LABEL_CLASS,
                      index < totpIndex && "text-brand-teal-alt",
                      index === totpIndex && "text-foreground",
                      index > totpIndex && "text-muted-foreground",
                    )}
                  >
                    <span
                      className={cn(
                        STEP_BADGE_CLASS,
                        index <= totpIndex
                          ? "bg-brand-teal/15 text-brand-teal-alt"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      {index < totpIndex ? <Check className="size-3" /> : index + 1}
                    </span>
                    {item.label}
                  </span>
                </Fragment>
              ))}
            </div>

            {totpStep === "scan" && (
              <div className="flex flex-col items-center gap-3.5">
                {totpSecret && (
                  <div className="rounded-xl border border-border bg-white p-3">
                    <QRCodeSVG
                      value={totpUri}
                      size={168}
                      level="M"
                      title="Two-factor setup QR code"
                    />
                  </div>
                )}
                <p className="text-center text-[13px]/relaxed text-brand-text-sub">
                  Scan this within your preferred 2fa manager - Authy, Google Authenticator, etc
                </p>
                <details className="w-full">
                  <summary className="cursor-pointer text-[12.5px] font-bold text-brand-text-sub">
                    Can't scan it?
                  </summary>
                  <code className="mt-2 block rounded-lg border border-border bg-muted px-3 py-2 text-center font-mono text-[13px] tracking-[0.08em] break-all select-all">
                    {totpSecret ?? "…"}
                  </code>
                </details>
              </div>
            )}

            {totpStep === "verify" && (
              <div className="flex flex-col items-center gap-3">
                <p className="text-center text-[13px]/relaxed text-brand-text-sub">
                  Enter the 6-digit code your authenticator is showing right now.
                </p>
                <InputOTP
                  maxLength={6}
                  pattern={REGEXP_ONLY_DIGITS}
                  value={totpCode}
                  onChange={setTotpCode}
                  containerClassName="justify-center"
                >
                  <InputOTPGroup className="gap-2">
                    {Array.from({ length: 6 }, (_, index) => (
                      <InputOTPSlot key={index} index={index} className={OTP_SLOT_CLASS} />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>
            )}

            {totpStep === "backup" && (
              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-2.5 rounded-xl border border-[#e0a100]/40 bg-[#f7b731]/12 p-3.5">
                  <TriangleAlert className="mt-0.5 size-4.5 shrink-0 text-[#e0a100] dark:text-[#f7c948]" />
                  <p className="text-[13px]/relaxed text-brand-text-sub">
                    Each code works once. This is the only time they are shown - store them
                    somewhere that isn't on your device
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2 rounded-xl border border-border bg-muted p-3">
                  {backupCodes.map((code) => (
                    <code key={code} className="text-center font-mono text-[13px] select-all">
                      {code}
                    </code>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={copyBackupCodes}>
                    <Copy />
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    nativeButton={false}
                    className="flex-1"
                    render={
                      <a href={backupCodesHref} download={BACKUP_CODES_FILE}>
                        <Download />
                        Download
                      </a>
                    }
                  />
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="ghost" onClick={closeTotp}>
                Cancel
              </Button>
              {totpStep === "scan" && (
                <Button className={TEAL_BUTTON_CLASS} onClick={goToVerify}>
                  Next
                </Button>
              )}
              {totpStep === "verify" && (
                <Button
                  className={TEAL_BUTTON_CLASS}
                  disabled={totpCode.length < 6 || enrolling}
                  onClick={submitTotpCode}
                >
                  <ShieldCheck />
                  {enrolling ? "Verifying…" : "Verify"}
                </Button>
              )}
              {totpStep === "backup" && (
                <Button
                  className={TEAL_BUTTON_CLASS}
                  disabled={backupCodes.length === 0 || confirmingBackup}
                  onClick={submitBackupConfirm}
                >
                  <Check />
                  {confirmingBackup ? "Saving…" : "I've saved them"}
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <SudoDialog pending={pendingSudo} onClose={clearSudo} />
    </SidebarProvider>
  );
}

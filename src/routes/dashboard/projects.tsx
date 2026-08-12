import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import axios from "axios";
import {
  Calendar,
  Check,
  Clock,
  ExternalLink,
  Folder,
  ImageIcon,
  Lock,
  LockOpen,
  LogOut,
  Mail,
  Search,
  UserPlus,
  Users,
  Video,
} from "lucide-react";
import { type ChangeEvent, type MouseEvent, useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

import { EmptyState } from "@/components/app/dashboard-events";
import { MediaLightbox } from "@/components/app/media-lightbox";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { meQueryOptions } from "@/routes/dashboard/route";
import {
  type FullProjects,
  type MediaRecord,
  type ProjectInvite,
  type ProjectMember,
  type Projects,
} from "@/types/kanae.gen";
import { type KanaePage } from "@/types/pages";

export const Route = createFileRoute("/dashboard/projects")({
  component: ProjectsPage,
  staticData: {
    area: "Member",
    title: "Projects",
    sub: "Browse, join, and manage chapter projects",
  },
  loader: async ({ context: { queryClient } }) => {
    await queryClient.prefetchQuery(projectsQueryOptions);
    await queryClient.prefetchQuery(memberProjectsQueryOptions);
    await queryClient.prefetchQuery(projectInvitesQueryOptions);
  },
});

/// Types and Interfaces

type Scope = "mine" | "all";
type Status = "active" | "archived" | "all";
type DetailTab = "details" | "team" | "gallery";

export type ProjectType = FullProjects["type"];
export type JoinPolicy = FullProjects["join_policy"];
export type InviteKind = ProjectInvite["kind"];
export type InviteStatus = ProjectInvite["status"];
export type MediaKind = MediaRecord["kind"];


interface SigMeta {
  label: string;
  short: string;
  color: string;
}

interface JoinPolicyMeta {
  label: string;
  verb: string;
  desc: string;
}


/// Constants — metadata + presentation

const JOIN_POLICY_ICONS: Record<JoinPolicy, typeof Lock> = {
  open: LockOpen,
  request: UserPlus,
  closed: Lock,
};

export const SIG_META: Record<ProjectType, SigMeta> = {
  independent: { label: "Independent", short: "IND", color: "#5b7a93" },
  sig_swe: { label: "SWE", short: "SWE", color: "#3da9fc" },
  sig_ai: { label: "AI", short: "AI", color: "#00c9a7" },
  sig_cyber: { label: "Cyber", short: "CYB", color: "#ff6b6b" },
  sig_data: { label: "Data", short: "DATA", color: "#f7b731" },
  sig_arch: { label: "Arch", short: "ARCH", color: "#fc5c7d" },
  sig_graph: { label: "Graphics", short: "GFX", color: "#a55eea" },
};

export const JOIN_POLICY_META: Record<JoinPolicy, JoinPolicyMeta> = {
  open: { label: "Open", verb: "Join project", desc: "Anyone can join instantly." },
  request: { label: "Request", verb: "Request to join", desc: "A manager reviews each request." },
  closed: { label: "Closed", verb: "Invite only", desc: "Members are added by invitation only." },
};

const JOIN_POLICY_TONE: Record<JoinPolicy, string> = {
  open: "text-[#15a66e] dark:text-[#3fd68c]",
  request: "text-amber-600 dark:text-amber-400",
  closed: "text-muted-foreground",
};

const SIG_CLASSES: Record<ProjectType, { dot: string; glyph: string; gradient: string }> = {
  independent: {
    gradient: "bg-linear-to-br from-[#5b7a93]/25 to-[#5b7a93]/5",
    glyph: "border-[#5b7a93]/30 bg-[#5b7a93]/15 text-[#5b7a93]",
    dot: "bg-[#5b7a93]",
  },
  sig_swe: {
    gradient: "bg-linear-to-br from-[#3da9fc]/25 to-[#3da9fc]/5",
    glyph: "border-[#3da9fc]/30 bg-[#3da9fc]/15 text-[#3da9fc]",
    dot: "bg-[#3da9fc]",
  },
  sig_ai: {
    gradient: "bg-linear-to-br from-[#00c9a7]/25 to-[#00c9a7]/5",
    glyph: "border-[#00c9a7]/30 bg-[#00c9a7]/15 text-[#00c9a7]",
    dot: "bg-[#00c9a7]",
  },
  sig_cyber: {
    gradient: "bg-linear-to-br from-[#ff6b6b]/25 to-[#ff6b6b]/5",
    glyph: "border-[#ff6b6b]/30 bg-[#ff6b6b]/15 text-[#ff6b6b]",
    dot: "bg-[#ff6b6b]",
  },
  sig_data: {
    gradient: "bg-linear-to-br from-[#f7b731]/25 to-[#f7b731]/5",
    glyph: "border-[#f7b731]/30 bg-[#f7b731]/15 text-[#f7b731]",
    dot: "bg-[#f7b731]",
  },
  sig_arch: {
    gradient: "bg-linear-to-br from-[#fc5c7d]/25 to-[#fc5c7d]/5",
    glyph: "border-[#fc5c7d]/30 bg-[#fc5c7d]/15 text-[#fc5c7d]",
    dot: "bg-[#fc5c7d]",
  },
  sig_graph: {
    gradient: "bg-linear-to-br from-[#a55eea]/25 to-[#a55eea]/5",
    glyph: "border-[#a55eea]/30 bg-[#a55eea]/15 text-[#a55eea]",
    dot: "bg-[#a55eea]",
  },
};

const AVATAR_CLASSES = [
  "bg-[#00c9a7]/15 text-[#00c9a7]",
  "bg-[#3da9fc]/15 text-[#3da9fc]",
  "bg-[#f7b731]/15 text-[#f7b731]",
  "bg-[#fc5c7d]/15 text-[#fc5c7d]",
  "bg-[#a55eea]/15 text-[#a55eea]",
  "bg-[#26de81]/15 text-[#26de81]",
  "bg-[#fd9644]/15 text-[#fd9644]",
  "bg-[#ff6b6b]/15 text-[#ff6b6b]",
];

const DEFAULT_DOT_CLASS = "bg-[#93a3b6]";

/// Constants — regular

const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:8000";
const PROJECTS_PAGE_SIZE = 100;
const CARD_CLASS =
  "rounded-[18px] border border-border bg-card shadow-[0px_4px_14px_rgba(112,144,176,0.14)] dark:shadow-[0px_4px_14px_rgba(0,0,0,0.4)]";
const LOCKED_PILL_CLASS =
  "inline-flex items-center gap-2 rounded-md border border-border bg-muted px-3.5 py-2 text-sm font-bold text-muted-foreground";
const TEAL_BUTTON_CLASS = "bg-brand-teal font-bold text-primary hover:bg-brand-teal/85";
const SECTION_LABEL_CLASS =
  "mb-1.5 text-[11px] font-bold tracking-[0.06em] text-muted-foreground uppercase";
const TAG_PILL_CLASS =
  "inline-flex items-center rounded-full border border-border bg-muted px-2 py-0.5 text-[11px] font-semibold text-brand-text-sub";
const AVATAR_FALLBACK_CLASS = "text-[11px] font-bold";
const POLICY_CHIP_CLASS = "inline-flex items-center gap-1.5 text-xs font-bold";
const FACT_TILE_CLASS = "rounded-xl border border-border bg-muted/60 px-3.5 py-3";
const FACT_LABEL_CLASS =
  "mb-1 text-[10.5px] font-bold tracking-[0.06em] text-muted-foreground uppercase";
const FACT_VALUE_CLASS = "text-[13.5px] font-bold text-foreground";
const MONTH_YEAR_FMT = new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" });

/// Tanstack Query options

export const projectsQueryOptions = queryOptions({
  queryKey: ["projects", "list"],
  queryFn: async () => {
    const { data } = await axios.get<KanaePage<FullProjects>>(`${API_BASE_URL}/projects`, {
      params: { size: PROJECTS_PAGE_SIZE },
    });
    return data.data;
  },
});

const memberProjectsQueryOptions = queryOptions({
  queryKey: ["members", "me", "projects"],
  queryFn: async () => {
    const { data } = await axios.get<Projects[]>(`${API_BASE_URL}/members/me/projects`);
    return data;
  },
  select: (projects: Projects[]) => new Set(projects.map((project) => project.id)),
});

const projectInvitesQueryOptions = queryOptions({
  queryKey: ["members", "me", "projects", "invites", { status: "pending" }],
  queryFn: async () => {
    const { data } = await axios.get<ProjectInvite[]>(
      `${API_BASE_URL}/members/me/projects/invites`,
      { params: { status: "pending" } },
    );
    return data;
  },
});

export const projectMediaQueryOptions = (projectId: string) =>
  queryOptions({
    queryKey: ["projects", projectId, "media"],
    queryFn: async () => {
      const { data } = await axios.get<MediaRecord[]>(
        `${API_BASE_URL}/projects/${projectId}/media`,
      );
      return data;
    },
  });

/// Helper functions

export function mediaArtwork(hash: string, color: string) {
  const seed = Number.parseInt(hash.slice(-6), 16) || 0;
  const cx = 15 + (seed % 55);
  const cy = 12 + (Math.floor(seed / 55) % 45);
  const r = 18 + (seed % 26);
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 90'>` +
    `<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>` +
    `<stop offset='0' stop-color='${color}'/>` +
    `<stop offset='1' stop-color='${color}' stop-opacity='0.35'/></linearGradient></defs>` +
    `<rect width='120' height='90' fill='url(#g)'/>` +
    `<circle cx='${String(cx)}' cy='${String(cy)}' r='${String(r)}' fill='#ffffff' opacity='0.2'/>` +
    `<circle cx='${String(120 - cx)}' cy='${String(90 - cy)}' r='${String(r * 0.7)}' fill='#000000' opacity='0.12'/>` +
    `</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function initialsOf(name: string) {
  return (
    name
      .match(/\S+/g)
      ?.slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() ?? "··"
  );
}

function avatarClassFor(seed: string) {
  const code = (seed.codePointAt(0) ?? 0) + (seed.codePointAt(seed.length - 1) ?? 0);
  return AVATAR_CLASSES[code % AVATAR_CLASSES.length];
}

function fmtMonthYear(iso: string) {
  return MONTH_YEAR_FMT.format(new Date(iso));
}

function patchMembership(
  queryClient: ReturnType<typeof useQueryClient>,
  project: FullProjects,
  user: ProjectMember,
  joined: boolean,
) {
  queryClient.setQueryData<Projects[]>(memberProjectsQueryOptions.queryKey, (old) => {
    if (!old) return old;
    if (!joined) return old.filter((item) => item.id !== project.id);
    return old.some((item) => item.id === project.id) ? old : [...old, { ...project }];
  });
  queryClient.setQueryData<FullProjects[]>(projectsQueryOptions.queryKey, (old) =>
    old?.map((item) => {
      if (item.id !== project.id) return item;
      if (!joined) {
        return { ...item, members: item.members.filter((member) => member.id !== user.id) };
      }
      if (item.members.some((member) => member.id === user.id)) return item;
      return { ...item, members: [...item.members, user] };
    }),
  );
}

/// Route

function ProjectsPage() {
  const queryClient = useQueryClient();

  const { data: projects, isPending } = useQuery(projectsQueryOptions);
  const { data: mineSet } = useQuery(memberProjectsQueryOptions);
  const { data: invites } = useQuery(projectInvitesQueryOptions);
  const { data: me } = useQuery(meQueryOptions);

  const currentUser = useMemo(() => (me ? { id: me.id, name: me.name } : undefined), [me]);

  const [query, setQuery] = useState("");
  const [scope, setScope] = useState<Scope>("mine");
  const [status, setStatus] = useState<Status>("active");
  const [openId, setOpenId] = useState<string>();
  const [tab, setTab] = useState<DetailTab>("details");
  const [lightboxIndex, setLightboxIndex] = useState<number>();

  const { data: mediaData, isPending: mediaPending } = useQuery({
    ...projectMediaQueryOptions(openId ?? "none"),
    enabled: openId !== undefined,
  });

  const { mutate: joinMutate } = useMutation({
    mutationFn: (project: FullProjects) =>
      axios.post(`${API_BASE_URL}/projects/${project.id}/join`),
    onMutate: async (project) => {
      await queryClient.cancelQueries();
      const snapshot = queryClient.getQueryData<FullProjects[]>(projectsQueryOptions.queryKey);
      const mine = queryClient.getQueryData<Projects[]>(memberProjectsQueryOptions.queryKey);
      if (currentUser) patchMembership(queryClient, project, currentUser, true);
      return { mine, snapshot };
    },
    onError: (_error, _project, context) => {
      queryClient.setQueryData(projectsQueryOptions.queryKey, context?.snapshot);
      queryClient.setQueryData(memberProjectsQueryOptions.queryKey, context?.mine);
      toast.error("Couldn't join the project. Please try again.");
    },
    onSuccess: () => toast.success("You're on the team!"),
  });

  const { mutate: leaveMutate } = useMutation({
    mutationFn: (project: FullProjects) =>
      axios.delete(`${API_BASE_URL}/projects/${project.id}/leave`),
    onMutate: async (project) => {
      await queryClient.cancelQueries();

      const snapshot = queryClient.getQueryData<FullProjects[]>(projectsQueryOptions.queryKey);
      const mine = queryClient.getQueryData<Projects[]>(memberProjectsQueryOptions.queryKey);

      if (currentUser) patchMembership(queryClient, project, currentUser, false);
      return { mine, snapshot };
    },
    onError: (_error, _project, context) => {
      queryClient.setQueryData(projectsQueryOptions.queryKey, context?.snapshot);
      queryClient.setQueryData(memberProjectsQueryOptions.queryKey, context?.mine);
      toast.error("Couldn't leave the project. Please try again.");
    },
    onSuccess: () => toast.success("You've left the project."),
  });

  const { mutate: requestMutate } = useMutation({
    mutationFn: async (project: FullProjects) => {
      const { data } = await axios.post<ProjectInvite>(
        `${API_BASE_URL}/projects/${project.id}/requests`,
        { message: undefined },
      );
      return data;
    },
    onMutate: async (project) => {
      await queryClient.cancelQueries({ queryKey: projectInvitesQueryOptions.queryKey });
      const snapshot = queryClient.getQueryData<ProjectInvite[]>(
        projectInvitesQueryOptions.queryKey,
      );
      const pendingId = crypto.randomUUID();
      if (currentUser)
        queryClient.setQueryData<ProjectInvite[]>(
          projectInvitesQueryOptions.queryKey,
          (old = []) => [
            ...old,
            {
              id: pendingId,
              project_id: project.id,
              kind: "request",
              status: "pending",
              member: currentUser,
              created_at: new Date().toISOString(),
            },
          ],
        );
      return { pendingId, snapshot };
    },
    onError: (_error, _project, context) => {
      queryClient.setQueryData(projectInvitesQueryOptions.queryKey, context?.snapshot);
      toast.error("Couldn't send your request. Please try again.");
    },
    onSuccess: (invite, _project, context) => {
      queryClient.setQueryData<ProjectInvite[]>(projectInvitesQueryOptions.queryKey, (old = []) =>
        old.map((item) => (item.id === context.pendingId ? invite : item)),
      );
      toast.success("Request sent — a manager will review it.");
    },
  });

  const { mutate: respondMutate } = useMutation({
    mutationFn: ({ accept, invite }: { accept: boolean; invite: ProjectInvite }) =>
      axios.post(
        `${API_BASE_URL}/projects/${invite.project_id}/invites/${invite.id}/${accept ? "accept" : "decline"}`,
      ),
    onMutate: async ({ accept, invite }) => {
      await queryClient.cancelQueries();
      const snapshot = queryClient.getQueryData<FullProjects[]>(projectsQueryOptions.queryKey);
      const mine = queryClient.getQueryData<Projects[]>(memberProjectsQueryOptions.queryKey);
      const invitesSnapshot = queryClient.getQueryData<ProjectInvite[]>(
        projectInvitesQueryOptions.queryKey,
      );
      queryClient.setQueryData<ProjectInvite[]>(projectInvitesQueryOptions.queryKey, (old) =>
        (old ?? []).filter((item) => item.id !== invite.id),
      );
      if (accept) {
        const project = snapshot?.find((item) => item.id === invite.project_id);
        if (project && currentUser) patchMembership(queryClient, project, currentUser, true);
      }
      return { invitesSnapshot, mine, snapshot };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(projectsQueryOptions.queryKey, context?.snapshot);
      queryClient.setQueryData(memberProjectsQueryOptions.queryKey, context?.mine);
      queryClient.setQueryData(projectInvitesQueryOptions.queryKey, context?.invitesSnapshot);
      toast.error("Couldn't respond to the invite. Please try again.");
    },
    onSuccess: (_data, { accept }) =>
      toast.success(accept ? "Invitation accepted — welcome aboard!" : "Invitation declined."),
  });

  const handleCardOpen = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    const id = event.currentTarget.dataset.projectId;
    if (id) {
      setTab("details");
      setOpenId(id);
    }
  }, []);
  const handleInviteAction = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      const { action, inviteId } = event.currentTarget.dataset;
      const invite = (invites ?? []).find((item) => item.id === inviteId);
      if (invite) respondMutate({ accept: action === "accept", invite });
    },
    [invites, respondMutate],
  );
  const handleOpenChange = useCallback((next: boolean) => {
    if (!next) {
      setOpenId(undefined);
      setLightboxIndex(undefined);
    }
  }, []);
  const handleLightboxClose = useCallback(() => {
    setLightboxIndex(undefined);
  }, []);
  const handleQueryChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  }, []);
  const handleScopeChange = useCallback((value: string) => {
    setScope(value as Scope);
  }, []);
  const handleStatusChange = useCallback((value: string) => {
    setStatus(value as Status);
  }, []);
  const handleTabChange = useCallback((value: DetailTab) => {
    setTab(value);
  }, []);

  const handleMediaOpen = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      const { hash } = event.currentTarget.dataset;
      const index = (mediaData ?? []).findIndex((media) => media.hash === hash);
      if (index !== -1) setLightboxIndex(index);
    },
    [mediaData],
  );

  const openProject = openId ? projects?.find((project) => project.id === openId) : undefined;
  const openColor = openProject ? SIG_META[openProject.type].color : "#93a3b6";
  const mediaSrc = useCallback(
    (item: MediaRecord) => item.url || mediaArtwork(item.hash, openColor),
    [openColor],
  );

  const handleJoin = useCallback(() => {
    if (openProject) joinMutate(openProject);
  }, [openProject, joinMutate]);
  const handleLeave = useCallback(() => {
    if (openProject) leaveMutate(openProject);
  }, [openProject, leaveMutate]);
  const handleRequest = useCallback(() => {
    if (openProject) requestMutate(openProject);
  }, [openProject, requestMutate]);

  const incomingInvites = useMemo(
    () =>
      (invites ?? []).filter((invite) => invite.kind === "invite" && invite.status === "pending"),
    [invites],
  );

  const { filtered, mineCount } = useMemo(() => {
    const all = projects ?? [];
    const scoped = scope === "mine" ? all.filter((project) => mineSet?.has(project.id)) : all;
    const normalized = query.trim().toLowerCase();
    return {
      mineCount: all.filter((project) => mineSet?.has(project.id)).length,
      filtered: scoped
        .filter(
          (project) => status === "all" || (status === "active" ? project.active : !project.active),
        )
        .filter((project) =>
          `${project.name} ${project.description} ${(project.tags ?? []).join(" ")}`
            .toLowerCase()
            .includes(normalized),
        ),
    };
  }, [projects, mineSet, scope, status, query]);

  const openTags = openProject?.tags ?? [];
  const openMedia = useMemo(() => mediaData ?? [], [mediaData]);
  const openJoined = openProject ? (mineSet?.has(openProject.id) ?? false) : false;
  const openPending =
    openProject !== undefined &&
    (invites ?? []).some(
      (invite) =>
        invite.project_id === openProject.id &&
        invite.kind === "request" &&
        invite.status === "pending",
    );
  const categoryDotClass = openProject ? SIG_CLASSES[openProject.type].dot : undefined;

  const minePlural = mineCount === 1 ? "" : "s";
  const chapterCount = projects?.length ?? 0;
  const chapterPlural = chapterCount === 1 ? "" : "s";

  const OpenPolicyIcon = openProject ? JOIN_POLICY_ICONS[openProject.join_policy] : undefined;

  return (
    <div className="flex flex-col gap-5">
      {incomingInvites.length > 0 && (
        <div className={cn(CARD_CLASS, "border-brand-teal/45 bg-brand-teal/8 p-4")}>
          <div className="mb-3 flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-card text-brand-teal-alt">
              <Mail className="size-4.5" />
            </div>
            <div className="text-sm font-extrabold text-foreground">
              Project invitations · {incomingInvites.length}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {incomingInvites.map((invite) => {
              const project = projects?.find((item) => item.id === invite.project_id);
              const sig = project ? SIG_META[project.type] : undefined;
              const dotClass = project ? SIG_CLASSES[project.type].dot : DEFAULT_DOT_CLASS;
              return (
                <div
                  key={invite.id}
                  className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card px-3 py-2.5"
                >
                  <span className={cn("size-2.25 shrink-0 rounded-full", dotClass)} />
                  <div className="min-w-40 flex-1">
                    <div className="text-[13.5px] font-bold text-foreground">
                      {project?.name ?? "Unknown project"}
                    </div>
                    <div className="text-xs text-brand-text-sub">
                      {invite.message
                        ? `“${invite.message}”`
                        : `${sig?.label ?? "Chapter"} project · you've been invited to join.`}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className={TEAL_BUTTON_CLASS}
                      data-invite-id={invite.id}
                      data-action="accept"
                      onClick={handleInviteAction}
                    >
                      <Check />
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="font-bold text-brand-text-sub"
                      data-invite-id={invite.id}
                      data-action="decline"
                      onClick={handleInviteAction}
                    >
                      Decline
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className={cn(CARD_CLASS, "p-4")}>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-55 flex-1">
            <Search className="absolute top-1/2 left-3 size-4.25 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={handleQueryChange}
              placeholder="Search projects, tags…"
              className="h-10 rounded-xl border border-border bg-muted pl-9.5"
            />
          </div>
          <Tabs value={scope} onValueChange={handleScopeChange}>
            <TabsList className="h-10 border border-border">
              <TabsTrigger value="mine" className="font-bold data-active:border-border">
                Mine
              </TabsTrigger>
              <TabsTrigger value="all" className="font-bold data-active:border-border">
                All
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Tabs value={status} onValueChange={handleStatusChange}>
            <TabsList className="h-10 border border-border">
              <TabsTrigger value="active" className="font-bold data-active:border-border">
                Active
              </TabsTrigger>
              <TabsTrigger value="archived" className="font-bold data-active:border-border">
                Archived
              </TabsTrigger>
              <TabsTrigger value="all" className="font-bold data-active:border-border">
                All
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <p className="mt-3 text-[13px] text-muted-foreground">
          {scope === "mine"
            ? `${String(mineCount)} project${minePlural} you're on`
            : `${String(chapterCount)} project${chapterPlural} in the chapter`}
        </p>
      </div>

      {isPending && (
        <div className="grid grid-cols-1 gap-4.5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="h-72 rounded-[18px]" />
          ))}
        </div>
      )}

      {!isPending && filtered.length === 0 && (
        <div className={cn(CARD_CLASS, "py-6")}>
          <EmptyState
            icon={Folder}
            title={scope === "mine" ? "You're not on any projects here" : "No projects found"}
            sub={
              scope === "mine"
                ? "Switch to “All projects” to browse and join what the chapter is building."
                : "Try adjusting your search or status filter."
            }
          />
        </div>
      )}

      {!isPending && filtered.length > 0 && (
        <div className="grid grid-cols-1 gap-4.5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((project) => {
            const sig = SIG_META[project.type];
            const tags = project.tags ?? [];
            const mine = mineSet?.has(project.id) ?? false;

            const PolicyIcon = JOIN_POLICY_ICONS[project.join_policy];
            return (
              <button
                key={project.id}
                type="button"
                data-project-id={project.id}
                onClick={handleCardOpen}
                className={cn(
                  CARD_CLASS,
                  "group flex flex-col overflow-hidden text-left transition hover:-translate-y-0.5",
                  "hover:shadow-[0px_10px_28px_rgba(112,144,176,0.2)] dark:hover:shadow-[0px_10px_28px_rgba(0,0,0,0.5)]",
                )}
              >
                <div className="relative shrink-0">
                  {project.thumbnail ? (
                    <div className="h-30 overflow-hidden bg-muted">
                      <img src={project.thumbnail.url} alt="" className="size-full object-cover" />
                    </div>
                  ) : (
                    <div
                      className={cn(
                        "relative h-30 overflow-hidden",
                        SIG_CLASSES[project.type].gradient,
                      )}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div
                          className={cn(
                            "flex size-12 items-center justify-center rounded-xl border text-sm font-extrabold",
                            SIG_CLASSES[project.type].glyph,
                          )}
                        >
                          {sig.short}
                        </div>
                      </div>
                    </div>
                  )}
                  <Badge
                    variant="outline"
                    className={cn(
                      "absolute top-2.5 right-2.5 gap-1 bg-card font-bold",
                      project.active
                        ? "text-[#15a66e] dark:text-[#3fd68c]"
                        : "text-muted-foreground",
                    )}
                  >
                    <span
                      className={cn(
                        "size-1.5 rounded-full",
                        project.active ? "bg-[#15a66e] dark:bg-[#3fd68c]" : "bg-muted-foreground",
                      )}
                    />
                    {project.active ? "Active" : "Archived"}
                  </Badge>
                  {mine && (
                    <span
                      className={cn(
                        "absolute bottom-2.5 left-3 inline-flex items-center gap-1",
                        "rounded-full bg-brand-teal px-2 py-0.5",
                        "text-[10px] font-extrabold tracking-wide text-primary",
                      )}
                    >
                      <Check className="size-3" strokeWidth={3} />
                      MEMBER
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col gap-2.5 p-4.5">
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-extrabold text-foreground">
                      {project.name}
                    </h3>
                    <div className="mt-0.5 text-xs text-muted-foreground">{sig.label}</div>
                  </div>
                  <p className="line-clamp-2 text-[13px]/relaxed text-brand-text-sub">
                    {project.description}
                  </p>
                  <div className="mt-auto flex flex-wrap gap-1.5">
                    {tags.map((tag) => (
                      <span key={tag} className={TAG_PILL_CLASS}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-border bg-muted/50 px-4.5 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {project.members.slice(0, 3).map((member) => (
                        <Avatar
                          key={member.id}
                          className="size-7 ring-2 ring-card"
                          title={member.name}
                        >
                          <AvatarFallback
                            className={cn(AVATAR_FALLBACK_CLASS, avatarClassFor(member.id))}
                          >
                            {initialsOf(member.name)}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                      <Users className="size-3.5" />
                      {project.members.length}
                    </span>
                  </div>
                  <span className={cn(POLICY_CHIP_CLASS, JOIN_POLICY_TONE[project.join_policy])}>
                    <PolicyIcon className="size-3.5" />
                    {JOIN_POLICY_META[project.join_policy].label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      <Dialog open={openProject !== undefined} onOpenChange={handleOpenChange}>
        {openProject && (
          <DialogContent className="flex max-h-[88svh] flex-col gap-0 overflow-hidden p-0 sm:max-w-155">
            <DialogHeader className="gap-1 border-b border-border p-5">
              <DialogTitle className="text-xl font-extrabold">{openProject.name}</DialogTitle>
              <DialogDescription className="font-semibold">
                {SIG_META[openProject.type].label} · founded {fmtMonthYear(openProject.founded_at)}
              </DialogDescription>
            </DialogHeader>

            <Tabs
              value={tab}
              onValueChange={handleTabChange}
              className="min-h-0 flex-1 gap-0 overflow-y-auto"
            >
              <div className="px-5 pt-4">
                <TabsList className="h-10 w-full border border-border">
                  <TabsTrigger value="details" className="font-bold data-active:border-border">
                    Details
                  </TabsTrigger>
                  <TabsTrigger value="team" className="font-bold data-active:border-border">
                    Team · {openProject.members.length}
                  </TabsTrigger>
                  <TabsTrigger value="gallery" className="font-bold data-active:border-border">
                    Gallery
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="details" className="flex flex-col gap-4 p-5">
                {openProject.thumbnail && (
                  <div className="h-40 overflow-hidden rounded-xl border border-border">
                    <img
                      src={openProject.thumbnail.url}
                      alt=""
                      className="size-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <div className={SECTION_LABEL_CLASS}>About</div>
                  <p className="text-sm/relaxed text-brand-text-sub">{openProject.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className={FACT_TILE_CLASS}>
                    <div className={FACT_LABEL_CLASS}>Category</div>
                    <div className={FACT_VALUE_CLASS}>
                      <span className="inline-flex items-center gap-2">
                        <span className={cn("size-2.25 rounded-full", categoryDotClass)} />
                        {SIG_META[openProject.type].label}
                      </span>
                    </div>
                  </div>
                  <div className={FACT_TILE_CLASS}>
                    <div className={FACT_LABEL_CLASS}>Status</div>
                    <div
                      className={cn(
                        FACT_VALUE_CLASS,
                        openProject.active
                          ? "text-[#15a66e] dark:text-[#3fd68c]"
                          : "text-muted-foreground",
                      )}
                    >
                      {openProject.active ? "Active" : "Archived"}
                    </div>
                  </div>
                  <div className={FACT_TILE_CLASS}>
                    <div className={FACT_LABEL_CLASS}>Founded</div>
                    <div className={cn(FACT_VALUE_CLASS, "inline-flex items-center gap-2")}>
                      <Calendar className="size-3.5 text-muted-foreground" />
                      {fmtMonthYear(openProject.founded_at)}
                    </div>
                  </div>
                  <div className={FACT_TILE_CLASS}>
                    <div className={FACT_LABEL_CLASS}>Team size</div>
                    <div className={FACT_VALUE_CLASS}>
                      {openProject.members.length} member
                      {openProject.members.length === 1 ? "" : "s"}
                    </div>
                  </div>
                  <div className={FACT_TILE_CLASS}>
                    <div className={FACT_LABEL_CLASS}>Join policy</div>
                    <div className={FACT_VALUE_CLASS}>
                      <span
                        className={cn(POLICY_CHIP_CLASS, JOIN_POLICY_TONE[openProject.join_policy])}
                      >
                        {OpenPolicyIcon && <OpenPolicyIcon className="size-3.5" />}
                        {JOIN_POLICY_META[openProject.join_policy].label}
                      </span>
                    </div>
                  </div>
                </div>
                {openProject.link && (
                  <div>
                    <div className={SECTION_LABEL_CLASS}>Link</div>
                    <a
                      href={openProject.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-[13.5px] font-bold break-all text-brand-teal-alt hover:underline"
                    >
                      <ExternalLink className="size-3.5 shrink-0" />
                      {openProject.link}
                    </a>
                  </div>
                )}
                {openTags.length > 0 && (
                  <div>
                    <div className={SECTION_LABEL_CLASS}>Tags</div>
                    <div className="flex flex-wrap gap-1.5">
                      {openTags.map((tag) => (
                        <span key={tag} className={TAG_PILL_CLASS}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="team" className="flex flex-col gap-2 p-5">
                {openProject.members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-2.5"
                  >
                    <Avatar className="size-9" title={member.name}>
                      <AvatarFallback
                        className={cn(AVATAR_FALLBACK_CLASS, avatarClassFor(member.id))}
                      >
                        {initialsOf(member.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="text-[13.5px] font-bold text-foreground">{member.name}</div>
                      <div className="text-[11.5px] font-semibold text-muted-foreground">
                        Member
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="gallery" className="p-5">
                {mediaPending && (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {Array.from({ length: 3 }, (_, i) => (
                      <Skeleton key={i} className="h-28 rounded-xl" />
                    ))}
                  </div>
                )}
                {!mediaPending && openMedia.length === 0 && (
                  <EmptyState
                    icon={ImageIcon}
                    title="No media yet"
                    sub="This project hasn't published any gallery images or video."
                  />
                )}
                {!mediaPending && openMedia.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {openMedia.map((item) => (
                      <button
                        key={item.hash}
                        type="button"
                        data-hash={item.hash}
                        onClick={handleMediaOpen}
                        title="Click to enlarge"
                        className={cn(
                          "group/media overflow-hidden rounded-xl border border-border bg-card text-left transition hover:-translate-y-0.5",
                          "hover:shadow-[0px_8px_20px_rgba(112,144,176,0.2)] dark:hover:shadow-[0px_8px_20px_rgba(0,0,0,0.5)]",
                        )}
                      >
                        <div className="relative h-24">
                          <img
                            src={mediaSrc(item)}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            className="size-full object-cover transition group-hover/media:scale-105"
                          />
                          {item.kind === "video" && (
                            <span className="absolute inset-0 flex items-center justify-center bg-black/30">
                              <Video className="size-6 text-white" />
                            </span>
                          )}
                        </div>
                        <div className="px-2.5 py-2">
                          <span className="text-[11.5px] font-bold text-foreground capitalize">
                            {item.kind}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>

            <DialogFooter className="border-t border-border p-4 sm:items-center sm:justify-end">
              {openJoined && (
                <Button variant="destructive" className="font-bold" onClick={handleLeave}>
                  <LogOut />
                  Leave project
                </Button>
              )}
              {!openJoined && openProject.join_policy === "open" && (
                <Button className={TEAL_BUTTON_CLASS} onClick={handleJoin}>
                  <UserPlus />
                  Join project
                </Button>
              )}
              {!openJoined &&
                openProject.join_policy === "request" &&
                (openPending ? (
                  <span className={LOCKED_PILL_CLASS}>
                    <Clock className="size-4" />
                    Request pending
                  </span>
                ) : (
                  <Button variant="outline" className="font-bold" onClick={handleRequest}>
                    <UserPlus />
                    Request to join
                  </Button>
                ))}
              {!openJoined && openProject.join_policy === "closed" && (
                <span className={LOCKED_PILL_CLASS}>
                  <Lock className="size-4" />
                  Invite only
                </span>
              )}
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      <MediaLightbox
        items={openMedia}
        index={lightboxIndex}
        srcFor={mediaSrc}
        onIndexChange={setLightboxIndex}
        onClose={handleLightboxClose}
      />
    </div>
  );
}

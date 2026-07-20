import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { type ColumnDef, type RowData, type TableMeta } from "@tanstack/react-table";
import axios from "axios";
import {
  type LucideIcon,
  AlertTriangle,
  Check,
  Gauge,
  MoreHorizontal,
  Search,
  Shield,
  Star,
  Trash2,
} from "lucide-react";
import { type ChangeEvent, type MouseEvent, useCallback, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { EmptyState } from "@/components/app/dashboard-events";
import { DataPagination } from "@/components/app/data-pagination";
import {
  type PendingSudo,
  type SudoAction,
  SudoDialog,
  SudoLock,
} from "@/components/app/sudo-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  type Role,
  isSudoActive,
  meQueryOptions,
  sudoQueryOptions,
} from "@/routes/dashboard/route";

export const Route = createFileRoute("/dashboard/admin/members")({
  component: MembersPage,
  staticData: {
    area: "Admin",
    title: "Members & Roles",
    sub: "Grant global roles and manage the chapter directory",
  },
  loader: async ({ context: { queryClient } }) =>
    await queryClient.ensureQueryData(membersQueryOptions),
});

/// Types and Interfaces

type RowHandler = (event: MouseEvent<HTMLElement>) => void;
type RoleFilter = "admin" | "all" | "leads" | "manager" | "none";

interface SimpleMember {
  id: string;
  name: string;
  display_name?: string | null;
  email: string;
  created_at: string;
}

interface AdminMember {
  id: string;
  name: string;
  display_name?: string | null;
  email: string;
  created_at: string;
  roles: Role[];
}

interface MemberRoles {
  roles: Role[];
}

interface MembersMeta {
  meId?: string;
  onManage: RowHandler;
  onAskDelete: RowHandler;
}

interface RoleModifyVars {
  memberId: string;
  role: Role;
  action: "grant" | "revoke";
}

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    members?: MembersMeta;
  }
}

/// Constants - metadata and presentation

const ASSIGNABLE_ROLES: Role[] = ["admin", "manager", "leads"];
const ROLE_RANK: Record<Role, number> = { root: 0, admin: 1, manager: 2, leads: 3 };
const ROLE_META: Record<Role, { badge: string; desc: string; icon: LucideIcon; label: string }> = {
  root: {
    label: "Root",
    desc: "Unseeded by design",
    icon: Shield,
    badge: "text-[#e13737] bg-[#e13737]/12 dark:text-[#ff6b6b] dark:bg-[#ff6b6b]/16",
  },
  admin: {
    label: "Admin",
    desc: "Full chapter administration",
    icon: Shield,
    badge: "text-[#084778] bg-[#084778]/12 dark:text-[#7fc4ff] dark:bg-[#7fc4ff]/16",
  },
  manager: {
    label: "Manager",
    desc: "Create & manage projects",
    icon: Gauge,
    badge: "text-[#3da9fc] bg-[#3da9fc]/14",
  },
  leads: {
    label: "Leads",
    desc: "Create & run events",
    icon: Star,
    badge: "text-[#078c79] bg-[#078c79]/14 dark:text-[#2fead0] dark:bg-[#2fead0]/16",
  },
};

const AVATAR_TINTS = [
  "border-brand-sky/30 bg-brand-sky/15 text-brand-sky-text",
  "border-[#00c9a7]/30 bg-[#00c9a7]/15 text-[#00715e] dark:text-[#2fdcbb]",
  "border-[#a55eea]/30 bg-[#a55eea]/15 text-[#7844aa] dark:text-[#c79bf2]",
  "border-[#f7b731]/30 bg-[#f7b731]/15 text-[#84621a] dark:text-[#ffd56b]",
  "border-[#fc5c7d]/30 bg-[#fc5c7d]/15 text-[#a13b50] dark:text-[#ff8fa6]",
];

const FILTER_OPTIONS: { label: string; value: RoleFilter }[] = [
  { value: "all", label: "All members" },
  { value: "admin", label: "Admins" },
  { value: "manager", label: "Managers" },
  { value: "leads", label: "Leads" },
  { value: "none", label: "No role" },
];

/// Constants — stable/empty data

const EMPTY_MEMBERS: AdminMember[] = [];
const EMPTY_ROLES: Role[] = [];

/// Constants — Table Columns

const ACTIONS_TRIGGER = <Button variant="ghost" size="icon-sm" className="text-brand-text-sub" />;
const REGISTERED_FMT = new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" });

const MEMBER_COLUMNS: ColumnDef<AdminMember>[] = [
  {
    id: "member",
    header: "Member",
    cell: ({ row, table }) => {
      const { id, name, email } = row.original;
      const isSelf = id === table.options.meta?.members?.meId;
      const initials =
        name
          .match(/\S+/g)
          ?.slice(0, 2)
          .map((part) => part[0])
          .join("")
          .toUpperCase() ?? "··";
      const tint = AVATAR_TINTS[name.length % AVATAR_TINTS.length];
      return (
        <div className="flex items-center gap-2.75">
          <Avatar className={cn("size-9 shrink-0 border", tint)}>
            <AvatarFallback className="bg-transparent text-[12px] font-extrabold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="flex items-center gap-1.75">
              <span className="truncate text-[13.5px] font-bold text-foreground">{name}</span>
              {isSelf && <Badge className="bg-brand-sky/15 text-brand-sky-text">You</Badge>}
            </div>
            <div className="truncate text-[12px] text-muted-foreground">{email}</div>
          </div>
        </div>
      );
    },
  },
  {
    id: "roles",
    header: "Roles",
    cell: ({ row }) =>
      row.original.roles.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {row.original.roles.map((role) => (
            <Badge key={role} className={cn("gap-1", ROLE_META[role].badge)}>
              <span className="size-1.5 rounded-full bg-current" />
              {ROLE_META[role].label}
            </Badge>
          ))}
        </div>
      ) : (
        <span className="text-[12.5px] text-muted-foreground">Member</span>
      ),
  },
  {
    id: "registered",
    header: "Registered",
    meta: { className: "hidden @md:table-cell" },
    cell: ({ row }) => (
      <span className="text-[12.5px] font-semibold whitespace-nowrap text-brand-text-sub">
        {REGISTERED_FMT.format(new Date(row.original.created_at))}
      </span>
    ),
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    meta: { className: "text-right" },
    cell: ({ row, table }) => {
      const meta = table.options.meta?.members;
      const isSelf = row.original.id === meta?.meId;
      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={ACTIONS_TRIGGER}
              title="Member actions"
              aria-label="Member actions"
            >
              <MoreHorizontal />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem
                data-id={row.original.id}
                onClick={meta?.onManage}
                disabled={isSelf}
              >
                <Shield />
                Manage roles
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                data-id={row.original.id}
                onClick={meta?.onAskDelete}
                disabled={isSelf}
              >
                <Trash2 />
                Delete member
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

/// Constants — regular

const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:8000";
const MEMBERS_KEY = ["members", "list"] as const;
const MEMBERS_PAGE_SIZE = 100;
const TABLE_PAGE_SIZE = 10;
const NO_ROLE_RANK = 4;
const CARD_CLASS =
  "rounded-[18px] border border-border bg-card shadow-[0px_4px_14px_rgba(112,144,176,0.14)] dark:shadow-[0px_4px_14px_rgba(0,0,0,0.4)]";
const TEAL_BUTTON_CLASS = "bg-brand-teal font-bold text-primary hover:bg-brand-teal/85";

const SHARED_QUERY_OPTIONS = {
  staleTime: 60_000,
  retry: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  refetchOnMount: false,
} as const;

/// Tanstack Query options

const membersQueryOptions = queryOptions({
  queryKey: MEMBERS_KEY,
  queryFn: async () => {
    const members: AdminMember[] = [];
    for (let page = 1, pageCount = 1; page <= pageCount; page++) {
      const { data } = await axios.get<{ data: SimpleMember[] | undefined; total: number }>(
        `${API_BASE_URL}/members`,
        { params: { page, size: MEMBERS_PAGE_SIZE } },
      );
      pageCount = Math.ceil(data.total / MEMBERS_PAGE_SIZE);

      // At some point this call will get removed
      for (const member of data.data ?? []) {
        const { data: memberRoles } = await axios
          .get<MemberRoles>(`${API_BASE_URL}/members/${member.id}/roles`)
          .catch(() => ({ data: { roles: EMPTY_ROLES } }));
        members.push({ ...member, roles: memberRoles.roles });
      }
    }
    return members;
  },
  ...SHARED_QUERY_OPTIONS,
});

/// Helper functions

const renderFilterLabel = (value: RoleFilter) =>
  FILTER_OPTIONS.find((option) => option.value === value)?.label ?? value;

/// Route

function MembersPage() {
  const queryClient = useQueryClient();

  const topRef = useRef<HTMLDivElement>(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<RoleFilter>("all");
  const [page, setPage] = useState(1);
  const [managedMember, setManagedMember] = useState<string>();
  const [deletingMember, setDeletingMember] = useState<string>();
  const [pendingSudo, setPendingSudo] = useState<PendingSudo>();

  const { data: members, isPending } = useQuery(membersQueryOptions);
  const { data: me } = useQuery(meQueryOptions);
  const { data: sudo } = useQuery(sudoQueryOptions);
  const meId = me?.id;

  const { mutate: modifyRole } = useMutation({
    mutationFn: async ({ memberId, role, action }: RoleModifyVars) => {
      await axios.put(`${API_BASE_URL}/members/${memberId}/role`, { role, action });
    },
    onMutate: async ({ memberId, role, action }) => {
      await queryClient.cancelQueries({ queryKey: MEMBERS_KEY });
      const previous = queryClient.getQueryData<AdminMember[]>(MEMBERS_KEY);
      queryClient.setQueryData<AdminMember[]>(MEMBERS_KEY, (old) =>
        (old ?? EMPTY_MEMBERS).map((member) => {
          if (member.id !== memberId) return member;
          const roles = new Set(member.roles);
          roles[action === "grant" ? "add" : "delete"](role);
          return { ...member, roles: [...roles] };
        }),
      );
      return { previous };
    },
    onError: (_error, _vars, context) => {
      if (context) queryClient.setQueryData(MEMBERS_KEY, context.previous);
      toast.error("Couldn't update roles. Please try again.");
    },
    onSuccess: (_data, { role, action }) =>
      toast.success(`${ROLE_META[role].label} ${action === "grant" ? "granted" : "revoked"}.`),
    onSettled: () => queryClient.invalidateQueries({ queryKey: MEMBERS_KEY }),
  });

  const { mutate: deleteMember } = useMutation({
    mutationFn: async (memberId: string) => {
      await axios.delete(`${API_BASE_URL}/members/${memberId}`);
    },
    onMutate: async (memberId) => {
      await queryClient.cancelQueries({ queryKey: MEMBERS_KEY });
      const previous = queryClient.getQueryData<AdminMember[]>(MEMBERS_KEY);
      queryClient.setQueryData<AdminMember[]>(MEMBERS_KEY, (old) =>
        (old ?? EMPTY_MEMBERS).filter((member) => member.id !== memberId),
      );
      return { previous };
    },
    onError: (_error, _memberId, context) => {
      if (context) queryClient.setQueryData(MEMBERS_KEY, context.previous);
      toast.error("Couldn't delete the member. Please try again.");
    },
    onSuccess: () => toast.success("Member deleted."),
    onSettled: () => queryClient.invalidateQueries({ queryKey: MEMBERS_KEY }),
  });

  const handleSearch = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(1);
  }, []);
  const goToPage = useCallback((next: number) => {
    setPage(next);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);
  const handleFilter = useCallback((value: RoleFilter | null) => {
    if (value) {
      setFilter(value);
      setPage(1);
    }
  }, []);
  const openManage = useCallback((event: MouseEvent<HTMLElement>) => {
    setManagedMember(event.currentTarget.dataset.id);
  }, []);
  const closeManage = useCallback(() => {
    setManagedMember(undefined);
  }, []);
  const askDelete = useCallback((event: MouseEvent<HTMLElement>) => {
    setDeletingMember(event.currentTarget.dataset.id);
  }, []);
  const closeDelete = useCallback(() => {
    setDeletingMember(undefined);
  }, []);

  const withSudo = useCallback(
    (action: SudoAction, run: () => void) => {
      if (isSudoActive(sudo)) run();
      else setPendingSudo({ ...action, run });
    },
    [sudo],
  );
  const clearSudo = useCallback(() => {
    setPendingSudo(undefined);
  }, []);
  const confirmDelete = useCallback(() => {
    const member = (members ?? EMPTY_MEMBERS).find((item) => item.id === deletingMember);
    if (!member) return;
    setDeletingMember(undefined);
    withSudo(
      {
        title: "Delete member",
        detail: `Permanently purge ${member.name} from the system. THIS CANNOT BE UNDONE!!!`,
        reason: `Delete member — ${member.name}`,
      },
      () => {
        deleteMember(member.id);
      },
    );
  }, [deletingMember, members, deleteMember, withSudo]);
  const toggleRole = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      const role = event.currentTarget.dataset.role as Role | undefined;
      const member = (members ?? EMPTY_MEMBERS).find((item) => item.id === managedMember);
      if (!role || !member) return;
      const action = member.roles.includes(role) ? "revoke" : "grant";
      const verb = action === "grant" ? "Grant" : "Revoke";
      withSudo(
        {
          title: `${verb} role`,
          detail: `${verb} the ${ROLE_META[role].label} role ${action === "grant" ? "for" : "from"} ${member.name}.`,
          reason: `${verb} ${ROLE_META[role].label} — ${member.name}`,
        },
        () => {
          modifyRole({ memberId: member.id, role, action });
        },
      );
    },
    [members, managedMember, modifyRole, withSudo],
  );

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    const rank = (member: AdminMember) =>
      Math.min(NO_ROLE_RANK, ...member.roles.map((role) => ROLE_RANK[role]));
    return (members ?? EMPTY_MEMBERS)
      .filter((member) => {
        if (filter === "all") return true;
        if (filter === "none") return member.roles.length === 0;
        return member.roles.includes(filter);
      })
      .filter((member) =>
        `${member.name} ${member.email} ${member.display_name ?? ""}`.toLowerCase().includes(term),
      )
      .toSorted((a, b) => rank(a) - rank(b));
  }, [members, filter, search]);

  const total = rows.length;
  const pageCount = Math.max(1, Math.ceil(total / TABLE_PAGE_SIZE));
  const pageRows = useMemo(
    () => rows.slice((page - 1) * TABLE_PAGE_SIZE, page * TABLE_PAGE_SIZE),
    [rows, page],
  );

  const tableMeta = useMemo<TableMeta<AdminMember>>(
    () => ({ members: { meId, onManage: openManage, onAskDelete: askDelete } }),
    [meId, openManage, askDelete],
  );

  const sudoActive = isSudoActive(sudo);

  const allMembers = members ?? EMPTY_MEMBERS;
  const managed = allMembers.find((member) => member.id === managedMember);
  const managedRoles = managed?.roles ?? EMPTY_ROLES;
  const deletingName = allMembers.find((member) => member.id === deletingMember)?.name;
  const withRoles = allMembers.filter((member) => member.roles.length > 0).length;

  return (
    <div className="flex flex-col gap-5">
      <div ref={topRef} className={cn(CARD_CLASS, "scroll-mt-4 p-4")}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm font-bold text-brand-text-sub">
            {allMembers.length} member{allMembers.length === 1 ? "" : "s"} · {withRoles} hold a
            global role
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-52 flex-1">
              <Search className="absolute top-1/2 left-3 size-4.25 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={handleSearch}
                placeholder="Search by name or email…"
                className="h-10 rounded-xl bg-muted pl-9.5"
              />
            </div>
            <Select value={filter} onValueChange={handleFilter}>
              <SelectTrigger className="h-10 rounded-xl border border-border bg-muted font-bold">
                <SelectValue>{renderFilterLabel}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {FILTER_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {isPending && (
        <div className={cn(CARD_CLASS, "flex flex-col gap-3 p-4")}>
          {Array.from({ length: 5 }, (_, index) => (
            <Skeleton key={index} className="h-12 rounded-xl" />
          ))}
        </div>
      )}
      {!isPending && rows.length === 0 && (
        <div className={CARD_CLASS}>
          <EmptyState
            icon={Search}
            title="No members match"
            sub="Try a different name, email, or role filter."
            className="py-12"
          />
        </div>
      )}
      {!isPending && rows.length > 0 && (
        <div className={cn(CARD_CLASS, "overflow-hidden")}>
          <div className="px-3 sm:px-4">
            <DataTable columns={MEMBER_COLUMNS} data={pageRows} meta={tableMeta} />
          </div>
        </div>
      )}

      {!isPending && total > 0 && (
        <DataPagination
          page={page}
          pageCount={pageCount}
          total={total}
          pageSize={TABLE_PAGE_SIZE}
          itemCount={pageRows.length}
          onPageChange={goToPage}
        />
      )}

      <Dialog open={managedMember !== undefined} onOpenChange={closeManage}>
        {managed && (
          <DialogContent className="gap-4 sm:max-w-115">
            <DialogHeader>
              <DialogTitle className="text-lg font-extrabold">Manage roles</DialogTitle>
              <DialogDescription>{managed.name}</DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-2.5">
              {ASSIGNABLE_ROLES.map((role) => {
                const granted = managedRoles.includes(role);
                const RoleIcon = ROLE_META[role].icon;
                return (
                  <div
                    key={role}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border p-3",
                      granted ? "border-brand-teal/40 bg-brand-teal/8" : "border-border bg-card",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-lg",
                        ROLE_META[role].badge,
                      )}
                    >
                      <RoleIcon className="size-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 text-sm font-extrabold text-foreground">
                        {ROLE_META[role].label}
                        {granted && (
                          <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-brand-teal-alt">
                            <Check className="size-3.5" />
                            Granted
                          </span>
                        )}
                      </div>
                      <div className="text-[12px] text-muted-foreground">
                        {ROLE_META[role].desc}
                      </div>
                    </div>
                    <Button
                      variant={granted ? "outline" : "default"}
                      size="sm"
                      data-role={role}
                      onClick={toggleRole}
                      className={cn(!granted && TEAL_BUTTON_CLASS)}
                    >
                      {granted ? "Revoke" : "Grant"}
                    </Button>
                  </div>
                );
              })}
            </div>

            <p className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
              <SudoLock active={sudoActive} /> Each role change needs sudo.
            </p>
          </DialogContent>
        )}
      </Dialog>

      <Dialog open={deletingMember !== undefined} onOpenChange={closeDelete}>
        {deletingMember && (
          <DialogContent className="sm:max-w-110">
            <DialogHeader>
              <DialogTitle className="text-lg font-extrabold">Delete member?</DialogTitle>
              <DialogDescription>{deletingName}</DialogDescription>
            </DialogHeader>
            <div className="flex items-start gap-2.5 rounded-xl border border-[#e0a100]/40 bg-[#f7b731]/12 p-3.5">
              <AlertTriangle className="size-4.5 shrink-0 text-[#e0a100] dark:text-[#f7c948]" />
              <p className="text-[13px]/relaxed text-brand-text-sub">
                This revokes all authenticated sessions and purges all data associated with the
                member. CANNOT BE UNDONE!
              </p>
            </div>
            <p className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
              <SudoLock active={sudoActive} /> Deleting a member requires sudo.
            </p>
            <DialogFooter>
              <Button variant="ghost" onClick={closeDelete}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                <Trash2 />
                Delete member
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      <SudoDialog pending={pendingSudo} onClose={clearSudo} />
    </div>
  );
}

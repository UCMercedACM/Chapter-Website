import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useCallback, useState } from "react";
import { toast } from "sonner";

import { CheckInPanel } from "@/components/app/check-in-panel";
import { RosterRow } from "@/components/app/dashboard-events";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  type AttendanceMember,
  type FullEvent,
  type KanaePage,
  determineCheckIn,
  fmtClock,
} from "@/lib/dashboard-events";

/// Types & interfaces

interface AttendanceDialogProps {
  event: FullEvent;
  now: Date;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/// Constants

const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:8000";
const ROSTER_STAT_CLASS =
  "flex-1 rounded-xl border border-border bg-card px-3.5 py-3 shadow-[0px_2px_5px_rgba(112,144,176,0.12)] dark:shadow-[0px_2px_5px_rgba(0,0,0,0.3)]";

/// Tanstack Query options

const eventAttendanceCodeQueryOptions = (eventId: string) =>
  queryOptions({
    queryKey: ["events", eventId, "attendance-code"],
    queryFn: async () => {
      const { data } = await axios.get<{ code: string }>(
        `${API_BASE_URL}/events/${eventId}/attendance-code`,
      );
      return data;
    },
  });

const eventAttendanceQueryOptions = (eventId: string) =>
  queryOptions({
    queryKey: ["events", eventId, "attendance"],
    queryFn: async () => {
      const { data } = await axios.get<KanaePage<AttendanceMember>>(
        `${API_BASE_URL}/events/${eventId}/attendance`,
        { params: { page: 1, size: 100 } },
      );
      return data;
    },
  });

/// AttendanceDialog

export function AttendanceDialog({
  event,
  now,
  open,
  onOpenChange,
}: Readonly<AttendanceDialogProps>) {
  const queryClient = useQueryClient();

  const [rosterTab, setRosterTab] = useState<"qr" | "roster">("qr");
  const [copied, setCopied] = useState(false);

  const codeQuery = useQuery({
    ...eventAttendanceCodeQueryOptions(event.id),
    enabled: rosterTab === "qr",
  });
  const rosterQuery = useQuery({
    ...eventAttendanceQueryOptions(event.id),
    enabled: rosterTab === "roster",
  });

  const { mutate: undoCheckin, isPending: isUndoing } = useMutation({
    mutationFn: async (memberId: string) => {
      await axios.delete(`${API_BASE_URL}/events/${event.id}/attendance/${memberId}`);
    },
    onError: () => toast.error("Couldn't undo the check-in. Please try again."),
    onSuccess: () => toast.success("Check-in undone."),
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: eventAttendanceQueryOptions(event.id).queryKey }),
  });

  const code = (codeQuery.data?.code ?? "").slice(0, 8);
  const copyCode = useCallback(() => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 1800);
      })
      .catch(() => {
        toast.error("Couldn't copy the code.");
      });
  }, [code]);

  const rosterMembers = rosterQuery.data?.data ?? [];
  const plannedCount = rosterMembers.filter((member) => member.planned).length;
  const attendedCount = rosterMembers.filter((member) => member.attended).length;
  const checkIn = determineCheckIn(event, now);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88svh] gap-4 overflow-y-auto sm:max-w-135">
        <DialogHeader>
          <DialogTitle className="text-lg font-extrabold">Attendance</DialogTitle>
          <DialogDescription>{event.name}</DialogDescription>
        </DialogHeader>

        <Tabs value={rosterTab} onValueChange={setRosterTab} className="gap-4">
          <TabsList className="h-10 w-full border border-border">
            <TabsTrigger value="qr" className="font-bold data-active:border-border">
              Check-in QR
            </TabsTrigger>
            <TabsTrigger value="roster" className="font-bold data-active:border-border">
              Roster · {String(rosterMembers.length)}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="qr" className="flex flex-col items-center gap-4.5">
            <CheckInPanel
              code={code}
              copied={copied}
              onCopy={copyCode}
              state={checkIn}
              closesAt={fmtClock(event.end_at, event.timezone)}
            />
          </TabsContent>

          <TabsContent value="roster" className="flex flex-col gap-3">
            <div className="flex gap-3">
              <div className={ROSTER_STAT_CLASS}>
                <div className="text-2xl leading-none font-extrabold text-brand-sky">
                  {String(plannedCount)}
                </div>
                <div className="mt-1 text-xs font-semibold text-muted-foreground">
                  Planned (RSVP'd)
                </div>
              </div>
              <div className={ROSTER_STAT_CLASS}>
                <div className="text-2xl leading-none font-extrabold text-[#15a66e] dark:text-[#3fd68c]">
                  {String(attendedCount)}
                </div>
                <div className="mt-1 text-xs font-semibold text-muted-foreground">Attended</div>
              </div>
            </div>
            <div className="-mx-2 flex max-h-72 flex-col gap-2 overflow-y-auto p-2">
              {rosterQuery.isPending && (
                <p className="px-2 py-6 text-center text-sm text-muted-foreground">
                  Loading roster…
                </p>
              )}
              {!rosterQuery.isPending && rosterMembers.length === 0 && (
                <p className="px-2 py-6 text-center text-sm text-muted-foreground">
                  No attendees yet.
                </p>
              )}
              {rosterMembers.map((member) => (
                <RosterRow
                  key={member.id}
                  member={member}
                  disabled={isUndoing}
                  onUndo={undoCheckin}
                />
              ))}
            </div>
            <p className="text-[11.5px]/relaxed text-muted-foreground">
              Undo clears a member's attended flag but keeps their RSVP — for correcting a mistaken
              check-in.
            </p>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

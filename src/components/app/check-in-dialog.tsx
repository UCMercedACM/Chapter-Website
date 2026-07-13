import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { type LucideIcon, Check, Clock, Lock, QrCode } from "lucide-react";
import { type ChangeEvent, type SyntheticEvent, useCallback } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { EmptyState, PILL_CLASS } from "@/components/app/dashboard-events";
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
import { type CheckInState, determineCheckIn, type DashboardEvent } from "@/lib/dashboard-events";
import { cn } from "@/lib/utils";

/// Constants

const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:8000";

const STATUS_GREEN = "text-[#15a66e] bg-[#15a66e]/15 dark:text-[#3fd68c] dark:bg-[#3fd68c]/15";
const STATUS_MUTED = "text-muted-foreground bg-muted";

const CHECKIN_WINDOW = {
  too_early: { label: "Opens 1 hour before start", className: STATUS_MUTED, icon: Clock },
  open: { label: "Check-in open", className: STATUS_GREEN, icon: Clock },
  ended: { label: "Check-in closed", className: STATUS_MUTED, icon: Lock },
} satisfies Record<CheckInState, { className: string; icon: LucideIcon; label: string }>;

const CHECKIN_EMPTY = {
  too_early: {
    icon: Clock,
    title: "Check-in hasn't opened yet",
    sub: "Check-in opens one hour before the event starts.",
  },
  ended: {
    icon: Lock,
    title: "Check-in has closed",
    sub: "The window runs until the event ends.",
  },
} satisfies Partial<Record<CheckInState, { icon: LucideIcon; sub: string; title: string }>>;

const checkInSchema = z.object({
  code: z
    .string()
    .regex(/^[A-Z0-9]*$/, "Letters and numbers only")
    .length(8, "Enter all 8 characters"),
});

/// Component

interface CheckInDialogProps {
  event: DashboardEvent;
  now: Date;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVerified?: () => unknown;
}

export function CheckInDialog({
  event,
  now,
  open,
  onOpenChange,
  onVerified,
}: Readonly<CheckInDialogProps>) {
  const { mutate, reset, isError, isPending, isSuccess } = useMutation({
    mutationFn: async (code: string) => {
      const { data } = await axios.post<{ message: string }>(
        `${API_BASE_URL}/events/${event.id}/verify`,
        { code },
      );
      return data;
    },
    onSuccess: () => {
      toast.success(`You're checked in to ${event.name}.`);
      return onVerified?.();
    },
  });

  const form = useForm({
    defaultValues: { code: "" },
    validators: { onChange: checkInSchema },
    onSubmit: ({ value }) => {
      mutate(value.code);
    },
  });

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (!next) {
        form.reset();
        reset();
      }
      onOpenChange(next);
    },
    [form, onOpenChange, reset],
  );
  const handleSubmit = useCallback(
    (event: SyntheticEvent) => {
      event.preventDefault();
      void form.handleSubmit();
    },
    [form],
  );
  const handleCodeChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const code = event.target.value
        .replaceAll(/[^a-z0-9]/gi, "")
        .toUpperCase()
        .slice(0, 8);
      form.setFieldValue("code", code);
    },
    [form],
  );

  const state = determineCheckIn(event, now);
  const succeeded = event.attended || isSuccess;
  const status = CHECKIN_WINDOW[state];

  const StatusIcon = status.icon;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-110">
        <DialogHeader>
          <DialogTitle className="text-lg font-extrabold">Check in</DialogTitle>
          <DialogDescription>{event.name}</DialogDescription>
        </DialogHeader>

        <div className="flex justify-center">
          <Badge className={cn(PILL_CLASS, status.className)}>
            <StatusIcon />
            {status.label}
          </Badge>
        </div>

        {succeeded && (
          <div className="px-2 pb-1 text-center">
            <div className="mx-auto mb-3.5 flex size-16 items-center justify-center rounded-full bg-[#15a66e]/15 text-[#15a66e] dark:text-[#3fd68c]">
              <Check className="size-8" strokeWidth={2.4} />
            </div>
            <div className="text-lg font-extrabold text-foreground">You're checked in!</div>
            <p className="mt-1.5 text-[13px]/relaxed text-brand-text-sub">
              Marked as attended for {event.name}. Re-submitting is safe — verify is idempotent.
            </p>
          </div>
        )}

        {!succeeded && state !== "open" && <EmptyState {...CHECKIN_EMPTY[state]} />}

        {!succeeded && state === "open" && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex items-start gap-2.5 rounded-xl border border-brand-sky/30 bg-brand-sky/10 px-3.5 py-3">
              <QrCode className="mt-0.5 size-4.5 shrink-0 text-brand-sky" />
              <p className="text-[12.5px]/relaxed text-brand-text-sub">
                Scan the organizer's QR, or type the 8-character code they're showing.
              </p>
            </div>
            <form.Field name="code">
              {(field) => (
                <label className="block" htmlFor="checkin-code">
                  <span className="mb-1.5 block text-[12.5px] font-bold text-brand-text-sub">
                    Attendance code
                  </span>
                  <Input
                    id="checkin-code"
                    value={field.state.value}
                    maxLength={8}
                    placeholder="ABCD1234"
                    onChange={handleCodeChange}
                    className="h-12 text-center font-mono text-2xl font-extrabold tracking-[0.22em]"
                  />
                  {field.state.meta.isTouched && !field.state.meta.isValid && (
                    <span className="mt-1.5 block text-[12px] font-semibold text-[#e13737] dark:text-[#ff6b6b]">
                      {field.state.meta.errors[0]?.message}
                    </span>
                  )}
                </label>
              )}
            </form.Field>
            {isError && (
              <div className="rounded-xl border border-[#e13737]/40 bg-[#e13737]/12 px-3.5 py-2.5 text-[12.5px] font-bold text-[#e13737] dark:text-[#ff6b6b]">
                Code not recognized — check and try again.
              </div>
            )}
            <form.Subscribe>
              {(formState) => (
                <Button
                  type="submit"
                  disabled={!formState.canSubmit || isPending}
                  className="h-11 rounded-full bg-brand-teal font-bold text-primary hover:bg-brand-teal/85"
                >
                  <Check />
                  {isPending ? "Verifying…" : "Verify attendance"}
                </Button>
              )}
            </form.Subscribe>
          </form>
        )}

        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  );
}

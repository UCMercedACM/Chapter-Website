import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Check, Lock, ShieldCheck, TriangleAlert, Unlock } from "lucide-react";
import { type ChangeEvent, useCallback, useState } from "react";
import { toast } from "sonner";
import { Temporal } from "temporal-polyfill";

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
import { type Flow, ORY_URL, csrfToken, orySubmit } from "@/lib/ory";
import { cn } from "@/lib/utils";
import { type Sudo, meQueryOptions, sudoQueryOptions } from "@/routes/dashboard/route";
import { type ClientSession } from "@/types/kanae.gen";

/// Types and Interfaces

export type PendingSudo = SudoAction & { run: () => void };

export interface SudoAction {
  title: string;
  detail: string;
  reason?: string;
}

interface SudoDialogProps {
  pending?: PendingSudo;
  onClose: () => void;
}

/// Constants

const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:8000";

const FRESH_2FA = Temporal.Duration.from({ minutes: 15 });

const TEAL_BUTTON_CLASS = "bg-brand-teal font-bold text-primary hover:bg-brand-teal/85";
const WARNING_BOX_CLASS =
  "flex items-start gap-2.5 rounded-xl border border-[#e0a100]/40 bg-[#f7b731]/12 p-3.5";
const OTP_SLOT_CLASS = "size-11 rounded-md border-l text-lg";

/// Helper functions

// Due to tainting with purity due to our use of Date.now(), we move it here
function isFresh2fa(session: ClientSession | undefined): boolean {
  return (
    session?.aal === "aal2" &&
    Date.now() - new Date(session.authenticated_at).getTime() <= FRESH_2FA.total("milliseconds")
  );
}

/// Components

export function SudoLock({ active }: Readonly<{ active: boolean }>) {
  return (
    <span
      title={active ? "Sudo active" : "Requires sudo"}
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-1.75 py-0.5 text-[10.5px] font-bold tracking-[0.04em]",
        active
          ? "border-[#078c79]/40 bg-[#078c79]/12 text-[#078c79] dark:text-[#2fead0]"
          : "border-[#e0a100]/40 bg-[#f7b731]/14 text-[#a9760a] dark:text-[#f7c948]",
      )}
    >
      {active ? <Unlock className="size-3" /> : <Lock className="size-3" />}
      SUDO
    </span>
  );
}

export function SudoDialog({ pending, onClose }: Readonly<SudoDialogProps>) {
  const queryClient = useQueryClient();
  const { data: me } = useQuery(meQueryOptions);

  const [code, setCode] = useState("");
  const [reason, setReason] = useState<string>();

  const step = isFresh2fa(me?.session) ? "reason" : "2fa";
  const reasonValue = reason ?? pending?.reason ?? "";

  const { mutate: verify, isPending: verifying } = useMutation({
    mutationFn: async (totpCode: string) => {
      const params = { refresh: true, aal: "aal2" };
      const { data: flow } = await axios.get<Flow>(`${ORY_URL}/self-service/login/browser`, {
        headers: { Accept: "application/json" },
        params: params,
      });
      return orySubmit(flow.ui.action, {
        method: "totp",
        totp_code: totpCode,
        csrf_token: csrfToken(flow),
      });
    },
    onSuccess: (result) => {
      if (result.kind !== "success") {
        toast.error("Couldn't verify that code. Check it and try again.");
        return;
      }
      return queryClient.invalidateQueries({ queryKey: meQueryOptions.queryKey });
    },
    onError: () => toast.error("Couldn't verify that code. Check it and try again."),
  });

  const { mutate: elevate, isPending: elevating } = useMutation({
    mutationFn: async (elevateReason: string) => {
      const { data } = await axios.post<Sudo>(`${API_BASE_URL}/sudo/elevate`, {
        reason: elevateReason,
      });
      return data;
    },
    onSuccess: (grant) => {
      queryClient.setQueryData<Sudo>(sudoQueryOptions.queryKey, grant);
      toast.success("Sudo is now active");
      pending?.run();
      onClose();
    },
    onError: () => toast.error("Couldn't elevate. Please try again."),
  });

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (!next) {
        setCode("");
        setReason(undefined);
        onClose();
      }
    },
    [onClose],
  );
  const handleReason = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setReason(event.target.value);
  }, []);
  const submitVerify = useCallback(() => {
    if (code.length === 6) verify(code);
  }, [code, verify]);
  const submitElevate = useCallback(() => {
    const trimmed = reasonValue.trim();
    if (trimmed) elevate(trimmed);
  }, [reasonValue, elevate]);
  const cancel = useCallback(() => {
    handleOpenChange(false);
  }, [handleOpenChange]);

  return (
    <Dialog open={pending !== undefined} onOpenChange={handleOpenChange}>
      <DialogContent className="gap-4 sm:max-w-118">
        <DialogHeader>
          <DialogTitle className="text-lg font-extrabold">Confirm with sudo</DialogTitle>
          <DialogDescription>{pending?.title ?? "Elevated privileges required"}</DialogDescription>
        </DialogHeader>

        <div className={WARNING_BOX_CLASS}>
          <TriangleAlert className="mt-0.5 size-4.5 shrink-0 text-[#e0a100] dark:text-[#f7c948]" />
          <p className="text-[13px]/relaxed text-brand-text-sub">
            {pending?.detail ?? "This is a high-impact action."}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 text-[12px] font-bold",
              step === "reason" ? "text-brand-teal-alt" : "text-foreground",
            )}
          >
            <span className="inline-flex size-5 items-center justify-center rounded-full bg-brand-teal/15 text-[11px] text-brand-teal-alt">
              {step === "reason" ? <Check className="size-3" /> : 1}
            </span>
            {/*
             */}Fresh 2FA
          </span>
          <span
            className={cn(
              "h-0.5 flex-1 rounded-full",
              step === "reason" ? "bg-brand-teal" : "bg-border",
            )}
          />
          <span
            className={cn(
              "inline-flex items-center gap-1.5 text-[12px] font-bold",
              step === "reason" ? "text-foreground" : "text-muted-foreground",
            )}
          >
            <span
              className={cn(
                "inline-flex size-5 items-center justify-center rounded-full text-[11px]",
                step === "reason"
                  ? "bg-brand-teal/15 text-brand-teal-alt"
                  : "bg-muted text-muted-foreground",
              )}
            >
              2
            </span>
            {/*
             */}Elevate
          </span>
        </div>

        {step === "2fa" ? (
          <div className="flex flex-col gap-3">
            <p className="text-[13px]/relaxed text-brand-text-sub">
              Your session is <strong className="text-foreground">aal1</strong>. Elevation needs a
              second factor authenticated within the last 15 minutes. Enter the 6-digit code from
              your authenticator.
            </p>
            <div className="flex flex-col items-center gap-1.5">
              <Label htmlFor="sudo-totp" className="text-[12.5px] font-bold text-brand-text-sub">
                Authenticator code
              </Label>
              <InputOTP
                id="sudo-totp"
                maxLength={6}
                pattern={REGEXP_ONLY_DIGITS}
                value={code}
                onChange={setCode}
                containerClassName="justify-center"
              >
                <InputOTPGroup className="gap-2">
                  {Array.from({ length: 6 }, (_, index) => (
                    <InputOTPSlot key={index} index={index} className={OTP_SLOT_CLASS} />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-[#078c79]/40 bg-[#078c79]/10 px-3.5 py-2.5">
              <Check className="size-4 shrink-0 text-[#078c79] dark:text-[#2fead0]" />
              <span className="text-[12.5px] font-bold text-[#078c79] dark:text-[#2fead0]">
                2fa verified - you can elevate.
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="sudo-reason" className="text-[12.5px] font-bold text-brand-text-sub">
                Reason
              </Label>
              <Input
                id="sudo-reason"
                maxLength={200}
                placeholder="e.g. Grant manager role to Sofia"
                value={reasonValue}
                onChange={handleReason}
                className="border-border"
              />
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="ghost" onClick={cancel}>
            Cancel
          </Button>
          {step === "2fa" ? (
            <Button
              className={TEAL_BUTTON_CLASS}
              disabled={code.length < 6 || verifying}
              onClick={submitVerify}
            >
              <ShieldCheck />
              {verifying ? "Verifying…" : "Verify 2FA"}
            </Button>
          ) : (
            <Button
              className={TEAL_BUTTON_CLASS}
              disabled={reasonValue.trim().length === 0 || elevating}
              onClick={submitElevate}
            >
              <Unlock />
              {elevating ? "Elevating…" : "Elevate"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import { Check, Copy, Info, Lock, LockOpen, QrCode } from "lucide-react";

import { Button } from "@/components/ui/button";
import { type CheckInState } from "@/lib/dashboard-events";
import { cn } from "@/lib/utils";

interface CheckInPanelProps {
  code: string;
  copied: boolean;
  closesAt: string;
  state: CheckInState;
  onCopy: () => void;
}

const CHECK_IN_WINDOW_LABEL: Record<CheckInState, string> = {
  ended: "Check-in closed",
  open: "Check-in open",
  too_early: "Opens 1 hour before start",
};

export function CheckInPanel({
  code,
  copied,
  closesAt,
  state,
  onCopy,
}: Readonly<CheckInPanelProps>) {
  const WindowIcon = state === "open" ? LockOpen : Lock;

  return (
    <>
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-bold",
          state === "open"
            ? "bg-[#15a66e]/15 text-[#15a66e] dark:text-[#3fd68c]"
            : "bg-muted text-muted-foreground",
        )}
      >
        <WindowIcon className="size-3.5" />
        {CHECK_IN_WINDOW_LABEL[state]}
      </span>

      <div className="flex size-49 items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted text-center text-[12px] font-semibold text-muted-foreground">
        <span className="flex flex-col items-center gap-2">
          <QrCode className="size-7" />
          QR preview unavailable
        </span>
      </div>

      <div className="text-center">
        <div className="font-mono text-[26px] font-extrabold tracking-[0.16em] text-foreground">
          {code ? `${code.slice(0, 4)} · ${code.slice(4)}` : "—— · ——"}
        </div>
        <div className="mt-1.5 text-xs text-muted-foreground">
          Attendees submit these 8 characters
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        disabled={code.length === 0}
        onClick={onCopy}
        className={cn(copied && "border-brand-teal/45 bg-brand-teal/15")}
      >
        {copied ? <Check /> : <Copy />}
        {copied ? "Copied" : "Copy code"}
      </Button>
      <div className="flex w-full items-start gap-2.5 rounded-xl border border-border bg-muted px-3.5 py-3">
        <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
        <p className="text-xs/relaxed text-muted-foreground">
          Project this code at the door. The window opens 1 hour before start and closes at{" "}
          {closesAt}.
        </p>
      </div>
    </>
  );
}

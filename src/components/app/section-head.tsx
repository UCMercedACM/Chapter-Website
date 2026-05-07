import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface SectionHeadProps {
  children: ReactNode;
  className?: string;
}

export function SectionHead({ children, className }: Readonly<SectionHeadProps>) {
  return (
    <div className={cn("mb-8 text-center", className)}>
      <span className="relative inline-block text-[22px] font-bold tracking-[0.08em] text-foreground uppercase">
        {children}
        <span className="mt-1.5 block h-1.25 rounded-[9px] bg-brand-sky" />
      </span>
    </div>
  );
}

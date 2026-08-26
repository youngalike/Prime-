import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function Pill({ className, children, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-gold-400/25 bg-navy-800/60 px-3.5 py-1.5 text-xs font-medium tracking-wide text-ivory-300",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

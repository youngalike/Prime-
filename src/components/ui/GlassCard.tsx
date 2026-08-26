import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
}

export function GlassCard({ className, glow, children, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass-panel rounded-2xl",
        glow && "glow-gold",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

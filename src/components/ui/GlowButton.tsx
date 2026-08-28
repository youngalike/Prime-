import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

interface GlowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "solid" | "ghost";
}

export function GlowButton({
  className,
  variant = "solid",
  children,
  ...props
}: GlowButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium tracking-wide transition-all duration-300",
        variant === "solid" &&
          "bg-gradient-to-b from-gold-300 to-gold-500 text-navy-950 shadow-lg hover:shadow-[0_0_30px_rgba(var(--glow-rgb),0.45)] hover:-translate-y-0.5",
        variant === "ghost" &&
          "glass-panel text-ink-900 hover:border-gold-400/50 hover:shadow-[0_0_20px_rgba(var(--glow-rgb),0.2)]",
        "disabled:opacity-50 disabled:pointer-events-none",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

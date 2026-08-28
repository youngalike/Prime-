import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  tone?: "default" | "danger";
}

export function IconButton({ className, tone = "default", children, ...props }: IconButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-full border transition-colors duration-200",
        tone === "default" &&
          "border-gold-400/30 bg-surface/90 text-gold-600 hover:bg-gold-400/15 hover:text-gold-600",
        tone === "danger" &&
          "border-red-300/50 bg-surface/90 text-red-500 hover:bg-red-400/10",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

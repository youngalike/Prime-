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
          "border-gold-400/30 bg-navy-900/80 text-gold-300 hover:bg-gold-400/15 hover:text-gold-300",
        tone === "danger" &&
          "border-red-400/30 bg-navy-900/80 text-red-300 hover:bg-red-400/15",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

"use client";

import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useThemeMode } from "@/components/theme/ThemeModeProvider";

export function ThemeToggle() {
  const { mode, preference, cyclePreference } = useThemeMode();
  const isDark = mode === "dark";
  const label =
    preference === "auto"
      ? `Theme: Auto (currently ${mode}) — tap to override`
      : `Theme: ${isDark ? "Dark" : "Light"} (forced) — tap to cycle`;

  return (
    <button
      type="button"
      onClick={cyclePreference}
      aria-label={label}
      title={label}
      className="glass-pill glow-gold absolute left-2 top-2 z-20 flex h-9 w-16 items-center rounded-full p-1 sm:left-4 sm:top-4 sm:h-10 sm:w-[4.5rem]"
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
        className="absolute z-10 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-b from-gold-300 to-gold-500 text-navy-950 shadow-[0_2px_10px_rgba(var(--glow-rgb),calc(0.55*var(--page-glow-intensity,1)))] sm:h-8 sm:w-8"
        style={{ left: isDark ? "calc(100% - 1.75rem - 4px)" : "4px" }}
      >
        {isDark ? <Moon size={14} /> : <Sun size={14} />}
      </motion.span>
      {preference === "auto" && (
        <span
          aria-hidden
          className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-gold-500"
        />
      )}
    </button>
  );
}

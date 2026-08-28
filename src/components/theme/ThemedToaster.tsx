"use client";

import { Toaster } from "sonner";
import { useThemeMode } from "@/components/theme/ThemeModeProvider";

export function ThemedToaster() {
  const { mode } = useThemeMode();
  return (
    <Toaster
      theme={mode}
      toastOptions={{
        style: {
          background: "color-mix(in srgb, var(--color-surface) 92%, transparent)",
          border: "1px solid rgba(var(--glow-rgb),0.3)",
          color: "var(--color-ink-900)",
        },
      }}
    />
  );
}

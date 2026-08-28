"use client";

import { createContext, useContext, useEffect, useLayoutEffect, useState, type ReactNode } from "react";
import { THEME_STORAGE_KEY, resolveMode, type ThemeMode, type ThemePreference } from "@/lib/theme-mode";

interface ThemeModeContextValue {
  mode: ThemeMode;
  preference: ThemePreference;
  cyclePreference: () => void;
}

const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);

export function ThemeModeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>("auto");
  const [mode, setMode] = useState<ThemeMode>("light");

  // One-time sync with localStorage/the device clock — neither exists during
  // SSR, so the state above starts at a fixed default that matches the
  // server-rendered markup, then this effect corrects it before paint.
  useLayoutEffect(() => {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    const initial: ThemePreference = stored === "light" || stored === "dark" ? stored : "auto";
    const resolved = resolveMode(initial);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from an external, SSR-unavailable source (localStorage + device clock), not derived from props/state
    setPreferenceState(initial);
    setMode(resolved);
    document.documentElement.setAttribute("data-theme", resolved);
  }, []);

  useEffect(() => {
    if (preference !== "auto") return;
    const id = window.setInterval(() => {
      const next = resolveMode("auto");
      setMode((prev) => (prev === next ? prev : next));
      document.documentElement.setAttribute("data-theme", next);
    }, 60_000);
    return () => window.clearInterval(id);
  }, [preference]);

  function setPreference(next: ThemePreference) {
    const resolved = resolveMode(next);
    setPreferenceState(next);
    setMode(resolved);
    document.documentElement.setAttribute("data-theme", resolved);
    if (next === "auto") window.localStorage.removeItem(THEME_STORAGE_KEY);
    else window.localStorage.setItem(THEME_STORAGE_KEY, next);
  }

  function cyclePreference() {
    setPreference(preference === "auto" ? "light" : preference === "light" ? "dark" : "auto");
  }

  return (
    <ThemeModeContext.Provider value={{ mode, preference, cyclePreference }}>
      {children}
    </ThemeModeContext.Provider>
  );
}

export function useThemeMode() {
  const ctx = useContext(ThemeModeContext);
  if (!ctx) throw new Error("useThemeMode must be used within ThemeModeProvider");
  return ctx;
}

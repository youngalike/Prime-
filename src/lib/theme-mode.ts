export type ThemeMode = "light" | "dark";
export type ThemePreference = "auto" | ThemeMode;

export const THEME_STORAGE_KEY = "theme-preference";

// Day = 06:00-18:59 local time, night = 19:00-05:59. Also duplicated in the
// inline boot script in layout.tsx (which runs before any module loads) —
// keep both in sync if this changes.
export const DAY_START_HOUR = 6;
export const DAY_END_HOUR = 19;

export function computeAutoMode(date: Date = new Date()): ThemeMode {
  const hour = date.getHours();
  return hour >= DAY_START_HOUR && hour < DAY_END_HOUR ? "light" : "dark";
}

export function resolveMode(preference: ThemePreference, date?: Date): ThemeMode {
  return preference === "auto" ? computeAutoMode(date) : preference;
}

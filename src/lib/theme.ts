import type { CSSProperties } from "react";
import type {
  AvailabilityStatus,
  FloatingIconSize,
  PhotoSize,
  Profile,
  ThemeAccent,
  ThemeFont,
} from "@/lib/types/database";

// Each tier scales together across breakpoints, so "size" stays a relative
// choice rather than a fixed pixel value that could look wrong on mobile.
export const PHOTO_SIZES: { id: PhotoSize; label: string; className: string }[] = [
  { id: "small", label: "Small", className: "h-44 w-44 sm:h-56 sm:w-56 lg:h-64 lg:w-64" },
  { id: "medium", label: "Medium", className: "h-56 w-56 sm:h-72 sm:w-72 lg:h-80 lg:w-80" },
  { id: "large", label: "Large", className: "h-64 w-64 sm:h-80 sm:w-80 lg:h-96 lg:w-96" },
];

export function getPhotoSize(id: PhotoSize) {
  return PHOTO_SIZES.find((p) => p.id === id) ?? PHOTO_SIZES[1];
}

export const FLOATING_ICON_SIZES: { id: FloatingIconSize; label: string; className: string }[] = [
  { id: "small", label: "Small", className: "h-11 w-11" },
  { id: "medium", label: "Medium", className: "h-14 w-14" },
  { id: "large", label: "Large", className: "h-20 w-20" },
];

export function getFloatingIconSize(id: FloatingIconSize) {
  return FLOATING_ICON_SIZES.find((s) => s.id === id) ?? FLOATING_ICON_SIZES[1];
}

// Fixed family name for an admin-uploaded font, injected via a dynamic
// @font-face rule (see SiteShell) since the file/format isn't known at
// build time, so it can't go through next/font.
export const CUSTOM_FONT_FAMILY = "Portfolio Custom Font";

// Any Google Font can be loaded at runtime by name via Google's CSS API —
// next/font/google needs a static import at build time, so it can't cover
// an admin-entered name, but this plain stylesheet URL can.
export function googleFontStylesheetUrl(name: string): string {
  const family = encodeURIComponent(name.trim()).replace(/%20/g, "+");
  return `https://fonts.googleapis.com/css2?family=${family}:wght@400;500;600;700&display=swap`;
}

export const ACCENTS: {
  id: ThemeAccent;
  label: string;
  swatch: string;
  colors: { 300: string; 400: string; 500: string; 600: string };
}[] = [
  {
    id: "gold",
    label: "Gold",
    swatch: "#e0ac2b",
    colors: { 300: "#f7dd8a", 400: "#f2c94c", 500: "#e0ac2b", 600: "#9a6d1a" },
  },
  {
    id: "rose",
    label: "Rose",
    swatch: "#f43f5e",
    colors: { 300: "#fda4af", 400: "#fb7185", 500: "#f43f5e", 600: "#e11d48" },
  },
  {
    id: "emerald",
    label: "Emerald",
    swatch: "#10b981",
    colors: { 300: "#6ee7b7", 400: "#34d399", 500: "#10b981", 600: "#04825b" },
  },
  {
    id: "sapphire",
    label: "Sapphire",
    swatch: "#3b82f6",
    colors: { 300: "#93c5fd", 400: "#60a5fa", 500: "#3b82f6", 600: "#2563eb" },
  },
  {
    id: "violet",
    label: "Violet",
    swatch: "#8b5cf6",
    colors: { 300: "#c4b5fd", 400: "#a78bfa", 500: "#8b5cf6", 600: "#7c3aed" },
  },
  {
    id: "terracotta",
    label: "Terracotta",
    swatch: "#f97316",
    colors: { 300: "#fdba74", 400: "#fb923c", 500: "#f97316", 600: "#c84b0a" },
  },
];

export const FONTS: { id: ThemeFont; label: string; headingVar: string; preview: string }[] = [
  { id: "modern", label: "Modern", headingVar: "var(--font-space-grotesk)", preview: "Space Grotesk" },
  { id: "classic", label: "Classic", headingVar: "var(--font-playfair)", preview: "Playfair Display" },
  { id: "bold", label: "Bold", headingVar: "var(--font-sora)", preview: "Sora" },
  { id: "friendly", label: "Friendly", headingVar: "var(--font-manrope)", preview: "Manrope" },
];

export const AVAILABILITY: { id: AvailabilityStatus; label: string; color: string; glow: string }[] = [
  { id: "active", label: "Available", color: "#22c55e", glow: "rgba(34,197,94,0.65)" },
  { id: "occupied", label: "Occupied", color: "#eab308", glow: "rgba(234,179,8,0.65)" },
  { id: "offline", label: "Offline", color: "#ef4444", glow: "rgba(239,68,68,0.6)" },
];

export function getAvailability(id: AvailabilityStatus) {
  return AVAILABILITY.find((a) => a.id === id) ?? AVAILABILITY[0];
}

export function getAccent(id: ThemeAccent) {
  return ACCENTS.find((a) => a.id === id) ?? ACCENTS[0];
}

export function getFont(id: ThemeFont) {
  return FONTS.find((f) => f.id === id) ?? FONTS[0];
}

// --- custom hex -> a 300/400/500/600 shade set, so a hand-picked accent
// still gets the same lighter/darker roles the six presets provide ---

function hexToHsl(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
    }
    h /= 6;
  }

  return [h * 360, s * 100, l * 100];
}

function hslToHex(h: number, s: number, l: number): string {
  const sN = s / 100;
  const lN = l / 100;
  const c = (1 - Math.abs(2 * lN - 1)) * sN;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = lN - c / 2;
  let [r, g, b] = [0, 0, 0];

  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];

  const toHex = (v: number) =>
    Math.round((v + m) * 255)
      .toString(16)
      .padStart(2, "0");

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

const clampLightness = (l: number) => Math.min(94, Math.max(10, l));

// The 600 shade doubles as small text/link color on a white background
// (company names, eyebrow labels), so it's capped noticeably darker than
// the general clamp — a light base color (e.g. a pale pastel) would
// otherwise derive a 600 shade too light to read reliably.
const clampTextLightness = (l: number) => Math.min(45, Math.max(10, l));

export function deriveShadesFromHex(hex: string): { 300: string; 400: string; 500: string; 600: string } {
  const [h, s] = hexToHsl(hex);
  const [, , baseL] = hexToHsl(hex);

  return {
    300: hslToHex(h, s, clampLightness(baseL + 22)),
    400: hslToHex(h, s, clampLightness(baseL + 10)),
    500: hex,
    600: hslToHex(h, s, clampTextLightness(baseL - 14)),
  };
}

const HEX_PATTERN = /^#[0-9a-fA-F]{6}$/;

export function isValidHex(value: string): boolean {
  return HEX_PATTERN.test(value);
}

function hexToRgbString(hex: string): string {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return `${r}, ${g}, ${b}`;
}

export function getThemeStyle(
  profile: Pick<
    Profile,
    "theme_accent" | "theme_accent_hex" | "theme_font" | "custom_font_url" | "google_font_name"
  >,
): CSSProperties {
  const colors =
    profile.theme_accent_hex && isValidHex(profile.theme_accent_hex)
      ? deriveShadesFromHex(profile.theme_accent_hex)
      : getAccent(profile.theme_accent).colors;
  const fontVar = profile.custom_font_url
    ? `"${CUSTOM_FONT_FAMILY}"`
    : profile.google_font_name
      ? `"${profile.google_font_name}"`
      : getFont(profile.theme_font).headingVar;

  return {
    "--color-gold-300": colors[300],
    "--color-gold-400": colors[400],
    "--color-gold-500": colors[500],
    "--color-gold-600": colors[600],
    "--glow-rgb": hexToRgbString(colors[400]),
    "--theme-font-display": fontVar,
    "--theme-font-sans": fontVar,
  } as CSSProperties;
}

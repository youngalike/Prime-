"use client";

import type { CSSProperties } from "react";
import { useThemeMode } from "@/components/theme/ThemeModeProvider";

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Fixed seed so the star field is identical on every render/reload, and on
// the server vs. the client — Math.random() at render time would produce a
// different field on each side and risk a hydration mismatch.
const rand = mulberry32(20260101);
const STARS = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  top: `${(rand() * 100).toFixed(2)}%`,
  left: `${(rand() * 100).toFixed(2)}%`,
  size: rand() < 0.85 ? 1 : 2,
  delay: `${(rand() * 6).toFixed(2)}s`,
  duration: `${(3 + rand() * 4).toFixed(2)}s`,
}));

export function NightSky() {
  const { mode } = useThemeMode();
  if (mode !== "dark") return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {STARS.map((s) => (
        <span
          key={s.id}
          className="motion-safe:animate-[twinkle_var(--star-duration)_ease-in-out_var(--star-delay)_infinite] absolute rounded-full bg-ivory-100"
          style={
            {
              top: s.top,
              left: s.left,
              width: s.size,
              height: s.size,
              "--star-duration": s.duration,
              "--star-delay": s.delay,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

"use client";

import Image from "next/image";
import { useThemeMode } from "@/components/theme/ThemeModeProvider";
import type { Profile } from "@/lib/types/database";

export function CoverBanner({ profile }: { profile: Profile }) {
  const { mode } = useThemeMode();
  const activeCover =
    mode === "dark" && profile.cover_image_url_dark ? profile.cover_image_url_dark : profile.cover_image_url;

  return (
    <div className="relative z-0 h-48 w-full overflow-hidden sm:h-64 lg:h-80">
      {activeCover ? (
        <Image
          src={activeCover}
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      ) : (
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 90% 100% at 30% 0%, rgba(var(--glow-rgb),calc(0.22 * var(--page-glow-intensity, 1))), transparent), radial-gradient(ellipse 70% 100% at 85% 20%, rgba(var(--glow-rgb),calc(0.14 * var(--page-glow-intensity, 1))), transparent), var(--color-paper-warm)",
          }}
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-transparent from-70% via-paper/50 via-85% to-paper" />
    </div>
  );
}

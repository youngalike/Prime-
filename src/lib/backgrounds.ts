import type { Profile, SectionBackground, SectionKey } from "@/lib/types/database";

export type ResolvedBackground = { url: string | null; opacity: number };

export function resolveSectionBackground(
  key: SectionKey,
  sectionBackgrounds: SectionBackground[],
  profile: Pick<Profile, "background_image_url" | "background_opacity">,
): ResolvedBackground {
  const override = sectionBackgrounds.find((s) => s.section_key === key);
  if (override?.image_url) {
    return { url: override.image_url, opacity: override.opacity };
  }
  return { url: profile.background_image_url, opacity: profile.background_opacity };
}

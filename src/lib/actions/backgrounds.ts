"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "./guard";
import type { SectionKey } from "@/lib/types/database";

export async function setSectionBackground(
  section_key: SectionKey,
  input: { image_url?: string | null; opacity?: number },
) {
  const supabase = await requireAdmin();

  const { error } = await supabase
    .from("section_backgrounds")
    .upsert({ section_key, ...input }, { onConflict: "section_key" });

  if (error) throw error;

  revalidatePath("/");
}

export async function clearSectionBackground(section_key: SectionKey) {
  const supabase = await requireAdmin();

  const { error } = await supabase
    .from("section_backgrounds")
    .upsert({ section_key, image_url: null }, { onConflict: "section_key" });

  if (error) throw error;

  revalidatePath("/");
}

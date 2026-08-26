"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "./guard";
import type { Skill, SkillCategory } from "@/lib/types/database";

export type SkillInput = {
  name: string;
  category: SkillCategory;
  stars: number | null;
  years_label: string | null;
};

export async function createSkill(input: SkillInput, sort_order: number) {
  const supabase = await requireAdmin();

  const { error } = await supabase.from("skills").insert({ ...input, sort_order });
  if (error) throw error;

  revalidatePath("/");
}

export async function updateSkill(id: string, input: SkillInput) {
  const supabase = await requireAdmin();

  const { error } = await supabase.from("skills").update(input).eq("id", id);
  if (error) throw error;

  revalidatePath("/");
}

export async function deleteSkill(id: string) {
  const supabase = await requireAdmin();

  const { error } = await supabase.from("skills").delete().eq("id", id);
  if (error) throw error;

  revalidatePath("/");
}

export async function reorderSkills(orderedIds: string[]) {
  const supabase = await requireAdmin();

  await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from("skills").update({ sort_order: index }).eq("id", id),
    ),
  );

  revalidatePath("/");
}

export type { Skill };

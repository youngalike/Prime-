"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "./guard";

export type ExperienceInput = {
  title: string;
  company: string;
  period: string;
  bullets: string[];
};

export async function createExperience(input: ExperienceInput, sort_order: number) {
  const supabase = await requireAdmin();

  const { error } = await supabase.from("experience").insert({ ...input, sort_order });
  if (error) throw error;

  revalidatePath("/");
}

export async function updateExperience(id: string, input: ExperienceInput) {
  const supabase = await requireAdmin();

  const { error } = await supabase.from("experience").update(input).eq("id", id);
  if (error) throw error;

  revalidatePath("/");
}

export async function deleteExperience(id: string) {
  const supabase = await requireAdmin();

  const { error } = await supabase.from("experience").delete().eq("id", id);
  if (error) throw error;

  revalidatePath("/");
}

export async function reorderExperience(orderedIds: string[]) {
  const supabase = await requireAdmin();

  await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from("experience").update({ sort_order: index }).eq("id", id),
    ),
  );

  revalidatePath("/");
}

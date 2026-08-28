"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "./guard";

export type EducationInput = {
  degree: string;
  school: string;
  location: string | null;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
};

export async function createEducation(input: EducationInput, sort_order: number) {
  const supabase = await requireAdmin();

  const { error } = await supabase.from("education").insert({ ...input, sort_order });
  if (error) throw error;

  revalidatePath("/");
}

export async function updateEducation(id: string, input: EducationInput) {
  const supabase = await requireAdmin();

  const { error } = await supabase.from("education").update(input).eq("id", id);
  if (error) throw error;

  revalidatePath("/");
}

export async function deleteEducation(id: string) {
  const supabase = await requireAdmin();

  const { error } = await supabase.from("education").delete().eq("id", id);
  if (error) throw error;

  revalidatePath("/");
}

export async function reorderEducation(orderedIds: string[]) {
  const supabase = await requireAdmin();

  await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from("education").update({ sort_order: index }).eq("id", id),
    ),
  );

  revalidatePath("/");
}

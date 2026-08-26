"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "./guard";
import type { Profile } from "@/lib/types/database";

export type ProfileInput = Partial<
  Omit<Profile, "id" | "updated_at">
>;

export async function updateProfile(input: ProfileInput) {
  const supabase = await requireAdmin();

  const { error } = await supabase
    .from("profile")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", "singleton");

  if (error) throw error;

  revalidatePath("/");
}

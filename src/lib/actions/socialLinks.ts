"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "./guard";

export type SocialLinkInput = {
  label: string;
  url: string;
  icon_url: string | null;
};

export async function createSocialLink(input: SocialLinkInput, sort_order: number) {
  const supabase = await requireAdmin();

  const { error } = await supabase.from("social_links").insert({ ...input, sort_order });
  if (error) throw error;

  revalidatePath("/");
}

export async function updateSocialLink(id: string, input: SocialLinkInput) {
  const supabase = await requireAdmin();

  const { error } = await supabase.from("social_links").update(input).eq("id", id);
  if (error) throw error;

  revalidatePath("/");
}

export async function deleteSocialLink(id: string) {
  const supabase = await requireAdmin();

  const { error } = await supabase.from("social_links").delete().eq("id", id);
  if (error) throw error;

  revalidatePath("/");
}

export async function reorderSocialLinks(orderedIds: string[]) {
  const supabase = await requireAdmin();

  await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from("social_links").update({ sort_order: index }).eq("id", id),
    ),
  );

  revalidatePath("/");
}

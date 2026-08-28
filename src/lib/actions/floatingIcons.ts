"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "./guard";

export async function addFloatingIcon(image_url: string, sort_order: number) {
  const supabase = await requireAdmin();

  const { error } = await supabase.from("floating_icons").insert({ image_url, sort_order });
  if (error) throw error;

  revalidatePath("/");
}

export async function deleteFloatingIcon(id: string) {
  const supabase = await requireAdmin();

  const { error } = await supabase.from("floating_icons").delete().eq("id", id);
  if (error) throw error;

  revalidatePath("/");
}

export async function reorderFloatingIcons(orderedIds: string[]) {
  const supabase = await requireAdmin();

  await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from("floating_icons").update({ sort_order: index }).eq("id", id),
    ),
  );

  revalidatePath("/");
}

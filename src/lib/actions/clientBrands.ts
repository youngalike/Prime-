"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "./guard";

export type ClientBrandInput = {
  name: string;
  logo_url: string;
  website_url: string | null;
};

export async function createClientBrand(input: ClientBrandInput, sort_order: number) {
  const supabase = await requireAdmin();

  const { error } = await supabase.from("client_brands").insert({ ...input, sort_order });
  if (error) throw error;

  revalidatePath("/");
}

export async function updateClientBrand(id: string, input: Partial<ClientBrandInput>) {
  const supabase = await requireAdmin();

  const { error } = await supabase.from("client_brands").update(input).eq("id", id);
  if (error) throw error;

  revalidatePath("/");
}

export async function deleteClientBrand(id: string) {
  const supabase = await requireAdmin();

  const { error } = await supabase.from("client_brands").delete().eq("id", id);
  if (error) throw error;

  revalidatePath("/");
}

export async function reorderClientBrands(orderedIds: string[]) {
  const supabase = await requireAdmin();

  await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from("client_brands").update({ sort_order: index }).eq("id", id),
    ),
  );

  revalidatePath("/");
}

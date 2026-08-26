"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "./guard";

// ---------------------------------------------------------------------------
// brands
// ---------------------------------------------------------------------------

export async function createBrand(name: string, sort_order: number) {
  const supabase = await requireAdmin();

  const { data, error } = await supabase
    .from("portfolio_brands")
    .insert({ name, sort_order })
    .select()
    .single();

  if (error) throw error;

  revalidatePath("/");
  return data;
}

export async function updateBrand(
  id: string,
  input: { name: string; description: string | null },
) {
  const supabase = await requireAdmin();

  const { error } = await supabase.from("portfolio_brands").update(input).eq("id", id);
  if (error) throw error;

  revalidatePath("/");
}

export async function deleteBrand(id: string) {
  const supabase = await requireAdmin();

  const { error } = await supabase.from("portfolio_brands").delete().eq("id", id);
  if (error) throw error;

  revalidatePath("/");
}

export async function reorderBrands(orderedIds: string[]) {
  const supabase = await requireAdmin();

  await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from("portfolio_brands").update({ sort_order: index }).eq("id", id),
    ),
  );

  revalidatePath("/");
}

export async function setBrandCoverImage(id: string, cover_image_url: string) {
  const supabase = await requireAdmin();

  const { error } = await supabase
    .from("portfolio_brands")
    .update({ cover_image_url })
    .eq("id", id);

  if (error) throw error;

  revalidatePath("/");
}

// ---------------------------------------------------------------------------
// images
// ---------------------------------------------------------------------------

export async function addPortfolioImage(
  brand_id: string,
  image_url: string,
  sort_order: number,
) {
  const supabase = await requireAdmin();

  const { error } = await supabase
    .from("portfolio_images")
    .insert({ brand_id, image_url, sort_order });

  if (error) throw error;

  revalidatePath("/");
}

export async function updatePortfolioImageCaption(id: string, caption: string) {
  const supabase = await requireAdmin();

  const { error } = await supabase.from("portfolio_images").update({ caption }).eq("id", id);
  if (error) throw error;

  revalidatePath("/");
}

export async function deletePortfolioImage(id: string) {
  const supabase = await requireAdmin();

  const { error } = await supabase.from("portfolio_images").delete().eq("id", id);
  if (error) throw error;

  revalidatePath("/");
}

export async function reorderPortfolioImages(orderedIds: string[]) {
  const supabase = await requireAdmin();

  await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from("portfolio_images").update({ sort_order: index }).eq("id", id),
    ),
  );

  revalidatePath("/");
}

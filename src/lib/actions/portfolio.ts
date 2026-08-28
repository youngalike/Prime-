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
  input: { name: string; description: string | null; overview?: string | null },
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

// ---------------------------------------------------------------------------
// phases (the process behind a project — research, concept, delivery, etc.)
// ---------------------------------------------------------------------------

export type PhaseInput = { title: string; description: string | null };

export async function createPhase(brand_id: string, input: PhaseInput, sort_order: number) {
  const supabase = await requireAdmin();

  const { error } = await supabase.from("portfolio_phases").insert({ brand_id, ...input, sort_order });
  if (error) throw error;

  revalidatePath("/");
}

export async function updatePhase(id: string, input: PhaseInput) {
  const supabase = await requireAdmin();

  const { error } = await supabase.from("portfolio_phases").update(input).eq("id", id);
  if (error) throw error;

  revalidatePath("/");
}

export async function deletePhase(id: string) {
  const supabase = await requireAdmin();

  const { error } = await supabase.from("portfolio_phases").delete().eq("id", id);
  if (error) throw error;

  revalidatePath("/");
}

export async function reorderPhases(orderedIds: string[]) {
  const supabase = await requireAdmin();

  await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from("portfolio_phases").update({ sort_order: index }).eq("id", id),
    ),
  );

  revalidatePath("/");
}

// ---------------------------------------------------------------------------
// phase images (a phase can carry several photos, same shape as the main
// brand gallery)
// ---------------------------------------------------------------------------

export async function addPhaseImage(phase_id: string, image_url: string, sort_order: number) {
  const supabase = await requireAdmin();

  const { error } = await supabase
    .from("portfolio_phase_images")
    .insert({ phase_id, image_url, sort_order });

  if (error) throw error;

  revalidatePath("/");
}

export async function deletePhaseImage(id: string) {
  const supabase = await requireAdmin();

  const { error } = await supabase.from("portfolio_phase_images").delete().eq("id", id);
  if (error) throw error;

  revalidatePath("/");
}

export async function reorderPhaseImages(orderedIds: string[]) {
  const supabase = await requireAdmin();

  await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from("portfolio_phase_images").update({ sort_order: index }).eq("id", id),
    ),
  );

  revalidatePath("/");
}

// ---------------------------------------------------------------------------
// brand tools (software/platform icons — "what I used to build this")
// ---------------------------------------------------------------------------

export async function addBrandTool(
  brand_id: string,
  icon_url: string,
  name: string | null,
  sort_order: number,
) {
  const supabase = await requireAdmin();

  const { error } = await supabase
    .from("portfolio_brand_tools")
    .insert({ brand_id, icon_url, name, sort_order });

  if (error) throw error;

  revalidatePath("/");
}

export async function deleteBrandTool(id: string) {
  const supabase = await requireAdmin();

  const { error } = await supabase.from("portfolio_brand_tools").delete().eq("id", id);
  if (error) throw error;

  revalidatePath("/");
}

export async function reorderBrandTools(orderedIds: string[]) {
  const supabase = await requireAdmin();

  await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from("portfolio_brand_tools").update({ sort_order: index }).eq("id", id),
    ),
  );

  revalidatePath("/");
}

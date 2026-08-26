"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "./guard";

export type CertificationInput = {
  issuer: string;
  title: string;
  credential_url: string | null;
};

export async function createCertification(input: CertificationInput, sort_order: number) {
  const supabase = await requireAdmin();

  const { error } = await supabase.from("certifications").insert({ ...input, sort_order });
  if (error) throw error;

  revalidatePath("/");
}

export async function updateCertification(id: string, input: CertificationInput) {
  const supabase = await requireAdmin();

  const { error } = await supabase.from("certifications").update(input).eq("id", id);
  if (error) throw error;

  revalidatePath("/");
}

export async function deleteCertification(id: string) {
  const supabase = await requireAdmin();

  const { error } = await supabase.from("certifications").delete().eq("id", id);
  if (error) throw error;

  revalidatePath("/");
}

export async function reorderCertifications(orderedIds: string[]) {
  const supabase = await requireAdmin();

  await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from("certifications").update({ sort_order: index }).eq("id", id),
    ),
  );

  revalidatePath("/");
}

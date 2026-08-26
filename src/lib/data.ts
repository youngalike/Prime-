import { createClient } from "@/lib/supabase/server";
import type {
  Certification,
  Education,
  Experience,
  PortfolioBrandWithImages,
  Profile,
  SiteData,
  Skill,
} from "@/lib/types/database";

const EMPTY_PROFILE: Profile = {
  id: "singleton",
  full_name: "Your Name",
  title: "Your title",
  bio: "",
  photo_url: null,
  location: null,
  email: null,
  phone_primary: null,
  phone_secondary: null,
  social_instagram: null,
  social_facebook: null,
  social_twitter: null,
  social_linkedin: null,
  updated_at: new Date().toISOString(),
};

export async function getSiteData(): Promise<SiteData> {
  const supabase = await createClient();

  const [
    { data: user },
    { data: profile },
    { data: skills },
    { data: experience },
    { data: education },
    { data: certifications },
    { data: brands },
    { data: images },
  ] = await Promise.all([
    supabase.auth.getUser().then((r) => ({ data: r.data.user })),
    supabase.from("profile").select("*").eq("id", "singleton").maybeSingle(),
    supabase.from("skills").select("*").order("sort_order"),
    supabase.from("experience").select("*").order("sort_order"),
    supabase.from("education").select("*").order("sort_order"),
    supabase.from("certifications").select("*").order("sort_order"),
    supabase.from("portfolio_brands").select("*").order("sort_order"),
    supabase.from("portfolio_images").select("*").order("sort_order"),
  ]);

  const portfolioBrands: PortfolioBrandWithImages[] = (brands ?? []).map((brand) => ({
    ...brand,
    images: (images ?? []).filter((img) => img.brand_id === brand.id),
  }));

  return {
    profile: (profile as Profile) ?? EMPTY_PROFILE,
    skills: (skills as Skill[]) ?? [],
    experience: (experience as Experience[]) ?? [],
    education: (education as Education[]) ?? [],
    certifications: (certifications as Certification[]) ?? [],
    portfolioBrands,
    isAdmin: !!user,
  };
}

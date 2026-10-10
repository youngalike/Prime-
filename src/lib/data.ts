import { createClient } from "@/lib/supabase/server";
import type {
  Certification,
  ClientBrand,
  Education,
  Experience,
  FloatingIcon,
  PortfolioBrandWithImages,
  Profile,
  SectionBackground,
  SiteData,
  Skill,
  SocialLink,
} from "@/lib/types/database";

const EMPTY_PROFILE: Profile = {
  id: "singleton",
  full_name: "Your Name",
  title: "Your title",
  specialties: null,
  hero_intro: null,
  bio: "",
  photo_url: null,
  photo_size: "medium",
  floating_icon_size: "medium",
  bounce_intensity: 1,
  photo_glow_hex: null,
  photo_glow_intensity: 1,
  page_glow_intensity: 1,
  cover_image_url: null,
  cover_image_url_dark: null,
  theme_accent: "gold",
  theme_accent_hex: null,
  theme_font: "modern",
  custom_font_url: null,
  google_font_name: null,
  availability_status: "active",
  background_image_url: null,
  background_opacity: 0.15,
  location: null,
  email: null,
  phone_primary: null,
  phone_secondary: null,
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
    { data: brandTools },
    { data: phases },
    { data: phaseImages },
    { data: floatingIcons },
    { data: socialLinks },
    { data: clientBrands },
    { data: sectionBackgrounds },
  ] = await Promise.all([
    supabase.auth.getUser().then((r) => ({ data: r.data.user })),
    supabase.from("profile").select("*").eq("id", "singleton").maybeSingle(),
    supabase.from("skills").select("*").order("sort_order"),
    supabase.from("experience").select("*").order("sort_order"),
    supabase.from("education").select("*").order("sort_order"),
    supabase.from("certifications").select("*").order("sort_order"),
    supabase.from("portfolio_brands").select("*").order("sort_order"),
    supabase.from("portfolio_images").select("*").order("sort_order"),
    supabase.from("portfolio_brand_tools").select("*").order("sort_order"),
    supabase.from("portfolio_phases").select("*").order("sort_order"),
    supabase.from("portfolio_phase_images").select("*").order("sort_order"),
    supabase.from("floating_icons").select("*").order("sort_order"),
    supabase.from("social_links").select("*").order("sort_order"),
    supabase.from("client_brands").select("*").order("sort_order"),
    supabase.from("section_backgrounds").select("*"),
  ]);

  const portfolioBrands: PortfolioBrandWithImages[] = (brands ?? []).map((brand) => ({
    ...brand,
    images: (images ?? []).filter((img) => img.brand_id === brand.id),
    tools: (brandTools ?? []).filter((tool) => tool.brand_id === brand.id),
    phases: (phases ?? [])
      .filter((phase) => phase.brand_id === brand.id)
      .map((phase) => ({
        ...phase,
        images: (phaseImages ?? []).filter((img) => img.phase_id === phase.id),
      })),
  }));

  return {
    profile: (profile as Profile) ?? EMPTY_PROFILE,
    skills: (skills as Skill[]) ?? [],
    experience: (experience as Experience[]) ?? [],
    education: (education as Education[]) ?? [],
    certifications: (certifications as Certification[]) ?? [],
    portfolioBrands,
    floatingIcons: (floatingIcons as FloatingIcon[]) ?? [],
    socialLinks: (socialLinks as SocialLink[]) ?? [],
    clientBrands: (clientBrands as ClientBrand[]) ?? [],
    sectionBackgrounds: (sectionBackgrounds as SectionBackground[]) ?? [],
    isAdmin: !!user,
  };
}

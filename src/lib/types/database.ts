export type SkillCategory = "pc_mac" | "mobile" | "soft";

// NOTE: these are `type` aliases, not `interface`s, on purpose — interfaces
// don't get an implicit index signature, which makes them fail Supabase's
// internal `Record<string, unknown>` constraint and silently collapses every
// table's types to `never`.

export type ThemeAccent = "gold" | "rose" | "emerald" | "sapphire" | "violet" | "terracotta";
export type ThemeFont = "modern" | "classic" | "bold" | "friendly";
export type AvailabilityStatus = "active" | "occupied" | "offline";
export type PhotoSize = "small" | "medium" | "large";
export type FloatingIconSize = "small" | "medium" | "large";

export type Profile = {
  id: "singleton";
  full_name: string;
  title: string;
  specialties: string | null;
  bio: string;
  photo_url: string | null;
  photo_size: PhotoSize;
  floating_icon_size: FloatingIconSize;
  bounce_intensity: number;
  photo_glow_hex: string | null;
  photo_glow_intensity: number;
  page_glow_intensity: number;
  cover_image_url: string | null;
  cover_image_url_dark: string | null;
  theme_accent: ThemeAccent;
  theme_accent_hex: string | null;
  theme_font: ThemeFont;
  custom_font_url: string | null;
  google_font_name: string | null;
  availability_status: AvailabilityStatus;
  background_image_url: string | null;
  background_opacity: number;
  location: string | null;
  email: string | null;
  phone_primary: string | null;
  phone_secondary: string | null;
  updated_at: string;
};

export const SECTION_KEYS = [
  "hero",
  "about",
  "skills",
  "experience",
  "education",
  "certifications",
  "worked_with",
  "portfolio",
  "contact",
] as const;

export type SectionKey = (typeof SECTION_KEYS)[number];

export type SectionBackground = {
  section_key: SectionKey;
  image_url: string | null;
  opacity: number;
};

export type SocialLink = {
  id: string;
  label: string;
  url: string;
  icon_url: string | null;
  sort_order: number;
};

export type Skill = {
  id: string;
  name: string;
  category: SkillCategory;
  stars: number | null;
  years_label: string | null;
  icon_url: string | null;
  sort_order: number;
};

export type Experience = {
  id: string;
  title: string;
  company: string;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  bullets: string[];
  sort_order: number;
};

export type Education = {
  id: string;
  degree: string;
  school: string;
  location: string | null;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  sort_order: number;
};

export type Certification = {
  id: string;
  issuer: string;
  title: string;
  credential_url: string | null;
  image_url: string | null;
  sort_order: number;
};

export type PortfolioBrand = {
  id: string;
  name: string;
  description: string | null;
  overview: string | null;
  cover_image_url: string | null;
  sort_order: number;
};

export type PortfolioImage = {
  id: string;
  brand_id: string;
  image_url: string;
  caption: string | null;
  sort_order: number;
};

export type PortfolioPhase = {
  id: string;
  brand_id: string;
  title: string;
  description: string | null;
  sort_order: number;
};

export type PortfolioPhaseImage = {
  id: string;
  phase_id: string;
  image_url: string;
  sort_order: number;
};

export type PortfolioPhaseWithImages = PortfolioPhase & {
  images: PortfolioPhaseImage[];
};

export type PortfolioBrandTool = {
  id: string;
  brand_id: string;
  icon_url: string;
  name: string | null;
  sort_order: number;
};

export type PortfolioBrandWithImages = PortfolioBrand & {
  images: PortfolioImage[];
  phases: PortfolioPhaseWithImages[];
  tools: PortfolioBrandTool[];
};

export type FloatingIcon = {
  id: string;
  image_url: string;
  sort_order: number;
};

export type ClientBrand = {
  id: string;
  name: string;
  logo_url: string;
  website_url: string | null;
  sort_order: number;
};

export type SiteData = {
  profile: Profile;
  skills: Skill[];
  experience: Experience[];
  education: Education[];
  certifications: Certification[];
  portfolioBrands: PortfolioBrandWithImages[];
  floatingIcons: FloatingIcon[];
  socialLinks: SocialLink[];
  clientBrands: ClientBrand[];
  sectionBackgrounds: SectionBackground[];
  isAdmin: boolean;
};

export type Database = {
  public: {
    Tables: {
      profile: {
        Row: Profile;
        Insert: Partial<Profile>;
        Update: Partial<Profile>;
        Relationships: [];
      };
      skills: {
        Row: Skill;
        Insert: Partial<Skill>;
        Update: Partial<Skill>;
        Relationships: [];
      };
      experience: {
        Row: Experience;
        Insert: Partial<Experience>;
        Update: Partial<Experience>;
        Relationships: [];
      };
      education: {
        Row: Education;
        Insert: Partial<Education>;
        Update: Partial<Education>;
        Relationships: [];
      };
      certifications: {
        Row: Certification;
        Insert: Partial<Certification>;
        Update: Partial<Certification>;
        Relationships: [];
      };
      portfolio_brands: {
        Row: PortfolioBrand;
        Insert: Partial<PortfolioBrand>;
        Update: Partial<PortfolioBrand>;
        Relationships: [];
      };
      portfolio_images: {
        Row: PortfolioImage;
        Insert: Partial<PortfolioImage>;
        Update: Partial<PortfolioImage>;
        Relationships: [
          {
            foreignKeyName: "portfolio_images_brand_id_fkey";
            columns: ["brand_id"];
            isOneToOne: false;
            referencedRelation: "portfolio_brands";
            referencedColumns: ["id"];
          },
        ];
      };
      portfolio_phases: {
        Row: PortfolioPhase;
        Insert: Partial<PortfolioPhase>;
        Update: Partial<PortfolioPhase>;
        Relationships: [
          {
            foreignKeyName: "portfolio_phases_brand_id_fkey";
            columns: ["brand_id"];
            isOneToOne: false;
            referencedRelation: "portfolio_brands";
            referencedColumns: ["id"];
          },
        ];
      };
      portfolio_phase_images: {
        Row: PortfolioPhaseImage;
        Insert: Partial<PortfolioPhaseImage>;
        Update: Partial<PortfolioPhaseImage>;
        Relationships: [
          {
            foreignKeyName: "portfolio_phase_images_phase_id_fkey";
            columns: ["phase_id"];
            isOneToOne: false;
            referencedRelation: "portfolio_phases";
            referencedColumns: ["id"];
          },
        ];
      };
      portfolio_brand_tools: {
        Row: PortfolioBrandTool;
        Insert: Partial<PortfolioBrandTool>;
        Update: Partial<PortfolioBrandTool>;
        Relationships: [
          {
            foreignKeyName: "portfolio_brand_tools_brand_id_fkey";
            columns: ["brand_id"];
            isOneToOne: false;
            referencedRelation: "portfolio_brands";
            referencedColumns: ["id"];
          },
        ];
      };
      floating_icons: {
        Row: FloatingIcon;
        Insert: Partial<FloatingIcon>;
        Update: Partial<FloatingIcon>;
        Relationships: [];
      };
      social_links: {
        Row: SocialLink;
        Insert: Partial<SocialLink>;
        Update: Partial<SocialLink>;
        Relationships: [];
      };
      client_brands: {
        Row: ClientBrand;
        Insert: Partial<ClientBrand>;
        Update: Partial<ClientBrand>;
        Relationships: [];
      };
      section_backgrounds: {
        Row: SectionBackground;
        Insert: Partial<SectionBackground>;
        Update: Partial<SectionBackground>;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};

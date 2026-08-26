export type SkillCategory = "pc_mac" | "mobile" | "soft";

// NOTE: these are `type` aliases, not `interface`s, on purpose — interfaces
// don't get an implicit index signature, which makes them fail Supabase's
// internal `Record<string, unknown>` constraint and silently collapses every
// table's types to `never`.

export type Profile = {
  id: "singleton";
  full_name: string;
  title: string;
  bio: string;
  photo_url: string | null;
  location: string | null;
  email: string | null;
  phone_primary: string | null;
  phone_secondary: string | null;
  social_instagram: string | null;
  social_facebook: string | null;
  social_twitter: string | null;
  social_linkedin: string | null;
  updated_at: string;
};

export type Skill = {
  id: string;
  name: string;
  category: SkillCategory;
  stars: number | null;
  years_label: string | null;
  sort_order: number;
};

export type Experience = {
  id: string;
  title: string;
  company: string;
  period: string;
  bullets: string[];
  sort_order: number;
};

export type Education = {
  id: string;
  degree: string;
  school: string;
  location: string | null;
  period: string;
  sort_order: number;
};

export type Certification = {
  id: string;
  issuer: string;
  title: string;
  credential_url: string | null;
  sort_order: number;
};

export type PortfolioBrand = {
  id: string;
  name: string;
  description: string | null;
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

export type PortfolioBrandWithImages = PortfolioBrand & {
  images: PortfolioImage[];
};

export type SiteData = {
  profile: Profile;
  skills: Skill[];
  experience: Experience[];
  education: Education[];
  certifications: Certification[];
  portfolioBrands: PortfolioBrandWithImages[];
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
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};

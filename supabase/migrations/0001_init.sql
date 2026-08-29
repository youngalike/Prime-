-- Portfolio site schema for Alike Kingsley Chukwudi
-- Public read on everything, authenticated-only write (single admin user,
-- created manually in the Supabase dashboard — there is no sign-up flow).

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- profile (singleton row)
-- ---------------------------------------------------------------------------
create table if not exists profile (
  id text primary key default 'singleton' check (id = 'singleton'),
  full_name text not null default '',
  title text not null default '',
  specialties text,
  bio text not null default '',
  photo_url text,
  photo_size text not null default 'medium' check (photo_size in ('small', 'medium', 'large')),
  floating_icon_size text not null default 'medium' check (floating_icon_size in ('small', 'medium', 'large')),
  bounce_intensity numeric not null default 1 check (bounce_intensity between 0.5 and 2.5),
  photo_glow_hex text,
  photo_glow_intensity numeric not null default 1 check (photo_glow_intensity between 0 and 1),
  page_glow_intensity numeric not null default 1 check (page_glow_intensity between 0 and 1),
  cover_image_url text,
  cover_image_url_dark text,
  theme_accent text not null default 'gold'
    check (theme_accent in ('gold', 'rose', 'emerald', 'sapphire', 'violet', 'terracotta')),
  theme_accent_hex text,
  theme_font text not null default 'modern'
    check (theme_font in ('modern', 'classic', 'bold', 'friendly')),
  custom_font_url text,
  google_font_name text,
  availability_status text not null default 'active'
    check (availability_status in ('active', 'occupied', 'offline')),
  background_image_url text,
  background_opacity numeric not null default 0.15 check (background_opacity between 0 and 1),
  location text,
  email text,
  phone_primary text,
  phone_secondary text,
  updated_at timestamptz not null default now()
);

alter table profile enable row level security;

create policy "profile is publicly readable" on profile
  for select using (true);

create policy "profile is writable by authenticated users" on profile
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ---------------------------------------------------------------------------
-- skills
-- ---------------------------------------------------------------------------
create table if not exists skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null check (category in ('pc_mac', 'mobile', 'soft')),
  stars smallint check (stars between 1 and 5),
  years_label text,
  icon_url text,
  sort_order int not null default 0
);

alter table skills enable row level security;

create policy "skills are publicly readable" on skills
  for select using (true);

create policy "skills are writable by authenticated users" on skills
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ---------------------------------------------------------------------------
-- experience
-- ---------------------------------------------------------------------------
create table if not exists experience (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  company text not null,
  start_date date not null,
  end_date date,
  is_current boolean not null default false,
  bullets text[] not null default '{}',
  sort_order int not null default 0
);

alter table experience enable row level security;

create policy "experience is publicly readable" on experience
  for select using (true);

create policy "experience is writable by authenticated users" on experience
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ---------------------------------------------------------------------------
-- education
-- ---------------------------------------------------------------------------
create table if not exists education (
  id uuid primary key default gen_random_uuid(),
  degree text not null,
  school text not null,
  location text,
  start_date date not null,
  end_date date,
  is_current boolean not null default false,
  sort_order int not null default 0
);

alter table education enable row level security;

create policy "education is publicly readable" on education
  for select using (true);

create policy "education is writable by authenticated users" on education
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ---------------------------------------------------------------------------
-- certifications
-- ---------------------------------------------------------------------------
create table if not exists certifications (
  id uuid primary key default gen_random_uuid(),
  issuer text not null,
  title text not null,
  credential_url text,
  image_url text,
  sort_order int not null default 0
);

alter table certifications enable row level security;

create policy "certifications are publicly readable" on certifications
  for select using (true);

create policy "certifications are writable by authenticated users" on certifications
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ---------------------------------------------------------------------------
-- portfolio_brands / portfolio_images / portfolio_phases
-- ---------------------------------------------------------------------------
create table if not exists portfolio_brands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  overview text,
  cover_image_url text,
  sort_order int not null default 0
);

alter table portfolio_brands enable row level security;

create policy "portfolio_brands are publicly readable" on portfolio_brands
  for select using (true);

create policy "portfolio_brands are writable by authenticated users" on portfolio_brands
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create table if not exists portfolio_images (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references portfolio_brands(id) on delete cascade,
  image_url text not null,
  caption text,
  sort_order int not null default 0
);

alter table portfolio_images enable row level security;

create policy "portfolio_images are publicly readable" on portfolio_images
  for select using (true);

create policy "portfolio_images are writable by authenticated users" on portfolio_images
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create table if not exists portfolio_phases (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references portfolio_brands(id) on delete cascade,
  title text not null,
  description text,
  sort_order int not null default 0
);

alter table portfolio_phases enable row level security;

create policy "portfolio_phases are publicly readable" on portfolio_phases
  for select using (true);

create policy "portfolio_phases are writable by authenticated users" on portfolio_phases
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create table if not exists portfolio_phase_images (
  id uuid primary key default gen_random_uuid(),
  phase_id uuid not null references portfolio_phases(id) on delete cascade,
  image_url text not null,
  sort_order int not null default 0
);

alter table portfolio_phase_images enable row level security;

create policy "portfolio_phase_images are publicly readable" on portfolio_phase_images
  for select using (true);

create policy "portfolio_phase_images are writable by authenticated users" on portfolio_phase_images
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ---------------------------------------------------------------------------
-- portfolio_brand_tools (software/platform icons — "what I used to build
-- this" — shown on the project card and case-study modal)
-- ---------------------------------------------------------------------------
create table if not exists portfolio_brand_tools (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references portfolio_brands(id) on delete cascade,
  icon_url text not null,
  name text,
  sort_order int not null default 0
);

alter table portfolio_brand_tools enable row level security;

create policy "portfolio_brand_tools are publicly readable" on portfolio_brand_tools
  for select using (true);

create policy "portfolio_brand_tools are writable by authenticated users" on portfolio_brand_tools
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ---------------------------------------------------------------------------
-- floating_icons (small decorative badges around the hero photo)
-- ---------------------------------------------------------------------------
create table if not exists floating_icons (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  sort_order int not null default 0
);

alter table floating_icons enable row level security;

create policy "floating_icons are publicly readable" on floating_icons
  for select using (true);

create policy "floating_icons are writable by authenticated users" on floating_icons
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ---------------------------------------------------------------------------
-- social_links (custom social/profile links with their own uploaded icon)
-- ---------------------------------------------------------------------------
create table if not exists social_links (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  url text not null,
  icon_url text,
  sort_order int not null default 0
);

alter table social_links enable row level security;

create policy "social_links are publicly readable" on social_links
  for select using (true);

create policy "social_links are writable by authenticated users" on social_links
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ---------------------------------------------------------------------------
-- client_brands (a simple logo strip of brands/clients worked with, distinct
-- from the in-depth portfolio_brands case studies)
-- ---------------------------------------------------------------------------
create table if not exists client_brands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text not null,
  website_url text,
  sort_order int not null default 0
);

alter table client_brands enable row level security;

create policy "client_brands are publicly readable" on client_brands
  for select using (true);

create policy "client_brands are writable by authenticated users" on client_brands
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ---------------------------------------------------------------------------
-- section_backgrounds (per-section background image + opacity override;
-- falls back to profile.background_image_url/background_opacity when unset)
-- ---------------------------------------------------------------------------
create table if not exists section_backgrounds (
  section_key text primary key check (section_key in (
    'hero', 'about', 'skills', 'experience', 'education',
    'certifications', 'worked_with', 'portfolio', 'contact'
  )),
  image_url text,
  opacity numeric not null default 0.15 check (opacity between 0 and 1)
);

alter table section_backgrounds enable row level security;

create policy "section_backgrounds are publicly readable" on section_backgrounds
  for select using (true);

create policy "section_backgrounds are writable by authenticated users" on section_backgrounds
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ---------------------------------------------------------------------------
-- storage bucket for images
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('portfolio-images', 'portfolio-images', true)
on conflict (id) do nothing;

create policy "portfolio-images are publicly readable"
  on storage.objects for select
  using (bucket_id = 'portfolio-images');

create policy "portfolio-images are writable by authenticated users"
  on storage.objects for insert
  with check (bucket_id = 'portfolio-images' and auth.role() = 'authenticated');

create policy "portfolio-images are updatable by authenticated users"
  on storage.objects for update
  using (bucket_id = 'portfolio-images' and auth.role() = 'authenticated');

create policy "portfolio-images are deletable by authenticated users"
  on storage.objects for delete
  using (bucket_id = 'portfolio-images' and auth.role() = 'authenticated');

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
  bio text not null default '',
  photo_url text,
  location text,
  email text,
  phone_primary text,
  phone_secondary text,
  social_instagram text,
  social_facebook text,
  social_twitter text,
  social_linkedin text,
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
  period text not null,
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
  period text not null,
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
  sort_order int not null default 0
);

alter table certifications enable row level security;

create policy "certifications are publicly readable" on certifications
  for select using (true);

create policy "certifications are writable by authenticated users" on certifications
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ---------------------------------------------------------------------------
-- portfolio_brands / portfolio_images
-- ---------------------------------------------------------------------------
create table if not exists portfolio_brands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
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

-- 0001_initial_core_schema.sql
-- Project Waypoint
-- Initial Sprint 1 database foundation.
-- Journey supported: register -> browse trail -> scan QR -> earn passport stamp.

create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";
create extension if not exists "postgis";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.regions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  region_type text not null default 'area',
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint regions_status_check check (status in ('draft', 'published', 'archived')),
  constraint regions_region_type_check check (region_type in ('national_park', 'county', 'area', 'custom'))
);

create trigger regions_set_updated_at
before update on public.regions
for each row execute function public.set_updated_at();

create table if not exists public.trails (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  difficulty text not null default 'moderate',
  distance_km numeric(8,2),
  elevation_gain_m integer,
  estimated_duration_minutes integer,
  trail_type text not null default 'circular',
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint trails_difficulty_check check (difficulty in ('easy', 'moderate', 'hard', 'expert')),
  constraint trails_trail_type_check check (trail_type in ('circular', 'linear', 'out_and_back')),
  constraint trails_status_check check (status in ('draft', 'published', 'archived'))
);

create trigger trails_set_updated_at
before update on public.trails
for each row execute function public.set_updated_at();

create table if not exists public.trail_regions (
  id uuid primary key default gen_random_uuid(),
  trail_id uuid not null references public.trails(id) on delete cascade,
  region_id uuid not null references public.regions(id) on delete cascade,
  unique (trail_id, region_id)
);

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  home_region_id uuid references public.regions(id) on delete set null,
  bio text,
  visibility text not null default 'private',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_visibility_check check (visibility in ('public', 'private', 'limited'))
);

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null,
  created_at timestamptz not null default now(),
  unique (user_id, role),
  constraint user_roles_role_check check (role in ('walker', 'business_user', 'moderator', 'admin'))
);

create table if not exists public.passports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger passports_set_updated_at
before update on public.passports
for each row execute function public.set_updated_at();

create table if not exists public.stamp_definitions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  stamp_type text not null,
  image_url text,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint stamp_definitions_stamp_type_check check (stamp_type in ('trail', 'business', 'achievement', 'seasonal', 'event')),
  constraint stamp_definitions_status_check check (status in ('draft', 'active', 'archived'))
);

create trigger stamp_definitions_set_updated_at
before update on public.stamp_definitions
for each row execute function public.set_updated_at();

create table if not exists public.earned_stamps (
  id uuid primary key default gen_random_uuid(),
  passport_id uuid not null references public.passports(id) on delete cascade,
  stamp_definition_id uuid not null references public.stamp_definitions(id) on delete restrict,
  earned_at timestamptz not null default now(),
  source_type text not null,
  source_id uuid,
  created_at timestamptz not null default now(),
  constraint earned_stamps_source_type_check check (source_type in ('trail_completion', 'check_in', 'achievement', 'manual'))
);

create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  category text not null,
  description text,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint businesses_category_check check (category in ('cafe', 'pub', 'farm_shop', 'campsite', 'outdoor_shop', 'attraction', 'other')),
  constraint businesses_status_check check (status in ('draft', 'pending_review', 'approved', 'suspended', 'archived'))
);

create trigger businesses_set_updated_at
before update on public.businesses
for each row execute function public.set_updated_at();

create table if not exists public.business_locations (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text,
  address text,
  location geography(Point, 4326),
  opening_hours jsonb,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint business_locations_status_check check (status in ('draft', 'active', 'paused', 'archived'))
);

create trigger business_locations_set_updated_at
before update on public.business_locations
for each row execute function public.set_updated_at();

create table if not exists public.business_memberships (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'owner',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  unique (business_id, user_id),
  constraint business_memberships_role_check check (role in ('owner', 'manager', 'staff')),
  constraint business_memberships_status_check check (status in ('active', 'invited', 'removed'))
);

create table if not exists public.qr_codes (
  id uuid primary key default gen_random_uuid(),
  business_location_id uuid not null references public.business_locations(id) on delete cascade,
  code_value text not null unique,
  code_type text not null default 'static',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  expires_at timestamptz,
  constraint qr_codes_code_type_check check (code_type in ('static', 'rotating', 'campaign')),
  constraint qr_codes_status_check check (status in ('active', 'revoked', 'expired'))
);

create table if not exists public.check_ins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  business_location_id uuid not null references public.business_locations(id) on delete cascade,
  qr_code_id uuid references public.qr_codes(id) on delete set null,
  check_in_method text not null default 'qr',
  verification_status text not null default 'pending',
  checked_in_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint check_ins_method_check check (check_in_method in ('qr', 'gps', 'manual', 'offline_sync')),
  constraint check_ins_verification_status_check check (verification_status in ('pending', 'verified', 'rejected'))
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)));

  insert into public.passports (user_id)
  values (new.id);

  insert into public.user_roles (user_id, role)
  values (new.id, 'walker');

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create index if not exists idx_trails_status on public.trails(status);
create index if not exists idx_regions_status on public.regions(status);
create index if not exists idx_businesses_status on public.businesses(status);
create index if not exists idx_business_locations_business_id on public.business_locations(business_id);
create index if not exists idx_business_locations_location on public.business_locations using gist(location);
create index if not exists idx_qr_codes_code_value on public.qr_codes(code_value);
create index if not exists idx_check_ins_user_id on public.check_ins(user_id);
create index if not exists idx_check_ins_business_location_id on public.check_ins(business_location_id);
create index if not exists idx_passports_user_id on public.passports(user_id);
create index if not exists idx_earned_stamps_passport_id on public.earned_stamps(passport_id);

alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.passports enable row level security;
alter table public.stamp_definitions enable row level security;
alter table public.earned_stamps enable row level security;
alter table public.regions enable row level security;
alter table public.trails enable row level security;
alter table public.trail_regions enable row level security;
alter table public.businesses enable row level security;
alter table public.business_locations enable row level security;
alter table public.business_memberships enable row level security;
alter table public.qr_codes enable row level security;
alter table public.check_ins enable row level security;

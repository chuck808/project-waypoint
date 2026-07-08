-- 0005_steward_portal_management.sql
-- Project Waypoint
-- Adds operational place-management fields for the Steward Portal.
--
-- Principle: businesses/stewards pay for management tools, not visibility.
-- These fields are factual, walker-useful information about the place.

alter table public.business_locations
  add column if not exists welcome_message text,
  add column if not exists steward_notice text,
  add column if not exists seasonal_information text,
  add column if not exists website_url text,
  add column if not exists phone text,
  add column if not exists email text,
  add column if not exists hero_image_url text,
  add column if not exists walker_characteristics jsonb not null default '{}'::jsonb,
  add column if not exists facilities jsonb not null default '{}'::jsonb,
  add column if not exists accessibility_notes text;

comment on column public.business_locations.walker_characteristics is
  'Factual walker-friendly characteristics such as boots welcome, dogs welcome and water refill.';
comment on column public.business_locations.facilities is
  'Factual facilities such as toilets, outdoor seating, parking and bike parking.';
comment on column public.business_locations.steward_notice is
  'Current official notice shown to walkers. Intended for temporary factual updates, not advertising.';

-- Members may update factual management fields for locations belonging to
-- their own business. Status remains controlled elsewhere.
drop policy if exists "Members can update managed location details" on public.business_locations;

create policy "Members can update managed location details"
  on public.business_locations for update
  to authenticated
  using (public.is_business_member(business_id))
  with check (public.is_business_member(business_id));

-- Column grants keep the portal focused on management fields and prevent
-- accidental mutation of identity/status/provenance columns via PostgREST.
grant update (
  name,
  address,
  opening_hours,
  welcome_message,
  steward_notice,
  seasonal_information,
  website_url,
  phone,
  email,
  hero_image_url,
  walker_characteristics,
  facilities,
  accessibility_notes
) on public.business_locations to authenticated;

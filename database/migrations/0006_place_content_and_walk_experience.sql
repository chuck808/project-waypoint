-- 0006_place_content_and_walk_experience.sql
-- Project Waypoint
-- Adds richer place content fields and a lightweight walk summary view for
-- the mobile walk-completion experience. This migration is intentionally
-- additive: it does not change the existing check-in/passport model.

alter table public.business_locations
  add column if not exists walking_context text,
  add column if not exists place_story text,
  add column if not exists accessibility_notes text,
  add column if not exists best_seasons text[] not null default '{}'
    check (best_seasons <@ array['spring', 'summer', 'autumn', 'winter']::text[]),
  add column if not exists walker_characteristics jsonb not null default '{}'::jsonb,
  add column if not exists content_updated_at timestamptz not null default now();

comment on column public.business_locations.walking_context is
  'Human-readable explanation of how this place fits into a walk.';
comment on column public.business_locations.place_story is
  'Short editorial/story content for the place, if supplied by a steward.';
comment on column public.business_locations.accessibility_notes is
  'Factual accessibility guidance for walkers.';
comment on column public.business_locations.walker_characteristics is
  'Factual walker-facing characteristics such as boots_welcome, dogs_welcome, water_refill.';

-- No extended_facilities column: 0005 already added `facilities jsonb` for
-- this exact purpose. Reuse it rather than run two competing JSONB blobs
-- for the same concept.

create or replace function public.set_business_location_content_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.content_updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_business_location_content_updated_at on public.business_locations;
create trigger set_business_location_content_updated_at
  before update of walking_context, place_story, accessibility_notes, best_seasons, walker_characteristics, facilities
  on public.business_locations
  for each row
  execute function public.set_business_location_content_updated_at();

-- Business members may already write walker_characteristics/facilities/
-- accessibility_notes per 0005's column grant; extend it to the new
-- content fields so a future Portal form can save them. content_updated_at
-- is trigger-managed and deliberately excluded, same as updated_at in 0005.
grant update (
  walking_context,
  place_story,
  best_seasons
) on public.business_locations to authenticated;

create or replace view public.walk_experience_check_ins
with (security_invoker = true) as
select
  ci.id as check_in_id,
  ci.user_id,
  ci.trail_id,
  ci.business_location_id,
  ci.checked_in_at,
  bl.name as place_name,
  b.name as business_name,
  b.category,
  bl.welcome_message,
  bl.walking_context,
  bl.walker_characteristics,
  bl.facilities
from public.check_ins ci
join public.business_locations bl on bl.id = ci.business_location_id
join public.businesses b on b.id = bl.business_id
where ci.verification_status <> 'rejected';

comment on view public.walk_experience_check_ins is
  'Read model for mobile walk completion summaries. security_invoker ensures the underlying check_ins RLS policy (scoped to auth.uid()) applies to the caller, not the view owner.';

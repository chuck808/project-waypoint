-- 0013_points_of_interest.sql
-- Project Waypoint
-- BP007 defines Point of Interest ("a viewpoint, waterfall, historical
-- site, honesty box, picnic spot, or landmark") as a domain concept
-- distinct from Business, but it had zero schema until now. This gives
-- GPX-imported waypoints (and manually-created ones) somewhere to
-- live. Informational only this pass -- no owner, no claiming; that's
-- a separate later decision, same as trail import shipped route
-- geometry only with waypoint-to-business explicitly deferred.

create table if not exists public.points_of_interest (
  id uuid primary key default gen_random_uuid(),
  trail_id uuid references public.trails(id) on delete set null,
  name text not null,
  description text,
  category text not null default 'landmark' check (category in (
    'viewpoint', 'waterfall', 'historical_site', 'honesty_box',
    'picnic_spot', 'landmark', 'other'
  )),
  location geography(Point, 4326) not null,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  source text not null default 'manual' check (source in ('manual', 'gpx_import')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger points_of_interest_set_updated_at
before update on public.points_of_interest
for each row execute function public.set_updated_at();

alter table public.points_of_interest enable row level security;

-- Same four-policy shape as trails/regions (0002 read policies + 0007
-- admin write policies). No delete policy -- status='archived' is this
-- project's retire pattern throughout, not hard delete.

create policy "Admins can read all points of interest"
  on public.points_of_interest for select
  to authenticated
  using (is_admin());

create policy "Published points of interest are readable"
  on public.points_of_interest for select
  to public
  using (status = 'published');

create policy "Admins can insert points of interest"
  on public.points_of_interest for insert
  to authenticated
  with check (is_admin());

create policy "Admins can update points of interest"
  on public.points_of_interest for update
  to authenticated
  using (is_admin())
  with check (is_admin());

-- Mirrors business_location_map_points (0002) exactly -- lets the
-- admin form round-trip plain lat/lng instead of raw WKB.
-- security_invoker: re-checks the CALLING user's RLS, not the view
-- owner's, same lesson learned in migration 0006.

create or replace view public.points_of_interest_map_points
with (security_invoker = true) as
select
  id,
  trail_id,
  name,
  description,
  category,
  status,
  source,
  created_at,
  st_x(location::geometry) as longitude,
  st_y(location::geometry) as latitude
from public.points_of_interest;

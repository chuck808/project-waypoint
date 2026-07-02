-- 0001_demo_seed.sql
-- Sprint 1 demonstration seed data.

insert into public.regions (name, slug, description, region_type, status)
values (
  'Peak District',
  'peak-district',
  'A demonstration region for Sprint 1.',
  'national_park',
  'published'
)
on conflict (slug) do nothing;

insert into public.trails (
  name,
  slug,
  description,
  difficulty,
  distance_km,
  elevation_gain_m,
  estimated_duration_minutes,
  trail_type,
  status
)
values (
  'Mam Tor Circular',
  'mam-tor-circular',
  'A demonstration circular walk used to prove the first Waypoint journey.',
  'moderate',
  6.50,
  320,
  150,
  'circular',
  'published'
)
on conflict (slug) do nothing;

insert into public.trail_regions (trail_id, region_id)
select t.id, r.id
from public.trails t
join public.regions r on r.slug = 'peak-district'
where t.slug = 'mam-tor-circular'
on conflict (trail_id, region_id) do nothing;

insert into public.businesses (name, slug, category, description, status)
values (
  'The Old Barn Café',
  'the-old-barn-cafe',
  'cafe',
  'A fictional walker-friendly café used for Sprint 1 demonstration.',
  'approved'
)
on conflict (slug) do nothing;

insert into public.business_locations (
  business_id,
  name,
  address,
  location,
  opening_hours,
  status
)
select
  b.id,
  'The Old Barn Café',
  'Demo address, Peak District',
  st_setsrid(st_makepoint(-1.8170, 53.3490), 4326)::geography,
  '{"mon":"09:00-17:00","tue":"09:00-17:00","wed":"09:00-17:00","thu":"09:00-17:00","fri":"09:00-17:00","sat":"08:00-18:00","sun":"08:00-18:00"}'::jsonb,
  'active'
from public.businesses b
where b.slug = 'the-old-barn-cafe'
and not exists (
  select 1 from public.business_locations bl where bl.business_id = b.id
);

insert into public.qr_codes (business_location_id, code_value, code_type, status)
select
  bl.id,
  'demo-old-barn-cafe-static-token',
  'static',
  'active'
from public.business_locations bl
join public.businesses b on b.id = bl.business_id
where b.slug = 'the-old-barn-cafe'
on conflict (code_value) do nothing;

insert into public.stamp_definitions (title, description, stamp_type, status)
values (
  'First Local Stop',
  'Awarded for the first successful Waypoint business check-in.',
  'business',
  'active'
);

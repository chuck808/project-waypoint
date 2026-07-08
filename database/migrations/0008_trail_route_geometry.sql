-- 0008_trail_route_geometry.sql
-- Project Waypoint
-- Admin Portal GPX import (Phase 2) needs somewhere to store the parsed
-- track line. Additive and nullable -- trails without a GPX import keep
-- route = null, same as before this migration.

alter table public.trails
  add column if not exists route geography(LineString, 4326);

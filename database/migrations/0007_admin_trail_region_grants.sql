-- 0007_admin_trail_region_grants.sql
-- Project Waypoint
-- Admins already have is_admin()-gated read access to trails/regions
-- (0002) and full status-update power on businesses -- this extends the
-- same is_admin() write pattern to trails, regions and their join table,
-- so the Admin Portal can support full Trails & Regions CRUD.

create policy "Admins can insert trails"
  on public.trails for insert
  to authenticated
  with check (is_admin());

create policy "Admins can update trails"
  on public.trails for update
  to authenticated
  using (is_admin())
  with check (is_admin());

create policy "Admins can insert regions"
  on public.regions for insert
  to authenticated
  with check (is_admin());

create policy "Admins can update regions"
  on public.regions for update
  to authenticated
  using (is_admin())
  with check (is_admin());

create policy "Admins can manage trail regions"
  on public.trail_regions for all
  to authenticated
  using (is_admin())
  with check (is_admin());

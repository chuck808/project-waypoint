-- 0014_admin_delete_policies.sql
-- Project Waypoint
-- Trails, regions and points_of_interest had no DELETE policy at all --
-- status='archived' was the only retire path, and there was no way to
-- remove a genuine mistake (a stray test import, a duplicate) without
-- going to the database directly. Adds is_admin()-gated delete, same
-- pattern as every other admin write policy this project.
--
-- Cascade behaviour already in place from earlier migrations:
--   - deleting a trail cascades to trail_regions (its region links) and
--     sets points_of_interest.trail_id to null (0013) rather than
--     deleting the point of interest itself.
--   - deleting a region cascades to trail_regions only; trails are
--     untouched.

create policy "Admins can delete trails"
  on public.trails for delete
  to authenticated
  using (is_admin());

create policy "Admins can delete regions"
  on public.regions for delete
  to authenticated
  using (is_admin());

create policy "Admins can delete points of interest"
  on public.points_of_interest for delete
  to authenticated
  using (is_admin());

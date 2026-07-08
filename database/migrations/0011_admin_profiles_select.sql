-- 0011_admin_profiles_select.sql
-- Project Waypoint
-- Admins currently have zero read access to profiles -- the Admin Portal's
-- Users page (Phase 4) needs to list display names alongside roles.
-- Same is_admin()-gated read pattern as every other admin table.

create policy "Admins can read all profiles"
  on public.profiles for select
  to authenticated
  using (is_admin());

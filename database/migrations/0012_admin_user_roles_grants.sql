-- 0012_admin_user_roles_grants.sql
-- Project Waypoint
-- Deliberately its own migration, not bundled into 0011: granting or
-- revoking a role -- especially 'admin' -- is a privilege-escalation
-- surface, not a routine read/write like status flags elsewhere in this
-- project. user_roles currently has RLS enabled but zero policies at
-- all (not even self-read), which is why is_admin() has to be
-- SECURITY DEFINER to work. This adds only what the Users page (Phase 4)
-- needs: admins can read all roles and grant/revoke them. The
-- self-lockout guard (an admin can't revoke their own admin role) is
-- enforced in the Admin Portal action itself, checked against the
-- caller's own session id -- not something RLS alone can express here.

create policy "Admins can read all user roles"
  on public.user_roles for select
  to authenticated
  using (is_admin());

create policy "Admins can grant roles"
  on public.user_roles for insert
  to authenticated
  with check (is_admin());

create policy "Admins can revoke roles"
  on public.user_roles for delete
  to authenticated
  using (is_admin());

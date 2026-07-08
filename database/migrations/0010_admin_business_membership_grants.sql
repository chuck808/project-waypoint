-- 0010_admin_business_membership_grants.sql
-- Project Waypoint
-- The claims Approve action (Phase 3) upserts a business_memberships row
-- when granting a claim -- but business_memberships only had a SELECT
-- policy for members reading their own rows, no admin write access.
-- Caught live: approving a claim failed with "new row violates row-level
-- security policy for table business_memberships". Same is_admin()
-- write pattern as every other admin-gated table this project.

create policy "Admins can insert business memberships"
  on public.business_memberships for insert
  to authenticated
  with check (is_admin());

create policy "Admins can update business memberships"
  on public.business_memberships for update
  to authenticated
  using (is_admin())
  with check (is_admin());

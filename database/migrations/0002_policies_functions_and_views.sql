-- 0002_policies_functions_and_views.sql
-- Project Waypoint
-- Catches the migrations folder up to what is actually live: RLS
-- policies, helper functions, and reporting/map views were added
-- directly against the remote project and never made it into a
-- tracked migration. Reconstructed via live schema introspection
-- (pg_policies, pg_proc, pg_views, information_schema) on 2026-07-05 --
-- diffed against 0001, not a blind dump, so it only adds what 0001
-- doesn't already have.

-- ── Extensions Supabase manages on the project, not app-owned, but
--    present live and worth declaring for a faithful "create from
--    scratch" story. ──────────────────────────────────────────────
create extension if not exists "pg_stat_statements";
create extension if not exists "supabase_vault";

-- ── Helper functions used by policies below ─────────────────────────

create or replace function public.is_admin()
returns boolean
language sql
stable security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = auth.uid()
      and role = 'admin'
  );
$$;

create or replace function public.is_business_member(target_business_id uuid)
returns boolean
language sql
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.business_memberships
    where business_id = target_business_id
      and user_id = auth.uid()
      and status = 'active'
  );
$$;

-- ── Invitation token generation, used by the Business Portal to mint
--    QR codes. Crockford base32 (no I/L/O/U) over 8 random bytes;
--    256 is divisible by 32 so byte % 32 introduces no modulo bias. ──

create or replace function public.generate_invitation_token(prefix text default 'wp1')
returns text
language plpgsql
set search_path = public, extensions
as $$
declare
  alphabet constant text := '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
  raw bytea;
  payload text := '';
  i integer;
begin
  raw := extensions.gen_random_bytes(8);

  for i in 0..7 loop
    payload := payload || substr(alphabet, (get_byte(raw, i) % 32) + 1, 1);
  end loop;

  return prefix || '-' || substr(payload, 1, 4) || '-' || substr(payload, 5, 4);
end;
$$;

create or replace function public.create_location_invitation(target_location_id uuid)
returns text
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  owning_business uuid;
  existing text;
  token text;
  attempts integer := 0;
begin
  select business_id into owning_business
  from public.business_locations
  where id = target_location_id;

  if owning_business is null then
    raise exception 'Unknown location';
  end if;

  if not public.is_business_member(owning_business) then
    raise exception 'Not a member of this business';
  end if;

  select code_value into existing
  from public.qr_codes
  where business_location_id = target_location_id
    and status = 'active'
  limit 1;

  if existing is not null then
    return existing;
  end if;

  loop
    attempts := attempts + 1;
    token := public.generate_invitation_token();

    begin
      insert into public.qr_codes (business_location_id, code_value, code_type, status)
      values (target_location_id, token, 'static', 'active');
      return token;
    exception when unique_violation then
      if attempts >= 5 then
        raise exception 'Could not generate a unique invitation token';
      end if;
    end;
  end loop;
end;
$$;

-- ── A stamp title is unique on its own live, and also (redundantly)
--    unique alongside stamp_type. Both constraints exist in
--    production; kept both rather than silently dropping one. ──────

alter table public.stamp_definitions
  add constraint stamp_definitions_title_key unique (title);

alter table public.stamp_definitions
  add constraint stamp_definitions_title_type_unique unique (title, stamp_type);

-- ── check_ins.trail_id is only ever queried when present (active-walk
--    attribution); a partial index keeps it small. ──────────────────

create index if not exists idx_check_ins_trail_id
  on public.check_ins(trail_id)
  where trail_id is not null;

-- ── Reporting / map views ────────────────────────────────────────
-- security_invoker: both re-check the CALLING user's RLS and
-- is_business_member(), not the view owner's -- required for either
-- to mean anything as a per-user filter.

create or replace view public.business_location_map_points
with (security_invoker = true) as
select
  bl.id,
  bl.business_id,
  coalesce(bl.name, b.name) as name,
  b.name as business_name,
  b.category,
  st_x(bl.location::geometry) as longitude,
  st_y(bl.location::geometry) as latitude
from public.business_locations bl
join public.businesses b on b.id = bl.business_id
where bl.location is not null
  and bl.status = 'active'
  and b.status = 'approved';

create or replace view public.business_location_footfall
with (security_invoker = true) as
select
  ci.id as visit_id,
  bl.business_id,
  ci.business_location_id,
  coalesce(bl.name, b.name) as business_location_name,
  ci.checked_in_at,
  ci.check_in_method,
  ci.verification_status,
  qc.code_value as invitation_code
from public.check_ins ci
join public.business_locations bl on bl.id = ci.business_location_id
join public.businesses b on b.id = bl.business_id
left join public.qr_codes qc on qc.id = ci.qr_code_id
where ci.verification_status <> 'rejected'
  and public.is_business_member(bl.business_id);

-- ── Row Level Security policies ──────────────────────────────────
-- 0001 turned RLS on for every table; no policies were ever
-- committed alongside it, so every table has been access-denied-by
-- -default until now from a fresh migration run's point of view
-- (the live project has had these policies in place all along).

create policy "Published regions are readable"
  on public.regions for select
  to public
  using (status = 'published');

create policy "Admins can read all regions"
  on public.regions for select
  to authenticated
  using (is_admin());

create policy "Published trails are readable"
  on public.trails for select
  to public
  using (status = 'published');

create policy "Admins can read all trails"
  on public.trails for select
  to authenticated
  using (is_admin());

create policy "Trail regions are readable"
  on public.trail_regions for select
  to public
  using (true);

create policy "Users can read their own profile"
  on public.profiles for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Approved businesses are readable"
  on public.businesses for select
  to public
  using (status = 'approved');

create policy "Members can read their businesses"
  on public.businesses for select
  to authenticated
  using (is_business_member(id));

create policy "Admins can read all businesses"
  on public.businesses for select
  to authenticated
  using (is_admin());

create policy "Admins can update business status"
  on public.businesses for update
  to authenticated
  using (is_admin())
  with check (is_admin());

create policy "Active business locations are readable"
  on public.business_locations for select
  to public
  using (status = 'active');

create policy "Members can read their business locations"
  on public.business_locations for select
  to authenticated
  using (is_business_member(business_id));

create policy "Admins can read all business locations"
  on public.business_locations for select
  to authenticated
  using (is_admin());

create policy "Members can read their own memberships"
  on public.business_memberships for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Active QR codes are readable"
  on public.qr_codes for select
  to public
  using (status = 'active');

create policy "Members can read their QR codes"
  on public.qr_codes for select
  to authenticated
  using (
    business_location_id in (
      select business_locations.id
      from public.business_locations
      where is_business_member(business_locations.business_id)
    )
  );

create policy "Users can read their own check-ins"
  on public.check_ins for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can create their own check-ins"
  on public.check_ins for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Admins can audit check-ins"
  on public.check_ins for select
  to authenticated
  using (is_admin());

create policy "Users can read their own passport"
  on public.passports for select
  to public
  using (auth.uid() = user_id);

create policy "Active stamp definitions are readable"
  on public.stamp_definitions for select
  to public
  using (status = 'active');

create policy "Users can read their earned stamps"
  on public.earned_stamps for select
  to public
  using (
    passport_id in (select id from public.passports where user_id = auth.uid())
  );

create policy "Users can create earned stamps for their passport"
  on public.earned_stamps for insert
  to public
  with check (
    passport_id in (select id from public.passports where user_id = auth.uid())
  );

-- 0004_field_notes_update_policy_fix.sql
-- Project Waypoint
-- Hardens Field Notes update behaviour.
--
-- 0003 correctly prevented walkers creating steward/admin notes, but the
-- update policy did not re-check source. A walker could therefore create an
-- explorer note and then update it to source = 'steward' or 'admin'.
--
-- This migration fixes the policy and adds an immutable-field trigger so core
-- identity/provenance columns cannot be rewritten after creation.

drop policy if exists "Users can update their own field notes" on public.field_notes;

create policy "Users can update their own field notes"
  on public.field_notes for update
  to authenticated
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    and source = 'explorer'
  );

create or replace function public.prevent_field_note_identity_changes()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Admins retain the "for all" power granted by the RLS policy below:
  -- moderation may need to reassign a wrongly-attributed location/trail
  -- or correct provenance. Only non-admin (self-service) updates are
  -- locked to identity/provenance being immutable.
  if public.is_admin() then
    return new;
  end if;

  if new.user_id is distinct from old.user_id then
    raise exception 'field_notes.user_id cannot be changed';
  end if;

  if new.source is distinct from old.source then
    raise exception 'field_notes.source cannot be changed';
  end if;

  if new.check_in_id is distinct from old.check_in_id then
    raise exception 'field_notes.check_in_id cannot be changed';
  end if;

  if new.business_location_id is distinct from old.business_location_id then
    raise exception 'field_notes.business_location_id cannot be changed';
  end if;

  if new.trail_id is distinct from old.trail_id then
    raise exception 'field_notes.trail_id cannot be changed';
  end if;

  if new.observed_at is distinct from old.observed_at then
    raise exception 'field_notes.observed_at cannot be changed';
  end if;

  if new.created_at is distinct from old.created_at then
    raise exception 'field_notes.created_at cannot be changed';
  end if;

  return new;
end;
$$;

drop trigger if exists field_notes_prevent_identity_changes on public.field_notes;

create trigger field_notes_prevent_identity_changes
before update on public.field_notes
for each row execute function public.prevent_field_note_identity_changes();

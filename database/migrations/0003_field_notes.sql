-- 0003_field_notes.sql
-- Project Waypoint
-- Adds the first Living Map contribution model: structured Field Notes.
-- Field Notes are short-lived, factual observations attached to a visit,
-- place, trail, or map point. They are not reviews, comments, or ratings.

create table if not exists public.field_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  check_in_id uuid references public.check_ins(id) on delete set null,
  business_location_id uuid references public.business_locations(id) on delete cascade,
  trail_id uuid references public.trails(id) on delete cascade,
  category text not null,
  severity text not null default 'info',
  message text,
  source text not null default 'explorer',
  visibility text not null default 'public',
  observed_at timestamptz not null default now(),
  expires_at timestamptz,
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint field_notes_category_check check (
    category in (
      'mud_bog',
      'bridge_stile_gate',
      'fallen_tree',
      'livestock',
      'water',
      'weather',
      'access',
      'facilities',
      'welcome',
      'viewpoint',
      'other'
    )
  ),
  constraint field_notes_severity_check check (severity in ('info', 'watch', 'hazard')),
  constraint field_notes_source_check check (source in ('explorer', 'steward', 'admin')),
  constraint field_notes_visibility_check check (visibility in ('public', 'private')),
  constraint field_notes_anchor_check check (
    check_in_id is not null
    or business_location_id is not null
    or trail_id is not null
  )
);

create trigger field_notes_set_updated_at
before update on public.field_notes
for each row execute function public.set_updated_at();

create index if not exists idx_field_notes_business_location_id
  on public.field_notes(business_location_id)
  where visibility = 'public' and resolved_at is null;

create index if not exists idx_field_notes_trail_id
  on public.field_notes(trail_id)
  where visibility = 'public' and resolved_at is null;

create index if not exists idx_field_notes_check_in_id
  on public.field_notes(check_in_id);

create index if not exists idx_field_notes_expires_at
  on public.field_notes(expires_at)
  where expires_at is not null;

alter table public.field_notes enable row level security;

create policy "Public field notes are readable"
  on public.field_notes for select
  to public
  using (
    visibility = 'public'
    and resolved_at is null
    and (expires_at is null or expires_at > now())
  );

create policy "Users can read their private field notes"
  on public.field_notes for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can create their own field notes"
  on public.field_notes for insert
  to authenticated
  with check (
    auth.uid() = user_id
    and source = 'explorer'
  );

create policy "Users can update their own field notes"
  on public.field_notes for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Admins can manage field notes"
  on public.field_notes for all
  to authenticated
  using (is_admin())
  with check (is_admin());

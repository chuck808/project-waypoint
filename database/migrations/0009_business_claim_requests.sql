-- 0009_business_claim_requests.sql
-- Project Waypoint
-- Lets a signed-in user without any business_memberships row ask to take
-- over stewardship of an existing (GPX-imported or otherwise unclaimed)
-- business. Admin reviews and approves/rejects from the Admin Portal.

create table if not exists public.business_claim_requests (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  requester_user_id uuid not null references auth.users(id) on delete cascade,
  message text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  decided_at timestamptz
);

alter table public.business_claim_requests enable row level security;

create policy "Requesters can read their own claims"
  on public.business_claim_requests for select
  to authenticated
  using (requester_user_id = auth.uid());

create policy "Requesters can insert their own claims"
  on public.business_claim_requests for insert
  to authenticated
  with check (requester_user_id = auth.uid());

create policy "Admins can read all claims"
  on public.business_claim_requests for select
  to authenticated
  using (is_admin());

create policy "Admins can update claims"
  on public.business_claim_requests for update
  to authenticated
  using (is_admin())
  with check (is_admin());

-- Mirror of migration ALREADY APPLIED to Supabase on 27.10.2026.
-- Shadow entitlement is restricted to trusted server paths, not client metadata.
alter table public.psy_account_roles
  drop constraint if exists psy_account_roles_role_check;
alter table public.psy_account_roles
  add constraint psy_account_roles_role_check
  check (role in ('owner', 'moderator', 'shadow'));
create unique index if not exists psy_account_roles_one_shadow
  on public.psy_account_roles(role) where role='shadow';
create table if not exists public.psy_role_security_events (
  id bigint generated always as identity primary key,
  actor_id uuid references auth.users(id) on delete set null,
  target_id uuid references auth.users(id) on delete set null,
  event_type text not null check (
    event_type in ('shadow_assigned','owner_assigned','moderator_assigned','moderator_removed')
  ),
  occurred_at timestamptz not null default now()
);
alter table public.psy_role_security_events enable row level security;
revoke all on public.psy_role_security_events from public, anon, authenticated;
comment on table public.psy_role_security_events is
 'Private server-side security audit; not exposed to clients or ordinary account lists.';

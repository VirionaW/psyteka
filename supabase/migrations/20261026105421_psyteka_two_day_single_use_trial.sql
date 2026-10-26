-- Mirror of live Supabase migration 20261026105421.
-- Trial is one-time per authenticated user; database owns both timestamps.
create table if not exists public.psy_trial_access (
 user_id uuid primary key references auth.users(id) on delete cascade,
 started_at timestamptz not null default now(),
 expires_at timestamptz not null default (now() + interval '48 hours'),
 constraint psy_trial_positive check (expires_at > started_at)
);
alter table public.psy_trial_access enable row level security;
revoke all on public.psy_trial_access from public, anon, authenticated;
grant select on public.psy_trial_access to authenticated;
grant insert (user_id) on public.psy_trial_access to authenticated;
create policy psy_trial_view_own on public.psy_trial_access
 for select to authenticated using (user_id=(select auth.uid()));
create policy psy_trial_begin_once on public.psy_trial_access
 for insert to authenticated with check (user_id=(select auth.uid()));
comment on table public.psy_trial_access is
 'Однократный ознакомительный доступ на 48 часов. Участник не может менять время начала или продлевать период. Реальная защита контента требует private storage/backend, не статический сайт.';

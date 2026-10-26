-- Mirrored from live migration 20261026100943. Do not reapply to same database.
-- Pсихотека: ролевая модель. ЧЕРНОВИК для будущего Supabase проекта.
-- Не применяется автоматически. Все новые аккаунты по умолчанию = participant,
-- даже без записи в этой таблице. Только owner и moderator имеют записи.
-- Назначение ролей выполняет доверенная Edge Function с серверным ключом.
create table if not exists public.psy_account_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('owner', 'moderator')),
  granted_by uuid references auth.users(id) on delete set null,
  granted_at timestamptz not null default now()
);

-- Можно иметь только одного владельца проекта.
create unique index if not exists psy_account_roles_one_owner
  on public.psy_account_roles (role) where role = 'owner';

alter table public.psy_account_roles enable row level security;
revoke all on table public.psy_account_roles from PUBLIC, anon, authenticated;
grant select on table public.psy_account_roles to authenticated;

-- Пользователь видит только СВОЮ роль. Другие аккаунты доступны
-- исключительно через защищенную Edge Function после проверки владельца.
drop policy if exists "psy_read_own_role" on public.psy_account_roles;
create policy "psy_read_own_role"
  on public.psy_account_roles
  for select to authenticated
  using ((select auth.uid()) = user_id);



-- Профили без детских персональных данных и результатов диагностики.
create table public.psy_user_profiles (
 user_id uuid primary key references auth.users(id) on delete cascade,
 display_name text not null default '' check (char_length(display_name) <= 65),
 professional_role text not null default '' check (char_length(professional_role) <= 90),
 organization text not null default '' check (char_length(organization) <= 150),
 updated_at timestamptz not null default now()
);
create table public.psy_favorite_methods (
 user_id uuid not null references auth.users(id) on delete cascade,
 method_id text not null check (char_length(method_id) between 1 and 140),
 created_at timestamptz not null default now(),
 primary key (user_id,method_id)
);
create table public.psy_method_folders (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 name text not null check (char_length(trim(name)) between 1 and 80),
 created_at timestamptz not null default now(),
 unique(id,user_id),
 unique(user_id,name)
);
create table public.psy_folder_items (
 user_id uuid not null,
 folder_id uuid not null,
 method_id text not null,
 created_at timestamptz not null default now(),
 primary key(folder_id,method_id),
 foreign key(folder_id,user_id) references public.psy_method_folders(id,user_id) on delete cascade,
 foreign key(user_id,method_id) references public.psy_favorite_methods(user_id,method_id) on delete cascade
);
create index psy_folder_items_user_idx on public.psy_folder_items (user_id,folder_id);

alter table public.psy_user_profiles enable row level security;
alter table public.psy_favorite_methods enable row level security;
alter table public.psy_method_folders enable row level security;
alter table public.psy_folder_items enable row level security;

revoke all on public.psy_user_profiles,public.psy_favorite_methods,public.psy_method_folders,public.psy_folder_items from public,anon,authenticated;
grant select,insert,update,delete on public.psy_user_profiles,public.psy_favorite_methods,public.psy_method_folders,public.psy_folder_items to authenticated;

create policy psy_profile_select on public.psy_user_profiles for select to authenticated using(user_id=(select auth.uid()));
create policy psy_profile_insert on public.psy_user_profiles for insert to authenticated with check(user_id=(select auth.uid()));
create policy psy_profile_update on public.psy_user_profiles for update to authenticated using(user_id=(select auth.uid())) with check(user_id=(select auth.uid()));
create policy psy_profile_delete on public.psy_user_profiles for delete to authenticated using(user_id=(select auth.uid()));
create policy psy_favorite_select on public.psy_favorite_methods for select to authenticated using(user_id=(select auth.uid()));
create policy psy_favorite_insert on public.psy_favorite_methods for insert to authenticated with check(user_id=(select auth.uid()));
create policy psy_favorite_delete on public.psy_favorite_methods for delete to authenticated using(user_id=(select auth.uid()));
create policy psy_folder_select on public.psy_method_folders for select to authenticated using(user_id=(select auth.uid()));
create policy psy_folder_insert on public.psy_method_folders for insert to authenticated with check(user_id=(select auth.uid()));
create policy psy_folder_update on public.psy_method_folders for update to authenticated using(user_id=(select auth.uid())) with check(user_id=(select auth.uid()));
create policy psy_folder_delete on public.psy_method_folders for delete to authenticated using(user_id=(select auth.uid()));
create policy psy_folder_item_select on public.psy_folder_items for select to authenticated using(user_id=(select auth.uid()));
create policy psy_folder_item_insert on public.psy_folder_items for insert to authenticated with check(user_id=(select auth.uid()));
create policy psy_folder_item_delete on public.psy_folder_items for delete to authenticated using(user_id=(select auth.uid()));

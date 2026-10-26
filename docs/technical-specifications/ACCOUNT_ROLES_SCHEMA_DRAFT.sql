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

-- Ни INSERT, ни UPDATE, ни DELETE не разрешены клиентской роли.
-- Никаких политик с записью для authenticated создавать не следует.
-- Роль владельца необходимо назначить вручную в SQL Editor только после
-- подтверждения адреса владельца и проверки auth.users.id.
--
-- Пример ДЛЯ АДМИНИСТРАТОРА, выполнять отдельно после проверки ID:
-- insert into public.psy_account_roles(user_id, role)
-- values ('ПРОВЕРЕННЫЙ_UUID_ВЛАДЕЛЬЦА', 'owner');

-- Live Supabase migration: 20261027070058 psyteka_payment_orders_and_entitlements
-- Financial orders and entitlements are written ONLY by trusted server keys.
create table if not exists public.psy_payment_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan text not null check (plan in ('specialist','organization')),
  provider text not null default 'yookassa' check (provider = 'yookassa'),
  amount_kopecks integer not null check (amount_kopecks > 0),
  currency text not null default 'RUB' check (currency = 'RUB'),
  provider_payment_id text unique,
  status text not null default 'pending' check (status in ('pending','succeeded','canceled','refunded')),
  created_at timestamptz not null default now(),
  paid_at timestamptz,
  updated_at timestamptz not null default now()
);
create index if not exists psy_payment_orders_user_created_idx on public.psy_payment_orders(user_id,created_at desc);
create table if not exists public.psy_paid_access (
  user_id uuid primary key references auth.users(id) on delete cascade,
  plan text not null check (plan in ('specialist','organization')),
  expires_at timestamptz not null,
  last_order_id uuid not null references public.psy_payment_orders(id),
  updated_at timestamptz not null default now()
);
alter table public.psy_payment_orders enable row level security;
alter table public.psy_paid_access enable row level security;
revoke all on public.psy_payment_orders from public,anon,authenticated;
revoke all on public.psy_paid_access from public,anon,authenticated;
grant select on public.psy_payment_orders to authenticated;
grant select on public.psy_paid_access to authenticated;
drop policy if exists psy_orders_read_own on public.psy_payment_orders;
create policy psy_orders_read_own on public.psy_payment_orders for select to authenticated
 using ((select auth.uid()) = user_id);
drop policy if exists psy_paid_read_own on public.psy_paid_access;
create policy psy_paid_read_own on public.psy_paid_access for select to authenticated
 using ((select auth.uid()) = user_id);
create or replace function public.psy_settle_payment(p_order_id uuid,p_payment_id text,p_amount_kopecks integer)
returns void language plpgsql security definer set search_path = ''
as $$
declare v_order public.psy_payment_orders%rowtype;
begin
 select * into v_order from public.psy_payment_orders where id = p_order_id for update;
 if not found then raise exception 'Unknown order'; end if;
 if v_order.provider_payment_id is distinct from p_payment_id
    or v_order.amount_kopecks <> p_amount_kopecks or v_order.currency <> 'RUB'
    then raise exception 'Provider payment does not match order'; end if;
 if v_order.status = 'succeeded' then return; end if;
 if v_order.status <> 'pending' then raise exception 'Order cannot be settled'; end if;
 perform pg_advisory_xact_lock(hashtextextended(v_order.user_id::text,0));
 insert into public.psy_paid_access(user_id,plan,expires_at,last_order_id,updated_at)
 values(v_order.user_id,v_order.plan,now()+interval '1 month',v_order.id,now())
 on conflict(user_id) do update set
 plan=excluded.plan,expires_at=greatest(now(),public.psy_paid_access.expires_at)+interval '1 month',
 last_order_id=excluded.last_order_id,updated_at=now();
 update public.psy_payment_orders set status='succeeded',paid_at=now(),updated_at=now() where id=p_order_id;
end;
$$;
revoke all on function public.psy_settle_payment(uuid,text,integer) from public,anon,authenticated;
grant execute on function public.psy_settle_payment(uuid,text,integer) to service_role;
comment on table public.psy_payment_orders is
 'Provider orders; only server service role inserts or modifies. No card data is stored.';
comment on table public.psy_paid_access is
 'Server-confirmed monthly entitlements; private content delivery is required before going live.';

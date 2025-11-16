create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  mercadopago_payment_id bigint unique,
  external_reference text,
  status text not null,
  total numeric not null,
  currency text not null,
  payment_data jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.orders enable row level security;

drop trigger if exists trg_orders_updated_at on public.orders;
create trigger trg_orders_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

create index if not exists idx_orders_mercadopago_payment_id on public.orders(mercadopago_payment_id);
create index if not exists idx_orders_external_reference on public.orders(external_reference);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_orders_created_at on public.orders(created_at);


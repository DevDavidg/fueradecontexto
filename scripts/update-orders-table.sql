alter table public.orders
add column if not exists items jsonb default '[]'::jsonb,
add column if not exists customer_email text,
add column if not exists customer_name text;

create index if not exists idx_orders_customer_email on public.orders(customer_email);

drop policy if exists "Admin can view all orders" on public.orders;
create policy "Admin can view all orders"
on public.orders
for select
to authenticated
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);

drop policy if exists "System can insert orders" on public.orders;
create policy "System can insert orders"
on public.orders
for insert
to authenticated
with check (true);


-- Profiles table to store additional user information and roles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text,
  phone text,
  role text not null default 'user',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

-- Keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'fullName', null), coalesce(new.raw_user_meta_data->>'role','user'))
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- RLS policies: users can read their own, admins can read all
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'profiles' and policyname = 'Allow individual read'
  ) then
    create policy "Allow individual read" on public.profiles
      for select using (auth.uid() = id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'profiles' and policyname = 'Allow self update'
  ) then
    create policy "Allow self update" on public.profiles
      for update using (auth.uid() = id) with check (auth.uid() = id);
  end if;
end$$;

-- Optional: admin read-all/write-all via service role (no extra policy needed)

-- =============================================
-- PRODUCTS SCHEMA
-- =============================================

-- Categories table
create table if not exists public.categories (
  id text primary key,
  name text not null,
  description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Products table
create table if not exists public.products (
  id text primary key,
  nombre text not null,
  categoria text not null references public.categories(id),
  descripcion text not null,
  precio_normal integer not null,
  precio_transferencia integer not null,
  metodos_pago text[] not null default '{}',
  envio_metodo text not null,
  envio_codigo_postal text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Product colors table
create table if not exists public.product_colors (
  id uuid primary key default gen_random_uuid(),
  product_id text not null references public.products(id) on delete cascade,
  nombre text not null,
  hex text not null,
  created_at timestamptz default now()
);

-- Product sizes table
create table if not exists public.product_sizes (
  id uuid primary key default gen_random_uuid(),
  product_id text not null references public.products(id) on delete cascade,
  size text not null,
  created_at timestamptz default now(),
  unique(product_id, size)
);

-- Product images table
create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id text not null references public.products(id) on delete cascade,
  color text not null,
  url text not null,
  created_at timestamptz default now()
);

-- Product print sizes table (tamaño_estampa)
create table if not exists public.product_print_sizes (
  id uuid primary key default gen_random_uuid(),
  product_id text not null references public.products(id) on delete cascade,
  size_key text not null, -- hasta_15cm, hasta_20x30cm, etc.
  price integer not null,
  created_at timestamptz default now(),
  unique(product_id, size_key)
);

-- Product stock table
create table if not exists public.product_stock (
  id uuid primary key default gen_random_uuid(),
  product_id text not null references public.products(id) on delete cascade,
  color text not null,
  size text not null,
  quantity integer not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(product_id, color, size)
);

-- Enable RLS on all tables
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_colors enable row level security;
alter table public.product_sizes enable row level security;
alter table public.product_images enable row level security;
alter table public.product_print_sizes enable row level security;
alter table public.product_stock enable row level security;

-- Create triggers for updated_at
drop trigger if exists trg_products_updated_at on public.products;
create trigger trg_products_updated_at
before update on public.products
for each row execute function public.set_updated_at();

drop trigger if exists trg_product_stock_updated_at on public.product_stock;
create trigger trg_product_stock_updated_at
before update on public.product_stock
for each row execute function public.set_updated_at();

-- RLS Policies for public read access
do $$
begin
  -- Categories policies
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'categories' and policyname = 'Allow public read'
  ) then
    create policy "Allow public read" on public.categories
      for select using (true);
  end if;

  -- Products policies
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'products' and policyname = 'Allow public read'
  ) then
    create policy "Allow public read" on public.products
      for select using (true);
  end if;

  -- Product colors policies
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'product_colors' and policyname = 'Allow public read'
  ) then
    create policy "Allow public read" on public.product_colors
      for select using (true);
  end if;

  -- Product sizes policies
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'product_sizes' and policyname = 'Allow public read'
  ) then
    create policy "Allow public read" on public.product_sizes
      for select using (true);
  end if;

  -- Product images policies
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'product_images' and policyname = 'Allow public read'
  ) then
    create policy "Allow public read" on public.product_images
      for select using (true);
  end if;

  -- Product print sizes policies
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'product_print_sizes' and policyname = 'Allow public read'
  ) then
    create policy "Allow public read" on public.product_print_sizes
      for select using (true);
  end if;

  -- Product stock policies
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'product_stock' and policyname = 'Allow public read'
  ) then
    create policy "Allow public read" on public.product_stock
      for select using (true);
  end if;
end$$;

-- Insert default categories
insert into public.categories (id, name, description) values
  ('buzos', 'Buzos', 'Buzos y hoodies premium'),
  ('camperas', 'Camperas', 'Camperas y abrigos'),
  ('gorras', 'Gorras', 'Gorras y accesorios para la cabeza'),
  ('totebags', 'Tote Bags', 'Bolsos y accesorios'),
  ('remeras', 'Remeras', 'Remeras y camisetas premium')
on conflict (id) do nothing;

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Products indexes
create index if not exists idx_products_categoria on public.products(categoria);
create index if not exists idx_products_created_at on public.products(created_at);

-- Product colors indexes
create index if not exists idx_product_colors_product_id on public.product_colors(product_id);

-- Product sizes indexes
create index if not exists idx_product_sizes_product_id on public.product_sizes(product_id);

-- Product images indexes
create index if not exists idx_product_images_product_id on public.product_images(product_id);
create index if not exists idx_product_images_color on public.product_images(color);

-- Product print sizes indexes
create index if not exists idx_product_print_sizes_product_id on public.product_print_sizes(product_id);

-- Product stock indexes
create index if not exists idx_product_stock_product_id on public.product_stock(product_id);
create index if not exists idx_product_stock_color on public.product_stock(color);
create index if not exists idx_product_stock_size on public.product_stock(size);
create index if not exists idx_product_stock_quantity on public.product_stock(quantity);



-- Fix RLS policies for product tables to allow admin operations
-- This script adds the missing INSERT, UPDATE, DELETE policies for admin users

-- =============================================
-- ADMIN POLICIES FOR PRODUCT TABLES
-- =============================================

-- Drop existing policies if they exist (to avoid conflicts)
drop policy if exists "Allow admin all operations" on public.categories;
drop policy if exists "Allow admin all operations" on public.products;
drop policy if exists "Allow admin all operations" on public.product_colors;
drop policy if exists "Allow admin all operations" on public.product_sizes;
drop policy if exists "Allow admin all operations" on public.product_images;
drop policy if exists "Allow admin all operations" on public.product_print_sizes;
drop policy if exists "Allow admin all operations" on public.product_stock;

-- Create admin policies for all product-related tables
do $$
begin
  -- Categories admin policies
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'categories' and policyname = 'Allow admin all operations'
  ) then
    create policy "Allow admin all operations" on public.categories
      for all using (
        exists (
          select 1 from public.profiles 
          where id = auth.uid() and role = 'admin'
        )
      ) with check (
        exists (
          select 1 from public.profiles 
          where id = auth.uid() and role = 'admin'
        )
      );
  end if;

  -- Products admin policies
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'products' and policyname = 'Allow admin all operations'
  ) then
    create policy "Allow admin all operations" on public.products
      for all using (
        exists (
          select 1 from public.profiles 
          where id = auth.uid() and role = 'admin'
        )
      ) with check (
        exists (
          select 1 from public.profiles 
          where id = auth.uid() and role = 'admin'
        )
      );
  end if;

  -- Product colors admin policies
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'product_colors' and policyname = 'Allow admin all operations'
  ) then
    create policy "Allow admin all operations" on public.product_colors
      for all using (
        exists (
          select 1 from public.profiles 
          where id = auth.uid() and role = 'admin'
        )
      ) with check (
        exists (
          select 1 from public.profiles 
          where id = auth.uid() and role = 'admin'
        )
      );
  end if;

  -- Product sizes admin policies
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'product_sizes' and policyname = 'Allow admin all operations'
  ) then
    create policy "Allow admin all operations" on public.product_sizes
      for all using (
        exists (
          select 1 from public.profiles 
          where id = auth.uid() and role = 'admin'
        )
      ) with check (
        exists (
          select 1 from public.profiles 
          where id = auth.uid() and role = 'admin'
        )
      );
  end if;

  -- Product images admin policies
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'product_images' and policyname = 'Allow admin all operations'
  ) then
    create policy "Allow admin all operations" on public.product_images
      for all using (
        exists (
          select 1 from public.profiles 
          where id = auth.uid() and role = 'admin'
        )
      ) with check (
        exists (
          select 1 from public.profiles 
          where id = auth.uid() and role = 'admin'
        )
      );
  end if;

  -- Product print sizes admin policies
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'product_print_sizes' and policyname = 'Allow admin all operations'
  ) then
    create policy "Allow admin all operations" on public.product_print_sizes
      for all using (
        exists (
          select 1 from public.profiles 
          where id = auth.uid() and role = 'admin'
        )
      ) with check (
        exists (
          select 1 from public.profiles 
          where id = auth.uid() and role = 'admin'
        )
      );
  end if;

  -- Product stock admin policies
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'product_stock' and policyname = 'Allow admin all operations'
  ) then
    create policy "Allow admin all operations" on public.product_stock
      for all using (
        exists (
          select 1 from public.profiles 
          where id = auth.uid() and role = 'admin'
        )
      ) with check (
        exists (
          select 1 from public.profiles 
          where id = auth.uid() and role = 'admin'
        )
      );
  end if;
end$$;

-- Verify policies were created
select 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
from pg_policies 
where schemaname = 'public' 
  and tablename in ('categories', 'products', 'product_colors', 'product_sizes', 'product_images', 'product_print_sizes', 'product_stock')
order by tablename, policyname;

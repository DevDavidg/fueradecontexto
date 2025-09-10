-- Fix admin policies for profiles table
-- This script adds policies to allow admins to access their own profile
-- WITHOUT causing infinite recursion

-- Drop ALL existing policies first
drop policy if exists "Allow individual read" on public.profiles;
drop policy if exists "Allow self update" on public.profiles;
drop policy if exists "Allow admin read all" on public.profiles;
drop policy if exists "Allow admin update all" on public.profiles;
drop policy if exists "Allow admin insert" on public.profiles;
drop policy if exists "Allow admin delete" on public.profiles;

-- Drop any existing is_admin function first
drop function if exists public.is_admin(uuid);
drop function if exists public.is_admin();

-- Create a simple function to check if user is admin
-- This avoids recursion by using a different approach
create or replace function public.is_admin(user_id uuid)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.profiles 
    where id = user_id 
    and role = 'admin'
  );
$$;

-- Create simple policies that don't cause recursion
-- Policy 1: Users can read their own profile
create policy "Users can read own profile" on public.profiles
  for select using (auth.uid() = id);

-- Policy 2: Users can update their own profile
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- Policy 3: Admins can read all profiles (using the function)
create policy "Admins can read all profiles" on public.profiles
  for select using (public.is_admin(auth.uid()));

-- Policy 4: Admins can update all profiles (using the function)
create policy "Admins can update all profiles" on public.profiles
  for update using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- Policy 5: Admins can insert profiles (using the function)
create policy "Admins can insert profiles" on public.profiles
  for insert with check (public.is_admin(auth.uid()));

-- Policy 6: Admins can delete profiles (using the function)
create policy "Admins can delete profiles" on public.profiles
  for delete using (public.is_admin(auth.uid()));

-- Alternative approach: If the function still causes issues, 
-- we can use a simpler approach by temporarily disabling RLS for admins
-- or using a different table structure

-- Grant necessary permissions
grant execute on function public.is_admin(uuid) to authenticated;
grant execute on function public.is_admin(uuid) to anon;

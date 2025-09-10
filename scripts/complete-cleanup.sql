-- Complete cleanup script that removes all dependencies
-- This script removes all policies and functions that might cause conflicts

-- Drop ALL policies from profiles table
drop policy if exists "Allow individual read" on public.profiles;
drop policy if exists "Allow self update" on public.profiles;
drop policy if exists "Allow admin read all" on public.profiles;
drop policy if exists "Allow admin update all" on public.profiles;
drop policy if exists "Allow admin insert" on public.profiles;
drop policy if exists "Allow admin delete" on public.profiles;
drop policy if exists "Users can read own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Admins can read all profiles" on public.profiles;
drop policy if exists "Admins can update all profiles" on public.profiles;
drop policy if exists "Admins can insert profiles" on public.profiles;
drop policy if exists "Admins can delete profiles" on public.profiles;

-- Drop ALL policies from sections table that depend on is_admin function
drop policy if exists "Admins select sections" on public.sections;
drop policy if exists "Admins insert sections" on public.sections;
drop policy if exists "Admins update sections" on public.sections;
drop policy if exists "Admins delete sections" on public.sections;

-- Drop the is_admin function with CASCADE to remove all dependencies
drop function if exists public.is_admin(uuid) cascade;
drop function if exists public.is_admin() cascade;

-- Create simple policies for profiles table
-- Policy 1: All authenticated users can read profiles
create policy "Authenticated users can read profiles" on public.profiles
  for select using (auth.role() = 'authenticated');

-- Policy 2: Users can only update their own profile
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- Policy 3: Allow profile creation (for new user signup)
create policy "Allow profile creation" on public.profiles
  for insert with check (auth.uid() = id);

-- Create simple policies for sections table
-- Policy 1: All authenticated users can read sections
create policy "Authenticated users can read sections" on public.sections
  for select using (auth.role() = 'authenticated');

-- Policy 2: All authenticated users can insert sections
create policy "Authenticated users can insert sections" on public.sections
  for insert with check (auth.role() = 'authenticated');

-- Policy 3: All authenticated users can update sections
create policy "Authenticated users can update sections" on public.sections
  for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Policy 4: All authenticated users can delete sections
create policy "Authenticated users can delete sections" on public.sections
  for delete using (auth.role() = 'authenticated');

-- Note: These policies are less secure but avoid recursion issues
-- Admin verification will be handled at the application level

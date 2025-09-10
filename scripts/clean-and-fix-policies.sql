-- Complete cleanup and simple fix for admin policies
-- This script removes all problematic policies and creates simple ones

-- Drop ALL existing policies
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

-- Drop any existing functions
drop function if exists public.is_admin(uuid);
drop function if exists public.is_admin();

-- Create simple policies that avoid recursion completely
-- Policy 1: All authenticated users can read profiles
create policy "Authenticated users can read profiles" on public.profiles
  for select using (auth.role() = 'authenticated');

-- Policy 2: Users can only update their own profile
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- Policy 3: Allow profile creation (for new user signup)
create policy "Allow profile creation" on public.profiles
  for insert with check (auth.uid() = id);

-- Note: This approach is less secure but avoids recursion issues
-- Admin verification will be handled at the application level

-- Simple fix for admin policies without recursion
-- This approach temporarily disables RLS for admin operations

-- Drop ALL existing policies first
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

-- Drop the function if it exists
drop function if exists public.is_admin(uuid);

-- Create a simple approach: Allow all authenticated users to read/update profiles
-- This is less secure but avoids recursion issues
-- In production, you might want to use a different approach

-- Policy 1: All authenticated users can read profiles
create policy "Authenticated users can read profiles" on public.profiles
  for select using (auth.role() = 'authenticated');

-- Policy 2: Users can only update their own profile
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- Policy 3: Allow profile creation (for new user signup)
create policy "Allow profile creation" on public.profiles
  for insert with check (auth.uid() = id);

-- Note: This approach is less secure but avoids recursion
-- For better security, consider:
-- 1. Using a separate admin table
-- 2. Using Supabase's built-in admin functions
-- 3. Implementing admin checks at the application level

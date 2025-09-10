-- Temporarily disable RLS for products table to allow stock updates
-- This is a temporary solution while we fix the RLS policies

-- Option 1: Disable RLS completely (NOT RECOMMENDED for production)
-- ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;

-- Option 2: Create a more permissive policy for stock updates
-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Allow authenticated users to update stock" ON public.products;
DROP POLICY IF EXISTS "Allow admins to update stock" ON public.products;

-- Create a very permissive policy for stock updates
CREATE POLICY "Allow stock updates" 
ON public.products FOR UPDATE 
USING (true)
WITH CHECK (true);

-- Ensure public read access
DROP POLICY IF EXISTS "Allow public read access to products" ON public.products;
CREATE POLICY "Allow public read access to products" 
ON public.products FOR SELECT 
USING (true);

-- Verify the policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'products';

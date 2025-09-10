-- Temporarily disable RLS for products table to allow stock updates
-- This is a temporary solution while we debug the RLS policies

-- Disable RLS completely for products table
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'products';

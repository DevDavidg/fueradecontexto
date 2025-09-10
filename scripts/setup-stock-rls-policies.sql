-- Enable RLS on products table if not already enabled
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated users to update stock" ON public.products;
DROP POLICY IF EXISTS "Allow admins to update stock" ON public.products;
DROP POLICY IF EXISTS "Allow public read access to products" ON public.products;

-- Create policy to allow authenticated users to update stock
-- This policy allows any authenticated user to update the stock field
CREATE POLICY "Allow authenticated users to update stock" 
ON public.products FOR UPDATE 
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Alternative: More restrictive policy that only allows admins
-- Uncomment the following lines and comment out the above policy if you want admin-only updates
/*
DROP POLICY IF EXISTS "Allow authenticated users to update stock" ON public.products;

CREATE POLICY "Allow admins to update stock" 
ON public.products FOR UPDATE 
USING (
  auth.role() = 'authenticated' AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
)
WITH CHECK (
  auth.role() = 'authenticated' AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);
*/

-- Ensure public read access to products
CREATE POLICY "Allow public read access to products" 
ON public.products FOR SELECT 
USING (true);

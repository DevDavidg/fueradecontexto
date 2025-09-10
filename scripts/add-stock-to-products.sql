-- Add stock field to products table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS stock integer NOT NULL DEFAULT 0;

-- Update existing products with some stock
UPDATE public.products 
SET stock = 10 
WHERE stock = 0;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_products_stock ON public.products(stock);

-- Add RLS policy for stock field
-- Allow public read access to stock
CREATE POLICY IF NOT EXISTS "Allow public read access to products stock" 
ON public.products FOR SELECT 
USING (true);

-- Allow authenticated users to update stock (for admin)
CREATE POLICY IF NOT EXISTS "Allow authenticated users to update products stock" 
ON public.products FOR UPDATE 
USING (auth.role() = 'authenticated');

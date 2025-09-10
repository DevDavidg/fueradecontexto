-- Add stock field to products table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' 
        AND column_name = 'stock'
    ) THEN
        ALTER TABLE public.products ADD COLUMN stock integer NOT NULL DEFAULT 10;
    END IF;
END $$;

-- Update existing products with stock if they have 0 stock
UPDATE public.products 
SET stock = 10 
WHERE stock = 0 OR stock IS NULL;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_products_stock ON public.products(stock);

-- Add RLS policy for stock field if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'products' 
        AND policyname = 'Allow public read access to products stock'
    ) THEN
        CREATE POLICY "Allow public read access to products stock" 
        ON public.products FOR SELECT 
        USING (true);
    END IF;
END $$;

-- Allow authenticated users to update stock (for admin)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'products' 
        AND policyname = 'Allow authenticated users to update products stock'
    ) THEN
        CREATE POLICY "Allow authenticated users to update products stock" 
        ON public.products FOR UPDATE 
        USING (auth.role() = 'authenticated');
    END IF;
END $$;

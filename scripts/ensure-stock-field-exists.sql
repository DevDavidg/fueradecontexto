-- Check if stock column exists in products table
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'products' 
AND column_name = 'stock';

-- Add stock column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' 
        AND column_name = 'stock'
    ) THEN
        ALTER TABLE public.products ADD COLUMN stock integer NOT NULL DEFAULT 10;
        RAISE NOTICE 'Stock column added to products table';
    ELSE
        RAISE NOTICE 'Stock column already exists in products table';
    END IF;
END $$;

-- Update existing products with stock if they have NULL or 0 stock
UPDATE public.products 
SET stock = 10 
WHERE stock IS NULL OR stock = 0;

-- Verify the column was added/updated
SELECT id, nombre, stock FROM public.products LIMIT 5;

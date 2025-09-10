-- Simple fix for product RLS policies
-- Allow admins to perform all operations on product tables

-- Enable RLS on product tables (if not already enabled)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_colors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_print_sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_stock ENABLE ROW LEVEL SECURITY;

-- Drop existing admin policies if they exist
DROP POLICY IF EXISTS "Allow admin all operations" ON public.categories;
DROP POLICY IF EXISTS "Allow admin all operations" ON public.products;
DROP POLICY IF EXISTS "Allow admin all operations" ON public.product_colors;
DROP POLICY IF EXISTS "Allow admin all operations" ON public.product_sizes;
DROP POLICY IF EXISTS "Allow admin all operations" ON public.product_images;
DROP POLICY IF EXISTS "Allow admin all operations" ON public.product_print_sizes;
DROP POLICY IF EXISTS "Allow admin all operations" ON public.product_stock;

-- Create admin policies for all operations
CREATE POLICY "Allow admin all operations" ON public.categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Allow admin all operations" ON public.products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Allow admin all operations" ON public.product_colors
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Allow admin all operations" ON public.product_sizes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Allow admin all operations" ON public.product_images
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Allow admin all operations" ON public.product_print_sizes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Allow admin all operations" ON public.product_stock
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

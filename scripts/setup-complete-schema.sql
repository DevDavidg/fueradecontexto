-- =============================================
-- SCRIPT COMPLETO PARA CONFIGURAR TODA LA BASE DE DATOS
-- =============================================
-- Este script configura toda la estructura de la base de datos
-- incluyendo las nuevas funcionalidades de estampas

-- Función para updated_at (si no existe)
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger AS $$
BEGIN
  new.updated_at = now();
  return new;
END;
$$ language plpgsql;

-- =============================================
-- TABLAS PRINCIPALES
-- =============================================

-- Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  phone text,
  role text NOT NULL DEFAULT 'user',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Products table
CREATE TABLE IF NOT EXISTS public.products (
  id text PRIMARY KEY,
  nombre text NOT NULL,
  categoria text NOT NULL REFERENCES public.categories(id),
  descripcion text NOT NULL,
  precio_normal integer NOT NULL,
  precio_transferencia integer NOT NULL,
  metodos_pago text[] NOT NULL DEFAULT '{}',
  envio_metodo text NOT NULL,
  envio_codigo_postal text NOT NULL,
  stock integer NOT NULL DEFAULT 10,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Product colors table
CREATE TABLE IF NOT EXISTS public.product_colors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id text NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  nombre text NOT NULL,
  hex text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Product sizes table
CREATE TABLE IF NOT EXISTS public.product_sizes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id text NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  size text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(product_id, size)
);

-- Product images table
CREATE TABLE IF NOT EXISTS public.product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id text NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  color text NOT NULL,
  url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Product print sizes table
CREATE TABLE IF NOT EXISTS public.product_print_sizes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id text NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  size_key text NOT NULL,
  price integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(product_id, size_key)
);

-- Product stock table
CREATE TABLE IF NOT EXISTS public.product_stock (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id text NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  color text NOT NULL,
  size text NOT NULL,
  quantity integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(product_id, color, size)
);

-- =============================================
-- NUEVAS TABLAS PARA ESTAMPAS
-- =============================================

-- Crear tabla de opciones de estampas (stamp_options)
CREATE TABLE IF NOT EXISTS public.stamp_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  placement text NOT NULL CHECK (placement IN ('front', 'back', 'front_back')),
  size_id text NOT NULL CHECK (size_id IN ('hasta_15cm', 'hasta_20x30cm', 'hasta_30x40cm')),
  label text NOT NULL,
  extra_cost integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(placement, size_id)
);

-- Crear tabla de relación entre productos y opciones de estampas
CREATE TABLE IF NOT EXISTS public.product_stamp_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id text NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  stamp_option_id uuid NOT NULL REFERENCES public.stamp_options(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(product_id, stamp_option_id)
);

-- =============================================
-- HABILITAR RLS EN TODAS LAS TABLAS
-- =============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_colors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_print_sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_stock ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stamp_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_stamp_options ENABLE ROW LEVEL SECURITY;

-- =============================================
-- CREAR TRIGGERS PARA UPDATED_AT
-- =============================================

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_products_updated_at ON public.products;
CREATE TRIGGER trg_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_product_stock_updated_at ON public.product_stock;
CREATE TRIGGER trg_product_stock_updated_at
BEFORE UPDATE ON public.product_stock
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_stamp_options_updated_at ON public.stamp_options;
CREATE TRIGGER trg_stamp_options_updated_at
BEFORE UPDATE ON public.stamp_options
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =============================================
-- POLÍTICAS RLS PARA LECTURA PÚBLICA
-- =============================================

-- Categories policies
DROP POLICY IF EXISTS "Allow public read" ON public.categories;
CREATE POLICY "Allow public read" ON public.categories FOR SELECT USING (true);

-- Products policies
DROP POLICY IF EXISTS "Allow public read" ON public.products;
CREATE POLICY "Allow public read" ON public.products FOR SELECT USING (true);

-- Product colors policies
DROP POLICY IF EXISTS "Allow public read" ON public.product_colors;
CREATE POLICY "Allow public read" ON public.product_colors FOR SELECT USING (true);

-- Product sizes policies
DROP POLICY IF EXISTS "Allow public read" ON public.product_sizes;
CREATE POLICY "Allow public read" ON public.product_sizes FOR SELECT USING (true);

-- Product images policies
DROP POLICY IF EXISTS "Allow public read" ON public.product_images;
CREATE POLICY "Allow public read" ON public.product_images FOR SELECT USING (true);

-- Product print sizes policies
DROP POLICY IF EXISTS "Allow public read" ON public.product_print_sizes;
CREATE POLICY "Allow public read" ON public.product_print_sizes FOR SELECT USING (true);

-- Product stock policies
DROP POLICY IF EXISTS "Allow public read" ON public.product_stock;
CREATE POLICY "Allow public read" ON public.product_stock FOR SELECT USING (true);

-- Stamp options policies
DROP POLICY IF EXISTS "Allow public read" ON public.stamp_options;
CREATE POLICY "Allow public read" ON public.stamp_options FOR SELECT USING (true);

-- Product stamp options policies
DROP POLICY IF EXISTS "Allow public read" ON public.product_stamp_options;
CREATE POLICY "Allow public read" ON public.product_stamp_options FOR SELECT USING (true);

-- =============================================
-- POLÍTICAS RLS PARA ADMINISTRADORES
-- =============================================

-- Profiles policies
DROP POLICY IF EXISTS "Allow individual read" ON public.profiles;
CREATE POLICY "Allow individual read" ON public.profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Allow self update" ON public.profiles;
CREATE POLICY "Allow self update" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Admin policies for all tables
DROP POLICY IF EXISTS "Allow admin write products" ON public.products;
CREATE POLICY "Allow admin write products" ON public.products
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

DROP POLICY IF EXISTS "Allow admin write product_colors" ON public.product_colors;
CREATE POLICY "Allow admin write product_colors" ON public.product_colors
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

DROP POLICY IF EXISTS "Allow admin write product_sizes" ON public.product_sizes;
CREATE POLICY "Allow admin write product_sizes" ON public.product_sizes
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

DROP POLICY IF EXISTS "Allow admin write product_images" ON public.product_images;
CREATE POLICY "Allow admin write product_images" ON public.product_images
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

DROP POLICY IF EXISTS "Allow admin write product_print_sizes" ON public.product_print_sizes;
CREATE POLICY "Allow admin write product_print_sizes" ON public.product_print_sizes
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

DROP POLICY IF EXISTS "Allow admin write product_stock" ON public.product_stock;
CREATE POLICY "Allow admin write product_stock" ON public.product_stock
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

DROP POLICY IF EXISTS "Allow admin write stamp_options" ON public.stamp_options;
CREATE POLICY "Allow admin write stamp_options" ON public.stamp_options
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

DROP POLICY IF EXISTS "Allow admin write product_stamp_options" ON public.product_stamp_options;
CREATE POLICY "Allow admin write product_stamp_options" ON public.product_stamp_options
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- =============================================
-- INSERTAR DATOS INICIALES
-- =============================================

-- Insert default categories
INSERT INTO public.categories (id, name, description) VALUES
  ('buzos', 'Buzos', 'Buzos y hoodies premium'),
  ('camperas', 'Camperas', 'Camperas y abrigos'),
  ('gorras', 'Gorras', 'Gorras y accesorios para la cabeza'),
  ('totebags', 'Tote Bags', 'Bolsos y accesorios')
ON CONFLICT (id) DO NOTHING;

-- Insertar opciones de estampas predeterminadas
INSERT INTO public.stamp_options (placement, size_id, label, extra_cost) VALUES
  ('front', 'hasta_15cm', 'Adelante - Hasta 15cm', 0),
  ('front', 'hasta_20x30cm', 'Adelante - Hasta 20x30cm', 500),
  ('front', 'hasta_30x40cm', 'Adelante - Hasta 30x40cm', 1000),
  ('back', 'hasta_15cm', 'Atrás - Hasta 15cm', 0),
  ('back', 'hasta_20x30cm', 'Atrás - Hasta 20x30cm', 500),
  ('back', 'hasta_30x40cm', 'Atrás - Hasta 30x40cm', 1000),
  ('front_back', 'hasta_15cm', 'Adelante + Atrás - Hasta 15cm', 0),
  ('front_back', 'hasta_20x30cm', 'Adelante + Atrás - Hasta 20x30cm', 1000),
  ('front_back', 'hasta_30x40cm', 'Adelante + Atrás - Hasta 30x40cm', 2000)
ON CONFLICT (placement, size_id) DO NOTHING;

-- =============================================
-- CREAR ÍNDICES PARA MEJOR RENDIMIENTO
-- =============================================

-- Products indexes
CREATE INDEX IF NOT EXISTS idx_products_categoria ON public.products(categoria);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at);
CREATE INDEX IF NOT EXISTS idx_products_stock ON public.products(stock);

-- Product colors indexes
CREATE INDEX IF NOT EXISTS idx_product_colors_product_id ON public.product_colors(product_id);

-- Product sizes indexes
CREATE INDEX IF NOT EXISTS idx_product_sizes_product_id ON public.product_sizes(product_id);

-- Product images indexes
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON public.product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_color ON public.product_images(color);

-- Product print sizes indexes
CREATE INDEX IF NOT EXISTS idx_product_print_sizes_product_id ON public.product_print_sizes(product_id);

-- Product stock indexes
CREATE INDEX IF NOT EXISTS idx_product_stock_product_id ON public.product_stock(product_id);
CREATE INDEX IF NOT EXISTS idx_product_stock_color ON public.product_stock(color);
CREATE INDEX IF NOT EXISTS idx_product_stock_size ON public.product_stock(size);
CREATE INDEX IF NOT EXISTS idx_product_stock_quantity ON public.product_stock(quantity);

-- Stamp options indexes
CREATE INDEX IF NOT EXISTS idx_stamp_options_placement ON public.stamp_options(placement);
CREATE INDEX IF NOT EXISTS idx_stamp_options_size_id ON public.stamp_options(size_id);

-- Product stamp options indexes
CREATE INDEX IF NOT EXISTS idx_product_stamp_options_product_id ON public.product_stamp_options(product_id);
CREATE INDEX IF NOT EXISTS idx_product_stamp_options_stamp_option_id ON public.product_stamp_options(stamp_option_id);

-- =============================================
-- AUTO-CREATE PROFILE ON USER SIGNUP
-- =============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (new.id, new.email, coalesce(new.raw_user_meta_data->>'fullName', null), coalesce(new.raw_user_meta_data->>'role','user'))
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ language plpgsql security definer;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- VERIFICACIÓN FINAL
-- =============================================

SELECT 
  'Categorías creadas' as tabla,
  COUNT(*) as cantidad
FROM public.categories
UNION ALL
SELECT 
  'Opciones de estampas creadas' as tabla,
  COUNT(*) as cantidad
FROM public.stamp_options
UNION ALL
SELECT 
  'Productos existentes' as tabla,
  COUNT(*) as cantidad
FROM public.products;

-- Mostrar estructura de tablas creadas
SELECT 
  schemaname,
  tablename,
  tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('products', 'categories', 'stamp_options', 'product_stamp_options')
ORDER BY tablename;

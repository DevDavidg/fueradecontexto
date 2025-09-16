-- =============================================
-- SCRIPT SIMPLIFICADO PARA AGREGAR SOLO ESTAMPAS
-- =============================================
-- Este script solo agrega las funcionalidades de estampas
-- Asume que las tablas principales ya existen

-- Verificar si la tabla products existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'products') THEN
        RAISE EXCEPTION 'La tabla public.products no existe. Por favor ejecuta primero el script setup-complete-schema.sql';
    END IF;
END $$;

-- Crear función para updated_at si no existe
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger AS $$
BEGIN
  new.updated_at = now();
  return new;
END;
$$ language plpgsql;

-- =============================================
-- CREAR TABLAS DE ESTAMPAS
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
  product_id text NOT NULL,
  stamp_option_id uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(product_id, stamp_option_id)
);

-- Agregar foreign keys solo si las tablas existen
DO $$
BEGIN
    -- Verificar si la constraint ya existe antes de agregarla
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'product_stamp_options_product_id_fkey' 
        AND table_name = 'product_stamp_options'
    ) THEN
        ALTER TABLE public.product_stamp_options 
        ADD CONSTRAINT product_stamp_options_product_id_fkey 
        FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'product_stamp_options_stamp_option_id_fkey' 
        AND table_name = 'product_stamp_options'
    ) THEN
        ALTER TABLE public.product_stamp_options 
        ADD CONSTRAINT product_stamp_options_stamp_option_id_fkey 
        FOREIGN KEY (stamp_option_id) REFERENCES public.stamp_options(id) ON DELETE CASCADE;
    END IF;
END $$;

-- =============================================
-- CONFIGURAR RLS Y TRIGGERS
-- =============================================

-- Habilitar RLS en las nuevas tablas
ALTER TABLE public.stamp_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_stamp_options ENABLE ROW LEVEL SECURITY;

-- Crear trigger para updated_at en stamp_options
DROP TRIGGER IF EXISTS trg_stamp_options_updated_at ON public.stamp_options;
CREATE TRIGGER trg_stamp_options_updated_at
BEFORE UPDATE ON public.stamp_options
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =============================================
-- POLÍTICAS RLS
-- =============================================

-- Políticas RLS para lectura pública
DROP POLICY IF EXISTS "Allow public read" ON public.stamp_options;
CREATE POLICY "Allow public read" ON public.stamp_options FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read" ON public.product_stamp_options;
CREATE POLICY "Allow public read" ON public.product_stamp_options FOR SELECT USING (true);

-- Políticas RLS para administradores (solo si la tabla profiles existe)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
        -- Stamp options admin policies
        DROP POLICY IF EXISTS "Allow admin write" ON public.stamp_options;
        CREATE POLICY "Allow admin write" ON public.stamp_options
        FOR ALL USING (
          EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
          )
        );

        -- Product stamp options admin policies
        DROP POLICY IF EXISTS "Allow admin write" ON public.product_stamp_options;
        CREATE POLICY "Allow admin write" ON public.product_stamp_options
        FOR ALL USING (
          EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
          )
        );
    ELSE
        -- Si no existe la tabla profiles, permitir a usuarios autenticados
        DROP POLICY IF EXISTS "Allow authenticated write" ON public.stamp_options;
        CREATE POLICY "Allow authenticated write" ON public.stamp_options
        FOR ALL USING (auth.role() = 'authenticated');

        DROP POLICY IF EXISTS "Allow authenticated write" ON public.product_stamp_options;
        CREATE POLICY "Allow authenticated write" ON public.product_stamp_options
        FOR ALL USING (auth.role() = 'authenticated');
    END IF;
END $$;

-- =============================================
-- INSERTAR DATOS INICIALES
-- =============================================

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
-- CREAR ÍNDICES
-- =============================================

-- Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_stamp_options_placement ON public.stamp_options(placement);
CREATE INDEX IF NOT EXISTS idx_stamp_options_size_id ON public.stamp_options(size_id);
CREATE INDEX IF NOT EXISTS idx_product_stamp_options_product_id ON public.product_stamp_options(product_id);
CREATE INDEX IF NOT EXISTS idx_product_stamp_options_stamp_option_id ON public.product_stamp_options(stamp_option_id);

-- =============================================
-- ASIGNAR ESTAMPAS A PRODUCTOS EXISTENTES (OPCIONAL)
-- =============================================

-- Solo ejecutar si hay productos existentes
DO $$
DECLARE
    product_count integer;
BEGIN
    SELECT COUNT(*) INTO product_count FROM public.products;
    
    IF product_count > 0 THEN
        -- Asignar todas las opciones de estampas a todos los productos existentes
        INSERT INTO public.product_stamp_options (product_id, stamp_option_id)
        SELECT 
          p.id as product_id,
          so.id as stamp_option_id
        FROM public.products p
        CROSS JOIN public.stamp_options so
        WHERE NOT EXISTS (
          SELECT 1 FROM public.product_stamp_options pso
          WHERE pso.product_id = p.id AND pso.stamp_option_id = so.id
        );
        
        RAISE NOTICE 'Se asignaron opciones de estampas a % productos existentes', product_count;
    ELSE
        RAISE NOTICE 'No se encontraron productos existentes para asignar opciones de estampas';
    END IF;
END $$;

-- =============================================
-- VERIFICACIÓN FINAL
-- =============================================

SELECT 
  'Opciones de estampas creadas' as tabla,
  COUNT(*) as cantidad
FROM public.stamp_options
UNION ALL
SELECT 
  'Relaciones producto-estampas creadas' as tabla,
  COUNT(*) as cantidad
FROM public.product_stamp_options;

-- Mostrar opciones de estampas disponibles
SELECT 
  placement,
  size_id,
  label,
  extra_cost
FROM public.stamp_options
ORDER BY placement, size_id;

-- Mostrar productos con sus opciones de estampas (si existen productos)
DO $$
DECLARE
    product_count integer;
BEGIN
    SELECT COUNT(*) INTO product_count FROM public.products;
    
    IF product_count > 0 THEN
        RAISE NOTICE 'Resumen por producto:';
        -- Esta parte se mostrará en los resultados de la query
    END IF;
END $$;

-- Query condicional para mostrar resumen por producto
SELECT 
  p.nombre,
  COUNT(pso.id) as opciones_estampas_disponibles
FROM public.products p
LEFT JOIN public.product_stamp_options pso ON p.id = pso.product_id
GROUP BY p.id, p.nombre
ORDER BY p.nombre;

-- =============================================
-- SCRIPT COMPLETO PARA CONFIGURAR ESTAMPAS CON NUEVO TAMAÑO
-- =============================================
-- Este script crea las tablas de estampas y agrega todas las opciones
-- incluyendo el nuevo tamaño hasta_40x50cm para buzos CANGURO

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

-- Crear tabla de opciones de estampas (stamp_options) con el nuevo tamaño
CREATE TABLE IF NOT EXISTS public.stamp_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  placement text NOT NULL CHECK (placement IN ('front', 'back', 'front_back')),
  size_id text NOT NULL CHECK (size_id IN ('hasta_15cm', 'hasta_20x30cm', 'hasta_30x40cm', 'hasta_40x50cm')),
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
    ) THEN
        ALTER TABLE public.product_stamp_options 
        ADD CONSTRAINT product_stamp_options_product_id_fkey 
        FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'product_stamp_options_stamp_option_id_fkey'
    ) THEN
        ALTER TABLE public.product_stamp_options 
        ADD CONSTRAINT product_stamp_options_stamp_option_id_fkey 
        FOREIGN KEY (stamp_option_id) REFERENCES public.stamp_options(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Habilitar RLS en las nuevas tablas
ALTER TABLE public.stamp_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_stamp_options ENABLE ROW LEVEL SECURITY;

-- Crear trigger para updated_at en stamp_options
DROP TRIGGER IF EXISTS trg_stamp_options_updated_at ON public.stamp_options;
CREATE TRIGGER trg_stamp_options_updated_at
BEFORE UPDATE ON public.stamp_options
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =============================================
-- INSERTAR OPCIONES DE ESTAMPAS
-- =============================================

-- Insertar opciones de estampas predeterminadas (incluyendo el nuevo tamaño)
INSERT INTO public.stamp_options (placement, size_id, label, extra_cost) VALUES
  -- Opciones para adelante
  ('front', 'hasta_15cm', 'Adelante - Hasta 15cm', 0),
  ('front', 'hasta_20x30cm', 'Adelante - Hasta 20x30cm', 500),
  ('front', 'hasta_30x40cm', 'Adelante - Hasta 30x40cm', 1000),
  
  -- Opciones para atrás (incluyendo el nuevo tamaño hasta_40x50cm)
  ('back', 'hasta_15cm', 'Atrás - Hasta 15cm', 0),
  ('back', 'hasta_20x30cm', 'Atrás - Hasta 20x30cm', 500),
  ('back', 'hasta_30x40cm', 'Atrás - Hasta 30x40cm', 1000),
  ('back', 'hasta_40x50cm', 'Atrás - Hasta 40x50cm', 1500),
  
  -- Opciones para adelante + atrás
  ('front_back', 'hasta_15cm', 'Adelante + Atrás - Hasta 15cm', 0),
  ('front_back', 'hasta_20x30cm', 'Adelante + Atrás - Hasta 20x30cm', 1000),
  ('front_back', 'hasta_30x40cm', 'Adelante + Atrás - Hasta 30x40cm', 2000),
  ('front_back', 'hasta_40x50cm', 'Adelante + Atrás - Hasta 40x50cm', 2500)
ON CONFLICT (placement, size_id) DO NOTHING;

-- =============================================
-- CREAR POLÍTICAS RLS
-- =============================================

-- Políticas para stamp_options (lectura pública)
DROP POLICY IF EXISTS "stamp_options_select_policy" ON public.stamp_options;
CREATE POLICY "stamp_options_select_policy" ON public.stamp_options
FOR SELECT USING (true);

-- Políticas para product_stamp_options (lectura pública)
DROP POLICY IF EXISTS "product_stamp_options_select_policy" ON public.product_stamp_options;
CREATE POLICY "product_stamp_options_select_policy" ON public.product_stamp_options
FOR SELECT USING (true);

-- =============================================
-- VERIFICAR INSTALACIÓN
-- =============================================

-- Verificar que las tablas se crearon correctamente
SELECT 
  'stamp_options' as tabla,
  COUNT(*) as registros
FROM public.stamp_options
UNION ALL
SELECT 
  'product_stamp_options' as tabla,
  COUNT(*) as registros
FROM public.product_stamp_options;

-- Mostrar todas las opciones de estampas creadas
SELECT 
  id,
  placement,
  size_id,
  label,
  extra_cost
FROM public.stamp_options
ORDER BY placement, size_id;

-- Mensaje de confirmación
DO $$
BEGIN
    RAISE NOTICE '✅ Tablas de estampas creadas exitosamente';
    RAISE NOTICE '✅ Opciones de estampas insertadas (incluyendo hasta_40x50cm)';
    RAISE NOTICE '✅ Políticas RLS configuradas';
    RAISE NOTICE '🎯 El sistema de estampas está listo para usar';
END $$;

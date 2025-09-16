-- =============================================
-- SCRIPT SQL PARA AGREGAR FUNCIONALIDAD DE ESTAMPAS
-- =============================================
-- Este script crea la tabla de opciones de estampas y
-- relaciona los productos con sus opciones de estampas disponibles

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

-- Habilitar RLS en las nuevas tablas
ALTER TABLE public.stamp_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_stamp_options ENABLE ROW LEVEL SECURITY;

-- Crear trigger para updated_at en stamp_options
DROP TRIGGER IF EXISTS trg_stamp_options_updated_at ON public.stamp_options;
CREATE TRIGGER trg_stamp_options_updated_at
BEFORE UPDATE ON public.stamp_options
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

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

-- Políticas RLS para lectura pública
DO $$
BEGIN
  -- Stamp options policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'stamp_options' AND policyname = 'Allow public read'
  ) THEN
    CREATE POLICY "Allow public read" ON public.stamp_options
      FOR SELECT USING (true);
  END IF;

  -- Product stamp options policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'product_stamp_options' AND policyname = 'Allow public read'
  ) THEN
    CREATE POLICY "Allow public read" ON public.product_stamp_options
      FOR SELECT USING (true);
  END IF;
END$$;

-- Políticas RLS para administradores (insertar/actualizar/eliminar)
DO $$
BEGIN
  -- Stamp options admin policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'stamp_options' AND policyname = 'Allow admin write'
  ) THEN
    CREATE POLICY "Allow admin write" ON public.stamp_options
      FOR ALL USING (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
      );
  END IF;

  -- Product stamp options admin policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'product_stamp_options' AND policyname = 'Allow admin write'
  ) THEN
    CREATE POLICY "Allow admin write" ON public.product_stamp_options
      FOR ALL USING (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
      );
  END IF;
END$$;

-- Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_stamp_options_placement ON public.stamp_options(placement);
CREATE INDEX IF NOT EXISTS idx_stamp_options_size_id ON public.stamp_options(size_id);
CREATE INDEX IF NOT EXISTS idx_product_stamp_options_product_id ON public.product_stamp_options(product_id);
CREATE INDEX IF NOT EXISTS idx_product_stamp_options_stamp_option_id ON public.product_stamp_options(stamp_option_id);

-- Asignar opciones de estampas a todos los productos existentes
-- (por defecto, todos los productos tendrán todas las opciones disponibles)
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

-- Verificar que se crearon correctamente
SELECT 
  'Opciones de estampas creadas' as tabla,
  COUNT(*) as cantidad
FROM public.stamp_options
UNION ALL
SELECT 
  'Relaciones producto-estampas creadas' as tabla,
  COUNT(*) as cantidad
FROM public.product_stamp_options;

-- Mostrar resumen por producto
SELECT 
  p.nombre,
  COUNT(pso.id) as opciones_estampas_disponibles
FROM public.products p
LEFT JOIN public.product_stamp_options pso ON p.id = pso.product_id
GROUP BY p.id, p.nombre
ORDER BY p.nombre;

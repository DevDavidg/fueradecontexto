-- =============================================
-- SCRIPT PARA AGREGAR OPCIONES DE ESTAMPAS ESPECÍFICAS PARA BUZOS CANGURO
-- =============================================
-- Este script agrega opciones de estampas específicas para buzos CANGURO
-- con límites diferentes: adelante hasta 30x40, atrás hasta 40x50

-- Agregar nuevas opciones de estampas para buzos CANGURO
INSERT INTO public.stamp_options (placement, size_id, label, extra_cost) VALUES
  -- Opciones para adelante (hasta 30x40)
  ('front', 'hasta_15cm', 'Adelante - Hasta 15cm', 0),
  ('front', 'hasta_20x30cm', 'Adelante - Hasta 20x30cm', 500),
  ('front', 'hasta_30x40cm', 'Adelante - Hasta 30x40cm', 1000),
  
  -- Opciones para atrás (hasta 40x50) - necesitamos agregar este tamaño
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

-- Verificar las opciones agregadas
SELECT 
  id,
  placement,
  size_id,
  label,
  extra_cost
FROM public.stamp_options
WHERE size_id = 'hasta_40x50cm' OR placement = 'front'
ORDER BY placement, size_id;

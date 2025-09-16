-- =============================================
-- SCRIPT PARA ASIGNAR ESTAMPAS A PRODUCTOS ESPECÍFICOS
-- =============================================
-- Este script permite asignar opciones de estampas solo a productos específicos
-- para testing de la funcionalidad

-- Limpiar asignaciones existentes (opcional)
-- DELETE FROM public.product_stamp_options;

-- Verificar productos existentes
SELECT 
  id,
  nombre,
  categoria
FROM public.products
ORDER BY nombre;

-- Verificar opciones de estampas disponibles
SELECT 
  id,
  placement,
  size_id,
  label,
  extra_cost
FROM public.stamp_options
ORDER BY placement, size_id;

-- Ejemplo: Asignar todas las opciones de estampas solo al primer producto
-- (cambiar 'test-buzo-1' por el ID del producto que quieras)
INSERT INTO public.product_stamp_options (product_id, stamp_option_id)
SELECT 
  'test-buzo-1' as product_id,  -- Cambiar por el ID del producto deseado
  so.id as stamp_option_id
FROM public.stamp_options so
WHERE NOT EXISTS (
  SELECT 1 FROM public.product_stamp_options pso
  WHERE pso.product_id = 'test-buzo-1' AND pso.stamp_option_id = so.id
);

-- Ejemplo: Asignar solo opciones básicas (hasta 15cm) a otro producto
INSERT INTO public.product_stamp_options (product_id, stamp_option_id)
SELECT 
  'test-campera-1' as product_id,  -- Cambiar por el ID del producto deseado
  so.id as stamp_option_id
FROM public.stamp_options so
WHERE so.size_id = 'hasta_15cm'  -- Solo opciones básicas
AND NOT EXISTS (
  SELECT 1 FROM public.product_stamp_options pso
  WHERE pso.product_id = 'test-campera-1' AND pso.stamp_option_id = so.id
);

-- Verificar las asignaciones
SELECT 
  p.nombre as producto,
  so.placement,
  so.size_id,
  so.label,
  so.extra_cost
FROM public.products p
JOIN public.product_stamp_options pso ON p.id = pso.product_id
JOIN public.stamp_options so ON pso.stamp_option_id = so.id
ORDER BY p.nombre, so.placement, so.size_id;

-- Contar productos con y sin estampas
SELECT 
  CASE 
    WHEN COUNT(pso.id) > 0 THEN 'Con estampas'
    ELSE 'Sin estampas'
  END as tipo,
  COUNT(DISTINCT p.id) as cantidad_productos
FROM public.products p
LEFT JOIN public.product_stamp_options pso ON p.id = pso.product_id
GROUP BY CASE WHEN COUNT(pso.id) > 0 THEN 'Con estampas' ELSE 'Sin estampas' END;

-- =============================================
-- SCRIPT PARA VERIFICAR OPCIONES DE ESTAMPAS DE UN PRODUCTO
-- =============================================

-- Verificar el producto específico
SELECT 
  p.id,
  p.nombre,
  p.categoria,
  COUNT(pso.id) as stamp_options_count
FROM public.products p
LEFT JOIN public.product_stamp_options pso ON p.id = pso.product_id
WHERE p.id = 'product_1758056464672_btwutfx7vy9'
GROUP BY p.id, p.nombre, p.categoria;

-- Ver las opciones de estampas asignadas a este producto
SELECT 
  p.nombre as producto,
  so.placement,
  so.size_id,
  so.label,
  so.extra_cost
FROM public.products p
JOIN public.product_stamp_options pso ON p.id = pso.product_id
JOIN public.stamp_options so ON pso.stamp_option_id = so.id
WHERE p.id = 'product_1758056464672_btwutfx7vy9'
ORDER BY so.placement, so.size_id;

-- Si no hay opciones asignadas, asignar algunas para testing
INSERT INTO public.product_stamp_options (product_id, stamp_option_id)
SELECT 
  'product_1758056464672_btwutfx7vy9' as product_id,
  so.id as stamp_option_id
FROM public.stamp_options so
WHERE so.placement = 'front' AND so.size_id IN ('hasta_15cm', 'hasta_20x30cm', 'hasta_30x40cm')
ON CONFLICT (product_id, stamp_option_id) DO NOTHING;

-- Verificar nuevamente después de la inserción
SELECT 
  p.nombre as producto,
  so.placement,
  so.size_id,
  so.label,
  so.extra_cost
FROM public.products p
JOIN public.product_stamp_options pso ON p.id = pso.product_id
JOIN public.stamp_options so ON pso.stamp_option_id = so.id
WHERE p.id = 'product_1758056464672_btwutfx7vy9'
ORDER BY so.placement, so.size_id;

-- Script para corregir precios incorrectos en órdenes existentes
-- Este script actualiza los precios de los items en las órdenes basándose en el total de la orden

-- Primero, veamos las órdenes que tienen precios incorrectos
SELECT 
  id,
  external_reference,
  total,
  items->0->>'name' as product_name,
  items->0->>'quantity' as quantity,
  items->0->>'price' as unit_price,
  (items->0->>'price')::numeric * (items->0->>'quantity')::numeric as calculated_total,
  CASE 
    WHEN (items->0->>'price')::numeric * (items->0->>'quantity')::numeric > total * 1.1 
    THEN 'INCORRECTO' 
    ELSE 'OK' 
  END as status_precio
FROM orders
WHERE status = 'approved'
ORDER BY created_at DESC;

-- Actualizar items donde el precio unitario multiplicado por cantidad es mayor que el total de la orden
-- Corrige el precio unitario calculándolo desde el total de la orden dividido por la cantidad

UPDATE orders
SET items = jsonb_set(
  items,
  '{0,price}',
  to_jsonb(ROUND((total::numeric / NULLIF((items->0->>'quantity')::numeric, 0))::numeric, 2))
)
WHERE 
  -- Solo órdenes aprobadas
  status = 'approved'
  -- Y donde el precio del primer item multiplicado por cantidad es significativamente mayor que el total
  -- (más del 10% de diferencia para evitar falsos positivos)
  AND (items->0->>'price')::numeric * (items->0->>'quantity')::numeric > total * 1.1
  -- Y el total es razonable (menor a $1000 para evitar afectar órdenes grandes legítimas)
  AND total < 1000
  -- Y hay al menos un item
  AND jsonb_array_length(items) > 0
  -- Y la cantidad es mayor a 0
  AND (items->0->>'quantity')::numeric > 0
  -- Y el total es mayor a 0
  AND total > 0;

-- Verificar los resultados después de la corrección
SELECT 
  id,
  external_reference,
  total,
  items->0->>'name' as product_name,
  items->0->>'quantity' as quantity,
  items->0->>'price' as unit_price,
  (items->0->>'price')::numeric * (items->0->>'quantity')::numeric as calculated_total,
  CASE 
    WHEN ABS((items->0->>'price')::numeric * (items->0->>'quantity')::numeric - total) < 0.01
    THEN 'CORRECTO' 
    ELSE 'REVISAR' 
  END as status_precio
FROM orders
WHERE status = 'approved'
ORDER BY created_at DESC
LIMIT 20;


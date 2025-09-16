-- =============================================
-- SCRIPT PARA CREAR PRODUCTOS DE PRUEBA
-- =============================================
-- Este script crea algunos productos de prueba para verificar 
-- que el sistema funciona correctamente

-- Verificar si ya hay productos
DO $$
DECLARE
    product_count integer;
BEGIN
    SELECT COUNT(*) INTO product_count FROM public.products;
    
    IF product_count = 0 THEN
        RAISE NOTICE 'No hay productos, creando productos de prueba...';
        
        -- Insertar productos de prueba
        INSERT INTO public.products (id, nombre, categoria, descripcion, precio_normal, precio_transferencia, metodos_pago, envio_metodo, envio_codigo_postal, stock) VALUES
        ('test-buzo-1', 'Buzo Test Premium', 'buzos', 'Buzo de prueba para testing', 25000, 22500, ARRAY['Transferencia', 'Tarjeta'], 'Envío a domicilio', '1000', 10),
        ('test-campera-1', 'Campera Test', 'camperas', 'Campera de prueba para testing', 35000, 31500, ARRAY['Transferencia', 'Tarjeta'], 'Envío a domicilio', '1000', 5),
        ('test-gorra-1', 'Gorra Test', 'gorras', 'Gorra de prueba para testing', 15000, 13500, ARRAY['Transferencia', 'Tarjeta'], 'Envío a domicilio', '1000', 20);

        -- Insertar colores para los productos
        INSERT INTO public.product_colors (product_id, nombre, hex) VALUES
        ('test-buzo-1', 'Negro', '#000000'),
        ('test-buzo-1', 'Blanco', '#FFFFFF'),
        ('test-campera-1', 'Azul', '#0066CC'),
        ('test-campera-1', 'Negro', '#000000'),
        ('test-gorra-1', 'Rojo', '#FF0000'),
        ('test-gorra-1', 'Verde', '#00AA00');

        -- Insertar tallas para los productos
        INSERT INTO public.product_sizes (product_id, size) VALUES
        ('test-buzo-1', 'S'),
        ('test-buzo-1', 'M'),
        ('test-buzo-1', 'L'),
        ('test-campera-1', 'M'),
        ('test-campera-1', 'L'),
        ('test-campera-1', 'XL'),
        ('test-gorra-1', 'Único');

        -- Insertar tamaños de estampa para los productos
        INSERT INTO public.product_print_sizes (product_id, size_key, price) VALUES
        ('test-buzo-1', 'hasta_15cm', 25000),
        ('test-buzo-1', 'hasta_20x30cm', 25500),
        ('test-buzo-1', 'hasta_30x40cm', 26000),
        ('test-campera-1', 'hasta_15cm', 35000),
        ('test-campera-1', 'hasta_20x30cm', 35500),
        ('test-gorra-1', 'hasta_15cm', 15000);

        -- Asignar opciones de estampas a los productos de prueba
        INSERT INTO public.product_stamp_options (product_id, stamp_option_id)
        SELECT 
          p.id as product_id,
          so.id as stamp_option_id
        FROM public.products p
        CROSS JOIN public.stamp_options so
        WHERE p.id IN ('test-buzo-1', 'test-campera-1', 'test-gorra-1')
        AND NOT EXISTS (
          SELECT 1 FROM public.product_stamp_options pso
          WHERE pso.product_id = p.id AND pso.stamp_option_id = so.id
        );

        RAISE NOTICE 'Productos de prueba creados exitosamente';
    ELSE
        RAISE NOTICE 'Ya existen % productos en la base de datos', product_count;
        
        -- Asignar opciones de estampas a productos existentes que no las tengan
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
        
        RAISE NOTICE 'Se asignaron opciones de estampas a productos existentes';
    END IF;
END $$;

-- Verificar el estado final
SELECT 
  'Productos totales' as item,
  COUNT(*) as cantidad
FROM public.products
UNION ALL
SELECT 
  'Opciones de estampas' as item,
  COUNT(*) as cantidad
FROM public.stamp_options
UNION ALL
SELECT 
  'Relaciones producto-estampas' as item,
  COUNT(*) as cantidad
FROM public.product_stamp_options;

-- Mostrar productos con sus opciones de estampas
SELECT 
  p.nombre as producto,
  COUNT(pso.id) as opciones_estampas,
  p.stock,
  p.precio_normal
FROM public.products p
LEFT JOIN public.product_stamp_options pso ON p.id = pso.product_id
GROUP BY p.id, p.nombre, p.stock, p.precio_normal
ORDER BY p.nombre;

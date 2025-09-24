-- =============================================
-- SCRIPT PARA ARREGLAR POLÍTICAS RLS DE ESTAMPAS
-- =============================================
-- Este script agrega las políticas RLS faltantes para permitir
-- INSERT, UPDATE y DELETE en las tablas de estampas

-- =============================================
-- POLÍTICAS PARA STAMP_OPTIONS
-- =============================================

-- Eliminar políticas existentes si existen
DROP POLICY IF EXISTS "stamp_options_select_policy" ON public.stamp_options;
DROP POLICY IF EXISTS "stamp_options_insert_policy" ON public.stamp_options;
DROP POLICY IF EXISTS "stamp_options_update_policy" ON public.stamp_options;
DROP POLICY IF EXISTS "stamp_options_delete_policy" ON public.stamp_options;

-- Crear políticas completas para stamp_options
CREATE POLICY "stamp_options_select_policy" ON public.stamp_options
FOR SELECT USING (true);

CREATE POLICY "stamp_options_insert_policy" ON public.stamp_options
FOR INSERT WITH CHECK (true);

CREATE POLICY "stamp_options_update_policy" ON public.stamp_options
FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "stamp_options_delete_policy" ON public.stamp_options
FOR DELETE USING (true);

-- =============================================
-- POLÍTICAS PARA PRODUCT_STAMP_OPTIONS
-- =============================================

-- Eliminar políticas existentes si existen
DROP POLICY IF EXISTS "product_stamp_options_select_policy" ON public.product_stamp_options;
DROP POLICY IF EXISTS "product_stamp_options_insert_policy" ON public.product_stamp_options;
DROP POLICY IF EXISTS "product_stamp_options_update_policy" ON public.product_stamp_options;
DROP POLICY IF EXISTS "product_stamp_options_delete_policy" ON public.product_stamp_options;

-- Crear políticas completas para product_stamp_options
CREATE POLICY "product_stamp_options_select_policy" ON public.product_stamp_options
FOR SELECT USING (true);

CREATE POLICY "product_stamp_options_insert_policy" ON public.product_stamp_options
FOR INSERT WITH CHECK (true);

CREATE POLICY "product_stamp_options_update_policy" ON public.product_stamp_options
FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "product_stamp_options_delete_policy" ON public.product_stamp_options
FOR DELETE USING (true);

-- =============================================
-- VERIFICAR POLÍTICAS
-- =============================================

-- Mostrar las políticas creadas
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename IN ('stamp_options', 'product_stamp_options')
ORDER BY tablename, policyname;

-- Mensaje de confirmación
DO $$
BEGIN
    RAISE NOTICE '✅ Políticas RLS actualizadas para stamp_options';
    RAISE NOTICE '✅ Políticas RLS actualizadas para product_stamp_options';
    RAISE NOTICE '✅ Ahora se permiten operaciones INSERT, UPDATE, DELETE';
    RAISE NOTICE '🎯 El sistema de estampas está completamente funcional';
END $$;

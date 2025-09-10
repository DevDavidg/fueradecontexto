# Scripts de Base de Datos

## Fix Admin Policies (Solución Simple)

**PROBLEMA IDENTIFICADO**: Las políticas RLS originales causaban recursión infinita porque intentaban verificar si un usuario es admin consultando la misma tabla que estaban protegiendo.

**SOLUCIÓN**: Usar el script simple que evita la recursión:

```sql
-- Simple fix for admin policies without recursion
-- This approach temporarily disables RLS for admin operations

-- Drop ALL existing policies first
drop policy if exists "Allow individual read" on public.profiles;
drop policy if exists "Allow self update" on public.profiles;
drop policy if exists "Allow admin read all" on public.profiles;
drop policy if exists "Allow admin update all" on public.profiles;
drop policy if exists "Allow admin insert" on public.profiles;
drop policy if exists "Allow admin delete" on public.profiles;
drop policy if exists "Users can read own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Admins can read all profiles" on public.profiles;
drop policy if exists "Admins can update all profiles" on public.profiles;
drop policy if exists "Admins can insert profiles" on public.profiles;
drop policy if exists "Admins can delete profiles" on public.profiles;

-- Drop the function if it exists
drop function if exists public.is_admin(uuid);

-- Create a simple approach: Allow all authenticated users to read/update profiles
-- This is less secure but avoids recursion issues
-- In production, you might want to use a different approach

-- Policy 1: All authenticated users can read profiles
create policy "Authenticated users can read profiles" on public.profiles
  for select using (auth.role() = 'authenticated');

-- Policy 2: Users can only update their own profile
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- Policy 3: Allow profile creation (for new user signup)
create policy "Allow profile creation" on public.profiles
  for insert with check (auth.uid() = id);

-- Note: This approach is less secure but avoids recursion
-- For better security, consider:
-- 1. Using a separate admin table
-- 2. Using Supabase's built-in admin functions
-- 3. Implementing admin checks at the application level
```

## Cómo ejecutar el script

**IMPORTANTE**: Si ya ejecutaste el script anterior y obtuviste errores, usa el script de limpieza primero:

### Opción 1: Script de limpieza completa (RECOMENDADO para errores de dependencias)

```sql
-- Copia y pega el contenido de scripts/complete-cleanup.sql
-- Este script elimina TODAS las políticas y funciones problemáticas
-- Incluye políticas de sections que dependen de is_admin
```

### Opción 2: Script de limpieza simple (si no hay dependencias)

```sql
-- Copia y pega el contenido de scripts/clean-and-fix-policies.sql
-- Este script elimina solo las políticas de profiles
```

### Opción 3: Script original (si no has ejecutado nada aún)

```sql
-- Copia y pega el contenido de scripts/fix-admin-policies-simple.sql
```

### Pasos:

1. Ve a tu proyecto de Supabase
2. Abre el SQL Editor
3. Copia y pega el script SQL correspondiente
4. Ejecuta el script

## Verificación

Después de ejecutar el script, puedes verificar que funciona:

1. Ve a `/debug` en tu aplicación para ver el estado de autenticación
2. Intenta acceder a `/admin/sections` nuevamente
3. Si aún hay problemas, revisa la consola del navegador para errores específicos

## Archivos modificados

- `src/hooks/use-admin.tsx` - Mejorado manejo de errores
- `src/components/providers/admin-guard.tsx` - Mejor manejo de errores y debug
- `src/app/api/debug-user/route.ts` - API de debug mejorada
- `src/app/debug/page.tsx` - Página de debug temporal

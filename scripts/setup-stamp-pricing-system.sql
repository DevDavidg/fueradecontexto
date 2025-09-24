-- Script para configurar el sistema de precios de estampas
-- Este script asegura que las tablas necesarias existan y tengan los datos correctos

-- Crear tabla print_sizes si no existe
CREATE TABLE IF NOT EXISTS print_sizes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    size_key VARCHAR(50) UNIQUE NOT NULL,
    price INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla stamp_options si no existe
CREATE TABLE IF NOT EXISTS stamp_options (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    placement VARCHAR(20) NOT NULL CHECK (placement IN ('front', 'back', 'front_back')),
    size_id VARCHAR(50) NOT NULL,
    label VARCHAR(100) NOT NULL,
    extra_cost INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (size_id) REFERENCES print_sizes(size_key)
);

-- Insertar tamaños de estampa si no existen
INSERT INTO print_sizes (size_key, price) VALUES 
    ('hasta_15cm', 0),
    ('hasta_20x30cm', 500),
    ('hasta_30x40cm', 1000),
    ('hasta_40x50cm', 1500)
ON CONFLICT (size_key) DO UPDATE SET 
    price = EXCLUDED.price,
    updated_at = NOW();

-- Insertar opciones de estampas si no existen
INSERT INTO stamp_options (placement, size_id, label, extra_cost) VALUES 
    -- Atrás
    ('back', 'hasta_15cm', 'Atrás - Hasta 15cm', 0),
    ('back', 'hasta_20x30cm', 'Atrás - Hasta 20x30cm', 500),
    ('back', 'hasta_30x40cm', 'Atrás - Hasta 30x40cm', 1000),
    ('back', 'hasta_40x50cm', 'Atrás - Hasta 40x50cm', 1500),
    
    -- Adelante
    ('front', 'hasta_15cm', 'Adelante - Hasta 15cm', 0),
    ('front', 'hasta_20x30cm', 'Adelante - Hasta 20x30cm', 500),
    ('front', 'hasta_30x40cm', 'Adelante - Hasta 30x40cm', 1000),
    ('front', 'hasta_40x50cm', 'Adelante - Hasta 40x50cm', 1500),
    
    -- Adelante + Atrás
    ('front_back', 'hasta_15cm', 'Adelante + Atrás - Hasta 15cm', 0),
    ('front_back', 'hasta_20x30cm', 'Adelante + Atrás - Hasta 20x30cm', 1000),
    ('front_back', 'hasta_30x40cm', 'Adelante + Atrás - Hasta 30x40cm', 2000),
    ('front_back', 'hasta_40x50cm', 'Adelante + Atrás - Hasta 40x50cm', 2500)
ON CONFLICT DO NOTHING;

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_print_sizes_size_key ON print_sizes(size_key);
CREATE INDEX IF NOT EXISTS idx_stamp_options_placement ON stamp_options(placement);
CREATE INDEX IF NOT EXISTS idx_stamp_options_size_id ON stamp_options(size_id);

-- Crear trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger a print_sizes
DROP TRIGGER IF EXISTS update_print_sizes_updated_at ON print_sizes;
CREATE TRIGGER update_print_sizes_updated_at
    BEFORE UPDATE ON print_sizes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Aplicar trigger a stamp_options
DROP TRIGGER IF EXISTS update_stamp_options_updated_at ON stamp_options;
CREATE TRIGGER update_stamp_options_updated_at
    BEFORE UPDATE ON stamp_options
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Configurar RLS (Row Level Security) si es necesario
ALTER TABLE print_sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE stamp_options ENABLE ROW LEVEL SECURITY;

-- Políticas para permitir lectura a todos los usuarios autenticados
CREATE POLICY "Allow read access to print_sizes" ON print_sizes
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow read access to stamp_options" ON stamp_options
    FOR SELECT USING (auth.role() = 'authenticated');

-- Políticas para permitir escritura solo a administradores
CREATE POLICY "Allow admin write access to print_sizes" ON print_sizes
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.is_admin = true
        )
    );

CREATE POLICY "Allow admin write access to stamp_options" ON stamp_options
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.is_admin = true
        )
    );

-- Mensaje de confirmación
DO $$
BEGIN
    RAISE NOTICE '✅ Sistema de precios de estampas configurado correctamente';
    RAISE NOTICE '📊 Tamaños de estampa: % registros', (SELECT COUNT(*) FROM print_sizes);
    RAISE NOTICE '🎯 Opciones de estampas: % registros', (SELECT COUNT(*) FROM stamp_options);
    RAISE NOTICE '🔒 RLS configurado para seguridad';
END $$;

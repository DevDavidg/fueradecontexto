-- =============================================
-- SCRIPT SQL PARA INSERTAR PRODUCTOS DESDE products.json
-- =============================================
-- Este script inserta todos los productos del archivo products.json
-- directamente en la base de datos de Supabase

-- Limpiar datos existentes (opcional - comentar si quieres mantener datos existentes)
DELETE FROM product_stock;
DELETE FROM product_print_sizes;
DELETE FROM product_images;
DELETE FROM product_sizes;
DELETE FROM product_colors;
DELETE FROM products;
DELETE FROM categories;

-- Insertar categorías
INSERT INTO categories (id, name, description) VALUES
  ('buzos', 'Buzos', 'Buzos y hoodies premium'),
  ('camperas', 'Camperas', 'Camperas y abrigos'),
  ('gorras', 'Gorras', 'Gorras y accesorios para la cabeza'),
  ('totebags', 'Tote Bags', 'Bolsos y accesorios');

-- =============================================
-- PRODUCTO 1: Buzo Cuello Redondo Premium
-- =============================================

-- Insertar producto principal
INSERT INTO products (id, nombre, categoria, descripcion, precio_normal, precio_transferencia, metodos_pago, envio_metodo, envio_codigo_postal) VALUES
('buzo-cuello-redondo-1', 'Buzo Cuello Redondo Premium', 'buzos', 'Buzo de cuello redondo premium 100% algodón peinado. Corte oversize, costuras reforzadas y acabado premium. Perfecto para el día a día con máximo confort.', 25000, 22500, ARRAY['Tarjeta de crédito', 'Tarjeta de débito', 'Transferencia'], 'Correo Argentino', '1406');

-- Insertar colores
INSERT INTO product_colors (product_id, nombre, hex) VALUES
('buzo-cuello-redondo-1', 'Negro', '#000000'),
('buzo-cuello-redondo-1', 'Blanco', '#FFFFFF'),
('buzo-cuello-redondo-1', 'Gris', '#808080'),
('buzo-cuello-redondo-1', 'Azul Francia', '#0072BB'),
('buzo-cuello-redondo-1', 'Azul Marino', '#1E3A8A'),
('buzo-cuello-redondo-1', 'Rojo', '#DC2626'),
('buzo-cuello-redondo-1', 'Rosa', '#EC4899'),
('buzo-cuello-redondo-1', 'Amarillo', '#F59E0B'),
('buzo-cuello-redondo-1', 'Bordo', '#7C2D12'),
('buzo-cuello-redondo-1', 'Verde Botella', '#166534');

-- Insertar tallas
INSERT INTO product_sizes (product_id, size) VALUES
('buzo-cuello-redondo-1', 'S'),
('buzo-cuello-redondo-1', 'M'),
('buzo-cuello-redondo-1', 'L'),
('buzo-cuello-redondo-1', 'XL'),
('buzo-cuello-redondo-1', 'XXL');

-- Insertar imágenes
INSERT INTO product_images (product_id, color, url) VALUES
('buzo-cuello-redondo-1', 'Negro', '/placeholder-product.pngbuzo_cuello_redondo_negro.png'),
('buzo-cuello-redondo-1', 'Blanco', '/placeholder-product.pngbuzo_cuello_redondo_blanco.png'),
('buzo-cuello-redondo-1', 'Gris', '/placeholder-product.pngbuzo_cuello_redondo_gris.png'),
('buzo-cuello-redondo-1', 'Azul Francia', '/placeholder-product.pngbuzo_cuello_redondo_azul_francia.png'),
('buzo-cuello-redondo-1', 'Azul Marino', '/placeholder-product.pngbuzo_cuello_redondo_azul_marino.png'),
('buzo-cuello-redondo-1', 'Rojo', '/placeholder-product.pngbuzo_cuello_redondo_rojo.png'),
('buzo-cuello-redondo-1', 'Rosa', '/placeholder-product.pngbuzo_cuello_redondo_rosa.png'),
('buzo-cuello-redondo-1', 'Amarillo', '/placeholder-product.pngbuzo_cuello_redondo_amarillo.png'),
('buzo-cuello-redondo-1', 'Bordo', '/placeholder-product.pngbuzo_cuello_redondo_bordo.png'),
('buzo-cuello-redondo-1', 'Verde Botella', '/placeholder-product.pngbuzo_cuello_redondo_verde_botella.png');

-- Insertar tamaños de estampa
INSERT INTO product_print_sizes (product_id, size_key, price) VALUES
('buzo-cuello-redondo-1', 'hasta_15cm', 25000),
('buzo-cuello-redondo-1', 'hasta_20x30cm', 27000),
('buzo-cuello-redondo-1', 'hasta_30x40cm', 29000),
('buzo-cuello-redondo-1', 'hasta_40x50cm', 31000);

-- Insertar stock
INSERT INTO product_stock (product_id, color, size, quantity) VALUES
-- Stock Negro
('buzo-cuello-redondo-1', 'Negro', 'S', 8),
('buzo-cuello-redondo-1', 'Negro', 'M', 12),
('buzo-cuello-redondo-1', 'Negro', 'L', 10),
('buzo-cuello-redondo-1', 'Negro', 'XL', 6),
('buzo-cuello-redondo-1', 'Negro', 'XXL', 4),
-- Stock Blanco
('buzo-cuello-redondo-1', 'Blanco', 'S', 6),
('buzo-cuello-redondo-1', 'Blanco', 'M', 9),
('buzo-cuello-redondo-1', 'Blanco', 'L', 8),
('buzo-cuello-redondo-1', 'Blanco', 'XL', 5),
('buzo-cuello-redondo-1', 'Blanco', 'XXL', 3),
-- Stock Gris
('buzo-cuello-redondo-1', 'Gris', 'S', 7),
('buzo-cuello-redondo-1', 'Gris', 'M', 10),
('buzo-cuello-redondo-1', 'Gris', 'L', 9),
('buzo-cuello-redondo-1', 'Gris', 'XL', 6),
('buzo-cuello-redondo-1', 'Gris', 'XXL', 4),
-- Stock Azul Francia
('buzo-cuello-redondo-1', 'Azul Francia', 'S', 5),
('buzo-cuello-redondo-1', 'Azul Francia', 'M', 8),
('buzo-cuello-redondo-1', 'Azul Francia', 'L', 7),
('buzo-cuello-redondo-1', 'Azul Francia', 'XL', 4),
('buzo-cuello-redondo-1', 'Azul Francia', 'XXL', 2),
-- Stock Azul Marino
('buzo-cuello-redondo-1', 'Azul Marino', 'S', 6),
('buzo-cuello-redondo-1', 'Azul Marino', 'M', 9),
('buzo-cuello-redondo-1', 'Azul Marino', 'L', 8),
('buzo-cuello-redondo-1', 'Azul Marino', 'XL', 5),
('buzo-cuello-redondo-1', 'Azul Marino', 'XXL', 3),
-- Stock Rojo
('buzo-cuello-redondo-1', 'Rojo', 'S', 4),
('buzo-cuello-redondo-1', 'Rojo', 'M', 7),
('buzo-cuello-redondo-1', 'Rojo', 'L', 6),
('buzo-cuello-redondo-1', 'Rojo', 'XL', 3),
('buzo-cuello-redondo-1', 'Rojo', 'XXL', 2),
-- Stock Rosa
('buzo-cuello-redondo-1', 'Rosa', 'S', 5),
('buzo-cuello-redondo-1', 'Rosa', 'M', 8),
('buzo-cuello-redondo-1', 'Rosa', 'L', 7),
('buzo-cuello-redondo-1', 'Rosa', 'XL', 4),
('buzo-cuello-redondo-1', 'Rosa', 'XXL', 2),
-- Stock Amarillo
('buzo-cuello-redondo-1', 'Amarillo', 'S', 3),
('buzo-cuello-redondo-1', 'Amarillo', 'M', 6),
('buzo-cuello-redondo-1', 'Amarillo', 'L', 5),
('buzo-cuello-redondo-1', 'Amarillo', 'XL', 3),
('buzo-cuello-redondo-1', 'Amarillo', 'XXL', 1),
-- Stock Bordo
('buzo-cuello-redondo-1', 'Bordo', 'S', 4),
('buzo-cuello-redondo-1', 'Bordo', 'M', 7),
('buzo-cuello-redondo-1', 'Bordo', 'L', 6),
('buzo-cuello-redondo-1', 'Bordo', 'XL', 3),
('buzo-cuello-redondo-1', 'Bordo', 'XXL', 2),
-- Stock Verde Botella
('buzo-cuello-redondo-1', 'Verde Botella', 'S', 5),
('buzo-cuello-redondo-1', 'Verde Botella', 'M', 8),
('buzo-cuello-redondo-1', 'Verde Botella', 'L', 7),
('buzo-cuello-redondo-1', 'Verde Botella', 'XL', 4),
('buzo-cuello-redondo-1', 'Verde Botella', 'XXL', 2);

-- =============================================
-- PRODUCTO 2: Buzo Canguro Premium
-- =============================================

-- Insertar producto principal
INSERT INTO products (id, nombre, categoria, descripcion, precio_normal, precio_transferencia, metodos_pago, envio_metodo, envio_codigo_postal) VALUES
('buzo-canguro-1', 'Buzo Canguro Premium', 'buzos', 'Buzo canguro premium con capucha y bolsillo canguro. Interior frisa para máximo abrigo y confort. Corte oversize y costuras reforzadas.', 28000, 25200, ARRAY['Tarjeta de crédito', 'Tarjeta de débito', 'Transferencia'], 'Correo Argentino', '1406');

-- Insertar colores
INSERT INTO product_colors (product_id, nombre, hex) VALUES
('buzo-canguro-1', 'Negro', '#000000'),
('buzo-canguro-1', 'Blanco', '#FFFFFF'),
('buzo-canguro-1', 'Azul', '#2563EB'),
('buzo-canguro-1', 'Azul Marino', '#1E3A8A'),
('buzo-canguro-1', 'Gris', '#808080'),
('buzo-canguro-1', 'Rojo', '#DC2626'),
('buzo-canguro-1', 'Rosa', '#EC4899'),
('buzo-canguro-1', 'Violeta', '#7C3AED'),
('buzo-canguro-1', 'Amarillo', '#F59E0B'),
('buzo-canguro-1', 'Bordo', '#7C2D12');

-- Insertar tallas
INSERT INTO product_sizes (product_id, size) VALUES
('buzo-canguro-1', 'S'),
('buzo-canguro-1', 'M'),
('buzo-canguro-1', 'L'),
('buzo-canguro-1', 'XL'),
('buzo-canguro-1', 'XXL');

-- Insertar imágenes
INSERT INTO product_images (product_id, color, url) VALUES
('buzo-canguro-1', 'Negro', '/placeholder-product.pngbuzo_canguro_negro.png'),
('buzo-canguro-1', 'Blanco', '/placeholder-product.pngbuzo_canguro_blanco.png'),
('buzo-canguro-1', 'Azul', '/placeholder-product.pngbuzo_canguro_azul.png'),
('buzo-canguro-1', 'Azul Marino', '/placeholder-product.pngbuzo_canguro_azul_marino.png'),
('buzo-canguro-1', 'Gris', '/placeholder-product.pngbuzo_canguro_gris.png'),
('buzo-canguro-1', 'Rojo', '/placeholder-product.pngbuzo_canguro_rojo.png'),
('buzo-canguro-1', 'Rosa', '/placeholder-product.pngbuzo_canguro_rosa.png'),
('buzo-canguro-1', 'Violeta', '/placeholder-product.pngbuzo_canguro_violeta.png'),
('buzo-canguro-1', 'Amarillo', '/placeholder-product.pngbuzo_canguro_amarillo.png'),
('buzo-canguro-1', 'Bordo', '/placeholder-product.pngbuzo_canguro_bordo.png');

-- Insertar tamaños de estampa
INSERT INTO product_print_sizes (product_id, size_key, price) VALUES
('buzo-canguro-1', 'hasta_15cm', 28000),
('buzo-canguro-1', 'hasta_20x30cm', 30000),
('buzo-canguro-1', 'hasta_30x40cm', 32000),
('buzo-canguro-1', 'hasta_40x50cm', 34000);

-- Insertar stock
INSERT INTO product_stock (product_id, color, size, quantity) VALUES
-- Stock Negro
('buzo-canguro-1', 'Negro', 'S', 7),
('buzo-canguro-1', 'Negro', 'M', 10),
('buzo-canguro-1', 'Negro', 'L', 8),
('buzo-canguro-1', 'Negro', 'XL', 5),
('buzo-canguro-1', 'Negro', 'XXL', 3),
-- Stock Blanco
('buzo-canguro-1', 'Blanco', 'S', 6),
('buzo-canguro-1', 'Blanco', 'M', 9),
('buzo-canguro-1', 'Blanco', 'L', 7),
('buzo-canguro-1', 'Blanco', 'XL', 4),
('buzo-canguro-1', 'Blanco', 'XXL', 2),
-- Stock Azul
('buzo-canguro-1', 'Azul', 'S', 6),
('buzo-canguro-1', 'Azul', 'M', 9),
('buzo-canguro-1', 'Azul', 'L', 7),
('buzo-canguro-1', 'Azul', 'XL', 4),
('buzo-canguro-1', 'Azul', 'XXL', 2),
-- Stock Azul Marino
('buzo-canguro-1', 'Azul Marino', 'S', 5),
('buzo-canguro-1', 'Azul Marino', 'M', 8),
('buzo-canguro-1', 'Azul Marino', 'L', 6),
('buzo-canguro-1', 'Azul Marino', 'XL', 3),
('buzo-canguro-1', 'Azul Marino', 'XXL', 2),
-- Stock Gris
('buzo-canguro-1', 'Gris', 'S', 7),
('buzo-canguro-1', 'Gris', 'M', 10),
('buzo-canguro-1', 'Gris', 'L', 8),
('buzo-canguro-1', 'Gris', 'XL', 5),
('buzo-canguro-1', 'Gris', 'XXL', 3),
-- Stock Rojo
('buzo-canguro-1', 'Rojo', 'S', 5),
('buzo-canguro-1', 'Rojo', 'M', 8),
('buzo-canguro-1', 'Rojo', 'L', 6),
('buzo-canguro-1', 'Rojo', 'XL', 3),
('buzo-canguro-1', 'Rojo', 'XXL', 2),
-- Stock Rosa
('buzo-canguro-1', 'Rosa', 'S', 4),
('buzo-canguro-1', 'Rosa', 'M', 7),
('buzo-canguro-1', 'Rosa', 'L', 5),
('buzo-canguro-1', 'Rosa', 'XL', 3),
('buzo-canguro-1', 'Rosa', 'XXL', 1),
-- Stock Violeta
('buzo-canguro-1', 'Violeta', 'S', 3),
('buzo-canguro-1', 'Violeta', 'M', 6),
('buzo-canguro-1', 'Violeta', 'L', 4),
('buzo-canguro-1', 'Violeta', 'XL', 2),
('buzo-canguro-1', 'Violeta', 'XXL', 1),
-- Stock Amarillo
('buzo-canguro-1', 'Amarillo', 'S', 3),
('buzo-canguro-1', 'Amarillo', 'M', 6),
('buzo-canguro-1', 'Amarillo', 'L', 4),
('buzo-canguro-1', 'Amarillo', 'XL', 2),
('buzo-canguro-1', 'Amarillo', 'XXL', 1),
-- Stock Bordo
('buzo-canguro-1', 'Bordo', 'S', 4),
('buzo-canguro-1', 'Bordo', 'M', 7),
('buzo-canguro-1', 'Bordo', 'L', 5),
('buzo-canguro-1', 'Bordo', 'XL', 3),
('buzo-canguro-1', 'Bordo', 'XXL', 1);

-- =============================================
-- PRODUCTO 3: Campera Global Premium
-- =============================================

-- Insertar producto principal
INSERT INTO products (id, nombre, categoria, descripcion, precio_normal, precio_transferencia, metodos_pago, envio_metodo, envio_codigo_postal) VALUES
('campera-global-1', 'Campera Global Premium', 'camperas', 'Campera premium de alta calidad con diseño minimalista. Perfecta para todas las estaciones, con corte moderno y materiales premium.', 45000, 40500, ARRAY['Tarjeta de crédito', 'Tarjeta de débito', 'Transferencia'], 'Correo Argentino', '1406');

-- Insertar colores
INSERT INTO product_colors (product_id, nombre, hex) VALUES
('campera-global-1', 'Negro', '#000000'),
('campera-global-1', 'Gris', '#808080');

-- Insertar tallas
INSERT INTO product_sizes (product_id, size) VALUES
('campera-global-1', 'S'),
('campera-global-1', 'M'),
('campera-global-1', 'L'),
('campera-global-1', 'XL'),
('campera-global-1', 'XXL');

-- Insertar imágenes
INSERT INTO product_images (product_id, color, url) VALUES
('campera-global-1', 'Negro', '/placeholder-product.pngcampera_negra_global.png'),
('campera-global-1', 'Gris', '/placeholder-product.pngcampera_gris.png');

-- Insertar tamaños de estampa
INSERT INTO product_print_sizes (product_id, size_key, price) VALUES
('campera-global-1', 'hasta_15cm', 45000),
('campera-global-1', 'hasta_20x30cm', 48000),
('campera-global-1', 'hasta_30x40cm', 51000),
('campera-global-1', 'hasta_40x50cm', 54000);

-- Insertar stock
INSERT INTO product_stock (product_id, color, size, quantity) VALUES
-- Stock Negro
('campera-global-1', 'Negro', 'S', 6),
('campera-global-1', 'Negro', 'M', 8),
('campera-global-1', 'Negro', 'L', 7),
('campera-global-1', 'Negro', 'XL', 4),
('campera-global-1', 'Negro', 'XXL', 2),
-- Stock Gris
('campera-global-1', 'Gris', 'S', 5),
('campera-global-1', 'Gris', 'M', 7),
('campera-global-1', 'Gris', 'L', 6),
('campera-global-1', 'Gris', 'XL', 3),
('campera-global-1', 'Gris', 'XXL', 2);

-- =============================================
-- PRODUCTO 4: Gorra Gabardina Premium
-- =============================================

-- Insertar producto principal
INSERT INTO products (id, nombre, categoria, descripcion, precio_normal, precio_transferencia, metodos_pago, envio_metodo, envio_codigo_postal) VALUES
('gorra-gabardina-1', 'Gorra Gabardina Premium', 'gorras', 'Gorra gabardina premium con diseño clásico y moderno. Material resistente al agua, ajuste cómodo y estilo atemporal. Perfecta para cualquier ocasión.', 18000, 16200, ARRAY['Tarjeta de crédito', 'Tarjeta de débito', 'Transferencia'], 'Correo Argentino', '1406');

-- Insertar colores
INSERT INTO product_colors (product_id, nombre, hex) VALUES
('gorra-gabardina-1', 'Negro', '#000000'),
('gorra-gabardina-1', 'Gris', '#808080'),
('gorra-gabardina-1', 'Azul Marino', '#1E3A8A'),
('gorra-gabardina-1', 'Marrón', '#8B4513'),
('gorra-gabardina-1', 'Rojo', '#DC2626'),
('gorra-gabardina-1', 'Rosa', '#EC4899'),
('gorra-gabardina-1', 'Verde Botella', '#166534');

-- Insertar tallas
INSERT INTO product_sizes (product_id, size) VALUES
('gorra-gabardina-1', 'Único');

-- Insertar imágenes
INSERT INTO product_images (product_id, color, url) VALUES
('gorra-gabardina-1', 'Negro', '/placeholder-product.pnggorra_gabardina_negra.png'),
('gorra-gabardina-1', 'Gris', '/placeholder-product.pnggorra_gabardina_gris.png'),
('gorra-gabardina-1', 'Azul Marino', '/placeholder-product.pnggorra_gabardina_azul_marino.png'),
('gorra-gabardina-1', 'Marrón', '/placeholder-product.pnggorra_gabardina_marron.png'),
('gorra-gabardina-1', 'Rojo', '/placeholder-product.pnggorra_gabardina_roja.png'),
('gorra-gabardina-1', 'Rosa', '/placeholder-product.pnggorra_gabardina_rosa.png'),
('gorra-gabardina-1', 'Verde Botella', '/placeholder-product.pnggorra_gabardina_verde_botella.png');

-- Insertar tamaños de estampa
INSERT INTO product_print_sizes (product_id, size_key, price) VALUES
('gorra-gabardina-1', 'hasta_15cm', 18000),
('gorra-gabardina-1', 'hasta_20x30cm', 20000),
('gorra-gabardina-1', 'hasta_30x40cm', 22000),
('gorra-gabardina-1', 'hasta_40x50cm', 24000);

-- Insertar stock
INSERT INTO product_stock (product_id, color, size, quantity) VALUES
('gorra-gabardina-1', 'Negro', 'Único', 15),
('gorra-gabardina-1', 'Gris', 'Único', 12),
('gorra-gabardina-1', 'Azul Marino', 'Único', 10),
('gorra-gabardina-1', 'Marrón', 'Único', 8),
('gorra-gabardina-1', 'Rojo', 'Único', 9),
('gorra-gabardina-1', 'Rosa', 'Único', 7),
('gorra-gabardina-1', 'Verde Botella', 'Único', 8);

-- =============================================
-- PRODUCTO 5: Gorra Trucker Premium
-- =============================================

-- Insertar producto principal
INSERT INTO products (id, nombre, categoria, descripcion, precio_normal, precio_transferencia, metodos_pago, envio_metodo, envio_codigo_postal) VALUES
('gorra-trucker-1', 'Gorra Trucker Premium', 'gorras', 'Gorra trucker premium con diseño clásico americano. Panel frontal de algodón y panel trasero de malla para máxima ventilación. Ajuste cómodo y estilo urbano.', 20000, 18000, ARRAY['Tarjeta de crédito', 'Tarjeta de débito', 'Transferencia'], 'Correo Argentino', '1406');

-- Insertar colores
INSERT INTO product_colors (product_id, nombre, hex) VALUES
('gorra-trucker-1', 'Negro', '#000000'),
('gorra-trucker-1', 'Negro Blanca', '#000000'),
('gorra-trucker-1', 'Gris Blanco', '#808080'),
('gorra-trucker-1', 'Azul Roja Blanca', '#2563EB'),
('gorra-trucker-1', 'Azul Beige Roja', '#2563EB'),
('gorra-trucker-1', 'Rojo', '#DC2626'),
('gorra-trucker-1', 'Verde Lima', '#84CC16'),
('gorra-trucker-1', 'Verde Militar Blanca', '#166534'),
('gorra-trucker-1', 'Violeta', '#7C3AED'),
('gorra-trucker-1', 'Violeta Blanca', '#7C3AED');

-- Insertar tallas
INSERT INTO product_sizes (product_id, size) VALUES
('gorra-trucker-1', 'Único');

-- Insertar imágenes
INSERT INTO product_images (product_id, color, url) VALUES
('gorra-trucker-1', 'Negro', '/placeholder-product.pnggorra_trucker_negra.png'),
('gorra-trucker-1', 'Negro Blanca', '/placeholder-product.pnggorra_trucker_negra_blanca.png'),
('gorra-trucker-1', 'Gris Blanco', '/placeholder-product.pnggorra_trucker_gris_blanco.png'),
('gorra-trucker-1', 'Azul Roja Blanca', '/placeholder-product.pnggorra_trucker_azul_roja_blanca.png'),
('gorra-trucker-1', 'Azul Beige Roja', '/placeholder-product.pnggorra_trucker_azul_beige_roja.png'),
('gorra-trucker-1', 'Rojo', '/placeholder-product.pnggorra_trucker_roja.png'),
('gorra-trucker-1', 'Verde Lima', '/placeholder-product.pnggorra_trucker_verde_lima.png'),
('gorra-trucker-1', 'Verde Militar Blanca', '/placeholder-product.pnggorra_trucker_verde_militar_blanca.png'),
('gorra-trucker-1', 'Violeta', '/placeholder-product.pnggorra_trucker_violeta.png'),
('gorra-trucker-1', 'Violeta Blanca', '/placeholder-product.pnggorra_trucker_violeta_blanca.png');

-- Insertar tamaños de estampa
INSERT INTO product_print_sizes (product_id, size_key, price) VALUES
('gorra-trucker-1', 'hasta_15cm', 20000),
('gorra-trucker-1', 'hasta_20x30cm', 22000),
('gorra-trucker-1', 'hasta_30x40cm', 24000),
('gorra-trucker-1', 'hasta_40x50cm', 26000);

-- Insertar stock
INSERT INTO product_stock (product_id, color, size, quantity) VALUES
('gorra-trucker-1', 'Negro', 'Único', 12),
('gorra-trucker-1', 'Negro Blanca', 'Único', 10),
('gorra-trucker-1', 'Gris Blanco', 'Único', 9),
('gorra-trucker-1', 'Azul Roja Blanca', 'Único', 8),
('gorra-trucker-1', 'Azul Beige Roja', 'Único', 7),
('gorra-trucker-1', 'Rojo', 'Único', 11),
('gorra-trucker-1', 'Verde Lima', 'Único', 6),
('gorra-trucker-1', 'Verde Militar Blanca', 'Único', 8),
('gorra-trucker-1', 'Violeta', 'Único', 5),
('gorra-trucker-1', 'Violeta Blanca', 'Único', 6);

-- =============================================
-- PRODUCTO 6: Tote Bag Global Premium
-- =============================================

-- Insertar producto principal
INSERT INTO products (id, nombre, categoria, descripcion, precio_normal, precio_transferencia, metodos_pago, envio_metodo, envio_codigo_postal) VALUES
('tote-bag-global-1', 'Tote Bag Global Premium', 'totebags', 'Tote bag premium de lona resistente. Diseño minimalista y funcional, perfecto para el día a día. Costuras reforzadas y manijas cómodas.', 15000, 13500, ARRAY['Tarjeta de crédito', 'Tarjeta de débito', 'Transferencia'], 'Correo Argentino', '1406');

-- Insertar colores
INSERT INTO product_colors (product_id, nombre, hex) VALUES
('tote-bag-global-1', 'Natural', '#F5F5DC');

-- Insertar tallas
INSERT INTO product_sizes (product_id, size) VALUES
('tote-bag-global-1', 'Único');

-- Insertar imágenes
INSERT INTO product_images (product_id, color, url) VALUES
('tote-bag-global-1', 'Natural', '/placeholder-product.pngtote_bag_global.png');

-- Insertar tamaños de estampa
INSERT INTO product_print_sizes (product_id, size_key, price) VALUES
('tote-bag-global-1', 'hasta_15cm', 15000),
('tote-bag-global-1', 'hasta_20x30cm', 17000),
('tote-bag-global-1', 'hasta_30x40cm', 19000),
('tote-bag-global-1', 'hasta_40x50cm', 21000);

-- Insertar stock
INSERT INTO product_stock (product_id, color, size, quantity) VALUES
('tote-bag-global-1', 'Natural', 'Único', 25);

-- =============================================
-- VERIFICACIÓN FINAL
-- =============================================

-- Verificar que se insertaron todos los productos
SELECT 
  'Productos insertados' as tabla,
  COUNT(*) as cantidad
FROM products
UNION ALL
SELECT 
  'Colores insertados' as tabla,
  COUNT(*) as cantidad
FROM product_colors
UNION ALL
SELECT 
  'Tallas insertadas' as tabla,
  COUNT(*) as cantidad
FROM product_sizes
UNION ALL
SELECT 
  'Imágenes insertadas' as tabla,
  COUNT(*) as cantidad
FROM product_images
UNION ALL
SELECT 
  'Tamaños de estampa insertados' as tabla,
  COUNT(*) as cantidad
FROM product_print_sizes
UNION ALL
SELECT 
  'Registros de stock insertados' as tabla,
  COUNT(*) as cantidad
FROM product_stock;

-- Mostrar resumen por producto
SELECT 
  p.nombre,
  COUNT(DISTINCT pc.id) as colores,
  COUNT(DISTINCT ps.id) as tallas,
  COUNT(DISTINCT pi.id) as imagenes,
  COUNT(DISTINCT pps.id) as tamaños_estampa,
  COUNT(DISTINCT pst.id) as registros_stock
FROM products p
LEFT JOIN product_colors pc ON p.id = pc.product_id
LEFT JOIN product_sizes ps ON p.id = ps.product_id
LEFT JOIN product_images pi ON p.id = pi.product_id
LEFT JOIN product_print_sizes pps ON p.id = pps.product_id
LEFT JOIN product_stock pst ON p.id = pst.product_id
GROUP BY p.id, p.nombre
ORDER BY p.nombre;

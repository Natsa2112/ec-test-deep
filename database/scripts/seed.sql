-- Seed de datos de prueba para TechStore

-- ============================================================
-- CATEGORÍAS
-- ============================================================
INSERT INTO categorias (id, nombre, slug, orden) VALUES
  ('10000000-0000-0000-0000-000000000001', 'Celulares',       'celulares',        1),
  ('10000000-0000-0000-0000-000000000002', 'Computación',     'computacion',      2),
  ('10000000-0000-0000-0000-000000000003', 'Audio',           'audio',            3),
  ('10000000-0000-0000-0000-000000000004', 'TV y Video',      'tv-y-video',       4),
  ('10000000-0000-0000-0000-000000000005', 'Gaming',          'gaming',           5);

INSERT INTO categorias (id, nombre, slug, padre_id, orden) VALUES
  ('10000000-0000-0000-0000-000000000006', 'Smartphones',          'smartphones',          '10000000-0000-0000-0000-000000000001', 1),
  ('10000000-0000-0000-0000-000000000007', 'Accesorios Celulares', 'accesorios-celulares', '10000000-0000-0000-0000-000000000001', 2),
  ('10000000-0000-0000-0000-000000000008', 'Notebooks',            'notebooks',            '10000000-0000-0000-0000-000000000002', 1),
  ('10000000-0000-0000-0000-000000000009', 'PC Escritorio',        'pc-escritorio',        '10000000-0000-0000-0000-000000000002', 2),
  ('10000000-0000-0000-0000-00000000000a', 'Periféricos',          'perifericos',          '10000000-0000-0000-0000-000000000002', 3),
  ('10000000-0000-0000-0000-00000000000b', 'Auriculares',          'auriculares',          '10000000-0000-0000-0000-000000000003', 1),
  ('10000000-0000-0000-0000-00000000000c', 'Parlantes',            'parlantes',            '10000000-0000-0000-0000-000000000003', 2),
  ('10000000-0000-0000-0000-00000000000d', 'Smart TV',             'smart-tv',             '10000000-0000-0000-0000-000000000004', 1),
  ('10000000-0000-0000-0000-00000000000e', 'Proyectores',          'proyectores',          '10000000-0000-0000-0000-000000000004', 2),
  ('10000000-0000-0000-0000-00000000000f', 'Consolas',             'consolas',             '10000000-0000-0000-0000-000000000005', 1),
  ('10000000-0000-0000-0000-000000000010', 'Accesorios Gaming',    'accesorios-gaming',    '10000000-0000-0000-0000-000000000005', 2);

-- ============================================================
-- USUARIOS (contraseña: "password123" en bcrypt)
-- ============================================================
INSERT INTO usuarios (id, email, password_hash, nombre, apellido, rol, actualizado_en) VALUES
  ('20000000-0000-0000-0000-000000000001', 'admin@techstore.com',
   '$2a$10$Y/620EM3KCTRZL0mBtY/je.yly8UCFUhNEldzrq0Wjv1u1HThUR1m',
   'Admin', 'TechStore', 'admin', NOW()),
  ('20000000-0000-0000-0000-000000000002', 'cliente@test.com',
   '$2a$10$Y/620EM3KCTRZL0mBtY/je.yly8UCFUhNEldzrq0Wjv1u1HThUR1m',
   'Carlos', 'González', 'cliente', NOW());

-- ============================================================
-- PRODUCTOS
-- ============================================================
INSERT INTO productos (id, categoria_id, nombre, slug, descripcion, precio, precio_anterior, stock, sku, marca, destacado, en_oferta, descuento, imagenes, updated_at) VALUES
  ('30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000006',
   'iPhone 15 Pro Max 256GB', 'iphone-15-pro-max-256gb',
   'El iPhone más potente. Chip A17 Pro, cámara de 48 MP con zoom óptico 5x, pantalla Super Retina XDR de 6.7 pulgadas.',
   1599999, 1799999, 25, 'APP-IP15PM-256', 'Apple', TRUE, TRUE, 11,
   ARRAY['https://via.placeholder.com/600x600?text=iPhone+15+Pro+Max'], NOW()),

  ('30000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000006',
   'Samsung Galaxy S24 Ultra', 'samsung-galaxy-s24-ultra',
   'Galaxy AI integrado. Pantalla Dynamic AMOLED 2x de 6.8 pulgadas, cámara de 200 MP, S Pen incluido.',
   1449999, 1649999, 30, 'SAM-GS24U-256', 'Samsung', TRUE, TRUE, 12,
   ARRAY['https://via.placeholder.com/600x600?text=Galaxy+S24+Ultra'], NOW()),

  ('30000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000006',
   'Motorola Edge 50 Pro', 'motorola-edge-50-pro',
   'Pantalla pOLED 6.7 pulgadas 144Hz, cámara de 50 MP OIS, carga turbo 125W.',
   699999, 849999, 40, 'MOT-ED50P-256', 'Motorola', FALSE, TRUE, 18,
   ARRAY['https://via.placeholder.com/600x600?text=Motorola+Edge+50+Pro'], NOW()),

  ('30000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000006',
   'Xiaomi 14 Pro', 'xiaomi-14-pro',
   'Snapdragon 8 Gen 3, pantalla AMOLED 6.73" 120Hz, cámara Leica de 50 MP, HyperCharge 120W.',
   799999, 949999, 35, 'XIA-14PRO-256', 'Xiaomi', FALSE, TRUE, 16,
   ARRAY['https://via.placeholder.com/600x600?text=Xiaomi+14+Pro'], NOW()),

  ('30000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000007',
   'Funda Silicona iPhone 15 Pro Max', 'funda-silicona-iphone-15-pro-max',
   'Funda de silicona líquida con microfibra interior. Protección contra caídas de hasta 2m.',
   24999, 34999, 200, 'ACC-FUN-IP15PM', 'Generic', FALSE, TRUE, 29,
   ARRAY['https://via.placeholder.com/600x600?text=Funda+iPhone'], NOW()),

  ('30000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000007',
   'Cargador USB-C 65W GaN', 'cargador-usb-c-65w-gan',
   'Cargador compacto con tecnología GaN. 2 puertos USB-C + 1 USB-A. Compatible con cualquier dispositivo.',
   34999, 44999, 150, 'ACC-CHG-65WGAN', 'Baseus', FALSE, TRUE, 22,
   ARRAY['https://via.placeholder.com/600x600?text=Cargador+GaN+65W'], NOW()),

  ('30000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000008',
   'MacBook Pro 14" M3 Pro', 'macbook-pro-14-m3-pro',
   'Chip M3 Pro con CPU de 12 núcleos y GPU de 18 núcleos. 18GB RAM unificada, 512GB SSD. Pantalla Liquid Retina XDR.',
   2499999, 2799999, 15, 'APP-MBP14-M3P', 'Apple', TRUE, TRUE, 11,
   ARRAY['https://via.placeholder.com/600x600?text=MacBook+Pro+14'], NOW()),

  ('30000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000008',
   'Lenovo ThinkPad X1 Carbon Gen 11', 'lenovo-thinkpad-x1-carbon-gen-11',
   'Ultrabook empresarial. Intel Core i7-1365U, 16GB RAM, 512GB SSD. Pantalla 14" WQUXGA táctil. Peso: 1.12kg.',
   1899999, 2199999, 10, 'LEN-TPX1C-G11', 'Lenovo', FALSE, TRUE, 14,
   ARRAY['https://via.placeholder.com/600x600?text=ThinkPad+X1+Carbon'], NOW()),

  ('30000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000008',
   'Dell XPS 15 OLED', 'dell-xps-15-oled',
   'Intel Core i7-13700H, 16GB DDR5, 512GB SSD. Pantalla 15.6" 3.5K OLED táctil. Altavoces quad-speaker.',
   2199999, 2499999, 12, 'DEL-XPS15-OLED', 'Dell', FALSE, TRUE, 12,
   ARRAY['https://via.placeholder.com/600x600?text=Dell+XPS+15+OLED'], NOW()),

  ('30000000-0000-0000-0000-000000000010', '10000000-0000-0000-0000-000000000009',
   'PC Gamer Ryzen 7 + RTX 4070', 'pc-gamer-ryzen-7-rtx-4070',
   'AMD Ryzen 7 7800X3D, 32GB DDR5, RTX 4070 12GB, SSD 1TB NVMe. Ideal para gaming en 1440p/4K.',
   1799999, 1999999, 8, 'PCG-R7-4070', 'Armada', TRUE, TRUE, 10,
   ARRAY['https://via.placeholder.com/600x600?text=PC+Gamer+Ryzen+7'], NOW()),

  ('30000000-0000-0000-0000-000000000011', '10000000-0000-0000-0000-00000000000a',
   'Logitech MX Master 3S', 'logitech-mx-master-3s',
   'Mouse inalámbrico ergonómico. Sensor 8000 DPI, scroll electromagnético, batería 70 días. USB-C + Bluetooth.',
   89999, 109999, 60, 'LOG-MX3S', 'Logitech', FALSE, TRUE, 18,
   ARRAY['https://via.placeholder.com/600x600?text=Logitech+MX+Master+3S'], NOW()),

  ('30000000-0000-0000-0000-000000000012', '10000000-0000-0000-0000-00000000000a',
   'Teclado Mecánico Keychron Q1 Pro', 'teclado-mecanico-keychron-q1-pro',
   'Teclado mecánico inalámbrico 75%. Switches Gateron G Pro, construcción en aluminio, RGB, QMK/VIA.',
   149999, 179999, 35, 'KEY-Q1PRO', 'Keychron', FALSE, TRUE, 17,
   ARRAY['https://via.placeholder.com/600x600?text=Keychron+Q1+Pro'], NOW()),

  ('30000000-0000-0000-0000-000000000013', '10000000-0000-0000-0000-00000000000b',
   'Sony WH-1000XM5', 'sony-wh-1000xm5',
   'Auriculares inalámbricos con cancelación de ruido líder. 30h de batería, carga rápida, Hi-Res Audio.',
   329999, 399999, 45, 'SON-WH1000XM5', 'Sony', TRUE, TRUE, 18,
   ARRAY['https://via.placeholder.com/600x600?text=Sony+WH-1000XM5'], NOW()),

  ('30000000-0000-0000-0000-000000000014', '10000000-0000-0000-0000-00000000000b',
   'AirPods Pro 2 USB-C', 'airpods-pro-2-usb-c',
   'Audio adaptativo, cancelación activa de ruido 2x mejor, chip H2, estuche MagSafe USB-C.',
   249999, 299999, 80, 'APP-AIRPODSP2', 'Apple', FALSE, TRUE, 17,
   ARRAY['https://via.placeholder.com/600x600?text=AirPods+Pro+2'], NOW()),

  ('30000000-0000-0000-0000-000000000015', '10000000-0000-0000-0000-00000000000c',
   'JBL Charge 5', 'jbl-charge-5',
   'Parlante Bluetooth portátil. Sonido potente con graves profundos. 20h de batería. IP67. Powerbank integrado.',
   159999, 189999, 55, 'JBL-CHARGE5', 'JBL', FALSE, TRUE, 16,
   ARRAY['https://via.placeholder.com/600x600?text=JBL+Charge+5'], NOW()),

  ('30000000-0000-0000-0000-000000000016', '10000000-0000-0000-0000-00000000000d',
   'Samsung QLED 65" Q80C', 'samsung-qled-65-q80c',
   'Smart TV 4K 65" con Quantum HDR, Neural Quantum Processor 4K, Dolby Atmos, Gaming Hub.',
   1299999, 1599999, 10, 'SAM-Q65-Q80C', 'Samsung', TRUE, TRUE, 19,
   ARRAY['https://via.placeholder.com/600x600?text=Samsung+QLED+65'], NOW()),

  ('30000000-0000-0000-0000-000000000017', '10000000-0000-0000-0000-00000000000d',
   'LG OLED evo 55" C3', 'lg-oled-evo-55-c3',
   'TV OLED 4K 55" con procesador α9 Gen6 AI, Dolby Vision, Dolby Atmos, G-SYNC, FreeSync.',
   1099999, 1399999, 12, 'LG-OLED55-C3', 'LG', FALSE, TRUE, 21,
   ARRAY['https://via.placeholder.com/600x600?text=LG+OLED+55+C3'], NOW()),

  ('30000000-0000-0000-0000-000000000018', '10000000-0000-0000-0000-00000000000f',
   'PlayStation 5 Slim Digital', 'playstation-5-slim-digital',
   'PS5 Slim edición digital. SSD 1TB, mando DualSense, soporte vertical incluido. Resolución 4K, 120fps.',
   599999, 699999, 20, 'SON-PS5-SLIM-D', 'Sony', TRUE, TRUE, 14,
   ARRAY['https://via.placeholder.com/600x600?text=PS5+Slim'], NOW()),

  ('30000000-0000-0000-0000-000000000019', '10000000-0000-0000-0000-00000000000f',
   'Xbox Series X 1TB', 'xbox-series-x-1tb',
   'La consola más potente de Microsoft. SSD 1TB, 12 TFLOPS, 4K a 60fps, retrocompatible con 4 generaciones.',
   649999, 749999, 15, 'MS-XBSX-1TB', 'Microsoft', FALSE, TRUE, 13,
   ARRAY['https://via.placeholder.com/600x600?text=Xbox+Series+X'], NOW()),

  ('30000000-0000-0000-0000-00000000001a', '10000000-0000-0000-0000-000000000010',
   'Silla Gamer Corsair TC100', 'silla-gamer-corsair-tc100',
   'Silla ergonómica para gaming. Reposabrazos 4D, soporte lumbar ajustable, inclinación 180°. Piel de PU premium.',
   299999, 379999, 18, 'COR-TC100', 'Corsair', FALSE, TRUE, 21,
   ARRAY['https://via.placeholder.com/600x600?text=Silla+Gamer+Corsair'], NOW());

-- ============================================================
-- ESPECIFICACIONES TÉCNICAS
-- ============================================================
INSERT INTO especificaciones_producto (id, producto_id, atributo, valor) VALUES
  (gen_random_uuid(), '30000000-0000-0000-0000-000000000001', 'Pantalla', '6.7" Super Retina XDR OLED'),
  (gen_random_uuid(), '30000000-0000-0000-0000-000000000001', 'Procesador', 'A17 Pro (3nm)'),
  (gen_random_uuid(), '30000000-0000-0000-0000-000000000001', 'RAM', '8GB'),
  (gen_random_uuid(), '30000000-0000-0000-0000-000000000001', 'Almacenamiento', '256GB'),
  (gen_random_uuid(), '30000000-0000-0000-0000-000000000001', 'Batería', '4422 mAh'),
  (gen_random_uuid(), '30000000-0000-0000-0000-000000000001', 'Cámara trasera', '48MP + 12MP + 12MP'),
  (gen_random_uuid(), '30000000-0000-0000-0000-000000000001', 'Cámara frontal', '12MP TrueDepth'),
  (gen_random_uuid(), '30000000-0000-0000-0000-000000000001', 'Sistema operativo', 'iOS 17'),

  (gen_random_uuid(), '30000000-0000-0000-0000-000000000002', 'Pantalla', '6.8" Dynamic AMOLED 2x'),
  (gen_random_uuid(), '30000000-0000-0000-0000-000000000002', 'Procesador', 'Snapdragon 8 Gen 3'),
  (gen_random_uuid(), '30000000-0000-0000-0000-000000000002', 'RAM', '12GB'),
  (gen_random_uuid(), '30000000-0000-0000-0000-000000000002', 'Almacenamiento', '256GB'),
  (gen_random_uuid(), '30000000-0000-0000-0000-000000000002', 'Batería', '5000 mAh'),
  (gen_random_uuid(), '30000000-0000-0000-0000-000000000002', 'Cámara trasera', '200MP + 50MP + 12MP + 10MP'),
  (gen_random_uuid(), '30000000-0000-0000-0000-000000000002', 'Sistema operativo', 'Android 14 / One UI 6.1'),
  (gen_random_uuid(), '30000000-0000-0000-0000-000000000002', 'S Pen', 'Integrado'),

  (gen_random_uuid(), '30000000-0000-0000-0000-000000000007', 'Pantalla', '14.2" Liquid Retina XDR'),
  (gen_random_uuid(), '30000000-0000-0000-0000-000000000007', 'Procesador', 'Apple M3 Pro'),
  (gen_random_uuid(), '30000000-0000-0000-0000-000000000007', 'RAM', '18GB unificada'),
  (gen_random_uuid(), '30000000-0000-0000-0000-000000000007', 'Almacenamiento', '512GB SSD'),
  (gen_random_uuid(), '30000000-0000-0000-0000-000000000007', 'Batería', 'Hasta 18 horas'),
  (gen_random_uuid(), '30000000-0000-0000-0000-000000000007', 'Puertos', '3x Thunderbolt 4, HDMI, SDXC, MagSafe 3'),
  (gen_random_uuid(), '30000000-0000-0000-0000-000000000007', 'Peso', '1.61 kg'),

  (gen_random_uuid(), '30000000-0000-0000-0000-000000000013', 'Tipo', 'Over-ear inalámbrico'),
  (gen_random_uuid(), '30000000-0000-0000-0000-000000000013', 'Cancelación de ruido', 'Sí (Auto NC Optimizer)'),
  (gen_random_uuid(), '30000000-0000-0000-0000-000000000013', 'Autonomía', '30h (NC on) / 40h (NC off)'),
  (gen_random_uuid(), '30000000-0000-0000-0000-000000000013', 'Carga rápida', '3 min = 3h de reproducción'),
  (gen_random_uuid(), '30000000-0000-0000-0000-000000000013', 'Códecs', 'LDAC, AAC, SBC'),
  (gen_random_uuid(), '30000000-0000-0000-0000-000000000013', 'Conectividad', 'Bluetooth 5.2, NFC, jack 3.5mm'),
  (gen_random_uuid(), '30000000-0000-0000-0000-000000000013', 'Peso', '250g'),

  (gen_random_uuid(), '30000000-0000-0000-0000-000000000016', 'Tamaño', '65"'),
  (gen_random_uuid(), '30000000-0000-0000-0000-000000000016', 'Resolución', '4K (3840 x 2160)'),
  (gen_random_uuid(), '30000000-0000-0000-0000-000000000016', 'Tecnología', 'QLED Quantum HDR'),
  (gen_random_uuid(), '30000000-0000-0000-0000-000000000016', 'Procesador', 'Neural Quantum Processor 4K'),
  (gen_random_uuid(), '30000000-0000-0000-0000-000000000016', 'HDR', 'HDR10+, HLG'),
  (gen_random_uuid(), '30000000-0000-0000-0000-000000000016', 'Audio', 'Dolby Atmos, 2.2.2 canales (60W)'),
  (gen_random_uuid(), '30000000-0000-0000-0000-000000000016', 'Smart TV', 'Tizen OS'),
  (gen_random_uuid(), '30000000-0000-0000-0000-000000000016', 'Gaming', 'FreeSync, Game Motion Plus');

-- ============================================================
-- RESEÑAS
-- ============================================================
INSERT INTO resenas (id, producto_id, usuario_id, calificacion, comentario) VALUES
  (gen_random_uuid(), '30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002', 5,
   'Espectacular teléfono, la cámara es increíble y la batería dura todo el día.'),
  (gen_random_uuid(), '30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', 5,
   'El S Pen y las funciones de IA lo hacen único. Muy contento con la compra.'),
  (gen_random_uuid(), '30000000-0000-0000-0000-000000000007', '20000000-0000-0000-0000-000000000002', 4,
   'Potente y silenciosa. Ideal para desarrollo. El precio es elevado pero vale cada peso.'),
  (gen_random_uuid(), '30000000-0000-0000-0000-000000000013', '20000000-0000-0000-0000-000000000002', 5,
   'La cancelación de ruido es de otro nivel. Ideal para trabajar o viajar.'),
  (gen_random_uuid(), '30000000-0000-0000-0000-000000000016', '20000000-0000-0000-0000-000000000002', 4,
   'Excelente calidad de imagen. El Smart TV es muy fluido. Sonido mejorable con una soundbar.');

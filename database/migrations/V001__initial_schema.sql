-- V001__initial_schema.sql
-- Creación de enums, tablas, relaciones e índices iniciales

-- ============================================================
-- ENUMS
-- ============================================================
CREATE TYPE rol AS ENUM ('cliente', 'admin');
CREATE TYPE estado_pedido AS ENUM (
  'pendiente', 'confirmado', 'pagado', 'en_preparacion',
  'enviado', 'entregado', 'cancelado', 'reembolsado'
);

-- ============================================================
-- TABLAS
-- ============================================================

-- Usuarios
CREATE TABLE usuarios (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  email         TEXT        NOT NULL UNIQUE,
  password_hash TEXT        NOT NULL,
  nombre        TEXT        NOT NULL,
  apellido      TEXT        NOT NULL,
  telefono      TEXT,
  avatar_url    TEXT,
  rol           rol         NOT NULL DEFAULT 'cliente',
  creado_en     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Direcciones
CREATE TABLE direcciones (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id    UUID        NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  alias         TEXT        NOT NULL DEFAULT 'Principal',
  direccion     TEXT        NOT NULL,
  ciudad        TEXT        NOT NULL,
  provincia     TEXT        NOT NULL,
  codigo_postal TEXT        NOT NULL,
  pais          TEXT        NOT NULL DEFAULT 'Argentina',
  es_principal  BOOLEAN     NOT NULL DEFAULT FALSE,
  creado_en     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Categorías (auto-referenciadas para árbol)
CREATE TABLE categorias (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre        TEXT        NOT NULL,
  slug          TEXT        NOT NULL UNIQUE,
  descripcion   TEXT,
  imagen_url    TEXT,
  padre_id      UUID        REFERENCES categorias(id) ON DELETE SET NULL,
  activo        BOOLEAN     NOT NULL DEFAULT TRUE,
  orden         INTEGER     NOT NULL DEFAULT 0,
  creado_en     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Productos
CREATE TABLE productos (
  id              UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
  categoria_id    UUID          NOT NULL REFERENCES categorias(id),
  nombre          TEXT          NOT NULL,
  slug            TEXT          NOT NULL UNIQUE,
  descripcion     TEXT,
  precio          DECIMAL(12,2) NOT NULL,
  precio_anterior DECIMAL(12,2),
  stock           INTEGER       NOT NULL DEFAULT 0,
  sku             TEXT          UNIQUE,
  marca           TEXT,
  peso_kg         DECIMAL(6,2),
  activo          BOOLEAN       NOT NULL DEFAULT TRUE,
  destacado       BOOLEAN       NOT NULL DEFAULT FALSE,
  en_oferta       BOOLEAN       NOT NULL DEFAULT FALSE,
  descuento       INTEGER       NOT NULL DEFAULT 0,
  rating          DECIMAL(2,1)  NOT NULL DEFAULT 0.0,
  imagenes        TEXT[],
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Índice parcial para consultas de productos activos
CREATE INDEX idx_productos_activos ON productos (id) WHERE activo = TRUE;

-- Especificaciones de producto
CREATE TABLE especificaciones_producto (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  producto_id UUID NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
  atributo    TEXT NOT NULL,
  valor       TEXT NOT NULL
);

-- Carritos
CREATE TABLE carrito (
  id              UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id      UUID        UNIQUE REFERENCES usuarios(id) ON DELETE CASCADE,
  token_session   TEXT,
  creado_en       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Items del carrito
CREATE TABLE carrito_items (
  id              UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
  carrito_id      UUID          NOT NULL REFERENCES carrito(id) ON DELETE CASCADE,
  producto_id     UUID          NOT NULL REFERENCES productos(id),
  cantidad        INTEGER       NOT NULL DEFAULT 1,
  precio_unitario DECIMAL(12,2) NOT NULL
);

-- Pedidos
CREATE TABLE pedidos (
  id                  UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id          UUID          NOT NULL REFERENCES usuarios(id),
  numero_pedido       TEXT          NOT NULL UNIQUE,
  estado              estado_pedido NOT NULL DEFAULT 'pendiente',
  subtotal            DECIMAL(12,2) NOT NULL,
  envio_costo         DECIMAL(10,2) NOT NULL DEFAULT 0,
  descuento           DECIMAL(10,2) NOT NULL DEFAULT 0,
  total               DECIMAL(12,2) NOT NULL,
  metodo_pago         TEXT,
  metodo_envio        TEXT,
  direccion_envio_id  UUID          REFERENCES direcciones(id),
  nota                TEXT,
  tracking_number     TEXT,
  pagado_en           TIMESTAMPTZ,
  creado_en           TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  actualizado_en      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Items del pedido
CREATE TABLE pedido_items (
  id              UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
  pedido_id       UUID          NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  producto_id     UUID          NOT NULL REFERENCES productos(id),
  nombre_producto TEXT          NOT NULL,
  precio_unitario DECIMAL(12,2) NOT NULL,
  cantidad        INTEGER       NOT NULL,
  subtotal        DECIMAL(12,2) NOT NULL
);

-- Historial de pedidos
CREATE TABLE pedido_historial (
  id          UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
  pedido_id   UUID          NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  estado      estado_pedido NOT NULL,
  comentario  TEXT,
  creado_en   TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Reseñas
CREATE TABLE resenas (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  producto_id  UUID        NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
  usuario_id   UUID        NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  calificacion INTEGER     NOT NULL CHECK (calificacion >= 1 AND calificacion <= 5),
  comentario   TEXT,
  creado_en    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (producto_id, usuario_id)
);

-- ============================================================
-- ÍNDICES ADICIONALES
-- ============================================================
CREATE INDEX idx_direcciones_usuario    ON direcciones(usuario_id);
CREATE INDEX idx_categorias_padre       ON categorias(padre_id);
CREATE INDEX idx_productos_categoria    ON productos(categoria_id);
CREATE INDEX idx_productos_precio       ON productos(precio);
CREATE INDEX idx_productos_destacado    ON productos(destacado) WHERE destacado = TRUE;
CREATE INDEX idx_productos_en_oferta    ON productos(en_oferta) WHERE en_oferta = TRUE;
CREATE INDEX idx_especificaciones_producto ON especificaciones_producto(producto_id);
CREATE INDEX idx_carrito_usuario        ON carrito(usuario_id);
CREATE INDEX idx_carrito_token          ON carrito(token_session);
CREATE INDEX idx_carrito_items_carrito  ON carrito_items(carrito_id);
CREATE INDEX idx_carrito_items_producto ON carrito_items(producto_id);
CREATE INDEX idx_pedidos_usuario        ON pedidos(usuario_id);
CREATE INDEX idx_pedidos_estado         ON pedidos(estado);
CREATE INDEX idx_pedidos_creado_en      ON pedidos(creado_en DESC);
CREATE INDEX idx_pedido_items_pedido    ON pedido_items(pedido_id);
CREATE INDEX idx_pedido_items_producto  ON pedido_items(producto_id);
CREATE INDEX idx_pedido_historial_pedido ON pedido_historial(pedido_id);
CREATE INDEX idx_resenas_producto       ON resenas(producto_id);
CREATE INDEX idx_resenas_usuario        ON resenas(usuario_id);

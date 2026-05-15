-- ============================================================
-- MIGRACIÓN 002: Productos Hacendado
-- Catálogo de productos de la marca Hacendado con precios reales
-- ============================================================

CREATE TABLE IF NOT EXISTS productos_hacendado (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre              VARCHAR(255) NOT NULL,
    categoria           VARCHAR(100) NOT NULL,
    seccion_tienda      VARCHAR(100) NOT NULL,
    precio              NUMERIC(6,2) NOT NULL,
    unidad_venta        VARCHAR(20) NOT NULL,
    cantidad_por_envase NUMERIC(8,3) NOT NULL,
    unidad_base         VARCHAR(10) NOT NULL,
    foto_url            VARCHAR(500),
    CONSTRAINT chk_seccion CHECK (
        seccion_tienda IN (
            'Frutas y Verduras',
            'Carnes y Aves',
            'Pescados y Mariscos',
            'Lácteos y Huevos',
            'Panadería y Bollería',
            'Aceites y Conservas',
            'Pasta, Arroz y Legumbres',
            'Condimentos y Especias',
            'Bebidas',
            'Congelados',
            'Otros'
        )
    )
);

-- Índice para filtrar por sección (usado en la lista de compra agrupada)
CREATE INDEX IF NOT EXISTS idx_productos_seccion ON productos_hacendado(seccion_tienda);
CREATE INDEX IF NOT EXISTS idx_productos_categoria ON productos_hacendado(categoria);

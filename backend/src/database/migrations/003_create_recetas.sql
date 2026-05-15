-- ============================================================
-- MIGRACIÓN 003: Recetas, Pasos e Ingredientes
-- ============================================================

CREATE TABLE IF NOT EXISTS recetas (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre          VARCHAR(255) NOT NULL,
    descripcion     TEXT,
    foto_url        VARCHAR(500),
    tiempo_minutos  INTEGER NOT NULL,
    raciones_base   INTEGER NOT NULL DEFAULT 4,
    semana_activa   DATE,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tags dietéticos por receta (relación N:M)
CREATE TABLE IF NOT EXISTS recetas_tags (
    receta_id   UUID NOT NULL REFERENCES recetas(id) ON DELETE CASCADE,
    tag         VARCHAR(50) NOT NULL,
    CONSTRAINT chk_tag CHECK (
        tag IN ('VEGANO', 'VEGETARIANO', 'SIN_GLUTEN', 'SIN_LACTOSA', 'SIN_HUEVO')
    ),
    PRIMARY KEY (receta_id, tag)
);

-- Pasos de elaboración
CREATE TABLE IF NOT EXISTS pasos_receta (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    receta_id   UUID NOT NULL REFERENCES recetas(id) ON DELETE CASCADE,
    orden       INTEGER NOT NULL,
    descripcion TEXT NOT NULL,
    UNIQUE(receta_id, orden)
);

-- Ingredientes: relación N:M entre receta y producto
CREATE TABLE IF NOT EXISTS ingredientes_receta (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    receta_id       UUID NOT NULL REFERENCES recetas(id) ON DELETE CASCADE,
    producto_id     UUID NOT NULL REFERENCES productos_hacendado(id),
    cantidad_base   NUMERIC(8,3) NOT NULL,
    unidad          VARCHAR(20) NOT NULL,
    nombre_display  VARCHAR(100),
    UNIQUE(receta_id, producto_id)
);

-- Índices de rendimiento
CREATE INDEX IF NOT EXISTS idx_recetas_semana    ON recetas(semana_activa);
CREATE INDEX IF NOT EXISTS idx_ing_receta_id     ON ingredientes_receta(receta_id);
CREATE INDEX IF NOT EXISTS idx_ing_producto_id   ON ingredientes_receta(producto_id);
CREATE INDEX IF NOT EXISTS idx_pasos_receta_id   ON pasos_receta(receta_id);

-- Índice de búsqueda full-text en español
CREATE INDEX IF NOT EXISTS idx_recetas_nombre_fts
    ON recetas USING GIN(to_tsvector('spanish', nombre));

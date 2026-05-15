-- ============================================================
-- MIGRACIÓN 005: Favoritos
-- Relación N:M usuario ↔ receta con clave primaria compuesta
-- ============================================================

CREATE TABLE IF NOT EXISTS favoritos (
    usuario_id  UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    receta_id   UUID NOT NULL REFERENCES recetas(id) ON DELETE CASCADE,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (usuario_id, receta_id)
);

CREATE INDEX IF NOT EXISTS idx_favoritos_usuario ON favoritos(usuario_id);

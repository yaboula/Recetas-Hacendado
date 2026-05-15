-- ============================================================
-- MIGRACION 009: Campos premium de recetas y contenido editorial
-- ============================================================

-- 1. Campos nuevos en recetas
ALTER TABLE recetas
ADD COLUMN IF NOT EXISTS cocina VARCHAR(80);

-- 2. Agrupacion de ingredientes por seccion
ALTER TABLE ingredientes_receta
ADD COLUMN IF NOT EXISTS grupo VARCHAR(80);

-- 3. Consejos y trucos
CREATE TABLE IF NOT EXISTS recetas_consejos (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    receta_id   UUID NOT NULL REFERENCES recetas(id) ON DELETE CASCADE,
    orden       INTEGER NOT NULL,
    texto       TEXT NOT NULL,
    UNIQUE(receta_id, orden)
);

-- 4. FAQ
CREATE TABLE IF NOT EXISTS recetas_faq (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    receta_id   UUID NOT NULL REFERENCES recetas(id) ON DELETE CASCADE,
    orden       INTEGER NOT NULL,
    pregunta    TEXT NOT NULL,
    respuesta   TEXT NOT NULL,
    UNIQUE(receta_id, orden)
);

-- 5. Reviews / comentarios
CREATE TABLE IF NOT EXISTS recetas_reviews (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    receta_id   UUID NOT NULL REFERENCES recetas(id) ON DELETE CASCADE,
    usuario     VARCHAR(120) NOT NULL,
    rating      INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comentario  TEXT NOT NULL,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_recetas_consejos_receta_id ON recetas_consejos(receta_id);
CREATE INDEX IF NOT EXISTS idx_recetas_faq_receta_id ON recetas_faq(receta_id);
CREATE INDEX IF NOT EXISTS idx_recetas_reviews_receta_id ON recetas_reviews(receta_id);

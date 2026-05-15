-- ============================================================
-- MIGRACIÓN 008: Extender metadatos de recetas (Hogarmania)
-- ============================================================

-- 1. Añadir nuevos campos a la tabla recetas
ALTER TABLE recetas 
ADD COLUMN IF NOT EXISTS dificultad VARCHAR(50),
ADD COLUMN IF NOT EXISTS categoria VARCHAR(100),
ADD COLUMN IF NOT EXISTS calorias_racion INTEGER,
ADD COLUMN IF NOT EXISTS autor_origen VARCHAR(255);

-- 2. Eliminar la restricción estricta de tags para permitir tags libres (origen externo)
ALTER TABLE recetas_tags DROP CONSTRAINT IF EXISTS chk_tag;

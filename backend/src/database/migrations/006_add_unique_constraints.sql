-- ============================================================
-- MIGRACIÓN 006: Añadir constraints UNIQUE para idempotencia del seed
-- ============================================================

-- Evita productos duplicados por nombre
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'uq_productos_nombre'
    ) THEN
        ALTER TABLE productos_hacendado
            ADD CONSTRAINT uq_productos_nombre UNIQUE (nombre);
    END IF;
END $$;

-- Evita recetas duplicadas por nombre
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'uq_recetas_nombre'
    ) THEN
        ALTER TABLE recetas
            ADD CONSTRAINT uq_recetas_nombre UNIQUE (nombre);
    END IF;
END $$;

-- ============================================================
-- MIGRACIÓN 004: Lista de Compra
-- Cada usuario tiene exactamente UNA lista activa
-- ============================================================

CREATE TABLE IF NOT EXISTS listas_compra (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id  UUID UNIQUE NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS items_lista (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lista_id        UUID NOT NULL REFERENCES listas_compra(id) ON DELETE CASCADE,
    producto_id     UUID NOT NULL REFERENCES productos_hacendado(id),
    cantidad_total  NUMERIC(8,3) NOT NULL,
    unidad          VARCHAR(20) NOT NULL,
    cogido          BOOLEAN DEFAULT FALSE,
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    -- Garantiza que no puede haber dos filas del mismo producto en la misma lista
    UNIQUE(lista_id, producto_id)
);

CREATE INDEX IF NOT EXISTS idx_items_lista_id    ON items_lista(lista_id);
CREATE INDEX IF NOT EXISTS idx_items_cogido      ON items_lista(lista_id, cogido);

ALTER TABLE productos_hacendado
  ADD COLUMN IF NOT EXISTS mercadona_id        VARCHAR(40),
  ADD COLUMN IF NOT EXISTS marca               VARCHAR(120),
  ADD COLUMN IF NOT EXISTS thumbnail_url       VARCHAR(500),
  ADD COLUMN IF NOT EXISTS image_url           VARCHAR(500),
  ADD COLUMN IF NOT EXISTS zoom_url            VARCHAR(500),
  ADD COLUMN IF NOT EXISTS share_url           VARCHAR(500),
  ADD COLUMN IF NOT EXISTS ean                 VARCHAR(32),
  ADD COLUMN IF NOT EXISTS packaging           VARCHAR(120),
  ADD COLUMN IF NOT EXISTS published           BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS activo              BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS categoria_mercadona VARCHAR(120),
  ADD COLUMN IF NOT EXISTS subcategoria_mercadona VARCHAR(120),
  ADD COLUMN IF NOT EXISTS precio_referencia   NUMERIC(10,3),
  ADD COLUMN IF NOT EXISTS formato_referencia  VARCHAR(20),
  ADD COLUMN IF NOT EXISTS detalles_json       JSONB,
  ADD COLUMN IF NOT EXISTS raw_json            JSONB,
  ADD COLUMN IF NOT EXISTS last_synced_at      TIMESTAMPTZ NOT NULL DEFAULT NOW();

CREATE UNIQUE INDEX IF NOT EXISTS uq_productos_hacendado_mercadona_id
  ON productos_hacendado(mercadona_id)
  WHERE mercadona_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_productos_hacendado_marca ON productos_hacendado(marca);
CREATE INDEX IF NOT EXISTS idx_productos_hacendado_activo ON productos_hacendado(activo);
CREATE INDEX IF NOT EXISTS idx_productos_hacendado_categoria_mercadona ON productos_hacendado(categoria_mercadona);

UPDATE productos_hacendado
SET thumbnail_url = COALESCE(thumbnail_url, foto_url),
    image_url = COALESCE(image_url, foto_url),
    marca = COALESCE(NULLIF(marca, ''), CASE WHEN nombre ILIKE '%hacendado%' THEN 'Hacendado' ELSE marca END),
    last_synced_at = NOW();

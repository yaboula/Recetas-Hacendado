-- ============================================================
-- MIGRACIÓN 001: Usuarios y Preferencias
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS usuarios (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           VARCHAR(255) UNIQUE NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    nombre          VARCHAR(100),
    onboarding_done BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS preferencias_usuario (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id  UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    tipo        VARCHAR(50) NOT NULL,
    CONSTRAINT chk_tipo_preferencia CHECK (
        tipo IN ('VEGANO', 'VEGETARIANO', 'SIN_GLUTEN', 'SIN_LACTOSA', 'SIN_HUEVO')
    ),
    UNIQUE(usuario_id, tipo)
);

-- Índice para búsqueda por email (login)
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);

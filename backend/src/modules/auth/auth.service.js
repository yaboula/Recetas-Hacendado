const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const pool    = require('../../config/database');

const SALT_ROUNDS = 10;

// ─────────────────────────────────────────────
// REGISTRO
// ─────────────────────────────────────────────
async function register({ email, password, nombre }) {
  // 1. Comprobar si el email ya existe
  const existing = await pool.query(
    'SELECT id FROM usuarios WHERE email = $1',
    [email.toLowerCase()]
  );
  if (existing.rows.length > 0) {
    const err = new Error('Ya existe una cuenta con ese email.');
    err.status = 409;
    err.code   = 'EMAIL_ALREADY_EXISTS';
    throw err;
  }

  // 2. Hashear la contraseña
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  // 3. Insertar usuario
  const result = await pool.query(
    `INSERT INTO usuarios (email, password_hash, nombre)
     VALUES ($1, $2, $3)
     RETURNING id, email, nombre, onboarding_done, created_at`,
    [email.toLowerCase(), passwordHash, nombre || null]
  );

  const usuario = result.rows[0];

  // 4. Generar token JWT
  const token = generateToken(usuario);

  return { usuario: sanitize(usuario), token };
}

// ─────────────────────────────────────────────
// LOGIN
// ─────────────────────────────────────────────
async function login({ email, password }) {
  // 1. Buscar usuario
  const result = await pool.query(
    'SELECT id, email, nombre, password_hash, onboarding_done FROM usuarios WHERE email = $1',
    [email.toLowerCase()]
  );

  if (result.rows.length === 0) {
    const err = new Error('Email o contraseña incorrectos.');
    err.status = 401;
    err.code   = 'INVALID_CREDENTIALS';
    throw err;
  }

  const usuario = result.rows[0];

  // 2. Verificar contraseña
  const match = await bcrypt.compare(password, usuario.password_hash);
  if (!match) {
    const err = new Error('Email o contraseña incorrectos.');
    err.status = 401;
    err.code   = 'INVALID_CREDENTIALS';
    throw err;
  }

  // 3. Obtener preferencias
  const prefs = await getPreferencias(usuario.id);

  // 4. Generar token
  const token = generateToken(usuario);

  return { usuario: { ...sanitize(usuario), preferencias: prefs }, token };
}

// ─────────────────────────────────────────────
// OBTENER PERFIL (GET /auth/me)
// ─────────────────────────────────────────────
async function getMe(usuarioId) {
  const result = await pool.query(
    'SELECT id, email, nombre, onboarding_done, created_at FROM usuarios WHERE id = $1',
    [usuarioId]
  );

  if (result.rows.length === 0) {
    const err = new Error('Usuario no encontrado.');
    err.status = 404;
    err.code   = 'USER_NOT_FOUND';
    throw err;
  }

  const usuario   = result.rows[0];
  const prefs = await getPreferencias(usuarioId);

  return { ...sanitize(usuario), preferencias: prefs };
}

// ─────────────────────────────────────────────
// ACTUALIZAR PREFERENCIAS (HU-02 — Onboarding)
// ─────────────────────────────────────────────
async function updatePreferencias(usuarioId, preferencias) {
  const TIPOS_VALIDOS = ['VEGANO', 'VEGETARIANO', 'SIN_GLUTEN', 'SIN_LACTOSA', 'SIN_HUEVO'];

  const invalidas = preferencias.filter((p) => !TIPOS_VALIDOS.includes(p));
  if (invalidas.length > 0) {
    const err = new Error(`Preferencias inválidas: ${invalidas.join(', ')}`);
    err.status = 400;
    err.code   = 'INVALID_PREFERENCES';
    throw err;
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Borrar las anteriores y reinsertar (estrategia simple y fiable)
    await client.query('DELETE FROM preferencias_usuario WHERE usuario_id = $1', [usuarioId]);

    for (const tipo of preferencias) {
      await client.query(
        'INSERT INTO preferencias_usuario (usuario_id, tipo) VALUES ($1, $2)',
        [usuarioId, tipo]
      );
    }

    // Marcar onboarding como completado
    await client.query(
      'UPDATE usuarios SET onboarding_done = TRUE, updated_at = NOW() WHERE id = $1',
      [usuarioId]
    );

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }

  return getPreferencias(usuarioId);
}

// ─────────────────────────────────────────────
// ACTUALIZAR DATOS BÁSICOS DEL PERFIL (nombre, email)
// ─────────────────────────────────────────────
async function updatePerfil(usuarioId, { nombre, email }) {
  if (email) {
    const exists = await pool.query(
      'SELECT id FROM usuarios WHERE email = $1 AND id <> $2',
      [email.toLowerCase(), usuarioId]
    );
    if (exists.rows.length > 0) {
      const err = new Error('Ya existe una cuenta con ese email.');
      err.status = 409;
      err.code = 'EMAIL_ALREADY_EXISTS';
      throw err;
    }
  }

  const sets = [];
  const values = [];

  if (typeof nombre !== 'undefined') {
    sets.push(`nombre = $${sets.length + 1}`);
    values.push(nombre || null);
  }
  if (typeof email !== 'undefined') {
    sets.push(`email = $${sets.length + 1}`);
    values.push(email.toLowerCase());
  }

  if (sets.length === 0) {
    return getMe(usuarioId);
  }

  values.push(usuarioId);

  const result = await pool.query(
    `UPDATE usuarios
     SET ${sets.join(', ')}, updated_at = NOW()
     WHERE id = $${values.length}
     RETURNING id, email, nombre, onboarding_done, created_at`,
    values
  );

  const usuario = result.rows[0];
  const prefs = await getPreferencias(usuarioId);

  return { ...sanitize(usuario), preferencias: prefs };
}

// ─────────────────────────────────────────────
// CAMBIAR CONTRASEÑA
// ─────────────────────────────────────────────
async function changePassword(usuarioId, currentPassword, newPassword) {
  const result = await pool.query(
    'SELECT id, password_hash, email, nombre, onboarding_done, created_at FROM usuarios WHERE id = $1',
    [usuarioId]
  );

  if (result.rows.length === 0) {
    const err = new Error('Usuario no encontrado.');
    err.status = 404;
    err.code = 'USER_NOT_FOUND';
    throw err;
  }

  const usuario = result.rows[0];
  const match = await bcrypt.compare(currentPassword, usuario.password_hash);
  if (!match) {
    const err = new Error('La contraseña actual no es correcta.');
    err.status = 401;
    err.code = 'INVALID_CURRENT_PASSWORD';
    throw err;
  }

  const newHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await pool.query(
    'UPDATE usuarios SET password_hash = $1, updated_at = NOW() WHERE id = $2',
    [newHash, usuarioId]
  );

  const prefs = await getPreferencias(usuarioId);
  return { ...sanitize(usuario), preferencias: prefs };
}

// ─────────────────────────────────────────────
// ESTADÍSTICAS DE PERFIL
// ─────────────────────────────────────────────
async function getProfileStats(usuarioId) {
  const statsRes = await pool.query(
    `SELECT
       (SELECT COUNT(*) FROM favoritos WHERE usuario_id = $1) AS favoritos_total,
       (SELECT COUNT(*) FROM listas_compra WHERE usuario_id = $1) AS listas_totales,
       (SELECT COUNT(*) FROM items_lista i JOIN listas_compra l ON l.id = i.lista_id WHERE l.usuario_id = $1) AS items_totales,
       (SELECT COUNT(*) FROM items_lista i JOIN listas_compra l ON l.id = i.lista_id WHERE l.usuario_id = $1 AND i.cogido = FALSE) AS items_pendientes,
       (SELECT COUNT(*) FROM items_lista i JOIN listas_compra l ON l.id = i.lista_id WHERE l.usuario_id = $1 AND i.cogido = TRUE) AS items_marcados
     `,
    [usuarioId]
  );

  const stats = statsRes.rows[0];
  const usuario = await getMe(usuarioId);

  return { usuario, stats };
}

// ─────────────────────────────────────────────
// HELPERS INTERNOS
// ─────────────────────────────────────────────
function generateToken(usuario) {
  return jwt.sign(
    { id: usuario.id, email: usuario.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

async function getPreferencias(usuarioId) {
  const result = await pool.query(
    'SELECT tipo FROM preferencias_usuario WHERE usuario_id = $1',
    [usuarioId]
  );
  return result.rows.map((r) => r.tipo);
}

function sanitize(usuario) {
  const { password_hash, ...safe } = usuario;
  return safe;
}

module.exports = { register, login, getMe, updatePreferencias, updatePerfil, changePassword, getProfileStats };

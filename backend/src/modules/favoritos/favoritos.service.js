const pool = require('../../config/database');

// ─────────────────────────────────────────────
// TOGGLE FAVORITO (HU-10)
// Si existe → elimina. Si no existe → añade.
// ─────────────────────────────────────────────
async function toggleFavorito(usuarioId, recetaId) {
  // Verificar que la receta existe
  const recetaRes = await pool.query('SELECT id FROM recetas WHERE id = $1', [recetaId]);
  if (recetaRes.rows.length === 0) {
    const err = new Error('Receta no encontrada.');
    err.status = 404;
    err.code   = 'RECIPE_NOT_FOUND';
    throw err;
  }

  const existing = await pool.query(
    'SELECT 1 FROM favoritos WHERE usuario_id = $1 AND receta_id = $2',
    [usuarioId, recetaId]
  );

  if (existing.rows.length > 0) {
    await pool.query(
      'DELETE FROM favoritos WHERE usuario_id = $1 AND receta_id = $2',
      [usuarioId, recetaId]
    );
    return { receta_id: recetaId, favorito: false };
  } else {
    await pool.query(
      'INSERT INTO favoritos (usuario_id, receta_id) VALUES ($1, $2)',
      [usuarioId, recetaId]
    );
    return { receta_id: recetaId, favorito: true };
  }
}

// ─────────────────────────────────────────────
// OBTENER FAVORITOS DEL USUARIO (HU-10)
// ─────────────────────────────────────────────
async function getFavoritos(usuarioId) {
  const result = await pool.query(
    `SELECT
       r.id, r.nombre, r.descripcion, r.foto_url,
       r.tiempo_minutos, r.raciones_base,
       COALESCE(
         json_agg(DISTINCT rt.tag) FILTER (WHERE rt.tag IS NOT NULL),
         '[]'
       ) AS tags,
       f.created_at AS fecha_favorito
     FROM favoritos f
     JOIN recetas r ON r.id = f.receta_id
     LEFT JOIN recetas_tags rt ON rt.receta_id = r.id
     WHERE f.usuario_id = $1
     GROUP BY r.id, f.created_at
     ORDER BY f.created_at DESC`,
    [usuarioId]
  );

  return result.rows;
}

module.exports = { toggleFavorito, getFavoritos };

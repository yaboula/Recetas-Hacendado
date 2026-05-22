const pool = require('../../config/database');

// ─────────────────────────────────────────────
// HELPER: Convertir unidades (ej: de 'ml' a 'l', de 'g' a 'kg')
// ─────────────────────────────────────────────
function convertToBaseUnit(amount, fromUnit, toUnit) {
  if (!fromUnit || !toUnit) return amount;
  const f = fromUnit.toLowerCase().trim();
  const t = toUnit.toLowerCase().trim();
  if (f === t) return amount;
  if (f === 'g' && t === 'kg') return amount / 1000;
  if (f === 'kg' && t === 'g') return amount * 1000;
  if (f === 'ml' && t === 'l') return amount / 1000;
  if (f === 'l' && t === 'ml') return amount * 1000;
  return amount;
}

// ─────────────────────────────────────────────
// CATÁLOGO — GET /recetas
// HU-03 (catálogo) + HU-09 (filtros) + HU-11 (búsqueda)
// ─────────────────────────────────────────────
async function getCatalogo({ tags, q, semana, categoria, dificultad, cocina }) {
  const conditions = [];
  const params     = [];
  let   idx        = 1;

  // Filtro por semana activa (por defecto la semana en curso)
  if (semana) {
    conditions.push(`r.semana_activa = $${idx++}`);
    params.push(semana);
  }

  if (categoria) {
    conditions.push(`r.categoria = $${idx++}`);
    params.push(categoria);
  }

  if (dificultad) {
    conditions.push(`r.dificultad = $${idx++}`);
    params.push(dificultad);
  }

  if (cocina) {
    conditions.push(`r.cocina = $${idx++}`);
    params.push(cocina);
  }

  // Filtro de búsqueda full-text por nombre e ingredientes (HU-11)
  if (q && q.trim()) {
    conditions.push(`(
      r.nombre ILIKE $${idx}
      OR EXISTS (
        SELECT 1 FROM ingredientes_receta ir
        JOIN productos_hacendado ph ON ph.id = ir.producto_id
        WHERE ir.receta_id = r.id AND ph.nombre ILIKE $${idx}
      )
    )`);
    params.push(`%${q.trim()}%`);
    idx++;
  }

  // Filtro por tags dietéticos (HU-09) — la receta debe tener TODOS los tags pedidos
  const tagList = tags ? tags.split(',').map((t) => t.trim().toUpperCase()).filter(Boolean) : [];
  if (tagList.length > 0) {
    for (const tag of tagList) {
      conditions.push(`EXISTS (
        SELECT 1 FROM recetas_tags rt WHERE rt.receta_id = r.id AND rt.tag = $${idx++}
      )`);
      params.push(tag);
    }
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const sql = `
    SELECT
      r.id,
      r.nombre,
      r.descripcion,
      COALESCE(
        r.foto_url,
        (
          SELECT COALESCE(ph2.image_url, ph2.thumbnail_url, ph2.foto_url)
          FROM ingredientes_receta ir2
          JOIN productos_hacendado ph2 ON ph2.id = ir2.producto_id
          WHERE ir2.receta_id = r.id
            AND COALESCE(ph2.image_url, ph2.thumbnail_url, ph2.foto_url) IS NOT NULL
          ORDER BY CASE
            WHEN ph2.nombre ILIKE '%aceite%' THEN 9
            WHEN ph2.nombre ILIKE '%sal%' THEN 9
            WHEN ph2.nombre ILIKE '%ajo%' THEN 8
            WHEN ph2.nombre ILIKE '%oregano%' OR ph2.nombre ILIKE '%orégano%' THEN 8
            WHEN ph2.nombre ILIKE '%pimienta%' THEN 8
            WHEN ph2.nombre ILIKE '%pimentón%' OR ph2.nombre ILIKE '%pimenton%' THEN 8
            WHEN ph2.nombre ILIKE '%cebolla%' THEN 7
            ELSE 0
          END ASC,
          ir2.cantidad_base DESC NULLS LAST,
          ph2.nombre ASC
          LIMIT 1
        )
      ) AS foto_url,
      r.tiempo_minutos,
      r.raciones_base,
      r.semana_activa,
      r.dificultad,
      r.categoria,
      r.calorias_racion,
      r.autor_origen,
      r.cocina,
      COALESCE(
        json_agg(DISTINCT rt.tag) FILTER (WHERE rt.tag IS NOT NULL),
        '[]'
      ) AS tags
    FROM recetas r
    LEFT JOIN recetas_tags rt ON rt.receta_id = r.id
    ${whereClause}
    GROUP BY r.id
    ORDER BY r.semana_activa DESC, r.nombre ASC
  `;

  const result = await pool.query(sql, params);
  return result.rows;
}

// ─────────────────────────────────────────────
// FICHA COMPLETA — GET /recetas/:id
// HU-04 (ingredientes + pasos)
// ─────────────────────────────────────────────
async function getRecetaById(id) {
  // 1. Datos base + tags
  const recetaRes = await pool.query(
    `SELECT
       r.id,
       r.nombre,
       r.descripcion,
       COALESCE(
         r.foto_url,
         (
           SELECT COALESCE(ph2.image_url, ph2.thumbnail_url, ph2.foto_url)
           FROM ingredientes_receta ir2
           JOIN productos_hacendado ph2 ON ph2.id = ir2.producto_id
           WHERE ir2.receta_id = r.id
             AND COALESCE(ph2.image_url, ph2.thumbnail_url, ph2.foto_url) IS NOT NULL
           ORDER BY CASE
             WHEN ph2.nombre ILIKE '%aceite%' THEN 9
             WHEN ph2.nombre ILIKE '%sal%' THEN 9
             WHEN ph2.nombre ILIKE '%ajo%' THEN 8
             WHEN ph2.nombre ILIKE '%oregano%' OR ph2.nombre ILIKE '%orégano%' THEN 8
             WHEN ph2.nombre ILIKE '%pimienta%' THEN 8
             WHEN ph2.nombre ILIKE '%pimentón%' OR ph2.nombre ILIKE '%pimenton%' THEN 8
             WHEN ph2.nombre ILIKE '%cebolla%' THEN 7
             ELSE 0
           END ASC,
           ir2.cantidad_base DESC NULLS LAST,
           ph2.nombre ASC
           LIMIT 1
         )
       ) AS foto_url,
      r.tiempo_minutos, r.raciones_base, r.semana_activa,
      r.dificultad, r.categoria, r.calorias_racion, r.autor_origen, r.cocina,
       COALESCE(
         json_agg(DISTINCT rt.tag) FILTER (WHERE rt.tag IS NOT NULL),
         '[]'
       ) AS tags
     FROM recetas r
     LEFT JOIN recetas_tags rt ON rt.receta_id = r.id
     WHERE r.id = $1
     GROUP BY r.id`,
    [id]
  );

  if (recetaRes.rows.length === 0) {
    const err = new Error('Receta no encontrada.');
    err.status = 404;
    err.code   = 'RECIPE_NOT_FOUND';
    throw err;
  }

  const receta = recetaRes.rows[0];

  // 2. Ingredientes con datos del producto (para precio y nombre)
  const ingsRes = await pool.query(
    `SELECT
       ir.id,
       ir.cantidad_base,
       ir.unidad,
       ir.nombre_display,
      ir.grupo,
       ph.id           AS producto_id,
       ph.nombre       AS producto_nombre,
       ph.marca        AS producto_marca,
       ph.precio       AS producto_precio,
       ph.cantidad_por_envase,
       ph.unidad_base  AS producto_unidad_base,
       ph.seccion_tienda,
       COALESCE(ph.thumbnail_url, ph.foto_url) AS producto_thumbnail_url,
       COALESCE(ph.image_url, ph.foto_url)     AS producto_image_url,
       ph.share_url    AS producto_share_url
     FROM ingredientes_receta ir
     JOIN productos_hacendado ph ON ph.id = ir.producto_id
     WHERE ir.receta_id = $1
     ORDER BY COALESCE(ir.grupo, ''), ir.nombre_display ASC`,
    [id]
  );

  // 3. Pasos ordenados
  const pasosRes = await pool.query(
    `SELECT orden, descripcion
     FROM pasos_receta
     WHERE receta_id = $1
     ORDER BY orden ASC`,
    [id]
  );

  const consejosRes = await pool.query(
    `SELECT orden, texto
     FROM recetas_consejos
     WHERE receta_id = $1
     ORDER BY orden ASC`,
    [id]
  );

  const faqRes = await pool.query(
    `SELECT orden, pregunta, respuesta
     FROM recetas_faq
     WHERE receta_id = $1
     ORDER BY orden ASC`,
    [id]
  );

  const reviewsRes = await pool.query(
    `SELECT usuario, rating, comentario, created_at
     FROM recetas_reviews
     WHERE receta_id = $1
     ORDER BY created_at DESC`,
    [id]
  );

  return {
    ...receta,
    ingredientes: ingsRes.rows,
    pasos:        pasosRes.rows,
    consejos:     consejosRes.rows,
    faq:          faqRes.rows,
    reviews:      reviewsRes.rows,
  };
}

// ─────────────────────────────────────────────
// PRECIO ESTIMADO — GET /recetas/:id/precio
// HU-05 — coste proporcional según raciones
// ─────────────────────────────────────────────
async function getPrecio(id, raciones) {
  const recetaRes = await pool.query(
    'SELECT raciones_base FROM recetas WHERE id = $1',
    [id]
  );

  if (recetaRes.rows.length === 0) {
    const err = new Error('Receta no encontrada.');
    err.status = 404;
    err.code   = 'RECIPE_NOT_FOUND';
    throw err;
  }

  const racionesBase = recetaRes.rows[0].raciones_base;
  const factor       = raciones / racionesBase;

  const ingsRes = await pool.query(
    `SELECT ir.cantidad_base, ir.unidad AS receta_unidad, ph.precio, ph.cantidad_por_envase, ph.unidad_base AS producto_unidad
     FROM ingredientes_receta ir
     JOIN productos_hacendado ph ON ph.id = ir.producto_id
     WHERE ir.receta_id = $1`,
    [id]
  );

  // precio_por_unidad_base = precio_envase / cantidad_por_envase
  // coste_ingrediente      = cantidad_escalada × precio_por_unidad_base
  let total = 0;
  for (const ing of ingsRes.rows) {
    const cantidadConvertida = convertToBaseUnit(ing.cantidad_base, ing.receta_unidad, ing.producto_unidad);
    const cantidadEscalada    = cantidadConvertida * factor;
    const precioPorUnidadBase = ing.precio / ing.cantidad_por_envase;
    total += cantidadEscalada * precioPorUnidadBase;
  }

  return {
    receta_id:    id,
    raciones:     raciones,
    raciones_base: racionesBase,
    precio_total: parseFloat(total.toFixed(2)),
    precio_display: `Aprox. ${total.toFixed(2).replace('.', ',')} €`,
  };
}

module.exports = { getCatalogo, getRecetaById, getPrecio };

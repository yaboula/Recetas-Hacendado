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
// HELPER — obtener o crear la lista del usuario
// ─────────────────────────────────────────────
async function getOrCreateLista(usuarioId, client) {
  const db = client || pool;

  let res = await db.query(
    'SELECT id FROM listas_compra WHERE usuario_id = $1',
    [usuarioId]
  );

  if (res.rows.length === 0) {
    res = await db.query(
      'INSERT INTO listas_compra (usuario_id) VALUES ($1) RETURNING id',
      [usuarioId]
    );
  }

  return res.rows[0].id;
}

// ─────────────────────────────────────────────
// AÑADIR RECETA A LA LISTA (HU-07)
// Suma inteligente: ON CONFLICT (lista_id, producto_id) DO UPDATE
// ─────────────────────────────────────────────
async function addRecetaToLista(usuarioId, recetaId, raciones) {
  // 1. Obtener raciones_base de la receta
  const recetaRes = await pool.query(
    'SELECT raciones_base FROM recetas WHERE id = $1',
    [recetaId]
  );

  if (recetaRes.rows.length === 0) {
    const err = new Error('Receta no encontrada.');
    err.status = 404;
    err.code   = 'RECIPE_NOT_FOUND';
    throw err;
  }

  const racionesBase = recetaRes.rows[0].raciones_base;
  const factor       = raciones / racionesBase;

  // 2. Obtener ingredientes de la receta con info del producto
  const ingsRes = await pool.query(
    `SELECT ir.producto_id, ir.cantidad_base, ir.unidad AS receta_unidad, ph.cantidad_por_envase, ph.unidad_base AS producto_unidad
     FROM ingredientes_receta ir
     JOIN productos_hacendado ph ON ph.id = ir.producto_id
     WHERE ir.receta_id = $1`,
    [recetaId]
  );

  if (ingsRes.rows.length === 0) {
    const err = new Error('Esta receta no tiene ingredientes registrados.');
    err.status = 422;
    err.code   = 'RECIPE_NO_INGREDIENTS';
    throw err;
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const listaId = await getOrCreateLista(usuarioId, client);

    // 3. Para cada ingrediente: INSERT o suma (ON CONFLICT)
    for (const ing of ingsRes.rows) {
      const cantidadConvertida = convertToBaseUnit(ing.cantidad_base, ing.receta_unidad, ing.producto_unidad);
      const cantidadEscalada = parseFloat((cantidadConvertida * factor).toFixed(3));
      const envaseBase = Number(ing.cantidad_por_envase) || 1;
      const calcPaquetes = Math.ceil(cantidadEscalada / envaseBase);

      await client.query(
        `INSERT INTO items_lista (lista_id, producto_id, cantidad_total, unidad, paquetes_a_comprar)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (lista_id, producto_id)
         DO UPDATE SET
           cantidad_total = items_lista.cantidad_total + EXCLUDED.cantidad_total,
           paquetes_a_comprar = CEIL((items_lista.cantidad_total + EXCLUDED.cantidad_total) / $6),
           cogido         = FALSE,
           updated_at     = NOW()`,
        [listaId, ing.producto_id, cantidadEscalada, ing.producto_unidad || ing.receta_unidad, calcPaquetes, envaseBase]
      );
    }

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }

  return getLista(usuarioId, false);
}

// ─────────────────────────────────────────────
// OBTENER LISTA (HU-07 + HU-08)
// agrupada=true → agrupa por sección de tienda
// ─────────────────────────────────────────────
async function getLista(usuarioId, agrupada = false) {
  const listaRes = await pool.query(
    'SELECT id FROM listas_compra WHERE usuario_id = $1',
    [usuarioId]
  );

  if (listaRes.rows.length === 0) {
    return agrupada ? {} : [];
  }

  const listaId = listaRes.rows[0].id;

  const itemsRes = await pool.query(
    `SELECT
       il.id,
       il.cantidad_total,
       il.unidad,
       il.cogido,
       il.updated_at,
       ph.id           AS producto_id,
       ph.nombre       AS producto_nombre,
       ph.marca        AS producto_marca,
       ph.seccion_tienda,
       ph.precio       AS producto_precio,
       ph.cantidad_por_envase,
       ph.unidad_base,
       COALESCE(ph.thumbnail_url, ph.foto_url) AS producto_thumbnail_url,
       COALESCE(ph.image_url, ph.foto_url)     AS producto_image_url,
       ph.share_url    AS producto_share_url,
       -- Lógica de paquetes: Si es NULL calculamos el ceiling (legacy), si no usamos el valor real.
       COALESCE(il.paquetes_a_comprar, CEIL(il.cantidad_total / NULLIF(ph.cantidad_por_envase, 0))) AS paquetes,
       -- Precio estimado real: precio * paquetes
       ROUND(
         (COALESCE(il.paquetes_a_comprar, CEIL(il.cantidad_total / NULLIF(ph.cantidad_por_envase, 0))) * ph.precio)::numeric, 2
       ) AS precio_total
     FROM items_lista il
     JOIN productos_hacendado ph ON ph.id = il.producto_id
     WHERE il.lista_id = $1
     ORDER BY ph.seccion_tienda ASC, ph.nombre ASC`,
    [listaId]
  );

  const items = itemsRes.rows;

  if (!agrupada) return items;

  // Agrupar (A comprar vs En Despensa, dentro de comprar agrupar por pasillo)
  const result = { a_comprar: {}, despensa: [] };

  for (const item of items) {
    const pkgs = Number(item.paquetes || 0);
    
    // Si paquetes es 0, va directo a la despensa
    if (pkgs === 0 || item.cogido) {
      result.despensa.push(item);
    } else {
      const seccion = item.seccion_tienda || 'Otros';
      if (!result.a_comprar[seccion]) result.a_comprar[seccion] = [];
      result.a_comprar[seccion].push(item);
    }
  }

  return result;
}

// ─────────────────────────────────────────────
// ACTUALIZAR PAQUETES DE UN ITEM
// ─────────────────────────────────────────────
async function updateItemPaquetes(usuarioId, itemId, paquetes) {
  const check = await pool.query(
    `SELECT il.id 
     FROM items_lista il
     JOIN listas_compra lc ON lc.id = il.lista_id
     WHERE il.id = $1 AND lc.usuario_id = $2`,
    [itemId, usuarioId]
  );

  if (check.rows.length === 0) {
    const err = new Error('Item no encontrado en tu lista.');
    err.status = 404;
    err.code   = 'ITEM_NOT_FOUND';
    throw err;
  }

  await pool.query(
    'UPDATE items_lista SET paquetes_a_comprar = $1, cogido = false, updated_at = NOW() WHERE id = $2',
    [Math.max(0, parseInt(paquetes)), itemId]
  );

  return { id: itemId, paquetes: Math.max(0, parseInt(paquetes)) };
}

// ─────────────────────────────────────────────
// OBTENER ALTERNATIVAS PARA UN PRODUCTO
// ─────────────────────────────────────────────
async function getAlternativas(productoId) {
  const pRes = await pool.query('SELECT nombre, seccion_tienda FROM productos_hacendado WHERE id = $1', [productoId]);
  if (pRes.rows.length === 0) return [];
  
  const { nombre, seccion_tienda } = pRes.rows[0];
  
  // Usar la primera palabra clave principal
  const keyword = nombre.split(' ')[0].replace(/[^a-zA-Z0-9]/g, '');
  
  // 1. Intento estricto: Misma sección y empieza por la palabra clave
  let altRes = await pool.query(
    `SELECT id, nombre, marca, precio, cantidad_por_envase, unidad_base, seccion_tienda, 
            COALESCE(thumbnail_url, foto_url) AS thumbnail_url
     FROM productos_hacendado
     WHERE seccion_tienda = $1 AND id != $2 AND nombre ILIKE $3
     ORDER BY precio ASC
     LIMIT 20`,
    [seccion_tienda, productoId, `${keyword}%`]
  );

  // 2. Intento relajado: Si no hay resultados (porque la BBDD es pequeña), 
  // buscamos la palabra clave en cualquier parte del nombre sin importar la sección.
  if (altRes.rows.length === 0) {
    altRes = await pool.query(
      `SELECT id, nombre, marca, precio, cantidad_por_envase, unidad_base, seccion_tienda, 
              COALESCE(thumbnail_url, foto_url) AS thumbnail_url
       FROM productos_hacendado
       WHERE id != $1 AND nombre ILIKE $2
       ORDER BY precio ASC
       LIMIT 20`,
      [productoId, `%${keyword}%`]
    );
  }
  
  return altRes.rows;
}

// ─────────────────────────────────────────────
// SWAP: CAMBIAR UN PRODUCTO POR OTRO EN LA LISTA
// ─────────────────────────────────────────────
async function swapItemProducto(usuarioId, itemId, nuevoProductoId) {
  const check = await pool.query(
    `SELECT il.id, il.cantidad_total
     FROM items_lista il
     JOIN listas_compra lc ON lc.id = il.lista_id
     WHERE il.id = $1 AND lc.usuario_id = $2`,
    [itemId, usuarioId]
  );

  if (check.rows.length === 0) {
    const err = new Error('Item no encontrado en tu lista.');
    err.status = 404;
    err.code   = 'ITEM_NOT_FOUND';
    throw err;
  }

  const pRes = await pool.query('SELECT cantidad_por_envase, unidad_base FROM productos_hacendado WHERE id = $1', [nuevoProductoId]);
  if (pRes.rows.length === 0) {
    const err = new Error('Producto alternativo no encontrado.');
    err.status = 404;
    throw err;
  }

  const envaseBase = Number(pRes.rows[0].cantidad_por_envase) || 1;
  const cantTotal = Number(check.rows[0].cantidad_total);
  const nuevosPaquetes = Math.ceil(cantTotal / envaseBase);

  await pool.query(
    `UPDATE items_lista 
     SET producto_id = $1, paquetes_a_comprar = $2, updated_at = NOW() 
     WHERE id = $3`,
    [nuevoProductoId, nuevosPaquetes, itemId]
  );

  return getLista(usuarioId, false);
}

// ─────────────────────────────────────────────
// BUSCAR PRODUCTOS LIBRES
// ─────────────────────────────────────────────
async function searchProductosLibres(query) {
  if (!query || query.length < 2) return [];
  const res = await pool.query(
    `SELECT id, nombre, marca, precio, cantidad_por_envase, unidad_base, seccion_tienda, 
            COALESCE(thumbnail_url, foto_url) AS thumbnail_url
     FROM productos_hacendado
     WHERE nombre ILIKE $1
     ORDER BY precio ASC
     LIMIT 30`,
    [`%${query}%`]
  );
  return res.rows;
}

// ─────────────────────────────────────────────
// AÑADIR PRODUCTO MANUAL
// ─────────────────────────────────────────────
async function addManualProduct(usuarioId, productoId) {
  const pRes = await pool.query('SELECT cantidad_por_envase, unidad_base FROM productos_hacendado WHERE id = $1', [productoId]);
  if (pRes.rows.length === 0) {
    const err = new Error('Producto no encontrado.');
    err.status = 404;
    throw err;
  }

  const p = pRes.rows[0];
  const cantidadEnvase = Number(p.cantidad_por_envase) || 1;
  const unidad = p.unidad_base || 'ud';

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const listaId = await getOrCreateLista(usuarioId, client);

    await client.query(
      `INSERT INTO items_lista (lista_id, producto_id, cantidad_total, unidad, paquetes_a_comprar)
       VALUES ($1, $2, $3, $4, 1)
       ON CONFLICT (lista_id, producto_id)
       DO UPDATE SET
         cantidad_total = items_lista.cantidad_total + EXCLUDED.cantidad_total,
         paquetes_a_comprar = items_lista.paquetes_a_comprar + 1,
         cogido         = FALSE,
         updated_at     = NOW()`,
      [listaId, productoId, cantidadEnvase, unidad]
    );

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }

  return getLista(usuarioId, false);
}
async function toggleCogido(usuarioId, itemId) {
  // Verificar que el item pertenece a la lista del usuario
  const check = await pool.query(
    `SELECT il.id, il.cogido
     FROM items_lista il
     JOIN listas_compra lc ON lc.id = il.lista_id
     WHERE il.id = $1 AND lc.usuario_id = $2`,
    [itemId, usuarioId]
  );

  if (check.rows.length === 0) {
    const err = new Error('Item no encontrado en tu lista.');
    err.status = 404;
    err.code   = 'ITEM_NOT_FOUND';
    throw err;
  }

  const nuevoCogido = !check.rows[0].cogido;

  await pool.query(
    'UPDATE items_lista SET cogido = $1, updated_at = NOW() WHERE id = $2',
    [nuevoCogido, itemId]
  );

  return { id: itemId, cogido: nuevoCogido };
}

// ─────────────────────────────────────────────
// ELIMINAR ITEM (HU-08)
// ─────────────────────────────────────────────
async function deleteItem(usuarioId, itemId) {
  const result = await pool.query(
    `DELETE FROM items_lista il
     USING listas_compra lc
     WHERE il.lista_id = lc.id
       AND il.id       = $1
       AND lc.usuario_id = $2
     RETURNING il.id`,
    [itemId, usuarioId]
  );

  if (result.rows.length === 0) {
    const err = new Error('Item no encontrado en tu lista.');
    err.status = 404;
    err.code   = 'ITEM_NOT_FOUND';
    throw err;
  }
}

// ─────────────────────────────────────────────
// VACIAR LISTA COMPLETA (HU-08)
// ─────────────────────────────────────────────
async function vaciarLista(usuarioId) {
  const listaRes = await pool.query(
    'SELECT id FROM listas_compra WHERE usuario_id = $1',
    [usuarioId]
  );

  if (listaRes.rows.length === 0) return;

  await pool.query(
    'DELETE FROM items_lista WHERE lista_id = $1',
    [listaRes.rows[0].id]
  );
}

module.exports = { addRecetaToLista, getLista, toggleCogido, deleteItem, vaciarLista, updateItemPaquetes, getAlternativas, swapItemProducto, searchProductosLibres, addManualProduct };

require('dotenv').config({ path: require('path').join(__dirname, '../..', '.env') });

const pool = require('../config/database');

const DATASET_BASE_URL = process.env.MERCADONA_DATASET_BASE_URL || 'https://huggingface.co/datasets/datania/mercadona-catalog/resolve/main';
const API_BASE_URL = process.env.MERCADONA_API_BASE_URL || 'https://tienda.mercadona.es/api';
const IMPORT_SOURCE = (process.env.MERCADONA_IMPORT_SOURCE || 'dataset').toLowerCase();
const IMPORT_LIMIT = Number.parseInt(process.env.MERCADONA_IMPORT_LIMIT || '0', 10) || 0;
const IMPORT_ONLY_HACENDADO = process.env.MERCADONA_ONLY_HACENDADO === 'true';
const IMPORT_RECIPES_ONLY = process.env.MERCADONA_RECIPES_ONLY === 'true';
const REQUEST_DELAY_MS = Number.parseInt(process.env.MERCADONA_IMPORT_DELAY_MS || '120', 10) || 120;
const STOP_WORDS = new Set(['de', 'del', 'la', 'las', 'el', 'los', 'para', 'con', 'sin', 'al', 'y', 'en']);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeName(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\b(hacendado|mercadona|fresc[oa]s?|clase|brick|brik|pack|ud|uht)\b/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenizeName(value) {
  return normalizeName(value)
    .split(' ')
    .filter((token) => token && token.length > 1 && !STOP_WORDS.has(token));
}

function scoreProductMatch(sourceProduct, candidate) {
  const candidateName = candidate.nombre || candidate.display_name;
  const sourceTokens = tokenizeName(sourceProduct.nombre);
  const candidateTokens = tokenizeName(candidateName);
  if (!sourceTokens.length || !candidateTokens.length) return 0;

  const candidateSet = new Set(candidateTokens);
  const overlap = sourceTokens.filter((token) => candidateSet.has(token)).length;
  const subsetBonus = sourceTokens.every((token) => candidateSet.has(token)) ? 2 : 0;
  const candidateSection = candidate.seccion_tienda || mapSection(candidate.categories || []);
  const sectionBonus = sourceProduct.seccionTienda === candidateSection ? 1 : 0;
  const recipeBonus = Number(candidate.recipe_refs || 0) > 0 ? 1 : 0;
  const brandBonus = normalizeName(candidateName).includes('hacendado') ? 1 : 0;

  return overlap + subsetBonus + sectionBonus + recipeBonus + brandBonus;
}

async function getRecipeLinkedProducts(client) {
  const result = await client.query(
    `SELECT DISTINCT ph.id, ph.nombre, ph.seccion_tienda AS "seccionTienda"
     FROM ingredientes_receta ir
     JOIN productos_hacendado ph ON ph.id = ir.producto_id
     ORDER BY ph.nombre ASC`
  );
  return result.rows;
}

async function getRecipeTargetIds(client) {
  const recipeProducts = await getRecipeLinkedProducts(client);
  const categoryIds = await getSecondLevelCategoryIds();
  const summaryMap = new Map();

  for (const categoryId of categoryIds) {
    const payload = await getCategoryPayload(categoryId);
    collectProductSummaries(payload, summaryMap);
    await sleep(REQUEST_DELAY_MS);
  }

  const summaries = [...summaryMap.values()];
  const targetIds = new Set();

  for (const recipeProduct of recipeProducts) {
    let best = null;
    let bestScore = 0;

    for (const summary of summaries) {
      const score = scoreProductMatch(recipeProduct, summary);
      if (score > bestScore) {
        best = summary;
        bestScore = score;
      }
    }

    if (best?.id && bestScore >= 3) {
      targetIds.add(String(best.id));
    }
  }

  return [...targetIds];
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      'Accept': 'application/json',
      'Accept-Language': 'es-ES,es;q=0.9',
      'User-Agent': 'Mozilla/5.0 (compatible; RecetasHacendadoImporter/1.0)',
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed ${response.status} for ${url}`);
  }

  return response.json();
}

async function getProductIds() {
  if (IMPORT_SOURCE === 'api') {
    const secondLevelIds = await getSecondLevelCategoryIds();

    const ids = new Set();
    for (const categoryId of secondLevelIds) {
      const categoryPayload = await getCategoryPayload(categoryId);
      collectProductIds(categoryPayload, ids);
      await sleep(REQUEST_DELAY_MS);
    }

    return [...ids];
  }

  const payload = await fetchJson(`${DATASET_BASE_URL}/product_ids.json`);
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.product_ids)) return payload.product_ids;
  throw new Error('Formato inesperado en product_ids.json');
}

async function getSecondLevelCategoryIds() {
  const categoriesRoot = IMPORT_SOURCE === 'api'
    ? await fetchJson(`${API_BASE_URL}/categories/`)
    : await fetchJson(`${DATASET_BASE_URL}/categories.json`);

  const ids = [];
  for (const top of categoriesRoot.results || []) {
    for (const category of top.categories || []) {
      if (category?.id) ids.push(category.id);
    }
  }
  return ids;
}

async function getCategoryPayload(categoryId) {
  if (IMPORT_SOURCE === 'api') {
    return fetchJson(`${API_BASE_URL}/categories/${categoryId}/`);
  }
  return fetchJson(`${DATASET_BASE_URL}/categories/${categoryId}.json`);
}

function collectProductIds(node, ids) {
  if (Array.isArray(node)) {
    node.forEach((item) => collectProductIds(item, ids));
    return;
  }

  if (!node || typeof node !== 'object') return;

  if (Array.isArray(node.products)) {
    node.products.forEach((product) => {
      if (product?.id) ids.add(String(product.id));
    });
  }

  Object.entries(node).forEach(([key, value]) => {
    if (key !== 'products') collectProductIds(value, ids);
  });
}

function collectProductSummaries(node, map) {
  if (Array.isArray(node)) {
    node.forEach((item) => collectProductSummaries(item, map));
    return;
  }

  if (!node || typeof node !== 'object') return;

  if (Array.isArray(node.products)) {
    node.products.forEach((product) => {
      if (product?.id) map.set(String(product.id), product);
    });
  }

  Object.entries(node).forEach(([key, value]) => {
    if (key !== 'products') collectProductSummaries(value, map);
  });
}

async function getProductPayload(productId) {
  const base = IMPORT_SOURCE === 'api' ? `${API_BASE_URL}/products/${productId}/` : `${DATASET_BASE_URL}/products/${productId}.json`;
  return fetchJson(base);
}

function normalizeUnit(unit) {
  const value = String(unit || '').trim().toLowerCase();
  if (['kg', 'g', 'gr', 'gramos'].includes(value)) return 'g';
  if (['l', 'lt', 'ml'].includes(value)) return 'ml';
  if (['ud', 'u', 'unidad', 'unidades'].includes(value)) return 'ud';
  return value || 'ud';
}

function convertAmountToBase(unit, size) {
  const numericSize = Number(size) || 1;
  const normalized = String(unit || '').trim().toLowerCase();
  if (normalized === 'kg') return { cantidadPorEnvase: numericSize * 1000, unidadBase: 'g' };
  if (normalized === 'g') return { cantidadPorEnvase: numericSize, unidadBase: 'g' };
  if (normalized === 'l') return { cantidadPorEnvase: numericSize * 1000, unidadBase: 'ml' };
  if (normalized === 'ml') return { cantidadPorEnvase: numericSize, unidadBase: 'ml' };
  if (normalized === 'ud') return { cantidadPorEnvase: numericSize, unidadBase: 'ud' };
  return { cantidadPorEnvase: numericSize, unidadBase: normalizeUnit(normalized) };
}

function mapSection(categories = []) {
  const names = categories.flatMap((category) => [
    category?.name,
    ...(category?.categories || []).map((sub) => sub?.name),
    ...(category?.categories || []).flatMap((sub) => (sub?.categories || []).map((leaf) => leaf?.name)),
  ]).filter(Boolean).join(' | ').toLowerCase();

  if (names.includes('carne') || names.includes('pollo') || names.includes('embutido')) return 'Carnes y Aves';
  if (names.includes('pescado') || names.includes('marisco')) return 'Pescados y Mariscos';
  if (names.includes('leche') || names.includes('queso') || names.includes('huevo') || names.includes('yogur')) return 'Lácteos y Huevos';
  if (names.includes('pan') || names.includes('boll')) return 'Panadería y Bollería';
  if (names.includes('aceite') || names.includes('conserva') || names.includes('salsa')) return 'Aceites y Conservas';
  if (names.includes('pasta') || names.includes('arroz') || names.includes('legumbre')) return 'Pasta, Arroz y Legumbres';
  if (names.includes('especia') || names.includes('condimento') || names.includes('sal') || names.includes('azúcar')) return 'Condimentos y Especias';
  if (names.includes('bebida') || names.includes('café') || names.includes('infus') || names.includes('zumo') || names.includes('refresco') || names.includes('agua')) return 'Bebidas';
  if (names.includes('congelado') || names.includes('helado')) return 'Congelados';
  if (names.includes('fruta') || names.includes('verdura') || names.includes('hortaliza')) return 'Frutas y Verduras';
  return 'Otros';
}

function deriveCategory(categories = []) {
  const top = categories[0]?.name || 'Otros';
  const sub = categories[0]?.categories?.[0]?.name || top;
  const leaf = categories[0]?.categories?.[0]?.categories?.[0]?.name || sub;
  return { categoriaMercadona: top, subcategoriaMercadona: leaf, categoria: sub };
}

function normalizeProduct(payload) {
  const photos = Array.isArray(payload.photos) ? payload.photos : [];
  const hero = photos[0] || {};
  const priceInstructions = payload.price_instructions || {};
  const unitSize = Number(priceInstructions.unit_size) || Number(priceInstructions.total_units) || Number(priceInstructions.increment_bunch_amount) || 1;
  const sizeFormat = String(priceInstructions.size_format || priceInstructions.reference_format || priceInstructions.unit_name || 'ud').toLowerCase();
  const amount = convertAmountToBase(sizeFormat, unitSize);
  const categoryInfo = deriveCategory(payload.categories || []);
  const precio = Number(priceInstructions.unit_price || priceInstructions.bulk_price || 0);

  return {
    mercadonaId: String(payload.id),
    nombre: payload.display_name || payload.details?.description || payload.details?.legal_name || `Producto ${payload.id}`,
    marca: payload.brand || payload.details?.brand || null,
    categoria: categoryInfo.categoria,
    categoriaMercadona: categoryInfo.categoriaMercadona,
    subcategoriaMercadona: categoryInfo.subcategoriaMercadona,
    seccionTienda: mapSection(payload.categories || []),
    precio,
    unidadVenta: priceInstructions.pack_size || `${unitSize} ${sizeFormat}`,
    cantidadPorEnvase: amount.cantidadPorEnvase,
    unidadBase: amount.unidadBase,
    fotoUrl: payload.thumbnail || hero.regular || null,
    thumbnailUrl: payload.thumbnail || hero.thumbnail || null,
    imageUrl: hero.regular || payload.thumbnail || null,
    zoomUrl: hero.zoom || null,
    shareUrl: payload.share_url || null,
    ean: payload.ean || null,
    packaging: payload.packaging || null,
    published: payload.published !== false,
    activo: payload.published !== false,
    precioReferencia: Number(priceInstructions.reference_price || 0) || null,
    formatoReferencia: priceInstructions.reference_format || null,
    detallesJson: {
      details: payload.details || null,
      nutrition_information: payload.nutrition_information || null,
      badges: payload.badges || null,
      unavailable_weekdays: payload.unavailable_weekdays || [],
      slug: payload.slug || null,
      origin: payload.origin || null,
    },
    rawJson: payload,
  };
}

async function findExistingProduct(client, product) {
  if (product.mercadonaId) {
    const byMercadonaId = await client.query(
      'SELECT id FROM productos_hacendado WHERE mercadona_id = $1',
      [product.mercadonaId]
    );
    if (byMercadonaId.rows[0]) return byMercadonaId.rows[0].id;
  }

  const byName = await client.query(
    'SELECT id FROM productos_hacendado WHERE lower(nombre) = lower($1) LIMIT 1',
    [product.nombre]
  );
  if (byName.rows[0]) return byName.rows[0].id;

  const normalizedName = normalizeName(product.nombre);
  const normalizedLike = `%${normalizedName.replace(/\s+/g, '%')}%`;
  const candidates = await client.query(
    `SELECT
       ph.id,
       ph.nombre,
       ph.seccion_tienda,
       COUNT(ir.id) AS recipe_refs
     FROM productos_hacendado ph
     LEFT JOIN ingredientes_receta ir ON ir.producto_id = ph.id
     WHERE ph.mercadona_id IS NULL
       AND (
         lower(ph.nombre) LIKE lower($1)
         OR lower($2) LIKE ('%' || lower(ph.nombre) || '%')
       )
     GROUP BY ph.id
     ORDER BY recipe_refs DESC, ph.nombre ASC`,
    [normalizedLike, normalizedName]
  );

  let bestId = null;
  let bestScore = 0;
  for (const candidate of candidates.rows) {
    const score = scoreProductMatch(product, candidate);
    if (score > bestScore) {
      bestScore = score;
      bestId = candidate.id;
    }
  }

  return bestScore >= 3 ? bestId : null;
}

async function upsertProduct(client, product) {
  const existingId = await findExistingProduct(client, product);

  if (existingId) {
    await client.query(
      `UPDATE productos_hacendado
       SET nombre = COALESCE(NULLIF(nombre, ''), $2),
           categoria = $3,
           seccion_tienda = $4,
           precio = $5,
           unidad_venta = $6,
           cantidad_por_envase = $7,
           unidad_base = $8,
           foto_url = COALESCE($9, foto_url),
           mercadona_id = COALESCE($10, mercadona_id),
           marca = COALESCE($11, marca),
           thumbnail_url = COALESCE($12, thumbnail_url),
           image_url = COALESCE($13, image_url),
           zoom_url = COALESCE($14, zoom_url),
           share_url = COALESCE($15, share_url),
           ean = COALESCE($16, ean),
           packaging = COALESCE($17, packaging),
           published = $18,
           activo = $19,
           categoria_mercadona = COALESCE($20, categoria_mercadona),
           subcategoria_mercadona = COALESCE($21, subcategoria_mercadona),
           precio_referencia = COALESCE($22, precio_referencia),
           formato_referencia = COALESCE($23, formato_referencia),
           detalles_json = COALESCE($24, detalles_json),
           raw_json = COALESCE($25, raw_json),
           last_synced_at = NOW()
       WHERE id = $1`,
      [
        existingId,
        product.nombre,
        product.categoria,
        product.seccionTienda,
        product.precio,
        product.unidadVenta,
        product.cantidadPorEnvase,
        product.unidadBase,
        product.fotoUrl,
        product.mercadonaId,
        product.marca,
        product.thumbnailUrl,
        product.imageUrl,
        product.zoomUrl,
        product.shareUrl,
        product.ean,
        product.packaging,
        product.published,
        product.activo,
        product.categoriaMercadona,
        product.subcategoriaMercadona,
        product.precioReferencia,
        product.formatoReferencia,
        JSON.stringify(product.detallesJson),
        JSON.stringify(product.rawJson),
      ]
    );
    return 'updated';
  }

  await client.query(
    `INSERT INTO productos_hacendado (
      nombre, categoria, seccion_tienda, precio, unidad_venta, cantidad_por_envase, unidad_base, foto_url,
      mercadona_id, marca, thumbnail_url, image_url, zoom_url, share_url, ean, packaging, published, activo,
      categoria_mercadona, subcategoria_mercadona, precio_referencia, formato_referencia, detalles_json, raw_json, last_synced_at
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8,
      $9, $10, $11, $12, $13, $14, $15, $16, $17, $18,
      $19, $20, $21, $22, $23, $24, NOW()
    )`,
    [
      product.nombre,
      product.categoria,
      product.seccionTienda,
      product.precio,
      product.unidadVenta,
      product.cantidadPorEnvase,
      product.unidadBase,
      product.fotoUrl,
      product.mercadonaId,
      product.marca,
      product.thumbnailUrl,
      product.imageUrl,
      product.zoomUrl,
      product.shareUrl,
      product.ean,
      product.packaging,
      product.published,
      product.activo,
      product.categoriaMercadona,
      product.subcategoriaMercadona,
      product.precioReferencia,
      product.formatoReferencia,
      JSON.stringify(product.detallesJson),
      JSON.stringify(product.rawJson),
    ]
  );

  return 'inserted';
}

async function main() {
  const client = await pool.connect();
  try {
    console.log(`📦 Importando catálogo Mercadona (${IMPORT_SOURCE}${IMPORT_RECIPES_ONLY ? ' · recipes-only' : ''})...`);
    const ids = IMPORT_RECIPES_ONLY
      ? await getRecipeTargetIds(client)
      : await getProductIds();
    const targetIds = IMPORT_LIMIT > 0 ? ids.slice(0, IMPORT_LIMIT) : ids;
    let inserted = 0;
    let updated = 0;
    let skipped = 0;

    for (const productId of targetIds) {
      try {
        const payload = await getProductPayload(productId);
        const normalized = normalizeProduct(payload);

        if (IMPORT_ONLY_HACENDADO && normalized.marca?.toLowerCase() !== 'hacendado') {
          skipped++;
          continue;
        }

        const result = await upsertProduct(client, normalized);
        if (result === 'inserted') inserted++;
        if (result === 'updated') updated++;
        await sleep(REQUEST_DELAY_MS);
      } catch (error) {
        skipped++;
        console.warn(`⚠️  Producto ${productId} omitido: ${error.message}`);
      }
    }

    console.log(`✅ Catálogo importado. Insertados: ${inserted}. Actualizados: ${updated}. Omitidos: ${skipped}.`);
  } catch (error) {
    console.error('❌ Error importando catálogo Mercadona:', error.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

main();

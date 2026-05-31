const Groq = require('groq-sdk');
const pool = require('../../config/database');

const TEXT_MODEL = process.env.GROQ_TEXT_MODEL || 'llama-3.3-70b-versatile';
const VISION_MODEL = process.env.GROQ_VISION_MODEL || 'meta-llama/llama-4-scout-17b-16e-instruct';
const WEEKDAY_NAMES = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

function normalizeText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function coerceString(value, fallback = '', maxLength = 240) {
  const normalized = String(value || '').trim();
  if (!normalized) return fallback;
  return normalized.slice(0, maxLength);
}

function coerceNumber(value, fallback = 0, { min = 0, max = Number.POSITIVE_INFINITY } = {}) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return fallback;
  return Math.min(max, Math.max(min, numeric));
}

function coerceBoolean(value, fallback = false) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    if (value.toLowerCase() === 'true') return true;
    if (value.toLowerCase() === 'false') return false;
  }
  return fallback;
}

function sanitizeTags(tags) {
  return Array.isArray(tags)
    ? [...new Set(tags.map((tag) => String(tag || '').trim().toUpperCase()).filter(Boolean))].slice(0, 6)
    : [];
}

function sanitizeStringArray(values, maxItems = 6, maxLength = 80) {
  return Array.isArray(values)
    ? [...new Set(values.map((value) => coerceString(value, '', maxLength)).filter(Boolean))].slice(0, maxItems)
    : [];
}

function buildRecipeIndex(recipes) {
  const byId = new Map();
  const byNormalizedName = new Map();

  recipes.forEach((recipe) => {
    byId.set(String(recipe.id), recipe);
    byNormalizedName.set(normalizeText(recipe.nombre), recipe);
  });

  return { recipes, byId, byNormalizedName };
}

function resolveRecipeReference(candidate, recipeIndex) {
  if (!candidate || typeof candidate !== 'object') return null;

  const directId = candidate.id || candidate.receta_id;
  if (directId && recipeIndex.byId.has(String(directId))) {
    return recipeIndex.byId.get(String(directId));
  }

  const rawName = candidate.nombre || candidate.receta_nombre;
  const normalizedName = normalizeText(rawName);
  if (normalizedName && recipeIndex.byNormalizedName.has(normalizedName)) {
    return recipeIndex.byNormalizedName.get(normalizedName);
  }

  return null;
}

function getFallbackRecipes(recipeIndex, limit = 3, excludeIds = new Set()) {
  return recipeIndex.recipes
    .filter((recipe) => !excludeIds.has(String(recipe.id)))
    .slice(0, limit);
}

function normalizeMealRecommendations(rawRecommendations, recipeIndex, maxRecetas) {
  const recommendations = [];
  const usedIds = new Set();

  for (const item of Array.isArray(rawRecommendations) ? rawRecommendations : []) {
    const recipe = resolveRecipeReference(item, recipeIndex);
    if (!recipe || usedIds.has(String(recipe.id))) continue;

    recommendations.push({
      id: recipe.id,
      nombre: recipe.nombre,
      motivo: coerceString(item.motivo, `Encaja bien con tu petición y está disponible en el catálogo real.`, 220),
      tiempo_minutos: coerceNumber(item.tiempo_minutos, recipe.tiempo_minutos, { min: 5, max: 240 }),
      tags: sanitizeTags(item.tags?.length ? item.tags : recipe.tags),
      foto_url: recipe.foto_url || null,
    });
    usedIds.add(String(recipe.id));

    if (recommendations.length >= maxRecetas) break;
  }

  if (recommendations.length === 0) {
    for (const recipe of getFallbackRecipes(recipeIndex, maxRecetas, usedIds)) {
      recommendations.push({
        id: recipe.id,
        nombre: recipe.nombre,
        motivo: 'Es una opción sólida del catálogo real para empezar a decidir.',
        tiempo_minutos: recipe.tiempo_minutos,
        tags: sanitizeTags(recipe.tags),
        foto_url: recipe.foto_url || null,
      });
    }
  }

  return recommendations;
}

function normalizeDetectedIngredients(rawIngredients) {
  const seen = new Set();
  const ingredients = [];

  for (const item of Array.isArray(rawIngredients) ? rawIngredients : []) {
    const nombre = coerceString(item?.nombre, '', 80);
    const normalizedName = normalizeText(nombre);
    if (!nombre || !normalizedName || seen.has(normalizedName)) continue;

    ingredients.push({
      nombre,
      confianza: coerceNumber(item?.confianza, 0.72, { min: 0, max: 1 }),
    });
    seen.add(normalizedName);

    if (ingredients.length >= 8) break;
  }

  return ingredients;
}

function normalizePantryRecommendations(rawRecommendations, recipeIndex, detectedIngredients) {
  const recommendations = [];
  const usedIds = new Set();

  for (const item of Array.isArray(rawRecommendations) ? rawRecommendations : []) {
    const recipe = resolveRecipeReference(item, recipeIndex);
    if (!recipe || usedIds.has(String(recipe.id))) continue;

    recommendations.push({
      id: recipe.id,
      nombre: recipe.nombre,
      motivo: coerceString(item.motivo, 'Aprovecha bien parte de lo detectado y encaja con el catálogo disponible.', 220),
      ingredientes_usados: sanitizeStringArray(item.ingredientes_usados, 6, 80),
      foto_url: recipe.foto_url || null,
    });
    usedIds.add(String(recipe.id));

    if (recommendations.length >= 4) break;
  }

  if (recommendations.length === 0) {
    for (const recipe of getFallbackRecipes(recipeIndex, 3, usedIds)) {
      recommendations.push({
        id: recipe.id,
        nombre: recipe.nombre,
        motivo: 'Puede ser una buena opción con parte de lo que aparece en la imagen.',
        ingredientes_usados: detectedIngredients.slice(0, 3).map((ingredient) => ingredient.nombre),
        foto_url: recipe.foto_url || null,
      });
    }
  }

  return recommendations;
}

function buildDefaultCookingMode(recipe) {
  return {
    titulo: recipe.nombre,
    intro_tts: `Vamos a preparar ${recipe.nombre}. Te guío paso a paso.`,
    pasos: (Array.isArray(recipe.pasos) ? recipe.pasos : []).map((step, index) => ({
      orden: coerceNumber(step?.orden, index + 1, { min: 1, max: 99 }),
      titulo: `Paso ${coerceNumber(step?.orden, index + 1, { min: 1, max: 99 })}`,
      narracion: coerceString(step?.descripcion, 'Sigue con este paso de la receta.', 320),
      duracion_segundos: 60,
      timer_recomendado: false,
    })),
    cierre_tts: 'Receta terminada. Buen provecho.',
  };
}

function normalizeCookingModeResult(aiResult, recipe) {
  const fallback = buildDefaultCookingMode(recipe);
  const normalizedSteps = [];

  for (const [index, step] of (Array.isArray(aiResult?.pasos) ? aiResult.pasos : []).entries()) {
    const narracion = coerceString(step?.narracion, '', 320);
    if (!narracion) continue;

    normalizedSteps.push({
      orden: coerceNumber(step?.orden, index + 1, { min: 1, max: 99 }),
      titulo: coerceString(step?.titulo, `Paso ${index + 1}`, 80),
      narracion,
      duracion_segundos: coerceNumber(step?.duracion_segundos, 60, { min: 30, max: 5400 }),
      timer_recomendado: coerceBoolean(step?.timer_recomendado, false),
    });
  }

  normalizedSteps.sort((a, b) => a.orden - b.orden);

  return {
    titulo: coerceString(aiResult?.titulo, fallback.titulo, 120),
    intro_tts: coerceString(aiResult?.intro_tts, fallback.intro_tts, 220),
    pasos: normalizedSteps.length > 0 ? normalizedSteps : fallback.pasos,
    cierre_tts: coerceString(aiResult?.cierre_tts, fallback.cierre_tts, 220),
  };
}

function normalizeWeeklyPlanDays(rawDays, recipeIndex, dias) {
  const allowRepeats = recipeIndex.recipes.length < dias;
  const selected = [];
  const usedIds = new Set();

  for (const item of Array.isArray(rawDays) ? rawDays : []) {
    const recipe = resolveRecipeReference(item, recipeIndex);
    if (!recipe) continue;
    if (!allowRepeats && usedIds.has(String(recipe.id))) continue;

    selected.push({
      recipe,
      motivo: coerceString(item?.motivo, 'Encaja bien con el objetivo de esta semana.', 220),
    });
    usedIds.add(String(recipe.id));

    if (selected.length >= dias) break;
  }

  const fallbackPool = recipeIndex.recipes.length > 0
    ? (allowRepeats ? recipeIndex.recipes : getFallbackRecipes(recipeIndex, recipeIndex.recipes.length, usedIds))
    : [];

  let fallbackIndex = 0;
  while (selected.length < dias && fallbackPool.length > 0) {
    const recipe = fallbackPool[fallbackIndex % fallbackPool.length];
    fallbackIndex += 1;

    if (!allowRepeats && usedIds.has(String(recipe.id))) continue;

    selected.push({
      recipe,
      motivo: 'Buena opción para mantener una semana realista y variada.',
    });
    usedIds.add(String(recipe.id));
  }

  return WEEKDAY_NAMES.slice(0, dias).map((dayName, index) => {
    const day = selected[index] || selected[selected.length - 1];
    const recipe = day?.recipe;

    return {
      dia: dayName,
      receta_id: recipe?.id || null,
      receta_nombre: recipe?.nombre || 'Receta pendiente',
      receta_foto_url: recipe?.foto_url || null,
      tiempo_minutos: recipe?.tiempo_minutos || null,
      tags: sanitizeTags(recipe?.tags),
      motivo: day?.motivo || 'Semana generada con catálogo real disponible.',
    };
  });
}

// ─────────────────────────────────────────────
// Groq Client & Infrastructure
// ─────────────────────────────────────────────

function getGroqClient() {
  if (!process.env.GROQ_API_KEY) {
    const err = new Error('GROQ_API_KEY no está definida en las variables de entorno.');
    err.status = 500;
    err.code = 'GROQ_API_KEY_MISSING';
    throw err;
  }

  return new Groq({ apiKey: process.env.GROQ_API_KEY });
}

async function getCatalogWithFallback(limit = 24, preferencias = []) {
  const catalog = await getCatalogContext(limit, preferencias);
  if (catalog.length > 0 || preferencias.length === 0) return catalog;
  return getCatalogContext(limit, []);
}

async function getCatalogContext(limit = 24, preferencias = []) {
  const params = [];
  let whereClause = '';

  if (preferencias.length > 0) {
    const conditions = preferencias.map((tag, index) => {
      params.push(tag);
      return `EXISTS (
        SELECT 1
        FROM recetas_tags rt
        WHERE rt.receta_id = r.id
          AND rt.tag = $${index + 1}
      )`;
    });

    whereClause = `WHERE ${conditions.join(' AND ')}`;
  }

  params.push(limit);

  const result = await pool.query(
    `SELECT
      r.id,
      r.nombre,
      r.descripcion,
      r.tiempo_minutos,
      r.raciones_base,
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
      COALESCE(
        json_agg(DISTINCT rt.tag) FILTER (WHERE rt.tag IS NOT NULL),
        '[]'
      ) AS tags,
      COALESCE(
        json_agg(DISTINCT ph.nombre) FILTER (WHERE ph.nombre IS NOT NULL),
        '[]'
      ) AS productos
    FROM recetas r
    LEFT JOIN recetas_tags rt ON rt.receta_id = r.id
    LEFT JOIN ingredientes_receta ir ON ir.receta_id = r.id
    LEFT JOIN productos_hacendado ph ON ph.id = ir.producto_id
    ${whereClause}
    GROUP BY r.id
    ORDER BY r.semana_activa DESC NULLS LAST, r.nombre ASC
    LIMIT $${params.length}`,
    params
  );

  return result.rows;
}

function compactRecipe(recipe) {
  return {
    id: recipe.id,
    nombre: recipe.nombre,
    descripcion: recipe.descripcion,
    tiempo_minutos: recipe.tiempo_minutos,
    raciones_base: recipe.raciones_base,
    tags: recipe.tags,
    productos: recipe.productos,
    foto_url: recipe.foto_url,
  };
}

function toGroqServiceError(error) {
  if (error?.status === 429) {
    const err = new Error('Groq no está disponible ahora mismo por límite de cuota o rate limit. Inténtalo de nuevo en unos segundos.');
    err.status = 503;
    err.code = 'GROQ_QUOTA_EXCEEDED';
    return err;
  }

  if (error?.status === 401 || error?.status === 403) {
    const err = new Error('La configuración de acceso a Groq no es válida. Revisa la API key en tu archivo .env.');
    err.status = 502;
    err.code = 'GROQ_AUTH_ERROR';
    return err;
  }

  if (error?.status >= 500) {
    const err = new Error('Groq no responde correctamente en este momento. Inténtalo de nuevo en unos instantes.');
    err.status = 503;
    err.code = 'GROQ_UPSTREAM_ERROR';
    return err;
  }

  return error;
}

// ─────────────────────────────────────────────
// Generación de JSON — Modelo de Texto (Razonamiento)
// ─────────────────────────────────────────────

async function generateJson(systemPrompt, userPrompt) {
  const groq = getGroqClient();

  let response;
  try {
    response = await groq.chat.completions.create({
      model: TEXT_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.6,
      max_tokens: 4096,
    });
  } catch (error) {
    throw toGroqServiceError(error);
  }

  const text = response.choices?.[0]?.message?.content;

  try {
    return JSON.parse(text);
  } catch {
    const err = new Error('Groq devolvió una respuesta no válida en formato JSON.');
    err.status = 502;
    err.code = 'INVALID_AI_RESPONSE';
    throw err;
  }
}

// ─────────────────────────────────────────────
// Generación de JSON — Modelo de Visión (Análisis de imágenes)
// ─────────────────────────────────────────────

async function generateJsonFromVision(textPrompt, imageData) {
  const groq = getGroqClient();

  let response;
  try {
    response = await groq.chat.completions.create({
      model: VISION_MODEL,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: textPrompt + '\n\nResponde SOLO en JSON válido.' },
            {
              type: 'image_url',
              image_url: {
                url: `data:${imageData.mimeType};base64,${imageData.data}`,
              },
            },
          ],
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.4,
      max_tokens: 4096,
    });
  } catch (error) {
    throw toGroqServiceError(error);
  }

  const text = response.choices?.[0]?.message?.content;

  try {
    return JSON.parse(text);
  } catch {
    const err = new Error('Groq (visión) devolvió una respuesta no válida en formato JSON.');
    err.status = 502;
    err.code = 'INVALID_AI_RESPONSE';
    throw err;
  }
}

// ─────────────────────────────────────────────
// Funciones de Negocio — Asistente de Comidas
// ─────────────────────────────────────────────

async function getMealAssistantResponse({ prompt, preferencias = [], maxRecetas = 4 }) {
  const catalog = await getCatalogWithFallback(24, preferencias);
  const recipes = catalog.map(compactRecipe);
  const recipeIndex = buildRecipeIndex(recipes);

  const systemPrompt = `Eres el asistente culinario oficial de Recetas Hacendado, una app inspirada en Mercadona.
Tu objetivo es recomendar recetas REALISTAS usando únicamente el catálogo proporcionado.
No inventes IDs ni nombres de recetas que no estén en el catálogo.
Responde SOLO en JSON válido con esta forma exacta:
{
  "mensaje": "string breve y útil en español",
  "recomendaciones": [
    {
      "id": "uuid de receta existente",
      "nombre": "string",
      "motivo": "por qué encaja con la petición",
      "tiempo_minutos": number,
      "tags": ["VEGETARIANO"]
    }
  ],
  "siguiente_pregunta": "string corta para continuar la conversación"
}
Debes devolver entre 1 y ${maxRecetas} recomendaciones.`;

  const userPrompt = `Preferencias activas del usuario: ${JSON.stringify(preferencias)}
Petición del usuario: ${prompt}

Catálogo disponible:
${JSON.stringify(recipes, null, 2)}`;

  const aiResult = await generateJson(systemPrompt, userPrompt);
  const recomendaciones = normalizeMealRecommendations(aiResult?.recomendaciones, recipeIndex, maxRecetas);

  return {
    mensaje: coerceString(aiResult?.mensaje, 'Te dejo varias ideas reales del catálogo para que elijas rápido.', 280),
    recomendaciones,
    siguiente_pregunta: coerceString(aiResult?.siguiente_pregunta, '¿Prefieres que priorice algo más rápido, más ligero o más económico?', 160),
    catalogo_utilizado: recipes.length,
  };
}

// ─────────────────────────────────────────────
// Funciones de Negocio — Escáner de Despensa (Visión)
// ─────────────────────────────────────────────

function parseImageData(imageBase64) {
  const match = imageBase64.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (match) {
    return { mimeType: match[1], data: match[2] };
  }
  return { mimeType: 'image/jpeg', data: imageBase64 };
}

async function scanPantry({ imageBase64, preferencias = [] }) {
  const catalog = await getCatalogWithFallback(30, preferencias);
  const recipes = catalog.map(compactRecipe);
  const recipeIndex = buildRecipeIndex(recipes);
  const image = parseImageData(imageBase64);

  // ── Etapa 1: VISIÓN PURA — describir solo lo que se ve, sin catálogo ──
  // Si pasamos el catálogo aquí, el modelo lo regurgita como "detectado"
  // aunque la imagen muestre algo distinto. Por eso lo separamos.
  const visionPrompt = `Eres un sistema de visión de alimentos.
Mira ÚNICAMENTE la imagen y describe los productos alimenticios que aparecen físicamente en ella.
NO inventes productos que no veas. Si solo hay una lata de atún, devuelve solo atún.
Si la imagen está vacía, borrosa o no contiene comida, devuelve la lista vacía.

Responde SOLO en JSON con esta forma exacta:
{
  "ingredientes_detectados": [
    { "nombre": "string corto en español", "confianza": number entre 0 y 1 }
  ],
  "descripcion_imagen": "frase breve describiendo qué se ve"
}
Máximo 10 ingredientes. La confianza debe reflejar lo seguro que estás de identificarlo.`;

  const visionResult = await generateJsonFromVision(visionPrompt, image);
  const ingredientesDetectados = normalizeDetectedIngredients(visionResult?.ingredientes_detectados);

  // ── Etapa 2: MATCHING — texto, con catálogo, contra lo realmente detectado ──
  let recomendaciones = [];
  let mensaje = '';
  let siguienteAccion = '';

  if (ingredientesDetectados.length === 0) {
    mensaje = 'No he conseguido reconocer ingredientes claros en la imagen. Prueba con más luz o acércate más a los productos.';
    siguienteAccion = 'Vuelve a intentarlo con otra foto, o sube una imagen desde la galería.';
  } else if (recipes.length === 0) {
    mensaje = 'He detectado ingredientes pero el catálogo está vacío.';
    siguienteAccion = 'Importa recetas para poder sugerirte algo concreto.';
  } else {
    const matchPrompt = `Eres el asistente culinario de Recetas Hacendado.
Te paso ingredientes REALES detectados visualmente en la nevera/despensa del usuario y un catálogo de recetas existentes.
Sugiere las recetas del catálogo que mejor aprovechen esos ingredientes.
NO inventes recetas. NO devuelvas recetas que el catálogo no contiene.
Prioriza recetas con mayor solapamiento con los ingredientes detectados.

Responde SOLO en JSON con esta forma exacta:
{
  "mensaje": "string breve en español, claro y útil",
  "recomendaciones": [
    {
      "id": "uuid exacto de receta del catálogo",
      "nombre": "string exacto",
      "motivo": "por qué encaja con lo detectado",
      "ingredientes_usados": ["nombres reales de ingredientes detectados que aparecen en la receta"]
    }
  ],
  "siguiente_accion": "string corto sugiriendo el próximo paso"
}
Devuelve entre 1 y 4 recomendaciones. Si nada encaja bien, devuelve recomendaciones igualmente pero deja claro en "motivo" que requiere completar ingredientes.`;

    const matchUserPrompt = `Preferencias activas: ${JSON.stringify(preferencias)}
Descripción de la imagen: ${coerceString(visionResult?.descripcion_imagen, '(sin descripción)', 240)}
Ingredientes detectados visualmente:
${JSON.stringify(ingredientesDetectados, null, 2)}

Catálogo disponible:
${JSON.stringify(recipes, null, 2)}`;

    const matchResult = await generateJson(matchPrompt, matchUserPrompt);
    recomendaciones = normalizePantryRecommendations(matchResult?.recomendaciones, recipeIndex, ingredientesDetectados);
    mensaje = coerceString(matchResult?.mensaje, 'Te propongo recetas reales del catálogo basadas en lo que aparece en tu foto.', 280);
    siguienteAccion = coerceString(matchResult?.siguiente_accion, 'Abre la receta que mejor encaje y revisa los ingredientes que te faltan.', 200);
  }

  return {
    mensaje,
    ingredientes_detectados: ingredientesDetectados,
    recomendaciones,
    siguiente_accion: siguienteAccion,
    catalogo_utilizado: recipes.length,
    descripcion_imagen: coerceString(visionResult?.descripcion_imagen, '', 240),
  };
}

// ─────────────────────────────────────────────
// Funciones de Negocio — Modo Cocina
// ─────────────────────────────────────────────

async function getRecipeCookingContext(recipeId) {
  const result = await pool.query(
    `SELECT
      r.id,
      r.nombre,
      r.descripcion,
      r.tiempo_minutos,
      COALESCE(
        json_agg(
          DISTINCT jsonb_build_object(
            'orden', pr.orden,
            'descripcion', pr.descripcion
          )
        ) FILTER (WHERE pr.id IS NOT NULL),
        '[]'
      ) AS pasos
    FROM recetas r
    LEFT JOIN pasos_receta pr ON pr.receta_id = r.id
    WHERE r.id = $1
    GROUP BY r.id`,
    [recipeId]
  );

  if (result.rowCount === 0) {
    const err = new Error('Receta no encontrada.');
    err.status = 404;
    err.code = 'RECETA_NOT_FOUND';
    throw err;
  }

  return {
    ...result.rows[0],
    pasos: result.rows[0].pasos.sort((a, b) => a.orden - b.orden),
  };
}

async function getCookingMode({ recetaId, raciones = 2 }) {
  const recipe = await getRecipeCookingContext(recetaId);

  const systemPrompt = `Convierte recetas en un modo cocina inmersivo para una app profesional.
Debes conservar el sentido de cada paso y no añadir ingredientes nuevos.
Devuelve SOLO JSON válido con esta forma exacta:
{
  "titulo": "string",
  "intro_tts": "string breve para leer en voz alta",
  "pasos": [
    {
      "orden": number,
      "titulo": "string corto",
      "narracion": "string natural en español para TTS",
      "duracion_segundos": number,
      "timer_recomendado": boolean
    }
  ],
  "cierre_tts": "string breve"
}
Las duraciones deben ser realistas. Si un paso no necesita timer, usa 60 segundos y timer_recomendado false.`;

  const userPrompt = `Raciones seleccionadas: ${raciones}
Receta:
${JSON.stringify(recipe, null, 2)}`;

  const aiResult = await generateJson(systemPrompt, userPrompt);
  const normalized = normalizeCookingModeResult(aiResult, recipe);

  return {
    ...normalized,
    receta_id: recipe.id,
  };
}

// ─────────────────────────────────────────────
// Funciones de Negocio — Plan Semanal
// ─────────────────────────────────────────────

async function getWeeklyPlan({ objetivo, preferencias = [], dias = 7 }) {
  const catalog = await getCatalogWithFallback(40, preferencias);
  const recipes = catalog.map(compactRecipe);
  const recipeIndex = buildRecipeIndex(recipes);

  const systemPrompt = `Eres un planificador semanal culinario para Recetas Hacendado.
Debes usar únicamente recetas existentes del catálogo dado.
No inventes recetas nuevas.
Devuelve SOLO JSON válido con esta forma exacta:
{
  "resumen": "string breve",
  "dias": [
    {
      "dia": "Lunes",
      "receta_id": "uuid de receta existente",
      "receta_nombre": "string",
      "motivo": "por qué encaja ese día"
    }
  ],
  "consejo_compra": "string breve"
}
Debes devolver exactamente ${dias} elementos en "dias" usando días en español y evitando repetir receta salvo que no haya suficientes opciones.`;

  const userPrompt = `Objetivo del usuario: ${objetivo}
Preferencias activas: ${JSON.stringify(preferencias)}

Catálogo disponible:
${JSON.stringify(recipes, null, 2)}`;

  const aiResult = await generateJson(systemPrompt, userPrompt);
  const normalizedDays = normalizeWeeklyPlanDays(aiResult?.dias, recipeIndex, dias);

  return {
    resumen: coerceString(aiResult?.resumen, 'Aquí tienes una propuesta semanal equilibrada basada en recetas reales del catálogo.', 280),
    dias: normalizedDays,
    consejo_compra: coerceString(aiResult?.consejo_compra, 'Agrupa básicos repetidos al principio de la compra para ahorrar tiempo en tienda.', 220),
    catalogo_utilizado: recipes.length,
  };
}

// ─────────────────────────────────────────────
// Funciones de Negocio — Transcripción de Voz (Whisper)
// ─────────────────────────────────────────────

const WHISPER_MODEL = 'whisper-large-v3';

async function transcribeAudio({ audioBuffer, mimeType = 'audio/webm', language = 'es' }) {
  const groq = getGroqClient();

  try {
    const file = new File([audioBuffer], 'audio.webm', { type: mimeType });

    const transcription = await groq.audio.transcriptions.create({
      file,
      model: WHISPER_MODEL,
      language,
      response_format: 'verbose_json',
    });

    return {
      texto: transcription.text || '',
      idioma: transcription.language || language,
      duracion_segundos: transcription.duration || null,
      segmentos: (transcription.segments || []).map((seg) => ({
        texto: seg.text,
        inicio: seg.start,
        fin: seg.end,
      })),
    };
  } catch (error) {
    throw toGroqServiceError(error);
  }
}

module.exports = {
  getMealAssistantResponse,
  scanPantry,
  getCookingMode,
  getWeeklyPlan,
  transcribeAudio,
};

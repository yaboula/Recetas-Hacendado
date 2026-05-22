export const TAG_LABELS = {
  VEGANO: 'Vegano',
  VEGETARIANO: 'Vegetariana',
  SIN_GLUTEN: 'Sin gluten',
  SIN_LACTOSA: 'Sin lactosa',
  SIN_HUEVO: 'Sin huevo',
};

export const TAG_OPTIONS = [
  { id: 'VEGANO', label: 'Vegano' },
  { id: 'VEGETARIANO', label: 'Vegetariana' },
  { id: 'SIN_GLUTEN', label: 'Sin gluten' },
  { id: 'SIN_LACTOSA', label: 'Sin lactosa' },
  { id: 'SIN_HUEVO', label: 'Sin huevo' },
];

export const PREFERENCE_OPTIONS = [
  { key: 'VEGANO', label: 'Vegano' },
  { key: 'VEGETARIANO', label: 'Vegetariano' },
  { key: 'SIN_GLUTEN', label: 'Sin gluten' },
  { key: 'SIN_LACTOSA', label: 'Sin lactosa' },
  { key: 'SIN_HUEVO', label: 'Sin huevo' },
];

function toNumber(value) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  if (typeof value === 'string') {
    const normalized = value.replace(',', '.').trim();
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function getPrimaryTag(tags = []) {
  return tags.find((tag) => TAG_LABELS[tag]) || tags[0] || null;
}

export function getRecipeEyebrow(tags = []) {
  const primaryTag = getPrimaryTag(tags);
  return primaryTag ? TAG_LABELS[primaryTag] || primaryTag : 'Receta Hacendado';
}

export function normalizeCatalogRecipe(recipe) {
  return {
    id: recipe.id,
    title: recipe.nombre,
    description: recipe.descripcion,
    image: recipe.foto_url,
    time: recipe.tiempo_minutos,
    servings: recipe.raciones_base,
    difficulty: recipe.dificultad || null,
    category: recipe.categoria || null,
    calories: recipe.calorias_racion || null,
    author: recipe.autor_origen || null,
    cocina: recipe.cocina || null,
    tags: Array.isArray(recipe.tags) ? recipe.tags : [],
    eyebrow: recipe.categoria || getRecipeEyebrow(recipe.tags),
  };
}

export function normalizeFavoriteRecipe(recipe) {
  return normalizeCatalogRecipe(recipe);
}

function buildRatingSummary(reviews = []) {
  if (!Array.isArray(reviews) || reviews.length === 0) {
    return { average: 0, count: 0 };
  }
  const total = reviews.reduce((acc, review) => acc + toNumber(review.rating), 0);
  return {
    average: Math.round((total / reviews.length) * 10) / 10,
    count: reviews.length,
  };
}

// Agrupa ingredientes por su campo `grupo` ("Para el relleno", "Para la bechamel"...)
// preservando el orden de llegada del backend. Los que no tienen grupo van juntos.
export function groupIngredients(ingredients = []) {
  const groups = new Map();
  for (const ingredient of ingredients) {
    const key = ingredient.group || 'Ingredientes';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(ingredient);
  }
  return Array.from(groups, ([title, items]) => ({ title, items }));
}

export function normalizeDetailRecipe(recipe, precio = null) {
  const reviews = Array.isArray(recipe.reviews)
    ? recipe.reviews.map((review) => ({
        user: review.usuario,
        rating: toNumber(review.rating),
        comment: review.comentario,
        createdAt: review.created_at || null,
      }))
    : [];

  return {
    id: recipe.id,
    title: recipe.nombre,
    description: recipe.descripcion,
    image: recipe.foto_url,
    time: toNumber(recipe.tiempo_minutos),
    servings: toNumber(recipe.raciones_base),
    difficulty: recipe.dificultad || null,
    category: recipe.categoria || null,
    cuisine: recipe.cocina || null,
    calories: recipe.calorias_racion || null,
    author: recipe.autor_origen || null,
    tags: Array.isArray(recipe.tags) ? recipe.tags : [],
    eyebrow: recipe.categoria || getRecipeEyebrow(recipe.tags),
    priceDisplay: precio?.precio_display || null,
    ingredients: Array.isArray(recipe.ingredientes)
      ? recipe.ingredientes.map((ingredient) => ({
          id: ingredient.id,
          name: ingredient.nombre_display || ingredient.producto_nombre,
          qty: toNumber(ingredient.cantidad_base),
          unit: ingredient.unidad,
          group: ingredient.grupo || null,
          section: ingredient.seccion_tienda,
          hacendado: ingredient.producto_id
            ? {
                id: ingredient.producto_id,
                name: ingredient.producto_nombre,
                brand: ingredient.producto_marca || 'Mercadona',
                price: toNumber(ingredient.producto_precio),
                packageQuantity: toNumber(ingredient.cantidad_por_envase),
                baseUnit: ingredient.producto_unidad_base,
                section: ingredient.seccion_tienda,
                thumbnail: ingredient.producto_thumbnail_url || ingredient.producto_image_url || null,
                image: ingredient.producto_image_url || ingredient.producto_thumbnail_url || null,
                shareUrl: ingredient.producto_share_url || null,
              }
            : null,
        }))
      : [],
    steps: Array.isArray(recipe.pasos)
      ? recipe.pasos.map((step) => ({
          orden: step.orden,
          descripcion: step.descripcion,
        }))
      : [],
    tips: Array.isArray(recipe.consejos)
      ? recipe.consejos.map((tip) => ({ orden: tip.orden, texto: tip.texto }))
      : [],
    faq: Array.isArray(recipe.faq)
      ? recipe.faq.map((item) => ({
          orden: item.orden,
          question: item.pregunta,
          answer: item.respuesta,
        }))
      : [],
    reviews,
    rating: buildRatingSummary(reviews),
  };
}

export function buildMealAssistantPrompt({ text, time, mood, people }) {
  const fragments = [];

  if (people) {
    fragments.push(`Quiero una propuesta para ${people} persona${people === 1 ? '' : 's'}.`);
  }
  if (time) {
    fragments.push(`Tengo aproximadamente ${time} minutos disponibles.`);
  }
  if (mood) {
    fragments.push(`Me apetece una comida ${mood}.`);
  }

  if (text?.trim()) {
    fragments.push(`Contexto adicional del usuario: ${text.trim()}`);
  }

  fragments.push('Devuélveme recetas reales del catálogo que encajen bien y explica por qué.');

  return fragments.join(' ');
}

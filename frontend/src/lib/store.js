// Local persistence layer for Phase 1. Backend wiring comes later.
// Uses localStorage with a tiny pub-sub for cross-component updates.

const KEYS = {
  list: "rh.list.v1",
  favs: "rh.favs.v1",
  servings: "rh.servings.v1",
  pantry: "rh.pantry.v1",
};

const listeners = new Set();
function emit() {
  listeners.forEach((fn) => fn());
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    emit();
  } catch {}
}

/* ───────── Lista de compra ───────── */
// Shape: [{ id, name, qty, unit, section, recipeSlug, hacendado, checked }]

export function getList() {
  return read(KEYS.list, []);
}

export function addRecipeToList(recipe, servingsOverride) {
  const list = getList();
  const ratio = (servingsOverride || recipe.servings) / recipe.servings;
  const additions = recipe.ingredients.map((ing) => ({
    id: `${recipe.slug}:${ing.id}`,
    name: ing.name,
    qty: typeof ing.qty === "number" ? +(ing.qty * ratio).toFixed(2) : ing.qty,
    unit: ing.unit,
    section: ing.section,
    recipeSlug: recipe.slug,
    recipeTitle: recipe.title,
    hacendado: ing.hacendado,
    checked: false,
  }));
  // De-dupe by id; existing kept
  const existingIds = new Set(list.map((i) => i.id));
  const merged = [...list, ...additions.filter((a) => !existingIds.has(a.id))];
  write(KEYS.list, merged);
  return additions.length;
}

export function toggleListItem(id) {
  const list = getList().map((i) => (i.id === id ? { ...i, checked: !i.checked } : i));
  write(KEYS.list, list);
}

export function removeListItem(id) {
  write(KEYS.list, getList().filter((i) => i.id !== id));
}

export function clearChecked() {
  write(KEYS.list, getList().filter((i) => !i.checked));
}

export function clearList() {
  write(KEYS.list, []);
}

/* ───────── Favoritos ───────── */
export function getFavs() {
  return read(KEYS.favs, []);
}
export function toggleFav(slug) {
  const favs = getFavs();
  const next = favs.includes(slug) ? favs.filter((s) => s !== slug) : [...favs, slug];
  write(KEYS.favs, next);
}
export function isFav(slug) {
  return getFavs().includes(slug);
}

/* ───────── Estimated total ───────── */
export function estimatedTotal() {
  return getList().reduce((acc, item) => {
    if (item.hacendado && typeof item.hacendado.price === "number") {
      return acc + item.hacendado.price;
    }
    return acc;
  }, 0);
}

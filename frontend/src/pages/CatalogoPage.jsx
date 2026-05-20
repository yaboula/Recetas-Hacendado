import { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { ScanLine, SlidersHorizontal } from "lucide-react";
import { getCatalogo } from "@/api/recetas";
import { getFavoritos, toggleFavorito } from "@/api/favoritos";
import RecipeCard from "@/components/common/RecipeCard";
import AmbientAIBanner from "@/components/common/AmbientAIBanner";
import QueCocinoHoySheet from "@/components/ai/QueCocinoHoySheet";
import EscanearDespensaSheet from "@/components/ai/EscanearDespensaSheet";
import { Button } from "@/components/ui/button";
import { normalizeCatalogRecipe, TAG_OPTIONS } from "@/lib/recipeAdapters";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CatalogoPage() {
  const { search = "" } = useOutletContext() || {};
  const [activeTags, setActiveTags] = useState(new Set());
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [activeDifficulty, setActiveDifficulty] = useState("ALL");
  const [recipes, setRecipes] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [aiOpen, setAiOpen] = useState(false);
  const [scanOpen, setScanOpen] = useState(false);

  const activeTagsArray = useMemo(() => [...activeTags], [activeTags]);

  useEffect(() => {
    setLoading(true);
    getCatalogo({ 
      q: search || undefined, 
      tags: activeTagsArray.join(",") || undefined,
      categoria: activeCategory !== "ALL" ? activeCategory : undefined,
      dificultad: activeDifficulty !== "ALL" ? activeDifficulty : undefined
    })
      .then((data) => setRecipes((data.recetas || []).map(normalizeCatalogRecipe)))
      .catch(() => setRecipes([]))
      .finally(() => setLoading(false));
  }, [search, activeTagsArray, activeCategory, activeDifficulty]);

  useEffect(() => {
    getFavoritos()
      .then((data) => setFavoriteIds(new Set((data.favoritos || []).map((recipe) => recipe.id))))
      .catch(() => setFavoriteIds(new Set()));
  }, []);

  const toggleTag = (tagId) => {
    const next = new Set(activeTags);
    next.has(tagId) ? next.delete(tagId) : next.add(tagId);
    setActiveTags(next);
  };

  const resetFilters = () => {
    setActiveTags(new Set());
    setActiveCategory("ALL");
    setActiveDifficulty("ALL");
  };

  const handleToggleFavorite = async (recipeId) => {
    try {
      const result = await toggleFavorito(recipeId);
      setFavoriteIds((previous) => {
        const next = new Set(previous);
        if (result.favorito) next.add(recipeId);
        else next.delete(recipeId);
        return next;
      });
    } catch {}
  };

  return (
    <div className="container-app pt-10 pb-16" data-testid="catalogo-page">
      <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">Catálogo</p>
          <h1 className="display-xl mt-2 text-balance">Explora el recetario.</h1>
          <p className="text-ink-soft mt-3 max-w-2xl">
            Recetas reales con productos Hacendado, filtros dietéticos y apoyo de IA para decidir más rápido.
          </p>
        </div>
        <p className="meta-mono">{loading ? 'Cargando…' : `${recipes.length} recetas disponibles`}</p>
      </header>

      <section className="mt-8 grid md:grid-cols-2 gap-4">
        <AmbientAIBanner
          eyebrow="IA · Inspiración personalizada"
          title="¿Qué cocino hoy?"
          hint="Tres ideas en menos de un minuto, basadas en tu apetencia y tiempo."
          onClick={() => setAiOpen(true)}
          testid="ai-cta-quecocino"
        />
        <button
          onClick={() => setScanOpen(true)}
          data-testid="ai-cta-scan"
          className="group w-full text-left bg-ink text-paper rounded-xl px-5 py-4 transition-colors flex items-start gap-4 hover:bg-ink/90"
        >
          <span className="h-9 w-9 shrink-0 rounded-full bg-paper/10 grid place-items-center">
            <ScanLine className="h-4 w-4" />
          </span>
          <span className="flex-1 min-w-0">
            <span className="block text-[11px] tracking-[0.14em] uppercase text-paper/60 font-medium">
              IA · Visión por foto
            </span>
            <span className="display-sm block mt-0.5 text-paper" style={{ fontWeight: 500 }}>Escanea tu despensa</span>
            <span className="text-[13px] text-paper/70 block mt-1">Convierte una foto en una lista de recetas posibles.</span>
          </span>
        </button>
      </section>

      <section className="mt-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-paper-raised border border-rule rounded-xl p-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 sm:pb-0">
            <span className="label-cap text-ink-soft shrink-0 mr-1 inline-flex items-center gap-1.5">
              <SlidersHorizontal className="h-3.5 w-3.5" /> Dietas
            </span>
            {TAG_OPTIONS.map((tag) => {
              const active = activeTags.has(tag.id);
              return (
                <button
                  key={tag.id}
                  onClick={() => toggleTag(tag.id)}
                  data-testid={`tag-${tag.id}`}
                  className={`shrink-0 px-3 h-8 rounded-full text-sm border transition-colors ${
                    active
                      ? "bg-ink text-paper border-ink"
                      : "bg-paper text-ink-soft border-rule hover:border-ink hover:text-ink"
                  }`}
                >
                  {tag.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <Select value={activeCategory} onValueChange={setActiveCategory}>
              <SelectTrigger className="w-[140px] h-9 bg-paper border-rule">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todas las cat.</SelectItem>
                <SelectItem value="Principal">Principal</SelectItem>
                <SelectItem value="Entrante">Entrante</SelectItem>
                <SelectItem value="Postre">Postre</SelectItem>
                <SelectItem value="Desayuno/Merienda">Desayuno/Merienda</SelectItem>
                <SelectItem value="Salsa/Acompañamiento">Salsa/Acompañamiento</SelectItem>
              </SelectContent>
            </Select>

            <Select value={activeDifficulty} onValueChange={setActiveDifficulty}>
              <SelectTrigger className="w-[120px] h-9 bg-paper border-rule">
                <SelectValue placeholder="Dificultad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Cualquiera</SelectItem>
                <SelectItem value="Fácil">Fácil</SelectItem>
                <SelectItem value="Media">Media</SelectItem>
                <SelectItem value="Difícil">Difícil</SelectItem>
              </SelectContent>
            </Select>

            {(activeTags.size > 0 || activeCategory !== "ALL" || activeDifficulty !== "ALL") && (
              <Button
                variant="ghost"
                size="sm"
                className="h-9 px-3"
                onClick={resetFilters}
                data-testid="reset-filters"
              >
                Limpiar
              </Button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="rounded-xl border border-rule bg-paper-raised overflow-hidden">
                <div className="skeleton-block aspect-square" />
                <div className="p-4 space-y-3">
                  <div className="skeleton-block h-3 w-24" />
                  <div className="skeleton-block h-6 w-3/4" />
                  <div className="skeleton-block h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : recipes.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="display-md">No hay recetas para esa búsqueda.</h3>
            <p className="text-ink-soft mt-3">Prueba con otro texto o quita algún filtro.</p>
            <Button variant="outline" size="lg" className="mt-6" onClick={resetFilters}>
              Ver todo el catálogo
            </Button>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                favorite={favoriteIds.has(recipe.id)}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        )}
      </section>

      <QueCocinoHoySheet open={aiOpen} onOpenChange={setAiOpen} />
      <EscanearDespensaSheet open={scanOpen} onOpenChange={setScanOpen} />
    </div>
  );
}

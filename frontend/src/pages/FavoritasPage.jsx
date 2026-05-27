import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFavoritos, toggleFavorito } from "@/api/favoritos";
import RecipeCard from "@/components/common/RecipeCard";
import EmptyState from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { normalizeFavoriteRecipe } from "@/lib/recipeAdapters";

export default function FavoritasPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFavoritos()
      .then((data) => setFavorites((data.favoritos || []).map(normalizeFavoriteRecipe)))
      .catch(() => setFavorites([]))
      .finally(() => setLoading(false));
  }, []);

  const handleToggleFavorite = async (recipeId) => {
    try {
      const result = await toggleFavorito(recipeId);
      if (!result.favorito) {
        setFavorites((previous) => previous.filter((recipe) => recipe.id !== recipeId));
      }
    } catch {}
  };

  return (
    <div className="container-app pt-10" data-testid="favoritas-page">
      <header className="flex items-end justify-between">
        <div>
          <p className="eyebrow">Tu biblioteca</p>
          <h1 className="display-xl mt-2">Favoritas.</h1>
          <p className="meta-mono mt-3">{loading ? 'Cargando…' : `${favorites.length} recetas guardadas`}</p>
        </div>
      </header>

      {loading ? (
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
          {Array.from({ length: 3 }).map((_, index) => (
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
      ) : favorites.length === 0 ? (
        <EmptyState
          headline="Aún no tienes favoritas."
          body="Pulsa el corazón en cualquier receta para guardarla aquí y construir tu biblioteca personal Hacendado."
          action={
            <Button asChild size="lg" variant="ink" data-testid="favs-empty-cta">
              <Link to="/catalogo">Explorar catálogo</Link>
            </Button>
          }
        />
      ) : (
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
          {favorites.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              favorite
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
}

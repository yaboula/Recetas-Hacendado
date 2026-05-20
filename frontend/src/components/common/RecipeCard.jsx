import { Link } from "react-router-dom";
import { Heart, Clock, Users } from "lucide-react";
import { getFlagUrl } from "@/lib/utils";
export default function RecipeCard({ recipe, layout = "grid", favorite = false, onToggleFavorite, testid }) {
  const cardTestId = testid || `card-${recipe.id}`;

  if (layout === "horizontal") {
    return (
      <Link
        to={`/recetas/${recipe.id}`}
        className="group flex gap-4 items-center card-quiet rounded-lg p-3 border border-transparent hover:border-rule"
        data-testid={cardTestId}
      >
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-paper-deep">
          {recipe.image ? (
            <img
              src={recipe.image}
              alt={recipe.title}
              className="h-full w-full object-cover transition-opacity"
              loading="lazy"
              onError={(event) => {
                event.currentTarget.style.opacity = 0;
              }}
            />
          ) : null}
        </div>
        <div className="flex-1 min-w-0">
          <p className="eyebrow">{recipe.eyebrow}</p>
          <h3 className="display-sm mt-0.5 truncate">{recipe.title}</h3>
          <p className="meta-mono mt-1 inline-flex items-center gap-2">
            <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{recipe.time} min</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" />{recipe.servings} raciones</span>
            {recipe.difficulty && (
              <>
                <span>·</span>
                <span>{recipe.difficulty}</span>
              </>
            )}
            {recipe.author && (
              <>
                <span>·</span>
                <span>Por {recipe.author}</span>
              </>
            )}
            {recipe.cocina && (
              <>
                <span>·</span>
                <span className="inline-flex items-center gap-1.5">
                  {getFlagUrl(recipe.cocina) && (
                    <img src={getFlagUrl(recipe.cocina)} alt="" className="w-4 h-auto shadow-sm rounded-sm" />
                  )}
                  {recipe.cocina}
                </span>
              </>
            )}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <article className="group relative card-quiet rounded-xl overflow-hidden bg-paper-raised border border-rule" data-testid={cardTestId}>
      <Link to={`/recetas/${recipe.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-paper-deep">
          {recipe.image ? (
            <img
              src={recipe.image}
              alt={recipe.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              onError={(event) => {
                event.currentTarget.style.opacity = 0;
              }}
            />
          ) : null}
        </div>
        <div className="p-4 pb-5">
          <p className="eyebrow">{recipe.eyebrow}</p>
          <h3 className="display-sm mt-1 text-balance leading-tight">{recipe.title}</h3>
          <div className="meta-mono mt-3 flex items-center gap-2 flex-wrap">
            <span>{recipe.time} min</span>
            <span>·</span>
            <span>{recipe.servings} raciones</span>
            {recipe.difficulty && (
              <>
                <span>·</span>
                <span>{recipe.difficulty}</span>
              </>
            )}
            {recipe.author && (
              <>
                <span>·</span>
                <span>Por {recipe.author}</span>
              </>
            )}
            {recipe.cocina && (
              <>
                <span>·</span>
                <span className="inline-flex items-center gap-1.5">
                  {getFlagUrl(recipe.cocina) && (
                    <img src={getFlagUrl(recipe.cocina)} alt="" className="w-4 h-auto shadow-sm rounded-sm" />
                  )}
                  {recipe.cocina}
                </span>
              </>
            )}
            {recipe.tags?.length ? (
              <>
                <span>·</span>
                <span>{recipe.tags.slice(0, 2).map((tag) => tag.replaceAll('_', ' ')).join(' · ')}</span>
              </>
            ) : null}
          </div>
        </div>
      </Link>
      {onToggleFavorite ? (
        <button
          onClick={(event) => {
            event.preventDefault();
            onToggleFavorite(recipe.id, !favorite);
          }}
          aria-label={favorite ? "Quitar de favoritas" : "Añadir a favoritas"}
          aria-pressed={favorite}
          data-testid={`fav-${recipe.id}`}
          className="absolute top-3 right-3 h-9 w-9 grid place-items-center rounded-full bg-paper/85 backdrop-blur-sm border border-transparent hover:border-rule transition-colors"
        >
          <Heart className={`h-4 w-4 transition-colors ${favorite ? "fill-tomate text-tomate" : "text-ink"}`} />
        </button>
      ) : null}
    </article>
  );
}

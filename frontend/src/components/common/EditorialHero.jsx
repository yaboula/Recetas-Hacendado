import { Link } from "react-router-dom";
import { ArrowRight, Clock, Users } from "lucide-react";

export default function EditorialHero({ recipe }) {
  if (!recipe) return null;
  return (
    <section className="container-app mt-6" data-testid="editorial-hero">
      <div className="grid md:grid-cols-12 gap-6 md:gap-10 items-stretch bg-paper-raised border border-rule rounded-2xl overflow-hidden">
        {/* Image */}
        <div className="md:col-span-7 relative aspect-[4/5] md:aspect-auto bg-paper-deep grain overflow-hidden">
          <img
            src={recipe.image}
            alt=""
            className="h-full w-full object-cover"
            onError={(e) => (e.currentTarget.style.opacity = 0)}
          />
        </div>

        {/* Text */}
        <div className="md:col-span-5 p-8 md:p-12 flex flex-col justify-between">
          <div>
            <p className="eyebrow">Receta de la semana · {recipe.eyebrow}</p>
            <h1 className="display-xl mt-4 text-balance leading-[0.98]">
              {recipe.title}
            </h1>
            <p className="mt-5 text-[15px] md:text-base text-ink-soft max-w-md leading-relaxed">
              {recipe.description}
            </p>
            <div className="meta-mono mt-6 flex flex-wrap items-center gap-4">
              <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {recipe.time} min</span>
              <span>·</span>
              <span className="inline-flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> {recipe.servings} raciones</span>
              {recipe.tags?.length ? (
                <>
                  <span>·</span>
                  <span className="text-ink">{recipe.tags.slice(0, 2).map((tag) => tag.replaceAll('_', ' ')).join(' · ')}</span>
                </>
              ) : null}
            </div>
          </div>

          <div className="mt-10 flex items-center gap-5">
            <Link
              to={`/recetas/${recipe.id}`}
              className="group inline-flex items-center gap-2 text-ink"
              data-testid="hero-cta"
            >
              <span className="display-sm" style={{ fontWeight: 500 }}>Cocinar esta receta</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

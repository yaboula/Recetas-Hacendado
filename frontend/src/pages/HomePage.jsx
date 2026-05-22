import { useEffect, useMemo, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { getCatalogo } from '@/api/recetas';
import { getFavoritos, toggleFavorito } from '@/api/favoritos';
import RecipeCard from '@/components/common/RecipeCard';
import QueCocinoHoySheet from '@/components/ai/QueCocinoHoySheet';
import EscanearDespensaSheet from '@/components/ai/EscanearDespensaSheet';
import { Button } from '@/components/ui/button';
import { normalizeCatalogRecipe } from '@/lib/recipeAdapters';
import { ArrowRight, Sparkles, ShoppingBasket, ChefHat, Camera, Mic, Maximize2 } from 'lucide-react';

export default function HomePage() {
  const { search = '' } = useOutletContext() || {};
  const [recipes, setRecipes] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [aiOpen, setAiOpen] = useState(false);
  const [scanOpen, setScanOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    getCatalogo({ q: search || undefined })
      .then((data) => setRecipes((data.recetas || []).map(normalizeCatalogRecipe)))
      .catch(() => setRecipes([]))
      .finally(() => setLoading(false));
  }, [search]);

  useEffect(() => {
    getFavoritos()
      .then((data) => setFavoriteIds(new Set((data.favoritos || []).map((recipe) => recipe.id))))
      .catch(() => setFavoriteIds(new Set()));
  }, []);

  const curatedRecipes = useMemo(() => recipes.slice(0, 6), [recipes]);

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
    <div className="pb-20" data-testid="home-page">

      {/* ═══════════ HERO EDITORIAL ═══════════ */}
      <section className="bg-paper-deep border-b border-rule">
        <div className="container-app py-8 md:py-12">
          <div className="relative min-h-[600px] overflow-hidden rounded-[2rem] border border-rule bg-paper-raised shadow-sm">
            <img
              src="/images/hero-home.png"
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-paper-raised via-paper-raised/92 to-paper-raised/10" />
            <div className="absolute left-0 top-0 h-full w-full md:w-[58%] bg-[radial-gradient(circle_at_20%_20%,rgba(23,106,69,0.10),transparent_34%)]" />

            <div className="relative z-10 flex min-h-[600px] items-center px-6 py-10 md:px-12 lg:px-16">
              <div className="max-w-[620px]">
                <div className="inline-flex items-center gap-2 rounded-full border border-mercadona/20 bg-mercadona/10 px-3 py-1.5 text-xs font-semibold text-mercadona">
                  <Sparkles className="h-3.5 w-3.5" />
                  Nueva forma de cocinar con productos reales
                </div>

                <h1 className="mt-7 text-ink text-[clamp(2.6rem,5.8vw,5.4rem)] font-bold leading-[0.96] tracking-[-0.04em] text-balance">
                  Recetas que acaban en una compra real.
                </h1>

                <p className="mt-6 max-w-xl text-lg md:text-xl leading-relaxed text-ink-soft">
                  Inspírate, elige qué cocinar y convierte cada receta en una lista organizada con productos Hacendado.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Button variant="mercadona" size="xl" onClick={() => setAiOpen(true)} data-testid="home-ai-cta">
                    <Sparkles className="h-4 w-4" />
                    ¿Qué cocino hoy?
                  </Button>
                  <Button asChild variant="outline" size="xl" data-testid="home-catalogo-cta">
                    <Link to="/catalogo">
                      Explorar catálogo
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>

                <div className="mt-10 grid max-w-lg grid-cols-3 gap-3">
                  <HeroProof value="50+" label="recetas" />
                  <HeroProof value="200+" label="productos" />
                  <HeroProof value="<45" label="minutos" />
                </div>
              </div>
            </div>

            <div className="absolute bottom-5 right-5 hidden max-w-xs rounded-2xl border border-white/20 bg-white/85 p-4 shadow-xl backdrop-blur-sm lg:block">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-mercadona">
                Compra calculada
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                Ingredientes agrupados por sección, precio estimado y productos listos para añadir.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ PROPUESTA DE VALOR ═══════════ */}
      <section className="container-app mt-16 md:mt-20">
        <div className="text-center max-w-2xl mx-auto">
          <p className="eyebrow">¿Por qué Recetas Hacendado?</p>
          <h2 className="display-xl mt-3 text-balance">
            Del antojo a la compra, sin fricción.
          </h2>
          <p className="text-ink-soft mt-4 text-base leading-relaxed">
            Tres pilares que transforman tu forma de cocinar y hacer la compra semanal.
          </p>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <ValueCard
            image="/images/value-products.png"
            title="Productos reales de Mercadona"
            description="Cada ingrediente está vinculado a un producto Hacendado real con precio actualizado. Sin sorpresas en caja."
            icon={<ShoppingBasket className="h-5 w-5" />}
          />
          <ValueCard
            image="/images/value-smart.png"
            title="Inteligencia que entiende tu cocina"
            description="Dile qué te apetece, cuánto tiempo tienes o qué hay en tu nevera. Recibirás propuestas concretas en segundos."
            icon={<Sparkles className="h-5 w-5" />}
          />
          <ValueCard
            image="/images/cta-mealprep.png"
            title="De la receta a la lista de la compra"
            description="Un toque y los ingredientes se agrupan por sección de supermercado. Tu compra organizada antes de salir de casa."
            icon={<ChefHat className="h-5 w-5" />}
          />
        </div>
      </section>

      {/* ═══════════ AI SURFACES ═══════════ */}
      <section className="container-app mt-16 md:mt-20">
        <div className="max-w-2xl">
          <p className="eyebrow">Experiencias inteligentes</p>
          <h2 className="display-lg mt-2 text-balance">Tres formas de cocinar con contexto real.</h2>
          <p className="mt-3 text-ink-soft leading-relaxed">
            Cámara, voz y modo cocina trabajan sobre el catálogo y las recetas disponibles para ayudarte sin romper el ritmo.
          </p>
        </div>
        <div className="mt-8 grid md:grid-cols-3 gap-5">
        <button
          type="button"
          onClick={() => setAiOpen(true)}
          data-testid="home-ai-banner"
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-mercadona/10 to-mercadona/5 border border-mercadona/20 p-7 text-left transition-all hover:border-mercadona/40 hover:shadow-lg"
        >
          <div className="absolute top-4 right-4 h-10 w-10 rounded-full bg-mercadona/10 grid place-items-center">
            <Mic className="h-5 w-5 text-mercadona" />
          </div>
          <p className="eyebrow text-mercadona">Voz + TTS</p>
          <p className="display-sm mt-2 text-balance">Asistente de voz</p>
          <p className="text-ink-soft mt-3 text-sm leading-relaxed max-w-sm">
            Habla con la app, usa prompts rápidos y recibe una respuesta narrada en español.
          </p>
          <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-mercadona group-hover:gap-3 transition-all">
            Probar asistente <ArrowRight className="h-4 w-4" />
          </span>
        </button>

        <button
          type="button"
          onClick={() => setScanOpen(true)}
          data-testid="home-mercadona-banner"
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-ink/5 to-ink/[0.02] border border-rule p-7 text-left transition-all hover:border-ink/30 hover:shadow-lg"
        >
          <div className="absolute top-4 right-4 h-10 w-10 rounded-full bg-ink/5 grid place-items-center">
            <Camera className="h-5 w-5 text-ink-soft" />
          </div>
          <p className="eyebrow">Visión por cámara</p>
          <p className="display-sm mt-2 text-balance">Escanea tu despensa</p>
          <p className="text-ink-soft mt-3 text-sm leading-relaxed max-w-sm">
            Cámara en vivo, detección de ingredientes y recetas posibles desde lo que ya tienes.
          </p>
          <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-ink group-hover:gap-3 transition-all">
            Abrir cámara <ArrowRight className="h-4 w-4" />
          </span>
        </button>

        <Link
          to={curatedRecipes[0] ? `/recetas/${curatedRecipes[0].id}` : '/catalogo'}
          className="group relative overflow-hidden rounded-2xl bg-paper-raised border border-rule p-7 text-left transition-all hover:border-ink/30 hover:shadow-lg"
        >
          <div className="absolute top-4 right-4 h-10 w-10 rounded-full bg-mercadona/10 grid place-items-center">
            <Maximize2 className="h-5 w-5 text-mercadona" />
          </div>
          <p className="eyebrow text-mercadona">Modo cocina</p>
          <p className="display-sm mt-2 text-balance">Cocina paso a paso</p>
          <p className="text-ink-soft mt-3 text-sm leading-relaxed max-w-sm">
            Pantalla completa, pasos narrados, swipe para avanzar y temporizador por paso.
          </p>
          <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-mercadona group-hover:gap-3 transition-all">
            Ver una receta <ArrowRight className="h-4 w-4" />
          </span>
        </Link>
        </div>
      </section>

      {/* ═══════════ RECETAS DESTACADAS ═══════════ */}
      <section className="container-app mt-16 md:mt-20">
        <header className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Selección editorial</p>
            <h2 className="display-lg mt-2">Recetas para inspirarte esta semana.</h2>
          </div>
          <Link to="/catalogo" className="link-editorial text-sm hidden sm:inline-flex items-center gap-1">
            Ver todo el catálogo <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </header>

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
        ) : (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
            {curatedRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                favorite={favoriteIds.has(recipe.id)}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Button asChild variant="outline" size="lg">
            <Link to="/catalogo">Ver catálogo completo</Link>
          </Button>
        </div>
      </section>

      {/* ═══════════ CTA FINAL ═══════════ */}
      <section className="container-app mt-20">
        <div className="relative overflow-hidden rounded-2xl border border-rule bg-paper-raised">
          <img
            src="/images/cta-mealprep.png"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-paper-raised via-paper-raised/95 to-paper-raised/25" />
          <div className="relative z-10 px-8 py-12 md:px-12 md:py-16 max-w-xl">
            <p className="eyebrow text-mercadona">
              Empieza hoy
            </p>
            <h2 className="mt-4 text-ink text-[clamp(1.8rem,3.5vw,3rem)] font-bold leading-[1.08] text-balance">
              Tu próxima semana, resuelta en minutos.
            </h2>
            <p className="mt-4 text-ink-soft text-base leading-relaxed max-w-md">
              Elige recetas, genera tu lista y compra con confianza. Todo con productos que ya conoces.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button variant="mercadona" size="xl" asChild>
                <Link to="/catalogo">
                  Descubrir recetas
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="xl" onClick={() => setAiOpen(true)}>
                <Sparkles className="h-4 w-4" />
                Pregunta a la IA
              </Button>
            </div>
          </div>
        </div>
      </section>

      <QueCocinoHoySheet open={aiOpen} onOpenChange={setAiOpen} />
      <EscanearDespensaSheet open={scanOpen} onOpenChange={setScanOpen} />
    </div>
  );
}

function HeroProof({ value, label }) {
  return (
    <div className="rounded-2xl border border-rule bg-white/70 px-4 py-3 shadow-sm">
      <p className="text-xl font-bold leading-none text-ink">{value}</p>
      <p className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-ink-soft">{label}</p>
    </div>
  );
}

function ValueCard({ image, title, description, icon }) {
  return (
    <div className="group rounded-2xl border border-rule bg-paper-raised overflow-hidden transition-all hover:shadow-lg hover:border-ink/20">
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt=""
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-6">
        <div className="h-9 w-9 rounded-full bg-mercadona/10 grid place-items-center mb-4">
          <span className="text-mercadona">{icon}</span>
        </div>
        <h3 className="text-lg font-semibold text-ink leading-snug">{title}</h3>
        <p className="mt-2 text-sm text-ink-soft leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

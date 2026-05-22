import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Clock, Heart, ShoppingBasket, Check, Maximize2, X, Volume2,
  ChevronLeft, ChevronRight, Play, Pause, Star, Leaf, WheatOff, MilkOff,
  EggOff, Lightbulb, ChefHat, Flame, Users, Gauge, Coins, MessageSquareQuote,
  VolumeX, Mic, MicOff, Timer, PartyPopper, Share2, Utensils, RotateCcw, Bell,
} from "lucide-react";
import { getCatalogo, getPrecio, getReceta } from "@/api/recetas";
import { getCookingMode } from "@/api/ai";
import { addReceta } from "@/api/lista";
import { getFavoritos, toggleFavorito } from "@/api/favoritos";
import { getFlagUrl } from "@/lib/utils";
import Stepper from "@/components/common/Stepper";
import RecipeCard from "@/components/common/RecipeCard";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { normalizeCatalogRecipe, normalizeDetailRecipe, groupIngredients } from "@/lib/recipeAdapters";

// Dietas / alérgenos con peso visual: las dietas "positivas" llevan acento verde/oliva;
// los "libre de" usan tono neutro cálido. Icono lucide siempre.
const DIET_META = {
  VEGANO: { label: "Vegano", Icon: Leaf, cls: "bg-tomate-soft text-tomate" },
  VEGETARIANO: { label: "Vegetariana", Icon: Leaf, cls: "bg-oliva-soft text-oliva" },
  SIN_GLUTEN: { label: "Sin gluten", Icon: WheatOff, cls: "bg-paper-deep text-ink-soft" },
  SIN_LACTOSA: { label: "Sin lactosa", Icon: MilkOff, cls: "bg-paper-deep text-ink-soft" },
  SIN_HUEVO: { label: "Sin huevo", Icon: EggOff, cls: "bg-paper-deep text-ink-soft" },
};

export default function RecetaPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [related, setRelated] = useState([]);
  const [servings, setServings] = useState(2);
  const [favorite, setFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [price, setPrice] = useState(null);
  const [added, setAdded] = useState(false);
  const [cookingOpen, setCookingOpen] = useState(false);
  const [showBar, setShowBar] = useState(false);

  const safeParseNumber = (value, fallback = 0) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  };

  useEffect(() => {
    const onScroll = () => setShowBar(window.scrollY > 560);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getReceta(id),
      getCatalogo().catch(() => ({ recetas: [] })),
      getFavoritos().catch(() => ({ favoritos: [] })),
      getPrecio(id, 2).catch(() => null),
    ])
      .then(([recetaData, catalogData, favoritesData, priceData]) => {
        const normalizedRecipe = normalizeDetailRecipe(recetaData, priceData);
        setRecipe(normalizedRecipe);
        setServings(safeParseNumber(recetaData.raciones_base, normalizedRecipe.servings || 2));
        setPrice(priceData);
        setFavorite((favoritesData.favoritos || []).some((item) => item.id === recetaData.id));
        setRelated(
          (catalogData.recetas || [])
            .filter((item) => item.id !== recetaData.id)
            .slice(0, 3)
            .map(normalizeCatalogRecipe),
        );
      })
      .catch(() => setRecipe(null))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!recipe) return;
    getPrecio(id, servings)
      .then((data) => setPrice(data))
      .catch(() => setPrice(null));
  }, [id, servings, recipe]);

  if (!loading && !recipe) {
    return (
      <div className="container-app py-20 text-center">
        <h2 className="display-md">Receta no encontrada.</h2>
        <Link to="/catalogo" className="link-editorial mt-4 inline-block">Volver al catálogo</Link>
      </div>
    );
  }

  if (loading || !recipe) {
    return (
      <div className="container-app py-20">
        <div className="rounded-2xl border border-rule bg-paper-raised overflow-hidden">
          <div className="skeleton-block aspect-[16/8]" />
          <div className="p-8 space-y-4">
            <div className="skeleton-block h-4 w-24" />
            <div className="skeleton-block h-10 w-2/3" />
            <div className="skeleton-block h-5 w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  const ratio = servings / recipe.servings;
  const hacendadoCount = recipe.ingredients.filter((ingredient) => ingredient.hacendado).length;
  const estimatedListPrice = recipe.ingredients.reduce(
    (acc, ingredient) => acc + (ingredient.hacendado?.price || 0),
    0
  );
  const ingredientGroups = groupIngredients(recipe.ingredients);
  const dietTags = recipe.tags.filter((tag) => DIET_META[tag]);
  const freeTags = recipe.tags.filter((tag) => !DIET_META[tag]);

  const handleAdd = async () => {
    try {
      await addReceta(id, servings);
      setAdded(true);
      toast.success(`Ingredientes añadidos a tu lista.`, {
        description: `Listos para comprar en Mercadona para ${servings} raciones.`,
      });
      window.setTimeout(() => setAdded(false), 2400);
    } catch {
      toast.error("No hemos podido añadir esta receta a tu lista.");
    }
  };

  const handleToggleFavorite = async () => {
    try {
      const result = await toggleFavorito(id);
      setFavorite(result.favorito);
    } catch {}
  };

  return (
    <article data-testid="receta-page">
      {/* Back nav */}
      <div className="container-app pt-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-ink-soft hover:text-ink transition-colors"
          data-testid="back-btn"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </button>
      </div>

      {/* Editorial hero */}
      <header className="container-app mt-6 grid md:grid-cols-12 gap-8 md:gap-12 items-start">
        <div className="md:col-span-6 lg:col-span-7">
          <div className="relative aspect-[4/5] bg-paper-deep rounded-2xl overflow-hidden grain">
            <img
              src={recipe.image}
              alt=""
              className="h-full w-full object-cover"
              onError={(e) => (e.currentTarget.style.opacity = 0)}
            />
          </div>
        </div>

        <div className="md:col-span-6 lg:col-span-5 md:sticky md:top-24 self-start">
          <div className="eyebrow flex items-center gap-2">
            {[recipe.category, recipe.cuisine].filter(Boolean).join(" · ") || recipe.eyebrow}
            {recipe.cuisine && getFlagUrl(recipe.cuisine) && (
              <img src={getFlagUrl(recipe.cuisine)} alt="" className="w-5 h-auto rounded-sm shadow-sm" />
            )}
          </div>
          <h1 className="display-xl mt-3 text-balance">{recipe.title}</h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
            {recipe.rating.count > 0 && (
              <StarRating value={recipe.rating.average} size={16} className="text-ink">
                <span className="num-mono text-sm text-ink">{recipe.rating.average.toFixed(1)}</span>
                <span className="meta-mono">({recipe.rating.count} reseñas)</span>
              </StarRating>
            )}
            {recipe.author && (
              <span className="meta-mono text-ink-soft">Por {recipe.author}</span>
            )}
          </div>

          <p className="mt-5 text-ink-soft text-[15px] leading-relaxed max-w-md">{recipe.description}</p>

          {(dietTags.length > 0 || freeTags.length > 0) && (
            <div className="mt-5 flex flex-wrap gap-2" data-testid="diet-chips">
              {dietTags.map((tag) => {
                const { label, Icon, cls } = DIET_META[tag];
                return (
                  <span
                    key={tag}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${cls}`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                  </span>
                );
              })}
              {freeTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full bg-paper-deep px-3 py-1.5 text-xs font-medium text-ink-soft"
                >
                  {tag.replaceAll("_", " ").toLowerCase()}
                </span>
              ))}
            </div>
          )}

          <dl className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 hairline-t hairline-b py-5 gap-2">
            <Meta term="Tiempo" value={`${recipe.time} min`} icon={<Clock className="h-3.5 w-3.5" />} />
            <Meta term="Raciones" value={`${recipe.servings} base`} icon={<Users className="h-3.5 w-3.5" />} />
            <Meta term="Dificultad" value={recipe.difficulty || "—"} icon={<Gauge className="h-3.5 w-3.5" />} />
            <Meta term="Calorías" value={recipe.calories ? `${recipe.calories} kcal` : "—"} icon={<Flame className="h-3.5 w-3.5" />} />
            <Meta term="Precio" value={price?.precio_display || "—"} icon={<Coins className="h-3.5 w-3.5" />} highlight />
          </dl>

          <div className="mt-7 flex items-center justify-between">
            <div>
              <p className="label-cap text-ink-soft">Raciones ({recipe.servings} base)</p>
              <div className="mt-2">
                <Stepper value={servings} onChange={setServings} min={1} max={12} testid="servings-stepper" />
              </div>
            </div>
            <button
              onClick={handleToggleFavorite}
              aria-pressed={favorite}
              data-testid="fav-toggle"
              className="h-11 w-11 rounded-full border border-rule hover:border-ink grid place-items-center transition-colors"
              aria-label="Favorita"
            >
              <Heart className={`h-5 w-5 ${favorite ? "fill-tomate text-tomate" : "text-ink"}`} />
            </button>
          </div>

          <Button
            size="xl"
            onClick={handleAdd}
            className="mt-7 w-full"
            data-testid="add-to-list"
          >
            {added ? (
              <>
                <Check className="h-4 w-4" />
                Añadido a tu lista
              </>
            ) : (
              <>
                <ShoppingBasket className="h-4 w-4" />
                Añadir ingredientes a la lista
              </>
            )}
          </Button>

          {/* Modo cocina — co-protagonista, tratamiento de "experiencia" */}
          <button
            onClick={() => setCookingOpen(true)}
            className="group mt-3 flex w-full items-center gap-4 rounded-xl bg-ink px-5 py-3 text-left text-paper transition-colors hover:bg-ink/90"
            data-testid="open-cooking-mode"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/10 transition-transform group-hover:scale-105">
              <ChefHat className="h-5 w-5" />
            </span>
            <span className="flex-1">
              <span className="block text-[15px] font-medium">Abrir modo cocina</span>
              <span className="block text-xs text-paper/60">Manos libres · pasos guiados por voz</span>
            </span>
            <Maximize2 className="h-4 w-4 text-paper/60 transition-colors group-hover:text-paper" />
          </button>

          <p className="meta-mono mt-3 text-center">
            {hacendadoCount} de {recipe.ingredients.length} con producto Hacendado · Aprox. 
            <span className="text-ink"> {estimatedListPrice.toFixed(2)} €</span>
          </p>
        </div>
      </header>

      {/* Body: ingredients (sticky) + steps */}
      <section className="container-app mt-20 grid md:grid-cols-12 gap-12">
        {/* Ingredients */}
        <aside className="md:col-span-5 lg:col-span-4 md:sticky md:top-24 self-start" data-testid="ingredients">
          <p className="eyebrow">Ingredientes</p>
          <h2 className="display-md mt-2">Para {servings} raciones.</h2>
          <div className="mt-6 space-y-7">
            {ingredientGroups.map((group) => (
              <div key={group.title} data-testid="ingredient-group">
                {ingredientGroups.length > 1 && (
                  <p className="label-cap text-ink-soft">{group.title}</p>
                )}
                <ul className={`${ingredientGroups.length > 1 ? "mt-2" : ""} divide-y divide-rule border-y border-rule`}>
                  {group.items.map((ing) => {
                    const qty = typeof ing.qty === "number" ? +(ing.qty * ratio).toFixed(2) : ing.qty;
                    return (
                      <li key={ing.id} className="py-3.5 flex items-center gap-3" data-testid={`ing-${ing.id}`}>
                        {ing.hacendado?.thumbnail ? (
                          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-paper-deep border border-rule">
                            <img 
                              src={ing.hacendado.thumbnail} 
                              alt="" 
                              className="h-full w-full object-cover" 
                              loading="lazy" 
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.style.display = 'none';
                                if(e.currentTarget.parentElement) {
                                  e.currentTarget.parentElement.classList.add('grid', 'place-items-center');
                                  e.currentTarget.parentElement.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-package text-ink-soft opacity-50"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>`;
                                }
                              }}
                            />
                          </div>
                        ) : (
                          <div className="h-12 w-12 shrink-0 rounded-xl bg-paper-deep border border-rule" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-[15px] text-ink">{ing.name}</p>
                          {ing.hacendado && (
                            <p className="meta-mono mt-1 inline-flex items-center gap-1.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-mercadona" />
                              {ing.hacendado.brand} · {ing.hacendado.price.toFixed(2)} €
                            </p>
                          )}
                        </div>
                        <span className="num-mono text-sm text-ink whitespace-nowrap">
                          {qty} {ing.unit}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </aside>

        {/* Steps */}
        <div className="md:col-span-7 lg:col-span-8 prose-recipe" data-testid="steps">
          <p className="eyebrow">Preparación</p>
          <h2 className="display-md mt-2">Paso a paso.</h2>
          <ol className="mt-8 space-y-10">
            {recipe.steps.map((s, i) => (
              <li key={s.orden} className="grid grid-cols-[auto_1fr] gap-6 items-start">
                <span className="display-md text-ink-soft tabular-nums leading-none pt-1" style={{ fontStyle: "italic" }}>
                  {String(s.orden).padStart(2, "0")}
                </span>
                <p className="text-[17px] leading-[1.7] text-ink">{s.descripcion}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Consejos y trucos */}
      {recipe.tips.length > 0 && (
        <section className="container-app mt-24" data-testid="tips">
          <p className="eyebrow">Consejos y trucos</p>
          <h2 className="display-lg mt-2">Notas del cocinero.</h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {recipe.tips.map((tip) => (
              <li
                key={tip.orden}
                className="flex items-start gap-4 rounded-2xl border border-rule bg-paper-raised p-5"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-paper-deep">
                  <Lightbulb className="h-4.5 w-4.5 text-warn" />
                </span>
                <p className="text-[15px] leading-relaxed text-ink">{tip.texto}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* FAQ */}
      {recipe.faq.length > 0 && (
        <section className="container-app mt-24" data-testid="faq">
          <p className="eyebrow">Preguntas frecuentes</p>
          <h2 className="display-lg mt-2">Antes de empezar.</h2>
          <dl className="mt-8 border-y border-rule divide-y divide-rule">
            {recipe.faq.map((item) => (
              <div key={item.orden} className="grid gap-2 py-6 md:grid-cols-12 md:gap-8">
                <dt className="display-sm md:col-span-5">{item.question}</dt>
                <dd className="text-[15px] leading-relaxed text-ink-soft md:col-span-7">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {/* Reseñas */}
      {recipe.reviews.length > 0 && (
        <section className="container-app mt-24" data-testid="reviews">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">Reseñas</p>
              <h2 className="display-lg mt-2">Lo que opina la gente.</h2>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-rule bg-paper-raised px-5 py-4">
              <span className="display-md leading-none">{recipe.rating.average.toFixed(1)}</span>
              <div>
                <StarRating value={recipe.rating.average} size={16} />
                <p className="meta-mono mt-1">{recipe.rating.count} reseñas</p>
              </div>
            </div>
          </div>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {recipe.reviews.map((review, i) => (
              <li key={i} className="rounded-2xl border border-rule bg-paper-raised p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-paper-deep text-sm font-medium text-ink">
                      {review.user?.trim().charAt(0).toUpperCase() || "?"}
                    </span>
                    <span className="text-[15px] font-medium text-ink">{review.user}</span>
                  </div>
                  <StarRating value={review.rating} size={13} />
                </div>
                <p className="mt-3 flex gap-2 text-[15px] leading-relaxed text-ink-soft">
                  <MessageSquareQuote className="h-4 w-4 shrink-0 text-ink-faint" />
                  {review.comment}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Pairing */}
      {related.length > 0 && (
        <section className="container-app mt-24 pb-16">
          <header className="flex items-end justify-between">
            <div>
              <p className="eyebrow">Combina bien con</p>
              <h2 className="display-lg mt-2">Otras tres ideas.</h2>
            </div>
          </header>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
            {related.map((r) => (
              <RecipeCard key={r.id} recipe={r} />
            ))}
          </div>
        </section>
      )}
      {/* Barra sticky de acciones — aparece al hacer scroll, sin tapar BottomNav en móvil */}
      <div
        className={`fixed inset-x-0 bottom-16 z-30 md:bottom-0 transition-transform duration-300 ${
          showBar && !cookingOpen ? "translate-y-0" : "translate-y-[160%]"
        }`}
        data-testid="sticky-actions"
      >
        <div className="container-app pb-3 md:pb-4">
          <div className="flex items-center gap-3 rounded-2xl bg-ink p-2.5 text-paper shadow-raised">
            <div className="hidden min-w-0 flex-1 pl-2 sm:block">
              <p className="truncate text-sm font-medium">{recipe.title}</p>
              <p className="meta-mono text-paper/60">
                {servings} raciones · {price?.precio_display || "—"}
              </p>
            </div>
            <button
              onClick={() => setCookingOpen(true)}
              className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-white/10 px-4 text-sm font-medium transition-colors hover:bg-white/15 sm:flex-none"
            >
              <ChefHat className="h-4 w-4" />
              Modo cocina
            </button>
            <button
              onClick={handleAdd}
              className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-tomate px-4 text-sm font-medium text-white transition-colors hover:bg-tomate-dark sm:flex-none"
            >
              {added ? <Check className="h-4 w-4" /> : <ShoppingBasket className="h-4 w-4" />}
              {added ? "Añadido" : "Añadir a la lista"}
            </button>
          </div>
        </div>
      </div>

      <CookingModeOverlay
        open={cookingOpen}
        onOpenChange={setCookingOpen}
        recipe={recipe}
        servings={servings}
      />
    </article>
  );
}

function StarRating({ value = 0, size = 16, className = "", children }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className="inline-flex items-center gap-0.5" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => {
          const fill = Math.max(0, Math.min(1, value - i));
          return (
            <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
              <Star className="absolute inset-0 text-rule" style={{ width: size, height: size }} />
              <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                <Star className="text-warn fill-warn" style={{ width: size, height: size }} />
              </span>
            </span>
          );
        })}
      </span>
      {children}
    </span>
  );
}

function Meta({ term, value, icon, highlight }) {
  return (
    <div>
      <dt className="meta-mono inline-flex items-center gap-1">{icon}{term}</dt>
      <dd className={`mt-1 num-mono text-[15px] ${highlight ? "text-tomate" : "text-ink"}`}>{value}</dd>
    </div>
  );
}

// Detecta minutos/horas en el texto del paso para precargar el temporizador.
// "16-18 minutos" -> 18 min; "12 min" -> 12 min; "1 hora" -> 60 min.
function parseStepMinutes(text = "") {
  const t = String(text).toLowerCase();
  const range = t.match(/(\d+)\s*[-–a]\s*(\d+)\s*min/);
  if (range) return parseInt(range[2], 10) * 60;
  const mins = t.match(/(\d+)\s*min/);
  if (mins) return parseInt(mins[1], 10) * 60;
  const hours = t.match(/(\d+)\s*h(?:ora)?/);
  if (hours) return parseInt(hours[1], 10) * 3600;
  return null;
}

const supportsSpeechRecognition =
  typeof window !== "undefined" &&
  (window.SpeechRecognition || window.webkitSpeechRecognition);

function CookingModeOverlay({ open, onOpenChange, recipe, servings }) {
  const [mode, setMode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState("mise"); // mise | cooking | done
  const [index, setIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [running, setRunning] = useState(false);
  const [timerDone, setTimerDone] = useState(false);
  const [voiceOn, setVoiceOn] = useState(true); // auto-narración TTS
  const [listening, setListening] = useState(false); // control por voz
  const [resumeIndex, setResumeIndex] = useState(0);
  const [rating, setRating] = useState(0);
  const [confirmClose, setConfirmClose] = useState(false);
  const [savedFav, setSavedFav] = useState(false);

  const wakeRef = useRef(null);
  const audioRef = useRef(null);
  const alarmedRef = useRef(false);
  const voiceOnRef = useRef(true);
  const cmdRef = useRef(() => {});
  const touchX = useRef(null);

  voiceOnRef.current = voiceOn;
  const storageKey = recipe ? `cookmode:${recipe.id}` : null;

  // Cache voices as soon as Chrome loads them (async event)
  const cachedVoicesRef = useRef([]);
  useEffect(() => {
    if (!window.speechSynthesis) return;
    const loadVoices = () => {
      const all = window.speechSynthesis.getVoices();
      if (all.length > 0) cachedVoicesRef.current = all;
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, []);

  const speak = useCallback((value) => {
    if (!window.speechSynthesis || !value) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(value);
    
    // Select the best available Spanish voice
    let voices = cachedVoicesRef.current.length > 0
      ? cachedVoicesRef.current
      : window.speechSynthesis.getVoices();
    
    const esVoices = voices.filter(v => v.lang.startsWith('es'));
    // Prioritize natural/online voices over the default desktop robotic ones
    let selectedVoice = esVoices.find(v => 
      v.name.includes('Natural') || 
      v.name.includes('Online') || 
      v.name.includes('Premium') || 
      v.name.includes('Google español')
    );
    
    if (!selectedVoice) {
      // Fallbacks to known non-default ones
      selectedVoice = esVoices.find(v => v.name.includes('Sabina') || v.name.includes('Pablo') || v.name.includes('Laura'));
    }
    
    if (!selectedVoice) selectedVoice = esVoices[0];
    if (selectedVoice) utterance.voice = selectedVoice;

    utterance.lang = "es-ES";
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  }, []);

  const playChime = useCallback(() => {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      const ctx = audioRef.current || (audioRef.current = new Ctx());
      if (ctx.state === "suspended") ctx.resume();
      const now = ctx.currentTime;
      [0, 0.32, 0.64].forEach((offset) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = 880;
        gain.gain.setValueAtTime(0.0001, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.32, now + offset + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.28);
        osc.connect(gain).connect(ctx.destination);
        osc.start(now + offset);
        osc.stop(now + offset + 0.3);
      });
    } catch { /* sin audio disponible */ }
  }, []);
  // Bloquear scroll de la página al abrir modo cocina
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  // Carga del modo cocina (IA con fallback a los pasos de la receta)
  useEffect(() => {
    if (!open || !recipe) return;

    setLoading(true);
    setPhase("mise");
    setIndex(0);
    setRating(0);
    setSavedFav(false);
    setTimerDone(false);
    setConfirmClose(false);
    alarmedRef.current = false;
    setResumeIndex(storageKey ? Number(localStorage.getItem(storageKey)) || 0 : 0);

    getCookingMode({ recetaId: recipe.id, raciones: servings })
      .then((data) => setMode(data))
      .catch(() =>
        setMode({
          titulo: recipe.title,
          intro_tts: `Empezamos con ${recipe.title}.`,
          pasos: recipe.steps.map((step) => ({
            orden: step.orden,
            titulo: `Paso ${step.orden}`,
            narracion: step.descripcion,
            duracion_segundos: parseStepMinutes(step.descripcion) || 0,
            timer_recomendado: Boolean(parseStepMinutes(step.descripcion)),
          })),
          cierre_tts: "Receta terminada. ¡Buen provecho!",
        }),
      )
      .finally(() => setLoading(false));
  }, [open, recipe, servings, storageKey]);

  // Wake Lock: mantener la pantalla encendida mientras se cocina
  useEffect(() => {
    if (!open) return undefined;
    const request = async () => {
      try {
        if ("wakeLock" in navigator) {
          wakeRef.current = await navigator.wakeLock.request("screen");
        }
      } catch { /* denegado o no soportado */ }
    };
    request();
    const onVisible = () => {
      if (document.visibilityState === "visible") request();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      try { wakeRef.current?.release(); } catch { /* noop */ }
      wakeRef.current = null;
    };
  }, [open]);

  // Cuenta atrás del temporizador
  useEffect(() => {
    if (!running || secondsLeft <= 0) return undefined;
    const timer = window.setInterval(
      () => setSecondsLeft((value) => Math.max(0, value - 1)),
      1000,
    );
    return () => window.clearInterval(timer);
  }, [running, secondsLeft]);

  // Alarma al llegar a 0 (sonido + vibración + aviso visual), una sola vez
  useEffect(() => {
    if (running && secondsLeft === 0 && !alarmedRef.current) {
      alarmedRef.current = true;
      setRunning(false);
      setTimerDone(true);
      playChime();
      if (navigator.vibrate) navigator.vibrate([320, 160, 320]);
      if (voiceOnRef.current) speak("Tiempo cumplido.");
    }
  }, [running, secondsLeft, playChime, speak]);

  // Al cambiar de paso: reinicia el temporizador y narra (si la voz está activa)
  useEffect(() => {
    if (phase !== "cooking") return;
    const step = mode?.pasos?.[index];
    if (!step) return;
    const secs = parseStepMinutes(step.narracion) ?? step.duracion_segundos ?? 0;
    setSecondsLeft(secs);
    setRunning(false);
    setTimerDone(false);
    alarmedRef.current = false;
    if (voiceOnRef.current) speak(step.narracion);
  }, [phase, index, mode, speak]);

  // Persistencia para reanudar donde se dejó
  useEffect(() => {
    if (open && phase === "cooking" && storageKey) {
      localStorage.setItem(storageKey, String(index));
    }
  }, [open, phase, index, storageKey]);

  const steps = mode?.pasos || [];
  const current = steps[index];

  const finish = useCallback(() => {
    setRunning(false);
    setPhase("done");
    window.speechSynthesis?.cancel();
    if (voiceOnRef.current) speak(mode?.cierre_tts || "Receta terminada. ¡Buen provecho!");
    if (storageKey) localStorage.removeItem(storageKey);
  }, [mode, speak, storageKey]);

  const goNext = useCallback(() => {
    setIndex((i) => {
      if (i < steps.length - 1) return i + 1;
      finish();
      return i;
    });
  }, [steps.length, finish]);

  const goPrev = useCallback(() => setIndex((i) => Math.max(0, i - 1)), []);

  const startTimer = useCallback(() => {
    setTimerDone(false);
    alarmedRef.current = false;
    setSecondsLeft((s) => (s > 0 ? s : 60));
    setRunning(true);
  }, []);

  const resetTimer = useCallback(() => {
    const step = mode?.pasos?.[index];
    setSecondsLeft(parseStepMinutes(step?.narracion) ?? step?.duracion_segundos ?? 0);
    setRunning(false);
    setTimerDone(false);
    alarmedRef.current = false;
  }, [mode, index]);

  // Comando de voz (ref para no resuscribir el reconocimiento en cada cambio)
  cmdRef.current = (txt) => {
    if (/(siguiente|avanza|próximo|proximo|continúa|continua)/.test(txt)) goNext();
    else if (/(anterior|atrás|atras|vuelve|previo)/.test(txt)) goPrev();
    else if (/(repite|repetir|otra vez)/.test(txt)) speak(current?.narracion);
    else if (/(tiempo|temporizador|cronómetro|cronometro|inicia)/.test(txt)) startTimer();
    else if (/(pausa|para|detén|deten)/.test(txt)) setRunning(false);
  };

  // Reconocimiento de voz continuo durante la cocción
  useEffect(() => {
    if (!open || phase !== "cooking" || !listening) return undefined;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return undefined;
    const rec = new SR();
    rec.lang = "es-ES";
    rec.continuous = true;
    rec.interimResults = false;
    rec.onresult = (event) => {
      const result = event.results[event.results.length - 1];
      cmdRef.current(result[0].transcript.toLowerCase().trim());
    };
    rec.onerror = () => {};
    rec.onend = () => { try { rec.start(); } catch { /* ya parado */ } };
    try { rec.start(); } catch { /* noop */ }
    return () => { try { rec.stop(); } catch { /* noop */ } };
  }, [open, phase, listening]);

  const doClose = useCallback(() => {
    window.speechSynthesis?.cancel();
    setListening(false);
    setConfirmClose(false);
    onOpenChange(false);
  }, [onOpenChange]);

  const requestClose = useCallback(() => {
    if (phase === "cooking" && index > 0) setConfirmClose(true);
    else doClose();
  }, [phase, index, doClose]);

  const onTouchStart = (e) => { touchX.current = e.changedTouches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 60) (dx < 0 ? goNext() : goPrev());
    touchX.current = null;
  };

  const saveFavorite = async () => {
    try {
      const result = await toggleFavorito(recipe.id);
      setSavedFav(result.favorito);
    } catch { /* noop */ }
  };

  const share = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: recipe.title,
          text: `Acabo de cocinar ${recipe.title}`,
          url: window.location.href,
        });
      }
    } catch { /* cancelado */ }
  };

  if (!open) return null;

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = String(secondsLeft % 60).padStart(2, "0");
  const ratio = recipe.servings ? servings / recipe.servings : 1;
  const miseGroups = groupIngredients(recipe.ingredients);

  return (
    <div className="fixed inset-0 z-50 bg-ink text-paper cooking-mode" data-testid="cooking-mode">
      <div className="absolute inset-0">
        <img src={recipe.image} alt="" className="h-full w-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/95 to-ink" />
      </div>

      <div className="relative z-10 flex h-[100dvh] flex-col px-6 py-5 md:px-10">
        <header className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.2em] text-white/55">Modo cocina</p>
            <h2 className="mt-1 truncate text-xl font-semibold md:text-2xl">{mode?.titulo || recipe.title}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setVoiceOn((v) => {
                  if (v) window.speechSynthesis?.cancel();
                  return !v;
                });
              }}
              className="grid h-12 w-12 place-items-center rounded-full bg-white/10 hover:bg-white/15"
              aria-label={voiceOn ? "Silenciar narración" : "Activar narración"}
              aria-pressed={voiceOn}
            >
              {voiceOn ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5 text-white/50" />}
            </button>
            {supportsSpeechRecognition && (
              <button
                onClick={() => setListening((l) => !l)}
                className={`grid h-12 w-12 place-items-center rounded-full ${listening ? "bg-tomate text-white animate-pulse" : "bg-white/10 hover:bg-white/15"}`}
                aria-label={listening ? "Desactivar control por voz" : "Activar control por voz"}
                aria-pressed={listening}
              >
                {listening ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5 text-white/50" />}
              </button>
            )}
            <button
              onClick={requestClose}
              className="grid h-12 w-12 place-items-center rounded-full bg-white/10 hover:bg-white/15"
              aria-label="Cerrar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* LOADING */}
        {loading || !mode ? (
          <main className="grid flex-1 place-items-center py-8 text-center">
            <div>
              <p className="text-3xl font-semibold">Preparando modo cocina…</p>
              <p className="mt-3 text-white/60">Adaptando pasos para narración y temporizadores.</p>
            </div>
          </main>
        ) : phase === "mise" ? (
          /* MISE EN PLACE */
          <main className="flex flex-1 flex-col py-8 overflow-y-auto min-h-0 no-scrollbar" data-testid="cooking-mise">
            <div className="mx-auto w-full max-w-3xl">
              <p className="text-xs uppercase tracking-[0.2em] text-white/55">Antes de empezar</p>
              <h1 className="mt-2 text-white text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1] tracking-[-0.03em]">
                Prepara tu mise en place.
              </h1>
              <p className="mt-3 text-white/70">
                Ten todo a mano para {servings} {servings === 1 ? "ración" : "raciones"}. Cuando estés listo, empieza.
              </p>
              <div className="mt-8 space-y-6">
                {miseGroups.map((group) => (
                  <div key={group.title}>
                    {miseGroups.length > 1 && (
                      <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
                        <Utensils className="h-3.5 w-3.5" /> {group.title}
                      </p>
                    )}
                    <ul className="grid gap-x-8 gap-y-1 sm:grid-cols-2">
                      {group.items.map((ing) => {
                        const qty = typeof ing.qty === "number" ? +(ing.qty * ratio).toFixed(2) : ing.qty;
                        return (
                          <li key={ing.id} className="flex items-center justify-between gap-3 border-b border-white/10 py-2.5">
                            <span className="text-white/90">{ing.name}</span>
                            <span className="num-mono text-sm text-white/60">{qty} {ing.unit}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            <div className="mx-auto mt-8 flex w-full max-w-3xl flex-col gap-3 sm:flex-row">
              {resumeIndex > 0 && resumeIndex < steps.length && (
                <button
                  onClick={() => { setIndex(resumeIndex); setPhase("cooking"); }}
                  className="inline-flex h-16 flex-1 items-center justify-center gap-2 rounded-2xl bg-white/10 px-6 font-medium hover:bg-white/15"
                >
                  <RotateCcw className="h-5 w-5" />
                  Reanudar en paso {resumeIndex + 1}
                </button>
              )}
              <button
                onClick={() => { setIndex(0); setPhase("cooking"); }}
                className="inline-flex h-16 flex-1 items-center justify-center gap-2 rounded-2xl bg-mercadona px-6 text-lg font-semibold text-white hover:bg-mercadona/90"
                data-testid="start-cooking"
              >
                <ChefHat className="h-5 w-5" />
                Empezar a cocinar
              </button>
            </div>
          </main>
        ) : phase === "done" ? (
          /* PANTALLA FINAL */
          <main className="grid flex-1 place-items-center py-8 text-center" data-testid="cooking-done">
            <div className="w-full max-w-lg">
              <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-mercadona">
                <PartyPopper className="h-10 w-10 text-white" />
              </span>
              <h1 className="mt-6 text-white text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1] tracking-[-0.03em]">
                ¡Listo! Buen provecho.
              </h1>
              <p className="mt-3 text-white/70">Has terminado {recipe.title}. ¿Qué te ha parecido?</p>

              <div className="mt-6 flex justify-center gap-2" data-testid="done-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => { setRating(star); toast.success("¡Gracias por tu valoración!"); }}
                    aria-label={`${star} estrellas`}
                    className="grid h-12 w-12 place-items-center"
                  >
                    <Star className={`h-8 w-8 ${star <= rating ? "fill-warn text-warn" : "text-white/30"}`} />
                  </button>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={saveFavorite}
                  className="inline-flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl bg-white/10 px-5 font-medium hover:bg-white/15"
                >
                  <Heart className={`h-5 w-5 ${savedFav ? "fill-tomate text-tomate" : ""}`} />
                  {savedFav ? "Guardada" : "Guardar en favoritos"}
                </button>
                {typeof navigator !== "undefined" && navigator.share && (
                  <button
                    onClick={share}
                    className="inline-flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl bg-white/10 px-5 font-medium hover:bg-white/15"
                  >
                    <Share2 className="h-5 w-5" />
                    Compartir
                  </button>
                )}
              </div>
              <button
                onClick={doClose}
                className="mt-3 inline-flex h-14 w-full items-center justify-center rounded-2xl bg-mercadona px-6 font-semibold text-white hover:bg-mercadona/90"
              >
                Volver a la receta
              </button>
            </div>
          </main>
        ) : (
          /* COCCIÓN */
          <>
            <main
              className="flex flex-1 select-none items-center justify-center py-8"
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              <div className="mx-auto w-full max-w-3xl text-center">
                <div className="flex items-center justify-center gap-4 text-sm text-white/60">
                  <span>Paso {index + 1} de {steps.length}</span>
                  {current?.timer_recomendado && (
                    <span className="inline-flex items-center gap-1.5 text-white/70">
                      <Timer className="h-3.5 w-3.5" /> Temporizador recomendado
                    </span>
                  )}
                </div>
                <div className="mx-auto mt-5 h-1 max-w-md overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full bg-mercadona transition-[width] duration-300"
                    style={{ width: `${((index + 1) / steps.length) * 100}%` }}
                  />
                </div>

                <h1 className="mt-9 text-white text-balance text-[clamp(2rem,5.5vw,4.5rem)] font-bold leading-[1] tracking-[-0.04em]">
                  {current?.titulo}
                </h1>
                <p className="mx-auto mt-6 max-w-2xl text-xl leading-relaxed text-white/80 md:text-2xl">
                  {current?.narracion}
                </p>

                <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => speak(current?.narracion)}
                    className="inline-flex h-14 items-center gap-2 rounded-full bg-white px-5 font-medium text-black"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Repetir voz
                  </button>
                  <button
                    onClick={() => (running ? setRunning(false) : startTimer())}
                    className={`inline-flex h-14 items-center gap-2 rounded-full border px-5 font-medium num-mono ${
                      timerDone
                        ? "border-tomate bg-tomate text-white animate-pulse"
                        : "border-white/15 bg-white/10"
                    }`}
                  >
                    {timerDone ? <Bell className="h-4 w-4" /> : running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    {timerDone ? "¡Tiempo!" : `${minutes}:${seconds}`}
                  </button>
                  {(running || secondsLeft > 0 || timerDone) && (
                    <button
                      onClick={resetTimer}
                      className="grid h-14 w-14 place-items-center rounded-full bg-white/10 hover:bg-white/15"
                      aria-label="Reiniciar temporizador"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </main>

            <footer className="flex items-center justify-between gap-4">
              <button
                onClick={goPrev}
                disabled={index === 0}
                className="inline-flex h-16 items-center gap-2 rounded-2xl bg-white/10 px-6 font-medium disabled:opacity-35"
              >
                <ChevronLeft className="h-5 w-5" />
                Anterior
              </button>
              <button
                onClick={goNext}
                className="inline-flex h-16 items-center gap-2 rounded-2xl bg-mercadona px-6 font-semibold text-white hover:bg-mercadona/90"
              >
                {index < steps.length - 1 ? "Siguiente paso" : "Finalizar"}
                <ChevronRight className="h-5 w-5" />
              </button>
            </footer>
          </>
        )}
      </div>

      {/* Confirmar salida a media cocción */}
      {confirmClose && (
        <div className="absolute inset-0 z-20 grid place-items-center bg-ink/70 px-6 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-paper-raised p-6 text-black shadow-raised">
            <h3 className="display-sm">¿Salir del modo cocina?</h3>
            <p className="mt-2 text-sm text-black-soft">Podrás retomar en el paso {index + 1} cuando vuelvas.</p>
            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={doClose}
                className="inline-flex h-14 items-center justify-center rounded-xl bg-ink font-medium text-white"
              >
                Salir
              </button>
              <button
                onClick={() => setConfirmClose(false)}
                className="inline-flex h-12 items-center justify-center rounded-xl border border-rule font-medium text-black-soft"
              >
                Seguir cocinando
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CalendarDays,
  Clock,
  Loader2,
  Mic,
  RefreshCw,
  ShoppingCart,
  Sparkles,
  Target,
  Utensils,
} from 'lucide-react';
import { toast } from 'sonner';
import { getWeeklyPlan } from '@/api/ai';
import { addReceta } from '@/api/lista';
import { Button } from '@/components/ui/button';
import { PREFERENCE_OPTIONS } from '@/lib/recipeAdapters';
import { useAuth } from '@/context/AuthContext';

const QUICK_GOALS = [
  { id: 'rapida', label: 'Rápida', text: 'Quiero cenas rápidas de menos de 30 minutos, fáciles entre semana.' },
  { id: 'economica', label: 'Económica', text: 'Quiero un plan económico, aprovechando ingredientes básicos y baratos.' },
  { id: 'equilibrada', label: 'Equilibrada', text: 'Quiero una semana equilibrada, alternando legumbre, pescado, pasta, arroz y verdura.' },
  { id: 'familiar', label: 'Familiar', text: 'Plan para familia, raciones generosas, recetas tradicionales que gusten a todos.' },
  { id: 'ligera', label: 'Ligera', text: 'Quiero cenas ligeras, bajas en grasa, más verduras y menos hidratos por la noche.' },
  { id: 'aprovechar', label: 'Aprovechar', text: 'Quiero aprovechar lo que suelo tener en la nevera y minimizar la compra extra.' },
];

const DAY_OPTIONS = [3, 4, 5, 6, 7];

export default function PlanificadorPage() {
  const { usuario } = useAuth();
  const [goal, setGoal] = useState('');
  const [days, setDays] = useState(5);
  const [preferences, setPreferences] = useState(new Set(usuario?.preferencias || []));
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);
  const [addingAll, setAddingAll] = useState(false);
  const [listening, setListening] = useState(false);
  const resultRef = useRef(null);

  const activePreferences = useMemo(() => [...preferences], [preferences]);

  const togglePreference = (key) => {
    const next = new Set(preferences);
    next.has(key) ? next.delete(key) : next.add(key);
    setPreferences(next);
  };

  const applyQuickGoal = (id) => {
    const option = QUICK_GOALS.find((g) => g.id === id);
    if (!option) return;
    setGoal(option.text);
  };

  const handleVoice = () => {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      toast.error('Tu navegador no soporta dictado de voz.');
      return;
    }
    const recognition = new Recognition();
    recognition.lang = 'es-ES';
    recognition.interimResults = false;
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => {
      setListening(false);
      toast.error('No hemos podido escuchar la petición.');
    };
    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript;
      if (transcript) setGoal((prev) => (prev ? `${prev}. ${transcript}` : transcript));
    };
    recognition.start();
  };

  const generate = async () => {
    const finalGoal = goal.trim() || 'Quiero una semana realista, equilibrada y compatible con una compra Mercadona.';
    setLoading(true);
    try {
      const response = await getWeeklyPlan({
        objetivo: finalGoal,
        dias: days,
        preferencias: activePreferences,
      });
      setPlan(response);
    } catch (error) {
      toast.error(error.response?.data?.error || 'No hemos podido generar el plan semanal.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    generate();
  };

  const handleAddAllToList = async () => {
    if (!plan?.dias?.length) return;
    const uniqueRecipes = [...new Map(plan.dias.filter((d) => d.receta_id).map((d) => [d.receta_id, d])).values()];
    if (uniqueRecipes.length === 0) {
      toast.error('No hay recetas válidas en el plan.');
      return;
    }
    setAddingAll(true);
    let added = 0;
    for (const day of uniqueRecipes) {
      try {
        await addReceta(day.receta_id, 2);
        added += 1;
      } catch {
        // continuar con el resto
      }
    }
    setAddingAll(false);
    if (added === 0) {
      toast.error('No se pudo añadir ninguna receta a la lista.');
    } else if (added < uniqueRecipes.length) {
      toast.success(`${added} de ${uniqueRecipes.length} recetas añadidas a la lista.`);
    } else {
      toast.success(`Plan completo añadido a la lista (${added} recetas).`);
    }
  };

  useEffect(() => {
    if (plan && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [plan]);

  // Stats sobre el plan generado
  const planStats = useMemo(() => {
    if (!plan?.dias?.length) return null;
    const validRecipes = plan.dias.filter((d) => d.receta_id);
    const totalTime = validRecipes.reduce((acc, d) => acc + (Number(d.tiempo_minutos) || 0), 0);
    const allTags = [...new Set(validRecipes.flatMap((d) => d.tags || []))];
    return {
      recipes: validRecipes.length,
      totalTime,
      tags: allTags,
    };
  }, [plan]);

  return (
    <div className="container-app pt-10 pb-16" data-testid="planificador-page">
      {/* ── Header ── */}
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">IA · Planificador semanal</p>
          <h1 className="display-xl mt-2 text-balance">Tu semana, organizada al detalle.</h1>
          <p className="text-ink-soft mt-3 max-w-2xl text-[15px] leading-relaxed">
            Cuéntanos qué necesitas. La IA arma una semana coherente usando recetas reales del catálogo,
            con motivo de elección y consejo de compra.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-mercadona/20 bg-mercadona-soft px-4 py-2 text-sm text-mercadona shrink-0">
          <CalendarDays className="h-4 w-4" />
          Catálogo real Mercadona
        </div>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,460px)_minmax(0,1fr)]">
        {/* ── Form panel ── */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-rule bg-paper-raised p-6 md:p-7 space-y-7 lg:sticky lg:top-6 lg:self-start"
        >
          {/* Quick goals */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <span className="label-cap text-ink-soft inline-flex items-center gap-2">
                <Target className="h-3.5 w-3.5" />
                Plantilla de objetivo
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {QUICK_GOALS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => applyQuickGoal(option.id)}
                  className="px-3 h-8 rounded-full text-sm border bg-paper-raised text-ink border-rule hover:border-ink transition-colors"
                  data-testid={`planner-quick-${option.id}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </section>

          {/* Goal textarea + voice */}
          <section>
            <span className="label-cap text-ink-soft block mb-3">Objetivo de la semana</span>
            <div className="relative">
              <textarea
                value={goal}
                onChange={(event) => setGoal(event.target.value)}
                rows={4}
                className="input-base h-auto min-h-[112px] py-3 pr-14 resize-none"
                placeholder="Ej: 5 cenas rápidas para 2, sin lactosa, baratas…"
                data-testid="planner-goal"
              />
              <button
                type="button"
                onClick={handleVoice}
                className={`absolute right-3 bottom-3 h-9 w-9 rounded-full grid place-items-center transition-colors ${
                  listening
                    ? 'bg-mercadona text-white animate-pulse'
                    : 'bg-paper-raised text-mercadona border border-mercadona/30 hover:border-mercadona'
                }`}
                aria-label={listening ? 'Escuchando…' : 'Dictar con voz'}
              >
                <Mic className="h-4 w-4" />
              </button>
            </div>
            {listening && (
              <p className="meta-mono text-mercadona mt-2">Escuchando…</p>
            )}
          </section>

          {/* Days selector */}
          <section>
            <div className="flex items-baseline justify-between mb-3">
              <span className="label-cap text-ink-soft">Duración</span>
              <span className="meta-mono text-ink-soft">{days} {days === 1 ? 'día' : 'días'}</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {DAY_OPTIONS.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setDays(n)}
                  className={`h-12 rounded-lg text-sm font-medium border transition-colors ${
                    days === n
                      ? 'bg-ink text-paper border-ink'
                      : 'bg-paper-raised text-ink border-rule hover:border-ink'
                  }`}
                  data-testid={`planner-day-${n}`}
                >
                  {n}
                </button>
              ))}
            </div>
          </section>

          {/* Preferences */}
          <section>
            <span className="label-cap text-ink-soft block mb-3">Preferencias</span>
            <div className="flex flex-wrap gap-2">
              {PREFERENCE_OPTIONS.map((option) => {
                const active = preferences.has(option.key);
                return (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() => togglePreference(option.key)}
                    className={`px-3 h-8 rounded-full text-sm border transition-colors ${
                      active
                        ? 'bg-ink text-paper border-ink'
                        : 'bg-paper-raised text-ink border-rule hover:border-ink'
                    }`}
                    data-testid={`planner-pref-${option.key}`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Submit */}
          <div className="pt-1">
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={loading}
              data-testid="planner-submit"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generando plan…
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  {plan ? 'Generar nuevo plan' : 'Generar plan semanal'}
                </>
              )}
            </Button>
            {!plan && (
              <p className="meta-mono text-center text-ink-soft mt-3">
                Si no escribes nada, la IA decide por ti
              </p>
            )}
          </div>
        </form>

        {/* ── Result panel ── */}
        <section ref={resultRef} aria-live="polite">
          {/* Loading skeleton */}
          {loading && <PlanSkeleton days={days} />}

          {/* Empty state */}
          {!loading && !plan && <PlanEmptyState onPick={(text) => setGoal(text)} examples={QUICK_GOALS.slice(0, 3)} />}

          {/* Result */}
          {!loading && plan && (
            <div className="space-y-6 animate-fade-in">
              {/* Summary card */}
              <div className="rounded-2xl border border-rule bg-paper-raised p-6 md:p-7">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="eyebrow">Resumen del plan</p>
                    <h2 className="display-md mt-2 text-balance">{plan.resumen}</h2>
                  </div>
                  <button
                    type="button"
                    onClick={generate}
                    disabled={loading}
                    className="shrink-0 inline-flex items-center gap-1.5 px-3 h-9 rounded-lg border border-rule bg-paper text-sm text-ink hover:border-ink transition-colors disabled:opacity-50"
                    aria-label="Regenerar plan"
                    data-testid="planner-regenerate"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Regenerar
                  </button>
                </div>

                {/* Stats */}
                {planStats && (
                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    <Stat icon={<Utensils className="h-3.5 w-3.5" />} label={`${planStats.recipes} recetas`} />
                    {planStats.totalTime > 0 && (
                      <Stat icon={<Clock className="h-3.5 w-3.5" />} label={`${planStats.totalTime} min totales`} />
                    )}
                    {activePreferences.length > 0 && (
                      <Stat label={activePreferences.map((p) => p.replace(/_/g, ' ').toLowerCase()).join(' · ')} />
                    )}
                  </div>
                )}
              </div>

              {/* Timeline of days */}
              <div className="space-y-3">
                {(plan.dias || []).map((day, index) => (
                  <DayCard key={`${day.dia}-${day.receta_id || index}`} day={day} index={index} />
                ))}
              </div>

              {/* Shopping advice + add to list */}
              <div className="rounded-2xl border border-mercadona/20 bg-mercadona-soft p-6 md:p-7">
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-full bg-paper grid place-items-center shrink-0 border border-mercadona/20">
                    <ShoppingCart className="h-4 w-4 text-mercadona" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="eyebrow text-mercadona">Consejo de compra</p>
                    <p className="text-sm text-ink mt-2 leading-relaxed">{plan.consejo_compra}</p>
                  </div>
                </div>
                <Button
                  type="button"
                  size="lg"
                  className="w-full mt-5"
                  onClick={handleAddAllToList}
                  disabled={addingAll}
                  data-testid="planner-add-all"
                >
                  {addingAll ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Añadiendo a la lista…
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-4 w-4" />
                      Añadir todas las recetas a la lista
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Subcomponentes
// ─────────────────────────────────────────────

function Stat({ icon, label }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 h-7 rounded-full border border-rule bg-paper text-[12px] text-ink">
      {icon}
      {label}
    </span>
  );
}

function DayCard({ day, index }) {
  const hasRecipe = Boolean(day.receta_id);
  const tags = Array.isArray(day.tags) ? day.tags.slice(0, 3) : [];

  const inner = (
    <div className="flex gap-4">
      {/* Day strip */}
      <div className="w-16 shrink-0 flex flex-col items-center pt-1">
        <span className="meta-mono text-ink-soft">Día {index + 1}</span>
        <span className="display-sm mt-1 text-ink leading-none">{day.dia.slice(0, 3)}</span>
      </div>

      {/* Image */}
      <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-xl overflow-hidden bg-paper-deep border border-rule shrink-0">
        {day.receta_foto_url ? (
          <img src={day.receta_foto_url} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full grid place-items-center text-ink-soft">
            <Utensils className="h-5 w-5" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="display-sm text-balance leading-snug">{day.receta_nombre}</h3>
        <p className="text-ink-soft mt-1.5 text-sm leading-snug line-clamp-2">{day.motivo}</p>
        <div className="mt-2.5 flex items-center gap-2 flex-wrap">
          {day.tiempo_minutos ? (
            <span className="inline-flex items-center gap-1 meta-mono">
              <Clock className="h-3 w-3" />
              {day.tiempo_minutos} min
            </span>
          ) : null}
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 h-5 rounded-full border border-rule text-[10px] uppercase tracking-wider text-ink-soft"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* CTA */}
      {hasRecipe && (
        <ArrowRight className="h-4 w-4 text-ink-soft self-start mt-2 shrink-0 transition-colors group-hover:text-ink" />
      )}
    </div>
  );

  if (!hasRecipe) {
    return (
      <div className="rounded-2xl border border-rule bg-paper-raised p-4 md:p-5">
        {inner}
      </div>
    );
  }

  return (
    <Link
      to={`/recetas/${day.receta_id}`}
      className="group block rounded-2xl border border-rule bg-paper-raised p-4 md:p-5 hover:border-ink hover:shadow-sm transition-all"
      data-testid={`planner-day-card-${index}`}
    >
      {inner}
    </Link>
  );
}

function PlanSkeleton({ days = 5 }) {
  return (
    <div className="space-y-6 animate-fade-in" aria-label="Generando plan semanal">
      <div className="rounded-2xl border border-rule bg-paper-raised p-6 md:p-7 space-y-4">
        <div className="h-3 w-24 bg-paper rounded animate-pulse" />
        <div className="h-6 w-3/4 bg-paper rounded animate-pulse" />
        <div className="flex gap-2 pt-2">
          <div className="h-7 w-24 bg-paper rounded-full animate-pulse" />
          <div className="h-7 w-28 bg-paper rounded-full animate-pulse" />
        </div>
      </div>
      <div className="space-y-3">
        {Array.from({ length: days }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-rule bg-paper-raised p-4 md:p-5">
            <div className="flex gap-4">
              <div className="w-16 h-12 shrink-0">
                <div className="h-2.5 bg-paper rounded animate-pulse w-12" />
                <div className="h-5 bg-paper rounded animate-pulse w-10 mt-2" />
              </div>
              <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-xl bg-paper animate-pulse shrink-0" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 bg-paper rounded animate-pulse w-3/4" />
                <div className="h-3 bg-paper rounded animate-pulse w-full" />
                <div className="h-3 bg-paper rounded animate-pulse w-2/3" />
                <div className="flex gap-2 pt-1">
                  <div className="h-4 w-14 bg-paper rounded-full animate-pulse" />
                  <div className="h-4 w-12 bg-paper rounded-full animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-2 text-ink-soft text-sm pt-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        Generando plan…
      </div>
    </div>
  );
}

function PlanEmptyState({ onPick, examples = [] }) {
  return (
    <div className="rounded-2xl border border-dashed border-rule bg-paper-raised p-8 md:p-12 text-center">
      <div className="h-16 w-16 mx-auto rounded-2xl bg-paper border border-rule grid place-items-center">
        <CalendarDays className="h-7 w-7 text-mercadona" />
      </div>
      <p className="eyebrow mt-5">Aún no hay plan</p>
      <h2 className="display-md mt-2">Define tu objetivo y genera tu semana.</h2>
      <p className="text-ink-soft mt-3 max-w-md mx-auto text-[15px] leading-relaxed">
        Recibirás una receta por día, motivos de elección y un consejo de compra basado en el catálogo real.
      </p>
      {examples.length > 0 && (
        <div className="mt-6">
          <p className="meta-mono text-ink-soft mb-3">Ejemplos rápidos</p>
          <div className="flex flex-wrap justify-center gap-2">
            {examples.map((ex) => (
              <button
                key={ex.id}
                type="button"
                onClick={() => onPick?.(ex.text)}
                className="px-3 h-8 rounded-full text-sm border bg-paper text-ink border-rule hover:border-ink transition-colors"
              >
                {ex.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

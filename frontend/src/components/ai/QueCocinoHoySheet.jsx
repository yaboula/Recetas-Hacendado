import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Clock,
  Loader2,
  Mic,
  RefreshCw,
  RotateCcw,
  Sparkles,
  Users,
  Volume2,
} from "lucide-react";
import { toast } from "sonner";
import { getMealAssistant } from "@/api/ai";
import { useAuth } from "@/context/AuthContext";
import { buildMealAssistantPrompt } from "@/lib/recipeAdapters";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const QUICK_PROMPTS = [
  "Pollo",
  "Ensalada",
  "Pasta",
  "Carne",
  "Pescado",
  "Vegetariano",
  "Arroz",
  "Legumbres",
];

const MOOD_OPTIONS = [
  { value: "ligera", label: "Ligera" },
  { value: "tradicional", label: "Tradicional" },
  { value: "rápida", label: "Rápida" },
  { value: "contundente", label: "Contundente" },
];

export default function QueCocinoHoySheet({ open, onOpenChange }) {
  const { usuario } = useAuth();

  // Filters — all null/undefined by default (fully optional)
  const [time, setTime] = useState(null);
  const [mood, setMood] = useState(null);
  const [people, setPeople] = useState(null);
  const [chips, setChips] = useState([]);
  const [text, setText] = useState("");

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [listening, setListening] = useState(false);
  const resultRef = useRef(null);

  // Reset on close
  useEffect(() => {
    if (!open) {
      setLoading(false);
      setResult(null);
      setChips([]);
      setText("");
      setTime(null);
      setMood(null);
      setPeople(null);
      setShowAdvanced(false);
    }
  }, [open]);

  // Auto-scroll to results
  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [result]);

  function buildPrompt() {
    const chipText = chips.length > 0 ? chips.join(", ") : "";
    const freeText = text.trim();
    const combined = [chipText, freeText].filter(Boolean).join(". ");
    return buildMealAssistantPrompt({ text: combined, time, mood, people });
  }

  const callAssistant = async () => {
    const response = await getMealAssistant({
      prompt: buildPrompt(),
      preferencias: usuario?.preferencias || [],
      maxRecetas: 3,
    });
    return response;
  };

  const handleGenerate = async () => {
    setLoading(true);
    setResult(null);
    try {
      setResult(await callAssistant());
    } catch (error) {
      toast.error(
        error.response?.data?.error ||
          "No hemos podido generar sugerencias ahora mismo."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    setLoading(true);
    try {
      setResult(await callAssistant());
    } catch (error) {
      toast.error(
        error.response?.data?.error ||
          "No hemos podido regenerar las sugerencias."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setChips([]);
    setText("");
    setTime(null);
    setMood(null);
    setPeople(null);
  };

  const toggleChip = (prompt) => {
    setChips((prev) =>
      prev.includes(prompt) ? prev.filter((c) => c !== prompt) : [...prev, prompt]
    );
  };

  const toggleMood = (value) => {
    setMood((prev) => (prev === value ? null : value));
  };

  const handleContinueConversation = (question) => {
    setResult(null);
    setText(question);
  };

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

  const speak = (value) => {
    if (!window.speechSynthesis || !value) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(value);
    
    // Select the best available Spanish voice
    const voices = cachedVoicesRef.current.length > 0
      ? cachedVoicesRef.current
      : window.speechSynthesis.getVoices();
    const esVoices = voices.filter(v => v.lang.startsWith('es'));
    let selectedVoice = esVoices.find(v => v.name.includes('Natural') || v.name.includes('Premium') || v.name.includes('Google español') || v.name.includes('Sabina'));
    if (!selectedVoice) selectedVoice = esVoices[0];
    if (selectedVoice) utterance.voice = selectedVoice;

    utterance.lang = "es-ES";
    utterance.rate = 0.94;
    window.speechSynthesis.speak(utterance);
  };

  const handleVoice = () => {
    const Recognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      toast.error("Tu navegador no soporta dictado de voz.");
      return;
    }
    const recognition = new Recognition();
    recognition.lang = "es-ES";
    recognition.interimResults = false;
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => {
      setListening(false);
      toast.error("No hemos podido escuchar la petición.");
    };
    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript;
      if (transcript)
        setText((prev) => (prev ? `${prev}. ${transcript}` : transcript));
    };
    recognition.start();
  };

  // Active filter summary for footer
  const activeSummary = [
    chips.length > 0 && chips.join(", "),
    mood && mood,
    time && `${time} min`,
    people && `${people} pers.`,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[540px] bg-paper border-l border-rule p-0 flex flex-col"
        data-testid="ai-quecocino-sheet"
      >
        {/* ── Header ── */}
        <SheetHeader className="px-6 pt-6 pb-4 hairline-b shrink-0">
          <span className="eyebrow">Asistente de cocina</span>
          <SheetTitle asChild>
            <h2 className="display-md mt-2">¿Qué cocino hoy?</h2>
          </SheetTitle>
          <p className="text-sm text-ink-soft mt-1">
            Cuéntame qué tienes en mente. Todo es opcional — el asistente
            siempre te dará ideas.
          </p>
        </SheetHeader>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-7">

          {/* Section 1 — Ingredient chips */}
          <section aria-labelledby="chips-label">
            <div className="flex items-baseline justify-between mb-3">
              <span id="chips-label" className="label-cap text-ink-soft">
                Ingrediente o tipo de plato
              </span>
              {chips.length > 0 && (
                <button
                  type="button"
                  onClick={() => setChips([])}
                  className="meta-mono text-ink-soft hover:text-ink transition-colors"
                >
                  Limpiar
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => toggleChip(prompt)}
                  className={`px-3 h-8 rounded-full text-sm border transition-all ${
                    chips.includes(prompt)
                      ? "bg-ink text-paper border-ink"
                      : "bg-paper-raised text-ink border-rule hover:border-ink"
                  }`}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </section>

          {/* Section 2 — Free text + voice */}
          <section aria-labelledby="freetext-label">
            <span id="freetext-label" className="label-cap text-ink-soft block mb-3">
              O descríbelo con tus palabras
            </span>
            <div className="relative">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={3}
                className="input-base h-auto min-h-[88px] py-3 pr-14 resize-none"
                placeholder="Tengo pasta, quiero algo rápido, sin carne…"
                data-testid="ai-free-text"
              />
              <button
                type="button"
                onClick={handleVoice}
                className={`absolute right-3 bottom-3 h-9 w-9 rounded-full grid place-items-center transition-colors ${
                  listening
                    ? "bg-mercadona text-white animate-pulse"
                    : "bg-paper-raised text-mercadona border border-mercadona/30 hover:border-mercadona"
                }`}
                aria-label={listening ? "Escuchando…" : "Dictar con voz"}
              >
                <Mic className="h-4 w-4" />
              </button>
            </div>

            {/* Listening indicator */}
            {listening && (
              <div className="flex items-center gap-2 mt-2">
                <div className="flex h-4 items-end gap-0.5">
                  {Array.from({ length: 14 }).map((_, i) => (
                    <span
                      key={i}
                      className="w-0.5 rounded-full bg-mercadona animate-pulse"
                      style={{
                        height: `${5 + Math.random() * 10}px`,
                        animationDelay: `${i * 50}ms`,
                        animationDuration: `${500 + (i % 3) * 200}ms`,
                      }}
                    />
                  ))}
                </div>
                <span className="text-xs text-mercadona font-medium">
                  Escuchando…
                </span>
              </div>
            )}
          </section>

          {/* Section 3 — Advanced filters (collapsible) */}
          <section>
            <button
              type="button"
              onClick={() => setShowAdvanced((v) => !v)}
              className="flex items-center justify-between w-full group"
              aria-expanded={showAdvanced}
            >
              <span className="label-cap text-ink-soft group-hover:text-ink transition-colors">
                Filtros adicionales
              </span>
              <span className="flex items-center gap-1 meta-mono text-ink-soft group-hover:text-ink transition-colors">
                {showAdvanced ? (
                  <>
                    Ocultar <ChevronUp className="h-3.5 w-3.5" />
                  </>
                ) : (
                  <>
                    Mostrar <ChevronDown className="h-3.5 w-3.5" />
                  </>
                )}
              </span>
            </button>

            {showAdvanced && (
              <div className="mt-4 space-y-6 animate-fade-in">
                {/* Mood */}
                <div>
                  <div className="flex items-baseline justify-between mb-3">
                    <span className="label-cap text-ink-soft">Tipo de comida</span>
                    {mood && (
                      <button
                        type="button"
                        onClick={() => setMood(null)}
                        className="meta-mono text-ink-soft hover:text-ink transition-colors"
                      >
                        Quitar
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {MOOD_OPTIONS.map(({ value, label }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => toggleMood(value)}
                        data-testid={`ai-mood-${value}`}
                        className={`px-4 h-9 rounded-full text-sm border transition-all ${
                          mood === value
                            ? "bg-ink text-paper border-ink"
                            : "bg-paper-raised text-ink border-rule hover:border-ink"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time */}
                <div>
                  <div className="flex items-baseline justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-ink-soft" />
                      <span className="label-cap text-ink-soft">Tiempo disponible</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {time !== null && (
                        <span className="num-mono text-sm text-ink">{time} min</span>
                      )}
                      {time !== null && (
                        <button
                          type="button"
                          onClick={() => setTime(null)}
                          className="meta-mono text-ink-soft hover:text-ink transition-colors"
                        >
                          Quitar
                        </button>
                      )}
                    </div>
                  </div>
                  {time === null ? (
                    <button
                      type="button"
                      onClick={() => setTime(35)}
                      className="w-full h-9 rounded-lg border border-dashed border-rule text-sm text-ink-soft hover:border-ink hover:text-ink transition-all"
                    >
                      Establecer tiempo
                    </button>
                  ) : (
                    <>
                      <input
                        type="range"
                        min={10}
                        max={90}
                        step={5}
                        value={time}
                        onChange={(e) => setTime(Number(e.target.value))}
                        className="w-full accent-tomate"
                        data-testid="ai-time-slider"
                      />
                      <div className="flex justify-between meta-mono mt-1">
                        <span>10 min</span>
                        <span>90 min</span>
                      </div>
                    </>
                  )}
                </div>

                {/* People */}
                <div>
                  <div className="flex items-baseline justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Users className="h-3.5 w-3.5 text-ink-soft" />
                      <span className="label-cap text-ink-soft">Comensales</span>
                    </div>
                    {people !== null && (
                      <button
                        type="button"
                        onClick={() => setPeople(null)}
                        className="meta-mono text-ink-soft hover:text-ink transition-colors"
                      >
                        Quitar
                      </button>
                    )}
                  </div>
                  {people === null ? (
                    <button
                      type="button"
                      onClick={() => setPeople(2)}
                      className="w-full h-9 rounded-lg border border-dashed border-rule text-sm text-ink-soft hover:border-ink hover:text-ink transition-all"
                    >
                      Establecer comensales
                    </button>
                  ) : (
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setPeople(Math.max(1, people - 1))}
                        className="h-10 w-10 rounded-lg border border-rule hover:border-ink font-medium text-lg transition-colors"
                        aria-label="Menos comensales"
                        data-testid="ai-people-minus"
                      >
                        –
                      </button>
                      <span className="num-mono text-xl w-10 text-center">{people}</span>
                      <button
                        type="button"
                        onClick={() => setPeople(Math.min(12, people + 1))}
                        className="h-10 w-10 rounded-lg border border-rule hover:border-ink font-medium text-lg transition-colors"
                        aria-label="Más comensales"
                        data-testid="ai-people-plus"
                      >
                        +
                      </button>
                      <span className="text-sm text-ink-soft ml-1">
                        {people === 1 ? "persona" : "personas"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>

          {/* ── Loading skeleton ── */}
          {loading && (
            <div className="space-y-4 pt-2" aria-label="Cargando sugerencias">
              <div className="flex items-center gap-2 text-ink-soft">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Buscando recetas…</span>
              </div>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-xl border border-rule p-4 space-y-3 animate-pulse"
                >
                  <div className="flex gap-4">
                    <div className="h-20 w-20 rounded-lg bg-paper-raised shrink-0" />
                    <div className="flex-1 space-y-2 py-1">
                      <div className="h-2.5 bg-paper-raised rounded w-1/4" />
                      <div className="h-4 bg-paper-raised rounded w-3/4" />
                      <div className="h-2.5 bg-paper-raised rounded w-full" />
                      <div className="h-2.5 bg-paper-raised rounded w-2/3" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Results ── */}
          {result && !loading && (
            <div className="space-y-5 animate-fade-in" ref={resultRef}>

              {/* AI message */}
              <div className="rounded-xl bg-paper-raised border border-rule p-4">
                <p className="eyebrow text-ink-soft mb-1">Sugerencia del asistente</p>
                <p className="text-sm text-ink leading-relaxed">{result.mensaje}</p>
              </div>

              {/* Recipe cards */}
              {(result.recomendaciones || []).map((recipe, index) => (
                <Link
                  key={recipe.id}
                  to={`/recetas/${recipe.id}`}
                  onClick={() => onOpenChange(false)}
                  data-testid={`ai-suggestion-${index}`}
                  className="block group bg-paper border border-rule rounded-xl p-4 hover:border-ink hover:shadow-sm transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-20 w-20 rounded-lg bg-paper-raised overflow-hidden shrink-0">
                      {recipe.foto_url ? (
                        <img
                          src={recipe.foto_url}
                          alt={recipe.nombre}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full grid place-items-center text-ink-soft">
                          <Sparkles className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="eyebrow">Opción {index + 1}</p>
                      <h3 className="display-sm mt-0.5 text-balance">{recipe.nombre}</h3>
                      <p className="text-[13px] text-ink-soft mt-1 leading-snug">
                        {recipe.motivo}
                      </p>
                      <div className="meta-mono mt-2 flex items-center gap-3 flex-wrap">
                        {recipe.tiempo_minutos && (
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {recipe.tiempo_minutos} min
                          </span>
                        )}
                        {people && (
                          <>
                            <span>·</span>
                            <span className="inline-flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {people} {people === 1 ? "persona" : "personas"}
                            </span>
                          </>
                        )}
                        {recipe.tags?.length > 0 && (
                          <>
                            <span>·</span>
                            <span>{recipe.tags.slice(0, 2).join(" · ")}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-ink-soft group-hover:text-ink mt-2 shrink-0 transition-colors" />
                  </div>
                </Link>
              ))}

              {/* Follow-up question CTA */}
              {result.siguiente_pregunta && (
                <button
                  type="button"
                  onClick={() =>
                    handleContinueConversation(result.siguiente_pregunta)
                  }
                  className="w-full text-left rounded-xl border border-rule bg-paper-raised p-4 hover:border-ink transition-all group"
                >
                  <p className="eyebrow text-ink-soft mb-1">Afinar búsqueda</p>
                  <p className="text-sm text-ink leading-snug">
                    {result.siguiente_pregunta}
                    <ArrowRight className="inline h-3.5 w-3.5 ml-1 text-ink-soft group-hover:translate-x-1 transition-transform" />
                  </p>
                </button>
              )}

              {/* Result actions */}
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={handleReset}
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Nueva búsqueda
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={handleRegenerate}
                  disabled={loading}
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Regenerar
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    speak(
                      [result.mensaje, result.siguiente_pregunta]
                        .filter(Boolean)
                        .join(". ")
                    )
                  }
                  aria-label="Escuchar respuesta"
                >
                  <Volume2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* ── Sticky footer — primary CTA ── */}
        {!result && (
          <div className="px-6 py-5 hairline-t bg-paper shrink-0">
            <Button
              size="lg"
              className="w-full"
              onClick={handleGenerate}
              disabled={loading}
              data-testid="ai-generate-btn"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {loading ? "Buscando recetas…" : "Sugerir recetas"}
            </Button>
            {activeSummary ? (
              <p className="meta-mono text-center mt-3 text-ink-soft">
                {activeSummary}
              </p>
            ) : (
              <p className="meta-mono text-center mt-3 text-ink-soft">
                Sin filtros — el asistente decidirá por ti
              </p>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

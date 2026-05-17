import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Camera, ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { setPrefs } from "@/api/auth";
import { useAuth } from "@/context/AuthContext";

const DIETS = [
  { label: "Vegetariana", key: "VEGETARIANO" },
  { label: "Vegana", key: "VEGANO" },
  { label: "Sin gluten", key: "SIN_GLUTEN" },
  { label: "Sin lactosa", key: "SIN_LACTOSA" },
  { label: "Sin huevo", key: "SIN_HUEVO" },
];

export default function OnboardingPage() {
  const { updateUsuario } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [frequency, setFrequency] = useState(4);
  const [diets, setDiets] = useState(new Set());

  const toggleDiet = (d) => {
    const next = new Set(diets);
    next.has(d) ? next.delete(d) : next.add(d);
    setDiets(next);
  };

  const next = () => setStep((s) => Math.min(4, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));
  const skip = async () => {
    try {
      await setPrefs([]);
      updateUsuario({ onboarding_done: true, preferencias: [] });
    } catch {}
    navigate("/");
  };

  const finish = async () => {
    const preferencias = [...diets];
    try {
      await setPrefs(preferencias);
      updateUsuario({ onboarding_done: true, preferencias });
    } catch {}
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-paper flex flex-col" data-testid="onboarding-page">
      {/* Progress + skip */}
      <header className="container-app pt-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map((n) => (
            <span
              key={n}
              className={`h-1 w-10 rounded-full transition-colors ${
                step >= n ? "bg-ink" : "bg-rule"
              }`}
            />
          ))}
        </div>
        <button onClick={skip} className="text-sm text-ink-soft hover:text-ink" data-testid="onb-skip">
          Saltar
        </button>
      </header>

      <main className="flex-1 grid place-items-center px-6">
        <div className="w-full max-w-2xl py-12">
          {step === 1 && (
            <div className="animate-fade-in">
              <p className="eyebrow">01 · Tus hábitos</p>
              <h1 className="display-xl mt-4 text-balance">
                ¿Cuántas veces cocinas en casa a la semana?
              </h1>
              <p className="text-ink-soft mt-4 text-[15px] max-w-xl">
                Esto nos ayuda a calibrar el ritmo de tus sugerencias y tu lista de compra.
              </p>

              <div className="mt-12">
                <div className="flex items-baseline gap-3">
                  <span className="display-xl num-mono">{frequency}</span>
                  <span className="text-ink-soft">veces</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={7}
                  step={1}
                  value={frequency}
                  onChange={(e) => setFrequency(+e.target.value)}
                  className="mt-6 w-full accent-tomate"
                  data-testid="onb-frequency"
                />
                <div className="meta-mono flex justify-between mt-2">
                  <span>1 / casi nunca</span>
                  <span>7 / a diario</span>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in">
              <p className="eyebrow">02 · Lo que no</p>
              <h1 className="display-xl mt-4 text-balance">¿Hay algo que no comes?</h1>
              <p className="text-ink-soft mt-4 text-[15px] max-w-xl">
                Selecciona todo lo que aplique. Filtraremos cualquier receta que no encaje.
              </p>
              <div className="mt-10 flex flex-wrap gap-2">
                {DIETS.map((diet) => {
                  const on = diets.has(diet.key);
                  return (
                    <button
                      key={diet.key}
                      onClick={() => toggleDiet(diet.key)}
                      data-testid={`diet-${diet.key.toLowerCase()}`}
                      className={`px-4 h-10 rounded-full text-sm border transition-colors ${
                        on
                          ? "bg-ink text-paper border-ink"
                          : "bg-paper-raised text-ink border-rule hover:border-ink"
                      }`}
                    >
                      {on && <Check className="inline h-3.5 w-3.5 mr-1" />}
                      {diet.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in">
              <p className="eyebrow">03 · Tu despensa</p>
              <h1 className="display-xl mt-4 text-balance">
                ¿Empezamos contándonos qué ya tienes en casa?
              </h1>
              <p className="text-ink-soft mt-4 text-[15px] max-w-xl">
                Saca una foto a tu despensa o nevera. Detectaremos los productos y construiremos tus primeras sugerencias.
              </p>

              <div className="mt-10 grid sm:grid-cols-2 gap-4">
                <Button size="xl" data-testid="onb-scan">
                  <Camera className="h-5 w-5" />
                  Hacer foto
                </Button>
                <Button size="xl" variant="outline" onClick={next} data-testid="onb-later">
                  Lo hago después
                </Button>
              </div>

              <p className="meta-mono mt-6">Podrás escanear tu despensa en cualquier momento desde la barra superior.</p>
            </div>
          )}

          {step === 4 && (
            <div className="animate-fade-in text-center">
              <p className="eyebrow">Listo</p>
              <h1 className="display-xl mt-4 text-balance">Tu cocina, ordenada.</h1>
              <p className="text-ink-soft mt-4 text-[15px] max-w-md mx-auto">
                Hemos calibrado tu experiencia. A partir de aquí, cuanto más uses Recetas Hacendado, mejor te conocerá.
              </p>
              <Button
                size="xl"
                onClick={finish}
                className="mt-10 min-w-[240px]"
                data-testid="onb-finish"
              >
                Empezar
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Footer nav */}
      {step < 4 && (
        <footer className="container-app pb-10 flex items-center justify-between">
          <Button
            variant="ghost"
            size="lg"
            onClick={back}
            disabled={step === 1}
            data-testid="onb-back"
            className={step === 1 ? "invisible" : ""}
          >
            <ArrowLeft className="h-4 w-4" />
            Atrás
          </Button>
          <Button size="lg" onClick={next} data-testid="onb-next">
            Continuar
            <ArrowRight className="h-4 w-4" />
          </Button>
        </footer>
      )}
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Camera,
  Loader2,
  RotateCcw,
  ArrowRight,
  Sparkles,
  ImagePlus,
  UploadCloud,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { scanPantry } from "@/api/ai";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function EscanearDespensaSheet({ open, onOpenChange }) {
  const { usuario } = useAuth();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const streamRef = useRef(null);

  // Phases: idle | camera | scanning | detected
  const [phase, setPhase] = useState("idle");
  const [result, setResult] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraReady(false);
  };

  const reset = () => {
    setPhase("idle");
    setResult(null);
    setSelectedImage(null);
    stopCamera();
  };

  useEffect(() => {
    if (!open) reset();
  }, [open]);

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 960 } },
        audio: false,
      });
      streamRef.current = stream;
      setSelectedImage(null);
      setCameraReady(false);
      setPhase("camera");
    } catch {
      toast.error(
        "No hemos podido acceder a la cámara. Por favor, sube una foto de tu galería."
      );
    }
  };

  // Attach stream to <video> after it renders (phase === "camera").
  useEffect(() => {
    if (phase !== "camera") return;
    const video = videoRef.current;
    const stream = streamRef.current;
    if (!video || !stream) return;

    video.srcObject = stream;
    const onReady = () => setCameraReady(true);
    video.addEventListener("loadedmetadata", onReady, { once: true });

    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        toast.error("No se puede reproducir el vídeo de la cámara.");
      });
    }

    return () => {
      video.removeEventListener("loadedmetadata", onReady);
    };
  }, [phase]);

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target.result;
      setSelectedImage(base64);
      processImage(base64);
    };
    reader.onerror = () => {
      toast.error("No se pudo leer la imagen.");
    };
    reader.readAsDataURL(file);
  };

  const captureFrame = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth || 960;
    canvas.height = video.videoHeight || 720;
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageBase64 = canvas.toDataURL("image/jpeg", 0.8);
    
    setSelectedImage(imageBase64);
    stopCamera();
    processImage(imageBase64);
  };

  const processImage = async (imageBase64) => {
    setPhase("scanning");
    try {
      const response = await scanPantry({
        imageBase64,
        preferencias: usuario?.preferencias || [],
      });
      setResult(response);
      setPhase("detected");
    } catch (error) {
      setPhase("idle");
      setSelectedImage(null);
      toast.error(
        error.response?.data?.error || "No hemos podido analizar la imagen."
      );
    }
  };

  return (
    <Sheet open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) reset(); }}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[540px] bg-paper border-l border-rule p-0 flex flex-col"
        data-testid="ai-scan-sheet"
      >
        <SheetHeader className="px-6 pt-6 pb-4 hairline-b shrink-0">
            <span className="eyebrow">Asistente de visión</span>
          <SheetTitle asChild>
            <h2 className="display-md mt-2">Visión IA</h2>
          </SheetTitle>
          <p className="text-sm text-ink-soft mt-1">
            Saca o sube una foto a tu despensa o nevera. Detectaremos los ingredientes
            y te sugeriremos qué cocinar.
          </p>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          
          {/* Phase 1: Idle (Options to Start Camera or Upload) */}
          {phase === "idle" && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={startCamera}
                  className="flex flex-col items-center justify-center gap-3 aspect-square rounded-xl border border-rule bg-paper-raised hover:border-ink transition-all"
                >
                  <div className="h-12 w-12 rounded-full bg-paper flex items-center justify-center border border-rule">
                    <Camera className="h-5 w-5 text-ink" />
                  </div>
                  <div className="text-center">
                    <span className="block text-sm font-medium text-ink">Cámara</span>
                    <span className="block text-xs text-ink-soft mt-0.5">Escanear en vivo</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center gap-3 aspect-square rounded-xl border border-rule bg-paper-raised hover:border-ink transition-all"
                >
                  <div className="h-12 w-12 rounded-full bg-paper flex items-center justify-center border border-rule">
                    <ImagePlus className="h-5 w-5 text-ink" />
                  </div>
                  <div className="text-center">
                    <span className="block text-sm font-medium text-ink">Galería</span>
                    <span className="block text-xs text-ink-soft mt-0.5">Subir una foto</span>
                  </div>
                </button>
              </div>

              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />

              <div className="rounded-xl border border-rule p-5 bg-paper-raised">
                <h3 className="label-cap text-ink-soft mb-4">¿Cómo funciona?</h3>
                <ol className="space-y-3 text-sm text-ink-soft">
                  <Step n={1}>Abre la nevera o coloca los productos sobre una superficie clara y con buena luz.</Step>
                  <Step n={2}>Toma la foto o súbela. Podemos detectar decenas de productos a la vez.</Step>
                  <Step n={3}>La IA buscará recetas del catálogo real que usen esos ingredientes.</Step>
                </ol>
              </div>
            </div>
          )}

          {/* Phase 2: Camera View */}
          {phase === "camera" && (
            <div className="space-y-5 animate-fade-in flex flex-col h-full">
              <div className="relative flex-1 min-h-[300px] overflow-hidden rounded-xl bg-ink">
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <canvas ref={canvasRef} className="hidden" />
                <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                
                <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-black/40 backdrop-blur-md px-3 py-1.5 text-xs text-white border border-white/10">
                  <Sparkles className="h-3.5 w-3.5 text-mercadona" />
                  Enfoque inteligente
                </div>
                
                <div className="absolute right-4 bottom-4 inline-flex items-center gap-2 rounded-full bg-black/40 backdrop-blur-md px-3 py-1.5 text-xs text-white border border-white/10">
                  {cameraReady ? (
                    <>
                      <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                      Lista
                    </>
                  ) : (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Iniciando...
                    </>
                  )}
                </div>
              </div>
              <p className="text-sm text-ink-soft text-center px-4">
                Encuadra los ingredientes claramente. Cuando estés listo, presiona escanear.
              </p>
            </div>
          )}

          {/* Phase 3: Scanning (Loading) */}
          {phase === "scanning" && (
            <div className="space-y-6 animate-fade-in h-full flex flex-col items-center justify-center pb-12">
              <div className="relative h-48 w-48 rounded-2xl overflow-hidden border border-rule shadow-sm">
                {selectedImage ? (
                  <img src={selectedImage} alt="Analizando" className="h-full w-full object-cover opacity-60" />
                ) : (
                  <div className="h-full w-full bg-paper-raised" />
                )}
                <div className="absolute inset-0 border-4 border-mercadona rounded-2xl opacity-50" />
                <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-mercadona/30 to-transparent scan-line" />
              </div>
              
              <div className="text-center space-y-2">
                <div className="flex justify-center">
                  <Loader2 className="h-6 w-6 text-mercadona animate-spin" />
                </div>
                <h3 className="display-sm text-ink">Analizando imagen</h3>
                <p className="text-sm text-ink-soft">
                  Detectando ingredientes y buscando coincidencias en el catálogo...
                </p>
              </div>
            </div>
          )}

          {/* Phase 4: Detected Results */}
          {phase === "detected" && (
            <div className="space-y-6 animate-fade-in" ref={(el) => { if (el) el.scrollIntoView({ behavior: 'smooth' }); }}>
              
              {/* Image thumbnail + AI Message */}
              <div className="flex gap-4 p-4 rounded-xl bg-paper-raised border border-rule">
                {selectedImage && (
                  <div className="h-20 w-20 rounded-lg overflow-hidden shrink-0 border border-rule">
                    <img src={selectedImage} alt="Captura" className="h-full w-full object-cover" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="eyebrow text-ink-soft mb-1">Análisis completado</p>
                  <p className="text-sm text-ink leading-relaxed">
                    {result?.mensaje || "He encontrado varias opciones con lo que tienes."}
                  </p>
                </div>
              </div>

              {/* Detected Ingredients */}
              {result?.ingredientes_detectados?.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="label-cap text-ink-soft">Ingredientes detectados</h3>
                    <span className="meta-mono bg-paper-raised border border-rule px-2 py-0.5 rounded text-ink">
                      {result.ingredientes_detectados.length}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.ingredientes_detectados.map((item, i) => (
                      <div key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-paper rounded-full border border-rule text-sm">
                        <span className="text-ink">{item.nombre}</span>
                        <span className="text-ink-soft text-[10px] uppercase font-mono tracking-wider ml-1">
                          {Math.round(item.confianza * 100)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {(result?.recomendaciones || []).length > 0 && (
                <div className="space-y-3">
                  <h3 className="label-cap text-ink-soft mb-1">Recetas sugeridas</h3>
                  {result.recomendaciones.map((recipe, index) => (
                    <Link
                      key={recipe.id}
                      to={`/recetas/${recipe.id}`}
                      onClick={() => onOpenChange(false)}
                      className="block group bg-paper border border-rule rounded-xl p-4 hover:border-ink hover:shadow-sm transition-all"
                    >
                      <div className="flex items-start gap-4">
                        <div className="h-16 w-16 rounded-lg bg-paper-raised overflow-hidden shrink-0">
                          {recipe.foto_url ? (
                            <img src={recipe.foto_url} alt={recipe.nombre} className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full grid place-items-center text-ink-soft">
                              <Sparkles className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="eyebrow">Opción {index + 1}</p>
                          <h4 className="font-medium text-ink mt-0.5 text-balance leading-snug">{recipe.nombre}</h4>
                          <p className="text-xs text-ink-soft mt-1 line-clamp-2 leading-relaxed">
                            {recipe.motivo}
                          </p>
                          {recipe.ingredientes_usados?.length > 0 && (
                            <p className="meta-mono mt-2 text-[11px] text-ink-soft truncate">
                              Usa: {recipe.ingredientes_usados.join(', ')}
                            </p>
                          )}
                        </div>
                        <ArrowRight className="h-4 w-4 text-ink-soft group-hover:text-ink mt-2 shrink-0 transition-colors" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Sticky Footer ── */}
        <div className="px-6 py-5 hairline-t bg-paper shrink-0">
          {phase === "idle" && (
            <p className="meta-mono text-center text-ink-soft">
              Selecciona una opción arriba para empezar
            </p>
          )}

          {phase === "camera" && (
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="lg"
                className="flex-1"
                onClick={reset}
              >
                Cancelar
              </Button>
              <Button
                size="lg"
                className="flex-[2]"
                onClick={captureFrame}
                disabled={!cameraReady}
              >
                <Camera className="h-4 w-4" />
                Escanear ahora
              </Button>
            </div>
          )}

          {phase === "scanning" && (
            <Button size="lg" className="w-full" disabled>
              <Loader2 className="h-4 w-4 animate-spin" />
              Procesando imagen...
            </Button>
          )}

          {phase === "detected" && (
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="lg"
                onClick={reset}
                className="flex-1"
              >
                <RotateCcw className="h-4 w-4" />
                Nueva foto
              </Button>
              <Button
                size="lg"
                className="flex-1"
                asChild
              >
                <Link
                  to={result?.recomendaciones?.[0]?.id ? `/recetas/${result.recomendaciones[0].id}` : "/catalogo"}
                  onClick={() => onOpenChange(false)}
                >
                  Ver receta
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
        </div>
        
        {/* CSS for custom scan animation */}
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes scan-line {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(200%); }
          }
          .scan-line {
            animation: scan-line 2.5s infinite linear;
          }
        `}} />
      </SheetContent>
    </Sheet>
  );
}

function Step({ n, children }) {
  return (
    <li className="flex gap-3">
      <span className="meta-mono shrink-0">0{n}</span>
      <span className="text-ink leading-relaxed">{children}</span>
    </li>
  );
}

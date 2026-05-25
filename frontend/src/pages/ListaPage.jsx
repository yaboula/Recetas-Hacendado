import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, Share2, ShoppingCart, Package, Info, Minus, Plus, Box, CheckCircle2, ArrowRightLeft, Search, Loader2 } from "lucide-react";
import { getLista, deleteItem, updatePaquetes, getAlternativas, swapProducto, searchProductosLibres, addManualProduct } from "@/api/lista";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/common/EmptyState";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

export default function ListaPage() {
  const [data, setData] = useState({ a_comprar: {}, despensa: [] });
  const [loading, setLoading] = useState(true);

  // Estados para Modales
  const [swapItem, setSwapItem] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    fetchLista();
  }, []);

  const fetchLista = () => {
    getLista(true)
      .then((res) => setData(res.agrupada || { a_comprar: {}, despensa: [] }))
      .catch(() => setData({ a_comprar: {}, despensa: [] }))
      .finally(() => setLoading(false));
  };

  const aComprarSections = useMemo(() => Object.keys(data.a_comprar || {}), [data.a_comprar]);
  const aComprarItems = useMemo(() => Object.values(data.a_comprar || {}).flat(), [data.a_comprar]);
  const despensaItems = useMemo(() => data.despensa || [], [data.despensa]);
  
  const totalEstimado = useMemo(
    () => aComprarItems.reduce((acc, item) => acc + Number(item.precio_total || 0), 0),
    [aComprarItems]
  );

  const totalAhorrado = useMemo(
    () => despensaItems.reduce((acc, item) => {
      const envaseBase = Number(item.cantidad_por_envase) || 1;
      const pkgsNecesarios = Math.ceil(Number(item.cantidad_total) / envaseBase);
      return acc + (pkgsNecesarios * Number(item.producto_precio || 0));
    }, 0),
    [despensaItems]
  );

  const totalItems = aComprarItems.length + despensaItems.length;

  if (!loading && totalItems === 0) {
    return (
      <div className="container-app pt-10">
        <Header total={totalEstimado} count={0} despensaCount={0} onSearch={() => setIsSearchOpen(true)} />
        <EmptyState
          headline="Tu cesta está vacía."
          body="Añade recetas al planificador o añade productos sueltos directamente del catálogo."
          action={
            <div className="flex gap-3 justify-center mt-6">
              <Button onClick={() => setIsSearchOpen(true)} size="lg" variant="outline">
                <Search className="h-4 w-4 mr-2" />
                Buscar producto
              </Button>
              <Button asChild size="lg" variant="mercadona">
                <Link to="/catalogo">Explorar recetas</Link>
              </Button>
            </div>
          }
          testid="lista-empty"
        />
        <SearchModal open={isSearchOpen} onOpenChange={setIsSearchOpen} onAdded={fetchLista} />
      </div>
    );
  }

  const handleUpdatePkgs = async (itemId, currentPkgs, delta) => {
    const newVal = Math.max(0, currentPkgs + delta);
    if (newVal === currentPkgs) return;
    
    const previousData = JSON.parse(JSON.stringify(data));
    try {
      let foundItem = null;
      let fromAComprar = true;
      
      for (const section of aComprarSections) {
        const idx = data.a_comprar[section].findIndex(i => i.id === itemId);
        if (idx > -1) {
          foundItem = { ...data.a_comprar[section][idx], paquetes: newVal };
          foundItem.precio_total = (newVal * Number(foundItem.producto_precio || 0)).toFixed(2);
          break;
        }
      }
      
      if (!foundItem) {
        const idx = despensaItems.findIndex(i => i.id === itemId);
        if (idx > -1) {
          fromAComprar = false;
          foundItem = { ...despensaItems[idx], paquetes: newVal, cogido: false };
          foundItem.precio_total = (newVal * Number(foundItem.producto_precio || 0)).toFixed(2);
        }
      }

      if (!foundItem) return;

      const nextData = { a_comprar: { ...data.a_comprar }, despensa: [...data.despensa] };
      
      if (fromAComprar) {
        const sec = foundItem.seccion_tienda || 'Otros';
        nextData.a_comprar[sec] = nextData.a_comprar[sec].filter(i => i.id !== itemId);
        if (nextData.a_comprar[sec].length === 0) delete nextData.a_comprar[sec];
      } else {
        nextData.despensa = nextData.despensa.filter(i => i.id !== itemId);
      }

      if (newVal === 0) {
        nextData.despensa.unshift(foundItem);
      } else {
        const sec = foundItem.seccion_tienda || 'Otros';
        if (!nextData.a_comprar[sec]) nextData.a_comprar[sec] = [];
        nextData.a_comprar[sec].push(foundItem);
      }

      setData(nextData);
      await updatePaquetes(itemId, newVal);
    } catch (err) {
      toast.error('No se pudo actualizar el producto.');
      setData(previousData);
    }
  };

  const handleDelete = async (itemId) => {
    try {
      await deleteItem(itemId);
      fetchLista();
      toast.success("Producto eliminado.");
    } catch {
      toast.error("No se pudo eliminar.");
    }
  };

  const handleShare = async () => {
    const text = aComprarSections.map((section) => {
      const sectionText = data.a_comprar[section]
        .map((item) => `  · ${item.paquetes}x ${item.producto_nombre} (${item.producto_marca || 'Mercadona'})`)
        .join("\n");
      return `${section}\n${sectionText}`;
    }).join("\n\n");
    const fullText = `🛒 Mi Compra — Recetas Hacendado\nTotal estimado: ${totalEstimado.toFixed(2)} €\n\n${text}`;
    
    if (navigator.share) {
      try { await navigator.share({ title: "Lista de compra", text: fullText }); } catch {}
    } else {
      navigator.clipboard?.writeText(fullText);
      toast.success("Lista copiada al portapapeles.");
    }
  };

  return (
    <div className="container-app pt-10 pb-24" data-testid="lista-page">
      <Header total={totalEstimado} count={aComprarItems.length} despensaCount={despensaItems.length} onSearch={() => setIsSearchOpen(true)} />

      <div className="mt-10 grid md:grid-cols-12 gap-8 lg:gap-12">
        <div className="md:col-span-8 lg:col-span-7">
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="rounded-2xl border border-rule bg-paper-raised p-5 flex gap-4 animate-pulse">
                  <div className="h-16 w-16 bg-paper rounded-xl shrink-0" />
                  <div className="flex-1 space-y-3 pt-1">
                    <div className="h-4 bg-paper rounded w-3/4" />
                    <div className="h-3 bg-paper rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-12 animate-fade-in">
              {aComprarSections.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <ShoppingCart className="h-5 w-5 text-mercadona" />
                    <h2 className="display-sm">Cesta de la compra</h2>
                  </div>
                  
                  <div className="space-y-8">
                    {aComprarSections.map((section) => (
                      <section key={section} data-testid={`section-${section}`}>
                        <div className="flex items-center justify-between pb-3 mb-3 border-b border-rule">
                          <h3 className="label-cap text-ink-soft">{section}</h3>
                          <span className="meta-mono bg-paper-deep px-2 py-0.5 rounded text-[11px] text-ink-soft">
                            {data.a_comprar[section].length}
                          </span>
                        </div>
                        <ul className="space-y-3">
                          {data.a_comprar[section].map((item) => (
                            <ProductCard 
                              key={item.id} 
                              item={item} 
                              onUpdatePkgs={handleUpdatePkgs} 
                              onDelete={handleDelete}
                              onSwap={() => setSwapItem(item)}
                            />
                          ))}
                        </ul>
                      </section>
                    ))}
                  </div>
                </div>
              )}

              {despensaItems.length > 0 && (
                <div className="pt-8 border-t border-dashed border-rule">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <Box className="h-5 w-5 text-ink-soft" />
                      <h2 className="display-sm">Ya lo tengo</h2>
                    </div>
                    {totalAhorrado > 0 && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-green-50 text-green-700 text-xs font-medium">
                        Ahorras {totalAhorrado.toFixed(2)}€
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-ink-soft mb-6 leading-relaxed">
                    Estos ingredientes son necesarios para tus recetas pero has marcado que ya los tienes en casa. No sumarán al ticket final.
                  </p>
                  
                  <ul className="space-y-3">
                    {despensaItems.map((item) => (
                      <ProductCard 
                        key={item.id} 
                        item={item} 
                        onUpdatePkgs={handleUpdatePkgs} 
                        onDelete={handleDelete}
                        onSwap={() => setSwapItem(item)}
                        isDespensa 
                      />
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        <aside className="md:col-span-4 lg:col-span-5">
          <div className="md:sticky md:top-24 rounded-3xl bg-paper-raised border border-rule p-6 lg:p-8" data-testid="summary">
            <p className="eyebrow flex items-center gap-2">
              <Package className="h-4 w-4" />
              Tu carrito
            </p>

            <div className="mt-6 mb-8">
              <div className="flex items-end gap-2">
                <span className="text-5xl font-bold tracking-tight text-ink">{totalEstimado.toFixed(2)}</span>
                <span className="text-2xl font-medium text-ink-soft mb-1">€</span>
              </div>
              <p className="text-sm text-ink-soft mt-2 leading-snug">
                Precio estimado comprando los envases físicos completos.
              </p>
            </div>

            {/* Cross-selling Compact Banner */}
            <div className="mb-6 p-4 rounded-2xl border border-mercadona/20 bg-gradient-to-br from-mercadona/5 to-transparent relative overflow-hidden">
              <div className="relative z-10 flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-mercadona/10 grid place-items-center shrink-0">
                    <Search className="h-4 w-4 text-mercadona" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-semibold text-mercadona leading-tight">¿Te falta algo para casa?</h3>
                    <p className="text-xs text-ink-soft mt-1 leading-relaxed pr-2">Añade al carrito leche, papel, agua o productos sueltos.</p>
                  </div>
                </div>
                <Button onClick={() => setIsSearchOpen(true)} variant="outline" size="sm" className="w-full bg-white border-mercadona/20 hover:border-mercadona hover:bg-mercadona/5 transition-colors shadow-sm">
                  Buscar producto
                </Button>
              </div>
              <div className="absolute -bottom-4 -right-4 text-mercadona/5 rotate-[-15deg] pointer-events-none">
                <ShoppingCart className="h-24 w-24" />
              </div>
            </div>

            {aComprarItems.length === 0 && despensaItems.length > 0 && (
              <div className="flex items-start gap-3 p-4 bg-mercadona/10 text-mercadona rounded-xl mb-6">
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                <p className="text-sm font-medium leading-snug">
                  ¡Genial! Tienes todo lo necesario en casa para cocinar.
                </p>
              </div>
            )}

            <div className="space-y-3">
              <Button size="lg" variant="mercadona" className="w-full h-14 text-[15px]" disabled={aComprarItems.length === 0}>
                <ShoppingCart className="h-5 w-5 mr-2" />
                Pasar a cesta Mercadona
              </Button>
              <Button size="lg" variant="outline" className="w-full h-12" onClick={handleShare} disabled={aComprarItems.length === 0}>
                <Share2 className="h-4 w-4 mr-2" />
                Compartir compra
              </Button>
            </div>
          </div>
        </aside>
      </div>

      <SwapSheet 
        item={swapItem} 
        open={!!swapItem} 
        onOpenChange={(v) => !v && setSwapItem(null)}
        onSwapped={() => {
          setSwapItem(null);
          fetchLista();
        }}
      />
      
      <SearchModal open={isSearchOpen} onOpenChange={setIsSearchOpen} onAdded={fetchLista} />
    </div>
  );
}

function Header({ total, count, despensaCount, onSearch }) {
  return (
    <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <p className="eyebrow">Gestor de compra</p>
        <h1 className="display-xl mt-2 text-balance">De la receta al envase real.</h1>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button onClick={onSearch} variant="outline" className="shrink-0">
          <Search className="h-4 w-4 mr-2" />
          Añadir suelto
        </Button>
        <div className="inline-flex flex-wrap items-center gap-4 text-sm text-ink-soft bg-paper-raised px-4 py-2.5 rounded-full border border-rule shrink-0">
          <span className="inline-flex items-center gap-2">
            <ShoppingCart className="h-4 w-4 text-ink" />
            <strong className="text-ink">{count}</strong> comprar
          </span>
          <span className="w-1 h-1 rounded-full bg-rule" />
          <span className="inline-flex items-center gap-2">
            <Box className="h-4 w-4 text-ink" />
            <strong className="text-ink">{despensaCount}</strong> en casa
          </span>
        </div>
      </div>
    </header>
  );
}

function ProductCard({ item, onUpdatePkgs, onDelete, onSwap, isDespensa = false }) {
  const pkgs = Number(item.paquetes) || 0;
  const precioUnidad = Number(item.producto_precio || 0);
  const qtyNum = Number(item.cantidad_total || 0);
  const qtyFmt = parseFloat(qtyNum.toFixed(3));

  return (
    <li className={`relative group rounded-2xl border transition-all ${isDespensa ? "bg-paper border-dashed border-rule/60 opacity-75 hover:opacity-100" : "bg-paper border-rule hover:border-ink/20 shadow-sm"}`}>
      <div className="p-4 flex gap-4 sm:gap-5">
        <div className={`h-16 w-16 sm:h-20 sm:w-20 shrink-0 rounded-xl overflow-hidden bg-paper-deep border border-rule ${isDespensa ? "grayscale" : ""}`}>
          {item.producto_thumbnail_url ? (
            <img 
              src={item.producto_thumbnail_url} 
              alt="" 
              className="h-full w-full object-cover" 
              loading="lazy" 
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.style.display = 'none';
                if(e.currentTarget.parentElement) {
                  e.currentTarget.parentElement.classList.add('grid', 'place-items-center');
                  e.currentTarget.parentElement.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-package text-ink-soft"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>`;
                }
              }} 
            />
          ) : (
            <div className="h-full w-full grid place-items-center text-ink-soft">
              <Package className="h-6 w-6" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 py-0.5">
          <div className="flex items-start justify-between gap-2">
            <h4 className={`text-base font-medium leading-snug truncate ${isDespensa ? "text-ink-soft line-through" : "text-ink"}`}>
              {item.producto_nombre}
            </h4>
            <button onClick={onSwap} className="shrink-0 h-7 w-7 rounded-full bg-paper-raised border border-rule grid place-items-center text-ink-soft hover:text-ink hover:border-ink transition-colors" title="Cambiar formato o variedad">
              <ArrowRightLeft className="h-3.5 w-3.5" />
            </button>
          </div>
          
          <div className="mt-1 flex items-center gap-2 flex-wrap text-sm">
            <span className="text-ink-soft">{item.producto_marca || 'Mercadona'}</span>
            <span className="text-rule/60">|</span>
            <span className="font-medium text-ink">{precioUnidad.toFixed(2)} € <span className="text-ink-soft font-normal">/ ud</span></span>
          </div>

          <div className="mt-2.5 inline-flex items-center gap-1.5 px-2 py-1 rounded bg-mercadona-soft text-mercadona border border-mercadona/10 text-[11px] font-mono font-medium uppercase tracking-wider">
            {item.cantidad_total ? `Recetas piden: ${qtyFmt} ${item.unidad}` : 'Añadido manualmente'}
          </div>
        </div>

        <div className="shrink-0 flex flex-col items-end justify-between">
          <button onClick={() => onDelete(item.id)} className="h-8 w-8 grid place-items-center rounded-lg text-ink-soft hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100" aria-label="Eliminar">
            <Trash2 className="h-4 w-4" />
          </button>
          <div className="flex items-center bg-paper-raised border border-rule rounded-lg h-9 overflow-hidden">
            <button onClick={() => onUpdatePkgs(item.id, pkgs, -1)} className="w-9 h-full flex items-center justify-center text-ink-soft hover:text-ink hover:bg-rule/30 transition-colors disabled:opacity-30" disabled={pkgs === 0}>
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-8 text-center text-sm font-medium num-mono text-ink select-none">{pkgs}</span>
            <button onClick={() => onUpdatePkgs(item.id, pkgs, 1)} className="w-9 h-full flex items-center justify-center text-ink-soft hover:text-ink hover:bg-rule/30 transition-colors">
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}

function SwapSheet({ item, open, onOpenChange, onSwapped }) {
  const [alts, setAlts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [swapping, setSwapping] = useState(null);

  useEffect(() => {
    if (open && item) {
      setLoading(true);
      getAlternativas(item.producto_id)
        .then(setAlts)
        .catch(() => setAlts([]))
        .finally(() => setLoading(false));
    }
  }, [open, item]);

  const handleSwap = async (altId) => {
    setSwapping(altId);
    try {
      await swapProducto(item.id, altId);
      toast.success("Producto actualizado.");
      onSwapped();
    } catch {
      toast.error("Error al cambiar el producto.");
      setSwapping(null);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md bg-paper border-l border-rule p-0 flex flex-col">
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-rule shrink-0">
          <div className="flex items-center gap-3 text-mercadona mb-2">
            <ArrowRightLeft className="h-5 w-5" />
            <span className="eyebrow">Cambiar variante</span>
          </div>
          <SheetTitle asChild><h2 className="display-sm line-clamp-1">{item?.producto_nombre}</h2></SheetTitle>
          <p className="text-sm text-ink-soft mt-1">Elige un formato o variante diferente para este ingrediente. Recalcularemos los envases automáticamente.</p>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {loading ? (
            <div className="flex items-center justify-center h-32"><Loader2 className="h-6 w-6 animate-spin text-ink-soft" /></div>
          ) : alts.length === 0 ? (
            <div className="text-center py-10 text-ink-soft">No hemos encontrado alternativas automáticas.</div>
          ) : (
            <ul className="space-y-3">
              {alts.map(alt => (
                <li key={alt.id}>
                  <button 
                    onClick={() => handleSwap(alt.id)}
                    disabled={swapping !== null}
                    className="w-full text-left p-4 rounded-2xl border border-rule hover:border-ink hover:shadow-sm transition-all flex items-center gap-4 group disabled:opacity-50"
                  >
                    <div className="h-14 w-14 rounded-lg bg-paper-deep overflow-hidden shrink-0 border border-rule">
                      {alt.thumbnail_url ? <img src={alt.thumbnail_url} className="h-full w-full object-cover" /> : <Package className="h-5 w-5 m-auto text-ink-soft opacity-50" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink group-hover:underline truncate">{alt.nombre}</p>
                      <p className="text-xs text-ink-soft mt-0.5">{alt.marca || 'Mercadona'} · {Number(alt.cantidad_por_envase || 1)} {alt.unidad_base}</p>
                      <p className="text-sm font-bold text-ink mt-1">{Number(alt.precio).toFixed(2)} €</p>
                    </div>
                    {swapping === alt.id && <Loader2 className="h-4 w-4 animate-spin text-ink" />}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function SearchModal({ open, onOpenChange, onAdded }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(null);
  const [addedIds, setAddedIds] = useState(new Set());

  useEffect(() => {
    if (!open) { 
      setQ(""); 
      setResults([]); 
      setAddedIds(new Set());
    }
  }, [open]);

  useEffect(() => {
    if (q.trim().length < 2) { 
      setResults([]); 
      return; 
    }
    const timer = setTimeout(() => {
      setLoading(true);
      searchProductosLibres(q.trim())
        .then(setResults)
        .finally(() => setLoading(false));
    }, 350);
    return () => clearTimeout(timer);
  }, [q]);

  const handleAdd = async (id) => {
    if (addedIds.has(id)) return;
    setAdding(id);
    try {
      await addManualProduct(id);
      setAddedIds(prev => new Set(prev).add(id));
      toast.success("Añadido a la cesta.");
      onAdded();
    } catch {
      toast.error("Error al añadir.");
    } finally {
      setAdding(null);
    }
  };

  const handleSuggestion = (term) => {
    setQ(term);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden bg-paper flex flex-col max-h-[85vh]">
        <div className="p-4 border-b border-rule flex items-center gap-3 shrink-0">
          <Search className={`h-5 w-5 ${loading ? 'text-mercadona animate-pulse' : 'text-ink-soft'}`} />
          <input 
            autoFocus
            type="text" 
            value={q} 
            onChange={(e) => setQ(e.target.value)}
            placeholder="Busca por nombre, marca o tipo..." 
            className="flex-1 bg-transparent border-none outline-none focus:outline-none focus:border-none focus:ring-0 shadow-none appearance-none text-[15px] placeholder:text-ink-soft/70"
          />
          {q.length > 0 && (
            <button 
              onClick={() => setQ('')} 
              className="h-6 w-6 rounded-full bg-rule/50 hover:bg-rule grid place-items-center text-ink-soft transition-colors"
              aria-label="Limpiar búsqueda"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto min-h-[300px] p-2">
          {q.trim().length < 2 ? (
            <div className="py-12 px-6 text-center animate-fade-in">
              <div className="h-16 w-16 bg-mercadona/5 rounded-2xl mx-auto flex items-center justify-center mb-4">
                <ShoppingCart className="h-8 w-8 text-mercadona/60" />
              </div>
              <h3 className="text-base font-semibold text-ink mb-2">¿Qué necesitas añadir?</h3>
              <p className="text-sm text-ink-soft mb-6 max-w-[250px] mx-auto leading-relaxed">
                Busca cualquier producto del supermercado para añadirlo suelto a tu cesta.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {['Leche entera', 'Huevos', 'Pan', 'Detergente', 'Agua', 'Queso'].map(term => (
                  <button 
                    key={term}
                    onClick={() => handleSuggestion(term)}
                    className="px-3 py-1.5 rounded-full bg-paper-raised border border-rule text-xs font-medium text-ink-soft hover:text-mercadona hover:border-mercadona/30 hover:bg-mercadona/5 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 && !loading ? (
            <div className="py-16 px-6 text-center animate-fade-in">
              <div className="h-12 w-12 bg-paper-raised rounded-full mx-auto flex items-center justify-center mb-3">
                <Search className="h-5 w-5 text-ink-soft" />
              </div>
              <p className="text-sm font-medium text-ink">No hemos encontrado "{q}"</p>
              <p className="text-xs text-ink-soft mt-1">Prueba con sinónimos o palabras más cortas.</p>
            </div>
          ) : (
            <ul className="space-y-1 p-1">
              {results.map(prod => {
                const isAdded = addedIds.has(prod.id);
                return (
                  <li key={prod.id}>
                    <button
                      onClick={() => handleAdd(prod.id)}
                      disabled={adding !== null || isAdded}
                      className={`w-full flex items-center gap-4 p-2.5 rounded-xl transition-all text-left group ${
                        isAdded 
                          ? "bg-mercadona/5 border border-mercadona/20 cursor-default" 
                          : "bg-transparent border border-transparent hover:bg-paper-raised hover:border-rule"
                      }`}
                    >
                      <div className="h-12 w-12 rounded-lg border border-rule bg-white overflow-hidden shrink-0 flex items-center justify-center p-0.5">
                        {prod.thumbnail_url ? (
                          <img src={prod.thumbnail_url} className="max-h-full max-w-full object-contain mix-blend-multiply" alt="" />
                        ) : (
                          <Package className="h-5 w-5 text-ink-soft/40" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0 py-0.5">
                        <p className={`text-sm font-medium truncate leading-tight ${isAdded ? "text-mercadona" : "text-ink group-hover:underline"}`}>
                          {prod.nombre}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[13px] font-bold text-ink">{Number(prod.precio).toFixed(2)} €</span>
                          <span className="text-[11px] text-ink-soft truncate border-l border-rule pl-2">
                            {prod.marca || 'Mercadona'} · {prod.cantidad_por_envase} {prod.unidad_base}
                          </span>
                        </div>
                      </div>
                      <div className="shrink-0 pr-2">
                        {isAdded ? (
                          <CheckCircle2 className="h-5 w-5 text-mercadona" />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-mercadona/10 text-mercadona grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Plus className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="p-3 border-t border-rule bg-paper-raised/80 flex justify-between items-center shrink-0">
          <span className="text-[13px] font-medium text-mercadona px-2">
            {addedIds.size > 0 ? `${addedIds.size} producto(s) añadidos` : ''}
          </span>
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)} className="text-ink-soft hover:text-ink">
            Cerrar buscador
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

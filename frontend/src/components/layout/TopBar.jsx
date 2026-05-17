import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Search, ScanLine, Sparkles, ShoppingBasket, House, User, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import QueCocinoHoySheet from "@/components/ai/QueCocinoHoySheet";
import EscanearDespensaSheet from "@/components/ai/EscanearDespensaSheet";
import { getLista } from "@/api/lista";
import { useAuth } from "@/context/AuthContext";

export default function TopBar({ searchValue = "", onSearchChange = () => {} }) {
  const [aiOpen, setAiOpen] = useState(false);
  const [scanOpen, setScanOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [listCount, setListCount] = useState(0);
  const { usuario } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    getLista(false)
      .then((data) => setListCount((data.items || []).filter((item) => !item.cogido).length))
      .catch(() => setListCount(0));
  }, [aiOpen, scanOpen]);

  return (
    <>
      {/* Mercadona brand bar — identity signal, never decorative */}
      <div className="h-[3px] w-full bg-mercadona" aria-hidden data-testid="mercadona-brand-bar" />
      <header
        className={`sticky top-0 z-40 bg-paper/85 backdrop-blur-md transition-colors ${
          scrolled ? "border-b border-rule" : "border-b border-transparent"
        }`}
        data-testid="topbar"
      >
        <div className="container-app h-16 flex items-center gap-6">
          {/* Logo with Mercadona accent */}
          <Link to="/" className="flex items-center gap-2" data-testid="logo-link">
            <span className="display-sm tracking-tightish" style={{ fontWeight: 600 }}>
              Recetas <span style={{ fontStyle: "italic", fontWeight: 400 }}>Hacendado</span>
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-mercadona" aria-hidden />
          </Link>

          {/* Search (desktop) */}
          <div className="hidden md:flex flex-1 max-w-xl">
            <SearchInput value={searchValue} onChange={onSearchChange} />
          </div>

          {/* Nav links (desktop) */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Principal">
            <NavTab to="/" label="Inicio" icon={House} />
            <NavTab to="/catalogo" label="Catálogo" />
            <NavTab to="/planificador" label="Planificador" icon={CalendarDays} />
            <NavTab to="/favoritas" label="Favoritas" />
            <NavTab to="/lista" label="Lista" badge={listCount} />
          </nav>

          {/* AI surfaces (desktop) */}
          <div className="hidden md:flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAiOpen(true)}
              data-testid="open-ai-quecocino"
              className="gap-2"
            >
              <Sparkles className="h-4 w-4" />
              <span className="hidden xl:inline">¿Qué cocino hoy?</span>
              <span className="xl:hidden">IA</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setScanOpen(true)}
              aria-label="Escanear despensa"
              data-testid="open-ai-scan"
            >
              <ScanLine className="h-5 w-5" />
            </Button>
            <Link
              to={usuario ? "/perfil" : "/login"}
              className="h-10 w-10 grid place-items-center rounded-full hover:bg-rule/60 transition-colors"
              aria-label="Cuenta"
              data-testid="account-link"
            >
              <User className="h-5 w-5" />
            </Link>
          </div>

          {/* Mobile compact actions */}
          <div className="md:hidden ml-auto flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={() => setAiOpen(true)} aria-label="IA" data-testid="open-ai-quecocino-mobile">
              <Sparkles className="h-5 w-5" />
            </Button>
            <Link
              to="/lista"
              className="h-10 w-10 grid place-items-center relative"
              aria-label="Lista"
              data-testid="list-link-mobile"
            >
              <ShoppingBasket className="h-5 w-5" />
              {listCount > 0 && (
                <span className="absolute top-1 right-0.5 h-2 w-2 rounded-full bg-tomate" />
              )}
            </Link>
          </div>
        </div>

        {/* Mobile search row */}
        <div className="md:hidden container-app pb-3">
          <SearchInput value={searchValue} onChange={onSearchChange} />
        </div>
      </header>

      <QueCocinoHoySheet open={aiOpen} onOpenChange={setAiOpen} />
      <EscanearDespensaSheet open={scanOpen} onOpenChange={setScanOpen} />
    </>
  );
}

function NavTab({ to, label, badge, icon: Icon }) {
  return (
    <NavLink
      to={to}
      data-testid={`nav-${label.toLowerCase()}`}
      className={({ isActive }) =>
        `relative px-3 h-10 inline-flex items-center text-sm font-medium transition-colors ${
          isActive ? "text-ink" : "text-ink-soft hover:text-ink"
        }`
      }
    >
      {({ isActive }) => (
        <>
          {Icon ? <Icon className="mr-2 h-4 w-4" /> : null}
          {label}
          {badge ? (
            <span className="ml-2 num-mono text-[11px] text-ink-soft">{badge}</span>
          ) : null}
          <span
            className={`absolute left-3 right-3 -bottom-px h-px transition-colors ${
              isActive ? "bg-ink" : "bg-transparent"
            }`}
          />
        </>
      )}
    </NavLink>
  );
}

function SearchInput({ value, onChange }) {
  return (
    <label className="group flex items-center gap-3 h-11 w-full bg-paper-raised border border-rule hover:border-ink/60 focus-within:border-ink rounded-md px-3 transition-colors">
      <Search className="h-4 w-4 text-ink-soft group-focus-within:text-ink" />
      <input
        type="search"
        placeholder="Busca por ingrediente, receta o producto Hacendado…"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="flex-1 bg-transparent border-none outline-none focus:outline-none focus:border-none focus:ring-0 shadow-none appearance-none text-sm placeholder:text-ink-faint"
        data-testid="search-input"
      />
      <kbd className="hidden lg:inline-flex meta-mono text-[10px] border border-rule rounded px-1.5 py-0.5">⌘K</kbd>
    </label>
  );
}

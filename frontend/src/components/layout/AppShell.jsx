import { Link, Outlet } from "react-router-dom";
import TopBar from "@/components/layout/TopBar";
import BottomNav from "@/components/layout/BottomNav";

export default function AppShell({ searchValue, onSearchChange }) {
  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col" data-testid="app-shell">
      <TopBar searchValue={searchValue} onSearchChange={onSearchChange} />
      <main className="flex-1 pb-24 md:pb-12" data-testid="app-main">
        <Outlet context={{ search: searchValue }} />
      </main>
      <BottomNav />
      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer className="hairline-t bg-paper">
      <div className="container-app pt-10 pb-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="display-sm">
              Recetas <span className="italic font-normal">Hacendado</span>
              <span className="ml-2 inline-block h-1.5 w-1.5 rounded-full bg-mercadona align-middle" />
            </p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-soft">
              Una experiencia para planificar, cocinar y comprar mejor con recetas conectadas al catálogo y productos reales.
            </p>
          </div>
          <nav className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm text-ink-soft">
            <Link to="/catalogo" className="hover:text-ink">Catálogo</Link>
            <Link to="/planificador" className="hover:text-ink">Planificador</Link>
            <Link to="/favoritas" className="hover:text-ink">Favoritas</Link>
            <Link to="/lista" className="hover:text-ink">Lista de compra</Link>
          </nav>
        </div>
        <p className="mt-8 pb-2 text-xs text-ink-soft">
          Proyecto académico. Las marcas mencionadas pertenecen a sus respectivos titulares.
        </p>
      </div>
    </footer>
  );
}


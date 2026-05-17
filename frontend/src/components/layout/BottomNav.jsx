import { NavLink } from "react-router-dom";
import { House, Heart, ShoppingBasket, Sparkles, User } from "lucide-react";
import { useEffect, useState } from "react";
import QueCocinoHoySheet from "@/components/ai/QueCocinoHoySheet";
import { getLista } from "@/api/lista";

export default function BottomNav() {
  const [aiOpen, setAiOpen] = useState(false);
  const [listCount, setListCount] = useState(0);

  useEffect(() => {
    const fetchCount = () => {
      getLista(false)
        .then((data) => {
          const items = Array.isArray(data) ? data : (data.items || []);
          setListCount(items.filter((item) => !item.cogido).length);
        })
        .catch(() => setListCount(0));
    };
    fetchCount();

    if (typeof window !== 'undefined') {
      window.addEventListener('lista-updated', fetchCount);
      return () => window.removeEventListener('lista-updated', fetchCount);
    }
  }, [aiOpen]);

  return (
    <>
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-paper-raised hairline-t"
        data-testid="bottomnav"
        aria-label="Navegación principal"
      >
        <ul className="grid grid-cols-5 h-16">
          <Tab to="/" Icon={House} label="Inicio" testid="bottom-inicio" />
          <li>
            <button
              onClick={() => setAiOpen(true)}
              className="w-full h-full flex flex-col items-center justify-center gap-1 text-ink-soft active:text-ink"
              data-testid="bottom-ai"
            >
              <Sparkles className="h-5 w-5" />
              <span className="text-[10px] font-medium tracking-wide">Hoy</span>
            </button>
          </li>
          <Tab to="/lista" Icon={ShoppingBasket} label="Lista" badge={listCount} testid="bottom-lista" />
          <Tab to="/favoritas" Icon={Heart} label="Favoritas" testid="bottom-favoritas" />
          <Tab to="/perfil" Icon={User} label="Perfil" testid="bottom-perfil" />
        </ul>
      </nav>
      <QueCocinoHoySheet open={aiOpen} onOpenChange={setAiOpen} />
    </>
  );
}

function Tab({ to, Icon, label, badge, testid }) {
  return (
    <li>
      <NavLink
        to={to}
        data-testid={testid}
        className={({ isActive }) =>
          `w-full h-full flex flex-col items-center justify-center gap-1 transition-colors ${
            isActive ? "text-ink" : "text-ink-soft"
          }`
        }
      >
        {({ isActive }) => (
          <>
            <span className="relative">
              <Icon className="h-5 w-5" />
              {badge ? (
                <span className="absolute -top-1 -right-2 h-1.5 w-1.5 rounded-full bg-tomate" />
              ) : null}
            </span>
            <span className={`text-[10px] font-medium tracking-wide ${isActive ? "" : ""}`}>{label}</span>
          </>
        )}
      </NavLink>
    </li>
  );
}

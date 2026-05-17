import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { login } from "@/api/auth";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!email || !pwd) return toast.error("Completa todos los campos.");
    setLoading(true);
    try {
      const data = await login({ email, password: pwd });
      signIn(data);
      toast.success("Sesión iniciada");
      navigate(data.usuario.onboarding_done ? "/" : "/onboarding");
    } catch (error) {
      toast.error(error.response?.data?.error || "Error al iniciar sesión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-paper" data-testid="login-page">
      {/* Editorial side */}
      <aside className="hidden md:block relative overflow-hidden bg-paper-deep grain">
        <img
          src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1400&q=80&auto=format&fit=crop"
          alt=""
          className="h-full w-full object-cover"
          onError={(e) => (e.currentTarget.style.opacity = 0)}
        />
        <div className="absolute bottom-10 left-10 right-10">
          <p className="eyebrow text-paper/80">Recetas Hacendado</p>
          <p className="display-md text-paper mt-2 max-w-sm">
            Cocina mejor, decide más rápido, compra con cabeza.
          </p>
        </div>
      </aside>

      {/* Form */}
      <main className="flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <Link to="/catalogo" className="display-sm" style={{ fontWeight: 600 }} data-testid="brand-link">
            Recetas <span style={{ fontStyle: "italic", fontWeight: 400 }}>Hacendado</span>
          </Link>

          <header className="mt-14">
            <p className="eyebrow">Bienvenido</p>
            <h1 className="display-lg mt-3 text-balance">Buenas tardes de nuevo.</h1>
            <p className="text-ink-soft text-[15px] mt-3">
              Accede para retomar tu lista, planificador y favoritas.
            </p>
          </header>

          <form onSubmit={submit} className="mt-10 space-y-5">
            <Field label="Correo electrónico" htmlFor="email">
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                className="input-base"
                data-testid="email-input"
              />
            </Field>
            <Field
              label="Contraseña"
              htmlFor="password"
              hint={<button type="button" className="link-editorial text-xs" data-testid="forgot-password">¿Olvidaste tu contraseña?</button>}
            >
              <div className="relative">
                <input
                  id="password"
                  type={show ? "text" : "password"}
                  autoComplete="current-password"
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  className="input-base pr-10"
                  data-testid="password-input"
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft hover:text-ink"
                  data-testid="toggle-password"
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </Field>

            <Button size="lg" className="w-full" type="submit" disabled={loading} data-testid="submit-login">
              {loading ? "Entrando…" : "Entrar"}
              <ArrowRight className="h-4 w-4" />
            </Button>

            <div className="relative my-6">
              <div className="hairline-t" />
              <span className="absolute inset-x-0 -top-2.5 grid place-items-center">
                <span className="bg-paper px-3 meta-mono">o</span>
              </span>
            </div>

            <Button size="lg" variant="outline" type="button" className="w-full" data-testid="login-mercadona">
              <span className="h-2 w-2 rounded-full bg-mercadona" />
              Continuar con cuenta Mercadona
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-ink-soft">
            ¿Aún no tienes cuenta?{" "}
            <Link to="/register" className="link-editorial" data-testid="register-link">Créala en un minuto</Link>
          </p>
        </div>
      </main>

      <style>{`
        .input-base {
          width: 100%; height: 44px; padding: 0 12px;
          background: #FFFFFF; border: 1px solid #E6E1D7;
          border-radius: 6px; font-family: 'Geist', sans-serif;
          font-size: 15px; color: #161513; outline: none;
          transition: border-color 160ms ease;
        }
        .input-base:hover { border-color: #5B5750; }
        .input-base:focus { border-color: #161513; box-shadow: 0 0 0 3px rgba(22,21,19,0.06); }
        .input-base::placeholder { color: #8C867C; }
      `}</style>
    </div>
  );
}

function Field({ label, htmlFor, hint, children }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <label htmlFor={htmlFor} className="label-cap text-ink-soft">{label}</label>
        {hint}
      </div>
      {children}
    </div>
  );
}

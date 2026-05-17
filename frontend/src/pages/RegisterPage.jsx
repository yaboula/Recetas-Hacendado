import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { register } from "@/api/auth";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!name || !email || !pwd) return toast.error("Completa todos los campos.");
    if (pwd.length < 8) return toast.error("La contraseña debe tener al menos 8 caracteres.");
    setLoading(true);
    try {
      const data = await register({ nombre: name, email, password: pwd });
      signIn(data);
      toast.success("Cuenta creada");
      navigate("/onboarding");
    } catch (error) {
      toast.error(error.response?.data?.error || "No se ha podido crear la cuenta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-paper" data-testid="register-page">
      <aside className="hidden md:block relative overflow-hidden bg-paper-deep grain">
        <img
          src="https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=1400&q=80&auto=format&fit=crop"
          alt=""
          className="h-full w-full object-cover"
          onError={(e) => (e.currentTarget.style.opacity = 0)}
        />
        <div className="absolute bottom-10 left-10 right-10">
          <p className="eyebrow text-paper/80">Recetas Hacendado</p>
          <p className="display-md text-paper mt-2 max-w-sm">
            Una cuenta. Tu lista, tus recetas, tu cocina.
          </p>
        </div>
      </aside>

      <main className="flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <Link to="/catalogo" className="display-sm" style={{ fontWeight: 600 }}>
            Recetas <span style={{ fontStyle: "italic", fontWeight: 400 }}>Hacendado</span>
          </Link>

          <header className="mt-14">
            <p className="eyebrow">Crear cuenta</p>
            <h1 className="display-lg mt-3 text-balance">Empieza en un minuto.</h1>
            <p className="text-ink-soft text-[15px] mt-3">
              Sin spam, sin newsletters automáticas. Solo lo que cocinas y compras.
            </p>
          </header>

          <form onSubmit={submit} className="mt-10 space-y-5">
            <Field label="Nombre" htmlFor="name">
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Cómo quieres que te llamemos"
                className="input-base"
                data-testid="name-input"
              />
            </Field>
            <Field label="Correo electrónico" htmlFor="email">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                className="input-base"
                data-testid="email-input"
              />
            </Field>
            <Field label="Contraseña" htmlFor="password" hint={<span className="meta-mono text-[11px]">Mín. 8 caracteres</span>}>
              <div className="relative">
                <input
                  id="password"
                  type={show ? "text" : "password"}
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                  placeholder="••••••••"
                  className="input-base pr-10"
                  data-testid="password-input"
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  aria-label={show ? "Ocultar" : "Mostrar"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft hover:text-ink"
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </Field>

            <Button size="lg" className="w-full" type="submit" disabled={loading} data-testid="submit-register">
              {loading ? "Creando cuenta…" : "Crear cuenta"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-ink-soft">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="link-editorial" data-testid="login-link">Iniciar sesión</Link>
          </p>

          <p className="mt-10 meta-mono text-center leading-relaxed">
            Al crear tu cuenta aceptas los términos del servicio<br /> y la política de privacidad.
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

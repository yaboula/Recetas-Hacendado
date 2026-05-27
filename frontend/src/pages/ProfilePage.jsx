import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  LogOut, Mail, CalendarDays, BadgeCheck, Check, Loader2, ShieldCheck,
  Heart, ShoppingBasket, ListChecks, CircleCheckBig, ArrowUpRight,
  Salad, User, KeyRound, Leaf, WheatOff, MilkOff, EggOff,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { getProfileStats, updateProfile, changePassword, setPrefs } from "@/api/auth";
import { PREFERENCE_OPTIONS } from "@/lib/recipeAdapters";
import { Button } from "@/components/ui/button";

// Iconografía de dietas, consistente con la vista de receta.
const DIET_ICON = {
  VEGANO: Leaf,
  VEGETARIANO: Leaf,
  SIN_GLUTEN: WheatOff,
  SIN_LACTOSA: MilkOff,
  SIN_HUEVO: EggOff,
};

export default function ProfilePage() {
  const { usuario, updateUsuario, signOut } = useAuth();
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [nombre, setNombre] = useState(usuario?.nombre || "");
  const [email, setEmail] = useState(usuario?.email || "");
  const [preferences, setPreferences] = useState(new Set(usuario?.preferencias || []));
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    setNombre(usuario?.nombre || "");
    setEmail(usuario?.email || "");
    setPreferences(new Set(usuario?.preferencias || []));
  }, [usuario]);

  useEffect(() => {
    setLoadingStats(true);
    getProfileStats()
      .then(setStats)
      .catch(() => toast.error("No pudimos cargar tu resumen."))
      .finally(() => setLoadingStats(false));
  }, []);

  const initials = (usuario?.nombre || usuario?.email || "?").trim().slice(0, 2).toUpperCase();
  const memberSince = usuario?.created_at
    ? new Date(usuario.created_at).toLocaleDateString("es-ES", { month: "long", year: "numeric" })
    : null;

  const profileDirty =
    nombre !== (usuario?.nombre || "") || email !== (usuario?.email || "");

  const prefsDirty = useMemo(() => {
    const original = new Set(usuario?.preferencias || []);
    if (original.size !== preferences.size) return true;
    for (const pref of preferences) if (!original.has(pref)) return true;
    return false;
  }, [preferences, usuario]);

  const passwordMismatch = confirmPassword.length > 0 && newPassword !== confirmPassword;
  const passwordValid =
    currentPassword.length > 0 && newPassword.length >= 8 && newPassword === confirmPassword;

  const s = stats?.stats;
  const purchaseTotal = Number(s?.items_totales || 0);
  const purchaseDone = Number(s?.items_marcados || 0);
  const purchasePct = purchaseTotal > 0 ? Math.round((purchaseDone / purchaseTotal) * 100) : 0;

  const togglePreference = (key) => {
    const next = new Set(preferences);
    next.has(key) ? next.delete(key) : next.add(key);
    setPreferences(next);
  };

  const handleSaveProfile = async (event) => {
    event.preventDefault();
    setSavingProfile(true);
    try {
      const payload = {};
      if (nombre !== usuario?.nombre) payload.nombre = nombre;
      if (email && email !== usuario?.email) payload.email = email;
      if (Object.keys(payload).length === 0) {
        toast.info("No hay cambios en el perfil.");
        return;
      }
      const { usuario: updated } = await updateProfile(payload);
      updateUsuario(updated);
      toast.success("Perfil actualizado.");
    } catch (error) {
      toast.error(error.response?.data?.error || "No se pudo actualizar el perfil.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSavePrefs = async () => {
    setSavingPrefs(true);
    try {
      const res = await setPrefs([...preferences]);
      updateUsuario({ preferencias: res.preferencias });
      toast.success("Preferencias guardadas.");
    } catch (error) {
      toast.error(error.response?.data?.error || "No se pudo guardar.");
    } finally {
      setSavingPrefs(false);
    }
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Las contraseñas no coinciden.");
      return;
    }
    setSavingPassword(true);
    try {
      await changePassword({ current_password: currentPassword, new_password: newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Contraseña actualizada.");
    } catch (error) {
      toast.error(error.response?.data?.error || "No se pudo actualizar la contraseña.");
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="container-app py-8 md:py-12 space-y-10" data-testid="profile-page">
      {/* Identidad */}
      <section className="rounded-2xl border border-rule bg-paper-raised p-6 md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-5">
            <div className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-ink text-paper">
              <span className="display-sm leading-none">{initials}</span>
            </div>
            <div className="min-w-0">
              <p className="eyebrow text-ink-soft">Tu cuenta</p>
              <h1 className="display-lg mt-1 leading-none text-balance">
                {usuario?.nombre || "Tu cuenta"}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 meta-mono">
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" /> {usuario?.email}
                </span>
                {memberSince && (
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5" /> Miembro desde {memberSince}
                  </span>
                )}
                {usuario?.onboarding_done && (
                  <span className="inline-flex items-center gap-1.5 text-tomate">
                    <BadgeCheck className="h-3.5 w-3.5" /> Preferencias configuradas
                  </span>
                )}
              </div>
            </div>
          </div>
          <Button variant="outline" onClick={signOut} className="gap-2 self-start md:self-auto" data-testid="logout-button">
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </Button>
        </div>
      </section>

      {/* Resumen de actividad */}
      <section>
        <p className="eyebrow">Resumen</p>
        <h2 className="display-md mt-1">Tu actividad.</h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {loadingStats ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="skeleton-block h-32 rounded-2xl" />
            ))
          ) : (
            <>
              <StatTile to="/favoritas" icon={Heart} tint="bg-tomate-soft text-tomate" value={s?.favoritos_total} label="Recetas favoritas" />
              <StatTile to="/lista" icon={ShoppingBasket} tint="bg-oliva-soft text-oliva" value={s?.items_totales} label="Productos en lista" />
              <StatTile to="/lista" icon={ListChecks} tint="bg-paper-deep text-ink" value={s?.items_pendientes} label="Pendientes de comprar" />
              <StatTile to="/lista" icon={CircleCheckBig} tint="bg-tomate-soft text-tomate" value={s?.listas_totales} label="Listas creadas" />
            </>
          )}
        </div>

        {!loadingStats && purchaseTotal > 0 && (
          <div className="mt-4 rounded-2xl border border-rule bg-paper-raised p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-ink">Progreso de compra</p>
              <p className="num-mono text-sm text-ink-soft">{purchaseDone} / {purchaseTotal} · {purchasePct}%</p>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-paper-deep">
              <div className="h-full rounded-full bg-mercadona transition-[width] duration-500" style={{ width: `${purchasePct}%` }} />
            </div>
          </div>
        )}
      </section>

      {/* Preferencias alimentarias */}
      <section className="rounded-2xl border border-rule bg-paper-raised p-6 md:p-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-paper-deep text-ink">
              <Salad className="h-5 w-5" />
            </span>
            <div>
              <p className="eyebrow text-ink-soft">Preferencias</p>
              <h2 className="display-sm">Dietas y restricciones</h2>
            </div>
          </div>
          <Button onClick={handleSavePrefs} disabled={savingPrefs || !prefsDirty} className="gap-2">
            {savingPrefs ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            {prefsDirty ? "Guardar preferencias" : "Guardado"}
          </Button>
        </header>
        <p className="mt-4 max-w-xl text-sm text-ink-soft">
          Usamos estas preferencias para destacar recetas compatibles en todo el catálogo.
        </p>
        <div className="mt-5 flex flex-wrap gap-2.5">
          {PREFERENCE_OPTIONS.map((option) => {
            const active = preferences.has(option.key);
            const Icon = DIET_ICON[option.key] || Leaf;
            return (
              <button
                key={option.key}
                type="button"
                onClick={() => togglePreference(option.key)}
                aria-pressed={active}
                className={`inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors ${
                  active
                    ? "border-ink bg-ink text-paper"
                    : "border-rule bg-paper text-ink hover:border-ink"
                }`}
              >
                <Icon className="h-4 w-4" />
                {option.label}
                {active && <Check className="h-3.5 w-3.5" />}
              </button>
            );
          })}
        </div>
      </section>

      {/* Datos personales + Seguridad */}
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-rule bg-paper-raised p-6 md:p-8">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-paper-deep text-ink">
              <User className="h-5 w-5" />
            </span>
            <div>
              <p className="eyebrow text-ink-soft">Datos personales</p>
              <h2 className="display-sm">Información básica</h2>
            </div>
          </div>
          <form className="mt-6 space-y-5" onSubmit={handleSaveProfile}>
            <Field label="Nombre">
              <input
                className="input-base"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Tu nombre"
              />
            </Field>
            <Field label="Email">
              <input
                type="email"
                className="input-base"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
              />
            </Field>
            <div className="flex flex-wrap gap-3 pt-1">
              <Button type="submit" disabled={savingProfile || !profileDirty} className="gap-2">
                {savingProfile ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                Guardar cambios
              </Button>
              <Button
                type="button"
                variant="ghost"
                disabled={!profileDirty}
                onClick={() => { setNombre(usuario?.nombre || ""); setEmail(usuario?.email || ""); }}
              >
                Restablecer
              </Button>
            </div>
          </form>
        </section>

        <section className="rounded-2xl border border-rule bg-paper-raised p-6 md:p-8">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-paper-deep text-ink">
              <KeyRound className="h-5 w-5" />
            </span>
            <div>
              <p className="eyebrow text-ink-soft">Seguridad</p>
              <h2 className="display-sm">Contraseña</h2>
            </div>
          </div>
          <form className="mt-6 space-y-5" onSubmit={handleChangePassword}>
            <Field label="Contraseña actual">
              <input type="password" className="input-base" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
            </Field>
            <Field label="Nueva contraseña" hint="Mínimo 8 caracteres">
              <input type="password" className="input-base" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={8} />
            </Field>
            <Field
              label="Repetir contraseña"
              error={passwordMismatch ? "Las contraseñas no coinciden." : null}
            >
              <input
                type="password"
                className={`input-base ${passwordMismatch ? "!border-tomate" : ""}`}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
              />
            </Field>
            <Button type="submit" disabled={savingPassword || !passwordValid} className="gap-2">
              {savingPassword ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
              Actualizar contraseña
            </Button>
          </form>
        </section>
      </div>
    </div>
  );
}

function StatTile({ to, icon: Icon, tint, value, label }) {
  return (
    <Link to={to} className="card-quiet group block rounded-2xl border border-rule bg-paper-raised p-5">
      <div className="flex items-start justify-between">
        <span className={`grid h-10 w-10 place-items-center rounded-xl ${tint}`}>
          <Icon className="h-5 w-5" />
        </span>
        <ArrowUpRight className="h-4 w-4 text-ink-faint transition-colors group-hover:text-ink" />
      </div>
      <p className="display-md mt-5 num-mono leading-none">{Number(value || 0)}</p>
      <p className="meta-mono mt-2">{label}</p>
    </Link>
  );
}

function Field({ label, hint, error, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-ink">{label}</label>
      {children}
      {error ? (
        <p className="text-xs text-tomate">{error}</p>
      ) : hint ? (
        <p className="meta-mono">{hint}</p>
      ) : null}
    </div>
  );
}

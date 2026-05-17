import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logout } from '../api/auth';

export function Header({ searchValue, onSearchChange, listaCount = 0 }) {
  const { usuario, signOut } = useAuth();
  const navigate = useNavigate();
  const [userOpen, setUserOpen] = useState(false);

  const handleLogout = async () => {
    try { await logout(); } catch {}
    signOut();
    navigate('/login');
  };

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: 'var(--bg-nav-top)',
      boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
      height: 60,
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto', padding: '0 24px',
        height: '100%', display: 'flex', alignItems: 'center', gap: 24,
      }}>
        {/* Logo */}
        <Link to="/" style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <div style={{
            width: 32, height: 32, background: 'var(--green)', borderRadius: 6,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: 14 }}>R</span>
          </div>
          <span style={{ fontWeight: 800, fontSize: 16, color: 'var(--green-dark)', letterSpacing: '-0.02em' }}>
            Recetas<span style={{ color: 'var(--text-primary)' }}>Hacendado</span>
          </span>
        </Link>

        {/* Barra de búsqueda */}
        {onSearchChange && (
          <div style={{ flex: 1, maxWidth: 480, position: 'relative' }}>
            <span style={{
              position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
              color: 'var(--text-muted)', fontSize: 16, pointerEvents: 'none',
            }}>🔍</span>
            <input
              className="input-field"
              style={{ paddingLeft: 36, height: 38 }}
              placeholder="Buscar recetas o ingredientes..."
              value={searchValue}
              onChange={e => onSearchChange(e.target.value)}
            />
          </div>
        )}

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Icono lista de compra */}
          <Link to="/lista" style={{ position: 'relative', padding: '6px 10px', borderRadius: 6, display: 'flex', alignItems: 'center', color: 'var(--text-secondary)', transition: 'var(--transition)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-nav-sec)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <span style={{ fontSize: 20 }}>🛒</span>
            {listaCount > 0 && (
              <span style={{
                position: 'absolute', top: 2, right: 2,
                background: 'var(--green)', color: '#fff',
                fontSize: 10, fontWeight: 700,
                width: 16, height: 16, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{listaCount > 9 ? '9+' : listaCount}</span>
            )}
          </Link>

          {/* Usuario */}
          {usuario ? (
            <div style={{ position: 'relative' }}>
              <button onClick={() => setUserOpen(o => !o)} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '6px 12px', borderRadius: 6, border: '1px solid var(--border)',
                background: 'var(--bg-card)', fontSize: 13, fontWeight: 600,
                color: 'var(--text-primary)', cursor: 'pointer', transition: 'var(--transition)',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--green)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                <span style={{ width: 24, height: 24, background: 'var(--green)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 700 }}>
                  {(usuario.nombre || usuario.email)[0].toUpperCase()}
                </span>
                <span className="hide-mobile">{usuario.nombre || usuario.email.split('@')[0]}</span>
              </button>

              {userOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: 10, boxShadow: '0 8px 30px rgba(0,0,0,0.14)',
                  minWidth: 180, overflow: 'hidden', zIndex: 200,
                }}>
                  <Link to="/favoritas" onClick={() => setUserOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', fontSize: 14, color: 'var(--text-primary)', transition: 'var(--transition)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-nav-sec)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    ❤️ Mis favoritas
                  </Link>
                  <div style={{ height: 1, background: 'var(--border)' }} />
                  <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', fontSize: 14, color: '#D93025', width: '100%', transition: 'var(--transition)', background: 'transparent', border: 'none', cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#FFF5F5'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    🚪 Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">Entrar</Link>
          )}
        </div>
      </div>
    </header>
  );
}

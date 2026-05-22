import { NavLink } from 'react-router-dom';

const links = [
  { to: '/',          label: 'Inicio',          exact: true },
  { to: '/catalogo',  label: 'Catálogo de recetas' },
  { to: '/favoritas', label: 'Mis favoritas' },
  { to: '/lista',     label: 'Mi lista' },
];

export function SecondaryNav() {
  return (
    <nav style={{
      position: 'fixed', top: 60, left: 0, right: 0, zIndex: 99,
      background: 'var(--bg-nav-sec)',
      borderBottom: '1px solid var(--border)',
      height: 40,
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto', padding: '0 24px',
        display: 'flex', alignItems: 'stretch', height: '100%', gap: 4,
      }}>
        {links.map(({ to, label, exact }) => (
          <NavLink key={to} to={to} end={exact} style={({ isActive }) => ({
            display: 'flex', alignItems: 'center',
            padding: '0 14px',
            fontSize: 13, fontWeight: isActive ? 600 : 400,
            color: isActive ? 'var(--green-dark)' : 'var(--text-secondary)',
            borderBottom: isActive ? '2px solid var(--green)' : '2px solid transparent',
            textDecoration: 'none', whiteSpace: 'nowrap',
            transition: 'var(--transition)',
          })}
          onMouseEnter={e => { if (!e.currentTarget.style.borderBottomColor.includes('green')) e.currentTarget.style.background = 'rgba(0,0,0,0.04)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

const FILTERS = [
  { key: 'VEGANO',      label: 'Vegano',       emoji: '🌱' },
  { key: 'VEGETARIANO', label: 'Vegetariano',  emoji: '🥦' },
  { key: 'SIN_GLUTEN',  label: 'Sin gluten',   emoji: '🌾' },
  { key: 'SIN_LACTOSA', label: 'Sin lactosa',  emoji: '🥛' },
  { key: 'SIN_HUEVO',   label: 'Sin huevo',    emoji: '🥚' },
];

export function RecipeFilters({ active, onChange }) {
  const toggle = (key) => {
    if (active.includes(key)) onChange(active.filter(k => k !== key));
    else onChange([...active, key]);
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginRight: 4 }}>Filtrar:</span>
      {FILTERS.map(f => (
        <button
          key={f.key}
          className={`chip ${active.includes(f.key) ? 'active' : ''}`}
          onClick={() => toggle(f.key)}
        >
          {f.emoji} {f.label}
        </button>
      ))}
      {active.length > 0 && (
        <button onClick={() => onChange([])} style={{ fontSize: 12, color: 'var(--text-muted)', cursor: 'pointer', background: 'none', border: 'none', textDecoration: 'underline', padding: '0 4px' }}>
          Limpiar
        </button>
      )}
    </div>
  );
}

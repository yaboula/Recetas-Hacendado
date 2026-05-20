import { Link } from 'react-router-dom';
import { useState } from 'react';
import { toggleFavorito } from '../api/favoritos';

const TAG_LABELS = {
  VEGANO: { label: 'Vegano', emoji: '🌱' },
  VEGETARIANO: { label: 'Vegetariano', emoji: '🥦' },
  SIN_GLUTEN: { label: 'Sin gluten', emoji: '🌾' },
  SIN_LACTOSA: { label: 'Sin lactosa', emoji: '🥛' },
  SIN_HUEVO: { label: 'Sin huevo', emoji: '🥚' },
};

// Colores de fondo por receta (cuando no hay foto)
const CARD_COLORS = [
  '#FFF3E0','#E8F5E9','#E3F2FD','#FCE4EC','#F3E5F5',
  '#E0F7FA','#FFF8E1','#EFEBE9','#F1F8E9','#E8EAF6',
];
const FOOD_EMOJIS = ['🍳','🥘','🍝','🍲','🥗','🍖','🥙','🍱','🥣','🫕','🍜','🥞'];

export function RecipeCard({ receta, isFavorito = false, onFavChange }) {
  const [fav, setFav] = useState(isFavorito);
  const [loadingFav, setLoadingFav] = useState(false);

  const colorIdx = receta.nombre.charCodeAt(0) % CARD_COLORS.length;
  const emojiIdx = receta.nombre.charCodeAt(0) % FOOD_EMOJIS.length;

  const handleFav = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (loadingFav) return;
    setLoadingFav(true);
    try {
      const res = await toggleFavorito(receta.id);
      setFav(res.favorito);
      onFavChange?.(receta.id, res.favorito);
    } catch {}
    finally { setLoadingFav(false); }
  };

  return (
    <Link to={`/recetas/${receta.id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div className="card" style={{ cursor: 'pointer' }}>
        {/* Imagen / Placeholder */}
        <div style={{
          height: 170, background: CARD_COLORS[colorIdx],
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 56, position: 'relative', overflow: 'hidden',
        }}>
          {receta.foto_url
            ? <img src={receta.foto_url} alt={receta.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
            : <span style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.12))' }}>{FOOD_EMOJIS[emojiIdx]}</span>
          }

          {/* Botón favorito */}
          <button onClick={handleFav} style={{
            position: 'absolute', top: 10, right: 10,
            width: 32, height: 32, borderRadius: '50%',
            background: 'rgba(255,255,255,0.92)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 15, boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            transition: 'var(--transition)', border: 'none', cursor: 'pointer',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
            {fav ? '❤️' : '🤍'}
          </button>
        </div>

        {/* Contenido */}
        <div style={{ padding: '14px 16px 16px' }}>
          {/* Tags */}
          {receta.tags?.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
              {receta.tags.slice(0, 2).map(tag => (
                <span key={tag} style={{
                  fontSize: 11, fontWeight: 600, padding: '2px 8px',
                  background: 'var(--green-light)', color: 'var(--green-dark)',
                  borderRadius: 'var(--radius-full)',
                }}>
                  {TAG_LABELS[tag]?.emoji} {TAG_LABELS[tag]?.label}
                </span>
              ))}
            </div>
          )}

          {/* Nombre */}
          <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3, marginBottom: 8, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {receta.nombre}
          </h3>

          {/* Meta */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
              ⏱ {receta.tiempo_minutos} min &nbsp;·&nbsp; 👥 {receta.raciones_base} pers.
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function RecipeCardSkeleton() {
  return (
    <div className="card" style={{ pointerEvents: 'none' }}>
      <div className="skeleton" style={{ height: 170 }} />
      <div style={{ padding: '14px 16px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div className="skeleton" style={{ height: 12, width: '40%' }} />
        <div className="skeleton" style={{ height: 16, width: '85%' }} />
        <div className="skeleton" style={{ height: 14, width: '60%' }} />
      </div>
    </div>
  );
}

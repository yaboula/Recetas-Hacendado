# Sistema de Diseño UI — Réplica Mercadona

**Proyecto:** Recetas Hacendado
**Equipo:** CyberPandas
**Referencia:** mercadona.es — Tienda Online

> El objetivo es que cualquier usuario de Mercadona abra la app y la reconozca inmediatamente como parte del ecosistema Mercadona. Cada decisión de diseño replica fielmente la identidad visual de la marca.

---

## 1. Tokens de Color (Design Tokens)

### Paleta Principal
| Token | Hex | RGB | Uso |
|-------|-----|-----|-----|
| `--color-primary` | `#00AA5B` | rgb(0, 170, 91) | Verde corporativo Mercadona — CTAs, iconos activos, links |
| `--color-primary-dark` | `#008F4C` | rgb(0, 143, 76) | Hover/pressed de elementos primarios |
| `--color-primary-light` | `#E6F7EF` | rgb(230, 247, 239) | Fondos de badges verdes, tags activos |
| `--color-primary-subtle` | `#F0FAF5` | rgb(240, 250, 245) | Fondo sutil de secciones verdes |

### Paleta Neutral
| Token | Hex | Uso |
|-------|-----|-----|
| `--color-text-primary` | `#1A1A1A` | Texto principal, títulos |
| `--color-text-secondary` | `#555555` | Textos secundarios, subtítulos |
| `--color-text-tertiary` | `#888888` | Placeholders, metadatos, tiempo |
| `--color-text-disabled` | `#BBBBBB` | Elementos inactivos |
| `--color-border` | `#E0E0E0` | Bordes de tarjetas, inputs, separadores |
| `--color-border-hover` | `#CCCCCC` | Borde al hacer hover |
| `--color-bg-page` | `#F5F5F5` | Fondo general de la página |
| `--color-bg-card` | `#FFFFFF` | Fondo de tarjetas, paneles |
| `--color-bg-nav-secondary` | `#F0F0F0` | Barra de navegación secundaria |

### Paleta de Estado
| Token | Hex | Uso |
|-------|-----|-----|
| `--color-success` | `#00AA5B` | Confirmaciones (mismo verde Mercadona) |
| `--color-error` | `#D93025` | Errores de validación |
| `--color-warning` | `#F59E0B` | Alertas |
| `--color-info` | `#1D7ABF` | Información neutral |

### Variables CSS (implementación)
```css
:root {
  /* Primarios */
  --color-primary:        #00AA5B;
  --color-primary-dark:   #008F4C;
  --color-primary-light:  #E6F7EF;
  --color-primary-subtle: #F0FAF5;

  /* Texto */
  --color-text-primary:   #1A1A1A;
  --color-text-secondary: #555555;
  --color-text-tertiary:  #888888;
  --color-text-disabled:  #BBBBBB;
  --color-text-inverse:   #FFFFFF;

  /* Bordes */
  --color-border:         #E0E0E0;
  --color-border-hover:   #CCCCCC;

  /* Fondos */
  --color-bg-page:        #F5F5F5;
  --color-bg-card:        #FFFFFF;
  --color-bg-nav-top:     #FFFFFF;
  --color-bg-nav-secondary: #F0F0F0;

  /* Estado */
  --color-success: #00AA5B;
  --color-error:   #D93025;
  --color-warning: #F59E0B;
}
```

---

## 2. Tipografía

### Familia de fuentes
Mercadona usa una sans-serif limpia y neutral. Se replica con:

```css
/* Importar en index.html o CSS global */
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&display=swap');

:root {
  --font-family-base: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-family-mono: 'Courier New', monospace;
}
```

### Escala tipográfica
| Token | Size | Weight | Line-height | Uso |
|-------|------|--------|-------------|-----|
| `--text-xs` | 11px | 400 | 1.4 | Metadatos mínimos, etiquetas pequeñas |
| `--text-sm` | 13px | 400 | 1.5 | Texto de apoyo, ingredientes, pasos |
| `--text-base` | 14px | 400 | 1.6 | Texto de cuerpo principal |
| `--text-md` | 16px | 500 | 1.5 | Nombres de recetas en tarjetas |
| `--text-lg` | 18px | 600 | 1.4 | Subtítulos de sección |
| `--text-xl` | 22px | 700 | 1.3 | Títulos de página |
| `--text-2xl` | 28px | 700 | 1.2 | Hero titles |

---

## 3. Espaciado y Layout

### Sistema de espaciado (base 4px)
```css
:root {
  --space-1:  4px;
  --space-2:  8px;
  --space-3:  12px;
  --space-4:  16px;
  --space-5:  20px;
  --space-6:  24px;
  --space-8:  32px;
  --space-10: 40px;
  --space-12: 48px;
}
```

### Border Radius
```css
:root {
  --radius-sm:   4px;   /* Badges, chips pequeños */
  --radius-md:   8px;   /* Tarjetas, inputs, botones */
  --radius-lg:   12px;  /* Modales, paneles */
  --radius-full: 9999px; /* Pills, avatares */
}
```

### Sombras
```css
:root {
  --shadow-card:  0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04);
  --shadow-hover: 0 4px 12px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.06);
  --shadow-modal: 0 20px 60px rgba(0,0,0,0.18);
}
```

### Grid del catálogo
```css
.recipe-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: var(--space-4);
  padding: var(--space-6);
}

/* Breakpoints */
/* Mobile:  < 768px  → 1 columna */
/* Tablet:  768-1024px → 2 columnas */
/* Desktop: > 1024px → 3-4 columnas */
```

---

## 4. Componentes UI

### 4.1 Header (Navegación Principal)

**Descripción:** Barra blanca con altura fija de 60px. Logo Mercadona a la izquierda, barra de búsqueda centrada (prominente), iconos a la derecha (usuario + lista de compra con contador).

```
┌─────────────────────────────────────────────────────────────────┐
│  🟢 MERCADONA  │  🔍 Buscar recetas o ingredientes...  │ 👤  🛒 2│
└─────────────────────────────────────────────────────────────────┘
```

**Especificaciones:**
- Fondo: `#FFFFFF` con `box-shadow: 0 1px 3px rgba(0,0,0,0.1)`
- Logo: tipografía bold en verde `#00AA5B`, 20px
- Barra de búsqueda: border `1px solid #E0E0E0`, border-radius `4px`, foco en verde `#00AA5B`
- Icono carrito: verde `#00AA5B`, badge contador con fondo verde y texto blanco
- `position: sticky; top: 0; z-index: 100`

---

### 4.2 Barra de Navegación Secundaria

**Descripción:** Barra gris clara debajo del header con accesos rápidos (Inicio, Catálogo, Mis Favoritas).

```
┌─────────────────────────────────────────────────────────────────┐
│  Inicio    Catálogo de recetas    Mis favoritas    Mi lista  │
└─────────────────────────────────────────────────────────────────┘
```

**Especificaciones:**
- Fondo: `#F0F0F0`
- Altura: 40px
- Texto: `13px, #555555`
- Ítem activo: borde inferior `2px solid #00AA5B`, texto `#00AA5B`
- Hover: fondo `#E8E8E8`

---

### 4.3 Recipe Card (Tarjeta de Receta)

**Descripción:** Tarjeta blanca con imagen superior, nombre, metadatos y precio. Hover con sombra y elevación sutil.

```
┌──────────────────────┐
│  [FOTO DE LA RECETA] │  ← 16:9, object-fit: cover
├──────────────────────┤
│ 🌿 Vegano            │  ← Tag dietético (si aplica)
│ Tortilla de patatas  │  ← Nombre, 16px bold
│ ⏱ 30 min  👥 4 pers  │  ← Metadatos, 13px gris
│ ~1,80 €              │  ← Precio, 14px verde bold
│ [♡] [+ Añadir lista] │  ← Acciones
└──────────────────────┘
```

**Especificaciones:**
- Fondo: `#FFFFFF`
- Border: `1px solid #E0E0E0`
- Border-radius: `8px`
- Box-shadow normal: `var(--shadow-card)`
- Box-shadow hover: `var(--shadow-hover)` + `transform: translateY(-2px)`
- Transition: `all 0.2s ease`
- Foto: altura 180px, `object-fit: cover`, `border-radius: 8px 8px 0 0`
- Nombre: `font-size: 16px; font-weight: 600; color: #1A1A1A`
- Precio: `font-size: 14px; font-weight: 700; color: #00AA5B`
- Metadatos: `font-size: 13px; color: #888888`

---

### 4.4 Botones

#### Botón Primario (CTA principal)
```css
.btn-primary {
  background-color: #00AA5B;
  color: #FFFFFF;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}
.btn-primary:hover  { background-color: #008F4C; }
.btn-primary:active { background-color: #007A40; }
.btn-primary:disabled { background-color: #BBBBBB; cursor: not-allowed; }
```

#### Botón Secundario (outline)
```css
.btn-secondary {
  background-color: transparent;
  color: #00AA5B;
  border: 1.5px solid #00AA5B;
  border-radius: 4px;
  padding: 9px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-secondary:hover {
  background-color: #E6F7EF;
}
```

#### Botón de Cantidad +/-
```css
.btn-quantity {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1.5px solid #00AA5B;
  background: #FFFFFF;
  color: #00AA5B;
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
}
.btn-quantity:hover {
  background: #00AA5B;
  color: #FFFFFF;
}
```

---

### 4.5 Inputs y Formularios

```css
.input-field {
  width: 100%;
  height: 44px;
  border: 1px solid #E0E0E0;
  border-radius: 4px;
  padding: 0 12px;
  font-size: 14px;
  color: #1A1A1A;
  background: #FFFFFF;
  outline: none;
  transition: border-color 0.2s ease;
}
.input-field::placeholder { color: #BBBBBB; }
.input-field:focus   { border-color: #00AA5B; box-shadow: 0 0 0 3px #E6F7EF; }
.input-field.error   { border-color: #D93025; }
.input-field:disabled { background: #F5F5F5; color: #BBBBBB; }
```

**Label:**
```css
.input-label {
  font-size: 13px;
  font-weight: 600;
  color: #1A1A1A;
  margin-bottom: 6px;
  display: block;
}
```

**Mensaje de error:**
```css
.input-error-msg {
  font-size: 12px;
  color: #D93025;
  margin-top: 4px;
}
```

---

### 4.6 Tags / Chips Dietéticos

```css
/* Estado inactivo */
.chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 12px;
  border-radius: 9999px;
  border: 1px solid #E0E0E0;
  background: #FFFFFF;
  font-size: 13px;
  color: #555555;
  cursor: pointer;
  transition: all 0.15s ease;
}

/* Estado activo */
.chip.active {
  background: #E6F7EF;
  border-color: #00AA5B;
  color: #00AA5B;
  font-weight: 600;
}

.chip:hover:not(.active) {
  border-color: #CCCCCC;
  background: #F5F5F5;
}
```

**Tags disponibles:**
| Label | Icono | Código |
|-------|-------|--------|
| Vegano | 🌱 | `VEGANO` |
| Vegetariano | 🥦 | `VEGETARIANO` |
| Sin gluten | 🌾 | `SIN_GLUTEN` |
| Sin lactosa | 🥛 | `SIN_LACTOSA` |
| Sin huevo | 🥚 | `SIN_HUEVO` |

---

### 4.7 Badge de Precio Estimado

```css
.price-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #E6F7EF;
  border: 1px solid #00AA5B;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 16px;
  font-weight: 700;
  color: #00AA5B;
}
```
Texto: `~2,40 €` (tilde de aproximación siempre visible)

---

### 4.8 Ítem de Lista de Compra

```
┌───────────────────────────────────────────────┐
│ ○  Leche entera Hacendado    500 ml   0,38 €  │
│ ✓  Huevos Hacendado M        6 ud     1,45 €  │ ← cogido (texto tachado, gris)
└───────────────────────────────────────────────┘
```

```css
.list-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid #F0F0F0;
  transition: background 0.15s ease;
}
.list-item:hover { background: #F9F9F9; }

.list-item.cogido .item-name {
  text-decoration: line-through;
  color: #BBBBBB;
}

.list-item-checkbox {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #E0E0E0;
  cursor: pointer;
  flex-shrink: 0;
}
.list-item-checkbox.checked {
  border-color: #00AA5B;
  background: #00AA5B;
}
```

---

### 4.9 Toast de Confirmación

**Descripción:** Notificación temporal (3s) que aparece en la esquina inferior derecha al añadir ingredientes a la lista.

```
┌────────────────────────────────┐
│ ✓  Ingredientes añadidos       │
│    a tu lista de compra        │
└────────────────────────────────┘
```

```css
.toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: #1A1A1A;
  color: #FFFFFF;
  border-radius: 8px;
  padding: 12px 20px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.2);
  animation: slideUp 0.3s ease, fadeOut 0.3s ease 2.7s forwards;
  z-index: 9999;
}
.toast .icon { color: #00AA5B; font-size: 18px; }
```

---

## 5. Páginas — Layout y Estructura

### 5.1 Página de Login / Registro

```
┌───── Header (logo centrado) ─────┐
│                                   │
│   ┌─── Tarjeta central (400px) ──┐│
│   │  Bienvenido a                ││
│   │  Recetas Hacendado           ││
│   │                              ││
│   │  [Email ________________]    ││
│   │  [Contraseña ___________]    ││
│   │                              ││
│   │  [     Iniciar sesión    ]   ││  ← btn-primary full width
│   │                              ││
│   │  ¿No tienes cuenta? Regíst.  ││
│   └──────────────────────────────┘│
│                                   │
└───────────────────────────────────┘
Fondo: #F5F5F5
```

### 5.2 Página de Onboarding

```
┌───── Header ─────────────────────┐
│                                   │
│  Paso 1 de 1                      │
│  ¿Tienes alguna preferencia      │
│  alimentaria?                     │
│  (Puedes cambiarlas después)      │
│                                   │
│  [🌱 Vegano]  [🥦 Vegetariano]   │
│  [🌾 Sin gluten] [🥛 Sin lactosa]│
│  [🥚 Sin huevo]                  │
│                                   │
│  [  Continuar sin seleccionar  ] │
│  [      Guardar y continuar    ] │← verde, activo si hay selección
│                                   │
└───────────────────────────────────┘
```

### 5.3 Página de Catálogo

```
┌── Header sticky ─────────────────────────────────────────────┐
├── Barra secundaria: Inicio | Catálogo | Favoritas | Mi lista ─┤
│                                                               │
│  Recetas de la semana                        [semana 20/2026] │
│                                                               │
│  [🌱 Vegano] [🌾 Sin gluten] [🥛 Sin lactosa] [🥦 Vegetariano]│
│                                                               │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                        │
│  │ foto │ │ foto │ │ foto │ │ foto │                        │
│  │ ...  │ │ ...  │ │ ...  │ │ ...  │  ← RecipeCard grid    │
│  └──────┘ └──────┘ └──────┘ └──────┘                        │
│  ┌──────┐ ┌──────┐                                           │
│  │ foto │ │ foto │                                           │
│  └──────┘ └──────┘                                           │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

### 5.4 Ficha de Receta

```
┌── Header sticky ─────────────────────────────────────────────┐
│                                                               │
│  [  FOTO HERO — full width, 400px alto  ]                    │
│                                                               │
│  Tortilla de patatas Hacendado                               │
│  ⏱ 45 min  │  👥 [–] 4 [+] personas  │  ~2,80 €            │
│  🌿 Vegano                                                    │
│                                                               │
│  ──────────────────────────────────────────────              │
│  INGREDIENTES              [+ Añadir todo a la lista]        │
│  • 500 g  Patatas Hacendado                 0,48 €           │
│  • 5 ud   Huevos Hacendado M                0,88 €           │
│  • 200 ml Aceite oliva Hacendado            0,32 €           │
│  • 1 ud   Cebolla Hacendado                 0,12 €           │
│                                                               │
│  ──────────────────────────────────────────────              │
│  PREPARACIÓN                                                  │
│  1. Pela y corta las patatas en láminas finas...             │
│  2. Calienta el aceite en una sartén...                      │
│  3. ...                                                       │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

### 5.5 Página de Lista de Compra

```
┌── Header sticky ─────────────────────────────────────────────┐
│                                                               │
│  Mi lista de compra (12 productos)   [🗑 Vaciar lista]       │
│                                                               │
│  ▼ FRUTAS Y VERDURAS                                         │
│    ○  Patatas Hacendado           1 kg           0,96 €      │
│    ✓  Cebolla Hacendado           2 ud           0,24 €      │
│                                                               │
│  ▼ LÁCTEOS Y HUEVOS                                          │
│    ○  Huevos Hacendado M          10 ud          1,76 €      │
│    ○  Leche entera Hacendado      1 L            0,68 €      │
│                                                               │
│  ▼ ACEITES Y CONSERVAS                                       │
│    ○  Aceite de oliva Hacendado   200 ml         0,32 €      │
│                                                               │
│             TOTAL ESTIMADO: ~3,96 €                          │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

---

## 6. Microinteracciones y Comportamientos

| Interacción | Comportamiento |
|-------------|----------------|
| Hover en RecipeCard | `translateY(-2px)` + sombra más pronunciada, 200ms ease |
| Clic en "Añadir a la lista" | Spinner 500ms → Toast de confirmación 3s |
| Clic en favorito (♡) | Relleno inmediato del icono (optimistic update), luego sincroniza con API |
| Cambio de raciones (+/-) | Cantidades e ingredientes se actualizan instantáneamente en el DOM |
| Activar filtro | Chip pasa a estado activo con transición 150ms, grid se re-renderiza |
| Búsqueda | Resultados aparecen con debounce 300ms, spinner mientras carga |
| Marcar item en lista | Checkbox relleno verde, texto tachado, item baja al final de la sección |
| Hover en botón primario | `background: #008F4C`, transición 200ms |

---

## 7. Responsive Design

| Breakpoint | Ancho | Columnas del catálogo | Comportamiento |
|------------|-------|----------------------|----------------|
| Mobile | < 768px | 1 columna | Header simplificado, búsqueda en full width |
| Tablet | 768–1023px | 2 columnas | Barra secundaria colapsada en menú |
| Desktop | ≥ 1024px | 3–4 columnas | Layout completo |

---

## 8. Accesibilidad (a11y)

| Regla | Implementación |
|-------|----------------|
| Contraste mínimo 4.5:1 | Verde `#00AA5B` sobre blanco: 3.9:1 → usar `#008F4C` para texto |
| Focus visible | `outline: 2px solid #00AA5B; outline-offset: 2px` en todos los interactivos |
| ARIA labels | `aria-label` en botones icónicos (favorito, vaciar lista, +/-) |
| Roles semánticos | `<nav>`, `<main>`, `<section>`, `<article>` para tarjetas |
| Imágenes | `alt` descriptivo en todas las fotos de recetas |

> **Nota sobre texto verde:** Para texto sobre fondo blanco, usar `#008F4C` en lugar de `#00AA5B` para cumplir WCAG AA (4.5:1). Reservar `#00AA5B` para iconos, bordes y fondos.

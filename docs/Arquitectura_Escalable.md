# Arquitectura Escalable — Recetas Hacendado

**Proyecto:** Recetas Hacendado
**Equipo:** CyberPandas
**Versión:** 1.0

> Esta arquitectura está diseñada para ser **funcional hoy** y **escalable mañana**. Cada decisión tiene en cuenta el crecimiento futuro sin introducir complejidad innecesaria en la fase actual.

---

## 1. Estructura de Carpetas del Repositorio

```
Scrum-Mercadona-CyberPandas/
├── frontend/                        # Aplicación React
│   ├── public/
│   │   └── assets/                  # Imágenes estáticas, favicon
│   ├── src/
│   │   ├── api/                     # Capa de comunicación con el backend
│   │   │   ├── auth.js              # register, login, logout
│   │   │   ├── recetas.js           # getRecetas, getRecetaById, buscarRecetas
│   │   │   ├── lista.js             # getLista, addItems, patchItem, deleteItem
│   │   │   └── favoritos.js         # toggleFavorito, getFavoritos
│   │   ├── components/              # Componentes reutilizables (átomos/moléculas)
│   │   │   ├── ui/
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Badge.jsx
│   │   │   │   ├── Toast.jsx
│   │   │   │   ├── Spinner.jsx
│   │   │   │   └── SkeletonCard.jsx
│   │   │   ├── RecipeCard.jsx       # Tarjeta del catálogo
│   │   │   ├── RecipeFilters.jsx    # Barra de filtros dietéticos
│   │   │   ├── PortionControl.jsx   # Widget +/- raciones
│   │   │   ├── PriceTag.jsx         # Badge de precio estimado
│   │   │   ├── FavoriteButton.jsx   # Corazón toggle
│   │   │   ├── ShoppingListItem.jsx # Ítem de la lista con checkbox
│   │   │   └── SearchBar.jsx        # Input de búsqueda con debounce
│   │   ├── layouts/
│   │   │   ├── MainLayout.jsx       # Header + contenido + footer
│   │   │   └── AuthLayout.jsx       # Layout centrado para login/register
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx        # HU-01
│   │   │   ├── RegisterPage.jsx     # HU-01
│   │   │   ├── OnboardingPage.jsx   # HU-02
│   │   │   ├── CatalogoPage.jsx     # HU-03 + HU-09 + HU-11
│   │   │   ├── RecetaPage.jsx       # HU-04 + HU-05 + HU-06 + HU-07
│   │   │   ├── ListaPage.jsx        # HU-07 + HU-08
│   │   │   └── FavoritasPage.jsx    # HU-10
│   │   ├── hooks/                   # Custom hooks
│   │   │   ├── useAuth.js           # Estado de sesión global
│   │   │   ├── useRecetas.js        # Fetch catálogo con filtros
│   │   │   ├── useLista.js          # Fetch + mutaciones de la lista
│   │   │   └── useDebounce.js       # Debounce para buscador
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Contexto global de usuario
│   │   ├── utils/
│   │   │   ├── calcPrecio.js        # Lógica de cálculo de precio proporcional
│   │   │   ├── formatCurrency.js    # Formatear "~2,40 €"
│   │   │   └── groupBySeccion.js    # Agrupar items de lista por sección
│   │   ├── constants/
│   │   │   └── dietaryFilters.js    # Enums de filtros (VEGANO, SIN_GLUTEN…)
│   │   ├── App.jsx                  # Router principal
│   │   └── main.jsx                 # Entry point
│   ├── .env.example
│   ├── vite.config.js
│   └── package.json
│
├── backend/                         # API REST en Node.js + Express
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js          # Conexión a PostgreSQL (pool de conexiones)
│   │   │   └── env.js               # Validación de variables de entorno
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js   # Verificación JWT en rutas protegidas
│   │   │   ├── error.middleware.js  # Manejador global de errores
│   │   │   └── validate.middleware.js # Validación de body con Joi/Zod
│   │   ├── modules/                 # Módulos por dominio (escalabilidad)
│   │   │   ├── auth/
│   │   │   │   ├── auth.routes.js
│   │   │   │   ├── auth.controller.js
│   │   │   │   └── auth.service.js
│   │   │   ├── recetas/
│   │   │   │   ├── recetas.routes.js
│   │   │   │   ├── recetas.controller.js
│   │   │   │   └── recetas.service.js
│   │   │   ├── lista/
│   │   │   │   ├── lista.routes.js
│   │   │   │   ├── lista.controller.js
│   │   │   │   └── lista.service.js
│   │   │   └── favoritos/
│   │   │       ├── favoritos.routes.js
│   │   │       ├── favoritos.controller.js
│   │   │       └── favoritos.service.js
│   │   ├── database/
│   │   │   ├── migrations/          # Scripts SQL ordenados (001_, 002_…)
│   │   │   │   ├── 001_create_usuarios.sql
│   │   │   │   ├── 002_create_recetas.sql
│   │   │   │   ├── 003_create_productos.sql
│   │   │   │   ├── 004_create_lista.sql
│   │   │   │   └── 005_create_favoritos.sql
│   │   │   └── seeds/               # Datos iniciales
│   │   │       ├── productos.seed.js
│   │   │       └── recetas.seed.js
│   │   └── app.js                   # Configuración de Express
│   ├── server.js                    # Entry point
│   ├── .env.example
│   └── package.json
│
├── docs/                            # Documentación del proyecto
│   ├── Pila_del_Producto.md
│   ├── Plan_de_Sprints.md
│   ├── Stack_Tecnologico.md
│   ├── Arquitectura_Escalable.md    ← este archivo
│   └── UI_Sistema_Diseno.md
├── img/                             # Mockups y assets visuales
└── README.md
```

---

## 2. Esquema de Base de Datos (PostgreSQL)

### Diagrama de Relaciones

```
usuarios ─────────────────┐
   │ 1                     │
   │                       │
   │ N                     │ N
listas_compra         favoritos
   │ 1                     │ N
   │                       │
   │ N               recetas ────── pasos_receta
items_lista                │ N
   │ N                     │ N
   │               ingredientes_receta
productos_hacendado ───────┘ N
```

### DDL Completo

```sql
-- ============================================================
-- TABLA: usuarios
-- ============================================================
CREATE TABLE usuarios (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           VARCHAR(255) UNIQUE NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    nombre          VARCHAR(100),
    onboarding_done BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- TABLA: preferencias_usuario
-- Separada de usuarios para escalar a más preferencias futuras
-- ============================================================
CREATE TABLE preferencias_usuario (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id  UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    tipo        VARCHAR(50) NOT NULL,  -- 'VEGANO', 'SIN_GLUTEN', 'SIN_LACTOSA', 'VEGETARIANO', 'SIN_HUEVO'
    UNIQUE(usuario_id, tipo)
);

-- ============================================================
-- TABLA: recetas
-- ============================================================
CREATE TABLE recetas (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre          VARCHAR(255) NOT NULL,
    descripcion     TEXT,
    foto_url        VARCHAR(500),
    tiempo_minutos  INTEGER NOT NULL,
    raciones_base   INTEGER NOT NULL DEFAULT 4,
    semana_activa   DATE,             -- Para rotación semanal del catálogo
    created_at      TIMESTAMP DEFAULT NOW()
);

-- Tags dietéticos de la receta (relación N:M receta ↔ tipo)
CREATE TABLE recetas_tags (
    receta_id   UUID NOT NULL REFERENCES recetas(id) ON DELETE CASCADE,
    tag         VARCHAR(50) NOT NULL,  -- 'VEGANO', 'SIN_GLUTEN', etc.
    PRIMARY KEY (receta_id, tag)
);

-- ============================================================
-- TABLA: pasos_receta
-- ============================================================
CREATE TABLE pasos_receta (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    receta_id   UUID NOT NULL REFERENCES recetas(id) ON DELETE CASCADE,
    orden       INTEGER NOT NULL,
    descripcion TEXT NOT NULL
);

-- ============================================================
-- TABLA: productos_hacendado
-- Catálogo de productos de la marca Hacendado
-- ============================================================
CREATE TABLE productos_hacendado (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre              VARCHAR(255) NOT NULL,
    categoria           VARCHAR(100),           -- 'Lácteos', 'Carnes', etc.
    seccion_tienda      VARCHAR(100),           -- 'Frutas y Verduras', 'Carnes y Pescados', ...
    precio              NUMERIC(6,2) NOT NULL,  -- Precio del envase/unidad
    unidad_venta        VARCHAR(20) NOT NULL,   -- 'kg', 'L', 'ud', '500g'
    cantidad_por_envase NUMERIC(8,3) NOT NULL,  -- Cantidad en la unidad_venta (ej: 0.5 para 500g)
    unidad_base         VARCHAR(10) NOT NULL,   -- 'g', 'ml', 'ud' (unidad de medida base)
    foto_url            VARCHAR(500)
);

-- ============================================================
-- TABLA: ingredientes_receta (relación N:M receta ↔ producto)
-- ============================================================
CREATE TABLE ingredientes_receta (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    receta_id           UUID NOT NULL REFERENCES recetas(id) ON DELETE CASCADE,
    producto_id         UUID NOT NULL REFERENCES productos_hacendado(id),
    cantidad_base       NUMERIC(8,3) NOT NULL,  -- Para raciones_base de la receta
    unidad              VARCHAR(20) NOT NULL,   -- 'g', 'ml', 'ud', 'cucharada'
    nombre_display      VARCHAR(100)            -- Nombre legible: "Leche entera"
);

-- ============================================================
-- TABLA: listas_compra
-- Cada usuario tiene UNA lista activa
-- ============================================================
CREATE TABLE listas_compra (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id  UUID UNIQUE NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at  TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- TABLA: items_lista
-- Los ítems de la lista de compra del usuario
-- ============================================================
CREATE TABLE items_lista (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lista_id        UUID NOT NULL REFERENCES listas_compra(id) ON DELETE CASCADE,
    producto_id     UUID NOT NULL REFERENCES productos_hacendado(id),
    cantidad_total  NUMERIC(8,3) NOT NULL,   -- Acumulada (suma inteligente)
    unidad          VARCHAR(20) NOT NULL,
    cogido          BOOLEAN DEFAULT FALSE,   -- Marcado en tienda
    updated_at      TIMESTAMP DEFAULT NOW(),
    UNIQUE(lista_id, producto_id)            -- Garantiza no-duplicados en BD
);

-- ============================================================
-- TABLA: favoritos
-- ============================================================
CREATE TABLE favoritos (
    usuario_id  UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    receta_id   UUID NOT NULL REFERENCES recetas(id) ON DELETE CASCADE,
    created_at  TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (usuario_id, receta_id)     -- Clave compuesta, evita duplicados
);

-- ============================================================
-- ÍNDICES (rendimiento)
-- ============================================================
CREATE INDEX idx_recetas_semana ON recetas(semana_activa);
CREATE INDEX idx_ingredientes_receta_id ON ingredientes_receta(receta_id);
CREATE INDEX idx_ingredientes_producto_id ON ingredientes_receta(producto_id);
CREATE INDEX idx_items_lista_lista_id ON items_lista(lista_id);
CREATE INDEX idx_favoritos_usuario ON favoritos(usuario_id);
-- Índice de búsqueda de texto en recetas
CREATE INDEX idx_recetas_nombre_gin ON recetas USING GIN(to_tsvector('spanish', nombre));
```

---

## 3. API REST — Contrato de Endpoints

### Convenciones
- Base URL: `/api/v1`
- Autenticación: `Authorization: Bearer <JWT>` en rutas protegidas (🔒)
- Formato: JSON en todos los cuerpos
- Respuestas de error: `{ "error": "mensaje", "code": "CODIGO" }`

### Auth
| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| `POST` | `/auth/register` | Público | Registro de nuevo usuario |
| `POST` | `/auth/login` | Público | Login, devuelve JWT |
| `POST` | `/auth/logout` | 🔒 | Invalida sesión |
| `GET` | `/auth/me` | 🔒 | Datos del usuario autenticado |
| `PUT` | `/auth/preferencias` | 🔒 | Actualiza preferencias dietéticas |

### Recetas
| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| `GET` | `/recetas` | 🔒 | Catálogo (filtros: `?tags=VEGANO,SIN_GLUTEN&q=pollo`) |
| `GET` | `/recetas/:id` | 🔒 | Ficha completa con ingredientes y pasos |
| `GET` | `/recetas/:id/precio` | 🔒 | Precio estimado `?raciones=6` |

### Lista de Compra
| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| `GET` | `/lista` | 🔒 | Lista del usuario (`?agrupada=true` para secciones) |
| `POST` | `/lista/items` | 🔒 | Añadir ingredientes (body: `{ receta_id, raciones }`) |
| `PATCH` | `/lista/items/:id` | 🔒 | Marcar/desmarcar como cogido |
| `DELETE` | `/lista/items/:id` | 🔒 | Eliminar un ítem |
| `DELETE` | `/lista` | 🔒 | Vaciar lista completa |

### Favoritos
| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| `GET` | `/favoritos` | 🔒 | Recetas favoritas del usuario |
| `POST` | `/favoritos/:recetaId` | 🔒 | Toggle favorito (añade o elimina) |

---

## 4. Lógica de Negocio Clave

### Suma Inteligente de Ingredientes (HU-07)

```javascript
// backend/src/modules/lista/lista.service.js
async function addRecetaToLista(usuarioId, recetaId, raciones) {
  // 1. Obtener o crear la lista del usuario
  const lista = await getOrCreateLista(usuarioId);

  // 2. Obtener ingredientes de la receta escalados a las raciones pedidas
  const ingredientes = await getIngredientesEscalados(recetaId, raciones);

  // 3. Para cada ingrediente: INSERT o UPDATE (suma)
  for (const ing of ingredientes) {
    await db.query(`
      INSERT INTO items_lista (lista_id, producto_id, cantidad_total, unidad)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (lista_id, producto_id)
      DO UPDATE SET
        cantidad_total = items_lista.cantidad_total + EXCLUDED.cantidad_total,
        updated_at = NOW()
    `, [lista.id, ing.producto_id, ing.cantidad, ing.unidad]);
  }

  return getLista(usuarioId);
}
```

### Cálculo de Precio Estimado (HU-05)

```javascript
// Precio proporcional: cuánto cuesta la cantidad usada de un producto
// precio_por_unidad_base = producto.precio / producto.cantidad_por_envase
// coste_ingrediente = cantidad_escalada × precio_por_unidad_base

function calcularPrecioReceta(ingredientes, raciones, racionesBase) {
  return ingredientes.reduce((total, ing) => {
    const cantidadEscalada = ing.cantidad_base * (raciones / racionesBase);
    const precioPorUnidadBase = ing.producto.precio / ing.producto.cantidad_por_envase;
    return total + (cantidadEscalada * precioPorUnidadBase);
  }, 0);
}
```

---

## 5. Principios de Escalabilidad

### Escalabilidad de la Base de Datos
| Técnica | Aplicada desde | Descripción |
|---------|---------------|-------------|
| **Índices** | Sprint 1 | Índices en columnas de búsqueda y FK más usadas |
| **UUID como PK** | Sprint 1 | Evita colisiones en entornos distribuidos futuros |
| **Pool de conexiones** | Sprint 1 | `pg.Pool` con max 10 conexiones (configurable) |
| **Full-text search** | Sprint 4 | Índice GIN en `recetas.nombre` para búsqueda eficiente |
| **ON CONFLICT DO UPDATE** | Sprint 3 | Upsert atómico para suma inteligente (sin race conditions) |

### Escalabilidad del Backend
| Técnica | Aplicada desde | Descripción |
|---------|---------------|-------------|
| **Módulos por dominio** | Sprint 1 | Cada dominio (auth, recetas, lista) es independiente y reemplazable |
| **Middleware de error global** | Sprint 1 | Un único punto para manejar errores, fácil de extender con logging |
| **Variables de entorno validadas** | Sprint 1 | `env.js` valida que todas las variables existan al arrancar |
| **Versionado de API** (`/v1`) | Sprint 1 | Permite añadir `/v2` sin romper clientes existentes |
| **Separación controller/service** | Sprint 1 | El service contiene la lógica; el controller solo orquesta |

### Escalabilidad del Frontend
| Técnica | Aplicada desde | Descripción |
|---------|---------------|-------------|
| **Capa `api/`** | Sprint 1 | Toda comunicación HTTP centralizada; cambiar backend URL en un solo lugar |
| **Custom hooks** | Sprint 2 | `useRecetas`, `useLista` encapsulan fetch + estado + error |
| **Componentes atómicos** | Sprint 2 | `Button`, `Badge`, `Toast` reutilizables en toda la app |
| **Lazy loading de páginas** | Sprint 2 | `React.lazy()` para dividir el bundle por página |
| **Debounce en búsqueda** | Sprint 4 | `useDebounce(300ms)` evita llamadas innecesarias a la API |

---

## 6. Variables de Entorno

### Backend (`.env`)
```env
# Base de datos
DATABASE_URL=postgresql://usuario:password@host:5432/recetas_hacendado
DB_POOL_MAX=10

# Autenticación
JWT_SECRET=tu_secreto_super_seguro_min_32_chars
JWT_EXPIRES_IN=7d

# Servidor
PORT=3001
NODE_ENV=development
```

### Frontend (`.env`)
```env
VITE_API_BASE_URL=http://localhost:3001/api/v1
```

---

## 7. Flujo de Despliegue

```
Desarrollador hace push a rama feature/HU-XX
          ↓
Pull Request a main (revisión obligatoria de 1 compañero)
          ↓
CI: Tests automáticos (si fallan, el merge está bloqueado)
          ↓
Merge a main
          ↓
Vercel detecta el push → Build automático del frontend
          ↓
Vercel despliega en URL de producción (< 2 min)
          ↓
Backend: desplegado manualmente o con script en el mismo servidor
```

### Entornos
| Entorno | URL | Cuándo se actualiza |
|---------|-----|---------------------|
| **Development** | `localhost:5173` (frontend) / `localhost:3001` (backend) | Local, en tiempo real |
| **Staging** | Vercel Preview URL (por PR) | En cada Pull Request |
| **Production** | URL final de Vercel | En cada merge a `main` |

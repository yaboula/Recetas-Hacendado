# Plan de Sprints — Recetas Hacendado

**Proyecto:** Recetas Hacendado
**Equipo:** CyberPandas
**Metodología:** Scrum
**Duración de Sprint:** 2 semanas
**Velocidad del equipo:** ~12 pts/sprint (estimación conservadora)
**Total Story Points:** 47 pts de desarrollo + Sprint 0 (ya completado)
**Fecha de inicio del desarrollo:** Semana 3 (tras cierre del Sprint 1)

> **Principio rector:** No hay MVPs ni entregas parciales. Cada Sprint entrega un bloque funcional completo, testado e integrado, que forma parte del producto final. El producto se entrega íntegro al cierre del Sprint 5.

---

## Visión Global del Plan

```
SPRINT 0  ──  Definición, Diseño y Setup del Repositorio         [COMPLETADO ✅]
SPRINT 1  ──  Infraestructura + Auth + Onboarding         (11 pts)
SPRINT 2  ──  Catálogo + Ficha de Receta + Filtros        (13 pts)
SPRINT 3  ──  Precio + Raciones + Lista de Compra         (14 pts)
SPRINT 4  ──  Lista en Tienda + Favoritos + Buscador      (10 pts)
              ─────────────────────────────────────────────────────
              PRODUCTO COMPLETO — 47 pts                    4 Sprints
```

---

## SPRINT 0 · Definición y Setup ✅ COMPLETADO

**Duración:** 2 semanas | **Story Points:** 0 pts de desarrollo

### Entregables completados
- [x] Visión del Producto redactada
- [x] Product Backlog v2.0 (11 HU · 47 pts) con criterios de aceptación
- [x] Stack Tecnológico definido y documentado
- [x] Plan de Sprints y Arquitectura documentados
- [x] Sistema de Diseño (réplica Mercadona) documentado
- [x] Mockups UI (Home, Ficha de Receta, Lista de Compra)
- [x] Repositorio GitHub estructurado
- [ ] Invitación enviada al profesor (pendiente)
- [ ] Issues creados en GitHub Projects (pendiente — primer acto del Sprint 1)

---

## SPRINT 1 · Infraestructura + Autenticación + Onboarding

**Duración:** 2 semanas
**Story Points:** 11 pts
**HUs incluidas:** HU-01 (8 pts) · HU-02 (3 pts)

**Objetivo del Sprint:**
> Tener el esqueleto completo de la aplicación funcionando: base de datos levantada, API conectada, sistema de autenticación seguro y el flujo de onboarding de preferencias operativo. Al final del sprint, un usuario puede registrarse, configurar sus preferencias y acceder a la app autenticado.

### Backlog del Sprint

| Tarea | HU | Estimación | Descripción |
|-------|----|-----------|-------------|
| Setup repositorio monorepo | — | 0.5 días | Crear estructura `/frontend` y `/backend` en el repo |
| Configurar BD PostgreSQL | — | 0.5 días | Levantar instancia, crear schema inicial (tablas: usuarios, preferencias) |
| Implementar endpoints de auth | HU-01 | 2 días | `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout` |
| Middleware de autenticación JWT | HU-01 | 1 día | Verificación de token en rutas protegidas |
| Pantalla de Login/Registro (UI) | HU-01 | 1.5 días | Formularios con validación en tiempo real, estilo Mercadona |
| Gestión de sesión en frontend | HU-01 | 1 día | Almacenamiento token, redirección automática |
| Flujo Onboarding (UI) | HU-02 | 1 día | Pantalla de selección de preferencias post-registro |
| Endpoint guardar preferencias | HU-02 | 0.5 días | `PUT /api/usuarios/preferencias` |
| Tests de integración auth | HU-01 | 1 día | Test de registro, login, token expirado, rutas protegidas |
| Despliegue inicial en Vercel | — | 0.5 días | Configurar CI/CD automático desde `main` |

### Criterios de Aceptación del Sprint
- [ ] Un usuario puede registrarse con email y contraseña
- [ ] Un usuario puede iniciar y cerrar sesión
- [ ] La sesión persiste entre recargas (JWT en localStorage/cookie)
- [ ] Las rutas `/catalogo`, `/lista`, `/perfil` redirigen a `/login` sin sesión
- [ ] El onboarding aparece una sola vez tras el primer registro
- [ ] Las preferencias (vegano, sin gluten, sin lactosa) se guardan en BD
- [ ] El frontend está desplegado en Vercel con CI/CD activo

### Definition of Done (DoD) del Sprint
- Código revisado por al menos 1 compañero (Pull Request aprobado)
- Tests de integración pasando en CI
- Documentación de endpoints actualizada
- Desplegado en entorno de staging (Vercel preview)

---

## SPRINT 2 · Catálogo Visual + Ficha de Receta + Filtros

**Duración:** 2 semanas
**Story Points:** 13 pts
**HUs incluidas:** HU-03 (5 pts) · HU-04 (5 pts) · HU-09 (3 pts)

**Objetivo del Sprint:**
> El corazón de la app es visible y funcional. El usuario puede navegar por el catálogo de recetas semanales (filtrado por sus preferencias), entrar en la ficha de detalle de cualquier receta y ver todos los ingredientes, pasos y metadatos. Los filtros son interactivos en tiempo real.

### Backlog del Sprint

| Tarea | HU | Estimación | Descripción |
|-------|----|-----------|-------------|
| Ampliar schema BD (recetas, ingredientes, productos) | HU-03/04 | 1 día | Tablas: `recetas`, `pasos_receta`, `ingredientes_receta`, `productos_hacendado` |
| Poblar BD con datos de prueba | HU-03 | 1 día | Seed de al menos 12 recetas con ingredientes mapeados a productos Hacendado |
| Endpoint catálogo de recetas | HU-03 | 0.5 días | `GET /api/recetas` (con filtros por query params) |
| Endpoint ficha de receta | HU-04 | 0.5 días | `GET /api/recetas/:id` (detalle completo con ingredientes y pasos) |
| Componente `RecipeCard` (UI) | HU-03 | 1 día | Tarjeta con foto, nombre, tiempo, precio estimado, tag dietético |
| Página catálogo (UI) | HU-03 | 1 día | Grid responsive con `RecipeCard`, estado vacío, skeleton loaders |
| Barra de filtros (UI) | HU-09 | 1 día | Chips/pills de filtro (Vegano, Sin gluten...) activos/inactivos |
| Lógica de filtros en tiempo real | HU-09 | 0.5 días | Estado de filtros en React, query sincronizada con API o filtrado local |
| Página ficha de receta (UI) | HU-04 | 1.5 días | Hero con foto, metadata, lista de ingredientes, pasos numerados |
| Aplicar filtros desde onboarding | HU-09 | 0.5 días | Los filtros activos al entrar = preferencias del usuario |
| Tests componentes catálogo | — | 0.5 días | Test renderizado con y sin filtros, navegación a ficha |

### Criterios de Aceptación del Sprint
- [ ] El catálogo muestra mínimo 6 recetas en grid visual
- [ ] Cada tarjeta muestra: foto, nombre, tiempo de preparación y precio estimado
- [ ] Los filtros (Vegano, Sin gluten, Sin lactosa) funcionan en tiempo real
- [ ] Al entrar, los filtros reflejan las preferencias del usuario
- [ ] La ficha de receta muestra: foto, nombre, descripción, tiempo, raciones base, ingredientes (con cantidad y unidad), pasos numerados
- [ ] Los ingredientes de la ficha están mapeados a productos Hacendado reales

### Definition of Done (DoD)
- Todos los criterios anteriores verificados en staging
- Al menos 12 recetas con datos reales en BD
- Diseño fiel al Sistema de Diseño Mercadona (ver `UI_Sistema_Diseno.md`)
- Pull Request aprobado y mergeado a `main`

---

## SPRINT 3 · Precio Estimado + Raciones + Lista de Compra

**Duración:** 2 semanas
**Story Points:** 14 pts
**HUs incluidas:** HU-05 (3 pts) · HU-06 (3 pts) · HU-07 (8 pts)

**Objetivo del Sprint:**
> La app transforma la intención de cocinar en una lista de compra inteligente. El usuario ajusta las raciones, ve el precio actualizado en tiempo real y añade todos los ingredientes a su lista con un solo clic. La lógica de suma inteligente (sin duplicados) funciona correctamente.

### Backlog del Sprint

| Tarea | HU | Estimación | Descripción |
|-------|----|-----------|-------------|
| Añadir precios a `productos_hacendado` en BD | HU-05 | 0.5 días | Campo `precio_por_unidad` y `unidad` (€/100g, €/L, €/ud) |
| Lógica de cálculo de precio en backend | HU-05 | 1 día | Endpoint `GET /api/recetas/:id/precio?raciones=N` — calcula suma proporcional |
| Widget de raciones +/- (UI) | HU-06 | 0.5 días | Componente controlado, mínimo 1, máximo 20 |
| Recálculo de ingredientes en frontend | HU-06 | 0.5 días | Estado `raciones`, cantidades = base × (raciones/racionesBase) |
| Recálculo de precio en frontend | HU-05/06 | 0.5 días | Llama a endpoint de precio o calcula localmente con datos de ficha |
| Display del precio estimado (UI) | HU-05 | 0.5 días | Badge "Precio estimado: ~X,XX €" reactivo a cambio de raciones |
| Schema BD lista de compra | HU-07 | 0.5 días | Tablas: `listas_compra`, `items_lista` (FK a usuario y a producto) |
| Endpoint añadir a la lista | HU-07 | 1.5 días | `POST /api/lista/items` — lógica: ¿existe? → UPDATE cantidad; si no → INSERT |
| Endpoint obtener lista del usuario | HU-07 | 0.5 días | `GET /api/lista` — devuelve items con nombre, cantidad, sección |
| Botón "Añadir a la lista" (UI) | HU-07 | 1 día | En la ficha de receta, con estado de carga y feedback de confirmación (toast) |
| Vista previa de la lista (UI) | HU-07 | 1 día | Panel lateral o página `/lista` con listado de items y cantidades totales |
| Tests lógica suma inteligente | HU-07 | 1 día | Tests unitarios backend: casos de sum, nuevo item, unidades distintas |

### Criterios de Aceptación del Sprint
- [ ] El control +/- ajusta las raciones (1–20) y las cantidades se actualizan instantáneamente
- [ ] El precio estimado se actualiza en tiempo real al cambiar las raciones
- [ ] El precio se muestra con formato "~X,XX €"
- [ ] "Añadir a la lista" añade todos los ingredientes con las cantidades correctas (según raciones)
- [ ] Si el mismo ingrediente ya está en la lista, su cantidad se suma (no se duplica)
- [ ] El usuario recibe feedback visual (toast/notificación) al añadir a la lista
- [ ] La lista es accesible y muestra los items actualizados

### Definition of Done (DoD)
- Tests unitarios de suma inteligente: 100% pasando
- Probado con escenario completo: añadir 2 recetas que comparten un ingrediente
- Diseño fiel al Sistema de Diseño Mercadona
- Pull Request aprobado y mergeado

---

## SPRINT 4 · Lista en Tienda + Favoritos + Buscador

**Duración:** 2 semanas
**Story Points:** 10 pts
**HUs incluidas:** HU-08 (5 pts) · HU-10 (2 pts) · HU-11 (3 pts)

**Objetivo del Sprint:**
> Producto completo. La lista de la compra se convierte en una herramienta de uso en tienda física (organizada por secciones y con tachado). Los usuarios pueden guardar recetas favoritas y encontrar cualquier receta de forma instantánea mediante el buscador. Al final de este sprint, el producto está listo para entrega.

### Backlog del Sprint

| Tarea | HU | Estimación | Descripción |
|-------|----|-----------|-------------|
| Añadir campo `seccion_tienda` a `productos_hacendado` | HU-08 | 0.5 días | Enum: Frutas y Verduras, Carnes, Pescados, Lácteos, Panadería, Conservas, Otros |
| Endpoint lista agrupada por sección | HU-08 | 0.5 días | `GET /api/lista?agrupada=true` — devuelve items agrupados por sección |
| Vista de lista en tienda (UI) | HU-08 | 1.5 días | Secciones colapsables, item con checkbox "cogido", items cogidos al final |
| Endpoint marcar/desmarcar item | HU-08 | 0.5 días | `PATCH /api/lista/items/:id` — toggle `cogido: true/false` |
| Endpoint eliminar item y vaciar lista | HU-08 | 0.5 días | `DELETE /api/lista/items/:id` y `DELETE /api/lista` |
| Schema BD favoritos | HU-10 | 0.25 días | Tabla `favoritos` (FK usuario + FK receta, UNIQUE constraint) |
| Endpoints favoritos (toggle) | HU-10 | 0.5 días | `POST /api/favoritos/:recetaId` (toggle: añade si no existe, elimina si existe) |
| Icono favorito en tarjeta y ficha (UI) | HU-10 | 0.5 días | Corazón con estado activo/inactivo, optimistic update |
| Sección "Mis favoritas" (UI) | HU-10 | 0.5 días | Vista filtrada del catálogo con solo las recetas favoritas del usuario |
| Endpoint búsqueda de recetas | HU-11 | 0.5 días | `GET /api/recetas?q=término` — búsqueda en nombre e ingredientes (ILIKE) |
| Barra de búsqueda (UI) | HU-11 | 0.5 días | Input con debounce (300ms), resultados en tiempo real, estado vacío |
| Búsqueda por ingrediente (backend) | HU-11 | 0.5 días | JOIN en BD para encontrar recetas que contienen el ingrediente buscado |
| QA final + corrección de bugs | — | 1 día | Revisión completa de todos los flujos de usuario |
| Documentación final y limpieza | — | 0.5 días | README actualizado, variables de entorno documentadas, comentarios en código |

### Criterios de Aceptación del Sprint
- [ ] La lista de compra está organizada por secciones de supermercado
- [ ] El usuario puede marcar productos como "cogidos" (se tachan / van al final)
- [ ] El usuario puede eliminar productos individuales o vaciar toda la lista
- [ ] La lista persiste entre sesiones (guardada en BD)
- [ ] El icono de favorito funciona en tarjetas y ficha de receta
- [ ] Las recetas favoritas se guardan en BD y son accesibles en "Mis favoritas"
- [ ] La búsqueda funciona por nombre de receta y por ingrediente
- [ ] Los resultados aparecen mientras se escribe (debounce 300ms)
- [ ] Si no hay resultados, se muestra un mensaje informativo

### Definition of Done (DoD) — ENTREGA FINAL
- Todos los criterios de aceptación de las 11 HUs verificados
- Aplicación desplegada en Vercel (URL de producción)
- BD de producción levantada con datos reales
- Tests de integración end-to-end pasando
- Pull Request final aprobado y mergeado a `main`
- Presentación y demo preparadas

---

## Calendario de Referencia

| Sprint | Semanas | HUs | Puntos | Entregable |
|--------|---------|-----|--------|------------|
| Sprint 0 | S1–S2 | — | 0 | Definición completa, mockups, repo ✅ |
| Sprint 1 | S3–S4 | HU-01, HU-02 | 11 | Auth + Onboarding funcionando |
| Sprint 2 | S5–S6 | HU-03, HU-04, HU-09 | 13 | Catálogo + Ficha + Filtros |
| Sprint 3 | S7–S8 | HU-05, HU-06, HU-07 | 14 | Precio + Raciones + Lista |
| Sprint 4 | S9–S10 | HU-08, HU-10, HU-11 | 10 | Lista en tienda + Favoritos + Buscador |
| **TOTAL** | **10 semanas** | **11 HUs** | **47 pts** | **Producto completo** |

---

## Roles del Equipo por Sprint

| Rol Scrum | Responsabilidad |
|-----------|----------------|
| **Product Owner** | Valida criterios de aceptación al final de cada sprint. Prioriza el backlog si hay imprevistos. |
| **Scrum Master** | Facilita las Daily Standup, elimina impedimentos, lleva el control de la velocidad. |
| **Dev Team** | Divide las tareas en la Sprint Planning, actualiza el tablero diariamente. |

### Ceremonias por Sprint
| Ceremonia | Cuándo | Duración |
|-----------|--------|----------|
| **Sprint Planning** | Inicio del sprint (lunes S1) | 2 horas |
| **Daily Standup** | Cada día hábil | 15 min |
| **Sprint Review** | Final del sprint (viernes S2) | 1 hora |
| **Sprint Retrospective** | Tras la Review | 30 min |

---

## Gestión de Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|------------|
| Sprint 3 sobrecargado (14 pts, lógica compleja) | Alta | Alto | Empezar el schema de BD en Sprint 2 (tarea adelantada) |
| Datos de productos Hacendado incompletos | Media | Medio | Crear dataset manual mínimo de 30 productos en Sprint 1 |
| Problemas de despliegue en Vercel | Baja | Alto | Configurar CI/CD desde el Sprint 1, no dejarlo para el final |
| Conflictos de Git en trabajo paralelo | Media | Medio | Ramas por feature (`feature/HU-XX`), PRs obligatorios para mergear |
| Estimaciones incorrectas (deuda técnica) | Media | Medio | Reservar el 20% del tiempo de cada sprint para imprevistos |

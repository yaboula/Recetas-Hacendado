# Stack Tecnológico

**Proyecto:** Recetas Hacendado
**Equipo:** CyberPandas
**Decisión adoptada:** Arquitectura Full-Stack JS (Opción A)
**Fecha de decisión:** Mayo 2026

---

## Arquitectura Seleccionada

```
┌─────────────────────────────────────────────────────────┐
│                     USUARIO (Browser)                    │
└───────────────────────┬─────────────────────────────────┘
                        │ HTTP / HTTPS
┌───────────────────────▼─────────────────────────────────┐
│              FRONTEND — React (Vercel)                   │
│  • Interfaz de usuario y navegación                      │
│  • Estado local y recálculo en tiempo real (raciones)    │
│  • Gestión dinámica de la lista de la compra             │
└───────────────────────┬─────────────────────────────────┘
                        │ API REST (JSON)
┌───────────────────────▼─────────────────────────────────┐
│              BACKEND — Node.js + Express                 │
│  • Lógica de negocio (suma inteligente, precio, etc.)    │
│  • Autenticación y gestión de sesiones                   │
│  • Endpoints REST para todas las entidades               │
└───────────────────────┬─────────────────────────────────┘
                        │ SQL
┌───────────────────────▼─────────────────────────────────┐
│              BASE DE DATOS — PostgreSQL                  │
│  • Usuarios, Recetas, Ingredientes, Productos, Listas    │
│  • Integridad relacional entre entidades complejas       │
└─────────────────────────────────────────────────────────┘
```

---

## Tecnologías y Justificaciones

### Frontend: React

**Justificación:**
- Ideal para gestionar la **interactividad intensiva** del proyecto: recálculo en tiempo real del precio al cambiar raciones (HU-06), actualización instantánea de filtros (HU-09) y gestión dinámica del estado de la lista de la compra (HU-07, HU-08).
- Ecosistema maduro con abundantes librerías para UI y estado.
- El equipo tiene conocimientos previos.

**Responsabilidades clave:**
- Renderizado del catálogo de recetas y la ficha de detalle.
- Lógica de UI para raciones ajustables (cálculo en el cliente antes de sincronizar).
- Gestión del estado de la lista de la compra (marcar/desmarcar en tienda).

---

### Backend: Node.js + Express

**Justificación:**
- Permite mantener un **único lenguaje (JavaScript/TypeScript)** en todo el proyecto, reduciendo la curva de aprendizaje y el cambio de contexto para el equipo.
- Express es ligero y perfecto para construir una **API REST** sin overhead innecesario.
- Facilita la lógica de negocio compleja: suma inteligente de ingredientes (HU-07), cálculo del precio por porción (HU-05), verificación de duplicados.

**Responsabilidades clave:**
- Autenticación y autorización (registro, login, tokens — HU-01).
- Endpoints CRUD para recetas, listas y favoritos.
- Lógica de suma/deduplicación de ingredientes al añadir a la lista.
- Cálculo del precio estimado usando los datos de productos Hacendado en BD.

---

### Base de Datos: PostgreSQL

**Justificación:**
- **Obligatorio** dada la complejidad relacional del proyecto:
  - Un `Usuario` tiene muchas `Listas`.
  - Una `Lista` tiene muchos `Ingredientes` (con cantidad).
  - Una `Receta` tiene muchos `Ingredientes`.
  - Cada `Ingrediente` se mapea a un `Producto` Hacendado con precio.
- Las relaciones con claves foráneas garantizan la **integridad de los datos**.
- Consultas complejas (precio total, suma de cantidades) se ejecutan eficientemente con SQL.

**Entidades principales (esquema preliminar):**

| Tabla | Descripción |
|-------|-------------|
| `usuarios` | Cuenta, preferencias dietéticas, sesión |
| `recetas` | Nombre, descripción, foto, tiempo, raciones base |
| `pasos_receta` | Pasos de elaboración numerados por receta |
| `ingredientes_receta` | Relación N:M receta↔producto con cantidad y unidad |
| `productos_hacendado` | Catálogo de productos: nombre, precio, categoría, sección tienda |
| `listas_compra` | Lista activa de un usuario |
| `items_lista` | Ingrediente + cantidad acumulada + estado (cogido/pendiente) |
| `favoritos` | Relación usuario↔receta |

---

### Despliegue / Hosting: Vercel

**Justificación:**
- **CI/CD nativo:** cada push a `main` despliega automáticamente el frontend sin configuración.
- Perfecto para aplicaciones React (Next.js o CRA).
- Preview deployments automáticos para cada Pull Request, facilitando la revisión del equipo.
- Gratuito en el plan Hobby para proyectos académicos.

---

## Flujo de Datos Básico

```
1. Usuario abre la app en el navegador (React)
   ↓
2. React muestra el catálogo de recetas (GET /api/recetas)
   ↓
3. Usuario selecciona una receta → ficha de detalle
   ↓
4. Usuario ajusta raciones → React recalcula precio en el cliente (sin API call)
   ↓
5. Usuario pulsa "Añadir a la lista" → POST /api/lista/items
   ↓
6. Node.js comprueba si el ingrediente ya existe en la lista del usuario
   → Si existe: UPDATE cantidad (suma inteligente)
   → Si no existe: INSERT nuevo item
   ↓
7. PostgreSQL actualiza la tabla items_lista con integridad garantizada
   ↓
8. Node.js devuelve la lista actualizada → React actualiza la UI al instante
```

---

## Decisiones Rechazadas

| Alternativa | Motivo de rechazo |
|-------------|-------------------|
| Vue / Angular | El equipo tiene mayor experiencia con React |
| Django / Rails | Introduciría un segundo lenguaje (Python/Ruby), aumentando la complejidad |
| MongoDB | Las relaciones complejas entre entidades requieren integridad relacional; NoSQL no es la herramienta adecuada aquí |
| Firebase | Limita la lógica de negocio del backend; menos control sobre la suma inteligente de ingredientes |

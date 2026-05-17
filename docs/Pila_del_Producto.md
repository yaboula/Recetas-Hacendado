# Pila del Producto (Product Backlog)

**Proyecto:** Recetas Hacendado
**Equipo:** CyberPandas
**Total Story Points:** 47 pts
**Versión del Backlog:** v2.0 — Revisión y corrección post-análisis

---

## Resumen de Mejoras Integradas (v1 → v2)

| Mejora | Descripción |
|--------|-------------|
| **Gran Diferenciador** | Cálculo del precio estimado de cada receta usando la BD de productos Hacendado |
| **Lógica Matemática** | Ajuste de raciones en tiempo real y suma inteligente en la lista (sin duplicados) |
| **UX mejorada** | Onboarding de preferencias dietéticas y organización de la lista por secciones del supermercado |

---

## Tabla de Historias de Usuario

| ID | Título | Prioridad | Puntos | Estado / Origen |
|----|--------|-----------|--------|-----------------|
| **HU-01** | Registro, login y sesión de usuario | Alta | 8 pts | Nueva / Base |
| **HU-02** | Onboarding con preferencias dietéticas | Alta | 3 pts | Nueva |
| **HU-03** | Catálogo visual de recetas semanales | Alta | 5 pts | Mejorada |
| **HU-04** | Ficha de receta con metadata completa | Alta | 5 pts | Mejorada |
| **HU-05** | Precio estimado de la receta | Alta | 3 pts | Nueva |
| **HU-06** | Raciones ajustables (cálculo dinámico) | Alta | 3 pts | Nueva |
| **HU-07** | Añadir a la lista con cantidades y sin duplicados | Alta | 8 pts | Mejorada |
| **HU-08** | Gestión inteligente de la lista en tienda (por secciones) | Alta | 5 pts | Mejorada |
| **HU-09** | Filtros de preferencias alimentarias | Media | 3 pts | Mejorada |
| **HU-10** | Recetas favoritas | Media | 2 pts | Nueva |
| **HU-11** | Buscador de recetas (por nombre o ingrediente) | Baja | 3 pts | Nueva |
| | **TOTAL** | | **47 pts** | |

---

## Detalle de las Historias de Usuario

### HU-01 · Registro, login y sesión de usuario
**Prioridad:** Alta · **Puntos:** 8

> "Como usuario nuevo, quiero poder registrarme con mi email y contraseña, y después iniciar sesión de forma segura, para que mis listas y favoritos estén guardados y asociados a mi cuenta."

**Criterios de aceptación:**
- El usuario puede registrarse con email + contraseña.
- El usuario puede iniciar y cerrar sesión.
- La sesión persiste entre visitas (token almacenado).
- Las rutas protegidas redirigen al login si no hay sesión activa.

---

### HU-02 · Onboarding con preferencias dietéticas
**Prioridad:** Alta · **Puntos:** 3

> "Como usuario que acaba de registrarse, quiero indicar mis preferencias alimentarias (vegano, sin gluten, sin lactosa…) una sola vez, para que la app las recuerde y me muestre recetas adecuadas desde el primer momento."

**Criterios de aceptación:**
- Flujo de onboarding aparece solo la primera vez tras el registro.
- El usuario puede seleccionar una o varias preferencias.
- Las preferencias se guardan en el perfil y pueden modificarse en ajustes.

---

### HU-03 · Catálogo visual de recetas semanales
**Prioridad:** Alta · **Puntos:** 5

> "Como usuario, quiero ver una selección visual e inspiradora de recetas cada semana, para planificar mis comidas sin tener que pensar demasiado."

**Criterios de aceptación:**
- Se muestran al menos 6 recetas en cuadrícula visual con foto, nombre y tiempo de preparación.
- Las recetas se filtran automáticamente según las preferencias del usuario (HU-02 / HU-09).
- La selección se renueva semanalmente.

---

### HU-04 · Ficha de receta con metadata completa
**Prioridad:** Alta · **Puntos:** 5

> "Como usuario, quiero entrar en el detalle de una receta y ver los ingredientes exactos (con cantidades), los pasos de preparación, el tiempo y las raciones por defecto, para poder cocinarla sin ambigüedades."

**Criterios de aceptación:**
- La ficha muestra: foto, nombre, descripción, tiempo, raciones, lista de ingredientes con cantidad y unidad, y pasos numerados.
- Los ingredientes están mapeados a productos reales de la marca Hacendado.
- La ficha incluye el precio estimado (HU-05) y el ajuste de raciones (HU-06).

---

### HU-05 · Precio estimado de la receta
**Prioridad:** Alta · **Puntos:** 3

> "Como usuario, quiero ver cuánto me costará aproximadamente cocinar esa receta con productos Hacendado, para decidir si se ajusta a mi presupuesto antes de añadirla a la lista."

**Criterios de aceptación:**
- El precio se calcula sumando el coste proporcional de cada ingrediente Hacendado según la cantidad requerida.
- El precio se actualiza en tiempo real al cambiar las raciones (HU-06).
- Se muestra con formato claro: "Precio estimado: ~2,40 €".

---

### HU-06 · Raciones ajustables (cálculo dinámico)
**Prioridad:** Alta · **Puntos:** 3

> "Como usuario, quiero poder cambiar el número de raciones de una receta y que las cantidades de todos los ingredientes y el precio se recalculen automáticamente, para adaptar la receta a mi grupo."

**Criterios de aceptación:**
- Control +/- para ajustar raciones (mínimo 1, máximo 20).
- Las cantidades de ingredientes escalan proporcionalmente al instante (sin recargar la página).
- El precio estimado también se actualiza (HU-05).

---

### HU-07 · Añadir a la lista con cantidades y sin duplicados
**Prioridad:** Alta · **Puntos:** 8

> "Como usuario, quiero pulsar un botón para añadir todos los ingredientes de una receta a mi lista de la compra, y que si ya tengo un ingrediente en la lista, la cantidad se sume en lugar de duplicarse."

**Criterios de aceptación:**
- Botón "Añadir a la lista" visible en la ficha de receta.
- Si el ingrediente no existe en la lista → se añade con su cantidad.
- Si el ingrediente ya existe → la cantidad se incrementa (suma inteligente).
- El usuario recibe feedback visual confirmando la acción.
- Las cantidades añadidas respetan el número de raciones seleccionado (HU-06).

---

### HU-08 · Gestión inteligente de la lista en tienda (por secciones)
**Prioridad:** Alta · **Puntos:** 5

> "Como cliente en la tienda física de Mercadona, quiero que mi lista de la compra esté organizada por secciones del supermercado (Lácteos, Carnes, Verduras…) y poder tachar los productos que meto en el carro, para hacer la compra de forma rápida y ordenada."

**Criterios de aceptación:**
- Los productos de la lista se agrupan por sección/categoría del supermercado.
- El usuario puede marcar/desmarcar cada producto como "cogido".
- Los productos marcados se mueven visualmente al final o se tachan.
- La lista persiste entre sesiones (guardada en el backend).
- El usuario puede eliminar productos individuales o vaciar toda la lista.

---

### HU-09 · Filtros de preferencias alimentarias
**Prioridad:** Media · **Puntos:** 3

> "Como usuario con restricciones dietéticas, quiero poder activar o desactivar filtros (vegano, sin gluten, sin lactosa…) en el catálogo, para ver solo recetas compatibles con mis hábitos en cualquier momento."

**Criterios de aceptación:**
- Filtros accesibles desde el catálogo sin necesidad de ir a ajustes.
- Los filtros activos se muestran visualmente destacados.
- El catálogo se actualiza instantáneamente al activar/desactivar un filtro.
- Los filtros respetan las preferencias del onboarding (HU-02) como estado inicial.

---

### HU-10 · Recetas favoritas
**Prioridad:** Media · **Puntos:** 2

> "Como usuario registrado, quiero guardar recetas como favoritas para acceder a ellas rápidamente sin tener que buscarlas de nuevo."

**Criterios de aceptación:**
- Icono de "favorito" (corazón) visible en la tarjeta y en la ficha de receta.
- Las recetas favoritas se guardan en el perfil del usuario (persistencia en BD).
- Existe una sección/vista de "Mis favoritas" accesible desde la navegación.

---

### HU-11 · Buscador de recetas (por nombre o ingrediente)
**Prioridad:** Baja · **Puntos:** 3

> "Como usuario, quiero buscar recetas escribiendo el nombre de un plato o de un ingrediente, para encontrar rápidamente lo que me apetece cocinar."

**Criterios de aceptación:**
- Campo de búsqueda disponible en el catálogo.
- La búsqueda filtra por nombre de receta y por ingredientes incluidos.
- Los resultados se muestran en tiempo real (o con debounce) mientras se escribe.
- Si no hay resultados, se muestra un mensaje informativo.

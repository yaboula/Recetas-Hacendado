# Roadmap de Ejecución — Recetas Hacendado

---

## 1. Objetivo del roadmap

Este roadmap traduce el `Plan_Maestro_v2.md` en una secuencia de ejecución clara, corta y accionable.

No busca añadir burocracia, sino responder a una pregunta simple:

**¿qué hacemos primero, qué hacemos después y qué debe quedar terminado en cada fase?**

---

## 2. Principios de ejecución

- priorizar siempre impacto real sobre volumen de tareas
- construir primero la base que evita retrabajo
- no tocar la UI final hasta validar la dirección visual
- implementar IA útil, no decorativa
- mantener cada fase orientada a entregables visibles
- evitar complejidad innecesaria

---

## 3. Orden maestro de ejecución

| Fase | Nombre | Objetivo principal | Estado |
|------|--------|--------------------|--------|
| 0 | Base técnica | Preparar frontend, backend e IA para crecer bien | En curso |
| 1 | Sistema visual y web premium | Convertir la web en un producto serio y comprable | Pendiente |
| 2 | IA integrada en producto | Añadir las capacidades IA prioritarias | Pendiente |
| 3 | App móvil nativa | Construir la versión móvil equilibrada y conectada | Pendiente |
| 4 | Robustez y despliegue | Preparar demo estable y arquitectura operativa | Pendiente |
| 5 | Presentación final | Empaquetar producto, narrativa y demo | Pendiente |

---

## 4. Fase 0 — Base técnica

### Objetivo

Dejar lista la infraestructura mínima para que el rediseño, la IA y la app móvil no se construyan sobre una base débil.

### Entregables clave

- TypeScript configurado en frontend
- TailwindCSS v4 integrado
- dependencias base del nuevo sistema UI preparadas
- alias y configuración técnica listos
- módulo IA en backend conectado
- endpoints iniciales IA disponibles
- cliente frontend para IA preparado

### Criterio de cierre

La base técnica deja de ser un bloqueo para el sistema visual, la IA y móvil.

---

## 5. Fase 1 — Sistema visual y web premium

### Objetivo

Elevar la aplicación web actual a nivel de producto premium, limpio, estructurado y comprable.

### Orden interno recomendado

#### 1. Sistema UI base

- configurar `shadcn/ui`
- crear primitives base (`Button`, `Input`, `Card`, `Badge`, `Sheet`, `Dialog`, `DropdownMenu`, `Tabs`, `Avatar`, `Skeleton`)
- definir tokens visuales estables
- sustituir base de iconografía por `lucide-react`

#### 2. Layout global

- header
- navegación secundaria
- contenedores
- espaciados
- jerarquía tipográfica
- estados vacíos y loaders

#### 3. Páginas críticas

- `CatalogoPage`
- `RecetaPage`
- `ListaPage`
- `LoginPage`
- `RegisterPage`
- `OnboardingPage`
- `FavoritasPage`

### Criterio de cierre

La web debe parecer claramente una app real de mercado, no una demo académica funcional.

---

## 6. Fase 2 — IA integrada en producto

### Objetivo

Convertir la IA en una capacidad central de producto con utilidad real para el usuario y valor de negocio para Mercadona.

### Prioridades absolutas

#### 1. ¿Qué cocino hoy?

- entrada por texto natural
- respuesta útil y estructurada
- conexión con recetas reales del catálogo

#### 2. Planificador semanal

- generación semanal coherente
- alineación con preferencias
- posibilidad de convertir plan en compra

#### 3. Escaneo de despensa por foto

- endpoint y flujo para imagen
- análisis con Gemini multimodal
- sugerencia de recetas relacionadas

### Criterio de cierre

La IA ya no es una promesa, sino una función demostrable y relevante en la experiencia del producto.

---

## 7. Fase 3 — App móvil nativa

### Objetivo

Construir una app móvil nativa equilibrada, premium y coherente con el producto web.

### Orden interno recomendado

#### 1. Base técnica móvil

- crear `mobile/`
- Expo + TypeScript
- Expo Router
- NativeWind
- estructura por features
- cliente API compartido conceptualmente con web

#### 2. Navegación y experiencia base

- bottom tabs
- autenticación
- catálogo
- detalle receta
- lista
- favoritas

#### 3. Capacidades nativas

- cámara
- haptics
- compartir
- notificaciones

### Criterio de cierre

La app móvil se siente como una extensión natural del producto y no como una adaptación improvisada.

---

## 8. Fase 4 — Robustez y despliegue

### Objetivo

Asegurar que el producto se pueda enseñar, probar y ejecutar con estabilidad.

### Líneas de trabajo

- tests básicos en backend
- hardening mínimo de seguridad
- logging más serio
- despliegue frontend
- despliegue backend
- base de datos estable para demo
- configuración de entornos

### Criterio de cierre

Existe una versión demo estable, accesible y fiable del producto.

---

## 9. Fase 5 — Presentación final

### Objetivo

Preparar una demo y un relato que hagan evidente el valor del producto para Mercadona.

### Entregables

- pitch principal
- narrativa del problema y solución
- demo guiada
- pruebas de flujo en vivo
- slides o soporte visual
- mensaje claro de impacto en ventas y experiencia cliente

### Criterio de cierre

La presentación deja la sensación de que el producto podría convertirse en una línea real para Mercadona.

---

## 10. Prioridades no negociables del roadmap

- no sacrificar claridad por cantidad de features
- no tocar la UI final sin validación visual previa
- no usar IA como adorno
- no recargar visualmente el producto
- no perder de vista el objetivo de negocio: convertir inspiración en compra y aumentar ventas

---

## 11. Qué está ya encaminado

### Ya avanzado

- base documental estratégica
- arquitectura v2 documentada
- transición de frontend a TypeScript iniciada
- TailwindCSS v4 integrado
- backend IA inicial implementado
- endpoints base de IA preparados
- cliente frontend para IA preparado

### Pendiente inmediato

- validación visual externa para empezar el refactor visual
- preparación real de `shadcn/ui`
- siguiente iteración del módulo IA
- base técnica de móvil

---

## 12. Próximo paso recomendado

El siguiente paso recomendado del roadmap es:

**completar la Fase 0 y abrir oficialmente la Fase 1 con la preparación del sistema UI, sin aplicar todavía el rediseño definitivo hasta tener validación visual.**

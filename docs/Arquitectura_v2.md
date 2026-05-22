# Arquitectura v2 — Recetas Hacendado

---

## 1. Objetivo del documento

Este documento define la arquitectura técnica objetivo de **Recetas Hacendado** en su versión v2.

Su propósito es establecer una base clara para la evolución del producto en cinco dimensiones:

- frontend web
- backend API
- capa de IA
- app móvil nativa
- despliegue y operación

Este documento complementa `Plan_Maestro_v2.md` y se centra exclusivamente en decisiones técnicas y estructurales.

---

## 2. Principios arquitectónicos

### 2.1 Arquitectura modular

El sistema debe evolucionar por módulos independientes y bien delimitados.

Módulos principales:

- autenticación
- usuarios y preferencias
- recetas
- lista de compra
- favoritos
- inteligencia artificial
- planificación semanal
- móvil

### 2.2 Separación clara por capas

Se mantendrá una separación explícita entre:

- presentación
- lógica de cliente
- API y controladores
- lógica de dominio
- acceso a datos
- proveedores externos

### 2.3 Preparada para escalar, pero sin sobreingeniería

La arquitectura debe ser profesional y extensible, pero sin introducir complejidad innecesaria para un equipo universitario.

### 2.4 IA integrada en producto, no aislada

La IA debe estar integrada como una capacidad del sistema, no como una demo separada.

### 2.5 Reutilización entre plataformas

Siempre que sea viable, la lógica de negocio, contratos de datos y consumo de API deberán compartirse entre web y móvil.

---

## 3. Arquitectura general del sistema

```text
[ Web App (React + Vite + TS) ]
               |
               | HTTP / JSON
               v
[ Backend API (Node.js + Express) ]
        |             |            \
        |             |             \
        v             v              v
[ PostgreSQL ]   [ Gemini API ]   [ Servicios futuros ]

[ Mobile App (React Native + Expo) ]
               |
               | HTTP / JSON
               v
[ Mismo Backend API ]
```

---

## 4. Frontend Web

### 4.1 Stack objetivo

- React
- Vite
- TypeScript
- TailwindCSS v4
- shadcn/ui
- Radix UI
- lucide-react
- framer-motion
- axios
- react-router-dom

### 4.2 Objetivo estructural

El frontend debe evolucionar desde una app funcional con estilos manuales hacia una interfaz basada en:

- componentes reutilizables
- tokens de diseño consistentes
- composición por secciones
- separación entre lógica y presentación

### 4.3 Estructura objetivo del frontend

```text
frontend/
  src/
    app/
    api/
    components/
      ui/
      layout/
      recipes/
      shopping/
      onboarding/
      ai/
    features/
      auth/
      catalog/
      recipe-detail/
      shopping-list/
      favorites/
      meal-planner/
      ai-assistant/
    hooks/
    lib/
    context/
    pages/
    styles/
    types/
```

### 4.4 Responsabilidades

- `api/`: acceso a backend
- `components/ui/`: primitives reutilizables
- `features/`: lógica y composición por dominio
- `pages/`: pantallas a nivel de ruta
- `lib/`: utilidades compartidas
- `types/`: contratos y tipos de datos

### 4.5 Decisiones importantes

- no habrá modo oscuro
- el diseño será premium, limpio y estructurado
- los estilos inline deberán desaparecer progresivamente
- la iconografía debe pasar de emojis estructurales a iconos profesionales
- las animaciones serán sobrias y con función UX real

---

## 5. Backend API

### 5.1 Stack objetivo

- Node.js
- Express
- PostgreSQL
- JWT
- Joi (estado actual)
- posible migración futura a Zod

### 5.2 Arquitectura actual y dirección

La base actual ya sigue una estructura modular válida:

```text
backend/
  src/
    app.js
    config/
    database/
      migrations/
      seeds/
    middleware/
    modules/
      auth/
      recetas/
      lista/
      favoritos/
      ai/
```

La evolución objetivo es mantener esta estructura, reforzando:

- validación
- separación entre controller y service
- reutilización de consultas
- manejo de errores más sólido
- observabilidad básica

### 5.3 Convención modular

Cada módulo debe tender a contener:

```text
module/
  *.routes.js
  *.controller.js
  *.service.js
  *.schemas.js
  *.repository.js   (si la complejidad crece)
```

### 5.4 Responsabilidades por capa

- `routes`: define endpoints
- `controller`: traduce request/response
- `service`: contiene lógica de negocio
- `schemas`: validación de entrada
- `repository`: acceso a base de datos, si se abstrae en el futuro

---

## 6. Base de datos

### 6.1 Motor

- PostgreSQL
- entorno actual: Supabase o compatible PostgreSQL gestionado

### 6.2 Entidades principales

- usuarios
- preferencias de usuario
- recetas
- tags dietéticos
- pasos de receta
- ingredientes de receta
- productos Hacendado
- lista de compra
- favoritos

### 6.3 Criterios de diseño

- relaciones normalizadas
- constraints explícitas
- índices para búsquedas frecuentes
- datos suficientes para cálculo de precio y composición de listas

### 6.4 Evoluciones futuras posibles

- tablas para planes semanales guardados
- tablas para historial de recomendaciones IA
- tablas para sesiones o conversaciones IA
- tablas para analítica de uso interno

---

## 7. Capa de IA

### 7.1 Proveedor principal

- Google Gemini 2.5 Flash

### 7.2 Motivos de elección

- free tier generoso
- buena calidad/coste
- soporte multimodal
- utilidad futura para visión en móvil

### 7.3 Principio de diseño

La IA no debe responder en vacío. Debe recibir contexto estructurado del sistema:

- catálogo disponible
- preferencias del usuario
- recetas existentes
- productos existentes
- restricciones del flujo

### 7.4 Casos de uso prioritarios

- asistente `¿Qué cocino hoy?`
- planificador semanal automático
- escaneo de despensa por imagen

### 7.5 Arquitectura del módulo IA

```text
backend/src/modules/ai/
  ai.routes.js
  ai.controller.js
  ai.service.js
  ai.schemas.js
```

### 7.6 Reglas de implementación

- respuestas estructuradas en JSON
- validación de entrada estricta
- prompts con contexto controlado
- evitar alucinaciones de recetas o productos inexistentes
- conectar la IA al catálogo real siempre que sea posible

### 7.7 Evoluciones futuras

- capa de abstracción multi-modelo
- fallback a Groq u OpenRouter
- trazabilidad de prompts y respuestas
- moderación y límites por usuario

---

## 8. App móvil nativa

### 8.1 Stack objetivo

- React Native
- Expo
- TypeScript
- Expo Router
- NativeWind
- React Query
- React Native Reanimated
- React Native Gesture Handler
- expo-image
- expo-camera
- expo-notifications
- expo-haptics
- expo-sharing

### 8.2 Principio de producto

La app móvil no debe ser una simple copia de la web. Debe aportar valor nativo.

### 8.3 Capacidades nativas prioritarias

- navegación móvil fluida
- bottom tabs nativas
- haptics
- cámara para escaneo de despensa
- push notifications
- compartir recetas o listas
- experiencia optimizada para uso en tienda

### 8.4 Arquitectura objetivo

```text
mobile/
  app/
  src/
    api/
    components/
    features/
    hooks/
    lib/
    types/
    constants/
```

### 8.5 Integración

- mismo backend que la web
- contratos de datos alineados
- misma lógica de autenticación JWT
- reutilización conceptual del design system

---

## 9. Contratos API

### 9.1 Principio

Todos los contratos entre cliente y backend deben ser estables, predecibles y fáciles de reutilizar entre web y móvil.

### 9.2 Convención

- JSON consistente
- errores con `error` y `code`
- respuestas orientadas a frontend
- validación previa en backend

### 9.3 Endpoints principales actuales o previstos

- `/api/v1/auth/*`
- `/api/v1/recetas/*`
- `/api/v1/lista/*`
- `/api/v1/favoritos/*`
- `/api/v1/ai/meal-assistant`
- `/api/v1/ai/weekly-plan`
- futuro: `/api/v1/ai/pantry-scan`

---

## 10. Seguridad y robustez

### 10.1 Mínimos necesarios

- JWT para autenticación
- validación de entrada en todos los endpoints
- control de errores consistente
- variables sensibles en `.env`

### 10.2 Mejoras previstas

- rate limiting
- helmet
- logging estructurado
- auditoría básica de errores
- protección frente a abuso de endpoints IA

---

## 11. Testing

### 11.1 Objetivo

Subir el nivel de confianza del producto antes de demo y despliegue.

### 11.2 Estrategia sugerida

- tests de backend con Vitest o Jest + Supertest
- tests de servicios críticos
- tests de endpoints IA con respuestas controladas o mocks
- tests E2E mínimos para flujos clave

### 11.3 Flujos prioritarios a cubrir

- registro y login
- onboarding de preferencias
- catálogo y búsqueda
- detalle de receta
- cálculo de precio
- añadir a lista
- favoritos
- endpoints IA principales

---

## 12. Despliegue

### 12.1 Arquitectura objetivo de despliegue

- frontend web: Vercel
- backend API: Railway o Render
- base de datos: Supabase o Neon
- móvil: Expo / builds distribuidas según fase del proyecto

### 12.2 Requisitos mínimos

- variables de entorno separadas por entorno
- despliegue funcional de backend y frontend
- acceso estable para demo
- base de datos remota con datos de prueba consistentes

### 12.3 Evoluciones futuras

- CI/CD con GitHub Actions
- preview deploys
- checks automáticos de lint y tests

---

## 13. Observabilidad y operación

### 13.1 Nivel actual esperado

Ligero y suficiente para un entorno académico-profesional.

### 13.2 Capacidades objetivo

- logs legibles
- trazabilidad de errores
- control de disponibilidad básica
- healthcheck funcional
- visibilidad de fallos en IA y backend

---

## 14. Deuda técnica actual identificada

### Frontend

- exceso de estilos inline
- falta de sistema de componentes moderno
- escasa separación entre presentación y lógica visual
- responsive todavía básico

### Backend

- falta de tests
- falta de logging estructurado
- falta de rate limiting y hardening de seguridad
- módulo IA aún en fase inicial

### Producto general

- falta de app móvil nativa
- falta de despliegue final estable
- falta de integración visual completa de la IA

---

## 15. Decisiones técnicas ya tomadas

- frontend en transición a TypeScript
- TailwindCSS v4 como base del nuevo sistema visual
- Gemini 2.5 Flash como proveedor principal de IA
- backend Node.js + Express + PostgreSQL se mantiene
- web y móvil compartirán backend
- la arquitectura detallada se mantendrá modular y progresiva
- no se priorizará una sobreingeniería innecesaria

---

## 16. Criterio de buena arquitectura para este proyecto

Consideraremos que la arquitectura v2 está bien encaminada cuando se cumpla lo siguiente:

- frontend modular y sin dependencia fuerte de estilos inline
- backend coherente por módulos
- contratos API claros y reutilizables
- IA integrada en flujos reales del producto
- base técnica preparada para web y móvil
- despliegue funcional y demostrable
- complejidad razonable para el equipo

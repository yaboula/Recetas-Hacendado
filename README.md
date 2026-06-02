<h1 align="center">Recetas Hacendado</h1>

<p align="center">
  <strong>A full-stack recipe app built around Mercadona's Hacendado brand, with AI-powered meal planning, voice-controlled cooking, and a smart shopping list.</strong>
</p>

<p align="center">
  <a href="#features"><img src="https://img.shields.io/badge/Features-15+-4CAF50?style=flat-square" alt="Features" /></a>
  <a href="#tech-stack"><img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" alt="React 19" /></a>
  <a href="#tech-stack"><img src="https://img.shields.io/badge/Node.js-Express_5-339933?style=flat-square&logo=node.js" alt="Node.js" /></a>
  <a href="#tech-stack"><img src="https://img.shields.io/badge/PostgreSQL-Supabase-4169E1?style=flat-square&logo=postgresql" alt="PostgreSQL" /></a>
  <a href="#tech-stack"><img src="https://img.shields.io/badge/AI-Groq_Llama_3-FF4F00?style=flat-square" alt="Groq AI" /></a>
  <a href="#tech-stack"><img src="https://img.shields.io/badge/Tailwind_CSS-4.0-06B6D4?style=flat-square&logo=tailwindcss" alt="Tailwind" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" alt="License" /></a>
</p>

<p align="center">
  Selected as <strong>Top 3 out of 12 teams</strong> in our university's Project Management course (GII).
</p>

---

## What is this project?

This is a recipe web app designed specifically for **Mercadona** (Spain's largest supermarket chain). The idea is simple: you pick a recipe, and the app tells you exactly which **Hacendado** products you need to buy, how many packages, and how much it's going to cost you. Everything maps to real products you can find at the store.

But it goes beyond just listing ingredients. The app includes a full hands-free cooking mode with voice narration and commands, an AI assistant that suggests recipes based on what you have in your fridge, a weekly meal planner powered by Groq's Llama 3 model, and a smart shopping list that consolidates ingredients across multiple recipes and groups them by supermarket aisle.

This was built as a team project (CyberPandas) using Scrum methodology across 4 sprints, but I was responsible for the majority of the development on both frontend and backend.

---

## Features

### Hands-Free Cooking Mode

This is probably the most interesting feature. When you open a recipe and tap "Open Cooking Mode", the app enters a fullscreen overlay that guides you step by step through the cooking process. The whole point is that you shouldn't need to touch your phone while cooking.

- **Text-to-Speech narration**: Each step is read aloud using the browser's native `SpeechSynthesis` API. The app tries to pick the best available Spanish voice on the device, prioritizing natural/premium voices over the robotic default ones (it looks for Google, Microsoft Natural, or Sabina voices).
- **Voice commands**: You can say "siguiente" (next), "repite" (repeat), "anterior" (back), "inicia el temporizador" (start timer), or "pausa" to control the cooking flow without touching the screen. This uses the `SpeechRecognition` API in continuous mode.
- **Smart timers**: The app parses each step's text looking for time references (e.g. "cook for 16-18 minutes", "let it rest for 1 hour"). When it detects one, it pre-loads a countdown timer that you can start with a tap or voice command. When the timer finishes, it plays a chime sound (generated with the Web Audio API oscillator), triggers vibration feedback (`navigator.vibrate`), and announces "Tiempo cumplido" through TTS.
- **Wake Lock**: The screen stays on while you're cooking using the Screen Wake Lock API, with automatic re-acquisition when the tab becomes visible again.
- **Progress persistence**: If you close the cooking mode or navigate away, it remembers which step you were on (saved in `localStorage`) so you can resume later.
- **Swipe navigation**: You can swipe left/right on mobile to move between steps.
- **AI-enhanced steps**: The cooking mode first tries to fetch an AI-optimized version of the steps from the backend (via `getCookingMode`), with better narration text. If the AI call fails, it falls back to the recipe's original steps.

### AI Assistant ("What Should I Cook Today?")

A bottom sheet component (`QueCocinoHoySheet`) that lets you chat with the Groq Llama 3 70B model to get recipe suggestions. The backend proxies the requests through the Groq SDK.

- Ask for recipes based on mood, available time, number of diners, or specific ingredients
- Voice input support using `SpeechRecognition` so you can dictate instead of typing
- The assistant returns suggestions from the actual recipe catalog, not generic answers

### Pantry Scanner

A separate AI sheet (`EscanearDespensaSheet`) where you describe what ingredients you already have at home. The AI analyzes your input and suggests zero-waste recipes that use those ingredients, minimizing what you need to buy.

### AI Weekly Meal Planner

A full planner page (`PlanificadorPage`) where you can generate a complete weekly meal plan using AI:

- Choose how many days (3 to 7)
- Select dietary preferences (vegan, gluten-free, lactose-free, etc.)
- Either write a custom goal or pick from quick templates ("fast dinners", "budget-friendly", "balanced", "family-sized", "light dinners", "use what I have")
- Voice input for the goal description
- The AI generates a plan with one recipe per day, including: the recipe name, a link to its detail page, cooking time, dietary tags, and a "reason for choosing" explanation
- A summary card with total cooking time and overall stats
- Shopping advice specific to the plan
- "Add all to shopping list" button that adds every recipe from the plan in one click

### Smart Shopping List

Not a simple to-do list. It's actually doing math behind the scenes.

- **Ingredient consolidation**: When you add multiple recipes that use the same ingredient (say olive oil), instead of listing it twice, the list sums the exact quantities needed across all recipes. So `250ml + 100ml = 350ml`.
- **Package calculation**: The system knows the actual package sizes of Hacendado products. If you need 350ml of olive oil and the bottle is 500ml, it tells you to buy 1 bottle. You can manually adjust the number of packages.
- **Aisle grouping**: Products are automatically sorted by supermarket section (Carnicería, Verdulería, Lácteos, Panadería, etc.) so your shopping trip follows a logical path through the store.
- **"Already have it" section (Despensa)**: If you set a product's package count to 0, it moves to a "Ya lo tengo" section. These items don't count toward your total price but stay listed so you know they're needed for your recipes.
- **Product swapping**: For any item in the list, you can open a side sheet that shows alternative products (different sizes, brands, or variants) and swap them. The system recalculates package counts automatically.
- **Manual product search**: There's a search modal where you can search the entire Mercadona product catalog and add loose products to your list (things like milk, eggs, detergent) that aren't part of any recipe. It includes suggestion chips for common items.
- **Real-time price estimation**: Shows the estimated total cost based on unit prices and number of full packages.
- **Share list**: You can share your shopping list as formatted text (uses `navigator.share` on mobile or clipboard fallback) with all sections and quantities.
- **Savings tracker**: Shows how much you're saving by already having some items at home.

### Recipe Catalog and Detail Pages

- **Recipe cards** with image, title, time, difficulty, and dietary tags
- **Search and filtering** across the entire catalog
- **Detail page** with editorial layout:
  - Recipe image, description, rating, and author
  - Dietary chips (Vegan, Gluten-Free, Lactose-Free, Egg-Free) with distinct visual styling
  - Metadata bar: cooking time, base servings, difficulty, calories, and price
  - **Dynamic portion scaling**: Change the number of servings with a stepper, and all ingredient quantities recalculate proportionally in real time
  - **Grouped ingredients**: Ingredients are organized logically (e.g., "For the sauce", "For the dough") instead of a flat list. Each ingredient shows its Hacendado product thumbnail, brand, and price.
  - **Step-by-step instructions** with numbered steps
  - **Tips and tricks** section with cooking advice
  - **FAQ section** with common questions and answers about the recipe
  - **User reviews** with star ratings and comments
  - **Related recipes** suggestions at the bottom
  - **Sticky action bar** that appears when you scroll past the header, showing the recipe name, current servings, price, and quick buttons for cooking mode and adding to list
  - **Country flags** for international recipes (using flag CDN URLs)

### Authentication and User Profile

- JWT-based authentication with bcrypt password hashing
- Registration with email + password
- Onboarding flow where new users select their dietary preferences
- **Profile page** with:
  - Activity summary dashboard: number of favorites, products in shopping list, pending items, total lists created
  - Shopping progress bar (percentage of items purchased)
  - Dietary preference management (toggle chips for each diet type)
  - Personal data editing (name, email)
  - Password change form with validation
  - Logout

### Favorites System

- Toggle favorite on any recipe from the detail page (heart icon)
- Dedicated favorites page listing all saved recipes
- Stored per-user in PostgreSQL

---

## Architecture

```mermaid
graph TB
    subgraph Client ["Frontend — React 19 SPA"]
        UI["UI Layer<br/>Tailwind CSS v4 + Framer Motion"]
        PAGES["Pages<br/>Home · Catalog · Recipe Detail<br/>Shopping List · Planner · Profile"]
        CTX["Context API<br/>Auth state + JWT token management"]
        HOOKS["Custom Hooks<br/>useAuth · useRecipes · useLista"]
        API_CLIENT["API Service Layer<br/>Axios with auth interceptors"]
        BROWSER["Native Browser APIs<br/>SpeechSynthesis · SpeechRecognition<br/>Wake Lock · Vibration · Web Audio"]
    end

    subgraph Server ["Backend — Node.js + Express 5"]
        ROUTES["REST API<br/>/api/v1/auth · /recetas · /lista<br/>/favoritos · /ai"]
        MW["Middleware Stack<br/>JWT verification · CORS · Joi validation<br/>Error handler"]
        MODULES["Business Logic<br/>Auth · Recipes · Shopping List<br/>Favorites · AI"]
        GROQ["Groq SDK<br/>Llama 3 70B · Llama 4 Scout (vision)"]
    end

    subgraph Data ["Data Layer"]
        PG["PostgreSQL on Supabase<br/>Users · Recipes · Ingredients<br/>Shopping Lists · Favorites"]
    end

    UI --> PAGES
    PAGES --> CTX
    PAGES --> HOOKS
    PAGES --> BROWSER
    HOOKS --> API_CLIENT
    CTX --> API_CLIENT
    API_CLIENT -->|HTTPS| ROUTES
    ROUTES --> MW
    MW --> MODULES
    MODULES --> PG
    MODULES --> GROQ

    style Client fill:#1a1a2e,stroke:#61DAFB,color:#fff
    style Server fill:#1a1a2e,stroke:#339933,color:#fff
    style Data fill:#1a1a2e,stroke:#4169E1,color:#fff
```

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Frontend** | React 19 + Vite 8 | Latest React with fast HMR |
| **Styling** | Tailwind CSS v4 | Replicated Mercadona's design system with custom tokens |
| **Animations** | Framer Motion | Page transitions and micro-interactions |
| **Icons** | Lucide React | Tree-shakeable icon set |
| **Routing** | React Router DOM v7 | Declarative routing with nested layouts |
| **UI Primitives** | Radix UI (Dialog, Select) | Accessible, unstyled base components |
| **Toasts** | Sonner | Lightweight toast notifications |
| **Backend** | Node.js + Express 5 | Native async error handling |
| **Auth** | JWT + bcryptjs | Stateless token-based sessions |
| **Database** | PostgreSQL (Supabase) | Managed relational DB with connection pooling |
| **AI** | Groq SDK (Llama 3 70B) | Fast inference for chat, meal planning, and cooking mode |
| **Validation** | Joi | Request schema validation |
| **Scraping** | Cheerio + Axios | Used during development to build the product catalog |
| **Browser APIs** | Web Speech, Wake Lock, Vibration, Web Audio | Voice I/O, screen lock, haptic feedback, timer chimes |

---

## Project Structure

```
Scrum-Mercadona-CyberPandas/
├── frontend/
│   ├── src/
│   │   ├── api/               # Axios service layer (auth, recetas, lista, favoritos, ai)
│   │   ├── components/
│   │   │   ├── ai/            # QueCocinoHoySheet, EscanearDespensaSheet
│   │   │   ├── common/        # RecipeCard, Stepper, EmptyState
│   │   │   ├── layout/        # AppShell with bottom navigation
│   │   │   └── ui/            # Button, Sheet, Dialog, Spinner
│   │   ├── context/           # AuthContext (JWT management)
│   │   ├── hooks/             # Custom hooks
│   │   ├── lib/               # Utilities, recipe adapters, speech helpers
│   │   ├── pages/
│   │   │   ├── HomePage.jsx          # Hero + featured recipes
│   │   │   ├── CatalogoPage.jsx      # Full recipe catalog with filters
│   │   │   ├── RecetaPage.jsx        # Recipe detail + cooking mode (1120 lines)
│   │   │   ├── ListaPage.jsx         # Smart shopping list (658 lines)
│   │   │   ├── PlanificadorPage.jsx  # AI weekly meal planner (552 lines)
│   │   │   ├── ProfilePage.jsx       # User profile + stats dashboard
│   │   │   ├── FavoritasPage.jsx     # Saved recipes
│   │   │   ├── LoginPage.jsx         # Login form
│   │   │   ├── RegisterPage.jsx      # Registration form
│   │   │   └── OnboardingPage.jsx    # Dietary preference setup
│   │   └── styles/
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── config/            # Database pool
│   │   ├── database/          # Migrations + seeds
│   │   ├── middleware/        # JWT auth, error handler, CORS
│   │   ├── modules/
│   │   │   ├── auth/          # Register, login, profile, password change
│   │   │   ├── recetas/       # CRUD, search, price calculation, cooking mode
│   │   │   ├── lista/         # Shopping list engine, consolidation, alternatives
│   │   │   ├── favoritos/     # Favorites toggle + list
│   │   │   └── ai/            # Groq chat, meal planner, pantry scanner
│   │   └── scripts/           # Scraping and data import
│   └── package.json
│
├── docs/                      # Scrum artifacts and architecture docs
├── scripts/                   # Dev utility scripts
└── img/                       # Visual assets
```

---

## Getting Started

### What you need

- Node.js 18 or higher
- A PostgreSQL database (you can use a free [Supabase](https://supabase.com) project)
- A Groq API key (free at [console.groq.com](https://console.groq.com))

### 1. Clone the repo

```bash
git clone https://github.com/yaboula/Recetas-Hacendado.git
cd Recetas-Hacendado
```

### 2. Backend setup

```bash
cd backend
npm install

# Create your .env file from the template
cp .env.example .env
# Fill in DATABASE_URL, JWT_SECRET, GROQ_API_KEY

# Run migrations and seed data
npm run setup-db

# Start the dev server
npm run dev
# API runs on http://localhost:3001
```

### 3. Frontend setup

```bash
cd frontend
npm install

cp .env.example .env
# Default VITE_API_URL is http://localhost:3001/api/v1

npm run dev
# App runs on http://localhost:5173
```

### Environment Variables

<details>
<summary><strong>Backend .env</strong></summary>

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET` | Secret for JWT signing (min 32 chars) | `your_secret_key_here` |
| `JWT_EXPIRES_IN` | Token expiration | `7d` |
| `PORT` | Server port | `3001` |
| `GROQ_API_KEY` | Groq Cloud API key | `gsk_...` |
| `GROQ_TEXT_MODEL` | Model for text generation | `llama-3.3-70b-versatile` |
| `GROQ_VISION_MODEL` | Model for vision tasks | `meta-llama/llama-4-scout-17b-16e-instruct` |

</details>

<details>
<summary><strong>Frontend .env</strong></summary>

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:3001/api/v1` |

</details>

---

## How it was built

The project was developed using Scrum across 4 sprints:

| Sprint | Duration | What we built |
|--------|----------|---------------|
| 1 | 2 weeks | Auth system (JWT + bcrypt), database schema, project scaffolding, login/register pages |
| 2 | 2 weeks | Recipe catalog, detail page with portion scaling, recipe cards, home page |
| 3 | 2 weeks | Shopping list with ingredient consolidation, aisle grouping, pricing, favorites |
| 4 | 2 weeks | AI assistant (Groq), hands-free cooking mode, meal planner, voice controls, product swapping |

All the Scrum documentation (Product Backlog, Sprint Plans, Architecture Decisions, UI Design System) is in the [`/docs`](./docs) folder.

---

## Some technical decisions

| What | Why |
|------|-----|
| Express 5 instead of Koa or Fastify | Built-in async error handling, no need for wrapper functions |
| Groq instead of OpenAI | Way faster inference and cheaper. Llama 3 70B quality is more than enough for recipe suggestions |
| Supabase instead of self-hosted PostgreSQL | Free tier, managed backups, built-in connection pooling |
| Tailwind v4 instead of CSS Modules | Fast prototyping, and we needed to replicate Mercadona's exact color palette with design tokens |
| Web Speech API instead of a third-party service | Zero dependencies for voice features, works offline for TTS |
| React Context instead of Redux | The app's global state is just auth + cart. Context is simpler and sufficient |
| Radix UI for dialogs and sheets | Accessibility out of the box (focus trapping, keyboard nav, ARIA) |

---

## Author

**Yahya Aboulafiya** — Full Stack Developer

[![GitHub](https://img.shields.io/badge/GitHub-yaboula-181717?style=flat-square&logo=github)](https://github.com/yaboula)

---

## License

[MIT](LICENSE)

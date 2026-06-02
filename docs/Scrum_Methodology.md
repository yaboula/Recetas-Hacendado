# Scrum Methodology & Agile Execution

**Project:** Recetas Hacendado  
**Team:** CyberPandas (University Project Management Course GII)  
**Duration:** 10 weeks (4 Development Sprints)  
**Velocity:** ~12 Story Points per sprint  

> This document outlines how the Recetas Hacendado project was executed using the Scrum framework. We treated this university project as a professional software product, strictly adhering to Agile principles: working software at the end of every sprint, no "half-finished" MVPs, and iterative value delivery.

---

## 1. Global Vision & Roadmap

The product was broken down into 47 Story Points of development effort, organized into 4 logical blocks (Epics) to ensure a stable progression from infrastructure to advanced AI features.

```text
SPRINT 0  ──  Definition, UI Design & Repository Setup       [COMPLETED]
SPRINT 1  ──  Infrastructure, Auth & Onboarding              (11 pts)
SPRINT 2  ──  Recipe Catalog, Details & Dietary Filters      (13 pts)
SPRINT 3  ──  Pricing, Serving Logic & Shopping List Engine  (14 pts)
SPRINT 4  ──  In-Store UI, Favorites & AI Integrations       (10 pts)
              ──────────────────────────────────────────────────────────
              FULL PRODUCT DELIVERY — 47 pts                 4 Sprints
```

---

## 2. Team Roles & Ceremonies

Despite being a student team, we maintained strict Scrum roles and ceremonies to simulate a real-world tech environment.

### Roles
- **Product Owner:** Validated Acceptance Criteria (AC) at the end of each sprint. Re-prioritized the backlog when technical debt or external API issues (like Groq SDK limits) arose.
- **Scrum Master:** Facilitated the Daily Standups, removed technical impediments (e.g., PostgreSQL connection pool limits), and tracked sprint velocity.
- **Development Team:** Broke down User Stories into technical tasks during Sprint Planning, executed code, and submitted Pull Requests for peer review.

### Ceremonies
- **Sprint Planning (2 hours):** Every other Monday. Defined the Sprint Goal and selected User Stories from the top of the Product Backlog.
- **Daily Standup (15 mins):** Sync on progress, identify blockers.
- **Sprint Review (1 hour):** End of the sprint. Live demo of the working software deployed to Vercel/Railway.
- **Sprint Retrospective (30 mins):** Discussion on team dynamics, Git workflow improvements, and technical debt.

---

## 3. Sprint Execution Details

### SPRINT 1: Infrastructure, Authentication & Onboarding
**Goal:** Establish a robust foundation. Deploy the database, API, and UI shell. Ensure a user can securely register, set their dietary preferences, and maintain a JWT session.
- **Key Tasks:** 
  - PostgreSQL schema design and migration setup.
  - JWT Auth middleware in Express.
  - React Router setup with protected routes.
  - Onboarding flow UI mapping to the DB.
- **Definition of Done (DoD):** CI/CD pipeline active. App deployed on Vercel. PRs reviewed and merged to `main`.

### SPRINT 2: Visual Catalog, Recipe Details & Filters
**Goal:** Deliver the core visual experience. Users can browse recipes, filter them in real-time by dietary needs (Vegan, Gluten-Free), and view detailed steps and ingredients.
- **Key Tasks:** 
  - Seed the database with real Hacendado products and recipes.
  - Build the dynamic React `RecipeCard` and `RecipeFilters`.
  - Implement real-time frontend filtering interacting with the backend API.
- **Definition of Done (DoD):** UI strictly matches the Mercadona Design System replica. Data loaded dynamically from the PostgreSQL database.

### SPRINT 3: Pricing, Servings & Shopping List Engine
**Goal:** Transform the app from a visual catalog into a smart utility. Implement the complex logic required to dynamically scale ingredients and consolidate them into a unified shopping list without duplicates.
- **Key Tasks:** 
  - Fractional math logic for portion scaling.
  - Proportional price estimation algorithms in the backend.
  - **Smart Consolidation Engine:** Using PostgreSQL `ON CONFLICT DO UPDATE` to aggregate matching ingredients across multiple recipes.
- **Definition of Done (DoD):** 100% pass rate on Unit Tests for the consolidation engine. No duplicate items allowed in the cart.

### SPRINT 4: In-Store UX, Favorites & AI
**Goal:** Final polish and advanced features. Optimize the shopping list for actual physical store usage, add user favorites, and integrate the Groq AI Llama 3 models for meal planning.
- **Key Tasks:**
  - Group shopping list items by supermarket aisle (Produce, Dairy, etc.).
  - Checkbox UI with "strikethrough" styling for in-store usage.
  - Groq SDK integration for the AI "What Should I Cook" Assistant and Weekly Meal Planner.
  - Hands-Free Cooking Mode utilizing the native Web Speech API.
- **Definition of Done (DoD):** All 11 original User Stories verified. End-to-End flows tested. Final project presentation and delivery prepared.

---

## 4. Risk Management & Mitigation

| Risk | Probability | Impact | Mitigation Strategy |
|------|-------------|---------|---------------------|
| **Sprint 3 Overload** (Complex consolidation logic) | High | High | Shifted the DB schema design for the Shopping List into Sprint 2 to give backend developers a head start. |
| **Git Merge Conflicts** | Medium | Medium | Enforced a strict branching model (`feat/xxx`). All merges required a Pull Request and peer review. No direct pushes to `main`. |
| **Vercel/Railway Deployment Failures** | Low | High | Setup CI/CD pipeline in Sprint 1. We did not wait until the final week to deploy to production. |
| **Technical Debt Accumulation** | Medium | Medium | Reserved 20% of the Story Points capacity in each sprint to refactor code and address bugs from previous sprints. |

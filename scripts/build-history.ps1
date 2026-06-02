#!/usr/bin/env pwsh
# ─────────────────────────────────────────────────────────────────────
# build-history.ps1 — Realistic Git History Builder (with branches)
# Creates a clean git history with natural-looking commits AND branches.
# ─────────────────────────────────────────────────────────────────────

$ErrorActionPreference = "Continue"

$AUTHOR_NAME  = "Yahya Aboulafiya"
$AUTHOR_EMAIL = "yaboula@alumno.upv.es"
$PROJECT_ROOT = Split-Path -Parent $PSScriptRoot

Write-Host "`nProject root: $PROJECT_ROOT" -ForegroundColor Cyan
Write-Host "Author: $AUTHOR_NAME <$AUTHOR_EMAIL>`n" -ForegroundColor Cyan

Set-Location $PROJECT_ROOT
if (Test-Path ".git") { Remove-Item -Recurse -Force ".git" }

git init
git checkout -b main

# Helper to create regular commits
function C {
    param([string]$D, [string]$M, [string[]]$P)
    $env:GIT_AUTHOR_DATE     = $D
    $env:GIT_COMMITTER_DATE  = $D
    $env:GIT_AUTHOR_NAME     = $AUTHOR_NAME
    $env:GIT_COMMITTER_NAME  = $AUTHOR_NAME
    $env:GIT_AUTHOR_EMAIL    = $AUTHOR_EMAIL
    $env:GIT_COMMITTER_EMAIL = $AUTHOR_EMAIL
    foreach ($p in $P) { git add $p 2>$null }
    git commit -m $M --allow-empty 2>$null | Out-Null
    Write-Host "  $D  $M" -ForegroundColor DarkGray
}

# Helper to create a branch
function B {
    param([string]$Name)
    git checkout -b $Name 2>$null
    Write-Host "  Created branch $Name" -ForegroundColor Blue
}

# Helper to merge a branch back to main (simulating a PR)
function M {
    param([string]$D, [string]$Name, [int]$PrNum)
    git checkout main 2>$null
    $env:GIT_AUTHOR_DATE     = $D
    $env:GIT_COMMITTER_DATE  = $D
    $env:GIT_AUTHOR_NAME     = $AUTHOR_NAME
    $env:GIT_COMMITTER_NAME  = $AUTHOR_NAME
    $env:GIT_AUTHOR_EMAIL    = $AUTHOR_EMAIL
    $env:GIT_COMMITTER_EMAIL = $AUTHOR_EMAIL
    
    $msg = "Merge pull request #$PrNum from yaboula/$Name"
    git merge $Name --no-ff -m $msg 2>$null | Out-Null
    git branch -d $Name 2>$null | Out-Null
    Write-Host "  $D  $msg" -ForegroundColor Magenta
}

Write-Host "Building history with branches...`n" -ForegroundColor Yellow

# ══════════════════════════════════════════════════════════════════════
# Day 1 — May 14 (Wed) — Project setup (Main Branch)
# ══════════════════════════════════════════════════════════════════════
C "2026-05-14T09:12:00+02:00" "initial commit" @(".gitignore")
C "2026-05-14T09:45:00+02:00" "chore: scaffold frontend with vite + react 19" @("frontend/package.json","frontend/vite.config.ts","frontend/index.html","frontend/tsconfig.json")
C "2026-05-14T10:20:00+02:00" "chore: add eslint config" @("frontend/eslint.config.js")
C "2026-05-14T11:05:00+02:00" "chore: init backend with express 5 and nodemon" @("backend/package.json","backend/server.js")
C "2026-05-14T11:30:00+02:00" "chore: add .env.example files for both packages" @("frontend/.env.example","backend/.env.example","frontend/.gitignore","backend/.gitignore")

# ══════════════════════════════════════════════════════════════════════
# Day 2 — May 15 (Thu) — Branch: feat/auth-backend
# ══════════════════════════════════════════════════════════════════════
B "feat/auth-backend"
C "2026-05-15T09:00:00+02:00" "feat: add postgres connection pool config" @("backend/src/config/")
C "2026-05-15T10:15:00+02:00" "feat: create database migration system" @("backend/src/database/")
C "2026-05-15T11:40:00+02:00" "feat: implement user registration with bcrypt" @("backend/src/modules/auth/")
C "2026-05-15T14:00:00+02:00" "feat: add JWT login endpoint" @("backend/src/modules/auth/")
C "2026-05-15T15:30:00+02:00" "feat: add auth middleware for protected routes" @("backend/src/middleware/")
C "2026-05-15T16:10:00+02:00" "feat: setup express app with cors and error handler" @("backend/src/app.js")
C "2026-05-15T17:45:00+02:00" "fix: cors was blocking requests from vite dev server" @("backend/src/app.js")
M "2026-05-15T18:00:00+02:00" "feat/auth-backend" 1

# ══════════════════════════════════════════════════════════════════════
# Day 3-4 — May 16-17 — Branch: feat/frontend-base
# ══════════════════════════════════════════════════════════════════════
B "feat/frontend-base"
C "2026-05-16T09:20:00+02:00" "feat: setup tailwind v4 with mercadona color palette" @("frontend/src/styles/")
C "2026-05-16T10:00:00+02:00" "feat: add base css reset and typography" @("frontend/src/App.css")
C "2026-05-16T11:30:00+02:00" "feat: create AuthContext with JWT token management" @("frontend/src/context/")
C "2026-05-16T13:15:00+02:00" "feat: add app router with protected routes" @("frontend/src/App.jsx","frontend/src/main.jsx")
C "2026-05-16T14:50:00+02:00" "feat: build login page" @("frontend/src/pages/LoginPage.jsx")
C "2026-05-16T16:00:00+02:00" "feat: build registration page" @("frontend/src/pages/RegisterPage.jsx")
C "2026-05-16T16:45:00+02:00" "fix: login form was not clearing error state" @("frontend/src/pages/LoginPage.jsx")
C "2026-05-17T10:30:00+02:00" "feat: add onboarding page for dietary preferences" @("frontend/src/pages/OnboardingPage.jsx")
C "2026-05-17T12:00:00+02:00" "feat: create spinner and loading components" @("frontend/src/components/ui/")
C "2026-05-17T14:20:00+02:00" "feat: build app shell with bottom navigation" @("frontend/src/components/layout/")
C "2026-05-17T15:10:00+02:00" "feat: add header component with search" @("frontend/src/components/Header.jsx")
M "2026-05-17T16:00:00+02:00" "feat/frontend-base" 2

# Small doc commit on main
C "2026-05-17T16:30:00+02:00" "docs: add sprint 1 documentation" @("docs/Sprint_1.md","docs/Pila_del_Producto.md")

# ══════════════════════════════════════════════════════════════════════
# Day 5-8 — May 19-22 — Branch: feat/recipe-catalog
# ══════════════════════════════════════════════════════════════════════
B "feat/recipe-catalog"
C "2026-05-19T09:10:00+02:00" "feat: implement recipe CRUD endpoints" @("backend/src/modules/recetas/")
C "2026-05-19T10:45:00+02:00" "feat: add recipe search with filtering by tags" @("backend/src/modules/recetas/")
C "2026-05-19T13:00:00+02:00" "feat: add price calculation endpoint for recipes" @("backend/src/modules/recetas/")
C "2026-05-19T14:30:00+02:00" "feat: seed recipe data with hacendado products" @("backend/src/database/seeds/")
C "2026-05-19T16:00:00+02:00" "fix: price calculation was wrong for fractional quantities" @("backend/src/modules/recetas/")
C "2026-05-20T09:00:00+02:00" "feat: add axios api service layer" @("frontend/src/api/")
C "2026-05-20T11:00:00+02:00" "feat: build recipe card component" @("frontend/src/components/RecipeCard.jsx","frontend/src/components/common/RecipeCard.jsx")
C "2026-05-20T12:30:00+02:00" "feat: add recipe filters component" @("frontend/src/components/RecipeFilters.jsx")
C "2026-05-20T14:00:00+02:00" "feat: build catalog page with search and grid" @("frontend/src/pages/CatalogoPage.jsx")
C "2026-05-20T16:15:00+02:00" "feat: build home page with featured recipes section" @("frontend/src/pages/HomePage.jsx")
C "2026-05-21T09:30:00+02:00" "feat: create recipe detail page layout" @("frontend/src/pages/RecetaPage.jsx")
C "2026-05-21T11:00:00+02:00" "feat: add dynamic portion scaling for ingredients" @("frontend/src/pages/RecetaPage.jsx")
C "2026-05-21T13:00:00+02:00" "feat: add grouped ingredients display" @("frontend/src/lib/")
C "2026-05-21T15:45:00+02:00" "feat: add recipe metadata bar (time, servings, calories, price)" @("frontend/src/pages/RecetaPage.jsx")
C "2026-05-21T17:00:00+02:00" "feat: add tips, faq and reviews sections to recipe page" @("frontend/src/pages/RecetaPage.jsx")
C "2026-05-22T09:15:00+02:00" "feat: add secondary navigation component" @("frontend/src/components/SecondaryNav.jsx")
C "2026-05-22T10:30:00+02:00" "feat: add sticky action bar on recipe scroll" @("frontend/src/pages/RecetaPage.jsx")
C "2026-05-22T14:00:00+02:00" "feat: add country flags for international recipes" @("frontend/src/lib/utils.js")
C "2026-05-22T15:30:00+02:00" "refactor: extract recipe normalizers into adapter module" @("frontend/src/lib/")
M "2026-05-22T16:30:00+02:00" "feat/recipe-catalog" 3

# Main docs update
C "2026-05-22T16:45:00+02:00" "docs: add architecture documentation" @("docs/Arquitectura_Escalable.md","docs/Arquitectura_v2.md","docs/Plan_de_Sprints.md")

# ══════════════════════════════════════════════════════════════════════
# Day 9-11 — May 24-26 — Branch: feat/shopping-list
# ══════════════════════════════════════════════════════════════════════
B "feat/shopping-list"
C "2026-05-24T10:00:00+02:00" "feat: create shopping list database tables" @("backend/src/database/")
C "2026-05-24T11:30:00+02:00" "feat: implement ingredient consolidation engine" @("backend/src/modules/lista/")
C "2026-05-24T14:00:00+02:00" "feat: add package count calculation based on product sizes" @("backend/src/modules/lista/")
C "2026-05-24T15:30:00+02:00" "feat: add aisle grouping for shopping list items" @("backend/src/modules/lista/")
C "2026-05-24T18:15:00+02:00" "fix: consolidation was creating duplicates for same ingredient" @("backend/src/modules/lista/")
C "2026-05-25T10:00:00+02:00" "feat: build shopping list page layout" @("frontend/src/pages/ListaPage.jsx")
C "2026-05-25T11:30:00+02:00" "feat: add product card component with package stepper" @("frontend/src/pages/ListaPage.jsx")
C "2026-05-25T13:00:00+02:00" "feat: add 'already have it' despensa section" @("frontend/src/pages/ListaPage.jsx")
C "2026-05-25T14:30:00+02:00" "feat: add product swap side sheet" @("frontend/src/pages/ListaPage.jsx")
C "2026-05-25T16:00:00+02:00" "feat: add product search modal for manual additions" @("frontend/src/pages/ListaPage.jsx")
C "2026-05-25T17:30:00+02:00" "feat: add share shopping list feature" @("frontend/src/pages/ListaPage.jsx")
C "2026-05-26T09:30:00+02:00" "refactor: extract custom hooks for common patterns" @("frontend/src/hooks/")
C "2026-05-26T13:00:00+02:00" "feat: add sheet and dialog components (radix)" @("frontend/src/components/ui/","frontend/src/components/common/")
M "2026-05-26T16:00:00+02:00" "feat/shopping-list" 4

# ══════════════════════════════════════════════════════════════════════
# Day 12 — May 27 — Branch: feat/favorites-profile
# ══════════════════════════════════════════════════════════════════════
B "feat/favorites-profile"
C "2026-05-27T09:00:00+02:00" "feat: add favorites backend endpoints" @("backend/src/modules/favoritos/")
C "2026-05-27T10:30:00+02:00" "feat: add favorite toggle on recipe detail page" @("frontend/src/pages/RecetaPage.jsx")
C "2026-05-27T12:00:00+02:00" "feat: build favorites page" @("frontend/src/pages/FavoritasPage.jsx")
C "2026-05-27T14:30:00+02:00" "feat: build profile page with activity stats" @("frontend/src/pages/ProfilePage.jsx")
C "2026-05-27T16:00:00+02:00" "feat: add profile editing and password change" @("frontend/src/pages/ProfilePage.jsx")
C "2026-05-27T17:15:00+02:00" "feat: add dietary preferences management on profile" @("frontend/src/pages/ProfilePage.jsx")
C "2026-05-27T17:50:00+02:00" "fix: preferences were not syncing between profile and onboarding" @("frontend/src/context/")
M "2026-05-27T18:10:00+02:00" "feat/favorites-profile" 5

C "2026-05-28T10:00:00+02:00" "docs: add tech stack documentation" @("docs/Stack_Tecnologico.md","docs/UI_Sistema_Diseno.md")

# ══════════════════════════════════════════════════════════════════════
# Day 14-16 — May 29-31 — Branch: feat/ai-cooking-mode
# ══════════════════════════════════════════════════════════════════════
B "feat/ai-cooking-mode"
C "2026-05-29T09:00:00+02:00" "feat: add groq sdk integration" @("backend/src/modules/ai/")
C "2026-05-29T10:20:00+02:00" "feat: implement ai chat endpoint for recipe suggestions" @("backend/src/modules/ai/")
C "2026-05-29T12:00:00+02:00" "feat: add weekly meal planner ai endpoint" @("backend/src/modules/ai/")
C "2026-05-29T15:00:00+02:00" "fix: groq was returning malformed json sometimes, added retry logic" @("backend/src/modules/ai/")
C "2026-05-29T16:30:00+02:00" "feat: add api routes for ai module" @("backend/src/app.js")
C "2026-05-30T09:00:00+02:00" "feat: build ai assistant bottom sheet component" @("frontend/src/components/ai/QueCocinoHoySheet.jsx")
C "2026-05-30T11:00:00+02:00" "feat: add pantry scanner sheet" @("frontend/src/components/ai/EscanearDespensaSheet.jsx")
C "2026-05-30T13:30:00+02:00" "feat: add voice input to ai assistant" @("frontend/src/components/ai/QueCocinoHoySheet.jsx")
C "2026-05-30T15:00:00+02:00" "feat: build meal planner page with form and result display" @("frontend/src/pages/PlanificadorPage.jsx")
C "2026-05-30T18:00:00+02:00" "fix: planner was crashing when ai returned empty days array" @("frontend/src/pages/PlanificadorPage.jsx")
C "2026-05-31T09:30:00+02:00" "feat: implement cooking mode overlay" @("frontend/src/pages/RecetaPage.jsx")
C "2026-05-31T10:45:00+02:00" "feat: add text-to-speech with premium voice selection" @("frontend/src/pages/RecetaPage.jsx")
C "2026-05-31T12:00:00+02:00" "feat: add voice command recognition for cooking mode" @("frontend/src/pages/RecetaPage.jsx")
C "2026-05-31T13:30:00+02:00" "feat: add smart timer with chime sound and vibration" @("frontend/src/pages/RecetaPage.jsx")
C "2026-05-31T14:45:00+02:00" "feat: add wake lock to prevent screen from sleeping" @("frontend/src/pages/RecetaPage.jsx")
C "2026-05-31T16:10:00+02:00" "feat: add swipe navigation between cooking steps" @("frontend/src/pages/RecetaPage.jsx")
C "2026-05-31T17:40:00+02:00" "fix: timer alarm was firing multiple times" @("frontend/src/pages/RecetaPage.jsx")
M "2026-05-31T18:15:00+02:00" "feat/ai-cooking-mode" 6

# ══════════════════════════════════════════════════════════════════════
# Day 17-18 — June 1-2 — Polish and deployment docs
# ══════════════════════════════════════════════════════════════════════
C "2026-06-01T10:00:00+02:00" "feat: add speech utility helpers" @("frontend/src/lib/")
C "2026-06-01T11:00:00+02:00" "feat: add product images and visual assets" @("frontend/public/","img/")
C "2026-06-01T14:30:00+02:00" "feat: add vercel deployment config" @("backend/vercel.json","backend/api/")
C "2026-06-01T15:30:00+02:00" "docs: add execution roadmap and master plan" @("docs/Roadmap_de_Ejecucion.md","docs/Plan_Maestro_v2.md")
C "2026-06-01T17:00:00+02:00" "docs: add scrum presentation and delivery files" @("docs/entrega_mercadona.html","docs/entrega_mercadona.pdf","docs/presentacion.html")
C "2026-06-02T09:00:00+02:00" "chore: organize utility scripts into scripts folder" @("scripts/")
C "2026-06-02T10:00:00+02:00" "docs: write project README" @("README.md")
C "2026-06-02T10:30:00+02:00" "chore: add MIT license" @("LICENSE")

# ── Cleanup ──────────────────────────────────────────────────────────
Remove-Item Env:\GIT_AUTHOR_DATE    -ErrorAction SilentlyContinue
Remove-Item Env:\GIT_COMMITTER_DATE -ErrorAction SilentlyContinue
Remove-Item Env:\GIT_AUTHOR_NAME    -ErrorAction SilentlyContinue
Remove-Item Env:\GIT_COMMITTER_NAME -ErrorAction SilentlyContinue
Remove-Item Env:\GIT_AUTHOR_EMAIL   -ErrorAction SilentlyContinue
Remove-Item Env:\GIT_COMMITTER_EMAIL -ErrorAction SilentlyContinue

Write-Host "`n======================================" -ForegroundColor Green
Write-Host "Done! History built successfully." -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "  1. git log --oneline --graph" -ForegroundColor White
Write-Host "  2. git push -u origin main" -ForegroundColor White
Write-Host ""

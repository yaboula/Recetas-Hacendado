# Refactor Plan

This plan records technical debt found during the portfolio polish pass. The goal is to improve maintainability later without risking a broad behavior change now.

## Current Oversized Pages

| File | Approx. lines | Current responsibility |
|------|---------------|------------------------|
| `frontend/src/pages/RecetaPage.jsx` | 1047 | Recipe loading, favorite state, pricing, related recipes, serving changes, sticky action bar, cooking mode, voice control, timers, wake lock, and recipe layout |
| `frontend/src/pages/ListaPage.jsx` | 614 | Shopping-list loading, optimistic package updates, delete/share actions, grouped list rendering, pantry section, product search modal, and swap-product sheet |
| `frontend/src/pages/PlanificadorPage.jsx` | 516 | AI planner form, preference state, voice input, plan generation, result rendering, and add-all-to-list behavior |

## Recommended Sequence

1. **Add characterization tests before refactoring.**
   Capture current behavior for recipe detail loading, shopping-list package updates, and planner generation flows. If full UI tests are too heavy, start with focused unit tests around extracted pure helpers.

2. **Extract pure helper logic first.**
   Move calculations and formatting into small modules:
   - `frontend/src/lib/pricing.js`
   - `frontend/src/lib/shoppingList.js`
   - `frontend/src/lib/planner.js`
   - `frontend/src/lib/cookingMode.js`

3. **Split `RecetaPage.jsx` by feature area.**
   Candidate components/hooks:
   - `RecipeHero`
   - `RecipeIngredientGroups`
   - `RecipeStickyBar`
   - `CookingModeOverlay`
   - `useCookingMode`
   - `useRecipeDetail`

4. **Split `ListaPage.jsx` into list sections and modal flows.**
   Candidate components/hooks:
   - `ShoppingListHeader`
   - `ShoppingSection`
   - `PantrySection`
   - `ProductSearchModal`
   - `ProductSwapSheet`
   - `useShoppingList`

5. **Split `PlanificadorPage.jsx` into form and result components.**
   Candidate components/hooks:
   - `PlannerControls`
   - `PlannerPreferenceSelector`
   - `PlannerResults`
   - `PlannerSummary`
   - `useVoiceInput`
   - `useWeeklyPlanner`

6. **Keep API contracts unchanged.**
   Refactors should preserve the existing routes and request/response shapes so backend behavior and deployed assumptions remain stable.

7. **Refactor one page per pull request.**
   Keep each change reviewable: extract helpers, verify build/lint, then extract UI components.

## Risk Notes

- `RecetaPage.jsx` is the riskiest because cooking mode combines browser APIs, timers, speech recognition, local storage, and UI state.
- `ListaPage.jsx` uses optimistic updates, so refactors must preserve rollback behavior on API errors.
- `PlanificadorPage.jsx` depends on AI responses and user preferences, so extracted rendering should tolerate incomplete or malformed AI output.

# UI Design System (Mercadona Replica)

**Project:** Recetas Hacendado  
**UI Reference:** mercadona.es — Online Store  

> The goal of this UI layer is to ensure that any Mercadona user instantly recognizes the application as part of the Mercadona ecosystem. Every design decision, from color tokens to typography and micro-interactions, strictly replicates the brand's visual identity.

---

## 1. Design Tokens (Tailwind v4)

We implemented a custom token system to maintain absolute consistency without writing repetitive CSS.

### Primary Palette (Mercadona Green)
| Token | Hex | Usage |
|-------|-----|-------|
| `--color-primary` | `#00AA5B` | Corporate Green — CTAs, active icons, links |
| `--color-primary-dark` | `#008F4C` | Hover/pressed states for primary elements (WCAG AA compliant for text) |
| `--color-primary-light` | `#E6F7EF` | Background for green badges and active chips |
| `--color-primary-subtle` | `#F0FAF5` | Subtle backgrounds for large green sections |

### Neutral Palette
| Token | Hex | Usage |
|-------|-----|-------|
| `--color-text-primary` | `#1A1A1A` | Main text, headings |
| `--color-text-secondary` | `#555555` | Secondary text, subheadings, ingredients |
| `--color-text-tertiary` | `#888888` | Placeholders, metadata (time, servings) |
| `--color-border` | `#E0E0E0` | Card borders, inputs, dividers |
| `--color-bg-page` | `#F5F5F5` | Global page background |
| `--color-bg-card` | `#FFFFFF` | Card and panel backgrounds |

---

## 2. Typography

Mercadona uses a clean, neutral sans-serif font. We replicated this using Google Fonts.

- **Base Font Family:** `Open Sans`, `-apple-system`, `BlinkMacSystemFont`, `sans-serif`
- **Scale:**
  - `text-xs (11px)`: Minimal metadata.
  - `text-sm (13px)`: Ingredients, recipe steps, supporting text.
  - `text-base (14px)`: Standard body text.
  - `text-md (16px, 500w)`: Recipe names on catalog cards.
  - `text-xl (22px, 700w)`: Page titles.

---

## 3. UI Components

### 3.1 Recipe Catalog Cards
Cards are designed to be extremely clean. They feature a 16:9 hero image, a dietary chip (if applicable), the recipe name, metadata (time/servings), and the estimated price in the signature green.

**Interactions:**
- **Hover State:** `translateY(-2px)` with a slightly pronounced drop shadow (`box-shadow: 0 4px 12px rgba(0,0,0,0.12)`) implemented via Framer Motion.
- **Favorite Button:** Optimistic UI update. Clicking the heart immediately fills it locally, while the API request processes in the background.

### 3.2 Dietary Filter Chips
Used extensively in the catalog and AI planner.
- **Inactive:** White background, gray border, gray text.
- **Active:** `#E6F7EF` background, `#00AA5B` border and text. `font-weight: 600`.
- **Transitions:** Smooth 150ms ease transitions on click.

### 3.3 Shopping List Items (In-Store UX)
The shopping list is tailored for physical store navigation.
- Items are grouped by Supermarket Aisle (e.g., Produce, Dairy).
- **Checked State:** Clicking the custom checkbox turns it green, strikes through the text (`text-decoration: line-through`), turns the text gray, and moves the item to the bottom of its section.

### 3.4 Buttons & Inputs
- **Primary CTA:** Solid green (`#00AA5B`), no border, white text, 4px border-radius.
- **Secondary CTA:** Transparent background, green border (`1.5px solid #00AA5B`), green text.
- **Quantity Stepper (+/-):** Small circular buttons (32px), outline green, fill green on hover.
- **Inputs:** 44px height, light gray border. On focus, the border turns green and a subtle green focus ring (`box-shadow: 0 0 0 3px #E6F7EF`) appears.

---

## 4. Micro-Interactions & Animations (Framer Motion)

Animations are kept sober and functional, avoiding unnecessary visual noise.

| Interaction | Behavior |
|-------------|----------|
| **Add to Cart** | Spinner renders in the button for ~500ms, followed by a Toast notification sliding up from the bottom right. |
| **Search Debounce** | The catalog grid fades out slightly while typing, updating smoothly after 300ms without layout shifts. |
| **AI Bottom Sheets** | The "What Should I Cook" and "Pantry Scanner" sheets slide up from the bottom with a spring animation (`type: "spring", damping: 25, stiffness: 200`). |
| **Cooking Mode Steps** | Horizontal swipe transitions between recipe steps, mimicking native mobile app behavior. |

---

## 5. Accessibility (a11y)

- **Color Contrast:** The primary green (`#00AA5B`) on white fails WCAG AA contrast ratios for text (3.9:1). We specifically use a darker shade (`#008F4C`) for green text to ensure a minimum 4.5:1 ratio, while keeping the main green for large background elements (buttons, badges).
- **Focus Rings:** Explicit focus states (`outline: 2px solid #00AA5B`) for all interactive elements to support keyboard navigation.
- **Radix UI:** Used Radix primitives for Dialogs and Sheets to ensure focus trapping, escape-key closing, and proper ARIA labels out of the box.

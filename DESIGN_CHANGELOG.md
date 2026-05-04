# Design Changelog

Tracking the redesign from the cream/sage/terracotta prototype to the
**Operator + Blueprint + Pulse** blend chosen 2026-05-04.

## Direction

A blend of three rebuilt directions, each anchored on the brand
navy + cyan logo:

- **Operator** — daily workbench. White surface, navy ink, cyan action,
  Inter + JetBrains Mono, dense 4–6px radii. Used for app chrome
  (TopNav) and admin dashboard / list pages.
- **Blueprint** — narrative pages. Mist-white `#F5F7FA`, Fraunces serif
  hero, generous spacing. Used inside Operator chrome on `/reports` and
  `/events/[id]/recap` — the editorial moments.
- **Pulse** — employee experience. Deep navy `#050D17` with ambient dot
  field, cyan→mint accent, Bricolage Grotesque hero. Pulse takes over
  the chrome on `/me/*` routes (chrome flips dark).

Rendered preview at `public/_preview/blend.html`.

## Token system

Single source of truth: CSS custom properties scoped to `[data-theme]`,
with a `C` proxy in `src/lib/tokens.ts` that maps the legacy token
names to the new vars. This way existing `style={{ background: C.sage }}`
call sites continue to work — they just resolve to the active theme's
hex value.

| Theme       | Selector                  | Surface bg | Ink     | Accent  |
|-------------|---------------------------|------------|---------|---------|
| Operator    | `:root` (default)         | `#FFFFFF`  | `#0A1A2E` | `#0891B2` |
| Blueprint   | `[data-theme="blueprint"]` | `#F5F7FA`  | `#0A1A2E` | `#0891B2` |
| Pulse       | `[data-theme="pulse"]`    | `#050D17`  | `#F8FAFC` | `#22D3EE` |

The `(admin)` route group inherits the `:root` (Operator) defaults.
The `(employee)` route group sets `[data-theme="pulse"]` at the
layout level, flipping the chrome and content together. Narrative
pages inside admin (recap / reports) wrap their content in
`[data-theme="blueprint"]`.

## Fonts

Loaded via `next/font/google` in the root layout, exposed as CSS
variables for theme-level selection.

| Variable        | Family               | Use                                  |
|-----------------|----------------------|--------------------------------------|
| `--font-sans`   | Inter Tight (var.)    | UI labels, body, all chrome          |
| `--font-serif`  | Fraunces (var. opsz)  | Blueprint hero + KPI numerals        |
| `--font-mono`   | JetBrains Mono        | Operator tabular nums, IDs, timestamps |
| `--font-display`| Bricolage Grotesque (var.) | Pulse hero copy                |

## Migration history

### 2026-05-04 — Foundation
- Added `DESIGN_CHANGELOG.md`
- Rewrote `src/lib/tokens.ts` so `C` maps to CSS vars
- Rewrote `src/app/globals.css` with theme variables
- Replaced `Instrument_Serif + DM_Sans` with the four-font system above
- Added `src/app/(admin)/layout.tsx` and `src/app/(employee)/layout.tsx`
  (route-group layouts; root no longer renders chrome)
- Migrated `AIBlock`, `Card`, and admin home off the `${C.foo}xx`
  alpha-hex syntax (incompatible with CSS-var tokens) to `var(--token-glow)`
  prebaked alpha or `color-mix()`

# Design Changelog

Tracking the redesign from the cream/sage/terracotta prototype to the
**Operator + Blueprint** blend (revised 2026-05-04).

## Direction

Two rebuilt directions, each anchored on the brand navy + cyan logo:

- **Operator** — daily workbench. White surface, navy ink, cyan action,
  Inter Tight + JetBrains Mono, dense 6–8px radii. Used for app chrome
  (TopNav) and **all admin and employee pages**.
- **Blueprint** — narrative pages. Mist-white `#F5F7FA`, Fraunces serif
  hero, generous spacing. Used inside Operator chrome on `/reports` and
  `/events/[id]/recap` — the editorial moments.

The original plan included a third theme (Pulse — deep navy, dot field,
Bricolage display) for the employee side. Pivoted 2026-05-04 in favor of
admin/employee parity. Pulse CSS scope and font are kept in
`globals.css` and `layout.tsx` for now in case it's wanted back; the
blend preview at `public/_preview/blend.html` documents what it looked
like.

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

Both `(admin)` and `(employee)` route groups set
`data-theme="operator"`. Narrative pages inside admin (recap / reports)
wrap their content in `[data-theme="blueprint"]`.

(Pulse — `[data-theme="pulse"]` — is still defined in `globals.css` but
no longer wired up. Kept as dead-but-revivable CSS for now.)

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

### 2026-05-04 — Pivot: drop Pulse, employee matches admin
- `(employee)/layout.tsx` now uses `data-theme="operator"` and drops
  the ambient dot field. Employee pages render with the same chrome,
  surface, type, and accent as admin.
- Pulse CSS scope and `--font-display` (Bricolage) left in place; can
  be re-enabled by setting `data-theme="pulse"` again.

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

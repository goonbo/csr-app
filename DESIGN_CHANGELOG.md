# Design Changelog

Tracking the redesign from the cream/sage/terracotta prototype to the
**Operator + Blueprint + Field** system (current as of 2026-05-05).

## Direction

Three theme registers, all anchored on the brand navy + cyan logo:

- **Operator** — daily workbench. White surface, navy ink, **cyan**
  action, Inter Tight + JetBrains Mono, dense 6–8px radii. Used for
  app chrome (TopNav) and all CloudMotion admin and employee pages.
- **Blueprint** — narrative pages. Mist-white `#F5F7FA`, Fraunces serif
  hero, generous spacing. Used inside chrome on `/reports`,
  `/events/[id]/recap`, and `/np/recap/[eventId]` — the editorial
  moments, on either side of a partnership.
- **Field** — nonprofit workspace. White surface (same as Operator),
  navy ink (same as Operator), but **emerald** accent. Inter Tight,
  same fonts and radii as Operator. The accent flip is the only
  signal that the workspace has changed; everything else stays so
  the chrome reads as the same product, not two.

The original plan included a fourth theme (Pulse — deep navy, dot
field, Bricolage display) for the employee side. Pivoted 2026-05-04
in favor of admin/employee parity, then removed entirely from the
live code. The blend preview at `public/_preview/blend.html` is the
only place it still exists, as historical reference.

## Token system

Single source of truth: CSS custom properties scoped to `[data-theme]`,
with a `C` proxy in `src/lib/tokens.ts` that maps the legacy token
names to the new vars. This way existing `style={{ background: C.sage }}`
call sites continue to work — they just resolve to the active theme's
hex value.

| Theme       | Selector                  | Surface bg | Ink     | Accent    |
|-------------|---------------------------|------------|---------|-----------|
| Operator    | `:root` (default)         | `#FFFFFF`  | `#0A1A2E` | `#0891B2` (cyan)   |
| Blueprint   | `[data-theme="blueprint"]` | `#F5F7FA`  | `#0A1A2E` | `#0891B2` (cyan)   |
| Field       | `[data-theme="field"]`    | `#FFFFFF`  | `#0A1A2E` | `#16A34A` (emerald) |

Route group → theme:
* `(admin)` → `data-theme="operator"`
* `(employee)` → `data-theme="operator"`
* `(nonprofit)` → `data-theme="field"`

Narrative pages wrap their content in `[data-theme="blueprint"]` —
the corporate-side `/reports` and `/events/[id]/recap`, plus the
nonprofit-side `/np/recap/[eventId]`. Both sides share the same
editorial register.

A fourth set of tokens — `--view-source`, `--view-source-bg`,
`--view-source-fg` — is defined in both Operator and Field. The
value is cyan in both. In Field, cyan reads as foreign (emerald is
local) and is the load-bearing visual for the ViewSourcePill
primitive that marks data flowing in from VIEW corporate partners.
In Operator the same value is exposed for cross-context primitives
that travel between workspaces.

## Fonts

Loaded via `next/font/google` in the root layout, exposed as CSS
variables for theme-level selection.

| Variable        | Family               | Use                                  |
|-----------------|----------------------|--------------------------------------|
| `--font-sans`   | Inter Tight (var.)    | UI labels, body, all chrome          |
| `--font-serif`  | Fraunces (var. opsz)  | Blueprint hero + KPI numerals        |
| `--font-mono`   | JetBrains Mono        | Operator tabular nums, IDs, timestamps |

## Migration history

### 2026-05-05 — Nonprofit workspace
- **Field theme** added to globals.css: emerald `#16A34A` accent,
  otherwise identical to Operator. Plus `--view-source*` tokens
  in both Operator and Field for the ViewSourcePill primitive.
- **Workspace concept** in `src/lib/types.ts` — three-way
  `Workspace` discriminator replaces the old admin/employee role
  toggle as the outer organizing concept. TopNav restructured
  around a `WORKSPACES` map.
- **`(nonprofit)` route group** with five screens: workbench
  home (`/np`), volunteers list + detail (`/np/volunteers[/id]`),
  corporate partners list + detail (`/np/partners[/id]`),
  donations cash + in-kind tabs (`/np/donations`), nonprofit-side
  event recap in Blueprint register (`/np/recap/[eventId]`).
- **ViewSourcePill primitive** (`src/components/primitives/`) —
  cyan-tinted pill with sparkle icon and "via VIEW · {partner}"
  label, used everywhere the nonprofit workspace mixes
  VIEW-sourced and direct/imported data.
- **Seed**: `np-corporate-partners.ts` (8 partners, 4 VIEW),
  `np-volunteers.ts` (40 volunteers, 16 via VIEW; the 8 named
  CloudMotion folks are the same humans on the corporate-side
  employee roster), `np-donations.ts` (~30 cash + 20 in-kind),
  `np-recap.ts` (1 nonprofit-side recap of e3, matched 1:1 with
  the corporate-side completed event).

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

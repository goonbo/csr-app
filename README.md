# VIEW

Demo-ready clickable prototype of an AI-native CSR (Corporate Social Responsibility) operator platform for mid-market companies. Helps a lean CSR lead source nonprofit partners, plan volunteer events, run them, and report on them.

No backend, no auth, no real AI calls — every flow is seeded with deterministic responses behind multi-step loading sequences.

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind v4 (layout primitives only — color/typography use inline styles sourced from `src/lib/tokens.ts`)
- `next/font/google` for Instrument Serif + DM Sans
- `lucide-react` for icons
- pnpm as the package manager

## Install

```bash
pnpm install
```

Requires Node 20+ and pnpm 9+ (`corepack enable` if you don't have pnpm installed).

## Run

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

The role switcher in the top nav toggles between Admin (`/`) and Employee (`/me`).

### Routes

**Admin (`/`):**
- `/` — Workbench: what needs you today, pipeline flow, recruiting now, year-so-far KPIs
- `/partners` and `/partners/[id]` — Partners list and detail (with AI diligence flow)
- `/events` and `/events/[id]` — Events list and detail (stage-specific UI)
- `/events/new` — Event builder (textarea → AI plan → 5 editable outputs)
- `/events/[id]/recap` — AI-generated exec recap document
- `/reports` — Quarterly program review

**Employee (`/me`):**
- `/me` — Volunteer home with VTO progress
- `/me/opportunities` — Opportunities to discover
- `/me/profile` — My impact

### AI flows (all mocked)

Three deterministic AI sequences, each ~3s:
- Partner diligence (`/partners/[id]` → "Run AI diligence")
- Event plan (`/events/new` → "Plan this with me")
- Event recap (`/events/[id]/recap` — auto-starts on completed events)

Pre-baked responses live in `src/lib/seed/` (`ai-plan.ts`, `ai-recap.ts`, partner `diligence` fields).

## Build

```bash
pnpm build
pnpm start
```

## Deploy

Push to a Git remote and import the repo into Vercel — no configuration required. Build command `pnpm build`, output `.next`. Vercel's defaults work out of the box.

```bash
# or with the Vercel CLI
npx vercel
```

## Accessibility

Lighthouse accessibility: **100/100** across all 11 routes. Verified:
- Focus-visible: 2px terracotta outline (`#A0533C`) on every interactive element
- Reduced-motion: animations and transitions collapse to 0.01ms when `prefers-reduced-motion: reduce`
- All decorative icons carry `aria-hidden`
- Loading states use `role="status"` + `aria-live="polite"` (see `src/components/primitives/LoadingSteps.tsx`)
- Interactive cards use the `Card` primitive's built-in `role="button"` + `tabIndex` + Enter/Space handlers

## Project layout

```
src/
  app/
    (admin)/        # admin route group
    (employee)/     # employee route group
    layout.tsx      # root layout + TopNav
    globals.css     # focus styles, reduced-motion, keyframes
  components/
    primitives/     # Button, Pill, Card, AIBlock, LoadingSteps, ReadinessTag, PageHeader
    layout/         # TopNav
    admin/          # admin-only composites (DemandSignalsPanel)
  lib/
    tokens.ts       # `C` constant — every color in one place
    types.ts
    format.ts
    useAILoad.ts    # 4-step loading hook, total ~3s
    seed/           # typed seed data — partners, events, employees, ai-plan, ai-recap, etc.
```

Color and typography tokens live in `src/lib/tokens.ts`. Inline styles sourced from `C` are the rule — Tailwind only handles layout primitives (flex/grid/spacing/responsive breakpoints).

# VIEW — Claude Code Prompt: Figma Export & Design System

You're setting up a Figma design file that mirrors the live VIEW prototype, with a clean design system, a component library, and Code Connect mappings so designers can work in Figma and translate changes back to the codebase via Claude Code.

This prompt sets up the initial export. The ongoing design→code workflow is described at the end and is a separate, repeatable process.

## A note on the workflow you're building toward

Before you start: be honest with yourself and with anyone reading this about what's realistic.

The aspiration: designers iterate freely in Figma, click a button, watch design changes flow back to code as a clean PR.

The reality (mid-2026): that flow doesn't exist as a turnkey product. Figma reads → emits code, but only for selected components, with output that needs review. Code → Figma export is even less mature. Commercial tools (Anima, Builder.io) try to close this gap but each has opinions about output that won't match VIEW's conventions.

What this prompt commits to (Option B, the realistic version):

1. Figma file is built faithfully from the codebase (one-time labor, this prompt)
2. Code Connect is set up so designers see real React code in Figma's Dev Mode panel
3. Design changes in Figma are translated back to code by a follow-up Claude Code run that reads the updated Figma file alongside a new prompt
4. The translation step is human-initiated and human-reviewed; not automatic, not magical

This is honest. It's also what works today. If at any point during this build you find a tool or workflow that closes the round-trip more tightly without compromising VIEW's conventions, surface it as a recommendation but don't pivot mid-build.

## Inputs you have

Read these in this order before touching anything:

1. The current repo — `goonbo/csr-app`. Clone it, run `pnpm dev`, click through every route. The Figma file you build should mirror this exactly.
2. `view-onboarding-brief.pdf` (v5) — context on the product, three workspaces, three themes.
3. `view-voice-and-language-guide.md` — for screen mirror copy. Use the in-product copy verbatim; don't drift into placeholder Lorem Ipsum. (If the guide isn't in the repo at the time of the build, fall back to the in-product copy as the source of truth.)
4. `src/app/globals.css` — every theme token. The Figma variables you create map 1:1 to these.
5. `src/lib/types.ts` and `src/lib/seed/` — the data shapes that fill the screens.
6. `src/components/` — every primitive and domain component in the codebase. The Figma component library mirrors this directory structure.

## Stack and tooling commitments

You're working with:

* Figma desktop app with Dev Mode access (required for Code Connect)
* **`figma-console` MCP** — the Figma Console plugin's MCP, already configured and enabled in this workspace. Used by Claude Code to read/write Figma files: create variable collections, components, frames; execute JS in the plugin sandbox; capture screenshots. This is a third-party plugin, not Figma's official Dev Mode MCP, but it provides equivalent functional capabilities for our needs. Verify it can read a basic Figma file before proceeding.
* `@figma/code-connect` npm package added to the repo as a dev dependency (Code Connect itself is independent of which MCP you use to read/write Figma — it's a code-side static mapping)
* Lucide icons — Figma plugin "Lucide Icons" for sourcing icons; use the same icon set the React code uses
* Tailwind reference — for class-name semantics; Figma variables map to Tailwind tokens where there's a clean correspondence

What you do NOT use:

* Anima, Locofy, Builder.io Visual Copilot, or any other commercial round-trip tool — they have opinions about output that don't match VIEW's conventions
* The shadcn Figma Community kit as a fork — we build from scratch (see "Why from scratch" below). Reference shadcn's naming conventions and variant structure throughout, but build the visual primitives from VIEW's actual design.
* Plugins that auto-generate components from arbitrary URLs — quality is too inconsistent

**Note on the original prompt:** the upstream version of this document committed to Figma's official Dev Mode MCP Server. That server requires a Figma Pro+ license and a separate MCP installation. This workspace already has `figma-console` set up and working, so we're using it instead. The two MCPs differ in distribution channel (official vs plugin-based) but overlap heavily on functional capability for variable, component, and screen creation. Document the choice in `FIGMA_DESIGN_SYSTEM.md` so future readers understand the deviation.

## Why from scratch

This file is being built fresh rather than forking the shadcn Figma kit. The reasoning:

* VIEW's three-theme system (Operator + Blueprint + Field) doesn't map to shadcn's standard light/dark token structure cleanly
* VIEW's domain primitives (AIBlock, LoadingSteps, ReadinessTag, ViewSourcePill, Pill) don't exist in shadcn's kit
* The dual register (workbench voice / document voice) creates two different default frame templates, not just color swaps
* Visual fidelity to the live app is the primary requirement; faster start is secondary

What you DO take from shadcn:

* Variant naming conventions — `Button / Default / Md`, `Card / Default`, etc. Slash-delimited variants that map to React CVA variants
* Component prop names — `variant`, `size`, `tone`, `intent` (matching shadcn's React conventions)
* The shape of primitives — buttons have these states, badges have these tones, cards have these elevations — even if the visuals are VIEW-specific

When in doubt about how to structure a component variant, look at how shadcn does it, then build it with VIEW's actual visual design.

## The Figma file structure

One Figma file. Six pages, navigable from the left sidebar. Designers stay in one page during focused work.

```
📁 VIEW — Design System
├── 🎨 Tokens & Variables       (page 1)
├── 🧩 Primitive Components     (page 2)
├── 🏗️  Domain Components        (page 3)
├── 🖥️  Screens — Admin          (page 4)
├── 👤 Screens — Employee       (page 5)
└── 🤝 Screens — Nonprofit      (page 6)
```

Naming and emoji prefixes match this exactly so everyone using the file orients quickly.

## Token architecture — modes inside a single collection

The live app has three themes that swap via `data-theme` attribute. In Figma, model this as one variable collection with three modes.

Collection name: `Themes` Modes: `Operator`, `Blueprint`, `Field`

All UI tokens live in this collection and have three values (one per mode). Switching a frame's mode swaps every variable simultaneously.

Variables to create, organized into folders:

```
color/
  background           [Operator: white • Blueprint: mist • Field: white]
  foreground           [navy in all three]
  primary              [Operator: cyan • Blueprint: cyan • Field: emerald]
  primary-foreground   [white in all three]
  muted                [light slate variant per mode]
  muted-foreground     [mid slate variant per mode]
  card                 [white • white • white]
  card-foreground      [navy in all]
  border               [slate-200 variants]
  border-strong        [slate-300 variants]
  accent               [cyan-50 • cyan-50 • emerald-50]
  accent-foreground    [cyan-900 • cyan-900 • emerald-900]
  destructive          [rose-600 in all]
  destructive-foreground [white in all]
  ring                 [matches primary in each mode]

  /* Functional tones — same in all three modes */
  rose                 [rose-600]
  rose-bg              [rose-50]
  rose-fg              [rose-900]
  amber                [amber-600]
  amber-bg             [amber-50]
  amber-fg             [amber-900]
  emerald              [emerald-600]
  emerald-bg           [emerald-50]
  emerald-fg           [emerald-900]

  /* The exception — ALWAYS cyan, in every mode, including Field */
  view-source          [cyan-600 in ALL modes]
  view-source-bg       [cyan-50 in ALL modes]
  view-source-fg       [cyan-900 in ALL modes]

radius/
  none                 [0]
  sm                   [Operator: 4px • Blueprint: 6px • Field: 4px]
  md                   [Operator: 6px • Blueprint: 10px • Field: 6px]
  lg                   [Operator: 8px • Blueprint: 16px • Field: 8px]
  full                 [9999]

spacing/
  /* 4px base scale; same in all modes */
  0, 0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24

font-size/
  /* matches Tailwind defaults; same in all modes */
  xs, sm, base, lg, xl, 2xl, 3xl, 4xl, 5xl, 6xl

font-weight/
  light: 300, normal: 400, medium: 500, semibold: 600, bold: 700
```

Pull exact hex values from `src/app/globals.css` — those are the source of truth. Don't approximate, don't "improve" the colors.

Naming convention: lowercase, slash-delimited folders, kebab-case within. This matches Tailwind's CSS variable conventions and means a designer in Dev Mode sees variable names that map readably to the React code's class names.

The exception about ViewSourcePill colors deserves emphasis: the `view-source/*` variables stay cyan in all three modes. This is intentional and load-bearing. ViewSourcePill is the visible expression of the bidirectional architecture — cyan reads as "from VIEW" inside the Field workspace where emerald is local. If you make these tokens mode-dependent, the whole strategic point of the primitive collapses.

## Typography — three families, two registers

Three font families, set up as Figma text styles:

* Inter Tight (variable) — UI sans, weights 400–700
* Fraunces (variable, opsz axis) — serif for Blueprint heroes
* JetBrains Mono — for tabular numerals, IDs, status meta

Create text styles, not just inline text overrides. Naming follows shadcn's typography naming where applicable, with VIEW-specific additions.

```
text/
  display/xl              Fraunces 60pt italic (Blueprint hero)
  display/lg              Fraunces 36pt italic (Blueprint section)
  display/md              Inter Tight 32pt 600 (Operator hero)
  heading/xl              Inter Tight 24pt 600
  heading/lg              Inter Tight 20pt 600
  heading/md              Inter Tight 16pt 600
  heading/sm              Inter Tight 14pt 600
  body/lg                 Inter Tight 16pt 400 (Blueprint body)
  body/md                 Inter Tight 14pt 400 (Operator body — default)
  body/sm                 Inter Tight 13pt 400 (Operator dense)
  body/xs                 Inter Tight 12pt 400 (microcopy)
  body/lead               Fraunces 18pt italic 300 (lead paragraphs)
  caption/md              Inter Tight 12pt 500 (status text)
  caption/sm              Inter Tight 11pt 500 (eyebrows)
  meta/mono               JetBrains Mono 12pt 400 (IDs, timestamps)
  meta/mono-sm            JetBrains Mono 10pt 500 (status meta)
```

Apply text styles via Figma's style references throughout. Never use raw font sizes on text layers — every text layer references a style.

## Build phases

Each phase ends with a checkpoint. Stop after each one. The Figma file should be reviewable as a coherent artifact at the end of each phase.

### Phase 1 — File scaffolding and tokens

* Create the Figma file `VIEW — Design System`
* Set up the six pages with the names and emoji prefixes specified above
* Build the `Themes` variable collection with all three modes
* Create every variable per the spec, with exact hex values pulled from `src/app/globals.css`
* Verify `view-source/*` tokens stay cyan across all three modes
* Build all text styles per the spec
* On the Tokens page, build a visual reference showing every color variable swatched in all three modes side-by-side, plus a type scale showing every text style

Stop. Show me the Tokens page rendered and confirm color values match the source code values exactly before continuing.

### Phase 2 — Primitive components

Build VIEW's primitives on the Primitive Components page. Each primitive is a Figma component with variants matching the React component's CVA variants exactly.

The components to build, with their required variant structure (matching the React code):

**Button** (mirrors `src/components/ui/button.tsx` and shadcn conventions)

* Variants: `Default / Destructive / Outline / Secondary / Ghost / Link / AI`
* Sizes: `Default / Sm / Lg / Icon`
* States: `Default / Hover / Pressed / Disabled / Focus`
* Variant naming format: `Button / Default / Md / Default` (variant / size / state)

**Pill** (mirrors `src/components/view/Pill.tsx`)

* Tones: `Neutral / Sage / Terracotta / Amber / Rose / Emerald` (legacy tone names retained per the codebase)
* Sizes: `Default / Sm`
* Optional `with-icon` variant
* **Tone aliasing note**: `Sage` and `Terracotta` resolve to `--primary` (cyan in Operator/Blueprint, emerald in Field), not the literal Tailwind sage/orange palettes. Visual flips per mode.

**Card** (mirrors `src/components/ui/card.tsx`)

* Variants: `Default / Soft / AI / Outlined`
* Padding sizes: `Default / Sm / Lg`

**Badge** — basic shadcn-style
**Input** — text input with states (Default / Focus / Filled / Disabled / Error)
**Label** — paired with Input
**Tabs** — tab list with active and inactive states; two variants per the codebase: `Default` (segmented, rounded-lg muted bg) and `Line` (underline)
**Avatar** — Figma frame with text-initials fallback and image variant
**Separator** — horizontal and vertical
**Tooltip** — popup style

**LoadingSteps** (mirrors `src/components/view/LoadingSteps.tsx`)

* Variants per step state: `Pending / Active / Done`
* The component as a whole is a vertical stack of steps

**ReadinessTag** (mirrors `src/components/view/ReadinessTag.tsx`)

* States: `Strong / Solid / Worth a closer look / Limited evidence / Not assessed`
* Each state has its own color treatment per the live app
* Sage tones in this primitive also resolve to `--primary` per the parity-fix tone aliasing.

**PageHeader** (mirrors `src/components/view/PageHeader.tsx`)

* Slots: `Title`, `Subtitle`, `Action` (right-aligned action button)
* Variants: `Default / With back link / With greeting eyebrow`
* Title size and weight flip per scope via `--page-heading-*` tokens (56px / 350 in Blueprint, 30px / 600 elsewhere). Build two variants accordingly.

**ViewSourcePill** (mirrors `src/components/view/ViewSourcePill.tsx`)

* Sizes: `Default / Sm`
* IMPORTANT: this primitive references `view-source/*` tokens, NOT `primary/*`. It must render cyan in every theme.

**TopNav** (mirrors `src/components/view/TopNav.tsx`)

* States: `Admin workspace / Employee workspace / Nonprofit workspace`
* Internal structure: workspace pill on left, nav items center, role/avatar right

For each component:

1. Build all variants and states
2. Use only theme variables for color, never raw hex
3. Use only text styles for typography, never raw font specs
4. Use auto-layout for the entire component so it resizes cleanly
5. Add a description property documenting what the component is, where it's used in the codebase, and any notes on usage
6. Match the visual exactly to the rendered React component — pixel match where possible

Sourcing icons: install the Lucide Icons Figma plugin and use it for every icon. Do not draw icons manually. Use the same icon name the React code uses (e.g., `Sparkles`, `ChevronRight`, `Calendar`).

Stop. Show me the Primitive Components page rendered with all components, all variants, all states. We confirm before continuing.

### Phase 3 — Domain components

Build VIEW's domain-specific components on the Domain Components page. These compose primitives. They are:

- **AIBlock** — Card variant with cyan halo, sparkle eyebrow, optional regenerate button, content slot
- **DemandSignalsPanel** — composite from the admin workbench, lives in `src/components/admin/`
- **Pipeline strip** — the eight-stage workflow strip that appears on the admin home
- **At-risk diagnosis card** — multi-cause diagnosis with confidence pills and options-on-the-table list
- **Reconciliation queue** — list of post-event items with check-in gaps, retroactive hours, photo consent
- **Mutual fit panel** — three-card layout for cohort fit / capacity fit / schedule fit
- **Volunteer profile card** — list-row variant for volunteer list and a fuller card for volunteer detail
- **Corporate partner card** — list-row variant for nonprofit-side partner list
- **Pending request card** — the partner-side view of a corporate partner's proposed event
- **Recap document section** — Blueprint-themed narrative document fragment with hero typography
- **Quarterly review section** — Blueprint-themed quarterly review card

For each domain component:

* Compose from primitives (Card + Pill + Button + etc.) — don't build from scratch
* Reference theme variables and text styles
* Use auto-layout
* Add a description noting which page(s) it appears on in the live app

Stop. Show me the Domain Components page. Confirm before continuing.

### Phase 4 — Screen mirroring (all 18 routes)

Mirror every route as a Figma frame on the appropriate Screens page.

Frame setup:

* Each frame is a Desktop preset (1440×900 minimum, taller as content requires)
* Frame name uses the route name: `/`, `/partners`, `/partners/[id]`, etc.
* Frame applies the correct variable mode: Operator for chrome pages, Blueprint for `/reports` and recap pages, Field for nonprofit pages
* TopNav is an instance of the TopNav primitive at the top of every frame
* Page content uses instances of primitives and domain components — no detached layers

The 18 routes, organized by Screens page:

**Screens — Admin (8 routes)**

* `/` — admin home (workbench)
* `/partners` — partner directory
* `/partners/[id]` — partner detail with AI diligence
* `/events` — event list
* `/events/new` — event builder
* `/events/[id]` — event detail with stage-specific UI
* `/events/[id]/recap` — exec recap document (Blueprint mode)
* `/reports` — quarterly program review (Blueprint mode)

**Screens — Employee (3 routes)**

* `/me` — employee home with VTO ring
* `/me/opportunities` — opportunities grid
* `/me/profile` — my impact view

**Screens — Nonprofit (7 routes)**

* `/np` — nonprofit workbench (Field mode)
* `/np/volunteers` — volunteer list (Field mode)
* `/np/volunteers/[id]` — volunteer profile (Field mode)
* `/np/partners` — corporate partner list (Field mode)
* `/np/partners/[id]` — corporate partner detail (Field mode)
* `/np/donations` — cash + in-kind tabs (Field mode)
* `/np/recap/[eventId]` — nonprofit-side recap (Blueprint mode)

For each screen:

* Pull copy verbatim from the live React code — never paraphrase, never use Lorem Ipsum
* Pull data from the seed files (the `Greater Austin Food Bank` event with 47 of 60 spots filled, etc.) — exactly what the live app shows
* ViewSourcePill instances on the nonprofit screens where they currently appear — same placement, same partner attribution
* Match interactive states where they're visible in the live app: at-risk events showing rose accent, recruiting events showing emerald accent, etc.

Build order within Phase 4 — if scope runs long, the most-important screens are first:

1. `/` — admin home (the workbench, most architecturally complex)
2. `/partners/[id]` — partner detail with AI diligence (key demo moment)
3. `/events/new` — event builder (key demo moment)
4. `/events/[id]/recap` — exec recap (Blueprint demo)
5. `/np` — nonprofit workbench (Field demo)
6. `/np/recap/[eventId]` — nonprofit recap (bidirectional moment)
7. `/events/[id]` — event detail (at-risk diagnosis, command center)
8. `/reports` — quarterly review (Blueprint)
9. `/np/partners/[id]` — pending request card showcase
10. Remaining list views and detail views in any order
11. Employee screens last (smallest surface, lowest demo priority)

If a phase 4 milestone is going to take more than an hour and a half of work, stop and check in. Don't burn the whole budget on screen detail before we've reviewed the early screens.

Document each screen as you build it: a comment on the frame noting any places where the Figma representation simplifies the live app (e.g., dynamic tooltips that don't render, focus states that aren't shown).

### Phase 5 — Code Connect setup

This is the linchpin of the workflow. Without it, Dev Mode shows Figma components but no real code. With it, designers see actual React import statements and JSX usage examples.

Steps:

1. In the repo, install `@figma/code-connect` as a dev dependency:

```
pnpm add -D @figma/code-connect
```

2. Run the init command to generate the config:

```
pnpm dlx @figma/code-connect init
```

3. For each primitive component, create a `[ComponentName].figma.tsx` file alongside the component (`src/components/ui/` for shadcn primitives, `src/components/view/` for domain primitives). These files define the mapping between the Figma component and the React component. Example for Button:

```tsx
// src/components/ui/button.figma.tsx
import figma from "@figma/code-connect";
import { Button } from "./button";

figma.connect(
  Button,
  "https://www.figma.com/file/.../?node-id=...",
  {
    props: {
      variant: figma.enum("Variant", {
        Default: "default",
        Destructive: "destructive",
        Outline: "outline",
        Secondary: "secondary",
        Ghost: "ghost",
        Link: "link",
        AI: "ai",
      }),
      size: figma.enum("Size", {
        Default: "default",
        Sm: "sm",
        Lg: "lg",
        Icon: "icon",
      }),
      children: figma.string("Label"),
    },
    example: ({ variant, size, children }) => (
      <Button variant={variant} size={size}>{children}</Button>
    ),
  }
);
```

4. Repeat the mapping for every primitive (Button, Pill, Card, Badge, Input, Label, Tabs, Avatar, Separator, Tooltip, LoadingSteps, ReadinessTag, PageHeader, ViewSourcePill, TopNav)
5. For domain components (AIBlock, DemandSignalsPanel, etc.), Code Connect is optional — set up mappings for the most-used ones (AIBlock, mutual fit panel, recap section). The benefit-to-effort ratio is lower for one-off composite components.
6. Publish the Code Connect mappings:

```
pnpm dlx @figma/code-connect publish
```

7. Verify in Figma desktop's Dev Mode that selecting a primitive component now shows real React code in the Code panel.

What this enables: designers in Figma's Dev Mode see real component imports, real prop names, and real example code. When a designer changes a Figma component, a developer (or Claude Code) reading the updated file knows exactly which React component to update.

What this does NOT enable: automatic translation of Figma changes back to code. That's the manual workflow described next.

### Phase 6 — Documentation

Create a file in the repo: `FIGMA_DESIGN_SYSTEM.md` covering:

* The Figma file URL and how to request access
* The page structure (what's on each of the six pages)
* The token system (where tokens live, how the three modes work, the ViewSourcePill exception)
* The component mapping (which Figma components map to which React components)
* The Code Connect setup (how it works, what it shows in Dev Mode)
* The MCP choice — note the use of `figma-console` (third-party plugin) instead of the official Dev Mode MCP, and why
* The design→code workflow (described below)

This is what new teammates read to understand the design system.

## The design→code workflow (after this prompt completes)

Once the Figma file is set up and Code Connect is wired, the ongoing workflow looks like this:

1. Designer makes changes in Figma. They might edit a component's spacing, change a token value, propose a new screen, or revise a copy string.
2. Designer comments on the file describing what they changed and why. (Or, more rigorously, opens a "design proposal" branch in Figma if your team uses Figma branches.)
3. Engineer or product person opens Claude Code with a prompt like: "The Figma file at [url] has been updated by [designer]. Read the changes against the current state of the code repo, and propose code changes that match. Show me a diff before applying anything."
4. Claude Code reads the Figma file via the configured MCP (currently `figma-console`), identifies the changes, proposes code edits, and shows a diff.
5. The diff is reviewed by a human (designer + engineer + product), refined as needed, and merged into the codebase.
6. The Figma file is updated to reflect the merged code state if any changes were made during review.

This is the realistic round-trip. It's asynchronous, human-mediated, and requires a translation step. It's also reliable, defensible, and produces clean code that matches conventions.

A separate Claude Code prompt (call it `CLAUDE-CODE-PROMPT-FIGMA-SYNC.md` — write it after this work completes) handles the design→code step. Don't try to write that prompt now; until the Figma file exists, there's nothing to sync from.

## Things you have authority to decide

* File organization within each Figma page (frames per row, naming conventions for sub-frames)
* Specific Figma component description text (as long as it's accurate to the codebase)
* Whether to include "spec" annotations on any frames (measurements, padding, etc.) — recommended for the primitives but not required
* Whether to include a hidden "scratch" or "WIP" page for the designer's working space (encouraged)

## Things you do NOT have authority to decide

* Variable naming or token structure beyond what's specified
* Variant naming or component structure beyond what's specified
* Adding new components that don't exist in the codebase
* Adding new screens, removing screens, or restructuring routes
* Changing colors, typography, or any visual specifics from the live app
* Replacing Lucide with a different icon library
* Choosing a different round-trip workflow than the one specified

## How to communicate during the build

* Show progress by sharing screenshots of pages as they complete
* For Phase 2 and 3, show one or two component examples in detail before building all of them — confirm the pattern is right before scaling
* For Phase 4, show the most-important three screens first; confirm fidelity before building the remaining 15
* If `figma-console` fails or shows unexpected behavior, stop and surface it — don't work around it silently
* If Code Connect setup hits issues, stop and check in — this is the linchpin and worth getting right
* If a phase takes more than two hours, stop

## What "done" looks like

* All six pages exist with correct structure
* All variables and text styles match the live app exactly
* All 11 primitive components are built with all variants
* All ~11 domain components are built using primitive instances
* All 18 screens are mirrored as frames using component instances and theme variables
* ViewSourcePill renders cyan in every theme mode (verify by switching modes on a Field-themed frame)
* Code Connect mappings exist for every primitive
* Selecting a primitive component in Figma Dev Mode shows real React code
* `FIGMA_DESIGN_SYSTEM.md` is in the repo and complete
* A new designer can open the Figma file, navigate cleanly, and understand what's where

When in doubt: the live app's visual design wins on what things look like, the codebase's conventions win on naming and structure, the voice guide wins on copy, and this prompt wins on workflow architecture.

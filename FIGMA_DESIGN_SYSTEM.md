# VIEW — Figma design system

Pairs the Figma file `view 2.0 design system` (key `iFAZNHve9yjvuls9pMcBlC`) with this codebase. Lets designers work in Figma against the same tokens, components, and copy that ship in production, with Code Connect surfacing real React on the right-hand panel of Dev Mode.

## Open the Figma file

[https://www.figma.com/design/iFAZNHve9yjvuls9pMcBlC/view-2.0-design-system](https://www.figma.com/design/iFAZNHve9yjvuls9pMcBlC/view-2.0-design-system)

Access is managed in Figma. Ask the file owner (`goonbo`) for view or edit access.

## File structure (six pages)

```
🎨 Tokens & Variables       — color/typography/radius/spacing reference
🧩 Primitive Components     — 14 primitives matching src/components/{ui,view}
🏗️  Domain Components        — 11 composites matching app surfaces
🖥️  Screens — Admin          — corporate-side route mirrors (8 routes)
👤 Screens — Employee       — employee-side route mirrors (3 routes)
🤝 Screens — Nonprofit      — nonprofit-side route mirrors (7 routes)
```

The Tokens, Primitive, and Domain pages exist today. The three Screens pages are scaffolded but empty — building them is a separate session.

## The token system

One variable collection (**Themes**) with three modes: **Operator**, **Blueprint**, **Field**. All UI variables have one value per mode; switching a frame's mode swaps every variable simultaneously. The codebase mirrors this via `[data-theme]` attribute scopes in `src/app/globals.css`.

| Folder | Variables | Mode-dependent? |
|---|---|---|
| `color/` | background, foreground, card, card-foreground, primary, primary-foreground, secondary, secondary-foreground, muted, muted-foreground, accent, accent-foreground, destructive, destructive-foreground, border, border-strong, input, ring, rose, rose-bg, rose-fg, amber, amber-bg, amber-fg, emerald, emerald-bg, emerald-fg, view-source, view-source-bg, view-source-fg | Most yes — `primary` flips cyan→emerald in Field; `border` strengthens in Blueprint; `rose/amber/emerald` are stable across modes; `view-source/*` is **always cyan, in every mode** (load-bearing exception) |
| `radius/` | none, sm, md, lg, full | Yes — Blueprint generously rounded (10/16), Operator+Field dense (4/6/8) |
| `spacing/` | 0, 0-5, 1, 1-5, 2, 2-5, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24 | No — same in all modes (4px base scale) |
| `font-size/` | xs, sm, base, lg, xl, 2xl, 3xl, 4xl, 5xl, 6xl | No |
| `font-weight/` | light, normal, medium, semibold, bold | No |

### The view-source exception

`color/view-source`, `color/view-source-bg`, `color/view-source-fg` are **always cyan**, in every mode including Field. This is intentional and load-bearing. ViewSourcePill is the visible expression of the bidirectional architecture — cyan reads as "from VIEW" inside the Field workspace where emerald is local. If these tokens become mode-dependent, the strategic point of the primitive collapses.

### Naming convention

Lowercase, slash-delimited folders, kebab-case within (`color/primary-foreground`, `radius/md`, `spacing/2-5`). Matches Tailwind's CSS variable conventions and the React `className` semantics.

> **Figma name limitation:** Figma rejects dots in variable names, so half-step spacing values are named `spacing/0-5`, `spacing/1-5`, `spacing/2-5` instead of `0.5/1.5/2.5`.

## Typography

Three text styles families, set up as Figma text styles (16 total):

```
text/display/xl        Fraunces  60pt italic     — Blueprint hero
text/display/lg        Fraunces  36pt italic     — Blueprint section
text/display/md        Inter     32pt 600        — Operator hero
text/heading/{xl,lg,md,sm}  Inter  24/20/16/14pt 600
text/body/{lg,md,sm,xs}     Inter  16/14/13/12pt 400
text/body/lead         Fraunces  18pt italic 300 — lead paragraphs
text/caption/{md,sm}   Inter  12/11pt 500
text/meta/mono         JetBrains Mono 12pt 400  — IDs, timestamps
text/meta/mono-sm      JetBrains Mono 10pt 500
```

> **Font substitution:** the codebase uses **Inter Tight** (loaded via `next/font/google`). Figma desktop ships with **Inter** but not Inter Tight, so the file's text styles use Inter as a substitute. Same hierarchy, same weight scale, slightly looser tracking on the Figma side. Designers who want pixel parity can install Inter Tight from Google Fonts and Figma will pick it up.

## Component mapping

The Figma file's primitive components map 1-to-1 with React components in this repo. Code Connect (Phase 5) wires them up so designers see real JSX in Dev Mode.

### Primitives — `src/components/ui/`

| Figma component | React file | Variants |
|---|---|---|
| Button | `button.tsx` | default / destructive / outline / secondary / ghost / link |
| Badge | `badge.tsx` | default / secondary / destructive / outline |
| Card | `card.tsx` | default / soft / ai / outlined (visual variants — applied via className) |
| Input | `input.tsx` | (states only — focus / disabled / error are HTML attrs) |
| Label | `label.tsx` | — |
| Tabs | `tabs.tsx` | default / line |
| Avatar | `avatar.tsx` | initials / image |
| Separator | `separator.tsx` | horizontal / vertical |
| Tooltip | `tooltip.tsx` | — |

### Primitives — `src/components/view/`

| Figma component | React file | Variants |
|---|---|---|
| Pill | `Pill.tsx` | neutral / sage / terracotta / amber / rose. Sage and terracotta alias to `--primary` (cyan in Operator/Blueprint, emerald in Field). |
| ReadinessTag | `ReadinessTag.tsx` | strong / solid / closer-look / limited / not-assessed |
| ViewSourcePill | `ViewSourcePill.tsx` | default / sm — always cyan via `view-source/*` tokens |
| PageHeader | `PageHeader.tsx` | title size flips per scope via `--page-heading-*` tokens (56px Fraunces in Blueprint, 30px Inter elsewhere) |
| LoadingSteps | `LoadingSteps.tsx` | step states pending / active / done |
| AIBlock | `AIBlock.tsx` | the cyan halo + sparkle eyebrow Card variant |
| TopNav | `TopNav.tsx` | workspace derived from pathname (admin / employee / nonprofit) |

### Domain composites — `src/components/admin/` + the 7 composites built in route pages

The Domain Components page in Figma includes 11 composites: AIBlock, Mutual fit panel, Pipeline strip, At-risk diagnosis, Recap document section, DemandSignalsPanel, Reconciliation queue, Volunteer profile card, Corporate partner card, Pending request card, Quarterly review section.

**Code Connect coverage:** primitives are wired (15 mapping files in `src/components/{ui,view}/*.figma.tsx`). Domain composites are NOT wired by default — Code Connect's benefit/effort ratio is lower for one-off composites that compose primitives. The relevant React surfaces for each composite are documented in the Figma component descriptions.

## Code Connect setup

Installed via `pnpm add -D @figma/code-connect` (1.4.4 at time of setup). Configuration at `figma.config.json` at the repo root:

```json
{
  "codeConnect": {
    "include": ["src/components/**/*.figma.tsx"],
    "label": "VIEW",
    "parser": "react"
  }
}
```

### How the mappings work

For each primitive, a `[ComponentName].figma.tsx` sibling file declares the mapping:

```tsx
// src/components/ui/button.figma.tsx
import figma from "@figma/code-connect";
import { Button } from "./button";

figma.connect(
  Button,
  "https://www.figma.com/design/iFAZNHve9yjvuls9pMcBlC/.../?node-id=5-439",
  {
    props: {
      variant: figma.enum("Variant", {
        Default: "default", Destructive: "destructive", /* … */
      }),
      children: figma.string("Label"),
    },
    example: ({ variant, children }) => (
      <Button variant={variant}>{children}</Button>
    ),
  },
);
```

Designers in Figma's Dev Mode panel see the rendered JSX example and the import statement when they select a primitive instance. Engineers (or Claude Code) reading an updated Figma file know exactly which React component to update.

### Verifying the mappings

```bash
npx figma connect parse
```

prints the parsed mapping payload for each `.figma.tsx` file. A passing run means all 16 files are syntactically valid and ready to publish.

### Publishing to Figma

```bash
FIGMA_ACCESS_TOKEN=<your-token> npx figma connect publish
```

Pushes the mappings to Figma's Code Connect service. Tokens come from Figma settings → Personal access tokens. **Note:** publishing requires write access to the Figma file.

## MCP choice — `figma-console`, not the official Dev Mode MCP

The original prompt committed to Figma's official Dev Mode MCP Server. This workspace uses **`figma-console`** instead — the Figma Console plugin's MCP, a third-party but functionally-equivalent tool that's already configured here.

The two differ in distribution channel (official MCP from Figma vs plugin-based MCP from Figma Console) but overlap heavily on functional capability for variable, component, and screen creation. The MCP choice is documented here so future readers understand why; if and when the official Dev Mode MCP is configured for this workspace, the Code Connect setup is independent — no migration needed for the published mappings.

## The design → code workflow

Once the Figma file is set up and Code Connect is wired, the ongoing workflow looks like this:

1. **Designer makes changes in Figma** — edits a component's spacing, changes a token value, proposes a new screen, revises a copy string.
2. **Designer comments on the file** describing what they changed and why. Or, more rigorously, opens a "design proposal" branch in Figma if the team uses Figma branches.
3. **Engineer or product person opens Claude Code** with a prompt like:
   > The Figma file at [url] has been updated by [designer]. Read the changes against the current state of the code repo, and propose code changes that match. Show me a diff before applying anything.
4. **Claude Code reads the Figma file** via `figma-console`, identifies the changes, proposes code edits, and shows a diff.
5. **The diff is reviewed by a human** (designer + engineer + product), refined as needed, and merged into the codebase.
6. **The Figma file is updated** to reflect the merged code state if any changes were made during review.

This is the realistic round-trip: asynchronous, human-mediated, requires a translation step. It's also reliable, defensible, and produces clean code that matches conventions.

A separate Claude Code prompt (`CLAUDE-CODE-PROMPT-FIGMA-SYNC.md`) handles the design→code step. It will be written after the Figma file is fully populated (when Phase 4 — screen mirroring — is also done) so there's a real before-state to compare against.

## What's still missing

- **Phase 4 — screen mirroring.** All 18 routes need to be mirrored as Figma frames on the three Screens pages, each using component instances and the correct theme mode. This is a substantial chunk of focused work and is a separate session.
- **`figma connect publish` run.** Mappings are written and parse cleanly; pushing them to Figma's Code Connect service requires a Figma access token in `FIGMA_ACCESS_TOKEN`. Once published, designers see real React on the Dev Mode panel.
- **Domain component Code Connect mappings.** Optional. The 11 domain composites in `src/components/admin/` and the route pages are documented via Figma component descriptions but don't have `.figma.tsx` mappings. Add them if a designer's working primarily inside one of these composites and wants the Dev Mode JSX preview.

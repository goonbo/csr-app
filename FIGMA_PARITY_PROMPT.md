# VIEW — Claude Code prompt: bring Figma screens to prod parity

You're picking up Phase 4 of the VIEW Figma export. The Figma file's tokens, primitives, and domain components are done. Three priority screens (`/`, `/partners/[id]`, `/events/new`) exist but **do not match the live React app**. Your job is to close that gap, then build the remaining 15 screens at the same fidelity.

This document is self-contained. Read it once end-to-end before touching anything.

## Where things are

- **Code repo:** `goonbo/csr-app`. Already on `main` after Phases 5 + 6 merged.
- **Worktree:** `/Users/hanley.yu/Documents/view prototype/.claude/worktrees/shadcn-rebuild` — has the latest production code on `main` plus a feature branch `claude/figma-screens-priority` for in-flight Figma-related doc changes.
- **Reference worktree (live app):** `/Users/hanley.yu/Documents/view prototype/.claude/worktrees/festive-chandrasekhar-8ba42a` — same code, different worktree. Used as the source-of-truth for "what does prod look like."
- **Figma file:** `view 2.0 design system`, file key `iFAZNHve9yjvuls9pMcBlC`. URL: https://www.figma.com/design/iFAZNHve9yjvuls9pMcBlC/view-2.0-design-system
- **Reference docs at the repo root** (read these):
  - `FIGMA_DESIGN_SYSTEM.md` — the system overview, the `view-source` exception, the `primary-soft` workaround.
  - `FIGMA_EXPORT_PROMPT.md` — the original Figma export spec.
  - `REBUILD_HANDOFF.md` — the rebuild context (theme system, naming conventions, primitives).
  - `COPY_AUDIT.md` — voice & language pass log (use the in-product copy verbatim, never paraphrase).

## Tooling

- **`figma-console` MCP** — third-party Figma plugin MCP, already configured. Lets you read/write the Figma file from Claude Code via `figma_execute`, `figma_capture_screenshot`, `figma_setup_design_tokens`, etc. The official Dev Mode MCP is not configured; this is the substitute.
  - **Verify connection first** before any Figma work: call `figma_get_status` with `probe: true`. If `transport.active === "none"`, ask the user to reopen "Figma Desktop Bridge" plugin in Figma Desktop (Plugins → Development → Figma Desktop Bridge). Wait ~3 seconds, then re-probe.
  - **The plugin disconnects regularly** — every long execute call risks the connection. Plan to retry on disconnects.
- **`mcp__Claude_Preview__preview_*` tools** — start the live React app to compare. The shadcn rebuild dev server is configured in the festive worktree's `.claude/launch.json` as `next-dev-shadcn` on port 3100. The festive worktree's reference dev server is `next-dev` on port 3000. Either one works as the "what should the screen look like" reference, since the rebuild is now on `main`.

## What's already in the Figma file

Six pages. The first three are populated and correct. The last three are scaffolded and partially populated.

| Page | State |
|---|---|
| 🎨 Tokens & Variables | Complete. `Themes` collection with three modes (Operator / Blueprint / Field). 33 color variables, 33 numerics, 16 text styles. Visual reference page shows every color × mode + every type style. |
| 🧩 Primitive Components | Complete. 14 component sets: Button, Pill, ReadinessTag, ViewSourcePill, Badge, Card, Input, Label, Tabs, Avatar, Separator, Tooltip, LoadingSteps, PageHeader, TopNav. Each binds to theme variables. |
| 🏗️ Domain Components | Complete. 11 composites: AIBlock, Mutual fit panel, Pipeline strip, At-risk diagnosis, Recap document section, DemandSignalsPanel, Reconciliation queue, Volunteer profile card, Corporate partner card, Pending request card, Quarterly review section. |
| 🖥️ Screens — Admin | **3 of 8 screens partially built (`/`, `/partners/[id]`, `/events/new`). They don't match prod — see below.** Remaining: `/partners`, `/events`, `/events/[id]`, `/events/[id]/recap`, `/reports`. |
| 👤 Screens — Employee | Empty. Needs: `/me`, `/me/opportunities`, `/me/profile`. |
| 🤝 Screens — Nonprofit | Empty. Needs: `/np`, `/np/volunteers`, `/np/volunteers/[id]`, `/np/partners`, `/np/partners/[id]`, `/np/donations`, `/np/recap/[eventId]`. |

## The three priority screens that need fixes

The first cut showed the structural skeleton but missed real prod content. **Open the live app at http://localhost:3100 (start `next-dev-shadcn` if needed) and walk through each route alongside the Figma frame. Pull copy and structure verbatim from prod.**

### `/` admin home

Currently in Figma: TopNav, PageHeader, 2×2 attention card grid, Pipeline strip.

**What's missing or wrong:**
- **DemandSignalsPanel** ("What your people are signaling" section with three cause-by-signal-strength rows + the cyan drift-signal callout below the rankings) — the domain component exists in `🏗️ Domain Components`, drop an instance.
- **"Recruiting now" section** — list of recruiting events with capacity bars, pulled from the live page's right side.
- **Year-so-far KPI rail** — three KPI tiles in the right column (volunteer hours, participating, active partners) with the "1 needs a hello" sub-line.
- **Attention card descriptions** — the descs I used are slightly paraphrased; the live app uses different wording. Pull verbatim.
- **Attention card icon mapping** — verify which Lucide icon each card actually uses in code (`src/app/(admin)/page.tsx`); the at-risk + awaiting + approval icons may need swapping.

### `/partners/[id]`

Currently in Figma: Mutual fit panel + partial Partner overview Card.

**What's missing:**
- **The "Practical bits" Card** below Partner overview (group size, lead time, background checks, what to wear, accessibility) — six dt/dd entries.
- **Full Partner overview detail sections**: Financial health, "Why this readiness" expandable detail with border-l-2 primary, "Other formats considered" with 3 alternative cards (Skills-based engagement / Unrestricted grant only / No activation this quarter), each with a fit pill (Possible / Worth considering / Not this partner) and a reason paragraph.
- **Right rail**: the prod sidebar has Primary contact, Status, plus the "Plan an event with them" CTA — verify the data shown matches the live partner detail page.

### `/events/new`

Currently in Figma: input state only — header, "In your own words" textarea card, "What you'll get back" hint.

**What's missing:**
- **The post-AI-generation state**: after the user clicks "Plan this with me," the page shows 5 editable outputs (capacity reasoning, Slack post, all-hands email, manager note, internal brief). Each is its own AIBlock instance with a Regenerate button. This is the actual demo moment — build a separate frame for the post-plan state.
- **The AI loading state** between input and post-plan — LoadingSteps inside an AI banner Card. ~3s sequence.

## How to do the parity work

**For each screen:**

1. **Open the live page in the browser.** Use `mcp__Claude_Preview__preview_eval` to navigate `next-dev-shadcn` (port 3100) to the route. Screenshot via `mcp__Claude_Preview__preview_screenshot`.
2. **Read the React source.** Each route has a single page file (e.g., `src/app/(admin)/page.tsx`, `src/app/(admin)/partners/[id]/page.tsx`). Read it. The seed data behind each page is in `src/lib/seed/`.
3. **Build the Figma frame to match.**
   - Use existing component instances from the Figma `🧩 Primitive Components` and `🏗️ Domain Components` pages where possible. Don't rebuild from scratch.
   - For domain composites that already exist in the file (DemandSignalsPanel, Pipeline strip, Mutual fit panel, etc.), the most efficient move is **drop an instance** rather than recreating from primitives.
   - Pull copy verbatim from the React source / seed data — never paraphrase.
   - Apply the correct mode (Operator / Blueprint / Field) on the screen frame via `setExplicitVariableModeForCollection`.
4. **Capture and compare.** Screenshot the Figma frame and the live React page. Diff visually. Iterate up to 3× per screen, then move on.

## Build constraints (read carefully)

- **Don't change tokens.** All variable values were locked in Phase 1 with care. The `primary-soft` workaround is documented; don't add more.
- **Don't change primitive components.** The 14 primitives in `🧩 Primitive Components` map to React components 1:1 via Code Connect mappings in `src/components/{ui,view}/*.figma.tsx`. If you change the Figma component, the Code Connect mapping breaks.
- **Don't change domain components.** Same reason.
- **Build screens via component INSTANCES**, not detached layers. Designers will edit instances; if you nest detached children, the design system breaks.
- **Pull copy verbatim from the React code.** No paraphrasing, no Lorem Ipsum.
- **Use the `primary-soft/-fg/-border` tokens for primary-tinted surfaces.** Don't try `bound("color/primary", 0.10)` — Figma's paint normalization strips the opacity.
- **Set `textAutoResize = "HEIGHT"` and `layoutSizingHorizontal = "FILL"`** on body paragraphs in vertical auto-layout containers. Without this, long text overflows the right edge.
- **Apply the right theme mode** on each screen frame:
  - Operator: `/`, `/partners*`, `/events*` (except recap), `/reports` (it gets Blueprint via wrapper inside), `/me*` (Operator chrome)
  - Blueprint scope: wrap inside a frame with `data-theme="blueprint"` mode for `/reports`, `/events/[id]/recap`, `/np/recap/[eventId]`. The H1 sizing tokens (`--page-heading-*`) flip automatically for these.
  - Field: `/np*` (except recap, which is Blueprint inside Field — nested mode override)

## Practical gotchas

1. **Plugin disconnects.** The Figma Desktop Bridge plugin loses connection regularly. Always probe before a session and after long execute calls. If disconnected, ask the user to reopen the plugin in Figma.
2. **Font loading.** Every script that creates text needs to call `figma.loadFontAsync({ family, style })` for every (family, style) pair before creating text. Do it at the top of every `figma_execute` block.
3. **`description` is COMPONENT-only.** Setting `frame.description = "..."` throws "object is not extensible." Set descriptions only on Components / ComponentSets.
4. **`layoutSizingHorizontal = "FILL"`** must be called AFTER the child has been appended to its auto-layout parent. Calling it before throws.
5. **`figma.setCurrentPageAsync`** instead of `figma.currentPage = ...`. The latter throws on documentAccess: dynamic-page.
6. **Figma rejects dots in variable names.** Half-step spacings are named `spacing/0-5`, `1-5`, `2-5`.
7. **Inter substitutes for Inter Tight.** Inter Tight isn't installed on Figma Desktop; Inter is the fallback the file uses.
8. **Bound-paint opacity is silently stripped.** Use `primary-soft` tokens instead of opacity-on-primary.
9. **`figma.createNodeFromSvg`** lets you import Lucide SVG strings without the Lucide plugin UI. After creating, walk the children and bind strokes to a color variable. Lucide icons are 24×24 stroke-based.
10. **Branches.** Phase 5 + 6 merged in PR #4. There's a branch `claude/figma-screens-priority` with the doc update for `primary-soft`. For Phase 4 work, branch off `origin/main` again. Don't reuse the priority branch for the broader Phase 4 sweep.
11. **Inputs and shadcn primitives that resist binding.** Tabs `variant="line"` — the underline lives on `[data-active]:after:opacity-100`, not on a child. The Figma instance doesn't auto-render the underline. Build a manual underline rectangle if needed.

## What "done" looks like

For Phase 4:

- All 18 screens exist as 1440-wide frames on the three Screens pages.
- Each frame's content matches the live React route end-to-end (copy, layout, accent colors, theme mode).
- Each frame uses INSTANCES of primitives + domain composites, not detached layers.
- ViewSourcePill renders cyan in every theme mode (verify by switching the screen frame's mode).
- Body paragraphs wrap correctly (no right-edge clipping).
- Lucide icons throughout (no unicode glyph stand-ins except `←` / `→` in breadcrumbs and trailing arrows where the parent layout doesn't support a sibling icon).
- A new designer can open the file, navigate cleanly, and find every prod surface.

When all 18 are done, stop and check in. The next phase after Phase 4 is the design→code workflow setup (`CLAUDE-CODE-PROMPT-FIGMA-SYNC.md` — write that after Phase 4 is complete).

## Phase 4 build order (re-pasted from the original spec)

Build in priority order — most-architecturally-complex first, so the rhythm is locked before easier screens:

1. `/` admin home — fix per the gaps above
2. `/partners/[id]` — fix per the gaps above
3. `/events/new` — add the post-plan state + loading state
4. `/events/[id]/recap` — Blueprint-themed exec recap document
5. `/np` nonprofit workbench — Field theme, mirrors the corporate-side workbench but for Maria
6. `/np/recap/[eventId]` — Blueprint inside Field; mirrors `/events/[id]/recap` from Maria's POV
7. `/events/[id]` — at-risk diagnosis, day-of command center, options-on-the-table
8. `/reports` — Blueprint-themed quarterly review
9. `/np/partners/[id]` — pending request card; the cyan halo screen showcase
10. `/partners` admin partner directory
11. `/events` admin event list with stage tabs
12. `/np/partners` corporate partner list
13. `/np/volunteers` volunteer pool list
14. `/np/volunteers/[id]` volunteer profile
15. `/np/donations` cash + in-kind tabs
16. `/me` employee home with VTO ring
17. `/me/opportunities` opportunities grid
18. `/me/profile` "My impact" view

If a single screen takes more than 90 minutes, stop and check in.

## Resume checklist

1. `cd /Users/hanley.yu/Documents/view prototype/.claude/worktrees/shadcn-rebuild`
2. `git fetch origin && git checkout -b claude/figma-screens-phase4 origin/main`
3. Read `FIGMA_DESIGN_SYSTEM.md`, `FIGMA_EXPORT_PROMPT.md`, this file.
4. Verify Figma plugin connection: call `figma_get_status` with `probe: true`. If disconnected, ask user to reopen the plugin.
5. Verify dev server: call `mcp__Claude_Preview__preview_list`. Start `next-dev-shadcn` if needed.
6. Walk through `/` in the browser. Read `src/app/(admin)/page.tsx`. Identify the gap between Figma and prod.
7. Fix the `/` Figma frame. Screenshot. Compare. Iterate up to 3×, then move on.
8. Repeat for `/partners/[id]`, then `/events/new`, then the rest in priority order.
9. After every 3-4 screens or every ~90 minutes, stop and check in with the user.
10. When all 18 are done, open a PR.

The discipline that makes this go fast: pull verbatim from prod. Don't invent.

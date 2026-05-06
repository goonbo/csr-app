# shadcn rebuild — session handoff

Picking up the rebuild from a clean context. Started 2026-05-06. **Phases 4–5 complete.** Next: Phase 6 (Figma export readiness).

## Where things live

- Repo: `github.com/goonbo/csr-app`
- Branch: `claude/shadcn-rebuild` (off `main`)
- Worktree: `/Users/hanley.yu/Documents/view prototype/.claude/worktrees/shadcn-rebuild`
- **Reference worktree** (current product, source of truth): `.claude/worktrees/festive-chandrasekhar-8ba42a` — post-merge equivalent of `main`. Read original page files from there to plan each rebuild.

## Dev / verification setup

- `pnpm` is not on PATH. Use `corepack pnpm` for `install`/`add`.
- shadcn CLI shells out to bare `pnpm` — for `shadcn add` commands, prepend `/tmp/pnpm-shim` to PATH. The shim is one line:
  ```bash
  mkdir -p /tmp/pnpm-shim && cat > /tmp/pnpm-shim/pnpm <<'EOF'
  #!/usr/bin/env bash
  exec corepack pnpm "$@"
  EOF
  chmod +x /tmp/pnpm-shim/pnpm
  ```
- Preview server: festive worktree's `.claude/launch.json` has a `next-dev-shadcn` entry that bash-cd's into the shadcn-rebuild worktree and runs `npx next dev --port 3100`. From inside any agent session, use `mcp__Claude_Preview__preview_start` with name `next-dev-shadcn`.
- **Never `rm -rf .next` while the dev server is running** — it crashes. Stop the server, then clean.
- Verification recipe per route: read source → write rebuild → `npx tsc --noEmit` → `npx eslint src` → `PORT=3110 npx next build` → browser screenshot at `localhost:3100/...` → commit with section-by-section message → `git push`.

## What's done

### Phases 1–3 (foundation + primitives)

- **Phase 1** (`2bd095e`): Theme scopes in `globals.css` (oklch values, three `[data-theme]` blocks); root `layout.tsx` with Inter Tight + Fraunces + JetBrains Mono via `next/font/google`; `/swatches` test page.
- **Phase 2** (`ec38e33`): 30 shadcn primitives in `src/components/ui/`. `<TooltipProvider>` + `<Toaster />` (sonner) wrap children in root layout.
- **Phase 3** (`43c0b77`): 7 view/ domain primitives in `src/components/view/`: Pill, PageHeader, AIBlock, LoadingSteps, ReadinessTag, ViewSourcePill, TopNav. `/sandbox` page renders every variant.

### Phase 4 — routes (18 of 18 ✅)

| # | Route | Theme | Commit |
|---|---|---|---|
| 1 | `/` admin home | Operator | `97b4429` |
| 2 | `/partners/[id]` | Operator | `1df3582` |
| 3 | `/events/new` AI plan flow | Operator | `c3c1552` |
| 4 | `/events/[id]/recap` exec recap | Blueprint | `73f6666` |
| 5 | `/np` nonprofit workbench | Field | `7f148e3` |
| 6 | `/events/[id]` event detail | Operator | `7d150d7` |
| 7 | `/np/recap/[eventId]` | Blueprint inside Field | `eb81c57` |
| 8 | `/reports` quarterly review | Blueprint | `8ceb36d` |
| 9 | `/np/partners/[id]` with pending request | Field | `3954b4d` |
| 10 | `/partners` admin list | Operator | `ef696e8` |
| 11 | `/events` admin list with stage tabs | Operator | `11a4ba3` |
| 12 | `/np/volunteers/[id]` profile | Field | `0934980` |
| 13 | `/np/volunteers` list with source filter | Field | `a6263fc` |
| 14 | `/np/partners` list with health/source border | Field | `bf5635d` |
| 15 | `/np/donations` cash + in-kind tabs | Field | `68dc087` |
| 16 | `/me` employee home (incl. `(employee)/layout.tsx`) | Operator | `bf9329f` |
| 17 | `/me/opportunities` discover grid | Operator | `10523a1` |
| 18 | `/me/profile` "Your impact" | Operator | `0466bcd` |

### Foundation fixes shipped during Phase 4

- **`fix(theme): make --view-source-foreground readable on muted bg`** (`2886695`) — repurposed the token from near-white to deep cyan oklch(0.43 0.13 222). Saturated `bg-view-source` icon dots switched to explicit `text-white` (10 sites). Swatches demo split into saturated + muted rows so it tells the truth about how the tokens pair.
- **`fix(theme): drop auto bg fill on [data-theme] wrappers`** (`db65b85`) — removed the `[data-theme="blueprint"], [data-theme="field"], [data-theme="operator"] { background: var(--background) }` rule that was painting Blueprint pages as a contained mist rectangle inside operator chrome. Route-group layouts already paint `bg-background` on their root, so the auto-fill was redundant. Blueprint identity now carried by typography (Fraunces) and ring-bounded white cards on the parent surface.

### Phase 5 — Parity audit (complete ✅)

Side-by-side audit of all 18 routes against the festive reference
worktree. The dominant drift was that the festive worktree aliases
`C.sage` / `C.terracotta` / `C.sageDeep` / `C.terracottaDeep` (and
their `*Glow` variants) to `var(--accent)` and friends — which in
operator/blueprint scope is cyan and in field is emerald. The
rebuild had been using literal Tailwind emerald palette classes
everywhere, which read as drift on operator/blueprint surfaces.

Fixed (commits in chronological order):
* `7a85e03` — `/partners/[id]` Fit-panel cyan border-top + Blueprint
  H1 tokens (`--page-heading-size/-weight/-tracking` per scope, set
  to 56px / 350 in Blueprint, 30px / 600 elsewhere). PageHeader's
  H1 now consumes the vars via inline style.
* `f9bb890` — `Pill` `tone="terracotta"` switched to primary tinted;
  ditto for `(admin)/events/[id]` Day-of-Command Center + Review
  Queue borders/eyebrows; `(admin)/events/[id]/recap` ValueCard
  collapsed to single primary tone (both "us" + "them" use
  `border-t-primary text-primary`); `DemandSignalsPanel` drift
  signal ribbon switched from orange to primary tinted.
* `8f6bf5c` — VTORing emerald stroke → primary; `/me` "+Nh above"
  emerald → primary; `/me/opportunities` SignUpButton emerald →
  primary, capacity bar emerald → primary, Match pill emerald →
  primary; `/me/profile` italic clause + 88px gradient avatar +
  active cause pill + Heart logged pill all emerald → primary;
  `/np/volunteers` "Imported" + "Inactive" chips dropped uppercase.
* `4ebceff` — `Pill tone="sage"` + `ReadinessTag tone="sage"` both
  switched to `bg-primary/10 text-primary border-primary/30`; KPI
  positive trends + AtRiskOptions sage dot + StageNote confirmed
  border + supply-check icons + "On site" labels + reconciliation
  buttons + numbered dots in NextItem (recap) and reports — all
  emerald → primary.

Held back as intentional improvements (not parity drift):
* DemandSignalsPanel trend color split — `up` = emerald-600 stays;
  `emerging` = orange-600 stays. Reference collapses both to cyan,
  but the original code intent was differentiation. Color +
  trend-icon together communicate the signal more clearly than the
  collapsed cyan.
* Blueprint surface — auto bg-fill on `[data-theme]` wrappers
  removed in Phase 4 (`db65b85`); Blueprint pages now sit on the
  parent operator/field surface with white cards instead of the
  legacy contained mist rectangle. Editorial register is still
  carried by typography (Fraunces) and ring-bounded cards.

### Phase 6 — Figma export readiness
- Verify `components.json` setup is correct
- Test shadcn-Figma MCP export for at least: Button, Card, Badge, Tabs, Pill, ReadinessTag
- Fix any naming/structure issues that surface

## Hard rules (shadcn discipline)

These are non-negotiable. Re-read before writing any new file.

1. **Semantic Tailwind classes only**. `bg-primary`, `text-muted-foreground`, `border-border`. Never `bg-[#...]`, never `bg-[${var}]`.
2. **`cn()` for every className**, even single-class ones.
3. **Inline `style={{}}` only for dynamic values** — progress widths, cause gradients (`backgroundImage: cs.gradient`), nothing else. Color, spacing, typography go through Tailwind.
4. **No `C.*` token references**. The legacy proxy is gone.
5. **shadcn primitives in `components/ui/` don't get edited.** Specialization happens in `components/view/` wrappers.
6. **shadcn variant names stay shadcn.** Button: `default | destructive | outline | secondary | ghost | link`. Don't fork.
7. **Domain components**: PascalCase, single named export, CVA for variants, JSDoc at top, `data-slot` attribute for Figma connector. Props via interface (not type alias).

## Theme system

- **3 scopes** via `[data-theme]`: Operator (`:root` default), Blueprint, Field. All values in **oklch**, not HSL.
- **Route group layouts** set the theme:
  - `(admin)/layout.tsx` → `data-theme="operator"`
  - `(employee)/layout.tsx` → `data-theme="operator"` (create when needed)
  - `(nonprofit)/layout.tsx` → `data-theme="field"`
- **Blueprint scope** is per-page: wrap the page content in `<div data-theme="blueprint">`. Used on `/reports`, `/events/[id]/recap`, `/np/recap/[eventId]`. Inside Field, this still works — CSS-var cascade resolves to the closer scope.
- `--heading-family` per theme: `var(--font-sans)` for Operator + Field, `var(--font-serif)` for Blueprint. The PageHeader's `font-heading` class auto-flips.
- `--view-source` is **cyan in every theme** — the load-bearing "foreign here" mark used by ViewSourcePill.

## Legacy → shadcn mapping

When porting a page, these are the substitutions:

| Legacy | shadcn |
|---|---|
| `<Card ai>` | `<Card className="bg-view-source-muted/40 ring-view-source/30">` |
| `<Card soft>` | `<Card className="bg-muted/40">` |
| `<Button variant="ai">` | shadcn default Button + `<Sparkles className="size-4" />` icon |
| `<Button variant="primary">` | shadcn `default` |
| `<Button variant="accent">` | shadcn `default` (cyan in Operator/Blueprint, emerald in Field — same hierarchy intent) |
| `<Button variant="soft">` | shadcn `outline` |
| `<Button variant="ghost">` | shadcn `ghost` |
| `borderTop: '3px solid var(--rose)'` | `border-t-4 border-t-rose-500` |
| `borderTop: '3px solid var(--terracotta-deep)'` | `border-t-4 border-t-orange-500` |
| `var(--rose-bg) / var(--rose-fg)` | `bg-rose-50 text-rose-900` (or `text-rose-700` for less weight) |
| `var(--amber-bg) / var(--amber-fg)` | `bg-amber-50 text-amber-900` |
| `var(--sage-glow) / var(--sage-deep)` | `bg-emerald-50 text-emerald-800` |
| `'var(--font-h1), sans-serif'` | `font-heading` class |
| `<Pill tone="rose">` etc. | unchanged — `Pill` view primitive ports cleanly |
| `<ReadinessTag tag={...}>` | unchanged |
| `<ViewSourcePill partner={...}>` | unchanged |
| `<LoadingSteps steps={...} idx={ai.stepIdx}>` | unchanged (renamed `onRegen` → `onRegenerate` on AIBlock) |
| `useAILoad(steps, ms)` | unchanged |

## Recurring patterns

- **AI flows**: `useAILoad(STEPS, totalMs)` returns `{ active, stepIdx, start, reset }`. Mount with `useEffect(() => ai.start(() => setData(SEED)), [])` for auto-flows; trigger via button onClick for opt-in flows.
- **Card avatar with cause-color gradient**: cause gradient is genuinely dynamic per cause — the *only* place inline `style={{ backgroundImage: cs.gradient }}` is acceptable. Everything else is Tailwind.
- **Sticky bottom action bars**: `<div className="sticky bottom-4 z-10 mt-4"><Card className="p-4 shadow-lg">…three Buttons…</Card></div>`
- **Numbered list items**: `<div className="flex size-7 items-center justify-center rounded-full bg-emerald-50 font-heading text-xs font-bold text-emerald-800">{n}</div>`
- **Tone-tinted left-border cards**: `<Card className="border-l-4 border-l-{tone}-500 p-4">…`
- **Confidence pills inline**: see AtRiskDiagnosis in `(admin)/events/[id]/page.tsx` — class lookup keyed on `'high' | 'medium' | 'low'`.
- **Color-coded conversation log**: left-border is primary if author === "Maria Velasquez" (or whoever the user is), border-strong otherwise. See `(nonprofit)/np/partners/[id]/page.tsx`.

## Gotchas

- **`tsc --noEmit` may report stale `.next/types/validator.ts`** errors referencing deleted files. Stop dev server, `rm -rf .next`, retry.
- **`shadcn add form` is empty in the radix-nova preset.** Pull from default style URL: `pnpm dlx shadcn@latest add https://ui.shadcn.com/r/styles/default/form.json`. CLI rewrites import paths automatically.
- **`next/image` was serving with `Content-Disposition: attachment`** for `/view-logo.png` — fall back to plain `<img>` for static logos. Already done in `view/TopNav.tsx`.
- **Time-aware values**: use `useSyncExternalStore` for time-of-day greetings (admin home) to avoid SSR hydration mismatch.
- **Two themes nested**: `(nonprofit)` layout sets Field; recap pages wrap in Blueprint inside that. Verified at DOM level: `themes: ["field", "blueprint"]`. CSS-var cascade resolves to the closer scope.
- **Edge case in the `(nonprofit)/np/partners/[id]` rebuild**: I used `bg-view-source-muted/40 ring-view-source/30` for the pending-request Card outer. The inner cyan callout uses `border-view-source/40 bg-view-source-muted/60`. The two together create the visual "AI block within an AI block" treatment.

## File map (current)

```
src/
  app/
    (admin)/
      layout.tsx                              ✅
      page.tsx                                ✅ #1
      partners/[id]/page.tsx                  ✅ #2
      partners/page.tsx                       ✅ #10
      events/[id]/page.tsx                    ✅ #6
      events/[id]/recap/page.tsx              ✅ #4 Blueprint
      events/new/page.tsx                     ✅ #3
      events/page.tsx                         ✅ #11
      reports/page.tsx                        ✅ #8 Blueprint
    (employee)/
      layout.tsx                              ✅ Operator
      me/page.tsx                             ✅ #16
      me/opportunities/page.tsx               ✅ #17
      me/profile/page.tsx                     ✅ #18
    (nonprofit)/
      layout.tsx                              ✅ Field
      np/page.tsx                             ✅ #5
      np/donations/page.tsx                   ✅ #15
      np/partners/[id]/page.tsx               ✅ #9
      np/partners/page.tsx                    ✅ #14
      np/recap/[eventId]/page.tsx             ✅ #7 Blueprint
      np/volunteers/[id]/page.tsx             ✅ #12
      np/volunteers/page.tsx                  ✅ #13
    layout.tsx                                ✅ root: fonts + TooltipProvider + Toaster
    globals.css                               ✅ 3 oklch theme scopes
    sandbox/page.tsx                          ✅ phase 3 demo
    swatches/page.tsx                         ✅ phase 1 verification
  components/
    ui/                                       ✅ 30 shadcn primitives
    view/                                     ✅ 7 domain primitives
      Pill.tsx PageHeader.tsx AIBlock.tsx
      LoadingSteps.tsx ReadinessTag.tsx
      ViewSourcePill.tsx TopNav.tsx
    admin/DemandSignalsPanel.tsx              ✅ used in /
  lib/                                        ✅ all carry over from main
    types.ts seed/ format.ts cause.ts
    useAILoad.ts utils.ts
```

## Resume checklist for next session

1. `cd .claude/worktrees/shadcn-rebuild && git pull`
2. `corepack pnpm install` (in case lockfile changed)
3. Read this file
4. Phases 4–5 are complete. **Move on to Phase 6 (Figma export readiness).**

For Phase 5 the recipe was: start both dev servers (`next-dev` for
festive on :3000, `next-dev-shadcn` for rebuild on :3100), navigate
each URL on both, screenshot, and `getComputedStyle()` any element
whose color looked off. The dominant drift turned out to be one
class of issue — emerald-as-cyan literal classes — which is now
captured in the domain primitives (`Pill` / `ReadinessTag`) so
future routes inherit the right behavior automatically.

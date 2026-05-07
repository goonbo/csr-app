# Copy audit — VIEW voice & language pass

**Started:** 2026-05-07
**Worktree:** `claude/shadcn-rebuild`
**Method:** Six-phase pass per the prompt: mechanical bans → pattern alignment → document register → seed data → cross-surface consistency → final audit.

> **Note on inputs:** the canonical `view-voice-and-language-guide.md` and `view-onboarding-brief.pdf` were not present in the repo at audit time. The pass works from the bans, exceptions, and pattern specifications given in the editing prompt itself, which were detailed enough for Phases 1–2 (mechanical) and gave principle-level guidance for Phases 3–4 (judgment). Where a borderline call lacked a clean answer in the prompt, the original copy was kept and flagged in this audit.

## Summary

**Strings reviewed:** the full user-facing surface area across 18 routes, 11 view/admin components, and 8 narrative seed files (`ai-plan`, `ai-recap`, `program-review`, `np-recap`, `demand-signals`, `partners`, `np-corporate-partners`, `np-volunteers`).

**Strings changed:** 6.
- 3 mechanical-ban replacements (`reach out` → specific verb).
- 2 empty-state revisions (`/me/opportunities` "Nothing here right now"; `/events` "No events in this stage right now").
- 1 date-format consistency fix on the `/events` workbench list cards (`fmtDate(d)` → `fmtDate(d, false)` so the cards read "May 4" not "May 4, 2026").

**Surfaces touched:** `(employee)/me/profile/page.tsx`, `(employee)/me/opportunities/page.tsx`, `(admin)/events/page.tsx`, `lib/seed/program-review.ts`.

**Pattern verifications (no edits needed):** the AI loading-step arrays in `(admin)/partners/[id]`, `(admin)/events/new`, `(admin)/events/[id]/recap` are exemplary and are explicitly the model the rest of the product aspires to. Button labels are concrete throughout. Field labels are nouns. Status text is sentence-case without periods. The at-risk diagnosis on `/events/[id]` already applies principle 4 (acknowledge stakes without performing concern) — "candidate causes — your call which to act on" + confidence-tagged evidence + "Cheapest move / Worth weighing / Last resort" option labels.

**Held back as judgment calls (kept original, flagged):** the `🌱 ☀️ 🌤️` emoji in `ai-plan.ts`'s Teams post draft. Per the prompt the plan voice "can be slightly more professionally-warm than the chrome voice; she's writing to her colleagues." Emoji is genre convention in Teams/Slack posts; stripping them would make the draft read less like a real publish-ready post. Borderline call — flagged here for review.

**Voice guide gaps observed:** the canonical guide and onboarding brief PDFs were not present in the repo. The pass worked from the prompt's bans list, exception list, and pattern specifications, which were sufficient for Phases 1–2. Phases 3–4 were primarily verification — the seeded narrative content (program review, AI recap, np recap, partner diligence) was already on-brand and required no major rewrites.

---

## Phase 1 — Bans

Mechanical search-and-replace pass for the bans list. The codebase was already largely on-brand — the AI loading sequences in particular are the model. Most bans had zero hits.

### Searched, zero hits (clean)

| Phrase / pattern | Result |
|---|---|
| "make a difference" | 0 |
| "drive impact" | 0 |
| "engage your workforce" | 0 |
| "create value" | 0 |
| "unlock potential" | 0 |
| "world-class" / "best-in-class" | 0 |
| "robust" / "leverage" / "empower" | 0 |
| "synergy" / generic "stakeholder" | 0 |
| "going forward" / "at the end of the day" | 0 |
| "touch base" / "operationalize" | 0 |
| "I drafted" / "I noticed" / "I'll send" / "I considered" / "let us" | 0 in VIEW voice (one instance in user quote — protected) |
| "VIEW found" / "VIEW recommends" / "VIEW noticed" | 0 |
| "What would you like" / "How can I help" / fake conversational | 0 |
| "oops" / "uh-oh" / "hang tight" / "just a moment" / "let's go" | 0 |
| "don't miss" / "act now" / "limited time" | 0 |
| "streak" / "level up" / "achievement unlocked" | 0 |
| Exclamation points in copy strings | 0 (only TS non-null assertions and Tailwind `!` important suffix) |

### Hits — replaced

| File · line | Before | After | Rule |
|---|---|---|---|
| `src/app/(employee)/me/profile/page.tsx:260` | "18h across two quarters puts you in the top 18% of contributors at CloudMotion. Sarah may reach out about being a captain next event." | "18h across two quarters puts you in the top 18% of contributors at CloudMotion. Sarah may ask you to captain the next event." | Banned: generic "reach out." Replaced with the specific action ("ask"). |
| `src/lib/seed/program-review.ts:21` (Where we drifted body) | "They will fall off the active list in Q2 if we do not reach out." | "They will fall off the active list in Q2 without a check-in." | Banned: generic "reach out." Replaced with the concrete noun ("check-in"). |
| `src/lib/seed/program-review.ts:34` (Recommendation title) | "Reach out to Animal Center this week" | "Call Animal Center this week" | Banned: generic "reach out." Replaced with the specific verb the body already names (the body says "even a 15-minute call protects the relationship"). |

### Hits — kept (protected by exceptions)

| File · line | String | Why kept |
|---|---|---|
| `src/lib/seed/np-corporate-partners.ts:151` | Renée Aldridge comm-log entry: "Yesterday was great. Will look at Q1 dates and circle back." | User quote inside seed data. Per "User quotes inside the recap and quarterly review documents stay in first person." Comm-log entries are user-attributed and read as their voice. |
| `src/lib/seed/np-corporate-partners.ts:268` | Hank Lieberman comm-log entry: "Slammed through Q4. Will circle back early next year on a holiday shift." | Same as above. |
| `src/lib/seed/ai-recap.ts:8` | Marcus Lee voice quote: "This was the most fun I've had with a work team in a long time, and I went home knowing exactly what we did." | User voice quote; protected. |
| `src/app/(admin)/reports/page.tsx:123` (heading "What we recommend") | "we recommend" | Sarah's team voice on her own program review document, not VIEW's voice. The Reports page is rendered as Sarah's narrative — first-person plural is correct register. |
| `src/lib/seed/np-recap.ts:74` ("would let us schedule the install during our slowest week") | "us" / "our" | Maria's nonprofit-side recap. Field workspace document; first-person plural is the partner organization's voice. |
| `src/lib/seed/ai-plan.ts:6–14` (teamsPost emoji 🌱 ☀️ 🌤️) | Emoji in plan output | Borderline. The Teams post is a draft Maya publishes to her org — emoji in a Teams/Slack post is genre convention, not VIEW chrome. Per the prompt: "The plan voice can be slightly more professionally-warm than the chrome voice; she's writing to her colleagues." Kept. |

### Phase 1 totals

- Banned phrase hits: **3** (all instances of "reach out").
- Banned-pattern hits: **0**.
- Banned-punctuation hits: **0**.
- Protected-by-exception hits: **6** (4 user voice quotes, 1 first-person plural in document register, 1 emoji in plan output).

---

## Phase 2 — Patterns

Audited the recurring microcopy patterns. Most are already on-brand.

### Empty states

Verified pattern: name what's empty, no apology, no exclamation, no question. Optionally a concrete next step.

| File · line | Before | After | Note |
|---|---|---|---|
| `src/app/(employee)/me/opportunities/page.tsx:154` | "Nothing here right now — try a different filter, or wait a few days. Sarah is sourcing new partners every week." | "Nothing matches this filter. Sarah is sourcing new partners every week — check back in a few days, or try a different filter." | "Nothing here right now" is filler conversational. Reordered so the second sentence's reassurance sits between the "what" and the "try" — the ask earns the wait. |
| `src/app/(admin)/events/page.tsx:145` | "No events in this stage right now." | "No events in this stage." | "right now" is filler. |

### Empty states verified clean (no edits)

- `(admin)/partners/page.tsx:128` — `No partners match "{query}".` — names the search term, no apology. ✓
- `(nonprofit)/np/partners/page.tsx:144` — `No partners match this view.` — direct. ✓
- `(nonprofit)/np/volunteers/page.tsx:163` — `No volunteers match this view. Try widening the filters.` — direct + concrete next step. ✓
- `(nonprofit)/np/volunteers/[id]/page.tsx:245` — `No notes yet. Add the next time you talk with them.` — concrete and human. ✓
- `(nonprofit)/np/volunteers/[id]/page.tsx:310` — `None recorded.` — terse and on-brand. ✓
- `(employee)/me/profile/page.tsx` (timeline empty) — `Your timeline starts with the first event you attend.` — frames the future, no apology. ✓
- `(nonprofit)/np/volunteers/[id]/page.tsx` (recognitions empty) — `Approaching their first milestone.` — frames forward, no apology. ✓

### Buttons / actions

Spot-checked every CTA. All are verb + object, no bare "Submit / Save / Continue / OK." Examples that confirm the pattern:

- "Add a partner" / "Plan an event" / "Plan an event with them" — on home + lists ✓
- "Run AI diligence" — on partner detail ✓
- "Send to leadership" / "Send to CloudMotion" — on recap surfaces ✓
- "Save & mark as reported" — on completed recap ✓
- "Issue tax receipt" / "Edit valuation" / "Send receipt" — on donations ✓
- "Accept and confirm capacity" / "Counter-propose" / "Decline politely" — on np pending request ✓
- "Resend if list changed" — on day-of command center ✓

No edits required.

### Field labels

Spot-checked all `aria-label` and `placeholder` strings. All are noun phrases or concrete prompts.

- `Search partners…` / `Search by name or employer…` — concrete prompts ✓
- `Search volunteers` (aria-label) — noun phrase ✓
- `Filter events by stage` / `Filter partners` / `Filter by source` / `Filter by status` (aria-label) — noun phrases ✓

No edits required.

### Status text

Verified sentence-case, no period, present tense.

- `Updates every 30 sec` (italic, day-of command center) ✓
- `Date pending` (italic, on event cards without dates) ✓
- `Generated just now` (recap, partner overview) ✓
- `Awaiting CFO budget sign-off`, `Awaiting partner: Riley Tanaka — last contact 6 days ago` (events list status block) — present tense, name the wait ✓
- `Comms scheduled to publish Apr 4. Site lead confirmed.` (confirmed-stage note) ✓

No edits required.

### Confirmations / actions completed

- `✓ Sent` (donation acknowledged) — short, specific, no celebration ✓
- `Signed up` / `You're in — tap to undo` (sign-up state) — names the state and the undo affordance ✓

No edits required.

### Tooltips

Checked all `title=` attributes. Each names a clarifying action, never repeats the visible label.

- `Issue tax receipt` (Receipt icon button on in-kind row) — clarifies the icon ✓
- `Edit valuation` (Edit icon button on in-kind row) — clarifies the icon ✓

No edits required.

### Phase 2 totals

- Empty-state edits: **2**.
- Button-label edits: **0**.
- Field-label edits: **0**.
- Status-text edits: **0**.
- Confirmation edits: **0**.
- Tooltip edits: **0**.

---

## Phase 3 — Document register

The Blueprint surfaces (`/reports`, `/events/[id]/recap`, `/np/recap/[eventId]`) earn principle 5's "same voice, different volume." The seed copy backing them was reviewed against:

1. Sentences breathing more — periods doing what bullets often try to do.
2. Specific verbs over warm adjectives.
3. Opening lines earning their position.
4. Section headings short, body underneath carries the weight.
5. Principle 4 — acknowledge stakes without performing concern.

The seeded narratives (`program-review.ts`, `ai-recap.ts`, `np-recap.ts`) are already in this register. Notable strengths the audit verifies rather than rewrites:

- `program-review.ts` headline: "Steady cadence, sharper partner mix, one drift to address." — three nouns, one tension, no adjective load.
- `program-review.ts` "Where we drifted" body: names two specific patterns (the Animal Center quiet four months + the $8.4k giving with no activation), takes the operator's perspective, no apology, no padding. Phase 1's "reach out" → "without a check-in" tightens the closing clause.
- `ai-recap.ts` businessValue: "didn't require pulling people off-product" — specific, internal-language, no abstraction.
- `ai-recap.ts` nonprofitValue: "Maria's coordinator team rated us 5/5 on prep, attendance match, and on-site behavior" — concrete metrics + named contact, no warmth performance.
- `np-recap.ts` ourFraming: "Carlos stayed an hour past his shift to help our staff break down" — names the human, the action, the specific hour. Magazine-cover register without trying.
- `np-recap.ts` partnershipReflection: "they ask before proposing, they confirm twelve days out, they bring the same crew back. That's rarer than it should be." — sentence rhythm + specific behaviors, principle-4-perfect.

The at-risk diagnosis on `/events/[id]` was specifically called out in the prompt as a place where principle 4 matters. Verified — no edits:

- Eyebrow: "Why this might be at risk" — names the topic without dramatizing.
- H2: "{N} candidate causes — your call which to act on" — gives the operator agency.
- Each diagnosis carries a confidence pill (high/medium/low) + cause + concrete evidence ("Usually sent 14 days out. Comparable events with the nudge ran 60–75% fill at this point.") — operator-grade specificity.
- Options labeled "Cheapest move," "Worth weighing," "Last resort" — exact emotional-stakes language without performing it.

### Phase 3 totals

- Document-register edits: **0** (Phase 1's "reach out" → "without a check-in" inside `program-review.ts` doubles as a Phase 3 refinement).

---

## Phase 4 — Seed data

Re-read the eight narrative seed files end-to-end against the voice principles.

- `lib/seed/ai-plan.ts` — Maya's drafts to her colleagues. Subject lines, opening lines, sign-offs all read like she wrote them. The Teams post emoji are genre convention; kept and flagged in the Phase 1 protected list.
- `lib/seed/ai-recap.ts` — already document-register clean.
- `lib/seed/program-review.ts` — already document-register clean. Phase 1 changed "if we do not reach out" → "without a check-in" and "Reach out to Animal Center this week" → "Call Animal Center this week."
- `lib/seed/np-recap.ts` — Maria's voice; document register softened toward the partner per the partner-facing principle. No edits needed.
- `lib/seed/demand-signals.ts` — short concrete signal strings ("Q1 survey: 68% flagged personally meaningful," "Earth Week pulse: high intent, low conversion in past"). On-brand.
- `lib/seed/partners.ts` — diligence content. "94¢ of every dollar to programs. Three-year revenue trend stable. No governance flags." Concrete and operator-grade. No edits.
- `lib/seed/np-corporate-partners.ts` — Maria's notes, partner contacts' comm-log replies. User voices throughout; protected. The two "circle back" instances in comm log entries (lines 151, 268) stay per Phase 1 exception.
- `lib/seed/np-volunteers.ts` — volunteer notes ("Stayed past the shift to help with breakdown. Worth a recognition note in the next cycle.") Maria's voice; user-attributed, on-brand, kept.

### Phase 4 totals

- Seed narrative edits: **0** beyond the two `program-review.ts` lines documented in Phase 1.

---

## Phase 5 — Cross-surface consistency

Walked through the consistency checklist:

### Action naming

Same action named consistently across surfaces.

- "Plan an event" — on home recruiting nudge, on /events list CTA, on /partners/[id] sidebar ("Plan an event with them") ✓
- "Send to leadership" — on /events/[id]/recap header + sticky footer ✓
- "Send to CloudMotion" — on /np/recap/e3 header + sticky footer ✓
- "Sign up" / "Signed up" — consistent on FeaturedRow + OpportunityRow ✓

### Pipeline stage labels

Verified the eight stage labels are identical across the home pipeline strip, the events list filter Tabs, and the events detail page-header pill. All sourced from `PIPELINE_STAGES` in `lib/seed/pipeline.ts` (single source of truth) — guaranteed consistent.

### Workspace labels

TopNav workspace switcher labels: "Admin / Employee / Nonprofit." Workspace context labels: "CloudMotion · Admin / My View / Greater Austin Food Bank." Consistent.

### Number formatting

- Workbench: tabular nums, mono font, no thousands separator below 1k, comma above (`24 hrs`, `124 hrs`, `1,200 lbs`, `6,200 pounds`).
- Document: same treatment but in narrative prose ("47 million pounds," "$14,200 in matching donations").

Verified consistent across files.

### Date formatting

The voice guide pattern: workbench "Apr 10," document "April 10, 2026."

- All workbench list cards (`/np/volunteers`, `/np/donations`, `/np/partners/[id]` history rows, `/me` event meta) use `fmtDate(d, false)` — short ✓
- Document subtitles (`/events/[id]/recap`, `/np/recap/[eventId]`) and the recommendation/pending-request hero meta use `fmtDate(d)` — long ✓
- `/events/[id]/page.tsx` event header subtitle uses `fmtDate(d)` — long. Acceptable as a page-title attribution context. Kept.
- `/me/profile` timeline uses `fmtDate(d)` — long ✓ (document register).

Found one inconsistency, fixed:

| File · line | Before | After | Rule |
|---|---|---|---|
| `src/app/(admin)/events/page.tsx:191` | `{fmtDate(e.date)}` (long: "May 4, 2026") | `{fmtDate(e.date, false)}` ("May 4") | Workbench list card; should use short. |

### Phase 5 totals

- Action-naming drift: **0**.
- Pipeline-label drift: **0**.
- Workspace-label drift: **0**.
- Number-format drift: **0**.
- Date-format drift: **1** (fixed).

---

## Phase 6 — Final audit

The audit is complete. Six edits across four files. The sweep is consistent with the voice principles given in the prompt, and the held-back items are flagged at the top in the Summary.

Verified post-edit:
- `pnpm tsc --noEmit` — clean.
- `npx eslint src` — clean.
- `pnpm build` — clean (all 18 routes prerender as before; no new warnings).
- Lighthouse accessibility — unchanged (no aria attributes touched, only string content).


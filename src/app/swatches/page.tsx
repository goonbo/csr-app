/**
 * Phase 1 swatch test — renders the shadcn token palette under each
 * of the three theme scopes side-by-side. Used to validate that the
 * theme variables resolve correctly through @theme inline before any
 * domain primitives go in.
 */
const TOKENS: { name: string; bg: string; fg: string }[] = [
  { name: "background",    bg: "bg-background",    fg: "text-foreground" },
  { name: "card",          bg: "bg-card",          fg: "text-card-foreground" },
  { name: "primary",       bg: "bg-primary",       fg: "text-primary-foreground" },
  { name: "secondary",     bg: "bg-secondary",     fg: "text-secondary-foreground" },
  { name: "muted",         bg: "bg-muted",         fg: "text-muted-foreground" },
  { name: "accent",        bg: "bg-accent",        fg: "text-accent-foreground" },
  { name: "destructive",   bg: "bg-destructive",   fg: "text-destructive-foreground" },
  { name: "view-source",       bg: "bg-view-source",       fg: "text-white" },
  { name: "view-source-muted", bg: "bg-view-source-muted", fg: "text-view-source-foreground" },
  { name: "border",        bg: "bg-border",        fg: "text-foreground" },
  { name: "ring",          bg: "bg-ring",          fg: "text-primary-foreground" },
];

const THEMES: { id: "operator" | "blueprint" | "field"; label: string; note: string }[] = [
  { id: "operator",  label: "Operator",  note: "Default · CloudMotion admin & employee · cyan brand action" },
  { id: "blueprint", label: "Blueprint", note: "Narrative pages · recap, reports · mist surface, generous radii" },
  { id: "field",     label: "Field",     note: "Nonprofit workspace · emerald brand action, cyan stays foreign for VIEW source" },
];

export default function SwatchesPage() {
  return (
    <main className="min-h-screen p-8 max-w-6xl mx-auto space-y-8">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          VIEW · shadcn rebuild · Phase 1 verification
        </p>
        <h1 className="font-sans text-3xl font-semibold tracking-tight">
          Theme swatches.
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
          Three themes, the shadcn token set under each. Each row should resolve
          a distinct color through the <code className="font-mono text-xs">@theme inline</code> block.
          The <span className="font-mono text-xs">view-source</span> token must read cyan on every theme — the
          load-bearing visual when nonprofit lists need to mark VIEW-sourced rows.
        </p>
      </header>

      {THEMES.map((theme) => (
        <section
          key={theme.id}
          data-theme={theme.id}
          className="rounded-lg border bg-background p-6 space-y-4"
        >
          <div className="flex items-baseline justify-between gap-4 flex-wrap">
            <div>
              <h2 className="font-sans text-xl font-semibold tracking-tight text-foreground">
                {theme.label}
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                <code className="font-mono">[data-theme=&quot;{theme.id}&quot;]</code> · {theme.note}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="bg-primary text-primary-foreground rounded-md px-3 py-1.5 text-xs font-medium">
                Primary action
              </button>
              <button className="bg-secondary text-secondary-foreground rounded-md px-3 py-1.5 text-xs font-medium border border-border">
                Secondary
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {TOKENS.map((t) => (
              <div
                key={t.name}
                className={`${t.bg} ${t.fg} rounded-md border border-border p-3 h-20 flex flex-col justify-between text-[10px]`}
              >
                <span className="font-mono opacity-90">{t.name}</span>
                <span className="font-mono opacity-70">{t.bg.replace("bg-", "")}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <RadiusSample />
            <FontSample />
            <CauseTonesSample />
          </div>
        </section>
      ))}

      <footer className="text-xs text-muted-foreground pt-6 border-t border-border">
        Phase 1 verifies token plumbing. Domain primitives (Pill, AIBlock, ViewSourcePill) ship in Phase 2;
        full route rebuilds in Phase 4.
      </footer>
    </main>
  );
}

function RadiusSample() {
  return (
    <div className="rounded-md border border-border p-3 space-y-2 bg-card">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        Radius scale
      </p>
      <div className="flex items-end gap-2">
        <div className="bg-primary/15 rounded-sm h-8 w-8 border border-primary/30" title="rounded-sm" />
        <div className="bg-primary/15 rounded-md h-8 w-8 border border-primary/30" title="rounded-md" />
        <div className="bg-primary/15 rounded-lg h-8 w-8 border border-primary/30" title="rounded-lg" />
        <div className="bg-primary/15 rounded-xl h-8 w-8 border border-primary/30" title="rounded-xl" />
      </div>
    </div>
  );
}

function FontSample() {
  return (
    <div className="rounded-md border border-border p-3 space-y-1 bg-card">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        Type
      </p>
      <p className="font-sans text-sm text-foreground">Inter Tight · sans</p>
      <p className="font-serif text-sm text-foreground italic">Fraunces · serif</p>
      <p className="font-mono text-xs text-foreground">JetBrains Mono · 1234.56</p>
    </div>
  );
}

function CauseTonesSample() {
  return (
    <div className="rounded-md border border-border p-3 space-y-2 bg-card">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        Pill tones (Tailwind palette)
      </p>
      <div className="flex flex-wrap gap-1.5">
        <span className="inline-flex items-center rounded-full border bg-emerald-50 text-emerald-900 border-emerald-200 px-2 py-0.5 text-[10px] font-semibold">sage</span>
        <span className="inline-flex items-center rounded-full border bg-orange-50 text-orange-900 border-orange-200 px-2 py-0.5 text-[10px] font-semibold">terracotta</span>
        <span className="inline-flex items-center rounded-full border bg-amber-50 text-amber-900 border-amber-200 px-2 py-0.5 text-[10px] font-semibold">amber</span>
        <span className="inline-flex items-center rounded-full border bg-rose-50 text-rose-900 border-rose-200 px-2 py-0.5 text-[10px] font-semibold">rose</span>
        <span className="inline-flex items-center rounded-full border bg-muted text-muted-foreground border-border px-2 py-0.5 text-[10px] font-semibold">neutral</span>
      </div>
    </div>
  );
}

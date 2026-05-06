"use client";

/**
 * Phase 3 sandbox — every domain primitive in every variant under
 * each of the three themes. Used to confirm the seven primitives in
 * `src/components/view/` render correctly before any route rebuild.
 */

import { Sparkles, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Pill } from "@/components/view/Pill";
import { PageHeader } from "@/components/view/PageHeader";
import { AIBlock } from "@/components/view/AIBlock";
import { LoadingSteps } from "@/components/view/LoadingSteps";
import { ReadinessTag } from "@/components/view/ReadinessTag";
import { ViewSourcePill } from "@/components/view/ViewSourcePill";
import { TopNav } from "@/components/view/TopNav";
import type { ReadinessTagId } from "@/lib/types";

const PILL_TONES = ["neutral", "sage", "terracotta", "amber", "rose"] as const;
const READINESS_IDS: ReadinessTagId[] = [
  "strong",
  "solid",
  "closer-look",
  "limited",
  "not-assessed",
];

const LOADING_STEPS = [
  "Reading the brief…",
  "Pulling partner history…",
  "Synthesizing the recap…",
  "Polishing the language…",
];

const THEMES = [
  { id: "operator",  label: "Operator"  },
  { id: "blueprint", label: "Blueprint" },
  { id: "field",     label: "Field"     },
] as const;

export default function SandboxPage() {
  return (
    <main className="min-h-screen bg-muted/30">
      {/* Live TopNav at the top — its workspace derives from the URL,
          so /sandbox renders the cloudmotion-admin variant. */}
      <TopNav />

      <div className="max-w-6xl mx-auto p-8 space-y-8">
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            VIEW · shadcn rebuild · Phase 3 sandbox
          </p>
          <h1 className="font-heading text-3xl font-semibold tracking-tight">
            Domain primitives.
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Seven primitives in <code className="font-mono text-xs">src/components/view/</code>,
            each rendered in every variant under each of the three themes.
            ViewSourcePill must read cyan in all three sections — the
            load-bearing distinction.
          </p>
        </header>

        {THEMES.map((theme) => (
          <section
            key={theme.id}
            data-theme={theme.id}
            className="rounded-lg border bg-background p-6 space-y-8"
          >
            <h2 className="font-heading text-xl font-semibold tracking-tight">
              {theme.label}{" "}
              <span className="text-xs font-mono font-normal text-muted-foreground">
                [data-theme=&quot;{theme.id}&quot;]
              </span>
            </h2>

            {/* Pill */}
            <Block name="Pill" desc="Domain-tone variant of Badge.">
              <div className="flex flex-wrap gap-2">
                {PILL_TONES.map((tone) => (
                  <Pill key={tone} tone={tone}>{tone}</Pill>
                ))}
                <Pill tone="sage" icon={Sparkles}>with icon</Pill>
                <Pill tone="rose" icon={Heart}>cause</Pill>
              </div>
            </Block>

            {/* PageHeader */}
            <Block name="PageHeader" desc="Title block at the top of every screen.">
              <div className="rounded-md border border-border p-4 bg-card">
                <PageHeader
                  greeting="Good morning, Sarah"
                  title="Here's your week."
                  subtitle="What needs you today, where partners stand, and what's in motion."
                  action={<Button size="sm">Plan an event</Button>}
                />
                <p className="text-xs text-muted-foreground -mt-4">
                  H1 face flips automatically inside Blueprint scope (Fraunces serif).
                </p>
              </div>
            </Block>

            {/* AIBlock */}
            <Block name="AIBlock" desc="Card with cyan halo + sparkle eyebrow + optional regenerate.">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <AIBlock label="AI · draft recap">
                  <p className="text-sm leading-relaxed text-foreground">
                    Forty-four CloudMotion teammates joined the Tuesday distribution
                    crew on December 12 for the holiday rush. In three hours the line
                    moved 6,200 pounds of food.
                  </p>
                </AIBlock>
                <AIBlock label="AI · capacity-fit reasoning" onRegenerate={() => {}}>
                  <p className="text-sm leading-relaxed text-foreground">
                    CloudMotion has 47 confirmed signups for the April 10 sort shift
                    (78% fill). Their last three Saturday-morning food bank events
                    ran 88–94% attended. Recommend confirming for 60.
                  </p>
                </AIBlock>
              </div>
            </Block>

            {/* LoadingSteps */}
            <Block name="LoadingSteps" desc="Multi-step AI loading sequence.">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <div className="rounded-md border border-border p-4 bg-card">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                    idx = 2 (one active, two done, one pending)
                  </div>
                  <LoadingSteps steps={LOADING_STEPS} idx={2} />
                </div>
                <div className="rounded-md border border-border p-4 bg-card">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                    idx = 4 (all done)
                  </div>
                  <LoadingSteps steps={LOADING_STEPS} idx={4} />
                </div>
              </div>
            </Block>

            {/* ReadinessTag */}
            <Block name="ReadinessTag" desc="Five qualitative diligence outcomes.">
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {READINESS_IDS.map((id) => (
                    <ReadinessTag key={id} tag={id} />
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {READINESS_IDS.map((id) => (
                    <ReadinessTag key={`${id}-lg`} tag={id} size="lg" />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  By <code className="font-mono">score</code>:{" "}
                  <ReadinessTag score={5.2} />{" "}
                  <ReadinessTag score={4.0} />{" "}
                  <ReadinessTag score={3.0} />{" "}
                  <ReadinessTag score={1.5} />{" "}
                  <ReadinessTag score={null} />
                </p>
              </div>
            </Block>

            {/* ViewSourcePill — the load-bearing one */}
            <Block
              name="ViewSourcePill"
              desc="Cyan in every theme. In Field, where primary is emerald, the cyan reads as foreign."
            >
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <ViewSourcePill partner="CloudMotion" />
                  <ViewSourcePill partner="Bramble Health" />
                  <ViewSourcePill />
                  <ViewSourcePill label="auto-confirmed" hideIcon size="sm" />
                </div>
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="text-foreground">Marcus Lee</span>
                  <ViewSourcePill partner="CloudMotion" size="sm" />
                  <span className="text-muted-foreground">·</span>
                  <span className="text-foreground">Connie Albright</span>
                  <span className="rounded-full border border-border bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                    Imported
                  </span>
                </div>
              </div>
            </Block>
          </section>
        ))}

        {/* TopNav lives outside the per-theme sections — it's already at the top.
            The other six primitives all flex correctly under each theme via the
            data-theme cascade. */}
        <footer className="text-xs text-muted-foreground pt-6 border-t border-border">
          Phase 3 verifies the seven domain primitives. Phase 4 rebuilds all 18 routes.
        </footer>
      </div>
    </main>
  );
}

function Block({
  name,
  desc,
  children,
}: {
  name: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div>
        <h3 className="font-mono text-sm font-semibold text-foreground">{name}</h3>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      {children}
    </div>
  );
}

/**
 * DemandSignalsPanel — what employees are signaling, before any partner
 * is on the table. Per research, this is step 1 of the operator's
 * actual cycle: signals come in (causes by strength, ERG asks,
 * calendar moments, drift), then the operator plans against them.
 *
 * Used in the admin home workbench, between the attention queue and
 * the pipeline strip.
 */

import { Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { DEMAND_SIGNALS } from "@/lib/seed/demand-signals";
import { cn } from "@/lib/utils";

const trendIcon = (t: "up" | "steady" | "emerging"): string =>
  t === "up" ? "↗" : t === "emerging" ? "✦" : "→";

const trendColorClass = (t: "up" | "steady" | "emerging"): string =>
  t === "up"
    ? "text-emerald-600"
    : t === "emerging"
      ? "text-orange-600"
      : "text-muted-foreground";

export function DemandSignalsPanel() {
  return (
    <section className="mb-8" data-slot="demand-signals">
      <header className="mb-4 flex items-end justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            What your people are signaling
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            What we&rsquo;re seeing this quarter, before you plan.
          </p>
        </div>
        <span className="text-[11px] italic text-muted-foreground">
          Survey + giving + ERG asks · refreshed daily
        </span>
      </header>

      <Card className="overflow-hidden gap-0 py-0">
        {/* Top: ranked causes */}
        <div className="px-7 py-5">
          <div className="mb-3.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Causes by signal strength
          </div>
          <ul className="flex flex-col gap-3.5">
            {DEMAND_SIGNALS.causes.map((c) => (
              <li
                key={c.cause}
                className="flex items-start gap-4"
              >
                <div className="flex shrink-0 basis-[140px] items-baseline gap-2">
                  <span className="font-heading text-2xl leading-none text-foreground">
                    {c.strength}
                  </span>
                  <span className="text-[11px] text-muted-foreground">%</span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "ml-1 text-sm",
                      trendColorClass(c.trend),
                    )}
                  >
                    {trendIcon(c.trend)}
                  </span>
                  <span className="ml-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                    {c.trend}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 text-[13px] font-semibold text-foreground">
                    {c.cause}
                  </div>
                  <div className="text-[11px] leading-relaxed text-muted-foreground">
                    {c.sources.join(" · ")}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Mid: ERG asks + calendar moments */}
        <div className="grid grid-cols-1 border-t border-border md:grid-cols-2">
          <div className="border-b border-border px-6 py-4 md:border-b-0 md:border-r md:pl-7">
            <div className="mb-2.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              ERG asks pending
            </div>
            <ul className="flex flex-col gap-2">
              {DEMAND_SIGNALS.asks.map((a, i) => (
                <li key={i} className="text-xs leading-relaxed text-foreground">
                  <span className="font-semibold">{a.from}</span> · {a.what}
                  <span className="ml-1.5 italic text-muted-foreground">
                    {a.when}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="px-6 py-4 md:pr-7">
            <div className="mb-2.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Moments coming up
            </div>
            <ul className="flex flex-col gap-2">
              {DEMAND_SIGNALS.moments.map((m, i) => (
                <li key={i} className="text-xs leading-relaxed text-foreground">
                  <span className="font-semibold">{m.label}</span>
                  <span className="ml-1.5 text-muted-foreground">{m.when}</span>
                  <div className="mt-0.5 text-[11px] text-muted-foreground">
                    {m.note}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom: drift signal — the most operator-critical insight */}
        <div className="flex items-start gap-2.5 border-t border-orange-200 bg-orange-50 px-7 py-3.5">
          <Sparkles
            aria-hidden="true"
            className="mt-0.5 size-3.5 shrink-0 text-orange-700"
          />
          <p className="text-xs leading-relaxed text-orange-900">
            <span className="font-semibold">
              Drift signal · {DEMAND_SIGNALS.drift.partner}.
            </span>{" "}
            {DEMAND_SIGNALS.drift.note}
          </p>
        </div>
      </Card>
    </section>
  );
}

"use client";

/**
 * /reports — quarterly program review (Blueprint register).
 *
 * Editorial document. Wraps in `data-theme="blueprint"` so the H1
 * picks up Fraunces and the surface goes mist-white. Read top-to-
 * bottom: AI status banner, headline, by-the-numbers KPIs, plain
 * summary, narrative sections, trends, recommendations. Sticky
 * action bar at the bottom.
 */

import { useRouter } from "next/navigation";
import { Sparkles, Send, ChevronRight, Download } from "lucide-react";
import { PROGRAM_REVIEW } from "@/lib/seed/program-review";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pill } from "@/components/view/Pill";
import { PageHeader } from "@/components/view/PageHeader";

export default function ReportsPage() {
  const router = useRouter();
  const r = PROGRAM_REVIEW;

  return (
    <div data-theme="blueprint">
      <PageHeader
        greeting="Program review"
        title={r.quarter}
        subtitle="Prepared by Sarah Chen — narrative draft, ready for review."
        action={
          <Button onClick={() => router.push("/")}>
            <Send className="size-4" aria-hidden="true" />
            Send to leadership
          </Button>
        }
      />

      <div className="flex max-w-[920px] flex-col gap-4">
        {/* AI status banner */}
        <Card className="bg-view-source-muted/40 ring-view-source/30 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div
                aria-hidden="true"
                className="flex size-7 shrink-0 items-center justify-center rounded-full bg-view-source text-view-source-foreground"
              >
                <Sparkles className="size-3" />
              </div>
              <span className="text-[13px] leading-relaxed text-view-source-foreground">
                <span className="font-semibold">
                  Draft compiled from program data.
                </span>{" "}
                Numbers are calculated. The narrative is editable.
              </span>
            </div>
            <Pill tone="sage" icon={Sparkles}>AI-drafted narrative</Pill>
          </div>
        </Card>

        {/* Headline — the quarter's punchline */}
        <Card className="p-10">
          <div className="mb-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            The shape of the quarter
          </div>
          <p className="m-0 font-heading text-[30px] leading-tight tracking-tight text-foreground">
            {r.headline}
          </p>
        </Card>

        {/* By the numbers */}
        <Card className="p-7">
          <h2 className="mb-5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            By the numbers
          </h2>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {r.numbers.map((n, i) => (
              <KpiBlock key={i} value={n.n} label={n.l} sub={n.sub} />
            ))}
          </div>
        </Card>

        {/* Lead paragraph */}
        <Card className="p-8">
          <h2 className="mb-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            The summary, plain
          </h2>
          <p className="m-0 font-heading text-lg leading-relaxed text-foreground">
            {r.lead}
          </p>
        </Card>

        {/* Narrative sections */}
        {r.sections.map((s, i) => (
          <Card key={i} className="p-8">
            <h2 className="mb-3 text-base font-semibold text-foreground">
              {s.heading}
            </h2>
            <p className="m-0 text-sm leading-relaxed text-muted-foreground">
              {s.body}
            </p>
          </Card>
        ))}

        {/* Trends */}
        <Card className="p-8">
          <h2 className="mb-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Trends worth watching
          </h2>
          <p className="mb-4 text-xs italic text-muted-foreground">
            Where the demand signal is moving — what to scope next quarter.
          </p>
          <div className="flex flex-col gap-3.5">
            {r.trends.map((t, i) => (
              <TrendRow key={i} label={t.label} detail={t.detail} />
            ))}
          </div>
        </Card>

        {/* Recommendations */}
        <Card className="p-8">
          <h2 className="mb-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            What we recommend
          </h2>
          <p className="mb-4 text-xs italic text-muted-foreground">
            Concrete moves. Each one stands alone — pick the ones that fit.
          </p>
          <div className="flex flex-col gap-3">
            {r.recommendations.map((rec, i) => (
              <RecommendationItem
                key={i}
                index={i + 1}
                title={rec.title}
                body={rec.body}
              />
            ))}
          </div>
        </Card>

        {/* Sticky action bar */}
        <div className="sticky bottom-4 z-10 mt-4">
          <Card className="p-4 shadow-lg">
            <div className="flex flex-wrap items-center gap-3">
              <Button onClick={() => router.push("/")}>
                <Send className="size-4" aria-hidden="true" />
                Send to leadership
              </Button>
              <Button variant="outline">
                <Download className="size-4" aria-hidden="true" />
                Download PDF
              </Button>
              <Button variant="ghost" onClick={() => router.push("/")}>
                Save draft
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function KpiBlock({
  value,
  label,
  sub,
}: {
  value: string;
  label: string;
  sub: string;
}) {
  return (
    <div>
      <div className="mb-2 font-heading text-[38px] leading-none tabular-nums text-foreground">
        {value}
      </div>
      <div className="mb-0.5 text-xs font-semibold text-foreground">
        {label}
      </div>
      <div className="text-[11px] leading-snug text-muted-foreground">{sub}</div>
    </div>
  );
}

function TrendRow({ label, detail }: { label: string; detail: string }) {
  return (
    <div className="flex gap-3.5 border-l-2 border-border-strong pl-3.5">
      <div className="min-w-0 flex-1">
        <div className="mb-1 text-[13px] font-semibold text-foreground">
          {label}
        </div>
        <div className="text-[13px] leading-relaxed text-muted-foreground">
          {detail}
        </div>
      </div>
    </div>
  );
}

function RecommendationItem({
  index,
  title,
  body,
}: {
  index: number;
  title: string;
  body: string;
}) {
  return (
    <div className="flex gap-3.5 rounded-xl border border-border bg-card p-4">
      <div
        aria-hidden="true"
        className="flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-50 font-heading text-xs font-bold text-emerald-800"
      >
        {index}
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
          <h3 className="m-0 text-sm font-semibold text-foreground">{title}</h3>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded p-1 text-[11px] text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Add to plan <ChevronRight className="size-3" aria-hidden="true" />
          </button>
        </div>
        <p className="m-0 text-[13px] leading-relaxed text-muted-foreground">
          {body}
        </p>
      </div>
    </div>
  );
}

"use client";

/**
 * /np — Maria's nonprofit workbench (Field theme).
 *
 * The whole route group wraps in `data-theme="field"` (set by the
 * (nonprofit)/layout.tsx) — emerald primary, otherwise identical
 * to Operator. The cyan ViewSourcePills mark every row that flowed
 * in through a VIEW corporate partner; cyan reads as foreign here
 * because emerald is the local accent.
 */

import { useRouter } from "next/navigation";
import {
  AlertCircle, Sparkles, Award, ArrowRight, PackageCheck, ChevronRight,
} from "lucide-react";
import { fmtDate } from "@/lib/format";
import { NP_CORPORATE_PARTNERS } from "@/lib/seed/np-corporate-partners";
import { NP_VOLUNTEERS } from "@/lib/seed/np-volunteers";
import { NP_INKIND_DONATIONS, NP_CASH_DONATIONS } from "@/lib/seed/np-donations";
import { Card } from "@/components/ui/card";
import { Pill } from "@/components/view/Pill";
import { PageHeader } from "@/components/view/PageHeader";
import { ViewSourcePill } from "@/components/view/ViewSourcePill";
import { cn } from "@/lib/utils";

const PIPELINE_STAGES = [
  { id: "inquiring", label: "Inquiring" },
  { id: "scoping",   label: "Scoping" },
  { id: "confirmed", label: "Confirmed" },
  { id: "hosted",    label: "Hosted" },
  { id: "recapped",  label: "Recapped" },
] as const;

export default function NonprofitHomePage() {
  const router = useRouter();

  // --- Attention queue ---
  const partnersWithPending = NP_CORPORATE_PARTNERS.filter((p) => p.pendingRequest);
  const reconciliationCount = 3;
  const inkindToValue = NP_INKIND_DONATIONS.filter((d) => d.status === "received");
  const augusto = NP_VOLUNTEERS.find((v) => v.id === "nv-augusto-vega");

  const attentionCount =
    partnersWithPending.length +
    1 +
    inkindToValue.length +
    (augusto ? 1 : 0);

  // --- This month at a glance ---
  const monthStart = new Date("2026-04-01");
  const monthCash = NP_CASH_DONATIONS.filter(
    (d) => new Date(d.date) >= monthStart && d.amount > 0,
  );
  const viewMatchThisMonth = monthCash
    .filter((d) => d.source === "view-partner")
    .reduce((s, d) => s + d.amount, 0);
  const directThisMonth = monthCash
    .filter((d) => d.source !== "view-partner")
    .reduce((s, d) => s + d.amount, 0);

  const monthEvents = NP_CORPORATE_PARTNERS.flatMap((p) =>
    p.history
      .filter((h) => new Date(h.date) >= monthStart)
      .map((h) => ({ ...h, partner: p })),
  );
  const hoursThisMonth = monthEvents.reduce((s, h) => s + h.hours, 0);
  const viewHoursThisMonth = monthEvents
    .filter((h) => h.partner.source === "view-partner")
    .reduce((s, h) => s + h.hours, 0);
  const activationsThisMonth = monthEvents.length;

  const inkindThisMonth = NP_INKIND_DONATIONS.filter(
    (d) => new Date(d.receivedDate) >= monthStart,
  );
  const inkindThisMonthValue = inkindThisMonth.reduce(
    (s, d) => s + d.estimatedValue,
    0,
  );
  const inkindViewValue = inkindThisMonth
    .filter((d) => d.source === "view-partner")
    .reduce((s, d) => s + d.estimatedValue, 0);

  // --- Partner pipeline counts ---
  const pipelineCounts: Record<string, { count: number; partners: string[] }> = {
    inquiring: { count: 1, partners: ["CloudMotion · Q3 Reading Buddies"] },
    scoping:   { count: 1, partners: ["Bramble Health · weekday evenings"] },
    confirmed: { count: 1, partners: ["Travis Energy · May 10 Sort Shift"] },
    hosted:    { count: 2, partners: ["CloudMotion · Apr 10", "Travis Energy · Apr 2"] },
    recapped:  { count: 4, partners: ["CloudMotion · Dec 12", "Hill Country Bank · Mar 20", "Bramble Health · Apr 5", "Maverick Foods · Apr 15"] },
  };

  const recentlyActive = [...NP_VOLUNTEERS]
    .sort((a, b) => b.lastActive.localeCompare(a.lastActive))
    .slice(0, 6);

  const cardinal = NP_CORPORATE_PARTNERS.find((p) => p.id === "cp-cardinal");

  return (
    <div>
      <PageHeader
        greeting="Good morning, Maria"
        title="The week ahead."
        subtitle="What needs you today, where partners stand, and what your volunteers are up to."
      />

      {/* WHAT NEEDS YOU TODAY */}
      <section className="mb-8">
        <header className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">
            What needs you today
          </h2>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {attentionCount} items
          </span>
        </header>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {/* Pending requests */}
          {partnersWithPending.map((p) => {
            const r = p.pendingRequest!;
            return (
              <Card
                key={`pending-${p.id}`}
                role="button"
                tabIndex={0}
                onClick={() => router.push(`/np/partners/${p.id}`)}
                className="bg-view-source-muted/40 ring-view-source/30 cursor-pointer p-4 transition-shadow hover:ring-view-source/50"
              >
                <div className="flex items-start gap-3">
                  <div
                    aria-hidden="true"
                    className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700"
                  >
                    <Sparkles className="size-3.5" strokeWidth={2.4} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <Pill tone="sage">New proposal</Pill>
                      <ViewSourcePill partner={p.name} size="sm" />
                    </div>
                    <div className="mb-1 text-sm font-semibold text-foreground">
                      {p.name} proposes {r.proposedTitle}
                    </div>
                    <div className="text-xs leading-relaxed text-muted-foreground">
                      {fmtDate(r.proposedDate)} · {r.proposedTime} · {r.proposedCapacity} ppl
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}

          {/* Reconciliation queue */}
          <Card
            role="button"
            tabIndex={0}
            onClick={() => router.push("/np/volunteers")}
            className="cursor-pointer border-l-4 border-l-amber-500 p-4 transition-shadow hover:ring-foreground/15"
          >
            <div className="flex items-start gap-3">
              <div
                aria-hidden="true"
                className="flex size-8 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-700"
              >
                <AlertCircle className="size-3.5" strokeWidth={2.4} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <Pill tone="amber">Reconciliation</Pill>
                  <ViewSourcePill partner="CloudMotion" size="sm" />
                </div>
                <div className="mb-1 text-sm font-semibold text-foreground">
                  {reconciliationCount} CloudMotion volunteers signed up, no scan
                </div>
                <div className="text-xs leading-relaxed text-muted-foreground">
                  Daniel, Aisha, and Roman from the Apr 10 sort shift. Cross-check with VIEW check-in data.
                </div>
              </div>
            </div>
          </Card>

          {/* In-kind to value */}
          {inkindToValue.slice(0, 1).map((d) => (
            <Card
              key={`ik-${d.id}`}
              role="button"
              tabIndex={0}
              onClick={() => router.push("/np/donations")}
              className="cursor-pointer p-4 transition-shadow hover:ring-foreground/15"
            >
              <div className="flex items-start gap-3">
                <div
                  aria-hidden="true"
                  className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground"
                >
                  <PackageCheck className="size-3.5" strokeWidth={2.4} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <Pill tone="neutral">Receipt to issue</Pill>
                    {d.source === "view-partner" && (
                      <ViewSourcePill partner={d.donorName.split(" · ")[0]} size="sm" />
                    )}
                  </div>
                  <div className="mb-1 text-sm font-semibold text-foreground">
                    {d.description}
                  </div>
                  <div className="text-xs leading-relaxed text-muted-foreground">
                    {d.donorName} · ${d.estimatedValue.toLocaleString()} estimated value · received{" "}
                    {fmtDate(d.receivedDate, false)}
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {/* Recognition milestone */}
          {augusto && (
            <Card
              role="button"
              tabIndex={0}
              onClick={() => router.push(`/np/volunteers/${augusto.id}`)}
              className="cursor-pointer p-4 transition-shadow hover:ring-foreground/15"
            >
              <div className="flex items-start gap-3">
                <div
                  aria-hidden="true"
                  className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700"
                >
                  <Award className="size-3.5" strokeWidth={2.4} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <Pill tone="sage">Recognition</Pill>
                  </div>
                  <div className="mb-1 text-sm font-semibold text-foreground">
                    Augusto Vega just passed 25 events
                  </div>
                  <div className="text-xs leading-relaxed text-muted-foreground">
                    Quarterly recognition mailer goes out Friday. Hand-write this one.
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </section>

      {/* THIS MONTH AT A GLANCE */}
      <section className="mb-8">
        <h2 className="mb-4 text-sm font-semibold text-foreground">
          This month at a glance
        </h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <KpiCard
            label="Hours hosted"
            value={hoursThisMonth.toLocaleString()}
            unit="hrs"
            sublabel={`${viewHoursThisMonth} via VIEW partners · ${hoursThisMonth - viewHoursThisMonth} direct`}
            split={{ via: viewHoursThisMonth, direct: hoursThisMonth - viewHoursThisMonth }}
          />
          <KpiCard
            label="Corporate activations"
            value={activationsThisMonth.toString()}
            unit="events"
            sublabel="Across 5 partners — Apr 10 was the biggest"
          />
          <KpiCard
            label="In-kind value"
            value={`$${(inkindThisMonthValue / 1000).toFixed(1)}k`}
            sublabel={`$${(inkindViewValue / 1000).toFixed(1)}k via VIEW · $${((inkindThisMonthValue - inkindViewValue) / 1000).toFixed(1)}k direct`}
            split={{ via: inkindViewValue, direct: inkindThisMonthValue - inkindViewValue }}
          />
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3.5 text-[11px] text-muted-foreground">
          <span>
            Cash this month:{" "}
            <strong className="font-mono font-semibold text-foreground">
              ${(viewMatchThisMonth + directThisMonth).toLocaleString()}
            </strong>
          </span>
          <span>·</span>
          <span className="inline-flex items-center gap-1">
            <span aria-hidden="true" className="size-2 rounded-full bg-view-source" />
            <span>${viewMatchThisMonth.toLocaleString()} via VIEW match</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <span aria-hidden="true" className="size-2 rounded-full bg-primary" />
            <span>${directThisMonth.toLocaleString()} direct</span>
          </span>
        </div>
      </section>

      {/* CORPORATE PARTNER PIPELINE */}
      <section className="mb-8">
        <header className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Corporate partner pipeline
            </h2>
            <div className="mt-1 text-xs text-muted-foreground">
              Where the relationships stand right now.
            </div>
          </div>
          <button
            type="button"
            onClick={() => router.push("/np/partners")}
            className="rounded p-1 text-xs text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            See all partners →
          </button>
        </header>

        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <div className="min-w-[880px] px-4 py-5">
              <div className="flex items-stretch">
                {PIPELINE_STAGES.map((stage, i) => {
                  const data = pipelineCounts[stage.id];
                  const isLast = i === PIPELINE_STAGES.length - 1;
                  const filled = data.count > 0;
                  return (
                    <div key={stage.id} className="flex flex-1 items-stretch">
                      <div
                        className={cn(
                          "relative flex-1 rounded-md p-3.5 min-w-[144px]",
                          filled ? "bg-emerald-50" : "bg-muted opacity-60",
                        )}
                      >
                        <div
                          className={cn(
                            "mb-2 text-[10px] font-bold uppercase tracking-wider",
                            filled ? "text-emerald-800" : "text-muted-foreground",
                          )}
                        >
                          {stage.label}
                        </div>
                        <div
                          className={cn(
                            "mb-2 font-heading text-3xl font-semibold leading-none tabular-nums",
                            filled ? "text-emerald-800" : "text-muted-foreground",
                          )}
                        >
                          {data.count}
                        </div>
                        <div
                          className={cn(
                            "min-h-[26px] text-[10.5px] leading-relaxed opacity-85",
                            filled ? "text-emerald-800" : "text-muted-foreground",
                          )}
                        >
                          {data.partners.length > 0 ? data.partners[0] : "empty"}
                          {data.partners.length > 1 && ` +${data.partners.length - 1}`}
                        </div>
                      </div>
                      {!isLast && (
                        <div
                          aria-hidden="true"
                          className="flex shrink-0 items-center px-1 text-border-strong"
                        >
                          <ChevronRight className="size-3.5" strokeWidth={2.2} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* VOLUNTEER PULSE */}
      <section className="mb-8">
        <header className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Volunteer pulse
            </h2>
            <div className="mt-1 text-xs text-muted-foreground">
              Most recent activity ·{" "}
              {NP_VOLUNTEERS.filter((v) => v.status === "active").length} active
              in pool
            </div>
          </div>
          <button
            type="button"
            onClick={() => router.push("/np/volunteers")}
            className="rounded p-1 text-xs text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            See all volunteers →
          </button>
        </header>

        <Card className="overflow-hidden p-0">
          <div className="flex flex-col">
            {recentlyActive.map((v, i) => {
              const isLast = i === recentlyActive.length - 1;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => router.push(`/np/volunteers/${v.id}`)}
                  className={cn(
                    "grid items-center gap-4 px-5 py-3 text-left transition-colors hover:bg-muted/40",
                    "grid-cols-[1fr_200px_auto]",
                    !isLast && "border-b border-border",
                  )}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar name={v.name} />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[13px] font-semibold text-foreground">
                          {v.name}
                        </span>
                        {v.source === "view-partner" && v.employer && (
                          <ViewSourcePill partner={v.employer} size="sm" />
                        )}
                      </div>
                      <div className="mt-0.5 text-[11px] text-muted-foreground">
                        {v.employer ?? "Community volunteer"} · {v.totalHours}{" "}
                        hrs total
                      </div>
                    </div>
                  </div>
                  <div className="font-mono text-[11px] text-muted-foreground">
                    last active {fmtDate(v.lastActive, false)}
                  </div>
                  <ArrowRight
                    aria-hidden="true"
                    className="size-3.5 text-muted-foreground"
                  />
                </button>
              );
            })}
          </div>
        </Card>
      </section>

      {/* DRIFT SIGNAL */}
      {cardinal && (
        <Card
          role="button"
          tabIndex={0}
          onClick={() => router.push(`/np/partners/${cardinal.id}`)}
          className="cursor-pointer border-l-4 border-l-amber-500 bg-muted/40 p-4 transition-shadow hover:ring-foreground/15"
        >
          <div className="flex items-start gap-3">
            <div
              aria-hidden="true"
              className="flex size-8 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-700"
            >
              <Sparkles className="size-3.5" strokeWidth={2.4} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                  Drift signal
                </span>
                <ViewSourcePill partner="Cardinal Logistics" size="sm" />
              </div>
              <div className="mb-1 text-sm font-semibold text-foreground">
                Cardinal Logistics has scheduled three events with us this year — but never asked about our IT volunteer needs.
              </div>
              <div className="text-xs leading-relaxed text-muted-foreground">
                Renée mentioned at the August picnic that her ops team had bandwidth.
                The conversation has been quiet since November. Worth a check-in
                before the relationship cools further.
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

interface KpiCardProps {
  label: string;
  value: string;
  unit?: string;
  sublabel: string;
  split?: { via: number; direct: number };
}

function KpiCard({ label, value, unit, sublabel, split }: KpiCardProps) {
  const total = split ? split.via + split.direct : 0;
  const viaPct = total > 0 ? (split!.via / total) * 100 : 0;

  return (
    <Card className="p-5">
      <div className="mb-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="flex items-baseline gap-1 font-heading text-3xl font-semibold leading-none tracking-tight tabular-nums text-foreground">
        {value}
        {unit && (
          <span className="font-sans text-[13px] font-medium text-muted-foreground">
            {unit}
          </span>
        )}
      </div>
      {split && total > 0 && (
        <div
          aria-hidden="true"
          className="mt-2.5 flex h-1 overflow-hidden rounded-full bg-muted"
        >
          <div className="bg-view-source" style={{ width: `${viaPct}%` }} />
          <div className="flex-1 bg-primary" />
        </div>
      )}
      <div className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
        {sublabel}
      </div>
    </Card>
  );
}

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div
      aria-hidden="true"
      className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-[11px] font-semibold text-primary-foreground"
    >
      {initials}
    </div>
  );
}

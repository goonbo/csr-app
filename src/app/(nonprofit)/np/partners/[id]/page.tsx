"use client";

/**
 * /np/partners/[id] — corporate partner detail with pending request.
 *
 * Maria's view of a corporate partner relationship. The big
 * structural moment: the pending-request card, when present, shows
 * a proposal that originated in the partner's VIEW workspace
 * (capacity-fit reasoning attached) with Accept / Counter-propose /
 * Decline actions. That's the visible bidirectional-flow argument.
 */

import { use } from "react";
import { useRouter, notFound } from "next/navigation";
import {
  Mail, Sparkles, Calendar, Users, Check, MessageSquare,
} from "lucide-react";
import { fmtDate } from "@/lib/format";
import { NP_CORPORATE_PARTNERS } from "@/lib/seed/np-corporate-partners";
import type { CorporatePartner } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pill } from "@/components/view/Pill";
import { PageHeader } from "@/components/view/PageHeader";
import { ViewSourcePill } from "@/components/view/ViewSourcePill";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PartnerDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = use(params);
  const p = NP_CORPORATE_PARTNERS.find((x) => x.id === id);
  if (!p) notFound();

  return (
    <div>
      <PageHeader
        back="Back to partners"
        onBack={() => router.push("/np/partners")}
        greeting={p.industry}
        title={p.name}
      />

      {/* Identity row */}
      <Card className="mb-5 p-6">
        <div className="flex flex-wrap items-center gap-4">
          <Logo name={p.name} large />
          <div className="min-w-[240px] flex-1">
            <div className="mb-2.5 flex flex-wrap gap-2.5">
              {p.source === "view-partner" && <ViewSourcePill partner={p.name} />}
              <HealthPill health={p.relationshipHealth} />
              <span className="rounded-full border border-border bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                {p.yearsActive} year{p.yearsActive === 1 ? "" : "s"} together
              </span>
            </div>
            <div className="flex flex-wrap gap-4 text-[13px] text-muted-foreground">
              <a
                href={`mailto:${p.contactEmail}`}
                className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
              >
                <Mail className="size-3.5" aria-hidden="true" />
                {p.contactName} · {p.contactEmail}
              </a>
              <span>Last activity {fmtDate(p.lastActivityAt, false)}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Pending request — the load-bearing bidirectional-flow demonstration */}
      {p.pendingRequest && (
        <Card className="bg-view-source-muted/40 ring-view-source/30 mb-5 overflow-hidden p-0">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3.5">
            <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-view-source-foreground">
              <Sparkles className="size-3" aria-hidden="true" />
              New proposal · {p.name}&rsquo;s VIEW workspace
            </div>
            <ViewSourcePill partner={p.name} size="sm" />
          </div>

          <div className="p-5">
            <h2 className="m-0 mb-1.5 font-heading text-[22px] font-semibold leading-tight tracking-tight text-foreground">
              {p.pendingRequest.proposedTitle}
            </h2>
            <div className="mb-4 flex flex-wrap gap-4 text-[13px] text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="size-3.5" aria-hidden="true" />
                <strong className="font-semibold text-foreground">
                  {fmtDate(p.pendingRequest.proposedDate)}
                </strong>
                <span>· {p.pendingRequest.proposedTime}</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Users className="size-3.5" aria-hidden="true" />
                {p.pendingRequest.proposedCapacity} people
              </span>
              <span>{p.pendingRequest.cause}</span>
              {p.pendingRequest.vto && <Pill tone="neutral">VTO eligible</Pill>}
            </div>

            <div className="mb-4 rounded-md border border-view-source/40 bg-view-source-muted/60 p-4">
              <div className="mb-2 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-view-source-foreground">
                <Sparkles className="size-3" aria-hidden="true" />
                Capacity-fit reasoning · via VIEW
              </div>
              <p className="m-0 text-[13px] leading-relaxed text-muted-foreground">
                {p.pendingRequest.capacityFitReasoning}
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <Button>
                <Check className="size-4" aria-hidden="true" />
                Accept and confirm capacity
              </Button>
              <Button variant="outline">
                <MessageSquare className="size-4" aria-hidden="true" />
                Counter-propose
              </Button>
              <Button variant="ghost">Decline politely</Button>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-5">
          {/* Relationship summary */}
          <Card className="p-6">
            <h2 className="mb-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Relationship summary
            </h2>
            <div className="grid grid-cols-4 gap-4">
              <SummaryStat label="Years" value={p.yearsActive.toString()} />
              <SummaryStat label="Events hosted YTD" value={p.eventsHostedYtd.toString()} />
              <SummaryStat label="Hours YTD" value={p.hoursHostedYtd.toString()} />
              <SummaryStat
                label="Cash YTD"
                value={`$${(p.cashDonatedYtd / 1000).toFixed(1)}k`}
              />
            </div>

            <div className="mt-6">
              <div className="mb-2.5 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">
                Format mix
              </div>
              <FormatBar mix={p.formatMix} />
              <div className="mt-2.5 flex flex-wrap gap-3.5 text-[11px] text-muted-foreground">
                <LegendDot
                  className="bg-primary"
                  label={`Direct service · ${Math.round(p.formatMix.directService * 100)}%`}
                />
                <LegendDot
                  className="bg-view-source"
                  label={`Skills-based · ${Math.round(p.formatMix.skillsBased * 100)}%`}
                />
                <LegendDot
                  className="bg-border-strong"
                  label={`Grants only · ${Math.round(p.formatMix.grantsOnly * 100)}%`}
                />
              </div>
            </div>
          </Card>

          {/* Relationship history */}
          {p.history.length > 0 && (
            <Card className="p-6">
              <h2 className="mb-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Relationship history
              </h2>
              <div className="flex flex-col gap-4">
                {p.history.map((h) => (
                  <div
                    key={h.id}
                    className="grid grid-cols-[110px_1fr_auto] gap-4 border-b border-border pb-3.5 last:border-b-0 last:pb-0"
                  >
                    <div className="font-mono text-xs text-muted-foreground">
                      {fmtDate(h.date, false)}
                    </div>
                    <div>
                      <div className="mb-1 text-[13px] font-semibold text-foreground">
                        {h.title}
                      </div>
                      <div className="text-xs leading-relaxed text-muted-foreground">
                        {h.outputs}
                      </div>
                    </div>
                    <div className="text-right font-mono text-xs tabular-nums">
                      <div className="font-semibold text-foreground">
                        {h.attended} ppl
                      </div>
                      <div className="text-muted-foreground">{h.hours} hrs</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Conversation log */}
          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Conversation log
              </h2>
              <button
                type="button"
                className="text-xs font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                + Log a note
              </button>
            </div>
            <div className="flex flex-col gap-3.5">
              {p.commLog.map((c, i) => (
                <div
                  key={i}
                  className={cn(
                    "border-l-2 pl-3.5",
                    c.author === "Maria Velasquez"
                      ? "border-l-primary"
                      : "border-l-border-strong",
                  )}
                >
                  <div className="mb-1 font-mono text-[11px] text-muted-foreground">
                    {fmtDate(c.date, false)} · {c.author}
                  </div>
                  <div className="text-[13px] leading-relaxed text-foreground">
                    {c.body}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right rail */}
        <aside className="flex flex-col gap-4">
          <Card className="p-5">
            <h3 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              What they like
            </h3>
            <ul className="m-0 flex list-none flex-col gap-2 p-0">
              {p.preferences.map((pref, i) => (
                <li
                  key={i}
                  className="relative pl-3.5 text-[13px] leading-relaxed text-foreground"
                >
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-2 size-1 rounded-full bg-primary"
                  />
                  {pref}
                </li>
              ))}
            </ul>
            {p.source === "view-partner" && (
              <div className="mt-3.5 border-t border-border pt-3.5 text-[11px] leading-relaxed text-muted-foreground">
                Preference signals come from {p.name}&rsquo;s employee survey
                data, surfaced via VIEW.
              </div>
            )}
          </Card>

          <Card className="p-5">
            <h3 className="mb-2.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Source
            </h3>
            <div
              className={cn(
                "rounded-md border p-3",
                p.source === "view-partner"
                  ? "border-view-source/40 bg-view-source-muted"
                  : "border-border bg-muted",
              )}
            >
              <div
                className={cn(
                  "mb-1.5 text-[11px] font-semibold uppercase tracking-wider",
                  p.source === "view-partner"
                    ? "text-view-source-foreground"
                    : "text-muted-foreground",
                )}
              >
                {p.source === "view-partner" ? "via VIEW" : "Direct relationship"}
              </div>
              <div className="text-xs leading-relaxed text-muted-foreground">
                {p.source === "view-partner"
                  ? "Pending requests, capacity reasoning, and post-event hours flow into your workspace through VIEW."
                  : "Managed the way you've always managed corporate partnerships — email, calls, shared docs."}
              </div>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function HealthPill({
  health,
}: {
  health: CorporatePartner["relationshipHealth"];
}) {
  const config = {
    thriving: "bg-emerald-50 border-emerald-200 text-emerald-900",
    steady:   "bg-muted border-border text-foreground",
    "at-risk":"bg-amber-50 border-amber-200 text-amber-900",
  } as const;
  const label = {
    thriving: "Thriving",
    steady: "Steady",
    "at-risk": "At risk",
  } as const;
  return (
    <span
      className={cn(
        "rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
        config[health],
      )}
    >
      {label[health]}
    </span>
  );
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="mb-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="font-heading text-[26px] font-semibold leading-none tracking-tight tabular-nums text-foreground">
        {value}
      </div>
    </div>
  );
}

function FormatBar({ mix }: { mix: CorporatePartner["formatMix"] }) {
  return (
    <div
      aria-hidden="true"
      className="flex h-1.5 overflow-hidden rounded-full bg-muted"
    >
      <div className="bg-primary" style={{ width: `${mix.directService * 100}%` }} />
      <div
        className="bg-view-source"
        style={{ width: `${mix.skillsBased * 100}%` }}
      />
      <div
        className="bg-border-strong"
        style={{ width: `${mix.grantsOnly * 100}%` }}
      />
    </div>
  );
}

function LegendDot({
  className,
  label,
}: {
  className: string;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span aria-hidden="true" className={cn("size-2 rounded-full", className)} />
      {label}
    </span>
  );
}

function Logo({ name, large = false }: { name: string; large?: boolean }) {
  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  // Deterministic gradient palette (placeholder for real brand logos).
  const palette = [
    "from-slate-900 to-blue-700",
    "from-emerald-600 to-emerald-700",
    "from-violet-600 to-violet-800",
    "from-orange-600 to-orange-900",
    "from-cyan-600 to-cyan-800",
    "from-pink-600 to-pink-800",
    "from-amber-600 to-amber-800",
    "from-slate-600 to-slate-800",
  ];
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const grad = palette[h % palette.length];

  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex shrink-0 items-center justify-center rounded-md bg-gradient-to-br font-bold tracking-tight text-white",
        large ? "size-16 text-[22px]" : "size-11 text-sm",
        grad,
      )}
    >
      {initials}
    </div>
  );
}

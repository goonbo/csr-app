"use client";

/**
 * /np/partners — corporate partners list (Field theme).
 *
 * PageHeader: "Your relationships" eyebrow + "Corporate partners."
 * H1 + subtitle with VIEW vs direct counts and pending-request
 * call-out.
 *
 * Filter Tabs (rounded-full): All / Via VIEW (cyan dot) / Direct /
 * At-risk relationships (amber dot). Each label suffixed with a
 * count.
 *
 * Grid (1-col → 2-col at md): one PartnerCard per partner.
 * Cards carry a 4px left-border that encodes their primary status:
 *   - amber-500 if at-risk
 *   - view-source (cyan) if VIEW-sourced
 *   - border (neutral) otherwise
 *
 * Card sections:
 *   header  — name + ViewSourcePill, industry, deterministic Logo
 *   chips   — HealthPill, optional Lapsed pill (no activity in 6+
 *             months), optional Pending-request emerald pill
 *   stats   — Years / Events YTD / Hours YTD with mono numerals,
 *             dividing rule above
 *   footer  — contact name + last activity + chevron
 *
 * Empty state: muted Card "No partners match this view."
 */

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles } from "lucide-react";
import { fmtDate } from "@/lib/format";
import { NP_CORPORATE_PARTNERS } from "@/lib/seed/np-corporate-partners";
import type { CorporatePartner } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/view/PageHeader";
import { ViewSourcePill } from "@/components/view/ViewSourcePill";
import { cn } from "@/lib/utils";

type Filter = "all" | "view" | "direct" | "at-risk";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All partners" },
  { id: "view", label: "Via VIEW" },
  { id: "direct", label: "Direct" },
  { id: "at-risk", label: "At-risk relationships" },
];

export default function PartnersPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(() => {
    return NP_CORPORATE_PARTNERS.filter((p) => {
      if (filter === "view") return p.source === "view-partner";
      if (filter === "direct") return p.source !== "view-partner";
      if (filter === "at-risk") return p.relationshipHealth === "at-risk";
      return true;
    });
  }, [filter]);

  const counts = useMemo(
    () =>
      ({
        all: NP_CORPORATE_PARTNERS.length,
        view: NP_CORPORATE_PARTNERS.filter((p) => p.source === "view-partner")
          .length,
        direct: NP_CORPORATE_PARTNERS.filter((p) => p.source !== "view-partner")
          .length,
        "at-risk": NP_CORPORATE_PARTNERS.filter(
          (p) => p.relationshipHealth === "at-risk",
        ).length,
      }) as Record<Filter, number>,
    [],
  );

  const pendingCount = NP_CORPORATE_PARTNERS.filter(
    (p) => p.pendingRequest,
  ).length;

  const subtitle = `${NP_CORPORATE_PARTNERS.length} active relationships — ${counts.view} managed via VIEW, ${counts.direct} direct.${
    pendingCount > 0
      ? ` ${pendingCount} pending request${pendingCount > 1 ? "s" : ""} need a reply.`
      : ""
  }`;

  return (
    <div>
      <PageHeader
        greeting="Your relationships"
        title="Corporate partners."
        subtitle={subtitle}
      />

      <Tabs
        value={filter}
        onValueChange={(v) => setFilter(v as Filter)}
        className="mb-6"
      >
        <TabsList className="rounded-full" aria-label="Filter partners">
          {FILTERS.map((f) => (
            <TabsTrigger
              key={f.id}
              value={f.id}
              className="rounded-full px-3"
            >
              {f.id === "view" && (
                <span
                  aria-hidden="true"
                  className="size-1.5 shrink-0 rounded-full bg-view-source"
                />
              )}
              {f.id === "at-risk" && (
                <span
                  aria-hidden="true"
                  className="size-1.5 shrink-0 rounded-full bg-amber-500"
                />
              )}
              {f.label}
              <span className="text-[11px] font-semibold text-muted-foreground">
                {counts[f.id]}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {filtered.map((p) => (
          <PartnerCard
            key={p.id}
            partner={p}
            onClick={() => router.push(`/np/partners/${p.id}`)}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <Card className="bg-muted/40 p-8">
          <div className="text-sm text-foreground/70">
            No partners match this view.
          </div>
        </Card>
      )}
    </div>
  );
}

function PartnerCard({
  partner: p,
  onClick,
}: {
  partner: CorporatePartner;
  onClick: () => void;
}) {
  const isLapsed = (() => {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    return new Date(p.lastActivityAt) < sixMonthsAgo;
  })();

  const borderTone =
    p.relationshipHealth === "at-risk"
      ? "border-l-amber-500"
      : p.source === "view-partner"
        ? "border-l-view-source"
        : "border-l-border";

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className={cn(
        "cursor-pointer gap-0 p-0 transition-shadow hover:ring-foreground/15",
        "border-l-4",
        borderTone,
      )}
    >
      <div className="p-5">
        <div className="mb-3.5 flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="mb-1.5 flex flex-wrap items-center gap-2">
              <h3 className="m-0 font-heading text-lg font-semibold tracking-tight text-foreground">
                {p.name}
              </h3>
              {p.source === "view-partner" && (
                <ViewSourcePill partner={p.name} size="sm" />
              )}
            </div>
            <div className="text-xs leading-tight text-muted-foreground">
              {p.industry}
            </div>
          </div>
          <Logo name={p.name} />
        </div>

        <div className="mb-3.5 flex flex-wrap items-center gap-2">
          <HealthPill health={p.relationshipHealth} />
          {isLapsed && (
            <span className="inline-flex items-center rounded-full border border-border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Lapsed
            </span>
          )}
          {p.pendingRequest && (
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-900">
              <Sparkles
                className="size-2.5"
                strokeWidth={2.6}
                aria-hidden="true"
              />
              Pending request
            </span>
          )}
        </div>

        <div className="mb-3.5 grid grid-cols-3 gap-3 border-t border-border pt-3.5">
          <Stat label="Years" value={p.yearsActive.toString()} />
          <Stat label="Events YTD" value={p.eventsHostedYtd.toString()} />
          <Stat label="Hours YTD" value={p.hoursHostedYtd.toString()} />
        </div>

        <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
          <span className="truncate">
            {p.contactName} · last activity {fmtDate(p.lastActivityAt, false)}
          </span>
          <ArrowRight className="size-3.5 shrink-0" aria-hidden="true" />
        </div>
      </div>
    </Card>
  );
}

function HealthPill({
  health,
}: {
  health: CorporatePartner["relationshipHealth"];
}) {
  if (health === "thriving") {
    return (
      <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-900">
        Thriving
      </span>
    );
  }
  if (health === "at-risk") {
    return (
      <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-900">
        At risk
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full border border-border bg-muted px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
      Steady
    </span>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="mb-1 text-[9.5px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="font-heading text-lg font-semibold tabular-nums tracking-tight text-foreground">
        {value}
      </div>
    </div>
  );
}

const LOGO_PALETTE = [
  ["#0A1A2E", "#1E40AF"],
  ["#16A34A", "#15803D"],
  ["#7C3AED", "#5B21B6"],
  ["#EA580C", "#9A3412"],
  ["#0891B2", "#0E4F65"],
  ["#DB2777", "#9D174D"],
  ["#D97706", "#92400E"],
  ["#475569", "#1E293B"],
];

function Logo({ name }: { name: string }) {
  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const [a, b] = LOGO_PALETTE[h % LOGO_PALETTE.length];

  return (
    <div
      aria-hidden="true"
      className="flex size-11 shrink-0 items-center justify-center rounded-md text-sm font-bold tracking-tight text-white"
      style={{ backgroundImage: `linear-gradient(135deg, ${a}, ${b})` }}
    >
      {initials}
    </div>
  );
}

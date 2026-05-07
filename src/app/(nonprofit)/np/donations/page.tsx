"use client";

/**
 * /np/donations — donations dashboard with cash + in-kind tabs
 * (Field theme).
 *
 * Top-level Tabs use the `line` variant (underline-only segmented
 * control) so the donation type switch reads as document-level
 * navigation, not a chip.
 *
 * Each tab renders independently:
 *   - KPI strip (4 cards on md+)
 *   - Cash only: "Top corporate matchers · YTD" ribbon Card with
 *     view-partner entries tinted cyan
 *   - Source filter Tabs (rounded-full, with cyan dot on Via VIEW)
 *   - Donations table inside a Card with role="table" + header row
 *     and `[role="row"]` body rows
 *   - "Showing X of Y" footer note
 *
 * VIEW-sourced rows credit the originating partner via
 * `partnerLabelFor`, not the donor's literal name — e.g. an
 * individual gift from Marcus Lee carries "via VIEW · CloudMotion"
 * because that's the workspace it flowed through.
 */

import { useMemo, useState } from "react";
import { Check, Receipt, Edit3, Package, type LucideIcon } from "lucide-react";
import { fmtDate } from "@/lib/format";
import {
  NP_CASH_DONATIONS,
  NP_INKIND_DONATIONS,
} from "@/lib/seed/np-donations";
import { NP_PARTNER_BY_ID } from "@/lib/seed/np-corporate-partners";
import type { Donation, InKindDonation, DataSource } from "@/lib/types";
import { Card } from "@/components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { PageHeader } from "@/components/view/PageHeader";
import { ViewSourcePill } from "@/components/view/ViewSourcePill";
import { cn } from "@/lib/utils";

function partnerLabelFor(d: {
  sourcePartnerId?: string;
  donorName: string;
}): string {
  if (d.sourcePartnerId) {
    const p = NP_PARTNER_BY_ID(d.sourcePartnerId);
    if (p) return p.name;
  }
  return d.donorName.split(" · ")[0];
}

type SourceFilter = "all" | DataSource;

const SOURCE_FILTERS: { id: SourceFilter; label: string }[] = [
  { id: "all", label: "All sources" },
  { id: "view-partner", label: "Via VIEW" },
  { id: "direct", label: "Direct" },
  { id: "imported", label: "Imported" },
];

export default function DonationsPage() {
  return (
    <div>
      <PageHeader
        greeting="Giving in"
        title="Donations."
        subtitle="Cash and in-kind, rolling. Corporate matches via VIEW are tagged so you can see at a glance which giving moves with our partner pipeline."
      />

      <Tabs defaultValue="cash">
        <TabsList
          variant="line"
          className="mb-6 h-auto w-full justify-start rounded-none border-b border-border"
          aria-label="Donation type"
        >
          <TabsTrigger
            value="cash"
            className="flex-initial px-4 py-3 text-[13px] font-semibold"
          >
            Cash
            <span className="text-[11px] font-medium text-muted-foreground">
              {NP_CASH_DONATIONS.length}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="inkind"
            className="flex-initial px-4 py-3 text-[13px] font-semibold"
          >
            In-kind
            <span className="text-[11px] font-medium text-muted-foreground">
              {NP_INKIND_DONATIONS.length}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cash">
          <CashTab />
        </TabsContent>
        <TabsContent value="inkind">
          <InKindTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ============================================================
// Cash tab
// ============================================================

function CashTab() {
  const [source, setSource] = useState<SourceFilter>("all");

  const filtered = useMemo(() => {
    return NP_CASH_DONATIONS.filter((d) =>
      source === "all" ? true : d.source === source,
    )
      .filter((d) => d.amount > 0)
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [source]);

  const q2Start = new Date("2026-04-01");
  const thisQ = NP_CASH_DONATIONS.filter(
    (d) => new Date(d.date) >= q2Start && d.amount > 0,
  );
  const ytdAll = NP_CASH_DONATIONS.filter((d) => d.amount > 0);

  const totalThisQ = thisQ.reduce((s, d) => s + d.amount, 0);
  const totalYtd = ytdAll.reduce((s, d) => s + d.amount, 0);
  const recurringCount = new Set(
    NP_CASH_DONATIONS.filter((d) => d.recurring).map(
      (d) => d.donorId ?? d.donorName,
    ),
  ).size;

  const corpTotals: Record<string, number> = {};
  for (const d of NP_CASH_DONATIONS) {
    if (d.donorType !== "corporate" || d.amount === 0) continue;
    const key = d.donorId ?? d.donorName;
    corpTotals[key] = (corpTotals[key] ?? 0) + d.amount;
  }
  const topMatchers = Object.entries(corpTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([key, total]) => ({
      key,
      total,
      example: NP_CASH_DONATIONS.find(
        (d) => (d.donorId ?? d.donorName) === key,
      )!,
    }));

  const avgGift = ytdAll.length > 0 ? totalYtd / ytdAll.length : 0;

  return (
    <>
      <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-4">
        <Kpi
          label="Raised this quarter"
          value={`$${totalThisQ.toLocaleString()}`}
          sub={`${thisQ.length} gifts`}
        />
        <Kpi
          label="Recurring donors"
          value={recurringCount.toString()}
          sub="active monthly"
        />
        <Kpi
          label="Average gift"
          value={`$${Math.round(avgGift).toLocaleString()}`}
          sub="rolling 12 months"
        />
        <Kpi
          label="Top matcher"
          value={
            topMatchers[0] ? partnerLabelFor(topMatchers[0].example) : "—"
          }
          sub={
            topMatchers[0]
              ? `$${topMatchers[0].total.toLocaleString()} YTD`
              : ""
          }
        />
      </div>

      {topMatchers.length > 0 && (
        <Card className="mb-5 p-4">
          <div className="mb-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Top corporate matchers · YTD
          </div>
          <div className="flex flex-wrap gap-3">
            {topMatchers.map((m) => {
              const isView = m.example.source === "view-partner";
              const partnerName = partnerLabelFor(m.example);
              return (
                <div
                  key={m.key}
                  className={cn(
                    "flex items-center gap-2.5 rounded-md border px-3.5 py-2",
                    isView
                      ? "border-view-source/40 bg-view-source-muted"
                      : "border-border bg-muted",
                  )}
                >
                  <div>
                    <div className="text-xs font-semibold text-foreground">
                      {partnerName}
                    </div>
                    <div className="font-mono text-[11px] tabular-nums text-muted-foreground">
                      ${m.total.toLocaleString()} YTD
                    </div>
                  </div>
                  {isView && (
                    <ViewSourcePill partner={partnerName} size="sm" hideIcon />
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}

      <SourceFilters source={source} setSource={setSource} type="cash" />

      <Card className="gap-0 overflow-hidden p-0" role="table" aria-label="Cash donations">
        <div
          role="row"
          className="grid grid-cols-[1.6fr_1fr_90px_110px_1fr_70px] gap-4 border-b border-border bg-muted px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
        >
          <div role="columnheader">Donor</div>
          <div role="columnheader">Designation</div>
          <div role="columnheader" className="text-right">Amount</div>
          <div role="columnheader">Date</div>
          <div role="columnheader">Source</div>
          <div role="columnheader" className="text-right">Status</div>
        </div>
        {filtered.map((d, i) => (
          <CashRow
            key={d.id}
            donation={d}
            isLast={i === filtered.length - 1}
          />
        ))}
      </Card>

      <FooterNote shown={filtered.length} total={ytdAll.length} />
    </>
  );
}

function CashRow({
  donation: d,
  isLast,
}: {
  donation: Donation;
  isLast: boolean;
}) {
  return (
    <div
      role="row"
      className={cn(
        "grid grid-cols-[1.6fr_1fr_90px_110px_1fr_70px] items-center gap-4 px-4 py-3",
        !isLast && "border-b border-border",
      )}
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[13px] font-semibold text-foreground">
            {d.donorName}
          </span>
          {d.recurring && (
            <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-1.5 py-px text-[9.5px] font-bold uppercase tracking-wider text-emerald-900">
              Recurring
            </span>
          )}
        </div>
        <div className="mt-0.5 text-[11px] text-muted-foreground">
          {d.donorType === "corporate" ? "Corporate" : "Individual"}
        </div>
      </div>
      <div className="text-[12.5px] text-foreground/80">{d.designation}</div>
      <div className="text-right font-mono text-[13px] font-semibold tabular-nums text-foreground">
        ${d.amount.toLocaleString()}
      </div>
      <div className="font-mono text-xs text-muted-foreground">
        {fmtDate(d.date, false)}
      </div>
      <div>
        {d.source === "view-partner" && d.sourcePartnerId ? (
          <ViewSourcePill partner={partnerLabelFor(d)} size="sm" />
        ) : d.source === "imported" ? (
          <span className="inline-flex items-center rounded-full border border-border bg-muted px-1.5 py-px text-[10px] font-semibold text-muted-foreground">
            Imported
          </span>
        ) : (
          <span className="text-[11px] text-muted-foreground">Direct</span>
        )}
      </div>
      <div className="text-right">
        {d.acknowledged ? (
          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700">
            <Check className="size-3" strokeWidth={2.6} aria-hidden="true" />
            Sent
          </span>
        ) : (
          <button
            type="button"
            className="rounded-full border border-amber-200 bg-amber-50 px-2 py-px text-[11px] font-semibold text-amber-900 hover:bg-amber-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Send receipt
          </button>
        )}
      </div>
    </div>
  );
}

// ============================================================
// In-kind tab
// ============================================================

function InKindTab() {
  const [source, setSource] = useState<SourceFilter>("all");

  const filtered = useMemo(() => {
    return NP_INKIND_DONATIONS.filter((d) =>
      source === "all" ? true : d.source === source,
    ).sort((a, b) => b.receivedDate.localeCompare(a.receivedDate));
  }, [source]);

  const totalValue = NP_INKIND_DONATIONS.reduce(
    (s, d) => s + d.estimatedValue,
    0,
  );
  const corporateValue = NP_INKIND_DONATIONS.filter(
    (d) => d.donorType === "corporate",
  ).reduce((s, d) => s + d.estimatedValue, 0);
  const communityValue = totalValue - corporateValue;
  const awaitingReceipt = NP_INKIND_DONATIONS.filter(
    (d) => d.status === "received",
  ).length;
  const distributed = NP_INKIND_DONATIONS.filter(
    (d) => d.status === "distributed",
  ).length;

  return (
    <>
      <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-4">
        <Kpi
          label="Estimated value"
          value={`$${(totalValue / 1000).toFixed(1)}k`}
          sub="rolling 12 months"
        />
        <Kpi
          label="Corporate vs community"
          value={`${Math.round((corporateValue / totalValue) * 100)}/${Math.round((communityValue / totalValue) * 100)}`}
          sub={`$${(corporateValue / 1000).toFixed(1)}k corp · $${(communityValue / 1000).toFixed(1)}k community`}
        />
        <Kpi
          label="Awaiting receipt"
          value={awaitingReceipt.toString()}
          sub="not yet acknowledged"
        />
        <Kpi
          label="Distributed"
          value={distributed.toString()}
          sub="moved through inventory"
        />
      </div>

      <SourceFilters source={source} setSource={setSource} type="inkind" />

      <Card className="gap-0 overflow-hidden p-0" role="table" aria-label="In-kind donations">
        <div
          role="row"
          className="grid grid-cols-[36px_1.6fr_1.1fr_110px_90px_1fr_auto] items-center gap-3.5 border-b border-border bg-muted px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
        >
          <div></div>
          <div role="columnheader">Item</div>
          <div role="columnheader">Donor</div>
          <div role="columnheader">Quantity</div>
          <div role="columnheader" className="text-right">Value</div>
          <div role="columnheader">Received · status</div>
          <div role="columnheader" className="text-right">Actions</div>
        </div>
        {filtered.map((d, i) => (
          <InKindRow
            key={d.id}
            donation={d}
            isLast={i === filtered.length - 1}
          />
        ))}
      </Card>

      <FooterNote shown={filtered.length} total={NP_INKIND_DONATIONS.length} />
    </>
  );
}

function InKindRow({
  donation: d,
  isLast,
}: {
  donation: InKindDonation;
  isLast: boolean;
}) {
  return (
    <div
      role="row"
      className={cn(
        "grid grid-cols-[36px_1.6fr_1.1fr_110px_90px_1fr_auto] items-center gap-3.5 px-4 py-3",
        !isLast && "border-b border-border",
      )}
    >
      <div
        aria-hidden="true"
        className="flex size-7 items-center justify-center rounded-md bg-muted text-muted-foreground"
      >
        <Package className="size-3.5" strokeWidth={2} />
      </div>
      <div className="min-w-0">
        <div className="text-[13px] font-semibold leading-snug text-foreground">
          {d.description}
        </div>
        <div className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {d.donorType === "corporate" ? "Corporate" : "Individual"}
        </div>
      </div>
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <span className="text-[12.5px] text-foreground/80">{d.donorName}</span>
        {d.source === "view-partner" && (
          <ViewSourcePill partner={partnerLabelFor(d)} size="sm" hideIcon />
        )}
      </div>
      <div className="font-mono text-xs text-foreground/80">
        {d.quantity ?? "—"}
      </div>
      <div className="text-right font-mono text-[13px] font-semibold tabular-nums text-foreground">
        ${d.estimatedValue.toLocaleString()}
      </div>
      <div>
        <div className="font-mono text-[11px] text-muted-foreground">
          {fmtDate(d.receivedDate, false)}
        </div>
        <StatusPill status={d.status} />
      </div>
      <div className="flex justify-end gap-1.5">
        {d.status === "received" && (
          <IconButton icon={Receipt} label="Issue tax receipt" />
        )}
        <IconButton icon={Edit3} label="Edit valuation" />
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: InKindDonation["status"] }) {
  if (status === "received") {
    return (
      <span className="mt-1 inline-block rounded-full border border-amber-200 bg-amber-50 px-1.5 py-px text-[10px] font-semibold uppercase tracking-wider text-amber-900">
        Received
      </span>
    );
  }
  if (status === "distributed") {
    return (
      <span className="mt-1 inline-block rounded-full border border-emerald-200 bg-emerald-50 px-1.5 py-px text-[10px] font-semibold uppercase tracking-wider text-emerald-900">
        Distributed
      </span>
    );
  }
  return (
    <span className="mt-1 inline-block rounded-full border border-border bg-muted px-1.5 py-px text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
      Valued
    </span>
  );
}

// ============================================================
// Shared helpers
// ============================================================

function SourceFilters({
  source,
  setSource,
  type,
}: {
  source: SourceFilter;
  setSource: (s: SourceFilter) => void;
  type: "cash" | "inkind";
}) {
  const counts = useMemo(() => {
    const list = type === "cash" ? NP_CASH_DONATIONS : NP_INKIND_DONATIONS;
    return {
      all: list.length,
      "view-partner": list.filter((d) => d.source === "view-partner").length,
      direct: list.filter((d) => d.source === "direct").length,
      imported: list.filter((d) => d.source === "imported").length,
    } as Record<SourceFilter, number>;
  }, [type]);

  return (
    <Tabs
      value={source}
      onValueChange={(v) => setSource(v as SourceFilter)}
      className="mb-4"
    >
      <TabsList className="rounded-full" aria-label="Filter by source">
        {SOURCE_FILTERS.map((f) => (
          <TabsTrigger key={f.id} value={f.id} className="rounded-full px-3">
            {f.id === "view-partner" && (
              <span
                aria-hidden="true"
                className="size-1.5 shrink-0 rounded-full bg-view-source"
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
  );
}

function Kpi({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <Card className="p-4">
      <div className="mb-2 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mb-1 font-heading text-[26px] font-semibold tabular-nums tracking-tight text-foreground">
        {value}
      </div>
      <div className="text-[11px] leading-relaxed text-muted-foreground">
        {sub}
      </div>
    </Card>
  );
}

function IconButton({
  icon: Icon,
  label,
}: {
  icon: LucideIcon;
  label: string;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      className="inline-flex size-7 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <Icon className="size-3.5" strokeWidth={2} aria-hidden="true" />
    </button>
  );
}

function FooterNote({ shown, total }: { shown: number; total: number }) {
  return (
    <div className="mt-3 text-right text-[11px] text-muted-foreground">
      Showing {shown} of {total}
    </div>
  );
}

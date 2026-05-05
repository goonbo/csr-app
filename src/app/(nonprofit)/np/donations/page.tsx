'use client';

import { useMemo, useState } from 'react';
import { Check, Receipt, Edit3, Package } from 'lucide-react';
import { C } from '@/lib/tokens';
import { fmtDate } from '@/lib/format';
import { PageHeader } from '@/components/primitives/PageHeader';
import { Card } from '@/components/primitives/Card';
import { ViewSourcePill } from '@/components/primitives/ViewSourcePill';
import { NP_CASH_DONATIONS, NP_INKIND_DONATIONS } from '@/lib/seed/np-donations';
import { NP_PARTNER_BY_ID } from '@/lib/seed/np-corporate-partners';
import type { Donation, InKindDonation, DataSource } from '@/lib/types';

// VIEW-sourced rows credit the originating partner, not the donor's
// own name — e.g. an individual gift from Marcus Lee carries
// "via VIEW · CloudMotion" because that's the workspace it flowed
// through. Corporate match-pool entries strip the " · Match Pool"
// suffix so the pill reads cleanly.
function partnerLabelFor(d: { sourcePartnerId?: string; donorName: string }): string {
  if (d.sourcePartnerId) {
    const p = NP_PARTNER_BY_ID(d.sourcePartnerId);
    if (p) return p.name;
  }
  return d.donorName.split(' · ')[0];
}

type Tab = 'cash' | 'inkind';
type SourceFilter = 'all' | DataSource;

const SOURCE_FILTERS: { id: SourceFilter; label: string }[] = [
  { id: 'all',          label: 'All sources' },
  { id: 'view-partner', label: 'Via VIEW' },
  { id: 'direct',       label: 'Direct' },
  { id: 'imported',     label: 'Imported' },
];

export default function DonationsPage() {
  const [tab, setTab] = useState<Tab>('cash');
  const [source, setSource] = useState<SourceFilter>('all');

  return (
    <div>
      <PageHeader
        greeting="Giving in"
        title="Donations."
        subtitle="Cash and in-kind, rolling. Corporate matches via VIEW are tagged so you can see at a glance which giving moves with our partner pipeline."
      />

      {/* Tab switcher */}
      <div role="tablist" aria-label="Donation type" style={{
        display: 'flex', borderBottom: `1px solid ${C.border}`,
        marginBottom: 24,
      }}>
        <TabButton active={tab === 'cash'}   onClick={() => setTab('cash')}   label="Cash"     count={NP_CASH_DONATIONS.length} />
        <TabButton active={tab === 'inkind'} onClick={() => setTab('inkind')} label="In-kind" count={NP_INKIND_DONATIONS.length} />
      </div>

      {tab === 'cash'   && <CashTab source={source} setSource={setSource} />}
      {tab === 'inkind' && <InKindTab source={source} setSource={setSource} />}
    </div>
  );
}

// ============================================================
// Cash tab
// ============================================================

function CashTab({
  source, setSource,
}: {
  source: SourceFilter;
  setSource: (s: SourceFilter) => void;
}) {
  const filtered = useMemo(() => {
    return NP_CASH_DONATIONS
      .filter(d => source === 'all' ? true : d.source === source)
      .filter(d => d.amount > 0)
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [source]);

  // KPIs scoped to current quarter (Q2 2026 = Apr 1 onward in this seed)
  const q2Start = new Date('2026-04-01');
  const thisQ = NP_CASH_DONATIONS.filter(d => new Date(d.date) >= q2Start && d.amount > 0);
  const ytdAll = NP_CASH_DONATIONS.filter(d => d.amount > 0);

  const totalThisQ = thisQ.reduce((s, d) => s + d.amount, 0);
  const totalYtd   = ytdAll.reduce((s, d) => s + d.amount, 0);
  const recurringCount = new Set(
    NP_CASH_DONATIONS.filter(d => d.recurring).map(d => d.donorId ?? d.donorName),
  ).size;

  // Top matchers — corporate sources, sum by donor, top 3
  const corpTotals: Record<string, number> = {};
  for (const d of NP_CASH_DONATIONS) {
    if (d.donorType !== 'corporate' || d.amount === 0) continue;
    const key = d.donorId ?? d.donorName;
    corpTotals[key] = (corpTotals[key] ?? 0) + d.amount;
  }
  const topMatchers = Object.entries(corpTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([key, total]) => ({
      key,
      total,
      example: NP_CASH_DONATIONS.find(d => (d.donorId ?? d.donorName) === key)!,
    }));

  const avgGift = ytdAll.length > 0 ? totalYtd / ytdAll.length : 0;

  return (
    <>
      {/* KPI strip */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3" style={{ marginBottom: 20 }}>
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
          value={topMatchers[0] ? partnerLabelFor(topMatchers[0].example) : '—'}
          sub={topMatchers[0] ? `$${topMatchers[0].total.toLocaleString()} YTD` : ''}
        />
      </div>

      {/* Top-matchers ribbon */}
      {topMatchers.length > 0 && (
        <Card style={{ padding: 16, marginBottom: 20 }}>
          <div style={{
            fontSize: 11, fontWeight: 700,
            letterSpacing: '0.06em', textTransform: 'uppercase',
            color: C.muted, marginBottom: 12,
          }}>
            Top corporate matchers · YTD
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
            {topMatchers.map(m => (
              <div key={m.key} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 14px',
                borderRadius: 'var(--radius)',
                background: m.example.source === 'view-partner'
                  ? 'var(--view-source-bg)'
                  : C.oat,
                border: `1px solid ${
                  m.example.source === 'view-partner' ? 'var(--view-source)' : C.border
                }`,
              }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: C.ink }}>
                    {partnerLabelFor(m.example)}
                  </div>
                  <div style={{
                    fontSize: 11, color: C.muted,
                    fontFamily: 'var(--font-mono)',
                    fontVariantNumeric: 'tabular-nums',
                  }}>
                    ${m.total.toLocaleString()} YTD
                  </div>
                </div>
                {m.example.source === 'view-partner' && (
                  <ViewSourcePill partner={partnerLabelFor(m.example)} size="sm" hideIcon />
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      <SourceFilters source={source} setSource={setSource} type="cash" />

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div role="table" aria-label="Cash donations">
          {/* Header row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.6fr 1fr 90px 110px 1fr 70px',
            gap: 16, padding: '10px 18px',
            fontSize: 10, fontWeight: 700,
            letterSpacing: '0.06em', textTransform: 'uppercase',
            color: C.muted,
            background: C.oat,
            borderBottom: `1px solid ${C.border}`,
          }}>
            <div>Donor</div>
            <div>Designation</div>
            <div style={{ textAlign: 'right' }}>Amount</div>
            <div>Date</div>
            <div>Source</div>
            <div style={{ textAlign: 'right' }}>Status</div>
          </div>

          {filtered.map((d, i) => <CashRow key={d.id} donation={d} isLast={i === filtered.length - 1} />)}
        </div>
      </Card>

      <FooterNote shown={filtered.length} total={NP_CASH_DONATIONS.filter(d => d.amount > 0).length} />
    </>
  );
}

function CashRow({ donation, isLast }: { donation: Donation; isLast: boolean }) {
  const d = donation;
  return (
    <div role="row" style={{
      display: 'grid',
      gridTemplateColumns: '1.6fr 1fr 90px 110px 1fr 70px',
      gap: 16, padding: '12px 18px',
      borderBottom: isLast ? 'none' : `1px solid ${C.border}`,
      alignItems: 'center',
    }}>
      <div style={{ minWidth: 0 }}>
        <div style={{
          display: 'flex', alignItems: 'center',
          gap: 8, flexWrap: 'wrap',
        }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>
            {d.donorName}
          </span>
          {d.recurring && (
            <span style={{
              fontSize: 9.5, fontWeight: 700,
              padding: '1px 6px', borderRadius: 999,
              color: 'var(--accent-deep)', background: C.sageGlow,
              border: `1px solid ${C.sage}`,
              letterSpacing: '0.04em', textTransform: 'uppercase',
            }}>
              Recurring
            </span>
          )}
        </div>
        <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>
          {d.donorType === 'corporate' ? 'Corporate' : 'Individual'}
        </div>
      </div>
      <div style={{ fontSize: 12.5, color: C.inkLight }}>
        {d.designation}
      </div>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 13, fontWeight: 600, color: C.ink,
        textAlign: 'right',
        fontVariantNumeric: 'tabular-nums',
      }}>
        ${d.amount.toLocaleString()}
      </div>
      <div style={{
        fontSize: 12, color: C.muted,
        fontFamily: 'var(--font-mono)',
      }}>
        {fmtDate(d.date, false)}
      </div>
      <div>
        {d.source === 'view-partner' && d.sourcePartnerId ? (
          <ViewSourcePill partner={partnerLabelFor(d)} size="sm" />
        ) : d.source === 'imported' ? (
          <span style={{
            fontSize: 10, fontWeight: 600,
            padding: '1px 7px', borderRadius: 999,
            color: C.muted, background: C.oat,
            border: `1px solid ${C.border}`,
          }}>
            Imported
          </span>
        ) : (
          <span style={{ fontSize: 11, color: C.muted }}>Direct</span>
        )}
      </div>
      <div style={{ textAlign: 'right' }}>
        {d.acknowledged ? (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            fontSize: 11, color: 'var(--accent-deep)',
          }}>
            <Check size={12} strokeWidth={2.6} aria-hidden="true" />
            Sent
          </span>
        ) : (
          <button className="view-btn" style={{
            fontSize: 11, fontWeight: 600,
            color: 'var(--amber-fg)', background: 'var(--amber-bg)',
            padding: '3px 9px', borderRadius: 999,
            border: `1px solid var(--amber)`,
            cursor: 'pointer', fontFamily: 'inherit',
          }}>
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

function InKindTab({
  source, setSource,
}: {
  source: SourceFilter;
  setSource: (s: SourceFilter) => void;
}) {
  const filtered = useMemo(() => {
    return NP_INKIND_DONATIONS
      .filter(d => source === 'all' ? true : d.source === source)
      .sort((a, b) => b.receivedDate.localeCompare(a.receivedDate));
  }, [source]);

  const totalValue   = NP_INKIND_DONATIONS.reduce((s, d) => s + d.estimatedValue, 0);
  const corporateValue = NP_INKIND_DONATIONS.filter(d => d.donorType === 'corporate').reduce((s, d) => s + d.estimatedValue, 0);
  const communityValue = totalValue - corporateValue;
  const awaitingReceipt = NP_INKIND_DONATIONS.filter(d => d.status === 'received').length;
  const distributed = NP_INKIND_DONATIONS.filter(d => d.status === 'distributed').length;

  return (
    <>
      {/* KPI strip */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3" style={{ marginBottom: 20 }}>
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

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div role="table" aria-label="In-kind donations">
          <div style={{
            display: 'grid',
            gridTemplateColumns: '36px 1.6fr 1.1fr 110px 90px 1fr auto',
            gap: 14, padding: '10px 18px',
            fontSize: 10, fontWeight: 700,
            letterSpacing: '0.06em', textTransform: 'uppercase',
            color: C.muted,
            background: C.oat,
            borderBottom: `1px solid ${C.border}`,
            alignItems: 'center',
          }}>
            <div></div>
            <div>Item</div>
            <div>Donor</div>
            <div>Quantity</div>
            <div style={{ textAlign: 'right' }}>Value</div>
            <div>Received · status</div>
            <div style={{ textAlign: 'right' }}>Actions</div>
          </div>
          {filtered.map((d, i) => <InKindRow key={d.id} donation={d} isLast={i === filtered.length - 1} />)}
        </div>
      </Card>

      <FooterNote shown={filtered.length} total={NP_INKIND_DONATIONS.length} />
    </>
  );
}

function InKindRow({ donation, isLast }: { donation: InKindDonation; isLast: boolean }) {
  const d = donation;
  return (
    <div role="row" style={{
      display: 'grid',
      gridTemplateColumns: '36px 1.6fr 1.1fr 110px 90px 1fr auto',
      gap: 14, padding: '12px 18px',
      borderBottom: isLast ? 'none' : `1px solid ${C.border}`,
      alignItems: 'center',
    }}>
      <div
        aria-hidden="true"
        style={{
          width: 28, height: 28, borderRadius: 'var(--radius)',
          background: C.oat, color: C.muted,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <Package size={14} strokeWidth={2} />
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.ink, lineHeight: 1.4 }}>
          {d.description}
        </div>
        <div style={{
          fontSize: 11, color: C.muted, marginTop: 2,
          textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600,
        }}>
          {d.donorType === 'corporate' ? 'Corporate' : 'Individual'}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', minWidth: 0 }}>
        <span style={{ fontSize: 12.5, color: C.inkLight }}>{d.donorName}</span>
        {d.source === 'view-partner' && (
          <ViewSourcePill partner={partnerLabelFor(d)} size="sm" hideIcon />
        )}
      </div>
      <div style={{
        fontSize: 12, color: C.inkLight,
        fontFamily: 'var(--font-mono)',
      }}>
        {d.quantity ?? '—'}
      </div>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 13, fontWeight: 600, color: C.ink,
        textAlign: 'right',
        fontVariantNumeric: 'tabular-nums',
      }}>
        ${d.estimatedValue.toLocaleString()}
      </div>
      <div>
        <div style={{
          fontSize: 11, color: C.muted,
          fontFamily: 'var(--font-mono)',
        }}>
          {fmtDate(d.receivedDate, false)}
        </div>
        <StatusPill status={d.status} />
      </div>
      <div style={{
        display: 'flex', gap: 6,
        justifyContent: 'flex-end',
      }}>
        {d.status === 'received' && (
          <IconButton icon={Receipt} label="Issue tax receipt" />
        )}
        <IconButton icon={Edit3} label="Edit valuation" />
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: InKindDonation['status'] }) {
  const config = {
    received:    { color: 'var(--amber-fg)',    bg: 'var(--amber-bg)', border: 'var(--amber)',    label: 'Received' },
    valued:      { color: C.muted,              bg: C.oat,             border: C.borderStrong,    label: 'Valued' },
    distributed: { color: 'var(--accent-deep)', bg: C.sageGlow,        border: C.sage,            label: 'Distributed' },
  } as const;
  const c = config[status];
  return (
    <span style={{
      display: 'inline-block', marginTop: 4,
      fontSize: 10, fontWeight: 600,
      padding: '1px 7px', borderRadius: 999,
      color: c.color, background: c.bg,
      border: `1px solid ${c.border}`,
      letterSpacing: '0.02em', textTransform: 'uppercase',
    }}>
      {c.label}
    </span>
  );
}

// ============================================================
// Shared helpers
// ============================================================

function TabButton({ active, onClick, label, count }: {
  active: boolean; onClick: () => void; label: string; count: number;
}) {
  return (
    <button
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className="view-btn"
      style={{
        padding: '12px 18px',
        fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
        color: active ? C.ink : C.muted,
        background: 'transparent',
        border: 'none',
        borderBottom: `2px solid ${active ? 'var(--accent)' : 'transparent'}`,
        marginBottom: -1,
        cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', gap: 8,
      }}
    >
      {label}
      <span style={{ fontSize: 11, color: C.muted, fontWeight: 500 }}>{count}</span>
    </button>
  );
}

function SourceFilters({
  source, setSource, type,
}: {
  source: SourceFilter;
  setSource: (s: SourceFilter) => void;
  type: 'cash' | 'inkind';
}) {
  const counts = useMemo(() => {
    const list = type === 'cash' ? NP_CASH_DONATIONS : NP_INKIND_DONATIONS;
    return {
      all:           list.length,
      'view-partner': list.filter(d => d.source === 'view-partner').length,
      direct:         list.filter(d => d.source === 'direct').length,
      imported:       list.filter(d => d.source === 'imported').length,
    } as Record<SourceFilter, number>;
  }, [type]);

  return (
    <div role="tablist" aria-label="Filter by source" style={{
      display: 'flex', flexWrap: 'wrap', gap: 4,
      padding: 4, borderRadius: 999,
      background: C.oat, border: `1px solid ${C.border}`,
      width: 'fit-content', marginBottom: 16,
    }}>
      {SOURCE_FILTERS.map(f => {
        const active = source === f.id;
        return (
          <button
            key={f.id}
            role="tab"
            aria-selected={active}
            onClick={() => setSource(f.id)}
            className="view-btn"
            style={{
              padding: '6px 14px', borderRadius: 999,
              fontSize: 13, fontWeight: 500, fontFamily: 'inherit',
              color: active ? C.ink : C.muted,
              background: active ? C.paper : 'transparent',
              boxShadow: active ? '0 1px 3px rgba(10,26,46,0.06)' : 'none',
              border: 'none', cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}
          >
            {f.id === 'view-partner' && (
              <span style={{
                width: 6, height: 6, borderRadius: '50%',
                background: 'var(--view-source)',
              }} aria-hidden="true" />
            )}
            {f.label}
            <span style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>
              {counts[f.id]}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function Kpi({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <Card style={{ padding: 18 }}>
      <div style={{
        fontSize: 10.5, fontWeight: 600, color: C.muted,
        letterSpacing: '0.06em', textTransform: 'uppercase',
        marginBottom: 8,
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: 'var(--font-h1), sans-serif',
        fontSize: 26, fontWeight: 600, color: C.ink,
        letterSpacing: '-0.02em',
        fontVariantNumeric: 'tabular-nums',
        marginBottom: 4,
      }}>
        {value}
      </div>
      <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.5 }}>
        {sub}
      </div>
    </Card>
  );
}

function IconButton({ icon: Icon, label }: { icon: typeof Receipt; label: string }) {
  return (
    <button
      className="view-btn"
      title={label}
      aria-label={label}
      style={{
        width: 28, height: 28, borderRadius: 'var(--radius-sm)',
        background: 'transparent',
        border: `1px solid ${C.border}`,
        color: C.muted,
        cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <Icon size={13} strokeWidth={2} />
    </button>
  );
}

function FooterNote({ shown, total }: { shown: number; total: number }) {
  return (
    <div style={{
      marginTop: 12, fontSize: 11, color: C.muted,
      textAlign: 'right',
    }}>
      Showing {shown} of {total}
    </div>
  );
}

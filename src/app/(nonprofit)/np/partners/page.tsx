'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Sparkles } from 'lucide-react';
import { C } from '@/lib/tokens';
import { fmtDate } from '@/lib/format';
import { PageHeader } from '@/components/primitives/PageHeader';
import { Card } from '@/components/primitives/Card';
import { ViewSourcePill } from '@/components/primitives/ViewSourcePill';
import { NP_CORPORATE_PARTNERS } from '@/lib/seed/np-corporate-partners';
import type { CorporatePartner } from '@/lib/types';

type Filter = 'all' | 'view' | 'direct' | 'at-risk';

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all',     label: 'All partners' },
  { id: 'view',    label: 'Via VIEW' },
  { id: 'direct',  label: 'Direct' },
  { id: 'at-risk', label: 'At-risk relationships' },
];

export default function PartnersPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = useMemo(() => {
    return NP_CORPORATE_PARTNERS.filter(p => {
      if (filter === 'view')    return p.source === 'view-partner';
      if (filter === 'direct')  return p.source !== 'view-partner';
      if (filter === 'at-risk') return p.relationshipHealth === 'at-risk';
      return true;
    });
  }, [filter]);

  const counts = useMemo(() => ({
    all:     NP_CORPORATE_PARTNERS.length,
    view:    NP_CORPORATE_PARTNERS.filter(p => p.source === 'view-partner').length,
    direct:  NP_CORPORATE_PARTNERS.filter(p => p.source !== 'view-partner').length,
    'at-risk': NP_CORPORATE_PARTNERS.filter(p => p.relationshipHealth === 'at-risk').length,
  } as Record<Filter, number>), []);

  const pendingCount = NP_CORPORATE_PARTNERS.filter(p => p.pendingRequest).length;

  return (
    <div>
      <PageHeader
        greeting="Your relationships"
        title="Corporate partners."
        subtitle={`${NP_CORPORATE_PARTNERS.length} active relationships — ${counts.view} managed via VIEW, ${counts.direct} direct.${pendingCount > 0 ? ` ${pendingCount} pending request${pendingCount > 1 ? 's' : ''} need a reply.` : ''}`}
      />

      {/* Filter pills */}
      <div role="tablist" aria-label="Filter partners" style={{
        display: 'flex', flexWrap: 'wrap', gap: 4,
        padding: 4, borderRadius: 999,
        background: C.oat, border: `1px solid ${C.border}`,
        width: 'fit-content', marginBottom: 24,
      }}>
        {FILTERS.map(f => {
          const active = filter === f.id;
          return (
            <button
              key={f.id}
              role="tab"
              aria-selected={active}
              onClick={() => setFilter(f.id)}
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
              {f.id === 'view' && (
                <span style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: 'var(--view-source)',
                }} aria-hidden="true" />
              )}
              {f.id === 'at-risk' && (
                <span style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: 'var(--amber)',
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

      {/* Partner cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(p => (
          <PartnerCard
            key={p.id}
            partner={p}
            onClick={() => router.push(`/np/partners/${p.id}`)}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <Card style={{ padding: 32 }}>
          <div style={{ fontSize: 14, color: C.inkLight }}>
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

  return (
    <Card
      onClick={onClick}
      style={{
        padding: 0, overflow: 'hidden',
        borderLeft: p.relationshipHealth === 'at-risk'
          ? `3px solid var(--amber)`
          : p.source === 'view-partner'
            ? `3px solid var(--view-source)`
            : `3px solid ${C.border}`,
      }}
    >
      <div style={{ padding: 22 }}>
        <div style={{
          display: 'flex', alignItems: 'flex-start',
          justifyContent: 'space-between', gap: 12,
          marginBottom: 14,
        }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              flexWrap: 'wrap', marginBottom: 6,
            }}>
              <h3 style={{
                fontFamily: 'var(--font-h1), sans-serif',
                fontSize: 18, fontWeight: 600,
                color: C.ink, margin: 0,
                letterSpacing: '-0.01em',
              }}>
                {p.name}
              </h3>
              {p.source === 'view-partner' && <ViewSourcePill partner={p.name} size="sm" />}
            </div>
            <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.4 }}>
              {p.industry}
            </div>
          </div>
          <Logo name={p.name} />
        </div>

        <div style={{
          display: 'flex', alignItems: 'center',
          gap: 8, flexWrap: 'wrap', marginBottom: 14,
        }}>
          <HealthPill health={p.relationshipHealth} />
          {isLapsed && (
            <span style={{
              fontSize: 10, fontWeight: 600,
              padding: '2px 8px', borderRadius: 999,
              color: C.muted, background: 'transparent',
              border: `1px solid ${C.borderStrong}`,
              letterSpacing: '0.02em', textTransform: 'uppercase',
            }}>
              Lapsed
            </span>
          )}
          {p.pendingRequest && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              fontSize: 10, fontWeight: 700,
              padding: '2px 8px', borderRadius: 999,
              color: 'var(--accent-deep)', background: C.sageGlow,
              border: `1px solid ${C.sage}`,
              letterSpacing: '0.04em', textTransform: 'uppercase',
            }}>
              <Sparkles size={9} strokeWidth={2.6} aria-hidden="true" />
              Pending request
            </span>
          )}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 12, marginBottom: 14,
          paddingTop: 14, borderTop: `1px solid ${C.border}`,
        }}>
          <Stat label="Years" value={p.yearsActive.toString()} />
          <Stat label="Events YTD" value={p.eventsHostedYtd.toString()} />
          <Stat label="Hours YTD" value={p.hoursHostedYtd.toString()} />
        </div>

        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: 12, color: C.muted,
        }}>
          <span>
            {p.contactName} · last activity {fmtDate(p.lastActivityAt, false)}
          </span>
          <ArrowRight size={14} aria-hidden="true" />
        </div>
      </div>
    </Card>
  );
}

function HealthPill({ health }: { health: CorporatePartner['relationshipHealth'] }) {
  const config = {
    thriving: { bg: 'var(--accent-glow)',   color: 'var(--accent-deep)', border: 'var(--accent)', label: 'Thriving' },
    steady:   { bg: C.oat,                  color: C.inkLight,           border: C.borderStrong,   label: 'Steady' },
    'at-risk':{ bg: 'var(--amber-bg)',      color: 'var(--amber-fg)',    border: 'var(--amber)',   label: 'At risk' },
  } as const;
  const c = config[health];
  return (
    <span style={{
      fontSize: 11, fontWeight: 600,
      padding: '2px 9px', borderRadius: 999,
      color: c.color, background: c.bg,
      border: `1px solid ${c.border}`,
    }}>
      {c.label}
    </span>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{
        fontSize: 9.5, fontWeight: 600, color: C.muted,
        letterSpacing: '0.06em', textTransform: 'uppercase',
        marginBottom: 4,
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: 'var(--font-h1), sans-serif',
        fontSize: 18, fontWeight: 600, color: C.ink,
        fontVariantNumeric: 'tabular-nums',
        letterSpacing: '-0.01em',
      }}>
        {value}
      </div>
    </div>
  );
}

function Logo({ name }: { name: string }) {
  // Deterministic colors from the partner name. Operator-Field-friendly
  // — these are placeholder logo blocks, not the real brand.
  const initials = name.split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase();
  const palette = [
    ['#0A1A2E', '#1E40AF'],
    ['#16A34A', '#15803D'],
    ['#7C3AED', '#5B21B6'],
    ['#EA580C', '#9A3412'],
    ['#0891B2', '#0E4F65'],
    ['#DB2777', '#9D174D'],
    ['#D97706', '#92400E'],
    ['#475569', '#1E293B'],
  ];
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const [a, b] = palette[h % palette.length];

  return (
    <div
      aria-hidden="true"
      style={{
        width: 44, height: 44,
        borderRadius: 'var(--radius)',
        background: `linear-gradient(135deg, ${a}, ${b})`,
        color: '#FFFFFF', fontSize: 14, fontWeight: 700,
        letterSpacing: '-0.02em',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}

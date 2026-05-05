'use client';

import { useRouter } from 'next/navigation';
import {
  AlertCircle, Sparkles, Award, ArrowRight,
  PackageCheck, ChevronRight,
} from 'lucide-react';
import { C } from '@/lib/tokens';
import { fmtDate } from '@/lib/format';
import { PageHeader } from '@/components/primitives/PageHeader';
import { Card } from '@/components/primitives/Card';
import { Pill } from '@/components/primitives/Pill';
import { ViewSourcePill } from '@/components/primitives/ViewSourcePill';
import { NP_CORPORATE_PARTNERS } from '@/lib/seed/np-corporate-partners';
import { NP_VOLUNTEERS } from '@/lib/seed/np-volunteers';
import { NP_CASH_DONATIONS, NP_INKIND_DONATIONS } from '@/lib/seed/np-donations';

// Partner pipeline stages, framed from the nonprofit's perspective.
// Mirrors the corporate-side pipeline structurally so the bidirectional
// flow reads as "two sides of the same workflow."
const PIPELINE_STAGES = [
  { id: 'inquiring', label: 'Inquiring', tone: 'neutral'    as const },
  { id: 'scoping',   label: 'Scoping',   tone: 'amber'      as const },
  { id: 'confirmed', label: 'Confirmed', tone: 'sage'       as const },
  { id: 'hosted',    label: 'Hosted',    tone: 'sage'       as const },
  { id: 'recapped',  label: 'Recapped',  tone: 'neutral'    as const },
];

export default function NonprofitHomePage() {
  const router = useRouter();
  // --- Attention queue ---
  const partnersWithPending = NP_CORPORATE_PARTNERS.filter(p => p.pendingRequest);

  // Reconciliation: corporate-side e3 had 3 unscanned signups (Daniel,
  // Aisha, Roman). They show up here as "needs cross-check with VIEW
  // partner check-in data."
  const reconciliationCount = 3;

  // In-kind awaiting valuation (status === 'received')
  const inkindToValue = NP_INKIND_DONATIONS.filter(d => d.status === 'received');

  // Recognition triggers — Augusto Vega just hit 25 events (per seed).
  const augusto = NP_VOLUNTEERS.find(v => v.id === 'nv-augusto-vega');

  const attentionCount =
    partnersWithPending.length +
    1 + // reconciliation queue counts as one attention item
    inkindToValue.length +
    (augusto ? 1 : 0);

  // --- This month at a glance ---
  const monthStart = new Date('2026-04-01');
  const allCash = [...NP_CASH_DONATIONS];
  const monthCash = allCash.filter(d => new Date(d.date) >= monthStart && d.amount > 0);
  const viewMatchThisMonth = monthCash
    .filter(d => d.source === 'view-partner')
    .reduce((s, d) => s + d.amount, 0);
  const directThisMonth = monthCash
    .filter(d => d.source !== 'view-partner')
    .reduce((s, d) => s + d.amount, 0);

  const monthEvents = NP_CORPORATE_PARTNERS.flatMap(p =>
    p.history.filter(h => new Date(h.date) >= monthStart)
      .map(h => ({ ...h, partner: p })),
  );
  const hoursThisMonth = monthEvents.reduce((s, h) => s + h.hours, 0);
  const viewHoursThisMonth = monthEvents
    .filter(h => h.partner.source === 'view-partner')
    .reduce((s, h) => s + h.hours, 0);
  const activationsThisMonth = monthEvents.length;

  const inkindThisMonth = NP_INKIND_DONATIONS.filter(d => new Date(d.receivedDate) >= monthStart);
  const inkindThisMonthValue = inkindThisMonth.reduce((s, d) => s + d.estimatedValue, 0);
  const inkindViewValue = inkindThisMonth
    .filter(d => d.source === 'view-partner')
    .reduce((s, d) => s + d.estimatedValue, 0);

  // --- Partner pipeline counts ---
  const pipelineCounts: Record<string, { count: number; partners: string[] }> = {
    inquiring: {
      count: 1,
      partners: ['CloudMotion · Q3 Reading Buddies'],
    },
    scoping: {
      count: 1,
      partners: ['Bramble Health · weekday evenings'],
    },
    confirmed: {
      count: 1,
      partners: ['Travis Energy · May 10 Sort Shift'],
    },
    hosted: {
      count: 2,
      partners: ['CloudMotion · Apr 10', 'Travis Energy · Apr 2'],
    },
    recapped: {
      count: 4,
      partners: ['CloudMotion · Dec 12', 'Hill Country Bank · Mar 20', 'Bramble Health · Apr 5', 'Maverick Foods · Apr 15'],
    },
  };

  // --- Volunteer pulse: most recently active, top 6 ---
  const recentlyActive = [...NP_VOLUNTEERS]
    .sort((a, b) => b.lastActive.localeCompare(a.lastActive))
    .slice(0, 6);

  // --- Drift signal: Cardinal Logistics ---
  const cardinal = NP_CORPORATE_PARTNERS.find(p => p.id === 'cp-cardinal');

  return (
    <div>
      <PageHeader
        greeting="Good morning, Maria"
        title="The week ahead."
        subtitle="What needs you today, where partners stand, and what your volunteers are up to."
      />

      {/* WHAT NEEDS YOU TODAY */}
      <div style={{ marginBottom: 32 }}>
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', marginBottom: 16,
        }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: C.ink, margin: 0 }}>
            What needs you today
          </h2>
          <span style={{
            fontSize: 11, color: C.muted, fontWeight: 600,
            textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>
            {attentionCount} items
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Pending requests */}
          {partnersWithPending.map(p => {
            const r = p.pendingRequest!;
            return (
              <Card
                key={`pending-${p.id}`}
                ai
                onClick={() => router.push(`/np/partners/${p.id}`)}
                style={{ padding: 18 }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div
                    style={{
                      width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                      background: C.sageGlow,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                    aria-hidden="true"
                  >
                    <Sparkles size={14} color="var(--accent-deep)" strokeWidth={2.4} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      marginBottom: 4, flexWrap: 'wrap',
                    }}>
                      <Pill tone="sage">New proposal</Pill>
                      <ViewSourcePill partner={p.name} size="sm" />
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 4 }}>
                      {p.name} proposes {r.proposedTitle}
                    </div>
                    <div style={{ fontSize: 12, color: C.inkLight, lineHeight: 1.5 }}>
                      {fmtDate(r.proposedDate)} · {r.proposedTime} · {r.proposedCapacity} ppl
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}

          {/* Reconciliation queue */}
          <Card
            onClick={() => router.push('/np/volunteers')}
            style={{ padding: 18, borderLeft: `3px solid var(--amber)` }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <div
                style={{
                  width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                  background: 'var(--amber-bg)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
                aria-hidden="true"
              >
                <AlertCircle size={14} color="var(--amber-fg)" strokeWidth={2.4} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  marginBottom: 4, flexWrap: 'wrap',
                }}>
                  <Pill tone="amber">Reconciliation</Pill>
                  <ViewSourcePill partner="CloudMotion" size="sm" />
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 4 }}>
                  {reconciliationCount} CloudMotion volunteers signed up, no scan
                </div>
                <div style={{ fontSize: 12, color: C.inkLight, lineHeight: 1.5 }}>
                  Daniel, Aisha, and Roman from the Apr 10 sort shift. Cross-check with VIEW check-in data.
                </div>
              </div>
            </div>
          </Card>

          {/* In-kind to value */}
          {inkindToValue.slice(0, 1).map(d => (
            <Card
              key={`ik-${d.id}`}
              onClick={() => router.push('/np/donations')}
              style={{ padding: 18 }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div
                  style={{
                    width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                    background: C.oat,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                  aria-hidden="true"
                >
                  <PackageCheck size={14} color={C.muted} strokeWidth={2.4} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    marginBottom: 4, flexWrap: 'wrap',
                  }}>
                    <Pill tone="neutral">Receipt to issue</Pill>
                    {d.source === 'view-partner' && <ViewSourcePill partner={d.donorName.split(' · ')[0]} size="sm" />}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 4 }}>
                    {d.description}
                  </div>
                  <div style={{ fontSize: 12, color: C.inkLight, lineHeight: 1.5 }}>
                    {d.donorName} · ${d.estimatedValue.toLocaleString()} estimated value · received {fmtDate(d.receivedDate, false)}
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {/* Recognition milestone */}
          {augusto && (
            <Card
              onClick={() => router.push(`/np/volunteers/${augusto.id}`)}
              style={{ padding: 18 }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div
                  style={{
                    width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                    background: C.sageGlow,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                  aria-hidden="true"
                >
                  <Award size={14} color="var(--accent-deep)" strokeWidth={2.4} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    marginBottom: 4, flexWrap: 'wrap',
                  }}>
                    <Pill tone="sage">Recognition</Pill>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 4 }}>
                    Augusto Vega just passed 25 events
                  </div>
                  <div style={{ fontSize: 12, color: C.inkLight, lineHeight: 1.5 }}>
                    Quarterly recognition mailer goes out Friday. Hand-write this one.
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* THIS MONTH AT A GLANCE */}
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 14, fontWeight: 600, color: C.ink, margin: '0 0 16px' }}>
          This month at a glance
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
        <div style={{
          marginTop: 12, fontSize: 11, color: C.muted,
          display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap',
        }}>
          <span>Cash this month: <strong style={{ color: C.ink, fontFamily: 'var(--font-mono)' }}>${(viewMatchThisMonth + directThisMonth).toLocaleString()}</strong></span>
          <span>·</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <span style={{
              width: 8, height: 8, borderRadius: '50%',
              background: 'var(--view-source)',
            }} aria-hidden="true" />
            <span>${viewMatchThisMonth.toLocaleString()} via VIEW match</span>
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <span style={{
              width: 8, height: 8, borderRadius: '50%',
              background: 'var(--accent)',
            }} aria-hidden="true" />
            <span>${directThisMonth.toLocaleString()} direct</span>
          </span>
        </div>
      </div>

      {/* CORPORATE PARTNER PIPELINE */}
      <div style={{ marginBottom: 32 }}>
        <div className="flex flex-wrap items-end justify-between gap-3" style={{ marginBottom: 16 }}>
          <div>
            <h2 style={{ fontSize: 14, fontWeight: 600, color: C.ink, margin: 0 }}>
              Corporate partner pipeline
            </h2>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>
              Where the relationships stand right now.
            </div>
          </div>
          <button
            onClick={() => router.push('/np/partners')}
            className="view-btn"
            style={{
              fontSize: 12, color: C.muted,
              background: 'transparent', border: 'none',
              cursor: 'pointer', padding: 4, borderRadius: 4,
              fontFamily: 'inherit',
            }}
          >
            See all partners →
          </button>
        </div>

        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div className="overflow-x-auto" style={{ scrollbarWidth: 'thin' }}>
            <div style={{ minWidth: 880, padding: '20px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'stretch', gap: 0 }}>
                {PIPELINE_STAGES.map((stage, i) => {
                  const data = pipelineCounts[stage.id];
                  const isLast = i === PIPELINE_STAGES.length - 1;
                  return (
                    <div key={stage.id} style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'stretch',
                    }}>
                      <div style={{
                        flex: 1, minWidth: 144,
                        padding: '14px 14px',
                        borderRadius: 'var(--radius)',
                        background: data.count > 0 ? C.sageGlow : C.oat,
                        opacity: data.count > 0 ? 1 : 0.6,
                        position: 'relative',
                      }}>
                        <div style={{
                          fontSize: 10, fontWeight: 700,
                          textTransform: 'uppercase', letterSpacing: '0.06em',
                          color: data.count > 0 ? 'var(--accent-deep)' : C.muted,
                          marginBottom: 8,
                        }}>
                          {stage.label}
                        </div>
                        <div style={{
                          fontFamily: 'var(--font-h1), sans-serif',
                          fontSize: 30, lineHeight: 1, fontWeight: 600,
                          color: data.count > 0 ? 'var(--accent-deep)' : C.muted,
                          marginBottom: 8,
                          fontVariantNumeric: 'tabular-nums',
                        }}>
                          {data.count}
                        </div>
                        <div style={{
                          fontSize: 10.5,
                          color: data.count > 0 ? 'var(--accent-deep)' : C.muted,
                          lineHeight: 1.4,
                          opacity: 0.85,
                          minHeight: 26,
                        }}>
                          {data.partners.length > 0 ? data.partners[0] : 'empty'}
                          {data.partners.length > 1 && ` +${data.partners.length - 1}`}
                        </div>
                      </div>
                      {!isLast && (
                        <div style={{
                          display: 'flex', alignItems: 'center',
                          flexShrink: 0, color: C.borderStrong,
                          padding: '0 4px',
                        }} aria-hidden="true">
                          <ChevronRight size={14} strokeWidth={2.2} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* VOLUNTEER PULSE — last 7 days */}
      <div style={{ marginBottom: 32 }}>
        <div className="flex items-end justify-between" style={{ marginBottom: 16 }}>
          <div>
            <h2 style={{ fontSize: 14, fontWeight: 600, color: C.ink, margin: 0 }}>
              Volunteer pulse
            </h2>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>
              Most recent activity · {NP_VOLUNTEERS.filter(v => v.status === 'active').length} active in pool
            </div>
          </div>
          <button
            onClick={() => router.push('/np/volunteers')}
            className="view-btn"
            style={{
              fontSize: 12, color: C.muted,
              background: 'transparent', border: 'none',
              cursor: 'pointer', padding: 4, borderRadius: 4,
              fontFamily: 'inherit',
            }}
          >
            See all volunteers →
          </button>
        </div>

        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {recentlyActive.map((v, i) => {
              const isLast = i === recentlyActive.length - 1;
              return (
                <button
                  key={v.id}
                  onClick={() => router.push(`/np/volunteers/${v.id}`)}
                  className="view-btn"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 200px auto',
                    gap: 16,
                    padding: '12px 18px',
                    fontFamily: 'inherit',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: isLast ? 'none' : `1px solid ${C.border}`,
                    cursor: 'pointer',
                    textAlign: 'left',
                    alignItems: 'center',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                    <Avatar name={v.name} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>{v.name}</span>
                        {v.source === 'view-partner' && v.employer && (
                          <ViewSourcePill partner={v.employer} size="sm" />
                        )}
                      </div>
                      <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>
                        {v.employer ?? 'Community volunteer'} · {v.totalHours} hrs total
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: C.muted, fontFamily: 'var(--font-mono)' }}>
                    last active {fmtDate(v.lastActive, false)}
                  </div>
                  <ArrowRight size={14} color={C.muted} aria-hidden="true" />
                </button>
              );
            })}
          </div>
        </Card>
      </div>

      {/* DRIFT SIGNAL — Cardinal Logistics */}
      {cardinal && (
        <Card
          onClick={() => router.push(`/np/partners/${cardinal.id}`)}
          style={{
            padding: 18,
            borderLeft: `3px solid var(--amber)`,
            background: C.oat,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
              background: 'var(--amber-bg)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }} aria-hidden="true">
              <Sparkles size={14} color="var(--amber-fg)" strokeWidth={2.4} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                marginBottom: 4, flexWrap: 'wrap',
              }}>
                <span style={{
                  fontSize: 10, fontWeight: 700,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  color: 'var(--amber-fg)',
                }}>
                  Drift signal
                </span>
                <ViewSourcePill partner="Cardinal Logistics" size="sm" />
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 4 }}>
                Cardinal Logistics has scheduled three events with us this year — but never asked about our IT volunteer needs.
              </div>
              <div style={{ fontSize: 12, color: C.inkLight, lineHeight: 1.55 }}>
                Renée mentioned at the August picnic that her ops team had bandwidth. The conversation has been
                quiet since November. Worth a check-in before the relationship cools further.
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

// ============================================================
// Sub-components
// ============================================================

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
    <Card style={{ padding: 18 }}>
      <div style={{
        fontSize: 10.5, color: C.muted,
        letterSpacing: '0.06em', textTransform: 'uppercase',
        fontWeight: 600, marginBottom: 6,
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: 'var(--font-h1), sans-serif',
        fontSize: 32, fontWeight: 600, color: C.ink,
        letterSpacing: '-0.02em',
        fontVariantNumeric: 'tabular-nums',
        display: 'flex', alignItems: 'baseline', gap: 4,
      }}>
        {value}
        {unit && (
          <span style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 13, fontWeight: 500, color: C.muted,
          }}>{unit}</span>
        )}
      </div>
      {split && total > 0 && (
        <div style={{
          marginTop: 10, height: 4,
          borderRadius: 999, background: C.oat,
          overflow: 'hidden', display: 'flex',
        }} aria-hidden="true">
          <div style={{
            width: `${viaPct}%`,
            background: 'var(--view-source)',
          }} />
          <div style={{
            flex: 1,
            background: 'var(--accent)',
          }} />
        </div>
      )}
      <div style={{
        fontSize: 11, color: C.muted, marginTop: 8,
        lineHeight: 1.5,
      }}>
        {sublabel}
      </div>
    </Card>
  );
}

function Avatar({ name }: { name: string }) {
  const initials = name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  return (
    <div
      style={{
        width: 32, height: 32, borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: `linear-gradient(135deg, var(--accent), var(--accent-deep))`,
        color: C.paper, fontSize: 11, fontWeight: 700,
        flexShrink: 0,
      }}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}

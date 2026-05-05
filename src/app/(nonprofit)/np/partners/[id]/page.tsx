'use client';

import { use } from 'react';
import { useRouter, notFound } from 'next/navigation';
import { Mail, Sparkles, Calendar, Users, Check, MessageSquare } from 'lucide-react';
import { C } from '@/lib/tokens';
import { fmtDate } from '@/lib/format';
import { PageHeader } from '@/components/primitives/PageHeader';
import { Card } from '@/components/primitives/Card';
import { Pill } from '@/components/primitives/Pill';
import { Button } from '@/components/primitives/Button';
import { ViewSourcePill } from '@/components/primitives/ViewSourcePill';
import { NP_CORPORATE_PARTNERS } from '@/lib/seed/np-corporate-partners';
import type { CorporatePartner } from '@/lib/types';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PartnerDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = use(params);
  const p = NP_CORPORATE_PARTNERS.find(x => x.id === id);
  if (!p) notFound();

  return (
    <div>
      <PageHeader
        back="Back to partners"
        onBack={() => router.push('/np/partners')}
        greeting={p.industry}
        title={p.name}
      />

      {/* Identity row */}
      <Card style={{ padding: 24, marginBottom: 20 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, alignItems: 'center' }}>
          <Logo name={p.name} large />
          <div style={{ flex: 1, minWidth: 240 }}>
            <div style={{
              display: 'flex', flexWrap: 'wrap',
              gap: 10, marginBottom: 10,
            }}>
              {p.source === 'view-partner' && <ViewSourcePill partner={p.name} />}
              <HealthPill health={p.relationshipHealth} />
              <span style={{
                fontSize: 11, fontWeight: 600,
                padding: '2px 9px', borderRadius: 999,
                color: C.muted, background: C.oat,
                border: `1px solid ${C.border}`,
              }}>
                {p.yearsActive} year{p.yearsActive === 1 ? '' : 's'} together
              </span>
            </div>
            <div style={{
              display: 'flex', flexWrap: 'wrap',
              gap: 18, fontSize: 13, color: C.inkLight,
            }}>
              <a
                href={`mailto:${p.contactEmail}`}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  color: C.inkLight, textDecoration: 'none',
                }}
              >
                <Mail size={13} aria-hidden="true" />
                {p.contactName} · {p.contactEmail}
              </a>
              <span>Last activity {fmtDate(p.lastActivityAt, false)}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Pending request — the load-bearing demonstration of bidirectional flow */}
      {p.pendingRequest && (
        <Card ai style={{ padding: 0, marginBottom: 20, overflow: 'hidden' }}>
          <div style={{
            padding: '14px 22px',
            borderBottom: `1px solid ${C.border}`,
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', gap: 12,
            flexWrap: 'wrap',
          }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              fontSize: 11, fontWeight: 700,
              letterSpacing: '0.06em', textTransform: 'uppercase',
              color: 'var(--accent-deep)',
            }}>
              <Sparkles size={12} strokeWidth={2.4} aria-hidden="true" />
              New proposal · {p.name}&rsquo;s VIEW workspace
            </div>
            <ViewSourcePill partner={p.name} size="sm" />
          </div>

          <div style={{ padding: 22 }}>
            <h2 style={{
              fontFamily: 'var(--font-h1), sans-serif',
              fontSize: 22, fontWeight: 600,
              color: C.ink, margin: '0 0 6px',
              letterSpacing: '-0.015em',
            }}>
              {p.pendingRequest.proposedTitle}
            </h2>
            <div style={{
              display: 'flex', flexWrap: 'wrap',
              gap: 16, fontSize: 13, color: C.inkLight,
              marginBottom: 18,
            }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Calendar size={13} aria-hidden="true" />
                <strong style={{ fontWeight: 600 }}>{fmtDate(p.pendingRequest.proposedDate)}</strong>
                <span style={{ color: C.muted }}>· {p.pendingRequest.proposedTime}</span>
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Users size={13} aria-hidden="true" />
                {p.pendingRequest.proposedCapacity} people
              </span>
              <span>{p.pendingRequest.cause}</span>
              {p.pendingRequest.vto && <Pill tone="neutral">VTO eligible</Pill>}
            </div>

            <div style={{
              padding: 16,
              borderRadius: 'var(--radius)',
              background: 'var(--view-source-bg)',
              border: `1px solid var(--view-source)`,
              marginBottom: 18,
            }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                fontSize: 10, fontWeight: 700,
                letterSpacing: '0.06em', textTransform: 'uppercase',
                color: 'var(--view-source-fg)', marginBottom: 8,
              }}>
                <Sparkles size={11} strokeWidth={2.4} aria-hidden="true" />
                Capacity-fit reasoning · via VIEW
              </div>
              <p style={{
                margin: 0, fontSize: 13.5,
                color: C.inkLight, lineHeight: 1.6,
              }}>
                {p.pendingRequest.capacityFitReasoning}
              </p>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              <Button variant="primary" icon={Check}>Accept and confirm capacity</Button>
              <Button variant="soft" icon={MessageSquare}>Counter-propose</Button>
              <button className="view-btn" style={{
                fontSize: 13, fontWeight: 500, color: C.muted,
                background: 'transparent', border: 'none',
                cursor: 'pointer', padding: '10px 8px',
                fontFamily: 'inherit',
              }}>
                Decline politely
              </button>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-5">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Relationship summary */}
          <Card style={{ padding: 24 }}>
            <h2 style={{
              fontSize: 12, fontWeight: 700,
              letterSpacing: '0.06em', textTransform: 'uppercase',
              color: C.muted, margin: '0 0 16px',
            }}>
              Relationship summary
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 16,
            }}>
              <SummaryStat label="Years" value={p.yearsActive.toString()} />
              <SummaryStat label="Events hosted YTD" value={p.eventsHostedYtd.toString()} />
              <SummaryStat label="Hours YTD" value={p.hoursHostedYtd.toString()} />
              <SummaryStat label="Cash YTD" value={`$${(p.cashDonatedYtd / 1000).toFixed(p.cashDonatedYtd >= 10_000 ? 1 : 1)}k`} />
            </div>

            {/* Format mix */}
            <div style={{ marginTop: 24 }}>
              <div style={{
                fontSize: 10.5, fontWeight: 600, color: C.muted,
                letterSpacing: '0.06em', textTransform: 'uppercase',
                marginBottom: 10,
              }}>
                Format mix
              </div>
              <FormatBar mix={p.formatMix} />
              <div style={{
                display: 'flex', flexWrap: 'wrap',
                gap: 14, marginTop: 10,
                fontSize: 11, color: C.muted,
              }}>
                <LegendDot color="var(--accent)" label={`Direct service · ${Math.round(p.formatMix.directService * 100)}%`} />
                <LegendDot color="var(--view-source)" label={`Skills-based · ${Math.round(p.formatMix.skillsBased * 100)}%`} />
                <LegendDot color={C.borderStrong} label={`Grants only · ${Math.round(p.formatMix.grantsOnly * 100)}%`} />
              </div>
            </div>
          </Card>

          {/* Relationship history */}
          {p.history.length > 0 && (
            <Card style={{ padding: 24 }}>
              <h2 style={{
                fontSize: 12, fontWeight: 700,
                letterSpacing: '0.06em', textTransform: 'uppercase',
                color: C.muted, margin: '0 0 16px',
              }}>
                Relationship history
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {p.history.map(h => (
                  <div key={h.id} style={{
                    display: 'grid',
                    gridTemplateColumns: '110px 1fr auto',
                    gap: 16,
                    paddingBottom: 14,
                    borderBottom: `1px solid ${C.border}`,
                  }}>
                    <div style={{
                      fontSize: 12, color: C.muted,
                      fontFamily: 'var(--font-mono)',
                    }}>
                      {fmtDate(h.date, false)}
                    </div>
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: C.ink, marginBottom: 4 }}>
                        {h.title}
                      </div>
                      <div style={{ fontSize: 12, color: C.inkLight, lineHeight: 1.55 }}>
                        {h.outputs}
                      </div>
                    </div>
                    <div style={{
                      textAlign: 'right',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 12,
                      fontVariantNumeric: 'tabular-nums',
                    }}>
                      <div style={{ color: C.ink, fontWeight: 600 }}>{h.attended} ppl</div>
                      <div style={{ color: C.muted }}>{h.hours} hrs</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Communication log */}
          <Card style={{ padding: 24 }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', marginBottom: 16,
            }}>
              <h2 style={{
                fontSize: 12, fontWeight: 700,
                letterSpacing: '0.06em', textTransform: 'uppercase',
                color: C.muted, margin: 0,
              }}>
                Conversation log
              </h2>
              <button className="view-btn" style={{
                fontSize: 12, color: 'var(--accent-deep)', fontWeight: 600,
                background: 'transparent', border: 'none',
                cursor: 'pointer', fontFamily: 'inherit', padding: 0,
              }}>
                + Log a note
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {p.commLog.map((c, i) => (
                <div key={i} style={{
                  paddingLeft: 14,
                  borderLeft: `2px solid ${
                    c.author === 'Maria Velasquez' ? 'var(--accent)' : C.borderStrong
                  }`,
                }}>
                  <div style={{
                    fontSize: 11, color: C.muted,
                    fontFamily: 'var(--font-mono)',
                    marginBottom: 4,
                  }}>
                    {fmtDate(c.date, false)} · {c.author}
                  </div>
                  <div style={{ fontSize: 13, color: C.ink, lineHeight: 1.6 }}>
                    {c.body}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right rail */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card style={{ padding: 20 }}>
            <h3 style={{
              fontSize: 11, fontWeight: 700,
              letterSpacing: '0.06em', textTransform: 'uppercase',
              color: C.muted, margin: '0 0 12px',
            }}>
              What they like
            </h3>
            <ul style={{
              margin: 0, padding: 0, listStyle: 'none',
              display: 'flex', flexDirection: 'column', gap: 8,
            }}>
              {p.preferences.map((pref, i) => (
                <li key={i} style={{
                  fontSize: 13, color: C.ink, lineHeight: 1.5,
                  paddingLeft: 14, position: 'relative',
                }}>
                  <span style={{
                    position: 'absolute', left: 0, top: 8,
                    width: 4, height: 4, borderRadius: '50%',
                    background: 'var(--accent)',
                  }} aria-hidden="true" />
                  {pref}
                </li>
              ))}
            </ul>
            {p.source === 'view-partner' && (
              <div style={{
                marginTop: 14, paddingTop: 14,
                borderTop: `1px solid ${C.border}`,
                fontSize: 11, color: C.muted, lineHeight: 1.55,
              }}>
                Preference signals come from {p.name}&rsquo;s employee survey data, surfaced via VIEW.
              </div>
            )}
          </Card>

          <Card style={{ padding: 20 }}>
            <h3 style={{
              fontSize: 11, fontWeight: 700,
              letterSpacing: '0.06em', textTransform: 'uppercase',
              color: C.muted, margin: '0 0 10px',
            }}>
              Source
            </h3>
            <div style={{
              padding: 12, borderRadius: 'var(--radius)',
              background: p.source === 'view-partner'
                ? 'var(--view-source-bg)'
                : C.oat,
              border: `1px solid ${
                p.source === 'view-partner' ? 'var(--view-source)' : C.border
              }`,
            }}>
              <div style={{
                fontSize: 11, fontWeight: 600,
                color: p.source === 'view-partner'
                  ? 'var(--view-source-fg)'
                  : C.muted,
                letterSpacing: '0.04em', textTransform: 'uppercase',
                marginBottom: 6,
              }}>
                {p.source === 'view-partner' ? 'via VIEW' : 'Direct relationship'}
              </div>
              <div style={{ fontSize: 12, color: C.inkLight, lineHeight: 1.55 }}>
                {p.source === 'view-partner'
                  ? 'Pending requests, capacity reasoning, and post-event hours flow into your workspace through VIEW.'
                  : 'Managed the way you\'ve always managed corporate partnerships — email, calls, shared docs.'}
              </div>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}

// Reused with the list page; defined locally to avoid sharing across files
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

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{
        fontSize: 10.5, fontWeight: 600, color: C.muted,
        letterSpacing: '0.06em', textTransform: 'uppercase',
        marginBottom: 6,
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: 'var(--font-h1), sans-serif',
        fontSize: 26, fontWeight: 600, color: C.ink,
        letterSpacing: '-0.015em',
        fontVariantNumeric: 'tabular-nums',
      }}>
        {value}
      </div>
    </div>
  );
}

function FormatBar({ mix }: { mix: CorporatePartner['formatMix'] }) {
  return (
    <div style={{
      height: 6, borderRadius: 999,
      background: C.oat, overflow: 'hidden',
      display: 'flex',
    }} aria-hidden="true">
      <div style={{
        width: `${mix.directService * 100}%`,
        background: 'var(--accent)',
      }} />
      <div style={{
        width: `${mix.skillsBased * 100}%`,
        background: 'var(--view-source)',
      }} />
      <div style={{
        width: `${mix.grantsOnly * 100}%`,
        background: C.borderStrong,
      }} />
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <span style={{
        width: 8, height: 8, borderRadius: '50%',
        background: color,
      }} aria-hidden="true" />
      {label}
    </span>
  );
}

function Logo({ name, large = false }: { name: string; large?: boolean }) {
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
  const size = large ? 64 : 44;

  return (
    <div
      aria-hidden="true"
      style={{
        width: size, height: size,
        borderRadius: 'var(--radius)',
        background: `linear-gradient(135deg, ${a}, ${b})`,
        color: '#FFFFFF',
        fontSize: large ? 22 : 14, fontWeight: 700,
        letterSpacing: '-0.02em',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}

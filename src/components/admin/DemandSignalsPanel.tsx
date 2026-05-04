import { Sparkles } from 'lucide-react';
import { C } from '@/lib/tokens';
import { Card } from '@/components/primitives/Card';
import { DEMAND_SIGNALS } from '@/lib/seed/demand-signals';

const trendIcon = (t: 'up' | 'steady' | 'emerging'): string =>
  t === 'up' ? '↗' : t === 'emerging' ? '✦' : '→';

const trendColor = (t: 'up' | 'steady' | 'emerging'): string =>
  t === 'up' ? C.sage : t === 'emerging' ? C.terracotta : C.muted;

// What employees are signaling, before any partner is on the table.
// Per research: this is step 1 of the operator's actual cycle.
export function DemandSignalsPanel() {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
      }}>
        <div>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: C.ink, margin: 0 }}>
            What your people are signaling
          </h2>
          <p style={{ fontSize: 12, color: C.muted, margin: '4px 0 0' }}>
            What we&rsquo;re seeing this quarter, before you plan.
          </p>
        </div>
        <span style={{ fontSize: 11, color: C.muted, fontStyle: 'italic' }}>
          Survey + giving + ERG asks · refreshed daily
        </span>
      </div>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        {/* Top: ranked causes */}
        <div style={{ padding: '20px 28px' }}>
          <div style={{
            fontSize: 10, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.06em',
            color: C.muted, marginBottom: 14,
          }}>
            Causes by signal strength
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {DEMAND_SIGNALS.causes.map((c) => (
              <div key={c.cause} style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <div style={{ flex: '0 0 140px', display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span style={{
                    fontFamily: 'var(--font-h1), sans-serif',
                    fontSize: 22, color: C.ink, lineHeight: 1,
                  }}>
                    {c.strength}
                  </span>
                  <span style={{ fontSize: 11, color: C.muted }}>%</span>
                  <span style={{
                    fontSize: 13,
                    color: trendColor(c.trend),
                    marginLeft: 4,
                  }} aria-hidden="true">
                    {trendIcon(c.trend)}
                  </span>
                  <span style={{
                    fontSize: 10, color: C.muted,
                    textTransform: 'uppercase', letterSpacing: '0.06em',
                    marginLeft: 2,
                  }}>
                    {c.trend}
                  </span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 4 }}>
                    {c.cause}
                  </div>
                  <div style={{ fontSize: 11, color: C.inkLight, lineHeight: 1.55 }}>
                    {c.sources.join(' · ')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mid: ERG asks + calendar moments */}
        <div
          className="grid grid-cols-1 md:grid-cols-2"
          style={{ borderTop: `1px solid ${C.border}` }}
        >
          <div
            className="border-b md:border-b-0 md:border-r"
            style={{
              padding: '16px 24px 16px 28px',
              borderColor: C.border,
            }}
          >
            <div style={{
              fontSize: 10, fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.06em',
              color: C.muted, marginBottom: 10,
            }}>
              ERG asks pending
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {DEMAND_SIGNALS.asks.map((a, i) => (
                <div key={i} style={{ fontSize: 12, color: C.inkLight, lineHeight: 1.5 }}>
                  <span style={{ color: C.ink, fontWeight: 600 }}>{a.from}</span> · {a.what}
                  <span style={{ color: C.muted, marginLeft: 6, fontStyle: 'italic' }}>{a.when}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ padding: '16px 28px 16px 24px' }}>
            <div style={{
              fontSize: 10, fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.06em',
              color: C.muted, marginBottom: 10,
            }}>
              Moments coming up
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {DEMAND_SIGNALS.moments.map((m, i) => (
                <div key={i} style={{ fontSize: 12, color: C.inkLight, lineHeight: 1.5 }}>
                  <span style={{ color: C.ink, fontWeight: 600 }}>{m.label}</span>
                  <span style={{ color: C.muted, marginLeft: 6 }}>{m.when}</span>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{m.note}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom: drift signal — the most operator-critical insight */}
        <div style={{
          padding: '14px 28px',
          background: C.terracottaGlow,
          borderTop: `1px solid var(--accent)`,
          display: 'flex',
          alignItems: 'flex-start',
          gap: 10,
        }}>
          <Sparkles
            size={13}
            color={C.terracottaDeep}
            aria-hidden="true"
            style={{ flexShrink: 0, marginTop: 2 }}
          />
          <div style={{ fontSize: 12, color: C.terracottaDeep, lineHeight: 1.55 }}>
            <span style={{ fontWeight: 600 }}>
              Drift signal · {DEMAND_SIGNALS.drift.partner}.
            </span>{' '}
            {DEMAND_SIGNALS.drift.note}
          </div>
        </div>
      </Card>
    </div>
  );
}

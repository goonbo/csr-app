'use client';

import { use } from 'react';
import { useRouter, notFound } from 'next/navigation';
import { Send, Quote, Sparkles, ArrowRight } from 'lucide-react';
import { C } from '@/lib/tokens';
import { fmtDate } from '@/lib/format';
import { PageHeader } from '@/components/primitives/PageHeader';
import { Card } from '@/components/primitives/Card';
import { Button } from '@/components/primitives/Button';
import { ViewSourcePill } from '@/components/primitives/ViewSourcePill';
import { EVENTS } from '@/lib/seed/events';
import { NP_RECAPS } from '@/lib/seed/np-recap';
import { NP_CORPORATE_PARTNERS } from '@/lib/seed/np-corporate-partners';

interface PageProps {
  params: Promise<{ eventId: string }>;
}

export default function NonprofitRecapPage({ params }: PageProps) {
  const router = useRouter();
  const { eventId } = use(params);

  const event = EVENTS.find(e => e.id === eventId);
  const recap = NP_RECAPS.find(r => r.eventId === eventId);
  if (!event || !recap) notFound();

  // The corporate partner that hosted with us. For the seeded recap of e3,
  // it's CloudMotion. The data-shape doesn't carry this directly because
  // Event.partner reads from the corporate-side perspective, so we resolve
  // by walking the corporate-partners history.
  const partner = NP_CORPORATE_PARTNERS.find(p =>
    p.history.some(h => h.id === eventId || h.title === event.title),
  );

  return (
    <div data-theme="blueprint">
      <PageHeader
        back="Back to home"
        onBack={() => router.push('/np')}
        greeting="Our recap, our framing"
        title={event.title}
        action={
          <Button variant="primary" icon={Send}>
            Send to {partner?.name ?? 'corporate partner'}
          </Button>
        }
      />

      <div style={{
        display: 'flex', flexWrap: 'wrap',
        gap: 14, fontSize: 13, color: C.inkLight,
        marginBottom: 32, marginTop: -16,
        paddingBottom: 20, borderBottom: `1px solid ${C.border}`,
      }}>
        <span style={{ fontWeight: 600 }}>{fmtDate(event.date!)}</span>
        <span>·</span>
        <span>{event.location}</span>
        {partner && (
          <>
            <span>·</span>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
            }}>
              Hosted with {partner.name}
              <ViewSourcePill partner={partner.name} size="sm" />
            </span>
          </>
        )}
      </div>

      {/* Maria's framing — the narrative hero */}
      <Card style={{ padding: 36, marginBottom: 24 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          fontSize: 11, fontWeight: 700,
          letterSpacing: '0.06em', textTransform: 'uppercase',
          color: C.muted, marginBottom: 18,
        }}>
          What we accomplished
        </div>
        <p style={{
          fontFamily: 'var(--font-h1), serif',
          fontSize: 22, fontWeight: 350,
          lineHeight: 1.45, color: C.ink,
          margin: 0, maxWidth: 720,
          letterSpacing: '-0.005em',
        }}>
          {recap.ourFraming}
        </p>
      </Card>

      {/* Outputs band — KPI numerals in serif */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{
          fontSize: 12, fontWeight: 700,
          letterSpacing: '0.06em', textTransform: 'uppercase',
          color: C.muted, margin: '0 0 14px',
        }}>
          In our terms
        </h2>
        <Card style={{ padding: 28 }}>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-y-6 gap-x-3">
            {recap.outputs.map((o, i) => (
              <div key={i}>
                <div style={{
                  fontFamily: 'var(--font-h1), serif',
                  fontSize: 30, fontWeight: 350,
                  color: C.ink, lineHeight: 1,
                  letterSpacing: '-0.02em',
                  fontVariantNumeric: 'tabular-nums',
                  marginBottom: 6,
                }}>
                  {o.value}
                </div>
                <div style={{
                  fontSize: 11, fontWeight: 600, color: C.muted,
                  letterSpacing: '0.04em', textTransform: 'uppercase',
                }}>
                  {o.metric}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Voices */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{
          fontSize: 12, fontWeight: 700,
          letterSpacing: '0.06em', textTransform: 'uppercase',
          color: C.muted, margin: '0 0 14px',
        }}>
          Volunteer voices
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {recap.voices.map((v, i) => (
            <Card key={i} style={{ padding: 22 }}>
              <Quote
                size={18} strokeWidth={2}
                color="var(--accent)"
                aria-hidden="true"
                style={{ marginBottom: 10, opacity: 0.8 }}
              />
              <p style={{
                fontFamily: 'var(--font-h1), serif',
                fontStyle: 'italic',
                fontSize: 15, fontWeight: 350,
                lineHeight: 1.55, color: C.ink,
                margin: '0 0 14px',
              }}>
                &ldquo;{v.quote}&rdquo;
              </p>
              <div style={{
                fontSize: 11, color: C.muted,
                fontWeight: 600,
                letterSpacing: '0.02em',
                paddingTop: 12, borderTop: `1px solid ${C.border}`,
              }}>
                {v.who}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Partnership reflection */}
      <Card style={{ padding: 28, marginBottom: 24 }}>
        <h2 style={{
          fontSize: 12, fontWeight: 700,
          letterSpacing: '0.06em', textTransform: 'uppercase',
          color: C.muted, margin: '0 0 14px',
        }}>
          What this partnership has built
        </h2>
        <p style={{
          fontFamily: 'var(--font-h1), serif',
          fontSize: 17, fontWeight: 350,
          lineHeight: 1.6, color: C.ink,
          margin: 0, maxWidth: 720,
        }}>
          {recap.partnershipReflection}
        </p>
      </Card>

      {/* Asks — the editable, honest section */}
      <div style={{ marginBottom: 24 }}>
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', marginBottom: 14,
          flexWrap: 'wrap', gap: 8,
        }}>
          <div>
            <h2 style={{
              fontSize: 12, fontWeight: 700,
              letterSpacing: '0.06em', textTransform: 'uppercase',
              color: C.muted, margin: 0,
            }}>
              Areas where we&rsquo;d love more support
            </h2>
            <p style={{
              fontSize: 12, color: C.muted, margin: '4px 0 0',
              fontStyle: 'italic',
            }}>
              Editable. Choose which to share back to {partner?.name ?? 'the corporate partner'}.
            </p>
          </div>
          <button className="view-btn" style={{
            fontSize: 12, color: 'var(--accent-deep)',
            background: 'transparent', border: 'none',
            cursor: 'pointer', fontFamily: 'inherit',
            padding: '4px 8px', borderRadius: 'var(--radius-sm)',
            fontWeight: 600,
          }}>
            + Add an ask
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {recap.asks.map((ask, i) => (
            <AskCard key={i} ask={ask} />
          ))}
        </div>
      </div>

      {/* Footer ribbon — bidirectional flow note */}
      <Card ai style={{ padding: 22 }}>
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: 12,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
            background: 'var(--view-source-bg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: `1px solid var(--view-source)`,
          }} aria-hidden="true">
            <Sparkles size={14} color="var(--view-source)" strokeWidth={2.4} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: 11, fontWeight: 700,
              letterSpacing: '0.06em', textTransform: 'uppercase',
              color: 'var(--view-source-fg)', marginBottom: 6,
            }}>
              The recap loop, two-way
            </div>
            <p style={{
              fontSize: 14, lineHeight: 1.55, color: C.ink,
              margin: 0, maxWidth: 680,
            }}>
              {partner?.name ?? 'The corporate partner'} already received their recap from the
              corporate side — attendance, outputs, hours. Yours is the one only you can write:
              the framing in your terms, the voices from your community, and the asks the
              email thread tends to swallow.
            </p>
            <div style={{
              display: 'flex', flexWrap: 'wrap',
              gap: 12, marginTop: 14,
            }}>
              <Button variant="primary" icon={Send}>
                Send to {partner?.name ?? 'corporate partner'}
              </Button>
              {partner && (
                <button
                  onClick={() => router.push(`/np/partners/${partner.id}`)}
                  className="view-btn"
                  style={{
                    fontSize: 13, fontWeight: 500, color: C.muted,
                    background: 'transparent', border: 'none',
                    cursor: 'pointer', fontFamily: 'inherit',
                    padding: '10px 4px',
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                  }}
                >
                  View their relationship history <ArrowRight size={13} aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function AskCard({ ask }: { ask: { type: 'skills' | 'funding' | 'capacity'; title: string; body: string } }) {
  const config = {
    skills:   { label: 'Skills-based', color: 'var(--accent)',     bg: 'var(--accent-glow)' },
    funding:  { label: 'Funding',      color: 'var(--amber)',      bg: 'var(--amber-bg)' },
    capacity: { label: 'Capacity',     color: 'var(--view-source)', bg: 'var(--view-source-bg)' },
  } as const;
  const c = config[ask.type];

  return (
    <Card style={{
      padding: 20,
      borderLeft: `3px solid ${c.color}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <span style={{
          fontSize: 10, fontWeight: 700,
          padding: '2px 8px', borderRadius: 999,
          color: c.color, background: c.bg,
          border: `1px solid ${c.color}`,
          letterSpacing: '0.04em', textTransform: 'uppercase',
        }}>
          {c.label}
        </span>
        <h3 style={{
          fontFamily: 'var(--font-h1), serif',
          fontSize: 18, fontWeight: 400,
          color: C.ink, margin: 0,
          letterSpacing: '-0.005em',
        }}>
          {ask.title}
        </h3>
        <span style={{ flex: 1 }} />
        <label style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontSize: 11, color: C.muted, cursor: 'pointer',
        }}>
          <input
            type="checkbox"
            defaultChecked
            style={{ accentColor: 'var(--accent)' }}
          />
          Include in send
        </label>
      </div>
      <p style={{
        fontSize: 14, lineHeight: 1.6, color: C.inkLight,
        margin: 0, maxWidth: 680,
      }}>
        {ask.body}
      </p>
    </Card>
  );
}

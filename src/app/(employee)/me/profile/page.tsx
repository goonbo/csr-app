'use client';

import { useState } from 'react';
import { Sparkles, Check, Heart } from 'lucide-react';
import { C } from '@/lib/tokens';
import { fmtDate } from '@/lib/format';
import { causeStyle } from '@/lib/cause';
import { EVENTS } from '@/lib/seed/events';
import { EMPLOYEES, EMPLOYEE_SIGNALS } from '@/lib/seed/employees';
import type { Event, Cause } from '@/lib/types';
import { PageHeader } from '@/components/primitives/PageHeader';
import { Card } from '@/components/primitives/Card';

const ME_ID = 'u1';
const MY_ATTENDED_IDS = ['e3', 'e4'];

// Per-attendee hours estimate — seed only carries event totals.
const PER_EVENT_HOURS = 3;

const ALL_CAUSES: Cause[] = [
  'Food Security',
  'Environment',
  'Youth Education',
  'Animal Welfare',
  'Housing',
  'Mental Health',
];

export default function EmployeeProfilePage() {
  const me = EMPLOYEES.find(e => e.id === ME_ID);
  if (!me) throw new Error('Missing employee seed for u1');

  const attended = EVENTS.filter(e => MY_ATTENDED_IDS.includes(e.id));

  // Hours per cause — sums attended-event approximation
  const causeHours = new Map<string, number>();
  for (const e of attended) {
    causeHours.set(e.cause, (causeHours.get(e.cause) || 0) + PER_EVENT_HOURS);
  }
  // Pad up to total — leftover hours allocated to first cause as "other engagements"
  const summed = Array.from(causeHours.values()).reduce((s, n) => s + n, 0);
  if (summed < me.hours && causeHours.size > 0) {
    const first = Array.from(causeHours.keys())[0];
    causeHours.set(first, (causeHours.get(first) || 0) + (me.hours - summed));
  }

  const causeBreakdown = Array.from(causeHours.entries())
    .map(([cause, hours]) => ({ cause: cause as Cause, hours }))
    .sort((a, b) => b.hours - a.hours);

  const maxHours = Math.max(1, ...causeBreakdown.map(c => c.hours));

  const initials = me.name.split(' ').map(s => s[0]).join('');

  // Editable cause preferences (mirrors EMPLOYEE_SIGNALS but interactive)
  const [topCauses, setTopCauses] = useState<Cause[]>(EMPLOYEE_SIGNALS.topCauses);
  const toggleCause = (c: Cause) => {
    setTopCauses(prev =>
      prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c],
    );
  };

  return (
    <div>
      <PageHeader
        greeting="Your impact"
        title={me.name}
        subtitle={`${me.dept} · CSR signal contributor`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        {/* LEFT — hours hero, cause breakdown, history */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Hours hero */}
          <Card style={{ padding: 32 }}>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <div style={{
                  fontSize: 11, fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                  color: C.muted, marginBottom: 8,
                }}>
                  Hours given · this year
                </div>
                <div style={{
                  fontFamily: 'var(--font-h1), sans-serif',
                  fontSize: 64, lineHeight: 1, color: C.ink,
                  fontVariantNumeric: 'tabular-nums',
                }}>
                  {me.hours}
                </div>
                <div style={{
                  fontSize: 13, color: C.inkLight,
                  marginTop: 8, lineHeight: 1.55,
                }}>
                  Across {attended.length} events and {causeBreakdown.length} cause
                  {causeBreakdown.length === 1 ? '' : 's'} — equivalent to{' '}
                  <span style={{ fontStyle: 'italic', color: C.sageDeep }}>
                    a half-week of work given back to your community.
                  </span>
                </div>
              </div>
              <div
                aria-hidden="true"
                style={{
                  width: 88, height: 88, borderRadius: '50%',
                  background: `linear-gradient(135deg, ${C.sage}, ${C.sageLight})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white',
                  fontSize: 28, fontWeight: 600,
                  fontFamily: 'var(--font-h1), sans-serif',
                  flexShrink: 0,
                }}
              >
                {initials}
              </div>
            </div>
          </Card>

          {/* Cause breakdown */}
          {causeBreakdown.length > 0 && (
            <Card style={{ padding: 28 }}>
              <h2 style={{
                fontSize: 14, fontWeight: 600, color: C.ink,
                margin: '0 0 16px',
              }}>
                Where your time went
              </h2>
              <div style={{
                display: 'flex', flexDirection: 'column', gap: 14,
              }}>
                {causeBreakdown.map(b => {
                  const cs = causeStyle(b.cause);
                  const widthPct = Math.round((b.hours / maxHours) * 100);
                  return (
                    <div key={b.cause}>
                      <div className="flex items-center justify-between" style={{
                        fontSize: 12, marginBottom: 6,
                      }}>
                        <div style={{
                          display: 'flex', alignItems: 'center', gap: 8,
                          color: C.ink, fontWeight: 500,
                        }}>
                          <span
                            aria-hidden="true"
                            style={{
                              width: 10, height: 10, borderRadius: '50%',
                              background: cs.gradient,
                            }}
                          />
                          {b.cause}
                        </div>
                        <span style={{
                          fontFamily: 'var(--font-h1), sans-serif',
                          fontSize: 16, color: C.ink,
                          fontVariantNumeric: 'tabular-nums',
                        }}>
                          {b.hours}
                          <span style={{
                            fontSize: 11, color: C.muted, marginLeft: 3,
                          }}>
                            h
                          </span>
                        </span>
                      </div>
                      <div
                        aria-hidden="true"
                        style={{
                          height: 6, borderRadius: 999,
                          background: C.oat, overflow: 'hidden',
                        }}
                      >
                        <div style={{
                          width: `${widthPct}%`,
                          height: '100%',
                          background: cs.gradient,
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* History */}
          <Card style={{ padding: 28 }}>
            <h2 style={{
              fontSize: 14, fontWeight: 600, color: C.ink,
              margin: '0 0 16px',
            }}>
              Your timeline
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {attended.length === 0 ? (
                <p style={{
                  fontSize: 13, color: C.muted, fontStyle: 'italic',
                  margin: 0,
                }}>
                  Your timeline starts with the first event you attend.
                </p>
              ) : (
                attended.map((e, i) => (
                  <TimelineRow
                    key={e.id}
                    event={e}
                    isLast={i === attended.length - 1}
                  />
                ))
              )}
            </div>
          </Card>
        </div>

        {/* RIGHT — preferences */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card style={{ padding: 24 }}>
            <h2 style={{
              fontSize: 11, fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.06em',
              color: C.muted, marginBottom: 12, marginTop: 0,
            }}>
              Causes you care about
            </h2>
            <p style={{
              fontSize: 12, color: C.inkLight,
              lineHeight: 1.5, margin: '0 0 14px',
            }}>
              We use these to surface matches on your home and in opportunities.
            </p>
            <div className="flex flex-wrap" style={{ gap: 6 }}>
              {ALL_CAUSES.map(c => {
                const active = topCauses.includes(c);
                return (
                  <button
                    key={c}
                    onClick={() => toggleCause(c)}
                    className="view-btn"
                    aria-pressed={active}
                    style={{
                      padding: '5px 12px',
                      borderRadius: 999,
                      fontSize: 11, fontWeight: 600, fontFamily: 'inherit',
                      cursor: 'pointer',
                      background: active ? C.sageGlow : 'transparent',
                      color: active ? C.sageDeep : C.muted,
                      borderTop: `1px solid ${active ? 'var(--accent)' : C.borderStrong}`,
                      borderRight: `1px solid ${active ? 'var(--accent)' : C.borderStrong}`,
                      borderBottom: `1px solid ${active ? 'var(--accent)' : C.borderStrong}`,
                      borderLeft: `1px solid ${active ? 'var(--accent)' : C.borderStrong}`,
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      transition: 'background 150ms, color 150ms, border-color 150ms',
                    }}
                  >
                    {active && <Check size={10} strokeWidth={3} aria-hidden="true" />}
                    {c}
                  </button>
                );
              })}
            </div>
          </Card>

          <Card style={{ padding: 24 }}>
            <h2 style={{
              fontSize: 11, fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.06em',
              color: C.muted, marginBottom: 12, marginTop: 0,
            }}>
              How you like to volunteer
            </h2>
            <div style={{
              fontSize: 13, color: C.ink, lineHeight: 1.55,
            }}>
              <span style={{ fontFamily: 'var(--font-h1), sans-serif', fontSize: 16, fontStyle: 'italic' }}>
                {EMPLOYEE_SIGNALS.preferredFormat}.
              </span>
              <div style={{
                fontSize: 12, color: C.muted, marginTop: 8,
              }}>
                Adjust this in survey before your next quarterly check-in.
              </div>
            </div>
          </Card>

          <Card ai style={{ padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <div
                aria-hidden="true"
                style={{
                  width: 28, height: 28, borderRadius: '50%', background: C.sage,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Sparkles size={12} color="white" strokeWidth={2.2} />
              </div>
              <div>
                <div style={{
                  fontSize: 13, fontWeight: 600,
                  color: C.ink, marginBottom: 4,
                }}>
                  You&rsquo;re consistent.
                </div>
                <div style={{
                  fontSize: 12, color: C.inkLight, lineHeight: 1.55,
                }}>
                  18h across two quarters puts you in the top 18% of contributors at CloudMotion. Sarah may reach out about being a captain next event.
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function TimelineRow({ event, isLast }: { event: Event; isLast: boolean }) {
  const cs = causeStyle(event.cause);
  return (
    <div
      style={{
        display: 'flex', gap: 14,
        paddingBottom: isLast ? 0 : 18,
        position: 'relative',
      }}
    >
      {/* dot + connecting line */}
      <div style={{
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: 12,
      }}>
        <span
          aria-hidden="true"
          style={{
            width: 12, height: 12, borderRadius: '50%',
            background: cs.gradient,
            marginTop: 4,
          }}
        />
        {!isLast && (
          <span
            aria-hidden="true"
            style={{
              width: 1, flex: 1,
              background: C.border,
              marginTop: 4,
            }}
          />
        )}
      </div>

      <div style={{ flex: 1, minWidth: 0, paddingBottom: 4 }}>
        <div style={{
          fontSize: 11, fontWeight: 600,
          textTransform: 'uppercase', letterSpacing: '0.06em',
          color: C.muted, marginBottom: 2,
        }}>
          {event.date ? fmtDate(event.date) : 'Date pending'}
        </div>
        <div style={{
          fontSize: 14, fontWeight: 500,
          color: C.ink, marginBottom: 4,
        }}>
          {event.title}
        </div>
        <div style={{
          fontSize: 12, color: C.inkLight, lineHeight: 1.55,
        }}>
          {event.partner ?? 'Independent'}
          {event.outputs && (
            <>
              {' · '}
              <span style={{ fontStyle: 'italic' }}>{event.outputs}</span>
            </>
          )}
        </div>
        <div style={{
          marginTop: 8,
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontSize: 11,
          padding: '3px 10px',
          borderRadius: 999,
          background: C.sageGlow,
          color: C.sageDeep,
          borderTop: '1px solid var(--accent)',
          borderRight: '1px solid var(--accent)',
          borderBottom: '1px solid var(--accent)',
          borderLeft: '1px solid var(--accent)',
          fontWeight: 600,
        }}>
          <Heart size={10} strokeWidth={2.4} aria-hidden="true" />
          {PER_EVENT_HOURS}h logged
        </div>
      </div>
    </div>
  );
}

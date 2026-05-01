'use client';

import { use } from 'react';
import { useRouter, notFound } from 'next/navigation';
import {
  Sparkles, Edit3, Send, AlertCircle, CheckCircle2,
  ChevronRight, Users, Check,
} from 'lucide-react';
import { C } from '@/lib/tokens';
import { fmtDate } from '@/lib/format';
import { EVENTS } from '@/lib/seed/events';
import { EMPLOYEES } from '@/lib/seed/employees';
import { pipelineConfig } from '@/lib/seed/pipeline';
import type {
  Event as EventType, Diagnosis, AtRiskOption,
  Reconciliation, Employee,
} from '@/lib/types';
import { PageHeader } from '@/components/primitives/PageHeader';
import { Card } from '@/components/primitives/Card';
import { Pill } from '@/components/primitives/Pill';
import { Button } from '@/components/primitives/Button';

interface EventDetailPageProps {
  params: Promise<{ id: string }>;
}

interface AttendeeRow extends Employee {
  status: 'attended' | 'no_show' | 'registered';
  hrs: number;
}

export default function EventDetailPage({ params }: EventDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const event = EVENTS.find(e => e.id === id);
  if (!event) notFound();

  const isDone = event.status === 'completed';
  const stage = pipelineConfig(event.pipeline);
  const showCommandCenter = event.pipeline === 'recruiting' || event.pipeline === 'at-risk';

  const attendees: AttendeeRow[] = EMPLOYEES.slice(0, 5).map((u, i) => ({
    ...u,
    status: isDone ? (i === 4 ? 'no_show' : 'attended') : 'registered',
    hrs: isDone && i < 4 ? 3 : 0,
  }));

  const subtitleParts: string[] = [];
  if (event.date) subtitleParts.push(fmtDate(event.date));
  if (event.time) subtitleParts.push(event.time);
  if (event.location) subtitleParts.push(event.location);
  const subtitle = subtitleParts.length
    ? subtitleParts.join(' · ')
    : 'Date and location pending';

  return (
    <div>
      <PageHeader
        back="All events"
        onBack={() => router.push('/events')}
        greeting={event.partner ?? 'Partner pending'}
        title={event.title}
        subtitle={subtitle}
        action={
          isDone ? (
            <Button
              variant="ai"
              icon={Sparkles}
              onClick={() => router.push(`/events/${event.id}/recap`)}
            >
              Generate exec recap
            </Button>
          ) : (
            <Button variant="soft" icon={Edit3}>Edit event</Button>
          )
        }
      />

      {/* Pipeline stage row */}
      <div className="flex flex-wrap items-center gap-2" style={{ marginBottom: 24 }}>
        <span style={{
          fontSize: 11, fontWeight: 600,
          textTransform: 'uppercase', letterSpacing: '0.06em',
          color: C.muted,
        }}>
          Stage
        </span>
        <Pill tone={stage.tone}>{stage.label}</Pill>
        {event.managerNudgeSent && <Pill tone="neutral" icon={Send}>Manager nudge sent</Pill>}
        {event.remoteFriendly && <Pill tone="neutral">Remote-friendly</Pill>}
        {event.vto && <Pill tone="terracotta">VTO eligible</Pill>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-4">
          {event.pipeline === 'at-risk' && event.diagnosis && (
            <AtRiskDiagnosis diagnosis={event.diagnosis} options={event.options} />
          )}

          {showCommandCenter && <DayOfCommandCenter event={event} />}

          <StageNote event={event} />

          {(isDone || event.registered > 0) && (
            <AttendeesList attendees={attendees} event={event} isDone={isDone} />
          )}

          {isDone && event.reconciliation && (
            <ReconciliationQueue reconciliation={event.reconciliation} />
          )}

          {isDone && event.outputs && (
            <Card soft style={{ padding: 28 }}>
              <h2 style={{
                fontSize: 14, fontWeight: 600, color: C.ink,
                marginBottom: 12, marginTop: 0,
              }}>
                What we accomplished
              </h2>
              <p style={{
                fontFamily: 'var(--font-serif), serif',
                fontSize: 17, fontStyle: 'italic',
                color: C.inkLight, lineHeight: 1.55,
                margin: 0,
              }}>
                {event.outputs}
              </p>
            </Card>
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="flex flex-col gap-4">
          <EventDetailsCard event={event} isDone={isDone} stage={stage} />
          {event.partner && event.partnerId && (
            <PartnerLinkCard
              partner={event.partner}
              partnerId={event.partnerId}
              router={router}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// SUB-COMPONENTS
// ============================================================

function AtRiskDiagnosis({
  diagnosis,
  options,
}: {
  diagnosis: Diagnosis[];
  options?: AtRiskOption[];
}) {
  return (
    <Card style={{ padding: 0, overflow: 'hidden', borderTop: `3px solid #A33333` }}>
      <div style={{ padding: '20px 28px', borderBottom: `1px solid ${C.border}` }}>
        <div style={{
          fontSize: 11, fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: '0.06em',
          color: '#7A2222', marginBottom: 4,
        }}>
          Why this might be at risk
        </div>
        <h2 style={{ fontSize: 15, fontWeight: 600, color: C.ink, margin: 0 }}>
          {diagnosis.length} candidate causes — your call which to act on
        </h2>
      </div>

      <div style={{
        padding: '20px 28px',
        display: 'flex', flexDirection: 'column', gap: 14,
      }}>
        {diagnosis.map((d, i) => {
          const confTone =
            d.confidence === 'high'   ? { bg: '#F4D6D6', color: '#7A2222', border: '#D89494' } :
            d.confidence === 'medium' ? { bg: '#F5E8C8', color: '#6B4E1A', border: '#D4B96A' } :
            { bg: C.oat, color: C.inkLight, border: C.borderStrong };
          return (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={{
                flexShrink: 0,
                marginTop: 2,
                padding: '2px 8px',
                fontSize: 10,
                fontWeight: 600,
                borderRadius: 999,
                background: confTone.bg,
                color: confTone.color,
                border: `1px solid ${confTone.border}`,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}>
                {d.confidence}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 4 }}>
                  {d.cause}
                </div>
                <div style={{ fontSize: 12, color: C.inkLight, lineHeight: 1.55 }}>
                  {d.evidence}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {options && options.length > 0 && (
        <div style={{
          padding: '20px 28px',
          borderTop: `1px solid ${C.border}`,
          background: C.oat,
        }}>
          <div style={{
            fontSize: 11, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.06em',
            color: C.muted, marginBottom: 12,
          }}>
            Options on the table
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {options.map((opt, i) => {
              const tones = {
                sage:  { dot: C.sage,    label: 'Cheapest move' },
                amber: { dot: '#A87E2E', label: 'Worth weighing' },
                rose:  { dot: '#A33333', label: 'Last resort' },
              };
              const t = tones[opt.tone];
              return (
                <div key={i} style={{
                  display: 'flex',
                  gap: 12,
                  alignItems: 'flex-start',
                  padding: 12,
                  borderRadius: 10,
                  background: C.paper,
                  border: `1px solid ${C.border}`,
                }}>
                  <div
                    style={{
                      flexShrink: 0,
                      marginTop: 5,
                      width: 8, height: 8,
                      borderRadius: '50%',
                      background: t.dot,
                    }}
                    aria-hidden="true"
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="flex flex-wrap" style={{ justifyContent: 'space-between', marginBottom: 4, gap: 8 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>{opt.label}</div>
                      <span style={{
                        fontSize: 10,
                        color: C.muted,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        fontWeight: 600,
                      }}>
                        {t.label}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: C.inkLight, lineHeight: 1.55 }}>
                      {opt.detail}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <p style={{
            fontSize: 11, color: C.muted, lineHeight: 1.5,
            margin: '12px 0 0', fontStyle: 'italic',
          }}>
            AI surfaces the diagnosis. The decision is yours.
          </p>
        </div>
      )}
    </Card>
  );
}

function DayOfCommandCenter({ event }: { event: EventType }) {
  const checkedIn = Math.floor(event.registered * 0.62);
  return (
    <Card style={{ padding: 0, overflow: 'hidden', borderTop: `3px solid ${C.terracotta}` }}>
      <div className="flex flex-wrap items-center justify-between gap-3" style={{
        padding: '20px 28px',
        borderBottom: `1px solid ${C.border}`,
      }}>
        <div>
          <div style={{
            fontSize: 11, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.06em',
            color: C.terracotta, marginBottom: 4,
          }}>
            Day-of command center
          </div>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: C.ink, margin: 0 }}>
            Live operations
          </h2>
        </div>
        <span style={{ fontSize: 11, color: C.muted, fontStyle: 'italic' }}>
          Updates every 30 sec
        </span>
      </div>

      {/* Live attendance variance */}
      <div className="grid grid-cols-3 gap-4" style={{
        padding: '20px 28px',
        borderBottom: `1px solid ${C.border}`,
      }}>
        {[
          { label: 'Registered', value: String(event.registered), sub: 'Confirmed signups', tone: 'ink' as const },
          { label: 'Checked in', value: String(checkedIn), sub: '62% of expected', tone: 'sage' as const },
          { label: 'Variance', value: '−4', sub: 'Slightly below pace', tone: 'amber' as const },
        ].map(m => (
          <div key={m.label}>
            <div style={{
              fontSize: 10, fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.06em',
              color: C.muted, marginBottom: 6,
            }}>
              {m.label}
            </div>
            <div style={{
              fontFamily: 'var(--font-serif), serif',
              fontSize: 32, lineHeight: 1,
              color: m.tone === 'sage' ? C.sage : m.tone === 'amber' ? '#6B4E1A' : C.ink,
              marginBottom: 4,
            }}>
              {m.value}
            </div>
            <div style={{ fontSize: 11, color: C.muted }}>{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Two-column live ops: stack on narrow */}
      <div
        className="grid grid-cols-1 md:grid-cols-2"
        style={{ gap: 0 }}
      >
        <div
          className="border-b md:border-b-0 md:border-r"
          style={{
            padding: '20px 24px 20px 28px',
            borderColor: C.border,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <CheckCircle2 size={13} color={C.sage} aria-hidden="true" />
            <span style={{ fontSize: 12, fontWeight: 600, color: C.ink }}>
              Guest list synced
            </span>
          </div>
          <div style={{ fontSize: 11, color: C.inkLight, lineHeight: 1.6, marginBottom: 12 }}>
            Latest version sent to building security 6 minutes ago. 47 names match the live signup sheet.
          </div>
          <button
            className="view-btn"
            style={{
              fontSize: 11, color: C.terracotta, fontWeight: 600,
              background: 'transparent', border: 'none', cursor: 'pointer',
              padding: 0,
              display: 'inline-flex', alignItems: 'center', gap: 4,
              fontFamily: 'inherit',
            }}
          >
            Resend if list changed <ChevronRight size={11} aria-hidden="true" />
          </button>
        </div>

        <div style={{ padding: '20px 28px 20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <AlertCircle size={13} color="#A87E2E" aria-hidden="true" />
            <span style={{ fontSize: 12, fontWeight: 600, color: C.ink }}>Supply check</span>
          </div>
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 6,
            fontSize: 11, color: C.inkLight,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Boxes</span>
              <span style={{ color: C.sage, fontWeight: 600 }}>✓ On site</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Aprons</span>
              <span style={{ color: C.sage, fontWeight: 600 }}>✓ On site</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Backup task plan</span>
              <span style={{ color: '#6B4E1A', fontWeight: 600 }}>Drafted</span>
            </div>
          </div>
        </div>
      </div>

      {/* Captain assignments */}
      <div style={{ padding: '20px 28px', borderTop: `1px solid ${C.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
          <Users size={13} color={C.muted} aria-hidden="true" />
          <span style={{ fontSize: 12, fontWeight: 600, color: C.ink }}>Team captains</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {[
            { name: 'Marcus L.', role: 'Check-in' },
            { name: 'Priya R.',  role: 'Stations' },
            { name: 'Jenna P.',  role: 'Photos' },
          ].map(c => (
            <div key={c.name} style={{
              padding: '6px 10px',
              borderRadius: 999,
              background: C.oat,
              border: `1px solid ${C.border}`,
              fontSize: 11,
              color: C.inkLight,
            }}>
              <span style={{ fontWeight: 600, color: C.ink }}>{c.name}</span>
              <span style={{ color: C.muted }}> · {c.role}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Incident log */}
      <div className="flex flex-wrap items-center justify-between gap-2" style={{
        padding: '14px 28px',
        background: C.oat,
        fontSize: 11,
        color: C.muted,
      }}>
        <span>Incident log: 0 issues reported</span>
        <span style={{ fontStyle: 'italic' }}>Tap to log a moment</span>
      </div>
    </Card>
  );
}

function StageNote({ event }: { event: EventType }) {
  let eyebrow = '';
  let note: string | undefined;
  let accent: string = C.borderStrong;
  let eyebrowColor: string = C.muted;

  switch (event.pipeline) {
    case 'sourcing':
      eyebrow = 'Sourcing brief';
      note = event.sourceNote;
      accent = C.borderStrong;
      eyebrowColor = C.muted;
      break;
    case 'vetting':
      eyebrow = 'Awaiting partner';
      note = event.awaitingPartner;
      accent = C.amber;
      eyebrowColor = C.amber;
      break;
    case 'proposed':
      eyebrow = 'Awaiting approval';
      note = event.awaitingApproval;
      accent = C.amber;
      eyebrowColor = C.amber;
      break;
    case 'confirmed':
      eyebrow = 'Comms plan';
      note = event.confirmedNote;
      accent = C.sageDeep;
      eyebrowColor = C.sageDeep;
      break;
    default:
      return null;
  }

  if (!note) return null;

  return (
    <Card style={{ padding: 0, overflow: 'hidden', borderTop: `3px solid ${accent}` }}>
      <div style={{ padding: '20px 28px' }}>
        <div style={{
          fontSize: 11, fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: '0.06em',
          color: eyebrowColor, marginBottom: 8,
        }}>
          {eyebrow}
        </div>
        <p style={{
          fontFamily: 'var(--font-serif), serif',
          fontSize: 17, fontStyle: 'italic',
          color: C.inkLight, lineHeight: 1.55,
          margin: 0,
        }}>
          {note}
        </p>
      </div>
    </Card>
  );
}

function AttendeesList({
  attendees,
  event,
  isDone,
}: {
  attendees: AttendeeRow[];
  event: EventType;
  isDone: boolean;
}) {
  const remainingCount =
    isDone && event.attended && event.attended > 5
      ? event.attended - 5
      : event.registered > 5
      ? event.registered - 5
      : 0;

  return (
    <Card style={{ padding: 28 }}>
      <h2 style={{
        fontSize: 14, fontWeight: 600, color: C.ink,
        marginBottom: 20, marginTop: 0,
      }}>
        {isDone ? 'Who showed up · hours logged' : "Who's signed up"}
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {attendees.map(a => (
          <div
            key={a.id}
            className="flex flex-wrap items-center justify-between gap-3"
            style={{ padding: 12, borderRadius: 12 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
              <div
                style={{
                  width: 36, height: 36, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontSize: 11, fontWeight: 600,
                  background: `linear-gradient(135deg, ${C.sage}, ${C.sageLight})`,
                  flexShrink: 0,
                }}
                aria-hidden="true"
              >
                {a.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: C.ink }}>{a.name}</div>
                <div style={{ fontSize: 11, color: C.muted }}>{a.dept}</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {a.status === 'attended' && (
                <>
                  <Pill tone="sage" icon={Check}>Attended</Pill>
                  <span style={{ fontSize: 12, width: 48, textAlign: 'right', color: C.inkLight }}>
                    {a.hrs}h
                  </span>
                </>
              )}
              {a.status === 'no_show' && <Pill tone="rose">Missed</Pill>}
              {a.status === 'registered' && <Pill tone="sage">Confirmed</Pill>}
            </div>
          </div>
        ))}
        {remainingCount > 0 && (
          <div style={{
            fontSize: 12, textAlign: 'center', paddingTop: 12, color: C.muted,
          }}>
            + {remainingCount} more
          </div>
        )}
      </div>
    </Card>
  );
}

function ReconciliationQueue({ reconciliation }: { reconciliation: Reconciliation }) {
  const itemCount =
    (reconciliation.checkInGap?.length ?? 0) +
    (reconciliation.retroactiveHours?.length ?? 0) +
    (reconciliation.photoConsent?.length ?? 0);

  return (
    <Card style={{ padding: 0, overflow: 'hidden', borderTop: `3px solid ${C.terracotta}` }}>
      <div className="flex flex-wrap items-center justify-between gap-3" style={{
        padding: '20px 28px',
        borderBottom: `1px solid ${C.border}`,
      }}>
        <div>
          <div style={{
            fontSize: 11, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.06em',
            color: C.terracotta, marginBottom: 4,
          }}>
            Review queue
          </div>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: C.ink, margin: 0 }}>
            Reconcile before the recap
          </h2>
        </div>
        <span style={{ fontSize: 11, color: C.muted, fontStyle: 'italic' }}>
          {itemCount} items
        </span>
      </div>

      {reconciliation.checkInGap && reconciliation.checkInGap.length > 0 && (
        <div style={{ padding: '16px 28px', borderBottom: `1px solid ${C.border}` }}>
          <div style={{
            fontSize: 11, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.06em',
            color: C.muted, marginBottom: 12,
          }}>
            Signed up but no check-in scan ({reconciliation.checkInGap.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {reconciliation.checkInGap.map((item, i) => (
              <div
                key={i}
                className="flex flex-wrap items-center justify-between gap-3"
                style={{
                  padding: '8px 12px',
                  borderRadius: 10,
                  background: C.oat,
                  border: `1px solid ${C.border}`,
                }}
              >
                <div style={{
                  display: 'flex', alignItems: 'center',
                  gap: 10, minWidth: 0,
                }}>
                  <div
                    style={{
                      width: 28, height: 28, borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontSize: 10, fontWeight: 600,
                      background: `linear-gradient(135deg, ${C.muted}, ${C.mutedLight})`,
                      flexShrink: 0,
                    }}
                    aria-hidden="true"
                  >
                    {item.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: C.ink }}>{item.name}</div>
                    <div style={{ fontSize: 11, color: C.muted }}>{item.dept}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button className="view-btn" style={{
                    padding: '5px 12px', fontSize: 11, fontWeight: 600, fontFamily: 'inherit',
                    borderRadius: 999,
                    background: C.sageGlow, color: C.sageDeep,
                    border: `1px solid #A8C09E`,
                    cursor: 'pointer',
                  }}>
                    Mark attended
                  </button>
                  <button className="view-btn" style={{
                    padding: '5px 12px', fontSize: 11, fontWeight: 600, fontFamily: 'inherit',
                    borderRadius: 999,
                    background: '#F4D6D6', color: '#7A2222',
                    border: `1px solid #D89494`,
                    cursor: 'pointer',
                  }}>
                    No-show
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {reconciliation.retroactiveHours && reconciliation.retroactiveHours.length > 0 && (
        <div style={{ padding: '16px 28px', borderBottom: `1px solid ${C.border}` }}>
          <div style={{
            fontSize: 11, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.06em',
            color: C.muted, marginBottom: 12,
          }}>
            Retroactive hours requested ({reconciliation.retroactiveHours.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {reconciliation.retroactiveHours.map((item, i) => (
              <div
                key={i}
                style={{
                  padding: 12,
                  borderRadius: 10,
                  background: C.paper,
                  border: `1px solid ${C.border}`,
                }}
              >
                <div className="flex flex-wrap items-center justify-between gap-2" style={{ marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>{item.name}</span>
                    <span style={{ fontSize: 11, color: C.muted }}>{item.dept}</span>
                    <span style={{
                      fontFamily: 'var(--font-serif), serif',
                      fontSize: 18, color: C.ink, marginLeft: 8,
                    }}>
                      {item.requested}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="view-btn" style={{
                      padding: '4px 10px', fontSize: 11, fontWeight: 600, fontFamily: 'inherit',
                      borderRadius: 999,
                      background: C.sageGlow, color: C.sageDeep,
                      border: `1px solid #A8C09E`,
                      cursor: 'pointer',
                    }}>
                      Approve
                    </button>
                    <button className="view-btn" style={{
                      padding: '4px 10px', fontSize: 11, fontWeight: 600, fontFamily: 'inherit',
                      borderRadius: 999,
                      background: C.oat, color: C.inkLight,
                      border: `1px solid ${C.borderStrong}`,
                      cursor: 'pointer',
                    }}>
                      Decline
                    </button>
                  </div>
                </div>
                <div style={{ fontSize: 12, color: C.inkLight, lineHeight: 1.5 }}>
                  {item.note}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {reconciliation.photoConsent && reconciliation.photoConsent.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-2" style={{
          padding: '16px 28px',
          background: C.oat,
          fontSize: 12,
          color: C.inkLight,
        }}>
          <span>{reconciliation.photoConsent[0].note}</span>
          <button
            className="view-btn"
            style={{
              fontSize: 11, color: C.terracotta, fontWeight: 600,
              background: 'transparent', border: 'none', cursor: 'pointer',
              padding: 4, borderRadius: 4,
              display: 'inline-flex', alignItems: 'center', gap: 4,
              fontFamily: 'inherit',
            }}
          >
            Send consent reminder <ChevronRight size={11} aria-hidden="true" />
          </button>
        </div>
      )}
    </Card>
  );
}

function EventDetailsCard({
  event,
  isDone,
  stage,
}: {
  event: EventType;
  isDone: boolean;
  stage: ReturnType<typeof pipelineConfig>;
}) {
  return (
    <Card style={{ padding: 20 }}>
      <h2 style={{
        fontSize: 11, fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: '0.06em',
        color: C.muted, marginBottom: 12, marginTop: 0,
      }}>
        Event details
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
        <Row label="Stage">
          <Pill tone={stage.tone}>{stage.label}</Pill>
        </Row>
        {event.capacity > 0 && <Row label="Capacity"><span style={{ color: C.ink }}>{event.capacity}</span></Row>}
        {(event.registered > 0 || isDone) && (
          <Row label={isDone ? 'Attended' : 'Registered'}>
            <span style={{ color: C.ink }}>{event.attended ?? event.registered}</span>
          </Row>
        )}
        {isDone && (
          <Row label="Hours">
            <span style={{ color: C.ink }}>{event.hours}</span>
          </Row>
        )}
        <Row label="VTO">
          <span style={{ color: C.ink }}>{event.vto ? 'Yes' : 'No'}</span>
        </Row>
        {event.remoteFriendly && (
          <Row label="Remote">
            <span style={{ color: C.ink }}>Friendly</span>
          </Row>
        )}
      </div>
    </Card>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 8,
    }}>
      <span style={{ color: C.muted }}>{label}</span>
      {children}
    </div>
  );
}

function PartnerLinkCard({
  partner,
  partnerId,
  router,
}: {
  partner: string;
  partnerId: string;
  router: ReturnType<typeof useRouter>;
}) {
  return (
    <Card style={{ padding: 20 }}>
      <h2 style={{
        fontSize: 11, fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: '0.06em',
        color: C.muted, marginBottom: 12, marginTop: 0,
      }}>
        Partner
      </h2>
      <div style={{ fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 4 }}>
        {partner}
      </div>
      <button
        onClick={() => router.push(`/partners/${partnerId}`)}
        className="view-btn"
        style={{
          fontSize: 11, color: C.muted,
          background: 'transparent', border: 'none',
          cursor: 'pointer', padding: 4, borderRadius: 4,
          display: 'inline-flex', alignItems: 'center', gap: 4,
          marginLeft: -4,
          fontFamily: 'inherit',
        }}
      >
        View partner profile <ChevronRight size={11} aria-hidden="true" />
      </button>
    </Card>
  );
}

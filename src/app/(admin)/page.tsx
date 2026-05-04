'use client';

import { Fragment, useState, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertCircle, Clock, Edit3, Sparkles, Send, ChevronRight, ArrowRight,
} from 'lucide-react';
import { C } from '@/lib/tokens';
import { causeStyle } from '@/lib/cause';
import { fmtDate } from '@/lib/format';
import { EVENTS } from '@/lib/seed/events';
import { PIPELINE_STAGES } from '@/lib/seed/pipeline';
import type { Pipeline, PillTone, Event } from '@/lib/types';
import { PageHeader } from '@/components/primitives/PageHeader';
import { Card } from '@/components/primitives/Card';
import { Pill } from '@/components/primitives/Pill';
import { DemandSignalsPanel } from '@/components/admin/DemandSignalsPanel';

const computeGreeting = (): string => {
  const hour = new Date().getHours();
  return hour < 12
    ? 'Good morning, Sarah'
    : hour < 18
    ? 'Good afternoon, Sarah'
    : 'Good evening, Sarah';
};

// useSyncExternalStore lets us return a SSR-safe snapshot ("Good morning")
// while computing the time-aware version on the client without setState-in-effect.
const subscribeNoop = () => () => {};

export default function AdminHomePage() {
  const router = useRouter();
  const greeting = useSyncExternalStore(
    subscribeNoop,
    computeGreeting,
    () => 'Good morning, Sarah',
  );

  const completed = EVENTS.filter(e => e.status === 'completed');
  const totalHours = completed.reduce((s, e) => s + (e.hours || 0), 0);

  // Things that need her today, in priority order.
  const atRiskEvents = EVENTS.filter(e => e.pipeline === 'at-risk');
  const awaitingPartner = EVENTS.filter(e => e.pipeline === 'vetting' && e.awaitingPartner);
  const awaitingApproval = EVENTS.filter(e => e.pipeline === 'proposed' && e.awaitingApproval);
  const recapPending = EVENTS.filter(e => e.pipeline === 'completed');
  const recruitingEvents = EVENTS.filter(e => e.pipeline === 'recruiting');

  const attentionCount =
    atRiskEvents.length + awaitingPartner.length + awaitingApproval.length + recapPending.length;

  // Pipeline counts for the strip
  const pipelineCounts = PIPELINE_STAGES.reduce<Record<Pipeline, number>>((acc, stage) => {
    acc[stage.id] = EVENTS.filter(e => e.pipeline === stage.id).length;
    return acc;
  }, {} as Record<Pipeline, number>);

  return (
    <div>
      <PageHeader
        greeting={greeting}
        title="Here's your week."
        subtitle="What needs you today, where the pipeline stands, and the work in motion."
      />

      {/* WHAT NEEDS YOU TODAY — the operator wedge */}
      <div style={{ marginBottom: 32 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
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
          {/* At-risk events */}
          {atRiskEvents.map(e => {
            const causeCount = e.diagnosis ? e.diagnosis.length : 0;
            const fillPct = e.capacity ? Math.round((e.registered / e.capacity) * 100) : 0;
            return (
              <Card
                key={e.id}
                onClick={() => router.push(`/events/${e.id}`)}
                style={{ padding: 18, borderLeft: `3px solid var(--rose)` }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div
                    style={{
                      width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                      background: 'var(--rose-bg)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                    aria-hidden="true"
                  >
                    <AlertCircle size={14} color="var(--rose-fg)" strokeWidth={2.4} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      display: 'flex', alignItems: 'center',
                      gap: 8, marginBottom: 4, flexWrap: 'wrap',
                    }}>
                      <Pill tone="rose">At risk</Pill>
                      <span style={{ fontSize: 11, color: C.muted }}>
                        {e.date && fmtDate(e.date, false)} · {fillPct}% filled
                      </span>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 4 }}>
                      {e.title}
                    </div>
                    <div style={{ fontSize: 12, color: C.inkLight, lineHeight: 1.5 }}>
                      {causeCount > 0
                        ? <>{causeCount} candidate causes surfaced — review the diagnosis before acting</>
                        : <>Under-enrolled. Worth reviewing.</>
                      }
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}

          {/* Awaiting partner */}
          {awaitingPartner.map(e => (
            <Card
              key={e.id}
              onClick={() => router.push(`/events/${e.id}`)}
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
                  <Clock size={14} color="var(--amber-fg)" strokeWidth={2.4} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    display: 'flex', alignItems: 'center',
                    gap: 8, marginBottom: 4,
                  }}>
                    <Pill tone="amber">Awaiting partner</Pill>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 4 }}>
                    {e.partner}
                  </div>
                  <div style={{ fontSize: 12, color: C.inkLight, lineHeight: 1.5 }}>
                    {e.awaitingPartner}
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {/* Awaiting approval */}
          {awaitingApproval.map(e => (
            <Card
              key={e.id}
              onClick={() => router.push(`/events/${e.id}`)}
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
                  <Edit3 size={14} color="var(--amber-fg)" strokeWidth={2.4} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    display: 'flex', alignItems: 'center',
                    gap: 8, marginBottom: 4,
                  }}>
                    <Pill tone="amber">Approval pending</Pill>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 4 }}>
                    {e.title}
                  </div>
                  <div style={{ fontSize: 12, color: C.inkLight, lineHeight: 1.5 }}>
                    Waiting on {e.awaitingApproval}
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {/* Recap pending */}
          {recapPending.map(e => (
            <Card
              key={e.id}
              ai
              onClick={() => router.push(`/events/${e.id}/recap`)}
              style={{ padding: 18 }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div
                  style={{
                    width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                    background: C.sage,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                  aria-hidden="true"
                >
                  <Sparkles size={14} color="white" strokeWidth={2.4} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    display: 'flex', alignItems: 'center',
                    gap: 8, marginBottom: 4,
                  }}>
                    <Pill tone="sage">Recap ready</Pill>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 4 }}>
                    {e.title}
                  </div>
                  <div style={{ fontSize: 12, color: C.inkLight, lineHeight: 1.5 }}>
                    {e.attended} attended · {e.hours} hours · ready to share with leadership
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* DEMAND SIGNALS — workflow entry point */}
      <DemandSignalsPanel />

      {/* PIPELINE FLOW */}
      <PipelineFlow
        counts={pipelineCounts}
        stageEvents={PIPELINE_STAGES.reduce<Record<Pipeline, Event[]>>((acc, s) => {
          acc[s.id] = EVENTS.filter(e => e.pipeline === s.id);
          return acc;
        }, {} as Record<Pipeline, Event[]>)}
        eventsInMotion={EVENTS.filter(e => e.pipeline !== 'completed' && e.pipeline !== 'reported').length}
        atRiskCount={atRiskEvents.length}
        onSeeAll={() => router.push('/events')}
      />

      {/* KPI ROW + RECRUITING NOW */}
      <div
        className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6"
      >
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16,
          }}>
            <h2 style={{ fontSize: 14, fontWeight: 600, color: C.ink, margin: 0 }}>
              Recruiting now
            </h2>
            <button
              onClick={() => router.push('/events/new')}
              className="view-btn"
              style={{
                fontSize: 12, color: C.terracotta, fontWeight: 600,
                background: 'transparent', border: 'none', cursor: 'pointer',
                padding: 4, borderRadius: 4,
                display: 'inline-flex', alignItems: 'center', gap: 4,
              }}
            >
              Plan a new event <ArrowRight size={11} aria-hidden="true" />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {recruitingEvents.map(e => {
              const cs = causeStyle(e.cause);
              const dateBits = e.date ? fmtDate(e.date, false).split(' ') : ['', ''];
              return (
                <Card
                  key={e.id}
                  onClick={() => router.push(`/events/${e.id}`)}
                  style={{ padding: 20 }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                    <div
                      style={{
                        width: 56, height: 56, borderRadius: 14,
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center',
                        background: cs.gradient, flexShrink: 0, color: 'white',
                      }}
                      aria-hidden="true"
                    >
                      <div style={{
                        fontSize: 9, fontWeight: 700,
                        textTransform: 'uppercase', letterSpacing: '0.06em',
                        opacity: 0.95,
                      }}>
                        {dateBits[0]}
                      </div>
                      <div style={{
                        fontFamily: 'var(--font-h1), sans-serif',
                        fontSize: 20, lineHeight: 1,
                      }}>
                        {dateBits[1]}
                      </div>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 15, fontWeight: 500, color: C.ink, marginBottom: 4 }}>
                        {e.title}
                      </div>
                      <div style={{ fontSize: 12, color: C.muted, marginBottom: 10 }}>
                        {e.partner} · {e.time}
                      </div>
                      <div style={{
                        display: 'flex', alignItems: 'center',
                        gap: 8, flexWrap: 'wrap',
                      }}>
                        <Pill tone="sage">{e.registered}/{e.capacity} signed up</Pill>
                        {e.managerNudgeSent && <Pill tone="neutral" icon={Send}>Manager nudge sent</Pill>}
                        {e.vto && <Pill tone="terracotta">VTO</Pill>}
                      </div>
                    </div>
                    <ChevronRight size={16} color={C.muted} aria-hidden="true" style={{ alignSelf: 'center' }} />
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* RIGHT RAIL — KPI snapshot + AI suggestion */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card style={{ padding: 20 }}>
            <h3 style={{
              fontSize: 11, fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.06em',
              color: C.muted, marginBottom: 16, marginTop: 0,
            }}>
              Year so far
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: 'Volunteer hours', value: String(totalHours), sub: '+18% YoY', tone: 'sage' as const },
                { label: 'Participating', value: '62', sub: '31% of workforce' },
                { label: 'Active partners', value: '5', sub: '1 needs a hello' },
              ].map((k, i) => (
                <div
                  key={k.label}
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                    paddingBottom: i < 2 ? 14 : 0,
                    borderBottom: i < 2 ? `1px solid ${C.border}` : 'none',
                  }}
                >
                  <div>
                    <div style={{ fontSize: 12, color: C.muted }}>{k.label}</div>
                    <div style={{
                      fontSize: 11,
                      color: k.tone === 'sage' ? C.sage : C.muted,
                      marginTop: 2,
                    }}>
                      {k.sub}
                    </div>
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-h1), sans-serif',
                    fontSize: 24, color: C.ink, lineHeight: 1,
                  }}>
                    {k.value}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card ai style={{ padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <div
                style={{
                  width: 28, height: 28, borderRadius: '50%', background: C.sage,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}
                aria-hidden="true"
              >
                <Sparkles size={12} color="white" strokeWidth={2.2} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 4 }}>
                  Animal Center has been quiet
                </div>
                <div style={{ fontSize: 12, color: C.inkLight, lineHeight: 1.55 }}>
                  Last contact November. Worth a check-in before they fall off your active list.
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PIPELINE FLOW — horizontal stage band with tone-tinted chips,
// chevron flow connectors, and an alert pulse on at-risk.
// ============================================================

const STAGE_TONE_STYLES: Record<
  PillTone,
  { bg: string; accent: string; label: string; ring: string }
> = {
  neutral:    { bg: C.oat,             accent: C.borderStrong,  label: C.muted,          ring: C.border },
  sage:       { bg: C.sageGlow,        accent: C.sage,          label: C.sageDeep,       ring: C.sage },
  amber:      { bg: 'var(--amber-bg)', accent: 'var(--amber)',  label: 'var(--amber-fg)', ring: 'var(--amber)' },
  rose:       { bg: 'var(--rose-bg)',  accent: 'var(--rose)',   label: 'var(--rose-fg)',  ring: 'var(--rose)' },
  terracotta: { bg: C.terracottaGlow,  accent: C.terracotta,    label: C.terracottaDeep, ring: C.terracotta },
};

interface PipelineFlowProps {
  counts: Record<Pipeline, number>;
  stageEvents: Record<Pipeline, Event[]>;
  eventsInMotion: number;
  atRiskCount: number;
  onSeeAll: () => void;
}

// Phase grouping — gives the row narrative structure (Planning → Active → Done)
const PHASES: { label: string; stages: Pipeline[] }[] = [
  { label: 'Planning', stages: ['sourcing', 'vetting', 'proposed'] },
  { label: 'Active',   stages: ['confirmed', 'recruiting', 'at-risk'] },
  { label: 'Done',     stages: ['completed', 'reported'] },
];

// Hand-tuned shortenings for the prototype's known partners — keeps cells readable
// at narrow widths where org-suffix bloat ("Greater Austin Food Bank") would overflow.
const PARTNER_SHORT: Record<string, string> = {
  'Greater Austin Food Bank': 'Food Bank',
  'TreeFolks': 'TreeFolks',
  'Habitat for Humanity Greater Austin': 'Habitat',
  'Boys & Girls Club of the Austin Area': 'Boys & Girls',
  'Austin Animal Center Foundation': 'Animal Center',
};
const shortenPartner = (p: string | null): string =>
  !p ? '' : (PARTNER_SHORT[p] ?? p.split(' ').slice(0, 2).join(' '));

function cellMeta(events: Event[]): { primary: string; suffix: string } {
  if (events.length === 0) return { primary: '', suffix: '' };
  // Soonest upcoming first; completed ones sort last
  const sorted = [...events].sort((a, b) => {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;
    return a.date.localeCompare(b.date);
  });
  const e = sorted[0];
  const partner = shortenPartner(e.partner) || e.cause;
  const date = e.date ? fmtDate(e.date, false) : 'TBD';
  const suffix = events.length > 1 ? ` +${events.length - 1}` : '';
  return { primary: `${partner} · ${date}`, suffix };
}

function PipelineFlow({
  counts, stageEvents, eventsInMotion, atRiskCount, onSeeAll,
}: PipelineFlowProps) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div className="flex flex-wrap items-end justify-between gap-3" style={{ marginBottom: 16 }}>
        <div>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: C.ink, margin: 0 }}>Pipeline</h2>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>
            {eventsInMotion} in motion
            {atRiskCount > 0 && (
              <>
                {' · '}
                <span style={{ color: 'var(--rose-fg)', fontWeight: 600 }}>
                  {atRiskCount} need{atRiskCount === 1 ? 's' : ''} attention
                </span>
              </>
            )}
          </div>
        </div>
        <button
          onClick={onSeeAll}
          className="view-btn"
          style={{
            fontSize: 12, color: C.muted,
            background: 'transparent', border: 'none',
            cursor: 'pointer', padding: 4, borderRadius: 4,
            fontFamily: 'inherit',
          }}
        >
          See all →
        </button>
      </div>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div className="overflow-x-auto" style={{ scrollbarWidth: 'thin' }}>
          <div style={{ minWidth: 880, padding: '20px 16px 16px' }}>
            {/* Phase eyebrow row */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: 18,
              marginBottom: 12,
              paddingLeft: 4,
              paddingRight: 4,
            }}>
              {PHASES.map(phase => (
                <div
                  key={phase.label}
                  style={{
                    flex: phase.stages.length,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <span style={{
                    fontSize: 9,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: C.muted,
                    whiteSpace: 'nowrap',
                  }}>
                    {phase.label}
                  </span>
                  <span style={{
                    flex: 1,
                    height: 1,
                    background: `linear-gradient(90deg, color-mix(in srgb, ${C.borderStrong} 40%, transparent), transparent)`,
                  }} aria-hidden="true" />
                </div>
              ))}
            </div>

            {/* Stage cells row */}
            <div style={{
              display: 'flex',
              alignItems: 'stretch',
              gap: 0,
            }}>
              {PHASES.map((phase, phaseIdx) => (
                <Fragment key={phase.label}>
                  {phaseIdx > 0 && <PhaseDivider />}
                  <div style={{
                    flex: phase.stages.length,
                    display: 'flex',
                    alignItems: 'stretch',
                    gap: 0,
                  }}>
                    {phase.stages.map((stageId, i) => {
                      const stage = PIPELINE_STAGES.find(s => s.id === stageId)!;
                      const count = counts[stage.id] || 0;
                      const events = stageEvents[stage.id] || [];
                      const isAlert = stage.id === 'at-risk' && count > 0;
                      const isEmpty = count === 0;
                      const s = STAGE_TONE_STYLES[stage.tone];
                      const isLastInPhase = i === phase.stages.length - 1;
                      return (
                        <Fragment key={stage.id}>
                          <PipelineCell
                            stage={stage}
                            count={count}
                            events={events}
                            toneStyle={s}
                            isAlert={isAlert}
                            isEmpty={isEmpty}
                            onClick={onSeeAll}
                          />
                          {!isLastInPhase && (
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                flexShrink: 0,
                                color: C.borderStrong,
                                padding: '0 2px',
                              }}
                              aria-hidden="true"
                            >
                              <ChevronRight size={14} strokeWidth={2.2} />
                            </div>
                          )}
                        </Fragment>
                      );
                    })}
                  </div>
                </Fragment>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

// Visual divider between phases — slightly stronger than an in-phase chevron
// so the eye reads "phase boundary" rather than "more of the same."
function PhaseDivider() {
  return (
    <div
      style={{
        flexShrink: 0,
        width: 18,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        color: C.muted,
      }}
      aria-hidden="true"
    >
      <ChevronRight size={11} strokeWidth={2} style={{ opacity: 0.5, marginBottom: -8 }} />
      <ChevronRight size={14} strokeWidth={2.4} />
    </div>
  );
}

interface PipelineCellProps {
  stage: typeof PIPELINE_STAGES[number];
  count: number;
  events: Event[];
  toneStyle: { bg: string; accent: string; label: string; ring: string };
  isAlert: boolean;
  isEmpty: boolean;
  onClick: () => void;
}

function PipelineCell({
  stage, count, events, toneStyle: s, isAlert, isEmpty, onClick,
}: PipelineCellProps) {
  const [hover, setHover] = useState(false);
  const meta = cellMeta(events);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="view-btn"
      style={{
        flex: 1,
        minWidth: 116,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: '14px 14px 14px',
        borderRadius: 10,
        border: `1px solid ${isAlert ? s.ring : 'transparent'}`,
        background: isEmpty
          ? 'transparent'
          : `linear-gradient(180deg, ${s.bg} 0%, color-mix(in srgb, ${s.bg} 50%, transparent) 100%)`,
        position: 'relative',
        cursor: 'pointer',
        fontFamily: 'inherit',
        textAlign: 'left',
        transform: hover && !isEmpty ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: hover && !isEmpty
          ? `0 6px 16px rgba(0,0,0,0.08)`
          : isAlert
            ? `0 0 0 4px color-mix(in srgb, ${s.bg} 33%, transparent)`
            : 'none',
        transition: 'transform 160ms ease, box-shadow 160ms ease',
        opacity: isEmpty ? 0.55 : 1,
        overflow: 'hidden',
      }}
    >
      {/* Top accent bar — solid stripe for filled, dashed line for empty */}
      <div
        style={{
          position: 'absolute',
          top: isEmpty ? 1 : 0,
          left: 12, right: 12,
          height: 2,
          background: isEmpty ? 'transparent' : s.accent,
          borderRadius: 2,
          borderTop: isEmpty ? `1.5px dashed ${C.borderStrong}` : 'none',
        }}
        aria-hidden="true"
      />

      {/* Alert dot — pulses gently on at-risk */}
      {isAlert && (
        <span
          style={{
            position: 'absolute', top: 10, right: 10,
            width: 8, height: 8, borderRadius: '50%',
            background: s.accent,
            boxShadow: `0 0 0 4px ${s.bg}, 0 0 0 6px color-mix(in srgb, ${s.ring} 50%, transparent)`,
            animation: 'alert-pulse 1.8s ease-in-out infinite',
            transformOrigin: 'center',
          }}
          aria-hidden="true"
        />
      )}

      <div style={{
        fontSize: 10, fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: '0.06em',
        color: isEmpty ? C.mutedLight : s.label,
        marginBottom: 10,
      }}>
        {stage.short}
      </div>

      <div style={{
        fontFamily: 'var(--font-h1), sans-serif',
        fontSize: 34,
        lineHeight: 1,
        fontWeight: 400,
        color: isEmpty ? C.mutedLight : s.label,
        fontVariantNumeric: 'tabular-nums',
        marginBottom: 8,
        display: 'flex',
        alignItems: 'baseline',
        gap: 4,
      }}>
        {count}
        {meta.suffix && (
          <span style={{
            fontSize: 11,
            fontFamily: 'var(--font-sans), sans-serif',
            color: C.muted,
            fontStyle: 'italic',
          }}>
            {meta.suffix}
          </span>
        )}
      </div>

      {/* Per-cell context — partner + date or cause + status */}
      {meta.primary ? (
        <div style={{
          fontSize: 10.5,
          color: isEmpty ? C.mutedLight : s.label,
          opacity: 0.85,
          width: '100%',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          fontWeight: 500,
        }}>
          {meta.primary}
        </div>
      ) : isEmpty ? (
        <div style={{
          fontSize: 10.5,
          color: C.mutedLight,
          fontStyle: 'italic',
        }}>
          empty
        </div>
      ) : null}
    </button>
  );
}

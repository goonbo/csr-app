'use client';

import { useRouter } from 'next/navigation';
import { Sparkles, Calendar, ChevronRight } from 'lucide-react';
import { C } from '@/lib/tokens';
import { fmtDate } from '@/lib/format';
import { causeStyle } from '@/lib/cause';
import { EVENTS } from '@/lib/seed/events';
import { EMPLOYEES } from '@/lib/seed/employees';
import type { Event } from '@/lib/types';
import { PageHeader } from '@/components/primitives/PageHeader';
import { Card } from '@/components/primitives/Card';
import { Pill } from '@/components/primitives/Pill';

const ME_ID = 'u1'; // Sarah Chen — the logged-in employee
const VTO_POOL = 24; // 3 days/year — typical mid-market benefit

// Mocked: which events Sarah is signed up for vs has attended.
const MY_UPCOMING_IDS = ['e1', 'e2'];
const MY_ATTENDED_IDS = ['e3', 'e4'];

export default function EmployeeHomePage() {
  const router = useRouter();
  const me = EMPLOYEES.find(e => e.id === ME_ID);
  if (!me) throw new Error('Missing employee seed for u1');

  const upcoming = EVENTS.filter(e => MY_UPCOMING_IDS.includes(e.id));
  const attended = EVENTS.filter(e => MY_ATTENDED_IDS.includes(e.id));
  // Discoverable = anything Sarah could browse on /me/opportunities, minus her signups
  const discoverable = EVENTS.filter(
    e => e.pipeline === 'recruiting' ||
         e.pipeline === 'at-risk' ||
         e.pipeline === 'confirmed',
  ).filter(e => !MY_UPCOMING_IDS.includes(e.id)).length;

  const hoursLogged = me.hours;
  const causesTouched = new Set(attended.map(e => e.cause)).size;
  const eventsCount = attended.length;

  return (
    <div>
      <PageHeader
        greeting="Good morning, Sarah"
        title="Hours that matter."
        subtitle="Where you're headed, what's coming up, and the time you've already given."
      />

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        {/* LEFT — what's next */}
        <div>
          <div
            className="flex items-center justify-between"
            style={{ marginBottom: 16 }}
          >
            <h2 style={{ fontSize: 14, fontWeight: 600, color: C.ink, margin: 0 }}>
              What&rsquo;s next
            </h2>
            <button
              onClick={() => router.push('/me/opportunities')}
              className="view-btn"
              style={{
                fontSize: 12, color: C.terracotta, fontWeight: 600,
                background: 'transparent', border: 'none', cursor: 'pointer',
                padding: 4, borderRadius: 4,
                fontFamily: 'inherit',
              }}
            >
              Browse opportunities →
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {upcoming.map(e => (
              <UpcomingCard
                key={e.id}
                event={e}
                onClick={() => router.push(`/events/${e.id}`)}
              />
            ))}

            {/* CTA slot — discoverability into Opportunities */}
            <Card
              onClick={() => router.push('/me/opportunities')}
              style={{
                padding: 20,
                background: C.oat,
                borderTop: `1px dashed ${C.borderStrong}`,
                borderRight: `1px dashed ${C.borderStrong}`,
                borderBottom: `1px dashed ${C.borderStrong}`,
                borderLeft: `1px dashed ${C.borderStrong}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div
                  style={{
                    width: 56, height: 56, borderRadius: 14,
                    background: C.paper,
                    borderTop: `2px dashed ${C.borderStrong}`,
                    borderRight: `2px dashed ${C.borderStrong}`,
                    borderBottom: `2px dashed ${C.borderStrong}`,
                    borderLeft: `2px dashed ${C.borderStrong}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}
                  aria-hidden="true"
                >
                  <Calendar size={20} color={C.muted} strokeWidth={1.6} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 14, fontWeight: 500,
                    color: C.ink, marginBottom: 4,
                  }}>
                    Find your next one
                  </div>
                  <div style={{ fontSize: 12, color: C.inkLight, lineHeight: 1.5 }}>
                    {upcoming.length} signed up
                    {discoverable > 0
                      ? ` · ${discoverable} more open across the company`
                      : ' · all caught up — Sarah has more on the way'}
                  </div>
                </div>
                <ChevronRight size={16} color={C.muted} aria-hidden="true" />
              </div>
            </Card>
          </div>
        </div>

        {/* RIGHT — VTO + AI nudge */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card style={{ padding: 20 }}>
            <h2 style={{
              fontSize: 11, fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.06em',
              color: C.muted, marginBottom: 16, marginTop: 0,
            }}>
              Your year so far
            </h2>
            <VTORing used={hoursLogged} pool={VTO_POOL} />

            <div style={{
              marginTop: 18,
              paddingTop: 16,
              borderTop: `1px solid ${C.border}`,
              display: 'flex',
              justifyContent: 'space-between',
              gap: 12,
            }}>
              <Stat label="Events" value={String(eventsCount)} />
              <Stat label="Causes" value={String(causesTouched)} />
              <Stat label="Hours left" value={String(Math.max(0, VTO_POOL - hoursLogged))} />
            </div>
          </Card>

          {/* AI nudge — context-aware suggestion */}
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
                  Earth Week is in 3 days.
                </div>
                <div style={{ fontSize: 12, color: C.inkLight, lineHeight: 1.55 }}>
                  TreeFolks could use 28 more hands. Your team showed up for the food drive — they&rsquo;d love to do this with you.
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* RECENT — past attendance */}
      {attended.length > 0 && (
        <div style={{ marginTop: 40 }}>
          <h2 style={{
            fontSize: 14, fontWeight: 600,
            color: C.ink, margin: '0 0 16px',
          }}>
            Recent
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {attended.map(e => (
              <RecentRow
                key={e.id}
                event={e}
                onClick={() => router.push(`/events/${e.id}`)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function UpcomingCard({ event, onClick }: { event: Event; onClick: () => void }) {
  const cs = causeStyle(event.cause);
  const dateBits = event.date ? fmtDate(event.date, false).split(' ') : ['', ''];
  return (
    <Card onClick={onClick} style={{ padding: 20 }}>
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
          <div style={{
            fontSize: 15, fontWeight: 500,
            color: C.ink, marginBottom: 4,
          }}>
            {event.title}
          </div>
          <div style={{ fontSize: 12, color: C.muted, marginBottom: 10 }}>
            {event.partner} {event.time ? `· ${event.time}` : ''}
          </div>
          <div className="flex flex-wrap items-center" style={{ gap: 8 }}>
            <Pill tone="sage">You&rsquo;re in</Pill>
            {event.vto && <Pill tone="terracotta">VTO eligible</Pill>}
            {event.location && (
              <span style={{ fontSize: 11, color: C.muted }}>
                {event.location}
              </span>
            )}
          </div>
        </div>
        <ChevronRight
          size={16} color={C.muted} aria-hidden="true"
          style={{ alignSelf: 'center', flexShrink: 0 }}
        />
      </div>
    </Card>
  );
}

function VTORing({ used, pool }: { used: number; pool: number }) {
  const pct = Math.min(100, Math.round((used / pool) * 100));
  const r = 56;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - Math.min(1, used / pool));
  const COMPANY_AVG = 12;
  const overage = Math.max(0, used - COMPANY_AVG);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <svg
        width={140} height={140}
        viewBox="0 0 140 140"
        aria-hidden="true"
        style={{ flexShrink: 0 }}
      >
        <circle cx={70} cy={70} r={r} fill="none" stroke={C.oat} strokeWidth={10} />
        <circle
          cx={70} cy={70} r={r} fill="none"
          stroke={C.sage} strokeWidth={10}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 70 70)"
        />
        <text
          x={70} y={68} textAnchor="middle"
          style={{
            fontSize: 30,
            fontFamily: 'var(--font-h1), sans-serif',
            fill: C.ink,
          }}
        >
          {used}
        </text>
        <text
          x={70} y={88} textAnchor="middle"
          style={{
            fontSize: 11,
            fill: C.muted,
            fontWeight: 600,
            letterSpacing: '0.06em',
          }}
        >
          OF {pool}H
        </text>
      </svg>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12, color: C.inkLight, lineHeight: 1.55 }}>
          You&rsquo;ve used <span style={{ fontWeight: 600 }}>{pct}%</span> of your VTO benefit.
          {overage > 0 && (
            <>
              {' '}That&rsquo;s{' '}
              <span style={{ color: C.sageDeep, fontWeight: 600 }}>
                +{overage}h above
              </span>
              {' '}the company average.
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ textAlign: 'center', flex: 1 }}>
      <div style={{
        fontFamily: 'var(--font-h1), sans-serif',
        fontSize: 22, lineHeight: 1,
        color: C.ink, marginBottom: 4,
      }}>
        {value}
      </div>
      <div style={{
        fontSize: 10, color: C.muted, fontWeight: 600,
        textTransform: 'uppercase', letterSpacing: '0.06em',
      }}>
        {label}
      </div>
    </div>
  );
}

function RecentRow({ event, onClick }: { event: Event; onClick: () => void }) {
  const cs = causeStyle(event.cause);
  // Per-attendee hours approximation — seed only carries event totals.
  const yourHours = 3;
  return (
    <button
      onClick={onClick}
      className="view-btn"
      style={{
        display: 'flex', alignItems: 'center', gap: 16,
        padding: '12px 16px', background: 'transparent',
        borderTop: `1px solid ${C.border}`,
        borderRight: `1px solid ${C.border}`,
        borderBottom: `1px solid ${C.border}`,
        borderLeft: `1px solid ${C.border}`,
        borderRadius: 12,
        cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
        width: '100%',
      }}
    >
      <div
        style={{
          width: 10, height: 10, borderRadius: '50%',
          background: cs.gradient,
          flexShrink: 0,
        }}
        aria-hidden="true"
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 13, fontWeight: 500,
          color: C.ink, marginBottom: 2,
        }}>
          {event.title}
        </div>
        <div style={{ fontSize: 11, color: C.muted }}>
          {event.partner} {event.date ? `· ${fmtDate(event.date, false)}` : ''}
        </div>
      </div>
      <div style={{
        fontFamily: 'var(--font-h1), sans-serif',
        fontSize: 18, color: C.ink,
        flexShrink: 0,
      }}>
        {yourHours}h
      </div>
      <ChevronRight size={14} color={C.muted} aria-hidden="true" style={{ flexShrink: 0 }} />
    </button>
  );
}

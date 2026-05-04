'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Check, MapPin } from 'lucide-react';
import { C } from '@/lib/tokens';
import { fmtDate } from '@/lib/format';
import { causeStyle } from '@/lib/cause';
import { EVENTS } from '@/lib/seed/events';
import { EMPLOYEE_SIGNALS } from '@/lib/seed/employees';
import type { Event, Cause } from '@/lib/types';
import { PageHeader } from '@/components/primitives/PageHeader';
import { Card } from '@/components/primitives/Card';
import { Pill } from '@/components/primitives/Pill';

type FilterId = 'all' | 'matches' | 'open' | 'soon';
const ALREADY_SIGNED = new Set(['e1', 'e2']);

const FILTERS: { id: FilterId; label: string }[] = [
  { id: 'all',     label: 'All'             },
  { id: 'matches', label: 'Matches you'     },
  { id: 'open',    label: 'Open now'        },
  { id: 'soon',    label: 'Coming soon'     },
];

export default function OpportunitiesPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterId>('all');
  const [signedUp, setSignedUp] = useState<Set<string>>(new Set(ALREADY_SIGNED));

  // Pool: anything published or scheduled to publish soon
  const pool = EVENTS.filter(e =>
    e.pipeline === 'recruiting' ||
    e.pipeline === 'at-risk' ||
    e.pipeline === 'confirmed',
  );

  const isOpen = (e: Event) => e.pipeline === 'recruiting' || e.pipeline === 'at-risk';
  const matchesYou = (e: Event) =>
    EMPLOYEE_SIGNALS.topCauses.includes(e.cause as Cause);

  const filtered = pool.filter(e => {
    if (filter === 'matches') return matchesYou(e);
    if (filter === 'open')    return isOpen(e);
    if (filter === 'soon')    return !isOpen(e);
    return true;
  });

  // Most urgent first: open events sorted by date, then upcoming-confirmed
  const sorted = [...filtered].sort((a, b) => {
    if (isOpen(a) && !isOpen(b)) return -1;
    if (!isOpen(a) && isOpen(b)) return 1;
    if (a.date && b.date) return a.date.localeCompare(b.date);
    return 0;
  });

  const toggleSignup = (id: string) => {
    setSignedUp(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div>
      <PageHeader
        greeting="What&rsquo;s open"
        title="Find your next moment."
        subtitle="Causes you care about, partners we trust, and time off the company already promised."
      />

      {/* Filter tabs */}
      <div
        role="tablist"
        aria-label="Filter opportunities"
        className="flex flex-wrap"
        style={{
          gap: 4,
          padding: 4,
          borderRadius: 999,
          background: C.oat,
          borderTop: `1px solid ${C.border}`,
          borderRight: `1px solid ${C.border}`,
          borderBottom: `1px solid ${C.border}`,
          borderLeft: `1px solid ${C.border}`,
          marginBottom: 24,
          width: 'fit-content',
        }}
      >
        {FILTERS.map(f => {
          const active = filter === f.id;
          const count =
            f.id === 'all'     ? pool.length :
            f.id === 'matches' ? pool.filter(matchesYou).length :
            f.id === 'open'    ? pool.filter(isOpen).length :
                                 pool.filter(e => !isOpen(e)).length;
          return (
            <button
              key={f.id}
              role="tab"
              aria-selected={active}
              onClick={() => setFilter(f.id)}
              className="view-btn"
              style={{
                padding: '6px 14px',
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 500,
                fontFamily: 'inherit',
                color: active ? C.ink : C.muted,
                background: active ? C.paper : 'transparent',
                boxShadow: active ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                transition: 'background 150ms ease, color 150ms ease',
              }}
            >
              {f.label}
              <span style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Empty state */}
      {sorted.length === 0 && (
        <Card style={{ padding: 32 }}>
          <div style={{
            fontSize: 14, color: C.inkLight, lineHeight: 1.6,
          }}>
            Nothing here right now — try a different filter, or wait a few days.
            Sarah is sourcing new partners every week.
          </div>
        </Card>
      )}

      {/* Opportunity grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sorted.map(e => (
          <OpportunityCard
            key={e.id}
            event={e}
            isOpen={isOpen(e)}
            isMatch={matchesYou(e)}
            isSignedUp={signedUp.has(e.id)}
            onToggleSignup={() => toggleSignup(e.id)}
            onClick={() => router.push(`/events/${e.id}`)}
          />
        ))}
      </div>

      {/* Footer note — keeps the page from feeling abandoned even with few cards */}
      <div style={{
        marginTop: 32,
        padding: 24,
        borderRadius: 12,
        background: C.oat,
        borderTop: `1px solid ${C.border}`,
        borderRight: `1px solid ${C.border}`,
        borderBottom: `1px solid ${C.border}`,
        borderLeft: `1px solid ${C.border}`,
        textAlign: 'center',
      }}>
        <div style={{
          fontFamily: 'var(--font-h1), sans-serif',
          fontSize: 18, color: C.ink, fontStyle: 'italic',
          marginBottom: 6,
        }}>
          More on the way.
        </div>
        <div style={{ fontSize: 12, color: C.muted }}>
          Sarah is in conversation with 3 new partners for Q3 — environmental and mental-health focus.
        </div>
      </div>
    </div>
  );
}

interface OpportunityCardProps {
  event: Event;
  isOpen: boolean;
  isMatch: boolean;
  isSignedUp: boolean;
  onToggleSignup: () => void;
  onClick: () => void;
}

function OpportunityCard({
  event, isOpen, isMatch, isSignedUp, onToggleSignup, onClick,
}: OpportunityCardProps) {
  const cs = causeStyle(event.cause);
  const Icon = cs.icon;
  const fillPct = event.capacity
    ? Math.round((event.registered / event.capacity) * 100)
    : 0;

  return (
    <Card
      style={{
        padding: 0,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Cause band — visual top stripe */}
      <button
        onClick={onClick}
        className="view-btn"
        style={{
          background: cs.gradient,
          padding: '20px 20px 16px',
          color: 'white',
          textAlign: 'left',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}
      >
        <div style={{
          display: 'flex', alignItems: 'center',
          gap: 8, marginBottom: 12,
        }}>
          <Icon size={18} strokeWidth={2} aria-hidden="true" />
          <span style={{
            fontSize: 11, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.08em',
            opacity: 0.95,
          }}>
            {event.cause}
          </span>
          {isMatch && (
            <span style={{
              marginLeft: 'auto',
              display: 'inline-flex', alignItems: 'center', gap: 4,
              fontSize: 10, fontWeight: 700,
              padding: '2px 8px', borderRadius: 999,
              background: 'rgba(255,255,255,0.22)',
              border: '1px solid rgba(255,255,255,0.35)',
            }}>
              <Sparkles size={10} strokeWidth={2.4} aria-hidden="true" />
              Match
            </span>
          )}
        </div>
        <div style={{
          fontFamily: 'var(--font-h1), sans-serif',
          fontSize: 22, lineHeight: 1.2, fontWeight: 400,
        }}>
          {event.title}
        </div>
        <div style={{
          fontSize: 12, marginTop: 6,
          opacity: 0.9,
        }}>
          {event.partner ?? 'Partner pending'}
        </div>
      </button>

      {/* Body */}
      <div style={{
        padding: 20,
        display: 'flex', flexDirection: 'column', gap: 14,
        flex: 1,
      }}>
        {/* When + where */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {event.date && (
            <div style={{ fontSize: 13, color: C.ink }}>
              <span style={{ fontWeight: 600 }}>{fmtDate(event.date)}</span>
              {event.time && (
                <span style={{ color: C.muted }}>
                  {' '}· {event.time}
                </span>
              )}
            </div>
          )}
          {event.location && (
            <div style={{
              fontSize: 12, color: C.muted,
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              <MapPin size={11} aria-hidden="true" />
              {event.location}
            </div>
          )}
        </div>

        {/* Capacity bar — only meaningful when there's a real cap */}
        {event.capacity > 0 && isOpen && (
          <div>
            <div className="flex items-center justify-between" style={{
              fontSize: 11, color: C.muted, fontWeight: 600, marginBottom: 6,
            }}>
              <span>{event.registered} signed up · {event.capacity} spots</span>
              <span>{fillPct}%</span>
            </div>
            <div style={{
              height: 4, borderRadius: 999, background: C.oat,
              overflow: 'hidden',
            }} aria-hidden="true">
              <div style={{
                width: `${Math.min(100, fillPct)}%`,
                height: '100%',
                background: event.pipeline === 'at-risk' ? 'var(--rose)' : C.sage,
                transition: 'width 200ms ease',
              }} />
            </div>
          </div>
        )}

        {/* Pills row */}
        <div className="flex flex-wrap items-center" style={{ gap: 6 }}>
          {event.vto && <Pill tone="terracotta">VTO eligible</Pill>}
          {event.pipeline === 'at-risk' && (
            <Pill tone="rose">Needs hands</Pill>
          )}
          {event.pipeline === 'confirmed' && !isOpen && (
            <Pill tone="amber">Opens soon</Pill>
          )}
          {event.remoteFriendly && <Pill tone="neutral">Remote-friendly</Pill>}
        </div>

        {/* CTA */}
        <div style={{ marginTop: 'auto', paddingTop: 8 }}>
          {isOpen ? (
            <button
              onClick={onToggleSignup}
              className="view-btn"
              style={{
                width: '100%',
                padding: '10px 16px',
                borderRadius: 999,
                fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
                cursor: 'pointer',
                background: isSignedUp ? C.sageGlow : C.terracotta,
                color: isSignedUp ? C.sageDeep : 'white',
                border: isSignedUp ? `1px solid var(--accent)` : 'none',
                display: 'inline-flex',
                alignItems: 'center', justifyContent: 'center',
                gap: 6,
                transition: 'background 150ms ease',
              }}
            >
              {isSignedUp ? (
                <>
                  <Check size={13} strokeWidth={2.6} aria-hidden="true" />
                  You&rsquo;re in — tap to undo
                </>
              ) : (
                'Sign up'
              )}
            </button>
          ) : (
            <div style={{
              padding: '10px 16px',
              borderRadius: 999,
              fontSize: 12,
              color: C.muted,
              background: C.oat,
              borderTop: `1px solid ${C.border}`,
              borderRight: `1px solid ${C.border}`,
              borderBottom: `1px solid ${C.border}`,
              borderLeft: `1px solid ${C.border}`,
              textAlign: 'center',
            }}>
              Opens for sign-up soon — we&rsquo;ll notify you
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

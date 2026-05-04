'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Check, MapPin, Calendar, ArrowRight } from 'lucide-react';
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

  const featured = filter === 'all'
    ? sorted.find(e => isOpen(e) && matchesYou(e)) ?? null
    : null;
  const rest = featured ? sorted.filter(e => e.id !== featured.id) : sorted;

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
          border: `1px solid ${C.border}`,
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
                boxShadow: active ? '0 1px 3px rgba(10,26,46,0.06)' : 'none',
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

      {/* Featured "best for you" — only on 'all' filter, only when there's a top match */}
      {featured && (
        <FeaturedRow
          event={featured}
          isSignedUp={signedUp.has(featured.id)}
          onToggleSignup={() => toggleSignup(featured.id)}
          onClick={() => router.push(`/events/${featured.id}`)}
        />
      )}

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

      {/* Hero rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {rest.map(e => (
          <OpportunityRow
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

      {/* Footer note */}
      <div style={{
        marginTop: 32,
        padding: 24,
        borderRadius: 'var(--radius-lg)',
        background: C.oat,
        border: `1px solid ${C.border}`,
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

// ============================================================
// FEATURED ROW — top card on 'all', wider cause-color hero strip
// ============================================================

interface FeaturedRowProps {
  event: Event;
  isSignedUp: boolean;
  onToggleSignup: () => void;
  onClick: () => void;
}

function FeaturedRow({ event, isSignedUp, onToggleSignup, onClick }: FeaturedRowProps) {
  const cs = causeStyle(event.cause);
  const Icon = cs.icon;
  const fillPct = event.capacity
    ? Math.round((event.registered / event.capacity) * 100)
    : 0;

  return (
    <div
      style={{
        marginBottom: 24,
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        border: `1px solid ${C.border}`,
        background: C.paper,
        boxShadow: '0 1px 2px rgba(10,26,46,0.03)',
        display: 'grid',
        gridTemplateColumns: 'minmax(220px, 280px) 1fr',
      }}
    >
      <button
        onClick={onClick}
        className="view-btn"
        style={{
          background: cs.gradient,
          color: 'white',
          padding: 28,
          textAlign: 'left',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'inherit',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          minHeight: 200,
        }}
      >
        <div style={{
          display: 'inline-flex', alignItems: 'center',
          gap: 6, fontSize: 11, fontWeight: 700,
          letterSpacing: '0.08em', textTransform: 'uppercase',
          opacity: 0.95,
        }}>
          <Sparkles size={11} strokeWidth={2.4} aria-hidden="true" />
          Best match for you
        </div>
        <Icon size={48} strokeWidth={1.6} aria-hidden="true" style={{ opacity: 0.95 }} />
        <div style={{
          marginTop: 'auto',
          fontSize: 12, fontWeight: 600,
          letterSpacing: '0.04em', textTransform: 'uppercase',
          opacity: 0.95,
        }}>
          {event.cause}
        </div>
      </button>

      <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <h3 style={{
            fontFamily: 'var(--font-h1), sans-serif',
            fontSize: 24, fontWeight: 600,
            color: C.ink, margin: 0,
            letterSpacing: '-0.015em',
          }}>
            {event.title}
          </h3>
          <div style={{ fontSize: 13, color: C.muted, marginTop: 6 }}>
            {event.partner ?? 'Partner pending'}
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, fontSize: 13, color: C.inkLight }}>
          {event.date && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Calendar size={13} aria-hidden="true" />
              <span style={{ fontWeight: 600 }}>{fmtDate(event.date)}</span>
              {event.time && <span style={{ color: C.muted }}>· {event.time}</span>}
            </div>
          )}
          {event.location && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <MapPin size={13} aria-hidden="true" />
              {event.location}
            </div>
          )}
        </div>

        {event.capacity > 0 && (
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
              }} />
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center" style={{ gap: 6 }}>
          {event.vto && <Pill tone="terracotta">VTO eligible</Pill>}
          {event.pipeline === 'at-risk' && <Pill tone="rose">Needs hands</Pill>}
          {event.remoteFriendly && <Pill tone="neutral">Remote-friendly</Pill>}
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', gap: 12, alignItems: 'center' }}>
          <button
            onClick={onToggleSignup}
            className="view-btn"
            style={{
              padding: '11px 22px',
              borderRadius: 999,
              fontSize: 14, fontWeight: 600, fontFamily: 'inherit',
              cursor: 'pointer',
              background: isSignedUp ? C.sageGlow : C.sage,
              color: isSignedUp ? C.sageDeep : C.paper,
              border: isSignedUp ? `1px solid ${C.sage}` : 'none',
              display: 'inline-flex', alignItems: 'center', gap: 6,
              boxShadow: isSignedUp ? 'none' : '0 1px 2px rgba(10,26,46,0.10)',
              transition: 'background 150ms ease',
            }}
          >
            {isSignedUp ? (
              <><Check size={14} strokeWidth={2.6} /> You&rsquo;re in — tap to undo</>
            ) : (
              <>Sign up <ArrowRight size={13} strokeWidth={2.4} /></>
            )}
          </button>
          <button
            onClick={onClick}
            className="view-btn"
            style={{
              fontSize: 13, fontWeight: 500, color: C.muted,
              background: 'transparent', border: 'none',
              cursor: 'pointer', fontFamily: 'inherit',
              padding: '8px 4px',
            }}
          >
            More details →
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// OPPORTUNITY ROW — horizontal card: avatar | content | actions
// ============================================================

interface OpportunityRowProps {
  event: Event;
  isOpen: boolean;
  isMatch: boolean;
  isSignedUp: boolean;
  onToggleSignup: () => void;
  onClick: () => void;
}

function OpportunityRow({
  event, isOpen, isMatch, isSignedUp, onToggleSignup, onClick,
}: OpportunityRowProps) {
  const cs = causeStyle(event.cause);
  const Icon = cs.icon;
  const fillPct = event.capacity
    ? Math.round((event.registered / event.capacity) * 100)
    : 0;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '88px 1fr auto',
        gap: 20,
        padding: 16,
        alignItems: 'center',
        background: C.paper,
        border: `1px solid ${C.border}`,
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 1px 2px rgba(10,26,46,0.03)',
        transition: 'box-shadow 150ms ease, border-color 150ms ease',
      }}
    >
      {/* Cause avatar */}
      <button
        onClick={onClick}
        className="view-btn"
        aria-label={`${event.cause}: ${event.title}`}
        style={{
          width: 88, height: 88,
          borderRadius: 'var(--radius)',
          background: cs.gradient,
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          fontFamily: 'inherit',
          flexShrink: 0,
          boxShadow: '0 4px 12px rgba(10,26,46,0.12)',
        }}
      >
        <Icon size={26} strokeWidth={1.8} aria-hidden="true" />
        {event.date && (
          <div style={{
            fontSize: 9.5, fontWeight: 700,
            letterSpacing: '0.06em', textTransform: 'uppercase',
            opacity: 0.95,
          }}>
            {fmtDate(event.date, false).toUpperCase()}
          </div>
        )}
      </button>

      {/* Content */}
      <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
        }}>
          <span style={{
            fontSize: 10.5, fontWeight: 700,
            color: C.muted,
            letterSpacing: '0.06em', textTransform: 'uppercase',
          }}>
            {event.cause}
          </span>
          {isMatch && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              fontSize: 10, fontWeight: 700,
              padding: '1px 8px', borderRadius: 999,
              color: C.sageDeep, background: C.sageGlow,
              border: `1px solid ${C.sage}`,
              letterSpacing: '0.04em', textTransform: 'uppercase',
            }}>
              <Sparkles size={9} strokeWidth={2.6} aria-hidden="true" />
              Match
            </span>
          )}
          {event.pipeline === 'at-risk' && <Pill tone="rose">Needs hands</Pill>}
          {event.pipeline === 'confirmed' && !isOpen && <Pill tone="amber">Opens soon</Pill>}
        </div>
        <button
          onClick={onClick}
          className="view-btn"
          style={{
            fontFamily: 'inherit',
            fontSize: 17, fontWeight: 600, color: C.ink,
            background: 'transparent', border: 'none',
            padding: 0, margin: 0,
            cursor: 'pointer',
            textAlign: 'left',
            letterSpacing: '-0.01em',
          }}
        >
          {event.title}
        </button>
        <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.4 }}>
          {event.partner ?? 'Partner pending'}
          {event.location && (
            <> · <MapPin size={11} aria-hidden="true" style={{ display: 'inline', verticalAlign: -2 }} /> {event.location}</>
          )}
          {event.time && <> · {event.time}</>}
        </div>
        {/* Capacity bar — only for open events with real cap */}
        {event.capacity > 0 && isOpen && (
          <div style={{ marginTop: 4, maxWidth: 320 }}>
            <div className="flex items-center justify-between" style={{
              fontSize: 10.5, color: C.muted, fontWeight: 600, marginBottom: 4,
            }}>
              <span>{event.registered} of {event.capacity} signed up</span>
              <span>{fillPct}%</span>
            </div>
            <div style={{
              height: 3, borderRadius: 999, background: C.oat,
              overflow: 'hidden',
            }} aria-hidden="true">
              <div style={{
                width: `${Math.min(100, fillPct)}%`,
                height: '100%',
                background: event.pipeline === 'at-risk' ? 'var(--rose)' : C.sage,
              }} />
            </div>
          </div>
        )}
      </div>

      {/* Right: pills + CTA stacked */}
      <div style={{
        display: 'flex', flexDirection: 'column',
        gap: 8, alignItems: 'flex-end',
        flexShrink: 0,
      }}>
        <div className="flex flex-wrap" style={{ gap: 4, justifyContent: 'flex-end' }}>
          {event.vto && <Pill tone="terracotta">VTO</Pill>}
          {event.remoteFriendly && <Pill tone="neutral">Remote</Pill>}
        </div>
        {isOpen ? (
          <button
            onClick={onToggleSignup}
            className="view-btn"
            style={{
              padding: '8px 18px',
              borderRadius: 999,
              fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
              cursor: 'pointer',
              background: isSignedUp ? C.sageGlow : C.sage,
              color: isSignedUp ? C.sageDeep : C.paper,
              border: isSignedUp ? `1px solid ${C.sage}` : 'none',
              display: 'inline-flex', alignItems: 'center', gap: 6,
              whiteSpace: 'nowrap',
              boxShadow: isSignedUp ? 'none' : '0 1px 2px rgba(10,26,46,0.10)',
              transition: 'background 150ms ease',
            }}
          >
            {isSignedUp ? (
              <><Check size={13} strokeWidth={2.6} /> Signed up</>
            ) : (
              <>Sign up <ArrowRight size={12} strokeWidth={2.4} /></>
            )}
          </button>
        ) : (
          <span style={{
            padding: '8px 14px',
            borderRadius: 999,
            fontSize: 12, color: C.muted,
            background: C.oat,
            border: `1px solid ${C.border}`,
            whiteSpace: 'nowrap',
          }}>
            Opens soon
          </span>
        )}
      </div>
    </div>
  );
}

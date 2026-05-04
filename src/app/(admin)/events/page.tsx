'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Send, Sparkles } from 'lucide-react';
import { C } from '@/lib/tokens';
import { fmtDate } from '@/lib/format';
import { EVENTS } from '@/lib/seed/events';
import { pipelineConfig } from '@/lib/seed/pipeline';
import type { Pipeline } from '@/lib/types';
import { PageHeader } from '@/components/primitives/PageHeader';
import { Card } from '@/components/primitives/Card';
import { Pill } from '@/components/primitives/Pill';
import { Button } from '@/components/primitives/Button';

type FilterId = 'all' | 'in-flight' | 'live' | 'wrapped';

interface FilterGroup {
  id: FilterId;
  label: string;
  match: (pipeline: Pipeline) => boolean;
}

const FILTER_GROUPS: FilterGroup[] = [
  { id: 'all',       label: 'All',       match: () => true },
  { id: 'in-flight', label: 'In flight', match: (p) => p === 'sourcing' || p === 'vetting' || p === 'proposed' },
  { id: 'live',      label: 'Live',      match: (p) => p === 'confirmed' || p === 'recruiting' || p === 'at-risk' },
  { id: 'wrapped',   label: 'Wrapped',   match: (p) => p === 'completed' || p === 'reported' },
];

// Sort priority — most urgent stages bubble up first
const STAGE_ORDER: Pipeline[] = [
  'at-risk', 'recruiting', 'confirmed', 'proposed',
  'vetting', 'sourcing', 'completed', 'reported',
];

export default function EventsListPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterId>('all');

  const activeFilter = FILTER_GROUPS.find(f => f.id === filter) ?? FILTER_GROUPS[0];
  const filtered = EVENTS.filter(e => activeFilter.match(e.pipeline));
  const sorted = [...filtered].sort(
    (a, b) => STAGE_ORDER.indexOf(a.pipeline) - STAGE_ORDER.indexOf(b.pipeline),
  );

  return (
    <div>
      <PageHeader
        title="Events"
        subtitle="The whole pipeline — sourcing through reported. Sorted by what needs you most."
        action={
          <Button variant="accent" icon={Plus} onClick={() => router.push('/events/new')}>
            Plan an event
          </Button>
        }
      />

      {/* Filter pills */}
      <div
        role="tablist"
        aria-label="Filter events by stage"
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
        {FILTER_GROUPS.map(f => {
          const active = filter === f.id;
          const count = EVENTS.filter(e => f.match(e.pipeline)).length;
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
              <span style={{
                fontSize: 11,
                color: C.muted,
                fontWeight: 600,
              }}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Event grid — every card shows pipeline state explicitly */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sorted.map(e => {
          const stage = pipelineConfig(e.pipeline);
          const isAtRisk = e.pipeline === 'at-risk';
          const isWrapped = e.pipeline === 'completed' || e.pipeline === 'reported';

          return (
            <Card
              key={e.id}
              onClick={() => router.push(`/events/${e.id}`)}
              style={{
                padding: 24,
                borderLeft: isAtRisk ? `3px solid var(--rose)` : undefined,
              }}
            >
              {/* Top row: pipeline stage + secondary signal */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 14,
                gap: 8,
                flexWrap: 'wrap',
              }}>
                <Pill tone={stage.tone}>{stage.label}</Pill>
                {e.date ? (
                  <span style={{
                    fontSize: 11, fontWeight: 600,
                    textTransform: 'uppercase', letterSpacing: '0.06em',
                    color: C.muted,
                  }}>
                    {fmtDate(e.date)}
                  </span>
                ) : (
                  <span style={{ fontSize: 11, fontStyle: 'italic', color: C.muted }}>
                    Date pending
                  </span>
                )}
              </div>

              {/* Title */}
              <h2 style={{
                fontFamily: 'var(--font-h1), sans-serif',
                fontSize: 22, fontWeight: 400,
                color: C.ink, lineHeight: 1.2,
                marginBottom: 4, marginTop: 0,
              }}>
                {e.title}
              </h2>
              <div style={{ fontSize: 12, color: C.inkLight, marginBottom: 16 }}>
                {e.partner ?? (
                  <span style={{ fontStyle: 'italic', color: C.muted }}>
                    Partner not yet selected
                  </span>
                )}
              </div>

              {/* Stage-specific status line */}
              {e.pipeline === 'recruiting' && (
                <div style={{
                  display: 'flex', alignItems: 'center',
                  gap: 8, flexWrap: 'wrap',
                }}>
                  <Pill tone="sage">{e.registered}/{e.capacity} signed up</Pill>
                  {e.managerNudgeSent && (
                    <Pill tone="neutral" icon={Send}>Manager nudge sent</Pill>
                  )}
                  {e.vto && <Pill tone="terracotta">VTO</Pill>}
                </div>
              )}

              {e.pipeline === 'at-risk' && (
                <div>
                  <div style={{
                    display: 'flex', alignItems: 'center',
                    gap: 8, marginBottom: 8, flexWrap: 'wrap',
                  }}>
                    <Pill tone="rose">{e.registered}/{e.capacity} signed up</Pill>
                    {e.vto && <Pill tone="terracotta">VTO</Pill>}
                  </div>
                  {e.diagnosis && e.diagnosis.length > 0 && (
                    <div style={{ paddingLeft: 12, borderLeft: `2px solid var(--rose)` }}>
                      <div style={{
                        fontSize: 11, fontWeight: 600,
                        color: C.inkLight, marginBottom: 4,
                      }}>
                        {e.diagnosis.length} candidate causes:
                      </div>
                      <div style={{ fontSize: 12, color: C.inkLight, lineHeight: 1.5 }}>
                        {e.diagnosis.map(d => d.cause).join(' · ')}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {e.pipeline === 'confirmed' && e.confirmedNote && (
                <div style={{
                  fontSize: 12, color: C.inkLight, lineHeight: 1.5,
                  paddingLeft: 12, borderLeft: `2px solid ${C.sage}`,
                }}>
                  {e.confirmedNote}
                </div>
              )}

              {e.pipeline === 'proposed' && e.awaitingApproval && (
                <div style={{
                  fontSize: 12, color: C.inkLight, lineHeight: 1.5,
                  paddingLeft: 12, borderLeft: `2px solid var(--amber)`,
                }}>
                  Awaiting <strong style={{ color: C.ink }}>{e.awaitingApproval}</strong>
                </div>
              )}

              {e.pipeline === 'vetting' && e.awaitingPartner && (
                <div style={{
                  fontSize: 12, color: C.inkLight, lineHeight: 1.5,
                  paddingLeft: 12, borderLeft: `2px solid var(--amber)`,
                }}>
                  Awaiting partner: {e.awaitingPartner}
                </div>
              )}

              {e.pipeline === 'sourcing' && e.sourceNote && (
                <div style={{
                  fontSize: 12, color: C.inkLight,
                  lineHeight: 1.5, fontStyle: 'italic',
                }}>
                  {e.sourceNote}
                </div>
              )}

              {isWrapped && (
                <div style={{
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: 12, gap: 8, flexWrap: 'wrap',
                }}>
                  <span style={{ color: C.muted }}>
                    {e.attended}/{e.registered} attended · {e.hours}h
                  </span>
                  {e.pipeline === 'completed' && (
                    <Pill tone="sage" icon={Sparkles}>Recap ready</Pill>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {sorted.length === 0 && (
        <Card soft style={{ padding: 48, textAlign: 'center', marginTop: 16 }}>
          <p style={{ fontSize: 13, color: C.inkLight, margin: 0 }}>
            No events in this stage right now.
          </p>
        </Card>
      )}
    </div>
  );
}

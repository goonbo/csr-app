'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight, Award } from 'lucide-react';
import { C } from '@/lib/tokens';
import { fmtDate } from '@/lib/format';
import { PageHeader } from '@/components/primitives/PageHeader';
import { Card } from '@/components/primitives/Card';
import { ViewSourcePill } from '@/components/primitives/ViewSourcePill';
import { NP_VOLUNTEERS } from '@/lib/seed/np-volunteers';
import type { Volunteer, DataSource } from '@/lib/types';

type SourceFilter = 'all' | DataSource;
type StatusFilter = 'all' | 'active' | 'inactive';

const SOURCE_FILTERS: { id: SourceFilter; label: string }[] = [
  { id: 'all',          label: 'All sources' },
  { id: 'view-partner', label: 'Via VIEW partners' },
  { id: 'direct',       label: 'Direct signup' },
  { id: 'imported',     label: 'Imported' },
];

const STATUS_FILTERS: { id: StatusFilter; label: string }[] = [
  { id: 'all',      label: 'All' },
  { id: 'active',   label: 'Active' },
  { id: 'inactive', label: 'Inactive' },
];

export default function VolunteersPage() {
  const router = useRouter();
  const [source, setSource] = useState<SourceFilter>('all');
  const [status, setStatus] = useState<StatusFilter>('active');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return NP_VOLUNTEERS.filter(v => {
      if (source !== 'all' && v.source !== source) return false;
      if (status !== 'all' && v.status !== status) return false;
      if (q && !v.name.toLowerCase().includes(q) && !(v.employer ?? '').toLowerCase().includes(q)) return false;
      return true;
    }).sort((a, b) => b.lastActive.localeCompare(a.lastActive));
  }, [source, status, query]);

  const counts = useMemo(() => ({
    all:           NP_VOLUNTEERS.length,
    'view-partner': NP_VOLUNTEERS.filter(v => v.source === 'view-partner').length,
    direct:         NP_VOLUNTEERS.filter(v => v.source === 'direct').length,
    imported:       NP_VOLUNTEERS.filter(v => v.source === 'imported').length,
  } as Record<SourceFilter, number>), []);

  return (
    <div>
      <PageHeader
        greeting="Your pool"
        title="Volunteers."
        subtitle={`${NP_VOLUNTEERS.filter(v => v.status === 'active').length} active across ${countDistinctEmployers(NP_VOLUNTEERS)} employers — corporate-affiliated and community-direct.`}
      />

      {/* Filter bar */}
      <div style={{
        display: 'flex', flexDirection: 'column', gap: 12,
        marginBottom: 20,
      }}>
        {/* Search + status row */}
        <div className="flex flex-wrap items-center gap-3">
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            flex: 1, minWidth: 240, maxWidth: 420,
            padding: '8px 12px',
            background: C.paper, border: `1px solid ${C.border}`,
            borderRadius: 'var(--radius)',
          }}>
            <Search size={14} color={C.muted} aria-hidden="true" />
            <input
              className="view-input"
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by name or employer…"
              style={{
                flex: 1, fontSize: 13, fontFamily: 'inherit',
                background: 'transparent', border: 'none',
                color: C.ink, outline: 'none',
              }}
            />
          </div>
          <div role="group" aria-label="Status" style={{
            display: 'flex', padding: 2,
            borderRadius: 'var(--radius)',
            background: C.oat, border: `1px solid ${C.border}`,
          }}>
            {STATUS_FILTERS.map(f => {
              const active = status === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setStatus(f.id)}
                  aria-pressed={active}
                  className="view-btn"
                  style={{
                    padding: '4px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
                    color: active ? C.ink : C.muted,
                    background: active ? C.paper : 'transparent',
                    boxShadow: active ? '0 1px 2px rgba(10,26,46,0.06)' : 'none',
                    border: 'none', cursor: 'pointer',
                  }}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Source filter (the load-bearing one) */}
        <div role="tablist" aria-label="Filter by source" style={{
          display: 'flex', flexWrap: 'wrap', gap: 4,
          padding: 4, borderRadius: 999,
          background: C.oat, border: `1px solid ${C.border}`,
          width: 'fit-content',
        }}>
          {SOURCE_FILTERS.map(f => {
            const active = source === f.id;
            return (
              <button
                key={f.id}
                role="tab"
                aria-selected={active}
                onClick={() => setSource(f.id)}
                className="view-btn"
                style={{
                  padding: '6px 14px',
                  borderRadius: 999,
                  fontSize: 13, fontWeight: 500, fontFamily: 'inherit',
                  color: active ? C.ink : C.muted,
                  background: active ? C.paper : 'transparent',
                  boxShadow: active ? '0 1px 3px rgba(10,26,46,0.06)' : 'none',
                  border: 'none', cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                }}
              >
                {f.id === 'view-partner' && (
                  <span style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: 'var(--view-source)',
                  }} aria-hidden="true" />
                )}
                {f.label}
                <span style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>
                  {counts[f.id]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <Card style={{ padding: 32 }}>
          <div style={{ fontSize: 14, color: C.inkLight }}>
            No volunteers match this view. Try widening the filters.
          </div>
        </Card>
      ) : (
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {filtered.map((v, i) => (
              <VolunteerRow
                key={v.id}
                volunteer={v}
                isLast={i === filtered.length - 1}
                onClick={() => router.push(`/np/volunteers/${v.id}`)}
              />
            ))}
          </div>
        </Card>
      )}

      <div style={{
        marginTop: 12, fontSize: 11, color: C.muted,
        textAlign: 'right',
      }}>
        Showing {filtered.length} of {NP_VOLUNTEERS.length}
      </div>
    </div>
  );
}

function countDistinctEmployers(volunteers: Volunteer[]): number {
  const set = new Set<string>();
  for (const v of volunteers) if (v.employer) set.add(v.employer);
  return set.size;
}

interface VolunteerRowProps {
  volunteer: Volunteer;
  isLast: boolean;
  onClick: () => void;
}

function VolunteerRow({ volunteer, isLast, onClick }: VolunteerRowProps) {
  const v = volunteer;
  const topRecognition = v.recognitions[v.recognitions.length - 1];

  return (
    <button
      onClick={onClick}
      className="view-btn"
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 140px 100px 36px',
        gap: 16,
        padding: '14px 18px',
        background: 'transparent',
        border: 'none',
        borderBottom: isLast ? 'none' : `1px solid ${C.border}`,
        cursor: 'pointer',
        textAlign: 'left',
        alignItems: 'center',
        fontFamily: 'inherit',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
        <Avatar name={v.name} />
        <div style={{ minWidth: 0 }}>
          <div style={{
            display: 'flex', alignItems: 'center',
            gap: 8, flexWrap: 'wrap', marginBottom: 2,
          }}>
            <span style={{ fontSize: 13.5, fontWeight: 600, color: C.ink }}>
              {v.name}
            </span>
            {v.source === 'view-partner' && v.employer && (
              <ViewSourcePill partner={v.employer} size="sm" />
            )}
            {v.source === 'imported' && (
              <span style={{
                fontSize: 10, fontWeight: 600,
                padding: '1px 7px', borderRadius: 999,
                color: C.muted, background: C.oat,
                border: `1px solid ${C.border}`,
                letterSpacing: '0.02em',
              }}>
                Imported
              </span>
            )}
            {topRecognition && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                fontSize: 10, fontWeight: 600,
                padding: '1px 7px', borderRadius: 999,
                color: 'var(--accent-deep)', background: C.sageGlow,
                border: `1px solid ${C.sage}`,
                letterSpacing: '0.02em',
              }}>
                <Award size={9} strokeWidth={2.4} aria-hidden="true" />
                {recognitionLabel(topRecognition)}
              </span>
            )}
            {v.status === 'inactive' && (
              <span style={{
                fontSize: 10, fontWeight: 600,
                padding: '1px 7px', borderRadius: 999,
                color: C.muted, background: 'transparent',
                border: `1px solid ${C.borderStrong}`,
                letterSpacing: '0.02em',
              }}>
                Inactive
              </span>
            )}
          </div>
          <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.4 }}>
            {v.employer ?? 'Community volunteer'} · {v.eventsAttended} events
          </div>
        </div>
      </div>
      <div style={{
        fontFamily: 'var(--font-mono), monospace',
        fontSize: 13, color: C.ink,
        textAlign: 'right',
        fontVariantNumeric: 'tabular-nums',
      }}>
        {v.totalHours.toLocaleString()} hrs
      </div>
      <div style={{ fontSize: 11, color: C.muted, textAlign: 'right' }}>
        {fmtDate(v.lastActive, false)}
      </div>
      <ArrowRight size={14} color={C.muted} aria-hidden="true" />
    </button>
  );
}

function Avatar({ name }: { name: string }) {
  const initials = name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  return (
    <div
      style={{
        width: 36, height: 36, borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: `linear-gradient(135deg, var(--accent), var(--accent-deep))`,
        color: C.paper, fontSize: 12, fontWeight: 700,
        flexShrink: 0,
      }}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}

function recognitionLabel(id: string): string {
  switch (id) {
    case '10-events': return '10 events';
    case '25-events': return '25 events';
    case '50-events': return '50 events';
    case 'first-skills-based': return 'First skills-based';
    case 'spanish-speaker': return 'Spanish-speaker';
    case 'recurring-donor': return 'Recurring donor';
    default: return id;
  }
}

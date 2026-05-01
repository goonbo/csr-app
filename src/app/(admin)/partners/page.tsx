'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Plus, Filter } from 'lucide-react';
import { C } from '@/lib/tokens';
import { causeStyle } from '@/lib/cause';
import { PARTNERS } from '@/lib/seed/partners';
import { PageHeader } from '@/components/primitives/PageHeader';
import { Card } from '@/components/primitives/Card';
import { Pill } from '@/components/primitives/Pill';
import { Button } from '@/components/primitives/Button';
import { ReadinessTag } from '@/components/primitives/ReadinessTag';

export default function PartnersListPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const filtered = PARTNERS.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title="Partners"
        subtitle="The people we work with. Their readiness, history, and what makes each relationship work."
        action={<Button variant="accent" icon={Plus}>Add a partner</Button>}
      />

      {/* Search + filter row — search shrinks gracefully on narrow viewports */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div style={{ position: 'relative', flex: '1 1 240px', maxWidth: 384 }}>
          <Search
            size={15}
            color={C.muted}
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: 14,
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
            }}
          />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search partners…"
            aria-label="Search partners"
            className="view-input"
            style={{
              width: '100%',
              padding: '10px 16px 10px 40px',
              fontSize: 14,
              fontFamily: 'inherit',
              borderRadius: 999,
              background: C.paper,
              border: `1px solid ${C.borderStrong}`,
              color: C.ink,
              outline: 'none',
            }}
          />
        </div>
        <Button variant="soft" icon={Filter} size="sm">Filter</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(p => {
          const cs = causeStyle(p.cause);
          const Icon = cs.icon;
          return (
            <Card
              key={p.id}
              onClick={() => router.push(`/partners/${p.id}`)}
              style={{ padding: 20 }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                marginBottom: 16,
              }}>
                <div
                  style={{
                    width: 44, height: 44, borderRadius: 14,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: cs.gradient,
                    flexShrink: 0,
                  }}
                  aria-hidden="true"
                >
                  <Icon size={18} color="white" strokeWidth={2.2} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 15, fontWeight: 500,
                    color: C.ink, lineHeight: 1.3,
                    marginBottom: 2,
                  }}>
                    {p.name}
                  </div>
                  <div style={{ fontSize: 12, color: C.muted }}>
                    {p.cause} · {p.geo}
                  </div>
                </div>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: 14,
                borderTop: `1px solid ${C.border}`,
              }}>
                <div>
                  {p.hasD ? (
                    <ReadinessTag tag={p.readinessTag} score={p.readiness} />
                  ) : (
                    <ReadinessTag tag="not-assessed" />
                  )}
                </div>
                {p.health === 'thriving' && <Pill tone="sage">Thriving</Pill>}
                {p.health === 'attention' && <Pill tone="amber">Needs hello</Pill>}
              </div>
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <Card soft style={{ padding: 48, textAlign: 'center', marginTop: 16 }}>
          <p style={{ fontSize: 13, color: C.inkLight, margin: 0 }}>
            No partners match &ldquo;{search}&rdquo;.
          </p>
        </Card>
      )}
    </div>
  );
}

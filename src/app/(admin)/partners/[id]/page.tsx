'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import {
  Sparkles, AlertCircle, ChevronDown, Calendar,
} from 'lucide-react';
import { C } from '@/lib/tokens';
import { fmtDate } from '@/lib/format';
import { useAILoad } from '@/lib/useAILoad';
import { PARTNERS } from '@/lib/seed/partners';
import type { Diligence } from '@/lib/types';
import { PageHeader } from '@/components/primitives/PageHeader';
import { Card } from '@/components/primitives/Card';
import { Pill } from '@/components/primitives/Pill';
import { Button } from '@/components/primitives/Button';
import { ReadinessTag } from '@/components/primitives/ReadinessTag';
import { LoadingSteps } from '@/components/primitives/LoadingSteps';

const DILIGENCE_STEPS = [
  'Pulling IRS Tax-Exempt data…',
  'Reviewing public Form 990 filings…',
  'Cross-referencing Candid signals…',
  'Assessing operational readiness…',
];

interface PartnerDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function PartnerDetailPage({ params }: PartnerDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const partner = PARTNERS.find(p => p.id === id);
  if (!partner) notFound();

  // Diligence state — pre-populated if the partner already has it, otherwise null until AI runs
  const [diligence, setDiligence] = useState<Diligence | null>(
    partner.hasD && partner.diligence ? partner.diligence : null,
  );
  const ai = useAILoad(DILIGENCE_STEPS, 3000);

  const runDiligence = () => {
    // Demo magic: every partner resolves to the food bank's diligence
    // (matches the JSX's deliberate fake-but-considered fallback).
    ai.start(() => setDiligence(PARTNERS[0].diligence ?? null));
  };

  const showRunButtonInHeader = !partner.hasD && !diligence && !ai.active;

  return (
    <div>
      <PageHeader
        back="All partners"
        onBack={() => router.push('/partners')}
        greeting={partner.cause}
        title={partner.name}
        subtitle={partner.geo}
        action={
          showRunButtonInHeader ? (
            <Button variant="ai" icon={Sparkles} onClick={runDiligence}>
              Run AI diligence
            </Button>
          ) : undefined
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-4">
          {diligence && !ai.active && (
            <MutualFitPanel
              minGroup={partner.minGroup ?? 30}
              maxGroup={partner.maxGroup ?? 60}
            />
          )}

          {ai.active && (
            <Card ai style={{ padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <div
                  style={{
                    width: 28, height: 28, borderRadius: '50%', background: C.sage,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                  aria-hidden="true"
                >
                  <Sparkles size={12} color="white" strokeWidth={2.2} />
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.sageDeep }}>
                  Reading the room…
                </span>
              </div>
              <LoadingSteps steps={DILIGENCE_STEPS} idx={ai.stepIdx} />
            </Card>
          )}

          {diligence && !ai.active && (
            <DiligenceOverview diligence={diligence} />
          )}

          {!diligence && !ai.active && (
            <Card soft style={{ padding: 48, textAlign: 'center' }}>
              <div
                style={{
                  width: 56, height: 56, borderRadius: '50%',
                  margin: '0 auto 16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: `linear-gradient(135deg, ${C.sageGlow}, #B5CDAD)`,
                }}
                aria-hidden="true"
              >
                <Sparkles size={20} color={C.sageDeep} strokeWidth={2.2} />
              </div>
              <h2 style={{
                fontSize: 16, fontWeight: 600, color: C.ink,
                marginBottom: 8, marginTop: 0,
              }}>
                Let&rsquo;s get to know them
              </h2>
              <p style={{
                fontSize: 13, lineHeight: 1.55, color: C.inkLight,
                maxWidth: 360, margin: '0 auto 20px',
              }}>
                Run AI diligence to generate a mission summary, readiness score, and format recommendation in about fifteen seconds.
              </p>
              <Button variant="ai" icon={Sparkles} onClick={runDiligence}>
                Run AI diligence
              </Button>
            </Card>
          )}

          <PracticalBits
            minGroup={partner.minGroup ?? 10}
            maxGroup={partner.maxGroup ?? 80}
            leadDays={partner.leadDays ?? 21}
          />
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="flex flex-col gap-4">
          <ContactCard
            contact={partner.contact ?? 'Maria Velasquez'}
            email={partner.email ?? 'mvelasquez@austinfoodbank.org'}
            phone={partner.phone ?? '(512) 555-0142'}
          />
          <StatusCard
            health={partner.health}
            lastEvent={partner.lastEvent}
            champion={partner.champion}
          />
          <Button
            variant="primary"
            icon={Calendar}
            full
            onClick={() => router.push('/events/new')}
          >
            Plan an event with them
          </Button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// SUB-COMPONENTS
// ============================================================

function MutualFitPanel({ minGroup, maxGroup }: { minGroup: number; maxGroup: number }) {
  const fits = [
    {
      label: 'Cohort fit',
      score: 'Strong',
      tone: 'sage' as const,
      body: 'Food security ranks #1 in your employee survey themes. 68% of respondents flagged hunger relief as a personally meaningful cause.',
    },
    {
      label: 'Capacity fit',
      score: 'Strong',
      tone: 'sage' as const,
      body: 'Their 10–80 volunteer range absorbs your typical 35–50 turnouts cleanly. They host 200+ corporate groups annually.',
    },
    {
      label: 'Schedule fit',
      score: 'Watch',
      tone: 'amber' as const,
      body: 'Their warehouse runs hot in November–December. April–October bookings are most reliable.',
    },
  ];

  return (
    <Card style={{ padding: 28, borderTop: `3px solid ${C.terracotta}` }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 6,
        gap: 12,
        flexWrap: 'wrap',
      }}>
        <h2 style={{ fontSize: 14, fontWeight: 600, color: C.ink, margin: 0 }}>
          Fit for your team
        </h2>
        <span style={{ fontSize: 11, color: C.muted, fontStyle: 'italic' }}>
          Based on Q1 employee survey + capacity history
        </span>
      </div>
      <p style={{ fontSize: 13, color: C.inkLight, lineHeight: 1.55, margin: '0 0 20px' }}>
        Why this partner makes sense for a {minGroup}–{maxGroup} person event in the next quarter.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {fits.map(f => (
          <div
            key={f.label}
            style={{
              padding: 16,
              borderRadius: 12,
              background: f.tone === 'sage' ? C.sageGlow : '#F5E8C8',
              border: `1px solid ${f.tone === 'sage' ? '#A8C09E' : '#D4B96A'}`,
            }}
          >
            <div style={{
              fontSize: 10, fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.06em',
              color: f.tone === 'sage' ? C.sageDeep : '#6B4E1A',
              marginBottom: 6,
            }}>
              {f.label}
            </div>
            <div style={{
              fontFamily: 'var(--font-serif), serif',
              fontSize: 22, lineHeight: 1,
              color: f.tone === 'sage' ? C.sageDeep : '#6B4E1A',
              marginBottom: 8,
            }}>
              {f.score}
            </div>
            <p style={{
              fontSize: 12, lineHeight: 1.5,
              color: f.tone === 'sage' ? C.sageDeep : '#6B4E1A',
              margin: 0,
            }}>
              {f.body}
            </p>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: 18, paddingTop: 18,
        borderTop: `1px solid ${C.border}`,
        display: 'flex', alignItems: 'center', gap: 10,
        flexWrap: 'wrap',
      }}>
        <Sparkles size={12} color={C.sage} aria-hidden="true" />
        <span style={{ fontSize: 12, color: C.inkLight, lineHeight: 1.5 }}>
          Suggested next step:{' '}
          <strong style={{ color: C.ink, fontWeight: 600 }}>plan a 50-person Q2 event</strong>.
          The food bank&rsquo;s spring window is open and your team&rsquo;s interest is highest right now.
        </span>
      </div>
    </Card>
  );
}

function DiligenceOverview({ diligence }: { diligence: Diligence }) {
  return (
    <Card style={{ padding: 28 }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        gap: 12,
        flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 24, height: 24, borderRadius: '50%', background: C.sage,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            aria-hidden="true"
          >
            <Sparkles size={11} color="white" strokeWidth={2.2} />
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>
            Partner overview
          </span>
        </div>
        <span style={{ fontSize: 11, color: C.muted }}>Generated just now</span>
      </div>

      <div
        role="note"
        style={{
          display: 'flex',
          gap: 10,
          padding: 14,
          borderRadius: 12,
          background: C.sageGlow,
          border: `1px solid #A8C09E`,
          marginBottom: 24,
        }}
      >
        <AlertCircle
          size={14}
          color={C.sageDeep}
          strokeWidth={2.2}
          aria-hidden="true"
          style={{ flexShrink: 0, marginTop: 2 }}
        />
        <p style={{ fontSize: 12, lineHeight: 1.55, color: C.sageDeep, margin: 0 }}>
          AI-generated overview synthesized from public filings. Always verify with IRS TEOS, Candid, and Charity Navigator before partnership decisions.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <Section heading="Mission">
          <p style={{ fontSize: 14, lineHeight: 1.6, color: C.inkLight, margin: 0 }}>
            {diligence.mission}
          </p>
        </Section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ padding: '4px 0' }}>
          <div>
            <SectionHeading>Readiness</SectionHeading>
            <ReadinessTag tag={diligence.readinessTag} size="lg" />
            <p style={{
              fontSize: 11, color: C.muted, lineHeight: 1.5,
              margin: '8px 0 0', fontStyle: 'italic',
            }}>
              Qualitative — public diligence cannot fully verify operational fit. Confirm with a partner call.
            </p>
          </div>
          <div>
            <SectionHeading>Recommended format</SectionHeading>
            <Pill tone="sage" icon={Sparkles}>
              {diligence.recommendedFormat?.choice ?? 'Direct service event'}
            </Pill>
            <p style={{ fontSize: 12, color: C.inkLight, lineHeight: 1.55, margin: '10px 0 0' }}>
              {diligence.recommendedFormat?.reason}
            </p>
          </div>
        </div>

        <Section heading="Financial health">
          <p style={{ fontSize: 14, lineHeight: 1.6, color: C.inkLight, margin: 0 }}>
            {diligence.financial}
          </p>
        </Section>

        <details open>
          <summary
            style={{
              fontSize: 11, fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.06em',
              color: C.muted, listStyle: 'none', cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}
          >
            <ChevronDown size={12} aria-hidden="true" />
            Why this readiness
          </summary>
          <p style={{
            fontSize: 14, lineHeight: 1.6, color: C.inkLight,
            margin: '12px 0 0', paddingLeft: 16,
            borderLeft: `2px solid ${C.sage}`,
          }}>
            {diligence.readinessReason}
          </p>
        </details>

        {diligence.alternativesConsidered && diligence.alternativesConsidered.length > 0 && (
          <div>
            <SectionHeading style={{ marginBottom: 12 }}>Other formats considered</SectionHeading>
            <p style={{
              fontSize: 12, color: C.muted, lineHeight: 1.55,
              margin: '0 0 14px', fontStyle: 'italic',
            }}>
              Not every partnership is a volunteer event. Here&rsquo;s what else we weighed.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {diligence.alternativesConsidered.map((alt, i) => {
                const fitTone =
                  alt.fit === 'Possible'
                    ? { bg: C.sageGlow, color: C.sageDeep, border: '#A8C09E' }
                    : alt.fit === 'Worth considering'
                    ? { bg: '#F5E8C8', color: '#6B4E1A', border: '#D4B96A' }
                    : { bg: C.oat, color: C.inkLight, border: C.borderStrong };
                return (
                  <div
                    key={i}
                    style={{
                      padding: 14,
                      borderRadius: 12,
                      background: C.paper,
                      border: `1px solid ${C.border}`,
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 8,
                      gap: 12,
                      flexWrap: 'wrap',
                    }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>
                        {alt.format}
                      </div>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '3px 10px',
                        fontSize: 11, fontWeight: 600,
                        borderRadius: 999,
                        background: fitTone.bg,
                        color: fitTone.color,
                        border: `1px solid ${fitTone.border}`,
                      }}>
                        {alt.fit}
                      </span>
                    </div>
                    <p style={{
                      fontSize: 12, color: C.inkLight,
                      lineHeight: 1.55, margin: 0,
                    }}>
                      {alt.reason}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

function Section({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <div>
      <SectionHeading>{heading}</SectionHeading>
      {children}
    </div>
  );
}

function SectionHeading({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 700,
      textTransform: 'uppercase', letterSpacing: '0.06em',
      color: C.muted, marginBottom: 8,
      ...style,
    }}>
      {children}
    </div>
  );
}

function PracticalBits({
  minGroup,
  maxGroup,
  leadDays,
}: {
  minGroup: number;
  maxGroup: number;
  leadDays: number;
}) {
  return (
    <Card style={{ padding: 28 }}>
      <h2 style={{
        fontSize: 14, fontWeight: 600, color: C.ink,
        marginBottom: 20, marginTop: 0,
      }}>
        The practical bits
      </h2>
      <dl
        className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5"
        style={{ fontSize: 13, margin: 0 }}
      >
        <div>
          <DLabel>Group size</DLabel>
          <dd style={{ color: C.ink, margin: 0 }}>{minGroup}–{maxGroup} volunteers</dd>
        </div>
        <div>
          <DLabel>Lead time</DLabel>
          <dd style={{ color: C.ink, margin: 0 }}>{leadDays} days</dd>
        </div>
        <div>
          <DLabel>Background checks</DLabel>
          <dd style={{ color: C.ink, margin: 0 }}>Not required</dd>
        </div>
        <div>
          <DLabel>What to wear</DLabel>
          <dd style={{ color: C.ink, margin: 0 }}>Closed-toe shoes</dd>
        </div>
        <div className="sm:col-span-2">
          <DLabel>Accessibility</DLabel>
          <dd style={{ color: C.ink, margin: 0 }}>
            Warehouse floor accessible. Seated stations available on request.
          </dd>
        </div>
      </dl>
    </Card>
  );
}

function DLabel({ children }: { children: React.ReactNode }) {
  return (
    <dt style={{
      fontSize: 11, fontWeight: 700,
      textTransform: 'uppercase', letterSpacing: '0.06em',
      color: C.muted, marginBottom: 4,
    }}>
      {children}
    </dt>
  );
}

function ContactCard({
  contact,
  email,
  phone,
}: {
  contact: string;
  email: string;
  phone: string;
}) {
  const initials = contact.split(' ').map(s => s[0]).join('').slice(0, 2);
  return (
    <Card style={{ padding: 20 }}>
      <h2 style={{
        fontSize: 11, fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: '0.06em',
        color: C.muted, marginBottom: 12, marginTop: 0,
      }}>
        Primary contact
      </h2>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
        <div
          style={{
            width: 40, height: 40, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: `linear-gradient(135deg, ${C.terracotta}, #B96B52)`,
            color: 'white', fontSize: 12, fontWeight: 600,
          }}
          aria-label={`${contact} avatar`}
        >
          {initials}
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>{contact}</div>
          <div style={{ fontSize: 11, color: C.muted }}>Volunteer Coordinator</div>
        </div>
      </div>
      <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
        <div style={{ fontSize: 12, color: C.inkLight, marginBottom: 4 }}>{email}</div>
        <div style={{ fontSize: 12, color: C.inkLight }}>{phone}</div>
      </div>
    </Card>
  );
}

function StatusCard({
  health,
  lastEvent,
  champion,
}: {
  health: 'thriving' | 'attention';
  lastEvent: string;
  champion: string | null;
}) {
  return (
    <Card style={{ padding: 20 }}>
      <h2 style={{
        fontSize: 11, fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: '0.06em',
        color: C.muted, marginBottom: 12, marginTop: 0,
      }}>
        Status
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{ color: C.muted }}>Health</span>
          {health === 'thriving' ? (
            <Pill tone="sage">Thriving</Pill>
          ) : (
            <Pill tone="amber">Needs hello</Pill>
          )}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: C.muted }}>Last event</span>
          <span style={{ color: C.ink }}>{fmtDate(lastEvent, false)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: C.muted }}>Champion</span>
          <span style={{ color: C.ink }}>{champion || '—'}</span>
        </div>
      </div>
    </Card>
  );
}

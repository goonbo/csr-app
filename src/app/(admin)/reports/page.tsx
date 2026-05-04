'use client';

import { useRouter } from 'next/navigation';
import { Sparkles, Send, ChevronRight, Download } from 'lucide-react';
import { C } from '@/lib/tokens';
import { PROGRAM_REVIEW } from '@/lib/seed/program-review';
import { PageHeader } from '@/components/primitives/PageHeader';
import { Card } from '@/components/primitives/Card';
import { Pill } from '@/components/primitives/Pill';
import { Button } from '@/components/primitives/Button';

export default function ReportsPage() {
  const router = useRouter();
  const r = PROGRAM_REVIEW;

  return (
    <div data-theme="blueprint">
      <PageHeader
        greeting="Program review"
        title={r.quarter}
        subtitle="Prepared by Sarah Chen — narrative draft, ready for review."
        action={
          <Button
            variant="accent"
            icon={Send}
            onClick={() => router.push('/')}
          >
            Send to leadership
          </Button>
        }
      />

      <div style={{
        maxWidth: 920,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}>
        {/* AI status banner */}
        <Card ai style={{ padding: 16 }}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
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
              <span style={{ fontSize: 13, color: C.sageDeep, lineHeight: 1.5 }}>
                <span style={{ fontWeight: 600 }}>Draft compiled from program data.</span>{' '}
                Numbers are calculated. The narrative is editable.
              </span>
            </div>
            <Pill tone="sage" icon={Sparkles}>AI-drafted narrative</Pill>
          </div>
        </Card>

        {/* Headline — the quarter's punchline */}
        <Card style={{ padding: 40 }}>
          <div style={{
            fontSize: 11, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.06em',
            color: C.muted, marginBottom: 16,
          }}>
            The shape of the quarter
          </div>
          <p style={{
            fontFamily: 'var(--font-h1), sans-serif',
            fontSize: 30, lineHeight: 1.25,
            color: C.ink, margin: 0,
            letterSpacing: '-0.01em',
          }}>
            {r.headline}
          </p>
        </Card>

        {/* By the numbers */}
        <Card style={{ padding: 28 }}>
          <h2 style={{
            fontSize: 11, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.06em',
            color: C.muted, margin: '0 0 20px',
          }}>
            By the numbers
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {r.numbers.map((n, i) => (
              <KpiBlock key={i} value={n.n} label={n.l} sub={n.sub} />
            ))}
          </div>
        </Card>

        {/* Lead paragraph */}
        <Card style={{ padding: 32 }}>
          <h2 style={{
            fontSize: 11, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.06em',
            color: C.muted, margin: '0 0 16px',
          }}>
            The summary, plain
          </h2>
          <p style={{
            fontFamily: 'var(--font-h1), sans-serif',
            fontSize: 18, lineHeight: 1.6,
            color: C.ink, margin: 0,
          }}>
            {r.lead}
          </p>
        </Card>

        {/* Narrative sections */}
        {r.sections.map((s, i) => (
          <Card key={i} style={{ padding: 32 }}>
            <h2 style={{
              fontSize: 16, fontWeight: 600, color: C.ink,
              margin: '0 0 12px',
            }}>
              {s.heading}
            </h2>
            <p style={{
              fontSize: 14, lineHeight: 1.7,
              color: C.inkLight, margin: 0,
            }}>
              {s.body}
            </p>
          </Card>
        ))}

        {/* Trends */}
        <Card style={{ padding: 32 }}>
          <h2 style={{
            fontSize: 11, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.06em',
            color: C.muted, margin: '0 0 4px',
          }}>
            Trends worth watching
          </h2>
          <p style={{
            fontSize: 12, color: C.muted, margin: '0 0 18px',
            fontStyle: 'italic',
          }}>
            Where the demand signal is moving — what to scope next quarter.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {r.trends.map((t, i) => (
              <TrendRow key={i} label={t.label} detail={t.detail} />
            ))}
          </div>
        </Card>

        {/* Recommendations */}
        <Card style={{ padding: 32 }}>
          <h2 style={{
            fontSize: 11, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.06em',
            color: C.muted, margin: '0 0 4px',
          }}>
            What we recommend
          </h2>
          <p style={{
            fontSize: 12, color: C.muted, margin: '0 0 18px',
            fontStyle: 'italic',
          }}>
            Concrete moves. Each one stands alone — pick the ones that fit.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {r.recommendations.map((rec, i) => (
              <RecommendationItem
                key={i}
                index={i + 1}
                title={rec.title}
                body={rec.body}
              />
            ))}
          </div>
        </Card>

        {/* Sticky action bar */}
        <div style={{ position: 'sticky', bottom: 16, marginTop: 16, zIndex: 10 }}>
          <Card style={{
            padding: 16,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          }}>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="accent"
                icon={Send}
                onClick={() => router.push('/')}
              >
                Send to leadership
              </Button>
              <Button variant="soft" icon={Download}>
                Download PDF
              </Button>
              <Button variant="ghost" onClick={() => router.push('/')}>
                Save draft
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function KpiBlock({ value, label, sub }: { value: string; label: string; sub: string }) {
  return (
    <div>
      <div style={{
        fontFamily: 'var(--font-h1), sans-serif',
        fontSize: 38, lineHeight: 1, color: C.ink,
        fontVariantNumeric: 'tabular-nums',
        marginBottom: 8,
      }}>
        {value}
      </div>
      <div style={{
        fontSize: 12, fontWeight: 600,
        color: C.ink, marginBottom: 2,
      }}>
        {label}
      </div>
      <div style={{
        fontSize: 11, color: C.muted, lineHeight: 1.4,
      }}>
        {sub}
      </div>
    </div>
  );
}

function TrendRow({ label, detail }: { label: string; detail: string }) {
  return (
    <div style={{
      display: 'flex',
      gap: 14,
      paddingLeft: 14,
      borderLeft: `2px solid ${C.borderStrong}`,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 13, fontWeight: 600,
          color: C.ink, marginBottom: 4,
        }}>
          {label}
        </div>
        <div style={{
          fontSize: 13, color: C.inkLight, lineHeight: 1.55,
        }}>
          {detail}
        </div>
      </div>
    </div>
  );
}

function RecommendationItem({
  index, title, body,
}: {
  index: number; title: string; body: string;
}) {
  return (
    <div style={{
      display: 'flex',
      gap: 14,
      padding: 16,
      borderRadius: 12,
      background: C.paper,
      borderTop: `1px solid ${C.border}`,
      borderRight: `1px solid ${C.border}`,
      borderBottom: `1px solid ${C.border}`,
      borderLeft: `1px solid ${C.border}`,
    }}>
      <div
        aria-hidden="true"
        style={{
          flexShrink: 0,
          width: 28, height: 28, borderRadius: '50%',
          background: C.sageGlow,
          color: C.sageDeep,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 700,
          fontFamily: 'var(--font-h1), sans-serif',
        }}
      >
        {index}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="flex flex-wrap items-center justify-between gap-2" style={{ marginBottom: 6 }}>
          <h3 style={{
            fontSize: 14, fontWeight: 600,
            color: C.ink, margin: 0,
          }}>
            {title}
          </h3>
          <button
            className="view-btn"
            style={{
              fontSize: 11, color: C.muted,
              background: 'transparent', border: 'none', cursor: 'pointer',
              padding: 4, borderRadius: 4,
              display: 'inline-flex', alignItems: 'center', gap: 4,
              fontFamily: 'inherit',
            }}
          >
            Add to plan <ChevronRight size={11} aria-hidden="true" />
          </button>
        </div>
        <p style={{
          fontSize: 13, lineHeight: 1.55,
          color: C.inkLight, margin: 0,
        }}>
          {body}
        </p>
      </div>
    </div>
  );
}

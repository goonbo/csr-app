'use client';

import { use, useEffect, useState } from 'react';
import { useRouter, notFound } from 'next/navigation';
import { Sparkles, Send, Quote, ChevronRight } from 'lucide-react';
import { C } from '@/lib/tokens';
import { useAILoad } from '@/lib/useAILoad';
import { fmtDate } from '@/lib/format';
import { EVENTS } from '@/lib/seed/events';
import { AI_RECAP } from '@/lib/seed/ai-recap';
import type { AIRecap, AIRecapVoice, AIRecapNext } from '@/lib/types';
import { PageHeader } from '@/components/primitives/PageHeader';
import { Card } from '@/components/primitives/Card';
import { Pill } from '@/components/primitives/Pill';
import { Button } from '@/components/primitives/Button';
import { AIBlock } from '@/components/primitives/AIBlock';
import { LoadingSteps } from '@/components/primitives/LoadingSteps';

const RECAP_STEPS = [
  'Pulling attendance and outputs…',
  'Reading post-event survey signals…',
  'Synthesizing impact for both sides…',
  'Composing the recap…',
];

interface RecapPageProps {
  params: Promise<{ id: string }>;
}

export default function EventRecapPage({ params }: RecapPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const event = EVENTS.find(e => e.id === id);
  if (!event) notFound();

  const [recap, setRecap] = useState<AIRecap | null>(null);
  const ai = useAILoad(RECAP_STEPS, 3200);

  useEffect(() => {
    ai.start(() => setRecap(AI_RECAP));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const regenerate = () => {
    setRecap(null);
    ai.reset();
    setTimeout(() => ai.start(() => setRecap(AI_RECAP)), 60);
  };

  const subtitleParts = [
    event.date ? fmtDate(event.date) : null,
    event.partner,
  ].filter(Boolean) as string[];

  return (
    <div data-theme="blueprint">
      <PageHeader
        back="Back to event"
        onBack={() => router.push(`/events/${event.id}`)}
        greeting="Exec recap"
        title={event.title}
        subtitle={subtitleParts.join(' · ')}
        action={
          recap ? (
            <Button
              variant="accent"
              icon={Send}
              onClick={() => router.push('/events')}
            >
              Send to leadership
            </Button>
          ) : undefined
        }
      />

      {!recap && ai.active && (
        <div style={{ maxWidth: 720 }}>
          <Card ai style={{ padding: 24 }}>
            <div style={{
              display: 'flex', alignItems: 'center',
              gap: 8, marginBottom: 16,
            }}>
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
                Composing the recap…
              </span>
            </div>
            <LoadingSteps steps={RECAP_STEPS} idx={ai.stepIdx} />
          </Card>
        </div>
      )}

      {recap && (
        <div style={{
          maxWidth: 880,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}>
          {/* Intro / status */}
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
                  <span style={{ fontWeight: 600 }}>Draft recap ready.</span>{' '}
                  Review each section, edit anything, then send.
                </span>
              </div>
              <Pill tone="sage" icon={Sparkles}>AI generated</Pill>
            </div>
          </Card>

          {/* What happened — narrative hero */}
          <Card style={{ padding: 32 }}>
            <div style={{
              fontSize: 11, fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.06em',
              color: C.muted, marginBottom: 12,
            }}>
              What happened
            </div>
            <AIBlock label="AI draft · editable" onRegen={regenerate}>
              <p style={{
                fontFamily: 'var(--font-h1), sans-serif',
                fontSize: 18,
                lineHeight: 1.6,
                color: C.ink,
                margin: 0,
              }}>
                {recap.whatHappened}
              </p>
            </AIBlock>
          </Card>

          {/* Two columns: business / nonprofit value */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ValueCard
              eyebrow="What this meant for us"
              body={recap.businessValue}
              accent={C.sageDeep}
              onRegen={regenerate}
            />
            <ValueCard
              eyebrow="What this meant for them"
              body={recap.nonprofitValue}
              accent={C.terracottaDeep}
              onRegen={regenerate}
            />
          </div>

          {/* Voices */}
          <Card style={{ padding: 32 }}>
            <div style={{
              fontSize: 11, fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.06em',
              color: C.muted, marginBottom: 16,
            }}>
              Voices from the day
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {recap.voices.map((v, i) => (
                <VoiceQuote key={i} voice={v} />
              ))}
            </div>
          </Card>

          {/* What's next */}
          <Card style={{ padding: 32 }}>
            <div style={{
              fontSize: 11, fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.06em',
              color: C.muted, marginBottom: 16,
            }}>
              What&rsquo;s next
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {recap.whatsNext.map((n, i) => (
                <NextItem key={i} item={n} index={i + 1} />
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
                  onClick={() => router.push('/events')}
                >
                  Send to leadership
                </Button>
                <Button
                  variant="soft"
                  onClick={() => router.push(`/events/${event.id}`)}
                >
                  Save &amp; mark as reported
                </Button>
                <Button variant="ghost" onClick={regenerate}>
                  Regenerate
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

function ValueCard({
  eyebrow,
  body,
  accent,
  onRegen,
}: {
  eyebrow: string;
  body: string;
  accent: string;
  onRegen: () => void;
}) {
  return (
    <Card style={{ padding: 28, borderTop: `3px solid ${accent}` }}>
      <div style={{
        fontSize: 11, fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: '0.06em',
        color: accent, marginBottom: 12,
      }}>
        {eyebrow}
      </div>
      <AIBlock label="AI draft · editable" onRegen={onRegen}>
        <p style={{
          fontSize: 14,
          lineHeight: 1.6,
          color: C.inkLight,
          margin: 0,
        }}>
          {body}
        </p>
      </AIBlock>
    </Card>
  );
}

function VoiceQuote({ voice }: { voice: AIRecapVoice }) {
  return (
    <div style={{
      padding: 20,
      borderRadius: 12,
      background: C.oat,
      border: `1px solid ${C.border}`,
      position: 'relative',
    }}>
      <Quote
        size={16}
        color={C.borderStrong}
        aria-hidden="true"
        style={{ position: 'absolute', top: 16, left: 16, opacity: 0.5 }}
      />
      <p style={{
        fontFamily: 'var(--font-h1), sans-serif',
        fontSize: 17, fontStyle: 'italic',
        color: C.ink, lineHeight: 1.55,
        margin: 0, marginBottom: 12,
        paddingLeft: 28,
      }}>
        {voice.quote}
      </p>
      <div style={{
        fontSize: 12, fontWeight: 600, color: C.muted,
        paddingLeft: 28,
      }}>
        — {voice.who}
      </div>
    </div>
  );
}

function NextItem({ item, index }: { item: AIRecapNext; index: number }) {
  return (
    <div style={{
      display: 'flex',
      gap: 14,
      padding: 16,
      borderRadius: 12,
      background: C.paper,
      border: `1px solid ${C.border}`,
    }}>
      <div style={{
        flexShrink: 0,
        width: 28, height: 28, borderRadius: '50%',
        background: C.sageGlow,
        color: C.sageDeep,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 12, fontWeight: 700,
        fontFamily: 'var(--font-h1), sans-serif',
      }}>
        {index}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="flex flex-wrap items-center justify-between gap-2" style={{ marginBottom: 6 }}>
          <h2 style={{
            fontSize: 14, fontWeight: 600,
            color: C.ink, margin: 0,
          }}>
            {item.title}
          </h2>
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
          {item.body}
        </p>
      </div>
    </div>
  );
}

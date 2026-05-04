'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Check, RefreshCw, Send } from 'lucide-react';
import { C } from '@/lib/tokens';
import { useAILoad } from '@/lib/useAILoad';
import { AI_PLAN } from '@/lib/seed/ai-plan';
import type { AIPlan } from '@/lib/types';
import { PageHeader } from '@/components/primitives/PageHeader';
import { Card } from '@/components/primitives/Card';
import { Pill } from '@/components/primitives/Pill';
import { Button } from '@/components/primitives/Button';
import { AIBlock } from '@/components/primitives/AIBlock';
import { LoadingSteps } from '@/components/primitives/LoadingSteps';

const PLAN_STEPS = [
  'Listening to what you described…',
  'Considering capacity and partner fit…',
  'Drafting comms for your team…',
  'Pulling everything together…',
];

const EXAMPLE_PROMPT =
  'Food bank day in March for the Austin office, hands-on, half day, want to do this on a Friday';

export default function EventNewPage() {
  const router = useRouter();
  const [desc, setDesc] = useState('');
  const [plan, setPlan] = useState<AIPlan | null>(null);
  const ai = useAILoad(PLAN_STEPS, 3600);

  const generate = () => {
    if (!desc.trim()) return;
    ai.start(() => setPlan(AI_PLAN));
  };

  const startOver = () => {
    setPlan(null);
    ai.reset();
    setDesc('');
  };

  return (
    <div>
      <PageHeader
        back="All events"
        onBack={() => router.push('/events')}
        greeting="A new event"
        title="Tell us what you're imagining."
        subtitle="Describe it however feels natural. We'll handle the capacity, the comms, and the brief — you review and tweak."
      />

      {!plan && (
        <div style={{ maxWidth: 768 }}>
          <Card style={{ padding: 32 }}>
            <label
              htmlFor="event-desc"
              style={{
                display: 'block',
                fontSize: 11, fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.06em',
                color: C.muted, marginBottom: 12,
              }}
            >
              In your own words
            </label>
            <textarea
              id="event-desc"
              value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder={EXAMPLE_PROMPT}
              rows={3}
              className="view-input"
              style={{
                width: '100%',
                padding: '8px 0',
                background: 'transparent',
                border: 'none',
                resize: 'none',
                fontFamily: 'var(--font-h1), sans-serif',
                fontSize: 20,
                color: C.ink,
                lineHeight: 1.4,
                outline: 'none',
              }}
            />
            <div
              className="flex flex-wrap items-center justify-between gap-3"
              style={{
                marginTop: 24,
                paddingTop: 20,
                borderTop: `1px solid ${C.border}`,
              }}
            >
              <button
                onClick={() => setDesc(EXAMPLE_PROMPT)}
                className="view-btn"
                style={{
                  fontSize: 12,
                  color: C.muted,
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 4,
                  borderRadius: 4,
                  fontFamily: 'inherit',
                }}
              >
                Try the example →
              </button>
              <Button
                variant="ai"
                icon={Sparkles}
                onClick={generate}
                disabled={ai.active || !desc.trim()}
              >
                {ai.active ? 'Working on it…' : 'Plan this with me'}
              </Button>
            </div>
          </Card>

          {ai.active && (
            <div style={{ marginTop: 16 }}>
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
                    Putting your event together…
                  </span>
                </div>
                <LoadingSteps steps={PLAN_STEPS} idx={ai.stepIdx} />
              </Card>
            </div>
          )}
        </div>
      )}

      {plan && (
        <div
          style={{
            maxWidth: 960,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          {/* Intro */}
          <Card ai style={{ padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 28, height: 28, borderRadius: '50%', background: C.sage,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}
                aria-hidden="true"
              >
                <Check size={13} color="white" strokeWidth={3} />
              </div>
              <div style={{ fontSize: 13, color: C.sageDeep, lineHeight: 1.55 }}>
                <span style={{ fontWeight: 600 }}>Here&rsquo;s a draft.</span>{' '}
                Take a look at each piece — edit anything, regenerate what doesn&rsquo;t feel right.
              </div>
            </div>
          </Card>

          {/* Suggested capacity */}
          <Card style={{ padding: 28 }}>
            <div className="flex flex-wrap items-center justify-between gap-3" style={{ marginBottom: 12 }}>
              <div>
                <div style={{
                  fontSize: 11, fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                  color: C.muted, marginBottom: 8,
                }}>
                  Suggested capacity
                </div>
                <div style={{
                  fontFamily: 'var(--font-h1), sans-serif',
                  fontSize: 52, lineHeight: 1, color: C.ink,
                }}>
                  {plan.capacity}
                  <span style={{
                    fontSize: 16, marginLeft: 8,
                    color: C.muted, fontStyle: 'italic',
                  }}>
                    volunteers
                  </span>
                </div>
              </div>
              <Pill tone="sage" icon={Sparkles}>AI suggested</Pill>
            </div>
            <div style={{
              marginTop: 16,
              paddingLeft: 16,
              borderLeft: `2px solid ${C.sage}`,
            }}>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: C.inkLight, margin: 0 }}>
                {plan.capacityReason}
              </p>
            </div>
          </Card>

          {/* 4 AIBlock content cards */}
          {(
            [
              { label: 'Slack / Teams post', content: plan.teamsPost },
              { label: 'All-hands email', subject: plan.emailSubject, content: plan.emailBody },
              { label: 'Manager-forward note', content: plan.managerNote },
              { label: 'Internal event brief', content: plan.brief },
            ] as const
          ).map((piece, i) => (
            <Card key={i} style={{ padding: 28 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 16,
                gap: 12,
                flexWrap: 'wrap',
              }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: C.ink, margin: 0 }}>
                  {piece.label}
                </h3>
                <button
                  className="view-btn"
                  style={{
                    fontSize: 11,
                    color: C.muted,
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 4,
                    borderRadius: 4,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    fontFamily: 'inherit',
                  }}
                >
                  <RefreshCw size={11} aria-hidden="true" /> Regenerate
                </button>
              </div>
              <AIBlock label="AI draft · editable">
                {'subject' in piece && piece.subject && (
                  <div style={{ marginBottom: 12 }}>
                    <div style={{
                      fontSize: 10, fontWeight: 700,
                      textTransform: 'uppercase', letterSpacing: '0.06em',
                      color: C.muted, marginBottom: 4,
                    }}>
                      Subject
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>
                      {piece.subject}
                    </div>
                  </div>
                )}
                <pre
                  style={{
                    fontSize: 13,
                    lineHeight: 1.6,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    fontFamily: 'var(--font-sans), "DM Sans", sans-serif',
                    color: C.inkLight,
                    margin: 0,
                  }}
                >
                  {piece.content}
                </pre>
              </AIBlock>
            </Card>
          ))}

          {/* Sticky action bar */}
          <div style={{ position: 'sticky', bottom: 16, marginTop: 16, zIndex: 10 }}>
            <Card
              style={{
                padding: 16,
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              }}
            >
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  variant="accent"
                  icon={Send}
                  onClick={() => router.push('/events')}
                >
                  Publish &amp; send comms
                </Button>
                <Button variant="soft" onClick={() => router.push('/events')}>
                  Save as draft
                </Button>
                <Button variant="ghost" onClick={startOver}>
                  Start over
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

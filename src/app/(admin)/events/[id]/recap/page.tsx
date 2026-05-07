"use client";

/**
 * /events/[id]/recap — exec recap, in Blueprint register.
 *
 * The whole route wraps in `data-theme="blueprint"` so the H1 picks
 * up Fraunces serif (via --heading-family in globals.css), the
 * surface goes mist white, and radii read more generous than the
 * Operator chrome above.
 *
 * Auto-runs the recap-generation flow on mount via useAILoad
 * (Sarah is opening this page from the admin home's "Recap ready"
 * card, so the loader feels like the AI is working in real time
 * even though the resolution is seeded).
 */

import { use, useEffect, useState } from "react";
import { useRouter, notFound } from "next/navigation";
import { Sparkles, Send, Quote, ChevronRight } from "lucide-react";
import { useAILoad } from "@/lib/useAILoad";
import { fmtDate } from "@/lib/format";
import { EVENTS } from "@/lib/seed/events";
import { AI_RECAP } from "@/lib/seed/ai-recap";
import type { AIRecap, AIRecapVoice, AIRecapNext } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pill } from "@/components/view/Pill";
import { PageHeader } from "@/components/view/PageHeader";
import { AIBlock } from "@/components/view/AIBlock";
import { LoadingSteps } from "@/components/view/LoadingSteps";

const RECAP_STEPS = [
  "Pulling attendance and outputs…",
  "Reading post-event survey signals…",
  "Synthesizing impact for both sides…",
  "Composing the recap…",
];

interface RecapPageProps {
  params: Promise<{ id: string }>;
}

export default function EventRecapPage({ params }: RecapPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const event = EVENTS.find((e) => e.id === id);
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
        subtitle={subtitleParts.join(" · ")}
        action={
          recap ? (
            <Button onClick={() => router.push("/events")}>
              <Send className="size-4" aria-hidden="true" />
              Send to leadership
            </Button>
          ) : undefined
        }
      />

      {!recap && ai.active && (
        <div className="max-w-[720px]">
          <Card className="bg-view-source-muted/40 ring-view-source/30 p-6">
            <div className="mb-4 flex items-center gap-2">
              <div
                aria-hidden="true"
                className="flex size-7 items-center justify-center rounded-full bg-view-source text-white"
              >
                <Sparkles className="size-3" />
              </div>
              <span className="text-[13px] font-semibold text-view-source-foreground">
                Composing the recap…
              </span>
            </div>
            <LoadingSteps steps={RECAP_STEPS} idx={ai.stepIdx} />
          </Card>
        </div>
      )}

      {recap && (
        <div className="flex max-w-[880px] flex-col gap-4">
          {/* Intro / status */}
          <Card className="bg-view-source-muted/40 ring-view-source/30 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div
                  aria-hidden="true"
                  className="flex size-7 shrink-0 items-center justify-center rounded-full bg-view-source text-white"
                >
                  <Sparkles className="size-3" />
                </div>
                <span className="text-[13px] leading-relaxed text-view-source-foreground">
                  <span className="font-semibold">Draft recap ready.</span>{" "}
                  Review each section, edit anything, then send.
                </span>
              </div>
              <Pill tone="sage" icon={Sparkles}>AI generated</Pill>
            </div>
          </Card>

          {/* What happened — narrative hero */}
          <Card className="p-8">
            <div className="mb-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              What happened
            </div>
            <AIBlock label="AI draft · editable" onRegenerate={regenerate}>
              <p className="m-0 font-heading text-lg leading-relaxed text-foreground">
                {recap.whatHappened}
              </p>
            </AIBlock>
          </Card>

          {/* Two columns: business / nonprofit value */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <ValueCard
              eyebrow="What this meant for us"
              body={recap.businessValue}
              onRegen={regenerate}
            />
            <ValueCard
              eyebrow="What this meant for them"
              body={recap.nonprofitValue}
              onRegen={regenerate}
            />
          </div>

          {/* Voices */}
          <Card className="p-8">
            <div className="mb-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Voices from the day
            </div>
            <div className="flex flex-col gap-4">
              {recap.voices.map((v, i) => (
                <VoiceQuote key={i} voice={v} />
              ))}
            </div>
          </Card>

          {/* What's next */}
          <Card className="p-8">
            <div className="mb-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              What&rsquo;s next
            </div>
            <div className="flex flex-col gap-3">
              {recap.whatsNext.map((n, i) => (
                <NextItem key={i} item={n} index={i + 1} />
              ))}
            </div>
          </Card>

          {/* Sticky action bar */}
          <div className="sticky bottom-4 z-10 mt-4">
            <Card className="p-4 shadow-lg">
              <div className="flex flex-wrap items-center gap-3">
                <Button onClick={() => router.push("/events")}>
                  <Send className="size-4" aria-hidden="true" />
                  Send to leadership
                </Button>
                <Button
                  variant="outline"
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
  onRegen,
}: {
  eyebrow: string;
  body: string;
  onRegen: () => void;
}) {
  return (
    <Card className="border-t-4 border-t-primary p-7">
      <div className="mb-3 text-[11px] font-bold uppercase tracking-wider text-primary">
        {eyebrow}
      </div>
      <AIBlock label="AI draft · editable" onRegenerate={onRegen}>
        <p className="m-0 text-sm leading-relaxed text-muted-foreground">
          {body}
        </p>
      </AIBlock>
    </Card>
  );
}

function VoiceQuote({ voice }: { voice: AIRecapVoice }) {
  return (
    <div className="relative rounded-xl border border-border bg-muted/40 p-5">
      <Quote
        aria-hidden="true"
        className="absolute left-4 top-4 size-4 text-muted-foreground/50"
      />
      <p className="m-0 mb-3 pl-7 font-heading text-[17px] italic leading-relaxed text-foreground">
        {voice.quote}
      </p>
      <div className="pl-7 text-xs font-semibold text-muted-foreground">
        — {voice.who}
      </div>
    </div>
  );
}

function NextItem({ item, index }: { item: AIRecapNext; index: number }) {
  return (
    <div className="flex gap-3.5 rounded-xl border border-border bg-card p-4">
      <div
        aria-hidden="true"
        className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 font-heading text-xs font-bold text-primary"
      >
        {index}
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
          <h2 className="m-0 text-sm font-semibold text-foreground">
            {item.title}
          </h2>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded p-1 text-[11px] text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Add to plan <ChevronRight className="size-3" aria-hidden="true" />
          </button>
        </div>
        <p className="m-0 text-[13px] leading-relaxed text-muted-foreground">
          {item.body}
        </p>
      </div>
    </div>
  );
}

"use client";

/**
 * /events/new — event builder with the AI plan flow.
 *
 * Two states:
 *   1. Pre-plan — single textarea, Sarah describes the event in her
 *      own words. "Plan this with me" triggers the synthetic AI flow.
 *   2. Post-plan — AI-acknowledged intro Card, suggested-capacity hero,
 *      four editable AIBlock drafts (Slack post, all-hands email,
 *      manager-forward note, internal brief), and a sticky action
 *      bar at the bottom (Publish / Save as draft / Start over).
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Check, RefreshCw, Send } from "lucide-react";
import { useAILoad } from "@/lib/useAILoad";
import { AI_PLAN } from "@/lib/seed/ai-plan";
import type { AIPlan } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Pill } from "@/components/view/Pill";
import { PageHeader } from "@/components/view/PageHeader";
import { AIBlock } from "@/components/view/AIBlock";
import { LoadingSteps } from "@/components/view/LoadingSteps";

const PLAN_STEPS = [
  "Listening to what you described…",
  "Considering capacity and partner fit…",
  "Drafting comms for your team…",
  "Pulling everything together…",
];

const EXAMPLE_PROMPT =
  "Food bank day in March for the Austin office, hands-on, half day, want to do this on a Friday";

export default function EventNewPage() {
  const router = useRouter();
  const [desc, setDesc] = useState("");
  const [plan, setPlan] = useState<AIPlan | null>(null);
  const ai = useAILoad(PLAN_STEPS, 3600);

  const generate = () => {
    if (!desc.trim()) return;
    ai.start(() => setPlan(AI_PLAN));
  };

  const startOver = () => {
    setPlan(null);
    ai.reset();
    setDesc("");
  };

  return (
    <div>
      <PageHeader
        back="All events"
        onBack={() => router.push("/events")}
        greeting="A new event"
        title="Tell us what you're imagining."
        subtitle="Describe it however feels natural. We'll handle the capacity, the comms, and the brief — you review and tweak."
      />

      {!plan && (
        <div className="max-w-3xl">
          <Card className="p-8">
            <label
              htmlFor="event-desc"
              className="mb-3 block text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
            >
              In your own words
            </label>
            <Textarea
              id="event-desc"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder={EXAMPLE_PROMPT}
              rows={3}
              className="resize-none border-0 bg-transparent px-0 py-2 font-heading text-xl leading-snug text-foreground shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/70 dark:bg-transparent"
            />
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
              <button
                type="button"
                onClick={() => setDesc(EXAMPLE_PROMPT)}
                className="rounded p-1 text-xs text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Try the example →
              </button>
              <Button
                onClick={generate}
                disabled={ai.active || !desc.trim()}
              >
                <Sparkles className="size-4" aria-hidden="true" />
                {ai.active ? "Working on it…" : "Plan this with me"}
              </Button>
            </div>
          </Card>

          {ai.active && (
            <div className="mt-4">
              <Card className="bg-view-source-muted/40 ring-view-source/30 p-6">
                <div className="mb-4 flex items-center gap-2">
                  <div
                    aria-hidden="true"
                    className="flex size-7 items-center justify-center rounded-full bg-view-source text-view-source-foreground"
                  >
                    <Sparkles className="size-3" />
                  </div>
                  <span className="text-[13px] font-semibold text-view-source-foreground">
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
        <div className="flex max-w-4xl flex-col gap-4">
          {/* Intro */}
          <Card className="bg-view-source-muted/40 ring-view-source/30 p-4">
            <div className="flex items-center gap-3">
              <div
                aria-hidden="true"
                className="flex size-7 shrink-0 items-center justify-center rounded-full bg-view-source text-view-source-foreground"
              >
                <Check className="size-3.5" strokeWidth={3} />
              </div>
              <p className="text-[13px] leading-relaxed text-view-source-foreground">
                <span className="font-semibold">Here&rsquo;s a draft.</span>{" "}
                Take a look at each piece — edit anything, regenerate what
                doesn&rsquo;t feel right.
              </p>
            </div>
          </Card>

          {/* Suggested capacity */}
          <Card className="p-7">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Suggested capacity
                </div>
                <div className="flex items-baseline gap-2 font-heading text-[52px] leading-none text-foreground">
                  {plan.capacity}
                  <span className="text-base italic text-muted-foreground">
                    volunteers
                  </span>
                </div>
              </div>
              <Pill tone="sage" icon={Sparkles}>AI suggested</Pill>
            </div>
            <div className="mt-4 border-l-2 border-primary pl-4">
              <p className="text-[13px] leading-relaxed text-muted-foreground">
                {plan.capacityReason}
              </p>
            </div>
          </Card>

          {/* 4 AIBlock content cards */}
          {(
            [
              { label: "Slack / Teams post",      content: plan.teamsPost },
              { label: "All-hands email",         subject: plan.emailSubject, content: plan.emailBody },
              { label: "Manager-forward note",    content: plan.managerNote },
              { label: "Internal event brief",    content: plan.brief },
            ] as const
          ).map((piece, i) => (
            <Card key={i} className="p-7">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-sm font-semibold text-foreground">
                  {piece.label}
                </h3>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 rounded p-1 text-[11px] text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <RefreshCw className="size-3" aria-hidden="true" />
                  Regenerate
                </button>
              </div>
              <AIBlock label="AI draft · editable">
                {"subject" in piece && piece.subject && (
                  <div className="mb-3">
                    <div className="mb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Subject
                    </div>
                    <div className="text-sm font-semibold text-foreground">
                      {piece.subject}
                    </div>
                  </div>
                )}
                <pre className="m-0 whitespace-pre-wrap break-words font-sans text-[13px] leading-relaxed text-muted-foreground">
                  {piece.content}
                </pre>
              </AIBlock>
            </Card>
          ))}

          {/* Sticky action bar */}
          <div className="sticky bottom-4 z-10 mt-4">
            <Card className="p-4 shadow-lg">
              <div className="flex flex-wrap items-center gap-3">
                <Button onClick={() => router.push("/events")}>
                  <Send className="size-4" aria-hidden="true" />
                  Publish &amp; send comms
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push("/events")}
                >
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

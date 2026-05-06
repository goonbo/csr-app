"use client";

/**
 * /admin home — Sarah's workbench.
 *
 * The most architecturally interesting screen in the product:
 * attention queue, demand-signals strip, pipeline flow, recruiting
 * now grid, KPI rail, and an AI nudge. The structure mirrors the
 * operator's actual cycle (signals → plan → execute → learn).
 */

import { Fragment, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle, Clock, Edit3, Sparkles, Send,
  ChevronRight, ArrowRight,
} from "lucide-react";
import { causeStyle } from "@/lib/cause";
import { fmtDate } from "@/lib/format";
import { EVENTS } from "@/lib/seed/events";
import { PIPELINE_STAGES } from "@/lib/seed/pipeline";
import type { Pipeline, PillTone, Event } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Pill } from "@/components/view/Pill";
import { PageHeader } from "@/components/view/PageHeader";
import { DemandSignalsPanel } from "@/components/admin/DemandSignalsPanel";
import { cn } from "@/lib/utils";

const computeGreeting = (): string => {
  const hour = new Date().getHours();
  return hour < 12
    ? "Good morning, Sarah"
    : hour < 18
      ? "Good afternoon, Sarah"
      : "Good evening, Sarah";
};

const subscribeNoop = () => () => {};

export default function AdminHomePage() {
  const router = useRouter();
  const greeting = useSyncExternalStore(
    subscribeNoop,
    computeGreeting,
    () => "Good morning, Sarah",
  );

  const completed = EVENTS.filter((e) => e.status === "completed");
  const totalHours = completed.reduce((s, e) => s + (e.hours || 0), 0);

  const atRiskEvents = EVENTS.filter((e) => e.pipeline === "at-risk");
  const awaitingPartner = EVENTS.filter(
    (e) => e.pipeline === "vetting" && e.awaitingPartner,
  );
  const awaitingApproval = EVENTS.filter(
    (e) => e.pipeline === "proposed" && e.awaitingApproval,
  );
  const recapPending = EVENTS.filter((e) => e.pipeline === "completed");
  const recruitingEvents = EVENTS.filter((e) => e.pipeline === "recruiting");

  const attentionCount =
    atRiskEvents.length +
    awaitingPartner.length +
    awaitingApproval.length +
    recapPending.length;

  const pipelineCounts = PIPELINE_STAGES.reduce<Record<Pipeline, number>>(
    (acc, stage) => {
      acc[stage.id] = EVENTS.filter((e) => e.pipeline === stage.id).length;
      return acc;
    },
    {} as Record<Pipeline, number>,
  );
  const stageEvents = PIPELINE_STAGES.reduce<Record<Pipeline, Event[]>>(
    (acc, s) => {
      acc[s.id] = EVENTS.filter((e) => e.pipeline === s.id);
      return acc;
    },
    {} as Record<Pipeline, Event[]>,
  );
  const eventsInMotion = EVENTS.filter(
    (e) => e.pipeline !== "completed" && e.pipeline !== "reported",
  ).length;

  return (
    <div>
      <PageHeader
        greeting={greeting}
        title="Here's your week."
        subtitle="What needs you today, where the pipeline stands, and the work in motion."
      />

      {/* WHAT NEEDS YOU TODAY — the operator wedge */}
      <section className="mb-8">
        <header className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">
            What needs you today
          </h2>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {attentionCount} items
          </span>
        </header>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {atRiskEvents.map((e) => {
            const causeCount = e.diagnosis ? e.diagnosis.length : 0;
            const fillPct = e.capacity
              ? Math.round((e.registered / e.capacity) * 100)
              : 0;
            return (
              <AttentionCard
                key={e.id}
                onClick={() => router.push(`/events/${e.id}`)}
                tone="rose"
                icon={AlertCircle}
                pillTone="rose"
                pillLabel="At risk"
                meta={`${e.date && fmtDate(e.date, false)} · ${fillPct}% filled`}
                title={e.title}
                desc={
                  causeCount > 0
                    ? `${causeCount} candidate causes surfaced — review the diagnosis before acting`
                    : "Under-enrolled. Worth reviewing."
                }
              />
            );
          })}

          {awaitingPartner.map((e) => (
            <AttentionCard
              key={e.id}
              onClick={() => router.push(`/events/${e.id}`)}
              tone="amber"
              icon={Clock}
              pillTone="amber"
              pillLabel="Awaiting partner"
              title={e.partner ?? ""}
              desc={e.awaitingPartner ?? ""}
            />
          ))}

          {awaitingApproval.map((e) => (
            <AttentionCard
              key={e.id}
              onClick={() => router.push(`/events/${e.id}`)}
              tone="amber"
              icon={Edit3}
              pillTone="amber"
              pillLabel="Approval pending"
              title={e.title}
              desc={`Waiting on ${e.awaitingApproval}`}
            />
          ))}

          {recapPending.map((e) => (
            <AttentionCard
              key={e.id}
              onClick={() => router.push(`/events/${e.id}/recap`)}
              tone="ai"
              icon={Sparkles}
              pillTone="sage"
              pillLabel="Recap ready"
              title={e.title}
              desc={`${e.attended} attended · ${e.hours} hours · ready to share with leadership`}
            />
          ))}
        </div>
      </section>

      {/* DEMAND SIGNALS — workflow entry point */}
      <DemandSignalsPanel />

      {/* PIPELINE FLOW */}
      <PipelineFlow
        counts={pipelineCounts}
        stageEvents={stageEvents}
        eventsInMotion={eventsInMotion}
        atRiskCount={atRiskEvents.length}
        onSeeAll={() => router.push("/events")}
      />

      {/* KPI ROW + RECRUITING NOW */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
        <div>
          <header className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">
              Recruiting now
            </h2>
            <button
              type="button"
              onClick={() => router.push("/events/new")}
              className="inline-flex items-center gap-1 rounded px-1 py-1 text-xs font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Plan a new event <ArrowRight className="size-3" aria-hidden="true" />
            </button>
          </header>
          <div className="flex flex-col gap-3">
            {recruitingEvents.map((e) => {
              const cs = causeStyle(e.cause);
              const dateBits = e.date
                ? fmtDate(e.date, false).split(" ")
                : ["", ""];
              return (
                <Card
                  key={e.id}
                  onClick={() => router.push(`/events/${e.id}`)}
                  role="button"
                  tabIndex={0}
                  className="cursor-pointer p-5 hover:ring-foreground/15 transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div
                      aria-hidden="true"
                      className="flex size-14 shrink-0 flex-col items-center justify-center rounded-2xl text-white"
                      style={{ backgroundImage: cs.gradient }}
                    >
                      <div className="text-[9px] font-bold uppercase tracking-wider opacity-95">
                        {dateBits[0]}
                      </div>
                      <div className="font-heading text-xl leading-none">
                        {dateBits[1]}
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 text-[15px] font-medium text-foreground">
                        {e.title}
                      </div>
                      <div className="mb-2.5 text-xs text-muted-foreground">
                        {e.partner} · {e.time}
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Pill tone="sage">
                          {e.registered}/{e.capacity} signed up
                        </Pill>
                        {e.managerNudgeSent && (
                          <Pill tone="neutral" icon={Send}>
                            Manager nudge sent
                          </Pill>
                        )}
                        {e.vto && <Pill tone="terracotta">VTO</Pill>}
                      </div>
                    </div>
                    <ChevronRight
                      aria-hidden="true"
                      className="size-4 shrink-0 self-center text-muted-foreground"
                    />
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* RIGHT RAIL — KPI snapshot + AI suggestion */}
        <div className="flex flex-col gap-4">
          <Card className="p-5">
            <h3 className="mb-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Year so far
            </h3>
            <div className="flex flex-col gap-3.5">
              {[
                {
                  label: "Volunteer hours",
                  value: String(totalHours),
                  sub: "+18% YoY",
                  positive: true,
                },
                {
                  label: "Participating",
                  value: "62",
                  sub: "31% of workforce",
                },
                {
                  label: "Active partners",
                  value: "5",
                  sub: "1 needs a hello",
                },
              ].map((k, i) => (
                <div
                  key={k.label}
                  className={cn(
                    "flex items-baseline justify-between",
                    i < 2 && "border-b border-border pb-3.5",
                  )}
                >
                  <div>
                    <div className="text-xs text-muted-foreground">
                      {k.label}
                    </div>
                    <div
                      className={cn(
                        "mt-0.5 text-[11px]",
                        k.positive ? "text-emerald-600" : "text-muted-foreground",
                      )}
                    >
                      {k.sub}
                    </div>
                  </div>
                  <div className="font-heading text-2xl leading-none text-foreground">
                    {k.value}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="bg-view-source-muted/40 ring-view-source/30 p-4">
            <div className="flex items-start gap-2.5">
              <div
                aria-hidden="true"
                className="flex size-7 shrink-0 items-center justify-center rounded-full bg-view-source text-white"
              >
                <Sparkles className="size-3" />
              </div>
              <div>
                <div className="mb-1 text-[13px] font-semibold text-foreground">
                  Animal Center has been quiet
                </div>
                <div className="text-xs leading-relaxed text-foreground/80">
                  Last contact November. Worth a check-in before they fall off
                  your active list.
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// AttentionCard — the "what needs you today" row primitive.
// ============================================================

interface AttentionCardProps {
  tone: "rose" | "amber" | "ai";
  icon: typeof AlertCircle;
  pillTone: PillTone;
  pillLabel: string;
  title: string;
  desc: string;
  meta?: string;
  onClick: () => void;
}

function AttentionCard({
  tone,
  icon: Icon,
  pillTone,
  pillLabel,
  title,
  desc,
  meta,
  onClick,
}: AttentionCardProps) {
  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={onClick}
      className={cn(
        "cursor-pointer p-4 transition-shadow hover:ring-foreground/15",
        tone === "rose" && "border-l-4 border-l-rose-500",
        tone === "amber" && "border-l-4 border-l-amber-500",
        tone === "ai" && "bg-view-source-muted/40 ring-view-source/30",
      )}
    >
      <div className="flex items-start gap-3">
        <div
          aria-hidden="true"
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-full",
            tone === "rose" && "bg-rose-50 text-rose-700",
            tone === "amber" && "bg-amber-50 text-amber-700",
            tone === "ai" && "bg-view-source text-white",
          )}
        >
          <Icon className="size-3.5" strokeWidth={2.4} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <Pill tone={pillTone}>{pillLabel}</Pill>
            {meta ? (
              <span className="text-[11px] text-muted-foreground">{meta}</span>
            ) : null}
          </div>
          <div className="mb-1 text-sm font-semibold text-foreground">
            {title}
          </div>
          <div className="text-xs leading-relaxed text-muted-foreground">
            {desc}
          </div>
        </div>
      </div>
    </Card>
  );
}

// ============================================================
// PipelineFlow — horizontal stage band with tone-tinted chips,
// chevron flow connectors, and an alert pulse on at-risk.
// ============================================================

interface PipelineFlowProps {
  counts: Record<Pipeline, number>;
  stageEvents: Record<Pipeline, Event[]>;
  eventsInMotion: number;
  atRiskCount: number;
  onSeeAll: () => void;
}

const PHASES: { label: string; stages: Pipeline[] }[] = [
  { label: "Planning", stages: ["sourcing", "vetting", "proposed"] },
  { label: "Active",   stages: ["confirmed", "recruiting", "at-risk"] },
  { label: "Done",     stages: ["completed", "reported"] },
];

const PARTNER_SHORT: Record<string, string> = {
  "Greater Austin Food Bank": "Food Bank",
  "TreeFolks": "TreeFolks",
  "Habitat for Humanity Greater Austin": "Habitat",
  "Boys & Girls Club of the Austin Area": "Boys & Girls",
  "Austin Animal Center Foundation": "Animal Center",
};
const shortenPartner = (p: string | null): string =>
  !p ? "" : (PARTNER_SHORT[p] ?? p.split(" ").slice(0, 2).join(" "));

function cellMeta(events: Event[]): { primary: string; suffix: string } {
  if (events.length === 0) return { primary: "", suffix: "" };
  const sorted = [...events].sort((a, b) => {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;
    return a.date.localeCompare(b.date);
  });
  const e = sorted[0];
  const partner = shortenPartner(e.partner) || e.cause;
  const date = e.date ? fmtDate(e.date, false) : "TBD";
  const suffix = events.length > 1 ? ` +${events.length - 1}` : "";
  return { primary: `${partner} · ${date}`, suffix };
}

function PipelineFlow({
  counts,
  stageEvents,
  eventsInMotion,
  atRiskCount,
  onSeeAll,
}: PipelineFlowProps) {
  return (
    <section className="mb-8">
      <header className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Pipeline</h2>
          <div className="mt-1 text-xs text-muted-foreground">
            {eventsInMotion} in motion
            {atRiskCount > 0 && (
              <>
                {" · "}
                <span className="font-semibold text-rose-700">
                  {atRiskCount} need{atRiskCount === 1 ? "s" : ""} attention
                </span>
              </>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={onSeeAll}
          className="rounded p-1 text-xs text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          See all →
        </button>
      </header>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <div className="min-w-[880px] px-4 pb-4 pt-5">
            {/* Phase eyebrow row */}
            <div className="mb-3 flex items-end gap-4 px-1">
              {PHASES.map((phase) => (
                <div
                  key={phase.label}
                  className="flex items-center gap-2"
                  style={{ flex: phase.stages.length }}
                >
                  <span className="whitespace-nowrap text-[9px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
                    {phase.label}
                  </span>
                  <span
                    aria-hidden="true"
                    className="h-px flex-1 bg-gradient-to-r from-border-strong/40 to-transparent"
                  />
                </div>
              ))}
            </div>

            {/* Stage cells row */}
            <div className="flex items-stretch">
              {PHASES.map((phase, phaseIdx) => (
                <Fragment key={phase.label}>
                  {phaseIdx > 0 && <PhaseDivider />}
                  <div
                    className="flex items-stretch"
                    style={{ flex: phase.stages.length }}
                  >
                    {phase.stages.map((stageId, i) => {
                      const stage = PIPELINE_STAGES.find((s) => s.id === stageId)!;
                      const count = counts[stage.id] || 0;
                      const events = stageEvents[stage.id] || [];
                      const isAlert = stage.id === "at-risk" && count > 0;
                      const isEmpty = count === 0;
                      const isLastInPhase = i === phase.stages.length - 1;
                      return (
                        <Fragment key={stage.id}>
                          <PipelineCell
                            stage={stage}
                            count={count}
                            events={events}
                            isAlert={isAlert}
                            isEmpty={isEmpty}
                            onClick={onSeeAll}
                          />
                          {!isLastInPhase && (
                            <div
                              aria-hidden="true"
                              className="flex shrink-0 items-center px-0.5 text-border-strong"
                            >
                              <ChevronRight
                                className="size-3.5"
                                strokeWidth={2.2}
                              />
                            </div>
                          )}
                        </Fragment>
                      );
                    })}
                  </div>
                </Fragment>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}

function PhaseDivider() {
  return (
    <div
      aria-hidden="true"
      className="flex w-[18px] shrink-0 flex-col items-center justify-center gap-0.5 text-muted-foreground"
    >
      <ChevronRight className="-mb-2 size-[11px] opacity-50" strokeWidth={2} />
      <ChevronRight className="size-3.5" strokeWidth={2.4} />
    </div>
  );
}

interface PipelineCellProps {
  stage: typeof PIPELINE_STAGES[number];
  count: number;
  events: Event[];
  isAlert: boolean;
  isEmpty: boolean;
  onClick: () => void;
}

const TONE_CELL_CLASSES: Record<
  PillTone,
  { bg: string; accent: string; text: string }
> = {
  neutral:    { bg: "bg-muted",       accent: "bg-border-strong", text: "text-muted-foreground" },
  sage:       { bg: "bg-emerald-50",  accent: "bg-emerald-500",   text: "text-emerald-900" },
  amber:      { bg: "bg-amber-50",    accent: "bg-amber-500",     text: "text-amber-900" },
  rose:       { bg: "bg-rose-50",     accent: "bg-rose-500",      text: "text-rose-900" },
  terracotta: { bg: "bg-orange-50",   accent: "bg-orange-500",    text: "text-orange-900" },
};

function PipelineCell({
  stage, count, events, isAlert, isEmpty, onClick,
}: PipelineCellProps) {
  const [hover, setHover] = useState(false);
  const meta = cellMeta(events);
  const tone = TONE_CELL_CLASSES[stage.tone];

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={cn(
        "relative flex flex-1 min-w-[116px] flex-col items-start overflow-hidden rounded-[10px] p-3.5 text-left",
        "transition-[transform,box-shadow] duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        isEmpty ? "opacity-55" : tone.bg,
        isAlert && !isEmpty && "ring-1 ring-rose-500",
        hover && !isEmpty && "-translate-y-0.5 shadow-md",
      )}
    >
      {/* Top accent bar */}
      <div
        aria-hidden="true"
        className={cn(
          "absolute left-3 right-3 h-0.5 rounded",
          isEmpty
            ? "top-px border-t border-dashed border-border-strong"
            : cn("top-0", tone.accent),
        )}
      />

      {/* Alert dot */}
      {isAlert && (
        <span
          aria-hidden="true"
          className="absolute right-2.5 top-2.5 size-2 rounded-full bg-rose-500 ring-4 ring-rose-500/20 motion-safe:[animation:alert-pulse_1.8s_ease-in-out_infinite]"
        />
      )}

      <div
        className={cn(
          "mb-2.5 text-[10px] font-bold uppercase tracking-wider",
          isEmpty ? "text-muted-foreground/60" : tone.text,
        )}
      >
        {stage.short}
      </div>

      <div
        className={cn(
          "mb-2 flex items-baseline gap-1 font-heading text-3xl leading-none tabular-nums",
          isEmpty ? "text-muted-foreground/60" : tone.text,
        )}
      >
        {count}
        {meta.suffix && (
          <span className="font-sans text-[11px] italic text-muted-foreground">
            {meta.suffix}
          </span>
        )}
      </div>

      {meta.primary ? (
        <div
          className={cn(
            "w-full overflow-hidden text-ellipsis whitespace-nowrap text-[10.5px] font-medium opacity-85",
            isEmpty ? "text-muted-foreground/60" : tone.text,
          )}
        >
          {meta.primary}
        </div>
      ) : isEmpty ? (
        <div className="text-[10.5px] italic text-muted-foreground/60">
          empty
        </div>
      ) : null}
    </button>
  );
}

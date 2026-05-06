"use client";

/**
 * /events — admin events list.
 *
 * Whole pipeline at a glance, sorted urgent-first. Filter is a
 * shadcn `Tabs` segmented control with a count badge per group.
 *
 * Each event card shows the pipeline stage Pill, date (or "Date
 * pending"), title in heading face, partner (or italic placeholder),
 * and a stage-specific status block:
 *
 *   sourcing    → italic source note
 *   vetting     → "Awaiting partner: …" amber border-l
 *   proposed    → "Awaiting <approver>" amber border-l
 *   confirmed   → confirmed note in emerald border-l
 *   recruiting  → registered/capacity Pill, manager-nudge Pill, VTO Pill
 *   at-risk     → registered/capacity Pill (rose), VTO, then a
 *                 rose left-border block listing candidate causes;
 *                 the Card itself also gets a rose `border-l-4`
 *   completed   → "X/Y attended · Zh" + sage "Recap ready" pill
 *   reported    → same attended/hours line, no recap pill
 */

import { useRouter } from "next/navigation";
import { Plus, Send, Sparkles } from "lucide-react";
import { fmtDate } from "@/lib/format";
import { EVENTS } from "@/lib/seed/events";
import { pipelineConfig } from "@/lib/seed/pipeline";
import type { Pipeline, Event } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Pill } from "@/components/view/Pill";
import { PageHeader } from "@/components/view/PageHeader";
import { cn } from "@/lib/utils";

type FilterId = "all" | "in-flight" | "live" | "wrapped";

interface FilterGroup {
  id: FilterId;
  label: string;
  match: (pipeline: Pipeline) => boolean;
}

const FILTER_GROUPS: FilterGroup[] = [
  { id: "all", label: "All", match: () => true },
  {
    id: "in-flight",
    label: "In flight",
    match: (p) => p === "sourcing" || p === "vetting" || p === "proposed",
  },
  {
    id: "live",
    label: "Live",
    match: (p) => p === "confirmed" || p === "recruiting" || p === "at-risk",
  },
  {
    id: "wrapped",
    label: "Wrapped",
    match: (p) => p === "completed" || p === "reported",
  },
];

const STAGE_ORDER: Pipeline[] = [
  "at-risk",
  "recruiting",
  "confirmed",
  "proposed",
  "vetting",
  "sourcing",
  "completed",
  "reported",
];

export default function EventsListPage() {
  const router = useRouter();

  return (
    <div>
      <PageHeader
        title="Events"
        subtitle="The whole pipeline — sourcing through reported. Sorted by what needs you most."
        action={
          <Button onClick={() => router.push("/events/new")}>
            <Plus className="size-4" aria-hidden="true" />
            Plan an event
          </Button>
        }
      />

      <Tabs defaultValue="all">
        <TabsList aria-label="Filter events by stage" className="mb-6">
          {FILTER_GROUPS.map((f) => {
            const count = EVENTS.filter((e) => f.match(e.pipeline)).length;
            return (
              <TabsTrigger key={f.id} value={f.id}>
                {f.label}
                <span className="text-[11px] font-semibold text-muted-foreground">
                  {count}
                </span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {FILTER_GROUPS.map((f) => {
          const sorted = [...EVENTS]
            .filter((e) => f.match(e.pipeline))
            .sort(
              (a, b) =>
                STAGE_ORDER.indexOf(a.pipeline) -
                STAGE_ORDER.indexOf(b.pipeline),
            );
          return (
            <TabsContent key={f.id} value={f.id}>
              <EventGrid
                events={sorted}
                onSelect={(id) => router.push(`/events/${id}`)}
              />
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}

function EventGrid({
  events,
  onSelect,
}: {
  events: Event[];
  onSelect: (id: string) => void;
}) {
  if (events.length === 0) {
    return (
      <Card className="items-center bg-muted/40 p-12 text-center">
        <p className="m-0 text-[13px] text-muted-foreground">
          No events in this stage right now.
        </p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {events.map((e) => (
        <EventCard key={e.id} event={e} onSelect={onSelect} />
      ))}
    </div>
  );
}

function EventCard({
  event: e,
  onSelect,
}: {
  event: Event;
  onSelect: (id: string) => void;
}) {
  const stage = pipelineConfig(e.pipeline);
  const isAtRisk = e.pipeline === "at-risk";
  const isWrapped = e.pipeline === "completed" || e.pipeline === "reported";

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={() => onSelect(e.id)}
      onKeyDown={(ev) => {
        if (ev.key === "Enter" || ev.key === " ") {
          ev.preventDefault();
          onSelect(e.id);
        }
      }}
      className={cn(
        "cursor-pointer p-6 transition-shadow hover:ring-foreground/15",
        isAtRisk && "border-l-4 border-l-rose-500",
      )}
    >
      <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2">
        <Pill tone={stage.tone}>{stage.label}</Pill>
        {e.date ? (
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {fmtDate(e.date)}
          </span>
        ) : (
          <span className="text-[11px] italic text-muted-foreground">
            Date pending
          </span>
        )}
      </div>

      <h2 className="m-0 mb-1 font-heading text-[22px] font-normal leading-tight text-foreground">
        {e.title}
      </h2>
      <div className="mb-4 text-xs text-foreground/70">
        {e.partner ?? (
          <span className="italic text-muted-foreground">
            Partner not yet selected
          </span>
        )}
      </div>

      {e.pipeline === "recruiting" && (
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
      )}

      {e.pipeline === "at-risk" && (
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Pill tone="rose">
              {e.registered}/{e.capacity} signed up
            </Pill>
            {e.vto && <Pill tone="terracotta">VTO</Pill>}
          </div>
          {e.diagnosis && e.diagnosis.length > 0 && (
            <div className="border-l-2 border-rose-500 pl-3">
              <div className="mb-1 text-[11px] font-semibold text-foreground/70">
                {e.diagnosis.length} candidate causes:
              </div>
              <div className="text-xs leading-relaxed text-foreground/70">
                {e.diagnosis.map((d) => d.cause).join(" · ")}
              </div>
            </div>
          )}
        </div>
      )}

      {e.pipeline === "confirmed" && e.confirmedNote && (
        <div className="border-l-2 border-primary pl-3 text-xs leading-relaxed text-foreground/70">
          {e.confirmedNote}
        </div>
      )}

      {e.pipeline === "proposed" && e.awaitingApproval && (
        <div className="border-l-2 border-amber-500 pl-3 text-xs leading-relaxed text-foreground/70">
          Awaiting{" "}
          <strong className="text-foreground">{e.awaitingApproval}</strong>
        </div>
      )}

      {e.pipeline === "vetting" && e.awaitingPartner && (
        <div className="border-l-2 border-amber-500 pl-3 text-xs leading-relaxed text-foreground/70">
          Awaiting partner: {e.awaitingPartner}
        </div>
      )}

      {e.pipeline === "sourcing" && e.sourceNote && (
        <div className="text-xs italic leading-relaxed text-foreground/70">
          {e.sourceNote}
        </div>
      )}

      {isWrapped && (
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="text-muted-foreground">
            {e.attended}/{e.registered} attended · {e.hours}h
          </span>
          {e.pipeline === "completed" && (
            <Pill tone="sage" icon={Sparkles}>
              Recap ready
            </Pill>
          )}
        </div>
      )}
    </Card>
  );
}

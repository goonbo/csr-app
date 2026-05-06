"use client";

/**
 * /events/[id] — event detail.
 *
 * Renders different blocks based on the event's pipeline stage:
 *   - at-risk → AtRiskDiagnosis card with confidence-tagged causes
 *     and the options-on-the-table tray
 *   - recruiting / at-risk → Day-of command center with live
 *     attendance variance, supply check, captains, incident log
 *   - sourcing / vetting / proposed / confirmed → StageNote
 *   - completed → AttendeesList + ReconciliationQueue + outputs
 *
 * Right rail always carries Event details + Partner link.
 */

import { use } from "react";
import { useRouter, notFound } from "next/navigation";
import {
  Sparkles, Edit3, Send, AlertCircle, CheckCircle2,
  ChevronRight, Users, Check,
} from "lucide-react";
import { fmtDate } from "@/lib/format";
import { EVENTS } from "@/lib/seed/events";
import { EMPLOYEES } from "@/lib/seed/employees";
import { pipelineConfig } from "@/lib/seed/pipeline";
import type {
  Event as EventType, Diagnosis, AtRiskOption,
  Reconciliation, Employee,
} from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pill } from "@/components/view/Pill";
import { PageHeader } from "@/components/view/PageHeader";
import { cn } from "@/lib/utils";

interface EventDetailPageProps {
  params: Promise<{ id: string }>;
}

interface AttendeeRow extends Employee {
  status: "attended" | "no_show" | "registered";
  hrs: number;
}

export default function EventDetailPage({ params }: EventDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const event = EVENTS.find((e) => e.id === id);
  if (!event) notFound();

  const isDone = event.status === "completed";
  const stage = pipelineConfig(event.pipeline);
  const showCommandCenter =
    event.pipeline === "recruiting" || event.pipeline === "at-risk";

  const attendees: AttendeeRow[] = EMPLOYEES.slice(0, 5).map((u, i) => ({
    ...u,
    status: isDone ? (i === 4 ? "no_show" : "attended") : "registered",
    hrs: isDone && i < 4 ? 3 : 0,
  }));

  const subtitleParts: string[] = [];
  if (event.date) subtitleParts.push(fmtDate(event.date));
  if (event.time) subtitleParts.push(event.time);
  if (event.location) subtitleParts.push(event.location);
  const subtitle = subtitleParts.length
    ? subtitleParts.join(" · ")
    : "Date and location pending";

  return (
    <div>
      <PageHeader
        back="All events"
        onBack={() => router.push("/events")}
        greeting={event.partner ?? "Partner pending"}
        title={event.title}
        subtitle={subtitle}
        action={
          isDone ? (
            <Button onClick={() => router.push(`/events/${event.id}/recap`)}>
              <Sparkles className="size-4" aria-hidden="true" />
              Generate exec recap
            </Button>
          ) : (
            <Button variant="outline">
              <Edit3 className="size-4" aria-hidden="true" />
              Edit event
            </Button>
          )
        }
      />

      {/* Pipeline stage row */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Stage
        </span>
        <Pill tone={stage.tone}>{stage.label}</Pill>
        {event.managerNudgeSent && (
          <Pill tone="neutral" icon={Send}>Manager nudge sent</Pill>
        )}
        {event.remoteFriendly && <Pill tone="neutral">Remote-friendly</Pill>}
        {event.vto && <Pill tone="terracotta">VTO eligible</Pill>}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
        {/* LEFT */}
        <div className="flex flex-col gap-4">
          {event.pipeline === "at-risk" && event.diagnosis && (
            <AtRiskDiagnosis
              diagnosis={event.diagnosis}
              options={event.options}
            />
          )}

          {showCommandCenter && <DayOfCommandCenter event={event} />}

          <StageNote event={event} />

          {(isDone || event.registered > 0) && (
            <AttendeesList
              attendees={attendees}
              event={event}
              isDone={isDone}
            />
          )}

          {isDone && event.reconciliation && (
            <ReconciliationQueue reconciliation={event.reconciliation} />
          )}

          {isDone && event.outputs && (
            <Card className="bg-muted/40 p-7">
              <h2 className="mb-3 text-sm font-semibold text-foreground">
                What we accomplished
              </h2>
              <p className="m-0 font-heading text-[17px] italic leading-relaxed text-muted-foreground">
                {event.outputs}
              </p>
            </Card>
          )}
        </div>

        {/* RIGHT */}
        <div className="flex flex-col gap-4">
          <EventDetailsCard event={event} isDone={isDone} stage={stage} />
          {event.partner && event.partnerId && (
            <PartnerLinkCard
              partner={event.partner}
              partnerId={event.partnerId}
              onClick={() => router.push(`/partners/${event.partnerId}`)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// AT-RISK DIAGNOSIS
// ============================================================

function AtRiskDiagnosis({
  diagnosis,
  options,
}: {
  diagnosis: Diagnosis[];
  options?: AtRiskOption[];
}) {
  return (
    <Card className="overflow-hidden border-t-4 border-t-rose-500 p-0">
      <div className="border-b border-border px-7 py-5">
        <div className="mb-1 text-[11px] font-bold uppercase tracking-wider text-rose-700">
          Why this might be at risk
        </div>
        <h2 className="text-[15px] font-semibold text-foreground">
          {diagnosis.length} candidate causes — your call which to act on
        </h2>
      </div>

      <div className="flex flex-col gap-3.5 px-7 py-5">
        {diagnosis.map((d, i) => (
          <div key={i} className="flex items-start gap-3">
            <span
              className={cn(
                "mt-0.5 shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                d.confidence === "high" &&
                  "border-rose-200 bg-rose-50 text-rose-900",
                d.confidence === "medium" &&
                  "border-amber-200 bg-amber-50 text-amber-900",
                d.confidence !== "high" && d.confidence !== "medium" &&
                  "border-border bg-muted text-muted-foreground",
              )}
            >
              {d.confidence}
            </span>
            <div className="min-w-0 flex-1">
              <div className="mb-1 text-[13px] font-semibold text-foreground">
                {d.cause}
              </div>
              <div className="text-xs leading-relaxed text-muted-foreground">
                {d.evidence}
              </div>
            </div>
          </div>
        ))}
      </div>

      {options && options.length > 0 && (
        <div className="border-t border-border bg-muted/40 px-7 py-5">
          <div className="mb-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Options on the table
          </div>
          <div className="flex flex-col gap-2.5">
            {options.map((opt, i) => {
              const tones = {
                sage:  { dot: "bg-emerald-500", label: "Cheapest move" },
                amber: { dot: "bg-amber-500",   label: "Worth weighing" },
                rose:  { dot: "bg-rose-500",    label: "Last resort" },
              } as const;
              const t = tones[opt.tone];
              return (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-md border border-border bg-card p-3"
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "mt-1.5 size-2 shrink-0 rounded-full",
                      t.dot,
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap justify-between gap-2">
                      <div className="text-[13px] font-semibold text-foreground">
                        {opt.label}
                      </div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {t.label}
                      </span>
                    </div>
                    <div className="text-xs leading-relaxed text-muted-foreground">
                      {opt.detail}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-[11px] italic leading-relaxed text-muted-foreground">
            AI surfaces the diagnosis. The decision is yours.
          </p>
        </div>
      )}
    </Card>
  );
}

// ============================================================
// DAY-OF COMMAND CENTER
// ============================================================

function DayOfCommandCenter({ event }: { event: EventType }) {
  const checkedIn = Math.floor(event.registered * 0.62);
  return (
    <Card className="overflow-hidden border-t-4 border-t-orange-500 p-0">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-7 py-5">
        <div>
          <div className="mb-1 text-[11px] font-bold uppercase tracking-wider text-orange-600">
            Day-of command center
          </div>
          <h2 className="text-[15px] font-semibold text-foreground">
            Live operations
          </h2>
        </div>
        <span className="text-[11px] italic text-muted-foreground">
          Updates every 30 sec
        </span>
      </div>

      {/* Live attendance variance */}
      <div className="grid grid-cols-3 gap-4 border-b border-border px-7 py-5">
        {[
          { label: "Registered",  value: String(event.registered), sub: "Confirmed signups",     tone: "ink" as const },
          { label: "Checked in",  value: String(checkedIn),         sub: "62% of expected",       tone: "sage" as const },
          { label: "Variance",    value: "−4",                       sub: "Slightly below pace",   tone: "amber" as const },
        ].map((m) => (
          <div key={m.label}>
            <div className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              {m.label}
            </div>
            <div
              className={cn(
                "mb-1 font-heading text-3xl leading-none",
                m.tone === "sage" && "text-emerald-700",
                m.tone === "amber" && "text-amber-800",
                m.tone === "ink" && "text-foreground",
              )}
            >
              {m.value}
            </div>
            <div className="text-[11px] text-muted-foreground">{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Two-column live ops */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="border-b border-border px-6 py-5 md:border-b-0 md:border-r md:pl-7">
          <div className="mb-3 flex items-center gap-1.5">
            <CheckCircle2
              className="size-3.5 text-emerald-600"
              aria-hidden="true"
            />
            <span className="text-xs font-semibold text-foreground">
              Guest list synced
            </span>
          </div>
          <div className="mb-3 text-[11px] leading-relaxed text-muted-foreground">
            Latest version sent to building security 6 minutes ago. 47 names
            match the live signup sheet.
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Resend if list changed <ChevronRight className="size-3" aria-hidden="true" />
          </button>
        </div>

        <div className="px-6 py-5 md:pr-7">
          <div className="mb-3 flex items-center gap-1.5">
            <AlertCircle
              className="size-3.5 text-amber-600"
              aria-hidden="true"
            />
            <span className="text-xs font-semibold text-foreground">
              Supply check
            </span>
          </div>
          <div className="flex flex-col gap-1.5 text-[11px] text-muted-foreground">
            <div className="flex justify-between">
              <span>Boxes</span>
              <span className="font-semibold text-emerald-700">✓ On site</span>
            </div>
            <div className="flex justify-between">
              <span>Aprons</span>
              <span className="font-semibold text-emerald-700">✓ On site</span>
            </div>
            <div className="flex justify-between">
              <span>Backup task plan</span>
              <span className="font-semibold text-amber-700">Drafted</span>
            </div>
          </div>
        </div>
      </div>

      {/* Captain assignments */}
      <div className="border-t border-border px-7 py-5">
        <div className="mb-3 flex items-center gap-1.5">
          <Users
            className="size-3.5 text-muted-foreground"
            aria-hidden="true"
          />
          <span className="text-xs font-semibold text-foreground">
            Team captains
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {[
            { name: "Marcus L.", role: "Check-in" },
            { name: "Priya R.",  role: "Stations" },
            { name: "Jenna P.",  role: "Photos" },
          ].map((c) => (
            <div
              key={c.name}
              className="rounded-full border border-border bg-muted px-2.5 py-1.5 text-[11px] text-muted-foreground"
            >
              <span className="font-semibold text-foreground">{c.name}</span>
              <span> · {c.role}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Incident log */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-muted/40 px-7 py-3.5 text-[11px] text-muted-foreground">
        <span>Incident log: 0 issues reported</span>
        <span className="italic">Tap to log a moment</span>
      </div>
    </Card>
  );
}

// ============================================================
// STAGE NOTE
// ============================================================

function StageNote({ event }: { event: EventType }) {
  const config = (() => {
    switch (event.pipeline) {
      case "sourcing":
        return {
          eyebrow: "Sourcing brief",
          note: event.sourceNote,
          border: "border-t-border-strong",
          eyebrowText: "text-muted-foreground",
        };
      case "vetting":
        return {
          eyebrow: "Awaiting partner",
          note: event.awaitingPartner,
          border: "border-t-amber-500",
          eyebrowText: "text-amber-700",
        };
      case "proposed":
        return {
          eyebrow: "Awaiting approval",
          note: event.awaitingApproval,
          border: "border-t-amber-500",
          eyebrowText: "text-amber-700",
        };
      case "confirmed":
        return {
          eyebrow: "Comms plan",
          note: event.confirmedNote,
          border: "border-t-emerald-700",
          eyebrowText: "text-emerald-800",
        };
      default:
        return null;
    }
  })();

  if (!config || !config.note) return null;

  return (
    <Card className={cn("overflow-hidden border-t-4 p-0", config.border)}>
      <div className="px-7 py-5">
        <div
          className={cn(
            "mb-2 text-[11px] font-bold uppercase tracking-wider",
            config.eyebrowText,
          )}
        >
          {config.eyebrow}
        </div>
        <p className="m-0 font-heading text-[17px] italic leading-relaxed text-muted-foreground">
          {config.note}
        </p>
      </div>
    </Card>
  );
}

// ============================================================
// ATTENDEES LIST
// ============================================================

function AttendeesList({
  attendees,
  event,
  isDone,
}: {
  attendees: AttendeeRow[];
  event: EventType;
  isDone: boolean;
}) {
  const remainingCount =
    isDone && event.attended && event.attended > 5
      ? event.attended - 5
      : event.registered > 5
        ? event.registered - 5
        : 0;

  return (
    <Card className="p-7">
      <h2 className="mb-5 text-sm font-semibold text-foreground">
        {isDone ? "Who showed up · hours logged" : "Who's signed up"}
      </h2>
      <div className="flex flex-col gap-1">
        {attendees.map((a) => (
          <div
            key={a.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl px-3 py-3"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div
                aria-hidden="true"
                className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-300 text-[11px] font-semibold text-white"
              >
                {a.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <div className="text-[13px] font-medium text-foreground">
                  {a.name}
                </div>
                <div className="text-[11px] text-muted-foreground">
                  {a.dept}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {a.status === "attended" && (
                <>
                  <Pill tone="sage" icon={Check}>Attended</Pill>
                  <span className="w-12 text-right text-xs text-muted-foreground">
                    {a.hrs}h
                  </span>
                </>
              )}
              {a.status === "no_show" && <Pill tone="rose">Missed</Pill>}
              {a.status === "registered" && <Pill tone="sage">Confirmed</Pill>}
            </div>
          </div>
        ))}
        {remainingCount > 0 && (
          <div className="pt-3 text-center text-xs text-muted-foreground">
            + {remainingCount} more
          </div>
        )}
      </div>
    </Card>
  );
}

// ============================================================
// RECONCILIATION QUEUE
// ============================================================

function ReconciliationQueue({
  reconciliation,
}: {
  reconciliation: Reconciliation;
}) {
  const itemCount =
    (reconciliation.checkInGap?.length ?? 0) +
    (reconciliation.retroactiveHours?.length ?? 0) +
    (reconciliation.photoConsent?.length ?? 0);

  return (
    <Card className="overflow-hidden border-t-4 border-t-orange-500 p-0">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-7 py-5">
        <div>
          <div className="mb-1 text-[11px] font-bold uppercase tracking-wider text-orange-600">
            Review queue
          </div>
          <h2 className="text-[15px] font-semibold text-foreground">
            Reconcile before the recap
          </h2>
        </div>
        <span className="text-[11px] italic text-muted-foreground">
          {itemCount} items
        </span>
      </div>

      {reconciliation.checkInGap && reconciliation.checkInGap.length > 0 && (
        <div className="border-b border-border px-7 py-4">
          <div className="mb-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Signed up but no check-in scan ({reconciliation.checkInGap.length})
          </div>
          <div className="flex flex-col gap-2">
            {reconciliation.checkInGap.map((item, i) => (
              <div
                key={i}
                className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border bg-muted/40 px-3 py-2"
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <div
                    aria-hidden="true"
                    className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-slate-500 to-slate-400 text-[10px] font-semibold text-white"
                  >
                    {item.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <div className="text-[13px] font-medium text-foreground">
                      {item.name}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      {item.dept}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    className="rounded-full border border-emerald-500 bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-900 hover:bg-emerald-100"
                  >
                    Mark attended
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-rose-500 bg-rose-50 px-3 py-1 text-[11px] font-semibold text-rose-900 hover:bg-rose-100"
                  >
                    No-show
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {reconciliation.retroactiveHours &&
        reconciliation.retroactiveHours.length > 0 && (
          <div className="border-b border-border px-7 py-4">
            <div className="mb-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Retroactive hours requested ({reconciliation.retroactiveHours.length})
            </div>
            <div className="flex flex-col gap-2.5">
              {reconciliation.retroactiveHours.map((item, i) => (
                <div
                  key={i}
                  className="rounded-md border border-border bg-card p-3"
                >
                  <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-baseline gap-2">
                      <span className="text-[13px] font-semibold text-foreground">
                        {item.name}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {item.dept}
                      </span>
                      <span className="ml-1 font-heading text-lg text-foreground">
                        {item.requested}
                      </span>
                    </div>
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        className="rounded-full border border-emerald-500 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-900 hover:bg-emerald-100"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        className="rounded-full border border-border bg-muted px-2.5 py-1 text-[11px] font-semibold text-muted-foreground hover:bg-accent"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                  <div className="text-xs leading-relaxed text-muted-foreground">
                    {item.note}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      {reconciliation.photoConsent && reconciliation.photoConsent.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-2 bg-muted/40 px-7 py-4 text-xs text-muted-foreground">
          <span>{reconciliation.photoConsent[0].note}</span>
          <button
            type="button"
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Send consent reminder <ChevronRight className="size-3" aria-hidden="true" />
          </button>
        </div>
      )}
    </Card>
  );
}

// ============================================================
// EVENT DETAILS CARD
// ============================================================

function EventDetailsCard({
  event,
  isDone,
  stage,
}: {
  event: EventType;
  isDone: boolean;
  stage: ReturnType<typeof pipelineConfig>;
}) {
  return (
    <Card className="p-5">
      <h2 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
        Event details
      </h2>
      <div className="flex flex-col gap-2.5 text-[13px]">
        <Row label="Stage">
          <Pill tone={stage.tone}>{stage.label}</Pill>
        </Row>
        {event.capacity > 0 && (
          <Row label="Capacity">
            <span className="text-foreground">{event.capacity}</span>
          </Row>
        )}
        {(event.registered > 0 || isDone) && (
          <Row label={isDone ? "Attended" : "Registered"}>
            <span className="text-foreground">
              {event.attended ?? event.registered}
            </span>
          </Row>
        )}
        {isDone && (
          <Row label="Hours">
            <span className="text-foreground">{event.hours}</span>
          </Row>
        )}
        <Row label="VTO">
          <span className="text-foreground">{event.vto ? "Yes" : "No"}</span>
        </Row>
        {event.remoteFriendly && (
          <Row label="Remote">
            <span className="text-foreground">Friendly</span>
          </Row>
        )}
      </div>
    </Card>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-muted-foreground">{label}</span>
      {children}
    </div>
  );
}

function PartnerLinkCard({
  partner,
  partnerId,
  onClick,
}: {
  partner: string;
  partnerId: string;
  onClick: () => void;
}) {
  void partnerId;
  return (
    <Card className="p-5">
      <h2 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
        Partner
      </h2>
      <div className="mb-1 text-[13px] font-semibold text-foreground">
        {partner}
      </div>
      <button
        type="button"
        onClick={onClick}
        className="-ml-1 inline-flex items-center gap-1 rounded p-1 text-[11px] text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        View partner profile <ChevronRight className="size-3" aria-hidden="true" />
      </button>
    </Card>
  );
}

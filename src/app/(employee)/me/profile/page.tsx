"use client";

/**
 * /me/profile — "Your impact" employee profile (Operator).
 *
 * 2-column layout (lg+ → 2fr/1fr):
 *
 * LEFT (2fr) — historical:
 *   - Hours hero Card with a 64px tabular-nums display, copy line
 *     framing the contribution ("Across {N} events and {M} cause(s)
 *     — equivalent to a half-week …"), and an emerald gradient
 *     initials avatar.
 *   - "Where your time went" cause breakdown — bars colored by
 *     causeStyle.gradient with hours number on the right; widths
 *     normalized to the largest bucket.
 *   - "Your timeline" — vertical TimelineRow list with cause-color
 *     dots connected by a thin border line, eyebrow date, title,
 *     partner + outputs, and an emerald "Heart Nh logged" pill.
 *
 * RIGHT (1fr) — preferences:
 *   - "Causes you care about" — toggleable pill row (one per
 *     cause); active state is emerald-tinted with a check icon.
 *   - "How you like to volunteer" — large italic preferred-format
 *     line + survey hint.
 *   - AI consistency Card (cyan-tinted) recognizing the
 *     contribution percentile.
 */

import { useState } from "react";
import { Sparkles, Check, Heart } from "lucide-react";
import { fmtDate } from "@/lib/format";
import { causeStyle } from "@/lib/cause";
import { EVENTS } from "@/lib/seed/events";
import { EMPLOYEES, EMPLOYEE_SIGNALS } from "@/lib/seed/employees";
import type { Event, Cause } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/view/PageHeader";
import { cn } from "@/lib/utils";

const ME_ID = "u1";
const MY_ATTENDED_IDS = ["e3", "e4"];
const PER_EVENT_HOURS = 3;

const ALL_CAUSES: Cause[] = [
  "Food Security",
  "Environment",
  "Youth Education",
  "Animal Welfare",
  "Housing",
  "Mental Health",
];

export default function EmployeeProfilePage() {
  const me = EMPLOYEES.find((e) => e.id === ME_ID);
  if (!me) throw new Error("Missing employee seed for u1");

  const attended = EVENTS.filter((e) => MY_ATTENDED_IDS.includes(e.id));

  const causeHours = new Map<string, number>();
  for (const e of attended) {
    causeHours.set(e.cause, (causeHours.get(e.cause) || 0) + PER_EVENT_HOURS);
  }
  const summed = Array.from(causeHours.values()).reduce((s, n) => s + n, 0);
  if (summed < me.hours && causeHours.size > 0) {
    const first = Array.from(causeHours.keys())[0];
    causeHours.set(first, (causeHours.get(first) || 0) + (me.hours - summed));
  }

  const causeBreakdown = Array.from(causeHours.entries())
    .map(([cause, hours]) => ({ cause: cause as Cause, hours }))
    .sort((a, b) => b.hours - a.hours);

  const maxHours = Math.max(1, ...causeBreakdown.map((c) => c.hours));
  const initials = me.name
    .split(" ")
    .map((s) => s[0])
    .join("");

  const [topCauses, setTopCauses] = useState<Cause[]>(
    EMPLOYEE_SIGNALS.topCauses,
  );
  const toggleCause = (c: Cause) => {
    setTopCauses((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c],
    );
  };

  return (
    <div>
      <PageHeader
        greeting="Your impact"
        title={me.name}
        subtitle={`${me.dept} · CSR signal contributor`}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-4">
          <Card className="p-8">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Hours given · this year
                </div>
                <div className="font-heading text-[64px] leading-none tabular-nums text-foreground">
                  {me.hours}
                </div>
                <div className="mt-2 max-w-[420px] text-[13px] leading-relaxed text-foreground/70">
                  Across {attended.length} events and {causeBreakdown.length}{" "}
                  cause{causeBreakdown.length === 1 ? "" : "s"} — equivalent
                  to{" "}
                  <span className="italic text-primary">
                    a half-week of work given back to your community.
                  </span>
                </div>
              </div>
              <div
                aria-hidden="true"
                className="flex size-[88px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 font-heading text-[28px] font-semibold text-white"
              >
                {initials}
              </div>
            </div>
          </Card>

          {causeBreakdown.length > 0 && (
            <Card className="p-7">
              <h2 className="mb-4 text-sm font-semibold text-foreground">
                Where your time went
              </h2>
              <div className="flex flex-col gap-3.5">
                {causeBreakdown.map((b) => {
                  const cs = causeStyle(b.cause);
                  const widthPct = Math.round((b.hours / maxHours) * 100);
                  return (
                    <div key={b.cause}>
                      <div className="mb-1.5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 font-medium text-foreground">
                          <span
                            aria-hidden="true"
                            className="size-2.5 rounded-full"
                            style={{ backgroundImage: cs.gradient }}
                          />
                          {b.cause}
                        </div>
                        <span className="font-heading text-base tabular-nums text-foreground">
                          {b.hours}
                          <span className="ml-0.5 text-[11px] text-muted-foreground">
                            h
                          </span>
                        </span>
                      </div>
                      <div
                        aria-hidden="true"
                        className="h-1.5 overflow-hidden rounded-full bg-muted"
                      >
                        <div
                          className="h-full"
                          style={{
                            width: `${widthPct}%`,
                            backgroundImage: cs.gradient,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          <Card className="p-7">
            <h2 className="mb-4 text-sm font-semibold text-foreground">
              Your timeline
            </h2>
            <div className="flex flex-col">
              {attended.length === 0 ? (
                <p className="m-0 text-[13px] italic text-muted-foreground">
                  Your timeline starts with the first event you attend.
                </p>
              ) : (
                attended.map((e, i) => (
                  <TimelineRow
                    key={e.id}
                    event={e}
                    isLast={i === attended.length - 1}
                  />
                ))
              )}
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <Card className="p-6">
            <h2 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Causes you care about
            </h2>
            <p className="mb-3.5 text-xs leading-relaxed text-foreground/70">
              We use these to surface matches on your home and in
              opportunities.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {ALL_CAUSES.map((c) => {
                const active = topCauses.includes(c);
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggleCause(c)}
                    aria-pressed={active}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      active
                        ? "border-primary/30 bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:bg-muted",
                    )}
                  >
                    {active && (
                      <Check
                        className="size-2.5"
                        strokeWidth={3}
                        aria-hidden="true"
                      />
                    )}
                    {c}
                  </button>
                );
              })}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              How you like to volunteer
            </h2>
            <div className="text-[13px] leading-relaxed text-foreground">
              <span className="font-heading text-base italic">
                {EMPLOYEE_SIGNALS.preferredFormat}.
              </span>
              <div className="mt-2 text-xs text-muted-foreground">
                Adjust this in survey before your next quarterly check-in.
              </div>
            </div>
          </Card>

          <Card className="bg-view-source-muted/40 ring-view-source/30 p-4">
            <div className="flex items-start gap-2.5">
              <div
                aria-hidden="true"
                className="flex size-7 shrink-0 items-center justify-center rounded-full bg-view-source text-white"
              >
                <Sparkles className="size-3" strokeWidth={2.2} />
              </div>
              <div>
                <div className="mb-1 text-[13px] font-semibold text-foreground">
                  You&rsquo;re consistent.
                </div>
                <div className="text-xs leading-relaxed text-foreground/70">
                  18h across two quarters puts you in the top 18% of
                  contributors at CloudMotion. Sarah may ask you to
                  captain the next event.
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function TimelineRow({
  event,
  isLast,
}: {
  event: Event;
  isLast: boolean;
}) {
  const cs = causeStyle(event.cause);
  return (
    <div
      className={cn("relative flex gap-3.5", !isLast && "pb-5")}
    >
      <div className="flex w-3 shrink-0 flex-col items-center">
        <span
          aria-hidden="true"
          className="mt-1 size-3 rounded-full"
          style={{ backgroundImage: cs.gradient }}
        />
        {!isLast && (
          <span
            aria-hidden="true"
            className="mt-1 w-px flex-1 bg-border"
          />
        )}
      </div>

      <div className="min-w-0 flex-1 pb-1">
        <div className="mb-0.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {event.date ? fmtDate(event.date) : "Date pending"}
        </div>
        <div className="mb-1 text-sm font-medium text-foreground">
          {event.title}
        </div>
        <div className="text-xs leading-relaxed text-foreground/70">
          {event.partner ?? "Independent"}
          {event.outputs && (
            <>
              {" · "}
              <span className="italic">{event.outputs}</span>
            </>
          )}
        </div>
        <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
          <Heart className="size-2.5" strokeWidth={2.4} aria-hidden="true" />
          {PER_EVENT_HOURS}h logged
        </div>
      </div>
    </div>
  );
}

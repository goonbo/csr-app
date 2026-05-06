"use client";

/**
 * /me — employee home (Operator theme).
 *
 * Two-column layout (lg+):
 *
 * LEFT (2fr) — what's next:
 *   - Section heading + "Browse opportunities →" link
 *   - Stack of UpcomingCards (events Sarah is signed up for) with
 *     a 56px cause-gradient date block (mon · day stacked)
 *   - Dashed CTA Card with calendar icon — discoverability
 *     bridge into /me/opportunities
 *
 * RIGHT (1fr) — VTO + AI nudge:
 *   - "Your year so far" Card with a 140×140 SVG VTO ring (sage
 *     stroke on oat track), centered text shows hours used / pool;
 *     below the ring, a copy line + 3 stats (Events, Causes, Hours
 *     left)
 *   - AI nudge Card (cyan-tinted) with a sparkle dot and
 *     context-aware suggestion
 *
 * Below — recent attendance: a "Recent" heading + stack of full-
 * width row buttons. Each row: 10px cause dot, title + partner +
 * date, hours, chevron.
 */

import { useRouter } from "next/navigation";
import { Sparkles, Calendar, ChevronRight } from "lucide-react";
import { fmtDate } from "@/lib/format";
import { causeStyle } from "@/lib/cause";
import { EVENTS } from "@/lib/seed/events";
import { EMPLOYEES } from "@/lib/seed/employees";
import type { Event } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Pill } from "@/components/view/Pill";
import { PageHeader } from "@/components/view/PageHeader";
import { cn } from "@/lib/utils";

const ME_ID = "u1"; // Sarah Chen — the logged-in employee
const VTO_POOL = 24; // 3 days/year — typical mid-market benefit
const COMPANY_AVG = 12;

const MY_UPCOMING_IDS = ["e1", "e2"];
const MY_ATTENDED_IDS = ["e3", "e4"];

export default function EmployeeHomePage() {
  const router = useRouter();
  const me = EMPLOYEES.find((e) => e.id === ME_ID);
  if (!me) throw new Error("Missing employee seed for u1");

  const upcoming = EVENTS.filter((e) => MY_UPCOMING_IDS.includes(e.id));
  const attended = EVENTS.filter((e) => MY_ATTENDED_IDS.includes(e.id));
  const discoverable = EVENTS.filter(
    (e) =>
      e.pipeline === "recruiting" ||
      e.pipeline === "at-risk" ||
      e.pipeline === "confirmed",
  ).filter((e) => !MY_UPCOMING_IDS.includes(e.id)).length;

  const hoursLogged = me.hours;
  const causesTouched = new Set(attended.map((e) => e.cause)).size;
  const eventsCount = attended.length;

  return (
    <div>
      <PageHeader
        greeting="Good morning, Sarah"
        title="Hours that matter."
        subtitle="Where you're headed, what's coming up, and the time you've already given."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="m-0 text-sm font-semibold text-foreground">
              What&rsquo;s next
            </h2>
            <button
              type="button"
              onClick={() => router.push("/me/opportunities")}
              className="rounded p-1 text-xs font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Browse opportunities →
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {upcoming.map((e) => (
              <UpcomingCard
                key={e.id}
                event={e}
                onClick={() => router.push(`/events/${e.id}`)}
              />
            ))}

            <button
              type="button"
              onClick={() => router.push("/me/opportunities")}
              className={cn(
                "flex items-center gap-4 rounded-xl border-2 border-dashed border-border bg-muted/40 p-5 text-left transition-colors hover:bg-muted/70",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              )}
            >
              <div
                aria-hidden="true"
                className="flex size-14 shrink-0 items-center justify-center rounded-2xl border-2 border-dashed border-border bg-background"
              >
                <Calendar
                  className="size-5 text-muted-foreground"
                  strokeWidth={1.6}
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-1 text-sm font-medium text-foreground">
                  Find your next one
                </div>
                <div className="text-xs leading-relaxed text-foreground/70">
                  {upcoming.length} signed up
                  {discoverable > 0
                    ? ` · ${discoverable} more open across the company`
                    : " · all caught up — Sarah has more on the way"}
                </div>
              </div>
              <ChevronRight
                className="size-4 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Card className="p-5">
            <h2 className="mb-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Your year so far
            </h2>
            <VTORing used={hoursLogged} pool={VTO_POOL} />

            <div className="mt-4 flex justify-between gap-3 border-t border-border pt-4">
              <Stat label="Events" value={String(eventsCount)} />
              <Stat label="Causes" value={String(causesTouched)} />
              <Stat
                label="Hours left"
                value={String(Math.max(0, VTO_POOL - hoursLogged))}
              />
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
                  Earth Week is in 3 days.
                </div>
                <div className="text-xs leading-relaxed text-foreground/70">
                  TreeFolks could use 28 more hands. Your team showed up for
                  the food drive — they&rsquo;d love to do this with you.
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {attended.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-4 text-sm font-semibold text-foreground">Recent</h2>
          <div className="flex flex-col gap-2">
            {attended.map((e) => (
              <RecentRow
                key={e.id}
                event={e}
                onClick={() => router.push(`/events/${e.id}`)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function UpcomingCard({
  event,
  onClick,
}: {
  event: Event;
  onClick: () => void;
}) {
  const cs = causeStyle(event.cause);
  const dateBits = event.date ? fmtDate(event.date, false).split(" ") : ["", ""];
  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className="cursor-pointer p-5 transition-shadow hover:ring-foreground/15"
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
          <div className="font-heading text-xl leading-none">{dateBits[1]}</div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 text-[15px] font-medium text-foreground">
            {event.title}
          </div>
          <div className="mb-2.5 text-xs text-muted-foreground">
            {event.partner} {event.time ? `· ${event.time}` : ""}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Pill tone="sage">You&rsquo;re in</Pill>
            {event.vto && <Pill tone="terracotta">VTO eligible</Pill>}
            {event.location && (
              <span className="text-[11px] text-muted-foreground">
                {event.location}
              </span>
            )}
          </div>
        </div>
        <ChevronRight
          className="size-4 shrink-0 self-center text-muted-foreground"
          aria-hidden="true"
        />
      </div>
    </Card>
  );
}

function VTORing({ used, pool }: { used: number; pool: number }) {
  const pct = Math.min(100, Math.round((used / pool) * 100));
  const r = 56;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - Math.min(1, used / pool));
  const overage = Math.max(0, used - COMPANY_AVG);

  return (
    <div className="flex items-center gap-4">
      <svg
        width={140}
        height={140}
        viewBox="0 0 140 140"
        aria-hidden="true"
        className="shrink-0"
      >
        <circle
          cx={70}
          cy={70}
          r={r}
          fill="none"
          className="stroke-muted"
          strokeWidth={10}
        />
        <circle
          cx={70}
          cy={70}
          r={r}
          fill="none"
          className="stroke-primary"
          strokeWidth={10}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 70 70)"
        />
        <text
          x={70}
          y={68}
          textAnchor="middle"
          className="fill-foreground font-heading"
          style={{ fontSize: 30 }}
        >
          {used}
        </text>
        <text
          x={70}
          y={88}
          textAnchor="middle"
          className="fill-muted-foreground font-semibold"
          style={{ fontSize: 11, letterSpacing: "0.06em" }}
        >
          OF {pool}H
        </text>
      </svg>
      <div className="flex-1">
        <div className="text-xs leading-relaxed text-foreground/80">
          You&rsquo;ve used <span className="font-semibold">{pct}%</span> of
          your VTO benefit.
          {overage > 0 && (
            <>
              {" "}
              That&rsquo;s{" "}
              <span className="font-semibold text-primary">
                +{overage}h above
              </span>{" "}
              the company average.
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex-1 text-center">
      <div className="mb-1 font-heading text-[22px] leading-none text-foreground">
        {value}
      </div>
      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

function RecentRow({
  event,
  onClick,
}: {
  event: Event;
  onClick: () => void;
}) {
  const cs = causeStyle(event.cause);
  const yourHours = 3;
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-4 rounded-xl border border-border bg-card px-4 py-3 text-left transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <div
        aria-hidden="true"
        className="size-2.5 shrink-0 rounded-full"
        style={{ backgroundImage: cs.gradient }}
      />
      <div className="min-w-0 flex-1">
        <div className="mb-0.5 text-[13px] font-medium text-foreground">
          {event.title}
        </div>
        <div className="text-[11px] text-muted-foreground">
          {event.partner} {event.date ? `· ${fmtDate(event.date, false)}` : ""}
        </div>
      </div>
      <div className="shrink-0 font-heading text-lg text-foreground">
        {yourHours}h
      </div>
      <ChevronRight
        className="size-3.5 shrink-0 text-muted-foreground"
        aria-hidden="true"
      />
    </button>
  );
}

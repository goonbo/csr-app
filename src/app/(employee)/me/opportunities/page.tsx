"use client";

/**
 * /me/opportunities — discover events to sign up for (Operator).
 *
 * Filter Tabs (rounded-full): All / Matches you / Open now /
 * Coming soon. Each label suffixed with a count.
 *
 * On the "All" filter, if there's a top match (open + matches the
 * employee's top causes), it renders as a wide FeaturedRow above
 * the rest — split layout with a cause-gradient hero pane on the
 * left ("Best match for you" eyebrow + Icon + cause label) and a
 * detailed pane on the right (title, partner, date+location,
 * capacity bar, chip row, sign-up CTA).
 *
 * Other rows render as compact OpportunityRow cards with an
 * 88×88 cause-gradient avatar (Icon + uppercase date) on the left,
 * cause eyebrow + match pill + at-risk pill, title, partner +
 * location + time, optional capacity bar, and a right-aligned
 * column with VTO/Remote pills and Sign-up button (or "Opens soon"
 * placeholder for future events).
 *
 * Empty state: muted Card. Footer: oat-tinted note about more
 * partners on the way.
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Check,
  MapPin,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { fmtDate } from "@/lib/format";
import { causeStyle } from "@/lib/cause";
import { EVENTS } from "@/lib/seed/events";
import { EMPLOYEE_SIGNALS } from "@/lib/seed/employees";
import type { Event, Cause } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/view/PageHeader";
import { Pill } from "@/components/view/Pill";
import { cn } from "@/lib/utils";

type FilterId = "all" | "matches" | "open" | "soon";

const ALREADY_SIGNED = new Set(["e1", "e2"]);

const FILTERS: { id: FilterId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "matches", label: "Matches you" },
  { id: "open", label: "Open now" },
  { id: "soon", label: "Coming soon" },
];

export default function OpportunitiesPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterId>("all");
  const [signedUp, setSignedUp] = useState<Set<string>>(
    new Set(ALREADY_SIGNED),
  );

  const pool = EVENTS.filter(
    (e) =>
      e.pipeline === "recruiting" ||
      e.pipeline === "at-risk" ||
      e.pipeline === "confirmed",
  );

  const isOpen = (e: Event) =>
    e.pipeline === "recruiting" || e.pipeline === "at-risk";
  const matchesYou = (e: Event) =>
    EMPLOYEE_SIGNALS.topCauses.includes(e.cause as Cause);

  const filtered = pool.filter((e) => {
    if (filter === "matches") return matchesYou(e);
    if (filter === "open") return isOpen(e);
    if (filter === "soon") return !isOpen(e);
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (isOpen(a) && !isOpen(b)) return -1;
    if (!isOpen(a) && isOpen(b)) return 1;
    if (a.date && b.date) return a.date.localeCompare(b.date);
    return 0;
  });

  const featured =
    filter === "all"
      ? (sorted.find((e) => isOpen(e) && matchesYou(e)) ?? null)
      : null;
  const rest = featured ? sorted.filter((e) => e.id !== featured.id) : sorted;

  const counts = {
    all: pool.length,
    matches: pool.filter(matchesYou).length,
    open: pool.filter(isOpen).length,
    soon: pool.filter((e) => !isOpen(e)).length,
  };

  const toggleSignup = (id: string) => {
    setSignedUp((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div>
      <PageHeader
        greeting="What's open"
        title="Find your next moment."
        subtitle="Causes you care about, partners we trust, and time off the company already promised."
      />

      <Tabs
        value={filter}
        onValueChange={(v) => setFilter(v as FilterId)}
        className="mb-6"
      >
        <TabsList className="rounded-full" aria-label="Filter opportunities">
          {FILTERS.map((f) => (
            <TabsTrigger
              key={f.id}
              value={f.id}
              className="rounded-full px-3"
            >
              {f.label}
              <span className="text-[11px] font-semibold text-muted-foreground">
                {counts[f.id]}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {featured && (
        <FeaturedRow
          event={featured}
          isSignedUp={signedUp.has(featured.id)}
          onToggleSignup={() => toggleSignup(featured.id)}
          onClick={() => router.push(`/events/${featured.id}`)}
        />
      )}

      {sorted.length === 0 && (
        <Card className="bg-muted/40 p-8">
          <div className="text-sm leading-relaxed text-foreground/70">
            Nothing here right now — try a different filter, or wait a few
            days. Sarah is sourcing new partners every week.
          </div>
        </Card>
      )}

      <div className="flex flex-col gap-3">
        {rest.map((e) => (
          <OpportunityRow
            key={e.id}
            event={e}
            isOpen={isOpen(e)}
            isMatch={matchesYou(e)}
            isSignedUp={signedUp.has(e.id)}
            onToggleSignup={() => toggleSignup(e.id)}
            onClick={() => router.push(`/events/${e.id}`)}
          />
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-border bg-muted/40 p-6 text-center">
        <div className="mb-1.5 font-heading text-lg italic text-foreground">
          More on the way.
        </div>
        <div className="text-xs text-muted-foreground">
          Sarah is in conversation with 3 new partners for Q3 — environmental
          and mental-health focus.
        </div>
      </div>
    </div>
  );
}

// ============================================================
// FeaturedRow — wide hero card, only on "All" with a top match
// ============================================================

interface FeaturedRowProps {
  event: Event;
  isSignedUp: boolean;
  onToggleSignup: () => void;
  onClick: () => void;
}

function FeaturedRow({
  event,
  isSignedUp,
  onToggleSignup,
  onClick,
}: FeaturedRowProps) {
  const cs = causeStyle(event.cause);
  const Icon = cs.icon;
  const fillPct = event.capacity
    ? Math.round((event.registered / event.capacity) * 100)
    : 0;

  return (
    <div className="mb-6 grid grid-cols-1 overflow-hidden rounded-xl border border-border bg-card shadow-sm md:grid-cols-[minmax(220px,280px)_1fr]">
      <button
        type="button"
        onClick={onClick}
        className="flex min-h-[200px] flex-col gap-3 p-7 text-left text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
        style={{ backgroundImage: cs.gradient }}
      >
        <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest opacity-95">
          <Sparkles className="size-3" strokeWidth={2.4} aria-hidden="true" />
          Best match for you
        </div>
        <Icon
          className="size-12 opacity-95"
          strokeWidth={1.6}
          aria-hidden="true"
        />
        <div className="mt-auto text-xs font-semibold uppercase tracking-wider opacity-95">
          {event.cause}
        </div>
      </button>

      <div className="flex flex-col gap-3.5 p-7">
        <div>
          <h3 className="m-0 font-heading text-2xl font-semibold tracking-tight text-foreground">
            {event.title}
          </h3>
          <div className="mt-1.5 text-[13px] text-muted-foreground">
            {event.partner ?? "Partner pending"}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-[13px] text-foreground/80">
          {event.date && (
            <div className="inline-flex items-center gap-1.5">
              <Calendar className="size-3.5" aria-hidden="true" />
              <span className="font-semibold">{fmtDate(event.date)}</span>
              {event.time && (
                <span className="text-muted-foreground">· {event.time}</span>
              )}
            </div>
          )}
          {event.location && (
            <div className="inline-flex items-center gap-1.5">
              <MapPin className="size-3.5" aria-hidden="true" />
              {event.location}
            </div>
          )}
        </div>

        {event.capacity > 0 && (
          <div>
            <div className="mb-1.5 flex items-center justify-between text-[11px] font-semibold text-muted-foreground">
              <span>
                {event.registered} signed up · {event.capacity} spots
              </span>
              <span>{fillPct}%</span>
            </div>
            <div
              aria-hidden="true"
              className="h-1 overflow-hidden rounded-full bg-muted"
            >
              <div
                className={cn(
                  "h-full",
                  event.pipeline === "at-risk" ? "bg-rose-500" : "bg-primary",
                )}
                style={{ width: `${Math.min(100, fillPct)}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-1.5">
          {event.vto && <Pill tone="terracotta">VTO eligible</Pill>}
          {event.pipeline === "at-risk" && <Pill tone="rose">Needs hands</Pill>}
          {event.remoteFriendly && (
            <Pill tone="neutral">Remote-friendly</Pill>
          )}
        </div>

        <div className="mt-auto flex items-center gap-3">
          <SignUpButton
            isSignedUp={isSignedUp}
            onClick={onToggleSignup}
            size="lg"
            signedUpLabel="You're in — tap to undo"
          />
          <button
            type="button"
            onClick={onClick}
            className="rounded p-2 text-[13px] font-medium text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            More details →
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// OpportunityRow — compact horizontal card
// ============================================================

interface OpportunityRowProps {
  event: Event;
  isOpen: boolean;
  isMatch: boolean;
  isSignedUp: boolean;
  onToggleSignup: () => void;
  onClick: () => void;
}

function OpportunityRow({
  event,
  isOpen,
  isMatch,
  isSignedUp,
  onToggleSignup,
  onClick,
}: OpportunityRowProps) {
  const cs = causeStyle(event.cause);
  const Icon = cs.icon;
  const fillPct = event.capacity
    ? Math.round((event.registered / event.capacity) * 100)
    : 0;

  return (
    <div className="grid grid-cols-[88px_1fr_auto] items-center gap-5 rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
      <button
        type="button"
        onClick={onClick}
        aria-label={`${event.cause}: ${event.title}`}
        className="flex size-[88px] shrink-0 flex-col items-center justify-center gap-1.5 rounded-md text-white shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        style={{ backgroundImage: cs.gradient }}
      >
        <Icon className="size-6" strokeWidth={1.8} aria-hidden="true" />
        {event.date && (
          <div className="text-[9.5px] font-bold uppercase tracking-wider opacity-95">
            {fmtDate(event.date, false).toUpperCase()}
          </div>
        )}
      </button>

      <div className="flex min-w-0 flex-col gap-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">
            {event.cause}
          </span>
          {isMatch && (
            <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-px text-[10px] font-bold uppercase tracking-wider text-primary">
              <Sparkles
                className="size-2.5"
                strokeWidth={2.6}
                aria-hidden="true"
              />
              Match
            </span>
          )}
          {event.pipeline === "at-risk" && <Pill tone="rose">Needs hands</Pill>}
          {event.pipeline === "confirmed" && !isOpen && (
            <Pill tone="amber">Opens soon</Pill>
          )}
        </div>
        <button
          type="button"
          onClick={onClick}
          className="m-0 p-0 text-left text-[17px] font-semibold tracking-tight text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {event.title}
        </button>
        <div className="text-[13px] leading-tight text-muted-foreground">
          {event.partner ?? "Partner pending"}
          {event.location && (
            <>
              {" "}
              ·{" "}
              <MapPin
                className="-mt-0.5 inline size-3"
                aria-hidden="true"
              />{" "}
              {event.location}
            </>
          )}
          {event.time && <> · {event.time}</>}
        </div>
        {event.capacity > 0 && isOpen && (
          <div className="mt-1 max-w-[320px]">
            <div className="mb-1 flex items-center justify-between text-[10.5px] font-semibold text-muted-foreground">
              <span>
                {event.registered} of {event.capacity} signed up
              </span>
              <span>{fillPct}%</span>
            </div>
            <div
              aria-hidden="true"
              className="h-[3px] overflow-hidden rounded-full bg-muted"
            >
              <div
                className={cn(
                  "h-full",
                  event.pipeline === "at-risk"
                    ? "bg-rose-500"
                    : "bg-primary",
                )}
                style={{ width: `${Math.min(100, fillPct)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex shrink-0 flex-col items-end gap-2">
        <div className="flex flex-wrap justify-end gap-1">
          {event.vto && <Pill tone="terracotta">VTO</Pill>}
          {event.remoteFriendly && <Pill tone="neutral">Remote</Pill>}
        </div>
        {isOpen ? (
          <SignUpButton
            isSignedUp={isSignedUp}
            onClick={onToggleSignup}
            size="md"
            signedUpLabel="Signed up"
          />
        ) : (
          <span className="inline-flex items-center whitespace-nowrap rounded-full border border-border bg-muted px-3.5 py-2 text-xs text-muted-foreground">
            Opens soon
          </span>
        )}
      </div>
    </div>
  );
}

function SignUpButton({
  isSignedUp,
  onClick,
  size,
  signedUpLabel,
}: {
  isSignedUp: boolean;
  onClick: () => void;
  size: "md" | "lg";
  signedUpLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        size === "lg" ? "px-5 py-2.5 text-sm" : "px-4 py-2 text-[13px]",
        isSignedUp
          ? "border border-primary/30 bg-primary/10 text-primary hover:bg-primary/15"
          : "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
      )}
    >
      {isSignedUp ? (
        <>
          <Check className="size-3.5" strokeWidth={2.6} />
          {signedUpLabel}
        </>
      ) : (
        <>
          Sign up
          <ArrowRight className="size-3" strokeWidth={2.4} />
        </>
      )}
    </button>
  );
}

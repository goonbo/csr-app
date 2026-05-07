"use client";

/**
 * /partners/[id] — partner detail with AI diligence flow.
 *
 * Three states:
 *   1. Pre-diligence — empty state Card invites the operator to run
 *      the synthetic AI diligence.
 *   2. ai.active — LoadingSteps inside an AI-tinted Card while the
 *      mocked steps cycle (3000ms total).
 *   3. Post-diligence — MutualFitPanel + DiligenceOverview render
 *      side-by-side with the contact + status sidebar.
 */

import { use, useState } from "react";
import { useRouter, notFound } from "next/navigation";
import {
  Sparkles, AlertCircle, ChevronDown, Calendar,
} from "lucide-react";
import { fmtDate } from "@/lib/format";
import { useAILoad } from "@/lib/useAILoad";
import { PARTNERS } from "@/lib/seed/partners";
import type { Diligence } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pill } from "@/components/view/Pill";
import { PageHeader } from "@/components/view/PageHeader";
import { ReadinessTag } from "@/components/view/ReadinessTag";
import { LoadingSteps } from "@/components/view/LoadingSteps";
import { cn } from "@/lib/utils";

const DILIGENCE_STEPS = [
  "Pulling IRS Tax-Exempt data…",
  "Reviewing public Form 990 filings…",
  "Cross-referencing Candid signals…",
  "Assessing operational readiness…",
];

interface PartnerDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function PartnerDetailPage({ params }: PartnerDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const partner = PARTNERS.find((p) => p.id === id);
  if (!partner) notFound();

  const [diligence, setDiligence] = useState<Diligence | null>(
    partner.hasD && partner.diligence ? partner.diligence : null,
  );
  const ai = useAILoad(DILIGENCE_STEPS, 3000);

  const runDiligence = () => {
    // Demo magic: every partner resolves to the food bank's diligence
    // (the seed's deliberate fake-but-considered fallback).
    ai.start(() => setDiligence(PARTNERS[0].diligence ?? null));
  };

  const showRunButtonInHeader = !partner.hasD && !diligence && !ai.active;

  return (
    <div>
      <PageHeader
        back="All partners"
        onBack={() => router.push("/partners")}
        greeting={partner.cause}
        title={partner.name}
        subtitle={partner.geo}
        action={
          showRunButtonInHeader ? (
            <Button onClick={runDiligence}>
              <Sparkles className="size-4" aria-hidden="true" />
              Run AI diligence
            </Button>
          ) : undefined
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
        {/* LEFT */}
        <div className="flex flex-col gap-4">
          {diligence && !ai.active && (
            <MutualFitPanel
              minGroup={partner.minGroup ?? 30}
              maxGroup={partner.maxGroup ?? 60}
            />
          )}

          {ai.active && (
            <Card className="bg-view-source-muted/40 ring-view-source/30 p-6">
              <div className="mb-4 flex items-center gap-2">
                <div
                  aria-hidden="true"
                  className="flex size-7 items-center justify-center rounded-full bg-view-source text-white"
                >
                  <Sparkles className="size-3" />
                </div>
                <span className="text-[13px] font-semibold text-view-source-foreground">
                  Reading the room…
                </span>
              </div>
              <LoadingSteps steps={DILIGENCE_STEPS} idx={ai.stepIdx} />
            </Card>
          )}

          {diligence && !ai.active && <DiligenceOverview diligence={diligence} />}

          {!diligence && !ai.active && (
            <Card className="items-center bg-muted/40 p-12 text-center">
              <div
                aria-hidden="true"
                className="mx-auto flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-view-source-muted to-view-source/40"
              >
                <Sparkles
                  className="size-5 text-view-source-foreground"
                  strokeWidth={2.2}
                />
              </div>
              <h2 className="mt-4 text-base font-semibold text-foreground">
                Let&rsquo;s get to know them
              </h2>
              <p className="mx-auto mt-2 max-w-[360px] text-[13px] leading-relaxed text-muted-foreground">
                Run AI diligence to generate a mission summary, readiness score,
                and format recommendation in about fifteen seconds.
              </p>
              <div className="mt-5">
                <Button onClick={runDiligence}>
                  <Sparkles className="size-4" aria-hidden="true" />
                  Run AI diligence
                </Button>
              </div>
            </Card>
          )}

          <PracticalBits
            minGroup={partner.minGroup ?? 10}
            maxGroup={partner.maxGroup ?? 80}
            leadDays={partner.leadDays ?? 21}
          />
        </div>

        {/* RIGHT */}
        <div className="flex flex-col gap-4">
          <ContactCard
            contact={partner.contact ?? "Maria Velasquez"}
            email={partner.email ?? "mvelasquez@austinfoodbank.org"}
            phone={partner.phone ?? "(512) 555-0142"}
          />
          <StatusCard
            health={partner.health}
            lastEvent={partner.lastEvent}
            champion={partner.champion}
          />
          <Button
            className="w-full"
            onClick={() => router.push("/events/new")}
          >
            <Calendar className="size-4" aria-hidden="true" />
            Plan an event with them
          </Button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Sub-components
// ============================================================

function MutualFitPanel({ minGroup, maxGroup }: { minGroup: number; maxGroup: number }) {
  const fits = [
    {
      label: "Cohort fit",
      score: "Strong",
      tone: "sage" as const,
      body: "Food security ranks #1 in your employee survey themes. 68% of respondents flagged hunger relief as a personally meaningful cause.",
    },
    {
      label: "Capacity fit",
      score: "Strong",
      tone: "sage" as const,
      body: "Their 10–80 volunteer range absorbs your typical 35–50 turnouts cleanly. They host 200+ corporate groups annually.",
    },
    {
      label: "Schedule fit",
      score: "Watch",
      tone: "amber" as const,
      body: "Their warehouse runs hot in November–December. April–October bookings are most reliable.",
    },
  ];

  return (
    <Card className="border-t-4 border-t-primary p-7">
      <header className="mb-1.5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-foreground">
          Fit for your team
        </h2>
        <span className="text-[11px] italic text-muted-foreground">
          Based on Q1 employee survey + capacity history
        </span>
      </header>
      <p className="mb-5 text-[13px] leading-relaxed text-muted-foreground">
        Why this partner makes sense for a {minGroup}–{maxGroup} person event in
        the next quarter.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {fits.map((f) => (
          <div
            key={f.label}
            className={cn(
              "rounded-xl border p-4",
              f.tone === "sage"
                ? "border-primary/30 bg-primary/10 text-primary"
                : "border-amber-200 bg-amber-50 text-amber-900",
            )}
          >
            <div className="mb-1.5 text-[10px] font-bold uppercase tracking-wider">
              {f.label}
            </div>
            <div className="mb-2 font-heading text-[22px] leading-none">
              {f.score}
            </div>
            <p className="text-xs leading-relaxed">{f.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2.5 border-t border-border pt-5">
        <Sparkles className="size-3 text-primary" aria-hidden="true" />
        <span className="text-xs leading-relaxed text-muted-foreground">
          Suggested next step:{" "}
          <strong className="font-semibold text-foreground">
            plan a 50-person Q2 event
          </strong>
          . The food bank&rsquo;s spring window is open and your team&rsquo;s
          interest is highest right now.
        </span>
      </div>
    </Card>
  );
}

function DiligenceOverview({ diligence }: { diligence: Diligence }) {
  return (
    <Card className="p-7">
      <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div
            aria-hidden="true"
            className="flex size-6 items-center justify-center rounded-full bg-view-source text-white"
          >
            <Sparkles className="size-2.5" />
          </div>
          <span className="text-[13px] font-semibold text-foreground">
            Partner overview
          </span>
        </div>
        <span className="text-[11px] text-muted-foreground">
          Generated just now
        </span>
      </header>

      <div
        role="note"
        className="mb-6 flex gap-2.5 rounded-xl border border-view-source/40 bg-view-source-muted/60 p-3.5"
      >
        <AlertCircle
          aria-hidden="true"
          className="mt-0.5 size-3.5 shrink-0 text-view-source-foreground"
          strokeWidth={2.2}
        />
        <p className="text-xs leading-relaxed text-view-source-foreground">
          AI-generated overview synthesized from public filings. Always verify
          with IRS TEOS, Candid, and Charity Navigator before partnership
          decisions.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <Section heading="Mission">
          <p className="text-sm leading-relaxed text-muted-foreground">
            {diligence.mission}
          </p>
        </Section>

        <div className="grid grid-cols-1 gap-6 py-1 md:grid-cols-2">
          <div>
            <SectionHeading>Readiness</SectionHeading>
            <ReadinessTag tag={diligence.readinessTag} size="lg" />
            <p className="mt-2 text-[11px] italic leading-relaxed text-muted-foreground">
              Qualitative — public diligence cannot fully verify operational
              fit. Confirm with a partner call.
            </p>
          </div>
          <div>
            <SectionHeading>Recommended format</SectionHeading>
            <Pill tone="sage" icon={Sparkles}>
              {diligence.recommendedFormat?.choice ?? "Direct service event"}
            </Pill>
            <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground">
              {diligence.recommendedFormat?.reason}
            </p>
          </div>
        </div>

        <Section heading="Financial health">
          <p className="text-sm leading-relaxed text-muted-foreground">
            {diligence.financial}
          </p>
        </Section>

        <details open>
          <summary className="inline-flex cursor-pointer items-center gap-1.5 list-none text-[11px] font-bold uppercase tracking-wider text-muted-foreground [&::-webkit-details-marker]:hidden">
            <ChevronDown className="size-3" aria-hidden="true" />
            Why this readiness
          </summary>
          <p className="mt-3 border-l-2 border-primary pl-4 text-sm leading-relaxed text-muted-foreground">
            {diligence.readinessReason}
          </p>
        </details>

        {diligence.alternativesConsidered &&
          diligence.alternativesConsidered.length > 0 && (
            <div>
              <SectionHeading className="mb-3">
                Other formats considered
              </SectionHeading>
              <p className="mb-3.5 text-xs italic leading-relaxed text-muted-foreground">
                Not every partnership is a volunteer event. Here&rsquo;s what
                else we weighed.
              </p>
              <div className="flex flex-col gap-3">
                {diligence.alternativesConsidered.map((alt, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-border bg-card p-3.5"
                  >
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
                      <div className="text-[13px] font-semibold text-foreground">
                        {alt.format}
                      </div>
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
                          alt.fit === "Possible" &&
                            "border-primary/30 bg-primary/10 text-primary",
                          alt.fit === "Worth considering" &&
                            "border-amber-200 bg-amber-50 text-amber-900",
                          alt.fit !== "Possible" &&
                            alt.fit !== "Worth considering" &&
                            "border-border bg-muted text-muted-foreground",
                        )}
                      >
                        {alt.fit}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {alt.reason}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
      </div>
    </Card>
  );
}

function Section({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <SectionHeading>{heading}</SectionHeading>
      {children}
    </div>
  );
}

function SectionHeading({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground",
        className,
      )}
    >
      {children}
    </div>
  );
}

function PracticalBits({
  minGroup,
  maxGroup,
  leadDays,
}: {
  minGroup: number;
  maxGroup: number;
  leadDays: number;
}) {
  return (
    <Card className="p-7">
      <h2 className="mb-5 text-sm font-semibold text-foreground">
        The practical bits
      </h2>
      <dl className="m-0 grid grid-cols-1 gap-x-8 gap-y-5 text-[13px] sm:grid-cols-2">
        <div>
          <DLabel>Group size</DLabel>
          <dd className="m-0 text-foreground">
            {minGroup}–{maxGroup} volunteers
          </dd>
        </div>
        <div>
          <DLabel>Lead time</DLabel>
          <dd className="m-0 text-foreground">{leadDays} days</dd>
        </div>
        <div>
          <DLabel>Background checks</DLabel>
          <dd className="m-0 text-foreground">Not required</dd>
        </div>
        <div>
          <DLabel>What to wear</DLabel>
          <dd className="m-0 text-foreground">Closed-toe shoes</dd>
        </div>
        <div className="sm:col-span-2">
          <DLabel>Accessibility</DLabel>
          <dd className="m-0 text-foreground">
            Warehouse floor accessible. Seated stations available on request.
          </dd>
        </div>
      </dl>
    </Card>
  );
}

function DLabel({ children }: { children: React.ReactNode }) {
  return (
    <dt className="mb-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
      {children}
    </dt>
  );
}

function ContactCard({
  contact,
  email,
  phone,
}: {
  contact: string;
  email: string;
  phone: string;
}) {
  const initials = contact
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2);
  return (
    <Card className="p-5">
      <h2 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
        Primary contact
      </h2>
      <div className="mb-1 flex items-center gap-3">
        <div
          aria-label={`${contact} avatar`}
          className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-cyan-700 text-xs font-semibold text-white"
        >
          {initials}
        </div>
        <div>
          <div className="text-[13px] font-semibold text-foreground">
            {contact}
          </div>
          <div className="text-[11px] text-muted-foreground">
            Volunteer Coordinator
          </div>
        </div>
      </div>
      <div className="mt-3 border-t border-border pt-3">
        <div className="mb-1 text-xs text-foreground/80">{email}</div>
        <div className="text-xs text-foreground/80">{phone}</div>
      </div>
    </Card>
  );
}

function StatusCard({
  health,
  lastEvent,
  champion,
}: {
  health: "thriving" | "attention";
  lastEvent: string;
  champion: string | null;
}) {
  return (
    <Card className="p-5">
      <h2 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
        Status
      </h2>
      <div className="flex flex-col gap-2.5 text-[13px]">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Health</span>
          {health === "thriving" ? (
            <Pill tone="sage">Thriving</Pill>
          ) : (
            <Pill tone="amber">Needs hello</Pill>
          )}
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Last event</span>
          <span className="text-foreground">{fmtDate(lastEvent, false)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Champion</span>
          <span className="text-foreground">{champion || "—"}</span>
        </div>
      </div>
    </Card>
  );
}

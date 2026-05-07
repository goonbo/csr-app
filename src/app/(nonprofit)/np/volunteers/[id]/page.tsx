"use client";

/**
 * /np/volunteers/[id] — volunteer profile (Field theme).
 *
 * Identity card (large emerald avatar + source/status pills + contact
 * row), then a 2-column layout:
 *
 *   LEFT (2fr):
 *     • Hours snapshot — three KPIs (all-time hours, events, last
 *       active). For VIEW-sourced volunteers, a footnote credits the
 *       corporate partner's check-in scanner with a clickable link
 *       to that partner's `/np/partners/[id]`.
 *     • Hours timeline — date · title (+ optional ViewSourcePill
 *       sm hideIcon) · hours, mono numerals, divided rows.
 *     • Internal notes — author + date eyebrow + body, in a
 *       border-l-2 list. Empty state placeholder, plus a non-
 *       functional "+ Add note" button to telegraph affordance.
 *
 *   RIGHT (1fr):
 *     • Recognition earned — emerald-tinted Award rows, or italic
 *       "Approaching their first milestone." placeholder.
 *     • Skills — outline pills; VIEW-sourced ones get cyan tint +
 *       sparkle icon (the load-bearing visual that this entry came
 *       from a corporate workspace, not local).
 *     • Source provenance — cyan callout linking to the corporate
 *       partner detail; rendered only for view-partner volunteers.
 *
 * Cyan accents inside the Field workspace read as foreign; that
 * contrast is the entire point of the source-provenance treatment.
 */

import { use } from "react";
import { useRouter, notFound } from "next/navigation";
import { Mail, Phone, Award, Sparkles } from "lucide-react";
import { fmtDate } from "@/lib/format";
import { NP_VOLUNTEERS } from "@/lib/seed/np-volunteers";
import { NP_PARTNER_BY_ID } from "@/lib/seed/np-corporate-partners";
import type { Volunteer, RecognitionId, DataSource } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/view/PageHeader";
import { ViewSourcePill } from "@/components/view/ViewSourcePill";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function VolunteerDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = use(params);
  const v = NP_VOLUNTEERS.find((x) => x.id === id);
  if (!v) notFound();

  const partner = v.sourcePartnerId
    ? NP_PARTNER_BY_ID(v.sourcePartnerId)
    : undefined;

  return (
    <div>
      <PageHeader
        back="Back to volunteers"
        onBack={() => router.push("/np/volunteers")}
        greeting={
          v.employer
            ? `${v.employer} · ${labelForSource(v.source)}`
            : labelForSource(v.source)
        }
        title={v.name}
      />

      <Card className="mb-5 p-6">
        <div className="grid grid-cols-[auto_1fr] items-center gap-6">
          <Avatar name={v.name} large />
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2.5">
              {v.source === "view-partner" && v.employer && (
                <ViewSourcePill partner={v.employer} />
              )}
              {v.source === "imported" && (
                <span className="inline-flex items-center rounded-full border border-border bg-muted px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
                  Imported · joined {fmtDate(v.joinedAt, false)}
                </span>
              )}
              {v.source === "direct" && (
                <span className="inline-flex items-center rounded-full border border-border bg-muted px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
                  Community direct · joined {fmtDate(v.joinedAt, false)}
                </span>
              )}
              <span
                className={cn(
                  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
                  v.status === "active"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                    : "border-border text-muted-foreground",
                )}
              >
                {v.status === "active" ? "Active" : "Inactive"}
              </span>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-[13px] text-foreground/80">
              <a
                href={`mailto:${v.email}`}
                className="inline-flex items-center gap-1.5 hover:text-foreground"
              >
                <Mail className="size-3.5" aria-hidden="true" /> {v.email}
              </a>
              {v.phone && (
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="size-3.5" aria-hidden="true" /> {v.phone}
                </span>
              )}
              <span className="inline-flex items-center">
                Joined {fmtDate(v.joinedAt, false)}
              </span>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-5">
          <HoursSnapshot
            volunteer={v}
            partnerName={partner?.name}
            onPartnerClick={() =>
              partner && router.push(`/np/partners/${partner.id}`)
            }
          />

          {v.history.length > 0 && <HoursTimeline volunteer={v} />}

          <InternalNotes volunteer={v} />
        </div>

        <aside className="flex flex-col gap-4">
          <Recognition recognitions={v.recognitions} />
          <Skills skills={v.skills} />
          {partner && (
            <SourceProvenance
              partner={partner}
              onClick={() => router.push(`/np/partners/${partner.id}`)}
            />
          )}
        </aside>
      </div>
    </div>
  );
}

// ============================================================
// Sub-components
// ============================================================

function HoursSnapshot({
  volunteer: v,
  partnerName,
  onPartnerClick,
}: {
  volunteer: Volunteer;
  partnerName?: string;
  onPartnerClick: () => void;
}) {
  return (
    <Card className="p-6">
      <div className="grid grid-cols-3 gap-4">
        <Stat
          label="Hours · all-time"
          value={v.totalHours.toLocaleString()}
          unit="hrs"
        />
        <Stat label="Events" value={v.eventsAttended.toString()} />
        <Stat label="Last active" value={fmtDate(v.lastActive, false)} small />
      </div>
      {partnerName && (
        <div className="mt-4 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
          Source provenance — these hours flow in from{" "}
          <button
            type="button"
            onClick={onPartnerClick}
            className="font-semibold text-view-source-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {partnerName}&rsquo;s VIEW workspace
          </button>{" "}
          via the corporate partner&rsquo;s check-in scanner. Cross-checked
          against your reconciliation queue whenever a scan is missing.
        </div>
      )}
    </Card>
  );
}

function HoursTimeline({ volunteer: v }: { volunteer: Volunteer }) {
  return (
    <Card className="p-6">
      <h2 className="mb-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
        Hours timeline
      </h2>
      <div className="flex flex-col gap-3.5">
        {v.history.map((h) => (
          <div
            key={h.id}
            className="grid grid-cols-[110px_1fr_auto] gap-4 border-b border-border pb-3.5 last:border-b-0 last:pb-0"
          >
            <div className="font-mono text-xs text-muted-foreground">
              {fmtDate(h.date, false)}
            </div>
            <div>
              <div className="mb-1 text-[13px] font-semibold leading-tight text-foreground">
                {h.title}
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                {h.partner ?? "Community event"}
                {h.source === "view-partner" && h.partner && (
                  <ViewSourcePill partner={h.partner} size="sm" hideIcon />
                )}
              </div>
            </div>
            <div className="text-right font-mono text-[13px] font-semibold tabular-nums text-foreground">
              {h.hours} hrs
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function InternalNotes({ volunteer: v }: { volunteer: Volunteer }) {
  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          Internal notes
        </h2>
        <button
          type="button"
          className="rounded text-xs font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          + Add note
        </button>
      </div>
      {v.notes.length === 0 ? (
        <div className="text-[13px] italic text-muted-foreground">
          No notes yet. Add the next time you talk with them.
        </div>
      ) : (
        <div className="flex flex-col gap-3.5">
          {v.notes.map((n) => (
            <div key={n.id} className="border-l-2 border-border pl-3.5">
              <div className="mb-1 font-mono text-[11px] text-muted-foreground">
                {fmtDate(n.date, false)} · {n.author}
              </div>
              <div className="text-[13px] leading-relaxed text-foreground">
                {n.body}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function Recognition({ recognitions }: { recognitions: RecognitionId[] }) {
  return (
    <Card className="p-5">
      <h3 className="mb-3.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
        Recognition earned
      </h3>
      {recognitions.length === 0 ? (
        <div className="text-xs italic text-muted-foreground">
          Approaching their first milestone.
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {recognitions.map((r) => (
            <div
              key={r}
              className="inline-flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1.5"
            >
              <Award
                className="size-3.5 text-emerald-700"
                strokeWidth={2.4}
                aria-hidden="true"
              />
              <span className="text-xs font-semibold text-emerald-900">
                {recognitionLabel(r)}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function Skills({
  skills,
}: {
  skills: { label: string; source: DataSource }[];
}) {
  return (
    <Card className="p-5">
      <h3 className="mb-3.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
        Skills
      </h3>
      {skills.length === 0 ? (
        <div className="text-xs italic text-muted-foreground">
          None recorded.
        </div>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {skills.map((s) => (
            <span
              key={s.label}
              className={cn(
                "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
                s.source === "view-partner"
                  ? "border-view-source/40 bg-view-source-muted text-view-source-foreground"
                  : "border-border bg-muted text-foreground/80",
              )}
            >
              {s.source === "view-partner" && (
                <Sparkles
                  className="size-2.5 text-view-source"
                  strokeWidth={2.4}
                  aria-hidden="true"
                />
              )}
              {s.label}
            </span>
          ))}
        </div>
      )}
      <div className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
        VIEW-sourced skills come from the corporate workspace&rsquo;s employee
        profile.
      </div>
    </Card>
  );
}

function SourceProvenance({
  partner,
  onClick,
}: {
  partner: { id: string; name: string; industry: string };
  onClick: () => void;
}) {
  return (
    <Card className="p-5">
      <h3 className="mb-2.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
        Source
      </h3>
      <button
        type="button"
        onClick={onClick}
        className="block w-full rounded-md border border-view-source/40 bg-view-source-muted p-3 text-left hover:bg-view-source-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-view-source-foreground">
          via VIEW
        </div>
        <div className="text-sm font-semibold text-foreground">
          {partner.name}
        </div>
        <div className="mt-1 text-xs text-muted-foreground">
          {partner.industry}
        </div>
      </button>
    </Card>
  );
}

function Avatar({ name, large = false }: { name: string; large?: boolean }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 font-bold tracking-tight text-primary-foreground",
        large ? "size-20 text-[28px]" : "size-9 text-xs",
      )}
    >
      {initials}
    </div>
  );
}

function Stat({
  label,
  value,
  unit,
  small = false,
}: {
  label: string;
  value: string;
  unit?: string;
  small?: boolean;
}) {
  return (
    <div>
      <div className="mb-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div
        className={cn(
          "flex items-baseline gap-1 font-heading font-semibold tabular-nums tracking-tight text-foreground",
          small ? "text-[18px]" : "text-[28px]",
        )}
      >
        {value}
        {unit && (
          <span className="font-sans text-xs font-medium text-muted-foreground">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

function labelForSource(s: DataSource): string {
  if (s === "view-partner") return "via VIEW partner";
  if (s === "imported") return "imported volunteer";
  return "community volunteer";
}

function recognitionLabel(id: RecognitionId): string {
  switch (id) {
    case "10-events":
      return "10 events";
    case "25-events":
      return "25 events";
    case "50-events":
      return "50 events";
    case "first-skills-based":
      return "First skills-based engagement";
    case "spanish-speaker":
      return "Spanish-speaker";
    case "recurring-donor":
      return "Recurring donor";
    default:
      return id;
  }
}

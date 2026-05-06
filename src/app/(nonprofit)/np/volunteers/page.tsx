"use client";

/**
 * /np/volunteers — volunteer pool list (Field theme).
 *
 * PageHeader greets with the sub-line "Your pool" + count summary.
 * Filter bar has two rows:
 *   1. Search (InputGroup) + Status segmented control (All / Active /
 *      Inactive). Status defaults to Active — corner-cuts the most
 *      common view.
 *   2. Source segmented control (All / Via VIEW partners / Direct /
 *      Imported), each label suffixed with a count, and the Via
 *      VIEW tab gets a small cyan dot affordance.
 *
 * The filtered+sorted list is a single Card containing row buttons:
 *   avatar · name + ViewSourcePill/Imported pill/recognition/inactive
 *   chips · employer · hours (mono, right-aligned) · last active ·
 *   chevron. Sort: most-recent lastActive first.
 *
 * Sub-line "Showing X of Y" hangs below the list.
 */

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, Award } from "lucide-react";
import { fmtDate } from "@/lib/format";
import { NP_VOLUNTEERS } from "@/lib/seed/np-volunteers";
import type { Volunteer, DataSource, RecognitionId } from "@/lib/types";
import { Card } from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { PageHeader } from "@/components/view/PageHeader";
import { ViewSourcePill } from "@/components/view/ViewSourcePill";
import { cn } from "@/lib/utils";

type SourceFilter = "all" | DataSource;
type StatusFilter = "all" | "active" | "inactive";

const SOURCE_FILTERS: { id: SourceFilter; label: string }[] = [
  { id: "all", label: "All sources" },
  { id: "view-partner", label: "Via VIEW partners" },
  { id: "direct", label: "Direct signup" },
  { id: "imported", label: "Imported" },
];

const STATUS_FILTERS: { id: StatusFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "inactive", label: "Inactive" },
];

export default function VolunteersPage() {
  const router = useRouter();
  const [source, setSource] = useState<SourceFilter>("all");
  const [status, setStatus] = useState<StatusFilter>("active");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return NP_VOLUNTEERS.filter((v) => {
      if (source !== "all" && v.source !== source) return false;
      if (status !== "all" && v.status !== status) return false;
      if (
        q &&
        !v.name.toLowerCase().includes(q) &&
        !(v.employer ?? "").toLowerCase().includes(q)
      )
        return false;
      return true;
    }).sort((a, b) => b.lastActive.localeCompare(a.lastActive));
  }, [source, status, query]);

  const sourceCounts = useMemo(
    () =>
      ({
        all: NP_VOLUNTEERS.length,
        "view-partner": NP_VOLUNTEERS.filter((v) => v.source === "view-partner")
          .length,
        direct: NP_VOLUNTEERS.filter((v) => v.source === "direct").length,
        imported: NP_VOLUNTEERS.filter((v) => v.source === "imported").length,
      }) as Record<SourceFilter, number>,
    [],
  );

  const activeCount = NP_VOLUNTEERS.filter((v) => v.status === "active").length;
  const employerCount = countDistinctEmployers(NP_VOLUNTEERS);

  return (
    <div>
      <PageHeader
        greeting="Your pool"
        title="Volunteers."
        subtitle={`${activeCount} active across ${employerCount} employers — corporate-affiliated and community-direct.`}
      />

      <div className="mb-5 flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <InputGroup className="h-9 max-w-[420px] flex-[1_1_240px]">
            <InputGroupAddon>
              <Search className="size-4" aria-hidden="true" />
            </InputGroupAddon>
            <InputGroupInput
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or employer…"
              aria-label="Search volunteers"
            />
          </InputGroup>

          <Tabs
            value={status}
            onValueChange={(v) => setStatus(v as StatusFilter)}
          >
            <TabsList aria-label="Filter by status">
              {STATUS_FILTERS.map((f) => (
                <TabsTrigger key={f.id} value={f.id}>
                  {f.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <Tabs
          value={source}
          onValueChange={(v) => setSource(v as SourceFilter)}
        >
          <TabsList className="rounded-full" aria-label="Filter by source">
            {SOURCE_FILTERS.map((f) => (
              <TabsTrigger
                key={f.id}
                value={f.id}
                className="rounded-full px-3"
              >
                {f.id === "view-partner" && (
                  <span
                    aria-hidden="true"
                    className="size-1.5 shrink-0 rounded-full bg-view-source"
                  />
                )}
                {f.label}
                <span className="text-[11px] font-semibold text-muted-foreground">
                  {sourceCounts[f.id]}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {filtered.length === 0 ? (
        <Card className="bg-muted/40 p-8">
          <div className="text-sm text-foreground/70">
            No volunteers match this view. Try widening the filters.
          </div>
        </Card>
      ) : (
        <Card className="gap-0 p-0">
          {filtered.map((v, i) => (
            <VolunteerRow
              key={v.id}
              volunteer={v}
              isLast={i === filtered.length - 1}
              onClick={() => router.push(`/np/volunteers/${v.id}`)}
            />
          ))}
        </Card>
      )}

      <div className="mt-3 text-right text-[11px] text-muted-foreground">
        Showing {filtered.length} of {NP_VOLUNTEERS.length}
      </div>
    </div>
  );
}

function countDistinctEmployers(volunteers: Volunteer[]): number {
  const set = new Set<string>();
  for (const v of volunteers) if (v.employer) set.add(v.employer);
  return set.size;
}

interface VolunteerRowProps {
  volunteer: Volunteer;
  isLast: boolean;
  onClick: () => void;
}

function VolunteerRow({ volunteer: v, isLast, onClick }: VolunteerRowProps) {
  const topRecognition = v.recognitions[v.recognitions.length - 1];

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "grid grid-cols-[1fr_140px_100px_36px] items-center gap-4 px-4 py-3.5 text-left transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-[-2px]",
        !isLast && "border-b border-border",
      )}
    >
      <div className="flex min-w-0 items-center gap-3.5">
        <Avatar name={v.name} />
        <div className="min-w-0">
          <div className="mb-0.5 flex flex-wrap items-center gap-2">
            <span className="text-[13.5px] font-semibold text-foreground">
              {v.name}
            </span>
            {v.source === "view-partner" && v.employer && (
              <ViewSourcePill partner={v.employer} size="sm" />
            )}
            {v.source === "imported" && (
              <span className="inline-flex items-center rounded-full border border-border bg-muted px-1.5 py-px text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Imported
              </span>
            )}
            {topRecognition && (
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-1.5 py-px text-[10px] font-semibold text-emerald-900">
                <Award className="size-2.5" strokeWidth={2.4} aria-hidden="true" />
                {recognitionLabel(topRecognition)}
              </span>
            )}
            {v.status === "inactive" && (
              <span className="inline-flex items-center rounded-full border border-border px-1.5 py-px text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Inactive
              </span>
            )}
          </div>
          <div className="text-xs leading-tight text-muted-foreground">
            {v.employer ?? "Community volunteer"} · {v.eventsAttended} events
          </div>
        </div>
      </div>
      <div className="text-right font-mono text-[13px] tabular-nums text-foreground">
        {v.totalHours.toLocaleString()} hrs
      </div>
      <div className="text-right text-[11px] text-muted-foreground">
        {fmtDate(v.lastActive, false)}
      </div>
      <ArrowRight
        className="size-3.5 text-muted-foreground"
        aria-hidden="true"
      />
    </button>
  );
}

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div
      aria-hidden="true"
      className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-xs font-bold text-primary-foreground"
    >
      {initials}
    </div>
  );
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
      return "First skills-based";
    case "spanish-speaker":
      return "Spanish-speaker";
    case "recurring-donor":
      return "Recurring donor";
    default:
      return id;
  }
}

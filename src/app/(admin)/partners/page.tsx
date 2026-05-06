"use client";

/**
 * /partners — admin partners list.
 *
 * Header with primary "Add a partner" CTA. Filter row: a rounded
 * search input (shadcn InputGroup with a leading icon) flexed
 * alongside a `Filter` outline button. Cards are a responsive 1–2
 * column grid; each is a clickable Card with a cause-gradient
 * avatar, name + cause/geo, divider, and a footer pairing
 * ReadinessTag with a health Pill.
 *
 * Search is a simple case-insensitive name match. Empty state is a
 * muted Card with the search query inlined.
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, Filter } from "lucide-react";
import { causeStyle } from "@/lib/cause";
import { PARTNERS } from "@/lib/seed/partners";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { PageHeader } from "@/components/view/PageHeader";
import { Pill } from "@/components/view/Pill";
import { ReadinessTag } from "@/components/view/ReadinessTag";

export default function PartnersListPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const filtered = PARTNERS.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <PageHeader
        title="Partners"
        subtitle="The people we work with. Their readiness, history, and what makes each relationship work."
        action={
          <Button>
            <Plus className="size-4" aria-hidden="true" />
            Add a partner
          </Button>
        }
      />

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <InputGroup className="h-10 max-w-96 flex-[1_1_240px] rounded-full">
          <InputGroupAddon>
            <Search className="size-4" aria-hidden="true" />
          </InputGroupAddon>
          <InputGroupInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search partners…"
            aria-label="Search partners"
          />
        </InputGroup>
        <Button variant="outline" size="sm">
          <Filter className="size-4" aria-hidden="true" />
          Filter
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {filtered.map((p) => {
          const cs = causeStyle(p.cause);
          const Icon = cs.icon;
          return (
            <Card
              key={p.id}
              role="button"
              tabIndex={0}
              onClick={() => router.push(`/partners/${p.id}`)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  router.push(`/partners/${p.id}`);
                }
              }}
              className="cursor-pointer p-5 transition-shadow hover:ring-foreground/15"
            >
              <div className="mb-4 flex items-start gap-3">
                <div
                  aria-hidden="true"
                  className="flex size-11 shrink-0 items-center justify-center rounded-2xl"
                  style={{ backgroundImage: cs.gradient }}
                >
                  <Icon
                    className="size-[18px] text-white"
                    strokeWidth={2.2}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-0.5 text-[15px] font-medium leading-snug text-foreground">
                    {p.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {p.cause} · {p.geo}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-3.5">
                <ReadinessTag
                  tag={p.hasD ? p.readinessTag : "not-assessed"}
                  score={p.hasD ? p.readiness : null}
                />
                {p.health === "thriving" && <Pill tone="sage">Thriving</Pill>}
                {p.health === "attention" && (
                  <Pill tone="amber">Needs hello</Pill>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <Card className="mt-4 items-center bg-muted/40 p-12 text-center">
          <p className="m-0 text-[13px] text-muted-foreground">
            No partners match &ldquo;{search}&rdquo;.
          </p>
        </Card>
      )}
    </div>
  );
}

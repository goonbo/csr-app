"use client";

/**
 * /np/recap/[eventId] — nonprofit-side recap, Blueprint register.
 *
 * Maria's framing of an event already recapped from the corporate
 * side. Wraps in `data-theme="blueprint"` so the H1 picks up Fraunces
 * serif and the surface goes mist-white. The footer ribbon names the
 * bidirectional flow explicitly: CloudMotion already has their side
 * (the corporate-side /events/[id]/recap); this is the side only Maria
 * can write — outputs in nonprofit-native language, volunteer voices,
 * partnership reflection, and the asks an email thread tends to lose.
 */

import { use } from "react";
import { useRouter, notFound } from "next/navigation";
import { Send, Quote, Sparkles, ArrowRight } from "lucide-react";
import { fmtDate } from "@/lib/format";
import { EVENTS } from "@/lib/seed/events";
import { NP_RECAPS } from "@/lib/seed/np-recap";
import { NP_CORPORATE_PARTNERS } from "@/lib/seed/np-corporate-partners";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/view/PageHeader";
import { ViewSourcePill } from "@/components/view/ViewSourcePill";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ eventId: string }>;
}

export default function NonprofitRecapPage({ params }: PageProps) {
  const router = useRouter();
  const { eventId } = use(params);

  const event = EVENTS.find((e) => e.id === eventId);
  const recap = NP_RECAPS.find((r) => r.eventId === eventId);
  if (!event || !recap) notFound();

  // The corporate partner that hosted with us. Resolves by walking the
  // corporate-partners' history (Event.partner reads from the corporate
  // perspective, so it points back at the food bank — not what we need
  // from Maria's side).
  const partner = NP_CORPORATE_PARTNERS.find((p) =>
    p.history.some((h) => h.id === eventId || h.title === event.title),
  );

  return (
    <div data-theme="blueprint">
      <PageHeader
        back="Back to home"
        onBack={() => router.push("/np")}
        greeting="Our recap, our framing"
        title={event.title}
        action={
          <Button>
            <Send className="size-4" aria-hidden="true" />
            Send to {partner?.name ?? "corporate partner"}
          </Button>
        }
      />

      <div className="-mt-4 mb-8 flex flex-wrap items-center gap-3 border-b border-border pb-5 text-[13px] text-muted-foreground">
        <span className="font-semibold">{fmtDate(event.date!)}</span>
        <span>·</span>
        <span>{event.location}</span>
        {partner && (
          <>
            <span>·</span>
            <span className="inline-flex items-center gap-2">
              Hosted with {partner.name}
              <ViewSourcePill partner={partner.name} size="sm" />
            </span>
          </>
        )}
      </div>

      {/* Maria's framing — the narrative hero */}
      <Card className="mb-6 p-9">
        <div className="mb-4 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          What we accomplished
        </div>
        <p className="m-0 max-w-[720px] font-heading text-[22px] leading-[1.45] tracking-tight text-foreground">
          {recap.ourFraming}
        </p>
      </Card>

      {/* Outputs band — KPI numerals in serif */}
      <section className="mb-6">
        <h2 className="mb-3.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          In our terms
        </h2>
        <Card className="p-7">
          <div className="grid grid-cols-2 gap-y-6 md:grid-cols-3 lg:grid-cols-6">
            {recap.outputs.map((o, i) => (
              <div key={i}>
                <div className="mb-1.5 font-heading text-3xl leading-none tracking-tight tabular-nums text-foreground">
                  {o.value}
                </div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {o.metric}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* Voices */}
      <section className="mb-6">
        <h2 className="mb-3.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          Volunteer voices
        </h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {recap.voices.map((v, i) => (
            <Card key={i} className="p-5">
              <Quote
                aria-hidden="true"
                className="mb-2.5 size-4 text-primary opacity-80"
              />
              <p className="m-0 mb-3.5 font-heading text-[15px] italic leading-relaxed text-foreground">
                &ldquo;{v.quote}&rdquo;
              </p>
              <div className="border-t border-border pt-3 text-[11px] font-semibold tracking-tight text-muted-foreground">
                {v.who}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Partnership reflection */}
      <Card className="mb-6 p-7">
        <h2 className="mb-3.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          What this partnership has built
        </h2>
        <p className="m-0 max-w-[720px] font-heading text-[17px] leading-relaxed text-foreground">
          {recap.partnershipReflection}
        </p>
      </Card>

      {/* Asks — the editable, honest section */}
      <section className="mb-6">
        <header className="mb-3.5 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Areas where we&rsquo;d love more support
            </h2>
            <p className="mt-1 text-xs italic text-muted-foreground">
              Editable. Choose which to share back to{" "}
              {partner?.name ?? "the corporate partner"}.
            </p>
          </div>
          <button
            type="button"
            className="rounded p-1 text-xs font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            + Add an ask
          </button>
        </header>

        <div className="flex flex-col gap-3">
          {recap.asks.map((ask, i) => (
            <AskCard key={i} ask={ask} />
          ))}
        </div>
      </section>

      {/* Footer ribbon — bidirectional flow note */}
      <Card className="bg-view-source-muted/40 ring-view-source/30 p-5">
        <div className="flex items-start gap-3">
          <div
            aria-hidden="true"
            className="flex size-8 shrink-0 items-center justify-center rounded-full border border-view-source/40 bg-view-source-muted"
          >
            <Sparkles
              className="size-3.5 text-view-source"
              strokeWidth={2.4}
            />
          </div>
          <div className="flex-1">
            <div className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-view-source-foreground">
              The recap loop, two-way
            </div>
            <p className="m-0 max-w-[680px] text-sm leading-relaxed text-foreground">
              {partner?.name ?? "The corporate partner"} already received their
              recap from the corporate side — attendance, outputs, hours.
              Yours is the one only you can write: the framing in your terms,
              the voices from your community, and the asks the email thread
              tends to swallow.
            </p>
            <div className="mt-3.5 flex flex-wrap gap-3">
              <Button>
                <Send className="size-4" aria-hidden="true" />
                Send to {partner?.name ?? "corporate partner"}
              </Button>
              {partner && (
                <button
                  type="button"
                  onClick={() => router.push(`/np/partners/${partner.id}`)}
                  className="inline-flex items-center gap-1 rounded p-2 text-[13px] font-medium text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  View their relationship history{" "}
                  <ArrowRight className="size-3" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function AskCard({
  ask,
}: {
  ask: {
    type: "skills" | "funding" | "capacity";
    title: string;
    body: string;
  };
}) {
  const config = {
    skills:   { label: "Skills-based", border: "border-l-primary",       chip: "bg-primary/10 text-primary border-primary/40" },
    funding:  { label: "Funding",      border: "border-l-amber-500",     chip: "bg-amber-50 text-amber-900 border-amber-200" },
    capacity: { label: "Capacity",     border: "border-l-view-source",   chip: "bg-view-source-muted text-view-source-foreground border-view-source/40" },
  } as const;
  const c = config[ask.type];

  return (
    <Card className={cn("border-l-4 p-5", c.border)}>
      <div className="mb-2 flex items-center gap-3">
        <span
          className={cn(
            "rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
            c.chip,
          )}
        >
          {c.label}
        </span>
        <h3 className="m-0 font-heading text-lg font-medium tracking-tight text-foreground">
          {ask.title}
        </h3>
        <span className="flex-1" />
        <label className="inline-flex cursor-pointer items-center gap-1.5 text-[11px] text-muted-foreground">
          <input
            type="checkbox"
            defaultChecked
            className="accent-primary"
          />
          Include in send
        </label>
      </div>
      <p className="m-0 max-w-[680px] text-sm leading-relaxed text-muted-foreground">
        {ask.body}
      </p>
    </Card>
  );
}

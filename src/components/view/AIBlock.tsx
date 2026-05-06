/**
 * AIBlock — Card variant marking AI-generated or AI-curated content.
 *
 * Visual: Card surface with a soft cyan halo (ring + faint glow), a
 * sparkle eyebrow with the AI label, and an optional regenerate
 * button in the top-right. Used wherever the system surfaces an
 * AI inference: pending recap drafts, demand-signal summaries,
 * partner diligence notes, capacity-fit reasoning, etc.
 *
 * The cyan halo uses `--view-source` (always cyan), not `--primary`,
 * so AIBlock reads correctly under Field where primary is emerald.
 * AI is a cross-context primitive; cyan is its global signal.
 */

import * as React from "react";
import { RefreshCw, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AIBlockProps extends React.ComponentProps<"div"> {
  /** Eyebrow label. Defaults to "AI · generated". */
  label?: string;
  /** When provided, renders a regenerate button in the top-right. */
  onRegenerate?: () => void;
  /** Caption text on the regenerate button. Defaults to "Regenerate". */
  regenerateLabel?: string;
}

export function AIBlock({
  label = "AI · generated",
  onRegenerate,
  regenerateLabel = "Regenerate",
  className,
  children,
  ...props
}: AIBlockProps) {
  return (
    <Card
      data-slot="ai-block"
      className={cn(
        "relative gap-3 bg-view-source/5 ring-view-source/30",
        "before:absolute before:inset-0 before:rounded-xl before:ring-1 before:ring-view-source/15 before:pointer-events-none",
        className,
      )}
      {...props}
    >
      <div className="flex items-center justify-between gap-3 px-4">
        <span
          data-slot="ai-block-eyebrow"
          className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-view-source-foreground"
        >
          <Sparkles className="size-3" aria-hidden="true" />
          {label}
        </span>
        {onRegenerate ? (
          <button
            type="button"
            onClick={onRegenerate}
            className={cn(
              "inline-flex items-center gap-1 rounded-md px-2 py-1",
              "text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted",
              "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            )}
          >
            <RefreshCw className="size-3" aria-hidden="true" />
            {regenerateLabel}
          </button>
        ) : null}
      </div>
      <div className="px-4">{children}</div>
    </Card>
  );
}

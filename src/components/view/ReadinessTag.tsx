/**
 * ReadinessTag — qualitative diligence outcome.
 *
 * Five states sourced from `READINESS_TAGS` in src/lib/seed/pipeline.ts:
 * Strong / Solid (sage), Worth a closer look / Limited evidence (amber),
 * and Not assessed (neutral). The model surfaces a calibrated
 * judgment with reasoning rather than a precise numeric score; the
 * tag is the visible summary of that judgment on partner cards and
 * lists.
 *
 * Resolves either by explicit `tag` prop or by `score` (delegated to
 * `tagFromScore`). Width grows with `size="lg"` for partner-detail
 * headers; `size="default"` is used inline in lists.
 */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { READINESS_TAGS, tagFromScore } from "@/lib/seed/pipeline";
import type { ReadinessTagId } from "@/lib/types";
import { cn } from "@/lib/utils";

const readinessVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border font-semibold whitespace-nowrap",
  {
    variants: {
      tone: {
        // `sage` aliases to the brand accent — cyan in operator/blueprint,
        // emerald in field — via `--primary`.
        sage:    "bg-primary/10 text-primary border-primary/30",
        amber:   "bg-amber-50 text-amber-900 border-amber-200",
        neutral: "bg-muted text-muted-foreground border-border",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        lg:      "px-3 py-1 text-sm",
      },
    },
    defaultVariants: { tone: "neutral", size: "default" },
  },
);

interface ReadinessTagProps
  extends Omit<React.ComponentProps<"span">, "color">,
    Pick<VariantProps<typeof readinessVariants>, "size"> {
  /** Explicit tag id — wins over `score`. */
  tag?: ReadinessTagId;
  /** Numeric score; converts to tag id via `tagFromScore`. */
  score?: number | null;
}

function ReadinessTag({
  tag,
  score,
  size,
  className,
  ...props
}: ReadinessTagProps) {
  const id = tag ?? tagFromScore(score);
  const cfg = READINESS_TAGS[id] ?? READINESS_TAGS["not-assessed"];

  return (
    <span
      data-slot="readiness-tag"
      data-tag={id}
      data-tone={cfg.tone}
      role="img"
      aria-label={`Readiness: ${cfg.label}`}
      className={cn(readinessVariants({ tone: cfg.tone, size }), className)}
      {...props}
    >
      {cfg.label}
    </span>
  );
}

export { ReadinessTag, readinessVariants };
export type { ReadinessTagProps };

/**
 * ViewSourcePill — marks data flowing in from a VIEW corporate partner.
 *
 * Always renders cyan, regardless of the surrounding theme. In Field
 * (the nonprofit workspace), where `--primary` is emerald, the cyan
 * tint reads as foreign — that's the load-bearing visual: a visible
 * "this row came in via VIEW, not through your own intake." In
 * Operator and Blueprint, cyan is the local accent, so the sparkle
 * icon and the "via VIEW · {partner}" label provide additional
 * differentiation.
 *
 * Used inline next to volunteer names, donation amounts, partner
 * cards, and any other surface where a list mixes VIEW-sourced and
 * direct/imported records.
 */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const viewSourceVariants = cva(
  cn(
    "inline-flex items-center gap-1 rounded-full border font-semibold whitespace-nowrap align-middle",
    "bg-view-source-muted text-view-source-foreground border-view-source/40",
  ),
  {
    variants: {
      size: {
        default: "px-2 py-0.5 text-[11px]",
        sm:      "px-1.5 py-px text-[10px]",
      },
    },
    defaultVariants: { size: "default" },
  },
);

interface ViewSourcePillProps
  extends Omit<React.ComponentProps<"span">, "color">,
    VariantProps<typeof viewSourceVariants> {
  /** Corporate partner the data flowed from. Becomes "via VIEW · {partner}". */
  partner?: string;
  /** Override the entire label. Wins over `partner`. */
  label?: string;
  /** Hide the leading sparkle icon (useful in dense list rows). */
  hideIcon?: boolean;
}

export function ViewSourcePill({
  partner,
  label,
  hideIcon = false,
  size,
  className,
  ...props
}: ViewSourcePillProps) {
  const text = label ?? (partner ? `via VIEW · ${partner}` : "via VIEW");

  return (
    <span
      data-slot="view-source-pill"
      aria-label={text}
      className={cn(viewSourceVariants({ size }), className)}
      {...props}
    >
      {hideIcon ? null : (
        <Sparkles
          className="size-2.5 text-view-source shrink-0"
          aria-hidden="true"
        />
      )}
      {text}
    </span>
  );
}

export { viewSourceVariants };

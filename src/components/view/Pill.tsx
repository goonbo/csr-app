/**
 * Pill — domain-tone variant of Badge.
 *
 * Used for status, signal, and stage tags throughout the product
 * (event pipeline state, partner readiness signals, attention queue
 * categories, etc.). Tone names — `sage`, `terracotta`, `amber`,
 * `rose`, `neutral` — are stable across the system. The underlying
 * colors are Tailwind's emerald/orange/amber/rose palettes; the
 * names persist from the prior design language so designers and
 * developers share a vocabulary.
 *
 * Composes shadcn's Badge with `variant="outline"` as a base, then
 * layers tone-specific bg/text/border classes on top.
 */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const pillVariants = cva(
  "border font-semibold",
  {
    variants: {
      tone: {
        neutral:    "bg-muted text-muted-foreground border-border",
        sage:       "bg-emerald-50 text-emerald-900 border-emerald-200",
        // The "terracotta" label is historical — in the live system the
        // tone resolves to cyan (the brand accent). Keeping the name
        // for stable call sites; the visual is cyan.
        terracotta: "bg-primary/10 text-primary border-primary/30",
        amber:      "bg-amber-50 text-amber-900 border-amber-200",
        rose:       "bg-rose-50 text-rose-900 border-rose-200",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

interface PillProps
  extends Omit<React.ComponentProps<"span">, "color">,
    VariantProps<typeof pillVariants> {
  /** Optional leading icon, rendered before children at size-3. */
  icon?: LucideIcon;
}

export function Pill({
  tone,
  icon: Icon,
  className,
  children,
  ...props
}: PillProps) {
  return (
    <Badge
      variant="outline"
      data-slot="pill"
      data-tone={tone ?? "neutral"}
      className={cn(pillVariants({ tone }), className)}
      {...props}
    >
      {Icon ? <Icon aria-hidden="true" /> : null}
      {children}
    </Badge>
  );
}

export { pillVariants };

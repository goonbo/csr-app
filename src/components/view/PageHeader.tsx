/**
 * PageHeader — the title block at the top of every screen.
 *
 * Pattern: optional eyebrow (small uppercase or italic-greeting),
 * H1 title, optional subtitle paragraph, optional right-aligned
 * action slot (button or button cluster), optional back-link
 * displayed above the title block.
 *
 * Used at the top of every route. Stays Operator-typeset by default
 * (Inter Tight); inside a Blueprint scope the H1 picks up Fraunces
 * via the `--font-heading` cascade in globals.css.
 */

import * as React from "react";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  /** Italic greeting or short eyebrow above the title. */
  greeting?: React.ReactNode;
  /** The H1 itself. Required. */
  title: React.ReactNode;
  /** Optional subtitle paragraph below the H1. */
  subtitle?: React.ReactNode;
  /** Right-aligned action slot — typically a Button or button cluster. */
  action?: React.ReactNode;
  /** Back-link label shown with a left-arrow above the title. */
  back?: string;
  /** Click handler for the back link. */
  onBack?: () => void;
  className?: string;
}

export function PageHeader({
  greeting,
  title,
  subtitle,
  action,
  back,
  onBack,
  className,
}: PageHeaderProps) {
  return (
    <header data-slot="page-header" className={cn("mb-8", className)}>
      {back ? (
        <button
          type="button"
          onClick={onBack}
          className={cn(
            "inline-flex items-center gap-1.5 mb-3 -ml-2 px-2 py-1 rounded-md",
            "text-xs text-muted-foreground hover:text-foreground hover:bg-muted",
            "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          )}
        >
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          {back}
        </button>
      ) : null}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
        <div className="min-w-0">
          {greeting ? (
            <p
              data-slot="page-header-greeting"
              className="text-sm italic text-muted-foreground mb-1"
            >
              {greeting}
            </p>
          ) : null}
          <h1
            data-slot="page-header-title"
            className={cn("font-heading text-foreground leading-tight")}
            style={{
              fontSize: "var(--page-heading-size)",
              fontWeight: "var(--page-heading-weight)" as React.CSSProperties["fontWeight"],
              letterSpacing: "var(--page-heading-tracking)",
            }}
          >
            {title}
          </h1>
          {subtitle ? (
            <p
              data-slot="page-header-subtitle"
              className="mt-2 max-w-2xl text-sm text-muted-foreground leading-relaxed"
            >
              {subtitle}
            </p>
          ) : null}
        </div>
        {action ? (
          <div data-slot="page-header-action" className="shrink-0">
            {action}
          </div>
        ) : null}
      </div>
    </header>
  );
}

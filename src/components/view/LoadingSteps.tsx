/**
 * LoadingSteps — multi-step AI loading sequence.
 *
 * Renders a vertical list of step labels. Each step is one of three
 * states: completed (cyan check), active (cyan spinner), or pending
 * (outlined neutral circle). Driven by the `useAILoad` hook which
 * advances `idx` on a timer.
 *
 * Used in: event recap generation, AI plan flow, partner diligence
 * triage, demand-signals refresh — anywhere we want the user to feel
 * the model thinking before the resolution lands.
 */

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingStepsProps {
  /** Ordered step labels. */
  steps: readonly string[];
  /** Index of the currently-active step. -1 for not started; >= steps.length for done. */
  idx: number;
  className?: string;
}

export function LoadingSteps({ steps, idx, className }: LoadingStepsProps) {
  return (
    <div
      data-slot="loading-steps"
      role="status"
      aria-live="polite"
      className={cn("flex flex-col gap-2.5", className)}
    >
      {steps.map((label, i) => {
        const done = i < idx;
        const active = i === idx;
        return (
          <div
            key={i}
            data-slot="loading-step"
            data-state={done ? "done" : active ? "active" : "pending"}
            className="flex items-center gap-2.5 transition-colors"
          >
            {done ? (
              <span
                aria-hidden="true"
                className="flex size-4 items-center justify-center rounded-full bg-view-source text-view-source-foreground"
              >
                <Check className="size-2.5" strokeWidth={3} />
              </span>
            ) : active ? (
              <span
                aria-hidden="true"
                className="size-4 animate-spin rounded-full border-2 border-view-source border-t-transparent"
              />
            ) : (
              <span
                aria-hidden="true"
                className="size-4 rounded-full border-2 border-border"
              />
            )}
            <span
              className={cn(
                "text-sm transition-colors",
                done && "text-foreground",
                active && "text-foreground font-medium",
                !done && !active && "text-muted-foreground",
              )}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

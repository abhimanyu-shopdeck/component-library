import * as React from "react";

import { cn } from "@/lib/utils";

export type ProgressTone = "orange" | "blue" | "red" | "green";

/** Left→right gradient fills (light tint → solid), all token-based. Figma `4909:4892`. */
const FILL: Record<ProgressTone, string> = {
  orange: "from-warning-light to-warning-default", // #fef3c6 → #e08a2d
  blue: "from-surface-app to-brand-primary", // #eff2fa → #4764cd
  red: "from-white to-danger", // #ffffff → #f44336
  green: "from-success-light to-success", // #e3f3e2 → #22a12a
};

type ProgressBarProps = {
  /** Fill percentage, 0–100. */
  value: number;
  tone?: ProgressTone;
  className?: string;
};

/**
 * Slim progress bar — a grey track (`border-divider`) with a tone-gradient
 * fill. Source of truth: Figma node `4909:4892`.
 */
function ProgressBar({ value, tone = "orange", className }: ProgressBarProps) {
  return (
    <span
      className={cn(
        "block h-1.5 w-full overflow-hidden rounded-full bg-border-divider",
        className
      )}
    >
      <span
        className={cn("block h-full rounded-full bg-gradient-to-r", FILL[tone])}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </span>
  );
}

export { ProgressBar };

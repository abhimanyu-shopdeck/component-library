"use client";

import * as React from "react";
import { Star } from "@phosphor-icons/react";

import { cn } from "@/lib/utils";

type StarRatingProps = {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  /** Number of stars. Defaults to 5. */
  max?: number;
  className?: string;
};

/**
 * Interactive star rating — gold (`warning-amber`) filled stars up to the
 * selected value, outline beyond. Controlled (`value`) or uncontrolled
 * (`defaultValue`). For a read-only rating display, use `DataCard type="ratings"`.
 */
function StarRating({
  value,
  defaultValue = 0,
  onValueChange,
  max = 5,
  className,
}: StarRatingProps) {
  const [internal, setInternal] = React.useState(defaultValue);
  const current = value ?? internal;

  function select(n: number) {
    if (value === undefined) setInternal(n);
    onValueChange?.(n);
  }

  return (
    <div
      role="radiogroup"
      aria-label="Rating"
      className={cn("flex items-center gap-2", className)}
    >
      {Array.from({ length: max }).map((_, i) => {
        const n = i + 1;
        const filled = n <= current;
        return (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={n === current}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            onClick={() => select(n)}
            className="rounded outline-none transition-transform active:scale-90 focus-visible:ring-2 focus-visible:ring-accent-violet-light [&_svg]:size-9"
          >
            <Star
              weight={filled ? "fill" : "regular"}
              className={filled ? "text-warning-amber" : "text-warning-amber/40"}
            />
          </button>
        );
      })}
    </div>
  );
}

export { StarRating };

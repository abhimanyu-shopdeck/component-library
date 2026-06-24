"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type StarRatingProps = {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  /** Number of stars. Defaults to 5. */
  max?: number;
  /** Star size in px. Defaults to 36. */
  size?: number;
  className?: string;
};

/**
 * Interactive star rating — hand-drawn gold stars (filled) up to the selected
 * value, grey default beyond (Figma star SVGs). Controlled (`value`) or
 * uncontrolled (`defaultValue`). For a read-only display, use
 * `DataCard type="ratings"`.
 */
function StarRating({
  value,
  defaultValue = 0,
  onValueChange,
  max = 5,
  size = 36,
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
            className="rounded-md outline-none transition-transform active:scale-90 focus-visible:ring-2 focus-visible:ring-accent-violet-light"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={filled ? "/icons/star-filled.svg" : "/icons/star-default.svg"}
              alt=""
              draggable={false}
              style={{ width: size, height: size }}
              className="block select-none"
            />
          </button>
        );
      })}
    </div>
  );
}

export { StarRating };

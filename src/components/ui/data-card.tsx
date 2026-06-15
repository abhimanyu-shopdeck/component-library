import * as React from "react";
import { ArrowUpRight, ChatTeardropText, Star } from "@phosphor-icons/react";

import { cn } from "@/lib/utils";

/* ── Pieces ──────────────────────────────────────────────────────────── */

type DeltaTone = "up" | "down";
type ProgressTone = "orange" | "red" | "brand";

function DeltaPill({ value, tone = "up" }: { value: string; tone?: DeltaTone }) {
  const up = tone === "up";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 rounded-md px-1.5 py-[3px] type-caption",
        up ? "bg-success-light text-success" : "bg-danger-light text-danger"
      )}
    >
      <ArrowUpRight className="size-3" weight="bold" />
      {value}
    </span>
  );
}

function Progress({ pct, tone = "orange" }: { pct: number; tone?: ProgressTone }) {
  return (
    <span className="block h-1.5 w-full overflow-hidden rounded-full bg-border-divider">
      <span
        className={cn(
          "block h-full rounded-full",
          tone === "red"
            ? "bg-danger"
            : tone === "brand"
              ? "bg-brand-primary"
              : "bg-[linear-gradient(to_right,#fef3c6_0%,#e08a2d_100%)]"
        )}
        style={{ width: `${pct}%` }}
      />
    </span>
  );
}

const Divider = () => (
  <span className="my-3 w-px shrink-0 self-stretch bg-border-divider" />
);

export type DataMetric = {
  label: string;
  value: string;
  /** Secondary suffix, e.g. "/ ₹5.0 L" (shown when there's no delta). */
  cap?: string;
  delta?: { value: string; tone?: DeltaTone };
  progress?: { pct: number; tone?: ProgressTone };
  /** Show the trailing chat icon (single/double only). Defaults to true. */
  icon?: boolean;
};

/** A labelled metric block (used by single + double). */
function MetricBlock({
  label,
  value,
  cap,
  delta,
  progress,
  icon = true,
}: DataMetric) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-2 p-3">
      <div className="flex w-full items-start justify-between gap-2">
        <span className="truncate type-caption text-text-secondary">{label}</span>
        {icon && (
          <ChatTeardropText className="size-4 shrink-0 text-text-secondary/60" />
        )}
      </div>
      <div
        className={cn(
          "flex flex-wrap gap-1.5",
          delta ? "items-center" : "items-end"
        )}
      >
        <span className="type-h1 text-text-primary">{value}</span>
        {cap && (
          <span className="text-[10px] font-normal leading-[17px] text-text-secondary">
            {cap}
          </span>
        )}
        {delta && <DeltaPill value={delta.value} tone={delta.tone} />}
      </div>
      {progress && <Progress pct={progress.pct} tone={progress.tone} />}
    </div>
  );
}

/** Centered label + value (used by triple). */
function CenterBlock({ label, value }: Pick<DataMetric, "label" | "value">) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-2 p-3 text-center">
      <span className="truncate type-caption text-text-secondary">{label}</span>
      <span className="type-h1 text-text-primary">{value}</span>
    </div>
  );
}

/* ── DataCard ────────────────────────────────────────────────────────── */

type DataCardProps = {
  /** Layout. Source of truth: Figma node `4909:5126`. */
  type?: "single" | "double" | "triple" | "ratings";
  /** 1 metric for single, 2 for double, 3 for triple. */
  metrics?: DataMetric[];
  /** ── ratings type ── */
  rating?: number;
  outOf?: number;
  ratingLabel?: string;
  ratingNote?: string;
  className?: string;
};

/**
 * Data-representation card — a metric surface with four layouts:
 *  - `single`  : one metric (label + value + cap/delta + optional progress)
 *  - `double`  : two metrics split by a divider
 *  - `triple`  : three centered metrics split by dividers
 *  - `ratings` : a star rating row
 */
function DataCard({
  type = "single",
  metrics = [],
  rating = 0,
  outOf = 5,
  ratingLabel = "Customer ratings",
  ratingNote,
  className,
}: DataCardProps) {
  const card = "rounded-xl border border-white bg-white";

  if (type === "ratings") {
    const filled = Math.round(rating);
    return (
      <div
        className={cn(
          card,
          "flex flex-wrap items-center justify-between gap-2 p-3",
          className
        )}
      >
        <span className="truncate type-caption text-text-secondary">
          {ratingLabel}
        </span>
        <span className="flex items-center gap-1 [&_svg]:size-4">
          <span className="type-h1 text-text-primary">{rating}</span>
          {Array.from({ length: outOf }).map((_, i) => (
            <Star
              key={i}
              weight={i < filled ? "fill" : "regular"}
              className="text-warning-amber"
            />
          ))}
        </span>
        {ratingNote && (
          <span className="truncate text-[10px] leading-[14px] text-text-secondary">
            {ratingNote}
          </span>
        )}
      </div>
    );
  }

  if (type === "double") {
    return (
      <div className={cn(card, "flex items-stretch overflow-hidden", className)}>
        <MetricBlock {...metrics[0]} />
        <Divider />
        <MetricBlock {...metrics[1]} />
      </div>
    );
  }

  if (type === "triple") {
    return (
      <div className={cn(card, "flex items-stretch overflow-hidden", className)}>
        <CenterBlock {...metrics[0]} />
        <Divider />
        <CenterBlock {...metrics[1]} />
        <Divider />
        <CenterBlock {...metrics[2]} />
      </div>
    );
  }

  return (
    <div className={cn(card, className)}>
      <MetricBlock {...metrics[0]} />
    </div>
  );
}

export { DataCard };

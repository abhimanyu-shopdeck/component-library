import * as React from "react";
import { Info } from "@phosphor-icons/react";

import { cn } from "@/lib/utils";

type InfoNoteProps = React.ComponentProps<"div">;

/**
 * A calm, muted inline note — a grey rounded box with a leading Info icon and
 * secondary text. Use under a card/section for a passive contextual aside
 * (e.g. "This was discussed in the last conversation"). Not for warnings/errors
 * (use a `Pill` / field error) or primary content.
 */
function InfoNote({ children, className, ...props }: InfoNoteProps) {
  return (
    <div
      data-slot="info-note"
      className={cn(
        "flex items-start gap-2 rounded-lg bg-surface-muted px-3 py-2",
        className
      )}
      {...props}
    >
      <Info className="mt-0.5 size-4 shrink-0 text-text-secondary" />
      <span className="type-body-2 text-text-secondary">{children}</span>
    </div>
  );
}

export { InfoNote };

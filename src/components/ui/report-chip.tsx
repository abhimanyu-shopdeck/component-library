"use client";

import { FileXls } from "@phosphor-icons/react";

import { cn } from "@/lib/utils";

type ReportChipProps = {
  /** File label, e.g. "report.xls". */
  name?: string;
  onClick?: () => void;
  className?: string;
};

/**
 * Inline report attachment shown inside an AI chat bubble (Figma `4929:11765`):
 * a white XLS-icon box + filename. Tapping opens the report preview sheet.
 */
function ReportChip({ name = "report.xls", onClick, className }: ReportChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 rounded-md outline-none transition-transform active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-brand-primary/40",
        className
      )}
    >
      <span className="flex items-center justify-center rounded-[4px] bg-white p-1 shadow-[0px_1px_2px_rgba(0,0,0,0.08)] [&_svg]:size-4 [&_svg]:shrink-0">
        <FileXls weight="regular" className="text-success" />
      </span>
      <span className="type-body-1 text-text-primary">{name}</span>
    </button>
  );
}

export { ReportChip };

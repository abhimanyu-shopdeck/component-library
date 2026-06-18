"use client";

import * as React from "react";
import { Phone } from "@phosphor-icons/react";

import { cn } from "@/lib/utils";
import { UserThumbnail } from "@/components/ui/user-thumbnail";

type CallbackBarProps = {
  /** POC avatar image. */
  src: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  onCall?: () => void;
  callLabel?: string;
  className?: string;
};

/**
 * "Call <POC>" help bar (Figma `5284:1003`) — avatar + title + subtitle + a
 * green Phone button.
 *
 * LAYOUT RULE: this bar is **always full screen width** and **floats directly
 * above `BottomNav` with NO gap** — hence rounded *top* corners only, a flat
 * bottom, and an *upward* shadow. Render it as the first child of the fixed
 * bottom region, immediately before `BottomNav` (no margin between them).
 */
function CallbackBar({
  src,
  title,
  description,
  onCall,
  callLabel = "Call",
  className,
}: CallbackBarProps) {
  return (
    <div
      data-slot="callback-bar"
      className={cn(
        "flex w-full items-center justify-between gap-2 rounded-t-[20px] border border-white bg-white p-3 shadow-[0px_-10px_30px_rgba(0,0,0,0.1)]",
        className
      )}
    >
      <div className="flex min-w-0 items-center gap-2">
        <UserThumbnail src={src} size={32} />
        <div className="flex min-w-0 flex-col">
          <span className="type-h3 text-text-primary">{title}</span>
          {description != null && (
            <span className="type-body-2 text-text-secondary">{description}</span>
          )}
        </div>
      </div>
      <button
        type="button"
        aria-label={callLabel}
        onClick={onCall}
        className="grid size-8 shrink-0 place-items-center rounded-full bg-success text-white outline-none transition-transform active:scale-95 [&_svg]:size-4"
      >
        <Phone weight="regular" />
      </button>
    </div>
  );
}

export { CallbackBar };

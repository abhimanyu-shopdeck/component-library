"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CaretLeft,
  DownloadSimple,
  FileXls,
  ShareNetwork,
  SquaresFour,
} from "@phosphor-icons/react";

import { cn } from "@/lib/utils";
import { Header } from "@/components/ui/header";
import { RoundButton } from "@/components/ui/round-button";
import { Switch } from "@/components/ui/switch";
import { ChatBar } from "@/components/ui/chat-bar";
import { ChatBubble } from "@/components/ui/chat-bubble";
import { ReportChip } from "@/components/ui/report-chip";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { ArtifactThumb } from "@/components/ui/artifact-card";
import { Button } from "@/components/ui/button";
import { AiBadge } from "@/components/icons";
import { addGeneratedArtifact } from "@/lib/artifacts-store";
import { ActivityFeed } from "./activity-feed";

type Message = {
  id: number;
  from: "seller" | "ai";
  time: string;
  /** "text" (default) or an inline report attachment. */
  kind?: "text" | "report";
  text?: string;
  /** report kind — filename + the Collections artifact name. */
  reportName?: string;
  artifactName?: string;
};

const INITIAL: Message[] = [
  {
    id: 1,
    from: "seller",
    text: "I've restocked most of the products. Can we resume the ads now?",
    time: "9:41AM",
  },
  {
    id: 2,
    from: "ai",
    text: "Great! I found stock updated for all products except 6 SKUs that are still unavailable.",
    time: "9:41AM",
  },
  {
    id: 3,
    from: "seller",
    text: "That's fine, please continue marketing for the available products.",
    time: "9:42AM",
  },
  {
    id: 4,
    from: "ai",
    text: "Done — I've resumed your Meta ads for all in-stock products and excluded the unavailable SKUs to avoid wasted spend.",
    time: "9:42AM",
  },
];

/* ── Auto-reply framework ──────────────────────────────────────────────
 * A simple, pluggable rule engine: the first rule whose `test` matches the
 * seller's message produces the AI reply. Add/edit rules here, or swap
 * `getAiReply` for a real API call (it can be async — return a Promise).
 * ---------------------------------------------------------------------- */
type ReplyRule = { test: RegExp; reply: string };

const AI_RULES: ReplyRule[] = [
  {
    test: /\b(resume|restart|start|continue)\b.*\bads?\b|\bresume\b/i,
    reply: "On it — I'll resume your Meta ads for all in-stock products.",
  },
  {
    test: /\b(pause|stop|halt|hold)\b/i,
    reply:
      "Done. I've paused the campaign so you won't spend while we sort this out.",
  },
  {
    test: /\b(stock|inventory|sku|restock)\b/i,
    reply:
      "Checking your catalogue… stock looks updated for most products; a few SKUs are still unavailable.",
  },
  {
    test: /\b(spend|spends|budget|gmv|profit|cpo|performance|report|sales)\b/i,
    reply:
      "Here's a quick read: spends are at 50% of budget and GMV is trending up 12% today.",
  },
  {
    test: /\b(hi|hello|hey|thanks|thank you|great|ok|okay)\b/i,
    reply: "Anytime! What would you like me to handle next?",
  },
];

const AI_FALLBACK =
  "Got it — I'll look into that and update your campaign accordingly.";

function getAiReply(text: string): string {
  return AI_RULES.find((rule) => rule.test.test(text))?.reply ?? AI_FALLBACK;
}

/* ── Report-generation intent ──────────────────────────────────────────
 * Matches "Generate report for last 3 months", "Create quarterly sales
 * report", "Prepare analytics summary", etc. When matched, the AI kicks off
 * a report artifact instead of a plain text reply.
 * ---------------------------------------------------------------------- */
function isReportRequest(text: string): boolean {
  return /\b(report|analytics|summary|dashboard)\b/i.test(text);
}

/** Derive a human title for the generated report from the request. */
function deriveReportName(text: string): string {
  if (/\bquarterly\b/i.test(text)) return "Quarterly sales report";
  if (/\banalytics\b|\bsummary\b/i.test(text)) return "Analytics summary";
  if (/\b3\s*months?\b|\bthree months?\b|\bquarter\b/i.test(text))
    return "Sales report · last 3 months";
  return "Sales report";
}

function ChatScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tab, setTab] = React.useState<"chat" | "activity">(
    searchParams.get("tab") === "activity" ? "activity" : "chat"
  );
  const [messages, setMessages] = React.useState<Message[]>(INITIAL);
  const [draft, setDraft] = React.useState("");
  const [typing, setTyping] = React.useState(false);
  const [glow, setGlow] = React.useState(false);
  const [reportPreview, setReportPreview] = React.useState<string | null>(null);
  const [fly, setFly] = React.useState<{
    x0: number;
    y0: number;
    x1: number;
    y1: number;
  } | null>(null);
  const endRef = React.useRef<HTMLDivElement>(null);
  const frameRef = React.useRef<HTMLDivElement>(null);
  const collectionsRef = React.useRef<HTMLSpanElement>(null);
  const flyElRef = React.useRef<HTMLDivElement>(null);
  const idRef = React.useRef(INITIAL.length);
  const nextId = () => (idRef.current += 1);
  const glowTimer = React.useRef<number | null>(null);

  // Soft attention glow on the Collections icon for 15s after a new artifact.
  const triggerGlow = React.useCallback(() => {
    setGlow(true);
    if (glowTimer.current) window.clearTimeout(glowTimer.current);
    glowTimer.current = window.setTimeout(() => setGlow(false), 15000);
  }, []);
  React.useEffect(
    () => () => {
      if (glowTimer.current) window.clearTimeout(glowTimer.current);
    },
    []
  );

  // "Store in Collections" micro-interaction: a replica of the report's XLS
  // icon detaches from the chat bubble, arcs up to the Collections icon, and
  // dissolves into it — *then* the attention glow starts.
  const launchFlyToCollections = React.useCallback(() => {
    const reduce = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const sources = document.querySelectorAll("[data-report-fly-source]");
    const src = sources[sources.length - 1] as HTMLElement | undefined;
    const target = collectionsRef.current;
    const frame = frameRef.current;
    if (reduce || !src || !target || !frame) {
      triggerGlow();
      return;
    }
    const s = src.getBoundingClientRect();
    const t = target.getBoundingClientRect();
    const f = frame.getBoundingClientRect();
    setFly({
      x0: s.left + s.width / 2 - f.left,
      y0: s.top + s.height / 2 - f.top,
      x1: t.left + t.width / 2 - f.left,
      y1: t.top + t.height / 2 - f.top,
    });
  }, [triggerGlow]);

  // Run the flight (Web Animations API) once `fly` coords are set.
  React.useEffect(() => {
    const el = flyElRef.current;
    if (!fly || !el) return;
    const dx = fly.x1 - fly.x0;
    const dy = fly.y1 - fly.y0;
    const anim = el.animate(
      [
        // appear small at the chip
        {
          transform: `translate(${fly.x0}px, ${fly.y0}px) translate(-50%, -50%) scale(0.9)`,
          opacity: 0.5,
          offset: 0,
        },
        // grow to 2x in place — makes the hand-off readable
        {
          transform: `translate(${fly.x0}px, ${fly.y0}px) translate(-50%, -50%) scale(2)`,
          opacity: 1,
          offset: 0.22,
        },
        // travel up the arc, still large
        {
          transform: `translate(${fly.x0 + dx * 0.5}px, ${
            fly.y0 + dy * 0.5 - 52
          }px) translate(-50%, -50%) scale(1.8)`,
          opacity: 1,
          offset: 0.64,
        },
        // dissolve into the Collections icon
        {
          transform: `translate(${fly.x1}px, ${fly.y1}px) translate(-50%, -50%) scale(0.25)`,
          opacity: 0,
          offset: 1,
        },
      ],
      { duration: 1100, easing: "cubic-bezier(0.4, 0, 0.2, 1)", fill: "forwards" }
    );
    anim.onfinish = () => {
      setFly(null);
      triggerGlow();
    };
    return () => anim.cancel();
  }, [fly, triggerGlow]);

  // Enable iOS `:active` press feedback on tap.
  React.useEffect(() => {
    const noop = () => {};
    document.addEventListener("touchstart", noop, { passive: true });
    return () => document.removeEventListener("touchstart", noop);
  }, []);

  // Keep the latest message (or the typing indicator) in view.
  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  function send(value: string) {
    const text = value.trim();
    if (!text) return;

    // 1. Append the seller's message.
    setMessages((m) => [
      ...m,
      { id: nextId(), from: "seller", text, time: "Now" },
    ]);
    setDraft("");

    // 2. Report request → kick off report generation; else plain reply.
    setTyping(true);
    if (isReportRequest(text)) {
      generateReport(text);
    } else {
      window.setTimeout(() => {
        setMessages((m) => [
          ...m,
          { id: nextId(), from: "ai", text: getAiReply(text), time: "Now" },
        ]);
        setTyping(false);
      }, 900);
    }
  }

  /**
   * Report flow: AI acknowledges → "generates" → posts an inline report.xls
   * attachment, registers the artifact in Collections, and glows the icon.
   */
  function generateReport(text: string) {
    const artifactName = deriveReportName(text);

    // a. Acknowledge.
    window.setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          id: nextId(),
          from: "ai",
          text: "On it — pulling your data and generating the report now.",
          time: "Now",
        },
      ]);
      setTyping(true);
    }, 800);

    // b. Deliver the report attachment + register the artifact + glow.
    window.setTimeout(() => {
      addGeneratedArtifact({
        id: `rep-${Date.now()}`,
        type: "report",
        name: artifactName,
        time: "Just now",
        createdAt: Date.now(),
        status: "completed",
      });
      setMessages((m) => [
        ...m,
        {
          id: nextId(),
          from: "ai",
          kind: "report",
          reportName: "report.xls",
          artifactName,
          time: "Now",
        },
      ]);
      setTyping(false);
      // Let the chip paint + settle, then fly it into the Collections icon.
      window.setTimeout(launchFlyToCollections, 260);
    }, 2800);
  }

  return (
    <div className="bg-white sm:flex sm:min-h-screen sm:items-center sm:justify-center sm:bg-neutral-200 sm:p-6">
      <div
        ref={frameRef}
        className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-white motion-safe:animate-screen-in sm:h-[852px] sm:w-[393px] sm:rounded-[44px] sm:shadow-2xl"
      >
        {/* Tab header — fixed (gradient on Chat, flat surface on Activity) */}
        <div
          className={`shrink-0 pt-[env(safe-area-inset-top)] ${
            tab === "activity"
              ? "bg-surface-app"
              : "bg-gradient-to-b from-[#e9ecf9] to-white"
          }`}
        >
          <Header
            className="border-b-0 bg-transparent"
            left={
              <RoundButton
                size="icon-md"
                aria-label="Back"
                onClick={() => router.push("/home")}
              >
                <CaretLeft />
              </RoundButton>
            }
            center={
              <Switch
                options={[
                  { label: "Chat", value: "chat" },
                  { label: "To-Do", value: "activity" },
                ]}
                value={tab}
                onValueChange={(v) => setTab(v as "chat" | "activity")}
              />
            }
            right={
              <span
                ref={collectionsRef}
                className="relative inline-flex items-center justify-center"
              >
                {/* Pulsing light-red rings — fade in/out over 600ms */}
                <span
                  aria-hidden
                  className={cn(
                    "pointer-events-none absolute inset-0 transition-opacity duration-500",
                    glow ? "opacity-100" : "opacity-0"
                  )}
                >
                  {/* single expanding pulse ring */}
                  <span className="absolute inset-0 rounded-full bg-success/45 animate-artifact-pulse" />
                </span>
                <RoundButton
                  size="icon-md"
                  aria-label="Collections"
                  onClick={() => router.push("/artifacts")}
                  className={cn(
                    "relative transition-[background-color,border-color,color,box-shadow] duration-500 [&_svg]:transition-colors [&_svg]:duration-500",
                    glow &&
                      "border-success bg-success text-white shadow-[0_6px_16px_rgba(34,161,42,0.4)] hover:bg-success hover:shadow-[0_6px_16px_rgba(34,161,42,0.4)] [&_svg]:text-white"
                  )}
                >
                  <SquaresFour weight={glow ? "fill" : "regular"} />
                </RoundButton>
              </span>
            }
          />
        </div>

        {tab === "activity" ? (
          <ActivityFeed />
        ) : (
          <>
        {/* Conversation — scrolls between the fixed bars */}
        <main className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4">
          {messages.map((m, i) => {
            const firstOfRun = m.from === "ai" && messages[i - 1]?.from !== "ai";
            const aiHeader =
              firstOfRun || m.kind === "report" ? (
                <>
                  <AiBadge className="size-5" />
                  Shopdeck
                </>
              ) : undefined;
            return m.from === "ai" ? (
              <ChatBubble
                key={m.id}
                variant="ai"
                time={m.time}
                header={aiHeader}
              >
                {m.kind === "report" ? (
                  <ReportChip
                    name={m.reportName}
                    onClick={() => setReportPreview(m.artifactName ?? "Report")}
                  />
                ) : (
                  m.text
                )}
              </ChatBubble>
            ) : (
              <ChatBubble key={m.id} variant="user" time={m.time} read>
                {m.text}
              </ChatBubble>
            );
          })}

          {typing && (
            <ChatBubble variant="ai">
              <span className="flex items-center gap-1 py-0.5">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="size-1.5 animate-bounce rounded-full bg-text-secondary"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </span>
            </ChatBubble>
          )}

          <div ref={endRef} />
        </main>

        {/* Chat nav — fixed */}
        <div className="shrink-0 pb-[env(safe-area-inset-bottom)]">
          <ChatBar
            placeholder="Ask about your business..."
            value={draft}
            onValueChange={setDraft}
            onSubmit={send}
          />
        </div>
          </>
        )}

        {/* Flying XLS replica — "stores" the artifact into the Collections icon */}
        {fly && (
          <div
            ref={flyElRef}
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 z-50 flex items-center justify-center rounded-[6px] bg-white p-1 shadow-[0px_10px_24px_rgba(0,0,0,0.18)] [&_svg]:size-4 [&_svg]:shrink-0"
            style={{
              transform: `translate(${fly.x0}px, ${fly.y0}px) translate(-50%, -50%)`,
            }}
          >
            <FileXls weight="regular" className="text-success" />
          </div>
        )}

        {/* Report preview sheet — opened from the inline report chip */}
        <BottomSheet
          open={reportPreview !== null}
          onOpenChange={(o) => !o && setReportPreview(null)}
          title={reportPreview ?? "Report"}
          description="Generated report — saved to Collections."
          footer={
            <>
              <Button variant="secondary" size="icon-lg" aria-label="Share">
                <ShareNetwork />
              </Button>
              <Button variant="secondary" size="icon-lg" aria-label="Download">
                <DownloadSimple />
              </Button>
              <Button
                variant="primary"
                size="lg"
                className="flex-1"
                onClick={() => {
                  setReportPreview(null);
                  router.push("/artifacts");
                }}
              >
                Open in Collections
              </Button>
            </>
          }
        >
          <div className="overflow-hidden rounded-2xl border border-surface-muted bg-white">
            <div className="aspect-[4/5] w-full">
              <ArtifactThumb type="report" size="lg" />
            </div>
          </div>
        </BottomSheet>
      </div>
    </div>
  );
}

export default function ChatPage() {
  // useSearchParams() requires a Suspense boundary on static routes.
  return (
    <React.Suspense fallback={null}>
      <ChatScreen />
    </React.Suspense>
  );
}

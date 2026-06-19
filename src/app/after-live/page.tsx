"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  CalendarBlank,
  ChartLineUp,
  Megaphone,
  Play,
  RocketLaunch,
  Sparkle,
  Target,
  X,
} from "@phosphor-icons/react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/ui/header";
import { Pill } from "@/components/ui/pill";
import { Toggle } from "@/components/ui/toggle";
import { TextField } from "@/components/ui/text-field";
import { SelectorPill } from "@/components/ui/selector-pill";
import { SectionCard } from "@/components/ui/section-card";
import { UserThumbnail } from "@/components/ui/user-thumbnail";
import { BlueCardBackground } from "@/components/ui/blue-card-background";
import { BottomNav } from "@/components/ui/bottom-nav";
import { BottomSheet } from "@/components/ui/bottom-sheet";

const ANJALI = "https://i.pravatar.cc/120?img=45";

/* Insta-style tutorial stories — white thumbnails, gradient ring. */
const STORIES = [
  { icon: <Megaphone weight="fill" />, label: "First campaign", color: "text-brand-primary" },
  { icon: <ChartLineUp weight="fill" />, label: "Read metrics", color: "text-success" },
  { icon: <RocketLaunch weight="fill" />, label: "Scale up", color: "text-accent-violet" },
  { icon: <Sparkle weight="fill" />, label: "Creatives", color: "text-warning-default" },
  { icon: <Target weight="fill" />, label: "Set goals", color: "text-danger" },
];

/* 5-week marketing plan — week heading + cumulative ad spend only. */
const WEEKS = [
  { week: 1, title: "Launch with your proven winners", spend: "₹7,000", tax: "₹8,260 incl. tax", pct: 20 },
  { week: 2, title: "Read the signals — double down on what works", spend: "₹14,000", tax: "₹17,700 incl. tax", pct: 40 },
  { week: 3, title: "Widen the net — graduate to open audience", spend: "₹21,000", tax: "₹24,780 incl. tax", pct: 60 },
  { week: 4, title: "Refine, expand & fix RTO", spend: "₹28,000", tax: "₹33,040 incl. tax", pct: 80 },
  { week: 5, title: "Decision week — scale up or reset", spend: "₹35,000", tax: "₹41,300 incl. tax", pct: 100 },
];

const CHANNELS = ["Meesho", "Amazon", "Flipkart", "Instagram", "Offline / Wholesale", "Own website"];

const CREATIVES = [
  { sw: "bg-warning-light", title: "Lifestyle image — festival occasion", desc: "Woman wearing Kurta, warm background", tag: "TOF" },
  { sw: "bg-success-light", title: "Product close-up + price callout", desc: "Clean shot, ₹849 badge overlay", tag: "Retargeting" },
  { sw: "bg-accent-violet-light", title: "Review / social proof", desc: "Screenshot of a customer review", tag: "BOF" },
];

const STEP_LABELS = ["Products", "Audience", "Creatives & Website"];

export default function AfterLiveScreen() {
  const router = useRouter();
  const toChat = React.useCallback(() => router.push("/chat"), [router]);

  // Tutorial video popup
  const [video, setVideo] = React.useState<(typeof STORIES)[number] | null>(null);

  // Marketing-strategy wizard (0–2 = steps, 3 = pre-launch review)
  const [open, setOpen] = React.useState(false);
  const [step, setStep] = React.useState(0);

  // Step 1 · Products
  const [bestSeller, setBestSeller] = React.useState("");
  const [channels, setChannels] = React.useState<string[]>(["Meesho"]);
  const [orders, setOrders] = React.useState("");
  // Step 2 · Audience (pre-filled)
  const [buyer, setBuyer] = React.useState("Women, 25–42, tier 2–3 cities");
  const [interests, setInterests] = React.useState("Ethnic wear, festivals, gifting, weddings");
  const [priceSens, setPriceSens] = React.useState("Value-conscious · AOV ₹700–₹1,000");
  const [unique, setUnique] = React.useState("");
  // Step 3 · Website
  const [storeAccess, setStoreAccess] = React.useState(true);
  const [storeLink, setStoreLink] = React.useState("devikalinen.myshopify.com");

  function openWizard() {
    setStep(0);
    setOpen(true);
  }
  function next() {
    setStep((s) => Math.min(3, s + 1));
  }
  function back() {
    if (step === 0) setOpen(false);
    else setStep((s) => s - 1);
  }
  function approve() {
    setOpen(false);
    router.push("/marketing-live");
  }
  const toggleChannel = (c: string) =>
    setChannels((cur) => (cur.includes(c) ? cur.filter((x) => x !== c) : [...cur, c]));

  React.useEffect(() => {
    const noop = () => {};
    document.addEventListener("touchstart", noop, { passive: true });
    return () => document.removeEventListener("touchstart", noop);
  }, []);

  return (
    <div className="bg-surface-app sm:flex sm:min-h-screen sm:items-center sm:justify-center sm:bg-neutral-200 sm:p-6">
      <div className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-surface-app motion-safe:animate-screen-in sm:h-[852px] sm:w-[393px] sm:rounded-[44px] sm:shadow-2xl">
        {/* Header */}
        <div className="shrink-0 bg-surface-app pt-[env(safe-area-inset-top)]">
          <Header
            left={
              <div className="flex items-center gap-2">
                <UserThumbnail src={ANJALI} story />
                <div className="flex flex-col">
                  <span className="type-h2 text-text-primary">Hi Rohit,</span>
                  <span className="text-[12px] leading-[14px] text-text-secondary">
                    you&apos;re now in marketing
                  </span>
                </div>
              </div>
            }
          />
        </div>

        {/* Scrollable content */}
        <main className="flex-1 space-y-6 overflow-y-auto px-4 pb-4 pt-3">
          {/* Tutorial stories — insta-style, white thumbnails, just below header */}
          <section className="-mx-4 flex gap-3.5 overflow-x-auto px-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {STORIES.map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setVideo(s)}
                className="flex w-[68px] shrink-0 flex-col items-center gap-1.5 outline-none"
              >
                <span className="rounded-full bg-gradient-to-tr from-accent-violet via-brand-primary to-accent-teal p-[2.5px] transition-transform active:scale-95">
                  <span
                    className={cn(
                      "grid size-16 place-items-center rounded-full bg-white [&_svg]:size-7",
                      s.color
                    )}
                  >
                    {s.icon}
                  </span>
                </span>
                <span className="w-full truncate text-center type-caption normal-case text-text-secondary">
                  {s.label}
                </span>
              </button>
            ))}
          </section>

          {/* Compact handoff — POC change (≤200px) */}
          <div className="flex flex-col gap-3 rounded-2xl bg-white p-4">
            <div className="flex items-center gap-3">
              <UserThumbnail src={ANJALI} story size={52} />
              <div className="flex min-w-0 flex-col">
                <span className="type-h2 text-text-primary">You&apos;re now in marketing</span>
                <span className="type-body-2 text-text-secondary">
                  Arunabh handed you over to{" "}
                  <span className="font-medium text-text-primary">Anjali Sharma</span> ·
                  Growth Consultant
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl bg-surface-muted px-3 py-2.5">
              <div className="flex min-w-0 flex-col">
                <span className="type-caption text-text-secondary">Call scheduled</span>
                <span className="type-h3 text-text-primary">Jan 16 · 10 AM</span>
              </div>
              <Button variant="primary" size="sm" onClick={toChat}>
                Chat With Anjali
              </Button>
            </div>
          </div>

          {/* Create marketing strategy — second section */}
          <BlueCardBackground layer="front" className="gap-2">
            <div className="flex items-center gap-2 [&_svg]:size-4">
              <Megaphone weight="regular" />
              <h2 className="type-h2 text-white">Create your 1st marketing strategy</h2>
            </div>
            <p className="type-body-2 text-white/70">
              Answer a few quick questions — most are pre-filled from your store.
              Anjali takes it live once you approve.
            </p>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center rounded-md bg-black/20 px-1.5 py-[3px] type-caption text-accent-teal">
                Next step
              </span>
              <span className="text-[10px] font-medium leading-[14px] text-white/80">
                Today
              </span>
            </div>
            <div className="mt-1 flex gap-2">
              <Button variant="on-dark-secondary" size="md" className="flex-1" onClick={toChat}>
                Ask anything
              </Button>
              <Button variant="on-dark" size="md" className="flex-1" onClick={openWizard}>
                Create
              </Button>
            </div>
          </BlueCardBackground>

          {/* Your 5-week journey — last section */}
          <SectionCard
            icon={<CalendarBlank weight="fill" />}
            title="Your 5-week journey"
            surface="glass"
          >
            <div className="flex flex-col">
              {WEEKS.map((w, i) => {
                const isLast = i === WEEKS.length - 1;
                return (
                  <div
                    key={w.week}
                    className="relative flex items-start gap-3 pb-3 last:pb-0"
                  >
                    {/* connector */}
                    {!isLast && (
                      <span className="absolute bottom-0 left-[13px] top-9 w-0.5 -translate-x-1/2 rounded-full bg-brand-primary/25" />
                    )}
                    {/* numbered node */}
                    <span className="relative z-10 mt-2 grid size-[26px] shrink-0 place-items-center rounded-full bg-brand-primary text-[12px] font-semibold text-white">
                      {w.week}
                    </span>
                    {/* week card */}
                    <div className="flex flex-1 flex-col gap-2.5 rounded-2xl bg-white p-3">
                      <div className="flex flex-col gap-0.5">
                        <span className="type-caption text-brand-primary">
                          Week {w.week}
                        </span>
                        <span className="type-h2 text-text-primary">{w.title}</span>
                      </div>
                      <div className="h-px bg-border-divider" />
                      <div className="flex flex-col gap-1.5">
                        <span className="type-caption text-text-secondary">
                          Cumulative ad spend
                        </span>
                        <span className="flex items-baseline gap-2">
                          <span className="type-h1 text-text-primary">{w.spend}</span>
                          <span className="type-body-2 text-text-secondary">
                            {w.tax}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>
        </main>

        {/* Tutorial video popup */}
        {video && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-5">
            <button
              type="button"
              aria-label="Close"
              onClick={() => setVideo(null)}
              className="absolute inset-0 bg-black/50 motion-safe:animate-fade-in"
            />
            <div className="relative z-10 w-full max-w-[320px] overflow-hidden rounded-3xl bg-white shadow-sheet motion-safe:animate-fade-in">
              <div className="relative aspect-[4/5] bg-gradient-grey-dark">
                <span className="absolute left-4 top-4 inline-flex items-center rounded-md bg-black/30 px-2 py-1 type-caption text-white">
                  Tutorial · 0:45
                </span>
                <button
                  type="button"
                  aria-label="Close"
                  onClick={() => setVideo(null)}
                  className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-white/90 text-text-primary outline-none transition-transform active:scale-95 [&_svg]:size-4"
                >
                  <X weight="bold" />
                </button>
                <span className="absolute left-1/2 top-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/20 text-white ring-1 ring-white/40 [&_svg]:size-7">
                  <Play weight="fill" />
                </span>
              </div>
              <div className="flex flex-col gap-1 p-4">
                <h3 className="type-h2 text-text-primary">{video.label}</h3>
                <p className="type-body-2 text-text-secondary">
                  A quick 45-second walkthrough to get you growing faster.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Marketing-strategy wizard — 3 steps + pre-launch review */}
        <BottomSheet
          open={open}
          onOpenChange={setOpen}
          onBack={back}
          footer={
            step === 0 ? (
              <Button variant="primary" size="lg" className="w-full" onClick={next}>
                Next
              </Button>
            ) : step === 3 ? (
              <>
                <Button variant="secondary" size="lg" className="flex-1" onClick={toChat}>
                  Ask anything
                </Button>
                <Button variant="primary" size="lg" className="flex-1" onClick={approve}>
                  Approve & go live
                </Button>
              </>
            ) : (
              <>
                <Button variant="secondary" size="lg" className="flex-1" onClick={back}>
                  Back
                </Button>
                <Button variant="primary" size="lg" className="flex-1" onClick={next}>
                  {step === 1 ? "Looks right, next" : "Generate strategy"}
                </Button>
              </>
            )
          }
        >
          {/* step caption + title */}
          {step < 3 ? (
            <div className="flex flex-col gap-1 border-b border-border-divider pb-3">
              <span className="type-caption text-accent-violet">
                Step {step + 1} of 3 · {STEP_LABELS[step]}
              </span>
              <h2 className="type-h1 text-text-primary">
                {step === 0 && "Where do you sell best?"}
                {step === 1 && "Who buys from you?"}
                {step === 2 && "Ready to build your ads"}
              </h2>
              <p className="type-body-2 text-text-secondary">
                {step === 0 && "Help us pick the right hero product for your ads"}
                {step === 1 && "Pre-filled based on your category — confirm or edit"}
                {step === 2 && "ShopDeck has proposed a creative strategy for you"}
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2 border-b border-border-divider pb-3">
              <div className="flex flex-col gap-1">
                <Pill tone="neutral" background>
                  Go Live · Pre-launch
                </Pill>
                <span className="type-body-2 text-text-secondary">
                  devikatextiles.com · Meta
                </span>
              </div>
            </div>
          )}

          {/* ── Step 1 · Products ── */}
          {step === 0 && (
            <div className="flex flex-col gap-5 pt-4">
              <TextField
                label="Your best-selling product"
                hint="Across all channels — what sells most consistently?"
                value={bestSeller}
                onChange={(e) => setBestSeller(e.target.value)}
                placeholder="e.g. Bandhani Kurta, ₹849"
              />
              <div className="flex flex-col gap-2.5">
                <span className="type-h3 text-text-primary">Where do you currently sell?</span>
                <div className="flex flex-wrap gap-2">
                  {CHANNELS.map((c) => (
                    <SelectorPill key={c} selected={channels.includes(c)} onClick={() => toggleChannel(c)}>
                      {c}
                    </SelectorPill>
                  ))}
                </div>
              </div>
              <TextField
                label="Approx. monthly orders (all channels)"
                value={orders}
                onChange={(e) => setOrders(e.target.value)}
                placeholder="e.g. 200–300 orders/month"
              />
            </div>
          )}

          {/* ── Step 2 · Audience ── */}
          {step === 1 && (
            <div className="flex flex-col gap-5 pt-4">
              <TextField
                label="Primary buyer"
                value={buyer}
                onChange={(e) => setBuyer(e.target.value)}
              />
              <TextField
                label="Key interests & occasions"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
              />
              <TextField
                label="Price sensitivity"
                value={priceSens}
                onChange={(e) => setPriceSens(e.target.value)}
              />
              <TextField
                label="Anything unique about your buyers?"
                value={unique}
                onChange={(e) => setUnique(e.target.value)}
                placeholder="e.g. repeat buyers, gifting season spikes…"
              />
            </div>
          )}

          {/* ── Step 3 · Creatives & Website ── */}
          {step === 2 && (
            <div className="flex flex-col gap-5 pt-4">
              <div className="flex flex-col gap-2.5">
                <span className="type-h3 text-text-primary">Proposed creatives</span>
                {CREATIVES.map((c) => (
                  <div
                    key={c.title}
                    className="flex items-start gap-3 rounded-xl border border-surface-muted bg-surface-app/40 p-3"
                  >
                    <span className={cn("size-9 shrink-0 rounded-lg", c.sw)} />
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span className="type-h3 text-text-primary">{c.title}</span>
                      <span className="type-body-2 text-text-secondary">{c.desc}</span>
                    </div>
                    <Pill tone="neutral" background className="shrink-0">
                      {c.tag}
                    </Pill>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-2.5">
                <span className="type-h3 text-text-primary">Website / store link</span>
                <div className="flex items-center justify-between gap-3">
                  <span className="type-body-1 text-text-primary">
                    Allow ShopDeck to access your store
                  </span>
                  <Toggle checked={storeAccess} onCheckedChange={setStoreAccess} />
                </div>
                <TextField
                  value={storeLink}
                  onChange={(e) => setStoreLink(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* ── Pre-launch review ── */}
          {step === 3 && (
            <div className="flex flex-col gap-3 pt-4">
              {/* Product × Price — expanded */}
              <div className="overflow-hidden rounded-2xl border border-surface-muted bg-surface-app/40">
                <div className="flex items-center justify-between gap-2 p-3">
                  <span className="flex items-center gap-2.5">
                    <span className="size-9 shrink-0 rounded-lg bg-warning-light" />
                    <span className="type-h2 text-text-primary">Product × Price</span>
                  </span>
                  <Pill tone="success" background icon>
                    Selected
                  </Pill>
                </div>
                <div className="flex flex-col gap-2.5 border-t border-surface-muted bg-white p-3">
                  <div className="flex gap-2.5">
                    <Pill tone="success" background>
                      Hero pick
                    </Pill>
                    <span className="type-body-1 text-text-primary">
                      Bandhani Kurta — highest CVR in your catalogue (2× others)
                    </span>
                  </div>
                  <div className="flex gap-2.5">
                    <Pill tone="warning" background>
                      Hold
                    </Pill>
                    <span className="type-body-1 text-text-primary">
                      Keep pricing stable at ₹849 for Week 1. Don&apos;t change
                      mid-run.
                    </span>
                  </div>
                </div>
              </div>

              {/* Collapsed sections */}
              {[
                { sw: "bg-brand-primary/15", title: "Campaigns × Creatives", status: "Ready", tone: "success" as const },
                { sw: "bg-success-light", title: "Audience", status: "Set", tone: "success" as const },
                { sw: "bg-accent-violet-light", title: "Website", status: "Needs attention", tone: "warning" as const },
              ].map((r) => (
                <div
                  key={r.title}
                  className="flex items-center justify-between gap-2 rounded-2xl border border-surface-muted bg-surface-app/40 p-3"
                >
                  <span className="flex items-center gap-2.5">
                    <span className={cn("size-9 shrink-0 rounded-lg", r.sw)} />
                    <span className="type-h2 text-text-primary">{r.title}</span>
                  </span>
                  <Pill tone={r.tone} background icon>
                    {r.status}
                  </Pill>
                </div>
              ))}
            </div>
          )}
        </BottomSheet>

        {/* Bottom nav */}
        <div className="shrink-0 bg-surface-app pb-[env(safe-area-inset-bottom)]">
          <BottomNav
            onHome={() => router.push("/home")}
            onSearchClick={toChat}
            onAction={() => router.push("/artifacts")}
          />
        </div>
      </div>
    </div>
  );
}

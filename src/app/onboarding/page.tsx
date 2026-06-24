"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  CaretRight,
  ChatTeardropText,
  Clock,
  ListChecks,
  Question,
  RocketLaunch,
} from "@phosphor-icons/react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/ui/header";
import { Pill } from "@/components/ui/pill";
import { Stepper } from "@/components/ui/stepper";
import { SectionCard } from "@/components/ui/section-card";
import { UserThumbnail } from "@/components/ui/user-thumbnail";
import { BlueCardBackground } from "@/components/ui/blue-card-background";
import { BottomNav } from "@/components/ui/bottom-nav";
import { CallbackBar } from "@/components/ui/callback-bar";
import { InfoNote } from "@/components/ui/info-note";
import { BottomSheet } from "@/components/ui/bottom-sheet";

const AVATAR = "https://i.pravatar.cc/120?img=47";
const POC_AVATAR = "https://i.pravatar.cc/120?img=12";

/* Service agreement shown in the "View agreement" sheet. */
const AGREEMENT: { heading: string; body: string }[] = [
  {
    heading: "Scope of service",
    body: "Shopdeck will set up, launch and manage your storefront and marketing campaigns across the agreed channels on your behalf.",
  },
  {
    heading: "Fees & billing",
    body: "Ad spend is billed at actuals; the Shopdeck management fee is a fixed percentage of monthly GMV, invoiced on the 1st of each month.",
  },
  {
    heading: "Data & access",
    body: "You grant Shopdeck access to your catalogue, ad accounts and analytics to operate campaigns. You can revoke access anytime from Settings.",
  },
  {
    heading: "Cancellation",
    body: "Either party may end this agreement with 7 days' notice. Live campaigns will be paused safely and any unused balance refunded.",
  },
];

/* ── Your-journey vertical timeline — matches /before-live exactly ─── */
type JourneyStep = {
  label: string;
  date: string;
  status: "done" | "ongoing";
  node: "filled" | "ring" | "target";
};

const JOURNEY: JourneyStep[] = [
  { label: "Documents", date: "Jun 15", status: "done", node: "filled" },
  { label: "Catalog", date: "Jun 15", status: "done", node: "filled" },
  { label: "Website", date: "Jun 15", status: "done", node: "filled" },
  { label: "Marketing", date: "Jun 15", status: "done", node: "ring" },
  { label: "Launch", date: "Jun 15", status: "ongoing", node: "target" },
];

function JourneyNode({ node }: { node: JourneyStep["node"] }) {
  if (node === "filled")
    return <span className="block size-2 rounded-full bg-brand-primary" />;
  if (node === "target")
    return (
      <span className="grid size-3.5 place-items-center rounded-full border-[1.5px] border-brand-primary bg-white">
        <span className="block size-1.5 rounded-full bg-brand-primary" />
      </span>
    );
  return (
    <span className="block size-3.5 rounded-full border-[1.5px] border-brand-primary bg-white" />
  );
}

function JourneyTimeline({ onStep }: { onStep: () => void }) {
  return (
    <div className="flex flex-col">
      {JOURNEY.map((s, i) => {
        const isLast = i === JOURNEY.length - 1;
        const nextFilled = !isLast && JOURNEY[i + 1].node === "filled";
        return (
          <div key={s.label} className="relative flex items-start gap-3 pb-2 last:pb-0">
            {/* node column — self-stretch + equal 4px gaps above/below node */}
            <div className="relative flex w-3.5 shrink-0 justify-center self-stretch">
              {!isLast && (
                <span
                  className={cn(
                    "absolute left-1/2 -bottom-7 -translate-x-1/2",
                    s.node === "filled" ? "top-9" : "top-[42px]",
                    nextFilled
                      ? "w-0.5 rounded-full bg-brand-primary"
                      : "w-0 border-l-2 border-dotted border-brand-primary/50"
                  )}
                />
              )}
              <span className="relative z-10 mt-6">
                <JourneyNode node={s.node} />
              </span>
            </div>

            {/* step card — borderless, rounded-xl */}
            <button
              type="button"
              onClick={onStep}
              className="flex flex-1 items-center justify-between gap-2 rounded-xl bg-white p-3 text-left outline-none transition-colors active:bg-surface-muted"
            >
              <span className="flex min-w-0 flex-col gap-1">
                <span className="type-caption text-text-secondary">{s.date}</span>
                <span className="flex flex-wrap items-center gap-2">
                  <span className="type-h2 font-medium text-text-primary">{s.label}</span>
                  <Pill tone={s.status === "done" ? "success" : "neutral"} background>
                    {s.status === "done" ? "Completed" : "Ongoing"}
                  </Pill>
                </span>
              </span>
              <CaretRight weight="bold" className="size-4 shrink-0 text-text-secondary" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

/* ── Screen ─────────────────────────────────────────────────────────── */
export default function OnboardingScreen() {
  const router = useRouter();
  const toChat = React.useCallback(() => router.push("/chat"), [router]);
  const [agreementOpen, setAgreementOpen] = React.useState(false);

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
                <button
                  type="button"
                  aria-label="Open stories"
                  onClick={() => router.push("/stories")}
                  className="rounded-full outline-none transition-transform active:scale-95"
                >
                  <UserThumbnail src={AVATAR} story />
                </button>
                <div className="flex flex-col">
                  <span className="type-h2 text-text-primary">Hi Rohit,</span>
                  <span className="text-[12px] leading-[14px] text-text-secondary">
                    devikatextiles.com
                  </span>
                </div>
              </div>
            }
          />
        </div>

        {/* Scrollable content */}
        <main className="flex-1 space-y-6 overflow-y-auto px-4 py-4">
          {/* Estimated go-live — glass card with the progress stepper */}
          <div className="overflow-hidden rounded-2xl border border-white bg-white/50">
            <div className="relative flex flex-col gap-1 p-3">
              <span className="type-caption text-text-secondary">
                Estimated go-live
              </span>
              <span className="flex items-center gap-1">
                <span className="type-h2 text-text-primary">30th January</span>
                <Question className="size-4 text-text-secondary" />
              </span>
              <Pill
                tone="success"
                background
                icon
                className="absolute right-3 top-3"
              >
                On track
              </Pill>
            </div>
            <div className="bg-white p-3">
              <Stepper
                steps={[
                  { label: "12 Jun", status: "done" },
                  { label: "15 Jun", status: "current" },
                  { label: "30 Jun", status: "goal" },
                ]}
              />
            </div>
          </div>

          {/* Next step — Launch approval pending (blue card) */}
          <BlueCardBackground layer="front" className="gap-3">
            <div className="flex items-center gap-2 [&_svg]:size-5">
              <RocketLaunch weight="regular" />
              <h2 className="type-h2 text-white">Launch · Approval pending</h2>
            </div>
            <p className="type-body-1 text-white/90">
              Please review and approve the agreement. We&apos;re almost ready to
              go live with your marketing.
            </p>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center rounded-md bg-black/20 px-1.5 py-[3px] type-caption text-white">
                Steps 4/5
              </span>
              <span className="type-caption text-white/70">3 days ago</span>
            </div>
            <Button
              variant="on-dark"
              size="md"
              className="mt-1 w-full"
              onClick={() => setAgreementOpen(true)}
            >
              View agreement
            </Button>
          </BlueCardBackground>

          {/* Recent conversation */}
          <SectionCard
            icon={<ChatTeardropText weight="fill" />}
            title="Recent conversation"
          >
            <button
              type="button"
              onClick={toChat}
              className="block w-full space-y-2.5 text-left outline-none transition-transform active:scale-[0.99]"
            >
              <Pill tone="neutral" background={false} icon={<Clock />}>
                Jan 11, 11:50AM
              </Pill>
              <p className="type-body-1 text-text-primary">
                Porem ipsum dolor sit amet, consectetur elit. Nunc vulputate
                libero et velit interdum.
              </p>
              <InfoNote>This was discussed in the last conversation</InfoNote>
            </button>
          </SectionCard>

          {/* Your journey */}
          <SectionCard
            icon={<ListChecks weight="fill" />}
            title="Your journey"
            surface="glass"
          >
            <JourneyTimeline onStep={toChat} />
          </SectionCard>

        </main>

        {/* Service agreement — accept to go live */}
        <BottomSheet
          open={agreementOpen}
          onOpenChange={setAgreementOpen}
          title="Service agreement"
          description="Please review and accept to take your store live."
          primaryLabel="Accept & continue"
          secondaryLabel="Decline"
          onSecondary={() => setAgreementOpen(false)}
          onPrimary={() => {
            setAgreementOpen(false);
            router.push("/before-live");
          }}
        >
          <div className="flex flex-col gap-5 rounded-2xl border border-surface-muted bg-white p-5">
            {AGREEMENT.map((s, i) => (
              <div key={i} className="flex flex-col gap-1.5">
                <h3 className="type-h2 text-text-primary">{s.heading}</h3>
                <p className="type-body-1 text-text-secondary">{s.body}</p>
              </div>
            ))}
          </div>
        </BottomSheet>

        {/* Fixed bottom region — CallbackBar floats flush above the nav, no gap */}
        <div className="shrink-0 bg-surface-app pb-[env(safe-area-inset-bottom)]">
          <CallbackBar
            src={POC_AVATAR}
            title="Call Anirudh"
            description="for any kind of assistance during onboarding"
            onCall={toChat}
          />
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

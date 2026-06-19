"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Megaphone } from "@phosphor-icons/react";

import { Header } from "@/components/ui/header";
import { Pill } from "@/components/ui/pill";
import { Stepper } from "@/components/ui/stepper";
import { UserThumbnail } from "@/components/ui/user-thumbnail";
import { BottomNav } from "@/components/ui/bottom-nav";
import { CallbackBar } from "@/components/ui/callback-bar";
import { InfoNote } from "@/components/ui/info-note";

const ANJALI = "https://i.pravatar.cc/120?img=45";

export default function MarketingLiveScreen() {
  const router = useRouter();
  const toChat = React.useCallback(() => router.push("/chat"), [router]);

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
                  <span className="type-h2 text-text-primary">Marketing</span>
                  <span className="text-[12px] leading-[14px] text-text-secondary">
                    Anjali is launching your campaigns
                  </span>
                </div>
              </div>
            }
          />
        </div>

        {/* Scrollable content */}
        <main className="flex-1 space-y-6 overflow-y-auto px-4 py-4">
          {/* Marketing in progress — stepper + live status (no metrics yet) */}
          <div className="flex flex-col gap-4 rounded-2xl bg-white p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2 type-h2 text-text-primary [&_svg]:size-4">
                <Megaphone weight="fill" />
                Marketing in progress
              </span>
              <Pill tone="success" background icon>
                Live
              </Pill>
            </div>

            <Stepper
              steps={[
                { label: "Campaign created", status: "done" },
                { label: "Going live", status: "current" },
                { label: "Collecting data", status: "goal" },
              ]}
            />

            {/* indeterminate activity bar */}
            <span className="block h-1.5 w-full overflow-hidden rounded-full bg-border-divider">
              <span className="block h-full w-2/5 rounded-full bg-gradient-primary animate-progress-indeterminate" />
            </span>

            <div className="flex flex-col gap-1">
              <p className="type-h3 text-text-primary">Your campaigns are going live</p>
              <p className="type-body-2 text-text-secondary">
                Sit tight — this usually takes a few minutes. Your metrics will
                appear here automatically once data starts coming in.
              </p>
            </div>
          </div>

          <InfoNote>
            Anjali is monitoring your launch — you&apos;ll get a notification the
            moment your first metrics are ready.
          </InfoNote>
        </main>

        {/* Fixed bottom region */}
        <div className="shrink-0 bg-surface-app pb-[env(safe-area-inset-bottom)]">
          <CallbackBar
            src={ANJALI}
            title="Call Anjali"
            description="your Growth Consultant, for anything marketing"
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

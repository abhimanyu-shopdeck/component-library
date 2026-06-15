"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CaretLeft, DownloadSimple, ShareNetwork } from "@phosphor-icons/react";

import { Header } from "@/components/ui/header";
import { RoundButton } from "@/components/ui/round-button";
import { Button } from "@/components/ui/button";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import {
  ArtifactCard,
  ArtifactThumb,
  StorePageFull,
  type ArtifactStatus,
  type ArtifactType,
} from "@/components/ui/artifact-card";
import {
  getGeneratedArtifacts,
  onArtifactsChanged,
} from "@/lib/artifacts-store";

type DocSection = { heading: string; body: string };

type Artifact = {
  id: string;
  type: ArtifactType;
  name: string;
  time: string;
  status: ArtifactStatus;
  /** Flat text shown in the card thumbnail (document type). */
  content?: string;
  /** Structured sections shown in the preview sheet (document type). */
  doc?: DocSection[];
};

const RETURN_POLICY_DOC: DocSection[] = [
  {
    heading: "Returns & eligibility",
    body: "Items can be returned within 7 days of delivery, provided they are unused and in their original packaging with all tags intact.",
  },
  {
    heading: "Refunds",
    body: "Refunds are issued to the original payment method within 5–7 business days of pickup. Shipping and COD charges are non-refundable.",
  },
  {
    heading: "Exclusions",
    body: "Customised, intimate and final-sale items are not eligible for return or exchange. Damaged-on-arrival items must be reported within 24 hours of delivery.",
  },
];

const RETURN_POLICY =
  "Items can be returned within 7 days of delivery, provided they are unused and in their original packaging with all tags intact.";

const ARTIFACTS: Artifact[] = [
  { id: "site", type: "website", name: "Website creation", time: "10 min ago", status: "action-needed" },
  { id: "rto1", type: "report", name: "RTO report for last week", time: "10 min ago", status: "completed" },
  { id: "brand", type: "website", name: "Brand Kit for festive", time: "30 min ago", status: "ongoing" },
  { id: "rto2", type: "report", name: "RTO report for last month", time: "1 hr ago", status: "completed" },
  { id: "catalog", type: "catalog", name: "Festive catalog", time: "2 hr ago", status: "completed" },
  { id: "policy", type: "document", name: "Return policy doc", time: "yesterday", status: "completed", content: RETURN_POLICY, doc: RETURN_POLICY_DOC },
];

export default function ArtifactsScreen() {
  const router = useRouter();
  const [preview, setPreview] = React.useState<Artifact | null>(null);
  const toChat = React.useCallback(() => router.push("/chat"), [router]);

  // Generated artifacts (e.g. a report created from chat) appear first.
  const [generated, setGenerated] = React.useState<Artifact[]>([]);
  React.useEffect(() => {
    const load = () => setGenerated(getGeneratedArtifacts() as Artifact[]);
    load();
    return onArtifactsChanged(load);
  }, []);
  const artifacts = React.useMemo(
    () => [...generated, ...ARTIFACTS],
    [generated]
  );

  return (
    <div className="bg-surface-app sm:flex sm:min-h-screen sm:items-center sm:justify-center sm:bg-neutral-200 sm:p-6">
      <div className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-surface-app motion-safe:animate-screen-in sm:h-[852px] sm:w-[393px] sm:rounded-[44px] sm:shadow-2xl">
        {/* Sticky header — standard app bar with centered title + white divider */}
        <div className="shrink-0 bg-surface-app pt-[env(safe-area-inset-top)]">
          <Header
            left={
              <RoundButton
                size="icon-md"
                aria-label="Back"
                onClick={() => router.push("/chat")}
              >
                <CaretLeft />
              </RoundButton>
            }
            center={<span className="type-h2 text-text-primary">Collections</span>}
          />
        </div>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto px-4 pb-6 pt-3">
          {/* Grid of uniform cards — completed are passive, active ones stand out */}
          <div className="grid grid-cols-2 gap-3">
            {artifacts.map((a) => (
              <ArtifactCard key={a.id} {...a} onClick={() => setPreview(a)} />
            ))}
          </div>
        </main>

        {/* Artifact preview sheet */}
        <BottomSheet
          open={preview !== null}
          onOpenChange={(o) => !o && setPreview(null)}
          title={preview?.name}
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
                  setPreview(null);
                  toChat();
                }}
              >
                Continue
              </Button>
            </>
          }
        >
          {preview &&
            (preview.type === "website" || preview.type === "catalog" ? (
              <div className="overflow-hidden rounded-2xl border border-surface-muted bg-white">
                <StorePageFull />
              </div>
            ) : preview.type === "document" ? (
              /* document → formatted policy doc: H2 heading + Body-1 copy */
              <div className="flex flex-col gap-5 rounded-2xl border border-surface-muted bg-white p-5">
                {preview.doc?.map((section, i) => (
                  <div key={i} className="flex flex-col gap-1.5">
                    <h3 className="type-h2 text-text-primary">{section.heading}</h3>
                    <p className="type-body-1 text-text-secondary">{section.body}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-surface-muted bg-white">
                <div className="aspect-[4/5] w-full">
                  <ArtifactThumb type={preview.type} size="lg" />
                </div>
              </div>
            ))}
        </BottomSheet>
      </div>
    </div>
  );
}

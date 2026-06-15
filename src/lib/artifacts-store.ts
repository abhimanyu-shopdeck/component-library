"use client";

import type { ArtifactType, ArtifactStatus } from "@/components/ui/artifact-card";

/**
 * Lightweight client store for *generated* artifacts (e.g. a report the AI
 * creates from chat). Persists to localStorage so a freshly generated artifact
 * survives the chat → Collections route navigation, and notifies subscribers so
 * the Collections screen updates live. Newest artifact is always first.
 */
export type GeneratedArtifact = {
  id: string;
  type: ArtifactType;
  name: string;
  /** Display label, e.g. "Just now". */
  time: string;
  /** Sort key (epoch ms). */
  createdAt: number;
  status: ArtifactStatus;
};

const KEY = "shopdeck:generated-artifacts";
const EVENT = "shopdeck:artifacts-changed";

export function getGeneratedArtifacts(): GeneratedArtifact[] {
  if (typeof window === "undefined") return [];
  try {
    const list = JSON.parse(
      window.localStorage.getItem(KEY) ?? "[]"
    ) as GeneratedArtifact[];
    return Array.isArray(list)
      ? [...list].sort((a, b) => b.createdAt - a.createdAt)
      : [];
  } catch {
    return [];
  }
}

export function addGeneratedArtifact(artifact: GeneratedArtifact): void {
  if (typeof window === "undefined") return;
  const next = [artifact, ...getGeneratedArtifacts()];
  window.localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent(EVENT));
}

/** Subscribe to changes (same-tab custom event + cross-tab storage event). */
export function onArtifactsChanged(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => cb();
  window.addEventListener(EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

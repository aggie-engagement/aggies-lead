"use client";

import { CompletionPanel } from "@/components/CompletionPanel";
import { usePrototypeState } from "@/components/PrototypeState";

export function ModuleCompletionClient({
  slug,
  badgeTitle,
  nextHref,
}: {
  slug: string;
  badgeTitle: string;
  nextHref: string;
}) {
  const { completeModule } = usePrototypeState();
  return (
    <CompletionPanel
      moduleSlug={slug}
      onComplete={() => completeModule(slug)}
      backHref="/my-roadmap"
      nextHref={nextHref}
      badgeTitle={badgeTitle}
    />
  );
}

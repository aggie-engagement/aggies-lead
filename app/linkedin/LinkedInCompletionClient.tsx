"use client";

import { CompletionPanel } from "@/components/CompletionPanel";
import { usePrototypeState } from "@/components/PrototypeState";

export function LinkedInCompletionClient() {
  const { completeLinkedIn } = usePrototypeState();
  return (
    <CompletionPanel
      moduleSlug="linkedin"
      onComplete={completeLinkedIn}
      backHref="/my-roadmap"
      nextHref="/modules/campus-navigation"
      badgeTitle="LinkedIn Starter"
    />
  );
}

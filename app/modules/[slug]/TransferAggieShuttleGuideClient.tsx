"use client";

import { AggieShuttleGuideClient } from "./AggieShuttleGuideClient";
import { moduleHref, roadmapModules } from "@/lib/roadmaps";

export function TransferAggieShuttleGuideClient() {
  return (
    <AggieShuttleGuideClient
      moduleSlug="aggie-shuttle"
      backHref="/roadmaps/transfer"
      nextHref={getNextTransferHref("Aggie Shuttle")}
    />
  );
}

function getNextTransferHref(currentTitle: string) {
  const index = roadmapModules.transfer.findIndex((title) => title === currentTitle);
  const nextTitle = roadmapModules.transfer[index + 1];
  return nextTitle ? moduleHref(nextTitle) : "/roadmaps/transfer";
}

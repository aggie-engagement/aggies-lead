"use client";

import { AggiesLeadHomeContent } from "@/components/AggiesLeadHomeContent";
import { RoleGate } from "@/components/RoleGate";

export default function HomePage() {
  return (
    <RoleGate allowed={["admin", "coach", "student-athlete"]}>
      <AggiesLeadHomeContent />
    </RoleGate>
  );
}

"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { UserRole } from "@/lib/permissions";
import { dashboardForRole, roleLabels } from "@/lib/permissions";
import { useAuth } from "@/components/AuthState";

export function RoleGate({ allowed, children }: { allowed: UserRole[]; children: React.ReactNode }) {
  const { isReady, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isReady || !role || allowed.includes(role)) return;
    router.replace(dashboardForRole(role));
  }, [allowed, isReady, role, router]);

  if (!isReady) {
    return (
      <section className="card-surface rounded-lg p-7">
        <p className="text-sm font-bold uppercase tracking-[0.28em] text-aggie-silver">Checking Access</p>
        <h1 className="mt-3 text-3xl font-black text-white">Loading role permissions...</h1>
      </section>
    );
  }

  if (!role || !allowed.includes(role)) {
    return (
      <section className="card-surface rounded-lg p-7">
        <p className="text-sm font-bold uppercase tracking-[0.28em] text-aggie-silver">Access Restricted</p>
        <h1 className="text-glow mt-3 text-4xl font-black tracking-tight text-white">Redirecting to Your Dashboard</h1>
        <p className="mt-4 max-w-3xl leading-7 text-aggie-light/76">
          This page is available to {allowed.map((item) => roleLabels[item]).join(", ")} users only.
        </p>
        <Link
          href={dashboardForRole(role)}
          className="mt-5 inline-flex min-h-12 items-center justify-center rounded-lg border border-aggie-silver/25 px-5 text-sm font-bold text-white transition hover:border-aggie-steel hover:bg-white/10"
        >
          Go to My Dashboard
        </Link>
      </section>
    );
  }

  return <>{children}</>;
}

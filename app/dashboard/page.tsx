"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthState";
import { dashboardForRole } from "@/lib/permissions";

export default function DashboardPage() {
  const router = useRouter();
  const { isReady, role } = useAuth();

  useEffect(() => {
    if (!isReady) return;
    router.replace(dashboardForRole(role));
  }, [isReady, role, router]);

  return (
    <section className="card-surface rounded-lg p-7">
      <p className="text-sm font-bold uppercase tracking-[0.28em] text-aggie-silver">Dashboard</p>
      <h1 className="text-glow mt-3 text-4xl font-black tracking-tight text-white">Routing Dashboard</h1>
      <p className="mt-4 max-w-3xl leading-7 text-aggie-light/76">
        Sending you to the correct dashboard for your role.
      </p>
      <Link
        href="/login"
        className="mt-5 inline-flex min-h-12 items-center justify-center rounded-lg border border-aggie-silver/25 px-5 text-sm font-bold text-white transition hover:border-aggie-steel hover:bg-white/10"
      >
        Choose Role
      </Link>
    </section>
  );
}

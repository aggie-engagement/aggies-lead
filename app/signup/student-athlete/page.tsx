"use client";

import Link from "next/link";
import { UserPlus } from "lucide-react";

export default function StudentAthleteSignUpPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <section className="card-surface rounded-lg p-7">
        <div className="flex items-center gap-3">
          <UserPlus className="h-7 w-7 text-aggie-ice" />
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-aggie-silver">Student-Athlete Access</p>
        </div>
        <h1 className="text-glow mt-3 text-4xl font-black tracking-tight text-white md:text-5xl">
          Activate Your Aggies Lead Account
        </h1>
        <p className="mt-4 leading-7 text-aggie-light/76">
          Public self-sign-up is disabled for rollout. Student-athletes can activate an account only after Aggies Lead staff has added their email to the Student-Athlete Database.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link
            href="/activate-account"
            className="chrome-surface inline-flex min-h-12 items-center justify-center rounded-lg border border-aggie-chrome/60 px-5 text-sm font-black text-aggie-navy shadow-glow transition hover:brightness-110"
          >
            Activate Account
          </Link>
          <Link
            href="/login"
            className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/10 bg-white/6 px-5 text-sm font-black text-white transition hover:bg-white/10"
          >
            Return to Login
          </Link>
        </div>
      </section>
    </div>
  );
}

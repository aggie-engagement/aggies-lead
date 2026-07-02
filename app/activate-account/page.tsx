"use client";

import Link from "next/link";
import { KeyRound } from "lucide-react";

export default function ActivateAccountPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <section className="card-surface rounded-lg p-7">
        <div className="flex items-center gap-3">
          <KeyRound className="h-7 w-7 text-aggie-ice" />
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-aggie-silver">Account Activation</p>
        </div>
        <h1 className="text-glow mt-3 text-4xl font-black tracking-tight text-white md:text-5xl">
          Activate Your Aggies Lead Account
        </h1>
        <p className="mt-4 leading-7 text-aggie-light/76">
          If Aggies Lead staff has added you to the roster, log in with your school email and the temporary password from your activation email.
        </p>
      </section>

      <section className="card-surface rounded-lg p-6">
        <h2 className="text-2xl font-black text-white">Student-Athlete Activation Steps</h2>
        <div className="mt-5 grid gap-3 text-sm font-semibold leading-6 text-aggie-light/76">
          <p className="rounded-lg border border-white/10 bg-white/6 p-4">1. Go to the login page.</p>
          <p className="rounded-lg border border-white/10 bg-white/6 p-4">2. Enter your school email.</p>
          <p className="rounded-lg border border-white/10 bg-white/6 p-4">3. Use the temporary password: <span className="font-black text-white">aggieslead</span>.</p>
          <p className="rounded-lg border border-white/10 bg-white/6 p-4">4. Create a new password, then complete your student-athlete profile.</p>
        </div>
        <Link
          href="/login"
          className="chrome-surface mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-lg border border-aggie-chrome/60 px-5 text-sm font-black text-aggie-navy shadow-glow transition hover:brightness-110"
        >
          Go to Login
        </Link>
      </section>

      <section className="rounded-lg border border-aggie-ice/30 bg-aggie-ice/10 p-5">
        <p className="text-sm font-bold leading-6 text-aggie-light">
          If your school email is not recognized, contact Aggies Lead so staff can add your roster profile.
        </p>
      </section>
    </div>
  );
}

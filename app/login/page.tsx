"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, Users, UserRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAuth } from "@/components/AuthState";
import type { UserRole } from "@/lib/permissions";
import { roleLabels } from "@/lib/permissions";
import {
  accessStorageKeys,
  ensureAccessSeedData,
  readJson,
  seedUsers,
  shouldShowFirstAdminSetup,
} from "@/lib/accessManagement";
import type { User } from "@/lib/accessManagement";

const roleOptions: { role: UserRole; title: string; description: string; icon: LucideIcon }[] = [
  {
    role: "admin",
    title: "Admin",
    description: "View and manage all Aggies Lead data, dashboards, teams, student-athletes, and roadmap progress.",
    icon: ShieldCheck,
  },
  {
    role: "coach",
    title: "Coach",
    description: "View team-level data and individual student-athletes assigned to your team.",
    icon: Users,
  },
  {
    role: "student-athlete",
    title: "Student-Athlete",
    description: "View your own progress plus anonymous rankings and percentiles.",
    icon: UserRound,
  },
];

export default function LoginPage() {
  const router = useRouter();
  const { loginAs, loginWithCredentials, role, user } = useAuth();
  const [showFirstAdminSetup, setShowFirstAdminSetup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = (nextRole: UserRole) => {
    const href = loginAs(nextRole);
    router.push(href);
  };

  useEffect(() => {
    ensureAccessSeedData();
    setShowFirstAdminSetup(shouldShowFirstAdminSetup(readJson<User[]>(accessStorageKeys.users, seedUsers)));
  }, []);

  const handleCredentialLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = loginWithCredentials(email, password);
    if (!result.ok || !result.href) {
      setMessage(result.message ?? "Unable to log in.");
      return;
    }
    setMessage("");
    router.push(result.href);
  };

  return (
    <div className="space-y-8">
      <section className="card-surface rounded-lg p-7">
        <p className="text-sm font-bold uppercase tracking-[0.28em] text-aggie-silver">Role-Based Access</p>
        <h1 className="text-glow mt-3 text-4xl font-black tracking-tight text-white md:text-6xl">
          Login
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-aggie-light/78">
          Log in with your Aggies Lead account, or activate your account if your profile has already been added by Aggies Lead staff.
        </p>
        {user && role ? (
          <p className="mt-4 rounded-lg border border-aggie-silver/15 bg-white/[0.045] p-4 text-sm font-bold text-aggie-light">
            Current role: {roleLabels[role]}
          </p>
        ) : null}
      </section>

      {showFirstAdminSetup ? (
        <section className="card-surface rounded-lg border border-aggie-ice/30 p-6">
          <h2 className="text-2xl font-black text-white">Create First Admin Account</h2>
          <p className="mt-3 max-w-3xl leading-7 text-aggie-light/74">
            No user-created admin account exists yet. Create your admin account first, then future admins can be added through Admin Settings.
          </p>
          <Link
            href="/setup/first-admin"
            className="chrome-surface mt-5 inline-flex min-h-12 items-center justify-center rounded-lg border border-aggie-chrome/60 px-5 text-sm font-black text-aggie-navy shadow-glow transition hover:brightness-110"
          >
            Create First Admin Account
          </Link>
        </section>
      ) : null}

      <section className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <form onSubmit={handleCredentialLogin} className="card-surface rounded-lg p-6">
          <h2 className="text-2xl font-black text-white">Account Login</h2>
          <p className="mt-3 leading-7 text-aggie-light/74">
            Enter your email and password to continue to your role-based dashboard.
          </p>
          <div className="mt-5 grid gap-4">
            <label className="block">
              <span className="text-sm font-black uppercase tracking-[0.16em] text-aggie-silver">Email</span>
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 min-h-12 w-full rounded-lg border border-white/10 bg-white/8 px-4 text-white outline-none transition focus:border-aggie-ice"
                type="email"
                placeholder="coach@aggieslead.local"
              />
            </label>
            <label className="block">
              <span className="text-sm font-black uppercase tracking-[0.16em] text-aggie-silver">Password</span>
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 min-h-12 w-full rounded-lg border border-white/10 bg-white/8 px-4 text-white outline-none transition focus:border-aggie-ice"
                type="password"
                placeholder="Temporary or account password"
              />
            </label>
          </div>
          <button
            type="submit"
            className="chrome-surface mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-lg border border-aggie-chrome/60 px-5 text-sm font-black text-aggie-navy shadow-glow transition hover:brightness-110"
          >
            Log In
          </button>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Link
              href="/activate-account"
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-aggie-ice/30 bg-aggie-ice/10 px-4 text-sm font-black text-aggie-light transition hover:bg-aggie-ice/15"
            >
              Activate Account
            </Link>
            <Link
              href="/forgot-password"
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/10 bg-white/6 px-4 text-sm font-black text-white transition hover:bg-white/10"
            >
              Forgot Password
            </Link>
          </div>
          {message ? (
            <p className="mt-4 rounded-lg border border-red-300/25 bg-red-300/10 p-4 text-sm font-bold text-aggie-light">
              {message}
            </p>
          ) : null}
        </form>

        <article className="card-surface rounded-lg p-6">
          <h2 className="text-2xl font-black text-white">Need Access?</h2>
          <p className="mt-3 leading-7 text-aggie-light/74">
            Student-athletes should activate an account only after Aggies Lead staff has added their profile to the roster.
          </p>
          <Link
            href="/activate-account"
            className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-lg border border-aggie-silver/25 px-5 text-sm font-black text-white transition hover:border-aggie-ice/40 hover:bg-white/10"
          >
            Activate Student-Athlete Account
          </Link>
        </article>
      </section>

      <details className="card-surface rounded-lg p-6">
        <summary className="cursor-pointer text-lg font-black text-white">Development / Test Access</summary>
        <p className="mt-3 leading-7 text-aggie-light/74">
          Prototype shortcuts are kept here for local testing only. Real users should use account login or activation.
        </p>
        <div className="mt-5 grid gap-3 text-sm font-bold text-aggie-light">
          <p className="rounded-lg border border-white/10 bg-white/6 p-4">Admin: admin@aggieslead.local / admin123</p>
          <p className="rounded-lg border border-white/10 bg-white/6 p-4">Coach: coach@aggieslead.local / coach123</p>
          <p className="rounded-lg border border-white/10 bg-white/6 p-4">Student-Athlete: student@aggieslead.local / student123</p>
        </div>
        <section className="mt-5 grid gap-5 lg:grid-cols-3">
          {roleOptions.map((option) => {
            const Icon = option.icon;
            return (
              <article key={option.role} className="rounded-lg border border-white/10 bg-white/6 p-5">
                <span className="grid h-12 w-12 place-items-center rounded-lg border border-aggie-silver/20 bg-aggie-steel/16 text-aggie-ice shadow-steel">
                  <Icon className="h-6 w-6" />
                </span>
                <h2 className="mt-5 text-2xl font-black text-white">{option.title}</h2>
                <p className="mt-3 min-h-24 leading-7 text-aggie-light/74">{option.description}</p>
                <button
                  type="button"
                  onClick={() => handleLogin(option.role)}
                  className="chrome-surface mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-lg border border-aggie-chrome/60 px-5 text-sm font-black text-aggie-navy shadow-glow transition hover:brightness-110"
                >
                  Continue as {option.title}
                </button>
              </article>
            );
          })}
        </section>
      </details>
    </div>
  );
}

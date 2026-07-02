"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Award,
  BarChart3,
  CheckCircle2,
  Clock3,
  Lock,
  Medal,
  Route,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { RoleGate } from "@/components/RoleGate";
import { usePrototypeState } from "@/components/PrototypeState";
import { useAuth } from "@/components/AuthState";
import { readStudentAthletes } from "@/lib/studentAthleteDatabase";
import { calculateEngagementScore, classStanding } from "@/lib/engagement";
import { readEvents } from "@/lib/events";

const totalModules = 10;
const roadmapName = "Sophomore Roadmap";
const nextRecommendedModule = {
  title: "Resume Review & Update",
  href: "/modules/resume-review-and-update",
};

const inProgressModules = [
  "LinkedIn Review & Update",
  "Financial Literacy",
];

const missingModules = [
  "Informational Interview",
  "Professional Network List",
  "Career Confidence Check-In",
];

const upcomingModules = [
  { title: "Guest Speaker Event", href: "/modules/guest-speaker-event" },
  { title: "Aggie Road Trips", href: "/modules/aggie-road-trips" },
  { title: "Job Shadow / Micro-Internship", href: "/modules/job-shadow-micro-internship-sophomore" },
];

const anonymousTeamLeaderboard = [
  { label: "Team A", value: 84, rank: 1 },
  { label: "Your Team", value: 76, rank: 2, highlight: true },
  { label: "Team C", value: 72, rank: 3 },
  { label: "Team D", value: 68, rank: 4 },
  { label: "Team E", value: 61, rank: 5 },
];

export default function StudentAthleteDashboardPage() {
  const { user } = useAuth();
  const state = usePrototypeState();
  const [showWalkthrough, setShowWalkthrough] = useState(false);
  const currentProfile = user
    ? readStudentAthletes().find((record) => record.userId === user.id || record.email === user.email)
    : null;
  const allProfiles = readStudentAthletes().map((record) => ({
    ...record,
    engagementScore: calculateEngagementScore(record, readEvents()),
  }));
  const currentProfileWithScore = currentProfile
    ? allProfiles.find((record) => record.id === currentProfile.id) ?? currentProfile
    : null;
  const standing = currentProfileWithScore ? classStanding(currentProfileWithScore, allProfiles) : null;
  const topClassPercent = standing ? Math.max(1, Math.ceil((standing.rank / standing.totalInClass) * 100)) : 0;
  const currentRoadmapName = currentProfile?.currentRoadmap ?? roadmapName;
  const completedModules = state.completedModules.length;
  const savedProfileCompletion = currentProfile?.completionPercentage ?? 0;
  const overallCompletion = Math.max(Math.min(Math.round((completedModules / totalModules) * 100), 100), savedProfileCompletion);
  const estimatedCompletedModules = Math.max(completedModules, Math.round((overallCompletion / 100) * totalModules));
  const remainingModules = Math.max(totalModules - estimatedCompletedModules, 0);
  const involvementScore = Math.max(completedModules, currentProfileWithScore?.engagementScore ?? 0);
  const completedModuleLabels = state.completedModules.length
    ? state.completedModules.map((slug) => titleFromSlug(slug))
    : ["Helper Helper Setup", "LinkedIn Setup"];

  useEffect(() => {
    if (!user) return;
    setShowWalkthrough(window.localStorage.getItem(`aggies-lead:first-login-walkthrough:${user.id}`) === "pending");
  }, [user]);

  const dismissWalkthrough = () => {
    if (user) window.localStorage.setItem(`aggies-lead:first-login-walkthrough:${user.id}`, "complete");
    setShowWalkthrough(false);
  };

  const overviewCards: { label: string; value: string; icon: LucideIcon; helper: string }[] = [
    { label: "My Roadmap", value: currentRoadmapName, icon: Route, helper: "Private to your student profile" },
    { label: "My Overall Completion %", value: `${overallCompletion}%`, icon: BarChart3, helper: "Your roadmap progress" },
    { label: "Completed Modules", value: String(Math.max(completedModuleLabels.length, estimatedCompletedModules)), icon: CheckCircle2, helper: "Modules marked complete" },
    { label: "Remaining Modules", value: String(remainingModules), icon: Clock3, helper: "Modules still recommended" },
    { label: "Next Recommended Module", value: nextRecommendedModule.title, icon: Award, helper: "Suggested next step" },
    { label: "My Involvement Score", value: String(involvementScore), icon: TrendingUp, helper: "Private engagement score" },
  ];

  return (
    <RoleGate allowed={["student-athlete"]}>
      <div className="space-y-8">
        <section className="card-surface rounded-lg p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.28em] text-aggie-silver">
                Student-Athlete Dashboard
              </p>
              <h1 className="text-glow mt-3 text-4xl font-black tracking-tight text-white md:text-6xl">
                My Progress
              </h1>
              <p className="mt-4 max-w-4xl text-lg leading-8 text-aggie-light/78">
                View your personal roadmap progress, next recommended modules, and anonymous rankings without exposing other student-athletes' private data.
              </p>
            </div>
            <div className="rounded-lg border border-aggie-silver/15 bg-white/[0.045] p-4">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-aggie-silver">Privacy Scope</p>
              <p className="mt-2 text-sm font-bold text-aggie-light">Only your personal data is shown</p>
            </div>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {overviewCards.map((card) => (
            <OverviewCard key={card.label} {...card} />
          ))}
        </section>

        {showWalkthrough ? (
          <section className="card-surface rounded-lg border border-aggie-ice/30 p-6">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-aggie-silver">First-Time User Walkthrough</p>
            <h2 className="mt-2 text-3xl font-black text-white">Welcome to Aggies Lead</h2>
            <p className="mt-3 max-w-4xl leading-7 text-aggie-light/76">
              Start by reviewing your dashboard, completing your career profile, and opening My Roadmap to begin your assigned modules.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <Link href="/profile" className="chrome-surface inline-flex min-h-11 items-center justify-center rounded-lg border border-aggie-chrome/60 px-4 text-sm font-black text-aggie-navy shadow-glow transition hover:brightness-110">
                Complete My Career Profile
              </Link>
              <Link href="/my-roadmap" className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/10 bg-white/6 px-4 text-sm font-black text-white transition hover:bg-white/10">
                Open My Roadmap
              </Link>
              <button type="button" onClick={dismissWalkthrough} className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/10 bg-white/6 px-4 text-sm font-black text-white transition hover:bg-white/10">
                Dismiss
              </button>
            </div>
          </section>
        ) : null}

        <section className="grid gap-5 xl:grid-cols-[1fr_0.85fr]">
          <article className="card-surface rounded-lg p-6">
            <div className="flex items-center gap-3">
              <Route className="h-6 w-6 text-aggie-ice" />
              <h2 className="text-2xl font-black text-white">My Progress</h2>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <ModuleList title="Completed Modules" items={completedModuleLabels} tone="complete" />
              <ModuleList title="In-Progress Modules" items={inProgressModules} tone="progress" />
              <ModuleList title="Missing Modules" items={missingModules} tone="missing" />
              <div className="rounded-lg border border-white/10 bg-white/6 p-4">
                <h3 className="text-lg font-black text-white">Upcoming Recommended Modules</h3>
                <div className="mt-4 space-y-3">
                  {upcomingModules.map((module) => (
                    <Link
                      key={module.title}
                      href={module.href}
                      className="block rounded-lg border border-white/10 bg-black/15 p-3 text-sm font-bold text-aggie-light transition hover:border-aggie-ice/40 hover:bg-white/10"
                    >
                      {module.title}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <Link
              href={nextRecommendedModule.href}
              className="chrome-surface mt-5 inline-flex min-h-12 items-center justify-center rounded-lg border border-aggie-chrome/60 px-5 text-sm font-black text-aggie-navy shadow-glow transition hover:brightness-110"
            >
              Continue Next Recommended Module
            </Link>
          </article>

          <article className="card-surface rounded-lg p-6">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 text-aggie-ice" />
              <h2 className="text-2xl font-black text-white">Private Data Guardrails</h2>
            </div>
            <div className="mt-5 space-y-3">
              {[
                "You can see your own progress and recommendations.",
                "Team rankings are anonymous except for your team.",
                "Class/year rankings do not show other student-athlete names.",
                "No individual data from other student-athletes is displayed.",
              ].map((item) => (
                <div key={item} className="rounded-lg border border-white/10 bg-white/6 p-4 text-sm font-bold leading-6 text-aggie-light">
                  {item}
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="grid gap-5 xl:grid-cols-[1fr_0.9fr]">
          <article className="card-surface rounded-lg p-6">
            <div className="flex items-center gap-3">
              <Medal className="h-6 w-6 text-aggie-ice" />
              <h2 className="text-2xl font-black text-white">Team Ranking</h2>
            </div>
            <p className="mt-4 leading-7 text-aggie-light/74">
              Your team ranking is shown anonymously against other USU teams. Individual student-athlete data from other teams is hidden.
            </p>
            <div className="mt-5 space-y-3">
              {anonymousTeamLeaderboard.map((team) => (
                <div key={team.label} className={`rounded-lg border p-4 ${team.highlight ? "border-aggie-ice/40 bg-aggie-ice/10" : "border-white/10 bg-white/6"}`}>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-black text-white">#{team.rank} {team.label}</p>
                      <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-aggie-muted">
                        {team.highlight ? "Your assigned team" : "Anonymous comparison"}
                      </p>
                    </div>
                    <p className="text-2xl font-black text-white">{team.value}%</p>
                  </div>
                  <div className="mt-3 h-2.5 rounded-full bg-white/10">
                    <div className="h-2.5 rounded-full bg-aggie-ice" style={{ width: `${team.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="card-surface rounded-lg p-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-6 w-6 text-aggie-ice" />
              <h2 className="text-2xl font-black text-white">Class / Year Ranking</h2>
            </div>
            <div className="mt-5 space-y-4">
              <RankCard text={standing ? `You are ${standing.rank} out of ${standing.totalInClass} ${currentProfileWithScore?.classYear.toLowerCase()}s.` : "Class rank will appear after your profile is loaded."} />
              <RankCard text={standing ? `You are in the top ${topClassPercent}% of your class.` : "Percentile will appear after your profile is loaded."} />
              <RankCard text={standing ? `You have more engagement points than ${standing.completedMoreThanPercent}% of student-athletes in your year.` : "Anonymous class comparison will appear after your profile is loaded."} />
            </div>
            <p className="mt-5 flex items-start gap-2 rounded-lg border border-white/10 bg-white/6 p-4 text-sm font-bold leading-6 text-aggie-light">
              <Lock className="mt-0.5 h-4 w-4 shrink-0 text-aggie-ice" />
              Rankings are anonymous. Other student-athlete names and individual records are never shown here.
            </p>
          </article>
        </section>
      </div>
    </RoleGate>
  );
}

function OverviewCard({ label, value, icon: Icon, helper }: { label: string; value: string; icon: LucideIcon; helper: string }) {
  return (
    <article className="card-surface rounded-lg p-6">
      <Icon className="h-6 w-6 text-aggie-ice" />
      <p className="mt-4 text-sm font-bold uppercase tracking-[0.18em] text-aggie-silver">{label}</p>
      <p className="mt-2 text-3xl font-black text-white">{value}</p>
      <p className="mt-3 text-sm font-semibold leading-6 text-aggie-muted">{helper}</p>
    </article>
  );
}

function ModuleList({ title, items, tone }: { title: string; items: string[]; tone: "complete" | "progress" | "missing" }) {
  const toneClass = {
    complete: "border-emerald-300/25 bg-emerald-300/10",
    progress: "border-aggie-ice/25 bg-aggie-ice/10",
    missing: "border-red-300/25 bg-red-300/10",
  }[tone];

  return (
    <div className="rounded-lg border border-white/10 bg-white/6 p-4">
      <h3 className="text-lg font-black text-white">{title}</h3>
      <div className="mt-4 space-y-2">
        {items.map((item) => (
          <div key={item} className={`rounded-lg border p-3 text-sm font-bold text-aggie-light ${toneClass}`}>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function RankCard({ text }: { text: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/6 p-4">
      <p className="text-lg font-black text-white">{text}</p>
    </div>
  );
}

function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

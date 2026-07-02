"use client";

import Link from "next/link";
import { CheckCircle2, Clock3, Route } from "lucide-react";
import { roadmapModules, moduleHref, roadmapTitles, slug } from "@/lib/roadmaps";
import { usePrototypeState } from "@/components/PrototypeState";
import { useAuth } from "@/components/AuthState";
import { readStudentAthletes } from "@/lib/studentAthleteDatabase";
import type { RoadmapKey } from "@/lib/roadmaps";

const descriptions: Record<string, string> = {
  "Helper Helper Setup": "Set up hour tracking and app navigation.",
  "LinkedIn Setup": "Build your professional profile foundation.",
  "Campus Navigation + Who You Should Know":
    "Explore key athletics and campus locations, learn what each space is used for, and find the staff or coaches connected to each building.",
  "Aggie Shuttle Guide":
    "Learn how to navigate campus using the Aggie Shuttle system, view route maps, and access real-time shuttle tracking.",
  "Career Exploration":
    "Discover career paths that match your interests, strengths, and goals while exploring opportunities beyond athletics.",
  "Resume Basics":
    "Learn the fundamentals of building a strong resume, highlighting your experiences, and preparing for internships, jobs, and graduate school opportunities.",
  "Intro to Networking":
    "Develop the skills to build meaningful professional relationships, expand your network, and create opportunities for future career success.",
};

export default function MyRoadmapPage() {
  const state = usePrototypeState();
  const { user } = useAuth();
  const profile = user ? readStudentAthletes().find((record) => record.userId === user.id || record.email === user.email) : null;
  const roadmapKeys = roadmapKeysForProfile(profile?.currentRoadmap, profile?.transferStatus);
  const modules = roadmapKeys.flatMap((key) => roadmapModules[key]);
  const roadmapHeading = roadmapKeys.map((key) => roadmapTitles[key]).join(" + ");

  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm font-bold uppercase tracking-[0.28em] text-aggie-silver">
          My Roadmap
        </p>
        <h1 className="text-glow mt-3 text-4xl font-black tracking-tight text-white md:text-5xl">
          {roadmapHeading}
        </h1>
        <p className="mt-4 max-w-4xl text-lg leading-8 text-aggie-light/78">
          This roadmap reflects your assigned Aggies Lead path. Transfer student-athletes may see Transfer Add-Ons along with their assigned year-based roadmap.
        </p>
        <Link
          href="/roadmaps"
          className="mt-5 inline-flex min-h-11 items-center rounded-lg border border-aggie-silver/25 px-4 text-sm font-bold text-white transition hover:bg-white/10"
        >
          View All Roadmaps
        </Link>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        {modules.map((title, index) => {
          const moduleSlug = slug(title);
          const complete =
            state.completedModules.includes(moduleSlug) ||
            (title === "Helper Helper Setup" && state.helperHelperComplete) ||
            (title === "LinkedIn Setup" && state.linkedInComplete);
          return (
            <article key={title} className="card-surface rounded-lg p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.2em] text-aggie-silver">
                    Module {index + 1}
                  </p>
                  <h2 className="mt-2 text-2xl font-black text-white">{title}</h2>
                </div>
                {complete ? (
                  <CheckCircle2 className="h-7 w-7 shrink-0 text-emerald-300" />
                ) : (
                  <Route className="h-7 w-7 shrink-0 text-aggie-ice" />
                )}
              </div>
              <p className="mt-3 leading-7 text-aggie-light/72">
                {descriptions[title] ?? `Content coming soon. This space is reserved for ${title}.`}
              </p>
              <div className="mt-4 flex items-center gap-2 text-sm font-bold text-aggie-muted">
                <Clock3 className="h-4 w-4" />
                Estimated time: 10 minutes
              </div>
              <Link
                href={moduleHref(title)}
                className="chrome-surface mt-5 inline-flex min-h-11 items-center rounded-lg border border-aggie-chrome/60 px-4 text-sm font-black text-aggie-navy shadow-steel"
              >
                {complete ? "Continue" : "Start"} {title}
              </Link>
            </article>
          );
        })}
      </section>
    </div>
  );
}

function roadmapKeysForProfile(currentRoadmap = "", transferStatus = ""): RoadmapKey[] {
  const normalized = currentRoadmap.toLowerCase();
  const keys: RoadmapKey[] = [];
  if (transferStatus.toLowerCase().includes("transfer") || normalized.includes("transfer")) keys.push("transfer");
  if (normalized.includes("freshman") || normalized.includes("first")) keys.push("freshman");
  if (normalized.includes("sophomore") || normalized.includes("second")) keys.push("sophomore");
  if (normalized.includes("junior") || normalized.includes("third")) keys.push("junior");
  if (normalized.includes("senior") || normalized.includes("fourth")) keys.push("senior");
  if (normalized.includes("graduate") || normalized.includes("5th") || normalized.includes("fifth")) keys.push("graduate");
  return keys.length ? Array.from(new Set(keys)) : ["freshman"];
}

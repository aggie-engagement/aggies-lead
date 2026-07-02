"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Check,
  Clock3,
  Lightbulb,
  Network,
  Plus,
  RefreshCw,
  Save,
  UserRound,
} from "lucide-react";
import { GhostButton } from "@/components/Prototype";

const storageKey = "aggies-lead:sophomore:linkedin-review-update";

const checklistItems = [
  "Professional profile photo added",
  "Headline updated",
  "About section completed or refreshed",
  "Education section is current",
  "Student-athlete experience is included",
  "Leadership, jobs, internships, or volunteer experience added",
  "Skills section includes at least 10 skills",
  "Contact information is professional",
  "Connected with at least 10 new people this year",
  "Followed companies, industries, or organizations of interest",
];

const headlineExamples = [
  "Student-Athlete at Utah State University | Business Major | Interested in Marketing and Sales",
  "Utah State Student-Athlete | Kinesiology Major | Aspiring Physical Therapist",
  "Student-Athlete | Communication Studies Major | Interested in Sports Media and Community Engagement",
];

const experienceOptions = [
  "Internships",
  "Jobs",
  "Leadership roles",
  "SAAC involvement",
  "Community service",
  "Volunteer experience",
  "Research projects",
  "Certifications",
  "Aggies Lead participation",
];

type LinkedInReviewState = {
  checkedItems: string[];
  reviewedProfile: boolean;
  headlineDraft: string;
  selectedExperiences: string[];
  experienceNotes: string;
  newConnectionsGoalMet: boolean;
  moduleStatus: "Not Started" | "In Progress" | "Completed";
  progressPercentage: number;
};

const initialState: LinkedInReviewState = {
  checkedItems: [],
  reviewedProfile: false,
  headlineDraft: "",
  selectedExperiences: [],
  experienceNotes: "",
  newConnectionsGoalMet: false,
  moduleStatus: "Not Started",
  progressPercentage: 0,
};

export function LinkedInReviewUpdateClient() {
  const [form, setForm] = useState<LinkedInReviewState>(initialState);
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) return;

    try {
      setForm({ ...initialState, ...JSON.parse(saved) });
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, []);

  const canComplete = form.checkedItems.length === checklistItems.length || form.reviewedProfile;

  const completion = useMemo(() => {
    const tasks = [
      form.checkedItems.length > 0,
      form.headlineDraft.trim().length > 0,
      form.selectedExperiences.length > 0 || form.experienceNotes.trim().length > 0,
      form.newConnectionsGoalMet,
      canComplete,
    ];
    const completed = tasks.filter(Boolean).length;
    const percent = form.moduleStatus === "Completed" ? 100 : Math.round((completed / tasks.length) * 100);
    return { completed, total: tasks.length, percent };
  }, [canComplete, form]);

  useEffect(() => {
    setForm((current) => {
      if (current.moduleStatus === "Completed") {
        if (current.progressPercentage === 100) return current;
        return { ...current, progressPercentage: 100 };
      }

      const nextStatus = completion.percent > 0 ? "In Progress" : "Not Started";
      if (current.moduleStatus === nextStatus && current.progressPercentage === completion.percent) {
        return current;
      }

      return { ...current, moduleStatus: nextStatus, progressPercentage: completion.percent };
    });
  }, [completion.percent]);

  function toggleList(field: "checkedItems" | "selectedExperiences", value: string) {
    setSavedMessage("");
    setForm((current) => {
      const list = current[field];
      return {
        ...current,
        [field]: list.includes(value) ? list.filter((item) => item !== value) : [...list, value],
      };
    });
  }

  function updateField<K extends keyof LinkedInReviewState>(field: K, value: LinkedInReviewState[K]) {
    setSavedMessage("");
    setForm((current) => ({ ...current, [field]: value }));
  }

  function saveProgress() {
    window.localStorage.setItem(storageKey, JSON.stringify(form));
    setSavedMessage("Progress saved on this device.");
  }

  function resetModule() {
    window.localStorage.removeItem(storageKey);
    setForm(initialState);
    setSavedMessage("Module reset.");
  }

  function completeModule() {
    if (!canComplete) return;
    const completedState = {
      ...form,
      moduleStatus: "Completed" as const,
      progressPercentage: 100,
    };
    setForm(completedState);
    window.localStorage.setItem(storageKey, JSON.stringify(completedState));
    setSavedMessage("LinkedIn Review & Update marked complete.");
  }

  return (
    <div className="space-y-6">
      <GhostButton href="/roadmaps/sophomore">Back to Sophomore Roadmap</GhostButton>

      <section className="card-surface rounded-lg p-6 md:p-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-aggie-silver">Sophomore Roadmap</p>
            <h1 className="text-glow mt-3 text-4xl font-black tracking-tight text-white md:text-5xl">
              LinkedIn Review & Update
            </h1>
            <p className="mt-4 text-lg leading-8 text-aggie-light/78">
              Review, strengthen, and update your LinkedIn profile so it reflects your current experiences,
              interests, skills, and future career goals.
            </p>
            <p className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-aggie-muted">
              <Clock3 className="h-4 w-4" />
              Estimated Time: 10 Minutes
            </p>
          </div>
          <ProgressPanel
            completed={completion.completed}
            percent={form.progressPercentage}
            status={form.moduleStatus}
            total={completion.total}
          />
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <main className="space-y-6">
          <Card title="Why This Matters" icon={<Lightbulb className="h-6 w-6" />}>
            <p className="leading-7 text-aggie-light/80">
              Your LinkedIn profile should grow as you gain new experiences. Keeping it updated helps employers,
              alumni, and professional connections understand who you are beyond athletics and what opportunities
              you are preparing for.
            </p>
          </Card>

          <Card title="Profile Review Checklist" icon={<Check className="h-6 w-6" />}>
            <div className="grid gap-3 md:grid-cols-2">
              {checklistItems.map((item) => {
                const selected = form.checkedItems.includes(item);
                return (
                  <CheckboxButton
                    key={item}
                    selected={selected}
                    label={item}
                    onClick={() => toggleList("checkedItems", item)}
                  />
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => updateField("reviewedProfile", !form.reviewedProfile)}
              className={`mt-5 flex w-full items-start gap-3 rounded-lg border p-4 text-left transition ${
                form.reviewedProfile
                  ? "border-aggie-chrome/45 bg-white/[0.1] text-white"
                  : "border-aggie-silver/15 bg-white/[0.045] text-aggie-light/78 hover:border-aggie-steel hover:bg-white/10"
              }`}
            >
              <span
                className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md ${
                  form.reviewedProfile ? "chrome-surface text-aggie-navy" : "border border-aggie-silver/25"
                }`}
              >
                {form.reviewedProfile && <Check className="h-4 w-4" />}
              </span>
              <span>
                <span className="block font-black">I reviewed my profile and made updates where needed.</span>
                <span className="mt-1 block text-sm leading-6 text-aggie-light/70">
                  Use this if an item does not apply to your profile yet.
                </span>
              </span>
            </button>
          </Card>

          <Card title="Update Your Headline" icon={<UserRound className="h-6 w-6" />}>
            <p className="leading-7 text-aggie-light/80">
              Your headline should quickly explain who you are, what you study, and what career areas interest you.
            </p>
            <div className="mt-5 grid gap-3">
              {headlineExamples.map((example) => (
                <button
                  key={example}
                  type="button"
                  onClick={() => updateField("headlineDraft", example)}
                  className="rounded-lg border border-aggie-silver/15 bg-white/[0.045] p-4 text-left text-sm font-bold leading-6 text-aggie-light/82 transition hover:border-aggie-steel hover:bg-white/10"
                >
                  {example}
                </button>
              ))}
            </div>
            <label className="mt-5 block">
              <span className="text-sm font-black uppercase tracking-[0.18em] text-aggie-silver">My headline draft</span>
              <input
                value={form.headlineDraft}
                onChange={(event) => updateField("headlineDraft", event.target.value)}
                className="mt-3 min-h-12 w-full rounded-lg border border-aggie-silver/15 bg-aggie-navy/80 px-4 text-white outline-none placeholder:text-aggie-muted focus:border-aggie-steel"
                placeholder="Write or customize your LinkedIn headline"
              />
            </label>
          </Card>

          <Card title="Add New Experiences" icon={<Plus className="h-6 w-6" />}>
            <p className="leading-7 text-aggie-light/80">
              Add any new internships, jobs, leadership roles, SAAC involvement, community service, volunteer
              experience, research projects, certifications, or Aggies Lead participation.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {experienceOptions.map((option) => (
                <CheckboxButton
                  key={option}
                  selected={form.selectedExperiences.includes(option)}
                  label={option}
                  onClick={() => toggleList("selectedExperiences", option)}
                />
              ))}
            </div>
            <label className="mt-5 block">
              <span className="text-sm font-black uppercase tracking-[0.18em] text-aggie-silver">Experience notes</span>
              <textarea
                value={form.experienceNotes}
                onChange={(event) => updateField("experienceNotes", event.target.value)}
                className="mt-3 min-h-28 w-full rounded-lg border border-aggie-silver/15 bg-aggie-navy/80 px-4 py-3 text-white outline-none placeholder:text-aggie-muted focus:border-aggie-steel"
                placeholder="List what you need to add or refresh on LinkedIn."
              />
            </label>
          </Card>

          <Card title="Grow Your Network" icon={<Network className="h-6 w-6" />}>
            <p className="leading-7 text-aggie-light/80">
              LinkedIn is most useful when you actively build your network. Start by connecting with teammates,
              coaches, professors, alumni, employers, and professionals in career fields that interest you.
            </p>
            <button
              type="button"
              onClick={() => updateField("newConnectionsGoalMet", !form.newConnectionsGoalMet)}
              className={`mt-5 flex w-full items-center gap-3 rounded-lg border p-4 text-left text-sm font-bold transition ${
                form.newConnectionsGoalMet
                  ? "border-aggie-chrome/45 bg-white/[0.1] text-white"
                  : "border-aggie-silver/15 bg-white/[0.045] text-aggie-light/78 hover:border-aggie-steel hover:bg-white/10"
              }`}
            >
              <span
                className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg ${
                  form.newConnectionsGoalMet ? "chrome-surface text-aggie-navy" : "border border-aggie-silver/20"
                }`}
              >
                {form.newConnectionsGoalMet && <Check className="h-4 w-4" />}
              </span>
              Connect with at least 10 new people.
            </button>
          </Card>

          <Card title="Module Completion" icon={<Check className="h-6 w-6" />}>
            <p className="leading-7 text-aggie-light/80">
              Complete the profile checklist or confirm that you reviewed your LinkedIn profile before marking
              this module complete.
            </p>
            <button
              type="button"
              onClick={completeModule}
              disabled={!canComplete}
              className={`mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg px-5 text-sm font-black transition sm:w-auto ${
                canComplete
                  ? "chrome-surface border border-aggie-chrome/60 text-aggie-navy shadow-glow hover:brightness-110"
                  : "cursor-not-allowed border border-aggie-silver/15 bg-white/[0.04] text-aggie-muted"
              }`}
            >
              <Check className="h-4 w-4" />
              LinkedIn Profile Reviewed & Updated
            </button>
            {form.moduleStatus === "Completed" && (
              <p className="mt-5 rounded-lg border border-aggie-chrome/30 bg-white/[0.08] p-4 text-sm font-bold leading-6 text-aggie-ice">
                Nice work. Your LinkedIn profile is now reviewed and ready to better reflect your current goals.
              </p>
            )}
          </Card>
        </main>

        <aside className="space-y-6">
          <section className="card-surface rounded-lg p-5">
            <h2 className="text-xl font-black text-white">Save Options</h2>
            <p className="mt-2 text-sm leading-6 text-aggie-light/72">
              Save your progress locally on this device or reset this module back to the start.
            </p>
            <div className="mt-5 grid gap-3">
              <ActionButton onClick={saveProgress} icon={<Save className="h-4 w-4" />} primary>
                Save Progress
              </ActionButton>
              <ActionButton onClick={resetModule} icon={<RefreshCw className="h-4 w-4" />}>
                Reset Module
              </ActionButton>
            </div>
            {savedMessage && (
              <p className="mt-4 rounded-lg border border-aggie-silver/15 bg-white/[0.045] p-3 text-sm font-bold text-aggie-light/80">
                {savedMessage}
              </p>
            )}
          </section>

          <section className="card-surface rounded-lg p-5">
            <h2 className="text-xl font-black text-white">Review Snapshot</h2>
            <div className="mt-4 space-y-3 text-sm font-bold text-aggie-light/78">
              <Snapshot label="Checklist Items" value={`${form.checkedItems.length}/${checklistItems.length}`} />
              <Snapshot label="Headline Draft" value={form.headlineDraft.trim() ? "Started" : "Not Started"} />
              <Snapshot label="New Experience Areas" value={`${form.selectedExperiences.length}`} />
              <Snapshot label="Network Action" value={form.newConnectionsGoalMet ? "Reviewed" : "Pending"} />
            </div>
          </section>

          <Link
            href="/my-roadmap"
            className="inline-flex min-h-12 w-full items-center justify-center rounded-lg border border-aggie-silver/25 px-5 text-sm font-bold text-white transition hover:border-aggie-steel hover:bg-white/10"
          >
            Back to My Roadmap
          </Link>
        </aside>
      </div>
    </div>
  );
}

function ProgressPanel({ completed, percent, status, total }: { completed: number; percent: number; status: string; total: number }) {
  return (
    <div className="w-full rounded-lg border border-aggie-silver/15 bg-white/[0.045] p-5 lg:max-w-sm">
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-black uppercase tracking-[0.2em] text-aggie-silver">{status}</span>
        <span className="text-2xl font-black text-white">{percent}%</span>
      </div>
      <div className="mt-4 h-3 overflow-hidden rounded-full bg-aggie-navy/80">
        <div className="h-full rounded-full chrome-surface transition-all duration-500" style={{ width: `${percent}%` }} />
      </div>
      <p className="mt-3 text-sm font-medium text-aggie-light/72">
        {completed} of {total} sections complete
      </p>
    </div>
  );
}

function Card({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="card-surface rounded-lg p-6">
      <div className="mb-5 flex items-center gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-aggie-silver/20 bg-aggie-steel/16 text-aggie-ice shadow-steel">
          {icon}
        </span>
        <h2 className="text-2xl font-black text-white">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function CheckboxButton({ selected, label, onClick }: { selected: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-14 items-center gap-3 rounded-lg border p-4 text-left text-sm font-bold transition ${
        selected
          ? "border-aggie-chrome/45 bg-white/[0.1] text-white"
          : "border-aggie-silver/15 bg-white/[0.045] text-aggie-light/78 hover:border-aggie-steel hover:bg-white/10"
      }`}
    >
      <span
        className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg ${
          selected ? "chrome-surface text-aggie-navy" : "border border-aggie-silver/20 text-aggie-muted"
        }`}
      >
        {selected && <Check className="h-4 w-4" />}
      </span>
      {label}
    </button>
  );
}

function ActionButton({
  children,
  icon,
  onClick,
  primary = false,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
  onClick: () => void;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-4 text-sm font-black transition ${
        primary
          ? "chrome-surface border border-aggie-chrome/60 text-aggie-navy shadow-glow hover:brightness-110"
          : "border border-aggie-silver/20 bg-white/[0.045] text-white hover:border-aggie-steel hover:bg-white/10"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

function Snapshot({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-aggie-silver/15 bg-white/[0.045] p-3">
      <span>{label}</span>
      <span className="text-white">{value}</span>
    </div>
  );
}

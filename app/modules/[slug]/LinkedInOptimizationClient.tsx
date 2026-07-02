"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Check, Clock3, LinkIcon, Network, RefreshCw, Save, Search, Sparkles, Target } from "lucide-react";
import { GhostButton } from "@/components/Prototype";
import { usePrototypeState } from "@/components/PrototypeState";

const moduleSlug = "linkedin-optimization";
const storageKey = "aggies-lead:junior:linkedin-optimization";

const auditItems = [
  "Professional profile photo",
  "Professional banner image",
  "Strong headline",
  "Updated About section",
  "Current experiences added",
  "Leadership experiences added",
  "Skills section updated",
  "Contact information updated",
  "100+ connections",
  "Customized LinkedIn URL",
];

const headlineExamples = [
  "Student-Athlete at Utah State University | Finance Major | Seeking Internship Opportunities in Wealth Management",
  "Utah State Student-Athlete | Kinesiology Major | Interested in Physical Therapy and Human Performance",
  "Student-Athlete | Communications Major | Sports Media, Marketing, and Community Engagement",
];

const credibilityItems = [
  "Added internship experience",
  "Added work experience",
  "Added volunteer experience",
  "Added certifications",
  "Added leadership experiences",
];

const engagementItems = [
  "10 new connections",
  "Follow 5 organizations",
  "Follow 5 professionals",
  "Engage with 3 posts",
];

const strengthOptions = [
  "Needs Major Updates",
  "Getting Stronger",
  "Ready for Internship Networking",
  "Ready for Employers and Recruiters",
];

type LinkedInOptimizationState = {
  auditChecklist: string[];
  selectedHeadline: string;
  headlineDraft: string;
  credibilityChecklist: string[];
  engagementChallenge: string[];
  strengthScore: string;
  moduleStatus: "Not Started" | "In Progress" | "Completed";
  progressPercentage: number;
};

const initialState: LinkedInOptimizationState = {
  auditChecklist: [],
  selectedHeadline: "",
  headlineDraft: "",
  credibilityChecklist: [],
  engagementChallenge: [],
  strengthScore: "",
  moduleStatus: "Not Started",
  progressPercentage: 0,
};

export function LinkedInOptimizationClient() {
  const { completeModule } = usePrototypeState();
  const [form, setForm] = useState<LinkedInOptimizationState>(initialState);
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

  const completion = useMemo(() => {
    const tasks = [
      form.auditChecklist.length > 0,
      form.headlineDraft.trim().length > 0 || Boolean(form.selectedHeadline),
      form.credibilityChecklist.length > 0,
      form.engagementChallenge.length > 0,
      Boolean(form.strengthScore),
      form.moduleStatus === "Completed",
    ];
    const completed = tasks.filter(Boolean).length;
    const percent = form.moduleStatus === "Completed" ? 100 : Math.round((completed / tasks.length) * 100);
    return { completed, total: tasks.length, percent };
  }, [form]);

  useEffect(() => {
    setForm((current) => {
      if (current.moduleStatus === "Completed") {
        return current.progressPercentage === 100 ? current : { ...current, progressPercentage: 100 };
      }

      const nextStatus = completion.percent > 0 ? "In Progress" : "Not Started";
      if (current.moduleStatus === nextStatus && current.progressPercentage === completion.percent) return current;
      return { ...current, moduleStatus: nextStatus, progressPercentage: completion.percent };
    });
  }, [completion.percent]);

  function toggleList(field: "auditChecklist" | "credibilityChecklist" | "engagementChallenge", value: string) {
    setSavedMessage("");
    setForm((current) => {
      const list = current[field];
      return {
        ...current,
        [field]: list.includes(value) ? list.filter((item) => item !== value) : [...list, value],
      };
    });
  }

  function updateField<K extends keyof LinkedInOptimizationState>(field: K, value: LinkedInOptimizationState[K]) {
    setSavedMessage("");
    setForm((current) => ({ ...current, [field]: value }));
  }

  function chooseHeadline(example: string) {
    setSavedMessage("");
    setForm((current) => ({ ...current, selectedHeadline: example, headlineDraft: example }));
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

  function markComplete() {
    const completedState = { ...form, moduleStatus: "Completed" as const, progressPercentage: 100 };
    setForm(completedState);
    window.localStorage.setItem(storageKey, JSON.stringify(completedState));
    completeModule(moduleSlug);
    setSavedMessage("LinkedIn Optimization completed.");
  }

  return (
    <div className="space-y-6">
      <GhostButton href="/roadmaps/junior">Back to Junior Roadmap</GhostButton>

      <section className="card-surface rounded-lg p-6 md:p-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-aggie-silver">Junior Roadmap</p>
            <h1 className="text-glow mt-3 text-4xl font-black tracking-tight text-white md:text-5xl">
              LinkedIn Optimization
            </h1>
            <p className="mt-4 text-lg leading-8 text-aggie-light/78">
              Your LinkedIn profile should do more than exist-it should actively support your career goals. This module
              focuses on optimizing your profile for internships, networking opportunities, and future employment.
            </p>
            <p className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-aggie-muted">
              <Clock3 className="h-4 w-4" />
              Estimated Time: 10 minutes
            </p>
          </div>
          <ProgressPanel completed={completion.completed} percent={form.progressPercentage} status={form.moduleStatus} total={completion.total} />
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <main className="space-y-6">
          <Card title="LinkedIn Profile Audit" icon={<Search className="h-6 w-6" />}>
            <div className="grid gap-3 md:grid-cols-2">
              {auditItems.map((item) => (
                <ToggleCard key={item} selected={form.auditChecklist.includes(item)} label={item} onClick={() => toggleList("auditChecklist", item)} />
              ))}
            </div>
          </Card>

          <Card title="Optimize Your Headline" icon={<Sparkles className="h-6 w-6" />}>
            <p className="leading-7 text-aggie-light/80">
              A strong headline should quickly show who you are, what you study, and what opportunities or industries
              you are pursuing. Use clear keywords employers might search for, such as internship, marketing, finance,
              sports media, physical therapy, data analytics, sales, or graduate school.
            </p>
            <div className="mt-5 grid gap-3">
              {headlineExamples.map((example) => (
                <button
                  key={example}
                  type="button"
                  onClick={() => chooseHeadline(example)}
                  className="rounded-lg border border-aggie-silver/15 bg-white/[0.045] p-4 text-left text-sm font-bold leading-6 text-aggie-light/82 transition hover:border-aggie-steel hover:bg-white/10"
                >
                  {example}
                </button>
              ))}
            </div>
            <label className="mt-5 block">
              <span className="text-sm font-black uppercase tracking-[0.16em] text-aggie-silver">My optimized headline</span>
              <input
                value={form.headlineDraft}
                onChange={(event) => updateField("headlineDraft", event.target.value)}
                className="mt-2 min-h-12 w-full rounded-lg border border-aggie-silver/15 bg-aggie-navy/80 px-4 text-white outline-none placeholder:text-aggie-muted focus:border-aggie-steel"
                placeholder="Write your optimized LinkedIn headline"
              />
            </label>
          </Card>

          <Card title="Build Credibility" icon={<Check className="h-6 w-6" />}>
            <div className="grid gap-3 md:grid-cols-2">
              {credibilityItems.map((item) => (
                <ToggleCard key={item} selected={form.credibilityChecklist.includes(item)} label={item} onClick={() => toggleList("credibilityChecklist", item)} />
              ))}
            </div>
          </Card>

          <Card title="LinkedIn Engagement Challenge" icon={<Network className="h-6 w-6" />}>
            <p className="mb-5 leading-7 text-aggie-light/80">Complete at least:</p>
            <div className="grid gap-3 md:grid-cols-2">
              {engagementItems.map((item) => (
                <ToggleCard key={item} selected={form.engagementChallenge.includes(item)} label={item} onClick={() => toggleList("engagementChallenge", item)} />
              ))}
            </div>
          </Card>

          <Card title="Profile Strength Score" icon={<Target className="h-6 w-6" />}>
            <p className="leading-7 text-aggie-light/80">Create a self-assessment.</p>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {strengthOptions.map((option) => (
                <ToggleCard key={option} selected={form.strengthScore === option} label={option} onClick={() => updateField("strengthScore", option)} />
              ))}
            </div>
          </Card>

          <Card title="Module Completion" icon={<Check className="h-6 w-6" />}>
            <button
              type="button"
              onClick={markComplete}
              className="chrome-surface inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border border-aggie-chrome/60 px-5 text-sm font-black text-aggie-navy shadow-glow transition hover:brightness-110 sm:w-auto"
            >
              <Check className="h-4 w-4" />
              LinkedIn Optimization Completed
            </button>
            {form.moduleStatus === "Completed" && (
              <p className="mt-5 rounded-lg border border-aggie-chrome/30 bg-white/[0.08] p-4 text-sm font-bold leading-6 text-aggie-ice">
                LinkedIn Optimization complete. Keep your profile active as you pursue internships, fellowships, and professional opportunities.
              </p>
            )}
          </Card>
        </main>

        <aside className="space-y-6">
          <section className="card-surface rounded-lg p-5">
            <h2 className="text-xl font-black text-white">Save Options</h2>
            <p className="mt-2 text-sm leading-6 text-aggie-light/72">Save your progress locally or reset this module.</p>
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
            <h2 className="text-xl font-black text-white">Optimization Snapshot</h2>
            <div className="mt-4 space-y-3 text-sm font-bold text-aggie-light/78">
              <Snapshot label="Audit" value={`${form.auditChecklist.length}/${auditItems.length}`} />
              <Snapshot label="Credibility" value={`${form.credibilityChecklist.length}/${credibilityItems.length}`} />
              <Snapshot label="Engagement" value={`${form.engagementChallenge.length}/${engagementItems.length}`} />
              <Snapshot label="Strength" value={form.strengthScore || "Not Rated"} />
            </div>
          </section>

          <Link href="/my-roadmap" className="inline-flex min-h-12 w-full items-center justify-center rounded-lg border border-aggie-silver/25 px-5 text-sm font-bold text-white transition hover:border-aggie-steel hover:bg-white/10">
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
      <p className="mt-3 text-sm font-medium text-aggie-light/72">{completed} of {total} LinkedIn steps complete</p>
    </div>
  );
}

function Card({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="card-surface rounded-lg p-6">
      <div className="mb-5 flex items-center gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-aggie-silver/20 bg-aggie-steel/16 text-aggie-ice shadow-steel">{icon}</span>
        <h2 className="text-2xl font-black text-white">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function ToggleCard({ selected, label, onClick }: { selected: boolean; label: string; onClick: () => void }) {
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
      <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg ${selected ? "chrome-surface text-aggie-navy" : "border border-aggie-silver/20 text-aggie-muted"}`}>
        {selected && <Check className="h-4 w-4" />}
      </span>
      {label}
    </button>
  );
}

function ActionButton({ children, icon, onClick, primary = false }: { children: React.ReactNode; icon: React.ReactNode; onClick: () => void; primary?: boolean }) {
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
      <span className="text-right text-white">{value}</span>
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BriefcaseBusiness, Check, Clock3, MessageSquareText, RefreshCw, Save, Search, Target, UsersRound } from "lucide-react";
import { GhostButton } from "@/components/Prototype";
import { usePrototypeState } from "@/components/PrototypeState";

const moduleSlug = "job-shadow-micro-internship-sophomore";
const storageKey = "aggies-lead:sophomore:job-shadow-micro-internship";

const benefits = [
  "Learn what professionals do in different roles",
  "See how classroom and athletic skills connect to work",
  "Build confidence talking with professionals",
  "Explore early internship and career possibilities",
  "Expand your professional network",
  "Identify next steps for gaining experience",
];

const preparationItems = [
  "Identified a field or organization of interest",
  "Researched the company or professional",
  "Prepared questions to ask",
  "Updated LinkedIn profile",
  "Prepared professional attire",
  "Confirmed date, time, and location",
];

const waysToFind = [
  "Aggies Lead Staff",
  "Career Services",
  "Coaches",
  "Professors",
  "Academic Advisors",
  "Former Student-Athletes",
  "Utah State Alumni",
  "Family or Community Connections",
];

const questions = [
  "What does a typical day look like in this role?",
  "What skills are most important in this field?",
  "What experiences helped you get started?",
  "What advice would you give a student-athlete exploring this career?",
  "Are internships or entry-level opportunities common in this field?",
  "Who else would you recommend I connect with?",
];

const actionSteps = [
  "Ask for one introduction",
  "Connect on LinkedIn",
  "Update resume with relevant skills",
  "Research internships in this field",
  "Schedule a follow-up conversation",
];

type SophomoreJobShadowState = {
  selectedBenefits: string[];
  preparationChecklist: string[];
  selectedSources: string[];
  selectedQuestions: string[];
  selectedActionStep: string;
  moduleStatus: "Not Started" | "In Progress" | "Completed";
  progressPercentage: number;
};

const initialState: SophomoreJobShadowState = {
  selectedBenefits: [],
  preparationChecklist: [],
  selectedSources: [],
  selectedQuestions: [],
  selectedActionStep: "",
  moduleStatus: "Not Started",
  progressPercentage: 0,
};

export function SophomoreJobShadowMicroInternshipClient() {
  const { completeModule } = usePrototypeState();
  const [form, setForm] = useState<SophomoreJobShadowState>(initialState);
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
      form.selectedBenefits.length > 0,
      form.preparationChecklist.length > 0,
      form.selectedSources.length > 0,
      form.selectedQuestions.length > 0,
      Boolean(form.selectedActionStep),
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

  function toggleList(field: "selectedBenefits" | "preparationChecklist" | "selectedSources" | "selectedQuestions", value: string) {
    setSavedMessage("");
    setForm((current) => {
      const list = current[field];
      return {
        ...current,
        [field]: list.includes(value) ? list.filter((item) => item !== value) : [...list, value],
      };
    });
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
    setSavedMessage("Sophomore Job Shadow / Micro-Internship completed.");
  }

  return (
    <div className="space-y-6">
      <GhostButton href="/roadmaps/sophomore">Back to Sophomore Roadmap</GhostButton>

      <section className="card-surface rounded-lg p-6 md:p-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-aggie-silver">Sophomore Roadmap</p>
            <h1 className="text-glow mt-3 text-4xl font-black tracking-tight text-white md:text-5xl">
              Job Shadow / Micro-Internship
            </h1>
            <p className="mt-4 text-lg leading-8 text-aggie-light/78">
              Job shadows and micro-internships give sophomore student-athletes early exposure to professional
              environments, help build confidence, and create a bridge toward future internships and career opportunities.
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
          <Card title="Why Participate?" icon={<BriefcaseBusiness className="h-6 w-6" />}>
            <div className="grid gap-3 md:grid-cols-2">
              {benefits.map((item) => (
                <ToggleCard key={item} selected={form.selectedBenefits.includes(item)} label={item} onClick={() => toggleList("selectedBenefits", item)} />
              ))}
            </div>
          </Card>

          <Card title="Preparation Checklist" icon={<Check className="h-6 w-6" />}>
            <div className="grid gap-3 md:grid-cols-2">
              {preparationItems.map((item) => (
                <ToggleCard key={item} selected={form.preparationChecklist.includes(item)} label={item} onClick={() => toggleList("preparationChecklist", item)} />
              ))}
            </div>
          </Card>

          <Card title="Where to Find Opportunities" icon={<Search className="h-6 w-6" />}>
            <div className="grid gap-3 md:grid-cols-2">
              {waysToFind.map((item) => (
                <ToggleCard key={item} selected={form.selectedSources.includes(item)} label={item} onClick={() => toggleList("selectedSources", item)} />
              ))}
            </div>
          </Card>

          <Card title="Questions to Ask" icon={<MessageSquareText className="h-6 w-6" />}>
            <div className="grid gap-3 md:grid-cols-2">
              {questions.map((item) => (
                <ToggleCard key={item} selected={form.selectedQuestions.includes(item)} label={item} onClick={() => toggleList("selectedQuestions", item)} />
              ))}
            </div>
          </Card>

          <Card title="Next Step Plan" icon={<Target className="h-6 w-6" />}>
            <p className="leading-7 text-aggie-light/80">Choose one action step to take after the experience:</p>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {actionSteps.map((item) => (
                <ToggleCard
                  key={item}
                  selected={form.selectedActionStep === item}
                  label={item}
                  onClick={() => {
                    setSavedMessage("");
                    setForm((current) => ({ ...current, selectedActionStep: item }));
                  }}
                />
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
              Job Shadow / Micro-Internship Reviewed
            </button>
            {form.moduleStatus === "Completed" && (
              <p className="mt-5 rounded-lg border border-aggie-chrome/30 bg-white/[0.08] p-4 text-sm font-bold leading-6 text-aggie-ice">
                Sophomore Job Shadow / Micro-Internship complete. Keep building toward future internships and professional opportunities.
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
            <h2 className="text-xl font-black text-white">Experience Snapshot</h2>
            <div className="mt-4 space-y-3 text-sm font-bold text-aggie-light/78">
              <Snapshot label="Benefits" value={`${form.selectedBenefits.length}/${benefits.length}`} />
              <Snapshot label="Preparation" value={`${form.preparationChecklist.length}/${preparationItems.length}`} />
              <Snapshot label="Questions" value={`${form.selectedQuestions.length}/${questions.length}`} />
              <Snapshot label="Status" value={form.moduleStatus} />
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
      <p className="mt-3 text-sm font-medium text-aggie-light/72">{completed} of {total} sophomore steps complete</p>
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

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CalendarCheck, Check, ChevronDown, Clock3, MessageSquareText, RefreshCw, Save, Sparkles, Upload } from "lucide-react";
import { GhostButton } from "@/components/Prototype";
import { usePrototypeState } from "@/components/PrototypeState";

const moduleSlug = "advanced-mock-interview";
const storageKey = "aggies-lead:senior:advanced-mock-interview";

const readinessItems = [
  "Resume finalized",
  "LinkedIn profile finalized",
  "Professional attire prepared",
  "Interview questions practiced",
  "References secured",
  "Career goals identified",
];

const advancedQuestions = [
  "Tell me about yourself.",
  "Why are you interested in this position?",
  "What makes you a strong candidate?",
  "Tell me about a challenge you overcame.",
  "Describe a time you received difficult feedback.",
  "Tell me about a leadership experience.",
  "How has being a student-athlete prepared you for your career?",
  "Where do you see yourself in five years?",
  "Why should we hire you?",
];

const employerQuestions = [
  "What traits do your most successful employees possess?",
  "How do employees typically grow within the organization?",
  "What does success look like in this role?",
  "What are the biggest challenges facing your team?",
];

const finalChecklist = [
  "Thank-you email prepared",
  "Professional attire ready",
  "Resume copies available",
  "Questions prepared",
  "Research completed",
];

type AdvancedMockInterviewState = {
  readinessChecklist: string[];
  openQuestions: string[];
  mockInterviewScheduled: boolean;
  responsesUploaded: boolean;
  confidenceRating: number;
  finalChecklist: string[];
  moduleStatus: "Not Started" | "In Progress" | "Completed";
  progressPercentage: number;
};

const initialState: AdvancedMockInterviewState = {
  readinessChecklist: [],
  openQuestions: [],
  mockInterviewScheduled: false,
  responsesUploaded: false,
  confidenceRating: 0,
  finalChecklist: [],
  moduleStatus: "Not Started",
  progressPercentage: 0,
};

export function AdvancedMockInterviewClient() {
  const { completeModule } = usePrototypeState();
  const [form, setForm] = useState<AdvancedMockInterviewState>(initialState);
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
      form.readinessChecklist.length > 0,
      form.openQuestions.length > 0,
      form.mockInterviewScheduled || form.responsesUploaded,
      form.confidenceRating > 0,
      form.finalChecklist.length > 0,
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

  function toggleList(field: "readinessChecklist" | "openQuestions" | "finalChecklist", value: string) {
    setSavedMessage("");
    setForm((current) => {
      const list = current[field];
      return {
        ...current,
        [field]: list.includes(value) ? list.filter((item) => item !== value) : [...list, value],
      };
    });
  }

  function updateField<K extends keyof AdvancedMockInterviewState>(field: K, value: AdvancedMockInterviewState[K]) {
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

  function markComplete() {
    const completedState = { ...form, moduleStatus: "Completed" as const, progressPercentage: 100 };
    setForm(completedState);
    window.localStorage.setItem(storageKey, JSON.stringify(completedState));
    completeModule(moduleSlug);
    setSavedMessage("Advanced Mock Interview completed.");
  }

  return (
    <div className="space-y-6">
      <GhostButton href="/roadmaps/senior">Back to Senior Roadmap</GhostButton>

      <section className="card-surface rounded-lg p-6 md:p-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-aggie-silver">Senior Roadmap</p>
            <h1 className="text-glow mt-3 text-4xl font-black tracking-tight text-white md:text-5xl">
              Advanced Mock Interview
            </h1>
            <p className="mt-4 text-lg leading-8 text-aggie-light/78">
              This module is designed to prepare graduating student-athletes for full-time employment interviews,
              graduate school interviews, and professional opportunities.
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
          <Card title="Interview Readiness Assessment" icon={<Check className="h-6 w-6" />}>
            <div className="grid gap-3 md:grid-cols-2">
              {readinessItems.map((item) => (
                <ToggleCard key={item} selected={form.readinessChecklist.includes(item)} label={item} onClick={() => toggleList("readinessChecklist", item)} />
              ))}
            </div>
          </Card>

          <Card title="Advanced Interview Questions" icon={<MessageSquareText className="h-6 w-6" />}>
            <div className="grid gap-3">
              {advancedQuestions.map((question) => {
                const open = form.openQuestions.includes(question);
                return (
                  <button
                    key={question}
                    type="button"
                    onClick={() => toggleList("openQuestions", question)}
                    className={`rounded-lg border p-4 text-left transition ${
                      open
                        ? "border-aggie-chrome/45 bg-white/[0.1]"
                        : "border-aggie-silver/15 bg-white/[0.045] hover:border-aggie-steel hover:bg-white/10"
                    }`}
                  >
                    <span className="flex items-center justify-between gap-4">
                      <span className="font-black text-white">{question}</span>
                      <ChevronDown className={`h-5 w-5 shrink-0 text-aggie-ice transition ${open ? "rotate-180" : ""}`} />
                    </span>
                    {open && (
                      <span className="mt-3 block text-sm font-semibold leading-6 text-aggie-light/76">
                        Practice a direct answer, add a specific example, and connect your response to the role or opportunity.
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </Card>

          <Card title="Behavioral Interview Practice" icon={<Sparkles className="h-6 w-6" />}>
            <p className="leading-7 text-aggie-light/80">Use the STAR Method to structure behavioral interview answers.</p>
            <div className="mt-5 grid gap-3 md:grid-cols-4">
              {["Situation", "Task", "Action", "Result"].map((item) => (
                <div key={item} className="rounded-lg border border-aggie-silver/15 bg-white/[0.045] p-4">
                  <p className="text-sm font-black text-white">{item}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-lg border border-aggie-chrome/30 bg-aggie-chrome/10 p-5">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-aggie-silver">Student-Athlete Example</p>
              <p className="mt-3 leading-7 text-aggie-light/84">
                During my senior season, our team faced a difficult stretch of travel, classes, and competition. I helped
                organize study time, communicated with teammates, and kept our group focused on preparation. As a result,
                I strengthened my leadership and time management while supporting team performance.
              </p>
            </div>
          </Card>

          <Card title="Questions You Should Ask Employers" icon={<MessageSquareText className="h-6 w-6" />}>
            <CheckGrid items={employerQuestions} />
          </Card>

          <Card title="Mock Interview Scheduling" icon={<CalendarCheck className="h-6 w-6" />}>
            <div className="grid gap-3 md:grid-cols-2">
              <ActionButton onClick={() => updateField("mockInterviewScheduled", true)} icon={<CalendarCheck className="h-4 w-4" />} primary={form.mockInterviewScheduled}>
                Schedule Mock Interview
              </ActionButton>
              <ActionButton onClick={() => updateField("responsesUploaded", true)} icon={<Upload className="h-4 w-4" />} primary={form.responsesUploaded}>
                Upload Practice Responses
              </ActionButton>
            </div>
            <p className="mt-4 text-sm font-semibold leading-6 text-aggie-light/72">
              Placeholder actions for prototype testing.
            </p>
          </Card>

          <Card title="Interview Confidence Assessment" icon={<Sparkles className="h-6 w-6" />}>
            <p className="leading-7 text-aggie-light/80">Rate confidence:</p>
            <div className="mt-4 grid grid-cols-5 gap-2 sm:grid-cols-10">
              {Array.from({ length: 10 }, (_, index) => index + 1).map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => updateField("confidenceRating", rating)}
                  className={`min-h-11 rounded-lg border text-sm font-black transition ${
                    form.confidenceRating === rating
                      ? "chrome-surface border-aggie-chrome/60 text-aggie-navy shadow-glow"
                      : "border-aggie-silver/15 bg-white/[0.045] text-white hover:border-aggie-steel hover:bg-white/10"
                  }`}
                >
                  {rating}
                </button>
              ))}
            </div>
          </Card>

          <Card title="Final Interview Checklist" icon={<Check className="h-6 w-6" />}>
            <div className="grid gap-3 md:grid-cols-2">
              {finalChecklist.map((item) => (
                <ToggleCard key={item} selected={form.finalChecklist.includes(item)} label={item} onClick={() => toggleList("finalChecklist", item)} />
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
              Advanced Mock Interview Completed
            </button>
            {form.moduleStatus === "Completed" && (
              <p className="mt-5 rounded-lg border border-aggie-chrome/30 bg-white/[0.08] p-4 text-sm font-bold leading-6 text-aggie-ice">
                Advanced Mock Interview complete. Keep practicing until your answers feel specific, confident, and natural.
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
            <h2 className="text-xl font-black text-white">Interview Snapshot</h2>
            <div className="mt-4 space-y-3 text-sm font-bold text-aggie-light/78">
              <Snapshot label="Readiness" value={`${form.readinessChecklist.length}/${readinessItems.length}`} />
              <Snapshot label="Questions Opened" value={`${form.openQuestions.length}/${advancedQuestions.length}`} />
              <Snapshot label="Confidence" value={form.confidenceRating ? `${form.confidenceRating}/10` : "Not Rated"} />
              <Snapshot label="Final Checklist" value={`${form.finalChecklist.length}/${finalChecklist.length}`} />
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
      <p className="mt-3 text-sm font-medium text-aggie-light/72">{completed} of {total} advanced interview steps complete</p>
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

function CheckGrid({ items }: { items: string[] }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {items.map((item) => (
        <div key={item} className="flex items-start gap-3 rounded-lg border border-aggie-silver/15 bg-white/[0.045] p-4">
          <span className="chrome-surface mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md text-aggie-navy">
            <Check className="h-4 w-4" />
          </span>
          <p className="text-sm font-bold leading-6 text-aggie-light/82">{item}</p>
        </div>
      ))}
    </div>
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

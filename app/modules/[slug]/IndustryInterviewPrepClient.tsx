"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { CalendarCheck, Check, ChevronDown, Clock3, RefreshCw, Save, Search, Sparkles, Target } from "lucide-react";
import { GhostButton } from "@/components/Prototype";
import { usePrototypeState } from "@/components/PrototypeState";

const moduleSlug = "industry-interview-prep";
const storageKey = "aggies-lead:graduate:industry-interview-prep";

const industryOptions = [
  "Business",
  "Sales",
  "Marketing",
  "Finance",
  "Healthcare",
  "Education",
  "Engineering",
  "Technology",
  "Sports Industry",
  "Nonprofit",
  "Other",
];

const interviewQuestions = [
  "Why are you interested in this industry?",
  "What do you know about our organization?",
  "Why are you interested in this position?",
  "How have your experiences prepared you for this role?",
  "What value would you bring to our team?",
];

const preparationItems = [
  "Researched industry trends",
  "Researched company",
  "Practiced technical questions (if applicable)",
  "Prepared examples from experience",
  "Prepared questions to ask interviewer",
];

type IndustryResearch = {
  targetIndustry: string;
  targetCompanies: string;
  keyIndustryTrends: string;
  desiredRoles: string;
};

type InterviewReflection = {
  industry: string;
  company: string;
  interviewDate: string;
  lessonsLearned: string;
  nextSteps: string;
};

type IndustryInterviewPrepState = {
  selectedIndustry: string;
  industryResearch: IndustryResearch;
  openQuestions: string[];
  preparationChecklist: string[];
  interviewReflection: InterviewReflection;
  mockInterviewScheduled: boolean;
  moduleStatus: "Not Started" | "In Progress" | "Completed";
  progressPercentage: number;
};

const initialState: IndustryInterviewPrepState = {
  selectedIndustry: "",
  industryResearch: {
    targetIndustry: "",
    targetCompanies: "",
    keyIndustryTrends: "",
    desiredRoles: "",
  },
  openQuestions: [],
  preparationChecklist: [],
  interviewReflection: {
    industry: "",
    company: "",
    interviewDate: "",
    lessonsLearned: "",
    nextSteps: "",
  },
  mockInterviewScheduled: false,
  moduleStatus: "Not Started",
  progressPercentage: 0,
};

export function IndustryInterviewPrepClient() {
  const { completeModule } = usePrototypeState();
  const [form, setForm] = useState<IndustryInterviewPrepState>(initialState);
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

  const researchStarted = Object.values(form.industryResearch).some((value) => value.trim().length > 0);
  const reflectionStarted = Object.values(form.interviewReflection).some((value) => value.trim().length > 0);

  const completion = useMemo(() => {
    const tasks = [
      Boolean(form.selectedIndustry),
      researchStarted,
      form.openQuestions.length > 0,
      true,
      form.preparationChecklist.length > 0,
      reflectionStarted,
      form.mockInterviewScheduled,
      form.moduleStatus === "Completed",
    ];
    const completed = tasks.filter(Boolean).length;
    const percent = form.moduleStatus === "Completed" ? 100 : Math.round((completed / tasks.length) * 100);
    return { completed, total: tasks.length, percent };
  }, [form, reflectionStarted, researchStarted]);

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

  const persist = (nextForm = form, message = "Progress saved locally.") => {
    window.localStorage.setItem(storageKey, JSON.stringify(nextForm));
    setSavedMessage(message);
  };

  const resetModule = () => {
    window.localStorage.removeItem(storageKey);
    setForm(initialState);
    setSavedMessage("Module reset.");
  };

  const markComplete = () => {
    const completedForm: IndustryInterviewPrepState = {
      ...form,
      moduleStatus: "Completed",
      progressPercentage: 100,
    };
    setForm(completedForm);
    persist(completedForm, "Industry Interview Prep completed.");
    completeModule(moduleSlug);
  };

  const updateResearch = (field: keyof IndustryResearch, value: string) => {
    setForm((current) => ({ ...current, industryResearch: { ...current.industryResearch, [field]: value } }));
  };

  const updateReflection = (field: keyof InterviewReflection, value: string) => {
    setForm((current) => ({ ...current, interviewReflection: { ...current.interviewReflection, [field]: value } }));
  };

  const toggleQuestion = (question: string) => {
    setForm((current) => ({
      ...current,
      openQuestions: current.openQuestions.includes(question)
        ? current.openQuestions.filter((item) => item !== question)
        : [...current.openQuestions, question],
    }));
  };

  const togglePreparation = (item: string) => {
    setForm((current) => ({
      ...current,
      preparationChecklist: current.preparationChecklist.includes(item)
        ? current.preparationChecklist.filter((selected) => selected !== item)
        : [...current.preparationChecklist, item],
    }));
  };

  return (
    <div className="space-y-6">
      <GhostButton href="/roadmaps/graduate">Back to Graduate Roadmap</GhostButton>

      <section className="card-surface rounded-lg p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-aggie-silver">
              Graduate / 5th Year Roadmap
            </p>
            <h1 className="text-glow mt-3 text-4xl font-black tracking-tight text-white">
              Industry Interview Preparation
            </h1>
            <p className="mt-4 max-w-3xl leading-7 text-aggie-light/76">
              Different industries often evaluate candidates differently. This module helps you prepare for
              industry-specific interviews and better understand employer expectations.
            </p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/6 px-4 py-3 text-sm font-bold text-aggie-light">
            <Clock3 className="mr-2 inline h-4 w-4 text-aggie-ice" />
            Estimated Time: 10 minutes
          </div>
        </div>

        <ProgressPanel status={form.moduleStatus} percent={form.progressPercentage} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <Card title="Choose Your Industry" icon={<Target className="h-6 w-6 text-aggie-ice" />}>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {industryOptions.map((industry) => (
                <button
                  key={industry}
                  type="button"
                  onClick={() => setForm((current) => ({ ...current, selectedIndustry: industry }))}
                  className={`rounded-lg border px-4 py-3 text-left text-sm font-black transition ${
                    form.selectedIndustry === industry
                      ? "border-aggie-ice/70 bg-aggie-ice/14 text-white"
                      : "border-white/10 bg-white/5 text-aggie-light/78 hover:border-aggie-ice/40 hover:bg-white/10"
                  }`}
                >
                  {industry}
                </button>
              ))}
            </div>
          </Card>

          <Card title="Industry Research" icon={<Search className="h-6 w-6 text-aggie-ice" />}>
            <div className="grid gap-4 md:grid-cols-2">
              <TextInput label="Target Industry" value={form.industryResearch.targetIndustry} onChange={(value) => updateResearch("targetIndustry", value)} />
              <TextInput label="Target Companies" value={form.industryResearch.targetCompanies} onChange={(value) => updateResearch("targetCompanies", value)} />
              <TextArea label="Key Industry Trends" value={form.industryResearch.keyIndustryTrends} onChange={(value) => updateResearch("keyIndustryTrends", value)} />
              <TextArea label="Desired Roles" value={form.industryResearch.desiredRoles} onChange={(value) => updateResearch("desiredRoles", value)} />
            </div>
          </Card>

          <Card title="Industry Interview Questions" icon={<ChevronDown className="h-6 w-6 text-aggie-ice" />}>
            <div className="space-y-3">
              {interviewQuestions.map((question) => {
                const open = form.openQuestions.includes(question);
                return (
                  <article key={question} className="rounded-lg border border-white/10 bg-white/5">
                    <button
                      type="button"
                      onClick={() => toggleQuestion(question)}
                      className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left font-black text-white"
                    >
                      <span>{question}</span>
                      <ChevronDown className={`h-5 w-5 transition ${open ? "rotate-180" : ""}`} />
                    </button>
                    {open ? (
                      <p className="border-t border-white/10 px-4 py-4 text-sm leading-6 text-aggie-light/74">
                        Use a specific example from work, athletics, leadership, service, or academics. Connect your
                        answer to the employer's needs and the expectations of this industry.
                      </p>
                    ) : null}
                  </article>
                );
              })}
            </div>
          </Card>

          <Card title="Behavioral Interview Practice" icon={<Sparkles className="h-6 w-6 text-aggie-ice" />}>
            <div className="grid gap-3 md:grid-cols-4">
              {["Situation", "Task", "Action", "Result"].map((step) => (
                <div key={step} className="rounded-lg border border-white/10 bg-white/6 p-4">
                  <p className="font-black text-white">{step}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 leading-7 text-aggie-light/74">
              Example: In a part-time role, you noticed customers waited too long for support. Your task was to improve
              communication during busy periods. You created a simple check-in process with coworkers, helped customers
              understand wait times, and reduced confusion while improving the customer experience.
            </p>
          </Card>

          <Card title="Industry-Specific Preparation" icon={<Check className="h-6 w-6 text-aggie-ice" />}>
            <div className="grid gap-3 md:grid-cols-2">
              {preparationItems.map((item) => (
                <ToggleCard
                  key={item}
                  label={item}
                  selected={form.preparationChecklist.includes(item)}
                  onClick={() => togglePreparation(item)}
                />
              ))}
            </div>
          </Card>

          <Card title="Interview Reflection" icon={<CalendarCheck className="h-6 w-6 text-aggie-ice" />}>
            <div className="grid gap-4 md:grid-cols-2">
              <TextInput label="Industry" value={form.interviewReflection.industry} onChange={(value) => updateReflection("industry", value)} />
              <TextInput label="Company" value={form.interviewReflection.company} onChange={(value) => updateReflection("company", value)} />
              <TextInput label="Interview Date" value={form.interviewReflection.interviewDate} onChange={(value) => updateReflection("interviewDate", value)} />
              <TextArea label="Lessons Learned" value={form.interviewReflection.lessonsLearned} onChange={(value) => updateReflection("lessonsLearned", value)} />
              <TextArea label="Next Steps" value={form.interviewReflection.nextSteps} onChange={(value) => updateReflection("nextSteps", value)} />
            </div>
          </Card>

          <Card title="Mock Industry Interview" icon={<CalendarCheck className="h-6 w-6 text-aggie-ice" />}>
            <button
              type="button"
              onClick={() => setForm((current) => ({ ...current, mockInterviewScheduled: true }))}
              className="rounded-lg bg-aggie-blue px-4 py-3 text-sm font-black text-white transition hover:bg-aggie-blue/85"
            >
              Schedule Industry Mock Interview
            </button>
            {form.mockInterviewScheduled ? (
              <p className="mt-3 text-sm font-semibold text-aggie-ice">Placeholder mock interview request marked.</p>
            ) : null}
            <button
              type="button"
              onClick={markComplete}
              className="mt-4 block rounded-lg bg-aggie-ice px-4 py-3 text-sm font-black text-aggie-navy transition hover:bg-white"
            >
              Industry Interview Prep Completed
            </button>
            {form.moduleStatus === "Completed" ? (
              <p className="mt-4 rounded-lg border border-aggie-ice/30 bg-aggie-ice/10 p-4 text-sm font-semibold text-aggie-light">
                Great work. You have prepared for industry-specific interviews and employer expectations.
              </p>
            ) : null}
          </Card>
        </div>

        <aside className="space-y-5">
          <Card title="Save Options">
            <div className="space-y-3">
              <ActionButton icon={<Save className="h-4 w-4" />} label="Save Progress" onClick={() => persist()} />
              <ActionButton icon={<RefreshCw className="h-4 w-4" />} label="Reset Module" onClick={resetModule} muted />
            </div>
            {savedMessage ? <p className="mt-4 text-sm font-semibold text-aggie-ice">{savedMessage}</p> : null}
          </Card>

          <Card title="Interview Snapshot">
            <div className="space-y-3">
              <Snapshot label="Industry" value={form.selectedIndustry || "Not Selected"} />
              <Snapshot label="Questions Opened" value={`${form.openQuestions.length}/${interviewQuestions.length}`} />
              <Snapshot label="Preparation" value={`${form.preparationChecklist.length}/${preparationItems.length}`} />
              <Snapshot label="Mock Interview" value={form.mockInterviewScheduled ? "Marked" : "Not Scheduled"} />
            </div>
          </Card>

          <Link
            href="/roadmaps/graduate"
            className="block rounded-lg border border-white/10 bg-white/6 p-4 text-sm font-bold text-aggie-light transition hover:border-aggie-ice/40 hover:bg-white/10"
          >
            Return to Graduate Roadmap
          </Link>
        </aside>
      </section>
    </div>
  );
}

function ProgressPanel({ status, percent }: { status: string; percent: number }) {
  return (
    <div className="mt-6 rounded-lg border border-white/10 bg-white/6 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-black text-white">Status: {status}</p>
        <p className="text-sm font-bold text-aggie-muted">{percent}% Complete</p>
      </div>
      <div className="mt-3 h-3 overflow-hidden rounded-full bg-black/30">
        <div className="h-full rounded-full bg-aggie-ice transition-all" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function Card({ title, icon, children }: { title: string; icon?: ReactNode; children: ReactNode }) {
  return (
    <section className="card-surface rounded-lg p-6">
      <div className="mb-5 flex items-center gap-3">
        {icon}
        <h2 className="text-2xl font-black text-white">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function ToggleCard({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-14 items-center justify-between rounded-lg border px-4 py-3 text-left text-sm font-bold transition ${
        selected
          ? "border-aggie-ice/70 bg-aggie-ice/14 text-white"
          : "border-white/10 bg-white/5 text-aggie-light/78 hover:border-aggie-ice/40 hover:bg-white/10"
      }`}
    >
      <span>{label}</span>
      <span
        className={`ml-3 grid h-5 w-5 place-items-center rounded border ${
          selected ? "border-aggie-ice bg-aggie-ice text-aggie-navy" : "border-white/20"
        }`}
      >
        {selected ? <Check className="h-3.5 w-3.5" /> : null}
      </span>
    </button>
  );
}

function TextInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="text-sm font-black text-white">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-aggie-muted focus:border-aggie-ice/60"
      />
    </label>
  );
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="text-sm font-black text-white">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-aggie-muted focus:border-aggie-ice/60"
      />
    </label>
  );
}

function ActionButton({
  icon,
  label,
  onClick,
  muted,
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  muted?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-black transition ${
        muted ? "border border-white/10 bg-white/5 text-aggie-light hover:bg-white/10" : "bg-aggie-blue text-white hover:bg-aggie-blue/85"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function Snapshot({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-3">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-aggie-muted">{label}</p>
      <p className="mt-1 text-lg font-black text-white">{value}</p>
    </div>
  );
}

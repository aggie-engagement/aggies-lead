"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CalendarCheck, Check, Clock3, Map, RefreshCw, Save, Sparkles, Target } from "lucide-react";
import { GhostButton } from "@/components/Prototype";
import { usePrototypeState } from "@/components/PrototypeState";

const moduleSlug = "career-mapping-session";
const storageKey = "aggies-lead:junior:career-mapping-session";

type SelfAssessment = {
  careers: string;
  industries: string;
  skills: string;
  longTermGoals: string;
};

type CareerOptions = {
  dreamCareer: string;
  realisticCareer: string;
  backupCareer: string;
};

type GapAnalysis = {
  skillsNeeded: string;
  experiencesNeeded: string;
  certificationsNeeded: string;
  educationNeeded: string;
};

type ActionPlan = {
  next30Days: string;
  next6Months: string;
  next12Months: string;
};

type CareerMappingState = {
  selfAssessment: SelfAssessment;
  careerOptions: CareerOptions;
  gapAnalysis: GapAnalysis;
  actionPlan: ActionPlan;
  meetingScheduled: boolean;
  moduleStatus: "Not Started" | "In Progress" | "Completed";
  progressPercentage: number;
};

const initialState: CareerMappingState = {
  selfAssessment: {
    careers: "",
    industries: "",
    skills: "",
    longTermGoals: "",
  },
  careerOptions: {
    dreamCareer: "",
    realisticCareer: "",
    backupCareer: "",
  },
  gapAnalysis: {
    skillsNeeded: "",
    experiencesNeeded: "",
    certificationsNeeded: "",
    educationNeeded: "",
  },
  actionPlan: {
    next30Days: "",
    next6Months: "",
    next12Months: "",
  },
  meetingScheduled: false,
  moduleStatus: "Not Started",
  progressPercentage: 0,
};

export function CareerMappingSessionClient() {
  const { completeModule } = usePrototypeState();
  const [form, setForm] = useState<CareerMappingState>(initialState);
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

  const selfAssessmentStarted = Object.values(form.selfAssessment).some((value) => value.trim().length > 0);
  const careerOptionsStarted = Object.values(form.careerOptions).some((value) => value.trim().length > 0);
  const gapAnalysisStarted = Object.values(form.gapAnalysis).some((value) => value.trim().length > 0);
  const actionPlanStarted = Object.values(form.actionPlan).some((value) => value.trim().length > 0);

  const completion = useMemo(() => {
    const tasks = [
      selfAssessmentStarted,
      careerOptionsStarted,
      gapAnalysisStarted,
      actionPlanStarted,
      form.meetingScheduled,
      form.moduleStatus === "Completed",
    ];
    const completed = tasks.filter(Boolean).length;
    const percent = form.moduleStatus === "Completed" ? 100 : Math.round((completed / tasks.length) * 100);
    return { completed, total: tasks.length, percent };
  }, [actionPlanStarted, careerOptionsStarted, form, gapAnalysisStarted, selfAssessmentStarted]);

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

  function updateSection<
    Section extends "selfAssessment" | "careerOptions" | "gapAnalysis" | "actionPlan",
    Field extends keyof CareerMappingState[Section],
  >(section: Section, field: Field, value: CareerMappingState[Section][Field]) {
    setSavedMessage("");
    setForm((current) => ({
      ...current,
      [section]: { ...current[section], [field]: value },
    }));
  }

  function updateMeetingScheduled(value: boolean) {
    setSavedMessage("");
    setForm((current) => ({ ...current, meetingScheduled: value }));
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
    setSavedMessage("Career Mapping Session completed.");
  }

  const careerInterest =
    form.careerOptions.dreamCareer || form.careerOptions.realisticCareer || form.selfAssessment.careers || "Not identified yet";
  const requiredExperience = form.gapAnalysis.experiencesNeeded || form.gapAnalysis.skillsNeeded || "Not identified yet";
  const nextSteps = form.actionPlan.next30Days || form.actionPlan.next6Months || "Not identified yet";
  const targetOutcome = form.selfAssessment.longTermGoals || form.careerOptions.realisticCareer || "Not identified yet";

  return (
    <div className="space-y-6">
      <GhostButton href="/roadmaps/junior">Back to Junior Roadmap</GhostButton>

      <section className="card-surface rounded-lg p-6 md:p-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-aggie-silver">Junior Roadmap</p>
            <h1 className="text-glow mt-3 text-4xl font-black tracking-tight text-white md:text-5xl">
              Career Mapping Session
            </h1>
            <p className="mt-4 text-lg leading-8 text-aggie-light/78">
              Career mapping helps student-athletes connect their interests, skills, experiences, and goals into a
              clear action plan for life after athletics.
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
          <Card title="Self-Assessment" icon={<Sparkles className="h-6 w-6" />}>
            <div className="grid gap-4 md:grid-cols-2">
              <TextArea label="What careers interest you?" value={form.selfAssessment.careers} onChange={(value) => updateSection("selfAssessment", "careers", value)} />
              <TextArea label="What industries interest you?" value={form.selfAssessment.industries} onChange={(value) => updateSection("selfAssessment", "industries", value)} />
              <TextArea label="What skills do you enjoy using?" value={form.selfAssessment.skills} onChange={(value) => updateSection("selfAssessment", "skills", value)} />
              <TextArea label="What are your long-term goals?" value={form.selfAssessment.longTermGoals} onChange={(value) => updateSection("selfAssessment", "longTermGoals", value)} />
            </div>
          </Card>

          <Card title="Career Exploration" icon={<Target className="h-6 w-6" />}>
            <div className="grid gap-4 md:grid-cols-3">
              <TextInput label="Dream Career" value={form.careerOptions.dreamCareer} onChange={(value) => updateSection("careerOptions", "dreamCareer", value)} />
              <TextInput label="Realistic Career Option" value={form.careerOptions.realisticCareer} onChange={(value) => updateSection("careerOptions", "realisticCareer", value)} />
              <TextInput label="Backup Career Option" value={form.careerOptions.backupCareer} onChange={(value) => updateSection("careerOptions", "backupCareer", value)} />
            </div>
          </Card>

          <Card title="Experience Gap Analysis" icon={<Map className="h-6 w-6" />}>
            <div className="grid gap-4 md:grid-cols-2">
              <TextArea label="Skills Needed" value={form.gapAnalysis.skillsNeeded} onChange={(value) => updateSection("gapAnalysis", "skillsNeeded", value)} />
              <TextArea label="Experiences Needed" value={form.gapAnalysis.experiencesNeeded} onChange={(value) => updateSection("gapAnalysis", "experiencesNeeded", value)} />
              <TextArea label="Certifications Needed" value={form.gapAnalysis.certificationsNeeded} onChange={(value) => updateSection("gapAnalysis", "certificationsNeeded", value)} />
              <TextArea label="Education Needed" value={form.gapAnalysis.educationNeeded} onChange={(value) => updateSection("gapAnalysis", "educationNeeded", value)} />
            </div>
          </Card>

          <Card title="Action Plan" icon={<Check className="h-6 w-6" />}>
            <div className="grid gap-4 md:grid-cols-3">
              <TextArea label="Next 30 Days" value={form.actionPlan.next30Days} onChange={(value) => updateSection("actionPlan", "next30Days", value)} />
              <TextArea label="Next 6 Months" value={form.actionPlan.next6Months} onChange={(value) => updateSection("actionPlan", "next6Months", value)} />
              <TextArea label="Next 12 Months" value={form.actionPlan.next12Months} onChange={(value) => updateSection("actionPlan", "next12Months", value)} />
            </div>
          </Card>

          <Card title="Aggies Lead Career Meeting" icon={<CalendarCheck className="h-6 w-6" />}>
            <button
              type="button"
              onClick={() => updateMeetingScheduled(true)}
              className={`inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg px-5 text-sm font-black transition sm:w-auto ${
                form.meetingScheduled
                  ? "chrome-surface border border-aggie-chrome/60 text-aggie-navy shadow-glow"
                  : "border border-aggie-silver/20 bg-white/[0.045] text-white hover:border-aggie-steel hover:bg-white/10"
              }`}
            >
              <CalendarCheck className="h-4 w-4" />
              Schedule Career Mapping Session
            </button>
            <p className="mt-4 text-sm font-semibold leading-6 text-aggie-light/72">
              Placeholder scheduling for prototype testing.
            </p>
          </Card>

          <Card title="Career Roadmap Summary" icon={<Map className="h-6 w-6" />}>
            <div className="grid gap-3 md:grid-cols-2">
              <SummaryCard label="Career Interest" value={careerInterest} />
              <SummaryCard label="Required Experience" value={requiredExperience} />
              <SummaryCard label="Next Steps" value={nextSteps} />
              <SummaryCard label="Target Graduation Outcome" value={targetOutcome} />
            </div>
          </Card>

          <Card title="Module Completion" icon={<Check className="h-6 w-6" />}>
            <button
              type="button"
              onClick={markComplete}
              className="chrome-surface inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border border-aggie-chrome/60 px-5 text-sm font-black text-aggie-navy shadow-glow transition hover:brightness-110 sm:w-auto"
            >
              <Check className="h-4 w-4" />
              Career Mapping Session Completed
            </button>
            {form.moduleStatus === "Completed" && (
              <p className="mt-5 rounded-lg border border-aggie-chrome/30 bg-white/[0.08] p-4 text-sm font-bold leading-6 text-aggie-ice">
                Career Mapping Session complete. Use this roadmap to guide internships, fellowships, graduate school planning, and post-graduation career steps.
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
            <h2 className="text-xl font-black text-white">Mapping Snapshot</h2>
            <div className="mt-4 space-y-3 text-sm font-bold text-aggie-light/78">
              <Snapshot label="Self-Assessment" value={selfAssessmentStarted ? "Started" : "Not Started"} />
              <Snapshot label="Careers" value={careerOptionsStarted ? "Identified" : "Not Identified"} />
              <Snapshot label="Gap Analysis" value={gapAnalysisStarted ? "Started" : "Not Started"} />
              <Snapshot label="Meeting" value={form.meetingScheduled ? "Scheduled" : "Not Scheduled"} />
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
      <p className="mt-3 text-sm font-medium text-aggie-light/72">{completed} of {total} mapping steps complete</p>
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

function TextInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="text-sm font-black uppercase tracking-[0.16em] text-aggie-silver">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 min-h-12 w-full rounded-lg border border-aggie-silver/15 bg-aggie-navy/80 px-4 text-white outline-none placeholder:text-aggie-muted focus:border-aggie-steel"
      />
    </label>
  );
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="text-sm font-black uppercase tracking-[0.16em] text-aggie-silver">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 min-h-28 w-full rounded-lg border border-aggie-silver/15 bg-aggie-navy/80 px-4 py-3 text-white outline-none placeholder:text-aggie-muted focus:border-aggie-steel"
      />
    </label>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-aggie-silver/15 bg-white/[0.045] p-4">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-aggie-silver">{label}</p>
      <p className="mt-2 text-sm font-bold leading-6 text-white">{value}</p>
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

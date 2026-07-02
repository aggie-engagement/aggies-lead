"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { CalendarCheck, Check, Clock3, Map, RefreshCw, Save, Sparkles, Target } from "lucide-react";
import { GhostButton } from "@/components/Prototype";
import { usePrototypeState } from "@/components/PrototypeState";

const moduleSlug = "career-mapping-and-transition";
const storageKey = "aggies-lead:senior:career-mapping-and-transition";

type SelfAssessment = {
  immediatePlans: string;
  longTermGoals: string;
  nextChapterExcitement: string;
  transitionConcerns: string;
};

type CareerMapping = {
  dreamCareer: string;
  firstCareerGoal: string;
  longTermCareerGoal: string;
  targetIndustry: string;
  preferredLocation: string;
};

type ActionPlan = {
  within30Days: string;
  within60Days: string;
  within90Days: string;
};

type CareerMappingTransitionState = {
  selfAssessment: SelfAssessment;
  pathways: string[];
  careerMapping: CareerMapping;
  readinessChecklist: string[];
  actionPlan: ActionPlan;
  meetingScheduled: boolean;
  moduleStatus: "Not Started" | "In Progress" | "Completed";
  progressPercentage: number;
};

const pathwayOptions = [
  "Full-Time Employment",
  "Graduate School",
  "Professional Athletics",
  "Entrepreneurship",
  "Military Service",
  "Other",
];

const readinessItems = [
  "Resume finalized",
  "LinkedIn finalized",
  "References secured",
  "Job search initiated",
  "Professional network established",
  "Financial plan created",
  "Housing plans identified",
  "Health insurance plan identified",
];

const initialState: CareerMappingTransitionState = {
  selfAssessment: {
    immediatePlans: "",
    longTermGoals: "",
    nextChapterExcitement: "",
    transitionConcerns: "",
  },
  pathways: [],
  careerMapping: {
    dreamCareer: "",
    firstCareerGoal: "",
    longTermCareerGoal: "",
    targetIndustry: "",
    preferredLocation: "",
  },
  readinessChecklist: [],
  actionPlan: {
    within30Days: "",
    within60Days: "",
    within90Days: "",
  },
  meetingScheduled: false,
  moduleStatus: "Not Started",
  progressPercentage: 0,
};

export function CareerMappingTransitionClient() {
  const { completeModule } = usePrototypeState();
  const [form, setForm] = useState<CareerMappingTransitionState>(initialState);
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
  const careerMappingStarted = Object.values(form.careerMapping).some((value) => value.trim().length > 0);
  const actionPlanStarted = Object.values(form.actionPlan).some((value) => value.trim().length > 0);

  const completion = useMemo(() => {
    const tasks = [
      selfAssessmentStarted,
      form.pathways.length > 0,
      careerMappingStarted,
      form.readinessChecklist.length > 0,
      actionPlanStarted,
      form.meetingScheduled,
      form.moduleStatus === "Completed",
    ];
    const completed = tasks.filter(Boolean).length;
    const percent = form.moduleStatus === "Completed" ? 100 : Math.round((completed / tasks.length) * 100);
    return { completed, total: tasks.length, percent };
  }, [
    actionPlanStarted,
    careerMappingStarted,
    form.meetingScheduled,
    form.moduleStatus,
    form.pathways.length,
    form.readinessChecklist.length,
    selfAssessmentStarted,
  ]);

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
    const completedForm: CareerMappingTransitionState = {
      ...form,
      moduleStatus: "Completed",
      progressPercentage: 100,
    };
    setForm(completedForm);
    persist(completedForm, "Career Mapping & Transition completed.");
    completeModule(moduleSlug);
  };

  const toggleList = (field: "pathways" | "readinessChecklist", item: string) => {
    setForm((current) => ({
      ...current,
      [field]: current[field].includes(item)
        ? current[field].filter((selected) => selected !== item)
        : [...current[field], item],
    }));
  };

  const updateSelfAssessment = (field: keyof SelfAssessment, value: string) => {
    setForm((current) => ({ ...current, selfAssessment: { ...current.selfAssessment, [field]: value } }));
  };

  const updateCareerMapping = (field: keyof CareerMapping, value: string) => {
    setForm((current) => ({ ...current, careerMapping: { ...current.careerMapping, [field]: value } }));
  };

  const updateActionPlan = (field: keyof ActionPlan, value: string) => {
    setForm((current) => ({ ...current, actionPlan: { ...current.actionPlan, [field]: value } }));
  };

  return (
    <div className="space-y-6">
      <GhostButton href="/roadmaps/senior">Back to Senior Roadmap</GhostButton>

      <section className="card-surface rounded-lg p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-aggie-silver">Senior Roadmap</p>
            <h1 className="text-glow mt-3 text-4xl font-black tracking-tight text-white">
              Career Mapping & Transition
            </h1>
            <p className="mt-4 max-w-3xl leading-7 text-aggie-light/76">
              As graduation approaches, it is important to have a clear plan for your next chapter. This module helps
              student-athletes identify their goals, prepare for their transition out of athletics, and create an action
              plan for success after Utah State.
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
          <Card title="Transition Self-Assessment" icon={<Sparkles className="h-6 w-6 text-aggie-ice" />}>
            <div className="grid gap-4 md:grid-cols-2">
              <TextArea
                label="What are your immediate plans after graduation?"
                value={form.selfAssessment.immediatePlans}
                onChange={(value) => updateSelfAssessment("immediatePlans", value)}
              />
              <TextArea
                label="What are your long-term career goals?"
                value={form.selfAssessment.longTermGoals}
                onChange={(value) => updateSelfAssessment("longTermGoals", value)}
              />
              <TextArea
                label="What excites you most about your next chapter?"
                value={form.selfAssessment.nextChapterExcitement}
                onChange={(value) => updateSelfAssessment("nextChapterExcitement", value)}
              />
              <TextArea
                label="What concerns you most about the transition?"
                value={form.selfAssessment.transitionConcerns}
                onChange={(value) => updateSelfAssessment("transitionConcerns", value)}
              />
            </div>
          </Card>

          <Card title="Post-Graduation Pathway" icon={<Map className="h-6 w-6 text-aggie-ice" />}>
            <p className="mb-4 text-sm font-semibold text-aggie-muted">Select one or more pathways.</p>
            <div className="grid gap-3 md:grid-cols-2">
              {pathwayOptions.map((option) => (
                <ToggleCard
                  key={option}
                  label={option}
                  selected={form.pathways.includes(option)}
                  onClick={() => toggleList("pathways", option)}
                />
              ))}
            </div>
          </Card>

          <Card title="Career Mapping" icon={<Target className="h-6 w-6 text-aggie-ice" />}>
            <div className="grid gap-4 md:grid-cols-2">
              <TextInput
                label="Dream Career"
                value={form.careerMapping.dreamCareer}
                onChange={(value) => updateCareerMapping("dreamCareer", value)}
              />
              <TextInput
                label="First Career Goal"
                value={form.careerMapping.firstCareerGoal}
                onChange={(value) => updateCareerMapping("firstCareerGoal", value)}
              />
              <TextInput
                label="Long-Term Career Goal"
                value={form.careerMapping.longTermCareerGoal}
                onChange={(value) => updateCareerMapping("longTermCareerGoal", value)}
              />
              <TextInput
                label="Target Industry"
                value={form.careerMapping.targetIndustry}
                onChange={(value) => updateCareerMapping("targetIndustry", value)}
              />
              <TextInput
                label="Preferred Location"
                value={form.careerMapping.preferredLocation}
                onChange={(value) => updateCareerMapping("preferredLocation", value)}
              />
            </div>
          </Card>

          <Card title="Transition Readiness Checklist" icon={<Check className="h-6 w-6 text-aggie-ice" />}>
            <div className="grid gap-3 md:grid-cols-2">
              {readinessItems.map((item) => (
                <ToggleCard
                  key={item}
                  label={item}
                  selected={form.readinessChecklist.includes(item)}
                  onClick={() => toggleList("readinessChecklist", item)}
                />
              ))}
            </div>
          </Card>

          <Card title="90-Day Action Plan" icon={<CalendarCheck className="h-6 w-6 text-aggie-ice" />}>
            <div className="grid gap-4 lg:grid-cols-3">
              <TextArea
                label="Within 30 Days"
                value={form.actionPlan.within30Days}
                onChange={(value) => updateActionPlan("within30Days", value)}
              />
              <TextArea
                label="Within 60 Days"
                value={form.actionPlan.within60Days}
                onChange={(value) => updateActionPlan("within60Days", value)}
              />
              <TextArea
                label="Within 90 Days"
                value={form.actionPlan.within90Days}
                onChange={(value) => updateActionPlan("within90Days", value)}
              />
            </div>
          </Card>

          <Card title="Aggies Lead Career Meeting" icon={<CalendarCheck className="h-6 w-6 text-aggie-ice" />}>
            <p className="leading-7 text-aggie-light/74">
              Meet with Aggies Lead to review your post-graduation plan, next steps, and transition support needs.
            </p>
            <button
              type="button"
              onClick={() => setForm((current) => ({ ...current, meetingScheduled: true }))}
              className="mt-4 rounded-lg bg-aggie-blue px-4 py-3 text-sm font-black text-white transition hover:bg-aggie-blue/85"
            >
              Schedule Career Mapping Meeting
            </button>
            {form.meetingScheduled ? (
              <p className="mt-3 text-sm font-semibold text-aggie-ice">Placeholder meeting request marked.</p>
            ) : null}
          </Card>

          <Card title="Module Completion" icon={<Check className="h-6 w-6 text-aggie-ice" />}>
            <p className="leading-7 text-aggie-light/74">
              Complete this module after you have mapped your pathway, readiness steps, and 90-day action plan.
            </p>
            <button
              type="button"
              onClick={markComplete}
              className="mt-4 rounded-lg bg-aggie-ice px-4 py-3 text-sm font-black text-aggie-navy transition hover:bg-white"
            >
              Career Mapping & Transition Completed
            </button>
            {form.moduleStatus === "Completed" ? (
              <p className="mt-4 rounded-lg border border-aggie-ice/30 bg-aggie-ice/10 p-4 text-sm font-semibold text-aggie-light">
                Great work. You have a clearer plan for your next chapter after Utah State.
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

          <Card title="Transition Snapshot">
            <div className="space-y-3">
              <Snapshot label="Self-Assessment" value={selfAssessmentStarted ? "Started" : "Not Started"} />
              <Snapshot label="Pathways Selected" value={String(form.pathways.length)} />
              <Snapshot label="Readiness Items" value={`${form.readinessChecklist.length}/${readinessItems.length}`} />
              <Snapshot label="Career Meeting" value={form.meetingScheduled ? "Marked" : "Not Scheduled"} />
            </div>
          </Card>

          <Link
            href="/roadmaps/senior"
            className="block rounded-lg border border-white/10 bg-white/6 p-4 text-sm font-bold text-aggie-light transition hover:border-aggie-ice/40 hover:bg-white/10"
          >
            Return to Senior Roadmap
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

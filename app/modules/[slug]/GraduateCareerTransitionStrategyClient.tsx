"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { CalendarCheck, Check, Clock3, Map, RefreshCw, Save, ShieldCheck, Target } from "lucide-react";
import { GhostButton } from "@/components/Prototype";
import { usePrototypeState } from "@/components/PrototypeState";

const moduleSlug = "career-transition-strategy";
const storageKey = "aggies-lead:graduate:career-transition-strategy";

type TransitionPlan = {
  primaryGoal: string;
  backupPlan: string;
  targetIndustry: string;
  preferredLocation: string;
  targetStartDate: string;
};

type Challenges = {
  concerns: string;
  supportNeeded: string;
  obstacles: string;
};

type NinetyDayPlan = {
  thirtyDayGoal: string;
  sixtyDayGoal: string;
  ninetyDayGoal: string;
};

type CareerTransitionStrategyState = {
  nextSteps: string[];
  readinessChecklist: string[];
  transitionPlan: TransitionPlan;
  challenges: Challenges;
  ninetyDayPlan: NinetyDayPlan;
  careerAppointmentScheduled: boolean;
  transitionMeetingScheduled: boolean;
  moduleStatus: "Not Started" | "In Progress" | "Completed";
  progressPercentage: number;
};

const nextStepOptions = [
  "Full-Time Employment",
  "Graduate School",
  "Professional Athletics",
  "Entrepreneurship",
  "Military Service",
  "Other",
];

const readinessItems = [
  "Resume finalized",
  "LinkedIn profile finalized",
  "References secured",
  "Career plan identified",
  "Professional network established",
  "Job search active",
  "Financial plan established",
  "Housing plan established",
];

const initialState: CareerTransitionStrategyState = {
  nextSteps: [],
  readinessChecklist: [],
  transitionPlan: {
    primaryGoal: "",
    backupPlan: "",
    targetIndustry: "",
    preferredLocation: "",
    targetStartDate: "",
  },
  challenges: {
    concerns: "",
    supportNeeded: "",
    obstacles: "",
  },
  ninetyDayPlan: {
    thirtyDayGoal: "",
    sixtyDayGoal: "",
    ninetyDayGoal: "",
  },
  careerAppointmentScheduled: false,
  transitionMeetingScheduled: false,
  moduleStatus: "Not Started",
  progressPercentage: 0,
};

export function GraduateCareerTransitionStrategyClient() {
  const { completeModule } = usePrototypeState();
  const [form, setForm] = useState<CareerTransitionStrategyState>(initialState);
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

  const transitionPlanStarted = Object.values(form.transitionPlan).some((value) => value.trim().length > 0);
  const challengesStarted = Object.values(form.challenges).some((value) => value.trim().length > 0);
  const ninetyDayPlanStarted = Object.values(form.ninetyDayPlan).some((value) => value.trim().length > 0);

  const completion = useMemo(() => {
    const tasks = [
      form.nextSteps.length > 0,
      form.readinessChecklist.length > 0,
      transitionPlanStarted,
      challengesStarted,
      ninetyDayPlanStarted,
      form.careerAppointmentScheduled || form.transitionMeetingScheduled,
      form.moduleStatus === "Completed",
    ];
    const completed = tasks.filter(Boolean).length;
    const percent = form.moduleStatus === "Completed" ? 100 : Math.round((completed / tasks.length) * 100);
    return { completed, total: tasks.length, percent };
  }, [
    challengesStarted,
    form.careerAppointmentScheduled,
    form.moduleStatus,
    form.nextSteps.length,
    form.readinessChecklist.length,
    form.transitionMeetingScheduled,
    ninetyDayPlanStarted,
    transitionPlanStarted,
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
    const completedForm: CareerTransitionStrategyState = {
      ...form,
      moduleStatus: "Completed",
      progressPercentage: 100,
    };
    setForm(completedForm);
    persist(completedForm, "Career Transition Strategy completed.");
    completeModule(moduleSlug);
  };

  const toggleList = (field: "nextSteps" | "readinessChecklist", item: string) => {
    setForm((current) => ({
      ...current,
      [field]: current[field].includes(item)
        ? current[field].filter((selected) => selected !== item)
        : [...current[field], item],
    }));
  };

  const updateTransitionPlan = (field: keyof TransitionPlan, value: string) => {
    setForm((current) => ({ ...current, transitionPlan: { ...current.transitionPlan, [field]: value } }));
  };

  const updateChallenges = (field: keyof Challenges, value: string) => {
    setForm((current) => ({ ...current, challenges: { ...current.challenges, [field]: value } }));
  };

  const updateNinetyDayPlan = (field: keyof NinetyDayPlan, value: string) => {
    setForm((current) => ({ ...current, ninetyDayPlan: { ...current.ninetyDayPlan, [field]: value } }));
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
              Career Transition Strategy
            </h1>
            <p className="mt-4 max-w-3xl leading-7 text-aggie-light/76">
              As your time as a student-athlete comes to an end, it is important to have a clear strategy for your
              transition into the next phase of life. Whether your next step is employment, graduate school, professional
              athletics, or another opportunity, this module will help you create a plan for success.
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
          <Card title="My Next Step" icon={<Map className="h-6 w-6 text-aggie-ice" />}>
            <p className="mb-4 text-sm font-semibold text-aggie-muted">Select all that apply.</p>
            <div className="grid gap-3 md:grid-cols-2">
              {nextStepOptions.map((option) => (
                <ToggleCard
                  key={option}
                  label={option}
                  selected={form.nextSteps.includes(option)}
                  onClick={() => toggleList("nextSteps", option)}
                />
              ))}
            </div>
          </Card>

          <Card title="Transition Readiness Assessment" icon={<ShieldCheck className="h-6 w-6 text-aggie-ice" />}>
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

          <Card title="My Transition Plan" icon={<Target className="h-6 w-6 text-aggie-ice" />}>
            <div className="grid gap-4 md:grid-cols-2">
              <TextInput
                label="Primary Goal"
                value={form.transitionPlan.primaryGoal}
                onChange={(value) => updateTransitionPlan("primaryGoal", value)}
              />
              <TextInput
                label="Backup Plan"
                value={form.transitionPlan.backupPlan}
                onChange={(value) => updateTransitionPlan("backupPlan", value)}
              />
              <TextInput
                label="Target Industry"
                value={form.transitionPlan.targetIndustry}
                onChange={(value) => updateTransitionPlan("targetIndustry", value)}
              />
              <TextInput
                label="Preferred Location"
                value={form.transitionPlan.preferredLocation}
                onChange={(value) => updateTransitionPlan("preferredLocation", value)}
              />
              <TextInput
                label="Target Start Date"
                value={form.transitionPlan.targetStartDate}
                onChange={(value) => updateTransitionPlan("targetStartDate", value)}
              />
            </div>
          </Card>

          <Card title="Potential Challenges" icon={<Check className="h-6 w-6 text-aggie-ice" />}>
            <div className="grid gap-4 lg:grid-cols-3">
              <TextArea
                label="What concerns do you have about the transition?"
                value={form.challenges.concerns}
                onChange={(value) => updateChallenges("concerns", value)}
              />
              <TextArea
                label="What support do you need?"
                value={form.challenges.supportNeeded}
                onChange={(value) => updateChallenges("supportNeeded", value)}
              />
              <TextArea
                label="What obstacles may arise?"
                value={form.challenges.obstacles}
                onChange={(value) => updateChallenges("obstacles", value)}
              />
            </div>
          </Card>

          <Card title="90-Day Transition Plan" icon={<CalendarCheck className="h-6 w-6 text-aggie-ice" />}>
            <div className="grid gap-4 lg:grid-cols-3">
              <TextArea
                label="30-Day Goal"
                value={form.ninetyDayPlan.thirtyDayGoal}
                onChange={(value) => updateNinetyDayPlan("thirtyDayGoal", value)}
              />
              <TextArea
                label="60-Day Goal"
                value={form.ninetyDayPlan.sixtyDayGoal}
                onChange={(value) => updateNinetyDayPlan("sixtyDayGoal", value)}
              />
              <TextArea
                label="90-Day Goal"
                value={form.ninetyDayPlan.ninetyDayGoal}
                onChange={(value) => updateNinetyDayPlan("ninetyDayGoal", value)}
              />
            </div>
          </Card>

          <Card title="Aggies Lead Support" icon={<CalendarCheck className="h-6 w-6 text-aggie-ice" />}>
            <div className="grid gap-3 md:grid-cols-2">
              <button
                type="button"
                onClick={() => setForm((current) => ({ ...current, careerAppointmentScheduled: true }))}
                className="rounded-lg bg-aggie-blue px-4 py-3 text-sm font-black text-white transition hover:bg-aggie-blue/85"
              >
                Schedule Career Appointment
              </button>
              <button
                type="button"
                onClick={() => setForm((current) => ({ ...current, transitionMeetingScheduled: true }))}
                className="rounded-lg bg-aggie-blue px-4 py-3 text-sm font-black text-white transition hover:bg-aggie-blue/85"
              >
                Schedule Transition Planning Meeting
              </button>
            </div>
            {form.careerAppointmentScheduled || form.transitionMeetingScheduled ? (
              <p className="mt-3 text-sm font-semibold text-aggie-ice">Placeholder support request marked.</p>
            ) : null}
            <button
              type="button"
              onClick={markComplete}
              className="mt-4 rounded-lg bg-aggie-ice px-4 py-3 text-sm font-black text-aggie-navy transition hover:bg-white"
            >
              Career Transition Strategy Completed
            </button>
            {form.moduleStatus === "Completed" ? (
              <p className="mt-4 rounded-lg border border-aggie-ice/30 bg-aggie-ice/10 p-4 text-sm font-semibold text-aggie-light">
                Great work. Your transition strategy is ready to guide your next steps.
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

          <Card title="Strategy Snapshot">
            <div className="space-y-3">
              <Snapshot label="Next Steps" value={String(form.nextSteps.length)} />
              <Snapshot label="Readiness" value={`${form.readinessChecklist.length}/${readinessItems.length}`} />
              <Snapshot label="Transition Plan" value={transitionPlanStarted ? "Started" : "Not Started"} />
              <Snapshot label="Support" value={form.careerAppointmentScheduled || form.transitionMeetingScheduled ? "Marked" : "Not Marked"} />
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

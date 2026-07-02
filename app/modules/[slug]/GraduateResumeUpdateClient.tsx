"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { Check, Clock3, FileText, RefreshCw, Save, Target, Upload } from "lucide-react";
import { GhostButton } from "@/components/Prototype";
import { usePrototypeState } from "@/components/PrototypeState";

const moduleSlug = "graduate-resume-update";
const storageKey = "aggies-lead:graduate:graduate-resume-update";

const auditItems = [
  "Updated within the last 30 days",
  "Graduation date included",
  "Contact information updated",
  "LinkedIn profile included",
  "Leadership experiences highlighted",
  "Internship experience included",
  "Employment experience included",
  "Skills section tailored to career goals",
  "Accomplishment statements updated",
  "No spelling or grammar errors",
];

const primaryGoals = ["Full-Time Employment", "Graduate School", "Professional Athletics", "Other"];

const tailoringGuidance: Record<string, string> = {
  "Full-Time Employment":
    "Emphasize relevant experience, measurable accomplishments, leadership, technical skills, and keywords from job descriptions.",
  "Graduate School":
    "Highlight academic preparation, research, leadership, service, faculty relationships, and experiences connected to your intended program.",
  "Professional Athletics":
    "Include athletic accomplishments, leadership, performance history, training discipline, coachability, and professional support materials when relevant.",
  Other:
    "Tailor your resume toward the opportunity by emphasizing transferable skills, recent accomplishments, and the experiences most connected to your goal.",
};

const impactOptions = [
  "Needs Major Updates",
  "Needs Minor Updates",
  "Application Ready",
  "Interview Ready",
];

const readinessItems = [
  "Resume finalized",
  "References secured",
  "LinkedIn updated",
  "Career goals identified",
];

type GraduateResumeState = {
  auditChecklist: string[];
  primaryGoal: string;
  impactReview: string;
  resumeUploaded: boolean;
  appointmentScheduled: boolean;
  readinessChecklist: string[];
  moduleStatus: "Not Started" | "In Progress" | "Completed";
  progressPercentage: number;
};

const initialState: GraduateResumeState = {
  auditChecklist: [],
  primaryGoal: "",
  impactReview: "",
  resumeUploaded: false,
  appointmentScheduled: false,
  readinessChecklist: [],
  moduleStatus: "Not Started",
  progressPercentage: 0,
};

export function GraduateResumeUpdateClient() {
  const { completeModule } = usePrototypeState();
  const [form, setForm] = useState<GraduateResumeState>(initialState);
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
      Boolean(form.primaryGoal),
      Boolean(form.impactReview),
      form.resumeUploaded || form.appointmentScheduled,
      form.readinessChecklist.length > 0,
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
    const completedForm: GraduateResumeState = {
      ...form,
      moduleStatus: "Completed",
      progressPercentage: 100,
    };
    setForm(completedForm);
    persist(completedForm, "Graduate Resume Update completed.");
    completeModule(moduleSlug);
  };

  const toggleList = (field: "auditChecklist" | "readinessChecklist", item: string) => {
    setForm((current) => ({
      ...current,
      [field]: current[field].includes(item)
        ? current[field].filter((selected) => selected !== item)
        : [...current[field], item],
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
              Graduate Resume Update
            </h1>
            <p className="mt-4 max-w-3xl leading-7 text-aggie-light/76">
              Your resume should now be tailored toward your specific post-graduation goals. This module focuses on
              positioning your experiences, leadership, and accomplishments for employment, graduate school, or
              professional opportunities.
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
          <Card title="Resume Audit" icon={<FileText className="h-6 w-6 text-aggie-ice" />}>
            <div className="grid gap-3 md:grid-cols-2">
              {auditItems.map((item) => (
                <ToggleCard
                  key={item}
                  label={item}
                  selected={form.auditChecklist.includes(item)}
                  onClick={() => toggleList("auditChecklist", item)}
                />
              ))}
            </div>
          </Card>

          <Card title="Tailor Your Resume" icon={<Target className="h-6 w-6 text-aggie-ice" />}>
            <p className="mb-4 text-sm font-semibold text-aggie-muted">Select your primary goal.</p>
            <div className="grid gap-3 md:grid-cols-2">
              {primaryGoals.map((goal) => (
                <button
                  key={goal}
                  type="button"
                  onClick={() => setForm((current) => ({ ...current, primaryGoal: goal }))}
                  className={`rounded-lg border px-4 py-3 text-left text-sm font-black transition ${
                    form.primaryGoal === goal
                      ? "border-aggie-ice/70 bg-aggie-ice/14 text-white"
                      : "border-white/10 bg-white/5 text-aggie-light/78 hover:border-aggie-ice/40 hover:bg-white/10"
                  }`}
                >
                  {goal}
                </button>
              ))}
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {primaryGoals.map((goal) => (
                <article
                  key={goal}
                  className={`rounded-lg border p-4 ${
                    form.primaryGoal === goal ? "border-aggie-ice/50 bg-aggie-ice/10" : "border-white/10 bg-white/5"
                  }`}
                >
                  <h3 className="font-black text-white">{goal}</h3>
                  <p className="mt-2 text-sm leading-6 text-aggie-light/74">{tailoringGuidance[goal]}</p>
                </article>
              ))}
            </div>
          </Card>

          <Card title="Resume Impact Review" icon={<Check className="h-6 w-6 text-aggie-ice" />}>
            <div className="grid gap-3 md:grid-cols-2">
              {impactOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setForm((current) => ({ ...current, impactReview: option }))}
                  className={`rounded-lg border px-4 py-3 text-left text-sm font-black transition ${
                    form.impactReview === option
                      ? "border-aggie-ice/70 bg-aggie-ice/14 text-white"
                      : "border-white/10 bg-white/5 text-aggie-light/78 hover:border-aggie-ice/40 hover:bg-white/10"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </Card>

          <Card title="Resume Submission" icon={<Upload className="h-6 w-6 text-aggie-ice" />}>
            <div className="grid gap-3 md:grid-cols-2">
              <button
                type="button"
                onClick={() => setForm((current) => ({ ...current, resumeUploaded: true }))}
                className="rounded-lg bg-aggie-blue px-4 py-3 text-sm font-black text-white transition hover:bg-aggie-blue/85"
              >
                Upload Resume for Review
              </button>
              <button
                type="button"
                onClick={() => setForm((current) => ({ ...current, appointmentScheduled: true }))}
                className="rounded-lg bg-aggie-blue px-4 py-3 text-sm font-black text-white transition hover:bg-aggie-blue/85"
              >
                Schedule Resume Appointment
              </button>
            </div>
            {form.resumeUploaded || form.appointmentScheduled ? (
              <p className="mt-3 text-sm font-semibold text-aggie-ice">Placeholder resume support action marked.</p>
            ) : null}
          </Card>

          <Card title="Application Readiness" icon={<Check className="h-6 w-6 text-aggie-ice" />}>
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
            <button
              type="button"
              onClick={markComplete}
              className="mt-4 rounded-lg bg-aggie-ice px-4 py-3 text-sm font-black text-aggie-navy transition hover:bg-white"
            >
              Graduate Resume Update Completed
            </button>
            {form.moduleStatus === "Completed" ? (
              <p className="mt-4 rounded-lg border border-aggie-ice/30 bg-aggie-ice/10 p-4 text-sm font-semibold text-aggie-light">
                Great work. Your resume is positioned for your next post-graduation opportunity.
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

          <Card title="Resume Snapshot">
            <div className="space-y-3">
              <Snapshot label="Audit" value={`${form.auditChecklist.length}/${auditItems.length}`} />
              <Snapshot label="Primary Goal" value={form.primaryGoal || "Not Selected"} />
              <Snapshot label="Impact Review" value={form.impactReview || "Not Rated"} />
              <Snapshot label="Readiness" value={`${form.readinessChecklist.length}/${readinessItems.length}`} />
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

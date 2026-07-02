"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { BriefcaseBusiness, CalendarCheck, Check, Clock3, Plus, RefreshCw, Save, Target, Trash2 } from "lucide-react";
import { GhostButton } from "@/components/Prototype";
import { usePrototypeState } from "@/components/PrototypeState";

const moduleSlug = "full-time-job-search-plan";
const storageKey = "aggies-lead:graduate:full-time-job-search-plan";

const strategyItems = [
  "Resume finalized",
  "LinkedIn updated",
  "References secured",
  "Target employers identified",
  "Networking plan established",
  "Interview preparation completed",
];

const weeklyGoals = [
  "Applied to 3+ positions",
  "Connected with 3 professionals",
  "Followed up on applications",
  "Conducted networking outreach",
  "Practiced interview skills",
];

const statusOptions = [
  "Researching",
  "Applying",
  "Interviewing",
  "Final Round",
  "Offer Received",
  "Accepted",
];

type CareerGoal = {
  desiredCareerField: string;
  desiredJobTitle: string;
  preferredLocation: string;
  targetSalaryRange: string;
  preferredWorkEnvironment: string;
};

type Employer = {
  id: string;
  employerName: string;
  industry: string;
  positionOfInterest: string;
  applicationDeadline: string;
  status: string;
};

type EmployerDraft = Omit<Employer, "id">;

type FullTimeJobSearchState = {
  careerGoal: CareerGoal;
  strategyChecklist: string[];
  employers: Employer[];
  employerDraft: EmployerDraft;
  weeklyGoals: string[];
  careerAppointmentScheduled: boolean;
  resumeReviewScheduled: boolean;
  mockInterviewScheduled: boolean;
  moduleStatus: "Not Started" | "In Progress" | "Completed";
  progressPercentage: number;
};

const emptyEmployerDraft: EmployerDraft = {
  employerName: "",
  industry: "",
  positionOfInterest: "",
  applicationDeadline: "",
  status: "Researching",
};

const initialState: FullTimeJobSearchState = {
  careerGoal: {
    desiredCareerField: "",
    desiredJobTitle: "",
    preferredLocation: "",
    targetSalaryRange: "",
    preferredWorkEnvironment: "",
  },
  strategyChecklist: [],
  employers: [],
  employerDraft: emptyEmployerDraft,
  weeklyGoals: [],
  careerAppointmentScheduled: false,
  resumeReviewScheduled: false,
  mockInterviewScheduled: false,
  moduleStatus: "Not Started",
  progressPercentage: 0,
};

export function FullTimeJobSearchPlanClient() {
  const { completeModule } = usePrototypeState();
  const [form, setForm] = useState<FullTimeJobSearchState>(initialState);
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

  const careerGoalStarted = Object.values(form.careerGoal).some((value) => value.trim().length > 0);

  const completion = useMemo(() => {
    const tasks = [
      careerGoalStarted,
      form.strategyChecklist.length > 0,
      form.employers.length > 0,
      form.weeklyGoals.length > 0,
      form.employers.some((employer) => employer.status !== "Researching"),
      form.careerAppointmentScheduled || form.resumeReviewScheduled || form.mockInterviewScheduled,
      form.moduleStatus === "Completed",
    ];
    const completed = tasks.filter(Boolean).length;
    const percent = form.moduleStatus === "Completed" ? 100 : Math.round((completed / tasks.length) * 100);
    return { completed, total: tasks.length, percent };
  }, [careerGoalStarted, form]);

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
    const completedForm: FullTimeJobSearchState = {
      ...form,
      moduleStatus: "Completed",
      progressPercentage: 100,
    };
    setForm(completedForm);
    persist(completedForm, "Full-Time Job Search Plan completed.");
    completeModule(moduleSlug);
  };

  const updateCareerGoal = (field: keyof CareerGoal, value: string) => {
    setForm((current) => ({ ...current, careerGoal: { ...current.careerGoal, [field]: value } }));
  };

  const updateEmployerDraft = (field: keyof EmployerDraft, value: string) => {
    setForm((current) => ({ ...current, employerDraft: { ...current.employerDraft, [field]: value } }));
  };

  const toggleList = (field: "strategyChecklist" | "weeklyGoals", item: string) => {
    setForm((current) => ({
      ...current,
      [field]: current[field].includes(item)
        ? current[field].filter((selected) => selected !== item)
        : [...current[field], item],
    }));
  };

  const addEmployer = () => {
    const hasEntry = Object.values(form.employerDraft).some((value) => value.trim().length > 0 && value !== "Researching");
    if (!hasEntry && !form.employerDraft.employerName.trim()) return;

    setForm((current) => ({
      ...current,
      employers: [...current.employers, { ...current.employerDraft, id: crypto.randomUUID() }],
      employerDraft: emptyEmployerDraft,
    }));
  };

  const deleteEmployer = (id: string) => {
    setForm((current) => ({
      ...current,
      employers: current.employers.filter((employer) => employer.id !== id),
    }));
  };

  const updateEmployerStatus = (id: string, status: string) => {
    setForm((current) => ({
      ...current,
      employers: current.employers.map((employer) => (employer.id === id ? { ...employer, status } : employer)),
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
              Full-Time Job Search Plan
            </h1>
            <p className="mt-4 max-w-3xl leading-7 text-aggie-light/76">
              A successful job search requires organization, consistency, and intentional action. This module will help
              you build and execute a personalized strategy for securing full-time employment.
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
          <Card title="Career Goal Identification" icon={<Target className="h-6 w-6 text-aggie-ice" />}>
            <div className="grid gap-4 md:grid-cols-2">
              <TextInput label="Desired Career Field" value={form.careerGoal.desiredCareerField} onChange={(value) => updateCareerGoal("desiredCareerField", value)} />
              <TextInput label="Desired Job Title" value={form.careerGoal.desiredJobTitle} onChange={(value) => updateCareerGoal("desiredJobTitle", value)} />
              <TextInput label="Preferred Location" value={form.careerGoal.preferredLocation} onChange={(value) => updateCareerGoal("preferredLocation", value)} />
              <TextInput label="Target Salary Range" value={form.careerGoal.targetSalaryRange} onChange={(value) => updateCareerGoal("targetSalaryRange", value)} />
              <TextInput label="Preferred Work Environment" value={form.careerGoal.preferredWorkEnvironment} onChange={(value) => updateCareerGoal("preferredWorkEnvironment", value)} />
            </div>
          </Card>

          <Card title="Job Search Strategy" icon={<Check className="h-6 w-6 text-aggie-ice" />}>
            <div className="grid gap-3 md:grid-cols-2">
              {strategyItems.map((item) => (
                <ToggleCard
                  key={item}
                  label={item}
                  selected={form.strategyChecklist.includes(item)}
                  onClick={() => toggleList("strategyChecklist", item)}
                />
              ))}
            </div>
          </Card>

          <Card title="Target Employer List" icon={<BriefcaseBusiness className="h-6 w-6 text-aggie-ice" />}>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              <TextInput label="Employer Name" value={form.employerDraft.employerName} onChange={(value) => updateEmployerDraft("employerName", value)} />
              <TextInput label="Industry" value={form.employerDraft.industry} onChange={(value) => updateEmployerDraft("industry", value)} />
              <TextInput label="Position of Interest" value={form.employerDraft.positionOfInterest} onChange={(value) => updateEmployerDraft("positionOfInterest", value)} />
              <TextInput label="Application Deadline" value={form.employerDraft.applicationDeadline} onChange={(value) => updateEmployerDraft("applicationDeadline", value)} />
              <label className="block">
                <span className="text-sm font-black text-white">Status</span>
                <select
                  value={form.employerDraft.status}
                  onChange={(event) => updateEmployerDraft("status", event.target.value)}
                  className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition focus:border-aggie-ice/60"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status} className="bg-aggie-navy">
                      {status}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <button
              type="button"
              onClick={addEmployer}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-aggie-blue px-4 py-3 text-sm font-black text-white transition hover:bg-aggie-blue/85"
            >
              <Plus className="h-4 w-4" />
              Add Employer
            </button>

            <div className="mt-5 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="text-xs uppercase tracking-[0.16em] text-aggie-muted">
                  <tr>
                    {["Employer Name", "Industry", "Position of Interest", "Application Deadline", "Status", ""].map((heading) => (
                      <th key={heading} className="border-b border-white/10 px-3 py-3 font-black">
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {form.employers.length ? (
                    form.employers.map((employer) => (
                      <tr key={employer.id} className="border-b border-white/8 text-aggie-light">
                        <td className="px-3 py-3">{employer.employerName || "-"}</td>
                        <td className="px-3 py-3">{employer.industry || "-"}</td>
                        <td className="px-3 py-3">{employer.positionOfInterest || "-"}</td>
                        <td className="px-3 py-3">{employer.applicationDeadline || "-"}</td>
                        <td className="px-3 py-3">
                          <select
                            value={employer.status}
                            onChange={(event) => updateEmployerStatus(employer.id, event.target.value)}
                            className="min-w-36 rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none focus:border-aggie-ice/60"
                          >
                            {statusOptions.map((status) => (
                              <option key={status} value={status} className="bg-aggie-navy">
                                {status}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-3 py-3">
                          <button
                            type="button"
                            onClick={() => deleteEmployer(employer.id)}
                            className="rounded-lg border border-white/10 bg-white/5 p-2 text-aggie-light transition hover:border-aggie-ice/40 hover:bg-white/10"
                            aria-label={`Delete ${employer.employerName || "employer"}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-3 py-5 text-center font-semibold text-aggie-muted">
                        No target employers added yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          <Card title="Weekly Job Search Goals" icon={<CalendarCheck className="h-6 w-6 text-aggie-ice" />}>
            <div className="grid gap-3 md:grid-cols-2">
              {weeklyGoals.map((item) => (
                <ToggleCard
                  key={item}
                  label={item}
                  selected={form.weeklyGoals.includes(item)}
                  onClick={() => toggleList("weeklyGoals", item)}
                />
              ))}
            </div>
          </Card>

          <Card title="Job Search Tracker" icon={<BriefcaseBusiness className="h-6 w-6 text-aggie-ice" />}>
            <p className="leading-7 text-aggie-light/74">
              Use the status dropdowns in your target employer list to track each opportunity from research through
              acceptance.
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {statusOptions.map((status) => (
                <div key={status} className="rounded-lg border border-white/10 bg-white/6 p-4">
                  <p className="text-sm font-bold text-aggie-muted">{status}</p>
                  <p className="mt-1 text-2xl font-black text-white">
                    {form.employers.filter((employer) => employer.status === status).length}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Aggies Lead Support" icon={<CalendarCheck className="h-6 w-6 text-aggie-ice" />}>
            <div className="grid gap-3 md:grid-cols-3">
              <button type="button" onClick={() => setForm((current) => ({ ...current, careerAppointmentScheduled: true }))} className="rounded-lg bg-aggie-blue px-4 py-3 text-sm font-black text-white transition hover:bg-aggie-blue/85">
                Schedule Career Appointment
              </button>
              <button type="button" onClick={() => setForm((current) => ({ ...current, resumeReviewScheduled: true }))} className="rounded-lg bg-aggie-blue px-4 py-3 text-sm font-black text-white transition hover:bg-aggie-blue/85">
                Schedule Resume Review
              </button>
              <button type="button" onClick={() => setForm((current) => ({ ...current, mockInterviewScheduled: true }))} className="rounded-lg bg-aggie-blue px-4 py-3 text-sm font-black text-white transition hover:bg-aggie-blue/85">
                Schedule Mock Interview
              </button>
            </div>
            {form.careerAppointmentScheduled || form.resumeReviewScheduled || form.mockInterviewScheduled ? (
              <p className="mt-3 text-sm font-semibold text-aggie-ice">Placeholder career support action marked.</p>
            ) : null}
            <button
              type="button"
              onClick={markComplete}
              className="mt-4 rounded-lg bg-aggie-ice px-4 py-3 text-sm font-black text-aggie-navy transition hover:bg-white"
            >
              Full-Time Job Search Plan Completed
            </button>
            {form.moduleStatus === "Completed" ? (
              <p className="mt-4 rounded-lg border border-aggie-ice/30 bg-aggie-ice/10 p-4 text-sm font-semibold text-aggie-light">
                Great work. Your full-time job search plan is organized and ready to execute.
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

          <Card title="Job Search Snapshot">
            <div className="space-y-3">
              <Snapshot label="Career Goal" value={careerGoalStarted ? "Started" : "Not Started"} />
              <Snapshot label="Target Employers" value={String(form.employers.length)} />
              <Snapshot label="Weekly Goals" value={`${form.weeklyGoals.length}/${weeklyGoals.length}`} />
              <Snapshot label="Accepted Offers" value={String(form.employers.filter((employer) => employer.status === "Accepted").length)} />
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

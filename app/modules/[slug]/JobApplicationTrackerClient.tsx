"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BriefcaseBusiness, CalendarCheck, Check, Clock3, Plus, RefreshCw, Save, Send, Trash2 } from "lucide-react";
import { GhostButton } from "@/components/Prototype";
import { usePrototypeState } from "@/components/PrototypeState";

const moduleSlug = "job-application-tracker";
const storageKey = "aggies-lead:senior:job-application-tracker";

const statusOptions = [
  "Interested",
  "Applied",
  "Interview Scheduled",
  "Interview Completed",
  "Offer Received",
  "Not Selected",
  "Accepted",
];

const weeklyGoals = [
  "Applied to 3 positions",
  "Followed up on existing applications",
  "Attended a networking event",
  "Updated LinkedIn activity",
  "Connected with a professional contact",
];

type ApplicationStatus = (typeof statusOptions)[number];

type JobApplication = {
  id: string;
  company: string;
  positionTitle: string;
  dateApplied: string;
  applicationStatus: ApplicationStatus;
  interviewDate: string;
  followUpSent: boolean;
  notes: string;
};

type ApplicationDraft = Omit<JobApplication, "id">;

type JobApplicationTrackerState = {
  applications: JobApplication[];
  draft: ApplicationDraft;
  weeklyGoals: string[];
  careerAppointmentScheduled: boolean;
  resumeReviewScheduled: boolean;
  mockInterviewScheduled: boolean;
  moduleStatus: "Not Started" | "In Progress" | "Completed";
  progressPercentage: number;
};

const emptyDraft: ApplicationDraft = {
  company: "",
  positionTitle: "",
  dateApplied: "",
  applicationStatus: "Interested",
  interviewDate: "",
  followUpSent: false,
  notes: "",
};

const initialState: JobApplicationTrackerState = {
  applications: [],
  draft: emptyDraft,
  weeklyGoals: [],
  careerAppointmentScheduled: false,
  resumeReviewScheduled: false,
  mockInterviewScheduled: false,
  moduleStatus: "Not Started",
  progressPercentage: 0,
};

export function JobApplicationTrackerClient() {
  const { completeModule } = usePrototypeState();
  const [form, setForm] = useState<JobApplicationTrackerState>(initialState);
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

  const dashboard = useMemo(() => {
    const applicationsSubmitted = form.applications.filter((item) =>
      ["Applied", "Interview Scheduled", "Interview Completed", "Offer Received", "Not Selected", "Accepted"].includes(item.applicationStatus),
    ).length;
    return {
      applicationsSubmitted,
      interviewsScheduled: form.applications.filter((item) => item.applicationStatus === "Interview Scheduled" || Boolean(item.interviewDate)).length,
      interviewsCompleted: form.applications.filter((item) => item.applicationStatus === "Interview Completed").length,
      offersReceived: form.applications.filter((item) => item.applicationStatus === "Offer Received" || item.applicationStatus === "Accepted").length,
      followUpsSent: form.applications.filter((item) => item.followUpSent).length,
    };
  }, [form.applications]);

  const completion = useMemo(() => {
    const tasks = [
      form.applications.length > 0,
      form.weeklyGoals.length > 0,
      form.careerAppointmentScheduled || form.resumeReviewScheduled || form.mockInterviewScheduled,
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

  function updateDraft<K extends keyof ApplicationDraft>(field: K, value: ApplicationDraft[K]) {
    setSavedMessage("");
    setForm((current) => ({ ...current, draft: { ...current.draft, [field]: value } }));
  }

  function toggleGoal(goal: string) {
    setSavedMessage("");
    setForm((current) => ({
      ...current,
      weeklyGoals: current.weeklyGoals.includes(goal)
        ? current.weeklyGoals.filter((item) => item !== goal)
        : [...current.weeklyGoals, goal],
    }));
  }

  function addApplication() {
    if (!form.draft.company.trim() && !form.draft.positionTitle.trim()) {
      setSavedMessage("Add a company or position title before saving.");
      return;
    }

    setForm((current) => ({
      ...current,
      applications: [...current.applications, { ...current.draft, id: `${Date.now()}` }],
      draft: emptyDraft,
    }));
    setSavedMessage("Application added.");
  }

  function deleteApplication(id: string) {
    setSavedMessage("");
    setForm((current) => ({
      ...current,
      applications: current.applications.filter((application) => application.id !== id),
    }));
  }

  function updateSupport(field: "careerAppointmentScheduled" | "resumeReviewScheduled" | "mockInterviewScheduled") {
    setSavedMessage("");
    setForm((current) => ({ ...current, [field]: true }));
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
    setSavedMessage("Job Application Tracker active.");
  }

  return (
    <div className="space-y-6">
      <GhostButton href="/roadmaps/senior">Back to Senior Roadmap</GhostButton>

      <section className="card-surface rounded-lg p-6 md:p-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-aggie-silver">Senior Roadmap</p>
            <h1 className="text-glow mt-3 text-4xl font-black tracking-tight text-white md:text-5xl">
              Job Application Tracker
            </h1>
            <p className="mt-4 text-lg leading-8 text-aggie-light/78">
              Managing your job search can quickly become overwhelming. This tracker helps you stay organized, monitor
              your progress, and keep track of applications, interviews, and follow-up actions.
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
          <Card title="Job Search Dashboard" icon={<BriefcaseBusiness className="h-6 w-6" />}>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              <DashboardCard label="Applications Submitted" value={dashboard.applicationsSubmitted} />
              <DashboardCard label="Interviews Scheduled" value={dashboard.interviewsScheduled} />
              <DashboardCard label="Interviews Completed" value={dashboard.interviewsCompleted} />
              <DashboardCard label="Offers Received" value={dashboard.offersReceived} />
              <DashboardCard label="Follow-Ups Sent" value={dashboard.followUpsSent} />
            </div>
          </Card>

          <Card title="Application Tracker" icon={<BriefcaseBusiness className="h-6 w-6" />}>
            <div className="grid gap-4 md:grid-cols-2">
              <TextInput label="Company" value={form.draft.company} onChange={(value) => updateDraft("company", value)} />
              <TextInput label="Position Title" value={form.draft.positionTitle} onChange={(value) => updateDraft("positionTitle", value)} />
              <TextInput label="Date Applied" type="date" value={form.draft.dateApplied} onChange={(value) => updateDraft("dateApplied", value)} />
              <label className="block">
                <span className="text-sm font-black uppercase tracking-[0.16em] text-aggie-silver">Application Status</span>
                <select
                  value={form.draft.applicationStatus}
                  onChange={(event) => updateDraft("applicationStatus", event.target.value as ApplicationStatus)}
                  className="mt-2 min-h-12 w-full rounded-lg border border-aggie-silver/15 bg-aggie-navy/80 px-4 text-white outline-none focus:border-aggie-steel"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </label>
              <TextInput label="Interview Date" type="date" value={form.draft.interviewDate} onChange={(value) => updateDraft("interviewDate", value)} />
              <ToggleCard selected={form.draft.followUpSent} label="Follow-Up Sent" onClick={() => updateDraft("followUpSent", !form.draft.followUpSent)} />
            </div>
            <label className="mt-4 block">
              <span className="text-sm font-black uppercase tracking-[0.16em] text-aggie-silver">Notes</span>
              <textarea
                value={form.draft.notes}
                onChange={(event) => updateDraft("notes", event.target.value)}
                className="mt-2 min-h-24 w-full rounded-lg border border-aggie-silver/15 bg-aggie-navy/80 px-4 py-3 text-white outline-none placeholder:text-aggie-muted focus:border-aggie-steel"
              />
            </label>
            <button
              type="button"
              onClick={addApplication}
              className="chrome-surface mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border border-aggie-chrome/60 px-5 text-sm font-black text-aggie-navy shadow-glow transition hover:brightness-110 sm:w-auto"
            >
              <Plus className="h-4 w-4" />
              Add Application
            </button>

            <div className="mt-5 overflow-x-auto rounded-lg border border-aggie-silver/15">
              <table className="min-w-[900px] w-full border-collapse text-left text-sm">
                <thead className="bg-white/[0.08] text-xs font-black uppercase tracking-[0.12em] text-aggie-silver">
                  <tr>
                    <th className="p-3">Company</th>
                    <th className="p-3">Position Title</th>
                    <th className="p-3">Date Applied</th>
                    <th className="p-3">Application Status</th>
                    <th className="p-3">Interview Date</th>
                    <th className="p-3">Follow-Up Sent</th>
                    <th className="p-3">Notes</th>
                    <th className="p-3">Delete</th>
                  </tr>
                </thead>
                <tbody className="text-aggie-light/82">
                  {form.applications.length === 0 ? (
                    <tr>
                      <td className="p-4 font-semibold" colSpan={8}>No applications added yet.</td>
                    </tr>
                  ) : (
                    form.applications.map((application) => (
                      <tr key={application.id} className="border-t border-aggie-silver/10">
                        <td className="p-3 font-bold text-white">{application.company || "Not listed"}</td>
                        <td className="p-3">{application.positionTitle || "Not listed"}</td>
                        <td className="p-3">{application.dateApplied || "Not set"}</td>
                        <td className="p-3">{application.applicationStatus}</td>
                        <td className="p-3">{application.interviewDate || "Not set"}</td>
                        <td className="p-3">{application.followUpSent ? "Yes" : "No"}</td>
                        <td className="p-3">{application.notes || "None"}</td>
                        <td className="p-3">
                          <button type="button" onClick={() => deleteApplication(application.id)} className="text-aggie-silver transition hover:text-white">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          <Card title="Weekly Job Search Goals" icon={<Check className="h-6 w-6" />}>
            <div className="grid gap-3 md:grid-cols-2">
              {weeklyGoals.map((goal) => (
                <ToggleCard key={goal} selected={form.weeklyGoals.includes(goal)} label={goal} onClick={() => toggleGoal(goal)} />
              ))}
            </div>
          </Card>

          <section className="rounded-lg border border-aggie-chrome/35 bg-aggie-chrome/10 p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start">
              <span className="chrome-surface grid h-12 w-12 shrink-0 place-items-center rounded-lg text-aggie-navy shadow-glow">
                <Send className="h-6 w-6" />
              </span>
              <div>
                <h2 className="text-2xl font-black text-white">Follow-Up Reminder</h2>
                <p className="mt-3 leading-7 text-aggie-light/84">
                  Most employers appreciate professional follow-up communication. Consider sending a follow-up message
                  7-10 days after submitting an application if appropriate.
                </p>
              </div>
            </div>
          </section>

          <Card title="Career Support" icon={<CalendarCheck className="h-6 w-6" />}>
            <div className="grid gap-3 md:grid-cols-3">
              <ActionButton onClick={() => updateSupport("careerAppointmentScheduled")} icon={<CalendarCheck className="h-4 w-4" />} primary={form.careerAppointmentScheduled}>
                Schedule Career Appointment
              </ActionButton>
              <ActionButton onClick={() => updateSupport("resumeReviewScheduled")} icon={<CalendarCheck className="h-4 w-4" />} primary={form.resumeReviewScheduled}>
                Schedule Resume Review
              </ActionButton>
              <ActionButton onClick={() => updateSupport("mockInterviewScheduled")} icon={<CalendarCheck className="h-4 w-4" />} primary={form.mockInterviewScheduled}>
                Schedule Mock Interview
              </ActionButton>
            </div>
          </Card>

          <Card title="Module Completion" icon={<Check className="h-6 w-6" />}>
            <button
              type="button"
              onClick={markComplete}
              className="chrome-surface inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border border-aggie-chrome/60 px-5 text-sm font-black text-aggie-navy shadow-glow transition hover:brightness-110 sm:w-auto"
            >
              <Check className="h-4 w-4" />
              Job Application Tracker Active
            </button>
            {form.moduleStatus === "Completed" && (
              <p className="mt-5 rounded-lg border border-aggie-chrome/30 bg-white/[0.08] p-4 text-sm font-bold leading-6 text-aggie-ice">
                Job Application Tracker active. Keep updating it as your job search moves forward.
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
            <h2 className="text-xl font-black text-white">Search Snapshot</h2>
            <div className="mt-4 space-y-3 text-sm font-bold text-aggie-light/78">
              <Snapshot label="Applications" value={`${form.applications.length}`} />
              <Snapshot label="Weekly Goals" value={`${form.weeklyGoals.length}/${weeklyGoals.length}`} />
              <Snapshot label="Support Scheduled" value={form.careerAppointmentScheduled || form.resumeReviewScheduled || form.mockInterviewScheduled ? "Yes" : "No"} />
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
      <p className="mt-3 text-sm font-medium text-aggie-light/72">{completed} of {total} job search steps complete</p>
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

function DashboardCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-aggie-silver/15 bg-white/[0.045] p-4">
      <p className="text-3xl font-black text-white">{value}</p>
      <p className="mt-2 text-xs font-black uppercase tracking-[0.14em] text-aggie-silver">{label}</p>
    </div>
  );
}

function TextInput({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return (
    <label className="block">
      <span className="text-sm font-black uppercase tracking-[0.16em] text-aggie-silver">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 min-h-12 w-full rounded-lg border border-aggie-silver/15 bg-aggie-navy/80 px-4 text-white outline-none placeholder:text-aggie-muted focus:border-aggie-steel"
      />
    </label>
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

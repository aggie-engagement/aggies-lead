"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { Check, Clock3, Network, RefreshCw, Save, Sparkles, Target, Users } from "lucide-react";
import { GhostButton } from "@/components/Prototype";
import { usePrototypeState } from "@/components/PrototypeState";

const moduleSlug = "linkedin-refresh";
const storageKey = "aggies-lead:graduate:linkedin-refresh";

const refreshItems = [
  "Professional profile photo",
  "Professional banner image",
  "Updated headline",
  "Updated About section",
  "Graduation status updated",
  "Career interests updated",
  "Experience section updated",
  "Skills section updated",
  "Contact information updated",
  "Professional organizations followed",
];

const headlineExamples = [
  "Former NCAA Division I Student-Athlete | Marketing Professional | Community Engagement & Event Management",
  "Former Utah State Student-Athlete | Kinesiology Graduate | Aspiring Healthcare Professional",
  "Student-Athlete Graduate | Business Administration | Interested in Sales and Leadership Opportunities",
];

const networkItems = [
  "Connected with alumni",
  "Connected with professors",
  "Connected with supervisors",
  "Connected with employers",
  "Connected with professionals in target industries",
];

const presenceChallenge = [
  "Follow 10 target organizations",
  "Follow 10 professionals",
  "Engage with 5 professional posts",
  "Share one professional update",
];

const readinessOptions = [
  "Needs Updates",
  "Professional Ready",
  "Networking Ready",
  "Job Search Ready",
];

type LinkedInRefreshState = {
  refreshChecklist: string[];
  networkChecklist: string[];
  presenceChallenge: string[];
  readinessScore: string;
  moduleStatus: "Not Started" | "In Progress" | "Completed";
  progressPercentage: number;
};

const initialState: LinkedInRefreshState = {
  refreshChecklist: [],
  networkChecklist: [],
  presenceChallenge: [],
  readinessScore: "",
  moduleStatus: "Not Started",
  progressPercentage: 0,
};

export function LinkedInRefreshClient() {
  const { completeModule } = usePrototypeState();
  const [form, setForm] = useState<LinkedInRefreshState>(initialState);
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
      form.refreshChecklist.length > 0,
      true,
      form.networkChecklist.length > 0,
      form.presenceChallenge.length > 0,
      Boolean(form.readinessScore),
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
    const completedForm: LinkedInRefreshState = {
      ...form,
      moduleStatus: "Completed",
      progressPercentage: 100,
    };
    setForm(completedForm);
    persist(completedForm, "LinkedIn Refresh completed.");
    completeModule(moduleSlug);
  };

  const toggleList = (field: "refreshChecklist" | "networkChecklist" | "presenceChallenge", item: string) => {
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
            <h1 className="text-glow mt-3 text-4xl font-black tracking-tight text-white">LinkedIn Refresh</h1>
            <p className="mt-4 max-w-3xl leading-7 text-aggie-light/76">
              As you prepare for your next chapter, your LinkedIn profile should reflect your transition from
              student-athlete to professional. This module helps ensure your profile accurately represents your
              experiences, goals, and professional interests.
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
          <Card title="LinkedIn Refresh Checklist" icon={<Check className="h-6 w-6 text-aggie-ice" />}>
            <div className="grid gap-3 md:grid-cols-2">
              {refreshItems.map((item) => (
                <ToggleCard
                  key={item}
                  label={item}
                  selected={form.refreshChecklist.includes(item)}
                  onClick={() => toggleList("refreshChecklist", item)}
                />
              ))}
            </div>
          </Card>

          <Card title="Transition Your Headline" icon={<Sparkles className="h-6 w-6 text-aggie-ice" />}>
            <div className="grid gap-4">
              {headlineExamples.map((example) => (
                <div key={example} className="rounded-lg border border-white/10 bg-white/6 p-4">
                  <p className="text-sm font-semibold leading-6 text-aggie-light">{example}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Expand Your Network" icon={<Users className="h-6 w-6 text-aggie-ice" />}>
            <div className="grid gap-3 md:grid-cols-2">
              {networkItems.map((item) => (
                <ToggleCard
                  key={item}
                  label={item}
                  selected={form.networkChecklist.includes(item)}
                  onClick={() => toggleList("networkChecklist", item)}
                />
              ))}
            </div>
          </Card>

          <Card title="Professional Presence" icon={<Network className="h-6 w-6 text-aggie-ice" />}>
            <div className="grid gap-3 md:grid-cols-2">
              {presenceChallenge.map((item) => (
                <ToggleCard
                  key={item}
                  label={item}
                  selected={form.presenceChallenge.includes(item)}
                  onClick={() => toggleList("presenceChallenge", item)}
                />
              ))}
            </div>
          </Card>

          <Card title="LinkedIn Readiness Score" icon={<Target className="h-6 w-6 text-aggie-ice" />}>
            <div className="grid gap-3 md:grid-cols-2">
              {readinessOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setForm((current) => ({ ...current, readinessScore: option }))}
                  className={`rounded-lg border px-4 py-3 text-left text-sm font-black transition ${
                    form.readinessScore === option
                      ? "border-aggie-ice/70 bg-aggie-ice/14 text-white"
                      : "border-white/10 bg-white/5 text-aggie-light/78 hover:border-aggie-ice/40 hover:bg-white/10"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={markComplete}
              className="mt-4 rounded-lg bg-aggie-ice px-4 py-3 text-sm font-black text-aggie-navy transition hover:bg-white"
            >
              LinkedIn Refresh Completed
            </button>
            {form.moduleStatus === "Completed" ? (
              <p className="mt-4 rounded-lg border border-aggie-ice/30 bg-aggie-ice/10 p-4 text-sm font-semibold text-aggie-light">
                Great work. Your LinkedIn profile is refreshed for your next professional chapter.
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

          <Card title="LinkedIn Snapshot">
            <div className="space-y-3">
              <Snapshot label="Profile Refresh" value={`${form.refreshChecklist.length}/${refreshItems.length}`} />
              <Snapshot label="Network" value={`${form.networkChecklist.length}/${networkItems.length}`} />
              <Snapshot label="Presence" value={`${form.presenceChallenge.length}/${presenceChallenge.length}`} />
              <Snapshot label="Readiness" value={form.readinessScore || "Not Rated"} />
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

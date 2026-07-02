"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BriefcaseBusiness, Check, Clock3, FileText, RefreshCw, Save, Search, Target } from "lucide-react";
import { GhostButton } from "@/components/Prototype";
import { usePrototypeState } from "@/components/PrototypeState";

const moduleSlug = "internship-fellowship-applications";
const storageKey = "aggies-lead:junior:internship-fellowship-applications";

const benefits = [
  "Gain real-world experience",
  "Explore career interests",
  "Build professional skills",
  "Expand your network",
  "Strengthen your resume",
  "Improve future job prospects",
];

const readinessItems = [
  "Resume updated",
  "LinkedIn profile updated",
  "Professional references identified",
  "Cover letter drafted",
  "Career interests identified",
  "Professional attire prepared",
  "Interview preparation completed",
];

const resources = [
  "Handshake",
  "LinkedIn Jobs",
  "Aggies Lead Opportunities",
  "Company Career Pages",
  "Fellowship Programs",
  "Professional Associations",
  "Utah State Career Design Center",
];

const opportunities = [
  {
    id: "opportunity-1",
    organization: "Coming Soon",
    opportunityType: "Internship or Fellowship",
    applicationDeadline: "TBD",
    location: "TBD",
  },
  {
    id: "opportunity-2",
    organization: "Coming Soon",
    opportunityType: "Internship or Fellowship",
    applicationDeadline: "TBD",
    location: "TBD",
  },
  {
    id: "opportunity-3",
    organization: "Coming Soon",
    opportunityType: "Internship or Fellowship",
    applicationDeadline: "TBD",
    location: "TBD",
  },
];

const trackerItems = [
  "Opportunity Identified",
  "Application Submitted",
  "Interview Scheduled",
  "Follow-Up Completed",
];

type InternshipState = {
  readinessChecklist: string[];
  selectedResources: string[];
  applicationTracker: string[];
  moduleStatus: "Not Started" | "In Progress" | "Completed";
  progressPercentage: number;
};

const initialState: InternshipState = {
  readinessChecklist: [],
  selectedResources: [],
  applicationTracker: [],
  moduleStatus: "Not Started",
  progressPercentage: 0,
};

export function InternshipFellowshipApplicationsClient() {
  const { completeModule } = usePrototypeState();
  const [form, setForm] = useState<InternshipState>(initialState);
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
      form.selectedResources.length > 0,
      form.applicationTracker.length > 0,
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

  function toggleList(field: "readinessChecklist" | "selectedResources" | "applicationTracker", value: string) {
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
    setSavedMessage("Internship/Fellowship Applications reviewed.");
  }

  return (
    <div className="space-y-6">
      <GhostButton href="/roadmaps/junior">Back to Junior Roadmap</GhostButton>

      <section className="card-surface rounded-lg p-6 md:p-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-aggie-silver">Junior Roadmap</p>
            <h1 className="text-glow mt-3 text-4xl font-black tracking-tight text-white md:text-5xl">
              Internship & Fellowship Applications
            </h1>
            <p className="mt-4 text-lg leading-8 text-aggie-light/78">
              Internships and fellowships provide valuable professional experience, help build your network, and can
              often lead to future career opportunities. This module will help you identify opportunities and prepare
              strong applications.
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
          <Card title="Why Apply?" icon={<BriefcaseBusiness className="h-6 w-6" />}>
            <CheckGrid items={benefits} />
          </Card>

          <Card title="Application Readiness Checklist" icon={<FileText className="h-6 w-6" />}>
            <div className="grid gap-3 md:grid-cols-2">
              {readinessItems.map((item) => (
                <ToggleCard key={item} selected={form.readinessChecklist.includes(item)} label={item} onClick={() => toggleList("readinessChecklist", item)} />
              ))}
            </div>
          </Card>

          <Card title="Find Opportunities" icon={<Search className="h-6 w-6" />}>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {resources.map((resource) => (
                <ToggleCard key={resource} selected={form.selectedResources.includes(resource)} label={resource} onClick={() => toggleList("selectedResources", resource)} />
              ))}
            </div>
          </Card>

          <Card title="Current Opportunities" icon={<BriefcaseBusiness className="h-6 w-6" />}>
            <div className="grid gap-4 lg:grid-cols-3">
              {opportunities.map((opportunity, index) => (
                <article key={opportunity.id} className="rounded-lg border border-aggie-silver/15 bg-white/[0.055] p-5 shadow-steel">
                  <span className="rounded-lg border border-aggie-chrome/30 bg-aggie-chrome/10 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-aggie-ice">
                    Opportunity {index + 1}
                  </span>
                  <h3 className="mt-5 text-2xl font-black text-white">{opportunity.organization}</h3>
                  <div className="mt-5 space-y-3 text-sm font-bold text-aggie-light/78">
                    <Detail label="Opportunity Type" value={opportunity.opportunityType} />
                    <Detail label="Application Deadline" value={opportunity.applicationDeadline} />
                    <Detail label="Location" value={opportunity.location} />
                  </div>
                </article>
              ))}
            </div>
          </Card>

          <Card title="Application Tracker" icon={<Target className="h-6 w-6" />}>
            <div className="grid gap-3 md:grid-cols-2">
              {trackerItems.map((item) => (
                <ToggleCard key={item} selected={form.applicationTracker.includes(item)} label={item} onClick={() => toggleList("applicationTracker", item)} />
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
              Internship/Fellowship Applications Reviewed
            </button>
            {form.moduleStatus === "Completed" && (
              <p className="mt-5 rounded-lg border border-aggie-chrome/30 bg-white/[0.08] p-4 text-sm font-bold leading-6 text-aggie-ice">
                Internship and fellowship applications reviewed. Keep tracking opportunities and follow-up steps.
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
            <h2 className="text-xl font-black text-white">Application Snapshot</h2>
            <div className="mt-4 space-y-3 text-sm font-bold text-aggie-light/78">
              <Snapshot label="Readiness" value={`${form.readinessChecklist.length}/${readinessItems.length}`} />
              <Snapshot label="Resources Selected" value={`${form.selectedResources.length}/${resources.length}`} />
              <Snapshot label="Tracker" value={`${form.applicationTracker.length}/${trackerItems.length}`} />
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
      <p className="mt-3 text-sm font-medium text-aggie-light/72">{completed} of {total} application steps complete</p>
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

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-aggie-silver/15 bg-aggie-navy/50 p-3">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-aggie-silver">{label}</p>
      <p className="mt-1 font-bold text-white">{value}</p>
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

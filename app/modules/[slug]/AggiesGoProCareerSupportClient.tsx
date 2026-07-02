"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Award, BriefcaseBusiness, Check, Clock3, FileText, Plus, RefreshCw, Save, Trash2, Trophy } from "lucide-react";
import { GhostButton } from "@/components/Prototype";
import { usePrototypeState } from "@/components/PrototypeState";

const moduleSlug = "aggies-go-pro-career-support";
const storageKey = "aggies-lead:senior:aggies-go-pro-career-support";

const readinessItems = [
  "Professional goals identified",
  "Professional opportunities researched",
  "Highlight film prepared (if applicable)",
  "Athletic resume updated",
  "Professional contacts established",
  "Agent education completed",
  "Financial literacy completed",
];

const lifeAfterItems = [
  "Resume finalized",
  "LinkedIn finalized",
  "Professional references secured",
  "Career plan identified",
  "Job search initiated",
  "Graduate school options explored",
];

const spotlights = [
  { id: "spotlight-1", name: "Coming Soon", sport: "TBD", currentProfession: "TBD" },
  { id: "spotlight-2", name: "Coming Soon", sport: "TBD", currentProfession: "TBD" },
  { id: "spotlight-3", name: "Coming Soon", sport: "TBD", currentProfession: "TBD" },
];

const resourceCards = [
  "Agent Education Resources",
  "Professional Athletics Opportunities",
  "Career Transition Resources",
  "Former Student-Athlete Mentors",
];

type Opportunity = {
  id: string;
  organizationLeague: string;
  contactName: string;
  dateContacted: string;
  opportunityType: string;
  currentStatus: string;
  notes: string;
};

type OpportunityDraft = Omit<Opportunity, "id">;

type AggiesGoProCareerState = {
  readinessChecklist: string[];
  lifeAfterChecklist: string[];
  opportunities: Opportunity[];
  draft: OpportunityDraft;
  moduleStatus: "Not Started" | "In Progress" | "Completed";
  progressPercentage: number;
};

const emptyDraft: OpportunityDraft = {
  organizationLeague: "",
  contactName: "",
  dateContacted: "",
  opportunityType: "",
  currentStatus: "",
  notes: "",
};

const initialState: AggiesGoProCareerState = {
  readinessChecklist: [],
  lifeAfterChecklist: [],
  opportunities: [],
  draft: emptyDraft,
  moduleStatus: "Not Started",
  progressPercentage: 0,
};

export function AggiesGoProCareerSupportClient() {
  const { completeModule } = usePrototypeState();
  const [form, setForm] = useState<AggiesGoProCareerState>(initialState);
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

  const draftHasContent = Object.values(form.draft).some((value) => value.trim().length > 0);

  const completion = useMemo(() => {
    const tasks = [
      form.readinessChecklist.length > 0,
      form.opportunities.length > 0 || draftHasContent,
      form.lifeAfterChecklist.length > 0,
      form.moduleStatus === "Completed",
    ];
    const completed = tasks.filter(Boolean).length;
    const percent = form.moduleStatus === "Completed" ? 100 : Math.round((completed / tasks.length) * 100);
    return { completed, total: tasks.length, percent };
  }, [draftHasContent, form]);

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

  function toggleList(field: "readinessChecklist" | "lifeAfterChecklist", value: string) {
    setSavedMessage("");
    setForm((current) => {
      const list = current[field];
      return {
        ...current,
        [field]: list.includes(value) ? list.filter((item) => item !== value) : [...list, value],
      };
    });
  }

  function updateDraft<K extends keyof OpportunityDraft>(field: K, value: OpportunityDraft[K]) {
    setSavedMessage("");
    setForm((current) => ({ ...current, draft: { ...current.draft, [field]: value } }));
  }

  function addOpportunity() {
    if (!form.draft.organizationLeague.trim() && !form.draft.opportunityType.trim()) {
      setSavedMessage("Add an organization, league, or opportunity type before saving.");
      return;
    }

    setForm((current) => ({
      ...current,
      opportunities: [...current.opportunities, { ...current.draft, id: `${Date.now()}` }],
      draft: emptyDraft,
    }));
    setSavedMessage("Professional opportunity added.");
  }

  function deleteOpportunity(id: string) {
    setSavedMessage("");
    setForm((current) => ({
      ...current,
      opportunities: current.opportunities.filter((opportunity) => opportunity.id !== id),
    }));
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
    setSavedMessage("Aggies Go Pro Career Support completed.");
  }

  return (
    <div className="space-y-6">
      <GhostButton href="/roadmaps/senior">Back to Senior Roadmap</GhostButton>

      <section className="card-surface rounded-lg p-6 md:p-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-aggie-silver">Senior Roadmap</p>
            <h1 className="text-glow mt-3 text-4xl font-black tracking-tight text-white md:text-5xl">
              Aggies Go Pro Career Support
            </h1>
            <p className="mt-4 text-lg leading-8 text-aggie-light/78">
              This module supports student-athletes pursuing professional athletics opportunities while also preparing
              for long-term career success and life after competition.
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
          <Card title="Professional Athletics Readiness" icon={<Trophy className="h-6 w-6" />}>
            <div className="grid gap-3 md:grid-cols-2">
              {readinessItems.map((item) => (
                <ToggleCard key={item} selected={form.readinessChecklist.includes(item)} label={item} onClick={() => toggleList("readinessChecklist", item)} />
              ))}
            </div>
          </Card>

          <Card title="Professional Opportunities Tracker" icon={<BriefcaseBusiness className="h-6 w-6" />}>
            <div className="grid gap-4 md:grid-cols-2">
              <TextInput label="Organization / League" value={form.draft.organizationLeague} onChange={(value) => updateDraft("organizationLeague", value)} />
              <TextInput label="Contact Name" value={form.draft.contactName} onChange={(value) => updateDraft("contactName", value)} />
              <TextInput label="Date Contacted" type="date" value={form.draft.dateContacted} onChange={(value) => updateDraft("dateContacted", value)} />
              <TextInput label="Opportunity Type" value={form.draft.opportunityType} onChange={(value) => updateDraft("opportunityType", value)} />
              <TextInput label="Current Status" value={form.draft.currentStatus} onChange={(value) => updateDraft("currentStatus", value)} />
              <TextInput label="Notes" value={form.draft.notes} onChange={(value) => updateDraft("notes", value)} />
            </div>
            <button
              type="button"
              onClick={addOpportunity}
              className="chrome-surface mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border border-aggie-chrome/60 px-5 text-sm font-black text-aggie-navy shadow-glow transition hover:brightness-110 sm:w-auto"
            >
              <Plus className="h-4 w-4" />
              Add Opportunity
            </button>

            <div className="mt-5 grid gap-3">
              {form.opportunities.length === 0 ? (
                <p className="rounded-lg border border-aggie-silver/15 bg-white/[0.045] p-4 text-sm font-semibold text-aggie-light/72">
                  No professional opportunities added yet.
                </p>
              ) : (
                form.opportunities.map((opportunity) => (
                  <article key={opportunity.id} className="rounded-lg border border-aggie-silver/15 bg-white/[0.045] p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-black text-white">{opportunity.organizationLeague || "Organization not listed"}</h3>
                        <p className="mt-1 text-sm font-bold text-aggie-light/74">{opportunity.opportunityType || "Opportunity type not listed"}</p>
                      </div>
                      <button type="button" onClick={() => deleteOpportunity(opportunity.id)} className="text-aggie-silver transition hover:text-white">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="mt-4 grid gap-2 text-sm font-semibold text-aggie-light/78 md:grid-cols-2">
                      <p>Contact: {opportunity.contactName || "Not listed"}</p>
                      <p>Date Contacted: {opportunity.dateContacted || "Not set"}</p>
                      <p>Status: {opportunity.currentStatus || "Not listed"}</p>
                      <p>Notes: {opportunity.notes || "None"}</p>
                    </div>
                  </article>
                ))
              )}
            </div>
          </Card>

          <Card title="Life After Athletics Planning" icon={<BriefcaseBusiness className="h-6 w-6" />}>
            <p className="leading-7 text-aggie-light/80">
              Whether or not you pursue professional athletics, every student-athlete should prepare for life after competition.
            </p>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {lifeAfterItems.map((item) => (
                <ToggleCard key={item} selected={form.lifeAfterChecklist.includes(item)} label={item} onClick={() => toggleList("lifeAfterChecklist", item)} />
              ))}
            </div>
          </Card>

          <Card title="Former Aggies Spotlight" icon={<Award className="h-6 w-6" />}>
            <div className="grid gap-4 lg:grid-cols-3">
              {spotlights.map((spotlight) => (
                <article key={spotlight.id} className="rounded-lg border border-aggie-silver/15 bg-white/[0.055] p-5 shadow-steel">
                  <h3 className="text-2xl font-black text-white">{spotlight.name}</h3>
                  <div className="mt-5 space-y-3 text-sm font-bold text-aggie-light/78">
                    <Detail label="Sport" value={spotlight.sport} />
                    <Detail label="Current Profession or Professional Team" value={spotlight.currentProfession} />
                  </div>
                </article>
              ))}
            </div>
          </Card>

          <Card title="Aggies Go Pro Resources" icon={<FileText className="h-6 w-6" />}>
            <div className="grid gap-4 md:grid-cols-2">
              {resourceCards.map((resource) => (
                <article key={resource} className="rounded-lg border border-aggie-silver/15 bg-white/[0.045] p-5">
                  <p className="text-lg font-black text-white">{resource}</p>
                  <p className="mt-2 text-sm font-bold text-aggie-light/70">Coming Soon</p>
                </article>
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
              Aggies Go Pro Career Support Completed
            </button>
            {form.moduleStatus === "Completed" && (
              <p className="mt-5 rounded-lg border border-aggie-chrome/30 bg-white/[0.08] p-4 text-sm font-bold leading-6 text-aggie-ice">
                Aggies Go Pro Career Support complete. Keep pursuing professional athletics while preparing for long-term career success.
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
            <h2 className="text-xl font-black text-white">Career Support Snapshot</h2>
            <div className="mt-4 space-y-3 text-sm font-bold text-aggie-light/78">
              <Snapshot label="Readiness" value={`${form.readinessChecklist.length}/${readinessItems.length}`} />
              <Snapshot label="Opportunities" value={`${form.opportunities.length}`} />
              <Snapshot label="Life After Athletics" value={`${form.lifeAfterChecklist.length}/${lifeAfterItems.length}`} />
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
      <p className="mt-3 text-sm font-medium text-aggie-light/72">{completed} of {total} career support steps complete</p>
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

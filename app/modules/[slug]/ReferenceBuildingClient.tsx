"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Check, Clock3, Mail, Plus, RefreshCw, Save, Trash2, UsersRound } from "lucide-react";
import { GhostButton } from "@/components/Prototype";
import { usePrototypeState } from "@/components/PrototypeState";

const moduleSlug = "reference-building";
const storageKey = "aggies-lead:junior:reference-building";

const strongReferenceExamples = [
  "Coaches",
  "Professors",
  "Supervisors",
  "Internship Mentors",
  "Employers",
  "Community Leaders",
];

const referenceChecklist = [
  "Coach",
  "Professor",
  "Employer",
  "Professional Contact",
  "Internship Supervisor",
];

const requestMessage =
  "Hi [Name], I hope you are doing well. I am preparing to apply for [internship/job/graduate program/opportunity] and wanted to ask if you would feel comfortable serving as a professional reference for me. I appreciated your support and perspective during [class/team/work/experience], and I believe you could speak to my work ethic, communication, leadership, and growth. I would be happy to send my resume and more information about the opportunity. Thank you for considering my request.";

const relationshipTips = [
  "Stay in touch",
  "Share updates",
  "Thank them",
  "Give advance notice before listing them",
];

type ReferenceContact = {
  id: string;
  name: string;
  title: string;
  organization: string;
  relationship: string;
  email: string;
  phone: string;
};

type ReferenceDraft = Omit<ReferenceContact, "id">;

type ReferenceBuildingState = {
  selectedReferenceTypes: string[];
  references: ReferenceContact[];
  draft: ReferenceDraft;
  copiedRequest: boolean;
  moduleStatus: "Not Started" | "In Progress" | "Completed";
  progressPercentage: number;
};

const emptyDraft: ReferenceDraft = {
  name: "",
  title: "",
  organization: "",
  relationship: "",
  email: "",
  phone: "",
};

const initialState: ReferenceBuildingState = {
  selectedReferenceTypes: [],
  references: [],
  draft: emptyDraft,
  copiedRequest: false,
  moduleStatus: "Not Started",
  progressPercentage: 0,
};

export function ReferenceBuildingClient() {
  const { completeModule } = usePrototypeState();
  const [form, setForm] = useState<ReferenceBuildingState>(initialState);
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
      form.selectedReferenceTypes.length > 0,
      form.copiedRequest,
      form.references.length > 0 || draftHasContent,
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

  function toggleReferenceType(value: string) {
    setSavedMessage("");
    setForm((current) => ({
      ...current,
      selectedReferenceTypes: current.selectedReferenceTypes.includes(value)
        ? current.selectedReferenceTypes.filter((item) => item !== value)
        : [...current.selectedReferenceTypes, value],
    }));
  }

  function updateDraft<K extends keyof ReferenceDraft>(field: K, value: ReferenceDraft[K]) {
    setSavedMessage("");
    setForm((current) => ({ ...current, draft: { ...current.draft, [field]: value } }));
  }

  function addReference() {
    if (!form.draft.name.trim() && !form.draft.email.trim()) {
      setSavedMessage("Add a reference name or email before saving.");
      return;
    }

    setForm((current) => ({
      ...current,
      references: [...current.references, { ...current.draft, id: `${Date.now()}` }],
      draft: emptyDraft,
    }));
    setSavedMessage("Reference added.");
  }

  function deleteReference(id: string) {
    setSavedMessage("");
    setForm((current) => ({
      ...current,
      references: current.references.filter((reference) => reference.id !== id),
    }));
  }

  async function copyRequestMessage() {
    setSavedMessage("");
    try {
      await navigator.clipboard.writeText(requestMessage);
      setForm((current) => ({ ...current, copiedRequest: true }));
      setSavedMessage("Reference request copied.");
    } catch {
      setSavedMessage("Copy was unavailable. You can still highlight and copy the message.");
    }
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
    setSavedMessage("Reference Building completed.");
  }

  return (
    <div className="space-y-6">
      <GhostButton href="/roadmaps/junior">Back to Junior Roadmap</GhostButton>

      <section className="card-surface rounded-lg p-6 md:p-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-aggie-silver">Junior Roadmap</p>
            <h1 className="text-glow mt-3 text-4xl font-black tracking-tight text-white md:text-5xl">
              Reference Building
            </h1>
            <p className="mt-4 text-lg leading-8 text-aggie-light/78">
              Strong professional references can help you secure internships, jobs, graduate school opportunities,
              and professional experiences.
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
          <Card title="What Makes a Strong Reference?" icon={<UsersRound className="h-6 w-6" />}>
            <CheckGrid items={strongReferenceExamples} />
          </Card>

          <Card title="Identify Your References" icon={<Check className="h-6 w-6" />}>
            <div className="grid gap-3 md:grid-cols-2">
              {referenceChecklist.map((item) => (
                <ToggleCard key={item} selected={form.selectedReferenceTypes.includes(item)} label={item} onClick={() => toggleReferenceType(item)} />
              ))}
            </div>
          </Card>

          <Card title="Asking for a Reference" icon={<Mail className="h-6 w-6" />}>
            <p className="rounded-lg border border-aggie-silver/15 bg-aggie-navy/70 p-4 text-sm font-semibold leading-7 text-aggie-light/86">
              {requestMessage}
            </p>
            <button
              type="button"
              onClick={copyRequestMessage}
              className="chrome-surface mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border border-aggie-chrome/60 px-5 text-sm font-black text-aggie-navy shadow-glow transition hover:brightness-110 sm:w-auto"
            >
              <Mail className="h-4 w-4" />
              Copy Example Request
            </button>
          </Card>

          <Card title="Reference Information Tracker" icon={<UsersRound className="h-6 w-6" />}>
            <div className="grid gap-4 md:grid-cols-2">
              <TextInput label="Reference Name" value={form.draft.name} onChange={(value) => updateDraft("name", value)} />
              <TextInput label="Title" value={form.draft.title} onChange={(value) => updateDraft("title", value)} />
              <TextInput label="Organization" value={form.draft.organization} onChange={(value) => updateDraft("organization", value)} />
              <TextInput label="Relationship" value={form.draft.relationship} onChange={(value) => updateDraft("relationship", value)} />
              <TextInput label="Email" value={form.draft.email} onChange={(value) => updateDraft("email", value)} />
              <TextInput label="Phone Number" value={form.draft.phone} onChange={(value) => updateDraft("phone", value)} />
            </div>
            <button
              type="button"
              onClick={addReference}
              className="chrome-surface mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border border-aggie-chrome/60 px-5 text-sm font-black text-aggie-navy shadow-glow transition hover:brightness-110 sm:w-auto"
            >
              <Plus className="h-4 w-4" />
              Add Reference
            </button>

            <div className="mt-5 grid gap-3">
              {form.references.length === 0 ? (
                <p className="rounded-lg border border-aggie-silver/15 bg-white/[0.045] p-4 text-sm font-semibold text-aggie-light/72">
                  No references added yet.
                </p>
              ) : (
                form.references.map((reference) => (
                  <article key={reference.id} className="rounded-lg border border-aggie-silver/15 bg-white/[0.045] p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-black text-white">{reference.name || "Unnamed Reference"}</h3>
                        <p className="mt-1 text-sm font-bold text-aggie-light/74">
                          {[reference.title, reference.organization].filter(Boolean).join(" | ") || "Details not listed"}
                        </p>
                      </div>
                      <button type="button" onClick={() => deleteReference(reference.id)} className="text-aggie-silver transition hover:text-white">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="mt-4 grid gap-2 text-sm font-semibold text-aggie-light/78 md:grid-cols-2">
                      <p>Relationship: {reference.relationship || "Not listed"}</p>
                      <p>Email: {reference.email || "Not listed"}</p>
                      <p>Phone: {reference.phone || "Not listed"}</p>
                    </div>
                  </article>
                ))
              )}
            </div>
          </Card>

          <Card title="Maintaining Relationships" icon={<UsersRound className="h-6 w-6" />}>
            <CheckGrid items={relationshipTips} />
          </Card>

          <Card title="Module Completion" icon={<Check className="h-6 w-6" />}>
            <button
              type="button"
              onClick={markComplete}
              className="chrome-surface inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border border-aggie-chrome/60 px-5 text-sm font-black text-aggie-navy shadow-glow transition hover:brightness-110 sm:w-auto"
            >
              <Check className="h-4 w-4" />
              Reference Building Completed
            </button>
            {form.moduleStatus === "Completed" && (
              <p className="mt-5 rounded-lg border border-aggie-chrome/30 bg-white/[0.08] p-4 text-sm font-bold leading-6 text-aggie-ice">
                Reference Building complete. Keep your references updated and give them plenty of notice before listing them.
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
            <h2 className="text-xl font-black text-white">Reference Snapshot</h2>
            <div className="mt-4 space-y-3 text-sm font-bold text-aggie-light/78">
              <Snapshot label="Types Identified" value={`${form.selectedReferenceTypes.length}/${referenceChecklist.length}`} />
              <Snapshot label="Request Copied" value={form.copiedRequest ? "Yes" : "No"} />
              <Snapshot label="References Added" value={`${form.references.length}`} />
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
      <p className="mt-3 text-sm font-medium text-aggie-light/72">{completed} of {total} reference steps complete</p>
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

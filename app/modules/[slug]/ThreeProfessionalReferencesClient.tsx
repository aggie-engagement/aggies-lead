"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Check, Clock3, Mail, RefreshCw, Save, UsersRound } from "lucide-react";
import { GhostButton } from "@/components/Prototype";
import { usePrototypeState } from "@/components/PrototypeState";

const moduleSlug = "3-professional-references";
const storageKey = "aggies-lead:senior:3-professional-references";

const referenceTypes = [
  "Coach",
  "Professor",
  "Employer",
  "Internship Supervisor",
  "Professional Mentor",
  "Community Leader",
];

const bestPractices = [
  "Asked permission before listing reference",
  "Provided updated resume",
  "Shared career goals",
  "Thanked reference",
  "Updated reference on application outcomes",
];

const requestMessage = `Hello [Name],

I hope you are doing well. I am preparing for post-graduation opportunities and was wondering if you would be willing to serve as a professional reference for future applications.

Thank you for your support and guidance.

Best,
[Student Name]`;

type ReferenceEntry = {
  name: string;
  title: string;
  organization: string;
  email: string;
  phone: string;
  relationship: string;
};

type ThreeReferencesState = {
  references: ReferenceEntry[];
  bestPractices: string[];
  moduleStatus: "Not Started" | "In Progress" | "Completed";
  progressPercentage: number;
};

const emptyReference = (): ReferenceEntry => ({
  name: "",
  title: "",
  organization: "",
  email: "",
  phone: "",
  relationship: "",
});

const initialState: ThreeReferencesState = {
  references: [emptyReference(), emptyReference(), emptyReference()],
  bestPractices: [],
  moduleStatus: "Not Started",
  progressPercentage: 0,
};

export function ThreeProfessionalReferencesClient() {
  const { completeModule } = usePrototypeState();
  const [form, setForm] = useState<ThreeReferencesState>(initialState);
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved);
      setForm({
        ...initialState,
        ...parsed,
        references: Array.isArray(parsed.references) && parsed.references.length === 3 ? parsed.references : initialState.references,
      });
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, []);

  const completedReferenceCount = form.references.filter((reference) =>
    Object.values(reference).some((value) => value.trim().length > 0),
  ).length;

  const completion = useMemo(() => {
    const tasks = [
      completedReferenceCount > 0,
      form.bestPractices.length > 0,
      form.moduleStatus === "Completed",
    ];
    const completed = tasks.filter(Boolean).length;
    const percent = form.moduleStatus === "Completed" ? 100 : Math.round((completed / tasks.length) * 100);
    return { completed, total: tasks.length, percent };
  }, [completedReferenceCount, form]);

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

  function updateReference(index: number, field: keyof ReferenceEntry, value: string) {
    setSavedMessage("");
    setForm((current) => ({
      ...current,
      references: current.references.map((reference, referenceIndex) =>
        referenceIndex === index ? { ...reference, [field]: value } : reference,
      ),
    }));
  }

  function togglePractice(item: string) {
    setSavedMessage("");
    setForm((current) => ({
      ...current,
      bestPractices: current.bestPractices.includes(item)
        ? current.bestPractices.filter((value) => value !== item)
        : [...current.bestPractices, item],
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
    setSavedMessage("3 Professional References completed.");
  }

  return (
    <div className="space-y-6">
      <GhostButton href="/roadmaps/senior">Back to Senior Roadmap</GhostButton>

      <section className="card-surface rounded-lg p-6 md:p-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-aggie-silver">Senior Roadmap</p>
            <h1 className="text-glow mt-3 text-4xl font-black tracking-tight text-white md:text-5xl">
              Three Professional References
            </h1>
            <p className="mt-4 text-lg leading-8 text-aggie-light/78">
              Most employers and graduate programs require professional references who can speak to your character,
              work ethic, leadership abilities, and professional potential.
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
          <Card title="Reference Requirements" icon={<UsersRound className="h-6 w-6" />}>
            <p className="leading-7 text-aggie-light/80">Identify and secure three professional references before graduation.</p>
            <p className="mt-5 text-sm font-black uppercase tracking-[0.2em] text-aggie-silver">Recommended reference types</p>
            <div className="mt-4">
              <CheckGrid items={referenceTypes} />
            </div>
          </Card>

          <Card title="Reference Tracker" icon={<UsersRound className="h-6 w-6" />}>
            <div className="grid gap-5">
              {form.references.map((reference, index) => (
                <section key={index} className="rounded-lg border border-aggie-silver/15 bg-white/[0.045] p-5">
                  <h3 className="text-xl font-black text-white">Reference {index + 1}</h3>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <TextInput label="Name" value={reference.name} onChange={(value) => updateReference(index, "name", value)} />
                    <TextInput label="Title" value={reference.title} onChange={(value) => updateReference(index, "title", value)} />
                    <TextInput label="Organization" value={reference.organization} onChange={(value) => updateReference(index, "organization", value)} />
                    <TextInput label="Email" value={reference.email} onChange={(value) => updateReference(index, "email", value)} />
                    <TextInput label="Phone Number" value={reference.phone} onChange={(value) => updateReference(index, "phone", value)} />
                    <TextInput label="Relationship" value={reference.relationship} onChange={(value) => updateReference(index, "relationship", value)} />
                  </div>
                </section>
              ))}
            </div>
          </Card>

          <Card title="Requesting a Reference" icon={<Mail className="h-6 w-6" />}>
            <pre className="whitespace-pre-wrap rounded-lg border border-aggie-silver/15 bg-aggie-navy/70 p-4 text-sm font-semibold leading-7 text-aggie-light/86">
              {requestMessage}
            </pre>
          </Card>

          <Card title="Reference Best Practices" icon={<Check className="h-6 w-6" />}>
            <div className="grid gap-3 md:grid-cols-2">
              {bestPractices.map((item) => (
                <ToggleCard key={item} selected={form.bestPractices.includes(item)} label={item} onClick={() => togglePractice(item)} />
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
              3 Professional References Completed
            </button>
            {form.moduleStatus === "Completed" && (
              <p className="mt-5 rounded-lg border border-aggie-chrome/30 bg-white/[0.08] p-4 text-sm font-bold leading-6 text-aggie-ice">
                Three Professional References complete. Keep your references informed as you apply for opportunities.
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
              <Snapshot label="References Started" value={`${completedReferenceCount}/3`} />
              <Snapshot label="Best Practices" value={`${form.bestPractices.length}/${bestPractices.length}`} />
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

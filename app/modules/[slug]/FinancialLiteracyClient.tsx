"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Banknote,
  CalendarDays,
  Check,
  Clock3,
  GraduationCap,
  RefreshCw,
  Save,
  ShieldCheck,
  WalletCards,
} from "lucide-react";
import { GhostButton } from "@/components/Prototype";
import { usePrototypeState } from "@/components/PrototypeState";

const moduleSlug = "financial-literacy";
const storageKey = "aggies-lead:sophomore:financial-literacy";

const eventCards = [
  {
    id: "financial-event-1",
    speakerName: "Coming Soon",
    aboutSpeaker: "TBD",
    eventTopic: "TBD",
    date: "TBD",
    time: "TBD",
    location: "TBD",
  },
  {
    id: "financial-event-2",
    speakerName: "Coming Soon",
    aboutSpeaker: "TBD",
    eventTopic: "TBD",
    date: "TBD",
    time: "TBD",
    location: "TBD",
  },
];

const miniModules = [
  {
    id: "credit-cards",
    title: "Credit & Credit Cards",
    description:
      "Learn what credit is, how credit cards work, how to build credit responsibly, and what mistakes to avoid.",
  },
  {
    id: "high-yield-savings",
    title: "High-Yield Savings & Growing Your Money",
    description:
      "Learn how high-yield savings accounts work and explore simple ways your money can grow over time.",
  },
  {
    id: "finance-basics",
    title: "Finance Basics for Beginners",
    description:
      "Learn foundational money skills including budgeting, saving, spending habits, emergency funds, and basic financial planning.",
  },
];

type FinancialLiteracyState = {
  attendedEvent: boolean;
  startedMiniModuleId: string;
  completedMiniModuleId: string;
  moduleStatus: "Not Started" | "In Progress" | "Completed";
  progressPercentage: number;
};

const initialState: FinancialLiteracyState = {
  attendedEvent: false,
  startedMiniModuleId: "",
  completedMiniModuleId: "",
  moduleStatus: "Not Started",
  progressPercentage: 0,
};

export function FinancialLiteracyClient() {
  const { completeModule } = usePrototypeState();
  const [form, setForm] = useState<FinancialLiteracyState>(initialState);
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

  const canComplete = form.attendedEvent || Boolean(form.completedMiniModuleId);

  const completion = useMemo(() => {
    const tasks = [form.attendedEvent || Boolean(form.startedMiniModuleId), canComplete];
    const completed = tasks.filter(Boolean).length;
    const percent = form.moduleStatus === "Completed" ? 100 : Math.round((completed / tasks.length) * 100);
    return { completed, total: tasks.length, percent };
  }, [canComplete, form]);

  useEffect(() => {
    setForm((current) => {
      if (current.moduleStatus === "Completed") {
        return current.progressPercentage === 100 ? current : { ...current, progressPercentage: 100 };
      }

      const nextStatus = completion.percent > 0 ? "In Progress" : "Not Started";
      if (current.moduleStatus === nextStatus && current.progressPercentage === completion.percent) {
        return current;
      }

      return { ...current, moduleStatus: nextStatus, progressPercentage: completion.percent };
    });
  }, [completion.percent]);

  function updateField<K extends keyof FinancialLiteracyState>(field: K, value: FinancialLiteracyState[K]) {
    setSavedMessage("");
    setForm((current) => ({ ...current, [field]: value }));
  }

  function startMiniModule(id: string) {
    setSavedMessage("");
    setForm((current) => ({
      ...current,
      startedMiniModuleId: id,
      completedMiniModuleId: id,
      attendedEvent: false,
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
    if (!canComplete) return;

    const completedState = {
      ...form,
      moduleStatus: "Completed" as const,
      progressPercentage: 100,
    };
    setForm(completedState);
    window.localStorage.setItem(storageKey, JSON.stringify(completedState));
    completeModule(moduleSlug);
    setSavedMessage("Financial Literacy marked complete.");
  }

  const completedMiniModule = miniModules.find((module) => module.id === form.completedMiniModuleId);

  return (
    <div className="space-y-6">
      <GhostButton href="/roadmaps/sophomore">Back to Sophomore Roadmap</GhostButton>

      <section className="card-surface rounded-lg p-6 md:p-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-aggie-silver">Sophomore Roadmap</p>
            <h1 className="text-glow mt-3 text-4xl font-black tracking-tight text-white md:text-5xl">
              Financial Literacy
            </h1>
            <p className="mt-4 text-lg leading-8 text-aggie-light/78">
              Financial literacy helps student-athletes build confidence with money, understand basic financial
              decisions, and prepare for life during and after college. Student-athletes can complete this requirement
              by attending a financial literacy event or by completing one of the self-guided mini-modules below.
            </p>
            <p className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-aggie-muted">
              <Clock3 className="h-4 w-4" />
              Estimated Time: 10 minutes
            </p>
          </div>
          <ProgressPanel
            completed={completion.completed}
            percent={form.progressPercentage}
            status={form.moduleStatus}
            total={completion.total}
          />
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <main className="space-y-6">
          <Card title="Attend a Financial Literacy Event" icon={<CalendarDays className="h-6 w-6" />}>
            <p className="leading-7 text-aggie-light/80">
              Aggies Lead will offer one financial literacy speaker, workshop, or activity each semester.
              Student-athletes who attend one of these events can count it toward completing this module.
            </p>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {eventCards.map((event, index) => (
                <article
                  key={event.id}
                  className="rounded-lg border border-aggie-silver/15 bg-white/[0.055] p-5 shadow-steel"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="rounded-lg border border-aggie-chrome/30 bg-aggie-chrome/10 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-aggie-ice">
                      Event {index + 1}
                    </span>
                    <Banknote className="h-5 w-5 shrink-0 text-aggie-ice" />
                  </div>
                  <h3 className="mt-5 text-2xl font-black text-white">{event.speakerName}</h3>
                  <div className="mt-5 space-y-3 text-sm font-bold text-aggie-light/78">
                    <Detail label="About the Speaker" value={event.aboutSpeaker} />
                    <Detail label="Event Topic" value={event.eventTopic} />
                    <Detail label="Date" value={event.date} />
                    <Detail label="Time" value={event.time} />
                    <Detail label="Location" value={event.location} />
                  </div>
                </article>
              ))}
            </div>
            <button
              type="button"
              onClick={() => updateField("attendedEvent", !form.attendedEvent)}
              className={`mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border px-5 text-sm font-black transition ${
                form.attendedEvent
                  ? "border-aggie-chrome/45 bg-white/[0.1] text-white"
                  : "border-aggie-silver/20 bg-white/[0.045] text-white hover:border-aggie-steel hover:bg-white/10"
              }`}
            >
              <Check className="h-4 w-4" />
              I attended a financial literacy event
            </button>
          </Card>

          <Card title="Unable to Attend?" icon={<GraduationCap className="h-6 w-6" />}>
            <p className="leading-7 text-aggie-light/80">
              If you are unable to attend a financial literacy event, complete one of the three mini-modules below.
            </p>
            <div className="mt-5 grid gap-4 lg:grid-cols-3">
              {miniModules.map((module) => {
                const selected = form.completedMiniModuleId === module.id;
                return (
                  <article
                    key={module.id}
                    className={`flex min-h-full flex-col rounded-lg border p-5 shadow-steel transition ${
                      selected ? "border-aggie-chrome/45 bg-white/[0.075]" : "border-aggie-silver/15 bg-white/[0.045]"
                    }`}
                  >
                    <span className="grid h-11 w-11 place-items-center rounded-lg border border-aggie-silver/20 bg-aggie-steel/16 text-aggie-ice">
                      <WalletCards className="h-6 w-6" />
                    </span>
                    <h3 className="mt-5 text-xl font-black text-white">{module.title}</h3>
                    <p className="mt-3 flex-1 text-sm font-bold leading-6 text-aggie-light/76">{module.description}</p>
                    <button
                      type="button"
                      onClick={() => startMiniModule(module.id)}
                      className={`mt-5 inline-flex min-h-11 items-center justify-center rounded-lg px-4 text-sm font-black transition ${
                        selected
                          ? "chrome-surface border border-aggie-chrome/60 text-aggie-navy shadow-glow"
                          : "border border-aggie-silver/20 bg-white/[0.045] text-white hover:border-aggie-steel hover:bg-white/10"
                      }`}
                    >
                      {selected ? "Module Selected" : "Start Module"}
                    </button>
                  </article>
                );
              })}
            </div>
          </Card>

          <Card title="Completion Requirement" icon={<ShieldCheck className="h-6 w-6" />}>
            <p className="leading-7 text-aggie-light/80">
              To complete Financial Literacy, choose one of the following:
            </p>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <Requirement selected={form.attendedEvent} text="Attend one financial literacy speaker, workshop, or activity" />
              <Requirement selected={Boolean(form.completedMiniModuleId)} text="Complete one of the three self-guided mini-modules" />
            </div>
            {completedMiniModule && (
              <p className="mt-4 rounded-lg border border-aggie-chrome/30 bg-white/[0.08] p-4 text-sm font-bold leading-6 text-aggie-ice">
                Selected mini-module: {completedMiniModule.title}
              </p>
            )}
            <button
              type="button"
              onClick={markComplete}
              disabled={!canComplete}
              className={`mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg px-5 text-sm font-black transition sm:w-auto ${
                canComplete
                  ? "chrome-surface border border-aggie-chrome/60 text-aggie-navy shadow-glow hover:brightness-110"
                  : "cursor-not-allowed border border-aggie-silver/15 bg-white/[0.04] text-aggie-muted"
              }`}
            >
              <Check className="h-4 w-4" />
              Mark Financial Literacy Complete
            </button>
            {form.moduleStatus === "Completed" && (
              <p className="mt-5 rounded-lg border border-aggie-chrome/30 bg-white/[0.08] p-4 text-sm font-bold leading-6 text-aggie-ice">
                Financial Literacy complete. Keep building money habits that support life during and after college.
              </p>
            )}
          </Card>
        </main>

        <aside className="space-y-6">
          <section className="card-surface rounded-lg p-5">
            <h2 className="text-xl font-black text-white">Save Options</h2>
            <p className="mt-2 text-sm leading-6 text-aggie-light/72">
              Save your progress locally or reset this module.
            </p>
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
            <h2 className="text-xl font-black text-white">Completion Path</h2>
            <div className="mt-4 space-y-3 text-sm font-bold text-aggie-light/78">
              <Snapshot label="Event Option" value={form.attendedEvent ? "Selected" : "Open"} />
              <Snapshot label="Mini-Module Option" value={completedMiniModule?.title ?? "Open"} />
              <Snapshot label="Status" value={form.moduleStatus} />
              <Snapshot label="Progress" value={`${form.progressPercentage}%`} />
            </div>
          </section>

          <Link
            href="/my-roadmap"
            className="inline-flex min-h-12 w-full items-center justify-center rounded-lg border border-aggie-silver/25 px-5 text-sm font-bold text-white transition hover:border-aggie-steel hover:bg-white/10"
          >
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
      <p className="mt-3 text-sm font-medium text-aggie-light/72">
        {completed} of {total} completion steps complete
      </p>
    </div>
  );
}

function Card({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="card-surface rounded-lg p-6">
      <div className="mb-5 flex items-center gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-aggie-silver/20 bg-aggie-steel/16 text-aggie-ice shadow-steel">
          {icon}
        </span>
        <h2 className="text-2xl font-black text-white">{title}</h2>
      </div>
      {children}
    </section>
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

function Requirement({ selected, text }: { selected: boolean; text: string }) {
  return (
    <div
      className={`flex items-start gap-3 rounded-lg border p-4 ${
        selected ? "border-aggie-chrome/45 bg-white/[0.1]" : "border-aggie-silver/15 bg-white/[0.045]"
      }`}
    >
      <span
        className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md ${
          selected ? "chrome-surface text-aggie-navy" : "border border-aggie-silver/25 text-aggie-muted"
        }`}
      >
        {selected && <Check className="h-4 w-4" />}
      </span>
      <p className="text-sm font-bold leading-6 text-aggie-light/82">{text}</p>
    </div>
  );
}

function ActionButton({
  children,
  icon,
  onClick,
  primary = false,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
  onClick: () => void;
  primary?: boolean;
}) {
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

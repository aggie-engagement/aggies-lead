"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { Check, ChevronDown, Clock3, MapPinned, RefreshCw, Save, Sparkles, Users } from "lucide-react";
import { GhostButton } from "@/components/Prototype";
import { usePrototypeState } from "@/components/PrototypeState";

const moduleSlug = "transfer-welcome-guide";
const storageKey = "aggies-lead:transfer:transfer-welcome-guide";

const firstWeekItems = [
  "Downloaded the Aggies Lead App",
  "Logged into university accounts",
  "Located practice facilities",
  "Located study hall",
  "Met with Academic Services",
  "Met with Aggie Engagement",
  "Located the Fueling Station",
  "Located the Weight Room (ICON)",
  "Located the Training Room",
  "Connected with teammates",
];

const resources = [
  "Academic Services",
  "Aggie Engagement",
  "Sports Medicine",
  "Mental Wellness",
  "Sports Nutrition",
  "Compliance",
];

const transferQuestions = [
  {
    question: "Where do I go for academic support?",
    answer:
      "Start with Academic Services. They can help with study hall, academic planning, tutoring, eligibility support, and class-related questions.",
  },
  {
    question: "How do I schedule a meeting with Aggie Engagement?",
    answer:
      "Connect with the Aggie Engagement staff through the athletics support offices or ask your coach, advisor, or team staff member for the best contact.",
  },
  {
    question: "Where is the Fueling Station?",
    answer:
      "The Fueling Station is a student-athlete resource for nutrition support before and after training. Ask your team staff or use the Campus Navigation module for directions.",
  },
  {
    question: "Who do I contact for compliance questions?",
    answer:
      "Contact Compliance before making decisions related to eligibility, outside benefits, NIL, transfers, or NCAA rules. When in doubt, ask first.",
  },
  {
    question: "Where do I go for mental health support?",
    answer:
      "Mental Wellness resources are available through Utah State Athletics and campus support services. Reach out early if you need support during your transition.",
  },
];

const successTips = [
  "Ask questions early",
  "Build relationships with staff",
  "Get involved beyond athletics",
  "Use available resources",
  "Start networking now",
];

type TransferWelcomeState = {
  firstWeekChecklist: string[];
  openQuestions: string[];
  moduleStatus: "Not Started" | "In Progress" | "Completed";
  progressPercentage: number;
};

const initialState: TransferWelcomeState = {
  firstWeekChecklist: [],
  openQuestions: [],
  moduleStatus: "Not Started",
  progressPercentage: 0,
};

export function TransferWelcomeGuideClient() {
  const { completeModule } = usePrototypeState();
  const [form, setForm] = useState<TransferWelcomeState>(initialState);
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
      true,
      form.firstWeekChecklist.length > 0,
      true,
      form.openQuestions.length > 0,
      true,
      true,
      form.moduleStatus === "Completed",
    ];
    const completed = tasks.filter(Boolean).length;
    const percent = form.moduleStatus === "Completed" ? 100 : Math.round((completed / tasks.length) * 100);
    return { completed, total: tasks.length, percent };
  }, [form.firstWeekChecklist.length, form.moduleStatus, form.openQuestions.length]);

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
    const completedForm: TransferWelcomeState = {
      ...form,
      moduleStatus: "Completed",
      progressPercentage: 100,
    };
    setForm(completedForm);
    persist(completedForm, "Transfer Welcome Guide completed.");
    completeModule(moduleSlug);
  };

  const toggleChecklist = (item: string) => {
    setForm((current) => ({
      ...current,
      firstWeekChecklist: current.firstWeekChecklist.includes(item)
        ? current.firstWeekChecklist.filter((selected) => selected !== item)
        : [...current.firstWeekChecklist, item],
    }));
  };

  const toggleQuestion = (question: string) => {
    setForm((current) => ({
      ...current,
      openQuestions: current.openQuestions.includes(question)
        ? current.openQuestions.filter((selected) => selected !== question)
        : [...current.openQuestions, question],
    }));
  };

  return (
    <div className="space-y-6">
      <GhostButton href="/roadmaps/transfer">Back to Transfer Add-On</GhostButton>

      <section className="card-surface rounded-lg p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-aggie-silver">Transfer Add-On</p>
            <h1 className="text-glow mt-3 text-4xl font-black tracking-tight text-white">Transfer Welcome Guide</h1>
            <p className="mt-4 max-w-3xl leading-7 text-aggie-light/76">
              Welcome to Utah State Athletics! Whether you transferred from another institution, junior college, or
              university, we are excited to have you join the Aggie family. This guide will help you quickly become
              familiar with key resources, important contacts, and opportunities available to student-athletes.
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
          <Card title="Welcome to Utah State" icon={<Sparkles className="h-6 w-6 text-aggie-ice" />}>
            <p className="leading-7 text-aggie-light/76">
              As a transfer student-athlete, there is a lot of new information to learn in a short period of time.
              Aggies Lead is here to help you navigate campus, connect with resources, and make the most of your
              experience at Utah State.
            </p>
          </Card>

          <Card title="First Week Checklist" icon={<Check className="h-6 w-6 text-aggie-ice" />}>
            <div className="grid gap-3 md:grid-cols-2">
              {firstWeekItems.map((item) => (
                <ToggleCard
                  key={item}
                  label={item}
                  selected={form.firstWeekChecklist.includes(item)}
                  onClick={() => toggleChecklist(item)}
                />
              ))}
            </div>
          </Card>

          <Card title="Important Resources" icon={<Users className="h-6 w-6 text-aggie-ice" />}>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {resources.map((resource) => (
                <article key={resource} className="rounded-lg border border-white/10 bg-white/6 p-4">
                  <h3 className="text-lg font-black text-white">{resource}</h3>
                  <p className="mt-2 text-sm leading-6 text-aggie-light/70">
                    A key resource to help transfer student-athletes connect, adjust, and thrive at Utah State.
                  </p>
                </article>
              ))}
            </div>
          </Card>

          <Card title="Common Transfer Questions" icon={<ChevronDown className="h-6 w-6 text-aggie-ice" />}>
            <div className="space-y-3">
              {transferQuestions.map((item) => {
                const open = form.openQuestions.includes(item.question);
                return (
                  <article key={item.question} className="rounded-lg border border-white/10 bg-white/5">
                    <button
                      type="button"
                      onClick={() => toggleQuestion(item.question)}
                      className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left font-black text-white"
                    >
                      <span>{item.question}</span>
                      <ChevronDown className={`h-5 w-5 transition ${open ? "rotate-180" : ""}`} />
                    </button>
                    {open ? (
                      <p className="border-t border-white/10 px-4 py-4 text-sm leading-6 text-aggie-light/74">
                        {item.answer}
                      </p>
                    ) : null}
                  </article>
                );
              })}
            </div>
          </Card>

          <Card title="Getting Involved" icon={<MapPinned className="h-6 w-6 text-aggie-ice" />}>
            <p className="leading-7 text-aggie-light/76">
              Take advantage of Aggies Lead programs, guest speakers, networking opportunities, community engagement
              events, and career development resources throughout the year.
            </p>
          </Card>

          <Card title="Transfer Success Tips" icon={<Sparkles className="h-6 w-6 text-aggie-ice" />}>
            <div className="grid gap-3 md:grid-cols-2">
              {successTips.map((tip) => (
                <div key={tip} className="rounded-lg border border-white/10 bg-white/6 p-4">
                  <p className="font-black text-white">{tip}</p>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={markComplete}
              className="mt-4 rounded-lg bg-aggie-ice px-4 py-3 text-sm font-black text-aggie-navy transition hover:bg-white"
            >
              Transfer Welcome Guide Completed
            </button>
            {form.moduleStatus === "Completed" ? (
              <p className="mt-4 rounded-lg border border-aggie-ice/30 bg-aggie-ice/10 p-4 text-sm font-semibold text-aggie-light">
                Welcome to the Aggie family. You are ready to keep exploring transfer resources and support.
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

          <Card title="Transfer Snapshot">
            <div className="space-y-3">
              <Snapshot label="First Week" value={`${form.firstWeekChecklist.length}/${firstWeekItems.length}`} />
              <Snapshot label="Questions Opened" value={`${form.openQuestions.length}/${transferQuestions.length}`} />
              <Snapshot label="Status" value={form.moduleStatus} />
            </div>
          </Card>

          <Link
            href="/roadmaps/transfer"
            className="block rounded-lg border border-white/10 bg-white/6 p-4 text-sm font-bold text-aggie-light transition hover:border-aggie-ice/40 hover:bg-white/10"
          >
            Return to Transfer Add-On
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

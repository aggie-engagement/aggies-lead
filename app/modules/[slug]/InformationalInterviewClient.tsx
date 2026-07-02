"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Check,
  Clipboard,
  Clock3,
  MessageSquareText,
  Network,
  RefreshCw,
  Save,
  Search,
  Send,
  UsersRound,
} from "lucide-react";
import { GhostButton } from "@/components/Prototype";
import { usePrototypeState } from "@/components/PrototypeState";

const moduleSlug = "informational-interview";
const storageKey = "aggies-lead:sophomore:informational-interview";

const benefits = [
  "Explore career paths and industries",
  "Learn from professionals with real-world experience",
  "Build your professional network",
  "Gain insight into career opportunities",
  "Improve communication and networking skills",
  "Discover internships and job opportunities",
  "Develop meaningful professional connections",
];

const peopleResources = [
  "Utah State Alumni",
  "Former Student-Athletes",
  "Coaches' Professional Networks",
  "Professors and Faculty",
  "Family and Friends",
  "Community Members",
  "LinkedIn Connections",
  "Employers from Career Fairs",
  "Guest Speakers",
  "Aggie Road Trip Contacts",
];

const outreachMessage = `Hi [Name],

My name is [Your Name], and I am a student-athlete at Utah State University studying [Major].

I came across your profile and noticed your experience in [Industry or Career Field]. I am interested in learning more about your career path and would greatly appreciate the opportunity to speak with you for 15-20 minutes.

Thank you for considering my request, and I look forward to hearing from you.

Best,
[Your Name]`;

const introductionExample =
  "Thank you for taking the time to meet with me today. My name is [Your Name], and I am a student-athlete at Utah State University studying [Major]. I am interested in learning more about your career path, your industry, and any advice you may have for someone exploring this field.";

const questions = [
  "Can you tell me about your career path?",
  "What does a typical day look like in your role?",
  "What do you enjoy most about your job?",
  "What challenges do you face in your position?",
  "What skills are most important in this field?",
  "How did you get your first opportunity in this industry?",
  "What advice would you give someone interested in this career?",
  "What experiences should I pursue while in college?",
  "Are there professional organizations or resources you recommend?",
  "Is there anyone else you recommend I connect with?",
];

const followUpTips = [
  "Send a thank-you message within 24 hours",
  "Mention something specific you learned",
  "Connect on LinkedIn",
  "Keep notes from the conversation",
  "Follow through on any advice provided",
  "Stay in touch periodically",
];

const relationshipTips = [
  "Connect on LinkedIn",
  "Send occasional updates about internships, jobs, or accomplishments",
  "Congratulate them on promotions or achievements",
  "Engage with their LinkedIn content",
  "Reach out when you have relevant questions",
  "Continue building the relationship over time",
];

const completionItems = [
  "Identified a professional",
  "Sent an outreach message",
  "Scheduled an informational interview",
  "Completed the interview",
  "Sent a thank-you message",
  "Connected on LinkedIn",
];

type InformationalInterviewState = {
  selectedResources: string[];
  copiedMessage: boolean;
  selectedQuestions: string[];
  completionChecklist: string[];
  moduleStatus: "Not Started" | "In Progress" | "Completed";
  progressPercentage: number;
};

const initialState: InformationalInterviewState = {
  selectedResources: [],
  copiedMessage: false,
  selectedQuestions: [],
  completionChecklist: [],
  moduleStatus: "Not Started",
  progressPercentage: 0,
};

export function InformationalInterviewClient() {
  const { completeModule } = usePrototypeState();
  const [form, setForm] = useState<InformationalInterviewState>(initialState);
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

  const allChecklistComplete = form.completionChecklist.length === completionItems.length;

  const completion = useMemo(() => {
    const tasks = [
      form.selectedResources.length > 0,
      form.copiedMessage,
      form.selectedQuestions.length > 0,
      form.completionChecklist.length > 0,
      allChecklistComplete,
    ];
    const completed = tasks.filter(Boolean).length;
    const percent = form.moduleStatus === "Completed" ? 100 : Math.round((completed / tasks.length) * 100);
    return { completed, total: tasks.length, percent };
  }, [allChecklistComplete, form]);

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

  function toggleList(field: "selectedResources" | "selectedQuestions" | "completionChecklist", value: string) {
    setSavedMessage("");
    setForm((current) => {
      const list = current[field];
      return {
        ...current,
        [field]: list.includes(value) ? list.filter((item) => item !== value) : [...list, value],
      };
    });
  }

  async function copyMessage() {
    setSavedMessage("");
    try {
      await navigator.clipboard.writeText(outreachMessage);
      setForm((current) => ({ ...current, copiedMessage: true }));
      setSavedMessage("Example message copied.");
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
    if (!allChecklistComplete) return;

    const completedState = {
      ...form,
      moduleStatus: "Completed" as const,
      progressPercentage: 100,
    };
    setForm(completedState);
    window.localStorage.setItem(storageKey, JSON.stringify(completedState));
    completeModule(moduleSlug);
    setSavedMessage("Informational Interview completed.");
  }

  return (
    <div className="space-y-6">
      <GhostButton href="/roadmaps/sophomore">Back to Sophomore Roadmap</GhostButton>

      <section className="card-surface rounded-lg p-6 md:p-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-aggie-silver">Sophomore Roadmap</p>
            <h1 className="text-glow mt-3 text-4xl font-black tracking-tight text-white md:text-5xl">
              Informational Interview
            </h1>
            <p className="mt-4 text-lg leading-8 text-aggie-light/78">
              An informational interview is a conversation with a professional designed to help you learn more about
              a career field, company, industry, or role. Informational interviews are not job interviews. Instead,
              they are opportunities to ask questions, build relationships, and gain career insight from professionals
              who have experience in areas that interest you.
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
          <Card title="Why Conduct an Informational Interview?" icon={<UsersRound className="h-6 w-6" />}>
            <CheckGrid items={benefits} />
          </Card>

          <Card title="Find Someone to Interview" icon={<Search className="h-6 w-6" />}>
            <p className="leading-7 text-aggie-light/80">
              There are many ways to identify professionals who may be willing to participate in an informational
              interview.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {peopleResources.map((resource) => (
                <ToggleCard
                  key={resource}
                  selected={form.selectedResources.includes(resource)}
                  label={resource}
                  onClick={() => toggleList("selectedResources", resource)}
                />
              ))}
            </div>
          </Card>

          <Card title="Aggies Lead Professional Network" icon={<Network className="h-6 w-6" />}>
            <p className="leading-7 text-aggie-light/80">
              In the future, this section will include Utah State alumni, former student-athletes, and community
              professionals who have volunteered to participate in informational interviews with student-athletes.
            </p>
            <div className="mt-5 rounded-lg border border-aggie-chrome/30 bg-aggie-chrome/10 p-5">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-aggie-silver">
                Professional Directory
              </p>
              <h3 className="mt-2 text-2xl font-black text-white">Coming Soon</h3>
              <p className="mt-3 leading-7 text-aggie-light/80">
                A searchable list of alumni and community members interested in connecting with student-athletes.
              </p>
            </div>
          </Card>

          <Card title="How to Reach Out" icon={<Send className="h-6 w-6" />}>
            <pre className="whitespace-pre-wrap rounded-lg border border-aggie-silver/15 bg-aggie-navy/70 p-4 text-sm font-semibold leading-7 text-aggie-light/86">
              {outreachMessage}
            </pre>
            <button
              type="button"
              onClick={copyMessage}
              className="chrome-surface mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-aggie-chrome/60 px-5 text-sm font-black text-aggie-navy shadow-glow transition hover:brightness-110"
            >
              <Clipboard className="h-4 w-4" />
              Copy Example Message
            </button>
          </Card>

          <Card title="How to Introduce Yourself" icon={<MessageSquareText className="h-6 w-6" />}>
            <p className="rounded-lg border border-aggie-silver/15 bg-white/[0.045] p-4 leading-7 text-aggie-light/84">
              {introductionExample}
            </p>
          </Card>

          <Card title="Questions to Ask" icon={<MessageSquareText className="h-6 w-6" />}>
            <div className="grid gap-3 md:grid-cols-2">
              {questions.map((question) => (
                <ToggleCard
                  key={question}
                  selected={form.selectedQuestions.includes(question)}
                  label={question}
                  onClick={() => toggleList("selectedQuestions", question)}
                />
              ))}
            </div>
          </Card>

          <Card title="After the Interview" icon={<Check className="h-6 w-6" />}>
            <CheckGrid items={followUpTips} />
          </Card>

          <Card title="Building Long-Term Relationships" icon={<Network className="h-6 w-6" />}>
            <CheckGrid items={relationshipTips} />
          </Card>

          <Card title="Completion Checklist" icon={<Check className="h-6 w-6" />}>
            <div className="grid gap-3 md:grid-cols-2">
              {completionItems.map((item) => (
                <ToggleCard
                  key={item}
                  selected={form.completionChecklist.includes(item)}
                  label={item}
                  onClick={() => toggleList("completionChecklist", item)}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={markComplete}
              disabled={!allChecklistComplete}
              className={`mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg px-5 text-sm font-black transition sm:w-auto ${
                allChecklistComplete
                  ? "chrome-surface border border-aggie-chrome/60 text-aggie-navy shadow-glow hover:brightness-110"
                  : "cursor-not-allowed border border-aggie-silver/15 bg-white/[0.04] text-aggie-muted"
              }`}
            >
              <Check className="h-4 w-4" />
              Informational Interview Completed
            </button>
            {form.moduleStatus === "Completed" && (
              <p className="mt-5 rounded-lg border border-aggie-chrome/30 bg-white/[0.08] p-4 text-sm font-bold leading-6 text-aggie-ice">
                Informational Interview complete. Keep the relationship going with thoughtful follow-up.
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
            <h2 className="text-xl font-black text-white">Interview Progress</h2>
            <div className="mt-4 space-y-3 text-sm font-bold text-aggie-light/78">
              <Snapshot label="Resources Selected" value={`${form.selectedResources.length}`} />
              <Snapshot label="Message Copied" value={form.copiedMessage ? "Yes" : "No"} />
              <Snapshot label="Questions Selected" value={`${form.selectedQuestions.length}`} />
              <Snapshot label="Checklist" value={`${form.completionChecklist.length}/${completionItems.length}`} />
              <Snapshot label="Status" value={form.moduleStatus} />
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
        {completed} of {total} preparation steps complete
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
      <span
        className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg ${
          selected ? "chrome-surface text-aggie-navy" : "border border-aggie-silver/20 text-aggie-muted"
        }`}
      >
        {selected && <Check className="h-4 w-4" />}
      </span>
      {label}
    </button>
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

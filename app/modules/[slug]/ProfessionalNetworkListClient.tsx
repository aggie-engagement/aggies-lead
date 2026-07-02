"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Building2,
  Check,
  Clock3,
  Network,
  RefreshCw,
  Save,
  Search,
  Target,
  UsersRound,
} from "lucide-react";
import { GhostButton } from "@/components/Prototype";
import { usePrototypeState } from "@/components/PrototypeState";

const moduleSlug = "professional-network-list";
const storageKey = "aggies-lead:sophomore:professional-network-list";

const benefits = [
  "Learn about careers and industries",
  "Gain professional advice",
  "Explore internships and job opportunities",
  "Build confidence communicating with professionals",
  "Expand your support system",
  "Develop long-term professional relationships",
];

const buildNetworkItems = [
  "Connect with teammates",
  "Connect with coaches",
  "Connect with professors",
  "Connect with Utah State alumni",
  "Connect with guest speakers",
  "Connect with Aggie Road Trip professionals",
  "Connect with internship supervisors",
  "Connect with employers from career fairs",
  "Connect with professionals in industries that interest you",
];

const peopleToFollow = [
  { category: "Utah State Alumni", name: "Coming Soon", title: "TBD", organization: "TBD", linkedIn: "TBD", industry: "TBD" },
  { category: "Former Student-Athletes", name: "Coming Soon", title: "TBD", organization: "TBD", linkedIn: "TBD", industry: "TBD" },
  { category: "Community Leaders", name: "Coming Soon", title: "TBD", organization: "TBD", linkedIn: "TBD", industry: "TBD" },
  { category: "Industry Professionals", name: "Coming Soon", title: "TBD", organization: "TBD", linkedIn: "TBD", industry: "TBD" },
  { category: "Employers & Recruiters", name: "Coming Soon", title: "TBD", organization: "TBD", linkedIn: "TBD", industry: "TBD" },
];

const networkingGoals = [
  "Added 10 new LinkedIn connections",
  "Connected with a Utah State alumnus",
  "Connected with a former student-athlete",
  "Connected with a professional in a career field of interest",
  "Attended a networking event",
  "Completed an informational interview",
];

const networkingTips = [
  "Focus on building relationships, not asking for jobs.",
  "Always send a personalized connection request when possible.",
  "Follow up after meeting someone new.",
  "Stay connected through LinkedIn.",
  "Look for ways to provide value and maintain genuine relationships.",
];

const organizationsToFollow = [
  "Utah State University",
  "Utah State Athletics",
  "Aggies Lead",
  "A-Club",
  "Additional organizations coming soon",
];

type ProfessionalNetworkState = {
  buildNetworkChecklist: string[];
  networkingGoals: string[];
  followedOrganizations: string[];
  moduleStatus: "Not Started" | "In Progress" | "Completed";
  progressPercentage: number;
};

const initialState: ProfessionalNetworkState = {
  buildNetworkChecklist: [],
  networkingGoals: [],
  followedOrganizations: [],
  moduleStatus: "Not Started",
  progressPercentage: 0,
};

export function ProfessionalNetworkListClient() {
  const { completeModule } = usePrototypeState();
  const [form, setForm] = useState<ProfessionalNetworkState>(initialState);
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

  const goalsComplete = form.networkingGoals.length === networkingGoals.length;

  const completion = useMemo(() => {
    const tasks = [
      form.buildNetworkChecklist.length > 0,
      form.networkingGoals.length > 0,
      form.followedOrganizations.length > 0,
      goalsComplete,
    ];
    const completed = tasks.filter(Boolean).length;
    const percent = form.moduleStatus === "Completed" ? 100 : Math.round((completed / tasks.length) * 100);
    return { completed, total: tasks.length, percent };
  }, [form, goalsComplete]);

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

  function toggleList(field: "buildNetworkChecklist" | "networkingGoals" | "followedOrganizations", value: string) {
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
    if (!goalsComplete) return;

    const completedState = {
      ...form,
      moduleStatus: "Completed" as const,
      progressPercentage: 100,
    };
    setForm(completedState);
    window.localStorage.setItem(storageKey, JSON.stringify(completedState));
    completeModule(moduleSlug);
    setSavedMessage("Professional Network List completed.");
  }

  return (
    <div className="space-y-6">
      <GhostButton href="/roadmaps/sophomore">Back to Sophomore Roadmap</GhostButton>

      <section className="card-surface rounded-lg p-6 md:p-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-aggie-silver">Sophomore Roadmap</p>
            <h1 className="text-glow mt-3 text-4xl font-black tracking-tight text-white md:text-5xl">
              Professional Network List
            </h1>
            <p className="mt-4 text-lg leading-8 text-aggie-light/78">
              Professional networking is one of the most effective ways to learn about careers, discover
              opportunities, and build relationships that can support your future goals. Your network can include
              alumni, coaches, professors, employers, teammates, guest speakers, and professionals working in
              industries that interest you.
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
          <Card title="What Is a Professional Network?" icon={<Network className="h-6 w-6" />}>
            <p className="leading-7 text-aggie-light/80">
              A professional network is a group of people who can provide advice, career insight, mentorship,
              introductions, and opportunities throughout your career journey. Building a network is not about asking
              for jobs-it is about building genuine relationships over time.
            </p>
            <div className="mt-5">
              <CheckGrid items={benefits} />
            </div>
          </Card>

          <Card title="Start Building Your Network" icon={<UsersRound className="h-6 w-6" />}>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {buildNetworkItems.map((item) => (
                <ToggleCard
                  key={item}
                  selected={form.buildNetworkChecklist.includes(item)}
                  label={item}
                  onClick={() => toggleList("buildNetworkChecklist", item)}
                />
              ))}
            </div>
          </Card>

          <Card title="People to Follow on LinkedIn" icon={<Search className="h-6 w-6" />}>
            <div className="grid gap-4 lg:grid-cols-2">
              {peopleToFollow.map((person) => (
                <article key={person.category} className="rounded-lg border border-aggie-silver/15 bg-white/[0.055] p-5 shadow-steel">
                  <p className="text-sm font-black uppercase tracking-[0.18em] text-aggie-silver">
                    {person.category}
                  </p>
                  <h3 className="mt-3 text-2xl font-black text-white">{person.name}</h3>
                  <div className="mt-5 grid gap-3 text-sm font-bold text-aggie-light/78">
                    <Detail label="Title" value={person.title} />
                    <Detail label="Organization" value={person.organization} />
                    <Detail label="LinkedIn Profile Link" value={person.linkedIn} />
                    <Detail label="Industry" value={person.industry} />
                  </div>
                </article>
              ))}
            </div>
          </Card>

          <Card title="Aggies Lead Professional Directory" icon={<Building2 className="h-6 w-6" />}>
            <p className="leading-7 text-aggie-light/80">
              This directory will eventually include alumni, former student-athletes, employers, community leaders,
              and professionals who are interested in connecting with Utah State student-athletes.
            </p>
            <div className="mt-5 rounded-lg border border-aggie-chrome/30 bg-aggie-chrome/10 p-5">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-aggie-silver">
                Professional Directory
              </p>
              <h3 className="mt-2 text-2xl font-black text-white">Coming Soon</h3>
            </div>
          </Card>

          <Card title="Networking Goals" icon={<Target className="h-6 w-6" />}>
            <div className="grid gap-3 md:grid-cols-2">
              {networkingGoals.map((goal) => (
                <ToggleCard
                  key={goal}
                  selected={form.networkingGoals.includes(goal)}
                  label={goal}
                  onClick={() => toggleList("networkingGoals", goal)}
                />
              ))}
            </div>
          </Card>

          <Card title="Networking Tips" icon={<Network className="h-6 w-6" />}>
            <div className="grid gap-4 md:grid-cols-2">
              {networkingTips.map((tip, index) => (
                <article key={tip} className="rounded-lg border border-aggie-silver/15 bg-white/[0.045] p-5">
                  <p className="text-sm font-black uppercase tracking-[0.18em] text-aggie-silver">Tip {index + 1}</p>
                  <p className="mt-3 text-sm font-bold leading-6 text-aggie-light/82">{tip}</p>
                </article>
              ))}
            </div>
          </Card>

          <Card title="Recommended Organizations to Follow" icon={<Building2 className="h-6 w-6" />}>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {organizationsToFollow.map((organization) => (
                <ToggleCard
                  key={organization}
                  selected={form.followedOrganizations.includes(organization)}
                  label={organization}
                  onClick={() => toggleList("followedOrganizations", organization)}
                />
              ))}
            </div>
          </Card>

          <Card title="Module Completion" icon={<Check className="h-6 w-6" />}>
            <p className="leading-7 text-aggie-light/78">
              Complete the networking goals checklist to mark this module complete.
            </p>
            <button
              type="button"
              onClick={markComplete}
              disabled={!goalsComplete}
              className={`mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg px-5 text-sm font-black transition sm:w-auto ${
                goalsComplete
                  ? "chrome-surface border border-aggie-chrome/60 text-aggie-navy shadow-glow hover:brightness-110"
                  : "cursor-not-allowed border border-aggie-silver/15 bg-white/[0.04] text-aggie-muted"
              }`}
            >
              <Check className="h-4 w-4" />
              Professional Network Established
            </button>
            {form.moduleStatus === "Completed" && (
              <p className="mt-5 rounded-lg border border-aggie-chrome/30 bg-white/[0.08] p-4 text-sm font-bold leading-6 text-aggie-ice">
                Professional Network List complete. Keep adding names and maintaining relationships over time.
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
            <h2 className="text-xl font-black text-white">Network Progress</h2>
            <div className="mt-4 space-y-3 text-sm font-bold text-aggie-light/78">
              <Snapshot label="Starting Connections" value={`${form.buildNetworkChecklist.length}/${buildNetworkItems.length}`} />
              <Snapshot label="Networking Goals" value={`${form.networkingGoals.length}/${networkingGoals.length}`} />
              <Snapshot label="Organizations Followed" value={`${form.followedOrganizations.length}`} />
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
        {completed} of {total} network steps complete
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

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-aggie-silver/15 bg-aggie-navy/50 p-3">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-aggie-silver">{label}</p>
      <p className="mt-1 font-bold text-white">{value}</p>
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

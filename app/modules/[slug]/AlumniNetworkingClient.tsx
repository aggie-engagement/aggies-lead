"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { Check, Clock3, Handshake, Network, RefreshCw, Save, Sparkles, Users } from "lucide-react";
import { GhostButton } from "@/components/Prototype";
import { usePrototypeState } from "@/components/PrototypeState";

const moduleSlug = "alumni-networking";
const storageKey = "aggies-lead:senior:alumni-networking";

type ActionPlan = {
  alumniConnection: string;
  alumniEvent: string;
  stayInvolved: string;
};

type AlumniNetworkingState = {
  stayConnectedChecklist: string[];
  actionPlan: ActionPlan;
  moduleStatus: "Not Started" | "In Progress" | "Completed";
  progressPercentage: number;
};

const benefits = [
  "Career opportunities",
  "Professional networking",
  "Mentorship",
  "Industry insights",
  "Continued connection to Utah State Athletics",
  "Giving back to future student-athletes",
];

const opportunities = [
  "Aggie Alumni Network",
  "A-Club",
  "Former Student-Athlete Mentorship",
  "Alumni Events",
  "Career Networking Opportunities",
];

const stayConnectedItems = [
  "Joined alumni network",
  "Connected with former teammates",
  "Connected with alumni on LinkedIn",
  "Attended an alumni event",
  "Identified an alumni mentor",
];

const giveBackItems = [
  "Speaking to student-athletes",
  "Participating in Aggies Lead events",
  "Hosting job shadows",
  "Mentoring current student-athletes",
  "Supporting future Aggies",
];

const initialState: AlumniNetworkingState = {
  stayConnectedChecklist: [],
  actionPlan: {
    alumniConnection: "",
    alumniEvent: "",
    stayInvolved: "",
  },
  moduleStatus: "Not Started",
  progressPercentage: 0,
};

export function AlumniNetworkingClient() {
  const { completeModule } = usePrototypeState();
  const [form, setForm] = useState<AlumniNetworkingState>(initialState);
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

  const stayConnectedStarted = form.stayConnectedChecklist.length > 0;
  const actionPlanStarted = Object.values(form.actionPlan).some((value) => value.trim().length > 0);

  const completion = useMemo(() => {
    const tasks = [
      true,
      true,
      true,
      stayConnectedStarted,
      true,
      actionPlanStarted,
      form.moduleStatus === "Completed",
    ];
    const completed = tasks.filter(Boolean).length;
    const percent = form.moduleStatus === "Completed" ? 100 : Math.round((completed / tasks.length) * 100);
    return { completed, total: tasks.length, percent };
  }, [actionPlanStarted, form.moduleStatus, stayConnectedStarted]);

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
    const completedForm: AlumniNetworkingState = {
      ...form,
      moduleStatus: "Completed",
      progressPercentage: 100,
    };
    setForm(completedForm);
    persist(completedForm, "Alumni Networking completed.");
    completeModule(moduleSlug);
  };

  const toggleStayConnected = (item: string) => {
    setForm((current) => ({
      ...current,
      stayConnectedChecklist: current.stayConnectedChecklist.includes(item)
        ? current.stayConnectedChecklist.filter((selected) => selected !== item)
        : [...current.stayConnectedChecklist, item],
    }));
  };

  const updateActionPlan = (field: keyof ActionPlan, value: string) => {
    setForm((current) => ({
      ...current,
      actionPlan: { ...current.actionPlan, [field]: value },
    }));
  };

  return (
    <div className="space-y-6">
      <GhostButton href="/roadmaps/senior">Back to Senior Roadmap</GhostButton>

      <section className="card-surface rounded-lg p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-aggie-silver">Senior Roadmap</p>
            <h1 className="text-glow mt-3 text-4xl font-black tracking-tight text-white">Alumni Networking</h1>
            <p className="mt-4 max-w-3xl leading-7 text-aggie-light/76">
              Graduation does not mark the end of your Aggie journey. Utah State's alumni network includes former
              student-athletes, professionals, community leaders, and supporters who can continue to provide guidance,
              mentorship, and opportunities throughout your career.
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
          <Card title="Why Stay Connected?" icon={<Network className="h-6 w-6 text-aggie-ice" />}>
            <div className="grid gap-3 md:grid-cols-2">
              {benefits.map((benefit) => (
                <InfoCard key={benefit} title={benefit} />
              ))}
            </div>
          </Card>

          <Card title="Alumni Network Opportunities" icon={<Users className="h-6 w-6 text-aggie-ice" />}>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {opportunities.map((opportunity) => (
                <article key={opportunity} className="rounded-lg border border-white/10 bg-white/6 p-4">
                  <h3 className="text-lg font-black text-white">{opportunity}</h3>
                  <p className="mt-2 text-sm font-semibold text-aggie-muted">Coming Soon</p>
                </article>
              ))}
            </div>
          </Card>

          <Card title="Alumni Directory" icon={<Users className="h-6 w-6 text-aggie-ice" />}>
            <div className="rounded-lg border border-aggie-ice/25 bg-aggie-ice/10 p-5">
              <h3 className="text-xl font-black text-white">Alumni Directory Coming Soon</h3>
              <p className="mt-3 leading-7 text-aggie-light/74">
                This section will eventually connect current student-athletes with former Aggies across a variety of
                industries and career fields.
              </p>
            </div>
          </Card>

          <Card title="Stay Connected" icon={<Check className="h-6 w-6 text-aggie-ice" />}>
            <div className="grid gap-3 md:grid-cols-2">
              {stayConnectedItems.map((item) => (
                <ToggleCard
                  key={item}
                  label={item}
                  selected={form.stayConnectedChecklist.includes(item)}
                  onClick={() => toggleStayConnected(item)}
                />
              ))}
            </div>
          </Card>

          <Card title="Give Back" icon={<Handshake className="h-6 w-6 text-aggie-ice" />}>
            <p className="mb-4 leading-7 text-aggie-light/74">Future opportunities may include:</p>
            <div className="grid gap-3 md:grid-cols-2">
              {giveBackItems.map((item) => (
                <InfoCard key={item} title={item} />
              ))}
            </div>
          </Card>

          <Card title="My Alumni Action Plan" icon={<Sparkles className="h-6 w-6 text-aggie-ice" />}>
            <div className="grid gap-4 lg:grid-cols-3">
              <TextArea
                label="One alumni connection I will make:"
                value={form.actionPlan.alumniConnection}
                onChange={(value) => updateActionPlan("alumniConnection", value)}
              />
              <TextArea
                label="One alumni event I will attend:"
                value={form.actionPlan.alumniEvent}
                onChange={(value) => updateActionPlan("alumniEvent", value)}
              />
              <TextArea
                label="One way I will stay involved:"
                value={form.actionPlan.stayInvolved}
                onChange={(value) => updateActionPlan("stayInvolved", value)}
              />
            </div>
            <button
              type="button"
              onClick={markComplete}
              className="mt-4 rounded-lg bg-aggie-ice px-4 py-3 text-sm font-black text-aggie-navy transition hover:bg-white"
            >
              Alumni Networking Completed
            </button>
            {form.moduleStatus === "Completed" ? (
              <p className="mt-4 rounded-lg border border-aggie-ice/30 bg-aggie-ice/10 p-4 text-sm font-semibold text-aggie-light">
                Great work. You have started mapping how you will stay connected to Utah State and fellow Aggies.
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

          <Card title="Networking Snapshot">
            <div className="space-y-3">
              <Snapshot label="Stay Connected" value={`${form.stayConnectedChecklist.length}/${stayConnectedItems.length}`} />
              <Snapshot label="Action Plan" value={actionPlanStarted ? "Started" : "Not Started"} />
              <Snapshot label="Status" value={form.moduleStatus} />
            </div>
          </Card>

          <Link
            href="/roadmaps/senior"
            className="block rounded-lg border border-white/10 bg-white/6 p-4 text-sm font-bold text-aggie-light transition hover:border-aggie-ice/40 hover:bg-white/10"
          >
            Return to Senior Roadmap
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

function InfoCard({ title }: { title: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/6 p-4">
      <p className="font-black text-white">{title}</p>
    </div>
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

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="text-sm font-black text-white">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-aggie-muted focus:border-aggie-ice/60"
      />
    </label>
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

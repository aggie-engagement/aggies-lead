"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { Check, Clock3, Network, Plus, RefreshCw, Save, Target, Trash2, Users } from "lucide-react";
import { GhostButton } from "@/components/Prototype";
import { usePrototypeState } from "@/components/PrototypeState";

const moduleSlug = "advanced-networking-strategy";
const storageKey = "aggies-lead:graduate:advanced-networking-strategy";

const networkItems = [
  "Alumni Connections",
  "Former Student-Athletes",
  "Professors",
  "Internship Supervisors",
  "Employers",
  "Industry Professionals",
  "Mentors",
  "Community Leaders",
];

const relationshipItems = [
  "Sent a follow-up message",
  "Shared a professional update",
  "Congratulated a connection",
  "Reached out to reconnect",
  "Scheduled a networking conversation",
];

const challengeItems = [
  "5 networking conversations",
  "3 informational interviews",
  "2 alumni connections",
  "1 industry mentor connection",
];

type StrategicPlan = {
  targetIndustry: string;
  targetOrganizations: string;
  targetProfessionals: string;
  topNetworkingGoals: string;
};

type TrackerRow = {
  id: string;
  contactName: string;
  organization: string;
  dateContacted: string;
  purpose: string;
  followUpDate: string;
  outcome: string;
};

type TrackerDraft = Omit<TrackerRow, "id">;

type AdvancedNetworkingState = {
  currentNetwork: string[];
  strategicPlan: StrategicPlan;
  trackerRows: TrackerRow[];
  trackerDraft: TrackerDraft;
  relationshipMaintenance: string[];
  networkingChallenge: string[];
  moduleStatus: "Not Started" | "In Progress" | "Completed";
  progressPercentage: number;
};

const emptyDraft: TrackerDraft = {
  contactName: "",
  organization: "",
  dateContacted: "",
  purpose: "",
  followUpDate: "",
  outcome: "",
};

const initialState: AdvancedNetworkingState = {
  currentNetwork: [],
  strategicPlan: {
    targetIndustry: "",
    targetOrganizations: "",
    targetProfessionals: "",
    topNetworkingGoals: "",
  },
  trackerRows: [],
  trackerDraft: emptyDraft,
  relationshipMaintenance: [],
  networkingChallenge: [],
  moduleStatus: "Not Started",
  progressPercentage: 0,
};

export function AdvancedNetworkingStrategyClient() {
  const { completeModule } = usePrototypeState();
  const [form, setForm] = useState<AdvancedNetworkingState>(initialState);
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

  const strategicPlanStarted = Object.values(form.strategicPlan).some((value) => value.trim().length > 0);

  const completion = useMemo(() => {
    const tasks = [
      form.currentNetwork.length > 0,
      strategicPlanStarted,
      form.trackerRows.length > 0,
      form.relationshipMaintenance.length > 0,
      form.networkingChallenge.length > 0,
      form.moduleStatus === "Completed",
    ];
    const completed = tasks.filter(Boolean).length;
    const percent = form.moduleStatus === "Completed" ? 100 : Math.round((completed / tasks.length) * 100);
    return { completed, total: tasks.length, percent };
  }, [form, strategicPlanStarted]);

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
    const completedForm: AdvancedNetworkingState = {
      ...form,
      moduleStatus: "Completed",
      progressPercentage: 100,
    };
    setForm(completedForm);
    persist(completedForm, "Advanced Networking Strategy completed.");
    completeModule(moduleSlug);
  };

  const toggleList = (field: "currentNetwork" | "relationshipMaintenance" | "networkingChallenge", item: string) => {
    setForm((current) => ({
      ...current,
      [field]: current[field].includes(item)
        ? current[field].filter((selected) => selected !== item)
        : [...current[field], item],
    }));
  };

  const updateStrategicPlan = (field: keyof StrategicPlan, value: string) => {
    setForm((current) => ({ ...current, strategicPlan: { ...current.strategicPlan, [field]: value } }));
  };

  const updateDraft = (field: keyof TrackerDraft, value: string) => {
    setForm((current) => ({ ...current, trackerDraft: { ...current.trackerDraft, [field]: value } }));
  };

  const addTrackerRow = () => {
    const hasEntry = Object.values(form.trackerDraft).some((value) => value.trim().length > 0);
    if (!hasEntry) return;

    setForm((current) => ({
      ...current,
      trackerRows: [...current.trackerRows, { ...current.trackerDraft, id: crypto.randomUUID() }],
      trackerDraft: emptyDraft,
    }));
  };

  const deleteTrackerRow = (id: string) => {
    setForm((current) => ({
      ...current,
      trackerRows: current.trackerRows.filter((row) => row.id !== id),
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
            <h1 className="text-glow mt-3 text-4xl font-black tracking-tight text-white">
              Advanced Networking Strategy
            </h1>
            <p className="mt-4 max-w-3xl leading-7 text-aggie-light/76">
              Networking is no longer about building a network from scratch. At this stage, the focus is on
              strategically leveraging relationships, strengthening professional connections, and creating opportunities
              for career advancement.
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
          <Card title="Evaluate Your Current Network" icon={<Users className="h-6 w-6 text-aggie-ice" />}>
            <div className="grid gap-3 md:grid-cols-2">
              {networkItems.map((item) => (
                <ToggleCard
                  key={item}
                  label={item}
                  selected={form.currentNetwork.includes(item)}
                  onClick={() => toggleList("currentNetwork", item)}
                />
              ))}
            </div>
          </Card>

          <Card title="Strategic Networking Plan" icon={<Target className="h-6 w-6 text-aggie-ice" />}>
            <div className="grid gap-4 md:grid-cols-2">
              <TextInput
                label="Target Industry"
                value={form.strategicPlan.targetIndustry}
                onChange={(value) => updateStrategicPlan("targetIndustry", value)}
              />
              <TextInput
                label="Target Organizations"
                value={form.strategicPlan.targetOrganizations}
                onChange={(value) => updateStrategicPlan("targetOrganizations", value)}
              />
              <TextInput
                label="Target Professionals"
                value={form.strategicPlan.targetProfessionals}
                onChange={(value) => updateStrategicPlan("targetProfessionals", value)}
              />
              <TextArea
                label="Top 5 Networking Goals"
                value={form.strategicPlan.topNetworkingGoals}
                onChange={(value) => updateStrategicPlan("topNetworkingGoals", value)}
              />
            </div>
          </Card>

          <Card title="Networking Activity Tracker" icon={<Network className="h-6 w-6 text-aggie-ice" />}>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              <TextInput label="Contact Name" value={form.trackerDraft.contactName} onChange={(value) => updateDraft("contactName", value)} />
              <TextInput label="Organization" value={form.trackerDraft.organization} onChange={(value) => updateDraft("organization", value)} />
              <TextInput label="Date Contacted" value={form.trackerDraft.dateContacted} onChange={(value) => updateDraft("dateContacted", value)} />
              <TextInput label="Purpose" value={form.trackerDraft.purpose} onChange={(value) => updateDraft("purpose", value)} />
              <TextInput label="Follow-Up Date" value={form.trackerDraft.followUpDate} onChange={(value) => updateDraft("followUpDate", value)} />
              <TextInput label="Outcome" value={form.trackerDraft.outcome} onChange={(value) => updateDraft("outcome", value)} />
            </div>
            <button
              type="button"
              onClick={addTrackerRow}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-aggie-blue px-4 py-3 text-sm font-black text-white transition hover:bg-aggie-blue/85"
            >
              <Plus className="h-4 w-4" />
              Add Networking Activity
            </button>

            <div className="mt-5 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="text-xs uppercase tracking-[0.16em] text-aggie-muted">
                  <tr>
                    {["Contact Name", "Organization", "Date Contacted", "Purpose", "Follow-Up Date", "Outcome", ""].map((heading) => (
                      <th key={heading} className="border-b border-white/10 px-3 py-3 font-black">
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {form.trackerRows.length ? (
                    form.trackerRows.map((row) => (
                      <tr key={row.id} className="border-b border-white/8 text-aggie-light">
                        <td className="px-3 py-3">{row.contactName || "-"}</td>
                        <td className="px-3 py-3">{row.organization || "-"}</td>
                        <td className="px-3 py-3">{row.dateContacted || "-"}</td>
                        <td className="px-3 py-3">{row.purpose || "-"}</td>
                        <td className="px-3 py-3">{row.followUpDate || "-"}</td>
                        <td className="px-3 py-3">{row.outcome || "-"}</td>
                        <td className="px-3 py-3">
                          <button
                            type="button"
                            onClick={() => deleteTrackerRow(row.id)}
                            className="rounded-lg border border-white/10 bg-white/5 p-2 text-aggie-light transition hover:border-aggie-ice/40 hover:bg-white/10"
                            aria-label={`Delete ${row.contactName || "networking activity"}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-3 py-5 text-center font-semibold text-aggie-muted">
                        No networking activity added yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          <Card title="Relationship Maintenance" icon={<Check className="h-6 w-6 text-aggie-ice" />}>
            <div className="grid gap-3 md:grid-cols-2">
              {relationshipItems.map((item) => (
                <ToggleCard
                  key={item}
                  label={item}
                  selected={form.relationshipMaintenance.includes(item)}
                  onClick={() => toggleList("relationshipMaintenance", item)}
                />
              ))}
            </div>
          </Card>

          <Card title="Networking Challenge" icon={<Check className="h-6 w-6 text-aggie-ice" />}>
            <p className="mb-4 text-sm font-semibold text-aggie-muted">Complete at least:</p>
            <div className="grid gap-3 md:grid-cols-2">
              {challengeItems.map((item) => (
                <ToggleCard
                  key={item}
                  label={item}
                  selected={form.networkingChallenge.includes(item)}
                  onClick={() => toggleList("networkingChallenge", item)}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={markComplete}
              className="mt-4 rounded-lg bg-aggie-ice px-4 py-3 text-sm font-black text-aggie-navy transition hover:bg-white"
            >
              Advanced Networking Strategy Completed
            </button>
            {form.moduleStatus === "Completed" ? (
              <p className="mt-4 rounded-lg border border-aggie-ice/30 bg-aggie-ice/10 p-4 text-sm font-semibold text-aggie-light">
                Great work. You have a strategic plan for maintaining relationships and creating career opportunities.
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
              <Snapshot label="Network Areas" value={`${form.currentNetwork.length}/${networkItems.length}`} />
              <Snapshot label="Activities Added" value={String(form.trackerRows.length)} />
              <Snapshot label="Relationship Actions" value={`${form.relationshipMaintenance.length}/${relationshipItems.length}`} />
              <Snapshot label="Challenge Progress" value={`${form.networkingChallenge.length}/${challengeItems.length}`} />
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

function TextInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="text-sm font-black text-white">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-aggie-muted focus:border-aggie-ice/60"
      />
    </label>
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

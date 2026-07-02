"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { Check, Clock3, GraduationCap, HeartHandshake, RefreshCw, Save, Sparkles, Trophy, Users } from "lucide-react";
import { GhostButton } from "@/components/Prototype";
import { usePrototypeState } from "@/components/PrototypeState";

const moduleSlug = "post-usu-transition-checklist";
const storageKey = "aggies-lead:graduate:post-usu-transition-checklist";

const careerReadinessItems = [
  "Resume finalized",
  "LinkedIn profile updated",
  "Professional references secured",
  "Job search completed or active",
  "Graduate school plans finalized",
  "Career goals identified",
];

const professionalNetworkItems = [
  "Connected with alumni",
  "Connected with former teammates",
  "Connected with mentors",
  "Connected with professional contacts",
  "Joined professional organizations",
];

const personalTransitionItems = [
  "Housing plans identified",
  "Financial plan established",
  "Health insurance plan identified",
  "Transportation plan identified",
  "Personal goals established",
];

const aggieConnectionItems = [
  "Joined the alumni network",
  "Connected with A-Club",
  "Connected with Aggies Lead alumni resources",
  "Updated contact information",
];

type GiveBackPlan = {
  stayConnected: string;
  mentorFutureAthletes: string;
  futureProgramming: string;
};

type NextChapter = {
  currentPositionOrPlan: string;
  employerOrOrganization: string;
  location: string;
  startDate: string;
  personalGoalNextYear: string;
};

type PostUsuTransitionState = {
  careerReadiness: string[];
  professionalNetwork: string[];
  personalTransition: string[];
  aggieConnections: string[];
  giveBackPlan: GiveBackPlan;
  nextChapter: NextChapter;
  finalReflection: string;
  moduleStatus: "Not Started" | "In Progress" | "Completed";
  progressPercentage: number;
};

const initialState: PostUsuTransitionState = {
  careerReadiness: [],
  professionalNetwork: [],
  personalTransition: [],
  aggieConnections: [],
  giveBackPlan: {
    stayConnected: "",
    mentorFutureAthletes: "",
    futureProgramming: "",
  },
  nextChapter: {
    currentPositionOrPlan: "",
    employerOrOrganization: "",
    location: "",
    startDate: "",
    personalGoalNextYear: "",
  },
  finalReflection: "",
  moduleStatus: "Not Started",
  progressPercentage: 0,
};

export function PostUsuTransitionChecklistClient() {
  const { completeModule } = usePrototypeState();
  const [form, setForm] = useState<PostUsuTransitionState>(initialState);
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

  const giveBackStarted = Object.values(form.giveBackPlan).some((value) => value.trim().length > 0);
  const nextChapterStarted = Object.values(form.nextChapter).some((value) => value.trim().length > 0);
  const finalReflectionStarted = form.finalReflection.trim().length > 0;

  const completion = useMemo(() => {
    const tasks = [
      form.careerReadiness.length > 0,
      form.professionalNetwork.length > 0,
      form.personalTransition.length > 0,
      form.aggieConnections.length > 0,
      giveBackStarted,
      nextChapterStarted,
      finalReflectionStarted,
      form.moduleStatus === "Completed",
    ];
    const completed = tasks.filter(Boolean).length;
    const percent = form.moduleStatus === "Completed" ? 100 : Math.round((completed / tasks.length) * 100);
    return { completed, total: tasks.length, percent };
  }, [
    finalReflectionStarted,
    form.aggieConnections.length,
    form.careerReadiness.length,
    form.moduleStatus,
    form.personalTransition.length,
    form.professionalNetwork.length,
    giveBackStarted,
    nextChapterStarted,
  ]);

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
    const completedForm: PostUsuTransitionState = {
      ...form,
      moduleStatus: "Completed",
      progressPercentage: 100,
    };
    setForm(completedForm);
    persist(completedForm, "Post-USU Transition complete.");
    completeModule(moduleSlug);
  };

  const toggleList = (
    field: "careerReadiness" | "professionalNetwork" | "personalTransition" | "aggieConnections",
    item: string,
  ) => {
    setForm((current) => ({
      ...current,
      [field]: current[field].includes(item)
        ? current[field].filter((selected) => selected !== item)
        : [...current[field], item],
    }));
  };

  const updateGiveBack = (field: keyof GiveBackPlan, value: string) => {
    setForm((current) => ({ ...current, giveBackPlan: { ...current.giveBackPlan, [field]: value } }));
  };

  const updateNextChapter = (field: keyof NextChapter, value: string) => {
    setForm((current) => ({ ...current, nextChapter: { ...current.nextChapter, [field]: value } }));
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
              Post-USU Transition Checklist
            </h1>
            <p className="mt-4 max-w-3xl leading-7 text-aggie-light/76">
              Congratulations on completing your Utah State student-athlete experience. This checklist is designed to
              help ensure you are prepared for your transition into the next chapter of your personal and professional
              journey.
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
          <ChecklistSection
            title="Career Readiness"
            icon={<GraduationCap className="h-6 w-6 text-aggie-ice" />}
            items={careerReadinessItems}
            selected={form.careerReadiness}
            onToggle={(item) => toggleList("careerReadiness", item)}
          />

          <ChecklistSection
            title="Professional Network"
            icon={<Users className="h-6 w-6 text-aggie-ice" />}
            items={professionalNetworkItems}
            selected={form.professionalNetwork}
            onToggle={(item) => toggleList("professionalNetwork", item)}
          />

          <ChecklistSection
            title="Personal Transition"
            icon={<Check className="h-6 w-6 text-aggie-ice" />}
            items={personalTransitionItems}
            selected={form.personalTransition}
            onToggle={(item) => toggleList("personalTransition", item)}
          />

          <ChecklistSection
            title="Aggie Connections"
            icon={<HeartHandshake className="h-6 w-6 text-aggie-ice" />}
            items={aggieConnectionItems}
            selected={form.aggieConnections}
            onToggle={(item) => toggleList("aggieConnections", item)}
          />

          <Card title="Give Back Plan" icon={<HeartHandshake className="h-6 w-6 text-aggie-ice" />}>
            <div className="grid gap-4 md:grid-cols-3">
              <TextArea
                label="How would you like to stay connected to Utah State Athletics?"
                value={form.giveBackPlan.stayConnected}
                onChange={(value) => updateGiveBack("stayConnected", value)}
              />
              <TextArea
                label="Would you be willing to mentor future student-athletes?"
                value={form.giveBackPlan.mentorFutureAthletes}
                onChange={(value) => updateGiveBack("mentorFutureAthletes", value)}
              />
              <TextArea
                label="Would you be interested in participating in future Aggies Lead programming?"
                value={form.giveBackPlan.futureProgramming}
                onChange={(value) => updateGiveBack("futureProgramming", value)}
              />
            </div>
          </Card>

          <Card title="My Next Chapter" icon={<Sparkles className="h-6 w-6 text-aggie-ice" />}>
            <div className="grid gap-4 md:grid-cols-2">
              <TextInput
                label="Current Position or Plan"
                value={form.nextChapter.currentPositionOrPlan}
                onChange={(value) => updateNextChapter("currentPositionOrPlan", value)}
              />
              <TextInput
                label="Employer / Graduate School / Organization"
                value={form.nextChapter.employerOrOrganization}
                onChange={(value) => updateNextChapter("employerOrOrganization", value)}
              />
              <TextInput label="Location" value={form.nextChapter.location} onChange={(value) => updateNextChapter("location", value)} />
              <TextInput label="Start Date" value={form.nextChapter.startDate} onChange={(value) => updateNextChapter("startDate", value)} />
              <TextArea
                label="Personal Goal for the Next Year"
                value={form.nextChapter.personalGoalNextYear}
                onChange={(value) => updateNextChapter("personalGoalNextYear", value)}
              />
            </div>
          </Card>

          <Card title="Final Reflection" icon={<Trophy className="h-6 w-6 text-aggie-ice" />}>
            <TextArea
              label="What is the most valuable lesson you learned during your time as a Utah State student-athlete?"
              value={form.finalReflection}
              onChange={(value) => setForm((current) => ({ ...current, finalReflection: value }))}
            />
            <button
              type="button"
              onClick={markComplete}
              className="mt-4 rounded-lg bg-aggie-ice px-4 py-3 text-sm font-black text-aggie-navy transition hover:bg-white"
            >
              Post-USU Transition Complete
            </button>
            {form.moduleStatus === "Completed" ? (
              <div className="mt-4 rounded-lg border border-aggie-ice/30 bg-aggie-ice/10 p-5">
                <h3 className="text-2xl font-black text-white">Congratulations!</h3>
                <p className="mt-3 leading-7 text-aggie-light/80">
                  You have completed the Aggies Lead Student-Athlete Development Roadmap. The skills, experiences,
                  relationships, and lessons you developed during your time at Utah State will continue to support your
                  success long after your playing career ends.
                </p>
                <p className="mt-4 text-lg font-black text-aggie-ice">Once an Aggie, Always an Aggie.</p>
              </div>
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

          <Card title="Transition Snapshot">
            <div className="space-y-3">
              <Snapshot label="Career Readiness" value={`${form.careerReadiness.length}/${careerReadinessItems.length}`} />
              <Snapshot label="Professional Network" value={`${form.professionalNetwork.length}/${professionalNetworkItems.length}`} />
              <Snapshot label="Personal Transition" value={`${form.personalTransition.length}/${personalTransitionItems.length}`} />
              <Snapshot label="Aggie Connections" value={`${form.aggieConnections.length}/${aggieConnectionItems.length}`} />
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

function ChecklistSection({
  title,
  icon,
  items,
  selected,
  onToggle,
}: {
  title: string;
  icon: ReactNode;
  items: string[];
  selected: string[];
  onToggle: (item: string) => void;
}) {
  return (
    <Card title={title} icon={icon}>
      <div className="grid gap-3 md:grid-cols-2">
        {items.map((item) => (
          <ToggleCard key={item} label={item} selected={selected.includes(item)} onClick={() => onToggle(item)} />
        ))}
      </div>
    </Card>
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

"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { Check, Clock3, HeartHandshake, RefreshCw, Save, Sparkles, Trophy } from "lucide-react";
import { GhostButton } from "@/components/Prototype";
import { usePrototypeState } from "@/components/PrototypeState";

const moduleSlug = "life-after-sport";
const storageKey = "aggies-lead:senior:life-after-sport";

type IdentityReflection = {
  strengthsFromAthletics: string;
  proudOutsideSports: string;
  futureInterests: string;
  legacyBeyondAthletics: string;
};

type LifeAfterSportState = {
  identityReflection: IdentityReflection;
  routineChecklist: string[];
  finalReflection: string;
  moduleStatus: "Not Started" | "In Progress" | "Completed";
  progressPercentage: number;
};

const transferableSkills = [
  "Leadership",
  "Teamwork",
  "Time Management",
  "Communication",
  "Accountability",
  "Resilience",
  "Work Ethic",
  "Problem Solving",
];

const routineItems = [
  "Physical activity plan",
  "Career plan",
  "Professional network",
  "Personal goals",
  "Community involvement",
  "Wellness plan",
];

const storyCards = [
  { name: "Coming Soon", sport: "TBD", career: "TBD", story: "TBD" },
  { name: "Coming Soon", sport: "TBD", career: "TBD", story: "TBD" },
  { name: "Coming Soon", sport: "TBD", career: "TBD", story: "TBD" },
];

const initialState: LifeAfterSportState = {
  identityReflection: {
    strengthsFromAthletics: "",
    proudOutsideSports: "",
    futureInterests: "",
    legacyBeyondAthletics: "",
  },
  routineChecklist: [],
  finalReflection: "",
  moduleStatus: "Not Started",
  progressPercentage: 0,
};

export function LifeAfterSportClient() {
  const { completeModule } = usePrototypeState();
  const [form, setForm] = useState<LifeAfterSportState>(initialState);
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

  const identityStarted = Object.values(form.identityReflection).some((value) => value.trim().length > 0);
  const routineStarted = form.routineChecklist.length > 0;
  const reflectionStarted = form.finalReflection.trim().length > 0;

  const completion = useMemo(() => {
    const tasks = [
      true,
      identityStarted,
      true,
      routineStarted,
      true,
      reflectionStarted,
      form.moduleStatus === "Completed",
    ];
    const completed = tasks.filter(Boolean).length;
    const percent = form.moduleStatus === "Completed" ? 100 : Math.round((completed / tasks.length) * 100);
    return { completed, total: tasks.length, percent };
  }, [form.moduleStatus, identityStarted, reflectionStarted, routineStarted]);

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
    const completedForm: LifeAfterSportState = {
      ...form,
      moduleStatus: "Completed",
      progressPercentage: 100,
    };
    setForm(completedForm);
    persist(completedForm, "Life After Sport completed.");
    completeModule(moduleSlug);
  };

  const updateReflection = (field: keyof IdentityReflection, value: string) => {
    setForm((current) => ({
      ...current,
      identityReflection: { ...current.identityReflection, [field]: value },
    }));
  };

  const toggleRoutineItem = (item: string) => {
    setForm((current) => ({
      ...current,
      routineChecklist: current.routineChecklist.includes(item)
        ? current.routineChecklist.filter((selected) => selected !== item)
        : [...current.routineChecklist, item],
    }));
  };

  return (
    <div className="space-y-6">
      <GhostButton href="/roadmaps/senior">Back to Senior Roadmap</GhostButton>

      <section className="card-surface rounded-lg p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-aggie-silver">Senior Roadmap</p>
            <h1 className="text-glow mt-3 text-4xl font-black tracking-tight text-white">Life After Sport</h1>
            <p className="mt-4 max-w-3xl leading-7 text-aggie-light/76">
              For many student-athletes, graduation marks the end of competitive athletics. While this transition can be
              exciting, it can also bring challenges. This module is designed to help student-athletes prepare for life
              after competition and embrace their next chapter with confidence.
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
          <Card title="Understanding the Transition" icon={<HeartHandshake className="h-6 w-6 text-aggie-ice" />}>
            <p className="leading-7 text-aggie-light/76">
              Many student-athletes experience a significant life transition after their playing career ends. It is
              normal to experience excitement, uncertainty, loss, motivation, and new opportunities all at the same time.
            </p>
          </Card>

          <Card title="Your Identity Beyond Athletics" icon={<Sparkles className="h-6 w-6 text-aggie-ice" />}>
            <div className="grid gap-4 md:grid-cols-2">
              <TextArea
                label="What strengths have athletics given you?"
                value={form.identityReflection.strengthsFromAthletics}
                onChange={(value) => updateReflection("strengthsFromAthletics", value)}
              />
              <TextArea
                label="What are you most proud of outside of sports?"
                value={form.identityReflection.proudOutsideSports}
                onChange={(value) => updateReflection("proudOutsideSports", value)}
              />
              <TextArea
                label="What interests would you like to pursue after athletics?"
                value={form.identityReflection.futureInterests}
                onChange={(value) => updateReflection("futureInterests", value)}
              />
              <TextArea
                label="How do you want to be remembered beyond your athletic accomplishments?"
                value={form.identityReflection.legacyBeyondAthletics}
                onChange={(value) => updateReflection("legacyBeyondAthletics", value)}
              />
            </div>
          </Card>

          <Card title="Transferable Skills" icon={<Trophy className="h-6 w-6 text-aggie-ice" />}>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {transferableSkills.map((skill) => (
                <div key={skill} className="rounded-lg border border-white/10 bg-white/6 p-4">
                  <p className="font-black text-white">{skill}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Building Your Next Routine" icon={<Check className="h-6 w-6 text-aggie-ice" />}>
            <div className="grid gap-3 md:grid-cols-2">
              {routineItems.map((item) => (
                <ToggleCard
                  key={item}
                  label={item}
                  selected={form.routineChecklist.includes(item)}
                  onClick={() => toggleRoutineItem(item)}
                />
              ))}
            </div>
          </Card>

          <Card title="Former Student-Athlete Stories" icon={<HeartHandshake className="h-6 w-6 text-aggie-ice" />}>
            <div className="grid gap-4 lg:grid-cols-3">
              {storyCards.map((story, index) => (
                <article key={index} className="rounded-lg border border-white/10 bg-white/6 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-aggie-muted">Name</p>
                  <h3 className="mt-1 text-xl font-black text-white">{story.name}</h3>
                  <dl className="mt-4 space-y-3 text-sm">
                    <InfoRow label="Former Sport" value={story.sport} />
                    <InfoRow label="Current Career" value={story.career} />
                    <InfoRow label="Story" value={story.story} />
                  </dl>
                </article>
              ))}
            </div>
          </Card>

          <Card title="Reflection" icon={<Sparkles className="h-6 w-6 text-aggie-ice" />}>
            <TextArea
              label="What does success look like for you after athletics?"
              value={form.finalReflection}
              onChange={(value) => setForm((current) => ({ ...current, finalReflection: value }))}
            />
            <button
              type="button"
              onClick={markComplete}
              className="mt-4 rounded-lg bg-aggie-ice px-4 py-3 text-sm font-black text-aggie-navy transition hover:bg-white"
            >
              Life After Sport Completed
            </button>
            {form.moduleStatus === "Completed" ? (
              <p className="mt-4 rounded-lg border border-aggie-ice/30 bg-aggie-ice/10 p-4 text-sm font-semibold text-aggie-light">
                Great work. You have reflected on your transition and your next chapter beyond athletics.
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

          <Card title="Transition Snapshot">
            <div className="space-y-3">
              <Snapshot label="Identity Reflection" value={identityStarted ? "Started" : "Not Started"} />
              <Snapshot label="Routine Items" value={`${form.routineChecklist.length}/${routineItems.length}`} />
              <Snapshot label="Final Reflection" value={reflectionStarted ? "Started" : "Not Started"} />
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

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-bold text-aggie-muted">{label}</dt>
      <dd className="mt-1 font-semibold text-aggie-light">{value}</dd>
    </div>
  );
}

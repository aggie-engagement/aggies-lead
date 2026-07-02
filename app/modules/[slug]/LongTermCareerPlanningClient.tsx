"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { Check, Clock3, Compass, RefreshCw, Save, Sparkles, Target, Users } from "lucide-react";
import { GhostButton } from "@/components/Prototype";
import { usePrototypeState } from "@/components/PrototypeState";

const moduleSlug = "long-term-career-planning";
const storageKey = "aggies-lead:graduate:long-term-career-planning";

type CareerVision = {
  fiveYears: string;
  tenYears: string;
  careerImpact: string;
  motivation: string;
};

type LongTermGoals = {
  fiveYearCareerGoal: string;
  tenYearCareerGoal: string;
  dreamPosition: string;
  dreamOrganization: string;
  dreamIndustry: string;
  preferredGeographicLocation: string;
};

type GrowthPlan = {
  skillsToDevelop: string;
  certificationsToEarn: string;
  organizationsToJoin: string;
  leadershipOpportunities: string;
  networkingGoals: string;
};

type DevelopmentRoadmap = {
  next12Months: string;
  next3Years: string;
  next5Years: string;
};

type MentorshipPlan = {
  potentialMentor: string;
  industry: string;
  supportMyGrowth: string;
};

type LongTermCareerPlanningState = {
  careerVision: CareerVision;
  longTermGoals: LongTermGoals;
  growthPlan: GrowthPlan;
  developmentRoadmap: DevelopmentRoadmap;
  workLifeChecklist: string[];
  mentorshipPlan: MentorshipPlan;
  careerLegacyReflection: string;
  moduleStatus: "Not Started" | "In Progress" | "Completed";
  progressPercentage: number;
};

const workLifeItems = [
  "Career Goals Identified",
  "Financial Goals Identified",
  "Health & Wellness Goals Identified",
  "Personal Goals Identified",
  "Community Involvement Goals Identified",
];

const initialState: LongTermCareerPlanningState = {
  careerVision: {
    fiveYears: "",
    tenYears: "",
    careerImpact: "",
    motivation: "",
  },
  longTermGoals: {
    fiveYearCareerGoal: "",
    tenYearCareerGoal: "",
    dreamPosition: "",
    dreamOrganization: "",
    dreamIndustry: "",
    preferredGeographicLocation: "",
  },
  growthPlan: {
    skillsToDevelop: "",
    certificationsToEarn: "",
    organizationsToJoin: "",
    leadershipOpportunities: "",
    networkingGoals: "",
  },
  developmentRoadmap: {
    next12Months: "",
    next3Years: "",
    next5Years: "",
  },
  workLifeChecklist: [],
  mentorshipPlan: {
    potentialMentor: "",
    industry: "",
    supportMyGrowth: "",
  },
  careerLegacyReflection: "",
  moduleStatus: "Not Started",
  progressPercentage: 0,
};

export function LongTermCareerPlanningClient() {
  const { completeModule } = usePrototypeState();
  const [form, setForm] = useState<LongTermCareerPlanningState>(initialState);
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

  const careerVisionStarted = Object.values(form.careerVision).some((value) => value.trim().length > 0);
  const longTermGoalsStarted = Object.values(form.longTermGoals).some((value) => value.trim().length > 0);
  const growthPlanStarted = Object.values(form.growthPlan).some((value) => value.trim().length > 0);
  const roadmapStarted = Object.values(form.developmentRoadmap).some((value) => value.trim().length > 0);
  const mentorshipStarted = Object.values(form.mentorshipPlan).some((value) => value.trim().length > 0);
  const legacyStarted = form.careerLegacyReflection.trim().length > 0;

  const completion = useMemo(() => {
    const tasks = [
      careerVisionStarted,
      longTermGoalsStarted,
      growthPlanStarted,
      roadmapStarted,
      form.workLifeChecklist.length > 0,
      mentorshipStarted,
      legacyStarted,
      form.moduleStatus === "Completed",
    ];
    const completed = tasks.filter(Boolean).length;
    const percent = form.moduleStatus === "Completed" ? 100 : Math.round((completed / tasks.length) * 100);
    return { completed, total: tasks.length, percent };
  }, [
    careerVisionStarted,
    form.moduleStatus,
    form.workLifeChecklist.length,
    growthPlanStarted,
    legacyStarted,
    longTermGoalsStarted,
    mentorshipStarted,
    roadmapStarted,
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
    const completedForm: LongTermCareerPlanningState = {
      ...form,
      moduleStatus: "Completed",
      progressPercentage: 100,
    };
    setForm(completedForm);
    persist(completedForm, "Long-Term Career Planning completed.");
    completeModule(moduleSlug);
  };

  const updateCareerVision = (field: keyof CareerVision, value: string) => {
    setForm((current) => ({ ...current, careerVision: { ...current.careerVision, [field]: value } }));
  };

  const updateLongTermGoals = (field: keyof LongTermGoals, value: string) => {
    setForm((current) => ({ ...current, longTermGoals: { ...current.longTermGoals, [field]: value } }));
  };

  const updateGrowthPlan = (field: keyof GrowthPlan, value: string) => {
    setForm((current) => ({ ...current, growthPlan: { ...current.growthPlan, [field]: value } }));
  };

  const updateRoadmap = (field: keyof DevelopmentRoadmap, value: string) => {
    setForm((current) => ({ ...current, developmentRoadmap: { ...current.developmentRoadmap, [field]: value } }));
  };

  const updateMentorship = (field: keyof MentorshipPlan, value: string) => {
    setForm((current) => ({ ...current, mentorshipPlan: { ...current.mentorshipPlan, [field]: value } }));
  };

  const toggleWorkLifeItem = (item: string) => {
    setForm((current) => ({
      ...current,
      workLifeChecklist: current.workLifeChecklist.includes(item)
        ? current.workLifeChecklist.filter((selected) => selected !== item)
        : [...current.workLifeChecklist, item],
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
              Long-Term Career Planning
            </h1>
            <p className="mt-4 max-w-3xl leading-7 text-aggie-light/76">
              While securing your first opportunity after Utah State is important, long-term career success requires
              intentional planning. This module helps student-athletes identify long-term goals and create a roadmap for
              future growth.
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
          <Card title="Career Vision" icon={<Compass className="h-6 w-6 text-aggie-ice" />}>
            <div className="grid gap-4 md:grid-cols-2">
              <TextArea
                label="Where do you hope to be professionally in 5 years?"
                value={form.careerVision.fiveYears}
                onChange={(value) => updateCareerVision("fiveYears", value)}
              />
              <TextArea
                label="Where do you hope to be professionally in 10 years?"
                value={form.careerVision.tenYears}
                onChange={(value) => updateCareerVision("tenYears", value)}
              />
              <TextArea
                label="What type of impact do you want to make in your career?"
                value={form.careerVision.careerImpact}
                onChange={(value) => updateCareerVision("careerImpact", value)}
              />
              <TextArea
                label="What motivates you most?"
                value={form.careerVision.motivation}
                onChange={(value) => updateCareerVision("motivation", value)}
              />
            </div>
          </Card>

          <Card title="My Long-Term Goals" icon={<Target className="h-6 w-6 text-aggie-ice" />}>
            <div className="grid gap-4 md:grid-cols-2">
              <TextInput label="5-Year Career Goal" value={form.longTermGoals.fiveYearCareerGoal} onChange={(value) => updateLongTermGoals("fiveYearCareerGoal", value)} />
              <TextInput label="10-Year Career Goal" value={form.longTermGoals.tenYearCareerGoal} onChange={(value) => updateLongTermGoals("tenYearCareerGoal", value)} />
              <TextInput label="Dream Position" value={form.longTermGoals.dreamPosition} onChange={(value) => updateLongTermGoals("dreamPosition", value)} />
              <TextInput label="Dream Organization" value={form.longTermGoals.dreamOrganization} onChange={(value) => updateLongTermGoals("dreamOrganization", value)} />
              <TextInput label="Dream Industry" value={form.longTermGoals.dreamIndustry} onChange={(value) => updateLongTermGoals("dreamIndustry", value)} />
              <TextInput label="Preferred Geographic Location" value={form.longTermGoals.preferredGeographicLocation} onChange={(value) => updateLongTermGoals("preferredGeographicLocation", value)} />
            </div>
          </Card>

          <Card title="Career Growth Plan" icon={<Sparkles className="h-6 w-6 text-aggie-ice" />}>
            <div className="grid gap-4 md:grid-cols-2">
              <TextArea label="Skills to Develop" value={form.growthPlan.skillsToDevelop} onChange={(value) => updateGrowthPlan("skillsToDevelop", value)} />
              <TextArea label="Certifications to Earn" value={form.growthPlan.certificationsToEarn} onChange={(value) => updateGrowthPlan("certificationsToEarn", value)} />
              <TextArea label="Professional Organizations to Join" value={form.growthPlan.organizationsToJoin} onChange={(value) => updateGrowthPlan("organizationsToJoin", value)} />
              <TextArea label="Leadership Opportunities to Pursue" value={form.growthPlan.leadershipOpportunities} onChange={(value) => updateGrowthPlan("leadershipOpportunities", value)} />
              <TextArea label="Networking Goals" value={form.growthPlan.networkingGoals} onChange={(value) => updateGrowthPlan("networkingGoals", value)} />
            </div>
          </Card>

          <Card title="Professional Development Roadmap" icon={<Compass className="h-6 w-6 text-aggie-ice" />}>
            <div className="grid gap-4 lg:grid-cols-3">
              <TextArea label="Next 12 Months" value={form.developmentRoadmap.next12Months} onChange={(value) => updateRoadmap("next12Months", value)} />
              <TextArea label="Next 3 Years" value={form.developmentRoadmap.next3Years} onChange={(value) => updateRoadmap("next3Years", value)} />
              <TextArea label="Next 5 Years" value={form.developmentRoadmap.next5Years} onChange={(value) => updateRoadmap("next5Years", value)} />
            </div>
          </Card>

          <Card title="Work-Life Success" icon={<Check className="h-6 w-6 text-aggie-ice" />}>
            <div className="grid gap-3 md:grid-cols-2">
              {workLifeItems.map((item) => (
                <ToggleCard
                  key={item}
                  label={item}
                  selected={form.workLifeChecklist.includes(item)}
                  onClick={() => toggleWorkLifeItem(item)}
                />
              ))}
            </div>
          </Card>

          <Card title="Future Mentorship Plan" icon={<Users className="h-6 w-6 text-aggie-ice" />}>
            <div className="grid gap-4 md:grid-cols-3">
              <TextInput label="Potential Mentor" value={form.mentorshipPlan.potentialMentor} onChange={(value) => updateMentorship("potentialMentor", value)} />
              <TextInput label="Industry" value={form.mentorshipPlan.industry} onChange={(value) => updateMentorship("industry", value)} />
              <TextArea label="How They Can Support My Growth" value={form.mentorshipPlan.supportMyGrowth} onChange={(value) => updateMentorship("supportMyGrowth", value)} />
            </div>
          </Card>

          <Card title="Career Legacy Reflection" icon={<Sparkles className="h-6 w-6 text-aggie-ice" />}>
            <TextArea
              label="What do you want to be known for professionally?"
              value={form.careerLegacyReflection}
              onChange={(value) => setForm((current) => ({ ...current, careerLegacyReflection: value }))}
            />
            <button
              type="button"
              onClick={markComplete}
              className="mt-4 rounded-lg bg-aggie-ice px-4 py-3 text-sm font-black text-aggie-navy transition hover:bg-white"
            >
              Long-Term Career Planning Completed
            </button>
            {form.moduleStatus === "Completed" ? (
              <p className="mt-4 rounded-lg border border-aggie-ice/30 bg-aggie-ice/10 p-4 text-sm font-semibold text-aggie-light">
                Great work. You have started building a long-term roadmap for professional growth.
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

          <Card title="Planning Snapshot">
            <div className="space-y-3">
              <Snapshot label="Career Vision" value={careerVisionStarted ? "Started" : "Not Started"} />
              <Snapshot label="Long-Term Goals" value={longTermGoalsStarted ? "Started" : "Not Started"} />
              <Snapshot label="Growth Plan" value={growthPlanStarted ? "Started" : "Not Started"} />
              <Snapshot label="Work-Life Goals" value={`${form.workLifeChecklist.length}/${workLifeItems.length}`} />
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

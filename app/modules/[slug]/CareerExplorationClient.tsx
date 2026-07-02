"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  BriefcaseBusiness,
  CalendarDays,
  Check,
  CheckCircle2,
  GraduationCap,
  MessageSquareText,
  Plus,
  RotateCcw,
  Save,
  Sparkles,
  Timer,
  Trash2,
  UsersRound,
} from "lucide-react";
import { GhostButton } from "@/components/Prototype";
import { nextFreshmanModuleHref } from "@/lib/roadmaps";

const storageKey = "aggies-lead:freshman:career-exploration";

const strengths = [
  "Communication",
  "Leadership",
  "Creativity",
  "Problem Solving",
  "Organization",
  "Discipline",
  "Adaptability",
  "Teamwork",
  "Work Ethic",
  "Competitive Mindset",
];

const values = [
  "Financial Stability",
  "Work-Life Balance",
  "Helping Others",
  "Competition",
  "Creativity",
  "Leadership",
  "Flexibility",
  "Job Security",
  "Impact",
  "Growth Opportunities",
];

const athleteSkills = [
  "Leadership",
  "Communication",
  "Time Management",
  "Adaptability",
  "Teamwork",
  "Resilience",
  "Accountability",
  "Problem Solving",
  "Coachability",
  "Performing Under Pressure",
];

const careerClusters = [
  "Business & Entrepreneurship",
  "Health & Human Performance",
  "Education & Service",
  "Technology",
  "Creative & Media",
  "Science & Engineering",
  "Law, Policy & Leadership",
];

const interviewPeople = [
  "Former Student-Athlete",
  "Coach",
  "Professor",
  "Academic Advisor",
  "Career Services Staff",
  "Professional in a Field of Interest",
];

const alumniSpotlights = [
  {
    id: "soccer-medical-sales",
    athlete: "Soccer",
    career: "Medical Sales",
    major: "Kinesiology",
    advice: "Start networking earlier than you think.",
  },
  {
    id: "football-financial-advisor",
    athlete: "Football",
    career: "Financial Advisor",
    major: "Business",
    advice: "Your discipline as an athlete can separate you professionally.",
  },
  {
    id: "track-sports-marketing",
    athlete: "Track & Field",
    career: "Sports Marketing Coordinator",
    major: "Communications",
    advice: "Take advantage of every internship and connection you can.",
  },
];

const majorPathways = [
  {
    major: "Business",
    careers: ["Marketing", "Sales", "HR", "Operations", "Entrepreneurship", "Finance"],
  },
  {
    major: "Kinesiology",
    careers: ["Physical Therapy", "Athletic Training", "Medical Device Sales", "Coaching", "Strength & Conditioning"],
  },
  {
    major: "Communications",
    careers: ["Media", "Public Relations", "Marketing", "Broadcasting", "Recruiting"],
  },
  {
    major: "Psychology",
    careers: ["Counseling", "HR", "Coaching", "Social Work", "Student-Athlete Development"],
  },
  {
    major: "Biology",
    careers: ["Healthcare", "Research", "Lab Sciences", "Physician Assistant", "Public Health"],
  },
  {
    major: "Exercise Science",
    careers: ["Strength & Conditioning", "Physical Therapy", "Wellness Coaching", "Sports Performance"],
  },
];

const ratingOptions = ["Very Interested", "Interested", "Maybe", "Not Interested"] as const;
const learnMoreOptions = ["Yes", "No", "Maybe"] as const;

type Rating = (typeof ratingOptions)[number];
type LearnMore = (typeof learnMoreOptions)[number];

type CareerResearch = {
  id: string;
  careerName: string;
  description: string;
  education: string;
  skills: string;
  pros: string;
  cons: string;
  salary: string;
  learnMore: LearnMore | "";
};

type AlumniResponse = {
  interested: boolean;
  connect: boolean;
};

type CareerExplorationState = {
  overviewReviewed: boolean;
  careerClarity: number;
  topics: string;
  subjects: string;
  activities: string;
  strengths: string[];
  values: string[];
  motivation: string;
  environment: string;
  success: string;
  athleteSkills: string[];
  skillStory: string;
  clusterRatings: Record<string, Rating | "">;
  careerResearch: CareerResearch[];
  alumniResponses: Record<string, AlumniResponse>;
  alumniReflection: string;
  interviewTargets: string[];
  contactName: string;
  contactIndustry: string;
  contactQuestion: string;
  reachOutDate: string;
  informationalInterviewCompleted: boolean;
  interviewLearning: string;
  interviewSurprise: string;
  interviewInterestChange: string;
  consideredMajor: string;
  majorCareerConnections: string;
};

const emptyCareerResearch = (index: number): CareerResearch => ({
  id: `career-${index}`,
  careerName: "",
  description: "",
  education: "",
  skills: "",
  pros: "",
  cons: "",
  salary: "",
  learnMore: "",
});

const initialAlumniResponses = Object.fromEntries(
  alumniSpotlights.map((alumni) => [alumni.id, { interested: false, connect: false }]),
);

const initialState: CareerExplorationState = {
  overviewReviewed: false,
  careerClarity: 4,
  topics: "",
  subjects: "",
  activities: "",
  strengths: [],
  values: [],
  motivation: "",
  environment: "",
  success: "",
  athleteSkills: [],
  skillStory: "",
  clusterRatings: Object.fromEntries(careerClusters.map((cluster) => [cluster, ""])),
  careerResearch: [emptyCareerResearch(1), emptyCareerResearch(2)],
  alumniResponses: initialAlumniResponses,
  alumniReflection: "",
  interviewTargets: [],
  contactName: "",
  contactIndustry: "",
  contactQuestion: "",
  reachOutDate: "",
  informationalInterviewCompleted: false,
  interviewLearning: "",
  interviewSurprise: "",
  interviewInterestChange: "",
  consideredMajor: "",
  majorCareerConnections: "",
};

export function CareerExplorationClient() {
  const [form, setForm] = useState<CareerExplorationState>(initialState);
  const [loaded, setLoaded] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (saved) {
      try {
        setForm(normalizeSavedState(JSON.parse(saved)));
      } catch {
        setForm(initialState);
      }
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    window.localStorage.setItem(storageKey, JSON.stringify(form));
  }, [form, loaded]);

  const completion = useMemo(() => {
    const whoAmIComplete =
      [form.topics, form.subjects, form.activities, form.motivation, form.environment, form.success].every(
        (value) => value.trim().length > 0,
      ) &&
      form.strengths.length > 0 &&
      form.values.length > 0;
    const athleteIdentityComplete = form.athleteSkills.length > 0 && form.skillStory.trim().length > 0;
    const clustersComplete = careerClusters.every((cluster) => form.clusterRatings[cluster]);
    const careerResearchComplete = form.careerResearch
      .slice(0, 2)
      .every((career) =>
        [
          career.careerName,
          career.description,
          career.education,
          career.skills,
          career.pros,
          career.cons,
          career.salary,
          career.learnMore,
        ].every((value) => value.trim().length > 0),
      );
    const alumniComplete =
      Object.values(form.alumniResponses).some((response) => response.interested || response.connect) &&
      form.alumniReflection.trim().length > 0;
    const interviewComplete =
      form.interviewTargets.length > 0 &&
      [form.contactName, form.contactIndustry, form.contactQuestion, form.reachOutDate].every(
        (value) => value.trim().length > 0,
      ) &&
      (!form.informationalInterviewCompleted ||
        [form.interviewLearning, form.interviewSurprise, form.interviewInterestChange].every(
          (value) => value.trim().length > 0,
        ));
    const majorAlignmentComplete =
      form.consideredMajor.trim().length > 0 && form.majorCareerConnections.trim().length > 0;

    const sections = [
      form.overviewReviewed,
      whoAmIComplete,
      athleteIdentityComplete,
      clustersComplete,
      careerResearchComplete,
      alumniComplete,
      interviewComplete,
      majorAlignmentComplete,
    ];
    const completed = sections.filter(Boolean).length;

    return {
      completed,
      total: sections.length,
      percent: Math.round((completed / sections.length) * 100),
    };
  }, [form]);

  const status =
    completion.percent === 100 ? "Completed" : completion.percent === 0 ? "Not Started" : "In Progress";
  const nextHref = nextFreshmanModuleHref("career-exploration");

  function updateField<Key extends keyof CareerExplorationState>(key: Key, value: CareerExplorationState[Key]) {
    setForm((current) => ({ ...current, [key]: value }));
    setSavedMessage("");
  }

  function toggleItem(key: "strengths" | "values" | "athleteSkills" | "interviewTargets", item: string) {
    setForm((current) => {
      const list = current[key];
      return {
        ...current,
        [key]: list.includes(item) ? list.filter((value) => value !== item) : [...list, item],
      };
    });
    setSavedMessage("");
  }

  function updateCareer(index: number, key: keyof CareerResearch, value: string) {
    setForm((current) => ({
      ...current,
      careerResearch: current.careerResearch.map((career, careerIndex) =>
        careerIndex === index ? { ...career, [key]: value } : career,
      ),
    }));
    setSavedMessage("");
  }

  function addCareer() {
    setForm((current) => {
      if (current.careerResearch.length >= 3) return current;
      return {
        ...current,
        careerResearch: [...current.careerResearch, emptyCareerResearch(current.careerResearch.length + 1)],
      };
    });
    setSavedMessage("");
  }

  function removeCareer(index: number) {
    setForm((current) => {
      if (current.careerResearch.length <= 2) return current;
      return {
        ...current,
        careerResearch: current.careerResearch.filter((_, careerIndex) => careerIndex !== index),
      };
    });
    setSavedMessage("");
  }

  function updateAlumniResponse(id: string, key: keyof AlumniResponse, value: boolean) {
    setForm((current) => ({
      ...current,
      alumniResponses: {
        ...current.alumniResponses,
        [id]: {
          ...current.alumniResponses[id],
          [key]: value,
        },
      },
    }));
    setSavedMessage("");
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

  return (
    <div className="space-y-6">
      <GhostButton href="/roadmaps/freshman">Back to Freshman Roadmap</GhostButton>

      <section className="card-surface rounded-lg p-6 md:p-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-aggie-silver">
              Freshman Roadmap
            </p>
            <h1 className="text-glow mt-3 text-4xl font-black tracking-tight text-white md:text-5xl">
              Career Exploration
            </h1>
            <p className="mt-4 text-lg leading-8 text-aggie-light/78">
              Explore who you are, what you value, and how your athletic experience connects to
              future career paths.
            </p>
            <p className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-aggie-muted">
              <Timer className="h-4 w-4" />
              Estimated Time: 20-30 minutes
            </p>
          </div>
          <ProgressPanel completed={completion.completed} percent={completion.percent} status={status} total={completion.total} />
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <Card title="Module Overview" icon={<Sparkles className="h-6 w-6" />}>
          <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-aggie-silver/15 bg-white/[0.045] p-4 text-sm font-bold text-aggie-light/86">
            <input
              type="checkbox"
              checked={form.overviewReviewed}
              onChange={(event) => updateField("overviewReviewed", event.target.checked)}
              className="h-5 w-5 accent-aggie-steel"
            />
            I reviewed the purpose of this module.
          </label>

          <label className="mt-5 block">
            <span className="flex items-center justify-between gap-4 text-sm font-black text-white">
              Career clarity
              <span className="text-aggie-ice">{form.careerClarity}/10</span>
            </span>
            <input
              type="range"
              min="1"
              max="10"
              value={form.careerClarity}
              onChange={(event) => updateField("careerClarity", Number(event.target.value))}
              className="mt-3 w-full accent-aggie-steel"
            />
          </label>
        </Card>

        <Card title="Quick Actions" icon={<Save className="h-6 w-6" />}>
          <p className="leading-7 text-aggie-light/74">
            Your answers load from this browser automatically. Use these buttons when you want to
            lock in progress or start fresh.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row xl:flex-col">
            <button
              type="button"
              onClick={saveProgress}
              className="chrome-surface inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-aggie-chrome/60 px-5 text-sm font-black text-aggie-navy shadow-glow transition hover:brightness-110"
            >
              <Save className="h-4 w-4" />
              Save Progress
            </button>
            <button
              type="button"
              onClick={resetModule}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-aggie-silver/25 px-5 text-sm font-bold text-white transition hover:border-aggie-steel hover:bg-white/10"
            >
              <RotateCcw className="h-4 w-4" />
              Reset Module
            </button>
          </div>
          {savedMessage && <p className="mt-4 text-sm font-bold text-aggie-ice">{savedMessage}</p>}
        </Card>
      </section>

      <Card title="Who Am I?" icon={<CheckCircle2 className="h-6 w-6" />}>
        <div className="grid gap-4 lg:grid-cols-3">
          <TextArea label="What topics excite you?" value={form.topics} onChange={(value) => updateField("topics", value)} />
          <TextArea label="What classes or subjects do you enjoy?" value={form.subjects} onChange={(value) => updateField("subjects", value)} />
          <TextArea label="What activities do you enjoy outside of athletics?" value={form.activities} onChange={(value) => updateField("activities", value)} />
        </div>

        <ChoiceGroup className="mt-6" title="Strengths" options={strengths} selected={form.strengths} onToggle={(item) => toggleItem("strengths", item)} />
        <ChoiceGroup className="mt-6" title="Values" options={values} selected={form.values} onToggle={(item) => toggleItem("values", item)} />

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <TextArea label="What motivates you?" value={form.motivation} onChange={(value) => updateField("motivation", value)} />
          <TextArea label="What type of work environment sounds appealing?" value={form.environment} onChange={(value) => updateField("environment", value)} />
          <TextArea label="What would success look like 10 years from now?" value={form.success} onChange={(value) => updateField("success", value)} />
        </div>
      </Card>

      <Card title="Athlete Identity & Transferable Skills" icon={<BriefcaseBusiness className="h-6 w-6" />}>
        <ChoiceGroup title="Select skills you have developed through athletics" options={athleteSkills} selected={form.athleteSkills} onToggle={(item) => toggleItem("athleteSkills", item)} />
        <div className="mt-6">
          <TextArea label="Choose one skill and describe a time athletics helped you develop it." value={form.skillStory} onChange={(value) => updateField("skillStory", value)} />
        </div>
      </Card>

      <Card title="Explore Career Clusters" icon={<BriefcaseBusiness className="h-6 w-6" />}>
        <div className="grid gap-4 lg:grid-cols-2">
          {careerClusters.map((cluster) => (
            <div key={cluster} className="rounded-lg border border-aggie-silver/15 bg-white/[0.045] p-4">
              <h3 className="text-lg font-black text-white">{cluster}</h3>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {ratingOptions.map((rating) => {
                  const selected = form.clusterRatings[cluster] === rating;
                  return (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => updateField("clusterRatings", { ...form.clusterRatings, [cluster]: rating })}
                      className={`min-h-11 rounded-lg border px-3 text-sm font-bold transition ${
                        selected
                          ? "chrome-surface border-aggie-chrome/60 text-aggie-navy shadow-steel"
                          : "border-aggie-silver/20 text-aggie-light/78 hover:border-aggie-steel hover:bg-white/10"
                      }`}
                    >
                      {rating}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Career Research" icon={<BriefcaseBusiness className="h-6 w-6" />}>
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="leading-7 text-aggie-light/74">Research at least 2 careers. Add a third if another path catches your attention.</p>
          <button
            type="button"
            onClick={addCareer}
            disabled={form.careerResearch.length >= 3}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-aggie-silver/25 px-4 text-sm font-bold text-white transition hover:border-aggie-steel hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-45"
          >
            <Plus className="h-4 w-4" />
            Add Career
          </button>
        </div>
        <div className="grid gap-5">
          {form.careerResearch.map((career, index) => (
            <div key={career.id} className="rounded-lg border border-aggie-silver/15 bg-white/[0.045] p-4">
              <div className="mb-4 flex items-center justify-between gap-4">
                <h3 className="text-lg font-black text-white">Career {index + 1}</h3>
                {form.careerResearch.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeCareer(index)}
                    className="grid h-10 w-10 place-items-center rounded-lg border border-aggie-silver/20 text-aggie-light transition hover:border-aggie-steel hover:bg-white/10"
                    aria-label={`Remove career ${index + 1}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                <TextInput label="Career Name" value={career.careerName} onChange={(value) => updateCareer(index, "careerName", value)} />
                <TextInput label="Education required" value={career.education} onChange={(value) => updateCareer(index, "education", value)} />
                <TextArea label="What does this person do?" value={career.description} onChange={(value) => updateCareer(index, "description", value)} />
                <TextArea label="Skills needed" value={career.skills} onChange={(value) => updateCareer(index, "skills", value)} />
                <TextArea label="Pros" value={career.pros} onChange={(value) => updateCareer(index, "pros", value)} />
                <TextArea label="Cons" value={career.cons} onChange={(value) => updateCareer(index, "cons", value)} />
                <TextInput label="Salary/Earning Potential" value={career.salary} onChange={(value) => updateCareer(index, "salary", value)} />
                <RadioGroup
                  title="Would you like to learn more?"
                  options={learnMoreOptions}
                  selected={career.learnMore}
                  onSelect={(value) => updateCareer(index, "learnMore", value)}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Aggie Alumni Spotlight" icon={<UsersRound className="h-6 w-6" />}>
        <div className="grid gap-4 lg:grid-cols-3">
          {alumniSpotlights.map((alumni) => (
            <article key={alumni.id} className="rounded-lg border border-aggie-silver/15 bg-white/[0.045] p-5">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-aggie-silver">Former Athlete</p>
              <h3 className="mt-2 text-2xl font-black text-white">{alumni.athlete}</h3>
              <div className="mt-4 space-y-3 text-sm font-bold text-aggie-light/82">
                <p>Current Career: <span className="text-white">{alumni.career}</span></p>
                <p>Major: <span className="text-white">{alumni.major}</span></p>
                <p className="leading-6">Advice: <span className="text-white">{alumni.advice}</span></p>
              </div>
              <div className="mt-5 space-y-3">
                <CheckboxRow label="This career interests me" checked={form.alumniResponses[alumni.id]?.interested ?? false} onChange={(value) => updateAlumniResponse(alumni.id, "interested", value)} />
                <CheckboxRow label="I want to connect with someone like this" checked={form.alumniResponses[alumni.id]?.connect ?? false} onChange={(value) => updateAlumniResponse(alumni.id, "connect", value)} />
              </div>
            </article>
          ))}
        </div>
        <div className="mt-6">
          <TextArea label="What stood out most about one of these alumni stories?" value={form.alumniReflection} onChange={(value) => updateField("alumniReflection", value)} />
        </div>
      </Card>

      <Card title="Informational Interview Challenge" icon={<MessageSquareText className="h-6 w-6" />}>
        <ChoiceGroup title="Who could you interview?" options={interviewPeople} selected={form.interviewTargets} onToggle={(item) => toggleItem("interviewTargets", item)} />
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <TextInput label="Person I want to contact" value={form.contactName} onChange={(value) => updateField("contactName", value)} />
          <TextInput label="Industry/Career" value={form.contactIndustry} onChange={(value) => updateField("contactIndustry", value)} />
          <TextArea label="Question I want to ask" value={form.contactQuestion} onChange={(value) => updateField("contactQuestion", value)} />
          <label className="block">
            <span className="text-sm font-black text-white">Date I plan to reach out</span>
            <div className="relative mt-3">
              <CalendarDays className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-aggie-muted" />
              <input
                type="date"
                value={form.reachOutDate}
                onChange={(event) => updateField("reachOutDate", event.target.value)}
                className="min-h-12 w-full rounded-lg border border-aggie-silver/15 bg-aggie-navy/78 pl-11 pr-4 text-sm text-white outline-none transition focus:border-aggie-steel"
              />
            </div>
          </label>
        </div>
        <div className="mt-6">
          <CheckboxRow
            label="I completed an informational interview"
            checked={form.informationalInterviewCompleted}
            onChange={(value) => updateField("informationalInterviewCompleted", value)}
          />
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <TextArea label="What did you learn?" value={form.interviewLearning} onChange={(value) => updateField("interviewLearning", value)} />
          <TextArea label="What surprised you?" value={form.interviewSurprise} onChange={(value) => updateField("interviewSurprise", value)} />
          <TextArea label="Did this career become more or less interesting?" value={form.interviewInterestChange} onChange={(value) => updateField("interviewInterestChange", value)} />
        </div>
      </Card>

      <Card title="Major & Career Alignment" icon={<GraduationCap className="h-6 w-6" />}>
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {majorPathways.map((pathway) => (
            <article key={pathway.major} className="rounded-lg border border-aggie-silver/15 bg-white/[0.045] p-5">
              <h3 className="text-xl font-black text-white">{pathway.major}</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {pathway.careers.map((career) => (
                  <span key={career} className="rounded-lg border border-aggie-silver/15 bg-aggie-navy/60 px-3 py-2 text-sm font-bold text-aggie-light/82">
                    {career}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <TextInput label="What major are you considering?" value={form.consideredMajor} onChange={(value) => updateField("consideredMajor", value)} />
          <TextArea label="What careers could connect to that major?" value={form.majorCareerConnections} onChange={(value) => updateField("majorCareerConnections", value)} />
        </div>
      </Card>

      <section className="card-surface rounded-lg p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-aggie-silver">
              Module Progress
            </p>
            <h2 className="mt-2 text-2xl font-black text-white">{status}</h2>
            <p className="mt-2 leading-7 text-aggie-light/74">
              Complete each section to finish Career Exploration.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/roadmaps/freshman"
              className="inline-flex min-h-12 items-center justify-center rounded-lg border border-aggie-silver/25 px-5 text-sm font-bold text-white transition hover:border-aggie-steel hover:bg-white/10"
            >
              Back to Roadmap
            </Link>
            <Link
              href={nextHref}
              className="inline-flex min-h-12 items-center justify-center rounded-lg border border-aggie-silver/25 px-5 text-sm font-bold text-white transition hover:border-aggie-steel hover:bg-white/10"
            >
              Next Module
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function normalizeSavedState(saved: Partial<CareerExplorationState>): CareerExplorationState {
  return {
    ...initialState,
    ...saved,
    clusterRatings: { ...initialState.clusterRatings, ...saved.clusterRatings },
    alumniResponses: { ...initialState.alumniResponses, ...saved.alumniResponses },
    careerResearch:
      saved.careerResearch && saved.careerResearch.length >= 2
        ? saved.careerResearch.slice(0, 3).map((career, index) => ({
            ...emptyCareerResearch(index + 1),
            ...career,
            id: career.id || `career-${index + 1}`,
          }))
        : initialState.careerResearch,
  };
}

function ProgressPanel({
  completed,
  percent,
  status,
  total,
}: {
  completed: number;
  percent: number;
  status: string;
  total: number;
}) {
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
        {completed} of {total} sections complete
      </p>
    </div>
  );
}

function Card({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
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

function TextInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-black text-white">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-3 min-h-12 w-full rounded-lg border border-aggie-silver/15 bg-aggie-navy/78 px-4 text-sm text-white outline-none transition placeholder:text-aggie-muted focus:border-aggie-steel"
        placeholder="Enter response..."
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-black text-white">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        className="mt-3 min-h-28 w-full resize-y rounded-lg border border-aggie-silver/15 bg-aggie-navy/78 p-4 text-sm leading-6 text-white outline-none transition placeholder:text-aggie-muted focus:border-aggie-steel"
        placeholder="Write your response..."
      />
    </label>
  );
}

function CheckboxRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-aggie-silver/15 bg-white/[0.045] p-4 text-sm font-bold text-aggie-light/86">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-5 w-5 accent-aggie-steel"
      />
      {label}
    </label>
  );
}

function RadioGroup<Option extends string>({
  title,
  options,
  selected,
  onSelect,
}: {
  title: string;
  options: readonly Option[];
  selected: Option | "";
  onSelect: (value: Option) => void;
}) {
  return (
    <div>
      <h3 className="text-sm font-black text-white">{title}</h3>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        {options.map((option) => {
          const active = selected === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onSelect(option)}
              className={`min-h-11 rounded-lg border px-3 text-sm font-bold transition ${
                active
                  ? "chrome-surface border-aggie-chrome/60 text-aggie-navy shadow-steel"
                  : "border-aggie-silver/20 text-aggie-light/78 hover:border-aggie-steel hover:bg-white/10"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ChoiceGroup({
  title,
  options,
  selected,
  onToggle,
  className = "",
}: {
  title: string;
  options: string[];
  selected: string[];
  onToggle: (item: string) => void;
  className?: string;
}) {
  return (
    <div className={className}>
      <h3 className="text-sm font-black uppercase tracking-[0.18em] text-aggie-silver">{title}</h3>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {options.map((option) => {
          const active = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => onToggle(option)}
              className={`flex min-h-12 items-center gap-3 rounded-lg border px-3 text-left text-sm font-bold transition ${
                active
                  ? "border-aggie-chrome/50 bg-white/[0.09] text-white"
                  : "border-aggie-silver/15 bg-white/[0.045] text-aggie-light/78 hover:border-aggie-steel hover:bg-white/10"
              }`}
            >
              <span
                className={`grid h-6 w-6 shrink-0 place-items-center rounded-md ${
                  active ? "chrome-surface text-aggie-navy" : "border border-aggie-silver/20 text-transparent"
                }`}
              >
                {active && <Check className="h-4 w-4" />}
              </span>
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

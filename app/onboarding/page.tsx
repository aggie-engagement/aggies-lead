"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, ChevronDown, UserRound } from "lucide-react";
import { usePrototypeState } from "@/components/PrototypeState";

const sports = [
  "Football",
  "Women's Gymnastics",
  "Men's Basketball",
  "Women's Basketball",
  "Men's Tennis",
  "Women's Tennis",
  "Men's Golf",
  "Women's Soccer",
  "Softball",
  "Track & Field",
  "Cross Country",
  "Volleyball",
];

const schoolYears = ["Freshman", "Sophomore", "Junior", "Senior", "Fifth Year / Graduate Student"];
const eligibilityYears = ["First Year", "Second Year", "Third Year", "Fourth Year", "Fifth Year / Graduate Student"];
const arrivalTerms = ["Fall 2024", "Spring 2025", "Summer 2025", "Fall 2025", "Spring 2026", "Other"];
const majors = ["Business", "Communications", "Kinesiology", "Exercise Science", "Finance", "Marketing", "Computer Science", "Education", "Psychology", "Other / Undecided"];
const confidenceDescriptions: Record<number, string> = {
  1: "I feel completely unsure where to start.",
  2: "I have very little experience and need significant guidance.",
  3: "I have low confidence but know a little or have had limited experience.",
  4: "I understand some basics but still need structure and support.",
  5: "I feel somewhat prepared but inconsistent.",
  6: "I have started building professional materials and exploring opportunities.",
  7: "I feel fairly confident but still need refinement and experience.",
  8: "I feel prepared and could confidently apply for opportunities.",
  9: "I feel very prepared and need only minor support.",
  10: "I feel career-ready and professionally developed enough to enter the job market now.",
};

export default function OnboardingPage() {
  const { completeOnboarding } = usePrototypeState();
  const [transferStatus, setTransferStatus] = useState<"yes" | "no" | null>(null);
  const [confidenceLevel, setConfidenceLevel] = useState(5);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    preferredName: "",
    sport: "",
    phone: "",
    email: "",
    homeTown: "",
    schoolYear: "",
    eligibilityYear: "",
    major: "",
    previousSchool: "",
    arrivalTerm: "",
  });

  const assignedRoadmap = useMemo(() => {
    const year = form.schoolYear || form.eligibilityYear;
    if (year.includes("Freshman") || year.includes("First")) return "Freshman Roadmap";
    if (year.includes("Sophomore") || year.includes("Second")) return "Sophomore Roadmap";
    if (year.includes("Junior") || year.includes("Third")) return "Junior Roadmap";
    if (year.includes("Senior") || year.includes("Fourth")) return "Senior Roadmap";
    if (year.includes("Fifth") || year.includes("Graduate")) return "Senior/Fifth-Year or Graduate Roadmap";
    return "Freshman Roadmap";
  }, [form.eligibilityYear, form.schoolYear]);

  function update(field: keyof typeof form, value: string | number) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr]">
        <aside className="card-surface h-fit rounded-lg p-6 lg:sticky lg:top-28">
          <span className="chrome-surface grid h-12 w-12 place-items-center rounded-lg text-aggie-navy shadow-glow">
            <UserRound className="h-6 w-6" />
          </span>
          <p className="mt-5 text-sm font-black uppercase tracking-[0.24em] text-aggie-silver">
            Prototype Mode
          </p>
          <h2 className="mt-2 text-2xl font-black text-white">Profile Setup</h2>
          <p className="mt-3 leading-7 text-aggie-light/74">
            Prototype mode: you can move through sections without completing every field.
          </p>
          <div className="mt-6 rounded-lg border border-aggie-silver/15 bg-white/[0.045] p-4">
            <p className="text-sm font-bold text-aggie-muted">Assigned roadmap preview</p>
            <p className="mt-2 text-xl font-black text-white">{assignedRoadmap}</p>
            {transferStatus === "yes" && (
              <p className="mt-2 text-sm font-bold text-aggie-ice">Transfer Add-On included</p>
            )}
          </div>
        </aside>

        <section className="min-w-0">
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-aggie-silver">
            Student-Athlete Profile
          </p>
          <h1 className="text-glow mt-3 text-4xl font-black tracking-tight text-white md:text-5xl">
            Tell Aggies Lead where you are starting
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-aggie-light/76">
            This short profile helps assign the right roadmap and support path.
          </p>

          <div className="card-surface mt-6 rounded-lg p-6">
            <div className="grid gap-5 md:grid-cols-2">
              <TextField label="First Name" value={form.firstName} onChange={(value) => update("firstName", value)} />
              <TextField label="Last Name" value={form.lastName} onChange={(value) => update("lastName", value)} />
              <TextField label="Preferred Name" value={form.preferredName} onChange={(value) => update("preferredName", value)} />
              <SelectField label="Sport" value={form.sport} options={sports} onChange={(value) => update("sport", value)} />
              <TextField label="Phone Number" value={form.phone} onChange={(value) => update("phone", value)} />
              <TextField
                label="Personal Email"
                type="email"
                value={form.email}
                helper="Your personal email will not be used to sign in. This helps Aggies Lead stay connected with you after graduation or once you no longer have access to your student email."
                onChange={(value) => update("email", value)}
              />
              <TextField label="Home Town" value={form.homeTown} onChange={(value) => update("homeTown", value)} />
              <SelectField label="Year in School" value={form.schoolYear} options={schoolYears} onChange={(value) => update("schoolYear", value)} />
              <SelectField
                label="Year in Sport / Eligibility"
                value={form.eligibilityYear}
                options={eligibilityYears}
                helper="This refers to your athletic eligibility year. For example, if you are a redshirt sophomore, you may be a junior in school but a sophomore in sport."
                onChange={(value) => update("eligibilityYear", value)}
              />
              <SelectField label="Major" value={form.major} options={majors} onChange={(value) => update("major", value)} />
            </div>

            <div className="mt-7 rounded-lg border border-aggie-silver/15 bg-white/[0.04] p-5">
              <p className="text-sm font-black text-white">Transfer Student-Athlete?</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {["Yes", "No"].map((choice) => (
                  <button
                    key={choice}
                    type="button"
                    data-testid={`transfer-${choice.toLowerCase()}`}
                    onClick={() => setTransferStatus(choice === "Yes" ? "yes" : "no")}
                    className={`pointer-events-auto min-h-12 rounded-lg border px-4 text-sm font-black transition ${
                      transferStatus === (choice === "Yes" ? "yes" : "no")
                        ? "chrome-surface border-aggie-chrome/60 text-aggie-navy shadow-steel"
                        : "border-aggie-silver/15 bg-white/[0.045] text-aggie-light hover:border-aggie-steel hover:bg-white/10"
                    }`}
                  >
                    {choice}
                  </button>
                ))}
              </div>
              {transferStatus === "yes" && (
                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  <TextField label="Previous School" value={form.previousSchool} onChange={(value) => update("previousSchool", value)} />
                  <SelectField label="When did you arrive at USU?" value={form.arrivalTerm} options={arrivalTerms} onChange={(value) => update("arrivalTerm", value)} />
                </div>
              )}
            </div>

            <div className="mt-7">
              <h2 className="text-xl font-black text-white">Professional Development Confidence Scale</h2>
              <div className="mt-4 grid grid-cols-5 gap-3 md:grid-cols-10">
                {Array.from({ length: 10 }, (_, index) => index + 1).map((number) => (
                  <button
                    key={number}
                    type="button"
                    data-testid={`confidence-${number}`}
                    onClick={() => setConfidenceLevel(number)}
                    className={`pointer-events-auto aspect-square rounded-lg border text-lg font-black transition ${
                      confidenceLevel === number
                        ? "chrome-surface border-aggie-chrome/60 text-aggie-navy shadow-glow"
                        : "border-aggie-silver/15 bg-white/[0.045] text-aggie-light hover:border-aggie-steel hover:bg-white/10"
                    }`}
                  >
                    {number}
                  </button>
                ))}
              </div>
              <div className="mt-5 rounded-lg border border-aggie-silver/15 bg-white/[0.045] p-4">
                <p className="text-sm font-black uppercase tracking-[0.18em] text-aggie-silver">
                  Current Selection
                </p>
                <p className="mt-2 text-2xl font-black text-white">{confidenceLevel}/10</p>
                <p className="mt-2 leading-7 text-aggie-light/76">
                  {confidenceDescriptions[confidenceLevel]}
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Link
                href="/app-tutorial"
                onClick={completeOnboarding}
                className="chrome-surface pointer-events-auto inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-aggie-chrome/60 px-5 text-sm font-black text-aggie-navy shadow-glow transition hover:brightness-110"
              >
                Continue to Tutorial
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </section>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  helper,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  helper?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-black text-white">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 min-h-12 w-full rounded-lg border border-aggie-silver/15 bg-aggie-navy/80 px-4 text-white outline-none transition placeholder:text-aggie-muted focus:border-aggie-steel"
      />
      {helper && <p className="mt-2 text-sm leading-6 text-aggie-muted">{helper}</p>}
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
  helper,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  helper?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-black text-white">{label}</span>
      <div className="relative mt-2">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="min-h-12 w-full appearance-none rounded-lg border border-aggie-silver/15 bg-aggie-navy/80 px-4 pr-11 text-white outline-none transition focus:border-aggie-steel"
        >
          <option value="">Select...</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-aggie-silver" />
      </div>
      {helper && <p className="mt-2 text-sm leading-6 text-aggie-muted">{helper}</p>}
    </label>
  );
}

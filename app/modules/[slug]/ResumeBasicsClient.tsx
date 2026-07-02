"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  Check,
  FileText,
  IdCard,
  LayoutTemplate,
  RotateCcw,
  Save,
  Sparkles,
  Timer,
  Trophy,
  Wand2,
} from "lucide-react";
import { GhostButton } from "@/components/Prototype";
import { nextFreshmanModuleHref } from "@/lib/roadmaps";

const storageKey = "aggies-lead:freshman:resume-basics";

const fundamentals = [
  "A resume is a marketing document, not a life story.",
  "Employers quickly scan resumes.",
  "Important information should be easy to find.",
  "Work Experience should be the most visually dominant section and should appear near the top.",
];

const translatorExamples = [
  ["Balanced school and athletics", "Balanced multiple priorities while consistently meeting academic and athletic performance expectations."],
  ["Team captain", "Provided team leadership and supported communication between coaches and teammates."],
  ["Communicated with teammates", "Facilitated communication among diverse stakeholders to improve team performance."],
  ["Showed up to practice every day", "Maintained accountability and commitment in a high-performance environment."],
  ["Competed at the Division I level", "Performed under pressure while managing competing priorities and deadlines."],
  ["Worked with coaches", "Collaborated with leadership and subject matter experts to achieve organizational goals."],
  ["Helped with team events", "Supported event coordination and stakeholder engagement initiatives."],
];

const tailoringSteps = [
  "Find jobs that interest you.",
  "Review responsibilities.",
  "Review qualifications.",
  "Identify repeated language.",
  "Translate your experience using similar language.",
  "Make small changes for each application.",
];

const coreCompetencies = [
  "Stakeholder Relationship Management",
  "Team Leadership",
  "Strategic Communications",
  "Event Planning",
  "Project Coordination",
  "Public Speaking",
  "Community Outreach",
  "Recruiting Support",
  "Volunteer Management",
  "Donor Relations",
  "Program Development",
];

const technicalSkills = [
  "Microsoft Office",
  "Google Workspace",
  "Adobe Creative Suite",
  "Canva",
  "CRM Platforms",
  "AI Automation Tools",
  "Graphic Design",
  "Data Analytics",
  "Social Media Management",
  "Video Editing",
];

const assessmentChecklist = [
  "I know where my contact information belongs.",
  "I understand why Work Experience is important.",
  "I can include athletics on my resume.",
  "I can translate athletic experience into professional language.",
  "I understand Core Competencies vs Technical Skills.",
  "I understand GPA guidance.",
  "I know how to tailor a resume.",
];

const layoutOptions = ["Two Column", "Traditional", "Modern", "Not Sure"] as const;
const headshotOptions = ["Yes", "No", "Depends on the Job", "Not Sure"] as const;
const athleticsPlacementOptions = [
  "Work Experience",
  "Athletic Experience",
  "Leadership Experience",
  "Activities/Involvement",
  "Not Sure",
] as const;
const gpaOptions = ["Yes", "No", "Not Sure"] as const;

type LayoutChoice = (typeof layoutOptions)[number];
type HeadshotChoice = (typeof headshotOptions)[number];
type AthleticsPlacement = (typeof athleticsPlacementOptions)[number];
type GpaChoice = (typeof gpaOptions)[number];

type Translation = {
  id: string;
  athletic: string;
  professional: string;
};

type ResumeBuilder = {
  name: string;
  phone: string;
  email: string;
  linkedin: string;
  location: string;
  major: string;
  graduationYear: string;
  sport: string;
  professionalSummary: string;
  workExperience: string;
  education: string;
  certifications: string;
  awards: string;
  service: string;
  gpa: string;
};

type ResumeBasicsState = {
  overviewReviewed: boolean;
  fundamentalsReviewed: string[];
  employerNotice: string;
  selectedLayout: LayoutChoice | "";
  headshotChoice: HeadshotChoice | "";
  athleticsPlacement: AthleticsPlacement | "";
  athleticExperienceInput: string;
  professionalTranslationInput: string;
  savedTranslations: Translation[];
  tailoringReviewed: string[];
  jobResponsibility: string;
  responsibilityConnection: string;
  selectedCoreCompetencies: string[];
  selectedTechnicalSkills: string[];
  gpaChoice: GpaChoice | "";
  gpaValue: string;
  resumeBuilder: ResumeBuilder;
  confidenceRating: number;
  completionChecklist: string[];
  moduleComplete: boolean;
};

const initialBuilder: ResumeBuilder = {
  name: "",
  phone: "",
  email: "",
  linkedin: "",
  location: "",
  major: "",
  graduationYear: "",
  sport: "",
  professionalSummary: "",
  workExperience: "",
  education: "",
  certifications: "",
  awards: "",
  service: "",
  gpa: "",
};

const initialState: ResumeBasicsState = {
  overviewReviewed: false,
  fundamentalsReviewed: [],
  employerNotice: "",
  selectedLayout: "",
  headshotChoice: "",
  athleticsPlacement: "",
  athleticExperienceInput: "",
  professionalTranslationInput: "",
  savedTranslations: [],
  tailoringReviewed: [],
  jobResponsibility: "",
  responsibilityConnection: "",
  selectedCoreCompetencies: [],
  selectedTechnicalSkills: [],
  gpaChoice: "",
  gpaValue: "",
  resumeBuilder: initialBuilder,
  confidenceRating: 5,
  completionChecklist: [],
  moduleComplete: false,
};

const mockAdminData = {
  confidenceRatings: [7, 8, 8, 9, 6, 8],
  layouts: ["Two Column", "Two Column", "Modern", "Two Column", "Traditional", "Modern"],
  athleticsPlacements: ["Work Experience", "Athletic Experience", "Work Experience", "Leadership Experience", "Work Experience"],
  core: ["Team Leadership", "Strategic Communications", "Project Coordination", "Team Leadership", "Public Speaking"],
  technical: ["Microsoft Office", "Google Workspace", "Canva", "Social Media Management", "Microsoft Office"],
};

export function ResumeBasicsClient() {
  const [form, setForm] = useState<ResumeBasicsState>(initialState);
  const [loaded, setLoaded] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Partial<ResumeBasicsState>;
        setForm({
          ...initialState,
          ...parsed,
          resumeBuilder: { ...initialBuilder, ...parsed.resumeBuilder },
        });
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
    if (form.moduleComplete) {
      return { completed: 11, total: 11, percent: 100 };
    }

    const builderComplete = [
      form.resumeBuilder.name,
      form.resumeBuilder.email,
      form.resumeBuilder.major,
      form.resumeBuilder.sport,
      form.resumeBuilder.professionalSummary,
      form.resumeBuilder.workExperience,
      form.resumeBuilder.education,
    ].every((value) => value.trim().length > 0);

    const sections = [
      form.overviewReviewed,
      form.fundamentalsReviewed.length === fundamentals.length && form.employerNotice.trim().length > 0,
      form.selectedLayout,
      form.headshotChoice,
      form.athleticsPlacement,
      form.savedTranslations.length > 0,
      form.tailoringReviewed.length === tailoringSteps.length &&
        form.jobResponsibility.trim().length > 0 &&
        form.responsibilityConnection.trim().length > 0,
      form.selectedCoreCompetencies.length > 0 && form.selectedTechnicalSkills.length > 0,
      form.gpaChoice,
      builderComplete,
      form.completionChecklist.length === assessmentChecklist.length,
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
  const nextHref = nextFreshmanModuleHref("resume-basics");
  const adminStats = getAdminPreview(form);

  function updateField<Key extends keyof ResumeBasicsState>(key: Key, value: ResumeBasicsState[Key]) {
    setForm((current) => ({ ...current, [key]: value, moduleComplete: key === "moduleComplete" ? Boolean(value) : false }));
    setSavedMessage("");
  }

  function toggleList(key: "fundamentalsReviewed" | "tailoringReviewed" | "selectedCoreCompetencies" | "selectedTechnicalSkills" | "completionChecklist", item: string) {
    setForm((current) => ({
      ...current,
      [key]: current[key].includes(item)
        ? current[key].filter((value) => value !== item)
        : [...current[key], item],
      moduleComplete: false,
    }));
    setSavedMessage("");
  }

  function updateBuilder(key: keyof ResumeBuilder, value: string) {
    setForm((current) => ({
      ...current,
      resumeBuilder: { ...current.resumeBuilder, [key]: value },
      moduleComplete: false,
    }));
    setSavedMessage("");
  }

  function addTranslation() {
    if (!form.athleticExperienceInput.trim() || !form.professionalTranslationInput.trim()) return;
    setForm((current) => ({
      ...current,
      savedTranslations: [
        ...current.savedTranslations,
        {
          id: `${Date.now()}`,
          athletic: current.athleticExperienceInput,
          professional: current.professionalTranslationInput,
        },
      ],
      athleticExperienceInput: "",
      professionalTranslationInput: "",
      moduleComplete: false,
    }));
    setSavedMessage("");
  }

  function removeTranslation(id: string) {
    setForm((current) => ({
      ...current,
      savedTranslations: current.savedTranslations.filter((translation) => translation.id !== id),
      moduleComplete: false,
    }));
  }

  function completeModule() {
    setForm((current) => ({ ...current, moduleComplete: true }));
    setSavedMessage("Resume Basics complete. Nice work.");
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
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-aggie-silver">Freshman Roadmap</p>
            <h1 className="text-glow mt-3 text-4xl font-black tracking-tight text-white md:text-5xl">Resume Basics</h1>
            <p className="mt-4 text-lg leading-8 text-aggie-light/78">
              Learn how to build a strong resume, translate student-athlete experience into
              professional language, and tailor your resume for different opportunities.
            </p>
            <p className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-aggie-muted">
              <Timer className="h-4 w-4" />
              Estimated Time: 20-30 Minutes
            </p>
          </div>
          <ProgressPanel completed={completion.completed} percent={completion.percent} status={status} total={completion.total} />
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <Card title="Module Overview" icon={<Sparkles className="h-6 w-6" />}>
          <CheckboxRow label="I reviewed the purpose and goals of this module." checked={form.overviewReviewed} onChange={(value) => updateField("overviewReviewed", value)} />
        </Card>

        <Card title="Quick Actions" icon={<Save className="h-6 w-6" />}>
          <p className="leading-7 text-aggie-light/74">Your resume planning work is stored in this browser for the local prototype.</p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row xl:flex-col">
            <ActionButton onClick={saveProgress} icon={<Save className="h-4 w-4" />} primary>Save Progress</ActionButton>
            <ActionButton onClick={resetModule} icon={<RotateCcw className="h-4 w-4" />}>Reset Module</ActionButton>
          </div>
          {savedMessage && <p className="mt-4 text-sm font-bold text-aggie-ice">{savedMessage}</p>}
        </Card>
      </section>

      <Card title="Resume Fundamentals" icon={<FileText className="h-6 w-6" />}>
        <div className="grid gap-3 md:grid-cols-2">
          {fundamentals.map((item) => (
            <SelectableButton key={item} selected={form.fundamentalsReviewed.includes(item)} onClick={() => toggleList("fundamentalsReviewed", item)}>
              {item}
            </SelectableButton>
          ))}
        </div>
        <div className="mt-6">
          <TextArea label="What do you want an employer to notice first about you?" value={form.employerNotice} onChange={(value) => updateField("employerNotice", value)} />
        </div>
      </Card>

      <Card title="Resume Layout Examples" icon={<LayoutTemplate className="h-6 w-6" />}>
        <div className="grid gap-4 xl:grid-cols-3">
          <ResumeLayoutCard title="Recommended Two-Column Layout" selected={form.selectedLayout === "Two Column"} onSelect={() => updateField("selectedLayout", "Two Column")} sections={[
            { label: "Top", items: ["Name", "Phone", "Email", "LinkedIn"] },
            { label: "Main Column", items: ["Professional Summary", "Work Experience"] },
            { label: "Side Column", items: ["Education", "Core Competencies", "Technical Skills", "Awards", "Languages", "Certifications", "Affiliations", "Athletic Participation", "Clubs / Teams", "Service"] },
          ]} />
          <ResumeLayoutCard title="Traditional Single Column" selected={form.selectedLayout === "Traditional"} onSelect={() => updateField("selectedLayout", "Traditional")} sections={[
            { label: "Sections", items: ["Contact Information", "Summary", "Work Experience", "Education", "Skills", "Certifications", "Activities"] },
            { label: "Best for", items: ["Corporate", "Finance", "Legal", "Government"] },
          ]} />
          <ResumeLayoutCard title="Modern Professional Layout" selected={form.selectedLayout === "Modern"} onSelect={() => updateField("selectedLayout", "Modern")} sections={[
            { label: "Top", items: ["Contact Information", "Optional Headshot"] },
            { label: "Main", items: ["Summary", "Work Experience"] },
            { label: "Side", items: ["Education", "Technical Skills", "Leadership", "Certifications", "Athletic Experience"] },
            { label: "Best for", items: ["Marketing", "Sports Industry", "Media", "Sales", "Creative"] },
          ]} />
        </div>
        <div className="mt-6">
          <RadioGroup title="Which layout best fits your goals?" options={layoutOptions} selected={form.selectedLayout} onSelect={(value) => updateField("selectedLayout", value)} />
        </div>
      </Card>

      <Card title="Headshot Guidance" icon={<IdCard className="h-6 w-6" />}>
        <div className="grid gap-3 md:grid-cols-3">
          <GuidanceItem text="Headshots are optional." />
          <GuidanceItem text="Usually leave off for finance, law, accounting, government." />
          <GuidanceItem text="Often acceptable for sports, sales, marketing, media, PR." />
        </div>
        <div className="mt-6">
          <RadioGroup title="Would you use a headshot?" options={headshotOptions} selected={form.headshotChoice} onSelect={(value) => updateField("headshotChoice", value)} />
        </div>
      </Card>

      <Card title="Student-Athlete Experience" icon={<Trophy className="h-6 w-6" />}>
        <p className="leading-7 text-aggie-light/78">
          Every student-athlete should identify themselves as a student-athlete somewhere on their
          resume. For athletes with limited work experience, list Student-Athlete under Work
          Experience so the role is easy for employers to recognize.
        </p>
        <div className="mt-5 grid gap-3 md:grid-cols-4">
          {["Work Experience", "Athletic Experience", "Leadership Experience", "Activities & Involvement"].map((placement) => <GuidanceItem key={placement} text={placement} />)}
        </div>
        <div className="mt-6 rounded-lg border border-aggie-silver/15 bg-aggie-navy/70 p-5">
          <p className="text-lg font-black text-white">Student-Athlete</p>
          <p className="mt-1 text-sm font-bold text-aggie-silver">Utah State University Athletics</p>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-aggie-light/80">
            <li>Balanced a full academic course load while maintaining NCAA athletic commitments.</li>
            <li>Collaborated with coaches, staff, and teammates to achieve team goals.</li>
            <li>Demonstrated accountability through daily training, competition, and academic expectations.</li>
            <li>Managed competing priorities in a fast-paced, high-performance environment.</li>
          </ul>
        </div>
        <div className="mt-6">
          <RadioGroup title="Where will you include athletics on your resume?" options={athleticsPlacementOptions} selected={form.athleticsPlacement} onSelect={(value) => updateField("athleticsPlacement", value)} />
        </div>
      </Card>

      <Card title="Athlete Translator" icon={<Wand2 className="h-6 w-6" />}>
        <div className="grid gap-3 lg:grid-cols-2">
          {translatorExamples.map(([athletic, professional]) => (
            <div key={athletic} className="rounded-lg border border-aggie-silver/15 bg-white/[0.045] p-4">
              <p className="text-sm font-black text-white">{athletic}</p>
              <p className="mt-2 text-sm leading-6 text-aggie-light/78">{professional}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <TextInput label="Athletic Experience" value={form.athleticExperienceInput} onChange={(value) => updateField("athleticExperienceInput", value)} />
          <TextInput label="Professional Translation" value={form.professionalTranslationInput} onChange={(value) => updateField("professionalTranslationInput", value)} />
        </div>
        <div className="mt-4">
          <ActionButton onClick={addTranslation} icon={<Wand2 className="h-4 w-4" />} primary>Add Translation</ActionButton>
        </div>
        {form.savedTranslations.length > 0 && (
          <div className="mt-5 grid gap-3">
            {form.savedTranslations.map((translation) => (
              <div key={translation.id} className="rounded-lg border border-aggie-silver/15 bg-aggie-navy/70 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-sm font-black text-white">{translation.athletic}</p>
                    <p className="mt-2 text-sm leading-6 text-aggie-light/78">{translation.professional}</p>
                  </div>
                  <button type="button" onClick={() => removeTranslation(translation.id)} className="min-h-10 rounded-lg border border-aggie-silver/20 px-3 text-sm font-bold text-white transition hover:border-aggie-steel hover:bg-white/10">Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card title="Tailoring Your Resume" icon={<FileText className="h-6 w-6" />}>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {tailoringSteps.map((step) => (
            <SelectableButton key={step} selected={form.tailoringReviewed.includes(step)} onClick={() => toggleList("tailoringReviewed", step)}>
              {step}
            </SelectableButton>
          ))}
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <GuidanceItem text="Do not lie." />
          <GuidanceItem text="Do not claim experience you do not have." />
          <GuidanceItem text="Use employer language to accurately describe your experience." />
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <TextArea label="Job Responsibility Input" value={form.jobResponsibility} onChange={(value) => updateField("jobResponsibility", value)} />
          <TextArea label="How could one of your experiences connect to this responsibility?" value={form.responsibilityConnection} onChange={(value) => updateField("responsibilityConnection", value)} />
        </div>
      </Card>

      <Card title="Core Competencies vs Technical Skills" icon={<Sparkles className="h-6 w-6" />}>
        <p className="leading-7 text-aggie-light/78">Generic skills alone are weak. Strong resumes name specific capabilities and tools an employer can recognize quickly.</p>
        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          <ChoiceGroup title="Core Competencies" options={coreCompetencies} selected={form.selectedCoreCompetencies} onToggle={(item) => toggleList("selectedCoreCompetencies", item)} />
          <ChoiceGroup title="Technical Skills" options={technicalSkills} selected={form.selectedTechnicalSkills} onToggle={(item) => toggleList("selectedTechnicalSkills", item)} />
        </div>
      </Card>

      <Card title="GPA Guidance" icon={<FileText className="h-6 w-6" />}>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <GuidanceItem text="GPA is optional." />
          <GuidanceItem text="Recommend including if 3.6 or higher." />
          <GuidanceItem text="Below 3.6 is not bad, but often does not add value." />
          <GuidanceItem text="Employers care heavily about experience, leadership, communication, networking, and professionalism." />
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_0.7fr]">
          <RadioGroup title="Do you plan to include your GPA?" options={gpaOptions} selected={form.gpaChoice} onSelect={(value) => updateField("gpaChoice", value)} />
          <TextInput label="Optional GPA" value={form.gpaValue} onChange={(value) => updateField("gpaValue", value)} />
        </div>
      </Card>

      <Card title="Build My Student-Athlete Resume" icon={<LayoutTemplate className="h-6 w-6" />}>
        <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
          <div className="grid gap-4 md:grid-cols-2">
            <TextInput label="Name" value={form.resumeBuilder.name} onChange={(value) => updateBuilder("name", value)} />
            <TextInput label="Phone" value={form.resumeBuilder.phone} onChange={(value) => updateBuilder("phone", value)} />
            <TextInput label="Email" value={form.resumeBuilder.email} onChange={(value) => updateBuilder("email", value)} />
            <TextInput label="LinkedIn" value={form.resumeBuilder.linkedin} onChange={(value) => updateBuilder("linkedin", value)} />
            <TextInput label="Location" value={form.resumeBuilder.location} onChange={(value) => updateBuilder("location", value)} />
            <TextInput label="Major" value={form.resumeBuilder.major} onChange={(value) => updateBuilder("major", value)} />
            <TextInput label="Graduation Year" value={form.resumeBuilder.graduationYear} onChange={(value) => updateBuilder("graduationYear", value)} />
            <TextInput label="Sport" value={form.resumeBuilder.sport} onChange={(value) => updateBuilder("sport", value)} />
            <div className="md:col-span-2"><TextArea label="Professional Summary" value={form.resumeBuilder.professionalSummary} onChange={(value) => updateBuilder("professionalSummary", value)} /></div>
            <div className="md:col-span-2"><TextArea label="Work Experience" value={form.resumeBuilder.workExperience} onChange={(value) => updateBuilder("workExperience", value)} /></div>
            <TextArea label="Education" value={form.resumeBuilder.education} onChange={(value) => updateBuilder("education", value)} />
            <TextArea label="Certifications" value={form.resumeBuilder.certifications} onChange={(value) => updateBuilder("certifications", value)} />
            <TextArea label="Awards" value={form.resumeBuilder.awards} onChange={(value) => updateBuilder("awards", value)} />
            <TextArea label="Service" value={form.resumeBuilder.service} onChange={(value) => updateBuilder("service", value)} />
            <TextInput label="GPA Optional" value={form.resumeBuilder.gpa} onChange={(value) => updateBuilder("gpa", value)} />
          </div>
          <ResumePreview form={form} />
        </div>
      </Card>

      <Card title="Completion Assessment" icon={<Check className="h-6 w-6" />}>
        <label className="block">
          <span className="flex items-center justify-between gap-4 text-sm font-black text-white">
            Confidence Rating
            <span className="text-aggie-ice">{form.confidenceRating}/10</span>
          </span>
          <input type="range" min="1" max="10" value={form.confidenceRating} onChange={(event) => updateField("confidenceRating", Number(event.target.value))} className="mt-3 w-full accent-aggie-steel" />
        </label>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {assessmentChecklist.map((item) => (
            <CheckboxRow key={item} label={item} checked={form.completionChecklist.includes(item)} onChange={() => toggleList("completionChecklist", item)} />
          ))}
        </div>
        <div className="mt-6">
          <ActionButton onClick={completeModule} icon={<Check className="h-4 w-4" />} primary>Complete Resume Basics Module</ActionButton>
        </div>
        {form.moduleComplete && (
          <p className="mt-5 rounded-lg border border-aggie-chrome/30 bg-white/[0.08] p-4 text-sm font-bold text-aggie-ice">
            Resume Basics complete. Your progress is marked at 100%.
          </p>
        )}
      </Card>

      <Card title="Admin Preview" icon={<BarChart3 className="h-6 w-6" />}>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <AdminStat label="Completion Status" value={status} />
          <AdminStat label="Average Confidence Rating" value={`${adminStats.averageConfidence}/10`} />
          <AdminStat label="Most Selected Layout" value={adminStats.layout} />
          <AdminStat label="Most Selected Athletics Placement" value={adminStats.athleticsPlacement} />
          <AdminStat label="Top Core Competencies" value={adminStats.core.join(", ") || "No selections yet"} />
          <AdminStat label="Top Technical Skills" value={adminStats.technical.join(", ") || "No selections yet"} />
        </div>
      </Card>

      <section className="card-surface rounded-lg p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-aggie-silver">Module Progress</p>
            <h2 className="mt-2 text-2xl font-black text-white">{status}</h2>
            <p className="mt-2 leading-7 text-aggie-light/74">Complete each section to finish Resume Basics.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/roadmaps/freshman" className="inline-flex min-h-12 items-center justify-center rounded-lg border border-aggie-silver/25 px-5 text-sm font-bold text-white transition hover:border-aggie-steel hover:bg-white/10">Back to Roadmap</Link>
            <Link href={nextHref} className="inline-flex min-h-12 items-center justify-center rounded-lg border border-aggie-silver/25 px-5 text-sm font-bold text-white transition hover:border-aggie-steel hover:bg-white/10">Next Module</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function getAdminPreview(form: ResumeBasicsState) {
  const confidence = [...mockAdminData.confidenceRatings, form.confidenceRating];
  return {
    averageConfidence: (confidence.reduce((total, value) => total + value, 0) / confidence.length).toFixed(1),
    layout: mostCommon([...mockAdminData.layouts, form.selectedLayout].filter(Boolean)),
    athleticsPlacement: mostCommon([...mockAdminData.athleticsPlacements, form.athleticsPlacement].filter(Boolean)),
    core: topItems([...mockAdminData.core, ...form.selectedCoreCompetencies]),
    technical: topItems([...mockAdminData.technical, ...form.selectedTechnicalSkills]),
  };
}

function mostCommon(values: string[]) {
  return topItems(values, 1)[0] ?? "No selections yet";
}

function topItems(values: string[], limit = 3) {
  const counts = values.reduce<Record<string, number>>((acc, value) => {
    acc[value] = (acc[value] ?? 0) + 1;
    return acc;
  }, {});
  return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, limit).map(([value]) => value);
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
      <p className="mt-3 text-sm font-medium text-aggie-light/72">{completed} of {total} sections complete</p>
    </div>
  );
}

function Card({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="card-surface rounded-lg p-6">
      <div className="mb-5 flex items-center gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-aggie-silver/20 bg-aggie-steel/16 text-aggie-ice shadow-steel">{icon}</span>
        <h2 className="text-2xl font-black text-white">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function ResumeLayoutCard({ title, sections, selected, onSelect }: { title: string; sections: { label: string; items: string[] }[]; selected: boolean; onSelect: () => void }) {
  return (
    <button type="button" onClick={onSelect} className={`rounded-lg border p-4 text-left transition ${selected ? "border-aggie-chrome/60 bg-white/[0.1] shadow-steel" : "border-aggie-silver/15 bg-white/[0.045] hover:border-aggie-steel hover:bg-white/10"}`}>
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-xl font-black text-white">{title}</h3>
        <CheckBoxMark active={selected} />
      </div>
      <div className="mt-4 space-y-4">
        {sections.map((section) => (
          <div key={section.label} className="rounded-lg border border-aggie-silver/15 bg-aggie-navy/60 p-3">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-aggie-silver">{section.label}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {section.items.map((item) => <span key={item} className="rounded-md bg-white/[0.07] px-2.5 py-1.5 text-xs font-bold text-aggie-light/82">{item}</span>)}
            </div>
          </div>
        ))}
      </div>
    </button>
  );
}

function ResumePreview({ form }: { form: ResumeBasicsState }) {
  const builder = form.resumeBuilder;
  const layout = form.selectedLayout || "Two Column";
  const sideItems = [
    ["Education", builder.education],
    ["Core Competencies", form.selectedCoreCompetencies.join(", ")],
    ["Technical Skills", form.selectedTechnicalSkills.join(", ")],
    ["Certifications", builder.certifications],
    ["Awards", builder.awards],
    ["Service", builder.service],
    ["GPA", builder.gpa || form.gpaValue],
  ].filter(([, value]) => value);

  return (
    <article className="rounded-lg border border-aggie-silver/20 bg-white p-5 text-aggie-navy">
      <p className="mb-4 text-xs font-black uppercase tracking-[0.18em] text-aggie-steel">{layout} Preview</p>
      <header className="border-b border-aggie-silver pb-4">
        <h3 className="text-2xl font-black">{builder.name || "Your Name"}</h3>
        <p className="mt-2 text-xs font-bold text-aggie-blue">
          {[builder.phone, builder.email, builder.linkedin, builder.location].filter(Boolean).join(" | ") || "Phone | Email | LinkedIn | Location"}
        </p>
      </header>
      <div className={`mt-4 grid gap-4 ${layout === "Traditional" ? "" : "md:grid-cols-[1.3fr_0.8fr]"}`}>
        <main className="space-y-4">
          <PreviewBlock title="Professional Summary" body={builder.professionalSummary || "Brief professional summary will appear here."} />
          <PreviewBlock title="Work Experience" body={builder.workExperience || "Student-athlete and work experience will appear here."} />
          {layout === "Traditional" && <PreviewBlock title="Education" body={builder.education || `${builder.major || "Major"}, Utah State University`} />}
        </main>
        {layout !== "Traditional" && (
          <aside className="space-y-3">
            <PreviewBlock title="Education" body={builder.education || `${builder.major || "Major"}, Utah State University`} compact />
            <PreviewBlock title="Athletic Experience" body={builder.sport ? `${builder.sport}, Utah State University Athletics` : "Sport, Utah State University Athletics"} compact />
            {sideItems.map(([title, body]) => <PreviewBlock key={title} title={title} body={body} compact />)}
          </aside>
        )}
      </div>
    </article>
  );
}

function PreviewBlock({ title, body, compact = false }: { title: string; body: string; compact?: boolean }) {
  return (
    <section>
      <h4 className={`${compact ? "text-xs" : "text-sm"} font-black uppercase tracking-[0.12em] text-aggie-blue`}>{title}</h4>
      <p className={`mt-1 whitespace-pre-wrap ${compact ? "text-xs leading-5" : "text-sm leading-6"}`}>{body}</p>
    </section>
  );
}

function AdminStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-aggie-silver/15 bg-white/[0.045] p-4">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-aggie-silver">{label}</p>
      <p className="mt-2 text-lg font-black text-white">{value}</p>
    </div>
  );
}

function GuidanceItem({ text }: { text: string }) {
  return <div className="rounded-lg border border-aggie-silver/15 bg-white/[0.045] p-4 text-sm font-bold leading-6 text-aggie-light/82">{text}</div>;
}

function TextInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="text-sm font-black text-white">{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} className="mt-3 min-h-12 w-full rounded-lg border border-aggie-silver/15 bg-aggie-navy/78 px-4 text-sm text-white outline-none transition placeholder:text-aggie-muted focus:border-aggie-steel" placeholder="Enter response..." />
    </label>
  );
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="text-sm font-black text-white">{label}</span>
      <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={4} className="mt-3 min-h-28 w-full resize-y rounded-lg border border-aggie-silver/15 bg-aggie-navy/78 p-4 text-sm leading-6 text-white outline-none transition placeholder:text-aggie-muted focus:border-aggie-steel" placeholder="Write your response..." />
    </label>
  );
}

function CheckboxRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-aggie-silver/15 bg-white/[0.045] p-4 text-sm font-bold text-aggie-light/86">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="h-5 w-5 accent-aggie-steel" />
      {label}
    </label>
  );
}

function RadioGroup<Option extends string>({ title, options, selected, onSelect }: { title: string; options: readonly Option[]; selected: Option | ""; onSelect: (value: Option) => void }) {
  return (
    <div>
      <h3 className="text-sm font-black uppercase tracking-[0.18em] text-aggie-silver">{title}</h3>
      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {options.map((option) => (
          <button key={option} type="button" onClick={() => onSelect(option)} className={`min-h-11 rounded-lg border px-3 text-sm font-bold transition ${selected === option ? "chrome-surface border-aggie-chrome/60 text-aggie-navy shadow-steel" : "border-aggie-silver/20 text-aggie-light/78 hover:border-aggie-steel hover:bg-white/10"}`}>
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

function ChoiceGroup({ title, options, selected, onToggle }: { title: string; options: string[]; selected: string[]; onToggle: (item: string) => void }) {
  return (
    <div>
      <h3 className="text-sm font-black uppercase tracking-[0.18em] text-aggie-silver">{title}</h3>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {options.map((option) => (
          <SelectableButton key={option} selected={selected.includes(option)} onClick={() => onToggle(option)}>
            {option}
          </SelectableButton>
        ))}
      </div>
    </div>
  );
}

function SelectableButton({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} className={`flex min-h-14 items-center gap-3 rounded-lg border p-4 text-left text-sm font-bold leading-6 transition ${selected ? "border-aggie-chrome/50 bg-white/[0.09] text-white" : "border-aggie-silver/15 bg-white/[0.045] text-aggie-light/78 hover:border-aggie-steel hover:bg-white/10"}`}>
      <CheckBoxMark active={selected} />
      {children}
    </button>
  );
}

function ActionButton({ children, onClick, icon, primary = false }: { children: React.ReactNode; onClick: () => void; icon: React.ReactNode; primary?: boolean }) {
  return (
    <button type="button" onClick={onClick} className={`${primary ? "chrome-surface border-aggie-chrome/60 text-aggie-navy shadow-glow hover:brightness-110" : "border-aggie-silver/25 text-white hover:border-aggie-steel hover:bg-white/10"} inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border px-5 text-sm font-black transition`}>
      {icon}
      {children}
    </button>
  );
}

function CheckBoxMark({ active }: { active: boolean }) {
  return (
    <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-md ${active ? "chrome-surface text-aggie-navy" : "border border-aggie-silver/20 text-transparent"}`}>
      {active && <Check className="h-4 w-4" />}
    </span>
  );
}

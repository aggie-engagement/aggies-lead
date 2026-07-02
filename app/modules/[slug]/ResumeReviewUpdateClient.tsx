"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Check,
  BarChart3,
  ClipboardCheck,
  FileText,
  Plus,
  RotateCcw,
  Save,
  Sparkles,
  Timer,
  Trash2,
} from "lucide-react";
import { GhostButton } from "@/components/Prototype";

const storageKey = "aggies-lead:sophomore:resume-review-update";

const tabs = ["Overview", "Check-In", "New Experience", "Audit", "Bullet Lab", "Impact", "Athlete Refresh", "Tailor", "Gaps", "Review Plan", "Complete"] as const;
const yesNoUnsure = ["Yes", "No", "Not Sure"] as const;
const opportunityOptions = [
  "Internship",
  "Summer Job",
  "Part-Time Job",
  "Leadership Role",
  "Graduate School",
  "Professional Sports Opportunity",
  "Not Sure Yet",
];
const experienceTypes = [
  "Jobs",
  "Internships",
  "Volunteer / Service Experience",
  "Leadership Roles",
  "Athletic Awards",
  "Academic Awards",
  "Clubs / Organizations",
  "Certifications",
  "New Technical Skills",
  "Community Engagement",
  "Camps / Clinics Worked",
  "NIL / Brand Work",
  "Team Leadership Responsibilities",
];

const auditSections = [
  {
    title: "Contact Information",
    items: ["Phone number is correct", "Email is professional", "LinkedIn is included", "Location is updated"],
  },
  {
    title: "Summary",
    items: [
      "Summary matches the opportunity I want",
      "Summary is not too generic",
      "Summary mentions student-athlete experience, leadership, or career direction",
    ],
  },
  {
    title: "Work Experience",
    items: [
      "Work Experience appears near the top",
      "Bullet points are strong",
      "Bullet points show impact when possible",
      "Student-athlete experience is included if needed",
    ],
  },
  {
    title: "Education",
    items: ["Major is updated", "Expected graduation year is correct", "GPA is included only if it adds value"],
  },
  {
    title: "Skills",
    items: [
      "Core competencies are specific and professional",
      "Technical skills are listed separately",
      "Generic words are removed or strengthened",
    ],
  },
];

const numberIdeas = [
  "People served",
  "Events supported",
  "Hours committed",
  "Teammates led",
  "Camps worked",
  "Money raised",
  "Social media reach",
  "Number of games / meets / events",
  "Number of athletes coached",
];

const athleteBulletExamples = [
  "Participated in daily training, film review, team meetings, travel, and competition while maintaining NCAA eligibility.",
  "Collaborated with coaches, athletic trainers, academic staff, and teammates in a high-performance environment.",
  "Demonstrated discipline, accountability, and resilience through year-round athletic and academic commitments.",
  "Represented Utah State Athletics through competition, community engagement, and team responsibilities.",
];

const tailorOpportunityOptions = ["Internship", "Summer Job", "Leadership Role", "Campus Job", "Graduate Program", "Professional Opportunity"];
const suggestedKeywords = ["Leadership", "Event Coordination", "Communication", "Data Analysis", "Customer Service", "Project Management", "Social Media", "Research", "Coaching", "Community Outreach"];
const resumeGapOptions = ["Work Experience", "Internship Experience", "Leadership Experience", "Volunteer / Service Experience", "Technical Skills", "Certifications", "Professional References", "Career Direction", "LinkedIn Profile", "Strong Bullet Points"];
const reviewerOptions = ["Aggies Lead Staff", "Career Services", "Coach", "Professor", "Academic Advisor", "Alumni Mentor", "Former Student-Athlete", "Employer / Professional Contact"];
const completionChecklistItems = [
  "I updated my experiences",
  "I improved weak bullet points",
  "I added numbers / impact where possible",
  "I refreshed my student-athlete experience",
  "I tailored my resume to one opportunity",
  "I identified resume gaps",
  "I selected someone to review my resume",
];

const gapRecommendations: Record<string, string[]> = {
  "Technical Skills": ["Complete a short certification", "Learn Excel, Canva, Adobe, analytics, or AI tools", "Add class projects if relevant"],
  Certifications: ["Complete a short certification", "Learn Excel, Canva, Adobe, analytics, or AI tools", "Add class projects if relevant"],
  Leadership: ["Apply for SAAC", "Become a team rep", "Lead a camp station", "Join a student organization"],
  "Leadership Experience": ["Apply for SAAC", "Become a team rep", "Lead a camp station", "Join a student organization"],
  Experience: ["Apply for campus jobs", "Volunteer at athletics events", "Work camps or clinics", "Ask about internships or shadowing opportunities"],
  "Work Experience": ["Apply for campus jobs", "Volunteer at athletics events", "Work camps or clinics", "Ask about internships or shadowing opportunities"],
  "Internship Experience": ["Apply for campus jobs", "Volunteer at athletics events", "Work camps or clinics", "Ask about internships or shadowing opportunities"],
  "Volunteer / Service Experience": ["Volunteer at athletics events", "Work camps or clinics", "Join a student organization"],
};

const mockAdmin = {
  gaps: ["Technical Skills", "Internship Experience", "Strong Bullet Points", "Technical Skills", "Leadership Experience"],
  confidence: [6, 7, 8, 7, 9],
  needsReview: 14,
  aggiesLeadReviewers: 6,
};

type Tab = (typeof tabs)[number];
type YesNoUnsure = (typeof yesNoUnsure)[number];

type Experience = {
  id: string;
  type: string;
  title: string;
  organization: string;
  dates: string;
  details: string;
};

type ExperienceDraft = Omit<Experience, "id">;

type BulletDraft = {
  did: string;
  helped: string;
  skill: string;
  result: string;
  mattered: string;
  generated: string;
};

type SavedBullet = BulletDraft & {
  id: string;
};

type ImpactDraft = {
  experience: string;
  metric: string;
  impact: string;
};

type TailoredOpportunity = {
  opportunityType: string;
  title: string;
  organization: string;
  responsibilities: string[];
  requiredSkills: string[];
  naturalWords: string;
};

type ReviewPlan = {
  reviewerName: string;
  sendDate: string;
  tailoredFor: string;
};

type ResumeReviewState = {
  overviewReviewed: boolean;
  hasResume: YesNoUnsure | "";
  lastUpdated: string;
  usedToApply: YesNoUnsure | "";
  preparingFor: string[];
  experiencePrompt: string;
  selectedExperienceTypes: string[];
  experienceDraft: ExperienceDraft;
  savedExperiences: Experience[];
  auditChecks: string[];
  bulletDraft: BulletDraft;
  savedBullets: SavedBullet[];
  editingBulletId: string | null;
  selectedNumberIdeas: string[];
  impactDraft: ImpactDraft;
  savedImpacts: ImpactDraft[];
  selectedAthleteBulletExamples: string[];
  athleteBulletDraft: string;
  savedAthleteBullets: string[];
  tailoredOpportunity: TailoredOpportunity;
  selectedKeywords: string[];
  resumeGaps: string[];
  selectedReviewer: string[];
  reviewPlan: ReviewPlan;
  confidenceRating: number;
  completionChecklist: string[];
  moduleStatus: "Not Started" | "In Progress" | "Completed";
  progressPercentage: number;
};

const emptyExperienceDraft: ExperienceDraft = {
  type: "Jobs",
  title: "",
  organization: "",
  dates: "",
  details: "",
};

const emptyBulletDraft: BulletDraft = {
  did: "",
  helped: "",
  skill: "",
  result: "",
  mattered: "",
  generated: "",
};

const emptyImpactDraft: ImpactDraft = {
  experience: "",
  metric: "",
  impact: "",
};

const emptyTailoredOpportunity: TailoredOpportunity = {
  opportunityType: "",
  title: "",
  organization: "",
  responsibilities: ["", "", ""],
  requiredSkills: ["", "", ""],
  naturalWords: "",
};

const emptyReviewPlan: ReviewPlan = {
  reviewerName: "",
  sendDate: "",
  tailoredFor: "",
};

const initialState: ResumeReviewState = {
  overviewReviewed: false,
  hasResume: "",
  lastUpdated: "",
  usedToApply: "",
  preparingFor: [],
  experiencePrompt: "",
  selectedExperienceTypes: [],
  experienceDraft: emptyExperienceDraft,
  savedExperiences: [],
  auditChecks: [],
  bulletDraft: emptyBulletDraft,
  savedBullets: [],
  editingBulletId: null,
  selectedNumberIdeas: [],
  impactDraft: emptyImpactDraft,
  savedImpacts: [],
  selectedAthleteBulletExamples: [],
  athleteBulletDraft: "",
  savedAthleteBullets: [],
  tailoredOpportunity: emptyTailoredOpportunity,
  selectedKeywords: [],
  resumeGaps: [],
  selectedReviewer: [],
  reviewPlan: emptyReviewPlan,
  confidenceRating: 5,
  completionChecklist: [],
  moduleStatus: "Not Started",
  progressPercentage: 0,
};

export function ResumeReviewUpdateClient() {
  const [form, setForm] = useState<ResumeReviewState>(initialState);
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [loaded, setLoaded] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Partial<ResumeReviewState>;
        setForm({
          ...initialState,
          ...parsed,
          experienceDraft: { ...emptyExperienceDraft, ...parsed.experienceDraft },
          bulletDraft: { ...emptyBulletDraft, ...parsed.bulletDraft },
          impactDraft: { ...emptyImpactDraft, ...parsed.impactDraft },
          tailoredOpportunity: { ...emptyTailoredOpportunity, ...parsed.tailoredOpportunity },
          reviewPlan: { ...emptyReviewPlan, ...parsed.reviewPlan },
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
    if (form.moduleStatus === "Completed") {
      return { completed: 11, total: 11, percent: 100 };
    }
    const totalAuditItems = auditSections.flatMap((section) => section.items).length;
    const sections = [
      form.overviewReviewed,
      form.hasResume && form.lastUpdated.trim().length > 0 && form.usedToApply && form.preparingFor.length > 0,
      form.experiencePrompt.trim().length > 0 && form.savedExperiences.length > 0,
      form.auditChecks.length === totalAuditItems,
      form.savedBullets.length > 0,
      form.selectedNumberIdeas.length > 0 && form.savedImpacts.length > 0,
      form.savedAthleteBullets.length > 0,
      form.tailoredOpportunity.opportunityType &&
        form.tailoredOpportunity.title.trim().length > 0 &&
        form.tailoredOpportunity.organization.trim().length > 0 &&
        form.tailoredOpportunity.responsibilities.every((value) => value.trim().length > 0) &&
        form.tailoredOpportunity.requiredSkills.every((value) => value.trim().length > 0) &&
        form.selectedKeywords.length > 0 &&
        form.tailoredOpportunity.naturalWords.trim().length > 0,
      form.resumeGaps.length > 0,
      form.selectedReviewer.length > 0 &&
        form.reviewPlan.reviewerName.trim().length > 0 &&
        form.reviewPlan.sendDate.trim().length > 0 &&
        form.reviewPlan.tailoredFor.trim().length > 0,
      form.completionChecklist.length === completionChecklistItems.length,
    ];
    const completed = sections.filter(Boolean).length;

    return {
      completed,
      total: sections.length,
      percent: Math.round((completed / sections.length) * 100),
    };
  }, [form]);

  const status = form.moduleStatus === "Completed" ? "Completed" : completion.percent === 0 ? "Not Started" : "In Progress";

  useEffect(() => {
    if (!loaded) return;
    if (form.moduleStatus === status && form.progressPercentage === completion.percent) return;
    setForm((current) => ({ ...current, moduleStatus: status, progressPercentage: completion.percent }));
  }, [completion.percent, form.moduleStatus, form.progressPercentage, loaded, status]);

  function updateField<Key extends keyof ResumeReviewState>(key: Key, value: ResumeReviewState[Key]) {
    setForm((current) => ({ ...current, [key]: value, moduleStatus: key === "moduleStatus" ? (value as ResumeReviewState["moduleStatus"]) : "In Progress" }));
    setSavedMessage("");
  }

  function toggleList(key: "preparingFor" | "selectedExperienceTypes" | "auditChecks" | "selectedNumberIdeas" | "selectedAthleteBulletExamples" | "selectedKeywords" | "resumeGaps" | "selectedReviewer" | "completionChecklist", item: string) {
    setForm((current) => ({
      ...current,
      [key]: current[key].includes(item) ? current[key].filter((value) => value !== item) : [...current[key], item],
      moduleStatus: "In Progress",
    }));
    setSavedMessage("");
  }

  function updateExperienceDraft<Key extends keyof ExperienceDraft>(key: Key, value: ExperienceDraft[Key]) {
    setForm((current) => ({ ...current, experienceDraft: { ...current.experienceDraft, [key]: value } }));
    setSavedMessage("");
  }

  function addExperience() {
    const draft = form.experienceDraft;
    if (!draft.title.trim() && !draft.details.trim()) return;
    setForm((current) => ({
      ...current,
      selectedExperienceTypes: current.selectedExperienceTypes.includes(draft.type)
        ? current.selectedExperienceTypes
        : [...current.selectedExperienceTypes, draft.type],
      savedExperiences: [...current.savedExperiences, { ...draft, id: `${Date.now()}` }],
      experienceDraft: emptyExperienceDraft,
    }));
    setSavedMessage("");
  }

  function removeExperience(id: string) {
    setForm((current) => ({
      ...current,
      savedExperiences: current.savedExperiences.filter((experience) => experience.id !== id),
    }));
    setSavedMessage("");
  }

  function updateBulletDraft<Key extends keyof BulletDraft>(key: Key, value: BulletDraft[Key]) {
    setForm((current) => ({ ...current, bulletDraft: { ...current.bulletDraft, [key]: value } }));
    setSavedMessage("");
  }

  function generateBulletDraft() {
    const parts = [
      form.bulletDraft.did.trim() || "Completed assigned responsibilities",
      form.bulletDraft.helped.trim() ? `for ${form.bulletDraft.helped.trim()}` : "",
      form.bulletDraft.skill.trim() ? `using ${form.bulletDraft.skill.trim()}` : "",
      form.bulletDraft.result.trim() ? `resulting in ${form.bulletDraft.result.trim()}` : "",
      form.bulletDraft.mattered.trim() ? `to ${form.bulletDraft.mattered.trim()}` : "",
    ].filter(Boolean);
    updateBulletDraft("generated", `${parts.join(" ")}.`);
  }

  function saveBulletPoint() {
    const generated = form.bulletDraft.generated.trim();
    if (!generated) return;
    setForm((current) => {
      const bullet = { ...current.bulletDraft, id: current.editingBulletId ?? `${Date.now()}` };
      return {
        ...current,
        savedBullets: current.editingBulletId
          ? current.savedBullets.map((item) => (item.id === current.editingBulletId ? bullet : item))
          : [...current.savedBullets, bullet],
        bulletDraft: emptyBulletDraft,
        editingBulletId: null,
      };
    });
    setSavedMessage("");
  }

  function editBulletPoint(bullet: SavedBullet) {
    setForm((current) => ({ ...current, bulletDraft: bullet, editingBulletId: bullet.id }));
    setActiveTab("Bullet Lab");
  }

  function deleteBulletPoint(id: string) {
    setForm((current) => ({ ...current, savedBullets: current.savedBullets.filter((bullet) => bullet.id !== id) }));
    setSavedMessage("");
  }

  function updateImpactDraft<Key extends keyof ImpactDraft>(key: Key, value: ImpactDraft[Key]) {
    setForm((current) => ({ ...current, impactDraft: { ...current.impactDraft, [key]: value } }));
    setSavedMessage("");
  }

  function saveImpact() {
    if (!form.impactDraft.experience.trim() && !form.impactDraft.metric.trim()) return;
    setForm((current) => ({
      ...current,
      savedImpacts: [...current.savedImpacts, current.impactDraft],
      impactDraft: emptyImpactDraft,
    }));
    setSavedMessage("");
  }

  function saveAthleteBullet() {
    const bullet = form.athleteBulletDraft.trim();
    if (!bullet) return;
    setForm((current) => ({
      ...current,
      savedAthleteBullets: [...current.savedAthleteBullets, bullet],
      athleteBulletDraft: "",
      moduleStatus: "In Progress",
    }));
    setSavedMessage("");
  }

  function deleteAthleteBullet(index: number) {
    setForm((current) => ({
      ...current,
      savedAthleteBullets: current.savedAthleteBullets.filter((_, bulletIndex) => bulletIndex !== index),
      moduleStatus: "In Progress",
    }));
  }

  function updateTailoredOpportunity<Key extends keyof TailoredOpportunity>(key: Key, value: TailoredOpportunity[Key]) {
    setForm((current) => ({
      ...current,
      tailoredOpportunity: { ...current.tailoredOpportunity, [key]: value },
      moduleStatus: "In Progress",
    }));
    setSavedMessage("");
  }

  function updateTailoredList(key: "responsibilities" | "requiredSkills", index: number, value: string) {
    setForm((current) => {
      const next = [...current.tailoredOpportunity[key]];
      next[index] = value;
      return {
        ...current,
        tailoredOpportunity: { ...current.tailoredOpportunity, [key]: next },
        moduleStatus: "In Progress",
      };
    });
    setSavedMessage("");
  }

  function updateReviewPlan<Key extends keyof ReviewPlan>(key: Key, value: ReviewPlan[Key]) {
    setForm((current) => ({
      ...current,
      reviewPlan: { ...current.reviewPlan, [key]: value },
      moduleStatus: "In Progress",
    }));
    setSavedMessage("");
  }

  function completeModule() {
    setForm((current) => ({ ...current, moduleStatus: "Completed", progressPercentage: 100 }));
    setSavedMessage("Great work! Your resume should grow with you. Every semester, update it while your experiences are still fresh.");
  }

  function saveProgress() {
    window.localStorage.setItem(storageKey, JSON.stringify(form));
    setSavedMessage("Progress saved on this device.");
  }

  function resetModule() {
    window.localStorage.removeItem(storageKey);
    setForm(initialState);
    setActiveTab("Overview");
    setSavedMessage("Module reset.");
  }

  return (
    <div className="space-y-6">
      <GhostButton href="/roadmaps/sophomore">Back to Sophomore Roadmap</GhostButton>

      <section className="card-surface rounded-lg p-6 md:p-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-aggie-silver">Sophomore Roadmap</p>
            <h1 className="text-glow mt-3 text-4xl font-black tracking-tight text-white md:text-5xl">
              Resume Review & Update
            </h1>
            <p className="mt-4 text-lg leading-8 text-aggie-light/78">
              Review your current resume, add new experiences, strengthen your bullet points, and
              prepare for internships, jobs, leadership roles, or future career opportunities.
            </p>
            <p className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-aggie-muted">
              <Timer className="h-4 w-4" />
              Estimated Time: 25-35 Minutes
            </p>
          </div>
          <ProgressPanel completed={completion.completed} percent={completion.percent} status={status} total={completion.total} />
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_0.75fr]">
        <div className="card-surface rounded-lg p-3">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`min-h-11 rounded-lg border px-3 text-sm font-black transition ${
                  activeTab === tab
                    ? "chrome-surface border-aggie-chrome/60 text-aggie-navy shadow-steel"
                    : "border-aggie-silver/15 text-aggie-light/78 hover:border-aggie-steel hover:bg-white/10"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <Card title="Quick Actions" icon={<Save className="h-6 w-6" />}>
          <p className="leading-7 text-aggie-light/74">
            Your resume review is stored locally in this browser for prototype testing.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row xl:flex-col">
            <ActionButton onClick={saveProgress} icon={<Save className="h-4 w-4" />} primary>
              Save Progress
            </ActionButton>
            <ActionButton onClick={resetModule} icon={<RotateCcw className="h-4 w-4" />}>
              Reset Module
            </ActionButton>
          </div>
          {savedMessage && <p className="mt-4 text-sm font-bold text-aggie-ice">{savedMessage}</p>}
        </Card>
      </section>

      {activeTab === "Overview" && (
        <Card title="Module Overview" icon={<Sparkles className="h-6 w-6" />}>
          <CheckboxRow
            label="I reviewed the goals for this resume update."
            checked={form.overviewReviewed}
            onChange={(value) => updateField("overviewReviewed", value)}
          />
        </Card>
      )}

      {activeTab === "Check-In" && (
        <Card title="Resume Check-In" icon={<FileText className="h-6 w-6" />}>
          <div className="grid gap-6">
            <RadioGroup
              title="Do you currently have a resume?"
              options={yesNoUnsure}
              selected={form.hasResume}
              onSelect={(value) => updateField("hasResume", value)}
            />
            <TextInput
              label="When was the last time you updated it?"
              value={form.lastUpdated}
              onChange={(value) => updateField("lastUpdated", value)}
            />
            <RadioGroup
              title="Have you used it to apply for anything yet?"
              options={yesNoUnsure}
              selected={form.usedToApply}
              onSelect={(value) => updateField("usedToApply", value)}
            />
            <ChoiceGroup
              title="What type of opportunity are you preparing for?"
              options={opportunityOptions}
              selected={form.preparingFor}
              onToggle={(item) => toggleList("preparingFor", item)}
            />
          </div>
        </Card>
      )}

      {activeTab === "New Experience" && (
        <Card title="What Changed Since Freshman Year?" icon={<Plus className="h-6 w-6" />}>
          <TextArea
            label="What have you done since your last resume update that deserves to be added?"
            value={form.experiencePrompt}
            onChange={(value) => updateField("experiencePrompt", value)}
          />
          <div className="mt-6">
            <ChoiceGroup
              title="Select experience areas to review"
              options={experienceTypes}
              selected={form.selectedExperienceTypes}
              onToggle={(item) => toggleList("selectedExperienceTypes", item)}
            />
          </div>
          <div className="mt-6 rounded-lg border border-aggie-silver/15 bg-white/[0.045] p-5">
            <h3 className="text-lg font-black text-white">Add New Experience</h3>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <label className="block">
                <span className="text-sm font-black text-white">Experience Type</span>
                <select
                  value={form.experienceDraft.type}
                  onChange={(event) => updateExperienceDraft("type", event.target.value)}
                  className="mt-3 min-h-12 w-full rounded-lg border border-aggie-silver/15 bg-aggie-navy/78 px-4 text-sm text-white outline-none transition focus:border-aggie-steel"
                >
                  {experienceTypes.map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </select>
              </label>
              <TextInput
                label="Title / Role / Award"
                value={form.experienceDraft.title}
                onChange={(value) => updateExperienceDraft("title", value)}
              />
              <TextInput
                label="Organization"
                value={form.experienceDraft.organization}
                onChange={(value) => updateExperienceDraft("organization", value)}
              />
              <TextInput
                label="Dates"
                value={form.experienceDraft.dates}
                onChange={(value) => updateExperienceDraft("dates", value)}
              />
              <div className="lg:col-span-2">
                <TextArea
                  label="Details to add to your resume"
                  value={form.experienceDraft.details}
                  onChange={(value) => updateExperienceDraft("details", value)}
                />
              </div>
            </div>
            <div className="mt-5">
              <ActionButton onClick={addExperience} icon={<Plus className="h-4 w-4" />} primary>
                Add New Experience
              </ActionButton>
            </div>
          </div>

          {form.savedExperiences.length > 0 && (
            <div className="mt-6 grid gap-3">
              {form.savedExperiences.map((experience) => (
                <article key={experience.id} className="rounded-lg border border-aggie-silver/15 bg-aggie-navy/70 p-4">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="text-sm font-black uppercase tracking-[0.16em] text-aggie-silver">{experience.type}</p>
                      <h3 className="mt-2 text-lg font-black text-white">{experience.title || "Untitled experience"}</h3>
                      <p className="mt-1 text-sm font-bold text-aggie-light/78">
                        {[experience.organization, experience.dates].filter(Boolean).join(" | ")}
                      </p>
                      <p className="mt-3 text-sm leading-6 text-aggie-light/78">{experience.details}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeExperience(experience.id)}
                      className="grid h-10 w-10 place-items-center rounded-lg border border-aggie-silver/20 text-white transition hover:border-aggie-steel hover:bg-white/10"
                      aria-label={`Delete ${experience.title || "experience"}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </Card>
      )}

      {activeTab === "Audit" && (
        <Card title="Resume Section Audit" icon={<ClipboardCheck className="h-6 w-6" />}>
          <div className="grid gap-4 xl:grid-cols-2">
            {auditSections.map((section) => {
              const complete = section.items.every((item) => form.auditChecks.includes(item));
              return (
                <article key={section.title} className="rounded-lg border border-aggie-silver/15 bg-white/[0.045] p-5">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <h3 className="text-xl font-black text-white">{section.title}</h3>
                    <span className="text-sm font-black text-aggie-ice">
                      {complete ? "Complete" : `${section.items.filter((item) => form.auditChecks.includes(item)).length}/${section.items.length}`}
                    </span>
                  </div>
                  <div className="grid gap-3">
                    {section.items.map((item) => (
                      <CheckboxRow
                        key={item}
                        label={item}
                        checked={form.auditChecks.includes(item)}
                        onChange={() => toggleList("auditChecks", item)}
                      />
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </Card>
      )}

      {activeTab === "Bullet Lab" && (
        <Card title="Bullet Point Upgrade Lab" icon={<FileText className="h-6 w-6" />}>
          <div className="rounded-lg border border-aggie-silver/15 bg-white/[0.045] p-5">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-aggie-silver">Formula</p>
            <p className="mt-2 text-xl font-black text-white">
              Action Verb + What You Did + How/Why + Result/Impact
            </p>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            <ExampleCard label="Weak" text="Helped with youth camp." />
            <ExampleCard
              label="Better"
              text="Supported youth camp operations by leading skill stations, organizing drills, and assisting with athlete supervision."
            />
            <ExampleCard
              label="Stronger"
              text="Led skill-development stations for 40+ youth camp participants while supporting daily operations, athlete supervision, and participant engagement."
            />
          </div>

          <div className="mt-6 rounded-lg border border-aggie-silver/15 bg-white/[0.045] p-5">
            <h3 className="text-lg font-black text-white">Bullet Point Builder</h3>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <TextInput label="What did you do?" value={form.bulletDraft.did} onChange={(value) => updateBulletDraft("did", value)} />
              <TextInput label="Who did it help?" value={form.bulletDraft.helped} onChange={(value) => updateBulletDraft("helped", value)} />
              <TextInput label="What skill did you use?" value={form.bulletDraft.skill} onChange={(value) => updateBulletDraft("skill", value)} />
              <TextInput label="Was there a number or result?" value={form.bulletDraft.result} onChange={(value) => updateBulletDraft("result", value)} />
              <div className="lg:col-span-2">
                <TextArea label="Why did it matter?" value={form.bulletDraft.mattered} onChange={(value) => updateBulletDraft("mattered", value)} />
              </div>
              <div className="lg:col-span-2">
                <TextArea label="Generated bullet point draft" value={form.bulletDraft.generated} onChange={(value) => updateBulletDraft("generated", value)} />
              </div>
            </div>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <ActionButton onClick={generateBulletDraft} icon={<FileText className="h-4 w-4" />} primary>
                Generate Bullet Point Draft
              </ActionButton>
              <ActionButton onClick={saveBulletPoint} icon={<Save className="h-4 w-4" />}>
                {form.editingBulletId ? "Edit Bullet Point" : "Save Bullet Point"}
              </ActionButton>
            </div>
          </div>

          {form.savedBullets.length > 0 && (
            <div className="mt-6 grid gap-3">
              {form.savedBullets.map((bullet) => (
                <article key={bullet.id} className="rounded-lg border border-aggie-silver/15 bg-aggie-navy/70 p-4">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <p className="text-sm leading-6 text-aggie-light/86">{bullet.generated}</p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => editBulletPoint(bullet)}
                        className="min-h-10 rounded-lg border border-aggie-silver/20 px-3 text-sm font-bold text-white transition hover:border-aggie-steel hover:bg-white/10"
                      >
                        Edit Bullet Point
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteBulletPoint(bullet.id)}
                        className="grid h-10 w-10 place-items-center rounded-lg border border-aggie-silver/20 text-white transition hover:border-aggie-steel hover:bg-white/10"
                        aria-label="Delete bullet point"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </Card>
      )}

      {activeTab === "Impact" && (
        <Card title="Add Numbers & Impact" icon={<Plus className="h-6 w-6" />}>
          <div className="rounded-lg border border-aggie-silver/15 bg-white/[0.045] p-5">
            <h3 className="text-xl font-black text-white">Numbers make resume experience stronger.</h3>
            <p className="mt-3 leading-7 text-aggie-light/78">
              A number helps employers understand scope, consistency, leadership, and results.
            </p>
          </div>
          <div className="mt-6">
            <ChoiceGroup
              title="Which numbers could you add to your resume?"
              options={numberIdeas}
              selected={form.selectedNumberIdeas}
              onToggle={(item) => toggleList("selectedNumberIdeas", item)}
            />
          </div>
          <div className="mt-6 rounded-lg border border-aggie-silver/15 bg-white/[0.045] p-5">
            <h3 className="text-lg font-black text-white">Impact Activity</h3>
            <div className="mt-4 grid gap-4 lg:grid-cols-3">
              <TextInput label="Experience" value={form.impactDraft.experience} onChange={(value) => updateImpactDraft("experience", value)} />
              <TextInput label="Number / metric" value={form.impactDraft.metric} onChange={(value) => updateImpactDraft("metric", value)} />
              <TextInput label="Impact statement" value={form.impactDraft.impact} onChange={(value) => updateImpactDraft("impact", value)} />
            </div>
            <div className="mt-5">
              <ActionButton onClick={saveImpact} icon={<Save className="h-4 w-4" />} primary>
                Save Impact Statement
              </ActionButton>
            </div>
          </div>

          {form.savedImpacts.length > 0 && (
            <div className="mt-6 grid gap-3">
              {form.savedImpacts.map((impact, index) => (
                <article key={`${impact.experience}-${index}`} className="rounded-lg border border-aggie-silver/15 bg-aggie-navy/70 p-4">
                  <p className="text-sm font-black uppercase tracking-[0.16em] text-aggie-silver">{impact.experience || "Experience"}</p>
                  <p className="mt-2 text-lg font-black text-white">{impact.metric || "Metric"}</p>
                  <p className="mt-2 text-sm leading-6 text-aggie-light/78">{impact.impact}</p>
                </article>
              ))}
            </div>
          )}
        </Card>
      )}

      {activeTab === "Athlete Refresh" && (
        <Card title="Student-Athlete Experience Refresh" icon={<Sparkles className="h-6 w-6" />}>
          <p className="leading-7 text-aggie-light/78">
            Sophomore student-athlete resume language should become more specific than freshman year.
          </p>
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <ExampleCard label="Freshman version" text="Balanced academics and athletics." />
            <ExampleCard
              label="Sophomore version"
              text="Managed a 20+ hour weekly athletic commitment while maintaining academic progress and contributing to team performance goals."
            />
          </div>
          <div className="mt-6">
            <ChoiceGroup
              title="Selectable student-athlete bullet examples"
              options={athleteBulletExamples}
              selected={form.selectedAthleteBulletExamples}
              onToggle={(item) => toggleList("selectedAthleteBulletExamples", item)}
            />
          </div>
          <div className="mt-6 rounded-lg border border-aggie-silver/15 bg-white/[0.045] p-5">
            <TextArea
              label="Write your own student-athlete resume bullet"
              value={form.athleteBulletDraft}
              onChange={(value) => updateField("athleteBulletDraft", value)}
            />
            <div className="mt-5">
              <ActionButton onClick={saveAthleteBullet} icon={<Save className="h-4 w-4" />} primary>
                Save Athlete Bullet
              </ActionButton>
            </div>
          </div>
          {form.savedAthleteBullets.length > 0 && (
            <div className="mt-6 grid gap-3">
              {form.savedAthleteBullets.map((bullet, index) => (
                <article key={`${bullet}-${index}`} className="rounded-lg border border-aggie-silver/15 bg-aggie-navy/70 p-4">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <p className="text-sm leading-6 text-aggie-light/86">{bullet}</p>
                    <button
                      type="button"
                      onClick={() => deleteAthleteBullet(index)}
                      className="grid h-10 w-10 place-items-center rounded-lg border border-aggie-silver/20 text-white transition hover:border-aggie-steel hover:bg-white/10"
                      aria-label="Delete athlete bullet"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </Card>
      )}

      {activeTab === "Tailor" && (
        <Card title="Tailor Resume to One Opportunity" icon={<FileText className="h-6 w-6" />}>
          <RadioGroup
            title="Choose one opportunity"
            options={tailorOpportunityOptions}
            selected={form.tailoredOpportunity.opportunityType}
            onSelect={(value) => updateTailoredOpportunity("opportunityType", value)}
          />
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <TextInput label="Job / Opportunity Title" value={form.tailoredOpportunity.title} onChange={(value) => updateTailoredOpportunity("title", value)} />
            <TextInput label="Organization" value={form.tailoredOpportunity.organization} onChange={(value) => updateTailoredOpportunity("organization", value)} />
          </div>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="grid gap-4">
              {[0, 1, 2].map((index) => (
                <TextInput
                  key={`responsibility-${index}`}
                  label={`Responsibility ${index + 1}`}
                  value={form.tailoredOpportunity.responsibilities[index]}
                  onChange={(value) => updateTailoredList("responsibilities", index, value)}
                />
              ))}
            </div>
            <div className="grid gap-4">
              {[0, 1, 2].map((index) => (
                <TextInput
                  key={`skill-${index}`}
                  label={`Required Skill ${index + 1}`}
                  value={form.tailoredOpportunity.requiredSkills[index]}
                  onChange={(value) => updateTailoredList("requiredSkills", index, value)}
                />
              ))}
            </div>
          </div>
          <div className="mt-6">
            <ChoiceGroup
              title="Suggested keywords"
              options={suggestedKeywords}
              selected={form.selectedKeywords}
              onToggle={(item) => toggleList("selectedKeywords", item)}
            />
          </div>
          <div className="mt-6">
            <TextArea
              label="Which words from this opportunity should show up naturally in your resume?"
              value={form.tailoredOpportunity.naturalWords}
              onChange={(value) => updateTailoredOpportunity("naturalWords", value)}
            />
          </div>
        </Card>
      )}

      {activeTab === "Gaps" && (
        <Card title="Resume Gap Finder" icon={<ClipboardCheck className="h-6 w-6" />}>
          <ChoiceGroup
            title="What is missing from your resume right now?"
            options={resumeGapOptions}
            selected={form.resumeGaps}
            onToggle={(item) => toggleList("resumeGaps", item)}
          />
          {form.resumeGaps.length > 0 && (
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {Array.from(new Set(form.resumeGaps.flatMap((gap) => gapRecommendations[gap] ?? []))).map((recommendation) => (
                <div key={recommendation} className="rounded-lg border border-aggie-silver/15 bg-white/[0.045] p-4 text-sm font-bold leading-6 text-aggie-light/86">
                  {recommendation}
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {activeTab === "Review Plan" && (
        <Card title="Resume Review Plan" icon={<ClipboardCheck className="h-6 w-6" />}>
          <ChoiceGroup
            title="Choose at least one reviewer"
            options={reviewerOptions}
            selected={form.selectedReviewer}
            onToggle={(item) => toggleList("selectedReviewer", item)}
          />
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <TextInput label="Who will review my resume?" value={form.reviewPlan.reviewerName} onChange={(value) => updateReviewPlan("reviewerName", value)} />
            <DateInput label="When will I send it?" value={form.reviewPlan.sendDate} onChange={(value) => updateReviewPlan("sendDate", value)} />
            <TextInput label="What opportunity am I tailoring it for?" value={form.reviewPlan.tailoredFor} onChange={(value) => updateReviewPlan("tailoredFor", value)} />
          </div>
        </Card>
      )}

      {activeTab === "Complete" && (
        <div className="space-y-6">
          <Card title="Completion Assessment" icon={<Check className="h-6 w-6" />}>
            <h3 className="text-sm font-black uppercase tracking-[0.18em] text-aggie-silver">
              How confident are you that your resume is stronger than it was freshman year?
            </h3>
            <div className="mt-4 grid grid-cols-5 gap-2 md:grid-cols-10">
              {Array.from({ length: 10 }, (_, index) => index + 1).map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => updateField("confidenceRating", rating)}
                  className={`min-h-11 rounded-lg border text-sm font-black transition ${
                    form.confidenceRating === rating
                      ? "chrome-surface border-aggie-chrome/60 text-aggie-navy shadow-steel"
                      : "border-aggie-silver/20 text-aggie-light/78 hover:border-aggie-steel hover:bg-white/10"
                  }`}
                >
                  {rating}
                </button>
              ))}
            </div>
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {completionChecklistItems.map((item) => (
                <CheckboxRow
                  key={item}
                  label={item}
                  checked={form.completionChecklist.includes(item)}
                  onChange={() => toggleList("completionChecklist", item)}
                />
              ))}
            </div>
            <div className="mt-6">
              <ActionButton onClick={completeModule} icon={<Check className="h-4 w-4" />} primary>
                Complete Resume Review & Update Module
              </ActionButton>
            </div>
            {form.moduleStatus === "Completed" && (
              <p className="mt-5 rounded-lg border border-aggie-chrome/30 bg-white/[0.08] p-4 text-sm font-bold leading-6 text-aggie-ice">
                Great work! Your resume should grow with you. Every semester, update it while your experiences are still fresh.
              </p>
            )}
          </Card>

          <Card title="Admin Preview" icon={<BarChart3 className="h-6 w-6" />}>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <AdminStat label="Completion Status" value={status} />
              <AdminStat label="Most common resume gaps" value={topItems([...mockAdmin.gaps, ...form.resumeGaps]).join(", ") || "No gaps selected"} />
              <AdminStat label="Average resume confidence" value={`${average([...mockAdmin.confidence, form.confidenceRating])}/10`} />
              <AdminStat label="Number of students needing resume review" value={`${mockAdmin.needsReview + (form.selectedReviewer.length ? 1 : 0)}`} />
              <AdminStat label="Selected Aggies Lead Staff as reviewer" value={`${mockAdmin.aggiesLeadReviewers + (form.selectedReviewer.includes("Aggies Lead Staff") ? 1 : 0)}`} />
            </div>
          </Card>
        </div>
      )}

      <section className="card-surface rounded-lg p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-aggie-silver">Module Progress</p>
            <h2 className="mt-2 text-2xl font-black text-white">{status}</h2>
            <p className="mt-2 leading-7 text-aggie-light/74">
              Move through each tab to update your resume with sophomore-year experience.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/roadmaps/sophomore"
              className="inline-flex min-h-12 items-center justify-center rounded-lg border border-aggie-silver/25 px-5 text-sm font-bold text-white transition hover:border-aggie-steel hover:bg-white/10"
            >
              Back to Roadmap
            </Link>
          </div>
        </div>
      </section>
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
      <p className="mt-3 text-sm font-medium text-aggie-light/72">{completed} of {total} sections complete</p>
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

function ExampleCard({ label, text }: { label: string; text: string }) {
  return (
    <div className="rounded-lg border border-aggie-silver/15 bg-white/[0.045] p-4">
      <p className="text-sm font-black uppercase tracking-[0.18em] text-aggie-silver">{label}</p>
      <p className="mt-3 text-sm font-bold leading-6 text-aggie-light/86">{text}</p>
    </div>
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

function topItems(values: string[], limit = 3) {
  const counts = values.reduce<Record<string, number>>((acc, value) => {
    acc[value] = (acc[value] ?? 0) + 1;
    return acc;
  }, {});
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([value]) => value);
}

function average(values: number[]) {
  return (values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(1);
}

function RadioGroup<Option extends string>({ title, options, selected, onSelect }: { title: string; options: readonly Option[]; selected: Option | ""; onSelect: (value: Option) => void }) {
  return (
    <div>
      <h3 className="text-sm font-black uppercase tracking-[0.18em] text-aggie-silver">{title}</h3>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onSelect(option)}
            className={`min-h-11 rounded-lg border px-3 text-sm font-bold transition ${
              selected === option
                ? "chrome-surface border-aggie-chrome/60 text-aggie-navy shadow-steel"
                : "border-aggie-silver/20 text-aggie-light/78 hover:border-aggie-steel hover:bg-white/10"
            }`}
          >
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
      <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onToggle(option)}
            className={`flex min-h-12 items-center gap-3 rounded-lg border px-3 text-left text-sm font-bold transition ${
              selected.includes(option)
                ? "border-aggie-chrome/50 bg-white/[0.09] text-white"
                : "border-aggie-silver/15 bg-white/[0.045] text-aggie-light/78 hover:border-aggie-steel hover:bg-white/10"
            }`}
          >
            <CheckBoxMark active={selected.includes(option)} />
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

function TextInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
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

function DateInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="text-sm font-black text-white">{label}</span>
      <input
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-3 min-h-12 w-full rounded-lg border border-aggie-silver/15 bg-aggie-navy/78 px-4 text-sm text-white outline-none transition focus:border-aggie-steel"
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
        className="mt-3 min-h-28 w-full resize-y rounded-lg border border-aggie-silver/15 bg-aggie-navy/78 p-4 text-sm leading-6 text-white outline-none transition placeholder:text-aggie-muted focus:border-aggie-steel"
        placeholder="Write your response..."
      />
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

function ActionButton({ children, onClick, icon, primary = false }: { children: React.ReactNode; onClick: () => void; icon: React.ReactNode; primary?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${primary ? "chrome-surface border-aggie-chrome/60 text-aggie-navy shadow-glow hover:brightness-110" : "border-aggie-silver/25 text-white hover:border-aggie-steel hover:bg-white/10"} inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border px-5 text-sm font-black transition`}
    >
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

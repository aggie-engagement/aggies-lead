"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  Check,
  Handshake,
  Layers3,
  MessageCircle,
  Network,
  Plus,
  RotateCcw,
  Save,
  Sparkles,
  Timer,
  Trash2,
  UsersRound,
  X,
} from "lucide-react";
import { GhostButton } from "@/components/Prototype";
import { nextFreshmanModuleHref } from "@/lib/roadmaps";

const storageKey = "aggies-lead:freshman:intro-networking";

const tabs = ["Overview", "Foundation", "People", "Message", "Follow-Up", "Tracker", "LinkedIn", "Challenge", "Complete"] as const;
const opportunityExamples = ["Starting position", "Leadership role", "Internship", "Job", "Scholarship", "Team opportunity"];
const contactStatuses = ["Not Contacted", "Introduced", "Conversation Completed", "Following Up", "Mentor"] as const;
const challengeItems = ["1 Coach", "1 Professor", "1 Former Student-Athlete", "1 Aggie Alumni", "1 Professional in a Field of Interest"];

const whyNetworkingMatters = [
  "Networking is one of the most powerful career tools student-athletes can build.",
  "Networking is not just asking someone for a job.",
  "Networking is building genuine relationships over time.",
  "Opportunities often come from relationships, referrals, recommendations, and introductions.",
  "Networking can lead to internships, jobs, mentorships, graduate school opportunities, professional contracts, business partnerships, career advice, and opportunities you may never have known existed.",
];

const connectionCategories = [
  { title: "Coaches", why: ["Connected to alumni", "Connected to industry professionals", "Can recommend you or introduce you to others"] },
  { title: "Former Student-Athletes", why: ["Understand the student-athlete experience", "Often willing to help current Aggies", "Can explain how athletics translated into their career"] },
  { title: "Professors", why: ["Have industry expertise", "Can connect you with research, graduate school, or professional opportunities"] },
  { title: "Academic Advisors", why: ["Know campus resources", "Can help connect academic plans with career goals"] },
  { title: "Employers", why: ["Can share industry insights", "May know about internships, jobs, or future opportunities"] },
  { title: "Family & Friends", why: ["Often overlooked", "Can be the easiest place to start"] },
  { title: "Teammates", why: ["Future professionals", "Future business partners", "Future referrals"] },
  { title: "Aggie Alumni", why: ["Shared Utah State connection", "Often eager to support current student-athletes"] },
];

const ladderSteps = [
  "Follow on LinkedIn",
  "Send Connection Request",
  "Send Short Introduction",
  "Ask Questions",
  "Stay Connected",
  "Offer Updates",
  "Continue the Relationship",
];

const messageTemplates = {
  "LinkedIn Connection Request": "Hi [Name], I am a student-athlete at Utah State and came across your profile. I would love to connect and learn more about your career path.",
  "Alumni Outreach": "Hi [Name], I am a current student-athlete at Utah State. I noticed you are also an Aggie and I would love to learn more about your career journey and any advice you may have.",
  "Professor Outreach": "Hi Professor [Name], I am interested in learning more about [field/topic]. I was wondering if you would be open to sharing advice or pointing me toward helpful resources.",
  "Follow-Up After Conversation": "Hi [Name], thank you again for taking the time to speak with me. I really appreciated your advice about [topic]. I will keep you updated as I continue exploring this area.",
};

const linkedinHabits = [
  "Connect with alumni",
  "Connect with recruiters",
  "Connect with professors",
  "Connect with internship supervisors",
  "Follow companies",
  "Post or update occasionally",
  "Use LinkedIn to maintain relationships",
];

const completionChecklist = [
  "I understand why networking matters.",
  "I know networking is relationship-building, not just asking for a job.",
  "I can identify people to reach out to.",
  "I know how to send a simple networking message.",
  "I understand how to follow up.",
  "I can use a networking tracker.",
  "I understand how LinkedIn supports networking.",
];

type Tab = (typeof tabs)[number];
type ContactStatus = (typeof contactStatuses)[number];
type TemplateName = keyof typeof messageTemplates;

type NetworkingContact = {
  id: string;
  name: string;
  company: string;
  role: string;
  howYouKnowThem: string;
  lastContactDate: string;
  nextFollowUpDate: string;
  notes: string;
  relationshipStrength: number;
  status: ContactStatus;
};

type WeeklyReachOutPlan = {
  name: string;
  why: string;
  when: string;
  question: string;
};

type IntroNetworkingState = {
  overviewReviewed: boolean;
  opportunityReflection: string;
  selectedOpportunityExamples: string[];
  relationshipReflection: string;
  selectedNetworkingGroups: string[];
  customNetworkingInput: string;
  customNetworkingNames: string[];
  completedLadderSteps: string[];
  networkingLadderReflection: string;
  messageTemplate: TemplateName;
  messageName: string;
  messageConnectionType: string;
  messageReason: string;
  messageQuestion: string;
  generatedMessage: string;
  followUpUnderstanding: boolean;
  networkingContacts: NetworkingContact[];
  contactDraft: NetworkingContact;
  editingContactId: string | null;
  linkedinHabitsReviewed: string[];
  linkedinReflection: string;
  networkingChallengeProgress: string[];
  weeklyReachOutPlan: WeeklyReachOutPlan;
  confidenceRating: number;
  completionChecklist: string[];
  moduleStatus: "Not Started" | "In Progress" | "Completed";
  progressPercentage: number;
};

const emptyContact = (): NetworkingContact => ({
  id: "",
  name: "",
  company: "",
  role: "",
  howYouKnowThem: "",
  lastContactDate: "",
  nextFollowUpDate: "",
  notes: "",
  relationshipStrength: 3,
  status: "Not Contacted",
});

const initialState: IntroNetworkingState = {
  overviewReviewed: false,
  opportunityReflection: "",
  selectedOpportunityExamples: [],
  relationshipReflection: "",
  selectedNetworkingGroups: [],
  customNetworkingInput: "",
  customNetworkingNames: [],
  completedLadderSteps: [],
  networkingLadderReflection: "",
  messageTemplate: "LinkedIn Connection Request",
  messageName: "",
  messageConnectionType: "",
  messageReason: "",
  messageQuestion: "",
  generatedMessage: "",
  followUpUnderstanding: false,
  networkingContacts: [],
  contactDraft: emptyContact(),
  editingContactId: null,
  linkedinHabitsReviewed: [],
  linkedinReflection: "",
  networkingChallengeProgress: [],
  weeklyReachOutPlan: { name: "", why: "", when: "", question: "" },
  confidenceRating: 5,
  completionChecklist: [],
  moduleStatus: "Not Started",
  progressPercentage: 0,
};

const mockAdmin = {
  confidence: [7, 8, 6, 9, 8],
  groups: ["Aggie Alumni", "Coaches", "Former Student-Athletes", "Aggie Alumni", "Professors"],
  contactsAdded: 12,
  followUpsScheduled: 7,
  challengeRates: [80, 60, 100, 40, 80],
};

export function IntroNetworkingClient() {
  const [form, setForm] = useState<IntroNetworkingState>(initialState);
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [loaded, setLoaded] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Partial<IntroNetworkingState>;
        setForm({
          ...initialState,
          ...parsed,
          weeklyReachOutPlan: { ...initialState.weeklyReachOutPlan, ...parsed.weeklyReachOutPlan },
          contactDraft: { ...emptyContact(), ...parsed.contactDraft },
        });
      } catch {
        setForm(initialState);
      }
    }
    setLoaded(true);
  }, []);

  const completion = useMemo(() => {
    if (form.moduleStatus === "Completed") return { completed: 11, total: 11, percent: 100 };

    const startingConnections = form.selectedNetworkingGroups.length + form.customNetworkingNames.length;
    const sections = [
      form.overviewReviewed,
      form.opportunityReflection.trim().length > 0 && form.selectedOpportunityExamples.length > 0,
      form.relationshipReflection.trim().length > 0,
      startingConnections >= 3,
      form.completedLadderSteps.length > 0 && form.networkingLadderReflection.trim().length > 0,
      form.generatedMessage.trim().length > 0,
      form.followUpUnderstanding,
      form.networkingContacts.length > 0,
      form.linkedinReflection.trim().length > 0,
      form.networkingChallengeProgress.length === challengeItems.length && Object.values(form.weeklyReachOutPlan).every((value) => value.trim().length > 0),
      form.completionChecklist.length === completionChecklist.length,
    ];
    const completed = sections.filter(Boolean).length;
    return { completed, total: sections.length, percent: Math.round((completed / sections.length) * 100) };
  }, [form]);

  const status = form.moduleStatus === "Completed" ? "Completed" : completion.percent === 0 ? "Not Started" : "In Progress";
  const nextHref = nextFreshmanModuleHref("intro-to-networking");
  const admin = getAdminPreview(form);

  useEffect(() => {
    if (!loaded) return;
    const nextStatus = form.moduleStatus === "Completed" ? "Completed" : completion.percent === 0 ? "Not Started" : "In Progress";
    const nextForm = { ...form, moduleStatus: nextStatus, progressPercentage: completion.percent };
    window.localStorage.setItem(storageKey, JSON.stringify(nextForm));
  }, [completion.percent, form, loaded]);

  function updateField<Key extends keyof IntroNetworkingState>(key: Key, value: IntroNetworkingState[Key]) {
    setForm((current) => ({ ...current, [key]: value, moduleStatus: key === "moduleStatus" ? (value as IntroNetworkingState["moduleStatus"]) : "In Progress" }));
    setSavedMessage("");
  }

  function toggleList(key: "selectedOpportunityExamples" | "selectedNetworkingGroups" | "completedLadderSteps" | "linkedinHabitsReviewed" | "networkingChallengeProgress" | "completionChecklist", item: string) {
    setForm((current) => ({
      ...current,
      [key]: current[key].includes(item) ? current[key].filter((value) => value !== item) : [...current[key], item],
      moduleStatus: "In Progress",
    }));
    setSavedMessage("");
  }

  function addCustomConnection() {
    const value = form.customNetworkingInput.trim();
    if (!value) return;
    setForm((current) => ({
      ...current,
      customNetworkingInput: "",
      customNetworkingNames: current.customNetworkingNames.includes(value) ? current.customNetworkingNames : [...current.customNetworkingNames, value],
      moduleStatus: "In Progress",
    }));
    setSavedMessage("");
  }

  function removeCustomConnection(value: string) {
    setForm((current) => ({ ...current, customNetworkingNames: current.customNetworkingNames.filter((item) => item !== value), moduleStatus: "In Progress" }));
    setSavedMessage("");
  }

  function generateMessage() {
    const base = messageTemplates[form.messageTemplate];
    const name = form.messageName.trim() || "[Name]";
    const topic = form.messageReason.trim() || form.messageConnectionType.trim() || "[field/topic]";
    const question = form.messageQuestion.trim();
    const connection = form.messageConnectionType.trim();
    const generated = base
      .replaceAll("[Name]", name)
      .replaceAll("[field/topic]", topic)
      .replaceAll("[topic]", topic);
    const addOn = question || connection ? `\n\nA question I could ask: ${question || `What advice would you share about ${connection}?`}` : "";
    updateField("generatedMessage", `${generated}${addOn}`);
  }

  function updateContactDraft<Key extends keyof NetworkingContact>(key: Key, value: NetworkingContact[Key]) {
    setForm((current) => ({ ...current, contactDraft: { ...current.contactDraft, [key]: value }, moduleStatus: "In Progress" }));
    setSavedMessage("");
  }

  function addOrUpdateContact() {
    if (!form.contactDraft.name.trim()) return;
    setForm((current) => {
      const contact = { ...current.contactDraft, id: current.editingContactId ?? `${Date.now()}` };
      const contacts = current.editingContactId
        ? current.networkingContacts.map((item) => (item.id === current.editingContactId ? contact : item))
        : [...current.networkingContacts, contact];
      return { ...current, networkingContacts: contacts, contactDraft: emptyContact(), editingContactId: null, moduleStatus: "In Progress" };
    });
    setSavedMessage("");
  }

  function editContact(contact: NetworkingContact) {
    setForm((current) => ({ ...current, contactDraft: contact, editingContactId: contact.id }));
  }

  function deleteContact(id: string) {
    setForm((current) => ({ ...current, networkingContacts: current.networkingContacts.filter((contact) => contact.id !== id), moduleStatus: "In Progress" }));
  }

  function updateWeeklyPlan<Key extends keyof WeeklyReachOutPlan>(key: Key, value: WeeklyReachOutPlan[Key]) {
    setForm((current) => ({ ...current, weeklyReachOutPlan: { ...current.weeklyReachOutPlan, [key]: value }, moduleStatus: "In Progress" }));
  }

  function addWeeklyPlanToTracker() {
    if (!form.weeklyReachOutPlan.name.trim()) return;
    setForm((current) => ({
      ...current,
      networkingContacts: [
        ...current.networkingContacts,
        {
          ...emptyContact(),
          id: `${Date.now()}`,
          name: current.weeklyReachOutPlan.name,
          howYouKnowThem: current.weeklyReachOutPlan.why,
          nextFollowUpDate: current.weeklyReachOutPlan.when,
          notes: current.weeklyReachOutPlan.question,
          status: "Not Contacted",
        },
      ],
      moduleStatus: "In Progress",
    }));
    setSavedMessage("Reach-out plan added to your Networking Tracker.");
  }

  function completeModule() {
    setForm((current) => ({ ...current, moduleStatus: "Completed", progressPercentage: 100 }));
    setSavedMessage("Great work! You have completed the Introduction to Networking module.");
  }

  function saveProgress() {
    window.localStorage.setItem(storageKey, JSON.stringify({ ...form, moduleStatus: status, progressPercentage: completion.percent }));
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
      <GhostButton href="/roadmaps/freshman">Back to Freshman Roadmap</GhostButton>

      <section className="card-surface rounded-lg p-6 md:p-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-aggie-silver">Freshman Roadmap</p>
            <h1 className="text-glow mt-3 text-4xl font-black tracking-tight text-white md:text-5xl">Introduction to Networking</h1>
            <p className="mt-4 text-lg leading-8 text-aggie-light/78">
              Learn how to build meaningful relationships, make professional connections, and keep up with your network over time.
            </p>
            <p className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-aggie-muted">
              <Timer className="h-4 w-4" />
              Estimated Time: 20-30 Minutes
            </p>
          </div>
          <ProgressPanel completed={completion.completed} percent={completion.percent} status={status} total={completion.total} />
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_0.75fr]">
        <div className="card-surface rounded-lg p-3">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {tabs.map((tab) => (
              <button key={tab} type="button" onClick={() => setActiveTab(tab)} className={`min-h-11 rounded-lg border px-3 text-sm font-black transition ${activeTab === tab ? "chrome-surface border-aggie-chrome/60 text-aggie-navy shadow-steel" : "border-aggie-silver/15 text-aggie-light/78 hover:border-aggie-steel hover:bg-white/10"}`}>
                {tab}
              </button>
            ))}
          </div>
        </div>

        <Card title="Quick Actions" icon={<Save className="h-6 w-6" />}>
          <p className="leading-7 text-aggie-light/74">Your answers load automatically from this browser. Save when you want a clear checkpoint.</p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row xl:flex-col">
            <ActionButton onClick={saveProgress} icon={<Save className="h-4 w-4" />} primary>Save Progress</ActionButton>
            <ActionButton onClick={resetModule} icon={<RotateCcw className="h-4 w-4" />}>Reset Module</ActionButton>
          </div>
          {savedMessage && <p className="mt-4 text-sm font-bold text-aggie-ice">{savedMessage}</p>}
        </Card>
      </section>

      {activeTab === "Overview" && (
        <Card title="Module Overview" icon={<Sparkles className="h-6 w-6" />}>
          <CheckboxRow label="I reviewed the purpose and goals of this module." checked={form.overviewReviewed} onChange={(value) => updateField("overviewReviewed", value)} />
        </Card>
      )}

      {activeTab === "Foundation" && (
        <div className="space-y-6">
          <Card title="Why Networking Matters" icon={<Network className="h-6 w-6" />}>
            <div className="grid gap-3">{whyNetworkingMatters.map((item) => <GuidanceItem key={item} text={item} />)}</div>
            <div className="mt-6">
              <ChoiceGroup title="Examples of opportunities that can come through relationships" options={opportunityExamples} selected={form.selectedOpportunityExamples} onToggle={(item) => toggleList("selectedOpportunityExamples", item)} />
            </div>
            <div className="mt-6">
              <TextArea label="Have you ever received an opportunity because someone knew you, recommended you, or connected you with someone else?" value={form.opportunityReflection} onChange={(value) => updateField("opportunityReflection", value)} />
            </div>
          </Card>

          <Card title="Networking Is Not Asking for a Job" icon={<MessageCircle className="h-6 w-6" />}>
            <div className="grid gap-4 lg:grid-cols-2">
              <Callout label="Bad Networking" text="Can you get me a job?" />
              <Callout label="Good Networking" text="I would love to learn more about your career path and hear any advice you might have." highlighted />
            </div>
            <p className="mt-5 leading-7 text-aggie-light/78">People usually enjoy sharing their experiences, but they do not want to feel used as a shortcut to employment.</p>
            <div className="mt-6">
              <TextArea label="Why do you think relationship-building works better than only asking for opportunities?" value={form.relationshipReflection} onChange={(value) => updateField("relationshipReflection", value)} />
            </div>
          </Card>
        </div>
      )}

      {activeTab === "People" && (
        <div className="space-y-6">
          <Card title="Who Should I Network With?" icon={<UsersRound className="h-6 w-6" />}>
            <div className="grid gap-4 lg:grid-cols-2">
              {connectionCategories.map((category) => {
                const selected = form.selectedNetworkingGroups.includes(category.title);
                return (
                  <button key={category.title} type="button" onClick={() => toggleList("selectedNetworkingGroups", category.title)} className={`rounded-lg border p-5 text-left transition ${selected ? "border-aggie-chrome/50 bg-white/[0.09] shadow-steel" : "border-aggie-silver/15 bg-white/[0.045] hover:border-aggie-steel hover:bg-white/10"}`}>
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-xl font-black text-white">{category.title}</h3>
                      <CheckBoxMark active={selected} />
                    </div>
                    <ul className="mt-4 space-y-2 text-sm leading-6 text-aggie-light/78">{category.why.map((reason) => <li key={reason}>{reason}</li>)}</ul>
                  </button>
                );
              })}
            </div>
            <div className="mt-6 rounded-lg border border-aggie-silver/15 bg-white/[0.045] p-5">
              <h3 className="text-sm font-black uppercase tracking-[0.18em] text-aggie-silver">Who are three people or groups you could start networking with?</h3>
              <div className="mt-4 flex flex-col gap-3 md:flex-row">
                <TextInputBare value={form.customNetworkingInput} onChange={(value) => updateField("customNetworkingInput", value)} placeholder="Add a person or group..." />
                <ActionButton onClick={addCustomConnection} icon={<Plus className="h-4 w-4" />} primary>Add</ActionButton>
              </div>
              {form.customNetworkingNames.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {form.customNetworkingNames.map((item) => (
                    <button key={item} type="button" onClick={() => removeCustomConnection(item)} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-aggie-silver/20 bg-aggie-navy/70 px-3 text-sm font-bold text-white transition hover:border-aggie-steel hover:bg-white/10">
                      {item}
                      <X className="h-4 w-4" />
                    </button>
                  ))}
                </div>
              )}
              <p className="mt-4 text-sm font-bold text-aggie-muted">Selected: {form.selectedNetworkingGroups.length + form.customNetworkingNames.length} of 3</p>
            </div>
          </Card>

          <Card title="The Networking Ladder" icon={<Layers3 className="h-6 w-6" />}>
            <div className="grid gap-3">
              {ladderSteps.map((step, index) => (
                <SelectableRow key={step} selected={form.completedLadderSteps.includes(step)} onClick={() => toggleList("completedLadderSteps", step)}>
                  <span className="chrome-surface grid h-10 w-10 shrink-0 place-items-center rounded-lg text-sm font-black text-aggie-navy">{index + 1}</span>
                  <span>{step}</span>
                </SelectableRow>
              ))}
            </div>
            <p className="mt-5 leading-7 text-aggie-light/78">Most people stop after the first message, but the value comes from staying connected over time.</p>
            <div className="mt-6">
              <TextArea label="Which step feels easiest for you? Which step feels hardest?" value={form.networkingLadderReflection} onChange={(value) => updateField("networkingLadderReflection", value)} />
            </div>
          </Card>
        </div>
      )}

      {activeTab === "Message" && (
        <Card title="What Do I Say?" icon={<MessageCircle className="h-6 w-6" />}>
          <div className="grid gap-3 md:grid-cols-3">
            <GuidanceItem text="Introduce yourself." />
            <GuidanceItem text="Mention the connection." />
            <GuidanceItem text="Ask a simple question." />
          </div>
          <div className="mt-5 rounded-lg border border-aggie-silver/15 bg-white/[0.045] p-4 text-sm leading-7 text-aggie-light/82">
            Hi Sarah, I am a student-athlete at Utah State studying marketing. I came across your profile and noticed you are also a former Aggie. I would love to learn more about your career path if you ever have a few minutes to chat. Thank you!
          </div>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <label className="block">
              <span className="text-sm font-black text-white">Message Template</span>
              <select value={form.messageTemplate} onChange={(event) => updateField("messageTemplate", event.target.value as TemplateName)} className="mt-3 min-h-12 w-full rounded-lg border border-aggie-silver/15 bg-aggie-navy/78 px-4 text-sm text-white outline-none transition focus:border-aggie-steel">
                {Object.keys(messageTemplates).map((template) => <option key={template}>{template}</option>)}
              </select>
            </label>
            <TextInput label="Person's name" value={form.messageName} onChange={(value) => updateField("messageName", value)} />
            <TextInput label="Connection type" value={form.messageConnectionType} onChange={(value) => updateField("messageConnectionType", value)} />
            <TextInput label="Reason for reaching out" value={form.messageReason} onChange={(value) => updateField("messageReason", value)} />
            <div className="lg:col-span-2">
              <TextArea label="Question they want to ask" value={form.messageQuestion} onChange={(value) => updateField("messageQuestion", value)} />
            </div>
          </div>
          <div className="mt-5">
            <ActionButton onClick={generateMessage} icon={<MessageCircle className="h-4 w-4" />} primary>Generate Preview Message</ActionButton>
          </div>
          {form.generatedMessage && <div className="mt-5 whitespace-pre-wrap rounded-lg border border-aggie-chrome/30 bg-white/[0.08] p-5 text-sm leading-7 text-white">{form.generatedMessage}</div>}
        </Card>
      )}

      {activeTab === "Follow-Up" && (
        <Card title="The Follow-Up Problem" icon={<Handshake className="h-6 w-6" />}>
          <p className="leading-7 text-aggie-light/78">Many students reach out once, get advice, and then never follow up. That is where most networking relationships fade.</p>
          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            <Touchpoint title="Touchpoint 1" text="Initial conversation" />
            <Touchpoint title="Touchpoint 2" text="1-2 months later, send an update. I wanted to thank you again for your advice. Since we spoke, I joined the Sports Marketing Club and completed my LinkedIn profile." />
            <Touchpoint title="Touchpoint 3" text="Send another update later. I thought of our conversation today. I recently accepted a summer internship and wanted to thank you again for your guidance." />
          </div>
          <p className="mt-5 leading-7 text-aggie-light/78">Following up helps people remember you and turns one conversation into an actual relationship.</p>
          <div className="mt-6">
            <CheckboxRow label="I understand why follow-up matters." checked={form.followUpUnderstanding} onChange={(value) => updateField("followUpUnderstanding", value)} />
          </div>
        </Card>
      )}

      {activeTab === "Tracker" && (
        <Card title="Networking Tracker" icon={<UsersRound className="h-6 w-6" />}>
          <div className="grid gap-4 lg:grid-cols-2">
            <TextInput label="Name" value={form.contactDraft.name} onChange={(value) => updateContactDraft("name", value)} />
            <TextInput label="Company" value={form.contactDraft.company} onChange={(value) => updateContactDraft("company", value)} />
            <TextInput label="Role" value={form.contactDraft.role} onChange={(value) => updateContactDraft("role", value)} />
            <TextInput label="How You Know Them" value={form.contactDraft.howYouKnowThem} onChange={(value) => updateContactDraft("howYouKnowThem", value)} />
            <DateInput label="Last Contact Date" value={form.contactDraft.lastContactDate} onChange={(value) => updateContactDraft("lastContactDate", value)} />
            <DateInput label="Next Follow-Up Date" value={form.contactDraft.nextFollowUpDate} onChange={(value) => updateContactDraft("nextFollowUpDate", value)} />
            <label className="block">
              <span className="text-sm font-black text-white">Status</span>
              <select value={form.contactDraft.status} onChange={(event) => updateContactDraft("status", event.target.value as ContactStatus)} className="mt-3 min-h-12 w-full rounded-lg border border-aggie-silver/15 bg-aggie-navy/78 px-4 text-sm text-white outline-none transition focus:border-aggie-steel">
                {contactStatuses.map((statusOption) => <option key={statusOption}>{statusOption}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="flex items-center justify-between gap-4 text-sm font-black text-white">Relationship Strength <span className="text-aggie-ice">{form.contactDraft.relationshipStrength}/5</span></span>
              <input type="range" min="1" max="5" value={form.contactDraft.relationshipStrength} onChange={(event) => updateContactDraft("relationshipStrength", Number(event.target.value))} className="mt-4 w-full accent-aggie-steel" />
            </label>
            <div className="lg:col-span-2">
              <TextArea label="Notes" value={form.contactDraft.notes} onChange={(value) => updateContactDraft("notes", value)} />
            </div>
          </div>
          <div className="mt-5">
            <ActionButton onClick={addOrUpdateContact} icon={<Plus className="h-4 w-4" />} primary>{form.editingContactId ? "Edit Contact" : "Add Contact"}</ActionButton>
          </div>
          <div className="mt-6 grid gap-3">
            {form.networkingContacts.map((contact) => (
              <article key={contact.id} className="rounded-lg border border-aggie-silver/15 bg-white/[0.045] p-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <h3 className="text-lg font-black text-white">{contact.name}</h3>
                    <p className="mt-1 text-sm font-bold text-aggie-light/78">{[contact.role, contact.company].filter(Boolean).join(" at ") || "Networking contact"}</p>
                    <p className="mt-2 text-sm text-aggie-muted">Status: {contact.status} | Strength: {contact.relationshipStrength}/5</p>
                    {contact.nextFollowUpDate && <p className="mt-1 text-sm text-aggie-muted">Next follow-up: {contact.nextFollowUpDate}</p>}
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => editContact(contact)} className="min-h-10 rounded-lg border border-aggie-silver/20 px-3 text-sm font-bold text-white transition hover:border-aggie-steel hover:bg-white/10">Edit Contact</button>
                    <button type="button" onClick={() => deleteContact(contact.id)} className="grid h-10 w-10 place-items-center rounded-lg border border-aggie-silver/20 text-white transition hover:border-aggie-steel hover:bg-white/10" aria-label={`Delete ${contact.name}`}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Card>
      )}

      {activeTab === "LinkedIn" && (
        <Card title="LinkedIn as a Networking Tool" icon={<Network className="h-6 w-6" />}>
          <p className="leading-7 text-aggie-light/78">LinkedIn is not just social media. LinkedIn is your professional networking database.</p>
          <div className="mt-6">
            <ChoiceGroup title="Good LinkedIn habits" options={linkedinHabits} selected={form.linkedinHabitsReviewed} onToggle={(item) => toggleList("linkedinHabitsReviewed", item)} />
          </div>
          <div className="mt-6">
            <TextArea label="How could LinkedIn help you keep up with people you meet?" value={form.linkedinReflection} onChange={(value) => updateField("linkedinReflection", value)} />
          </div>
        </Card>
      )}

      {activeTab === "Challenge" && (
        <Card title="Networking Challenge" icon={<Handshake className="h-6 w-6" />}>
          <p className="leading-7 text-aggie-light/78">Make 5 connections this semester.</p>
          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            {challengeItems.map((item) => <SelectableRow key={item} selected={form.networkingChallengeProgress.includes(item)} onClick={() => toggleList("networkingChallengeProgress", item)}>{item}</SelectableRow>)}
          </div>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <TextInput label="Name" value={form.weeklyReachOutPlan.name} onChange={(value) => updateWeeklyPlan("name", value)} />
            <TextInput label="Why this person" value={form.weeklyReachOutPlan.why} onChange={(value) => updateWeeklyPlan("why", value)} />
            <DateInput label="When I will reach out" value={form.weeklyReachOutPlan.when} onChange={(value) => updateWeeklyPlan("when", value)} />
            <TextInput label="What I will ask" value={form.weeklyReachOutPlan.question} onChange={(value) => updateWeeklyPlan("question", value)} />
          </div>
          <div className="mt-5">
            <ActionButton onClick={addWeeklyPlanToTracker} icon={<Plus className="h-4 w-4" />} primary>Add this person to my Networking Tracker</ActionButton>
          </div>
        </Card>
      )}

      {activeTab === "Complete" && (
        <div className="space-y-6">
          <Card title="Completion Assessment" icon={<Check className="h-6 w-6" />}>
            <h3 className="text-sm font-black uppercase tracking-[0.18em] text-aggie-silver">How confident are you in starting and maintaining professional connections?</h3>
            <div className="mt-4 grid grid-cols-5 gap-2 md:grid-cols-10">
              {Array.from({ length: 10 }, (_, index) => index + 1).map((rating) => (
                <button key={rating} type="button" onClick={() => updateField("confidenceRating", rating)} className={`min-h-11 rounded-lg border text-sm font-black transition ${form.confidenceRating === rating ? "chrome-surface border-aggie-chrome/60 text-aggie-navy shadow-steel" : "border-aggie-silver/20 text-aggie-light/78 hover:border-aggie-steel hover:bg-white/10"}`}>
                  {rating}
                </button>
              ))}
            </div>
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {completionChecklist.map((item) => <CheckboxRow key={item} label={item} checked={form.completionChecklist.includes(item)} onChange={() => toggleList("completionChecklist", item)} />)}
            </div>
            <div className="mt-6">
              <ActionButton onClick={completeModule} icon={<Check className="h-4 w-4" />} primary>Complete Introduction to Networking Module</ActionButton>
            </div>
            {form.moduleStatus === "Completed" && (
              <p className="mt-5 rounded-lg border border-aggie-chrome/30 bg-white/[0.08] p-4 text-sm font-bold leading-6 text-aggie-ice">
                Great work! You have completed the Introduction to Networking module. Remember, your network can open doors you may not even know exist yet.
              </p>
            )}
          </Card>

          <Card title="Admin Preview" icon={<BarChart3 className="h-6 w-6" />}>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <AdminStat label="Completion Status" value={status} />
              <AdminStat label="Average Networking Confidence" value={`${admin.averageConfidence}/10`} />
              <AdminStat label="Most Selected Networking Groups" value={admin.topGroups.join(", ") || "No selections yet"} />
              <AdminStat label="Number of Contacts Added" value={`${admin.contactsAdded}`} />
              <AdminStat label="Number of Follow-Ups Scheduled" value={`${admin.followUpsScheduled}`} />
              <AdminStat label="Networking Challenge Completion Rate" value={`${admin.challengeRate}%`} />
            </div>
          </Card>
        </div>
      )}

      <section className="card-surface rounded-lg p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-aggie-silver">Module Progress</p>
            <h2 className="mt-2 text-2xl font-black text-white">{status}</h2>
            <p className="mt-2 leading-7 text-aggie-light/74">Use the tabs to move through each networking concept at your own pace.</p>
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

function getAdminPreview(form: IntroNetworkingState) {
  const confidence = [...mockAdmin.confidence, form.confidenceRating];
  const contactsWithFollowUps = form.networkingContacts.filter((contact) => contact.nextFollowUpDate).length;
  const challengeRates = [...mockAdmin.challengeRates, Math.round((form.networkingChallengeProgress.length / challengeItems.length) * 100)];
  return {
    averageConfidence: (confidence.reduce((sum, value) => sum + value, 0) / confidence.length).toFixed(1),
    topGroups: topItems([...mockAdmin.groups, ...form.selectedNetworkingGroups]),
    contactsAdded: mockAdmin.contactsAdded + form.networkingContacts.length,
    followUpsScheduled: mockAdmin.followUpsScheduled + contactsWithFollowUps,
    challengeRate: Math.round(challengeRates.reduce((sum, value) => sum + value, 0) / challengeRates.length),
  };
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

function Callout({ label, text, highlighted = false }: { label: string; text: string; highlighted?: boolean }) {
  return (
    <div className={`rounded-lg border p-5 ${highlighted ? "border-aggie-chrome/30 bg-white/[0.08]" : "border-aggie-silver/15 bg-white/[0.045]"}`}>
      <p className="text-sm font-black uppercase tracking-[0.18em] text-aggie-silver">{label}</p>
      <p className="mt-3 text-xl font-black text-white">{text}</p>
    </div>
  );
}

function Touchpoint({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-lg border border-aggie-silver/15 bg-white/[0.045] p-4">
      <h3 className="text-lg font-black text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-aggie-light/78">{text}</p>
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

function TextInputBare({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder: string }) {
  return <input value={value} onChange={(event) => onChange(event.target.value)} className="min-h-12 flex-1 rounded-lg border border-aggie-silver/15 bg-aggie-navy/78 px-4 text-sm text-white outline-none transition placeholder:text-aggie-muted focus:border-aggie-steel" placeholder={placeholder} />;
}

function DateInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="text-sm font-black text-white">{label}</span>
      <input type="date" value={value} onChange={(event) => onChange(event.target.value)} className="mt-3 min-h-12 w-full rounded-lg border border-aggie-silver/15 bg-aggie-navy/78 px-4 text-sm text-white outline-none transition focus:border-aggie-steel" />
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

function ChoiceGroup({ title, options, selected, onToggle }: { title: string; options: string[]; selected: string[]; onToggle: (item: string) => void }) {
  return (
    <div>
      <h3 className="text-sm font-black uppercase tracking-[0.18em] text-aggie-silver">{title}</h3>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {options.map((option) => <SelectableRow key={option} selected={selected.includes(option)} onClick={() => onToggle(option)}>{option}</SelectableRow>)}
      </div>
    </div>
  );
}

function SelectableRow({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} className={`flex min-h-12 items-center gap-3 rounded-lg border px-3 text-left text-sm font-bold transition ${selected ? "border-aggie-chrome/50 bg-white/[0.09] text-white" : "border-aggie-silver/15 bg-white/[0.045] text-aggie-light/78 hover:border-aggie-steel hover:bg-white/10"}`}>
      {children}
      <CheckBoxMark active={selected} />
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
    <span className={`ml-auto grid h-6 w-6 shrink-0 place-items-center rounded-md ${active ? "chrome-surface text-aggie-navy" : "border border-aggie-silver/20 text-transparent"}`}>
      {active && <Check className="h-4 w-4" />}
    </span>
  );
}

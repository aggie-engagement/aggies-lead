"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Check, Clock3, Mail, MessageSquareText, Network, Plus, RefreshCw, Save, Send, Trash2, UsersRound } from "lucide-react";
import { GhostButton } from "@/components/Prototype";
import { usePrototypeState } from "@/components/PrototypeState";

const moduleSlug = "networking-outreach";
const storageKey = "aggies-lead:junior:networking-outreach";

const contactCategories = [
  "Alumni",
  "Former Student-Athletes",
  "Guest Speakers",
  "Aggie Road Trip Contacts",
  "Internship Supervisors",
  "Career Fair Employers",
  "Industry Professionals",
];

const templates = [
  {
    title: "LinkedIn Connection Request",
    example:
      "Hi [Name], I am a student-athlete at Utah State University and noticed your experience in [field]. I would love to connect and learn more about your career path.",
  },
  {
    title: "Networking Email",
    example:
      "Hi [Name], my name is [Your Name], and I am a student-athlete at Utah State studying [major]. I am exploring opportunities in [field] and would appreciate any advice you may be willing to share.",
  },
  {
    title: "Informational Interview Request",
    example:
      "Hi [Name], I am interested in learning more about your work with [organization/industry]. Would you be open to a 15-20 minute conversation so I can learn more about your career path?",
  },
];

const networkingGoals = [
  "Sent 3 outreach messages",
  "Connected with 5 new professionals",
  "Conducted an informational interview",
  "Followed up with a contact",
  "Connected with a USU alumnus",
];

type OutreachContact = {
  id: string;
  name: string;
  organization: string;
  dateContacted: string;
  followUpSent: boolean;
  responseReceived: boolean;
};

type ContactDraft = Omit<OutreachContact, "id">;

type NetworkingOutreachState = {
  selectedCategories: string[];
  networkingGoals: string[];
  contacts: OutreachContact[];
  draft: ContactDraft;
  moduleStatus: "Not Started" | "In Progress" | "Completed";
  progressPercentage: number;
};

const emptyDraft: ContactDraft = {
  name: "",
  organization: "",
  dateContacted: "",
  followUpSent: false,
  responseReceived: false,
};

const initialState: NetworkingOutreachState = {
  selectedCategories: [],
  networkingGoals: [],
  contacts: [],
  draft: emptyDraft,
  moduleStatus: "Not Started",
  progressPercentage: 0,
};

export function NetworkingOutreachClient() {
  const { completeModule } = usePrototypeState();
  const [form, setForm] = useState<NetworkingOutreachState>(initialState);
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

  const completion = useMemo(() => {
    const tasks = [
      form.selectedCategories.length > 0,
      form.networkingGoals.length > 0,
      form.contacts.length > 0,
      form.moduleStatus === "Completed",
    ];
    const completed = tasks.filter(Boolean).length;
    const percent = form.moduleStatus === "Completed" ? 100 : Math.round((completed / tasks.length) * 100);
    return { completed, total: tasks.length, percent };
  }, [form]);

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

  function toggleList(field: "selectedCategories" | "networkingGoals", value: string) {
    setSavedMessage("");
    setForm((current) => {
      const list = current[field];
      return {
        ...current,
        [field]: list.includes(value) ? list.filter((item) => item !== value) : [...list, value],
      };
    });
  }

  function updateDraft<K extends keyof ContactDraft>(field: K, value: ContactDraft[K]) {
    setSavedMessage("");
    setForm((current) => ({ ...current, draft: { ...current.draft, [field]: value } }));
  }

  function addContact() {
    if (!form.draft.name.trim() && !form.draft.organization.trim()) {
      setSavedMessage("Add a name or organization before saving the contact.");
      return;
    }

    const contact: OutreachContact = { ...form.draft, id: `${Date.now()}` };
    setForm((current) => ({ ...current, contacts: [...current.contacts, contact], draft: emptyDraft }));
    setSavedMessage("Contact added to tracker.");
  }

  function deleteContact(id: string) {
    setSavedMessage("");
    setForm((current) => ({ ...current, contacts: current.contacts.filter((contact) => contact.id !== id) }));
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

  function markComplete() {
    const completedState = { ...form, moduleStatus: "Completed" as const, progressPercentage: 100 };
    setForm(completedState);
    window.localStorage.setItem(storageKey, JSON.stringify(completedState));
    completeModule(moduleSlug);
    setSavedMessage("Networking Outreach completed.");
  }

  return (
    <div className="space-y-6">
      <GhostButton href="/roadmaps/junior">Back to Junior Roadmap</GhostButton>

      <section className="card-surface rounded-lg p-6 md:p-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-aggie-silver">Junior Roadmap</p>
            <h1 className="text-glow mt-3 text-4xl font-black tracking-tight text-white md:text-5xl">
              Networking Outreach
            </h1>
            <p className="mt-4 text-lg leading-8 text-aggie-light/78">
              Building a network requires intentional outreach. This module will help you identify professionals,
              start conversations, and create meaningful career connections.
            </p>
            <p className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-aggie-muted">
              <Clock3 className="h-4 w-4" />
              Estimated Time: 10 minutes
            </p>
          </div>
          <ProgressPanel completed={completion.completed} percent={form.progressPercentage} status={form.moduleStatus} total={completion.total} />
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <main className="space-y-6">
          <Card title="Who Should You Contact?" icon={<UsersRound className="h-6 w-6" />}>
            <div className="grid gap-3 md:grid-cols-2">
              {contactCategories.map((category) => (
                <ToggleCard key={category} selected={form.selectedCategories.includes(category)} label={category} onClick={() => toggleList("selectedCategories", category)} />
              ))}
            </div>
          </Card>

          <Card title="Outreach Message Templates" icon={<MessageSquareText className="h-6 w-6" />}>
            <div className="grid gap-4">
              {templates.map((template) => (
                <article key={template.title} className="rounded-lg border border-aggie-silver/15 bg-white/[0.045] p-5">
                  <h3 className="text-xl font-black text-white">{template.title}</h3>
                  <p className="mt-3 text-sm font-semibold leading-7 text-aggie-light/82">{template.example}</p>
                </article>
              ))}
            </div>
          </Card>

          <Card title="Networking Goals" icon={<Network className="h-6 w-6" />}>
            <div className="grid gap-3 md:grid-cols-2">
              {networkingGoals.map((goal) => (
                <ToggleCard key={goal} selected={form.networkingGoals.includes(goal)} label={goal} onClick={() => toggleList("networkingGoals", goal)} />
              ))}
            </div>
          </Card>

          <Card title="Follow-Up Strategy" icon={<Send className="h-6 w-6" />}>
            <p className="leading-7 text-aggie-light/80">
              Follow up within a few days after your first message or conversation. Keep it short, thank the person for
              their time, mention something specific from the exchange, and offer a simple next step. If you do not hear
              back, one polite follow-up about a week later is appropriate. Over time, stay connected by sharing updates,
              congratulating them on professional milestones, or asking relevant career questions.
            </p>
          </Card>

          <Card title="Outreach Tracker" icon={<Mail className="h-6 w-6" />}>
            <div className="grid gap-4 md:grid-cols-2">
              <TextInput label="Name" value={form.draft.name} onChange={(value) => updateDraft("name", value)} />
              <TextInput label="Organization" value={form.draft.organization} onChange={(value) => updateDraft("organization", value)} />
              <TextInput label="Date Contacted" type="date" value={form.draft.dateContacted} onChange={(value) => updateDraft("dateContacted", value)} />
              <div className="grid gap-3">
                <ToggleCard selected={form.draft.followUpSent} label="Follow-Up Sent" onClick={() => updateDraft("followUpSent", !form.draft.followUpSent)} />
                <ToggleCard selected={form.draft.responseReceived} label="Response Received" onClick={() => updateDraft("responseReceived", !form.draft.responseReceived)} />
              </div>
            </div>
            <button
              type="button"
              onClick={addContact}
              className="chrome-surface mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border border-aggie-chrome/60 px-5 text-sm font-black text-aggie-navy shadow-glow transition hover:brightness-110 sm:w-auto"
            >
              <Plus className="h-4 w-4" />
              Add Contact
            </button>

            <div className="mt-5 overflow-hidden rounded-lg border border-aggie-silver/15">
              <div className="grid grid-cols-5 gap-0 bg-white/[0.08] text-xs font-black uppercase tracking-[0.12em] text-aggie-silver">
                <div className="p-3">Name</div>
                <div className="p-3">Organization</div>
                <div className="p-3">Date Contacted</div>
                <div className="p-3">Follow-Up Sent</div>
                <div className="p-3">Response Received</div>
              </div>
              {form.contacts.length === 0 ? (
                <p className="p-4 text-sm font-semibold text-aggie-light/72">No outreach contacts added yet.</p>
              ) : (
                form.contacts.map((contact) => (
                  <div key={contact.id} className="grid grid-cols-5 gap-0 border-t border-aggie-silver/10 text-sm font-bold text-aggie-light/82">
                    <div className="p-3">{contact.name || "Not listed"}</div>
                    <div className="p-3">{contact.organization || "Not listed"}</div>
                    <div className="p-3">{contact.dateContacted || "Not set"}</div>
                    <div className="p-3">{contact.followUpSent ? "Yes" : "No"}</div>
                    <div className="flex items-center justify-between gap-2 p-3">
                      <span>{contact.responseReceived ? "Yes" : "No"}</span>
                      <button type="button" onClick={() => deleteContact(contact.id)} className="text-aggie-silver transition hover:text-white">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card title="Module Completion" icon={<Check className="h-6 w-6" />}>
            <button
              type="button"
              onClick={markComplete}
              className="chrome-surface inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border border-aggie-chrome/60 px-5 text-sm font-black text-aggie-navy shadow-glow transition hover:brightness-110 sm:w-auto"
            >
              <Check className="h-4 w-4" />
              Networking Outreach Completed
            </button>
            {form.moduleStatus === "Completed" && (
              <p className="mt-5 rounded-lg border border-aggie-chrome/30 bg-white/[0.08] p-4 text-sm font-bold leading-6 text-aggie-ice">
                Networking Outreach complete. Keep following up and building meaningful career connections.
              </p>
            )}
          </Card>
        </main>

        <aside className="space-y-6">
          <section className="card-surface rounded-lg p-5">
            <h2 className="text-xl font-black text-white">Save Options</h2>
            <p className="mt-2 text-sm leading-6 text-aggie-light/72">Save your progress locally or reset this module.</p>
            <div className="mt-5 grid gap-3">
              <ActionButton onClick={saveProgress} icon={<Save className="h-4 w-4" />} primary>
                Save Progress
              </ActionButton>
              <ActionButton onClick={resetModule} icon={<RefreshCw className="h-4 w-4" />}>
                Reset Module
              </ActionButton>
            </div>
            {savedMessage && (
              <p className="mt-4 rounded-lg border border-aggie-silver/15 bg-white/[0.045] p-3 text-sm font-bold text-aggie-light/80">
                {savedMessage}
              </p>
            )}
          </section>

          <section className="card-surface rounded-lg p-5">
            <h2 className="text-xl font-black text-white">Outreach Snapshot</h2>
            <div className="mt-4 space-y-3 text-sm font-bold text-aggie-light/78">
              <Snapshot label="Categories" value={`${form.selectedCategories.length}/${contactCategories.length}`} />
              <Snapshot label="Goals" value={`${form.networkingGoals.length}/${networkingGoals.length}`} />
              <Snapshot label="Contacts Added" value={`${form.contacts.length}`} />
              <Snapshot label="Status" value={form.moduleStatus} />
            </div>
          </section>

          <Link href="/my-roadmap" className="inline-flex min-h-12 w-full items-center justify-center rounded-lg border border-aggie-silver/25 px-5 text-sm font-bold text-white transition hover:border-aggie-steel hover:bg-white/10">
            Back to My Roadmap
          </Link>
        </aside>
      </div>
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
      <p className="mt-3 text-sm font-medium text-aggie-light/72">{completed} of {total} outreach steps complete</p>
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

function ToggleCard({ selected, label, onClick }: { selected: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-14 items-center gap-3 rounded-lg border p-4 text-left text-sm font-bold transition ${
        selected
          ? "border-aggie-chrome/45 bg-white/[0.1] text-white"
          : "border-aggie-silver/15 bg-white/[0.045] text-aggie-light/78 hover:border-aggie-steel hover:bg-white/10"
      }`}
    >
      <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg ${selected ? "chrome-surface text-aggie-navy" : "border border-aggie-silver/20 text-aggie-muted"}`}>
        {selected && <Check className="h-4 w-4" />}
      </span>
      {label}
    </button>
  );
}

function TextInput({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return (
    <label className="block">
      <span className="text-sm font-black uppercase tracking-[0.16em] text-aggie-silver">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 min-h-12 w-full rounded-lg border border-aggie-silver/15 bg-aggie-navy/80 px-4 text-white outline-none placeholder:text-aggie-muted focus:border-aggie-steel"
      />
    </label>
  );
}

function ActionButton({ children, icon, onClick, primary = false }: { children: React.ReactNode; icon: React.ReactNode; onClick: () => void; primary?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-4 text-sm font-black transition ${
        primary
          ? "chrome-surface border border-aggie-chrome/60 text-aggie-navy shadow-glow hover:brightness-110"
          : "border border-aggie-silver/20 bg-white/[0.045] text-white hover:border-aggie-steel hover:bg-white/10"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

function Snapshot({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-aggie-silver/15 bg-white/[0.045] p-3">
      <span>{label}</span>
      <span className="text-right text-white">{value}</span>
    </div>
  );
}

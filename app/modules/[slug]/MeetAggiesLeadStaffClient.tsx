"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { Check, Clock3, Mail, RefreshCw, Save, UserRound, Users } from "lucide-react";
import { GhostButton } from "@/components/Prototype";
import { usePrototypeState } from "@/components/PrototypeState";

const moduleSlug = "meet-aggies-lead-staff";
const storageKey = "aggies-lead:transfer:meet-aggies-lead-staff";

const staffMembers = [
  { label: "Staff Member 1", name: "Coming Soon", title: "TBD", bio: "TBD" },
  { label: "Staff Member 2", name: "Coming Soon", title: "TBD", bio: "TBD" },
  { label: "Staff Member 3", name: "Coming Soon", title: "TBD", bio: "TBD" },
];

const internsAndFellows = [
  { label: "Intern/Fellow 1", name: "Coming Soon", role: "TBD" },
  { label: "Intern/Fellow 2", name: "Coming Soon", role: "TBD" },
  { label: "Intern/Fellow 3", name: "Coming Soon", role: "TBD" },
  { label: "Intern/Fellow 4", name: "Coming Soon", role: "TBD" },
];

const supportAreas = [
  "Career Development",
  "Resume Reviews",
  "Networking",
  "Informational Interviews",
  "Job Shadows",
  "Guest Speakers",
  "Professional Development",
];

type MeetStaffState = {
  contactClicked: boolean;
  moduleStatus: "Not Started" | "In Progress" | "Completed";
  progressPercentage: number;
};

const initialState: MeetStaffState = {
  contactClicked: false,
  moduleStatus: "Not Started",
  progressPercentage: 0,
};

export function MeetAggiesLeadStaffClient() {
  const { completeModule } = usePrototypeState();
  const [form, setForm] = useState<MeetStaffState>(initialState);
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
      true,
      true,
      true,
      form.contactClicked,
      form.moduleStatus === "Completed",
    ];
    const completed = tasks.filter(Boolean).length;
    const percent = form.moduleStatus === "Completed" ? 100 : Math.round((completed / tasks.length) * 100);
    return { completed, total: tasks.length, percent };
  }, [form.contactClicked, form.moduleStatus]);

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
    const completedForm: MeetStaffState = {
      ...form,
      moduleStatus: "Completed",
      progressPercentage: 100,
    };
    setForm(completedForm);
    persist(completedForm, "Meet Aggies Lead Staff completed.");
    completeModule(moduleSlug);
  };

  return (
    <div className="space-y-6">
      <GhostButton href="/roadmaps/transfer">Back to Transfer Add-On</GhostButton>

      <section className="card-surface rounded-lg p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-aggie-silver">Transfer Add-On</p>
            <h1 className="text-glow mt-3 text-4xl font-black tracking-tight text-white">Meet Aggies Lead Staff</h1>
            <p className="mt-4 max-w-3xl leading-7 text-aggie-light/76">
              The Aggies Lead team is here to support student-athletes throughout their time at Utah State. From career
              development and networking to events and professional growth, these are some of the people who can help you
              along the way.
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
          <Card title="Aggies Lead Staff" icon={<Users className="h-6 w-6 text-aggie-ice" />}>
            <div className="grid gap-4 md:grid-cols-3">
              {staffMembers.map((member) => (
                <article key={member.label} className="rounded-lg border border-white/10 bg-white/6 p-4">
                  <div className="grid aspect-[4/3] place-items-center rounded-lg border border-dashed border-white/16 bg-black/20">
                    <UserRound className="h-12 w-12 text-aggie-muted" />
                    <span className="sr-only">Photo Placeholder</span>
                  </div>
                  <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-aggie-muted">{member.label}</p>
                  <h3 className="mt-1 text-xl font-black text-white">{member.name}</h3>
                  <dl className="mt-3 space-y-2 text-sm">
                    <InfoRow label="Title" value={member.title} />
                    <InfoRow label="Bio" value={member.bio} />
                  </dl>
                </article>
              ))}
            </div>
          </Card>

          <Card title="Aggies Lead Interns & Fellows" icon={<Users className="h-6 w-6 text-aggie-ice" />}>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {internsAndFellows.map((person) => (
                <article key={person.label} className="rounded-lg border border-white/10 bg-white/6 p-4">
                  <div className="grid aspect-square place-items-center rounded-lg border border-dashed border-white/16 bg-black/20">
                    <UserRound className="h-10 w-10 text-aggie-muted" />
                    <span className="sr-only">Photo Placeholder</span>
                  </div>
                  <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-aggie-muted">{person.label}</p>
                  <h3 className="mt-1 text-lg font-black text-white">{person.name}</h3>
                  <p className="mt-2 text-sm font-semibold text-aggie-light/74">Role: {person.role}</p>
                </article>
              ))}
            </div>
          </Card>

          <Card title="How We Can Help" icon={<Check className="h-6 w-6 text-aggie-ice" />}>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {supportAreas.map((area) => (
                <div key={area} className="rounded-lg border border-white/10 bg-white/6 p-4">
                  <p className="font-black text-white">{area}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Contact Aggies Lead" icon={<Mail className="h-6 w-6 text-aggie-ice" />}>
            <button
              type="button"
              onClick={() => setForm((current) => ({ ...current, contactClicked: true }))}
              className="rounded-lg bg-aggie-blue px-4 py-3 text-sm font-black text-white transition hover:bg-aggie-blue/85"
            >
              Contact Aggies Lead
            </button>
            {form.contactClicked ? (
              <p className="mt-3 text-sm font-semibold text-aggie-ice">Placeholder contact action marked.</p>
            ) : null}
            <button
              type="button"
              onClick={markComplete}
              className="mt-4 block rounded-lg bg-aggie-ice px-4 py-3 text-sm font-black text-aggie-navy transition hover:bg-white"
            >
              Meet Aggies Lead Staff Completed
            </button>
            {form.moduleStatus === "Completed" ? (
              <p className="mt-4 rounded-lg border border-aggie-ice/30 bg-aggie-ice/10 p-4 text-sm font-semibold text-aggie-light">
                Great work. You know where to start when you need Aggies Lead support.
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

          <Card title="Staff Snapshot">
            <div className="space-y-3">
              <Snapshot label="Staff Cards" value={String(staffMembers.length)} />
              <Snapshot label="Intern/Fellow Cards" value={String(internsAndFellows.length)} />
              <Snapshot label="Contact Action" value={form.contactClicked ? "Marked" : "Not Marked"} />
            </div>
          </Card>

          <Link
            href="/roadmaps/transfer"
            className="block rounded-lg border border-white/10 bg-white/6 p-4 text-sm font-bold text-aggie-light transition hover:border-aggie-ice/40 hover:bg-white/10"
          >
            Return to Transfer Add-On
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

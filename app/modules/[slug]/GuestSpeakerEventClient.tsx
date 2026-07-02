"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CalendarDays, Check, Clock3, MapPin, Megaphone, RefreshCw, Save, UsersRound } from "lucide-react";
import { GhostButton } from "@/components/Prototype";
import { usePrototypeState } from "@/components/PrototypeState";

const moduleSlug = "guest-speaker-event";
const storageKey = "aggies-lead:sophomore:guest-speaker-event";

const benefits = [
  "Learn from experienced professionals",
  "Explore career paths and industries",
  "Build your professional network",
  "Gain leadership and life skills",
  "Ask questions and receive career advice",
  "Connect classroom and athletic experiences to future opportunities",
];

const upcomingSpeakers = [
  {
    id: "speaker-1",
    guestSpeaker: "Coming Soon",
    profession: "TBD",
    topic: "TBD",
    date: "TBD",
    time: "TBD",
    location: "TBD",
  },
  {
    id: "speaker-2",
    guestSpeaker: "Coming Soon",
    profession: "TBD",
    topic: "TBD",
    date: "TBD",
    time: "TBD",
    location: "TBD",
  },
  {
    id: "speaker-3",
    guestSpeaker: "Coming Soon",
    profession: "TBD",
    topic: "TBD",
    date: "TBD",
    time: "TBD",
    location: "TBD",
  },
];

type GuestSpeakerState = {
  reviewedBenefits: boolean;
  viewedUpcomingEvents: boolean;
  moduleStatus: "Not Started" | "In Progress" | "Completed";
  progressPercentage: number;
};

const initialState: GuestSpeakerState = {
  reviewedBenefits: false,
  viewedUpcomingEvents: false,
  moduleStatus: "Not Started",
  progressPercentage: 0,
};

export function GuestSpeakerEventClient() {
  const { completeModule } = usePrototypeState();
  const [form, setForm] = useState<GuestSpeakerState>(initialState);
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
    const tasks = [form.reviewedBenefits, form.viewedUpcomingEvents];
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
      if (current.moduleStatus === nextStatus && current.progressPercentage === completion.percent) {
        return current;
      }

      return { ...current, moduleStatus: nextStatus, progressPercentage: completion.percent };
    });
  }, [completion.percent]);

  function updateField<K extends keyof GuestSpeakerState>(field: K, value: GuestSpeakerState[K]) {
    setSavedMessage("");
    setForm((current) => ({ ...current, [field]: value }));
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

  function markReviewed() {
    const completedState = {
      ...form,
      viewedUpcomingEvents: true,
      moduleStatus: "Completed" as const,
      progressPercentage: 100,
    };
    setForm(completedState);
    window.localStorage.setItem(storageKey, JSON.stringify(completedState));
    completeModule(moduleSlug);
    setSavedMessage("Guest Speaker Event reviewed.");
  }

  return (
    <div className="space-y-6">
      <GhostButton href="/roadmaps/sophomore">Back to Sophomore Roadmap</GhostButton>

      <section className="card-surface rounded-lg p-6 md:p-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-aggie-silver">Sophomore Roadmap</p>
            <h1 className="text-glow mt-3 text-4xl font-black tracking-tight text-white md:text-5xl">
              Guest Speaker Event Series
            </h1>
            <p className="mt-4 text-lg leading-8 text-aggie-light/78">
              Throughout the year, Aggies Lead hosts guest speakers from a variety of industries and backgrounds.
              These events provide student-athletes with opportunities to learn from professionals, expand their
              network, and gain insight into careers, leadership, personal development, and life after athletics.
            </p>
            <p className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-aggie-muted">
              <Clock3 className="h-4 w-4" />
              Estimated Time: 10 minutes
            </p>
          </div>
          <ProgressPanel
            completed={completion.completed}
            percent={form.progressPercentage}
            status={form.moduleStatus}
            total={completion.total}
          />
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <main className="space-y-6">
          <Card title="Why Attend?" icon={<UsersRound className="h-6 w-6" />}>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-aggie-silver">
              Benefits of attending guest speaker events
            </p>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-start gap-3 rounded-lg border border-aggie-silver/15 bg-white/[0.045] p-4"
                >
                  <span className="chrome-surface mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md text-aggie-navy">
                    <Check className="h-4 w-4" />
                  </span>
                  <p className="text-sm font-bold leading-6 text-aggie-light/82">{benefit}</p>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => updateField("reviewedBenefits", !form.reviewedBenefits)}
              className={`mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border px-5 text-sm font-black transition ${
                form.reviewedBenefits
                  ? "border-aggie-chrome/45 bg-white/[0.1] text-white"
                  : "border-aggie-silver/20 bg-white/[0.045] text-white hover:border-aggie-steel hover:bg-white/10"
              }`}
            >
              <Check className="h-4 w-4" />
              I reviewed why these events matter
            </button>
          </Card>

          <Card title="Upcoming Guest Speakers" icon={<CalendarDays className="h-6 w-6" />}>
            <div className="grid gap-4 lg:grid-cols-3">
              {upcomingSpeakers.map((speaker, index) => (
                <article
                  key={speaker.id}
                  className="flex min-h-full flex-col rounded-lg border border-aggie-silver/15 bg-white/[0.055] p-5 shadow-steel"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="rounded-lg border border-aggie-chrome/30 bg-aggie-chrome/10 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-aggie-ice">
                      Event {index + 1}
                    </span>
                    <Megaphone className="h-5 w-5 shrink-0 text-aggie-ice" />
                  </div>
                  <h3 className="mt-5 text-2xl font-black text-white">{speaker.guestSpeaker}</h3>
                  <div className="mt-5 space-y-3 text-sm font-bold text-aggie-light/78">
                    <SpeakerDetail label="Profession/Organization" value={speaker.profession} />
                    <SpeakerDetail label="Topic" value={speaker.topic} />
                    <SpeakerDetail label="Date" value={speaker.date} />
                    <SpeakerDetail label="Time" value={speaker.time} />
                    <SpeakerDetail label="Location" value={speaker.location} />
                  </div>
                </article>
              ))}
            </div>
          </Card>

          <Card title="Past Guest Speakers" icon={<Megaphone className="h-6 w-6" />}>
            <p className="leading-7 text-aggie-light/78">
              Past speaker information and event recordings may be added here in the future.
            </p>
          </Card>

          <section className="rounded-lg border border-aggie-chrome/35 bg-aggie-chrome/10 p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start">
              <span className="chrome-surface grid h-12 w-12 shrink-0 place-items-center rounded-lg text-aggie-navy shadow-glow">
                <MapPin className="h-6 w-6" />
              </span>
              <div>
                <h2 className="text-2xl font-black text-white">Attendance Reminder</h2>
                <p className="mt-3 leading-7 text-aggie-light/84">
                  Guest speaker events are one of the best ways to learn about careers, leadership, and opportunities
                  beyond athletics. Be sure to check back regularly for new events and speaker announcements.
                </p>
              </div>
            </div>
          </section>

          <Card title="Module Completion" icon={<Check className="h-6 w-6" />}>
            <p className="leading-7 text-aggie-light/78">
              Review the upcoming event cards, then mark this module when you have checked what is currently available.
            </p>
            <button
              type="button"
              onClick={markReviewed}
              className="chrome-surface mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border border-aggie-chrome/60 px-5 text-sm font-black text-aggie-navy shadow-glow transition hover:brightness-110 sm:w-auto"
            >
              <Check className="h-4 w-4" />
              I Reviewed Upcoming Events
            </button>
            {form.moduleStatus === "Completed" && (
              <p className="mt-5 rounded-lg border border-aggie-chrome/30 bg-white/[0.08] p-4 text-sm font-bold leading-6 text-aggie-ice">
                Guest Speaker Event Series reviewed. Check back for new speakers and event details.
              </p>
            )}
          </Card>
        </main>

        <aside className="space-y-6">
          <section className="card-surface rounded-lg p-5">
            <h2 className="text-xl font-black text-white">Save Options</h2>
            <p className="mt-2 text-sm leading-6 text-aggie-light/72">
              Save your review on this device or reset this module.
            </p>
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
            <h2 className="text-xl font-black text-white">Event Snapshot</h2>
            <div className="mt-4 space-y-3 text-sm font-bold text-aggie-light/78">
              <Snapshot label="Upcoming Events" value={`${upcomingSpeakers.length}`} />
              <Snapshot label="Review Status" value={form.moduleStatus} />
              <Snapshot label="Progress" value={`${form.progressPercentage}%`} />
            </div>
          </section>

          <Link
            href="/my-roadmap"
            className="inline-flex min-h-12 w-full items-center justify-center rounded-lg border border-aggie-silver/25 px-5 text-sm font-bold text-white transition hover:border-aggie-steel hover:bg-white/10"
          >
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
      <p className="mt-3 text-sm font-medium text-aggie-light/72">
        {completed} of {total} review steps complete
      </p>
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

function SpeakerDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-aggie-silver/15 bg-aggie-navy/50 p-3">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-aggie-silver">{label}</p>
      <p className="mt-1 text-white">{value}</p>
    </div>
  );
}

function ActionButton({
  children,
  icon,
  onClick,
  primary = false,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
  onClick: () => void;
  primary?: boolean;
}) {
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
      <span className="text-white">{value}</span>
    </div>
  );
}

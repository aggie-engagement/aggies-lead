"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BriefcaseBusiness, CalendarDays, Check, Clock3, MapPin, RefreshCw, Route, Save, UsersRound } from "lucide-react";
import { GhostButton } from "@/components/Prototype";
import { usePrototypeState } from "@/components/PrototypeState";

const moduleSlug = "aggie-road-trips";
const storageKey = "aggies-lead:sophomore:aggie-road-trip";

const roadTrips = [
  {
    id: "road-trip-1",
    companyName: "Coming Soon",
    industry: "TBD",
    date: "TBD",
    time: "TBD",
    location: "TBD",
    eventOverview: "Details coming soon.",
    studentAthletesWillLearn: "Details coming soon.",
    whoShouldAttend: "Details coming soon.",
    transportationInformation: "Details coming soon.",
    dressCode: "Details coming soon.",
    rsvpInformation: "Details coming soon.",
  },
  {
    id: "road-trip-2",
    companyName: "Coming Soon",
    industry: "TBD",
    date: "TBD",
    time: "TBD",
    location: "TBD",
    eventOverview: "Details coming soon.",
    studentAthletesWillLearn: "Details coming soon.",
    whoShouldAttend: "Details coming soon.",
    transportationInformation: "Details coming soon.",
    dressCode: "Details coming soon.",
    rsvpInformation: "Details coming soon.",
  },
  {
    id: "road-trip-3",
    companyName: "Coming Soon",
    industry: "TBD",
    date: "TBD",
    time: "TBD",
    location: "TBD",
    eventOverview: "Details coming soon.",
    studentAthletesWillLearn: "Details coming soon.",
    whoShouldAttend: "Details coming soon.",
    transportationInformation: "Details coming soon.",
    dressCode: "Details coming soon.",
    rsvpInformation: "Details coming soon.",
  },
];

const benefits = [
  "Explore different career paths and industries",
  "Build professional connections",
  "Meet employers and industry leaders",
  "Develop networking skills",
  "Gain exposure to workplace environments",
  "Learn about internships and career opportunities",
  "Connect classroom and athletic experiences to future careers",
];

type RoadTrip = (typeof roadTrips)[number];

type AggieRoadTripState = {
  reviewedOverview: boolean;
  selectedTripId: string;
  reviewedBenefits: boolean;
  moduleStatus: "Not Started" | "In Progress" | "Completed";
  progressPercentage: number;
};

const initialState: AggieRoadTripState = {
  reviewedOverview: false,
  selectedTripId: roadTrips[0].id,
  reviewedBenefits: false,
  moduleStatus: "Not Started",
  progressPercentage: 0,
};

export function AggieRoadTripClient() {
  const { completeModule } = usePrototypeState();
  const [form, setForm] = useState<AggieRoadTripState>(initialState);
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

  const selectedTrip = roadTrips.find((trip) => trip.id === form.selectedTripId) ?? roadTrips[0];

  const completion = useMemo(() => {
    const tasks = [form.reviewedOverview, Boolean(form.selectedTripId), form.reviewedBenefits];
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

  function updateField<K extends keyof AggieRoadTripState>(field: K, value: AggieRoadTripState[K]) {
    setSavedMessage("");
    setForm((current) => ({ ...current, [field]: value }));
  }

  function viewDetails(tripId: string) {
    setSavedMessage("");
    setForm((current) => ({ ...current, selectedTripId: tripId, reviewedOverview: true }));
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
      reviewedOverview: true,
      reviewedBenefits: true,
      moduleStatus: "Completed" as const,
      progressPercentage: 100,
    };
    setForm(completedState);
    window.localStorage.setItem(storageKey, JSON.stringify(completedState));
    completeModule(moduleSlug);
    setSavedMessage("Aggie Road Trips reviewed.");
  }

  return (
    <div className="space-y-6">
      <GhostButton href="/roadmaps/sophomore">Back to Sophomore Roadmap</GhostButton>

      <section className="card-surface rounded-lg p-6 md:p-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-aggie-silver">Sophomore Roadmap</p>
            <h1 className="text-glow mt-3 text-4xl font-black tracking-tight text-white md:text-5xl">
              Aggie Road Trips
            </h1>
            <p className="mt-4 text-lg leading-8 text-aggie-light/78">
              Aggie Road Trips provide student-athletes with opportunities to visit businesses and organizations,
              build professional connections, gain real-world exposure, and explore potential career paths beyond
              athletics.
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
          <Card title="What Are Aggie Road Trips?" icon={<Route className="h-6 w-6" />}>
            <p className="leading-7 text-aggie-light/80">
              Throughout the year, Aggies Lead coordinates visits to local and regional businesses. These experiences
              allow student-athletes to learn about different industries, interact with professionals, ask questions,
              and gain insight into future career opportunities.
            </p>
          </Card>

          <Card title="Upcoming Road Trips" icon={<CalendarDays className="h-6 w-6" />}>
            <div className="grid gap-4 lg:grid-cols-3">
              {roadTrips.map((trip, index) => (
                <article
                  key={trip.id}
                  className={`flex min-h-full flex-col rounded-lg border p-5 shadow-steel transition ${
                    selectedTrip.id === trip.id
                      ? "border-aggie-chrome/45 bg-white/[0.075]"
                      : "border-aggie-silver/15 bg-white/[0.055]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="rounded-lg border border-aggie-chrome/30 bg-aggie-chrome/10 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-aggie-ice">
                      Trip {index + 1}
                    </span>
                    <BriefcaseBusiness className="h-5 w-5 shrink-0 text-aggie-ice" />
                  </div>
                  <h3 className="mt-5 text-2xl font-black text-white">{trip.companyName}</h3>
                  <div className="mt-5 space-y-3 text-sm font-bold text-aggie-light/78">
                    <TripDetail label="Industry / Business Type" value={trip.industry} />
                    <TripDetail label="Date" value={trip.date} />
                    <TripDetail label="Time" value={trip.time} />
                    <TripDetail label="Location" value={trip.location} />
                  </div>
                  <button
                    type="button"
                    onClick={() => viewDetails(trip.id)}
                    className="mt-5 inline-flex min-h-11 items-center justify-center rounded-lg border border-aggie-silver/20 bg-white/[0.045] px-4 text-sm font-black text-white transition hover:border-aggie-steel hover:bg-white/10"
                  >
                    View Details
                  </button>
                </article>
              ))}
            </div>
          </Card>

          <Card title="Road Trip Details" icon={<MapPin className="h-6 w-6" />}>
            <div className="rounded-lg border border-aggie-silver/15 bg-white/[0.045] p-5">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.18em] text-aggie-silver">Selected Road Trip</p>
                  <h3 className="mt-2 text-3xl font-black text-white">{selectedTrip.companyName}</h3>
                  <p className="mt-2 text-sm font-bold text-aggie-light/72">{selectedTrip.industry}</p>
                </div>
                <span className="rounded-lg border border-aggie-chrome/30 bg-aggie-chrome/10 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-aggie-ice">
                  Details
                </span>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-2">
                <TripDetail label="Event Overview" value={selectedTrip.eventOverview} />
                <TripDetail label="What Student-Athletes Will Learn" value={selectedTrip.studentAthletesWillLearn} />
                <TripDetail label="Who Should Attend" value={selectedTrip.whoShouldAttend} />
                <TripDetail label="Date" value={selectedTrip.date} />
                <TripDetail label="Time" value={selectedTrip.time} />
                <TripDetail label="Location" value={selectedTrip.location} />
                <TripDetail label="Transportation Information" value={selectedTrip.transportationInformation} />
                <TripDetail label="Dress Code" value={selectedTrip.dressCode} />
                <TripDetail label="RSVP Information" value={selectedTrip.rsvpInformation} />
              </div>
            </div>
          </Card>

          <Card title="Why Participate?" icon={<UsersRound className="h-6 w-6" />}>
            <div className="grid gap-3 md:grid-cols-2">
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
              I reviewed why road trips matter
            </button>
          </Card>

          <section className="rounded-lg border border-aggie-chrome/35 bg-aggie-chrome/10 p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start">
              <span className="chrome-surface grid h-12 w-12 shrink-0 place-items-center rounded-lg text-aggie-navy shadow-glow">
                <MapPin className="h-6 w-6" />
              </span>
              <div>
                <h2 className="text-2xl font-black text-white">Participation Reminder</h2>
                <p className="mt-3 leading-7 text-aggie-light/84">
                  Many Aggie Road Trips have limited capacity. Check back regularly for upcoming opportunities and
                  RSVP information.
                </p>
              </div>
            </div>
          </section>

          <Card title="Module Completion" icon={<Check className="h-6 w-6" />}>
            <p className="leading-7 text-aggie-light/78">
              Review the upcoming road trip cards and details, then mark this module when you have checked what is
              currently available.
            </p>
            <button
              type="button"
              onClick={markReviewed}
              className="chrome-surface mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border border-aggie-chrome/60 px-5 text-sm font-black text-aggie-navy shadow-glow transition hover:brightness-110 sm:w-auto"
            >
              <Check className="h-4 w-4" />
              I Reviewed Upcoming Road Trips
            </button>
            {form.moduleStatus === "Completed" && (
              <p className="mt-5 rounded-lg border border-aggie-chrome/30 bg-white/[0.08] p-4 text-sm font-bold leading-6 text-aggie-ice">
                Aggie Road Trips reviewed. Check back for upcoming business visits and RSVP details.
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
            <h2 className="text-xl font-black text-white">Road Trip Snapshot</h2>
            <div className="mt-4 space-y-3 text-sm font-bold text-aggie-light/78">
              <Snapshot label="Upcoming Trips" value={`${roadTrips.length}`} />
              <Snapshot label="Selected Trip" value={selectedTrip.companyName} />
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

function TripDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-aggie-silver/15 bg-aggie-navy/50 p-3">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-aggie-silver">{label}</p>
      <p className="mt-1 font-bold text-white">{value}</p>
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

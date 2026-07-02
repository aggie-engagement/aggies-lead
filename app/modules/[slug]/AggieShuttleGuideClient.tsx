"use client";

import Link from "next/link";
import { Bus, Clock3, Leaf, Map, Route, Zap } from "lucide-react";
import { CompletionPanel } from "@/components/CompletionPanel";
import { GhostButton } from "@/components/Prototype";
import { usePrototypeState } from "@/components/PrototypeState";
import { nextFreshmanModuleHref } from "@/lib/roadmaps";

const facts = [
  "10 shuttles operate daily",
  "5 fixed routes run Monday-Friday from 7:00 AM to 5:00 PM",
  "Evening route operates from 5:00 PM to 10:00 PM",
  "Stadium Express (Silver Route) runs between the Stadium and the bus circle near the Taggart Student Center (TSC)",
];

type AggieShuttleGuideClientProps = {
  moduleSlug?: string;
  backHref?: string;
  nextHref?: string;
};

export function AggieShuttleGuideClient({
  moduleSlug = "aggie-shuttle-guide",
  backHref = "/my-roadmap",
  nextHref = nextFreshmanModuleHref("aggie-shuttle-guide"),
}: AggieShuttleGuideClientProps = {}) {
  const { completeModule } = usePrototypeState();

  return (
    <div className="space-y-6">
      <GhostButton href={backHref}>Back to My Roadmap</GhostButton>

      <section className="card-surface rounded-lg p-7">
        <p className="text-sm font-bold uppercase tracking-[0.28em] text-aggie-silver">
          Module
        </p>
        <h1 className="text-glow mt-3 text-4xl font-black tracking-tight text-white">
          Aggie Shuttle Guide
        </h1>
        <p className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-aggie-muted">
          <Clock3 className="h-4 w-4" />
          Estimated Time: 10 minutes
        </p>
        <p className="mt-5 max-w-4xl text-lg leading-8 text-aggie-light/78">
          The Aggie Shuttle is a fare-free transportation service provided to the Utah State
          University community. Using natural gas, the shuttle system offers a cleaner and more
          environmentally friendly way to help students, faculty, staff, and visitors travel around
          campus.
        </p>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <InfoCard title="Why Use the Aggie Shuttle?" icon={<Bus className="h-7 w-7" />}>
          Use the Aggie Shuttle as a quick, convenient, and environmentally friendly way to get
          around campus. Whether you&apos;re heading to class, practice, study hall, or another campus
          destination, the shuttle can help you save time and avoid long walks across campus.
        </InfoCard>

        <article className="card-surface rounded-lg p-6">
          <span className="grid h-12 w-12 place-items-center rounded-lg border border-aggie-silver/20 bg-aggie-steel/16 text-aggie-ice shadow-steel">
            <Route className="h-7 w-7" />
          </span>
          <h2 className="mt-5 text-2xl font-black text-white">Real-Time Shuttle Tracking</h2>
          <p className="mt-3 leading-7 text-aggie-light/74">
            Find the fastest route and track shuttle locations in real time using the Passio GO! app
            or web application.
          </p>
          <Link
            href="https://passiogo.com/"
            target="_blank"
            rel="noreferrer"
            className="chrome-surface mt-5 inline-flex min-h-12 items-center justify-center rounded-lg border border-aggie-chrome/60 px-5 text-sm font-black text-aggie-navy shadow-glow transition hover:brightness-110"
          >
            View Shuttle Routes
          </Link>
        </article>
      </section>

      <section className="card-surface rounded-lg p-6">
        <div className="mb-5 flex items-center gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-aggie-silver/20 bg-aggie-steel/16 text-aggie-ice shadow-steel">
            <Leaf className="h-6 w-6" />
          </span>
          <h2 className="text-2xl font-black text-white">Shuttle Facts</h2>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {facts.map((fact) => (
            <div
              key={fact}
              className="rounded-lg border border-aggie-silver/15 bg-white/[0.045] p-4 text-sm font-bold leading-6 text-aggie-light/84"
            >
              {fact}
            </div>
          ))}
        </div>
      </section>

      <section className="card-surface rounded-lg p-6">
        <div className="mb-5 flex items-center gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-aggie-silver/20 bg-aggie-steel/16 text-aggie-ice shadow-steel">
            <Map className="h-6 w-6" />
          </span>
          <h2 className="text-2xl font-black text-white">Route Map</h2>
        </div>
        <img
          src="/images/aggie-shuttle-route.jpg"
          alt="Aggie Shuttle route map"
          className="w-full rounded-lg border border-aggie-silver/15 object-contain"
        />
      </section>

      <section className="card-surface rounded-lg p-6">
        <div className="flex gap-4">
          <span className="chrome-surface grid h-12 w-12 shrink-0 place-items-center rounded-lg text-aggie-navy shadow-glow">
            <Zap className="h-6 w-6" />
          </span>
          <div>
            <h2 className="text-2xl font-black text-white">Quick Tip</h2>
            <p className="mt-3 leading-7 text-aggie-light/78">
              The Stadium Express (Silver Route) is one of the fastest ways for student-athletes to
              travel between the athletics facilities and central campus.
            </p>
          </div>
        </div>
      </section>

      <CompletionPanel
        moduleSlug={moduleSlug}
        onComplete={() => completeModule(moduleSlug)}
        backHref={backHref}
        nextHref={nextHref}
        badgeTitle="Aggie Shuttle Guide Reviewed"
        completeLabel="Mark Shuttle Guide Reviewed"
      />
    </div>
  );
}

function InfoCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <article className="card-surface rounded-lg p-6">
      <span className="grid h-12 w-12 place-items-center rounded-lg border border-aggie-silver/20 bg-aggie-steel/16 text-aggie-ice shadow-steel">
        {icon}
      </span>
      <h2 className="mt-5 text-2xl font-black text-white">{title}</h2>
      <p className="mt-3 leading-7 text-aggie-light/74">{children}</p>
    </article>
  );
}

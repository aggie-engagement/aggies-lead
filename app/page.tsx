import { ArrowRight, Compass, GraduationCap, Network, Trophy } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ChromeButton, GhostButton } from "@/components/Prototype";

const pillars: [string, string, LucideIcon][] = [
  ["Personal roadmap", "Know what to do next each year at Utah State.", Compass],
  ["Career momentum", "Build resumes, LinkedIn, internships, and confidence.", GraduationCap],
  ["Aggie network", "Connect with staff, mentors, alumni, and opportunities.", Network],
];

export default function LandingPage() {
  return (
    <div className="space-y-12">
      <section className="grid min-h-[calc(100vh-9rem)] items-center gap-10 py-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-aggie-silver">
            Utah State Student-Athlete Development
          </p>
          <h1 className="text-glow max-w-4xl text-5xl font-black tracking-tight text-white md:text-7xl">
            Aggies Lead
          </h1>
          <p className="mt-5 max-w-2xl text-xl leading-9 text-aggie-light/80">
            A clickable prototype for the student-athlete development platform:
            roadmaps, modules, resources, events, mentors, internships, bookings,
            and badges in one polished home base.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ChromeButton href="/onboarding">Get Started</ChromeButton>
            <GhostButton href="/dashboard">View Dashboard</GhostButton>
            <GhostButton href="/roadmaps">Explore Roadmaps</GhostButton>
          </div>
        </div>

        <div className="card-surface rounded-lg p-6">
          <div className="rounded-lg border border-aggie-silver/20 bg-aggie-navy/80 p-5">
            <div className="flex items-center justify-between gap-4 border-b border-aggie-silver/15 pb-5">
              <div>
                <p className="text-sm font-semibold text-aggie-muted">Prototype Preview</p>
                <h2 className="mt-1 text-2xl font-black text-white">Freshman Roadmap</h2>
              </div>
              <span className="chrome-surface rounded-lg border border-aggie-chrome/50 px-3 py-2 text-sm font-black text-aggie-navy shadow-steel">
                24%
              </span>
            </div>
            <div className="mt-6 space-y-4">
              {[
                "Complete onboarding questionnaire",
                "Open Helper Helper module",
                "Start LinkedIn foundations",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-lg bg-white/[0.06] p-4">
                  <ArrowRight className="h-5 w-5 text-aggie-ice" />
                  <span className="font-semibold text-aggie-light">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {pillars.map(([title, text, Icon]) => (
          <article key={title} className="card-surface rounded-lg p-6">
            <span className="mb-5 grid h-12 w-12 place-items-center rounded-lg border border-aggie-silver/20 bg-aggie-steel/16 text-aggie-ice shadow-steel">
              <Icon className="h-6 w-6" />
            </span>
            <h2 className="text-xl font-black text-white">{title}</h2>
            <p className="mt-3 leading-7 text-aggie-light/70">{text}</p>
          </article>
        ))}
      </section>
    </div>
  );
}

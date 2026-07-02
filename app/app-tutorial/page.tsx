import Link from "next/link";
import { ArrowRight, Compass, HelpCircle, Route, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

const items: [string, string, LucideIcon][] = [
  ["Dashboard", "Start here to see what to do next.", Compass],
  ["My Roadmap", "Follow your assigned development path.", Route],
  ["Explore", "Find roadmaps, setup modules, templates, and career basics.", Compass],
  ["Network", "Review alumni, mentors, and suggested connections.", Users],
  ["Need help?", "Contact aggieslead@usu.edu.", HelpCircle],
];

export default function AppTutorialPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Welcome"
        title="How to use Aggies Lead"
        description="A quick orientation to help you find the right module, resource, or person when you need support."
      />
      <section className="grid gap-4 md:grid-cols-2">
        {items.map(([title, text, Icon]) => (
          <article key={title} className="card-surface rounded-lg p-6">
            <span className="grid h-12 w-12 place-items-center rounded-lg border border-aggie-silver/20 bg-aggie-steel/16 text-aggie-ice shadow-steel">
              <Icon className="h-6 w-6" />
            </span>
            <h2 className="mt-5 text-2xl font-black text-white">{title}</h2>
            <p className="mt-3 leading-7 text-aggie-light/72">{text}</p>
          </article>
        ))}
      </section>
      <Link
        href="/dashboard"
        className="chrome-surface mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-aggie-chrome/60 px-5 text-sm font-black text-aggie-navy shadow-glow transition hover:brightness-110"
      >
        Go to Dashboard
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

import { BookOpen, DollarSign, FileText, Network, Route, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { FeatureCard } from "@/components/Prototype";

const cards: [string, string, string, LucideIcon][] = [
  ["All Roadmaps", "/roadmaps", "Browse every year-by-year development roadmap.", Route],
  ["Helper Helper", "/helper-helper", "Set up hour tracking and app navigation.", Wrench],
  ["LinkedIn", "/linkedin", "Build your professional profile foundation.", Network],
  ["Templates", "/modules/templates", "Placeholder for PDFs, examples, and templates.", FileText],
  ["Career Basics", "/modules/career-basics", "Start learning core career readiness concepts.", BookOpen],
  ["Resume Help", "/modules/resume-help", "Placeholder resume support and examples.", FileText],
  ["Financial Literacy", "/modules/financial-literacy", "Budgeting, credit, and salary basics.", DollarSign],
];

export default function ExplorePage() {
  return (
    <div>
      <PageHeader
        eyebrow="Explore"
        title="Find setup modules and career basics"
        description="A cleaner grouped home for roadmaps, core setup modules, templates, and professional development basics."
      />
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map(([title, href, text, Icon]) => (
          <FeatureCard key={title} title={title} href={href} text={text} icon={Icon} />
        ))}
      </section>
    </div>
  );
}

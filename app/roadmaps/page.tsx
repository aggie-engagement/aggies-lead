import { GraduationCap, Map, RefreshCcw } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { FeatureCard } from "@/components/Prototype";

const roadmaps = [
  ["Freshman / First-Year", "/roadmaps/freshman", "Start strong with onboarding, campus tools, LinkedIn, and first-year foundations."],
  ["Sophomore / Second-Year", "/roadmaps/sophomore", "Refresh career materials, expand your network, and explore experiences."],
  ["Junior / Third-Year", "/roadmaps/junior", "Prepare for internships, interviews, career fairs, and targeted outreach."],
  ["Senior / Fourth-Year", "/roadmaps/senior", "Launch toward full-time opportunities, references, and transition planning."],
  ["Graduate / Fifth-Year", "/roadmaps/graduate", "Clarify career transition strategy and mentor younger student-athletes."],
  ["Transfer Add-On", "/roadmaps/transfer", "Catch up quickly with campus navigation, staff connections, and timeline planning."],
];

export default function RoadmapsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Roadmaps"
        title="Choose your development path"
        description="Prototype roadmap cards for every student-athlete stage. Each card opens a clickable placeholder roadmap."
      />

      <section className="card-surface mb-8 rounded-lg p-6">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-aggie-silver">
          My Recommended Roadmap
        </p>
        <div className="mt-5">
          <FeatureCard
            href="/roadmaps/freshman"
            title="Freshman / First-Year"
            text="Recommended starter path for building Aggies Lead basics, LinkedIn foundations, and campus confidence."
            icon={Map}
            cta="Continue recommended roadmap"
          />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-black text-white">All Roadmaps</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {roadmaps.map(([title, href, text], index) => (
            <FeatureCard
              key={href}
              href={href}
              title={title}
              text={text}
              icon={index === 5 ? RefreshCcw : GraduationCap}
              cta="Open roadmap"
            />
          ))}
        </div>
      </section>
    </div>
  );
}

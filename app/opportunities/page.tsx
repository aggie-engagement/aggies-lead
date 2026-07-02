import { BriefcaseBusiness, Bus, CalendarDays, GraduationCap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { FeatureCard, FilterShell } from "@/components/Prototype";

const groups: [string, string, string, LucideIcon][] = [
  ["Internships", "/internships", "Explore internship placeholders.", BriefcaseBusiness],
  ["Fellowships", "/modules/fellowships", "Placeholder fellowship opportunities.", GraduationCap],
  ["Events", "/events", "Development events, speakers, and workshops.", CalendarDays],
  ["Job Shadows", "/modules/job-shadows", "Short professional exposure experiences.", BriefcaseBusiness],
  ["Aggie Road Trips", "/modules/aggie-road-trips", "Future employer and alumni trips.", Bus],
  ["Aggies Go Pro", "/modules/aggies-go-pro", "Career support and transition programming.", GraduationCap],
];

const mock = ["Sports Marketing Micro-Internship", "Career Fair Prep Night", "Athletics Operations Shadow"];

export default function OpportunitiesPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Opportunities"
        title="Find events and experiences"
        description="A grouped hub for internships, events, fellowships, job shadows, road trips, and Aggies Go Pro."
      />
      <FilterShell
        placeholder="Search opportunities..."
        filters={["location", "career field", "time commitment", "paid/unpaid", "internal/external"]}
      />
      <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {groups.map(([title, href, text, Icon]) => (
          <FeatureCard key={title} title={title} href={href} text={text} icon={Icon} />
        ))}
      </section>
      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {mock.map((title) => (
          <article key={title} className="card-surface rounded-lg p-5">
            <h2 className="text-xl font-black text-white">{title}</h2>
            <p className="mt-3 text-sm font-semibold leading-6 text-aggie-muted">
              Mock opportunity card for prototype testing.
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}

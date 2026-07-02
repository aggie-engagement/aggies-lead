import { BriefcaseBusiness, Clock3, MapPin } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { FilterShell } from "@/components/Prototype";

const opportunities = [
  ["Sports Marketing Micro-Internship", "Marketing", "Logan, UT", "5 hrs/week", "Paid"],
  ["Community Impact Fellowship", "Nonprofit", "Hybrid", "8 hrs/week", "Unpaid"],
  ["Athletics Operations Shadow", "Sports Business", "Campus", "One day", "Internal"],
  ["Data Analytics Project", "Technology", "Remote", "Flexible", "Paid"],
];

export default function InternshipsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Internships & Fellowships"
        title="Explore opportunity placeholders"
        description="Search, filter, and save mock internships while testing how the opportunity hub should flow."
      />
      <FilterShell
        placeholder="Search internships, fellowships, employers, or industries..."
        filters={["Career Field", "Location", "Time Commitment", "Paid / Unpaid", "Internal / External"]}
      />
      <section className="mt-6 grid gap-4 md:grid-cols-2">
        {opportunities.map(([title, field, location, time, pay]) => (
          <article key={title} className="card-surface rounded-lg p-6">
            <BriefcaseBusiness className="h-8 w-8 text-aggie-ice" />
            <h2 className="mt-5 text-2xl font-black text-white">{title}</h2>
            <p className="mt-3 leading-7 text-aggie-light/72">
              Placeholder {field.toLowerCase()} opportunity for testing save,
              filter, and detail-card behavior.
            </p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm font-bold text-aggie-muted">
              <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4" />{location}</span>
              <span className="inline-flex items-center gap-2"><Clock3 className="h-4 w-4" />{time}</span>
              <span>{pay}</span>
            </div>
            <button type="button" className="chrome-surface mt-5 min-h-11 rounded-lg border border-aggie-chrome/60 px-4 text-sm font-black text-aggie-navy shadow-steel">
              Save Opportunity
            </button>
          </article>
        ))}
      </section>
    </div>
  );
}

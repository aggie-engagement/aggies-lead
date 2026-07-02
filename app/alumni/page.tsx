import { MapPin, Users } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { FilterShell } from "@/components/Prototype";

const alumni = [
  ["Jordan Lee", "Football", "Marketing", "Brand partnerships", "Salt Lake City, UT"],
  ["Maya Torres", "Soccer", "Kinesiology", "Physical therapy", "Boise, ID"],
  ["Sam Patel", "Track & Field", "Finance", "Corporate banking", "Denver, CO"],
  ["Avery Johnson", "Basketball", "Communications", "Sports media", "Logan, UT"],
];

export default function AlumniPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Alumni / Mentor Network"
        title="Find people who can help"
        description="Search and filter placeholder alumni and mentor matches before the real directory is connected."
      />
      <FilterShell
        placeholder="Search alumni, mentors, majors, or career fields..."
        filters={["Sport", "Major", "Career Field", "Location"]}
      />
      <section className="mt-6 grid gap-5 lg:grid-cols-[1fr_0.8fr]">
        <div className="grid gap-4">
          {alumni.map(([name, sport, major, field, location]) => (
            <article key={name} className="card-surface rounded-lg p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="text-2xl font-black text-white">{name}</h2>
                  <p className="mt-2 font-bold text-aggie-ice">{sport} alum</p>
                  <p className="mt-3 leading-7 text-aggie-light/72">
                    {major} background with placeholder experience in {field}.
                  </p>
                  <p className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-aggie-muted">
                    <MapPin className="h-4 w-4" />
                    {location}
                  </p>
                </div>
                <button type="button" className="chrome-surface min-h-11 rounded-lg border border-aggie-chrome/60 px-4 text-sm font-black text-aggie-navy shadow-steel">
                  Request Mentor
                </button>
              </div>
            </article>
          ))}
        </div>
        <article className="card-surface h-fit rounded-lg p-6">
          <Users className="h-8 w-8 text-aggie-ice" />
          <h2 className="mt-5 text-2xl font-black text-white">Suggested Matches</h2>
          <p className="mt-3 leading-7 text-aggie-light/72">
            Placeholder logic will eventually recommend alumni by sport, major,
            career field, location, transfer status, and interests.
          </p>
        </article>
      </section>
    </div>
  );
}

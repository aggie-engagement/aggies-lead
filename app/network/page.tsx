import { MapPin, MessageSquarePlus, Users } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { FilterShell, FeatureCard } from "@/components/Prototype";

const alumni = [
  ["Jordan Lee", "Football", "Marketing", "Brand partnerships", "Salt Lake City, UT"],
  ["Maya Torres", "Soccer", "Kinesiology", "Physical therapy", "Boise, ID"],
  ["Sam Patel", "Track & Field", "Finance", "Corporate banking", "Denver, CO"],
];

export default function NetworkPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Network"
        title="Build intentional connections"
        description="Explore alumni, mentor requests, and suggested connections in one grouped network hub."
      />
      <section className="grid gap-4 md:grid-cols-3">
        <FeatureCard title="Alumni Network" href="/alumni" text="Browse mock alumni and future mentor matches." icon={Users} />
        <FeatureCard title="Mentor Requests" href="/modules/mentor-requests" text="Placeholder for requesting guidance." icon={MessageSquarePlus} />
        <FeatureCard title="Suggested Connections" href="/modules/suggested-connections" text="Future recommendations by sport, major, and interest." icon={Users} />
      </section>
      <div className="mt-6">
        <FilterShell placeholder="Search network..." filters={["sport", "major", "career field", "location"]} />
      </div>
      <section className="mt-6 grid gap-4 lg:grid-cols-3">
        {alumni.map(([name, sport, major, field, location]) => (
          <article key={name} className="card-surface rounded-lg p-6">
            <h2 className="text-2xl font-black text-white">{name}</h2>
            <p className="mt-2 font-bold text-aggie-ice">{sport} alum</p>
            <p className="mt-3 leading-7 text-aggie-light/72">
              {major} background with placeholder experience in {field}.
            </p>
            <p className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-aggie-muted">
              <MapPin className="h-4 w-4" />
              {location}
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}

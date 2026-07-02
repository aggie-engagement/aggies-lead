import { Award } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

const badges = [
  "Helper Helper Ready",
  "LinkedIn Starter",
  "Roadmap Starter",
  "Resume Ready",
  "Networking Starter",
  "Career Fair Ready",
  "Aggies Go Pro",
  "Career Launch",
];

export default function BadgesPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Badges"
        title="Track milestone badges"
        description="Placeholder badge gallery for testing module completion and achievement flow."
      />
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {badges.map((badge, index) => (
          <article key={badge} className="card-surface rounded-lg p-6 text-center">
            <span className={`mx-auto grid h-16 w-16 place-items-center rounded-lg ${index < 2 ? "chrome-surface text-aggie-navy shadow-glow" : "border border-aggie-silver/20 bg-white/[0.045] text-aggie-muted"}`}>
              <Award className="h-8 w-8" />
            </span>
            <h2 className="mt-5 text-xl font-black text-white">{badge}</h2>
            <p className="mt-3 text-sm font-bold text-aggie-muted">
              {index < 2 ? "Prototype earned" : "Locked placeholder"}
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}

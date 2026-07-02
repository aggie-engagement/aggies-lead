import { Award, BookOpen, Bus, Compass, FileText, HeartHandshake, Map, Network, Users } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { FeatureCard, GhostButton } from "@/components/Prototype";

const iconPool = [FileText, Network, Users, Compass, Bus, BookOpen, HeartHandshake, Award, Map];

export function RoadmapPageView({
  eyebrow,
  title,
  description,
  modules,
}: {
  eyebrow: string;
  title: string;
  description: string;
  modules: { title: string; href: string; description?: string }[];
}) {
  return (
    <div>
      <div className="mb-6">
        <GhostButton href="/roadmaps">Back to All Roadmaps</GhostButton>
      </div>
      <PageHeader eyebrow={eyebrow} title={title} description={description} />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {modules.map((module, index) => (
          <FeatureCard
            key={module.title}
            href={module.href}
            title={module.title}
            text={module.description ?? "Placeholder module card for testing the roadmap flow."}
            icon={iconPool[index % iconPool.length]}
            cta="Open module"
          />
        ))}
      </section>
    </div>
  );
}

import { RoadmapPageView } from "../RoadmapPageView";
import { roadmapModules, moduleHref } from "@/lib/roadmaps";

export default function FreshmanRoadmapPage() {
  return (
    <RoadmapPageView
      eyebrow="Freshman Roadmap"
      title="Freshman / First-Year"
      description="Start with the foundational tools and people that help you navigate Utah State as a student-athlete."
      modules={roadmapModules.freshman.map((title) => ({ title, href: moduleHref(title) }))}
    />
  );
}

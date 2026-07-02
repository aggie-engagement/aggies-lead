import { RoadmapPageView } from "../RoadmapPageView";
import { roadmapModules, moduleHref } from "@/lib/roadmaps";

const moduleDescriptions: Record<string, string> = {
  "Transfer Welcome Guide":
    "Get oriented to Utah State Athletics with first-week tasks, key resources, common questions, and success tips.",
  "Meet Aggies Lead Staff":
    "Meet the Aggies Lead team, interns, fellows, and the support areas available to transfer student-athletes.",
  "Campus Navigation":
    "Review the same athletics and campus locations, staff contacts, maps, and navigation details used in the Freshman module.",
  "Aggie Shuttle":
    "Use the same shuttle guide, route map, tracking link, facts, and review action from the Freshman module.",
};

export default function TransferRoadmapPage() {
  return (
    <RoadmapPageView
      eyebrow="Transfer Add-On"
      title="Transfer Add-On"
      description="A catch-up path for transfer student-athletes learning USU systems, people, and career development expectations."
      modules={roadmapModules.transfer.map((title) => ({ title, href: moduleHref(title), description: moduleDescriptions[title] }))}
    />
  );
}

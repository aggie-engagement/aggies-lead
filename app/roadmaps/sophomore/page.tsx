import { RoadmapPageView } from "../RoadmapPageView";
import { roadmapModules, moduleHref } from "@/lib/roadmaps";

const moduleDescriptions: Record<string, string> = {
  "Aggie Road Trips":
    "Explore upcoming business visits, review trip details, and learn how road trips can connect athletics to future career opportunities.",
  "Job Shadow / Micro-Internship":
    "Prepare for an early professional exposure experience, identify people to contact, and choose a next step.",
  "Financial Literacy":
    "Complete the requirement by attending a financial literacy event or choosing a self-guided mini-module on money basics.",
  "Informational Interview":
    "Learn how to find a professional, reach out, ask strong questions, and follow up after a career conversation.",
  "Professional Network List":
    "Build a starter professional network, identify people and organizations to follow, and track networking goals.",
};

export default function SophomoreRoadmapPage() {
  function sophomoreModuleHref(title: string) {
    if (title === "Job Shadow / Micro-Internship") return "/modules/job-shadow-micro-internship-sophomore";
    return moduleHref(title);
  }

  return (
    <RoadmapPageView
      eyebrow="Sophomore Roadmap"
      title="Sophomore / Second-Year"
      description="Build momentum with career materials, networking exposure, and early professional experiences."
      modules={roadmapModules.sophomore.map((title) => ({ title, href: sophomoreModuleHref(title), description: moduleDescriptions[title] }))}
    />
  );
}

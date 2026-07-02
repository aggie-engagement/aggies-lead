import { RoadmapPageView } from "../RoadmapPageView";
import { roadmapModules, moduleHref } from "@/lib/roadmaps";

const moduleDescriptions: Record<string, string> = {
  "Final Resume Review":
    "Complete a final resume audit, confirm application readiness, and prepare materials for graduation opportunities.",
  "LinkedIn Final Update":
    "Finalize LinkedIn for graduation, employment, graduate school, networking, and transition opportunities.",
  "3 Professional References":
    "Secure three professional references and organize their contact information before graduation.",
  "Job Application Tracker":
    "Track job applications, interview progress, follow-ups, weekly search goals, and career support actions.",
  "Aggies Go Pro Career Support":
    "Prepare for professional athletics opportunities while planning for long-term career success after competition.",
  "Advanced Mock Interview":
    "Practice advanced interview questions, schedule support, and prepare for employment or graduate school interviews.",
  "Career Mapping & Transition":
    "Create a clear post-graduation transition plan with career goals, readiness steps, and a 90-day action plan.",
  "Life After Sport":
    "Reflect on the transition out of competitive athletics and build confidence for your next chapter after Utah State.",
  "Alumni Networking":
    "Stay connected with Utah State alumni, former student-athletes, mentors, and future Aggie opportunities.",
};

export default function SeniorRoadmapPage() {
  return (
    <RoadmapPageView
      eyebrow="Senior Roadmap"
      title="Senior / Fourth-Year"
      description="Move toward career launch with applications, references, transition planning, and alumni networking."
      modules={roadmapModules.senior.map((title) => ({ title, href: moduleHref(title), description: moduleDescriptions[title] }))}
    />
  );
}

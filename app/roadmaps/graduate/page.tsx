import { RoadmapPageView } from "../RoadmapPageView";
import { roadmapModules, moduleHref } from "@/lib/roadmaps";

const moduleDescriptions: Record<string, string> = {
  "Career Transition Strategy":
    "Build a focused transition plan for employment, graduate school, professional athletics, or your next opportunity.",
  "Graduate Resume Update":
    "Tailor your resume toward employment, graduate school, professional athletics, or other post-graduation goals.",
  "LinkedIn Refresh":
    "Refresh your LinkedIn profile to reflect your transition from student-athlete to professional.",
  "Advanced Networking Strategy":
    "Leverage existing relationships, track outreach, and build a strategic networking plan for career advancement.",
  "Full-Time Job Search Plan":
    "Build a structured job search strategy with target employers, weekly goals, status tracking, and career support.",
  "Industry Interview Prep":
    "Prepare for industry-specific interviews with research, practice questions, reflection, and mock interview support.",
  "Long-Term Career Planning":
    "Define long-term career goals, growth plans, mentorship needs, and a professional development roadmap.",
  "Post-USU Transition Checklist":
    "Complete your final transition checklist and reflect on your next chapter after Utah State.",
};

export default function GraduateRoadmapPage() {
  return (
    <RoadmapPageView
      eyebrow="Graduate Roadmap"
      title="Graduate / Fifth-Year"
      description="Use your final connected year to sharpen transition plans and support younger student-athletes."
      modules={roadmapModules.graduate.map((title) => ({ title, href: moduleHref(title), description: moduleDescriptions[title] }))}
    />
  );
}

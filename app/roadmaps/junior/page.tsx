import { RoadmapPageView } from "../RoadmapPageView";
import { roadmapModules, moduleHref } from "@/lib/roadmaps";

const moduleDescriptions: Record<string, string> = {
  "Advanced Resume Review":
    "Assess your resume, strengthen bullet points, use review resources, and rate readiness for future opportunities.",
  "Mock Interview":
    "Prepare for common interview questions, practice the STAR method, schedule a mock interview, and rate your confidence.",
  "Career Fair Prep":
    "Prepare your resume, elevator pitch, employer questions, follow-up plan, and goals for career fair conversations.",
  "Internship / Fellowship Applications":
    "Review application readiness, find opportunity resources, and track internship or fellowship application steps.",
  "Job Shadow / Micro-Internship":
    "Prepare for a professional shadowing experience, ask strong questions, and reflect on career-readiness next steps.",
  "Aggies Go Pro":
    "Explore professional athletics pathways, prepare for pro opportunities, and plan for life after competition.",
  "LinkedIn Optimization":
    "Optimize your profile for internships, networking opportunities, graduate school, and future employment.",
  "Networking Outreach":
    "Identify professional contacts, send outreach messages, track follow-ups, and build career connections.",
  "Reference Building":
    "Identify strong references, practice asking professionally, and track reference contact information.",
  "Career Mapping Session":
    "Connect interests, skills, experience gaps, and goals into a clear post-graduation action plan.",
};

export default function JuniorRoadmapPage() {
  return (
    <RoadmapPageView
      eyebrow="Junior Roadmap"
      title="Junior / Third-Year"
      description="Prepare for interviews, internships, career fairs, and more targeted professional outreach."
      modules={roadmapModules.junior.map((title) => ({ title, href: moduleHref(title), description: moduleDescriptions[title] }))}
    />
  );
}

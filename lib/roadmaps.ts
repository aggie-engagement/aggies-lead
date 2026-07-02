export type RoadmapKey = "freshman" | "sophomore" | "junior" | "senior" | "graduate" | "transfer";

export const roadmapModules: Record<RoadmapKey, string[]> = {
  freshman: [
    "Helper Helper Setup",
    "LinkedIn Setup",
    "Campus Navigation + Who You Should Know",
    "Aggie Shuttle Guide",
    "Career Exploration",
    "Resume Basics",
    "Intro to Networking",
    "First-Year Completion Badge",
  ],
  sophomore: [
    "Helper Helper Setup",
    "Resume Review & Update",
    "LinkedIn Review & Update",
    "Guest Speaker Event",
    "Aggie Road Trips",
    "Job Shadow / Micro-Internship",
    "Financial Literacy",
    "Informational Interview",
    "Leadership / Service Opportunity",
    "Career Confidence Check-In",
    "Professional Network List",
  ],
  junior: [
    "Helper Helper Setup",
    "Advanced Resume Review",
    "Mock Interview",
    "Career Fair Prep",
    "Internship / Fellowship Applications",
    "Job Shadow / Micro-Internship",
    "Aggies Go Pro",
    "LinkedIn Optimization",
    "Networking Outreach",
    "Reference Building",
    "Career Mapping Session",
  ],
  senior: [
    "Helper Helper Setup",
    "Final Resume Review",
    "LinkedIn Final Update",
    "3 Professional References",
    "Job Application Tracker",
    "Aggies Go Pro Career Support",
    "Advanced Mock Interview",
    "Career Mapping & Transition",
    "Life After Sport",
    "Salary & Benefits Basics",
    "Alumni Networking",
  ],
  graduate: [
    "Helper Helper Setup",
    "Career Transition Strategy",
    "Graduate Resume Update",
    "LinkedIn Refresh",
    "Advanced Networking Strategy",
    "Full-Time Job Search Plan",
    "Mentor Younger Student-Athletes",
    "Alumni Networking Plan",
    "Industry Interview Prep",
    "Long-Term Career Planning",
    "Post-USU Transition Checklist",
  ],
  transfer: [
    "Transfer Welcome Guide",
    "Meet Aggies Lead Staff",
    "Campus Navigation",
    "Aggie Shuttle",
    "Helper Helper Setup",
    "Career Development Catch-Up",
    "Resume & LinkedIn Audit",
    "Mentor / Alumni Connection",
    "Timeline Planning Meeting",
    "Community Integration Goal",
  ],
};

export const roadmapTitles: Record<RoadmapKey, string> = {
  freshman: "Freshman / First-Year Roadmap",
  sophomore: "Sophomore / Second-Year Roadmap",
  junior: "Junior / Third-Year Roadmap",
  senior: "Senior / Fourth-Year Roadmap",
  graduate: "Graduate / Fifth-Year Roadmap",
  transfer: "Transfer Add-On",
};

export function slug(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function moduleHref(title: string) {
  if (title === "Helper Helper Setup") return "/helper-helper";
  if (title === "LinkedIn Setup") return "/linkedin";
  return `/modules/${slug(title)}`;
}

export function nextFreshmanModuleHref(currentSlug: string) {
  const index = roadmapModules.freshman.findIndex((title) => slug(title) === currentSlug);
  const nextTitle = roadmapModules.freshman[index + 1];

  return nextTitle ? moduleHref(nextTitle) : "/my-roadmap";
}

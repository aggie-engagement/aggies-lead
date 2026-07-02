import { BookOpen, Clock3, Lightbulb } from "lucide-react";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { GhostButton } from "@/components/Prototype";
import { ModuleProgressShell } from "@/components/ModuleProgressShell";
import { nextFreshmanModuleHref } from "@/lib/roadmaps";
import { AdvancedResumeReviewClient } from "./AdvancedResumeReviewClient";
import { AggiesGoProCareerSupportClient } from "./AggiesGoProCareerSupportClient";
import { AggiesGoProClient } from "./AggiesGoProClient";
import { AggieRoadTripClient } from "./AggieRoadTripClient";
import { AggieShuttleGuideClient } from "./AggieShuttleGuideClient";
import { AdvancedMockInterviewClient } from "./AdvancedMockInterviewClient";
import { AdvancedNetworkingStrategyClient } from "./AdvancedNetworkingStrategyClient";
import { AlumniNetworkingClient } from "./AlumniNetworkingClient";
import { CareerFairPrepClient } from "./CareerFairPrepClient";
import { CareerMappingTransitionClient } from "./CareerMappingTransitionClient";
import { CareerMappingSessionClient } from "./CareerMappingSessionClient";
import { CareerExplorationClient } from "./CareerExplorationClient";
import { CampusNavigationWhoClient } from "./CampusNavigationWhoClient";
import { FinalResumeReviewClient } from "./FinalResumeReviewClient";
import { FinancialLiteracyClient } from "./FinancialLiteracyClient";
import { FullTimeJobSearchPlanClient } from "./FullTimeJobSearchPlanClient";
import { GuestSpeakerEventClient } from "./GuestSpeakerEventClient";
import { GraduateCareerTransitionStrategyClient } from "./GraduateCareerTransitionStrategyClient";
import { GraduateResumeUpdateClient } from "./GraduateResumeUpdateClient";
import { InformationalInterviewClient } from "./InformationalInterviewClient";
import { IndustryInterviewPrepClient } from "./IndustryInterviewPrepClient";
import { InternshipFellowshipApplicationsClient } from "./InternshipFellowshipApplicationsClient";
import { IntroNetworkingClient } from "./IntroNetworkingClient";
import { JobApplicationTrackerClient } from "./JobApplicationTrackerClient";
import { JobShadowMicroInternshipClient } from "./JobShadowMicroInternshipClient";
import { LinkedInFinalUpdateClient } from "./LinkedInFinalUpdateClient";
import { LinkedInRefreshClient } from "./LinkedInRefreshClient";
import { LifeAfterSportClient } from "./LifeAfterSportClient";
import { LinkedInReviewUpdateClient } from "./LinkedInReviewUpdateClient";
import { LinkedInOptimizationClient } from "./LinkedInOptimizationClient";
import { LongTermCareerPlanningClient } from "./LongTermCareerPlanningClient";
import { MeetAggiesLeadStaffClient } from "./MeetAggiesLeadStaffClient";
import { MockInterviewClient } from "./MockInterviewClient";
import { ModuleCompletionClient } from "./ModuleCompletionClient";
import { NetworkingOutreachClient } from "./NetworkingOutreachClient";
import { PostUsuTransitionChecklistClient } from "./PostUsuTransitionChecklistClient";
import { ProfessionalNetworkListClient } from "./ProfessionalNetworkListClient";
import { ReferenceBuildingClient } from "./ReferenceBuildingClient";
import { ResumeBasicsClient } from "./ResumeBasicsClient";
import { ResumeReviewUpdateClient } from "./ResumeReviewUpdateClient";
import { SophomoreJobShadowMicroInternshipClient } from "./SophomoreJobShadowMicroInternshipClient";
import { ThreeProfessionalReferencesClient } from "./ThreeProfessionalReferencesClient";
import { TransferAggieShuttleGuideClient } from "./TransferAggieShuttleGuideClient";
import { TransferCampusNavigationClient } from "./TransferCampusNavigationClient";
import { TransferWelcomeGuideClient } from "./TransferWelcomeGuideClient";

export default async function PlaceholderModulePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (slug === "aggies-lead" || slug === "aggies-lead-orientation") {
    redirect("/home");
  }

  if (slug === "career-exploration") {
    return wrapModule(slug, <CareerExplorationClient />);
  }

  if (slug === "campus-navigation") {
    return wrapModule(slug, <TransferCampusNavigationClient />);
  }

  if (slug === "campus-navigation-who-you-should-know" || slug === "who-you-should-know") {
    return wrapModule(slug, <CampusNavigationWhoClient />);
  }

  if (slug === "aggie-shuttle-guide") {
    return wrapModule(slug, <AggieShuttleGuideClient />);
  }

  if (slug === "aggie-shuttle") {
    return wrapModule(slug, <TransferAggieShuttleGuideClient />);
  }

  if (slug === "resume-basics") {
    return wrapModule(slug, <ResumeBasicsClient />);
  }

  if (slug === "intro-to-networking") {
    return wrapModule(slug, <IntroNetworkingClient />);
  }

  if (slug === "resume-review-and-update") {
    return wrapModule(slug, <ResumeReviewUpdateClient />);
  }

  if (slug === "linkedin-review-and-update") {
    return wrapModule(slug, <LinkedInReviewUpdateClient />);
  }

  if (slug === "guest-speaker-event") {
    return wrapModule(slug, <GuestSpeakerEventClient />);
  }

  if (slug === "aggie-road-trip" || slug === "aggie-road-trips") {
    return wrapModule(slug, <AggieRoadTripClient />);
  }

  if (slug === "financial-literacy") {
    return wrapModule(slug, <FinancialLiteracyClient />);
  }

  if (slug === "informational-interview") {
    return wrapModule(slug, <InformationalInterviewClient />);
  }

  if (slug === "professional-network-list") {
    return wrapModule(slug, <ProfessionalNetworkListClient />);
  }

  if (slug === "advanced-resume-review") {
    return wrapModule(slug, <AdvancedResumeReviewClient />);
  }

  if (slug === "mock-interview") {
    return wrapModule(slug, <MockInterviewClient />);
  }

  if (slug === "career-fair-prep") {
    return wrapModule(slug, <CareerFairPrepClient />);
  }

  if (slug === "internship-fellowship-applications") {
    return wrapModule(slug, <InternshipFellowshipApplicationsClient />);
  }

  if (slug === "job-shadow-micro-internship") {
    return wrapModule(slug, <JobShadowMicroInternshipClient />);
  }

  if (slug === "job-shadow-micro-internship-sophomore") {
    return wrapModule(slug, <SophomoreJobShadowMicroInternshipClient />);
  }

  if (slug === "aggies-go-pro") {
    return wrapModule(slug, <AggiesGoProClient />);
  }

  if (slug === "linkedin-optimization") {
    return wrapModule(slug, <LinkedInOptimizationClient />);
  }

  if (slug === "networking-outreach") {
    return wrapModule(slug, <NetworkingOutreachClient />);
  }

  if (slug === "reference-building") {
    return wrapModule(slug, <ReferenceBuildingClient />);
  }

  if (slug === "career-mapping-session") {
    return wrapModule(slug, <CareerMappingSessionClient />);
  }

  if (slug === "career-mapping-and-transition") {
    return wrapModule(slug, <CareerMappingTransitionClient />);
  }

  if (slug === "final-resume-review") {
    return wrapModule(slug, <FinalResumeReviewClient />);
  }

  if (slug === "linkedin-final-update") {
    return wrapModule(slug, <LinkedInFinalUpdateClient />);
  }

  if (slug === "linkedin-refresh") {
    return wrapModule(slug, <LinkedInRefreshClient />);
  }

  if (slug === "3-professional-references") {
    return wrapModule(slug, <ThreeProfessionalReferencesClient />);
  }

  if (slug === "job-application-tracker") {
    return wrapModule(slug, <JobApplicationTrackerClient />);
  }

  if (slug === "aggies-go-pro-career-support") {
    return wrapModule(slug, <AggiesGoProCareerSupportClient />);
  }

  if (slug === "advanced-mock-interview") {
    return wrapModule(slug, <AdvancedMockInterviewClient />);
  }

  if (slug === "advanced-networking-strategy") {
    return wrapModule(slug, <AdvancedNetworkingStrategyClient />);
  }

  if (slug === "life-after-sport") {
    return wrapModule(slug, <LifeAfterSportClient />);
  }

  if (slug === "alumni-networking") {
    return wrapModule(slug, <AlumniNetworkingClient />);
  }

  if (slug === "career-transition-strategy") {
    return wrapModule(slug, <GraduateCareerTransitionStrategyClient />);
  }

  if (slug === "graduate-resume-update") {
    return wrapModule(slug, <GraduateResumeUpdateClient />);
  }

  if (slug === "full-time-job-search-plan") {
    return wrapModule(slug, <FullTimeJobSearchPlanClient />);
  }

  if (slug === "industry-interview-prep") {
    return wrapModule(slug, <IndustryInterviewPrepClient />);
  }

  if (slug === "long-term-career-planning") {
    return wrapModule(slug, <LongTermCareerPlanningClient />);
  }

  if (slug === "post-usu-transition-checklist") {
    return wrapModule(slug, <PostUsuTransitionChecklistClient />);
  }

  if (slug === "transfer-welcome-guide") {
    return wrapModule(slug, <TransferWelcomeGuideClient />);
  }

  if (slug === "meet-aggies-lead-staff") {
    return wrapModule(slug, <MeetAggiesLeadStaffClient />);
  }

  const title = titleFromSlug(slug);
  const nextHref = nextFreshmanModuleHref(slug);

  return wrapModule(slug, (
    <div className="space-y-6">
      <GhostButton href="/my-roadmap">Back to My Roadmap</GhostButton>
      <section className="card-surface rounded-lg p-7">
        <p className="text-sm font-bold uppercase tracking-[0.28em] text-aggie-silver">
          Module
        </p>
        <h1 className="text-glow mt-3 text-4xl font-black tracking-tight text-white">
          {title}
        </h1>
        <p className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-aggie-muted">
          <Clock3 className="h-4 w-4" />
          Estimated Time: 10 minutes
        </p>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <article className="card-surface rounded-lg p-6">
          <Lightbulb className="h-8 w-8 text-aggie-ice" />
          <h2 className="mt-5 text-2xl font-black text-white">Why This Matters</h2>
          <p className="mt-3 leading-7 text-aggie-light/74">
            This module supports your development roadmap and helps connect your
            student-athlete experience to life beyond sport.
          </p>
        </article>
        <article className="card-surface rounded-lg p-6">
          <BookOpen className="h-8 w-8 text-aggie-ice" />
          <h2 className="mt-5 text-2xl font-black text-white">Step-by-Step Content</h2>
          <p className="mt-3 leading-7 text-aggie-light/74">
            Content coming soon. This space is reserved for {title}.
          </p>
        </article>
      </section>

      <article className="card-surface rounded-lg p-6">
        <h2 className="text-2xl font-black text-white">Interactive Activity</h2>
        <p className="mt-3 leading-7 text-aggie-light/74">
          Placeholder activity: write one next action you would take after this module.
        </p>
      </article>

      <ModuleCompletionClient slug={slug} badgeTitle={`${title} Badge Placeholder`} nextHref={nextHref} />
    </div>
  ));
}

function wrapModule(slug: string, content: ReactNode) {
  return <ModuleProgressShell slug={slug}>{content}</ModuleProgressShell>;
}

function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

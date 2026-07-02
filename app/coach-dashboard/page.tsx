"use client";

import { useEffect, useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  BriefcaseBusiness,
  CalendarDays,
  GraduationCap,
  MapPinned,
  ShieldCheck,
  TrendingUp,
  Trophy,
  UserRound,
  Users,
} from "lucide-react";
import { useAuth } from "@/components/AuthState";
import { RoleGate } from "@/components/RoleGate";
import { hasPermission } from "@/lib/permissions";
import { teamName } from "@/lib/accessManagement";
import { readStudentAthletes } from "@/lib/studentAthleteDatabase";
import type { StudentAthleteRecord } from "@/lib/studentAthleteDatabase";
import { eventStatsForStudent, readEvents, teamEventParticipation } from "@/lib/events";
import type { AggiesLeadEvent } from "@/lib/events";
import { syncAllEngagementScores, teamEngagementStandings } from "@/lib/engagement";

const assignedTeam = {
  name: "Women's Basketball",
  athletes: 15,
  completion: 82,
  ranking: 1,
  eventParticipation: 87,
  internshipParticipation: 53,
  jobShadowParticipation: 60,
};

const overviewCards: { label: string; value: string; icon: LucideIcon; helper: string }[] = [
  { label: "Team Name", value: assignedTeam.name, icon: Users, helper: "Assigned by admin" },
  { label: "Number of Student-Athletes", value: String(assignedTeam.athletes), icon: UserRound, helper: "Visible roster scope" },
  { label: "Team Completion %", value: `${assignedTeam.completion}%`, icon: BarChart3, helper: "Average assigned-team progress" },
  { label: "Team Ranking Among USU Teams", value: `#${assignedTeam.ranking}`, icon: Trophy, helper: "Anonymous all-team comparison" },
  { label: "Event Participation %", value: `${assignedTeam.eventParticipation}%`, icon: CalendarDays, helper: "Team event engagement" },
  { label: "Internship Participation %", value: `${assignedTeam.internshipParticipation}%`, icon: BriefcaseBusiness, helper: "Internships and fellowships" },
  { label: "Job Shadow Participation %", value: `${assignedTeam.jobShadowParticipation}%`, icon: GraduationCap, helper: "Job shadows and micro-internships" },
];

const classBreakdown = [
  { label: "Freshman", value: 78 },
  { label: "Sophomore", value: 84 },
  { label: "Junior", value: 81 },
  { label: "Senior", value: 88 },
  { label: "Graduate / 5th Year", value: 76 },
];

const moduleCategories = [
  { label: "Career Readiness", value: 86 },
  { label: "Resume / LinkedIn", value: 79 },
  { label: "Networking", value: 74 },
  { label: "Events", value: 87 },
  { label: "Experiential Learning", value: 62 },
];

const participationBreakdown = [
  { label: "Participation in events", value: 87, icon: CalendarDays },
  { label: "Participation in internships", value: 53, icon: BriefcaseBusiness },
  { label: "Participation in job shadows", value: 60, icon: GraduationCap },
  { label: "Participation in road trips", value: 47, icon: MapPinned },
];

const assignedAthletes = [
  {
    name: "Student-Athlete A",
    classYear: "Senior",
    roadmap: "Senior Roadmap",
    completion: "91%",
    completedModules: 9,
    missingModules: 1,
    internshipStatus: "Completed",
    engagementScore: 42,
    lastActive: "June 19, 2026",
  },
  {
    name: "Student-Athlete B",
    classYear: "Junior",
    roadmap: "Junior Roadmap",
    completion: "78%",
    completedModules: 7,
    missingModules: 3,
    internshipStatus: "In Progress",
    engagementScore: 31,
    lastActive: "June 17, 2026",
  },
  {
    name: "Student-Athlete C",
    classYear: "Sophomore",
    roadmap: "Sophomore Roadmap",
    completion: "64%",
    completedModules: 6,
    missingModules: 4,
    internshipStatus: "Not Started",
    engagementScore: 18,
    lastActive: "June 14, 2026",
  },
  {
    name: "Student-Athlete D",
    classYear: "Graduate / 5th Year",
    roadmap: "Graduate Roadmap",
    completion: "86%",
    completedModules: 8,
    missingModules: 2,
    internshipStatus: "Completed",
    engagementScore: 37,
    lastActive: "June 20, 2026",
  },
];

const anonymousTeamComparison = [
  { label: "Your Team", value: 82, highlight: true },
  { label: "USU Team Average", value: 64 },
  { label: "Top Quartile Team", value: 79 },
  { label: "Lowest Quartile Team", value: 48 },
];

export default function CoachDashboardPage() {
  const { role, user } = useAuth();
  const [studentAthletes, setStudentAthletes] = useState<StudentAthleteRecord[]>([]);
  const [events, setEvents] = useState<AggiesLeadEvent[]>([]);
  const canViewTeamData = hasPermission(role, "view:team-data");
  const canViewAssignedAthletes = hasPermission(role, "view:assigned-student-athletes");
  const assignedTeamNames = useMemo(() => (user?.teamIds ?? []).map(teamName), [user?.teamIds]);
  const assignedRecords = useMemo(
    () => studentAthletes.filter((record) => assignedTeamNames.includes(record.team)),
    [assignedTeamNames, studentAthletes],
  );
  const dashboardTeam = assignedRecords.length
    ? {
        ...assignedTeam,
        name: assignedTeamNames.join(", ") || assignedTeam.name,
        athletes: assignedRecords.length,
        completion: Math.round(assignedRecords.reduce((sum, record) => sum + record.completionPercentage, 0) / assignedRecords.length),
        eventParticipation: Math.round(assignedTeamNames.reduce((sum, team) => sum + teamEventParticipation(team, assignedRecords, events).attendancePercentage, 0) / Math.max(assignedTeamNames.length, 1)),
        internshipParticipation: Math.round((assignedRecords.filter((record) => record.internshipStatus !== "Not Started").length / assignedRecords.length) * 100),
        jobShadowParticipation: Math.round((assignedRecords.filter((record) => record.jobShadowStatus !== "Not Started").length / assignedRecords.length) * 100),
      }
    : { ...assignedTeam, name: assignedTeamNames.join(", ") || assignedTeam.name };
  const engagementStandings = teamEngagementStandings(studentAthletes);
  const assignedTeamStanding = engagementStandings.find((item) => assignedTeamNames.includes(item.team));
  const averageEngagementScore = assignedRecords.length
    ? Math.round(assignedRecords.reduce((sum, record) => sum + record.engagementScore, 0) / assignedRecords.length)
    : 0;
  const visibleAthletes = assignedRecords.length
    ? assignedRecords.map((record) => ({
        name: `${record.firstName} ${record.lastName}${record.isTestAccount ? " (TEST ACCOUNT)" : ""}`,
        classYear: record.classYear,
        roadmap: record.currentRoadmap,
        completion: `${record.completionPercentage}%`,
        completedModules: Math.round(record.completionPercentage / 10),
        missingModules: Math.max(10 - Math.round(record.completionPercentage / 10), 0),
        internshipStatus: record.internshipStatus,
        engagementScore: record.engagementScore,
        lastActive: record.lastActiveDate,
      }))
    : assignedAthletes;
  const dynamicOverviewCards = overviewCards.map((card) => {
    if (card.label === "Team Name") return { ...card, value: dashboardTeam.name };
    if (card.label === "Number of Student-Athletes") return { ...card, value: String(dashboardTeam.athletes) };
    if (card.label === "Team Completion %") return { ...card, value: `${dashboardTeam.completion}%` };
    if (card.label === "Team Ranking Among USU Teams") return { ...card, value: `#${assignedTeamStanding?.rank ?? dashboardTeam.ranking}` };
    if (card.label === "Event Participation %") return { ...card, value: `${dashboardTeam.eventParticipation}%` };
    if (card.label === "Internship Participation %") return { ...card, value: `${dashboardTeam.internshipParticipation}%` };
    if (card.label === "Job Shadow Participation %") return { ...card, value: `${dashboardTeam.jobShadowParticipation}%` };
    return card;
  });
  const dynamicParticipationBreakdown = participationBreakdown.map((item) => {
    if (item.label === "Participation in events") return { ...item, value: dashboardTeam.eventParticipation };
    if (item.label === "Participation in internships") return { ...item, value: dashboardTeam.internshipParticipation };
    if (item.label === "Participation in job shadows") return { ...item, value: dashboardTeam.jobShadowParticipation };
    if (item.label === "Participation in road trips") {
      const roadTripParticipants = assignedRecords.filter((record) => eventStatsForStudent(record.id, events).roadTripCount > 0).length;
      return {
        ...item,
        value: assignedRecords.length ? Math.round((roadTripParticipants / assignedRecords.length) * 100) : item.value,
      };
    }
    return item;
  });

  useEffect(() => {
    const currentEvents = readEvents();
    setEvents(currentEvents);
    setStudentAthletes(syncAllEngagementScores(readStudentAthletes(), currentEvents));
  }, []);

  return (
    <RoleGate allowed={["coach"]}>
      <div className="space-y-8">
        <section className="card-surface rounded-lg p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.28em] text-aggie-silver">Coach Dashboard</p>
              <h1 className="text-glow mt-3 text-4xl font-black tracking-tight text-white md:text-6xl">
                {dashboardTeam.name}
              </h1>
              <p className="mt-4 max-w-4xl text-lg leading-8 text-aggie-light/78">
                Coaches can view team-level progress and individual student-athletes assigned to their team by an admin.
              </p>
            </div>
            <div className="rounded-lg border border-aggie-silver/15 bg-white/[0.045] p-4">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-aggie-silver">Access Scope</p>
              <p className="mt-2 text-sm font-bold text-aggie-light">
                {canViewTeamData && canViewAssignedAthletes ? "Assigned team data only" : "Coach permissions not active"}
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {dynamicOverviewCards.map((card) => (
            <OverviewCard key={card.label} {...card} />
          ))}
          <OverviewCard label="Team Avg Engagement Score" value={String(averageEngagementScore)} icon={TrendingUp} helper="Average points for assigned athletes" />
        </section>

        <section className="grid gap-5 xl:grid-cols-2">
          <BreakdownCard title="Roadmap Completion by Class/Year" items={classBreakdown} />
          <BreakdownCard title="Module Completion by Category" items={moduleCategories} />
        </section>

        <section className="card-surface rounded-lg p-6">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-6 w-6 text-aggie-ice" />
            <h2 className="text-2xl font-black text-white">Team Progress Breakdown</h2>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {dynamicParticipationBreakdown.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.label} className="rounded-lg border border-white/10 bg-white/6 p-4">
                  <Icon className="h-5 w-5 text-aggie-ice" />
                  <p className="mt-3 text-sm font-bold uppercase tracking-[0.14em] text-aggie-silver">{item.label}</p>
                  <p className="mt-2 text-3xl font-black text-white">{item.value}%</p>
                  <div className="mt-4 h-2.5 rounded-full bg-white/10">
                    <div className="h-2.5 rounded-full bg-aggie-ice" style={{ width: `${item.value}%` }} />
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="card-surface rounded-lg p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-aggie-silver">Assigned Team Only</p>
              <h2 className="mt-2 text-3xl font-black text-white">Individual Student-Athletes</h2>
            </div>
            <p className="text-sm font-semibold text-aggie-muted">No other teams' athlete names or individual data shown</p>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="min-w-[980px] w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-[0.16em] text-aggie-silver">
                <tr>
                  {[
                    "Student-Athlete Name",
                    "Class Year",
                    "Roadmap",
                    "Overall Completion %",
                    "Completed Modules",
                    "Missing Modules",
                    "Internship Status",
                    "Engagement Score",
                    "Last Active Date",
                  ].map((heading) => (
                    <th key={heading} className="border-b border-white/10 px-3 py-3 font-black">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleAthletes.map((athlete) => (
                  <tr key={athlete.name} className="border-b border-white/8 text-aggie-light">
                    <td className="px-3 py-4 font-black text-white">{athlete.name}</td>
                    <td className="px-3 py-4">{athlete.classYear}</td>
                    <td className="px-3 py-4">{athlete.roadmap}</td>
                    <td className="px-3 py-4">{athlete.completion}</td>
                    <td className="px-3 py-4">{athlete.completedModules}</td>
                    <td className="px-3 py-4">{athlete.missingModules}</td>
                    <td className="px-3 py-4">{athlete.internshipStatus}</td>
                    <td className="px-3 py-4 font-black text-white">{athlete.engagementScore}</td>
                    <td className="px-3 py-4">{athlete.lastActive}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[1fr_0.85fr]">
          <article className="card-surface rounded-lg p-6">
            <div className="flex items-center gap-3">
              <Trophy className="h-6 w-6 text-aggie-ice" />
              <h2 className="text-2xl font-black text-white">Team Ranking</h2>
            </div>
            <p className="mt-4 leading-7 text-aggie-light/74">
              {dashboardTeam.name} ranks #{assignedTeamStanding?.rank ?? dashboardTeam.ranking} among USU teams with an average engagement score of {averageEngagementScore}.
            </p>
            <div className="mt-5 space-y-4">
              {anonymousTeamComparison.map((item) => (
                <div key={item.label} className={`rounded-lg border p-4 ${item.highlight ? "border-aggie-ice/40 bg-aggie-ice/10" : "border-white/10 bg-white/6"}`}>
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-black text-white">{item.label}</p>
                    <p className="text-xl font-black text-white">{item.value}%</p>
                  </div>
                  <div className="mt-3 h-2.5 rounded-full bg-white/10">
                    <div className="h-2.5 rounded-full bg-aggie-ice" style={{ width: `${item.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="card-surface rounded-lg p-6">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 text-aggie-ice" />
              <h2 className="text-2xl font-black text-white">Privacy Guardrails</h2>
            </div>
            <div className="mt-5 space-y-3">
              {[
                "Coaches can see only athletes on their assigned team.",
                "Other team rankings are anonymous comparisons.",
                "Other teams' athlete names are not displayed.",
                "Other teams' individual completion data is not displayed.",
              ].map((item) => (
                <div key={item} className="rounded-lg border border-white/10 bg-white/6 p-4 text-sm font-bold leading-6 text-aggie-light">
                  {item}
                </div>
              ))}
            </div>
          </article>
        </section>
      </div>
    </RoleGate>
  );
}

function OverviewCard({ label, value, icon: Icon, helper }: { label: string; value: string; icon: LucideIcon; helper: string }) {
  return (
    <article className="card-surface rounded-lg p-6">
      <Icon className="h-6 w-6 text-aggie-ice" />
      <p className="mt-4 text-sm font-bold uppercase tracking-[0.18em] text-aggie-silver">{label}</p>
      <p className="mt-2 text-3xl font-black text-white">{value}</p>
      <p className="mt-3 text-sm font-semibold leading-6 text-aggie-muted">{helper}</p>
    </article>
  );
}

function BreakdownCard({ title, items }: { title: string; items: { label: string; value: number }[] }) {
  return (
    <article className="card-surface rounded-lg p-6">
      <h2 className="text-2xl font-black text-white">{title}</h2>
      <div className="mt-5 space-y-4">
        {items.map((item) => (
          <div key={item.label}>
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-bold text-aggie-light">{item.label}</p>
              <p className="text-sm font-black text-white">{item.value}%</p>
            </div>
            <div className="mt-2 h-2.5 rounded-full bg-white/10">
              <div className="h-2.5 rounded-full bg-gradient-to-r from-aggie-ice via-aggie-silver to-aggie-steel" style={{ width: `${item.value}%` }} />
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

"use client";

import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  BriefcaseBusiness,
  CalendarDays,
  Database,
  Download,
  GraduationCap,
  LayoutGrid,
  Plus,
  Settings,
  ShieldCheck,
  UserPlus,
  Users,
} from "lucide-react";
import { RoleGate } from "@/components/RoleGate";
import { useAuth } from "@/components/AuthState";
import { hasPermission } from "@/lib/permissions";
import { readStudentAthletes, writeStudentAthletes } from "@/lib/studentAthleteDatabase";
import type { StudentAthleteRecord } from "@/lib/studentAthleteDatabase";
import { readEvents, teamEventParticipation } from "@/lib/events";
import type { AggiesLeadEvent } from "@/lib/events";
import { exportEngagementCsv, syncAllEngagementScores } from "@/lib/engagement";

const overviewCards: { label: string; value: string; icon: LucideIcon; helper: string }[] = [
  { label: "Total Student-Athletes", value: "428", icon: Users, helper: "Across all active roadmaps" },
  { label: "Overall Completion %", value: "64%", icon: BarChart3, helper: "Average module completion" },
  { label: "Active Teams", value: "16", icon: ShieldCheck, helper: "Currently tracked teams" },
  { label: "Modules Completed", value: "2,184", icon: LayoutGrid, helper: "All roadmap completions" },
  { label: "Event Participation", value: "71%", icon: CalendarDays, helper: "Guest speakers and workshops" },
  { label: "Internship Participation", value: "39%", icon: BriefcaseBusiness, helper: "Internships and fellowships" },
  { label: "Job Shadow Participation", value: "46%", icon: GraduationCap, helper: "Job shadows and micro-internships" },
];

const teamProgress = [
  { team: "Football", athletes: 112, completion: "61%", event: "68%", internship: "31%", jobShadow: "42%", rank: 7 },
  { team: "Women's Basketball", athletes: 15, completion: "82%", event: "87%", internship: "53%", jobShadow: "60%", rank: 1 },
  { team: "Men's Basketball", athletes: 16, completion: "76%", event: "81%", internship: "44%", jobShadow: "50%", rank: 3 },
  { team: "Volleyball", athletes: 18, completion: "79%", event: "83%", internship: "48%", jobShadow: "55%", rank: 2 },
  { team: "Soccer", athletes: 29, completion: "72%", event: "77%", internship: "41%", jobShadow: "49%", rank: 4 },
  { team: "Track & Field / Cross Country", athletes: 76, completion: "58%", event: "62%", internship: "35%", jobShadow: "38%", rank: 9 },
  { team: "Gymnastics", athletes: 19, completion: "70%", event: "74%", internship: "43%", jobShadow: "47%", rank: 5 },
  { team: "Softball", athletes: 24, completion: "66%", event: "69%", internship: "37%", jobShadow: "44%", rank: 6 },
];

const roadmapProgress = [
  { label: "Freshman", value: 68, students: 104 },
  { label: "Sophomore", value: 63, students: 91 },
  { label: "Junior", value: 59, students: 84 },
  { label: "Senior", value: 71, students: 73 },
  { label: "Graduate / 5th Year", value: 54, students: 28 },
  { label: "Transfer Add-Ons", value: 47, students: 48 },
];

const adminActions = [
  { label: "Add Admin", icon: UserPlus },
  { label: "Add Coach", icon: UserPlus },
  { label: "Add Student-Athlete", icon: UserPlus },
  { label: "Manage Teams", icon: Users },
  { label: "Manage Modules", icon: LayoutGrid },
  { label: "Manage Events", icon: CalendarDays },
  { label: "Export Report", icon: Download },
];

export default function AdminDashboardPage() {
  const { role } = useAuth();
  const [actionMessage, setActionMessage] = useState("");
  const [studentAthletes, setStudentAthletes] = useState<StudentAthleteRecord[]>([]);
  const [events, setEvents] = useState<AggiesLeadEvent[]>([]);
  const [teamFilter, setTeamFilter] = useState("All");
  const [classFilter, setClassFilter] = useState("All");
  const [roadmapFilter, setRoadmapFilter] = useState("All");
  const [transferFilter, setTransferFilter] = useState("All");
  const reportStudentAthletes = studentAthletes.filter((student) => !student.isTestAccount);
  const testStudentAthletes = studentAthletes.filter((student) => student.isTestAccount);
  const testAccountCount = studentAthletes.length - reportStudentAthletes.length;
  const canManageAllData = hasPermission(role, "manage:all-data");
  const eventParticipation = reportStudentAthletes.length
    ? Math.round((reportStudentAthletes.filter((student) => events.some((event) => event.registrations.some((registration) => registration.studentId === student.id && registration.status === "Attended"))).length / reportStudentAthletes.length) * 100)
    : 0;
  const overallCompletion = reportStudentAthletes.length
    ? Math.round(reportStudentAthletes.reduce((sum, student) => sum + student.completionPercentage, 0) / reportStudentAthletes.length)
    : 0;
  const activeTeams = new Set(reportStudentAthletes.map((student) => student.team).filter(Boolean)).size;
  const modulesCompleted = reportStudentAthletes.reduce((sum, student) => sum + Math.round(student.completionPercentage / 10), 0);
  const internshipParticipation = reportStudentAthletes.length
    ? Math.round((reportStudentAthletes.filter((student) => student.internshipStatus !== "Not Started").length / reportStudentAthletes.length) * 100)
    : 0;
  const jobShadowParticipation = reportStudentAthletes.length
    ? Math.round((reportStudentAthletes.filter((student) => student.jobShadowStatus !== "Not Started").length / reportStudentAthletes.length) * 100)
    : 0;
  const dynamicOverviewCards = overviewCards.map((card) => {
    if (card.label === "Total Student-Athletes") return { ...card, value: String(reportStudentAthletes.length || 0), helper: testAccountCount ? `Real records only. ${testAccountCount} test account excluded.` : "Synced from Student-Athlete Database" };
    if (card.label === "Overall Completion %") return { ...card, value: `${overallCompletion}%`, helper: "Average from synced student records" };
    if (card.label === "Active Teams") return { ...card, value: String(activeTeams), helper: "Teams represented in active records" };
    if (card.label === "Modules Completed") return { ...card, value: String(modulesCompleted), helper: "Estimated from synced completion records" };
    if (card.label === "Event Participation") return { ...card, value: `${eventParticipation}%`, helper: "Attendance from event tracking" };
    if (card.label === "Internship Participation") return { ...card, value: `${internshipParticipation}%`, helper: "Synced from student profile statuses" };
    if (card.label === "Job Shadow Participation") return { ...card, value: `${jobShadowParticipation}%`, helper: "Synced from event attendance and profile statuses" };
    return card;
  });
  const dynamicTeamProgress = reportStudentAthletes.length ? buildTeamProgress(reportStudentAthletes, events) : teamProgress;
  const teamOptions = ["All", ...Array.from(new Set(reportStudentAthletes.map((student) => student.team).filter(Boolean))).sort()];
  const classOptions = ["All", ...Array.from(new Set(reportStudentAthletes.map((student) => student.classYear).filter(Boolean))).sort()];
  const roadmapOptions = ["All", ...Array.from(new Set(reportStudentAthletes.map((student) => student.currentRoadmap).filter(Boolean))).sort()];
  const transferOptions = ["All", ...Array.from(new Set(reportStudentAthletes.map((student) => student.transferStatus).filter(Boolean))).sort()];
  const filteredEngagementRecords = reportStudentAthletes.filter((student) =>
    (teamFilter === "All" || student.team === teamFilter) &&
    (classFilter === "All" || student.classYear === classFilter) &&
    (roadmapFilter === "All" || student.currentRoadmap === roadmapFilter) &&
    (transferFilter === "All" || student.transferStatus === transferFilter),
  );
  const exportEngagementReport = () => {
    downloadTextFile("aggies-lead-engagement-score-report.csv", exportEngagementCsv(filteredEngagementRecords));
  };
  const needsFollowUp = reportStudentAthletes.flatMap((student) =>
    student.staffNotes
      .filter((note) => note.followUpNeeded === "Yes" && note.followUpStatus !== "Complete")
      .map((note) => ({ student, note })),
  ).sort((a, b) => (a.note.followUpDate || "9999-12-31").localeCompare(b.note.followUpDate || "9999-12-31"));
  const markFollowUpComplete = (studentId: string, noteId: string) => {
    const timestamp = new Date().toISOString();
    const nextRecords = studentAthletes.map((student) =>
      student.id === studentId
        ? {
            ...student,
            staffNotes: student.staffNotes.map((note) =>
              note.id === noteId ? { ...note, followUpStatus: "Complete" as const, updatedAt: timestamp } : note,
            ),
          }
        : student,
    );
    writeStudentAthletes(nextRecords);
    setStudentAthletes(nextRecords);
    setActionMessage("Follow-up marked complete.");
  };

  useEffect(() => {
    const currentEvents = readEvents();
    setEvents(currentEvents);
    setStudentAthletes(syncAllEngagementScores(readStudentAthletes(), currentEvents));
  }, []);

  return (
    <RoleGate allowed={["admin"]}>
      <div className="space-y-8">
        <section className="card-surface rounded-lg p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.28em] text-aggie-silver">Admin Dashboard</p>
              <h1 className="text-glow mt-3 text-4xl font-black tracking-tight text-white md:text-6xl">
                Program Command Center
              </h1>
              <p className="mt-4 max-w-4xl text-lg leading-8 text-aggie-light/78">
                View program data across all teams, roadmaps, student-athletes, events, internships, and job shadow participation.
              </p>
              {testAccountCount ? (
                <p className="mt-4 rounded-lg border border-aggie-ice/30 bg-aggie-ice/10 p-3 text-sm font-bold text-aggie-light">
                  {testAccountCount} TEST ACCOUNT excluded from dashboard report totals by default.
                </p>
              ) : null}
            </div>
            <div className="rounded-lg border border-aggie-silver/15 bg-white/[0.045] p-4">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-aggie-silver">Access Scope</p>
              <p className="mt-2 text-sm font-bold text-aggie-light">
                {canManageAllData ? "Full admin data management enabled" : "Admin permissions not active"}
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {dynamicOverviewCards.map((card) => (
            <OverviewCard key={card.label} {...card} />
          ))}
        </section>

        {testStudentAthletes.length ? (
          <section className="card-surface rounded-lg p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.22em] text-aggie-silver">Test Accounts</p>
                <h2 className="mt-2 text-3xl font-black text-white">Local QA Records</h2>
              </div>
              <p className="text-sm font-semibold text-aggie-muted">Excluded from dashboard report totals by default</p>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {testStudentAthletes.map((record) => (
                <article key={record.id} className="rounded-lg border border-aggie-ice/25 bg-aggie-ice/10 p-4">
                  <span className="rounded-md border border-aggie-ice/30 bg-black/15 px-2 py-1 text-xs font-black uppercase tracking-[0.12em] text-aggie-light">
                    TEST ACCOUNT
                  </span>
                  <h3 className="mt-3 text-xl font-black text-white">{record.firstName} {record.lastName}</h3>
                  <p className="mt-2 text-sm font-bold text-aggie-light">{record.team} | {record.currentRoadmap}</p>
                  <p className="mt-1 text-sm font-semibold text-aggie-muted">{record.completionPercentage}% complete | Engagement {record.engagementScore}</p>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        <section className="card-surface rounded-lg p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-aggie-silver">Team Progress</p>
              <h2 className="mt-2 text-3xl font-black text-white">All Teams</h2>
            </div>
            <p className="text-sm font-semibold text-aggie-muted">Placeholder data for prototype review</p>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="min-w-[980px] w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-[0.16em] text-aggie-silver">
                <tr>
                  {[
                    "Team Name",
                    "Student-Athletes",
                    "Average Completion %",
                    "Event Participation %",
                    "Internship Participation %",
                    "Job Shadow Participation %",
                    "Team Ranking",
                  ].map((heading) => (
                    <th key={heading} className="border-b border-white/10 px-3 py-3 font-black">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dynamicTeamProgress.map((team) => (
                  <tr key={team.team} className="border-b border-white/8 text-aggie-light">
                    <td className="px-3 py-4 font-black text-white">{team.team}</td>
                    <td className="px-3 py-4">{team.athletes}</td>
                    <td className="px-3 py-4">{team.completion}</td>
                    <td className="px-3 py-4">{team.event}</td>
                    <td className="px-3 py-4">{team.internship}</td>
                    <td className="px-3 py-4">{team.jobShadow}</td>
                    <td className="px-3 py-4">
                      <span className="rounded-lg border border-aggie-silver/15 bg-white/[0.045] px-3 py-2 font-black text-white">
                        #{team.rank}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="card-surface rounded-lg p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-aggie-silver">Staff Follow-Up</p>
              <h2 className="mt-2 text-3xl font-black text-white">Needs Follow-Up</h2>
            </div>
            <p className="text-sm font-semibold text-aggie-muted">Admin-only queue from student-athlete staff notes</p>
          </div>
          <div className="mt-5 overflow-x-auto">
            <table className="min-w-[980px] w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-[0.16em] text-aggie-silver">
                <tr>{["Student-Athlete", "Team", "Follow-up Date", "Note Category", "Assigned Staff Member", "Status", "Action"].map((heading) => (
                  <th key={heading} className="border-b border-white/10 px-3 py-3 font-black">{heading}</th>
                ))}</tr>
              </thead>
              <tbody>
                {needsFollowUp.length ? needsFollowUp.map(({ student, note }) => (
                  <tr key={`${student.id}-${note.id}`} className="border-b border-white/8 text-aggie-light">
                    <td className="px-3 py-4 font-black text-white">{student.firstName} {student.lastName}</td>
                    <td className="px-3 py-4">{student.team}</td>
                    <td className="px-3 py-4">{note.followUpDate || "Not set"}</td>
                    <td className="px-3 py-4">{note.category}</td>
                    <td className="px-3 py-4">{note.staffMemberName}</td>
                    <td className="px-3 py-4">{note.followUpStatus}</td>
                    <td className="px-3 py-4">
                      <button
                        type="button"
                        onClick={() => markFollowUpComplete(student.id, note.id)}
                        className="rounded-lg border border-emerald-300/25 bg-emerald-300/10 px-3 py-2 text-xs font-black text-aggie-light"
                      >
                        Mark Complete
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={7} className="px-3 py-5 text-sm font-semibold text-aggie-muted">No open follow-ups right now.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="card-surface rounded-lg p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-aggie-silver">Engagement Scores</p>
              <h2 className="mt-2 text-3xl font-black text-white">Student-Athlete Engagement Report</h2>
            </div>
            <button
              type="button"
              onClick={exportEngagementReport}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/6 px-4 text-sm font-black text-white transition hover:border-aggie-ice/40 hover:bg-white/10"
            >
              <Download className="h-4 w-4 text-aggie-ice" />
              Export Engagement Scores
            </button>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-4">
            <FilterSelect label="Team" value={teamFilter} options={teamOptions} onChange={setTeamFilter} />
            <FilterSelect label="Class Year" value={classFilter} options={classOptions} onChange={setClassFilter} />
            <FilterSelect label="Roadmap" value={roadmapFilter} options={roadmapOptions} onChange={setRoadmapFilter} />
            <FilterSelect label="Transfer Status" value={transferFilter} options={transferOptions} onChange={setTransferFilter} />
          </div>
          <div className="mt-5 overflow-x-auto">
            <table className="min-w-[980px] w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-[0.16em] text-aggie-silver">
                <tr>{["Student-Athlete", "Team", "Class Year", "Roadmap", "Transfer Status", "Engagement Score", "Completion %"].map((heading) => (
                  <th key={heading} className="border-b border-white/10 px-3 py-3 font-black">{heading}</th>
                ))}</tr>
              </thead>
              <tbody>
                {filteredEngagementRecords.map((student) => (
                  <tr key={student.id} className="border-b border-white/8 text-aggie-light">
                    <td className="px-3 py-4 font-black text-white">{student.firstName} {student.lastName}</td>
                    <td className="px-3 py-4">{student.team}</td>
                    <td className="px-3 py-4">{student.classYear}</td>
                    <td className="px-3 py-4">{student.currentRoadmap}</td>
                    <td className="px-3 py-4">{student.transferStatus}</td>
                    <td className="px-3 py-4 font-black text-white">{student.engagementScore}</td>
                    <td className="px-3 py-4">{student.completionPercentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-[1fr_0.85fr]">
          <article className="card-surface rounded-lg p-6">
            <div className="flex items-center gap-3">
              <Database className="h-6 w-6 text-aggie-ice" />
              <h2 className="text-2xl font-black text-white">Roadmap Progress</h2>
            </div>
            <div className="mt-5 space-y-4">
              {roadmapProgress.map((roadmap) => (
                <div key={roadmap.label} className="rounded-lg border border-white/10 bg-white/6 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-black text-white">{roadmap.label}</h3>
                      <p className="mt-1 text-sm font-semibold text-aggie-muted">{roadmap.students} student-athletes</p>
                    </div>
                    <p className="text-2xl font-black text-white">{roadmap.value}%</p>
                  </div>
                  <div className="mt-4 h-3 rounded-full bg-white/10">
                    <div
                      className="h-3 rounded-full bg-gradient-to-r from-aggie-ice via-aggie-silver to-aggie-steel shadow-steel"
                      style={{ width: `${roadmap.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="card-surface rounded-lg p-6">
            <div className="flex items-center gap-3">
              <Settings className="h-6 w-6 text-aggie-ice" />
              <h2 className="text-2xl font-black text-white">Admin Actions</h2>
            </div>
            <div className="mt-5 grid gap-3">
              {adminActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.label}
                    type="button"
                    onClick={() => setActionMessage(`${action.label} selected. Placeholder action only.`)}
                    className="flex min-h-12 items-center justify-between rounded-lg border border-white/10 bg-white/6 px-4 text-left text-sm font-black text-white transition hover:border-aggie-ice/40 hover:bg-white/10"
                  >
                    <span className="flex items-center gap-3">
                      <Icon className="h-4 w-4 text-aggie-ice" />
                      {action.label}
                    </span>
                    <Plus className="h-4 w-4 text-aggie-muted" />
                  </button>
                );
              })}
            </div>
            {actionMessage ? (
              <p className="mt-4 rounded-lg border border-aggie-ice/30 bg-aggie-ice/10 p-4 text-sm font-semibold text-aggie-light">
                {actionMessage}
              </p>
            ) : null}
          </article>
        </section>
      </div>
    </RoleGate>
  );
}

function buildTeamProgress(records: StudentAthleteRecord[], events: AggiesLeadEvent[]) {
  const groups = records.reduce<Record<string, StudentAthleteRecord[]>>((acc, record) => {
    acc[record.team] = [...(acc[record.team] ?? []), record];
    return acc;
  }, {});

  return Object.entries(groups)
    .map(([team, athletes]) => {
      const averageCompletion = Math.round(athletes.reduce((sum, record) => sum + record.completionPercentage, 0) / athletes.length);
      return {
        team,
        athletes: athletes.length,
        completion: `${averageCompletion}%`,
        event: `${teamEventParticipation(team, records, events).attendancePercentage}%`,
        internship: `${Math.round((athletes.filter((record) => record.internshipStatus !== "Not Started").length / athletes.length) * 100)}%`,
        jobShadow: `${Math.round((athletes.filter((record) => record.jobShadowStatus !== "Not Started").length / athletes.length) * 100)}%`,
        rank: 0,
        numericCompletion: averageCompletion,
      };
    })
    .sort((a, b) => b.numericCompletion - a.numericCompletion)
    .map((team, index) => ({ ...team, rank: index + 1 }));
}

function OverviewCard({ label, value, icon: Icon, helper }: { label: string; value: string; icon: LucideIcon; helper: string }) {
  return (
    <article className="card-surface rounded-lg p-6">
      <div className="flex items-start justify-between gap-4">
        <Icon className="h-6 w-6 text-aggie-ice" />
        <span className="rounded-md border border-white/10 bg-white/6 px-2 py-1 text-xs font-black uppercase tracking-[0.12em] text-aggie-silver">
          All Data
        </span>
      </div>
      <p className="mt-4 text-sm font-bold uppercase tracking-[0.18em] text-aggie-silver">{label}</p>
      <p className="mt-2 text-4xl font-black text-white">{value}</p>
      <p className="mt-3 text-sm font-semibold leading-6 text-aggie-muted">{helper}</p>
    </article>
  );
}

function FilterSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase tracking-[0.16em] text-aggie-silver">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 min-h-11 w-full rounded-lg border border-white/10 bg-aggie-navy px-3 text-sm font-bold text-white outline-none transition focus:border-aggie-ice"
      >
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}

function downloadTextFile(filename: string, contents: string) {
  const blob = new Blob([contents], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

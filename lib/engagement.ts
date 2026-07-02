import type { AggiesLeadEvent } from "@/lib/events";
import { readStudentAthletes, writeStudentAthletes } from "@/lib/studentAthleteDatabase";
import type { StudentAthleteRecord } from "@/lib/studentAthleteDatabase";

export const completedModulesStorageKeyBase = "aggies-lead:completed-modules";

export const engagementPointValues = {
  moduleCompleted: 1,
  guestSpeakerAttended: 3,
  financialLiteracyAttended: 3,
  careerFairAttended: 4,
  informationalInterviewCompleted: 5,
  aggieRoadTripAttended: 5,
  jobShadowCompleted: 8,
  internshipCompleted: 15,
  communityEngagementAttended: 3,
};

export type EngagementBreakdown = {
  modulePoints: number;
  eventPoints: number;
  informationalInterviewPoints: number;
  jobShadowPoints: number;
  internshipPoints: number;
  total: number;
};

export type EngagementStanding = {
  rank: number;
  totalInClass: number;
  percentile: number;
  completedMoreThanPercent: number;
};

export function readCompletedModulesForStudent(student: Pick<StudentAthleteRecord, "id" | "userId">) {
  if (typeof window === "undefined") return [];
  const keys = [
    `${completedModulesStorageKeyBase}:${student.userId || student.id}`,
    `${completedModulesStorageKeyBase}:${student.id}`,
  ];
  for (const key of keys) {
    const saved = window.localStorage.getItem(key);
    if (!saved) continue;
    try {
      return JSON.parse(saved) as string[];
    } catch {
      window.localStorage.removeItem(key);
    }
  }
  return [];
}

export function writeCompletedModulesForStudent(student: Pick<StudentAthleteRecord, "id" | "userId">, modules: string[]) {
  if (typeof window === "undefined") return;
  const storageKey = `${completedModulesStorageKeyBase}:${student.userId || student.id}`;
  window.localStorage.setItem(storageKey, JSON.stringify(Array.from(new Set(modules))));
}

export function calculateEngagementScore(student: StudentAthleteRecord, events: AggiesLeadEvent[] = [], completedModules = readCompletedModulesForStudent(student)) {
  return calculateEngagementBreakdown(student, events, completedModules).total;
}

export function calculateEngagementBreakdown(
  student: StudentAthleteRecord,
  events: AggiesLeadEvent[] = [],
  completedModules = readCompletedModulesForStudent(student),
): EngagementBreakdown {
  const normalizedModules = completedModules.map((item) => item.toLowerCase());
  const attendedEvents = events.flatMap((event) =>
    event.registrations
      .filter((registration) => registration.studentId === student.id && registration.status === "Attended")
      .map(() => event),
  );

  const modulePoints = completedModules.length * engagementPointValues.moduleCompleted;
  const eventPoints = attendedEvents.reduce((sum, event) => sum + pointsForEventType(event.type), 0);
  const informationalInterviewPoints = normalizedModules.includes("informational-interview")
    ? engagementPointValues.informationalInterviewCompleted
    : 0;
  const hasJobShadowModule = normalizedModules.some((item) => item.includes("job-shadow-micro-internship"));
  const jobShadowPoints =
    hasJobShadowModule || student.jobShadowStatus.toLowerCase().includes("completed")
      ? engagementPointValues.jobShadowCompleted
      : 0;
  const internshipPoints =
    student.internshipStatus.toLowerCase().includes("completed") ||
    student.internshipStatus.toLowerCase().includes("verified")
      ? engagementPointValues.internshipCompleted
      : 0;

  return {
    modulePoints,
    eventPoints,
    informationalInterviewPoints,
    jobShadowPoints,
    internshipPoints,
    total: modulePoints + eventPoints + informationalInterviewPoints + jobShadowPoints + internshipPoints,
  };
}

export function syncEngagementScoreForStudent(studentId: string, events: AggiesLeadEvent[] = []) {
  const records = readStudentAthletes();
  const nextRecords = records.map((record) =>
    record.id === studentId || record.userId === studentId
      ? { ...record, engagementScore: calculateEngagementScore(record, events) }
      : record,
  );
  writeStudentAthletes(nextRecords);
  return nextRecords;
}

export function syncAllEngagementScores(records = readStudentAthletes(), events: AggiesLeadEvent[] = []) {
  const nextRecords = records.map((record) => ({
    ...record,
    engagementScore: calculateEngagementScore(record, events),
  }));
  writeStudentAthletes(nextRecords);
  return nextRecords;
}

export function classStanding(student: StudentAthleteRecord, records: StudentAthleteRecord[]) {
  const classmates = records
    .filter((record) => record.classYear === student.classYear && (!record.isTestAccount || record.id === student.id))
    .sort((a, b) => b.engagementScore - a.engagementScore);
  const rankIndex = classmates.findIndex((record) => record.id === student.id);
  const rank = rankIndex >= 0 ? rankIndex + 1 : classmates.length + 1;
  const totalInClass = Math.max(classmates.length, 1);
  const percentile = Math.max(1, Math.round(((totalInClass - rank + 1) / totalInClass) * 100));
  const completedMoreThanPercent = Math.max(0, Math.round(((totalInClass - rank) / totalInClass) * 100));
  return { rank, totalInClass, percentile, completedMoreThanPercent };
}

export function teamEngagementStandings(records: StudentAthleteRecord[]) {
  const groups = records.reduce<Record<string, StudentAthleteRecord[]>>((acc, record) => {
    if (!record.team || record.isTestAccount) return acc;
    acc[record.team] = [...(acc[record.team] ?? []), record];
    return acc;
  }, {});
  return Object.entries(groups)
    .map(([team, athletes]) => ({
      team,
      athleteCount: athletes.length,
      averageScore: Math.round(athletes.reduce((sum, athlete) => sum + athlete.engagementScore, 0) / athletes.length),
    }))
    .sort((a, b) => b.averageScore - a.averageScore)
    .map((item, index) => ({ ...item, rank: index + 1 }));
}

export function exportEngagementCsv(records: StudentAthleteRecord[]) {
  const rows = [
    ["Student-Athlete", "Email", "Team", "Class Year", "Roadmap", "Transfer Status", "Engagement Score", "Completion %", "Internship Status", "Job Shadow Status"].join(","),
    ...records.map((record) =>
      [
        `${record.firstName} ${record.lastName}`,
        record.email,
        record.team,
        record.classYear,
        record.currentRoadmap,
        record.transferStatus,
        String(record.engagementScore),
        `${record.completionPercentage}%`,
        record.internshipStatus,
        record.jobShadowStatus,
      ].map(csvEscape).join(","),
    ),
  ];
  return rows.join("\n");
}

function pointsForEventType(type: AggiesLeadEvent["type"]) {
  if (type === "Guest Speaker Event") return engagementPointValues.guestSpeakerAttended;
  if (type === "Financial Literacy Event") return engagementPointValues.financialLiteracyAttended;
  if (type === "Career Fair") return engagementPointValues.careerFairAttended;
  if (type === "Aggie Road Trip") return engagementPointValues.aggieRoadTripAttended;
  if (type === "Job Shadow / Micro-Internship") return engagementPointValues.jobShadowCompleted;
  if (type === "Community Engagement Event") return engagementPointValues.communityEngagementAttended;
  return 0;
}

function csvEscape(value: string) {
  return `"${value.replaceAll("\"", "\"\"")}"`;
}

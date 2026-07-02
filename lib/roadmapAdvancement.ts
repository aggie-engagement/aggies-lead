import {
  formatRoadmapHistory,
  readStudentAthletes,
  writeStudentAthletes,
} from "@/lib/studentAthleteDatabase";
import type { StudentAthleteRecord } from "@/lib/studentAthleteDatabase";

export type AdvancementHistoryItem = {
  id: string;
  runAt: string;
  runBy: string;
  countAdvanced: number;
  summary: string;
};

export type AdvancementPreview = {
  studentId: string;
  name: string;
  currentRoadmap: string;
  nextRoadmap: string;
  currentAcademicYear: string;
  nextAcademicYear: string;
  excluded: boolean;
  reason: string;
};

export const roadmapAdvancementHistoryKey = "aggies-lead:roadmap-advancement-history";
export const lastAutoAdvancementKey = "aggies-lead:last-auto-roadmap-advancement";

const roadmapOrder = [
  "Freshman Roadmap",
  "Sophomore Roadmap",
  "Junior Roadmap",
  "Senior Roadmap",
  "Graduate / 5th Year Roadmap",
];

export function getNextRoadmap(record: StudentAthleteRecord) {
  const index = roadmapOrder.indexOf(record.currentRoadmap);
  if (index === -1) return record.currentRoadmap;
  if (index === roadmapOrder.length - 1) return record.currentRoadmap;
  return roadmapOrder[index + 1];
}

export function nextAcademicYear(academicYear: string) {
  const match = academicYear.match(/(\d{4})\D+(\d{4})/);
  if (!match) return academicYear;
  return `${Number(match[1]) + 1}-${Number(match[2]) + 1}`;
}

export function previewRoadmapAdvancement(records = readStudentAthletes()): AdvancementPreview[] {
  return records.map((record) => {
    const nextRoadmap = getNextRoadmap(record);
    const isGraduate = record.currentRoadmap === "Graduate / 5th Year Roadmap";
    const isInactive = record.profileStatus !== "Active";
    const excluded = record.excludeFromAutoAdvancement || isGraduate || isInactive;
    return {
      studentId: record.id,
      name: `${record.firstName} ${record.lastName}`.trim(),
      currentRoadmap: record.currentRoadmap,
      nextRoadmap,
      currentAcademicYear: record.academicYear,
      nextAcademicYear: nextAcademicYear(record.academicYear),
      excluded,
      reason: record.excludeFromAutoAdvancement
        ? "Excluded by admin"
        : isInactive
          ? "Inactive profile"
          : isGraduate
            ? "Already on graduate roadmap"
            : nextRoadmap === record.currentRoadmap
              ? "No matching next roadmap"
              : "Ready to advance",
    };
  });
}

export function runRoadmapAdvancement(runBy = "Admin") {
  const records = readStudentAthletes();
  const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const advanced: StudentAthleteRecord[] = [];

  const nextRecords = records.map((record) => {
    const nextRoadmap = getNextRoadmap(record);
    if (record.excludeFromAutoAdvancement || record.profileStatus !== "Active" || nextRoadmap === record.currentRoadmap) {
      return record;
    }

    const nextRecord: StudentAthleteRecord = {
      ...record,
      currentRoadmap: nextRoadmap,
      classYear: classYearFromRoadmap(nextRoadmap),
      academicYear: nextAcademicYear(record.academicYear),
      roadmapStartDate: today,
      roadmapCompletedDate: "",
      completionPercentage: 0,
      roadmapHistory: [
        ...record.roadmapHistory,
        {
          roadmapName: record.currentRoadmap,
          academicYear: record.academicYear,
          completionPercentage: record.completionPercentage,
          dateStarted: record.roadmapStartDate || record.joinedAggiesLeadDate,
          dateEnded: today,
          status: record.completionPercentage >= 100 ? "Completed" : "Advanced",
        },
      ],
    };
    nextRecord.roadmapHistorySummary = formatRoadmapHistory(nextRecord);
    advanced.push(nextRecord);
    return nextRecord;
  });

  writeStudentAthletes(nextRecords);
  addAdvancementHistory({
    id: `advancement-${Date.now()}`,
    runAt: new Date().toISOString(),
    runBy,
    countAdvanced: advanced.length,
    summary: `${advanced.length} student-athlete${advanced.length === 1 ? "" : "s"} advanced.`,
  });
  return { records: nextRecords, countAdvanced: advanced.length };
}

export function overrideStudentRoadmap(studentId: string, nextRoadmap: string, runBy = "Admin") {
  const records = readStudentAthletes();
  const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const nextRecords = records.map((record) => {
    if (record.id !== studentId) return record;
    const nextRecord: StudentAthleteRecord = {
      ...record,
      currentRoadmap: nextRoadmap,
      classYear: classYearFromRoadmap(nextRoadmap),
      roadmapStartDate: today,
      roadmapCompletedDate: "",
      roadmapHistory: [
        ...record.roadmapHistory,
        {
          roadmapName: record.currentRoadmap,
          academicYear: record.academicYear,
          completionPercentage: record.completionPercentage,
          dateStarted: record.roadmapStartDate || record.joinedAggiesLeadDate,
          dateEnded: today,
          status: "Admin Override",
        },
      ],
    };
    nextRecord.roadmapHistorySummary = formatRoadmapHistory(nextRecord);
    return nextRecord;
  });
  writeStudentAthletes(nextRecords);
  addAdvancementHistory({
    id: `override-${Date.now()}`,
    runAt: new Date().toISOString(),
    runBy,
    countAdvanced: 1,
    summary: `Roadmap override applied to ${studentId}.`,
  });
  return nextRecords;
}

export function setAdvancementExclusion(studentId: string, excluded: boolean) {
  const records = readStudentAthletes();
  const nextRecords = records.map((record) =>
    record.id === studentId ? { ...record, excludeFromAutoAdvancement: excluded } : record,
  );
  writeStudentAthletes(nextRecords);
  return nextRecords;
}

export function readAdvancementHistory() {
  if (typeof window === "undefined") return [];
  const saved = window.localStorage.getItem(roadmapAdvancementHistoryKey);
  if (!saved) return [];
  try {
    return JSON.parse(saved) as AdvancementHistoryItem[];
  } catch {
    window.localStorage.removeItem(roadmapAdvancementHistoryKey);
    return [];
  }
}

export function runAutomaticAdvancementIfDue(runBy = "Automatic August 1 Rule") {
  if (typeof window === "undefined") return;
  const now = new Date();
  if (now.getMonth() !== 7 || now.getDate() !== 1) return;
  const year = String(now.getFullYear());
  if (window.localStorage.getItem(lastAutoAdvancementKey) === year) return;
  runRoadmapAdvancement(runBy);
  window.localStorage.setItem(lastAutoAdvancementKey, year);
}

export const roadmapOptions = roadmapOrder;

function addAdvancementHistory(item: AdvancementHistoryItem) {
  const history = readAdvancementHistory();
  window.localStorage.setItem(roadmapAdvancementHistoryKey, JSON.stringify([item, ...history]));
}

function classYearFromRoadmap(roadmap: string) {
  if (roadmap.startsWith("Freshman")) return "Freshman";
  if (roadmap.startsWith("Sophomore")) return "Sophomore";
  if (roadmap.startsWith("Junior")) return "Junior";
  if (roadmap.startsWith("Senior")) return "Senior";
  return "Graduate / 5th Year";
}

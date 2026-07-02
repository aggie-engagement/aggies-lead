import {
  accessStorageKeys,
  readJson,
  seedUsers,
  writeJson,
} from "@/lib/accessManagement";
import type { User } from "@/lib/accessManagement";
import {
  readStudentAthletes,
  writeStudentAthletes,
} from "@/lib/studentAthleteDatabase";
import type { StudentAthleteRecord } from "@/lib/studentAthleteDatabase";

export const testStudentAthleteEmail = "johndoe@test.com";
export const testStudentAthletePassword = "Test123!";
export const testStudentAthleteId = "test-student-john-doe";
export const testStudentAthleteTeamId = "football";
export const testStudentAthleteTeamName = "Football";

const today = () =>
  new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

export function createTestStudentAthlete() {
  const users = readJson<User[]>(accessStorageKeys.users, seedUsers);
  const records = readStudentAthletes();
  const timestamp = new Date().toISOString();

  const testUser: User = {
    id: testStudentAthleteId,
    firstName: "John",
    lastName: "Doe",
    email: testStudentAthleteEmail,
    role: "student-athlete",
    teamIds: [testStudentAthleteTeamId],
    title: "Student-Athlete",
    status: "active",
    mustChangePassword: false,
    password: testStudentAthletePassword,
    createdAt: timestamp,
    updatedAt: timestamp,
    isTestAccount: true,
  };

  const testRecord: StudentAthleteRecord = {
    id: testStudentAthleteId,
    userId: testStudentAthleteId,
    firstName: "John",
    lastName: "Doe",
    preferredName: "John",
    email: testStudentAthleteEmail,
    phone: "",
    sport: "Football",
    team: testStudentAthleteTeamName,
    classYear: "Freshman",
    academicYear: "2026-2027",
    major: "",
    minor: "",
    expectedGraduationYear: "2030",
    entryYear: "2026",
    transferStatus: "Non-Transfer",
    currentRoadmap: "Freshman Roadmap",
    roadmapStartDate: today(),
    roadmapCompletedDate: "",
    careerInterests: "Test account for student-athlete workflow QA",
    linkedInUrl: "",
    joinedAggiesLeadDate: today(),
    profileStatus: "Active - TEST ACCOUNT",
    accountStatus: "Activated",
    completionPercentage: 0,
    engagementScore: 0,
    internshipStatus: "Not Started",
    jobShadowStatus: "Not Started",
    lastActiveDate: today(),
    roadmapHistorySummary: "Freshman Roadmap: 0%",
    roadmapHistory: [],
    eventAttendanceHistory: [],
    staffNotes: [],
    excludeFromAutoAdvancement: true,
    isTestAccount: true,
  };

  writeJson(accessStorageKeys.users, [
    testUser,
    ...users.filter((user) => user.email.toLowerCase() !== testStudentAthleteEmail),
  ]);
  writeStudentAthletes([
    testRecord,
    ...records.filter((record) => record.email.toLowerCase() !== testStudentAthleteEmail),
  ]);
  clearTestProgress();
}

export function deleteTestStudentAthlete() {
  const users = readJson<User[]>(accessStorageKeys.users, seedUsers);
  const records = readStudentAthletes();
  writeJson(
    accessStorageKeys.users,
    users.filter((user) => !isTestUser(user)),
  );
  writeStudentAthletes(records.filter((record) => !isTestRecord(record)));
  clearTestProgress();
}

export function resetTestStudentAthleteProgress() {
  const records = readStudentAthletes();
  writeStudentAthletes(
    records.map((record) =>
      isTestRecord(record)
        ? {
            ...record,
            completionPercentage: 0,
            engagementScore: 0,
            internshipStatus: "Not Started",
            jobShadowStatus: "Not Started",
            lastActiveDate: today(),
            roadmapHistorySummary: `${record.currentRoadmap}: 0%`,
            roadmapHistory: [],
            eventAttendanceHistory: [],
            staffNotes: [],
            roadmapCompletedDate: "",
          }
        : record,
    ),
  );
  clearTestProgress();
}

export function findTestStudentAthlete(records = readStudentAthletes()) {
  return records.find(isTestRecord);
}

export function isTestRecord(record: Pick<StudentAthleteRecord, "email" | "isTestAccount">) {
  return record.isTestAccount || record.email.toLowerCase() === testStudentAthleteEmail;
}

export function isTestUser(user: Pick<User, "email" | "isTestAccount">) {
  return user.isTestAccount || user.email.toLowerCase() === testStudentAthleteEmail;
}

function clearTestProgress() {
  if (typeof window === "undefined") return;
  [
    "aggies-lead:completed-modules",
    `aggies-lead:completed-modules:${testStudentAthleteId}`,
  ].forEach((key) => window.localStorage.removeItem(key));
}

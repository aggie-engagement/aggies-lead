export type StaffNoteCategory =
  | "Career Planning"
  | "Resume"
  | "Internship"
  | "Job Shadow"
  | "Mental Wellness Referral"
  | "Academic Support Referral"
  | "Professional Development"
  | "General Check-In"
  | "Other";

export type FollowUpStatus = "Not Started" | "In Progress" | "Complete";
export type StudentAccountStatus = "Pending Activation" | "Activated" | "Inactive";
export type StudentProfileStatus = "Incomplete" | "Active";

export type StaffNote = {
  id: string;
  date: string;
  staffMemberName: string;
  category: StaffNoteCategory;
  noteText: string;
  followUpNeeded: "Yes" | "No";
  followUpDate: string;
  followUpStatus: FollowUpStatus;
  createdAt: string;
  updatedAt: string;
};

export const staffNoteCategories: StaffNoteCategory[] = [
  "Career Planning",
  "Resume",
  "Internship",
  "Job Shadow",
  "Mental Wellness Referral",
  "Academic Support Referral",
  "Professional Development",
  "General Check-In",
  "Other",
];

export const followUpStatuses: FollowUpStatus[] = ["Not Started", "In Progress", "Complete"];

export type StudentAthleteRecord = {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  preferredName: string;
  email: string;
  phone: string;
  sport: string;
  team: string;
  classYear: string;
  academicYear: string;
  major: string;
  minor: string;
  expectedGraduationYear: string;
  entryYear: string;
  transferStatus: string;
  currentRoadmap: string;
  roadmapStartDate: string;
  roadmapCompletedDate: string;
  careerInterests: string;
  linkedInUrl: string;
  joinedAggiesLeadDate: string;
  profileStatus: StudentProfileStatus | "Archived" | "Active - TEST ACCOUNT";
  accountStatus: StudentAccountStatus;
  completionPercentage: number;
  engagementScore: number;
  internshipStatus: string;
  jobShadowStatus: string;
  lastActiveDate: string;
  roadmapHistorySummary: string;
  roadmapHistory: {
    roadmapName: string;
    academicYear: string;
    completionPercentage: number;
    dateStarted: string;
    dateEnded: string;
    status: string;
  }[];
  eventAttendanceHistory: {
    eventId: string;
    eventTitle: string;
    eventType: string;
    eventDate: string;
    status: string;
    countsTowardModule: string;
    updatedAt: string;
  }[];
  staffNotes: StaffNote[];
  excludeFromAutoAdvancement: boolean;
  isTestAccount: boolean;
};

export const studentAthleteDatabaseKey = "aggies-lead:student-athlete-database";

export const studentAthleteTemplateColumns = [
  "First Name",
  "Last Name",
  "Preferred Name",
  "Email",
  "Phone",
  "Sport",
  "Team",
  "Class Year",
  "Academic Year",
  "Major",
  "Minor",
  "Expected Graduation Year",
  "Entry Year",
  "Transfer Status",
  "Current Roadmap",
  "Roadmap Start Date",
  "Roadmap Completed Date",
];

export const seedStudentAthletes: StudentAthleteRecord[] = [
  {
    id: "student-001",
    userId: "student-001",
    firstName: "Jordan",
    lastName: "Miller",
    preferredName: "Jordan",
    email: "jordan.miller@usu.edu",
    phone: "(435) 555-0148",
    sport: "Women's Basketball",
    team: "Women's Basketball",
    classYear: "Sophomore",
    academicYear: "2026-2027",
    major: "Business Administration",
    minor: "Marketing",
    expectedGraduationYear: "2028",
    entryYear: "2024",
    transferStatus: "Non-Transfer",
    currentRoadmap: "Sophomore Roadmap",
    roadmapStartDate: "August 1, 2025",
    roadmapCompletedDate: "",
    careerInterests: "Sports marketing, sales, community engagement",
    linkedInUrl: "",
    joinedAggiesLeadDate: "August 26, 2024",
    profileStatus: "Active",
    accountStatus: "Activated",
    completionPercentage: 72,
    engagementScore: 84,
    internshipStatus: "Exploring",
    jobShadowStatus: "Scheduled",
    lastActiveDate: "June 20, 2026",
    roadmapHistorySummary: "Freshman Roadmap: 100%; Sophomore Roadmap: 72%",
    roadmapHistory: [
      {
        roadmapName: "Freshman Roadmap",
        academicYear: "2024-2025",
        completionPercentage: 100,
        dateStarted: "August 26, 2024",
        dateEnded: "July 31, 2025",
        status: "Completed",
      },
    ],
    eventAttendanceHistory: [],
    staffNotes: [],
    excludeFromAutoAdvancement: false,
    isTestAccount: false,
  },
  {
    id: "student-002",
    userId: "student-002",
    firstName: "Taylor",
    lastName: "Nguyen",
    preferredName: "Taylor",
    email: "taylor.nguyen@usu.edu",
    phone: "(435) 555-0192",
    sport: "Soccer",
    team: "Soccer",
    classYear: "Junior",
    academicYear: "2026-2027",
    major: "Kinesiology",
    minor: "",
    expectedGraduationYear: "2027",
    entryYear: "2023",
    transferStatus: "Transfer",
    currentRoadmap: "Junior Roadmap",
    roadmapStartDate: "August 1, 2025",
    roadmapCompletedDate: "",
    careerInterests: "Physical therapy, sports performance",
    linkedInUrl: "",
    joinedAggiesLeadDate: "August 25, 2025",
    profileStatus: "Active",
    accountStatus: "Activated",
    completionPercentage: 81,
    engagementScore: 90,
    internshipStatus: "Applied",
    jobShadowStatus: "Completed",
    lastActiveDate: "June 18, 2026",
    roadmapHistorySummary: "Sophomore Roadmap: 88%; Junior Roadmap: 81%",
    roadmapHistory: [
      {
        roadmapName: "Sophomore Roadmap",
        academicYear: "2024-2025",
        completionPercentage: 88,
        dateStarted: "August 25, 2024",
        dateEnded: "July 31, 2025",
        status: "Completed",
      },
    ],
    eventAttendanceHistory: [],
    staffNotes: [],
    excludeFromAutoAdvancement: false,
    isTestAccount: false,
  },
];

export const databaseExportColumns = [
  ...studentAthleteTemplateColumns,
  "Roadmap History",
  "Previous Roadmap Completion %",
  "Joined Aggies Lead Date",
  "Current Academic Year",
  "Career Interests",
  "Account Status",
  "Profile Status",
  "Completion %",
  "Engagement Score",
  "Internship Status",
  "Job Shadow Status",
  "Last Active Date",
  "Roadmap History Summary",
  "Account Type",
];

export function readStudentAthletes() {
  if (typeof window === "undefined") return seedStudentAthletes;
  const saved = window.localStorage.getItem(studentAthleteDatabaseKey);
  if (!saved) {
    window.localStorage.setItem(studentAthleteDatabaseKey, JSON.stringify(seedStudentAthletes));
    return seedStudentAthletes;
  }
  try {
    const parsed = JSON.parse(saved) as Partial<StudentAthleteRecord>[];
    const migrated = parsed.map(normalizeStudentAthleteRecord);
    window.localStorage.setItem(studentAthleteDatabaseKey, JSON.stringify(migrated));
    return migrated;
  } catch {
    window.localStorage.setItem(studentAthleteDatabaseKey, JSON.stringify(seedStudentAthletes));
    return seedStudentAthletes;
  }
}

export function writeStudentAthletes(records: StudentAthleteRecord[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(studentAthleteDatabaseKey, JSON.stringify(records));
}

export function roadmapForClassYear(classYear: string) {
  const normalized = classYear.trim().toLowerCase();
  if (normalized === "freshman" || normalized === "first year" || normalized === "first-year") return "Freshman Roadmap";
  if (normalized === "sophomore" || normalized === "second year" || normalized === "second-year") return "Sophomore Roadmap";
  if (normalized === "junior" || normalized === "third year" || normalized === "third-year") return "Junior Roadmap";
  if (normalized === "senior" || normalized === "fourth year" || normalized === "fourth-year") return "Senior Roadmap";
  if (normalized === "graduate" || normalized === "5th year" || normalized === "fifth year" || normalized === "graduate / 5th year") return "Graduate / 5th Year Roadmap";
  if (normalized === "transfer") return "Transfer Add-Ons";
  return "";
}

export const classYearOptions = [
  "Freshman",
  "Sophomore",
  "Junior",
  "Senior",
  "Graduate / 5th Year",
  "Transfer",
];

export function formatRoadmapHistory(record: Pick<StudentAthleteRecord, "roadmapHistory">) {
  return record.roadmapHistory
    .map((item) => `${item.roadmapName} (${item.academicYear}): ${item.completionPercentage}% ${item.status}`)
    .join("; ");
}

export function previousRoadmapCompletion(record: Pick<StudentAthleteRecord, "roadmapHistory">) {
  const previous = record.roadmapHistory.at(-1);
  return previous ? `${previous.completionPercentage}%` : "";
}

function normalizeStudentAthleteRecord(record: Partial<StudentAthleteRecord>): StudentAthleteRecord {
  const currentRoadmap = record.currentRoadmap ?? roadmapForClassYear(record.classYear ?? "") ?? "";
  return {
    id: record.id ?? `student-${Date.now()}`,
    userId: record.userId ?? "",
    firstName: record.firstName ?? "",
    lastName: record.lastName ?? "",
    preferredName: record.preferredName ?? "",
    email: record.email ?? "",
    phone: record.phone ?? "",
    sport: record.sport ?? "",
    team: record.team ?? "",
    classYear: record.classYear ?? "",
    academicYear: record.academicYear ?? "",
    major: record.major ?? "",
    minor: record.minor ?? "",
    expectedGraduationYear: record.expectedGraduationYear ?? "",
    entryYear: record.entryYear ?? "",
    transferStatus: record.transferStatus ?? "",
    currentRoadmap,
    roadmapStartDate: record.roadmapStartDate ?? record.joinedAggiesLeadDate ?? "",
    roadmapCompletedDate: record.roadmapCompletedDate ?? "",
    careerInterests: record.careerInterests ?? "",
    linkedInUrl: record.linkedInUrl ?? "",
    joinedAggiesLeadDate: record.joinedAggiesLeadDate ?? "",
    profileStatus: normalizeProfileStatus(record.profileStatus),
    accountStatus: normalizeAccountStatus(record.accountStatus, record.userId),
    completionPercentage: record.completionPercentage ?? 0,
    engagementScore: record.engagementScore ?? 0,
    internshipStatus: record.internshipStatus ?? "Not Started",
    jobShadowStatus: record.jobShadowStatus ?? "Not Started",
    lastActiveDate: record.lastActiveDate ?? "",
    roadmapHistorySummary: record.roadmapHistorySummary ?? "",
    roadmapHistory: (record.roadmapHistory ?? []).map((item) => ({
      roadmapName: item.roadmapName,
      academicYear: item.academicYear,
      completionPercentage: item.completionPercentage,
      dateStarted: item.dateStarted,
      dateEnded: item.dateEnded ?? (item as unknown as { dateCompleted?: string }).dateCompleted ?? "",
      status: item.status,
    })),
    eventAttendanceHistory: (record.eventAttendanceHistory ?? []).map((item) => ({
      eventId: item.eventId,
      eventTitle: item.eventTitle,
      eventType: item.eventType,
      eventDate: item.eventDate,
      status: item.status,
      countsTowardModule: item.countsTowardModule,
      updatedAt: item.updatedAt,
    })),
    staffNotes: (record.staffNotes ?? []).map((item) => ({
      id: item.id,
      date: item.date,
      staffMemberName: item.staffMemberName,
      category: item.category,
      noteText: item.noteText,
      followUpNeeded: item.followUpNeeded,
      followUpDate: item.followUpDate,
      followUpStatus: item.followUpStatus,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    })),
    excludeFromAutoAdvancement: record.excludeFromAutoAdvancement ?? false,
    isTestAccount: record.isTestAccount ?? false,
  };
}

function normalizeAccountStatus(status: StudentAccountStatus | "Not Activated" | undefined, userId = ""): StudentAccountStatus {
  if (status === "Activated" || status === "Inactive" || status === "Pending Activation") return status;
  if (status === "Not Activated") return "Pending Activation";
  return userId ? "Activated" : "Pending Activation";
}

function normalizeProfileStatus(status: StudentAthleteRecord["profileStatus"] | string | undefined): StudentAthleteRecord["profileStatus"] {
  if (status === "Active" || status === "Archived" || status === "Active - TEST ACCOUNT") return status;
  return "Incomplete";
}

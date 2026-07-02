import { readStudentAthletes, writeStudentAthletes } from "@/lib/studentAthleteDatabase";
import type { StudentAthleteRecord } from "@/lib/studentAthleteDatabase";
import { roadmapModules, slug } from "@/lib/roadmaps";
import { calculateEngagementScore, readCompletedModulesForStudent, writeCompletedModulesForStudent } from "@/lib/engagement";

export type EventType =
  | "Guest Speaker Event"
  | "Financial Literacy Event"
  | "Aggie Road Trip"
  | "Job Shadow / Micro-Internship"
  | "Career Fair"
  | "Workshop"
  | "Community Engagement Event"
  | "Other";

export type AttendanceStatus = "RSVP'd" | "Attended" | "No-Show";

export type EventRegistration = {
  studentId: string;
  status: AttendanceStatus;
  registeredAt: string;
  updatedAt: string;
};

export type AggiesLeadEvent = {
  id: string;
  title: string;
  type: EventType;
  capacity: number;
  date: string;
  time: string;
  location: string;
  description: string;
  speakerCompanyContact: string;
  countsTowardModule: string;
  registrations: EventRegistration[];
};

export const eventsStorageKey = "aggies-lead:events";

export const eventTypes: EventType[] = [
  "Guest Speaker Event",
  "Financial Literacy Event",
  "Aggie Road Trip",
  "Job Shadow / Micro-Internship",
  "Career Fair",
  "Workshop",
  "Community Engagement Event",
  "Other",
];

export const seedEvents: AggiesLeadEvent[] = [
  {
    id: "event-guest-speaker-001",
    title: "Guest Speaker: Life After Sport",
    type: "Guest Speaker Event",
    capacity: 80,
    date: "2026-07-15",
    time: "6:00 PM",
    location: "West Stadium Center",
    description: "Learn from former student-athletes and professionals about career transition and life after competition.",
    speakerCompanyContact: "Guest Speaker: Coming Soon",
    countsTowardModule: "Guest Speaker Event",
    registrations: [],
  },
  {
    id: "event-financial-001",
    title: "Financial Literacy Workshop",
    type: "Financial Literacy Event",
    capacity: 60,
    date: "2026-08-20",
    time: "5:30 PM",
    location: "Spetman Auditorium",
    description: "Build confidence with budgeting, saving, credit, and basic financial decisions.",
    speakerCompanyContact: "Aggies Lead Financial Partner",
    countsTowardModule: "Financial Literacy",
    registrations: [],
  },
  {
    id: "event-road-trip-001",
    title: "Aggie Road Trip: Company Visit",
    type: "Aggie Road Trip",
    capacity: 25,
    date: "2026-09-12",
    time: "9:00 AM",
    location: "TBD",
    description: "Visit a local or regional business, meet professionals, and explore career paths.",
    speakerCompanyContact: "Company: Coming Soon",
    countsTowardModule: "Aggie Road Trips",
    registrations: [],
  },
];

export function readEvents() {
  if (typeof window === "undefined") return seedEvents;
  const saved = window.localStorage.getItem(eventsStorageKey);
  if (!saved) {
    writeEvents(seedEvents);
    return seedEvents;
  }
  try {
    return JSON.parse(saved) as AggiesLeadEvent[];
  } catch {
    writeEvents(seedEvents);
    return seedEvents;
  }
}

export function writeEvents(events: AggiesLeadEvent[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(eventsStorageKey, JSON.stringify(events));
}

export function rsvpToEvent(eventId: string, student: StudentAthleteRecord) {
  const events = readEvents();
  const timestamp = new Date().toISOString();
  const nextEvents = events.map((event) => {
    if (event.id !== eventId) return event;
    if (event.registrations.some((item) => item.studentId === student.id)) return event;
    if (event.registrations.length >= event.capacity) return event;
    return {
      ...event,
      registrations: [
        ...event.registrations,
        { studentId: student.id, status: "RSVP'd" as const, registeredAt: timestamp, updatedAt: timestamp },
      ],
    };
  });
  writeEvents(nextEvents);
  syncEventParticipationToStudent(student.id);
  return nextEvents;
}

export function cancelRsvp(eventId: string, studentId: string) {
  const nextEvents = readEvents().map((event) =>
    event.id === eventId
      ? { ...event, registrations: event.registrations.filter((item) => item.studentId !== studentId) }
      : event,
  );
  writeEvents(nextEvents);
  syncEventParticipationToStudent(studentId);
  return nextEvents;
}

export function updateAttendance(eventId: string, studentId: string, status: AttendanceStatus) {
  const timestamp = new Date().toISOString();
  const nextEvents = readEvents().map((event) =>
    event.id === eventId
      ? {
          ...event,
          registrations: event.registrations.map((registration) =>
            registration.studentId === studentId ? { ...registration, status, updatedAt: timestamp } : registration,
          ),
        }
      : event,
  );
  writeEvents(nextEvents);
  syncEventParticipationToStudent(studentId, nextEvents);
  return nextEvents;
}

export function eventStatsForStudent(studentId: string, events = readEvents()) {
  const registrations = events.flatMap((event) =>
    event.registrations.filter((registration) => registration.studentId === studentId).map((registration) => ({ event, registration })),
  );
  return {
    rsvpCount: registrations.length,
    attendedCount: registrations.filter((item) => item.registration.status === "Attended").length,
    noShowCount: registrations.filter((item) => item.registration.status === "No-Show").length,
    roadTripCount: registrations.filter((item) => item.event.type === "Aggie Road Trip" && item.registration.status === "Attended").length,
    jobShadowCount: registrations.filter((item) => item.event.type === "Job Shadow / Micro-Internship" && item.registration.status === "Attended").length,
    internshipCount: registrations.filter((item) => item.event.type === "Job Shadow / Micro-Internship" && item.registration.status === "Attended").length,
    guestSpeakerCount: registrations.filter((item) => item.event.type === "Guest Speaker Event" && item.registration.status === "Attended").length,
  };
}

export function teamEventParticipation(team: string, students: StudentAthleteRecord[], events = readEvents()) {
  const teamStudents = students.filter((student) => student.team === team);
  if (!teamStudents.length) return { rsvpPercentage: 0, attendancePercentage: 0 };
  const rsvped = teamStudents.filter((student) => eventStatsForStudent(student.id, events).rsvpCount > 0).length;
  const attended = teamStudents.filter((student) => eventStatsForStudent(student.id, events).attendedCount > 0).length;
  return {
    rsvpPercentage: Math.round((rsvped / teamStudents.length) * 100),
    attendancePercentage: Math.round((attended / teamStudents.length) * 100),
  };
}

export function syncEventParticipationToStudent(studentId: string, events = readEvents()) {
  const students = readStudentAthletes();
  const stats = eventStatsForStudent(studentId, events);
  const timestamp = new Date().toISOString();
  const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  writeStudentAthletes(
    students.map((student) => {
      if (student.id !== studentId) return student;
      const moduleSlugs = attendedModuleSlugsForStudent(student.id, events);
      const completedModules = completeModulesForStudent(student, moduleSlugs);
      const completionPercentage = completionPercentageForStudent(student, completedModules);
      const attendedEvents = events.flatMap((event) =>
        event.registrations
          .filter((registration) => registration.studentId === student.id && registration.status === "Attended")
          .map((registration) => ({
            eventId: event.id,
            eventTitle: event.title,
            eventType: event.type,
            eventDate: event.date,
            status: registration.status,
            countsTowardModule: event.countsTowardModule || moduleTitleForEvent(event),
            updatedAt: registration.updatedAt || timestamp,
          })),
      );
      const jobShadowStatus = stats.jobShadowCount > 0 ? "Completed" : student.jobShadowStatus;
      const internshipStatus = stats.internshipCount > 0 && student.internshipStatus === "Not Started" ? "Participated" : student.internshipStatus;
      const nextStudent = { ...student, jobShadowStatus, internshipStatus };
      const engagementScore = calculateEngagementScore(nextStudent, events, completedModules);

      return {
        ...student,
        completionPercentage,
        engagementScore,
        jobShadowStatus,
        internshipStatus,
        eventAttendanceHistory: attendedEvents,
        lastActiveDate: today,
        roadmapHistorySummary: completedModules.length
          ? `${student.currentRoadmap}: ${completionPercentage}% (${completedModules.length} completed modules)`
          : student.roadmapHistorySummary,
      };
    }),
  );
}

export function moduleTitleForEvent(event: Pick<AggiesLeadEvent, "type" | "countsTowardModule">) {
  if (event.countsTowardModule.trim()) return event.countsTowardModule.trim();
  if (event.type === "Guest Speaker Event") return "Guest Speaker Event";
  if (event.type === "Financial Literacy Event") return "Financial Literacy";
  if (event.type === "Aggie Road Trip") return "Aggie Road Trips";
  if (event.type === "Job Shadow / Micro-Internship") return "Job Shadow / Micro-Internship";
  if (event.type === "Career Fair") return "Career Fair Prep";
  return "";
}

function attendedModuleSlugsForStudent(studentId: string, events: AggiesLeadEvent[]) {
  return events.flatMap((event) => {
    const attended = event.registrations.some((registration) => registration.studentId === studentId && registration.status === "Attended");
    const title = moduleTitleForEvent(event);
    return attended && title ? [slug(title)] : [];
  });
}

function completeModulesForStudent(student: StudentAthleteRecord, moduleSlugs: string[]) {
  const current = readCompletedModulesForStudent(student);
  const next = Array.from(new Set([...current, ...moduleSlugs]));
  writeCompletedModulesForStudent(student, next);
  return next;
}

function completionPercentageForStudent(student: StudentAthleteRecord, completedModules: string[]) {
  const total = moduleTotalForRoadmap(student.currentRoadmap);
  return Math.min(Math.round((completedModules.length / total) * 100), 100);
}

function moduleTotalForRoadmap(currentRoadmap: string) {
  const normalized = currentRoadmap.toLowerCase();
  if (normalized.includes("freshman")) return roadmapModules.freshman.length;
  if (normalized.includes("sophomore")) return roadmapModules.sophomore.length;
  if (normalized.includes("junior")) return roadmapModules.junior.length;
  if (normalized.includes("senior")) return roadmapModules.senior.length;
  if (normalized.includes("graduate")) return roadmapModules.graduate.length;
  if (normalized.includes("transfer")) return roadmapModules.transfer.length;
  return 10;
}

export function exportAttendanceCsv(events: AggiesLeadEvent[], students: StudentAthleteRecord[]) {
  const rows = [
    ["Event", "Type", "Date", "Time", "Location", "Student-Athlete", "Team", "Email", "Attendance Status"].join(","),
    ...events.flatMap((event) =>
      event.registrations.flatMap((registration) => {
        const student = students.find((item) => item.id === registration.studentId);
        if (!student) return [];
        return [[
          event.title,
          event.type,
          event.date,
          event.time,
          event.location,
          `${student.firstName} ${student.lastName}`,
          student.team,
          student.email,
          registration.status,
        ].map(csvEscape).join(",")];
      }),
    ),
  ];
  return rows.join("\n");
}

function csvEscape(value: string) {
  return `"${value.replaceAll("\"", "\"\"")}"`;
}

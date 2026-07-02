"use client";

import { useEffect, useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Archive,
  Award,
  BarChart3,
  CalendarDays,
  Download,
  FileText,
  FileDown,
  KeyRound,
  Pencil,
  Plus,
  Save,
  ShieldCheck,
  Trash2,
  Trophy,
  UserRound,
} from "lucide-react";
import { RoleGate } from "@/components/RoleGate";
import { accessStorageKeys, readJson, seedUsers, writeJson } from "@/lib/accessManagement";
import type { User } from "@/lib/accessManagement";
import {
  followUpStatuses,
  readStudentAthletes,
  staffNoteCategories,
  writeStudentAthletes,
} from "@/lib/studentAthleteDatabase";
import type { FollowUpStatus, StaffNote, StaffNoteCategory, StudentAthleteRecord } from "@/lib/studentAthleteDatabase";
import { eventStatsForStudent, readEvents } from "@/lib/events";
import { emailConfig, queuePlaceholderEmail } from "@/lib/emailService";
import { calculateEngagementScore } from "@/lib/engagement";

type ProfileFields = {
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
  joinedAggiesLeadDate: string;
  lastActiveDate: string;
  resumeStatus: string;
  linkedInStatus: string;
  handshakeStatus: string;
  careerInterests: string;
  internshipStatus: string;
  jobShadowStatus: string;
  informationalInterviewStatus: string;
  professionalReferencesStatus: string;
  employmentStatus: string;
  graduateSchoolStatus: string;
  professionalContractStatus: string;
};

const profileStorageKey = "aggies-lead:admin-student-profile";

const defaultProfile: ProfileFields = {
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
  joinedAggiesLeadDate: "August 26, 2024",
  lastActiveDate: "June 20, 2026",
  resumeStatus: "In Progress",
  linkedInStatus: "Updated",
  handshakeStatus: "Account Created",
  careerInterests: "Sports marketing, sales, community engagement",
  internshipStatus: "Exploring",
  jobShadowStatus: "Scheduled",
  informationalInterviewStatus: "Completed",
  professionalReferencesStatus: "Needs 2 more",
  employmentStatus: "Not currently seeking",
  graduateSchoolStatus: "Undecided",
  professionalContractStatus: "Not applicable",
};

const roadmapProgress = {
  overallCompletion: 72,
  completedModules: [
    "Resume Basics",
    "Introduction to Networking",
    "Campus Navigation + Who You Should Know",
    "Aggie Shuttle Guide",
    "LinkedIn Review & Update",
  ],
  inProgressModules: ["Resume Review & Update", "Financial Literacy"],
  missingModules: ["Informational Interview", "Professional Network List", "Aggie Road Trips"],
};

const roadmapHistory = [
  {
    roadmapName: "Freshman Roadmap",
    academicYear: "2024-2025",
    completion: "100%",
    dateStarted: "August 26, 2024",
    dateCompleted: "April 18, 2025",
    status: "Completed",
  },
  {
    roadmapName: "Sophomore Roadmap",
    academicYear: "2025-2026",
    completion: "72%",
    dateStarted: "August 25, 2025",
    dateCompleted: "In Progress",
    status: "In Progress",
  },
];

const participation = [
  { label: "Event Attendance", value: "6 events", icon: CalendarDays },
  { label: "Road Trip Participation", value: "1 road trip", icon: Trophy },
  { label: "Job Shadow Participation", value: "1 scheduled", icon: UserRound },
  { label: "Internship Participation", value: "Exploring", icon: Award },
  { label: "Informational Interviews", value: "2 completed", icon: ShieldCheck },
  { label: "Guest Speaker Attendance", value: "4 speakers", icon: CalendarDays },
];

const badges = ["Resume Starter", "Networking Builder", "Campus Navigator", "Career Curious"];

const emptyStaffNote = {
  date: "",
  staffMemberName: "",
  category: "Career Planning" as StaffNoteCategory,
  noteText: "",
  followUpNeeded: "No" as "Yes" | "No",
  followUpDate: "",
  followUpStatus: "Not Started" as FollowUpStatus,
};

export default function StudentAthleteAdminProfilePage() {
  const [studentId, setStudentId] = useState("student-001");
  const [profile, setProfile] = useState<ProfileFields>(defaultProfile);
  const [databaseRecord, setDatabaseRecord] = useState<StudentAthleteRecord | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profileStatus, setProfileStatus] = useState<StudentAthleteRecord["profileStatus"]>("Active");
  const [message, setMessage] = useState("");
  const [staffNoteForm, setStaffNoteForm] = useState(emptyStaffNote);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nextStudentId = params.get("id") ?? "student-001";
    setStudentId(nextStudentId);
    const saved = window.localStorage.getItem(`${profileStorageKey}:${nextStudentId}`);
    if (saved) {
      setProfile(JSON.parse(saved) as ProfileFields);
      return;
    }
    const records = readStudentAthletes();
    const record = records.find((item) => item.id === nextStudentId || item.userId === nextStudentId);
    if (record) {
      setDatabaseRecord(record);
      setProfile(profileFromRecord(record));
      setProfileStatus(record.profileStatus);
    }
  }, []);

  const fullName = useMemo(() => `${profile.firstName} ${profile.lastName}`.trim(), [profile.firstName, profile.lastName]);
  const engagementScore = databaseRecord?.engagementScore ?? 84;
  const visibleRoadmapProgress = {
    ...roadmapProgress,
    overallCompletion: databaseRecord?.completionPercentage ?? roadmapProgress.overallCompletion,
  };
  const visibleRoadmapHistory = databaseRecord?.roadmapHistory.length
    ? databaseRecord.roadmapHistory.map((record) => ({
        roadmapName: record.roadmapName,
        academicYear: record.academicYear,
        completion: `${record.completionPercentage}%`,
        dateStarted: record.dateStarted,
        dateCompleted: record.dateEnded,
        status: record.status,
      }))
    : roadmapHistory;
  const eventStats = databaseRecord ? eventStatsForStudent(databaseRecord.id, readEvents()) : null;
  const eventAttendanceHistory = databaseRecord?.eventAttendanceHistory ?? [];
  const staffNotes = databaseRecord?.staffNotes ?? [];
  const visibleParticipation = eventStats
    ? [
        { label: "Event Attendance", value: `${eventStats.attendedCount} attended`, icon: CalendarDays },
        { label: "Road Trip Participation", value: `${eventStats.roadTripCount} road trips`, icon: Trophy },
        { label: "Job Shadow Participation", value: `${eventStats.jobShadowCount} completed`, icon: UserRound },
        { label: "Internship Participation", value: databaseRecord?.internshipStatus ?? "Not Started", icon: Award },
        { label: "Informational Interviews", value: "Tracked in modules", icon: ShieldCheck },
        { label: "Guest Speaker Attendance", value: `${eventStats.guestSpeakerCount} speakers`, icon: CalendarDays },
      ]
    : participation;

  const updateField = (field: keyof ProfileFields, value: string) => {
    setProfile((current) => ({ ...current, [field]: value }));
  };

  const saveStaffNotes = (nextNotes: StaffNote[], nextMessage: string) => {
    const records = readStudentAthletes();
    const nextRecords = records.map((record) =>
      record.id === studentId || record.id === databaseRecord?.id ? { ...record, staffNotes: nextNotes } : record,
    );
    writeStudentAthletes(nextRecords);
    setDatabaseRecord(nextRecords.find((record) => record.id === studentId || record.id === databaseRecord?.id) ?? databaseRecord);
    setMessage(nextMessage);
  };

  const submitStaffNote = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!staffNoteForm.date || !staffNoteForm.staffMemberName.trim() || !staffNoteForm.noteText.trim()) {
      setMessage("Add a date, staff member name, and note text before saving a staff note.");
      return;
    }
    if (staffNoteForm.followUpNeeded === "Yes" && !staffNoteForm.followUpDate) {
      setMessage("Add a follow-up date or choose Follow-up needed: No.");
      return;
    }
    const timestamp = new Date().toISOString();
    if (editingNoteId) {
      saveStaffNotes(
        staffNotes.map((note) => note.id === editingNoteId ? { ...note, ...staffNoteForm, updatedAt: timestamp } : note),
        "Staff note updated.",
      );
    } else {
      saveStaffNotes(
        [{ id: `staff-note-${Date.now()}`, ...staffNoteForm, createdAt: timestamp, updatedAt: timestamp }, ...staffNotes],
        "Staff note added.",
      );
    }
    setStaffNoteForm(emptyStaffNote);
    setEditingNoteId(null);
  };

  const editStaffNote = (note: StaffNote) => {
    setEditingNoteId(note.id);
    setStaffNoteForm({
      date: note.date,
      staffMemberName: note.staffMemberName,
      category: note.category,
      noteText: note.noteText,
      followUpNeeded: note.followUpNeeded,
      followUpDate: note.followUpDate,
      followUpStatus: note.followUpStatus,
    });
    setMessage("Editing staff note.");
  };

  const deleteStaffNote = (noteId: string) => {
    if (!window.confirm("Delete this staff note?")) return;
    saveStaffNotes(staffNotes.filter((note) => note.id !== noteId), "Staff note deleted.");
  };

  const markStaffNoteComplete = (noteId: string) => {
    const timestamp = new Date().toISOString();
    saveStaffNotes(
      staffNotes.map((note) => note.id === noteId ? { ...note, followUpStatus: "Complete", updatedAt: timestamp } : note),
      "Follow-up marked complete.",
    );
  };

  const saveChanges = () => {
    window.localStorage.setItem(`${profileStorageKey}:${studentId}`, JSON.stringify(profile));
    const records = readStudentAthletes();
    const nextRecords = records.map((record) =>
      record.id === studentId || record.id === databaseRecord?.id
        ? (() => {
            const nextRecord = {
              ...record,
              firstName: profile.firstName,
              lastName: profile.lastName,
              preferredName: profile.preferredName,
              email: profile.email,
              phone: profile.phone,
              sport: profile.sport,
              team: profile.team,
              classYear: profile.classYear,
              academicYear: profile.academicYear,
              major: profile.major,
              minor: profile.minor,
              expectedGraduationYear: profile.expectedGraduationYear,
              entryYear: profile.entryYear,
              transferStatus: profile.transferStatus,
              currentRoadmap: profile.currentRoadmap,
              roadmapStartDate: profile.roadmapStartDate,
              roadmapCompletedDate: profile.roadmapCompletedDate,
              careerInterests: profile.careerInterests,
              internshipStatus: profile.internshipStatus,
              jobShadowStatus: profile.jobShadowStatus,
              lastActiveDate: profile.lastActiveDate,
              profileStatus,
            };
            return { ...nextRecord, engagementScore: calculateEngagementScore(nextRecord, readEvents()) };
          })()
        : record,
    );
    writeStudentAthletes(nextRecords);
    setDatabaseRecord(nextRecords.find((record) => record.id === studentId || record.id === databaseRecord?.id) ?? databaseRecord);
    setIsEditing(false);
    setMessage("Profile changes saved locally.");
  };

  const resetPassword = () => {
    const temporaryPassword = `Aggies${Math.floor(1000 + Math.random() * 9000)}!`;
    const users = readJson<User[]>(accessStorageKeys.users, seedUsers);
    const nextUsers = users.map((user) =>
      user.email.toLowerCase() === profile.email.toLowerCase() && user.status === "active"
        ? { ...user, password: temporaryPassword, mustChangePassword: true, updatedAt: new Date().toISOString() }
        : user,
    );
    writeJson(accessStorageKeys.users, nextUsers);
    queuePlaceholderEmail("passwordReset", profile.email, {
      firstName: profile.preferredName || profile.firstName,
      temporaryPassword,
      resetLink: `${window.location.origin}/change-password`,
    });
    setMessage(`Temporary password created for ${profile.email}: ${temporaryPassword}. Placeholder email queued from ${emailConfig.senderEmail}.`);
  };

  const exportProfile = () => {
    downloadTextFile(
      `student-profile-${studentId}.json`,
      JSON.stringify({ studentId, profileStatus, profile, roadmapProgress: visibleRoadmapProgress, roadmapHistory: visibleRoadmapHistory, databaseRecord, eventAttendanceHistory, participation, badges }, null, 2),
    );
    setMessage("Student profile export downloaded.");
  };

  const downloadOverview = () => {
    const overview = [
      "Aggies Lead Student-Athlete Overview",
      `Name: ${fullName}`,
      `Team / Sport: ${profile.team}`,
      `Class Year: ${profile.classYear}`,
      `Current Roadmap: ${profile.currentRoadmap}`,
      `Current Academic Year: ${profile.academicYear}`,
      `Joined Aggies Lead Date: ${profile.joinedAggiesLeadDate}`,
      `Profile Status: ${profileStatus}`,
      `Overall Completion: ${visibleRoadmapProgress.overallCompletion}%`,
      `Roadmap History: ${visibleRoadmapHistory.map((record) => `${record.roadmapName} ${record.completion}`).join("; ")}`,
      `Engagement Score: ${engagementScore}`,
      `Career Interests: ${profile.careerInterests}`,
      `Last Active: ${profile.lastActiveDate}`,
    ].join("\n");
    downloadTextFile(`student-overview-${studentId}.txt`, overview);
    setMessage("Student overview downloaded.");
  };

  const archiveProfile = () => {
    setProfileStatus("Archived");
    const records = readStudentAthletes();
    writeStudentAthletes(records.map((record) => record.id === studentId || record.id === databaseRecord?.id ? { ...record, profileStatus: "Archived" } : record));
    setMessage("Student-athlete archived locally for this prototype.");
  };

  return (
    <RoleGate allowed={["admin"]}>
      <div className="space-y-8">
        <section className="card-surface rounded-lg p-7">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.28em] text-aggie-silver">Student-Athlete Profile</p>
              <h1 className="text-glow mt-3 text-4xl font-black tracking-tight text-white md:text-6xl">
                {fullName}
              </h1>
              {databaseRecord?.isTestAccount ? (
                <span className="mt-4 inline-flex rounded-lg border border-aggie-ice/30 bg-aggie-ice/10 px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-aggie-light">
                  TEST ACCOUNT
                </span>
              ) : null}
              <p className="mt-4 max-w-4xl text-lg leading-8 text-aggie-light/78">
                Admin-only profile view for reviewing, editing, exporting, and managing student-athlete progress records.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[420px]">
              <HeaderMetric label="Team / Sport" value={profile.team} />
              <HeaderMetric label="Class Year" value={profile.classYear} />
              <HeaderMetric label="Current Roadmap" value={profile.currentRoadmap} />
              <HeaderMetric label="Profile Status" value={profileStatus} />
              <HeaderMetric label="Account Status" value={databaseRecord?.accountStatus ?? "Pending Activation"} />
              <HeaderMetric label="Overall Completion %" value={`${visibleRoadmapProgress.overallCompletion}%`} />
              <HeaderMetric label="Engagement Score" value={String(engagementScore)} />
            </div>
          </div>
        </section>

        {message ? (
          <p className="rounded-lg border border-aggie-ice/30 bg-aggie-ice/10 p-4 text-sm font-bold text-aggie-light">
            {message}
          </p>
        ) : null}

        <section className="card-surface rounded-lg p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <UserRound className="h-6 w-6 text-aggie-ice" />
              <h2 className="text-2xl font-black text-white">Profile Details</h2>
            </div>
            <p className="text-sm font-semibold text-aggie-muted">
              {isEditing ? "Editing enabled" : "Read-only until Edit Profile is selected"}
            </p>
          </div>
          <EditableGrid
            fields={[
              ["First Name", "firstName"],
              ["Last Name", "lastName"],
              ["Preferred Name", "preferredName"],
              ["Email", "email"],
              ["Phone", "phone"],
              ["Sport", "sport"],
              ["Team", "team"],
              ["Class Year", "classYear"],
              ["Academic Year", "academicYear"],
              ["Major", "major"],
              ["Minor", "minor"],
              ["Expected Graduation Year", "expectedGraduationYear"],
              ["Entry Year", "entryYear"],
              ["Transfer Status", "transferStatus"],
              ["Current Roadmap", "currentRoadmap"],
              ["Roadmap Start Date", "roadmapStartDate"],
              ["Roadmap Completed Date", "roadmapCompletedDate"],
              ["Joined Aggies Lead Date", "joinedAggiesLeadDate"],
              ["Last Active Date", "lastActiveDate"],
            ]}
            profile={profile}
            disabled={!isEditing}
            onChange={updateField}
          />
        </section>

        <section className="card-surface rounded-lg p-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-aggie-ice" />
            <h2 className="text-2xl font-black text-white">Career Development</h2>
          </div>
          <EditableGrid
            fields={[
              ["Resume Status", "resumeStatus"],
              ["LinkedIn Status", "linkedInStatus"],
              ["Handshake Status", "handshakeStatus"],
              ["Career Interests", "careerInterests"],
              ["Internship Status", "internshipStatus"],
              ["Job Shadow Status", "jobShadowStatus"],
              ["Informational Interview Status", "informationalInterviewStatus"],
              ["Professional References Status", "professionalReferencesStatus"],
              ["Employment Status", "employmentStatus"],
              ["Graduate School Status", "graduateSchoolStatus"],
              ["Professional Contract Status", "professionalContractStatus"],
            ]}
            profile={profile}
            disabled={!isEditing}
            onChange={updateField}
          />
        </section>

        <section className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
          <article className="card-surface rounded-lg p-6">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-6 w-6 text-aggie-ice" />
              <h2 className="text-2xl font-black text-white">Roadmap Progress</h2>
            </div>
            <div className="mt-5 rounded-lg border border-white/10 bg-white/6 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.16em] text-aggie-silver">Current Roadmap</p>
                  <h3 className="mt-1 text-xl font-black text-white">{profile.currentRoadmap}</h3>
                </div>
                <p className="text-4xl font-black text-white">{visibleRoadmapProgress.overallCompletion}%</p>
              </div>
              <div className="mt-4 h-3 rounded-full bg-white/10">
                <div className="h-3 rounded-full bg-gradient-to-r from-aggie-ice via-aggie-silver to-aggie-steel" style={{ width: `${visibleRoadmapProgress.overallCompletion}%` }} />
              </div>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <ModuleColumn title="Completed Modules" items={visibleRoadmapProgress.completedModules} tone="complete" />
              <ModuleColumn title="In-Progress Modules" items={visibleRoadmapProgress.inProgressModules} tone="progress" />
              <ModuleColumn title="Missing Modules" items={visibleRoadmapProgress.missingModules} tone="missing" />
            </div>
          </article>

          <article className="card-surface rounded-lg p-6">
            <div className="flex items-center gap-3">
              <CalendarDays className="h-6 w-6 text-aggie-ice" />
              <h2 className="text-2xl font-black text-white">Roadmap History</h2>
            </div>
            <div className="mt-5 space-y-4">
              {visibleRoadmapHistory.map((record) => (
                <div key={`${record.roadmapName}-${record.academicYear}`} className="rounded-lg border border-white/10 bg-white/6 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-black text-white">{record.roadmapName}</h3>
                      <p className="mt-1 text-sm font-semibold text-aggie-muted">{record.academicYear}</p>
                    </div>
                    <span className="rounded-lg border border-aggie-silver/15 bg-white/[0.045] px-3 py-2 text-sm font-black text-white">
                      {record.status}
                    </span>
                  </div>
                  <div className="mt-4 grid gap-3 text-sm font-bold text-aggie-light sm:grid-cols-3">
                    <p>Completion: {record.completion}</p>
                    <p>Started: {record.dateStarted}</p>
                    <p>Completed: {record.dateCompleted}</p>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="grid gap-5 xl:grid-cols-[1fr_0.75fr]">
          <article className="card-surface rounded-lg p-6">
            <div className="flex items-center gap-3">
              <Trophy className="h-6 w-6 text-aggie-ice" />
              <h2 className="text-2xl font-black text-white">Participation</h2>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {visibleParticipation.map((item) => (
                <ParticipationCard key={item.label} {...item} />
              ))}
            </div>
            <div className="mt-5 rounded-lg border border-white/10 bg-white/6 p-4">
              <h3 className="text-lg font-black text-white">Event Attendance History</h3>
              <div className="mt-4 space-y-3">
                {eventAttendanceHistory.length ? eventAttendanceHistory.map((event) => (
                  <div key={`${event.eventId}-${event.updatedAt}`} className="rounded-lg border border-emerald-300/20 bg-emerald-300/10 p-3 text-sm font-bold text-aggie-light">
                    <p className="font-black text-white">{event.eventTitle}</p>
                    <p className="mt-1">{event.eventType} | {event.eventDate} | {event.status}</p>
                    {event.countsTowardModule ? <p className="mt-1 text-aggie-muted">Module credit: {event.countsTowardModule}</p> : null}
                  </div>
                )) : (
                  <p className="text-sm font-semibold text-aggie-muted">No attended events have been recorded yet.</p>
                )}
              </div>
            </div>
          </article>

          <article className="card-surface rounded-lg p-6">
            <div className="flex items-center gap-3">
              <Award className="h-6 w-6 text-aggie-ice" />
              <h2 className="text-2xl font-black text-white">Badges / Engagement</h2>
            </div>
            <div className="mt-5 grid gap-3">
              <HeaderMetric label="Engagement Score" value={String(engagementScore)} />
              <HeaderMetric label="Team Ranking Contribution" value="+3.4%" />
              <HeaderMetric label="Class Ranking Percentile" value="Top 18%" />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {badges.map((badge) => (
                <span key={badge} className="rounded-lg border border-aggie-ice/25 bg-aggie-ice/10 px-3 py-2 text-sm font-black text-aggie-light">
                  {badge}
                </span>
              ))}
            </div>
          </article>
        </section>

        <section className="card-surface rounded-lg p-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-aggie-ice" />
              <div>
                <h2 className="text-2xl font-black text-white">Staff Notes</h2>
                <p className="mt-1 text-sm font-semibold text-aggie-muted">Admin-only notes and follow-up tracking. Coaches and student-athletes cannot view this section.</p>
              </div>
            </div>
            <span className="w-fit rounded-lg border border-aggie-silver/20 bg-white/6 px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-aggie-light">
              Admin Only
            </span>
          </div>

          <form onSubmit={submitStaffNote} className="mt-6 rounded-lg border border-white/10 bg-white/6 p-4">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <TextInput label="Date" value={staffNoteForm.date} type="date" onChange={(value) => setStaffNoteForm((current) => ({ ...current, date: value }))} />
              <TextInput label="Staff Member Name" value={staffNoteForm.staffMemberName} onChange={(value) => setStaffNoteForm((current) => ({ ...current, staffMemberName: value }))} />
              <SelectInput label="Note Category" value={staffNoteForm.category} options={staffNoteCategories} onChange={(value) => setStaffNoteForm((current) => ({ ...current, category: value as StaffNoteCategory }))} />
              <SelectInput label="Follow-up Needed" value={staffNoteForm.followUpNeeded} options={["No", "Yes"]} onChange={(value) => setStaffNoteForm((current) => ({ ...current, followUpNeeded: value as "Yes" | "No" }))} />
              <TextInput label="Follow-up Date" value={staffNoteForm.followUpDate} type="date" onChange={(value) => setStaffNoteForm((current) => ({ ...current, followUpDate: value }))} />
              <SelectInput label="Follow-up Status" value={staffNoteForm.followUpStatus} options={followUpStatuses} onChange={(value) => setStaffNoteForm((current) => ({ ...current, followUpStatus: value as FollowUpStatus }))} />
            </div>
            <label className="mt-4 block">
              <span className="text-sm font-black uppercase tracking-[0.14em] text-aggie-silver">Note Text</span>
              <textarea
                value={staffNoteForm.noteText}
                onChange={(event) => setStaffNoteForm((current) => ({ ...current, noteText: event.target.value }))}
                className="mt-2 min-h-28 w-full rounded-lg border border-white/10 bg-white/8 px-4 py-3 text-white outline-none transition focus:border-aggie-ice"
              />
            </label>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <button type="submit" className="chrome-surface inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-aggie-chrome/60 px-4 text-sm font-black text-aggie-navy shadow-glow transition hover:brightness-110">
                <Plus className="h-4 w-4" />
                {editingNoteId ? "Update Staff Note" : "Add Staff Note"}
              </button>
              {editingNoteId ? (
                <button
                  type="button"
                  onClick={() => { setEditingNoteId(null); setStaffNoteForm(emptyStaffNote); }}
                  className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/10 bg-white/6 px-4 text-sm font-black text-white transition hover:bg-white/10"
                >
                  Cancel Edit
                </button>
              ) : null}
            </div>
          </form>

          <div className="mt-5 grid gap-4 xl:grid-cols-2">
            {staffNotes.length ? staffNotes.map((note) => (
              <article key={note.id} className="rounded-lg border border-white/10 bg-white/6 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-aggie-silver">{note.category}</p>
                    <h3 className="mt-2 text-lg font-black text-white">{note.staffMemberName}</h3>
                    <p className="mt-1 text-sm font-bold text-aggie-muted">{note.date}</p>
                  </div>
                  <span className={`w-fit rounded-lg border px-3 py-2 text-xs font-black uppercase tracking-[0.12em] ${
                    note.followUpStatus === "Complete" ? "border-emerald-300/25 bg-emerald-300/10 text-aggie-light" : "border-aggie-ice/25 bg-aggie-ice/10 text-aggie-light"
                  }`}>
                    {note.followUpNeeded === "Yes" ? note.followUpStatus : "No Follow-Up"}
                  </span>
                </div>
                <p className="mt-4 whitespace-pre-wrap text-sm font-semibold leading-6 text-aggie-light/78">{note.noteText}</p>
                {note.followUpNeeded === "Yes" ? (
                  <div className="mt-4 rounded-lg border border-aggie-ice/20 bg-aggie-ice/10 p-3 text-sm font-bold text-aggie-light">
                    Follow-up date: {note.followUpDate || "Not set"}
                  </div>
                ) : null}
                <div className="mt-4 flex flex-wrap gap-2">
                  {note.followUpNeeded === "Yes" && note.followUpStatus !== "Complete" ? (
                    <button type="button" onClick={() => markStaffNoteComplete(note.id)} className="rounded-lg border border-emerald-300/25 bg-emerald-300/10 px-3 py-2 text-sm font-black text-aggie-light">
                      Mark Complete
                    </button>
                  ) : null}
                  <button type="button" onClick={() => editStaffNote(note)} className="rounded-lg border border-white/10 bg-white/6 px-3 py-2 text-sm font-black text-white">
                    Edit
                  </button>
                  <button type="button" onClick={() => deleteStaffNote(note.id)} className="inline-flex items-center gap-2 rounded-lg border border-red-300/25 bg-red-300/10 px-3 py-2 text-sm font-black text-aggie-light">
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </article>
            )) : (
              <p className="rounded-lg border border-white/10 bg-white/6 p-4 text-sm font-semibold text-aggie-muted">
                No staff notes have been added for this student-athlete yet.
              </p>
            )}
          </div>
        </section>

        <section className="card-surface rounded-lg p-6">
          <h2 className="text-2xl font-black text-white">Admin Actions</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
            <ActionButton icon={Pencil} label="Edit Profile" onClick={() => { setIsEditing(true); setMessage("Editing enabled."); }} />
            <ActionButton icon={Save} label="Save Changes" onClick={saveChanges} />
            <ActionButton icon={KeyRound} label="Reset Password" onClick={resetPassword} />
            <ActionButton icon={FileDown} label="Export Student Profile" onClick={exportProfile} />
            <ActionButton icon={Download} label="Download Overview" onClick={downloadOverview} />
            <ActionButton icon={Archive} label="Archive Student-Athlete" onClick={archiveProfile} danger />
          </div>
        </section>
      </div>
    </RoleGate>
  );
}

function HeaderMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-aggie-silver/15 bg-white/[0.045] p-4">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-aggie-silver">{label}</p>
      <p className="mt-2 text-lg font-black text-white">{value}</p>
    </div>
  );
}

function EditableGrid({
  fields,
  profile,
  disabled,
  onChange,
}: {
  fields: [string, keyof ProfileFields][];
  profile: ProfileFields;
  disabled: boolean;
  onChange: (field: keyof ProfileFields, value: string) => void;
}) {
  return (
    <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {fields.map(([label, field]) => (
        <label key={field} className="block">
          <span className="text-sm font-black uppercase tracking-[0.14em] text-aggie-silver">{label}</span>
          <input
            value={profile[field]}
            disabled={disabled}
            onChange={(event) => onChange(field, event.target.value)}
            className="mt-2 min-h-12 w-full rounded-lg border border-white/10 bg-white/8 px-4 text-white outline-none transition placeholder:text-aggie-muted disabled:cursor-not-allowed disabled:opacity-70 focus:border-aggie-ice"
          />
        </label>
      ))}
    </div>
  );
}

function ModuleColumn({ title, items, tone }: { title: string; items: string[]; tone: "complete" | "progress" | "missing" }) {
  const toneClass = {
    complete: "border-emerald-300/25 bg-emerald-300/10",
    progress: "border-aggie-ice/25 bg-aggie-ice/10",
    missing: "border-red-300/25 bg-red-300/10",
  }[tone];

  return (
    <div className="rounded-lg border border-white/10 bg-white/6 p-4">
      <h3 className="text-base font-black text-white">{title}</h3>
      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <p key={item} className={`rounded-lg border p-3 text-sm font-bold leading-5 text-aggie-light ${toneClass}`}>
            {item}
          </p>
        ))}
      </div>
    </div>
  );
}

function ParticipationCard({ label, value, icon: Icon }: { label: string; value: string; icon: LucideIcon }) {
  return (
    <article className="rounded-lg border border-white/10 bg-white/6 p-4">
      <Icon className="h-5 w-5 text-aggie-ice" />
      <p className="mt-3 text-sm font-bold uppercase tracking-[0.14em] text-aggie-silver">{label}</p>
      <p className="mt-2 text-2xl font-black text-white">{value}</p>
    </article>
  );
}

function ActionButton({ label, icon: Icon, onClick, danger = false }: { label: string; icon: LucideIcon; onClick: () => void; danger?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-black transition ${
        danger
          ? "border-red-300/25 bg-red-300/10 text-aggie-light hover:bg-red-300/15"
          : "border-white/10 bg-white/6 text-white hover:border-aggie-ice/40 hover:bg-white/10"
      }`}
    >
      <Icon className="h-4 w-4 text-aggie-ice" />
      {label}
    </button>
  );
}

function TextInput({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return (
    <label className="block">
      <span className="text-sm font-black uppercase tracking-[0.14em] text-aggie-silver">{label}</span>
      <input
        value={value}
        type={type}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 min-h-12 w-full rounded-lg border border-white/10 bg-white/8 px-4 text-white outline-none transition focus:border-aggie-ice"
      />
    </label>
  );
}

function SelectInput({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="text-sm font-black uppercase tracking-[0.14em] text-aggie-silver">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 min-h-12 w-full rounded-lg border border-white/10 bg-aggie-navy px-4 text-white outline-none transition focus:border-aggie-ice"
      >
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}

function downloadTextFile(filename: string, contents: string) {
  const blob = new Blob([contents], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function profileFromRecord(record: StudentAthleteRecord): ProfileFields {
  return {
    firstName: record.firstName,
    lastName: record.lastName,
    preferredName: record.preferredName,
    email: record.email,
    phone: record.phone,
    sport: record.sport,
    team: record.team,
    classYear: record.classYear,
    academicYear: record.academicYear,
    major: record.major,
    minor: record.minor,
    expectedGraduationYear: record.expectedGraduationYear,
    entryYear: record.entryYear,
    transferStatus: record.transferStatus,
    currentRoadmap: record.currentRoadmap,
    roadmapStartDate: record.roadmapStartDate,
    roadmapCompletedDate: record.roadmapCompletedDate,
    joinedAggiesLeadDate: record.joinedAggiesLeadDate,
    lastActiveDate: record.lastActiveDate,
    resumeStatus: "Not Started",
    linkedInStatus: record.linkedInUrl ? "Added" : "Not Started",
    handshakeStatus: "Not Started",
    careerInterests: record.careerInterests,
    internshipStatus: record.internshipStatus,
    jobShadowStatus: record.jobShadowStatus,
    informationalInterviewStatus: "Not Started",
    professionalReferencesStatus: "Not Started",
    employmentStatus: "Not Started",
    graduateSchoolStatus: "Not Started",
    professionalContractStatus: "Not Started",
  };
}

"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  KeyRound,
  Link as LinkIcon,
  Mail,
  Play,
  RotateCcw,
  ShieldCheck,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import { RoleGate } from "@/components/RoleGate";
import { useAuth } from "@/components/AuthState";
import {
  accessStorageKeys,
  displayName,
  ensureAccessSeedData,
  readJson,
  seedCoachProfiles,
  seedUsers,
  teamName,
  teams,
  writeJson,
} from "@/lib/accessManagement";
import type { AdminInvite, CoachProfile, User } from "@/lib/accessManagement";
import { readStudentAthletes } from "@/lib/studentAthleteDatabase";
import type { StudentAthleteRecord } from "@/lib/studentAthleteDatabase";
import {
  createTestStudentAthlete,
  deleteTestStudentAthlete,
  findTestStudentAthlete,
  resetTestStudentAthleteProgress,
  testStudentAthleteEmail,
  testStudentAthletePassword,
} from "@/lib/testAccounts";
import {
  overrideStudentRoadmap,
  previewRoadmapAdvancement,
  readAdvancementHistory,
  roadmapOptions,
  runRoadmapAdvancement,
  setAdvancementExclusion,
} from "@/lib/roadmapAdvancement";
import type { AdvancementHistoryItem, AdvancementPreview } from "@/lib/roadmapAdvancement";
import { emailConfig, emailTemplates, queuePlaceholderEmail } from "@/lib/emailService";

type CoachForm = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  title: string;
  teamIds: string[];
};

const emptyCoachForm: CoachForm = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  title: "",
  teamIds: [],
};

export default function SettingsPage() {
  const { user, refreshUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [invites, setInvites] = useState<AdminInvite[]>([]);
  const [coachProfiles, setCoachProfiles] = useState<CoachProfile[]>([]);
  const [studentAthletes, setStudentAthletes] = useState<StudentAthleteRecord[]>([]);
  const [advancementPreview, setAdvancementPreview] = useState<AdvancementPreview[]>([]);
  const [advancementHistory, setAdvancementHistory] = useState<AdvancementHistoryItem[]>([]);
  const [overrideStudentId, setOverrideStudentId] = useState("");
  const [overrideRoadmap, setOverrideRoadmap] = useState("Sophomore Roadmap");
  const [adminEmail, setAdminEmail] = useState("");
  const [coachForm, setCoachForm] = useState<CoachForm>(emptyCoachForm);
  const [message, setMessage] = useState("");

  const activeAdmins = useMemo(
    () => users.filter((item) => item.role === "admin" && item.status === "active"),
    [users],
  );
  const activeCoachProfiles = useMemo(
    () => coachProfiles.filter((item) => item.status === "active"),
    [coachProfiles],
  );
  const pendingInvites = useMemo(
    () => invites.filter((item) => item.status === "pending"),
    [invites],
  );
  const testStudentAthlete = useMemo(
    () => findTestStudentAthlete(studentAthletes),
    [studentAthletes],
  );

  const reload = () => {
    ensureAccessSeedData();
    setUsers(readJson<User[]>(accessStorageKeys.users, seedUsers));
    setInvites(readJson<AdminInvite[]>(accessStorageKeys.adminInvites, []));
    setCoachProfiles(readJson<CoachProfile[]>(accessStorageKeys.coachProfiles, seedCoachProfiles));
    const records = readStudentAthletes();
    setStudentAthletes(records);
    setAdvancementPreview(previewRoadmapAdvancement(records));
    setAdvancementHistory(readAdvancementHistory());
  };

  useEffect(() => {
    reload();
  }, []);

  const saveUsers = (nextUsers: User[]) => {
    setUsers(nextUsers);
    writeJson(accessStorageKeys.users, nextUsers);
    refreshUser();
  };

  const saveInvites = (nextInvites: AdminInvite[]) => {
    setInvites(nextInvites);
    writeJson(accessStorageKeys.adminInvites, nextInvites);
  };

  const saveCoachProfiles = (nextProfiles: CoachProfile[]) => {
    setCoachProfiles(nextProfiles);
    writeJson(accessStorageKeys.coachProfiles, nextProfiles);
  };

  const createAdminInvite = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = adminEmail.trim().toLowerCase();
    if (!email) return;
    const duplicate = invites.some((invite) => invite.email.toLowerCase() === email && invite.status === "pending");
    if (duplicate) {
      setMessage("That admin invite is already pending.");
      return;
    }
    const invite: AdminInvite = {
      id: `admin-invite-${Date.now()}`,
      email,
      invitedBy: user?.email ?? "admin@aggieslead.local",
      status: "pending",
      createdAt: new Date().toISOString(),
      acceptedAt: null,
    };
    saveInvites([invite, ...invites]);
    queuePlaceholderEmail("adminInvite", email, {
      inviteLink: `${window.location.origin}/accept-admin-invite?inviteId=${invite.id}`,
    });
    setAdminEmail("");
    setMessage(`Admin invite created for ${email}. Placeholder email queued from ${emailConfig.senderEmail}.`);
  };

  const removeAdminAccess = (adminId: string) => {
    const nextUsers = users.map((item) =>
      item.id === adminId ? { ...item, status: "removed" as const, updatedAt: new Date().toISOString() } : item,
    );
    saveUsers(nextUsers);
    setMessage("Admin access removed.");
  };

  const revokeInvite = (inviteId: string) => {
    saveInvites(invites.map((invite) => (invite.id === inviteId ? { ...invite, status: "revoked" } : invite)));
    setMessage("Pending admin invite revoked.");
  };

  const createCoach = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!coachForm.firstName || !coachForm.lastName || !coachForm.email || !coachForm.password || !coachForm.title || coachForm.teamIds.length === 0) {
      setMessage("Complete every coach field and assign at least one team.");
      return;
    }
    const email = coachForm.email.trim().toLowerCase();
    if (users.some((item) => item.email.toLowerCase() === email && item.status !== "removed")) {
      setMessage("An active account already exists for that email.");
      return;
    }
    const timestamp = Date.now();
    const createdAt = new Date().toISOString();
    const coachUser: User = {
      id: `coach-${timestamp}`,
      firstName: coachForm.firstName.trim(),
      lastName: coachForm.lastName.trim(),
      email,
      role: "coach",
      teamIds: coachForm.teamIds,
      title: coachForm.title.trim(),
      status: "active",
      mustChangePassword: true,
      password: coachForm.password,
      createdAt,
      updatedAt: createdAt,
    };
    const profile: CoachProfile = {
      id: `coach-profile-${timestamp}`,
      userId: coachUser.id,
      firstName: coachUser.firstName,
      lastName: coachUser.lastName,
      email: coachUser.email,
      title: coachUser.title,
      assignedTeamIds: coachUser.teamIds,
      status: "active",
      mustChangePassword: true,
    };
    saveUsers([coachUser, ...users]);
    saveCoachProfiles([profile, ...coachProfiles]);
    queuePlaceholderEmail("coachAccountCreated", coachUser.email, {
      firstName: coachUser.firstName,
      email: coachUser.email,
      temporaryPassword: coachForm.password,
      assignedTeams: coachUser.teamIds.map(teamName).join(", "),
      loginLink: `${window.location.origin}/login`,
    });
    setCoachForm(emptyCoachForm);
    setMessage(`Coach account created. Placeholder setup email queued from ${emailConfig.senderEmail}.`);
  };

  const toggleCoachTeam = (profile: CoachProfile, teamId: string) => {
    const hasTeam = profile.assignedTeamIds.includes(teamId);
    const assignedTeamIds = hasTeam
      ? profile.assignedTeamIds.filter((id) => id !== teamId)
      : [...profile.assignedTeamIds, teamId];
    if (assignedTeamIds.length === 0) return;

    const nextProfiles = coachProfiles.map((item) =>
      item.id === profile.id ? { ...item, assignedTeamIds } : item,
    );
    const nextUsers = users.map((item) =>
      item.id === profile.userId ? { ...item, teamIds: assignedTeamIds, updatedAt: new Date().toISOString() } : item,
    );
    saveCoachProfiles(nextProfiles);
    saveUsers(nextUsers);
    setMessage("Coach team assignment updated.");
  };

  const resetCoachPassword = (profile: CoachProfile) => {
    const temporaryPassword = `Aggies${Math.floor(1000 + Math.random() * 9000)}!`;
    const nextUsers = users.map((item) =>
      item.id === profile.userId
        ? { ...item, password: temporaryPassword, mustChangePassword: true, updatedAt: new Date().toISOString() }
        : item,
    );
    const nextProfiles = coachProfiles.map((item) =>
      item.id === profile.id ? { ...item, mustChangePassword: true } : item,
    );
    saveUsers(nextUsers);
    saveCoachProfiles(nextProfiles);
    queuePlaceholderEmail("passwordReset", profile.email, {
      firstName: profile.firstName,
      temporaryPassword,
      resetLink: `${window.location.origin}/change-password`,
    });
    setMessage(`Temporary password reset for ${profile.email}: ${temporaryPassword}. Placeholder email queued from ${emailConfig.senderEmail}.`);
  };

  const removeCoachAccess = (profile: CoachProfile) => {
    saveUsers(users.map((item) => (item.id === profile.userId ? { ...item, status: "removed", updatedAt: new Date().toISOString() } : item)));
    saveCoachProfiles(coachProfiles.map((item) => (item.id === profile.id ? { ...item, status: "removed" } : item)));
    setMessage("Coach access removed.");
  };

  const previewUpcomingChanges = () => {
    const records = readStudentAthletes();
    setStudentAthletes(records);
    setAdvancementPreview(previewRoadmapAdvancement(records));
    setMessage("Upcoming roadmap changes preview refreshed.");
  };

  const runManualAdvancement = () => {
    const confirmed = window.confirm("Run roadmap advancement now? Previous roadmap progress will be saved to history.");
    if (!confirmed) return;
    const result = runRoadmapAdvancement(user?.email ?? "Admin");
    setStudentAthletes(result.records);
    setAdvancementPreview(previewRoadmapAdvancement(result.records));
    setAdvancementHistory(readAdvancementHistory());
    setMessage(`Roadmap advancement complete. ${result.countAdvanced} student-athlete${result.countAdvanced === 1 ? "" : "s"} advanced.`);
  };

  const applyRoadmapOverride = () => {
    if (!overrideStudentId || !overrideRoadmap) {
      setMessage("Select a student-athlete and roadmap before applying an override.");
      return;
    }
    const nextRecords = overrideStudentRoadmap(overrideStudentId, overrideRoadmap, user?.email ?? "Admin");
    setStudentAthletes(nextRecords);
    setAdvancementPreview(previewRoadmapAdvancement(nextRecords));
    setAdvancementHistory(readAdvancementHistory());
    setMessage("Individual roadmap override saved.");
  };

  const toggleAdvancementExclusion = (studentId: string, excluded: boolean) => {
    const nextRecords = setAdvancementExclusion(studentId, excluded);
    setStudentAthletes(nextRecords);
    setAdvancementPreview(previewRoadmapAdvancement(nextRecords));
    setMessage(excluded ? "Student-athlete excluded from automatic advancement." : "Student-athlete included in automatic advancement.");
  };

  const handleCreateTestStudentAthlete = () => {
    createTestStudentAthlete();
    reload();
    setMessage("TEST ACCOUNT created: John Doe, Football, Freshman Roadmap. Use johndoe@test.com / Test123! to sign in.");
  };

  const handleDeleteTestStudentAthlete = () => {
    const confirmed = window.confirm("Delete the John Doe TEST ACCOUNT and remove it from local auth and the Student-Athlete Database?");
    if (!confirmed) return;
    deleteTestStudentAthlete();
    reload();
    setMessage("TEST ACCOUNT deleted.");
  };

  const handleResetTestStudentAthleteProgress = () => {
    resetTestStudentAthleteProgress();
    reload();
    setMessage("TEST ACCOUNT progress reset to 0%.");
  };

  return (
    <RoleGate allowed={["admin"]}>
      <div className="space-y-8">
        <section className="card-surface rounded-lg p-7">
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-aggie-silver">Admin Settings</p>
          <h1 className="text-glow mt-3 text-4xl font-black tracking-tight text-white md:text-6xl">
            Invite + Permission Management
          </h1>
          <p className="mt-4 max-w-4xl text-lg leading-8 text-aggie-light/78">
            Manage admin invites, coach accounts, team assignments, and access status for the local Aggies Lead prototype.
          </p>
        </section>

        {message ? (
          <p className="rounded-lg border border-aggie-ice/30 bg-aggie-ice/10 p-4 text-sm font-bold text-aggie-light">
            {message}
          </p>
        ) : null}

        <section className="card-surface rounded-lg p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <Mail className="h-6 w-6 text-aggie-ice" />
                <h2 className="text-2xl font-black text-white">Email Settings</h2>
              </div>
              <p className="mt-3 max-w-3xl leading-7 text-aggie-light/74">
                Email templates are configured. Connect an email provider before sending live emails.
              </p>
            </div>
            <span className="w-fit rounded-lg border border-aggie-silver/20 bg-white/6 px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-aggie-light">
              {emailConfig.status}
            </span>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <InfoTile label="Sender Name" value={emailConfig.senderName} />
            <InfoTile label="Sender Email" value={emailConfig.senderEmail} />
            <InfoTile label="Reply-To Email" value={emailConfig.replyToEmail} />
            <InfoTile label="Email Status" value={emailConfig.status} />
          </div>

          <div className="mt-5 rounded-lg border border-white/10 bg-white/6 p-4">
            <h3 className="text-lg font-black text-white">Configured Email Templates</h3>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {Object.values(emailTemplates).map((template) => (
                <div key={template.label} className="rounded-lg border border-white/10 bg-black/15 p-3">
                  <p className="font-black text-white">{template.label}</p>
                  <p className="mt-1 text-sm font-semibold text-aggie-muted">{template.subject}</p>
                  <p className="mt-2 text-xs font-bold uppercase tracking-[0.12em] text-aggie-silver">
                    From {emailConfig.senderName} &lt;{emailConfig.senderEmail}&gt;
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="card-surface rounded-lg p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <UserPlus className="h-6 w-6 text-aggie-ice" />
                <h2 className="text-2xl font-black text-white">Test Accounts</h2>
              </div>
              <p className="mt-3 max-w-3xl leading-7 text-aggie-light/74">
                Create a clearly labeled TEST ACCOUNT for student-athlete workflow testing. Test accounts are excluded from real exports and dashboard report totals unless an admin chooses to include test data.
              </p>
            </div>
            <span className="w-fit rounded-lg border border-aggie-ice/30 bg-aggie-ice/10 px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-aggie-light">
              TEST ACCOUNT
            </span>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
            <article className="rounded-lg border border-white/10 bg-white/6 p-4">
              <h3 className="text-lg font-black text-white">Sample Student-Athlete</h3>
              <div className="mt-4 grid gap-2 text-sm font-semibold leading-6 text-aggie-light md:grid-cols-2">
                <p>First Name: John</p>
                <p>Last Name: Doe</p>
                <p>Email: {testStudentAthleteEmail}</p>
                <p>Password: {testStudentAthletePassword}</p>
                <p>Role: Student-Athlete</p>
                <p>Team: Football</p>
                <p>Class Year: Freshman</p>
                <p>Current Roadmap: Freshman Roadmap</p>
              </div>
              <p className="mt-4 rounded-lg border border-white/10 bg-black/15 p-3 text-sm font-bold text-aggie-light">
                Status: {testStudentAthlete ? `Created in Student-Athlete Database at ${testStudentAthlete.completionPercentage}% completion` : "Not created yet"}
              </p>
            </article>

            <article className="rounded-lg border border-white/10 bg-white/6 p-4">
              <h3 className="text-lg font-black text-white">Test Account Actions</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={handleCreateTestStudentAthlete}
                  className="chrome-surface inline-flex min-h-12 items-center justify-center rounded-lg border border-aggie-chrome/60 px-4 text-sm font-black text-aggie-navy shadow-glow transition hover:brightness-110"
                >
                  Create Test Student-Athlete
                </button>
                <button
                  type="button"
                  onClick={handleDeleteTestStudentAthlete}
                  disabled={!testStudentAthlete}
                  className="inline-flex min-h-12 items-center justify-center rounded-lg border border-red-300/25 bg-red-300/10 px-4 text-sm font-black text-aggie-light transition hover:bg-red-300/15 disabled:cursor-not-allowed disabled:opacity-45"
                >
                  Delete Test Student-Athlete
                </button>
                <button
                  type="button"
                  onClick={handleResetTestStudentAthleteProgress}
                  disabled={!testStudentAthlete}
                  className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/10 bg-white/6 px-4 text-sm font-black text-white transition hover:border-aggie-ice/40 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-45"
                >
                  Reset Test Student-Athlete Progress
                </button>
              </div>
              <p className="mt-4 text-sm font-semibold leading-6 text-aggie-muted">
                After creation, log in with the test credentials to verify student-only dashboard access, module completion, auto-save progress, rankings, and Football coach visibility.
              </p>
            </article>
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
          <article className="card-surface rounded-lg p-6">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 text-aggie-ice" />
              <h2 className="text-2xl font-black text-white">Add Admin</h2>
            </div>
            <p className="mt-3 leading-7 text-aggie-light/74">
              Admin access is invite-based. The invite can be accepted through a local placeholder link.
            </p>
            <form onSubmit={createAdminInvite} className="mt-5 flex flex-col gap-3 sm:flex-row">
              <input
                value={adminEmail}
                onChange={(event) => setAdminEmail(event.target.value)}
                type="email"
                placeholder="new.admin@usu.edu"
                className="min-h-12 flex-1 rounded-lg border border-white/10 bg-white/8 px-4 text-white outline-none transition focus:border-aggie-ice"
              />
              <button
                type="submit"
                className="chrome-surface inline-flex min-h-12 items-center justify-center rounded-lg border border-aggie-chrome/60 px-5 text-sm font-black text-aggie-navy shadow-glow transition hover:brightness-110"
              >
                Send Invite
              </button>
            </form>

            <h3 className="mt-6 text-lg font-black text-white">View Pending Admin Invites</h3>
            <div className="mt-4 space-y-3">
              {pendingInvites.length ? pendingInvites.map((invite) => (
                <div key={invite.id} className="rounded-lg border border-white/10 bg-white/6 p-4">
                  <p className="font-black text-white">{invite.email}</p>
                  <p className="mt-1 text-sm font-semibold text-aggie-muted">Invited by {invite.invitedBy}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <a
                      href={`/accept-admin-invite?inviteId=${invite.id}`}
                      className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/10 px-3 text-sm font-bold text-aggie-light transition hover:border-aggie-ice/40 hover:bg-white/10"
                    >
                      <LinkIcon className="h-4 w-4 text-aggie-ice" />
                      Accept Link
                    </a>
                    <button
                      type="button"
                      onClick={() => revokeInvite(invite.id)}
                      className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-red-300/20 px-3 text-sm font-bold text-aggie-light transition hover:bg-red-300/10"
                    >
                      <Trash2 className="h-4 w-4 text-red-200" />
                      Revoke
                    </button>
                  </div>
                </div>
              )) : (
                <p className="rounded-lg border border-white/10 bg-white/6 p-4 text-sm font-bold text-aggie-muted">
                  No pending admin invites.
                </p>
              )}
            </div>
          </article>

          <article className="card-surface rounded-lg p-6">
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6 text-aggie-ice" />
              <h2 className="text-2xl font-black text-white">Manage Admins</h2>
            </div>
            <div className="mt-5 grid gap-3">
              {activeAdmins.map((admin) => (
                <div key={admin.id} className="flex flex-col gap-3 rounded-lg border border-white/10 bg-white/6 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-black text-white">{displayName(admin)}</p>
                    <p className="mt-1 text-sm font-semibold text-aggie-muted">{admin.email}</p>
                  </div>
                  <button
                    type="button"
                    disabled={admin.id === user?.id}
                    onClick={() => removeAdminAccess(admin.id)}
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-red-300/20 px-3 text-sm font-bold text-aggie-light transition hover:bg-red-300/10 disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    <Trash2 className="h-4 w-4 text-red-200" />
                    Remove Admin Access
                  </button>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
          <article className="card-surface rounded-lg p-6">
            <div className="flex items-center gap-3">
              <UserPlus className="h-6 w-6 text-aggie-ice" />
              <h2 className="text-2xl font-black text-white">Add Coach</h2>
            </div>
            <p className="mt-3 leading-7 text-aggie-light/74">
              Coaches are created manually by admins and receive their login email and temporary password outside the app.
            </p>
            <form onSubmit={createCoach} className="mt-5 grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <TextInput label="Coach first name" value={coachForm.firstName} onChange={(value) => setCoachForm({ ...coachForm, firstName: value })} />
                <TextInput label="Coach last name" value={coachForm.lastName} onChange={(value) => setCoachForm({ ...coachForm, lastName: value })} />
                <TextInput label="Coach email" value={coachForm.email} onChange={(value) => setCoachForm({ ...coachForm, email: value })} type="email" />
                <TextInput label="Temporary password" value={coachForm.password} onChange={(value) => setCoachForm({ ...coachForm, password: value })} />
                <TextInput label="Coach title/role" value={coachForm.title} onChange={(value) => setCoachForm({ ...coachForm, title: value })} />
              </div>
              <TeamCheckboxes
                selected={coachForm.teamIds}
                onToggle={(teamId) =>
                  setCoachForm({
                    ...coachForm,
                    teamIds: coachForm.teamIds.includes(teamId)
                      ? coachForm.teamIds.filter((id) => id !== teamId)
                      : [...coachForm.teamIds, teamId],
                  })
                }
              />
              <button
                type="submit"
                className="chrome-surface inline-flex min-h-12 items-center justify-center rounded-lg border border-aggie-chrome/60 px-5 text-sm font-black text-aggie-navy shadow-glow transition hover:brightness-110"
              >
                Create Coach Account
              </button>
            </form>
          </article>

          <article className="card-surface rounded-lg p-6">
            <div className="flex items-center gap-3">
              <KeyRound className="h-6 w-6 text-aggie-ice" />
              <h2 className="text-2xl font-black text-white">Manage Coaches</h2>
            </div>
            <div className="mt-5 space-y-4">
              {activeCoachProfiles.map((profile) => (
                <div key={profile.id} className="rounded-lg border border-white/10 bg-white/6 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-black text-white">{profile.firstName} {profile.lastName}</p>
                      <p className="mt-1 text-sm font-semibold text-aggie-muted">{profile.title} • {profile.email}</p>
                      <p className="mt-2 text-sm font-bold text-aggie-light">
                        Assigned: {profile.assignedTeamIds.map(teamName).join(", ")}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => resetCoachPassword(profile)}
                        className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/10 px-3 text-sm font-bold text-aggie-light transition hover:border-aggie-ice/40 hover:bg-white/10"
                      >
                        <RotateCcw className="h-4 w-4 text-aggie-ice" />
                        Reset Password
                      </button>
                      <button
                        type="button"
                        onClick={() => removeCoachAccess(profile)}
                        className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-red-300/20 px-3 text-sm font-bold text-aggie-light transition hover:bg-red-300/10"
                      >
                        <Trash2 className="h-4 w-4 text-red-200" />
                        Remove Access
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    {teams.map((team) => (
                      <label key={team.id} className="flex cursor-pointer items-center gap-3 rounded-lg border border-white/10 bg-black/15 p-3 text-sm font-bold text-aggie-light">
                        <input
                          type="checkbox"
                          checked={profile.assignedTeamIds.includes(team.id)}
                          onChange={() => toggleCoachTeam(profile, team.id)}
                          className="h-4 w-4 accent-aggie-ice"
                        />
                        {team.name}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="card-surface rounded-lg p-6">
          <div className="flex items-center gap-3">
            <Mail className="h-6 w-6 text-aggie-ice" />
            <h2 className="text-2xl font-black text-white">Permission Rules</h2>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <RuleCard title="Admins" text="Can view and manage all data, admin invites, coaches, teams, modules, and program settings." />
            <RuleCard title="Coaches" text="Can view only assigned team data and assigned student-athletes. They cannot add admins, add coaches, or edit team assignments." />
            <RuleCard title="Student-Athletes" text="Can view only personal progress plus anonymous team and class rankings. They cannot access admin or coach settings." />
          </div>
        </section>

        <section className="card-surface rounded-lg p-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <CalendarDays className="h-6 w-6 text-aggie-ice" />
                <h2 className="text-2xl font-black text-white">Roadmap Advancement</h2>
              </div>
              <p className="mt-3 max-w-3xl leading-7 text-aggie-light/74">
                Roadmaps automatically advance on August 1 each year. Previous roadmap progress is preserved in roadmap history.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={previewUpcomingChanges}
                className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/10 bg-white/6 px-4 text-sm font-black text-white transition hover:border-aggie-ice/40 hover:bg-white/10"
              >
                Preview Upcoming Changes
              </button>
              <button
                type="button"
                onClick={runManualAdvancement}
                className="chrome-surface inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-aggie-chrome/60 px-4 text-sm font-black text-aggie-navy shadow-glow transition hover:brightness-110"
              >
                <Play className="h-4 w-4" />
                Run Advancement Manually
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-5 xl:grid-cols-[1fr_0.85fr]">
            <div className="overflow-x-auto rounded-lg border border-white/10">
              <table className="min-w-[900px] w-full text-left text-sm">
                <thead className="bg-white/6 text-xs uppercase tracking-[0.16em] text-aggie-silver">
                  <tr>
                    {["Student-Athlete", "Current Roadmap", "Next Roadmap", "Academic Year", "Status", "Exclude"].map((heading) => (
                      <th key={heading} className="px-3 py-3 font-black">{heading}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {advancementPreview.map((item) => {
                    const record = studentAthletes.find((athlete) => athlete.id === item.studentId);
                    return (
                      <tr key={item.studentId} className="border-t border-white/8 text-aggie-light">
                        <td className="px-3 py-4 font-black text-white">{item.name}</td>
                        <td className="px-3 py-4">{item.currentRoadmap}</td>
                        <td className="px-3 py-4">{item.nextRoadmap}</td>
                        <td className="px-3 py-4">{item.currentAcademicYear} -&gt; {item.nextAcademicYear}</td>
                        <td className="px-3 py-4">{item.reason}</td>
                        <td className="px-3 py-4">
                          <input
                            type="checkbox"
                            checked={record?.excludeFromAutoAdvancement ?? item.excluded}
                            onChange={(event) => toggleAdvancementExclusion(item.studentId, event.target.checked)}
                            className="h-4 w-4 accent-aggie-ice"
                            aria-label={`Exclude ${item.name} from automatic advancement`}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="space-y-5">
              <article className="rounded-lg border border-white/10 bg-white/6 p-4">
                <h3 className="text-lg font-black text-white">Override Individual Roadmap</h3>
                <div className="mt-4 grid gap-3">
                  <select
                    value={overrideStudentId}
                    onChange={(event) => setOverrideStudentId(event.target.value)}
                    className="min-h-12 rounded-lg border border-white/10 bg-aggie-navy px-4 text-white outline-none transition focus:border-aggie-ice"
                  >
                    <option value="">Select student-athlete</option>
                    {studentAthletes.map((record) => (
                      <option key={record.id} value={record.id}>{record.firstName} {record.lastName}</option>
                    ))}
                  </select>
                  <select
                    value={overrideRoadmap}
                    onChange={(event) => setOverrideRoadmap(event.target.value)}
                    className="min-h-12 rounded-lg border border-white/10 bg-aggie-navy px-4 text-white outline-none transition focus:border-aggie-ice"
                  >
                    {roadmapOptions.map((roadmap) => (
                      <option key={roadmap} value={roadmap}>{roadmap}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={applyRoadmapOverride}
                    className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/10 bg-white/6 px-4 text-sm font-black text-white transition hover:border-aggie-ice/40 hover:bg-white/10"
                  >
                    Save Override
                  </button>
                </div>
              </article>

              <article className="rounded-lg border border-white/10 bg-white/6 p-4">
                <h3 className="text-lg font-black text-white">Advancement History</h3>
                <div className="mt-4 space-y-3">
                  {advancementHistory.length ? advancementHistory.map((item) => (
                    <div key={item.id} className="rounded-lg border border-white/10 bg-black/15 p-3">
                      <p className="font-bold text-white">{item.summary}</p>
                      <p className="mt-1 text-xs font-semibold text-aggie-muted">{new Date(item.runAt).toLocaleString()} • {item.runBy}</p>
                    </div>
                  )) : (
                    <p className="text-sm font-semibold text-aggie-muted">No advancement runs recorded yet.</p>
                  )}
                </div>
              </article>
            </div>
          </div>
        </section>
      </div>
    </RoleGate>
  );
}

function TextInput({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return (
    <label className="block">
      <span className="text-sm font-black uppercase tracking-[0.16em] text-aggie-silver">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        type={type}
        className="mt-2 min-h-12 w-full rounded-lg border border-white/10 bg-white/8 px-4 text-white outline-none transition focus:border-aggie-ice"
      />
    </label>
  );
}

function TeamCheckboxes({ selected, onToggle }: { selected: string[]; onToggle: (teamId: string) => void }) {
  return (
    <div>
      <p className="text-sm font-black uppercase tracking-[0.16em] text-aggie-silver">Assigned team or teams</p>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {teams.map((team) => (
          <label key={team.id} className="flex cursor-pointer items-center gap-3 rounded-lg border border-white/10 bg-white/6 p-3 text-sm font-bold text-aggie-light">
            <input
              type="checkbox"
              checked={selected.includes(team.id)}
              onChange={() => onToggle(team.id)}
              className="h-4 w-4 accent-aggie-ice"
            />
            {team.name}
          </label>
        ))}
      </div>
    </div>
  );
}

function RuleCard({ title, text }: { title: string; text: string }) {
  return (
    <article className="rounded-lg border border-white/10 bg-white/6 p-4">
      <h3 className="text-lg font-black text-white">{title}</h3>
      <p className="mt-2 text-sm font-semibold leading-6 text-aggie-muted">{text}</p>
    </article>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-lg border border-white/10 bg-white/6 p-4">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-aggie-silver">{label}</p>
      <p className="mt-2 break-words text-lg font-black text-white">{value}</p>
    </article>
  );
}

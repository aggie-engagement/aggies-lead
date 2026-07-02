import type { UserRole } from "@/lib/permissions";

export type AccountStatus = "active" | "pending" | "removed";
export type InviteStatus = "pending" | "accepted" | "revoked";

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  teamIds: string[];
  title: string;
  status: AccountStatus;
  mustChangePassword: boolean;
  createdAt: string;
  updatedAt: string;
  password?: string;
  isTestAccount?: boolean;
  isSeedAccount?: boolean;
};

export type AdminInvite = {
  id: string;
  email: string;
  invitedBy: string;
  status: InviteStatus;
  createdAt: string;
  acceptedAt: string | null;
};

export type CoachProfile = {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  title: string;
  assignedTeamIds: string[];
  status: AccountStatus;
  mustChangePassword: boolean;
};

export type Team = {
  id: string;
  name: string;
};

export const accessStorageKeys = {
  users: "aggies-lead:managed-users",
  adminInvites: "aggies-lead:admin-invites",
  coachProfiles: "aggies-lead:coach-profiles",
};

export const teams: Team[] = [
  { id: "football", name: "Football" },
  { id: "womens-basketball", name: "Women's Basketball" },
  { id: "mens-basketball", name: "Men's Basketball" },
  { id: "volleyball", name: "Volleyball" },
  { id: "soccer", name: "Soccer" },
  { id: "track-field-cross-country", name: "Track & Field / Cross Country" },
  { id: "gymnastics", name: "Gymnastics" },
  { id: "softball", name: "Softball" },
  { id: "mens-tennis", name: "Men's Tennis" },
  { id: "womens-tennis", name: "Women's Tennis" },
];

const now = "2026-06-21T12:00:00.000Z";

export const seedUsers: User[] = [
  {
    id: "admin-001",
    firstName: "Aggies Lead",
    lastName: "Admin",
    email: "admin@aggieslead.local",
    role: "admin",
    teamIds: [],
    title: "Program Administrator",
    status: "active",
    mustChangePassword: false,
    password: "admin123",
    createdAt: now,
    updatedAt: now,
    isSeedAccount: true,
  },
  {
    id: "coach-001",
    firstName: "USU",
    lastName: "Coach",
    email: "coach@aggieslead.local",
    role: "coach",
    teamIds: ["womens-basketball"],
    title: "Head Coach",
    status: "active",
    mustChangePassword: false,
    password: "coach123",
    createdAt: now,
    updatedAt: now,
    isSeedAccount: true,
  },
  {
    id: "student-001",
    firstName: "Student",
    lastName: "Athlete",
    email: "student@aggieslead.local",
    role: "student-athlete",
    teamIds: ["womens-basketball"],
    title: "Student-Athlete",
    status: "active",
    mustChangePassword: false,
    password: "student123",
    createdAt: now,
    updatedAt: now,
    isSeedAccount: true,
  },
];

export const seedCoachProfiles: CoachProfile[] = [
  {
    id: "coach-profile-001",
    userId: "coach-001",
    firstName: "USU",
    lastName: "Coach",
    email: "coach@aggieslead.local",
    title: "Head Coach",
    assignedTeamIds: ["womens-basketball"],
    status: "active",
    mustChangePassword: false,
  },
];

export function teamName(teamId: string) {
  return teams.find((team) => team.id === teamId)?.name ?? teamId;
}

export function displayName(user: Pick<User, "firstName" | "lastName">) {
  return `${user.firstName} ${user.lastName}`.trim();
}

export function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  const saved = window.localStorage.getItem(key);
  if (!saved) return fallback;
  try {
    return JSON.parse(saved) as T;
  } catch {
    window.localStorage.removeItem(key);
    return fallback;
  }
}

export function writeJson<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function ensureAccessSeedData() {
  if (typeof window === "undefined") return;
  if (!window.localStorage.getItem(accessStorageKeys.users)) {
    writeJson(accessStorageKeys.users, seedUsers);
  }
  if (!window.localStorage.getItem(accessStorageKeys.adminInvites)) {
    writeJson<AdminInvite[]>(accessStorageKeys.adminInvites, []);
  }
  if (!window.localStorage.getItem(accessStorageKeys.coachProfiles)) {
    writeJson(accessStorageKeys.coachProfiles, seedCoachProfiles);
  }
}

export function canAccessTeam(user: Pick<User, "role" | "teamIds"> | null, teamId: string) {
  if (!user) return false;
  if (user.role === "admin") return true;
  if (user.role === "coach") return user.teamIds.includes(teamId);
  return false;
}

export function activeAdmins(users = readJson<User[]>(accessStorageKeys.users, seedUsers)) {
  return users.filter((user) => user.role === "admin" && user.status === "active");
}

export function activeUserCreatedAdmins(users = readJson<User[]>(accessStorageKeys.users, seedUsers)) {
  return activeAdmins(users).filter((user) => !user.isSeedAccount);
}

export function shouldShowFirstAdminSetup(users = readJson<User[]>(accessStorageKeys.users, seedUsers)) {
  return activeUserCreatedAdmins(users).length === 0;
}

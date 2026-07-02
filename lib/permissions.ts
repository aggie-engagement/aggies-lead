export const userRoles = ["admin", "coach", "student-athlete"] as const;

export type UserRole = (typeof userRoles)[number];

export type Permission =
  | "view:all-data"
  | "manage:all-data"
  | "view:team-data"
  | "view:assigned-student-athletes"
  | "view:own-progress"
  | "view:anonymous-rankings"
  | "manage:admins"
  | "manage:coaches"
  | "manage:teams";

export const rolePermissions: Record<UserRole, Permission[]> = {
  admin: ["view:all-data", "manage:all-data", "view:team-data", "view:assigned-student-athletes", "view:own-progress", "view:anonymous-rankings", "manage:admins", "manage:coaches", "manage:teams"],
  coach: ["view:team-data", "view:assigned-student-athletes"],
  "student-athlete": ["view:own-progress", "view:anonymous-rankings"],
};

export const roleDashboardHref: Record<UserRole, string> = {
  admin: "/admin-dashboard",
  coach: "/coach-dashboard",
  "student-athlete": "/student-athlete-dashboard",
};

export const roleLabels: Record<UserRole, string> = {
  admin: "Admin",
  coach: "Coach",
  "student-athlete": "Student-Athlete",
};

export function hasPermission(role: UserRole | null, permission: Permission) {
  if (!role) return false;
  return rolePermissions[role].includes(permission);
}

export function dashboardForRole(role: UserRole | null) {
  return role ? roleDashboardHref[role] : "/login";
}

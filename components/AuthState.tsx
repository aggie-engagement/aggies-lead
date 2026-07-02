"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { UserRole } from "@/lib/permissions";
import { dashboardForRole } from "@/lib/permissions";
import {
  accessStorageKeys,
  displayName,
  ensureAccessSeedData,
  readJson,
  seedUsers,
  writeJson,
} from "@/lib/accessManagement";
import type { User } from "@/lib/accessManagement";
import { runAutomaticAdvancementIfDue } from "@/lib/roadmapAdvancement";
import { readStudentAthletes } from "@/lib/studentAthleteDatabase";

export type AuthUser = User & {
  name: string;
  team?: string;
};

type AuthState = {
  user: AuthUser | null;
  role: UserRole | null;
  isReady: boolean;
  loginAs: (role: UserRole) => string;
  loginWithCredentials: (email: string, password: string) => { ok: boolean; href?: string; message?: string };
  changePassword: (newPassword: string) => string;
  refreshUser: () => void;
  logout: () => void;
};

const storageKey = "aggies-lead:auth-user";

function toAuthUser(user: User): AuthUser {
  return {
    ...user,
    name: displayName(user),
    team: user.teamIds[0],
  };
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  const persistUser = (nextUser: User | null) => {
    if (!nextUser) {
      setUser(null);
      window.localStorage.removeItem(storageKey);
      return;
    }
    const authUser = toAuthUser(nextUser);
    setUser(authUser);
    window.localStorage.setItem(storageKey, JSON.stringify(authUser));
  };

  const refreshUser = () => {
    if (!user) return;
    const users = readJson<User[]>(accessStorageKeys.users, seedUsers);
    const latest = users.find((item) => item.id === user.id && item.status === "active");
    persistUser(latest ?? null);
  };

  useEffect(() => {
    ensureAccessSeedData();
    runAutomaticAdvancementIfDue();
    const saved = window.localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as AuthUser;
        const users = readJson<User[]>(accessStorageKeys.users, seedUsers);
        const latest = users.find((item) => item.id === parsed.id && item.status === "active");
        setUser(latest ? toAuthUser(latest) : null);
      } catch {
        window.localStorage.removeItem(storageKey);
      }
    }
    setIsReady(true);
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      user,
      role: user?.role ?? null,
      isReady,
      loginAs: (role) => {
        ensureAccessSeedData();
        const users = readJson<User[]>(accessStorageKeys.users, seedUsers);
        const nextUser = users.find((item) => item.role === role && item.status === "active") ?? seedUsers.find((item) => item.role === role);
        if (!nextUser) return "/login";
        persistUser(nextUser);
        return nextUser.mustChangePassword ? "/change-password" : dashboardForRole(role);
      },
      loginWithCredentials: (email, password) => {
        ensureAccessSeedData();
        const users = readJson<User[]>(accessStorageKeys.users, seedUsers);
        const nextUser = users.find((item) => item.email.toLowerCase() === email.trim().toLowerCase() && item.status === "active");
        if (!nextUser || nextUser.password !== password) {
          return { ok: false, message: "No active account found with that email and password." };
        }
        persistUser(nextUser);
        const studentRecord = nextUser.role === "student-athlete"
          ? readStudentAthletes().find((record) => record.userId === nextUser.id || record.email.toLowerCase() === nextUser.email.toLowerCase())
          : null;
        return {
          ok: true,
          href: nextUser.mustChangePassword
            ? "/change-password"
            : nextUser.role === "student-athlete" && studentRecord?.profileStatus !== "Active" && studentRecord?.profileStatus !== "Active - TEST ACCOUNT"
              ? "/complete-profile"
              : dashboardForRole(nextUser.role),
        };
      },
      changePassword: (newPassword) => {
        if (!user) return "/login";
        const users = readJson<User[]>(accessStorageKeys.users, seedUsers);
        const updatedUsers = users.map((item) =>
          item.id === user.id
            ? {
                ...item,
                password: newPassword,
                mustChangePassword: false,
                updatedAt: new Date().toISOString(),
              }
            : item,
        );
        writeJson(accessStorageKeys.users, updatedUsers);
        const updatedUser = updatedUsers.find((item) => item.id === user.id);
        if (updatedUser) persistUser(updatedUser);
        const studentRecord = updatedUser?.role === "student-athlete"
          ? readStudentAthletes().find((record) => record.userId === updatedUser.id || record.email.toLowerCase() === updatedUser.email.toLowerCase())
          : null;
        if (updatedUser?.role === "student-athlete" && studentRecord?.profileStatus !== "Active" && studentRecord?.profileStatus !== "Active - TEST ACCOUNT") {
          return "/complete-profile";
        }
        return dashboardForRole(user.role);
      },
      refreshUser,
      logout: () => persistUser(null),
    }),
    [isReady, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}

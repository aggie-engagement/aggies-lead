"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/AuthState";
import { readStudentAthletes, writeStudentAthletes } from "@/lib/studentAthleteDatabase";
import {
  calculateEngagementScore,
  completedModulesStorageKeyBase,
  writeCompletedModulesForStudent,
} from "@/lib/engagement";

type PrototypeState = {
  onboardingComplete: boolean;
  helperHelperComplete: boolean;
  linkedInComplete: boolean;
  socialMediaComplete: boolean;
  completedModules: string[];
  completeOnboarding: () => void;
  completeHelperHelper: () => void;
  completeLinkedIn: () => void;
  completeSocialMedia: () => void;
  completeModule: (slug: string) => void;
  resetModuleCompletion: (slug: string) => void;
};

const PrototypeContext = createContext<PrototypeState | null>(null);
const moduleTotalForPrototype = 10;

export function PrototypeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [helperHelperComplete, setHelperHelperComplete] = useState(false);
  const [linkedInComplete, setLinkedInComplete] = useState(false);
  const [socialMediaComplete, setSocialMediaComplete] = useState(false);
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const completedModulesStorageKey = user ? `${completedModulesStorageKeyBase}:${user.id}` : completedModulesStorageKeyBase;

  useEffect(() => {
    const saved = window.localStorage.getItem(completedModulesStorageKey);
    if (!saved) {
      setCompletedModules([]);
      return;
    }
    if (saved) {
      try {
        setCompletedModules(JSON.parse(saved) as string[]);
      } catch {
        window.localStorage.removeItem(completedModulesStorageKey);
        setCompletedModules([]);
      }
    }
  }, [completedModulesStorageKey]);

  const syncStudentProgress = (nextCompletedModules: string[]) => {
    if (!user || user.role !== "student-athlete") return;
    const records = readStudentAthletes();
    const completionPercentage = Math.min(Math.round((nextCompletedModules.length / moduleTotalForPrototype) * 100), 100);
    const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    writeStudentAthletes(
      records.map((record) =>
        record.userId === user.id || record.email === user.email
          ? (() => {
              writeCompletedModulesForStudent(record, nextCompletedModules);
              return {
                ...record,
                completionPercentage,
                engagementScore: calculateEngagementScore(record, undefined, nextCompletedModules),
                lastActiveDate: today,
                roadmapHistorySummary: nextCompletedModules.length
                  ? `${record.currentRoadmap}: ${completionPercentage}% (${nextCompletedModules.length} completed modules)`
                  : "",
              };
            })()
          : record,
      ),
    );
  };

  const updateCompletedModules = (updater: (current: string[]) => string[]) => {
    setCompletedModules((current) => {
      const next = updater(current);
      window.localStorage.setItem(completedModulesStorageKey, JSON.stringify(next));
      syncStudentProgress(next);
      return next;
    });
  };

  const value = useMemo<PrototypeState>(
    () => ({
      onboardingComplete,
      helperHelperComplete,
      linkedInComplete,
      socialMediaComplete,
      completedModules,
      completeOnboarding: () => setOnboardingComplete(true),
      completeHelperHelper: () => setHelperHelperComplete(true),
      completeLinkedIn: () => setLinkedInComplete(true),
      completeSocialMedia: () => setSocialMediaComplete(true),
      completeModule: (slug) =>
        updateCompletedModules((current) =>
          current.includes(slug) ? current : [...current, slug],
        ),
      resetModuleCompletion: (slug) =>
        updateCompletedModules((current) => current.filter((item) => item !== slug)),
    }),
    [
      completedModules,
      helperHelperComplete,
      linkedInComplete,
      onboardingComplete,
      socialMediaComplete,
      user,
    ],
  );

  return <PrototypeContext.Provider value={value}>{children}</PrototypeContext.Provider>;
}

export function usePrototypeState() {
  const value = useContext(PrototypeContext);
  if (!value) throw new Error("usePrototypeState must be used inside PrototypeProvider");
  return value;
}

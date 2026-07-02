"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ClipboardCheck } from "lucide-react";
import { RoleGate } from "@/components/RoleGate";
import { useAuth } from "@/components/AuthState";
import {
  accessStorageKeys,
  readJson,
  seedUsers,
  teams,
  writeJson,
} from "@/lib/accessManagement";
import type { User } from "@/lib/accessManagement";
import {
  classYearOptions,
  readStudentAthletes,
  roadmapForClassYear,
  writeStudentAthletes,
} from "@/lib/studentAthleteDatabase";
import type { StudentAthleteRecord } from "@/lib/studentAthleteDatabase";

type ProfileForm = Pick<
  StudentAthleteRecord,
  | "preferredName"
  | "phone"
  | "sport"
  | "team"
  | "classYear"
  | "academicYear"
  | "entryYear"
  | "expectedGraduationYear"
  | "currentRoadmap"
  | "major"
  | "minor"
  | "transferStatus"
  | "careerInterests"
  | "linkedInUrl"
>;

const emptyForm: ProfileForm = {
  preferredName: "",
  phone: "",
  sport: "",
  team: "",
  classYear: "",
  academicYear: "",
  entryYear: "",
  expectedGraduationYear: "",
  currentRoadmap: "",
  major: "",
  minor: "",
  transferStatus: "",
  careerInterests: "",
  linkedInUrl: "",
};

const requiredFields: (keyof ProfileForm)[] = [
  "phone",
  "sport",
  "team",
  "classYear",
  "academicYear",
  "entryYear",
  "expectedGraduationYear",
  "currentRoadmap",
];

export default function CompleteProfilePage() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const [record, setRecord] = useState<StudentAthleteRecord | null>(null);
  const [form, setForm] = useState<ProfileForm>(emptyForm);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user) return;
    const found = readStudentAthletes().find(
      (item) => item.userId === user.id || item.email.toLowerCase() === user.email.toLowerCase(),
    );
    if (!found) return;
    setRecord(found);
    setForm({
      preferredName: found.preferredName,
      phone: found.phone,
      sport: found.sport,
      team: found.team,
      classYear: found.classYear,
      academicYear: found.academicYear,
      entryYear: found.entryYear,
      expectedGraduationYear: found.expectedGraduationYear,
      currentRoadmap: found.currentRoadmap,
      major: found.major,
      minor: found.minor,
      transferStatus: found.transferStatus,
      careerInterests: found.careerInterests,
      linkedInUrl: found.linkedInUrl,
    });
  }, [user]);

  const roadmapOptions = useMemo(
    () => Array.from(new Set(classYearOptions.map(roadmapForClassYear).filter(Boolean))),
    [],
  );

  const updateClassYear = (classYear: string) => {
    setForm((current) => ({
      ...current,
      classYear,
      currentRoadmap: roadmapForClassYear(classYear) || current.currentRoadmap,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user || !record) {
      setMessage("We could not find your student-athlete profile. Please contact Aggies Lead.");
      return;
    }
    if (user.mustChangePassword) {
      router.push("/change-password");
      return;
    }
    const missing = requiredFields.filter((field) => !form[field].trim());
    if (missing.length) {
      setMessage("Complete all required fields before continuing.");
      return;
    }
    if (!teams.some((team) => team.name === form.team)) {
      setMessage("Choose a valid team from the list.");
      return;
    }
    if (!classYearOptions.includes(form.classYear)) {
      setMessage("Choose a valid class year.");
      return;
    }

    const today = new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    const allRecords = readStudentAthletes();
    const updatedRecords = allRecords.map((item) =>
      item.id === record.id
        ? {
            ...item,
            ...form,
            userId: user.id,
            accountStatus: "Activated" as const,
            profileStatus: "Active" as const,
            joinedAggiesLeadDate: item.joinedAggiesLeadDate || today,
            lastActiveDate: today,
            roadmapStartDate: item.roadmapStartDate || today,
            roadmapHistorySummary: form.currentRoadmap ? `${form.currentRoadmap}: ${item.completionPercentage}%` : item.roadmapHistorySummary,
          }
        : item,
    );
    writeStudentAthletes(updatedRecords);

    const selectedTeam = teams.find((team) => team.name === form.team);
    const users = readJson<User[]>(accessStorageKeys.users, seedUsers);
    writeJson(
      accessStorageKeys.users,
      users.map((item) =>
        item.id === user.id
          ? {
              ...item,
              teamIds: selectedTeam ? [selectedTeam.id] : item.teamIds,
              updatedAt: new Date().toISOString(),
            }
          : item,
      ),
    );
    window.localStorage.setItem(`aggies-lead:first-login-walkthrough:${user.id}`, "pending");
    refreshUser();
    router.push("/student-athlete-dashboard");
  };

  return (
    <RoleGate allowed={["student-athlete"]}>
      <div className="mx-auto max-w-5xl space-y-8">
        <section className="card-surface rounded-lg p-7">
          <div className="flex items-center gap-3">
            <ClipboardCheck className="h-7 w-7 text-aggie-ice" />
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-aggie-silver">Profile Setup</p>
          </div>
          <h1 className="text-glow mt-3 text-4xl font-black tracking-tight text-white md:text-5xl">
            Complete Your Student-Athlete Profile
          </h1>
          <p className="mt-4 max-w-3xl leading-7 text-aggie-light/76">
            Finish these details before entering your dashboard. This connects your account to the correct team, roadmap, and Aggies Lead progress tracking.
          </p>
        </section>

        <form onSubmit={handleSubmit} className="card-surface rounded-lg p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <FormInput label="Preferred Name" value={form.preferredName} onChange={(value) => setForm({ ...form, preferredName: value })} />
            <FormInput label="Phone Number" value={form.phone} required onChange={(value) => setForm({ ...form, phone: value })} />
            <FormInput label="Sport" value={form.sport} required onChange={(value) => setForm({ ...form, sport: value })} />
            <SelectInput label="Team" value={form.team} required options={teams.map((team) => team.name)} onChange={(value) => setForm({ ...form, team: value })} />
            <SelectInput label="Class Year" value={form.classYear} required options={classYearOptions} onChange={updateClassYear} />
            <FormInput label="Academic Year" value={form.academicYear} required placeholder="2026-2027" onChange={(value) => setForm({ ...form, academicYear: value })} />
            <FormInput label="Entry Year" value={form.entryYear} required placeholder="2026" onChange={(value) => setForm({ ...form, entryYear: value })} />
            <FormInput label="Expected Graduation Year" value={form.expectedGraduationYear} required placeholder="2030" onChange={(value) => setForm({ ...form, expectedGraduationYear: value })} />
            <SelectInput label="Current Roadmap" value={form.currentRoadmap} required options={roadmapOptions} onChange={(value) => setForm({ ...form, currentRoadmap: value })} />
            <FormInput label="Major" value={form.major} onChange={(value) => setForm({ ...form, major: value })} />
            <FormInput label="Minor" value={form.minor} onChange={(value) => setForm({ ...form, minor: value })} />
            <FormInput label="Transfer Status" value={form.transferStatus} placeholder="Transfer or Non-Transfer" onChange={(value) => setForm({ ...form, transferStatus: value })} />
            <FormInput label="LinkedIn URL" value={form.linkedInUrl} onChange={(value) => setForm({ ...form, linkedInUrl: value })} />
          </div>
          <label className="mt-4 block">
            <span className="text-sm font-black uppercase tracking-[0.16em] text-aggie-silver">Career Interests</span>
            <textarea
              value={form.careerInterests}
              onChange={(event) => setForm({ ...form, careerInterests: event.target.value })}
              className="mt-2 min-h-28 w-full rounded-lg border border-white/10 bg-white/8 px-4 py-3 text-white outline-none transition focus:border-aggie-ice"
            />
          </label>
          <button
            type="submit"
            className="chrome-surface mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-lg border border-aggie-chrome/60 px-5 text-sm font-black text-aggie-navy shadow-glow transition hover:brightness-110 md:w-auto"
          >
            Complete Profile and Continue
          </button>
          {message ? (
            <p className="mt-4 rounded-lg border border-red-300/25 bg-red-300/10 p-4 text-sm font-bold text-aggie-light">
              {message}
            </p>
          ) : null}
        </form>
      </div>
    </RoleGate>
  );
}

function FormInput({
  label,
  value,
  onChange,
  placeholder = "",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm font-black uppercase tracking-[0.16em] text-aggie-silver">
        {label}{required ? " *" : ""}
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 min-h-12 w-full rounded-lg border border-white/10 bg-white/8 px-4 text-white outline-none transition focus:border-aggie-ice"
      />
    </label>
  );
}

function SelectInput({
  label,
  value,
  options,
  onChange,
  required = false,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm font-black uppercase tracking-[0.16em] text-aggie-silver">
        {label}{required ? " *" : ""}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 min-h-12 w-full rounded-lg border border-white/10 bg-aggie-navy px-4 text-white outline-none transition focus:border-aggie-ice"
      >
        <option value="">Select...</option>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

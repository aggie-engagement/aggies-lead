"use client";

import { useEffect, useState } from "react";
import { Mail, Phone, Route, Save, UserRound } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { useAuth } from "@/components/AuthState";
import { readStudentAthletes, writeStudentAthletes } from "@/lib/studentAthleteDatabase";
import type { StudentAthleteRecord } from "@/lib/studentAthleteDatabase";

export default function ProfilePage() {
  const { user, role } = useAuth();
  const [record, setRecord] = useState<StudentAthleteRecord | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user || role !== "student-athlete") return;
    const records = readStudentAthletes();
    setRecord(records.find((item) => item.userId === user.id || item.email === user.email) ?? null);
  }, [role, user]);

  const updateField = (field: keyof Pick<StudentAthleteRecord, "preferredName" | "phone" | "major" | "minor" | "careerInterests" | "linkedInUrl">, value: string) => {
    if (!record) return;
    setRecord({ ...record, [field]: value });
  };

  const saveProfile = () => {
    if (!record) return;
    const records = readStudentAthletes();
    writeStudentAthletes(records.map((item) => item.id === record.id ? record : item));
    setMessage("Your basic profile information was saved.");
  };

  return (
    <div>
      <PageHeader
        eyebrow="Profile"
        title="Profile and roadmap settings"
        description="Student-athletes can update basic profile information here. Progress, engagement, roadmap history, and admin tracking fields are managed by Aggies Lead staff."
      />
      {role === "student-athlete" && record ? (
        <section className="grid gap-5 lg:grid-cols-[1fr_0.85fr]">
          <article className="card-surface rounded-lg p-6">
            <UserRound className="h-8 w-8 text-aggie-ice" />
            <h2 className="mt-5 text-2xl font-black text-white">My Basic Profile</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <ReadOnly label="Name" value={`${record.firstName} ${record.lastName}`} />
              <ReadOnly label="Email" value={record.email} />
              <ReadOnly label="Team" value={record.team} />
              <ReadOnly label="Class Year" value={record.classYear} />
              <Editable label="Preferred Name" value={record.preferredName} onChange={(value) => updateField("preferredName", value)} />
              <Editable label="Phone" value={record.phone} onChange={(value) => updateField("phone", value)} />
              <Editable label="Major" value={record.major} onChange={(value) => updateField("major", value)} />
              <Editable label="Minor" value={record.minor} onChange={(value) => updateField("minor", value)} />
              <Editable label="LinkedIn URL" value={record.linkedInUrl} onChange={(value) => updateField("linkedInUrl", value)} />
            </div>
            <label className="mt-4 block">
              <span className="text-sm font-black uppercase tracking-[0.16em] text-aggie-silver">Career Interests</span>
              <textarea
                value={record.careerInterests}
                onChange={(event) => updateField("careerInterests", event.target.value)}
                className="mt-2 min-h-24 w-full rounded-lg border border-white/10 bg-white/8 px-4 py-3 text-white outline-none transition focus:border-aggie-ice"
              />
            </label>
            <button
              type="button"
              onClick={saveProfile}
              className="chrome-surface mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-aggie-chrome/60 px-5 text-sm font-black text-aggie-navy shadow-glow transition hover:brightness-110"
            >
              <Save className="h-4 w-4" />
              Save Basic Profile
            </button>
            {message ? <p className="mt-4 rounded-lg border border-aggie-ice/30 bg-aggie-ice/10 p-4 text-sm font-bold text-aggie-light">{message}</p> : null}
          </article>
          <article className="card-surface rounded-lg p-6">
            <Route className="h-8 w-8 text-aggie-ice" />
            <h2 className="mt-5 text-2xl font-black text-white">Roadmap Assignment</h2>
            <p className="mt-3 leading-7 text-aggie-light/74">{record.currentRoadmap}</p>
            <p className="mt-2 leading-7 text-aggie-light/74">Completion: {record.completionPercentage}%</p>
            <p className="mt-2 leading-7 text-aggie-light/74">Engagement Score: {record.engagementScore}</p>
            <p className="mt-4 rounded-lg border border-white/10 bg-white/6 p-4 text-sm font-bold leading-6 text-aggie-muted">
              These progress and ranking fields are read-only for student-athletes.
            </p>
          </article>
        </section>
      ) : (
        <section className="grid gap-5 lg:grid-cols-[1fr_0.85fr]">
          <article className="card-surface rounded-lg p-6">
            <UserRound className="h-8 w-8 text-aggie-ice" />
            <h2 className="mt-5 text-2xl font-black text-white">View/Edit Profile Information</h2>
            <p className="mt-3 leading-7 text-aggie-light/74">Log in as a student-athlete to edit basic profile information.</p>
          </article>
          <article className="card-surface rounded-lg p-6">
            <Route className="h-8 w-8 text-aggie-ice" />
            <h2 className="mt-5 text-2xl font-black text-white">Roadmap Assignment</h2>
            <p className="mt-3 leading-7 text-aggie-light/74">Roadmap details appear after student-athlete login.</p>
          </article>
        </section>
      )}
      <section className="mt-5 grid gap-5 md:grid-cols-2">
        <article className="card-surface rounded-lg p-6">
          <Phone className="h-7 w-7 text-aggie-ice" />
          <h2 className="mt-4 text-xl font-black text-white">Contact Info</h2>
          <p className="mt-2 text-aggie-muted">{record?.phone || "Phone not added"}</p>
        </article>
        <article className="card-surface rounded-lg p-6">
          <Mail className="h-7 w-7 text-aggie-ice" />
          <h2 className="mt-4 text-xl font-black text-white">Email</h2>
          <p className="mt-2 text-aggie-muted">{record?.email || user?.email || "No account email"}</p>
        </article>
      </section>
    </div>
  );
}

function ReadOnly({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/6 p-4">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-aggie-silver">{label}</p>
      <p className="mt-2 font-bold text-aggie-light">{value || "Not added"}</p>
    </div>
  );
}

function Editable({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="text-sm font-black uppercase tracking-[0.16em] text-aggie-silver">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 min-h-12 w-full rounded-lg border border-white/10 bg-white/8 px-4 text-white outline-none transition focus:border-aggie-ice"
      />
    </label>
  );
}

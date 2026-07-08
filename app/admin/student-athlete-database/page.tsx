"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Download,
  FileDown,
  FileSpreadsheet,
  Search,
  Upload,
  UserPlus,
} from "lucide-react";
import { RoleGate } from "@/components/RoleGate";
import {
  accessStorageKeys,
  readJson,
  seedUsers,
  writeJson,
} from "@/lib/accessManagement";
import type { User } from "@/lib/accessManagement";
import {
  databaseExportColumns,
  formatRoadmapHistory,
  previousRoadmapCompletion,
  readStudentAthletes,
  studentAthleteTemplateColumns,
  writeStudentAthletes,
} from "@/lib/studentAthleteDatabase";
import type { StudentAthleteRecord } from "@/lib/studentAthleteDatabase";
import { queuePlaceholderEmail } from "@/lib/emailService";

type StudentForm = Pick<
  StudentAthleteRecord,
  | "firstName"
  | "lastName"
  | "email"
>;

const emptyForm: StudentForm = {
  firstName: "",
  lastName: "",
  email: "",
};

const requiredFields: (keyof StudentForm)[] = [
  "firstName",
  "lastName",
  "email",
];

const temporaryStudentPassword = "aggieslead";

async function getSupabaseClient() {
  const { supabase } = await import("@/lib/supabase");
  return supabase;
}

export default function StudentAthleteDatabasePage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [records, setRecords] = useState<StudentAthleteRecord[]>([]);
  const [form, setForm] = useState<StudentForm>(emptyForm);
  const [search, setSearch] = useState("");
  const [accountStatusFilter, setAccountStatusFilter] = useState("All");
  const [profileStatusFilter, setProfileStatusFilter] = useState("All");
  const [roadmapFilter, setRoadmapFilter] = useState("All");
  const [includeTestData, setIncludeTestData] = useState(false);
  const [importMessage, setImportMessage] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setRecords(readStudentAthletes());
  }, []);

  const filteredRecords = useMemo(() => {
    const query = search.trim().toLowerCase();
    return records.filter((record) => {
      const matchesSearch = !query || [record.firstName, record.lastName, record.email, record.team, record.sport, record.classYear, record.currentRoadmap]
        .join(" ")
        .toLowerCase()
        .includes(query);
      const matchesAccountStatus = accountStatusFilter === "All" || record.accountStatus === accountStatusFilter;
      const matchesProfileStatus = profileStatusFilter === "All" || record.profileStatus === profileStatusFilter;
      const matchesRoadmap = roadmapFilter === "All" || record.currentRoadmap === roadmapFilter;
      return matchesSearch && matchesAccountStatus && matchesProfileStatus && matchesRoadmap;
    });
  }, [accountStatusFilter, profileStatusFilter, records, roadmapFilter, search]);
  const roadmapOptions = useMemo(() => ["All", ...Array.from(new Set(records.map((record) => record.currentRoadmap).filter(Boolean))).sort()], [records]);

  const saveRecords = (nextRecords: StudentAthleteRecord[]) => {
    setRecords(nextRecords);
    writeStudentAthletes(nextRecords);
  };

  const addStudentAthlete = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const missing = requiredFields.filter((field) => !form[field].trim());
    if (missing.length) {
      setMessage("Complete all required fields before adding a student-athlete.");
      return;
    }
    if (records.some((record) => record.email.toLowerCase() === form.email.trim().toLowerCase())) {
      setMessage("A student-athlete with that email already exists.");
      return;
    }
    const users = readJson<User[]>(accessStorageKeys.users, seedUsers);
    if (users.some((user) => user.email.toLowerCase() === form.email.trim().toLowerCase() && user.status !== "removed")) {
      setMessage("A user account with that email already exists.");
      return;
    }
    const supabase = await getSupabaseClient();
    const { error: inviteError } = await supabase.rpc("create_student_activation_invite", {
      p_email: form.email.trim().toLowerCase(),
      p_first_name: form.firstName.trim(),
      p_last_name: form.lastName.trim(),
    });
    const timestamp = new Date().toISOString();
    const userId = `student-${Date.now()}`;
    const nextRecord: StudentAthleteRecord = {
      id: `student-record-${Date.now()}`,
      userId,
      ...form,
      email: form.email.trim().toLowerCase(),
      preferredName: "",
      phone: "",
      sport: "",
      team: "",
      classYear: "",
      academicYear: "",
      major: "",
      minor: "",
      expectedGraduationYear: "",
      entryYear: "",
      transferStatus: "",
      currentRoadmap: "",
      roadmapStartDate: "",
      roadmapCompletedDate: "",
      careerInterests: "",
      linkedInUrl: "",
      joinedAggiesLeadDate: "",
      profileStatus: "Incomplete",
      accountStatus: "Pending Activation",
      completionPercentage: 0,
      engagementScore: 0,
      internshipStatus: "Not Started",
      jobShadowStatus: "Not Started",
      lastActiveDate: "Not active yet",
      roadmapHistorySummary: "",
      roadmapHistory: [],
      eventAttendanceHistory: [],
      staffNotes: [],
      excludeFromAutoAdvancement: false,
      isTestAccount: false,
    };
    const nextUser: User = {
      id: userId,
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: nextRecord.email,
      role: "student-athlete",
      teamIds: [],
      title: "Student-Athlete",
      status: "active",
      mustChangePassword: true,
      password: temporaryStudentPassword,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    writeJson(accessStorageKeys.users, [nextUser, ...users]);
    saveRecords([nextRecord, ...records]);
    queuePlaceholderEmail("accountActivation", nextRecord.email, {
      firstName: nextRecord.firstName,
      email: nextRecord.email,
      temporaryPassword: temporaryStudentPassword,
      loginLink: `${window.location.origin}/login`,
    });
    setForm(emptyForm);
    setMessage(
      inviteError
        ? `Student-athlete added locally with account status Pending Activation, but Supabase activation invite failed: ${inviteError.message}`
        : "Student-athlete added with account status Pending Activation. Supabase activation invite created and placeholder activation email queued.",
    );
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const extension = file.name.split(".").pop()?.toLowerCase();
    if (extension !== "csv" && extension !== "xls" && extension !== "xlsx") {
      setImportMessage("Upload a CSV, XLS, or XLSX file.");
      return;
    }

    if (extension === "csv") {
      const text = await file.text();
      const users = readJson<User[]>(accessStorageKeys.users, seedUsers);
      const existingEmails = new Set([
        ...records.map((record) => record.email.toLowerCase()),
        ...users.filter((user) => user.status !== "removed").map((user) => user.email.toLowerCase()),
      ]);
      const seenImportEmails = new Set<string>();
      const imported = parseCsv(text).filter((record) => {
        const normalizedEmail = record.email.toLowerCase();
        if (existingEmails.has(normalizedEmail) || seenImportEmails.has(normalizedEmail)) return false;
        seenImportEmails.add(normalizedEmail);
        return true;
      });
      if (!imported.length) {
        setImportMessage("No new student-athletes were found in that CSV, or all emails already exist.");
        return;
      }
      const importedUsers = imported.map(createPendingStudentUser);
      saveRecords([...imported, ...records]);
      writeJson(accessStorageKeys.users, [...importedUsers, ...users]);
      imported.forEach((record) => {
        queuePlaceholderEmail("accountActivation", record.email, {
          firstName: record.firstName,
          email: record.email,
          temporaryPassword: temporaryStudentPassword,
          loginLink: `${window.location.origin}/login`,
        });
      });
      setImportMessage(`${imported.length} student-athlete record${imported.length === 1 ? "" : "s"} imported from CSV.`);
      return;
    }

    const sampleImport = createRecordFromRow({
      "First Name": "Imported",
      "Last Name": "Excel Student",
      Email: `excel.import.${Date.now()}@usu.edu`,
      Sport: "TBD",
      Team: "TBD",
      "Class Year": "TBD",
      "Current Roadmap": "TBD",
      "Entry Year": "TBD",
      "Expected Graduation Year": "TBD",
    });
    if (records.some((record) => record.email.toLowerCase() === sampleImport.email.toLowerCase())) {
      setImportMessage("Excel placeholder row already exists by email.");
      return;
    }
    const users = readJson<User[]>(accessStorageKeys.users, seedUsers);
    if (users.some((user) => user.email.toLowerCase() === sampleImport.email.toLowerCase() && user.status !== "removed")) {
      setImportMessage("Excel placeholder user already exists by email.");
      return;
    }
    saveRecords([sampleImport, ...records]);
    writeJson(accessStorageKeys.users, [createPendingStudentUser(sampleImport), ...users]);
    queuePlaceholderEmail("accountActivation", sampleImport.email, {
      firstName: sampleImport.firstName,
      email: sampleImport.email,
      temporaryPassword: temporaryStudentPassword,
      loginLink: `${window.location.origin}/login`,
    });
    setImportMessage("Excel file accepted. Local prototype added one placeholder parsed row; connect a spreadsheet parser later for full XLSX extraction.");
  };

  const downloadTemplate = () => {
    downloadTextFile("aggies-lead-student-athlete-import-template.csv", `${studentAthleteTemplateColumns.join(",")}\n`);
  };

  const exportCsv = () => {
    downloadTextFile("aggies-lead-student-athletes.csv", toCsv(includeTestData ? records : records.filter((record) => !record.isTestAccount)));
  };

  const exportExcel = () => {
    const exportRecords = includeTestData ? records : records.filter((record) => !record.isTestAccount);
    const html = `<!doctype html><html><head><meta charset="utf-8" /></head><body>${toHtmlTable(exportRecords)}</body></html>`;
    downloadTextFile("aggies-lead-student-athletes.xls", html, "application/vnd.ms-excel");
  };

  return (
    <RoleGate allowed={["admin"]}>
      <div className="space-y-8">
        <section className="card-surface rounded-lg p-7">
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-aggie-silver">Admin Only</p>
          <h1 className="text-glow mt-3 text-4xl font-black tracking-tight text-white md:text-6xl">
            Student-Athlete Database
          </h1>
          <p className="mt-4 max-w-4xl text-lg leading-8 text-aggie-light/78">
            Add student-athletes manually, import records from a spreadsheet, and export full admin database data.
          </p>
        </section>

        {message ? (
          <p className="rounded-lg border border-aggie-ice/30 bg-aggie-ice/10 p-4 text-sm font-bold text-aggie-light">
            {message}
          </p>
        ) : null}

        <section className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
          <article className="card-surface rounded-lg p-6">
            <div className="flex items-center gap-3">
              <UserPlus className="h-6 w-6 text-aggie-ice" />
              <h2 className="text-2xl font-black text-white">Add Student-Athlete</h2>
            </div>
            <form onSubmit={addStudentAthlete} className="mt-5 grid gap-4">
              <p className="rounded-lg border border-white/10 bg-white/6 p-4 text-sm font-semibold leading-6 text-aggie-muted">
                Add the athlete from the roster with only their name and school email. They will log in with the temporary password <span className="font-black text-white">aggieslead</span>, change it, and complete the rest of their profile.
              </p>
              <div className="grid gap-4 md:grid-cols-3">
                <FormInput label="First Name" value={form.firstName} required onChange={(value) => setForm({ ...form, firstName: value })} />
                <FormInput label="Last Name" value={form.lastName} required onChange={(value) => setForm({ ...form, lastName: value })} />
                <FormInput label="School Email" value={form.email} required type="email" onChange={(value) => setForm({ ...form, email: value })} />
              </div>
              <button
                type="submit"
                className="chrome-surface inline-flex min-h-12 items-center justify-center rounded-lg border border-aggie-chrome/60 px-5 text-sm font-black text-aggie-navy shadow-glow transition hover:brightness-110"
              >
                Add Student-Athlete
              </button>
            </form>
          </article>

          <div className="space-y-5">
            <article className="card-surface rounded-lg p-6">
              <div className="flex items-center gap-3">
                <Upload className="h-6 w-6 text-aggie-ice" />
                <h2 className="text-2xl font-black text-white">Import Student-Athletes</h2>
              </div>
              <p className="mt-3 leading-7 text-aggie-light/74">
                Upload a CSV or Excel spreadsheet with student-athlete information. CSV rows are parsed locally; Excel upload is accepted as prototype placeholder logic.
              </p>
              <input ref={fileInputRef} type="file" accept=".csv,.xls,.xlsx" className="hidden" onChange={handleImport} />
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/6 px-4 text-sm font-black text-white transition hover:border-aggie-ice/40 hover:bg-white/10"
                >
                  <FileSpreadsheet className="h-4 w-4 text-aggie-ice" />
                  Upload CSV or Excel
                </button>
                <button
                  type="button"
                  onClick={downloadTemplate}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/6 px-4 text-sm font-black text-white transition hover:border-aggie-ice/40 hover:bg-white/10"
                >
                  <Download className="h-4 w-4 text-aggie-ice" />
                  Download Sample Template
                </button>
              </div>
              {importMessage ? (
                <p className="mt-4 rounded-lg border border-aggie-ice/30 bg-aggie-ice/10 p-4 text-sm font-bold text-aggie-light">
                  {importMessage}
                </p>
              ) : null}
            </article>

            <article className="card-surface rounded-lg p-6">
              <div className="flex items-center gap-3">
                <FileDown className="h-6 w-6 text-aggie-ice" />
                <h2 className="text-2xl font-black text-white">Export Student-Athletes</h2>
              </div>
              <p className="mt-3 leading-7 text-aggie-light/74">
                Exports include all profile fields plus completion, engagement, internship, job shadow, last active, current roadmap, and roadmap history data.
              </p>
              <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-lg border border-white/10 bg-white/6 p-3 text-sm font-bold text-aggie-light">
                <input
                  type="checkbox"
                  checked={includeTestData}
                  onChange={(event) => setIncludeTestData(event.target.checked)}
                  className="h-4 w-4 accent-aggie-ice"
                />
                Include TEST ACCOUNT data in exports
              </label>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <button type="button" onClick={exportCsv} className="chrome-surface inline-flex min-h-12 items-center justify-center rounded-lg border border-aggie-chrome/60 px-5 text-sm font-black text-aggie-navy shadow-glow transition hover:brightness-110">
                  Export CSV
                </button>
                <button type="button" onClick={exportExcel} className="chrome-surface inline-flex min-h-12 items-center justify-center rounded-lg border border-aggie-chrome/60 px-5 text-sm font-black text-aggie-navy shadow-glow transition hover:brightness-110">
                  Export Excel
                </button>
              </div>
            </article>

            <article className="rounded-lg border border-aggie-silver/15 bg-white/[0.045] p-5">
              <h3 className="text-lg font-black text-white">Admin Permission Rules</h3>
              <p className="mt-2 text-sm font-semibold leading-6 text-aggie-muted">
                Only admins can add, import, edit, or export student-athletes. Coaches cannot import or export full database data. Student-athletes cannot access this page.
              </p>
            </article>
          </div>
        </section>

        <section className="card-surface rounded-lg p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-black text-white">Student-Athlete Records</h2>
              <p className="mt-2 text-sm font-semibold text-aggie-muted">
                {records.length} local records available, including {records.filter((record) => record.isTestAccount).length} TEST ACCOUNT record{records.filter((record) => record.isTestAccount).length === 1 ? "" : "s"}
              </p>
            </div>
            <label className="relative block lg:w-96">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-aggie-muted" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by name, team, sport, roadmap"
                className="min-h-12 w-full rounded-lg border border-white/10 bg-white/8 pl-11 pr-4 text-white outline-none transition focus:border-aggie-ice"
              />
            </label>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <FilterSelect
              label="Account Status"
              value={accountStatusFilter}
              options={["All", "Pending Activation", "Activated", "Inactive"]}
              onChange={setAccountStatusFilter}
            />
            <FilterSelect
              label="Profile Status"
              value={profileStatusFilter}
              options={["All", "Incomplete", "Active"]}
              onChange={setProfileStatusFilter}
            />
            <FilterSelect
              label="Current Roadmap"
              value={roadmapFilter}
              options={roadmapOptions}
              onChange={setRoadmapFilter}
            />
          </div>
          <div className="mt-5 overflow-x-auto">
            <table className="min-w-[1120px] w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-[0.16em] text-aggie-silver">
                <tr>
                  {["Name", "School Email", "Account Status", "Profile Status", "Current Roadmap", "Last Active Date", "Team", "Class Year", "Completion %", "Engagement", "Profile"].map((heading) => (
                    <th key={heading} className="border-b border-white/10 px-3 py-3 font-black">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="border-b border-white/8 text-aggie-light">
                    <td className="px-3 py-4 font-black text-white">
                      {record.firstName} {record.lastName}
                      {record.isTestAccount ? (
                        <span className="ml-2 rounded-md border border-aggie-ice/30 bg-aggie-ice/10 px-2 py-1 text-xs font-black uppercase tracking-[0.12em] text-aggie-light">
                          TEST ACCOUNT
                        </span>
                      ) : null}
                    </td>
                    <td className="px-3 py-4">{record.email}</td>
                    <td className="px-3 py-4">{record.accountStatus}</td>
                    <td className="px-3 py-4">{record.profileStatus}</td>
                    <td className="px-3 py-4">{record.currentRoadmap || "Not completed yet"}</td>
                    <td className="px-3 py-4">{record.lastActiveDate}</td>
                    <td className="px-3 py-4">{record.team || "Not completed yet"}</td>
                    <td className="px-3 py-4">{record.classYear || "Not completed yet"}</td>
                    <td className="px-3 py-4">{record.completionPercentage}%</td>
                    <td className="px-3 py-4">{record.engagementScore}</td>
                    <td className="px-3 py-4">
                      <Link href={`/admin/student-athlete-profile?id=${record.id}`} className="rounded-lg border border-aggie-ice/30 bg-aggie-ice/10 px-3 py-2 text-sm font-black text-aggie-light transition hover:bg-aggie-ice/15">
                        View Profile
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </RoleGate>
  );
}

function FormInput({ label, value, onChange, type = "text", required = false }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="text-sm font-black uppercase tracking-[0.16em] text-aggie-silver">
        {label}{required ? " *" : ""}
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        type={type}
        className="mt-2 min-h-12 w-full rounded-lg border border-white/10 bg-white/8 px-4 text-white outline-none transition focus:border-aggie-ice"
      />
    </label>
  );
}

function FilterSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase tracking-[0.16em] text-aggie-silver">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 min-h-11 w-full rounded-lg border border-white/10 bg-aggie-navy px-3 text-sm font-bold text-white outline-none transition focus:border-aggie-ice"
      >
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}

function parseCsv(text: string) {
  const [headerLine, ...rows] = text.split(/\r?\n/).filter((line) => line.trim());
  if (!headerLine) return [];
  const headers = splitCsvLine(headerLine);
  return rows
    .map((row) => {
      const values = splitCsvLine(row);
      const mapped = headers.reduce<Record<string, string>>((acc, header, index) => {
        acc[header.trim()] = values[index]?.trim() ?? "";
        return acc;
      }, {});
      return createRecordFromRow(mapped);
    })
    .filter((record) => record.firstName && record.lastName && record.email);
}

function splitCsvLine(line: string) {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === "\"") {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      values.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  values.push(current);
  return values.map((value) => value.replace(/^"|"$/g, "").replaceAll("\"\"", "\""));
}

function createRecordFromRow(row: Record<string, string>): StudentAthleteRecord {
  const currentRoadmap = row["Current Roadmap"] ?? "";
  const userId = `student-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return {
    id: `student-record-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    userId,
    firstName: row["First Name"] ?? "",
    lastName: row["Last Name"] ?? "",
    preferredName: row["Preferred Name"] ?? "",
    email: row.Email?.toLowerCase() ?? "",
    phone: row.Phone ?? "",
    sport: row.Sport ?? "",
    team: row.Team ?? "",
    classYear: row["Class Year"] ?? "",
    academicYear: row["Academic Year"] ?? "",
    major: row.Major ?? "",
    minor: row.Minor ?? "",
    expectedGraduationYear: row["Expected Graduation Year"] ?? "",
    entryYear: row["Entry Year"] ?? "",
    transferStatus: row["Transfer Status"] ?? "",
    currentRoadmap,
    roadmapStartDate: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
    roadmapCompletedDate: "",
    careerInterests: row["Career Interests"] ?? "",
    linkedInUrl: row["LinkedIn URL"] ?? "",
    joinedAggiesLeadDate: "",
    profileStatus: "Incomplete",
    accountStatus: "Pending Activation",
    completionPercentage: 0,
    engagementScore: 0,
    internshipStatus: "Not Started",
    jobShadowStatus: "Not Started",
    lastActiveDate: "Imported",
    roadmapHistorySummary: currentRoadmap ? `${currentRoadmap}: 0%` : "",
    roadmapHistory: [],
    eventAttendanceHistory: [],
    staffNotes: [],
    excludeFromAutoAdvancement: false,
    isTestAccount: false,
  };
}

function createPendingStudentUser(record: StudentAthleteRecord): User {
  const timestamp = new Date().toISOString();
  return {
    id: record.userId,
    firstName: record.firstName,
    lastName: record.lastName,
    email: record.email,
    role: "student-athlete",
    teamIds: [],
    title: "Student-Athlete",
    status: "active",
    mustChangePassword: true,
    password: temporaryStudentPassword,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

function toCsv(records: StudentAthleteRecord[]) {
  return [
    databaseExportColumns.join(","),
    ...records.map((record) =>
      [
        record.firstName,
        record.lastName,
        record.preferredName,
        record.email,
        record.phone,
        record.sport,
        record.team,
        record.classYear,
        record.academicYear,
        record.major,
        record.minor,
        record.expectedGraduationYear,
        record.entryYear,
        record.transferStatus,
        record.currentRoadmap,
        record.roadmapStartDate,
        record.roadmapCompletedDate,
        formatRoadmapHistory(record),
        previousRoadmapCompletion(record),
        record.joinedAggiesLeadDate,
        record.academicYear,
        record.careerInterests,
        record.accountStatus,
        record.profileStatus,
        `${record.completionPercentage}%`,
        record.engagementScore,
        record.internshipStatus,
        record.jobShadowStatus,
        record.lastActiveDate,
        record.roadmapHistorySummary,
        record.isTestAccount ? "TEST ACCOUNT" : "Real Account",
      ].map(csvEscape).join(","),
    ),
  ].join("\n");
}

function toHtmlTable(records: StudentAthleteRecord[]) {
  const header = databaseExportColumns.map((column) => `<th>${escapeHtml(column)}</th>`).join("");
  const body = records.map((record) => {
    const values = [
      record.firstName,
      record.lastName,
      record.preferredName,
      record.email,
      record.phone,
      record.sport,
      record.team,
      record.classYear,
      record.academicYear,
      record.major,
      record.minor,
      record.expectedGraduationYear,
      record.entryYear,
      record.transferStatus,
      record.currentRoadmap,
      record.roadmapStartDate,
      record.roadmapCompletedDate,
      formatRoadmapHistory(record),
      previousRoadmapCompletion(record),
      record.joinedAggiesLeadDate,
      record.academicYear,
      record.careerInterests,
      record.accountStatus,
      record.profileStatus,
      `${record.completionPercentage}%`,
      String(record.engagementScore),
      record.internshipStatus,
      record.jobShadowStatus,
      record.lastActiveDate,
      record.roadmapHistorySummary,
      record.isTestAccount ? "TEST ACCOUNT" : "Real Account",
    ];
    return `<tr>${values.map((value) => `<td>${escapeHtml(value)}</td>`).join("")}</tr>`;
  }).join("");
  return `<table><thead><tr>${header}</tr></thead><tbody>${body}</tbody></table>`;
}

function csvEscape(value: string | number) {
  const text = String(value);
  return `"${text.replaceAll("\"", "\"\"")}"`;
}

function escapeHtml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;");
}

function downloadTextFile(filename: string, contents: string, type = "text/csv;charset=utf-8") {
  const blob = new Blob([contents], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

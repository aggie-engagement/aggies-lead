"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Download,
  Edit3,
  MapPin,
  Plus,
  Search,
  Trash2,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { useAuth } from "@/components/AuthState";
import { teamName } from "@/lib/accessManagement";
import {
  cancelRsvp,
  eventStatsForStudent,
  eventTypes,
  exportAttendanceCsv,
  moduleTitleForEvent,
  readEvents,
  rsvpToEvent,
  teamEventParticipation,
  updateAttendance,
  writeEvents,
} from "@/lib/events";
import type { AggiesLeadEvent, EventType } from "@/lib/events";
import { readStudentAthletes } from "@/lib/studentAthleteDatabase";
import type { StudentAthleteRecord } from "@/lib/studentAthleteDatabase";
import { queuePlaceholderEmail } from "@/lib/emailService";

const emptyEvent: Omit<AggiesLeadEvent, "id" | "registrations"> = {
  title: "",
  type: "Guest Speaker Event",
  capacity: 50,
  date: "",
  time: "",
  location: "",
  description: "",
  speakerCompanyContact: "",
  countsTowardModule: "",
};

export default function EventsPage() {
  const { role, user } = useAuth();
  const [events, setEvents] = useState<AggiesLeadEvent[]>([]);
  const [students, setStudents] = useState<StudentAthleteRecord[]>([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(emptyEvent);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [includeTestData, setIncludeTestData] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setEvents(readEvents());
    setStudents(readStudentAthletes());
  }, []);

  const currentStudent = useMemo(
    () => students.find((student) => student.userId === user?.id || student.email === user?.email),
    [students, user],
  );
  const coachTeamNames = useMemo(() => (user?.teamIds ?? []).map(teamName), [user?.teamIds]);
  const coachStudents = students.filter((student) => coachTeamNames.includes(student.team));
  const filteredEvents = events.filter((event) =>
    [event.title, event.type, event.location, event.description, event.speakerCompanyContact]
      .join(" ")
      .toLowerCase()
      .includes(search.trim().toLowerCase()),
  );

  const saveEvents = (nextEvents: AggiesLeadEvent[]) => {
    setEvents(nextEvents);
    writeEvents(nextEvents);
    setStudents(readStudentAthletes());
  };

  const saveEvent = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.title || !form.date || !form.time || !form.location || !form.description) {
      setMessage("Complete title, date, time, location, and description.");
      return;
    }
    if (editingId) {
      saveEvents(events.map((item) => (item.id === editingId ? { ...item, ...form } : item)));
      setEditingId(null);
      setMessage("Event updated.");
    } else {
      saveEvents([{ id: `event-${Date.now()}`, ...form, registrations: [] }, ...events]);
      setMessage("Event created.");
    }
    setForm(emptyEvent);
  };

  const editEvent = (event: AggiesLeadEvent) => {
    setEditingId(event.id);
    setForm({
      title: event.title,
      type: event.type,
      capacity: event.capacity,
      date: event.date,
      time: event.time,
      location: event.location,
      description: event.description,
      speakerCompanyContact: event.speakerCompanyContact,
      countsTowardModule: event.countsTowardModule,
    });
  };

  const deleteEvent = (eventId: string) => {
    if (!window.confirm("Delete this event?")) return;
    saveEvents(events.filter((event) => event.id !== eventId));
    setMessage("Event deleted.");
  };

  const handleRsvp = (eventId: string) => {
    if (!currentStudent) {
      setMessage("Create or log into a student-athlete account before RSVPing.");
      return;
    }
    const event = events.find((item) => item.id === eventId);
    saveEvents(rsvpToEvent(eventId, currentStudent));
    if (event) {
      const templateKey =
        event.type === "Aggie Road Trip"
          ? "roadTripConfirmation"
          : event.type === "Job Shadow / Micro-Internship"
            ? "jobShadowConfirmation"
            : "eventRsvpConfirmation";
      queuePlaceholderEmail(templateKey, currentStudent.email, {
        firstName: currentStudent.preferredName || currentStudent.firstName,
        eventName: event.title,
        eventDate: event.date,
        eventTime: event.time,
        eventLocation: event.location,
        eventLink: `${window.location.origin}/events`,
        organization: event.speakerCompanyContact,
        contactName: event.speakerCompanyContact,
        transportation: "Details will be shared by Aggies Lead.",
      });
    }
    setMessage("RSVP saved.");
  };

  const handleCancel = (eventId: string) => {
    if (!currentStudent) return;
    saveEvents(cancelRsvp(eventId, currentStudent.id));
    setMessage("RSVP canceled.");
  };

  const handleAttendance = (eventId: string, studentId: string, status: "Attended" | "No-Show") => {
    saveEvents(updateAttendance(eventId, studentId, status));
    const event = events.find((item) => item.id === eventId);
    const moduleTitle = event ? moduleTitleForEvent(event) : "";
    setMessage(`Attendance marked ${status.toLowerCase()}.${status === "Attended" && moduleTitle ? ` ${moduleTitle} progress updated automatically.` : ""}`);
  };

  const exportReport = () => {
    downloadTextFile("aggies-lead-attendance-report.csv", exportAttendanceCsv(events, includeTestData ? students : students.filter((student) => !student.isTestAccount)));
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Events"
        title="Event Registration & Attendance"
        description="Create events, RSVP, track attendance, and connect participation back to Aggies Lead progress."
      />

      <section className="card-surface rounded-lg p-5">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-aggie-muted" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search events, speakers, companies, types, or locations..."
            className="min-h-12 w-full rounded-lg border border-white/10 bg-white/8 pl-11 pr-4 text-white outline-none transition focus:border-aggie-ice"
          />
        </label>
      </section>

      {message ? <p className="rounded-lg border border-aggie-ice/30 bg-aggie-ice/10 p-4 text-sm font-bold text-aggie-light">{message}</p> : null}

      {role === "admin" ? (
        <AdminEventManagement
          form={form}
          editingId={editingId}
          setForm={setForm}
          saveEvent={saveEvent}
          events={events}
          students={students}
          editEvent={editEvent}
          deleteEvent={deleteEvent}
          handleAttendance={handleAttendance}
          exportReport={exportReport}
          includeTestData={includeTestData}
          setIncludeTestData={setIncludeTestData}
        />
      ) : null}

      {role === "coach" ? (
        <CoachEventView events={events} students={coachStudents} teamNames={coachTeamNames} />
      ) : null}

      <section>
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-black text-white">Upcoming Events</h2>
            <p className="mt-1 text-sm font-semibold text-aggie-muted">
              {role === "student-athlete" ? "RSVP, cancel, and view module connections." : "View event details and participation."}
            </p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              currentStudent={currentStudent}
              role={role}
              onRsvp={handleRsvp}
              onCancel={handleCancel}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function AdminEventManagement({
  form,
  editingId,
  setForm,
  saveEvent,
  events,
  students,
  editEvent,
  deleteEvent,
  handleAttendance,
  exportReport,
  includeTestData,
  setIncludeTestData,
}: {
  form: typeof emptyEvent;
  editingId: string | null;
  setForm: (form: typeof emptyEvent) => void;
  saveEvent: (event: React.FormEvent<HTMLFormElement>) => void;
  events: AggiesLeadEvent[];
  students: StudentAthleteRecord[];
  editEvent: (event: AggiesLeadEvent) => void;
  deleteEvent: (eventId: string) => void;
  handleAttendance: (eventId: string, studentId: string, status: "Attended" | "No-Show") => void;
  exportReport: () => void;
  includeTestData: boolean;
  setIncludeTestData: (value: boolean) => void;
}) {
  return (
    <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
      <article className="card-surface rounded-lg p-6">
        <div className="flex items-center gap-3">
          <Plus className="h-6 w-6 text-aggie-ice" />
          <h2 className="text-2xl font-black text-white">{editingId ? "Edit Event" : "Create Event"}</h2>
        </div>
        <form onSubmit={saveEvent} className="mt-5 grid gap-4">
          <TextInput label="Event Title" value={form.title} onChange={(value) => setForm({ ...form, title: value })} />
          <label className="block">
            <span className="text-sm font-black uppercase tracking-[0.16em] text-aggie-silver">Event Type</span>
            <select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value as EventType })} className="mt-2 min-h-12 w-full rounded-lg border border-white/10 bg-aggie-navy px-4 text-white outline-none transition focus:border-aggie-ice">
              {eventTypes.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
          </label>
          <div className="grid gap-4 md:grid-cols-2">
            <TextInput label="Capacity" value={String(form.capacity)} onChange={(value) => setForm({ ...form, capacity: Number(value) || 0 })} />
            <TextInput label="Event Date" value={form.date} onChange={(value) => setForm({ ...form, date: value })} type="date" />
            <TextInput label="Event Time" value={form.time} onChange={(value) => setForm({ ...form, time: value })} />
            <TextInput label="Location" value={form.location} onChange={(value) => setForm({ ...form, location: value })} />
          </div>
          <TextInput label="Speaker / Company / Contact" value={form.speakerCompanyContact} onChange={(value) => setForm({ ...form, speakerCompanyContact: value })} />
          <TextInput label="Counts Toward Module" value={form.countsTowardModule} onChange={(value) => setForm({ ...form, countsTowardModule: value })} />
          <label className="block">
            <span className="text-sm font-black uppercase tracking-[0.16em] text-aggie-silver">Description</span>
            <textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="mt-2 min-h-24 w-full rounded-lg border border-white/10 bg-white/8 px-4 py-3 text-white outline-none transition focus:border-aggie-ice" />
          </label>
          <button type="submit" className="chrome-surface inline-flex min-h-12 items-center justify-center rounded-lg border border-aggie-chrome/60 px-5 text-sm font-black text-aggie-navy shadow-glow transition hover:brightness-110">
            {editingId ? "Save Event" : "Create Event"}
          </button>
        </form>
      </article>

      <article className="card-surface rounded-lg p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-black text-white">RSVP & Attendance</h2>
          <button type="button" onClick={exportReport} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/6 px-4 text-sm font-black text-white transition hover:border-aggie-ice/40 hover:bg-white/10">
            <Download className="h-4 w-4 text-aggie-ice" />
            Export Attendance Report
          </button>
        </div>
        <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-lg border border-white/10 bg-white/6 p-3 text-sm font-bold text-aggie-light">
          <input
            type="checkbox"
            checked={includeTestData}
            onChange={(event) => setIncludeTestData(event.target.checked)}
            className="h-4 w-4 accent-aggie-ice"
          />
          Include TEST ACCOUNT data in attendance export
        </label>
        <div className="mt-5 max-h-[680px] space-y-4 overflow-y-auto pr-1">
          {events.map((event) => (
            <div key={event.id} className="rounded-lg border border-white/10 bg-white/6 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-black text-white">{event.title}</p>
                  <p className="mt-1 text-sm font-semibold text-aggie-muted">{event.registrations.length}/{event.capacity} RSVPs</p>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => editEvent(event)} className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/6 text-aggie-light hover:bg-white/10" aria-label="Edit event"><Edit3 className="h-4 w-4" /></button>
                  <button type="button" onClick={() => deleteEvent(event.id)} className="grid h-10 w-10 place-items-center rounded-lg border border-red-300/25 bg-red-300/10 text-aggie-light hover:bg-red-300/15" aria-label="Delete event"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {event.registrations.length ? event.registrations.map((registration) => {
                  const student = students.find((item) => item.id === registration.studentId);
                  return (
                    <div key={registration.studentId} className="grid gap-2 rounded-lg border border-white/10 bg-black/15 p-3 text-sm font-bold text-aggie-light md:grid-cols-[1fr_auto] md:items-center">
                      <span>{student ? `${student.firstName} ${student.lastName} • ${student.team}` : registration.studentId} • {registration.status}</span>
                      <span className="flex gap-2">
                        <button type="button" onClick={() => handleAttendance(event.id, registration.studentId, "Attended")} className="rounded-lg border border-emerald-300/25 bg-emerald-300/10 px-3 py-2">Mark attended</button>
                        <button type="button" onClick={() => handleAttendance(event.id, registration.studentId, "No-Show")} className="rounded-lg border border-red-300/25 bg-red-300/10 px-3 py-2">Mark no-show</button>
                      </span>
                    </div>
                  );
                }) : <p className="text-sm font-semibold text-aggie-muted">No RSVPs yet.</p>}
              </div>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}

function CoachEventView({ events, students, teamNames }: { events: AggiesLeadEvent[]; students: StudentAthleteRecord[]; teamNames: string[] }) {
  const teamSummary = teamNames.map((team) => ({ team, ...teamEventParticipation(team, students, events) }));
  const eventRows = events.map((event) => {
    const teamRegistrations = event.registrations.filter((registration) =>
      students.some((student) => student.id === registration.studentId),
    );
    return {
      event,
      rsvpCount: teamRegistrations.length,
      attendedCount: teamRegistrations.filter((registration) => registration.status === "Attended").length,
      attendees: teamRegistrations
        .filter((registration) => registration.status === "Attended")
        .map((registration) => students.find((student) => student.id === registration.studentId))
        .filter(Boolean) as StudentAthleteRecord[],
    };
  });
  return (
    <section className="space-y-5">
      <article className="card-surface rounded-lg p-6">
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-aggie-ice" />
          <h2 className="text-2xl font-black text-white">Team Event Participation</h2>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {teamSummary.map((summary) => (
            <article key={summary.team} className="rounded-lg border border-white/10 bg-white/6 p-4">
              <h3 className="text-lg font-black text-white">{summary.team}</h3>
              <p className="mt-2 text-sm font-bold text-aggie-light">RSVP Participation: {summary.rsvpPercentage}%</p>
              <p className="mt-1 text-sm font-bold text-aggie-light">Attendance Participation: {summary.attendancePercentage}%</p>
            </article>
          ))}
        </div>
      </article>

      <article className="card-surface rounded-lg p-6">
        <h2 className="text-2xl font-black text-white">Assigned-Team RSVP & Attendance</h2>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {eventRows.map(({ event, rsvpCount, attendedCount, attendees }) => (
            <div key={event.id} className="rounded-lg border border-white/10 bg-white/6 p-4">
              <p className="text-sm font-black uppercase tracking-[0.16em] text-aggie-silver">{event.type}</p>
              <h3 className="mt-2 text-lg font-black text-white">{event.title}</h3>
              <p className="mt-2 text-sm font-bold text-aggie-light">Team RSVPs: {rsvpCount}</p>
              <p className="mt-1 text-sm font-bold text-aggie-light">Team attended: {attendedCount}</p>
              <div className="mt-3 space-y-2">
                {attendees.length ? attendees.map((student) => (
                  <p key={student.id} className="rounded-lg border border-emerald-300/20 bg-emerald-300/10 p-2 text-sm font-bold text-aggie-light">
                    {student.firstName} {student.lastName} | {student.team}
                  </p>
                )) : <p className="text-sm font-semibold text-aggie-muted">No assigned-team attendance marked yet.</p>}
              </div>
            </div>
          ))}
        </div>
      </article>

      <article className="card-surface rounded-lg p-6">
        <h2 className="text-2xl font-black text-white">Student-Athlete Event Totals</h2>
        <div className="mt-5 overflow-x-auto">
          <table className="min-w-[720px] w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.16em] text-aggie-silver">
              <tr>{["Student-Athlete", "Team", "RSVPs", "Attended", "No-Shows"].map((heading) => <th key={heading} className="border-b border-white/10 px-3 py-3 font-black">{heading}</th>)}</tr>
            </thead>
            <tbody>
              {students.map((student) => {
                const stats = eventStatsForStudent(student.id, events);
                return (
                  <tr key={student.id} className="border-b border-white/8 text-aggie-light">
                    <td className="px-3 py-4 font-black text-white">{student.firstName} {student.lastName}</td>
                    <td className="px-3 py-4">{student.team}</td>
                    <td className="px-3 py-4">{stats.rsvpCount}</td>
                    <td className="px-3 py-4">{stats.attendedCount}</td>
                    <td className="px-3 py-4">{stats.noShowCount}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}

function EventCard({ event, currentStudent, role, onRsvp, onCancel }: { event: AggiesLeadEvent; currentStudent?: StudentAthleteRecord; role: string | null; onRsvp: (eventId: string) => void; onCancel: (eventId: string) => void }) {
  const registration = currentStudent ? event.registrations.find((item) => item.studentId === currentStudent.id) : undefined;
  const full = event.registrations.length >= event.capacity;
  return (
    <article className="card-surface rounded-lg p-6">
      <CalendarDays className="h-8 w-8 text-aggie-ice" />
      <p className="mt-5 text-sm font-black uppercase tracking-[0.2em] text-aggie-silver">{event.type}</p>
      <h2 className="mt-2 text-2xl font-black text-white">{event.title}</h2>
      <p className="mt-3 font-bold text-aggie-ice">{event.date} • {event.time}</p>
      <p className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-aggie-muted"><MapPin className="h-4 w-4" />{event.location}</p>
      <p className="mt-4 text-sm font-semibold leading-6 text-aggie-light/74">{event.description}</p>
      <div className="mt-4 rounded-lg border border-white/10 bg-white/6 p-3 text-sm font-bold text-aggie-light">
        <p>Capacity: {event.registrations.length}/{event.capacity}</p>
        <div className="mt-2 h-2 rounded-full bg-white/10"><div className="h-2 rounded-full bg-aggie-ice" style={{ width: `${Math.min((event.registrations.length / event.capacity) * 100, 100)}%` }} /></div>
      </div>
      {moduleTitleForEvent(event) ? <p className="mt-3 rounded-lg border border-aggie-ice/25 bg-aggie-ice/10 p-3 text-sm font-bold text-aggie-light">Counts toward: {moduleTitleForEvent(event)}</p> : null}
      {event.speakerCompanyContact ? <p className="mt-3 text-sm font-semibold text-aggie-muted">{event.speakerCompanyContact}</p> : null}
      {role === "student-athlete" ? (
        registration ? (
          <button type="button" onClick={() => onCancel(event.id)} className="mt-5 min-h-11 w-full rounded-lg border border-red-300/25 bg-red-300/10 px-4 text-sm font-black text-aggie-light transition hover:bg-red-300/15">
            Cancel RSVP • {registration.status}
          </button>
        ) : (
          <button type="button" disabled={full} onClick={() => onRsvp(event.id)} className="chrome-surface mt-5 min-h-11 w-full rounded-lg border border-aggie-chrome/60 px-4 text-sm font-black text-aggie-navy shadow-steel transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50">
            {full ? "Event Full" : "RSVP"}
          </button>
        )
      ) : null}
    </article>
  );
}

function TextInput({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return (
    <label className="block">
      <span className="text-sm font-black uppercase tracking-[0.16em] text-aggie-silver">{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} type={type} className="mt-2 min-h-12 w-full rounded-lg border border-white/10 bg-white/8 px-4 text-white outline-none transition focus:border-aggie-ice" />
    </label>
  );
}

function downloadTextFile(filename: string, contents: string) {
  const blob = new Blob([contents], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

import { CalendarDays, Mail, Phone, UserRound } from "lucide-react";

const staffMembers = [
  {
    name: "Coming Soon",
    title: "TBD",
    email: "TBD",
    phone: "TBD",
    bookingLink: "#",
  },
  {
    name: "Coming Soon",
    title: "TBD",
    email: "TBD",
    phone: "TBD",
    bookingLink: "#",
  },
  {
    name: "Coming Soon",
    title: "TBD",
    email: "TBD",
    phone: "TBD",
    bookingLink: "#",
  },
];

export function AggiesLeadHomeContent() {
  return (
    <div className="space-y-6">
      <section className="card-surface rounded-lg p-7">
        <p className="text-sm font-bold uppercase tracking-[0.28em] text-aggie-silver">
          Home
        </p>
        <h1 className="text-glow mt-3 text-4xl font-black tracking-tight text-white md:text-6xl">
          Aggies Lead
        </h1>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <article className="card-surface rounded-lg p-6">
          <h2 className="text-2xl font-black text-white">What Is Aggies Lead?</h2>
          <p className="mt-4 leading-7 text-aggie-light/76">
            Aggies Lead is Utah State Athletics' student-athlete development program. It is designed to support student-athletes throughout their time at Utah State by providing resources, programming, and opportunities focused on personal growth, professional development, career readiness, leadership, and life after athletics.
          </p>
        </article>

        <article className="card-surface rounded-lg p-6">
          <h2 className="text-2xl font-black text-white">Purpose of Aggies Lead</h2>
          <p className="mt-4 leading-7 text-aggie-light/76">
            The purpose of Aggies Lead is to help student-athletes prepare for success beyond their sport. Through yearly roadmaps, career development resources, guest speakers, networking opportunities, financial literacy, community engagement, and transition planning, Aggies Lead helps student-athletes build skills, confidence, and connections that will support them during and after their time at Utah State.
          </p>
        </article>
      </section>

      <section className="card-surface rounded-lg p-6">
        <div className="flex items-center gap-3">
          <UserRound className="h-6 w-6 text-aggie-ice" />
          <h2 className="text-2xl font-black text-white">Meet the Aggies Lead Team</h2>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {staffMembers.map((staff, index) => (
            <article key={`${staff.name}-${index}`} className="rounded-lg border border-white/10 bg-white/6 p-5">
              <div className="grid h-14 w-14 place-items-center rounded-lg border border-aggie-silver/20 bg-white/8 text-aggie-ice">
                <UserRound className="h-7 w-7" />
              </div>
              <h3 className="mt-4 text-xl font-black text-white">{staff.name}</h3>
              <p className="mt-1 text-sm font-bold uppercase tracking-[0.14em] text-aggie-silver">{staff.title}</p>
              <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-aggie-light/78">
                <Mail className="h-4 w-4 text-aggie-ice" />
                {staff.email}
              </p>
              <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-aggie-light/78">
                <Phone className="h-4 w-4 text-aggie-ice" />
                {staff.phone}
              </p>
              <a
                href={staff.bookingLink}
                className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-white/10 bg-white/6 px-4 text-sm font-black text-white transition hover:border-aggie-ice/40 hover:bg-white/10"
              >
                Booking Link
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="card-surface rounded-lg p-6">
        <div className="flex items-center gap-3">
          <CalendarDays className="h-6 w-6 text-aggie-ice" />
          <h2 className="text-2xl font-black text-white">Schedule a Meeting</h2>
        </div>
        <p className="mt-4 max-w-4xl leading-7 text-aggie-light/76">
          Student-athletes can schedule a meeting with Aggies Lead staff for support with career planning, resumes, interviews, networking, professional development, and general guidance.
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <a
            href="#"
            className="chrome-surface inline-flex min-h-12 items-center justify-center rounded-lg border border-aggie-chrome/60 px-5 text-sm font-black text-aggie-navy shadow-glow transition hover:brightness-110"
          >
            Schedule with Isaiah
          </a>
          <a
            href="#"
            className="inline-flex min-h-12 items-center justify-center rounded-lg border border-aggie-silver/25 px-5 text-sm font-black text-white transition hover:border-aggie-ice/40 hover:bg-white/10"
          >
            Schedule with Danika
          </a>
        </div>
      </section>
    </div>
  );
}

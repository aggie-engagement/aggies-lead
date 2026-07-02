import { CalendarCheck } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

const bookingTypes = [
  "Resume Review",
  "Career Meeting",
  "LinkedIn Help",
  "Transfer Check-In",
  "Internship Help",
];

export default function BookingsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Bookings"
        title="Schedule Aggies Lead support"
        description="Prototype booking page for future Microsoft Bookings integration and appointment types."
      />
      <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <article className="card-surface rounded-lg p-6">
          <CalendarCheck className="h-10 w-10 text-aggie-ice" />
          <h2 className="mt-5 text-2xl font-black text-white">Microsoft Bookings Placeholder</h2>
          <p className="mt-3 leading-7 text-aggie-light/72">
            A Microsoft Bookings embed or calendar card will live here when the
            real scheduling flow is connected.
          </p>
          <div className="mt-6 grid h-64 place-items-center rounded-lg border border-dashed border-aggie-silver/25 bg-white/[0.04] text-center text-sm font-bold text-aggie-muted">
            Embedded booking calendar placeholder
          </div>
        </article>
        <article className="card-surface rounded-lg p-6">
          <h2 className="text-2xl font-black text-white">Appointment buttons</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {bookingTypes.map((type) => (
              <button
                key={type}
                type="button"
                className="min-h-14 rounded-lg border border-aggie-silver/20 bg-white/[0.045] px-4 text-sm font-black text-aggie-light transition hover:border-aggie-steel hover:bg-white/10"
              >
                {type}
              </button>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}

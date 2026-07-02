import { PageHeader } from "@/components/PageHeader";

const areas = ["Career exploration", "Leadership", "Graduate school", "NIL", "Networking", "Life after sport"];

export default function MentorshipPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Mentorship"
        title="Request the right conversation"
        description="A placeholder request page for matching student-athletes with alumni, staff, campus partners, and professional mentors."
      />

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <article className="card-surface rounded-lg p-6">
          <h2 className="text-2xl font-black text-white">Mentorship focus</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {areas.map((area) => (
              <button
                key={area}
                type="button"
                className="min-h-11 rounded-lg border border-aggie-silver/15 px-4 text-sm font-bold text-aggie-light transition hover:border-aggie-steel hover:text-aggie-ice"
              >
                {area}
              </button>
            ))}
          </div>
        </article>

        <form className="card-surface rounded-lg p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-bold text-aggie-light/80">Name</span>
              <input className="mt-2 min-h-12 w-full rounded-lg border border-aggie-silver/15 bg-aggie-navy/80 px-4 text-white outline-none focus:border-aggie-steel" />
            </label>
            <label className="block">
              <span className="text-sm font-bold text-aggie-light/80">Sport</span>
              <input className="mt-2 min-h-12 w-full rounded-lg border border-aggie-silver/15 bg-aggie-navy/80 px-4 text-white outline-none focus:border-aggie-steel" />
            </label>
          </div>
          <label className="mt-4 block">
            <span className="text-sm font-bold text-aggie-light/80">What kind of mentor would help?</span>
            <textarea
              className="mt-2 min-h-36 w-full rounded-lg border border-aggie-silver/15 bg-aggie-navy/80 p-4 text-white outline-none focus:border-aggie-steel"
              placeholder="Share goals, questions, or industries of interest..."
            />
          </label>
          <button type="button" className="chrome-surface mt-5 min-h-12 rounded-lg border border-aggie-chrome/60 px-5 text-sm font-black text-aggie-navy shadow-glow">
            Submit Placeholder Request
          </button>
        </form>
      </section>
    </div>
  );
}

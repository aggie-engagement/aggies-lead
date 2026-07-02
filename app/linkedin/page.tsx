import Link from "next/link";
import { Award, ArrowRight } from "lucide-react";
import LinkedInModule from "../roadmap/linkedin-setup-networking-foundations/page";
import { LinkedInCompletionClient } from "./LinkedInCompletionClient";

export default function LinkedInPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/roadmaps/freshman"
          className="inline-flex min-h-12 items-center justify-center rounded-lg border border-aggie-silver/25 px-5 text-sm font-bold text-white transition hover:border-aggie-steel hover:bg-white/10"
        >
          Back to Freshman Roadmap
        </Link>
        <Link
          href="/modules/campus-navigation"
          className="chrome-surface inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-aggie-chrome/60 px-5 text-sm font-black text-aggie-navy shadow-glow transition hover:brightness-110"
        >
          Next Module
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <LinkedInModule />

      <section className="card-surface rounded-lg p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-aggie-silver">
              Completion Badge Placeholder
            </p>
            <h2 className="mt-2 text-2xl font-black text-white">LinkedIn Starter</h2>
            <p className="mt-3 leading-7 text-aggie-light/74">
              This placeholder badge represents completion of the LinkedIn
              foundations module in the clickable prototype.
            </p>
          </div>
          <span className="chrome-surface grid h-14 w-14 shrink-0 place-items-center rounded-lg text-aggie-navy shadow-glow">
            <Award className="h-7 w-7" />
          </span>
        </div>
      </section>

      <LinkedInCompletionClient />

    </div>
  );
}

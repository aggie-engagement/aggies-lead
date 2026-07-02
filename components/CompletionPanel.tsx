"use client";

import { useState } from "react";
import Link from "next/link";
import { Award, Check, CheckCircle2, MessageSquare } from "lucide-react";

export function CompletionPanel({
  moduleSlug,
  onComplete,
  backHref = "/my-roadmap",
  nextHref = "/my-roadmap",
  badgeTitle = "Badge Earned",
  completeLabel = "Complete Module",
}: {
  moduleSlug: string;
  onComplete?: () => void;
  backHref?: string;
  nextHref?: string;
  badgeTitle?: string;
  completeLabel?: string;
}) {
  const [checked, setChecked] = useState<string[]>([]);
  const [earned, setEarned] = useState(false);
  const checklist = ["Review module content", "Complete the activity", "Confirm next step"];

  function toggle(item: string) {
    setChecked((current) =>
      current.includes(item) ? current.filter((value) => value !== item) : [...current, item],
    );
  }

  function complete() {
    setEarned(true);
    onComplete?.();
  }

  return (
    <section className="card-surface rounded-lg p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-aggie-silver">
            Checklist
          </p>
          <h2 className="mt-2 text-2xl font-black text-white">
            {earned ? badgeTitle : "Complete this module"}
          </h2>
          <p className="mt-3 leading-7 text-aggie-light/74">
            {earned
              ? "Progress has been updated for this prototype session."
              : "Use this checklist to test module completion in the MVP prototype."}
          </p>
        </div>
        <span className="chrome-surface grid h-14 w-14 shrink-0 place-items-center rounded-lg text-aggie-navy shadow-glow">
          {earned ? <Award className="h-7 w-7" /> : <CheckCircle2 className="h-7 w-7" />}
        </span>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {checklist.map((item) => {
          const selected = checked.includes(item);
          return (
            <button
              key={item}
              type="button"
              onClick={() => toggle(item)}
              className={`flex min-h-14 items-center gap-3 rounded-lg border p-4 text-left text-sm font-bold transition ${
                selected
                  ? "border-aggie-chrome/40 bg-white/[0.09] text-white"
                  : "border-aggie-silver/15 bg-white/[0.045] text-aggie-light/78 hover:border-aggie-steel hover:bg-white/10"
              }`}
            >
              <span
                className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg ${
                  selected
                    ? "chrome-surface text-aggie-navy"
                    : "border border-aggie-silver/20 text-aggie-muted"
                }`}
              >
                {selected && <Check className="h-4 w-4" />}
              </span>
              {item}
            </button>
          );
        })}
      </div>

      <div className="mt-6 rounded-lg border border-aggie-silver/15 bg-white/[0.04] p-4">
        <div className="flex gap-3">
          <MessageSquare className="mt-1 h-5 w-5 shrink-0 text-aggie-ice" />
          <p className="text-sm font-semibold leading-6 text-aggie-light/78">
            Feedback is meant to help Aggies Lead identify any issues, confusion,
            or complications within this module.
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link
          href={backHref}
          className="inline-flex min-h-12 items-center justify-center rounded-lg border border-aggie-silver/25 px-5 text-sm font-bold text-white transition hover:border-aggie-steel hover:bg-white/10"
        >
          Back to My Roadmap
        </Link>
        <Link
          href={nextHref}
          className="inline-flex min-h-12 items-center justify-center rounded-lg border border-aggie-silver/25 px-5 text-sm font-bold text-white transition hover:border-aggie-steel hover:bg-white/10"
        >
          Next Module
        </Link>
        <button
          type="button"
          onClick={complete}
          className="chrome-surface inline-flex min-h-12 items-center justify-center rounded-lg border border-aggie-chrome/60 px-5 text-sm font-black text-aggie-navy shadow-glow transition hover:brightness-110"
        >
          {completeLabel}
        </button>
      </div>
      <span className="sr-only">{moduleSlug}</span>
    </section>
  );
}

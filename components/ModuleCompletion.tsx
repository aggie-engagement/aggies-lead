"use client";

import { useState } from "react";
import Link from "next/link";
import { Award, Check, CheckCircle2 } from "lucide-react";

export function ModuleCompletion({
  backHref = "/roadmaps/freshman",
  nextHref = "/dashboard",
  backLabel = "Back to Roadmap",
  nextLabel = "Next Module",
}: {
  backHref?: string;
  nextHref?: string;
  backLabel?: string;
  nextLabel?: string;
}) {
  const [checked, setChecked] = useState<string[]>([]);
  const [earned, setEarned] = useState(false);
  const items = ["Review the module overview", "Complete the practice step", "Save one next action"];

  function toggle(item: string) {
    setChecked((current) =>
      current.includes(item) ? current.filter((value) => value !== item) : [...current, item],
    );
    setEarned(false);
  }

  return (
    <section className="card-surface rounded-lg p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-aggie-silver">
            Module Progress
          </p>
          <h2 className="mt-2 text-2xl font-black text-white">
            {earned ? "Badge Earned" : `${checked.length} of ${items.length} steps complete`}
          </h2>
          <p className="mt-3 leading-7 text-aggie-light/74">
            {earned
              ? "Placeholder badge saved locally for this prototype session."
              : "Use this prototype checklist to test the completion flow."}
          </p>
        </div>
        <span className="chrome-surface grid h-14 w-14 shrink-0 place-items-center rounded-lg text-aggie-navy shadow-glow">
          {earned ? <Award className="h-7 w-7" /> : <CheckCircle2 className="h-7 w-7" />}
        </span>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {items.map((item) => {
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

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link
          href={backHref}
          className="inline-flex min-h-12 items-center justify-center rounded-lg border border-aggie-silver/25 px-5 text-sm font-bold text-white transition hover:border-aggie-steel hover:bg-white/10"
        >
          {backLabel}
        </Link>
        <Link
          href={nextHref}
          className="inline-flex min-h-12 items-center justify-center rounded-lg border border-aggie-silver/25 px-5 text-sm font-bold text-white transition hover:border-aggie-steel hover:bg-white/10"
        >
          {nextLabel}
        </Link>
        <button
          type="button"
          onClick={() => setEarned(true)}
          className="chrome-surface inline-flex min-h-12 items-center justify-center rounded-lg border border-aggie-chrome/60 px-5 text-sm font-black text-aggie-navy shadow-glow transition hover:brightness-110"
        >
          Complete Module
        </button>
      </div>
    </section>
  );
}

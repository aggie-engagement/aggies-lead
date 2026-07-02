"use client";

import { useEffect, useState } from "react";
import { Check, ClipboardCheck, Smartphone } from "lucide-react";
import { RoleGate } from "@/components/RoleGate";

const checklistItems = [
  "Login works on mobile",
  "Logout works on mobile",
  "Dashboard loads correctly",
  "Roadmaps load correctly",
  "Module progress saves correctly",
  "Event RSVP works correctly",
  "Resource downloads work correctly",
  "PWA install works correctly",
  "Home screen icon appears correctly",
  "App launches in standalone mode",
];

const storageKey = "aggies-lead:admin-mobile-qa-checklist";

export default function AdminTestingPage() {
  const [checked, setChecked] = useState<string[]>([]);

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) return;
    try {
      setChecked(JSON.parse(saved) as string[]);
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, []);

  const toggle = (item: string) => {
    setChecked((current) => {
      const next = current.includes(item)
        ? current.filter((value) => value !== item)
        : [...current, item];
      window.localStorage.setItem(storageKey, JSON.stringify(next));
      return next;
    });
  };

  const resetChecklist = () => {
    setChecked([]);
    window.localStorage.removeItem(storageKey);
  };

  const completion = Math.round((checked.length / checklistItems.length) * 100);

  return (
    <RoleGate allowed={["admin"]}>
      <div className="space-y-8">
        <section className="card-surface rounded-lg p-7">
          <div className="flex items-center gap-3">
            <Smartphone className="h-7 w-7 text-aggie-ice" />
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-aggie-silver">
              Hidden Admin Testing
            </p>
          </div>
          <h1 className="text-glow mt-3 text-4xl font-black tracking-tight text-white md:text-6xl">
            Mobile Device Quality Assurance
          </h1>
          <p className="mt-4 max-w-4xl text-lg leading-8 text-aggie-light/78">
            Use this admin-only checklist to verify the mobile web and PWA experience before sharing Aggies Lead with student-athletes, coaches, and staff.
          </p>
        </section>

        <section className="card-surface rounded-lg p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <ClipboardCheck className="h-6 w-6 text-aggie-ice" />
                <h2 className="text-2xl font-black text-white">Testing Completion</h2>
              </div>
              <p className="mt-2 text-sm font-semibold text-aggie-muted">
                {checked.length} of {checklistItems.length} checks completed
              </p>
            </div>
            <button
              type="button"
              onClick={resetChecklist}
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/10 bg-white/6 px-4 text-sm font-black text-white transition hover:border-aggie-ice/40 hover:bg-white/10"
            >
              Reset Checklist
            </button>
          </div>
          <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-aggie-ice via-aggie-silver to-aggie-steel transition-all"
              style={{ width: `${completion}%` }}
            />
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {checklistItems.map((item) => {
            const selected = checked.includes(item);
            return (
              <button
                key={item}
                type="button"
                onClick={() => toggle(item)}
                className={`flex min-h-16 items-center gap-4 rounded-lg border p-4 text-left transition ${
                  selected
                    ? "border-aggie-ice/40 bg-aggie-ice/10 text-white"
                    : "border-white/10 bg-white/6 text-aggie-light hover:border-aggie-ice/30 hover:bg-white/10"
                }`}
              >
                <span
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg border ${
                    selected
                      ? "border-aggie-ice/40 bg-aggie-ice/20 text-white"
                      : "border-aggie-silver/20 text-aggie-muted"
                  }`}
                >
                  {selected ? <Check className="h-5 w-5" /> : null}
                </span>
                <span className="font-black leading-6">{item}</span>
              </button>
            );
          })}
        </section>
      </div>
    </RoleGate>
  );
}

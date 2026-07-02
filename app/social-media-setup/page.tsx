"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, CheckCircle2, Network } from "lucide-react";
import { CompletionPanel } from "@/components/CompletionPanel";
import { usePrototypeState } from "@/components/PrototypeState";

export default function SocialMediaSetupPage() {
  const { completeSocialMedia } = usePrototypeState();
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");

  return (
    <div className="space-y-6">
      <Link href="/dashboard" className="inline-flex text-sm font-bold text-aggie-ice">
        Back to Dashboard
      </Link>
      <section className="card-surface rounded-lg p-7">
        <Network className="h-9 w-9 text-aggie-ice" />
        <p className="mt-5 text-sm font-bold uppercase tracking-[0.28em] text-aggie-silver">
          Required Setup
        </p>
        <h1 className="text-glow mt-3 text-4xl font-black tracking-tight text-white">
          Social Media / Aggies Lead + A-Club
        </h1>
        <p className="mt-4 max-w-3xl leading-7 text-aggie-light/76">
          Placeholder setup for following Aggies Lead and A-Club updates and
          saving your public social links for future support.
        </p>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <article className="card-surface rounded-lg p-6">
          <h2 className="text-2xl font-black text-white">Follow these handles</h2>
          <div className="mt-5 space-y-3">
            {["@aggieslead", "@usuaclub", "@usuathletics"].map((handle) => (
              <div key={handle} className="flex items-center gap-3 rounded-lg border border-aggie-silver/12 bg-white/[0.045] p-4">
                <CheckCircle2 className="h-5 w-5 text-aggie-ice" />
                <p className="font-bold text-aggie-light">{handle}</p>
              </div>
            ))}
          </div>
        </article>
        <article className="card-surface rounded-lg p-6">
          <h2 className="text-2xl font-black text-white">Your social links</h2>
          <label className="mt-5 block">
            <span className="text-sm font-black text-white">Personal Instagram URL</span>
            <input value={instagram} onChange={(event) => setInstagram(event.target.value)} className="mt-2 min-h-12 w-full rounded-lg border border-aggie-silver/15 bg-aggie-navy/80 px-4 text-white outline-none" />
          </label>
          <label className="mt-5 block">
            <span className="text-sm font-black text-white">Facebook URL</span>
            <input value={facebook} onChange={(event) => setFacebook(event.target.value)} className="mt-2 min-h-12 w-full rounded-lg border border-aggie-silver/15 bg-aggie-navy/80 px-4 text-white outline-none" />
          </label>
        </article>
      </section>

      <CompletionPanel
        moduleSlug="social-media-setup"
        onComplete={completeSocialMedia}
        backHref="/dashboard"
        nextHref="/my-roadmap"
        badgeTitle="Social Setup Complete"
      />
    </div>
  );
}

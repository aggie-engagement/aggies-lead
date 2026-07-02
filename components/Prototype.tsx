import Link from "next/link";
import { ArrowRight, LucideIcon, Search } from "lucide-react";

export function ChromeButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="chrome-surface inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-aggie-chrome/60 px-5 text-sm font-black text-aggie-navy shadow-glow transition hover:brightness-110"
    >
      {children}
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}

export function GhostButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-12 items-center justify-center rounded-lg border border-aggie-silver/25 px-5 text-sm font-bold text-white transition hover:border-aggie-steel hover:bg-white/10"
    >
      {children}
    </Link>
  );
}

export function FeatureCard({
  title,
  text,
  href,
  icon: Icon,
  cta = "Open",
}: {
  title: string;
  text: string;
  href: string;
  icon: LucideIcon;
  cta?: string;
}) {
  return (
    <Link
      href={href}
      className="card-surface block rounded-lg p-6 transition hover:border-aggie-steel/60 hover:bg-white/[0.08]"
    >
      <span className="grid h-12 w-12 place-items-center rounded-lg border border-aggie-silver/20 bg-aggie-steel/16 text-aggie-ice shadow-steel">
        <Icon className="h-6 w-6" />
      </span>
      <h2 className="mt-5 text-2xl font-black text-white">{title}</h2>
      <p className="mt-3 leading-7 text-aggie-light/72">{text}</p>
      <p className="mt-5 inline-flex items-center gap-2 text-sm font-black text-aggie-ice">
        {cta}
        <ArrowRight className="h-4 w-4" />
      </p>
    </Link>
  );
}

export function FilterShell({
  placeholder = "Search placeholder...",
  filters,
}: {
  placeholder?: string;
  filters: string[];
}) {
  return (
    <section className="card-surface rounded-lg p-5">
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-aggie-muted" />
        <input
          placeholder={placeholder}
          className="min-h-12 w-full rounded-lg border border-aggie-silver/15 bg-aggie-navy/80 pl-12 pr-4 text-white outline-none placeholder:text-aggie-muted focus:border-aggie-steel"
        />
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            className="min-h-10 rounded-lg border border-aggie-silver/20 px-4 text-sm font-bold text-aggie-light transition hover:border-aggie-steel hover:bg-white/10"
          >
            {filter}
          </button>
        ))}
      </div>
    </section>
  );
}

import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  detail,
  icon: Icon,
}: {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
}) {
  return (
    <article className="card-surface rounded-lg p-5">
      <div className="mb-5 flex items-center justify-between gap-4">
        <span className="text-sm font-semibold text-aggie-light/70">{label}</span>
        <span className="grid h-10 w-10 place-items-center rounded-lg border border-aggie-silver/20 bg-aggie-steel/16 text-aggie-ice">
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <p className="text-glow text-3xl font-black text-white">{value}</p>
      <p className="mt-2 text-sm leading-6 text-aggie-muted">{detail}</p>
    </article>
  );
}

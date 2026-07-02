export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="mb-8 max-w-3xl">
      <p className="mb-3 text-sm font-bold uppercase tracking-[0.28em] text-aggie-silver">
        {eyebrow}
      </p>
      <h1 className="text-glow text-4xl font-black tracking-tight text-white md:text-5xl">
        {title}
      </h1>
      <p className="mt-4 text-lg leading-8 text-aggie-light/78">{description}</p>
    </section>
  );
}

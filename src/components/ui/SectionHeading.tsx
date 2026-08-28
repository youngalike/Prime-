export function SectionHeading({
  eyebrow,
  title,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  align?: "left" | "center";
}) {
  return (
    <div className={`mb-12 ${align === "center" ? "text-center" : ""}`}>
      <p className="mb-3 font-sans text-xs uppercase tracking-[0.35em] text-gold-600">{eyebrow}</p>
      <h2 className="font-display text-3xl text-ink-900 sm:text-4xl">{title}</h2>
      <div className={`mt-4 h-px w-16 bg-gradient-to-r from-gold-400 to-transparent ${align === "center" ? "mx-auto" : ""}`} />
    </div>
  );
}

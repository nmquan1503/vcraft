interface Props {
  label: string;
  value: number | string;
  hint?: string;
  href?: string;
}

export default function StatCard({ label, value, hint, href }: Props) {
  const content = (
    <div className="border border-[#1f1b18]/10 p-6 hover:border-[#b45f3c]/50 transition-colors h-full">
      <p className="text-[10px] uppercase tracking-[0.25em] text-[#1f1b18]/50 mb-3">
        {label}
      </p>
      <p className="font-serif text-3xl md:text-4xl">{value}</p>
      {hint && (
        <p className="mt-2 text-xs text-[#1f1b18]/40">{hint}</p>
      )}
    </div>
  );

  return href ? <a href={href}>{content}</a> : content;
}
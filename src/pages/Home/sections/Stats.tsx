import { STATS } from '../data';

export default function Stats() {
  return (
    <section className="border-y border-[#1f1b18]/10">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-3 divide-x divide-[#1f1b18]/10">
        {STATS.map((s) => (
          <div key={s.label} className="py-10 md:py-14 px-4 text-center">
            <p className="font-serif text-3xl md:text-5xl">{s.value}</p>
            <p className="mt-2 text-[10px] md:text-xs uppercase tracking-[0.2em] text-[#1f1b18]/50">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
export default function QuoteBlock() {
  return (
    <section className="border-y border-[#1f1b18]/10">
      <div className="max-w-3xl mx-auto px-6 py-24 md:py-32 text-center">
        <blockquote className="font-serif text-2xl md:text-4xl italic leading-snug text-[#1f1b18]/80">
          “Nhất xương, nhì da, thứ ba dạc lò.”
        </blockquote>
        <p className="mt-6 text-[11px] uppercase tracking-[0.3em] text-[#b45f3c]/70">
          Kinh nghiệm truyền đời của người Bát Tràng
        </p>
      </div>
    </section>
  );
}
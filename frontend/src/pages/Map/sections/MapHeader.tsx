interface Props {
  total: number;
  openOnly: boolean;
  onToggleOpenOnly: () => void;
  loading: boolean;
}

export default function MapHeader({
  total,
  openOnly,
  onToggleOpenOnly,
  loading,
}: Props) {
  return (
    <section className="max-w-6xl mx-auto px-6 pt-24 md:pt-32 pb-10">
      <p className="text-[11px] uppercase tracking-[0.3em] text-[#b45f3c] mb-6">
        Bản đồ làng nghề
      </p>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <h1 className="font-serif text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] tracking-tight max-w-2xl">
          Tìm xưởng
          <br />
          đang <em className="italic text-[#b45f3c]">mở cửa</em>.
        </h1>
        <div className="flex items-center gap-4 pb-2">
          <p className="text-sm text-[#1f1b18]/40">{total} xưởng</p>
          <button
            onClick={onToggleOpenOnly}
            disabled={loading}
            className={`px-5 py-2 rounded-full text-[11px] uppercase tracking-widest border transition-colors ${
              openOnly
                ? 'bg-[#1f1b18] text-[#f6f1ea] border-[#1f1b18]'
                : 'border-[#1f1b18]/20 text-[#1f1b18]/60 hover:border-[#b45f3c] hover:text-[#b45f3c]'
            }`}
          >
            {openOnly ? '✓ Chỉ xưởng mở' : 'Chỉ xưởng mở'}
          </button>
        </div>
      </div>
    </section>
  );
}
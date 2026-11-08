interface Props {
  search: string;
  onSearchChange: (v: string) => void;
  loading: boolean;
}

export default function FilterBar({ search, onSearchChange, loading }: Props) {
  return (
    <div className="max-w-6xl mx-auto px-6 pb-10 border-b border-[#1f1b18]/10">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <p className="text-[11px] uppercase tracking-[0.2em] text-[#1f1b18]/40">
          Tìm theo tên xưởng hoặc nghệ nhân
        </p>

        <div className="relative w-full sm:w-80">
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Ví dụ: Phạm Văn A, xưởng men lam…"
            disabled={loading}
            className="w-full bg-transparent border-b border-[#1f1b18]/20 py-2 pr-8 text-sm placeholder:text-[#1f1b18]/30 focus:outline-none focus:border-[#b45f3c] transition-colors"
          />
          <span className="absolute right-0 top-1/2 -translate-y-1/2 text-[#1f1b18]/30 text-sm pointer-events-none">
            ⌕
          </span>
        </div>
      </div>
    </div>
  );
}
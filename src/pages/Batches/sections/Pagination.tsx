interface Props {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
}

export default function Pagination({ page, totalPages, onChange }: Props) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-1 pt-12">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className="px-4 py-2 text-[11px] uppercase tracking-widest text-[#1f1b18]/40 hover:text-[#b45f3c] disabled:opacity-20 disabled:hover:text-[#1f1b18]/40 transition-colors"
      >
        ← Trước
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`w-9 h-9 text-xs transition-colors ${
            p === page
              ? 'bg-[#1f1b18] text-[#f6f1ea]'
              : 'text-[#1f1b18]/50 hover:text-[#b45f3c]'
          }`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        className="px-4 py-2 text-[11px] uppercase tracking-widest text-[#1f1b18]/40 hover:text-[#b45f3c] disabled:opacity-20 disabled:hover:text-[#1f1b18]/40 transition-colors"
      >
        Sau →
      </button>
    </div>
  );
}
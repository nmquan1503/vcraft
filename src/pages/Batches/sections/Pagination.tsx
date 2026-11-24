interface Props {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  onChange,
}: Props) {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end === totalPages) {
      start = Math.max(1, end - maxVisible + 1);
    }

    return Array.from(
      { length: end - start + 1 },
      (_, i) => start + i,
    );
  };

  const visiblePages = getVisiblePages();
  const showStartEllipsis = visiblePages[0] > 1;
  const showEndEllipsis = visiblePages[visiblePages.length - 1] < totalPages;

  const buttonBase = `
    inline-flex items-center justify-center
    transition-all duration-200
    focus-visible:outline-none
    focus-visible:ring-2 focus-visible:ring-[#b45f3c]
    focus-visible:ring-offset-2
  `;

  const arrowClass = `
    ${buttonBase}
    gap-2 px-2 sm:px-4 py-2
    text-[10px] sm:text-[11px]
    font-medium uppercase tracking-[0.12em]
    text-[#1f1b18]/50
    hover:text-[#b45f3c]
    disabled:cursor-not-allowed
    disabled:opacity-20
    disabled:hover:text-[#1f1b18]/50
  `;

  return (
    <nav
      aria-label="Phân trang"
      className="flex items-center justify-center gap-1 pt-10 sm:pt-12"
    >
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="Trang trước"
        className={arrowClass}
      >
        <span className="text-base leading-none">←</span>
        <span className="hidden sm:inline">Trước</span>
      </button>

      <div className="flex items-center gap-1">
        {showStartEllipsis && (
          <>
            <button
              type="button"
              onClick={() => onChange(1)}
              className={`
                ${buttonBase}
                h-9 w-9 rounded-full text-xs
                text-[#1f1b18]/50
                hover:bg-[#b45f3c]/10 hover:text-[#b45f3c]
              `}
            >
              1
            </button>
            <span className="px-1 text-xs text-[#1f1b18]/30">···</span>
          </>
        )}

        {visiblePages.map((p) => {
          const isActive = p === page;

          return (
            <button
              key={p}
              type="button"
              onClick={() => onChange(p)}
              aria-label={`Trang ${p}`}
              aria-current={isActive ? 'page' : undefined}
              className={`
                ${buttonBase}
                h-9 w-9 rounded-full text-xs
                ${
                  isActive
                    ? 'bg-[#1f1b18] font-medium text-[#f6f1ea] shadow-sm'
                    : 'text-[#1f1b18]/55 hover:bg-[#b45f3c]/10 hover:text-[#b45f3c]'
                }
              `}
            >
              {p}
            </button>
          );
        })}

        {showEndEllipsis && (
          <>
            <span className="px-1 text-xs text-[#1f1b18]/30">···</span>
            <button
              type="button"
              onClick={() => onChange(totalPages)}
              className={`
                ${buttonBase}
                h-9 w-9 rounded-full text-xs
                text-[#1f1b18]/50
                hover:bg-[#b45f3c]/10 hover:text-[#b45f3c]
              `}
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Trang tiếp theo"
        className={arrowClass}
      >
        <span className="hidden sm:inline">Sau</span>
        <span className="text-base leading-none">→</span>
      </button>
    </nav>
  );
}
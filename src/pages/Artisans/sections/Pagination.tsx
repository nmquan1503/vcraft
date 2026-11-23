import { useCallback, useEffect, useMemo, useRef } from 'react';

interface Props {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

type PageItem = number | 'ellipsis-left' | 'ellipsis-right';

function getPageItems(page: number, totalPages: number): PageItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const items: PageItem[] = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);

  if (start > 2) items.push('ellipsis-left');
  for (let i = start; i <= end; i++) items.push(i);
  if (end < totalPages - 1) items.push('ellipsis-right');
  items.push(totalPages);

  return items;
}

const focusRing =
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b45f3c] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f6f1ea]';

const NAV_BTN_BASE =
  'inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 text-[11px] uppercase tracking-widest text-[#1f1b18]/50 hover:text-[#b45f3c] active:scale-95 disabled:opacity-25 disabled:cursor-not-allowed disabled:hover:text-[#1f1b18]/50 disabled:active:scale-100 transition-[color,transform] duration-200 rounded-sm';

export default function Pagination({ page, totalPages, onChange }: Props) {
  const items = useMemo(() => getPageItems(page, totalPages), [page, totalPages]);
  const navRef = useRef<HTMLElement>(null);

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const scrollToContent = useCallback(() => {
    if (prefersReducedMotion) {
      window.scrollTo({ top: 0 });
      return;
    }
    const filterBar = document.querySelector<HTMLElement>(
      '[data-filter-bar], #artisans-filter, #products-filter'
    );
    if (filterBar) {
      const top = filterBar.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [prefersReducedMotion]);

  const goTo = useCallback(
    (next: number) => {
      if (next === page || next < 1 || next > totalPages) return;
      onChange(next);
      scrollToContent();
      // Trả focus về nav để screen reader tiếp tục đọc từ đây
      requestAnimationFrame(() => navRef.current?.focus({ preventScroll: true }));
    },
    [page, totalPages, onChange, scrollToContent]
  );

  // Guard page trong range (edge case: totalPages shrink khi filter)
  useEffect(() => {
    if (page > totalPages && totalPages >= 1) {
      goTo(totalPages);
    }
  }, [page, totalPages, goTo]);

  if (totalPages <= 1) return null;

  return (
    <nav
      ref={navRef}
      aria-label="Phân trang"
      tabIndex={-1}
      className="relative max-w-6xl mx-auto px-6 pt-10 md:pt-14 pb-20 md:pb-24 outline-none"
    >
      <div
        className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#1f1b18]/10 to-transparent"
        aria-hidden="true"
      />

      {/* Live region: screen reader đọc khi đổi trang */}
      <span
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        Trang {page} trên {totalPages}
      </span>

      {/* ── Mobile: compact ── */}
      <div className="flex sm:hidden items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => goTo(page - 1)}
          disabled={page <= 1}
          aria-label="Trang trước"
          className={`w-11 h-11 inline-flex items-center justify-center rounded-full border border-[#1f1b18]/15 text-[#1f1b18]/60 hover:border-[#b45f3c] hover:text-[#b45f3c] active:scale-95 transition-[border-color,color,transform] duration-200 disabled:opacity-25 disabled:cursor-not-allowed disabled:hover:border-[#1f1b18]/15 disabled:hover:text-[#1f1b18]/60 disabled:active:scale-100 ${focusRing}`}
        >
          <span aria-hidden="true">←</span>
        </button>

        <p className="text-xs tabular-nums text-[#1f1b18]/60 min-w-[3.5rem] text-center">
          <span className="font-semibold text-[#1f1b18]">{page}</span>
          <span className="text-[#1f1b18]/30 mx-1">/</span>
          <span>{totalPages}</span>
        </p>

        <button
          type="button"
          onClick={() => goTo(page + 1)}
          disabled={page >= totalPages}
          aria-label="Trang sau"
          className={`w-11 h-11 inline-flex items-center justify-center rounded-full border border-[#1f1b18]/15 text-[#1f1b18]/60 hover:border-[#b45f3c] hover:text-[#b45f3c] active:scale-95 transition-[border-color,color,transform] duration-200 disabled:opacity-25 disabled:cursor-not-allowed disabled:hover:border-[#1f1b18]/15 disabled:hover:text-[#1f1b18]/60 disabled:active:scale-100 ${focusRing}`}
        >
          <span aria-hidden="true">→</span>
        </button>
      </div>

      {/* ── Desktop/tablet ── */}
      <div className="hidden sm:flex items-center justify-center gap-1">
        <button
          type="button"
          onClick={() => goTo(page - 1)}
          disabled={page <= 1}
          aria-label="Trang trước"
          className={`${NAV_BTN_BASE} ${focusRing}`}
        >
          <span aria-hidden="true">←</span>
          <span>Trước</span>
        </button>

        <div className="flex items-center gap-1 mx-2">
          {items.map((item, i) => {
            if (typeof item === 'string') {
              return (
                <span
                  key={`${item}-${i}`}
                  aria-hidden="true"
                  className="w-9 h-9 flex items-center justify-center text-[#1f1b18]/30 text-xs select-none"
                >
                  …
                </span>
              );
            }
            const isActive = item === page;
            return (
              <button
                key={item}
                type="button"
                onClick={() => goTo(item)}
                aria-current={isActive ? 'page' : undefined}
                aria-label={`Trang ${item}`}
                className={`w-9 h-9 text-xs rounded-sm tabular-nums transition-[background-color,color,box-shadow,transform] duration-200 active:scale-[0.92] ${focusRing} ${
                  isActive
                    ? 'bg-[#1f1b18] text-[#f6f1ea] font-semibold shadow-[0_2px_8px_-2px_rgba(31,27,24,0.4)]'
                    : 'text-[#1f1b18]/50 hover:text-[#b45f3c] hover:bg-[#1f1b18]/5'
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => goTo(page + 1)}
          disabled={page >= totalPages}
          aria-label="Trang sau"
          className={`${NAV_BTN_BASE} ${focusRing}`}
        >
          <span>Sau</span>
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </nav>
  );
}
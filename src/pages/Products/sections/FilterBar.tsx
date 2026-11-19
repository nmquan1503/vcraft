import { useEffect, useRef } from 'react';
import type { Category } from '@/types';
import { SORT_OPTIONS } from '../constants';

interface Props {
  categories: Category[];
  activeCategory: string | null;
  onCategoryChange: (id: string | null) => void;
  sort: string;
  onSortChange: (value: string) => void;
  loading: boolean;
}

function PillButton({
  active,
  onClick,
  disabled,
  children,
}: {
  active: boolean;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      className={`shrink-0 px-3.5 md:px-5 py-1.5 md:py-2 rounded-full text-[10px] md:text-[11px] uppercase tracking-widest border transition-[background-color,color,border-color,transform,box-shadow] duration-200 active:scale-[0.96] ${
        active
          ? 'bg-[#1f1b18] text-[#f6f1ea] border-[#1f1b18] shadow-[0_2px_8px_-2px_rgba(31,27,24,0.3)]'
          : 'border-[#1f1b18]/15 text-[#1f1b18]/60 bg-transparent hover:border-[#b45f3c] hover:text-[#b45f3c]'
      } disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100`}
    >
      {children}
    </button>
  );
}

export default function FilterBar({
  categories,
  activeCategory,
  onCategoryChange,
  sort,
  onSortChange,
  loading,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll active pill vào giữa khi filter thay đổi (mobile horizontal scroll)
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const activePill = container.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (!activePill) return;
    activePill.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'nearest',
    });
  }, [activeCategory]);

  return (
    <div className="sticky top-14 md:top-16 z-30 bg-[#f6f1ea]/95 backdrop-blur-lg border-b border-[#1f1b18]/10">
      <div className="max-w-6xl mx-auto px-6 py-3 md:py-4">
        <div className="flex items-center gap-3 md:gap-6">
          <div className="flex-1 min-w-0">
            <div
              ref={scrollRef}
              className="flex gap-2 overflow-x-auto md:flex-wrap md:overflow-visible pb-0.5 -mb-0.5 scroll-smooth [&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none]"
            >
              <PillButton
                active={activeCategory === null}
                onClick={() => onCategoryChange(null)}
                disabled={loading}
              >
                Tất cả
              </PillButton>
              {categories.map((c) => (
                <PillButton
                  key={c.id}
                  active={activeCategory === c.id}
                  onClick={() => onCategoryChange(c.id)}
                  disabled={loading}
                >
                  {c.name}
                </PillButton>
              ))}
            </div>
          </div>

          <div className="relative shrink-0">
            <label htmlFor="products-sort" className="sr-only">
              Sắp xếp
            </label>
            <select
              id="products-sort"
              value={sort}
              onChange={(e) => onSortChange(e.target.value)}
              disabled={loading}
              className="appearance-none bg-transparent border border-[#1f1b18]/15 rounded-full pl-3 md:pl-4 pr-8 md:pr-9 py-1.5 md:py-2 text-[10px] md:text-[11px] uppercase tracking-widest text-[#1f1b18]/70 focus:outline-none focus:border-[#b45f3c] focus:text-[#b45f3c] hover:border-[#b45f3c]/50 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="absolute right-2.5 md:right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#1f1b18]/40"
              aria-hidden="true"
            >
              <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>

      <div
        className={`absolute inset-x-0 bottom-0 h-[2px] overflow-hidden transition-opacity duration-300 pointer-events-none ${
          loading ? 'opacity-100' : 'opacity-0'
        }`}
        aria-hidden="true"
      >
        <div className="h-full bg-gradient-to-r from-transparent via-[#b45f3c] to-transparent animate-pulse" />
      </div>
    </div>
  );
}
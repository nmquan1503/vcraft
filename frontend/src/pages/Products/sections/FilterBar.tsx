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

export default function FilterBar({
  categories,
  activeCategory,
  onCategoryChange,
  sort,
  onSortChange,
  loading,
}: Props) {
  return (
    <div className="max-w-6xl mx-auto px-6 pb-10 border-b border-[#1f1b18]/10">
      <div className="flex flex-wrap items-center justify-between gap-6">
        {/* Pills danh mục */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onCategoryChange(null)}
            disabled={loading}
            className={`px-5 py-2 rounded-full text-[11px] uppercase tracking-widest border transition-colors ${
              activeCategory === null
                ? 'bg-[#1f1b18] text-[#f6f1ea] border-[#1f1b18]'
                : 'border-[#1f1b18]/20 text-[#1f1b18]/60 hover:border-[#b45f3c] hover:text-[#b45f3c]'
            }`}
          >
            Tất cả
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => onCategoryChange(c.id)}
              disabled={loading}
              className={`px-5 py-2 rounded-full text-[11px] uppercase tracking-widest border transition-colors ${
                activeCategory === c.id
                  ? 'bg-[#1f1b18] text-[#f6f1ea] border-[#1f1b18]'
                  : 'border-[#1f1b18]/20 text-[#1f1b18]/60 hover:border-[#b45f3c] hover:text-[#b45f3c]'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          disabled={loading}
          className="bg-transparent border-b border-[#1f1b18]/20 pb-1 text-[11px] uppercase tracking-widest text-[#1f1b18]/60 focus:outline-none focus:border-[#b45f3c] cursor-pointer"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
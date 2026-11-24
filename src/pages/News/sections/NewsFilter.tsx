import type { NewsType } from '@/types';

type FilterValue = NewsType | 'ALL';

interface Props {
  active: FilterValue;
  onChange: (v: FilterValue) => void;
}

const OPTIONS: Array<{ value: FilterValue; label: string; index: string }> = [
  { value: 'ALL', label: 'Tất cả', index: '01' },
  { value: 'PRICE', label: 'Giá nguyên liệu', index: '02' },
  { value: 'SCHEDULE', label: 'Lịch sinh hoạt', index: '03' },
  { value: 'POLICY', label: 'Chính sách', index: '04' },
];

export default function NewsFilter({ active, onChange }: Props) {
  return (
    <div
      className="
        flex flex-wrap items-center gap-2
        sm:gap-3
      "
      role="group"
      aria-label="Lọc tin tức theo danh mục"
    >
      {OPTIONS.map((option) => {
        const isActive = active === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={isActive}
            className={`
              group relative inline-flex items-center gap-2.5
              overflow-hidden
              border px-4 py-2.5
              text-[10px] font-medium uppercase tracking-[0.12em]
              transition-all duration-300 ease-out
              sm:px-5 sm:py-3
              ${
                isActive
                  ? 'border-[#1f1b18] bg-[#1f1b18] text-[#f6f1ea]'
                  : 'border-[#1f1b18]/15 bg-transparent text-[#1f1b18]/55 hover:border-[#b45f3c]/60 hover:text-[#b45f3c]'
              }
            `}
          >
            <span
              className={`
                text-[8px] tracking-normal transition-colors duration-300
                ${
                  isActive
                    ? 'text-[#d9a08b]'
                    : 'text-[#1f1b18]/30 group-hover:text-[#b45f3c]/70'
                }
              `}
            >
              {option.index}
            </span>

            <span className="whitespace-nowrap">
              {option.label}
            </span>

            {isActive && (
              <span className="ml-1 h-1 w-1 rounded-full bg-[#d9a08b]" />
            )}
          </button>
        );
      })}
    </div>
  );
}
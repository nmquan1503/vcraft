import type { BatchStatus } from '@/types';

type FilterValue = BatchStatus | 'ALL' | 'MINE';

interface Props {
  active: FilterValue;
  onChange: (v: FilterValue) => void;
  showMine: boolean;
}

export default function BatchFilter({
  active,
  onChange,
  showMine,
}: Props) {
  const options: Array<{ value: FilterValue; label: string }> = [
    { value: 'ALL', label: 'Tất cả' },
    { value: 'IN_PROGRESS', label: 'Đang sản xuất' },
    { value: 'COMPLETED', label: 'Hoàn thành' },
  ];

  if (showMine) {
    options.push({ value: 'MINE', label: 'Xưởng của tôi' });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {options.map((option) => {
        const isActive = active === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={isActive}
            className={`
              group relative inline-flex items-center gap-2
              rounded-full border px-4 py-2.5
              text-[10px] sm:text-[11px]
              font-medium uppercase tracking-[0.14em]
              transition-all duration-300 ease-out
              focus-visible:outline-none
              focus-visible:ring-2 focus-visible:ring-[#b45f3c]
              focus-visible:ring-offset-2
              ${
                isActive
                  ? 'border-[#1f1b18] bg-[#1f1b18] text-[#f6f1ea] shadow-sm'
                  : 'border-[#1f1b18]/15 bg-transparent text-[#1f1b18]/55 hover:border-[#b45f3c]/60 hover:bg-[#b45f3c]/5 hover:text-[#b45f3c]'
              }
            `}
          >
            {isActive && (
              <span className="h-1.5 w-1.5 rounded-full bg-[#d9a08b]" />
            )}

            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
import type { NewsType } from '@/types';

type FilterValue = NewsType | 'ALL';

interface Props {
  active: FilterValue;
  onChange: (v: FilterValue) => void;
}

const OPTIONS: Array<{ value: FilterValue; label: string }> = [
  { value: 'ALL', label: 'Tất cả' },
  { value: 'PRICE', label: 'Giá nguyên liệu' },
  { value: 'SCHEDULE', label: 'Lịch sinh hoạt' },
  { value: 'POLICY', label: 'Chính sách' },
];

export default function NewsFilter({ active, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {OPTIONS.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`px-4 py-2 rounded-full text-[10px] uppercase tracking-widest border transition-colors ${
            active === o.value
              ? 'bg-[#1f1b18] text-[#f6f1ea] border-[#1f1b18]'
              : 'border-[#1f1b18]/20 text-[#1f1b18]/60 hover:border-[#b45f3c] hover:text-[#b45f3c]'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
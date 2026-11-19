import type { BatchStatus } from '@/types';

type FilterValue = BatchStatus | 'ALL' | 'MINE';

interface Props {
  active: FilterValue;
  onChange: (v: FilterValue) => void;
  showMine: boolean;
}

export default function BatchFilter({ active, onChange, showMine }: Props) {
  const options: Array<{ value: FilterValue; label: string }> = [
    { value: 'ALL', label: 'Tất cả' },
    { value: 'IN_PROGRESS', label: 'Đang sản xuất' },
    { value: 'COMPLETED', label: 'Hoàn thành' },
  ];

  if (showMine) {
    options.push({ value: 'MINE', label: 'Xưởng của tôi' });
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
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
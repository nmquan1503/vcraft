import type { QuoteStatus } from '@/types';

const ALL: Array<{ value: QuoteStatus | 'ALL'; label: string }> = [
  { value: 'ALL', label: 'Tất cả' },
  { value: 'DRAFT', label: 'Nháp' },
  { value: 'SENT', label: 'Đã gửi' },
  { value: 'BIDDING', label: 'Đang chào giá' },
  { value: 'ACCEPTED', label: 'Đã chấp nhận' },
  { value: 'IN_PRODUCTION', label: 'Sản xuất' },
  { value: 'DELIVERED', label: 'Đã giao' },
  { value: 'CLOSED', label: 'Đã đóng' },
];

interface Props {
  variant: 'buyer' | 'artisan';
  active: QuoteStatus | 'ALL';
  onChange: (v: QuoteStatus | 'ALL') => void;
}

export default function QuoteFilters({ variant, active, onChange }: Props) {
  const options = variant === 'buyer'
    ? ALL
    : ALL.filter((o) => ['ALL', 'SENT', 'BIDDING'].includes(o.value as string));

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
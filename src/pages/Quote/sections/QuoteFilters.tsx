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
  onChange: (value: QuoteStatus | 'ALL') => void;
}

export default function QuoteFilters({
  variant,
  active,
  onChange,
}: Props) {
  const options =
    variant === 'buyer'
      ? ALL
      : ALL.filter((option) =>
          ['ALL', 'SENT', 'BIDDING'].includes(option.value),
        );

  return (
    <div
      className="flex flex-wrap items-center gap-2"
      role="group"
      aria-label="Lọc yêu cầu báo giá theo trạng thái"
    >
      {options.map((option) => {
        const isActive = active === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={isActive}
            className={`relative inline-flex items-center justify-center gap-2 rounded-full border px-4 py-2.5 text-[9px] font-medium uppercase tracking-[0.15em] transition-all duration-300 sm:px-5 ${
              isActive
                ? 'border-[#b45f3c] bg-[#b45f3c] text-[#fbf8f3] shadow-[0_4px_14px_rgba(180,95,60,0.16)]'
                : 'border-[#1f1b18]/10 bg-transparent text-[#1f1b18]/55 hover:border-[#b45f3c]/45 hover:bg-[#b45f3c]/[0.04] hover:text-[#b45f3c]'
            }`}
          >
            {isActive && (
              <span className="h-1 w-1 rounded-full bg-[#fbf8f3]" />
            )}

            {option.label}
          </button>
        );
      })}
    </div>
  );
}
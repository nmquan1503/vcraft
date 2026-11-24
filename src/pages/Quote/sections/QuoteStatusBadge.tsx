import type { QuoteStatus } from '@/types';

const STATUS_CONFIG: Record<
  QuoteStatus,
  { label: string; className: string; dotClassName: string }
> = {
  DRAFT: {
    label: 'Bản nháp',
    className: 'border-[#1f1b18]/10 bg-[#1f1b18]/[0.05] text-[#1f1b18]/55',
    dotClassName: 'bg-[#1f1b18]/35',
  },
  SENT: {
    label: 'Đã gửi',
    className: 'border-blue-700/15 bg-blue-700/[0.06] text-blue-800',
    dotClassName: 'bg-blue-600',
  },
  BIDDING: {
    label: 'Đang chào giá',
    className: 'border-[#b45f3c]/25 bg-[#b45f3c]/[0.08] text-[#a45132]',
    dotClassName: 'bg-[#b45f3c]',
  },
  ACCEPTED: {
    label: 'Đã chấp nhận',
    className: 'border-amber-600/20 bg-amber-500/[0.08] text-amber-800',
    dotClassName: 'bg-amber-600',
  },
  IN_PRODUCTION: {
    label: 'Đang sản xuất',
    className: 'border-orange-700/20 bg-orange-600/[0.08] text-orange-800',
    dotClassName: 'bg-orange-600',
  },
  DELIVERED: {
    label: 'Đã giao',
    className: 'border-emerald-700/20 bg-emerald-600/[0.08] text-emerald-800',
    dotClassName: 'bg-emerald-600',
  },
  CLOSED: {
    label: 'Đã đóng',
    className: 'border-[#1f1b18]/10 bg-[#1f1b18]/[0.05] text-[#1f1b18]/45',
    dotClassName: 'bg-[#1f1b18]/30',
  },
};

export default function QuoteStatusBadge({
  status,
}: {
  status: QuoteStatus;
}) {
  const config = STATUS_CONFIG[status];

  if (!config) {
    return (
      <span className="inline-flex items-center gap-2 rounded-full border border-[#1f1b18]/10 bg-[#1f1b18]/[0.05] px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.14em] text-[#1f1b18]/50">
        <span className="h-1.5 w-1.5 rounded-full bg-[#1f1b18]/30" />
        {status}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] transition-colors duration-300 ${config.className}`}
    >
      <span
        className={`h-1.5 w-1.5 shrink-0 rounded-full ${config.dotClassName}`}
      />
      {config.label}
    </span>
  );
}
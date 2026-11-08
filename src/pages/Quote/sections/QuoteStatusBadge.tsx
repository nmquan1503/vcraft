import type { QuoteStatus } from '@/types';

const LABELS: Record<string, string> = {
  DRAFT: 'Bản nháp',
  SENT: 'Đã gửi',
  BIDDING: 'Đang chào giá',
  IN_PRODUCTION: 'Đang sản xuất',
  DELIVERED: 'Đã giao',
  COMPLETED: 'Hoàn thành',
  CANCELLED: 'Đã huỷ',
};

const COLORS: Record<string, string> = {
  DRAFT: 'bg-[#1f1b18]/10 text-[#1f1b18]/60',
  SENT: 'bg-blue-100 text-blue-800',
  BIDDING: 'bg-[#d9a08b]/30 text-[#8a4728]',
  IN_PRODUCTION: 'bg-amber-100 text-amber-800',
  DELIVERED: 'bg-green-100 text-green-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

export default function QuoteStatusBadge({ status }: { status: QuoteStatus }) {
  return (
    <span
      className={`inline-flex px-3 py-1 rounded-full text-[10px] uppercase tracking-widest ${
        COLORS[status] ?? 'bg-[#1f1b18]/10 text-[#1f1b18]/60'
      }`}
    >
      {LABELS[status] ?? status}
    </span>
  );
}
import type { NewsType } from '@/types';

const LABELS: Record<NewsType, string> = {
  PRICE: 'Giá nguyên liệu',
  SCHEDULE: 'Lịch sinh hoạt',
  POLICY: 'Chính sách',
};

const COLORS: Record<NewsType, string> = {
  PRICE: 'bg-amber-100 text-amber-800',
  SCHEDULE: 'bg-blue-100 text-blue-800',
  POLICY: 'bg-green-100 text-green-800',
};

export default function NewsTypeBadge({ type }: { type: NewsType }) {
  return (
    <span
      className={`inline-flex px-3 py-1 rounded-full text-[10px] uppercase tracking-widest ${COLORS[type]}`}
    >
      {LABELS[type]}
    </span>
  );
}
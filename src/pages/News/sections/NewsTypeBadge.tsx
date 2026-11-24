import type { NewsType } from '@/types';

const LABELS: Record<NewsType, string> = {
  PRICE: 'Giá nguyên liệu',
  SCHEDULE: 'Lịch sinh hoạt',
  POLICY: 'Chính sách',
};

const STYLES: Record<NewsType, string> = {
  PRICE: 'bg-[#ead9c4] text-[#80532e]',
  SCHEDULE: 'bg-[#dce4dc] text-[#526b55]',
  POLICY: 'bg-[#ead8d2] text-[#99543e]',
};

const MARKS: Record<NewsType, string> = {
  PRICE: '01',
  SCHEDULE: '02',
  POLICY: '03',
};

export default function NewsTypeBadge({ type }: { type: NewsType }) {
  return (
    <span
      className={`
        inline-flex w-fit items-center gap-2
        px-3 py-1.5
        text-[9px] font-medium uppercase tracking-[0.13em]
        ${STYLES[type]}
      `}
    >
      <span className="text-[8px] opacity-50">
        {MARKS[type]}
      </span>

      <span>{LABELS[type]}</span>
    </span>
  );
}
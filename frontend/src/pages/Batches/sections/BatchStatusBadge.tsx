import type { BatchStatus } from '@/types';

const LABELS: Record<BatchStatus, string> = {
  IN_PROGRESS: 'Đang sản xuất',
  COMPLETED: 'Hoàn thành',
};

const COLORS: Record<BatchStatus, string> = {
  IN_PROGRESS: 'bg-amber-100 text-amber-800',
  COMPLETED: 'bg-green-100 text-green-800',
};

export default function BatchStatusBadge({ status }: { status: BatchStatus }) {
  return (
    <span
      className={`inline-flex px-3 py-1 rounded-full text-[10px] uppercase tracking-widest ${COLORS[status]}`}
    >
      {LABELS[status]}
    </span>
  );
}
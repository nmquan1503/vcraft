import type { BatchStatus } from '@/types';

const LABELS: Record<BatchStatus, string> = {
  IN_PROGRESS: 'Đang sản xuất',
  COMPLETED: 'Hoàn thành',
};

const COLORS: Record<BatchStatus, string> = {
  IN_PROGRESS: 'border-[#b45f3c]/20 bg-[#b45f3c]/10 text-[#a34f32]',
  COMPLETED: 'border-[#647b5b]/20 bg-[#647b5b]/10 text-[#647b5b]',
};

const DOT_COLORS: Record<BatchStatus, string> = {
  IN_PROGRESS: 'bg-[#b45f3c]',
  COMPLETED: 'bg-[#647b5b]',
};

export default function BatchStatusBadge({
  status,
}: {
  status: BatchStatus;
}) {
  return (
    <span
      className={`
        inline-flex w-fit items-center gap-2
        rounded-full border px-3 py-1.5
        text-[9px] sm:text-[10px]
        font-medium uppercase tracking-[0.13em]
        whitespace-nowrap
        ${COLORS[status]}
      `}
    >
      <span
        className={`h-1.5 w-1.5 shrink-0 rounded-full ${DOT_COLORS[status]}`}
      />
      {LABELS[status]}
    </span>
  );
}
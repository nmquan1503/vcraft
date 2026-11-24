import { Link } from 'react-router-dom';
import BatchStatusBadge from './BatchStatusBadge';
import type { Batch } from '@/types';

interface Props {
  batch: Batch;
  artisanName?: string;
}

const fmt = (iso: string) => {
  try {
    const date = new Date(iso);

    if (Number.isNaN(date.getTime())) return iso;

    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
};

export default function BatchCard({ batch, artisanName }: Props) {
  return (
    <Link
      to={`/trace/${batch.id}`}
      className="group relative block overflow-hidden rounded-xl border border-[#1f1b18]/10 bg-[#fbf8f3] transition-all duration-500 hover:-translate-y-1 hover:border-[#b45f3c]/40 hover:shadow-[0_16px_45px_rgba(31,27,24,0.07)]"
    >
      <div className="flex flex-col gap-5 p-5 sm:flex-row sm:gap-6 sm:p-6">
        {/* QR Code */}
        <div className="flex shrink-0 items-start justify-between gap-4 sm:block">
          <div className="relative w-fit">
            <div className="rounded-lg border border-[#1f1b18]/10 bg-white p-2 shadow-sm transition-transform duration-500 group-hover:rotate-2">
              {batch.qrCodeUrl ? (
                <img
                  src={batch.qrCodeUrl}
                  alt={`QR ${batch.name}`}
                  className="h-24 w-24 object-contain sm:h-28 sm:w-28"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center bg-[#f6f1ea] sm:h-28 sm:w-28">
                  <span className="text-[9px] uppercase tracking-widest text-[#1f1b18]/30">
                    No QR
                  </span>
                </div>
              )}
            </div>

            <span className="absolute -bottom-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full border border-[#f6f1ea] bg-[#b45f3c] text-[10px] text-white">
              ↗
            </span>
          </div>

          <div className="sm:hidden">
            <BatchStatusBadge status={batch.status} />
          </div>
        </div>

        {/* Information */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="mb-3 hidden sm:block">
            <BatchStatusBadge status={batch.status} />
          </div>

          <h3 className="font-serif text-xl leading-tight tracking-tight text-[#1f1b18] transition-colors duration-300 group-hover:text-[#b45f3c] sm:text-2xl">
            {batch.name}
          </h3>

          {artisanName && (
            <p className="mt-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#b45f3c]">
              {artisanName}
            </p>
          )}

          {batch.description && (
            <p className="mt-3 line-clamp-2 text-xs leading-[1.9] text-[#1f1b18]/50 sm:text-sm">
              {batch.description}
            </p>
          )}

          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#b45f3c]">◇</span>
              <span className="text-[9px] uppercase tracking-[0.12em] text-[#1f1b18]/50">
                {batch.quantity.toLocaleString('vi-VN')} sản phẩm
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#b45f3c]">◷</span>
              <span className="text-[9px] uppercase tracking-[0.12em] text-[#1f1b18]/50">
                {fmt(batch.createdAt)}
              </span>
            </div>
          </div>

          {batch.status === 'COMPLETED' && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-[10px] text-[#b45f3c]">✓</span>
              <span className="text-[9px] uppercase tracking-[0.12em] text-[#1f1b18]/40">
                Hoàn thành: {fmt(batch.updatedAt)}
              </span>
            </div>
          )}

          <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#1f1b18]/10 pt-4">
            <span className="min-w-0 truncate text-[9px] uppercase tracking-[0.12em] text-[#1f1b18]/30">
              Mã lô: {batch.id}
            </span>

            <span className="inline-flex shrink-0 items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#b45f3c]">
              Xem nhật ký
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#b45f3c] transition-all duration-500 group-hover:w-full" />
    </Link>
  );
}
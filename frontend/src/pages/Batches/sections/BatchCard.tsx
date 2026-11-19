import { Link } from 'react-router-dom';
import BatchStatusBadge from './BatchStatusBadge';
import type { Batch } from '@/types';

interface Props {
  batch: Batch;
  artisanName?: string;
}

const fmt = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    });
  } catch { return iso; }
};

export default function BatchCard({ batch, artisanName }: Props) {
  return (
    <Link
      to={`/trace/${batch.id}`}
      className="group block border border-[#1f1b18]/10 hover:border-[#1f1b18]/30 transition-colors"
    >
      <div className="flex gap-5 p-6">
        {/* QR */}
        <div className="shrink-0">
          <div className="bg-[#f6f1ea] border border-[#1f1b18]/10 p-2">
            <img
              src={batch.qrCodeUrl}
              alt={`QR ${batch.name}`}
              className="w-24 h-24"
            />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <BatchStatusBadge status={batch.status} />
          </div>

          <h3 className="font-serif text-xl leading-tight group-hover:text-[#b45f3c] transition-colors">
            {batch.name}
          </h3>

          {artisanName && (
            <p className="mt-1 text-[11px] uppercase tracking-[0.15em] text-[#1f1b18]/50">
              {artisanName}
            </p>
          )}

          {batch.description && (
            <p className="mt-2 text-sm text-[#1f1b18]/60 leading-relaxed line-clamp-2">
              {batch.description}
            </p>
          )}

          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-[11px] uppercase tracking-[0.15em] text-[#1f1b18]/50">
            <span>{batch.quantity} sản phẩm</span>
            <span>
              {fmt(batch.createdAt)}
              {batch.status === 'COMPLETED' && ` → ${fmt(batch.updatedAt)}`}
            </span>
          </div>

          <div className="mt-4 pt-4 border-t border-[#1f1b18]/10 flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest text-[#1f1b18]/30">
              Mã: {batch.id}
            </span>
            <span className="text-[10px] uppercase tracking-widest text-[#b45f3c] group-hover:underline">
              Xem nhật ký →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
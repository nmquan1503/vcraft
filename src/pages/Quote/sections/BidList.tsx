import { Link } from 'react-router-dom';
import type { Bid } from '@/types';

interface Props {
  bids: Bid[];
  mode: 'buyer' | 'artisan';
  onAccept?: (bidId: string) => void;
  onReject?: (bidId: string) => void;
  processing: string | null;
}

const STATUS_LABEL: Record<string, string> = {
  PENDING: 'Đang chờ',
  ACCEPTED: 'Đã chấp nhận',
  REJECTED: 'Đã từ chối',
};

const fmt = (iso: string) => {
  try { return new Date(iso).toLocaleDateString('vi-VN'); }
  catch { return iso; }
};

export default function BidList({ bids, mode, onAccept, onReject, processing }: Props) {
  if (bids.length === 0) {
    return (
      <p className="text-sm text-[#f6f1ea]/40">
        {mode === 'buyer' ? 'Chưa có xưởng nào chào giá.' : 'Chưa có chào giá nào.'}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {bids.map((b) => {
        const isPending = b.status === 'PENDING';
        const isAccepted = b.status === 'ACCEPTED';
        const isBusy = processing === b.id;

        return (
          <div
            key={b.id}
            className={`border p-5 ${
              isAccepted
                ? 'border-[#d9a08b] bg-[#d9a08b]/10'
                : isPending
                  ? 'border-[#f6f1ea]/20'
                  : 'border-[#f6f1ea]/10 opacity-50'
            }`}
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-3">
                <span className={`text-[10px] uppercase tracking-widest ${
                  isAccepted ? 'text-[#d9a08b]'
                    : isPending ? 'text-[#f6f1ea]/70'
                    : 'text-[#f6f1ea]/30'
                }`}>
                  {STATUS_LABEL[b.status] ?? b.status}
                </span>
                <Link
                  to={`/artisans/${b.artisanId}`}
                  className="text-[10px] uppercase tracking-widest text-[#d9a08b] hover:underline"
                >
                  Xem xưởng →
                </Link>
              </div>
              <span className="text-[10px] uppercase tracking-widest text-[#f6f1ea]/30">
                {fmt(b.createdAt)}
              </span>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#d9a08b]/70 mb-1">Đơn giá</p>
                <p className="text-base text-[#f6f1ea] tabular-nums">
                  {b.pricePerUnit.toLocaleString('vi-VN')} ₫
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#d9a08b]/70 mb-1">Tổng</p>
                <p className="text-base text-[#f6f1ea] tabular-nums">
                  {b.totalPrice.toLocaleString('vi-VN')} ₫
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#d9a08b]/70 mb-1">Thời gian</p>
                <p className="text-base text-[#f6f1ea]">{b.estimatedDays} ngày</p>
              </div>
            </div>

            {b.note && (
              <p className="mt-4 text-sm text-[#f6f1ea]/70 leading-relaxed">{b.note}</p>
            )}
            {b.deliveryTerms && (
              <p className="mt-2 text-xs text-[#f6f1ea]/50 italic">
                Giao hàng: {b.deliveryTerms}
              </p>
            )}

            {mode === 'buyer' && isPending && onAccept && onReject && (
              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => onReject(b.id)}
                  disabled={isBusy}
                  className="flex-1 border border-red-500/40 text-red-300 rounded-full py-2 text-[10px] uppercase tracking-widest hover:bg-red-500/10 disabled:opacity-50 transition-colors"
                >
                  Từ chối
                </button>
                <button
                  onClick={() => onAccept(b.id)}
                  disabled={isBusy}
                  className="flex-1 bg-[#d9a08b] text-[#1f1b18] rounded-full py-2 text-[10px] uppercase tracking-widest hover:bg-[#f6f1ea] disabled:opacity-50 transition-colors"
                >
                  {isBusy ? 'Đang xử lý…' : 'Chấp nhận'}
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
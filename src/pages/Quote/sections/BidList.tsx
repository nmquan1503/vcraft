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

const STATUS_STYLE: Record<string, string> = {
  PENDING: 'border-[#d9a08b]/30 bg-[#d9a08b]/10 text-[#d9a08b]',
  ACCEPTED: 'border-emerald-400/25 bg-emerald-400/10 text-emerald-300',
  REJECTED: 'border-[#f6f1ea]/10 bg-[#f6f1ea]/[0.04] text-[#f6f1ea]/40',
};

const formatDate = (iso: string) => {
  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) return iso;

  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const formatPrice = (price: number) =>
  price.toLocaleString('vi-VN');

export default function BidList({
  bids,
  mode,
  onAccept,
  onReject,
  processing,
}: Props) {
  if (bids.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-dashed border-[#f6f1ea]/15 px-5 py-12 text-center sm:py-16">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#d9a08b]/[0.07]" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#d9a08b]/[0.07]" />

        <div className="relative mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#d9a08b]/20 bg-[#d9a08b]/[0.06]">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
            className="h-5 w-5 text-[#d9a08b]"
          >
            <path
              d="M8 12h8M12 8v8M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v13a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 18.5v-13Z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <p className="relative mt-5 font-serif text-xl text-[#f6f1ea]/80">
          {mode === 'buyer'
            ? 'Chưa có lời chào giá nào'
            : 'Chưa có chào giá nào'}
        </p>

        <p className="relative mx-auto mt-2 max-w-xs text-xs leading-relaxed text-[#f6f1ea]/35">
          {mode === 'buyer'
            ? 'Khi các nghệ nhân gửi đề xuất, thông tin chào giá sẽ xuất hiện tại đây.'
            : 'Những chào giá bạn gửi cho khách hàng sẽ được hiển thị tại đây.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bids.map((bid, index) => {
        const isPending = bid.status === 'PENDING';
        const isAccepted = bid.status === 'ACCEPTED';
        const isBusy = processing === bid.id;

        const statusStyle =
          STATUS_STYLE[bid.status] ??
          'border-[#f6f1ea]/10 bg-[#f6f1ea]/[0.04] text-[#f6f1ea]/40';

        return (
          <article
            key={bid.id}
            className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 ${
              isAccepted
                ? 'border-[#d9a08b]/35 bg-[#d9a08b]/[0.07]'
                : isPending
                  ? 'border-[#f6f1ea]/12 bg-[#f6f1ea]/[0.025] hover:border-[#d9a08b]/25 hover:bg-[#f6f1ea]/[0.04]'
                  : 'border-[#f6f1ea]/[0.07] bg-[#f6f1ea]/[0.015] opacity-65'
            }`}
          >
            {isAccepted && (
              <div className="absolute left-0 top-0 h-full w-1 bg-[#d9a08b]" />
            )}

            <div className="p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.16em] ${statusStyle}`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        isAccepted
                          ? 'bg-emerald-300'
                          : isPending
                            ? 'bg-[#d9a08b]'
                            : 'bg-[#f6f1ea]/30'
                      }`}
                    />
                    {STATUS_LABEL[bid.status] ?? bid.status}
                  </span>

                  <span className="text-[10px] text-[#f6f1ea]/25">
                    #{index + 1}
                  </span>
                </div>

                <span className="text-[10px] tracking-wide text-[#f6f1ea]/35">
                  {formatDate(bid.createdAt)}
                </span>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-4">
                <div>
                  <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#d9a08b]/65">
                    Đơn giá
                  </p>
                  <p className="mt-2 font-serif text-xl tabular-nums text-[#f6f1ea] sm:text-2xl">
                    {formatPrice(bid.pricePerUnit)}
                    <span className="ml-1 text-xs text-[#d9a08b]">₫</span>
                  </p>
                </div>

                <div className="border-t border-[#f6f1ea]/[0.07] pt-4 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
                  <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#d9a08b]/65">
                    Tổng giá trị
                  </p>
                  <p className="mt-2 font-serif text-xl tabular-nums text-[#f6f1ea] sm:text-2xl">
                    {formatPrice(bid.totalPrice)}
                    <span className="ml-1 text-xs text-[#d9a08b]">₫</span>
                  </p>
                </div>

                <div className="border-t border-[#f6f1ea]/[0.07] pt-4 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
                  <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#d9a08b]/65">
                    Thời gian hoàn thành
                  </p>
                  <p className="mt-2 font-serif text-xl text-[#f6f1ea] sm:text-2xl">
                    {bid.estimatedDays}
                    <span className="ml-1.5 text-xs text-[#f6f1ea]/40">
                      ngày
                    </span>
                  </p>
                </div>
              </div>

              {(bid.note || bid.deliveryTerms) && (
                <div className="mt-6 space-y-3 border-t border-[#f6f1ea]/[0.07] pt-5">
                  {bid.note && (
                    <div>
                      <p className="mb-2 text-[9px] font-medium uppercase tracking-[0.18em] text-[#d9a08b]/65">
                        Lời nhắn từ nghệ nhân
                      </p>
                      <p className="whitespace-pre-line text-sm leading-relaxed text-[#f6f1ea]/65">
                        {bid.note}
                      </p>
                    </div>
                  )}

                  {bid.deliveryTerms && (
                    <div className="flex flex-wrap items-start gap-2 text-xs leading-relaxed text-[#f6f1ea]/45">
                      <span className="shrink-0 text-[#d9a08b]/70">
                        Giao hàng:
                      </span>
                      <span>{bid.deliveryTerms}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#f6f1ea]/[0.07] pt-4">
                <Link
                  to={`/artisans/${bid.artisanId}`}
                  className="group/link inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.16em] text-[#d9a08b] transition-colors hover:text-[#f6f1ea]"
                >
                  Xem xưởng
                  <span className="transition-transform duration-300 group-hover/link:translate-x-1">
                    →
                  </span>
                </Link>

                {mode === 'buyer' &&
                  isPending &&
                  onAccept &&
                  onReject && (
                    <div className="flex w-full gap-2 sm:w-auto sm:min-w-[280px]">
                      <button
                        type="button"
                        onClick={() => onReject(bid.id)}
                        disabled={isBusy}
                        className="flex-1 rounded-full border border-red-400/25 px-4 py-2.5 text-[9px] font-medium uppercase tracking-[0.15em] text-red-300/80 transition-all duration-300 hover:border-red-400/50 hover:bg-red-400/[0.07] hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Từ chối
                      </button>

                      <button
                        type="button"
                        onClick={() => onAccept(bid.id)}
                        disabled={isBusy}
                        className="flex-1 rounded-full bg-[#d9a08b] px-4 py-2.5 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#1f1b18] transition-all duration-300 hover:bg-[#f6f1ea] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isBusy ? (
                          <span className="inline-flex items-center justify-center gap-2">
                            <span className="h-3 w-3 animate-spin rounded-full border-2 border-[#1f1b18]/25 border-t-[#1f1b18]" />
                            Đang xử lý
                          </span>
                        ) : (
                          'Chấp nhận'
                        )}
                      </button>
                    </div>
                  )}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
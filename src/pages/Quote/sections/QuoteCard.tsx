import { Link } from 'react-router-dom';
import QuoteStatusBadge from './QuoteStatusBadge';
import type { QuoteRequest } from '@/types';

interface Props {
  quote: QuoteRequest;
  variant: 'buyer' | 'artisan';
}

const formatDate = (iso: string) => {
  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) return iso;

  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export default function QuoteCard({ quote, variant }: Props) {
  const deadline = new Date(quote.deadline);
  const isValidDeadline = !Number.isNaN(deadline.getTime());

  const isExpired =
    isValidDeadline &&
    deadline.getTime() < new Date().setHours(0, 0, 0, 0);

  return (
    <Link
      to={`/quote/${quote.id}`}
      className="group relative block overflow-hidden rounded-2xl border border-[#1f1b18]/10 bg-[#fbf8f3] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#b45f3c]/35 hover:shadow-[0_16px_40px_rgba(31,27,24,0.07)] sm:p-6"
    >
      <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full border border-[#b45f3c]/[0.07] transition-transform duration-700 group-hover:scale-110" />
      <div className="pointer-events-none absolute -right-10 -top-14 h-36 w-36 rounded-full border border-[#b45f3c]/[0.07]" />

      <div className="relative">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <QuoteStatusBadge status={quote.status} />

          <span className="text-[9px] font-medium uppercase tracking-[0.17em] text-[#1f1b18]/35">
            {variant === 'buyer' ? 'Yêu cầu của tôi' : 'Đến từ khách hàng'}
          </span>
        </div>

        <div className="mt-6">
          <div className="mb-2 flex items-center gap-2">
            <span className="h-px w-5 bg-[#b45f3c]/60" />
            <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#b45f3c]/75">
              Yêu cầu báo giá
            </span>
          </div>

          <h3 className="max-w-2xl font-serif text-2xl leading-tight tracking-tight text-[#1f1b18] transition-colors duration-300 group-hover:text-[#b45f3c] sm:text-[28px]">
            {quote.title}
          </h3>

          {quote.description && (
            <p className="mt-3 line-clamp-2 max-w-2xl text-sm leading-relaxed text-[#1f1b18]/55">
              {quote.description}
            </p>
          )}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-[1fr_1fr] sm:gap-4">
          <div className="rounded-xl border border-[#1f1b18]/[0.07] bg-white/50 p-3.5 sm:p-4">
            <p className="text-[9px] font-medium uppercase tracking-[0.17em] text-[#1f1b18]/35">
              Số lượng
            </p>
            <p className="mt-2 font-serif text-xl text-[#1f1b18] sm:text-2xl">
              {quote.quantity.toLocaleString('vi-VN')}
              <span className="ml-1.5 text-xs text-[#1f1b18]/45">
                {quote.unit}
              </span>
            </p>
          </div>

          <div className="rounded-xl border border-[#1f1b18]/[0.07] bg-white/50 p-3.5 sm:p-4">
            <p className="text-[9px] font-medium uppercase tracking-[0.17em] text-[#1f1b18]/35">
              Hạn nhận báo giá
            </p>
            <p
              className={`mt-2 font-serif text-xl sm:text-2xl ${
                isExpired ? 'text-red-700/75' : 'text-[#1f1b18]'
              }`}
            >
              {formatDate(quote.deadline)}
            </p>
            {isExpired && (
              <p className="mt-1 text-[9px] uppercase tracking-wider text-red-700/60">
                Đã quá hạn
              </p>
            )}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#1f1b18]/[0.08] pt-4">
          <div>
            <p className="text-[9px] uppercase tracking-[0.15em] text-[#1f1b18]/30">
              Cập nhật lần cuối
            </p>
            <p className="mt-1 text-xs text-[#1f1b18]/55">
              {formatDate(quote.updatedAt)}
            </p>
          </div>

          <span className="inline-flex items-center gap-2 rounded-full border border-[#b45f3c]/20 px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#b45f3c] transition-all duration-300 group-hover:border-[#b45f3c] group-hover:bg-[#b45f3c] group-hover:text-[#fbf8f3]">
            Chi tiết
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}
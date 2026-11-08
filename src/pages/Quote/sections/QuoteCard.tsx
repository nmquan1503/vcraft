import { Link } from 'react-router-dom';
import QuoteStatusBadge from './QuoteStatusBadge';
import type { QuoteRequest } from '@/types';

interface Props {
  quote: QuoteRequest;
  variant: 'buyer' | 'artisan';
}

const fmt = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    });
  } catch { return iso; }
};

export default function QuoteCard({ quote, variant }: Props) {
  return (
    <Link
      to={`/quote/${quote.id}`}
      className="group block border border-[#1f1b18]/10 p-6 hover:border-[#1f1b18]/30 transition-colors"
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <QuoteStatusBadge status={quote.status} />
        <span className="text-[10px] uppercase tracking-widest text-[#1f1b18]/30">
          {variant === 'buyer' ? 'Yêu cầu của tôi' : 'Đến từ buyer'}
        </span>
      </div>

      <h3 className="font-serif text-xl leading-tight group-hover:text-[#b45f3c] transition-colors">
        {quote.title}
      </h3>

      {quote.description && (
        <p className="mt-2 text-sm text-[#1f1b18]/60 leading-relaxed line-clamp-2">
          {quote.description}
        </p>
      )}

      <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-[11px] uppercase tracking-[0.15em] text-[#1f1b18]/50">
        <span>{quote.quantity} {quote.unit}</span>
        <span>Hạn: {fmt(quote.deadline)}</span>
      </div>

      <div className="mt-4 pt-4 border-t border-[#1f1b18]/10 flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-widest text-[#1f1b18]/30">
          Cập nhật {fmt(quote.updatedAt)}
        </span>
        <span className="text-[10px] uppercase tracking-widest text-[#b45f3c] group-hover:underline">
          Xem →
        </span>
      </div>
    </Link>
  );
}
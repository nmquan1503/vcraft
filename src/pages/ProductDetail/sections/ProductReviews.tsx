import { motion } from 'framer-motion';
import type { ReviewListResponse } from '@/types';

interface Props {
  data: ReviewListResponse | null;
  loading: boolean;
}

const EASE = [0.22, 1, 0.36, 1] as const;

const formatDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
};

function Stars({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'lg' }) {
  const filled = Math.round(rating);
  const textSize = size === 'lg' ? 'text-base md:text-lg' : 'text-sm';
  return (
    <span
      className={`tracking-wider ${textSize}`}
      aria-label={`${filled} trên 5 sao`}
    >
      <span className="text-[#b45f3c]">{'★'.repeat(filled)}</span>
      <span className="text-[#1f1b18]/15">{'★'.repeat(5 - filled)}</span>
    </span>
  );
}

export default function ProductReviews({ data, loading }: Props) {
  const reviews = data?.reviews.data ?? [];
  const avg = data?.avgRating ?? 0;
  const total = data?.reviews.totalElements ?? 0;

  return (
    <section className="max-w-6xl mx-auto px-6 pb-20 md:pb-24">
      <div className="relative pt-16 md:pt-20">
        <div
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#1f1b18]/10 to-transparent"
          aria-hidden="true"
        />

        <div className="flex flex-wrap items-end justify-between gap-4 mb-10 md:mb-12">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#b45f3c] mb-3">
              Đánh giá
            </p>
            <h2 className="font-serif text-3xl md:text-4xl leading-tight">
              Khách hàng nói gì.
            </h2>
          </div>

          {!loading && total > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="flex items-baseline gap-3"
            >
              <Stars rating={avg} size="lg" />
              <span className="text-sm text-[#1f1b18]/55 tabular-nums">
                {avg.toFixed(1)} · {total} đánh giá
              </span>
            </motion.div>
          )}
        </div>

        {loading ? (
          <div className="space-y-8 animate-pulse" aria-busy="true">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-3">
                  <div className="h-3 w-32 bg-[#1f1b18]/10 rounded-sm" />
                  <div className="h-3 w-20 bg-[#1f1b18]/10 rounded-sm" />
                </div>
                <div className="h-3 w-full bg-[#1f1b18]/10 rounded-sm mb-2" />
                <div className="h-3 w-2/3 bg-[#1f1b18]/10 rounded-sm" />
              </div>
            ))}
            <span className="sr-only">Đang tải đánh giá…</span>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 md:py-16">
            <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#1f1b18]/5 mb-5">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-[#1f1b18]/30"
                aria-hidden="true"
              >
                <path
                  d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="font-serif text-xl md:text-2xl text-[#1f1b18]/60">
              Chưa có đánh giá nào
            </p>
            <p className="mt-2 text-sm text-[#1f1b18]/40 max-w-md mx-auto">
              Hãy là người đầu tiên chia sẻ cảm nhận về sản phẩm này.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#1f1b18]/10">
            {reviews.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: EASE }}
                className="py-8 first:pt-0"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <Stars rating={r.rating} />
                    <span className="text-[10px] uppercase tracking-widest text-[#1f1b18]/45 inline-flex items-center gap-1">
                      <span
                        className="w-1 h-1 rounded-full bg-green-600"
                        aria-hidden="true"
                      />
                      Đã xác thực
                    </span>
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-[#1f1b18]/35 tabular-nums">
                    {formatDate(r.createdAt)}
                  </span>
                </div>
                {r.comment && (
                  <p className="text-sm md:text-base text-[#1f1b18]/70 leading-relaxed max-w-3xl">
                    {r.comment}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
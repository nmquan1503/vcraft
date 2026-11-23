import { motion, type Variants } from 'framer-motion';
import type { ReviewListResponse } from '@/types';

interface Props {
  data: ReviewListResponse | null;
  loading: boolean;
}

const ease = [0.22, 1, 0.36, 1] as const;

const revealText: Variants = {
  hidden: {
    opacity: 0,
    y: 22,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease,
    },
  },
};

const containerReveal: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

const itemReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 22,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.75,
      ease,
    },
  },
};

const formatDate = (iso?: string | null) => {
  if (!iso) return '';

  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return iso;
  }

  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

function Stars({ rating }: { rating: number }) {
  const safeRating = Number.isFinite(rating)
    ? Math.min(5, Math.max(0, rating))
    : 0;

  const filled = Math.round(safeRating);

  return (
    <span
      className="inline-flex whitespace-nowrap text-[13px] tracking-[0.12em] sm:text-sm"
      aria-label={`${safeRating.toFixed(1)} trên 5 sao`}
    >
      <span className="text-[#b45f3c]">
        {'★'.repeat(filled)}
      </span>

      <span className="text-[#1f1b18]/15">
        {'★'.repeat(5 - filled)}
      </span>
    </span>
  );
}

function ReviewSkeleton() {
  return (
    <div className="relative overflow-hidden border-b border-[#1f1b18]/10 py-8 first:pt-0 sm:py-9">
      <div className="animate-pulse">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="h-3 w-28 rounded-full bg-[#1f1b18]/[0.07]" />
          <div className="h-2.5 w-20 rounded-full bg-[#1f1b18]/[0.05]" />
        </div>

        <div className="mt-6 h-3 w-full max-w-2xl rounded-full bg-[#1f1b18]/[0.06]" />
        <div className="mt-3 h-3 w-3/4 max-w-xl rounded-full bg-[#1f1b18]/[0.05]" />
      </div>
    </div>
  );
}

export default function ArtisanReviews({ data, loading }: Props) {
  const reviews = data?.reviews.data ?? [];
  const avg = Number.isFinite(data?.avgRating)
    ? data!.avgRating
    : 0;
  const total = data?.reviews.totalElements ?? 0;

  return (
    <section className="relative isolate overflow-hidden bg-[#f6f1ea]">
      <div className="mx-auto max-w-[1440px] px-5 pb-20 sm:px-8 sm:pb-24 md:px-12 md:pb-28 lg:px-20">
        <div className="border-t border-[#1f1b18]/15 pt-14 sm:pt-16 md:pt-20">
          <div className="mb-12 flex flex-col gap-7 sm:mb-14 md:flex-row md:items-end md:justify-between md:gap-10">
            <motion.div
              variants={revealText}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="min-w-0"
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="h-px w-8 bg-[#b45f3c]" />

                <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#b45f3c] sm:text-[11px]">
                  Cảm nhận khách hàng
                </p>
              </div>

              <h2 className="font-serif text-[clamp(2rem,4.5vw,3.8rem)] leading-[1.08] tracking-[-0.035em] text-[#1f1b18]">
                Những lời
                <br className="hidden sm:block" />
                <span className="italic text-[#b45f3c]">
                  {' '}từ trải nghiệm thực.
                </span>
              </h2>

              <p className="mt-5 max-w-md text-xs leading-[1.9] text-[#1f1b18]/50 sm:text-sm">
                Mỗi chia sẻ là một góc nhìn về những tác phẩm
                và trải nghiệm tại xưởng gốm.
              </p>
            </motion.div>

            {!loading && total > 0 && (
              <motion.div
                variants={revealText}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex items-center gap-5 border-t border-[#1f1b18]/10 pt-5 sm:gap-6 sm:border-t-0 sm:pt-0 md:shrink-0 md:pb-1"
              >
                <div className="flex flex-col">
                  <span className="font-serif text-[3.5rem] leading-none tracking-tight text-[#1f1b18] sm:text-[4.5rem]">
                    {avg.toFixed(1)}
                  </span>

                  <Stars rating={avg} />
                </div>

                <div className="h-12 w-px bg-[#1f1b18]/15" />

                <div className="flex flex-col gap-1">
                  <span className="font-serif text-2xl text-[#b45f3c] sm:text-3xl">
                    {total}
                  </span>

                  <span className="text-[9px] uppercase leading-relaxed tracking-[0.18em] text-[#1f1b18]/40 sm:text-[10px]">
                    Lượt đánh giá
                  </span>
                </div>
              </motion.div>
            )}
          </div>

          {loading ? (
            <div>
              {[1, 2, 3].map((item) => (
                <ReviewSkeleton key={item} />
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <motion.div
              variants={revealText}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative overflow-hidden border-y border-[#1f1b18]/10 py-14 sm:py-20"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-8 -top-16 h-56 w-56 rounded-full border border-[#b45f3c]/10 sm:h-72 sm:w-72"
              />

              <div className="relative max-w-xl">
                <span className="font-serif text-5xl italic text-[#b45f3c]/35">
                  “
                </span>

                <h3 className="mt-3 font-serif text-2xl leading-snug text-[#1f1b18] sm:text-3xl">
                  Mỗi trải nghiệm đều xứng đáng được sẻ chia.
                </h3>

                <p className="mt-4 max-w-md text-xs leading-[1.9] text-[#1f1b18]/50 sm:text-sm">
                  Xưởng hiện chưa nhận được đánh giá nào.
                  Những chia sẻ đầu tiên sẽ giúp mọi người
                  hiểu hơn về trải nghiệm tại đây.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              variants={containerReveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.05 }}
              className="divide-y divide-[#1f1b18]/10 border-t border-[#1f1b18]/10"
            >
              {reviews.map((review) => (
                <motion.article
                  key={review.id}
                  variants={itemReveal}
                  className="group relative py-8 first:pt-8 sm:py-10 md:py-11"
                >
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-8 md:grid-cols-[180px_minmax(0,1fr)] md:gap-12">
                    <div className="flex flex-row items-center justify-between gap-4 sm:flex-col sm:items-start sm:justify-start">
                      <div className="flex flex-col gap-2">
                        <Stars rating={review.rating} />

                        <span className="font-serif text-2xl leading-none text-[#1f1b18]">
                          {Number.isFinite(review.rating)
                            ? review.rating.toFixed(1)
                            : '0.0'}
                          <span className="ml-1 text-sm text-[#1f1b18]/35">
                            / 5
                          </span>
                        </span>
                      </div>

                      <time
                        dateTime={review.createdAt || undefined}
                        className="text-[9px] uppercase tracking-[0.16em] text-[#1f1b18]/35 sm:mt-2 sm:text-[10px]"
                      >
                        {formatDate(review.createdAt)}
                      </time>
                    </div>

                    <div className="min-w-0">
                      {review.comment ? (
                        <p className="max-w-3xl break-words text-[13px] leading-[1.95] text-[#1f1b18]/75 sm:text-sm md:text-[15px]">
                          {review.comment}
                        </p>
                      ) : (
                        <p className="text-xs italic text-[#1f1b18]/35">
                          Khách hàng không để lại nhận xét.
                        </p>
                      )}

                      <div className="mt-6 flex items-center gap-3 opacity-60 transition-opacity duration-500 group-hover:opacity-100">
                        <span className="h-px w-5 bg-[#b45f3c]" />

                        <span className="text-[9px] uppercase tracking-[0.2em] text-[#b45f3c]">
                          Chia sẻ trải nghiệm
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
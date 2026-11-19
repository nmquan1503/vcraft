import type { ReviewListResponse } from '@/types';

interface Props {
  data: ReviewListResponse | null;
  loading: boolean;
}

const formatDate = (iso: string) => {
  try { return new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }); }
  catch { return iso; }
};

function Stars({ rating }: { rating: number }) {
  const filled = Math.round(rating);
  return (
    <span className="tracking-wider">
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
    <section className="max-w-6xl mx-auto px-6 pb-24">
      <div className="border-t border-[#1f1b18]/10 pt-16">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#b45f3c] mb-3">Đánh giá</p>
            <h2 className="font-serif text-3xl md:text-4xl leading-tight">Khách hàng nói gì.</h2>
          </div>
          {!loading && total > 0 && (
            <div className="flex items-baseline gap-3">
              <Stars rating={avg} />
              <span className="text-sm text-[#1f1b18]/50">{avg.toFixed(1)} · {total} đánh giá</span>
            </div>
          )}
        </div>

        {loading ? (
          <p className="text-sm text-[#1f1b18]/40">Đang tải đánh giá…</p>
        ) : reviews.length === 0 ? (
          <p className="text-sm text-[#1f1b18]/40">Chưa có đánh giá nào cho sản phẩm này.</p>
        ) : (
          <div className="divide-y divide-[#1f1b18]/10">
            {reviews.map(r => (
              <div key={r.id} className="py-8 first:pt-0">
                <div className="flex items-center justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <Stars rating={r.rating} />
                    <span className="text-[10px] uppercase tracking-widest text-[#1f1b18]/40">Đã xác thực</span>
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-[#1f1b18]/30">{formatDate(r.createdAt)}</span>
                </div>
                {r.comment && <p className="text-sm md:text-base text-[#1f1b18]/70 leading-relaxed max-w-3xl">{r.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
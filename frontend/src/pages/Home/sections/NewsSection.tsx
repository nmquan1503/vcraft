import { Link } from 'react-router-dom';
import type { News } from '@/types';

interface Props {
  news: News[];
  loading: boolean;
}

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

export default function NewsSection({ news, loading }: Props) {
  return (
    <section id="tin-tuc" className="max-w-6xl mx-auto px-6 py-24 md:py-32">
      <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#b45f3c] mb-4">
            N° 06 — Tin tức
          </p>
          <h2 className="font-serif text-3xl md:text-4xl leading-tight">
            Chuyện làng nghề.
          </h2>
        </div>
        <Link
          to="/news"
          className="text-xs uppercase tracking-widest border-b border-[#1f1b18]/20 pb-1 hover:text-[#b45f3c] transition-colors"
        >
          Xem tất cả tin tức
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-8 md:gap-10">
        {loading ? (
          [1, 2].map((i) => (
            <div key={i}>
              <div className="aspect-[16/10] bg-[#1f1b18]/5 rounded-sm" />
              <p className="mt-4 text-sm text-[#1f1b18]/40">Đang tải…</p>
            </div>
          ))
        ) : news.length === 0 ? (
          <p className="col-span-full text-sm text-[#1f1b18]/40">
            Chưa có tin tức nào được đăng.
          </p>
        ) : (
          news.map((item) => {
            const img = item.images?.[0];
            return (
              <Link key={item.id} to={`/news/${item.id}`} className="group block">
                <div className="aspect-[16/10] bg-[#1f1b18]/5 rounded-sm overflow-hidden">
                  {img ? (
                    <img
                      src={img}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#1f1b18]/25 text-sm">
                      Ảnh tin tức
                    </div>
                  )}
                </div>
                <p className="mt-4 text-[11px] uppercase tracking-[0.2em] text-[#b45f3c]/70">
                  {formatDate(item.publishedAt || item.createdAt)}
                </p>
                <h3 className="mt-2 font-serif text-xl leading-snug group-hover:text-[#b45f3c] transition-colors">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-[#1f1b18]/60 leading-relaxed line-clamp-2">
                  {item.content}
                </p>
              </Link>
            );
          })
        )}
      </div>
    </section>
  );
}
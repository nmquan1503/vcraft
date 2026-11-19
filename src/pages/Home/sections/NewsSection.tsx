import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { News } from '@/types';
import { staggerFast, zoomUp, maskReveal, revealText, viewportRepeat } from '@/lib/motion';

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
    <section id="tin-tuc" className="w-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 py-20 md:py-28 overflow-hidden">
      <motion.div
        className="flex flex-wrap items-end justify-between gap-6 mb-12 md:mb-16"
        variants={revealText}
        initial="hidden"
        whileInView="show"
        viewport={viewportRepeat}
      >
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#b45f3c] mb-4">
            N° 06 — Tin tức
          </p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-tight">
            Chuyện làng nghề.
          </h2>
        </div>
        <Link
          to="/news"
          className="text-sm uppercase tracking-wider border-b border-[#1f1b18]/20 pb-1 hover:text-[#b45f3c] hover:border-[#b45f3c] transition-colors"
        >
          Xem tất cả tin tức
        </Link>
      </motion.div>

      <motion.div
        className="grid md:grid-cols-2 gap-10 md:gap-16"
        variants={staggerFast}
        initial="hidden"
        whileInView="show"
        viewport={viewportRepeat}
      >
        {loading ? (
          [1, 2].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="p-2 bg-[#1f1b18]/[0.03] border border-[#1f1b18]/10">
                <div className="aspect-[16/10] bg-[#1f1b18]/5" />
              </div>
              <div className="mt-5 h-4 bg-[#1f1b18]/5 w-1/4" />
              <div className="mt-3 h-8 bg-[#1f1b18]/5 w-3/4" />
              <div className="mt-2 h-4 bg-[#1f1b18]/5 w-full" />
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
              <motion.div key={item.id} variants={zoomUp}>
                <Link to={`/news/${item.id}`} className="group block cursor-pointer">
                  <div className="relative p-2 bg-white/40 backdrop-blur-sm border border-[#1f1b18]/10 shadow-[0_15px_40px_-20px_rgba(0,0,0,0.1)] transition-colors duration-500 group-hover:border-[#b45f3c]/30">
                    <div className="aspect-[16/10] overflow-hidden bg-[#1f1b18]/5">
                      <motion.div variants={maskReveal} className="w-full h-full">
                        {img ? (
                          <img
                            src={img}
                            alt={item.title}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#1f1b18]/25 text-sm font-medium uppercase tracking-widest">
                            Ảnh tin tức
                          </div>
                        )}
                      </motion.div>
                    </div>
                    
                    <div className="absolute top-4 right-4 w-8 h-8 bg-[#f6f1ea] text-[#1f1b18] rounded-full flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 shadow-sm">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M7 17L17 7M17 7H7M17 7V17" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>

                  <div className="mt-6">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#b45f3c]/80 font-medium">
                      {formatDate(item.publishedAt || item.createdAt)}
                    </p>
                    <h3 className="mt-3 font-serif text-2xl lg:text-3xl leading-snug group-hover:text-[#b45f3c] transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-base text-[#1f1b18]/60 leading-relaxed line-clamp-3">
                      {item.content}
                    </p>
                    
                    <div className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#1f1b18]/50 group-hover:text-[#b45f3c] transition-colors">
                      Đọc tiếp
                      <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })
        )}
      </motion.div>
    </section>
  );
}
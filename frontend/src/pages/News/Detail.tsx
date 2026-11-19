import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { newsApi } from '@/api';
import type { News } from '@/types';

import NewsTypeBadge from './sections/NewsTypeBadge';
import Footer from '@/components/layout/Footer';

const fmt = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString('vi-VN', {
      day: '2-digit', month: 'long', year: 'numeric',
    });
  } catch { return iso; }
};

/** Chia content thành các đoạn để render có khoảng cách */
const splitParagraphs = (content: string) =>
  content.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);

export default function NewsDetail() {
  const { id } = useParams<{ id: string }>();

  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setNews(null);

    newsApi
      .getById(id)
      .then((res) => {
        if (!cancelled) setNews(res);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [id]);

  /* ────── Loading ────── */
  if (loading) {
    return (
      <main className="bg-[#f6f1ea] text-[#1f1b18] pt-32">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-sm text-[#1f1b18]/40">Đang tải…</p>
        </div>
      </main>
    );
  }

  /* ────── Not found ────── */
  if (!news) {
    return (
      <main className="bg-[#f6f1ea] text-[#1f1b18] pt-32">
        <section className="max-w-3xl mx-auto px-6 py-24 text-center">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#b45f3c] mb-4">
            404
          </p>
          <h1 className="font-serif text-3xl md:text-5xl leading-tight">
            Không tìm thấy bài tin.
          </h1>
          <p className="mt-4 text-sm text-[#1f1b18]/50">
            Bài tin có thể đã bị xoá hoặc đường dẫn không đúng.
          </p>
          <Link
            to="/news"
            className="mt-8 inline-flex items-center bg-[#1f1b18] text-[#f6f1ea] rounded-full px-7 py-3 text-xs uppercase tracking-widest hover:bg-[#b45f3c] transition-colors"
          >
            Về trang tin tức
          </Link>
        </section>
      </main>
    );
  }

  const heroImg = news.images[0] ?? null;
  const paragraphs = splitParagraphs(news.content);

  return (
    <main className="bg-[#f6f1ea] text-[#1f1b18] min-h-screen">
      <article className="max-w-3xl mx-auto px-6 pt-24 md:pt-32 pb-24">
        <Link
          to="/news"
          className="inline-block mb-10 text-[11px] uppercase tracking-[0.25em] text-[#1f1b18]/50 hover:text-[#b45f3c] transition-colors"
        >
          ← Tất cả tin tức
        </Link>

        <div className="flex items-center gap-4 mb-6">
          <NewsTypeBadge type={news.type} />
          <span className="text-[10px] uppercase tracking-widest text-[#1f1b18]/40">
            {fmt(news.publishedAt)}
          </span>
        </div>

        <h1 className="font-serif text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.05] tracking-tight">
          {news.title}
        </h1>

        <div className="mt-6 flex items-center gap-3 text-[11px] uppercase tracking-widest text-[#1f1b18]/40">
          <span className="w-6 h-px bg-[#1f1b18]/30" />
          Ban quản lý làng nghề
        </div>

        {/* Ảnh hero */}
        {heroImg && (
          <div className="mt-10 aspect-[16/9] overflow-hidden bg-[#1f1b18]/5">
            <img
              src={heroImg}
              alt={news.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="mt-10 space-y-6">
          {paragraphs.length > 0 ? (
            paragraphs.map((p, i) => (
              <p
                key={i}
                className="text-base md:text-lg text-[#1f1b18]/80 leading-relaxed"
              >
                {p}
              </p>
            ))
          ) : (
            <p className="text-base md:text-lg text-[#1f1b18]/80 leading-relaxed">
              {news.content}
            </p>
          )}
        </div>

        {/* Ảnh phụ */}
        {news.images.length > 1 && (
          <div className="mt-10 grid grid-cols-2 gap-4">
            {news.images.slice(1).map((img, i) => (
              <div key={i} className="aspect-square overflow-hidden bg-[#1f1b18]/5">
                <img
                  src={img}
                  alt={`Ảnh ${i + 2}`}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-[#1f1b18]/10 flex flex-wrap items-center justify-between gap-4">
          <p className="text-[11px] uppercase tracking-widest text-[#1f1b18]/40">
            Cập nhật {fmt(news.updatedAt)}
          </p>
          <Link
            to="/news"
            className="text-[11px] uppercase tracking-widest text-[#b45f3c] hover:underline"
          >
            ← Về trang tin tức
          </Link>
        </div>
      </article>

      <Footer />
    </main>
  );
}
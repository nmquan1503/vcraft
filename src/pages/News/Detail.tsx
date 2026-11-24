import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { newsApi } from '@/api';
import type { News } from '@/types';

import NewsTypeBadge from './sections/NewsTypeBadge';
import Footer from '@/components/layout/Footer';

const fmt = (iso: string) => {
  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) return iso;

  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

const splitParagraphs = (content: string) =>
  content
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

export default function NewsDetail() {
  const { id } = useParams<{ id: string }>();

  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setNews(null);
      return;
    }

    let cancelled = false;

    setLoading(true);
    setError(false);
    setNews(null);

    newsApi
      .getById(id)
      .then((res) => {
        if (!cancelled) setNews(res);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id, retryKey]);

  const images = news?.images ?? [];
  const heroImg = images[0] ?? null;
  const paragraphs = news ? splitParagraphs(news.content) : [];

  return (
    <main className="min-h-screen bg-[#f6f1ea] text-[#1f1b18]">
      {/* Loading */}
      {loading && (
        <section className="mx-auto min-h-[75vh] max-w-5xl px-5 pb-24 pt-32 sm:px-8 md:px-12 lg:px-20">
          <div className="animate-pulse">
            <div className="h-3 w-28 bg-[#1f1b18]/10" />

            <div className="mt-12 h-4 w-32 bg-[#1f1b18]/10" />

            <div className="mt-6 max-w-3xl space-y-3">
              <div className="h-10 w-full bg-[#1f1b18]/10 sm:h-12" />
              <div className="h-10 w-3/4 bg-[#1f1b18]/10 sm:h-12" />
            </div>

            <div className="mt-10 aspect-[16/8] w-full bg-[#1f1b18]/10" />

            <div className="mt-10 max-w-3xl space-y-4">
              <div className="h-3 w-full bg-[#1f1b18]/10" />
              <div className="h-3 w-full bg-[#1f1b18]/10" />
              <div className="h-3 w-4/5 bg-[#1f1b18]/10" />
            </div>
          </div>
        </section>
      )}

      {/* Error */}
      {!loading && error && (
        <section className="flex min-h-[75vh] items-center justify-center px-5 py-24">
          <div className="w-full max-w-xl text-center">
            <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#b45f3c]">
              Có lỗi xảy ra
            </span>

            <h1 className="mt-5 font-serif text-3xl leading-tight sm:text-5xl">
              Không thể tải bài tin.
            </h1>

            <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-[#1f1b18]/50">
              Đã xảy ra lỗi khi tải nội dung. Vui lòng thử lại sau ít phút.
            </p>

            <button
              type="button"
              onClick={() => setRetryKey((key) => key + 1)}
              className="
                mt-8 inline-flex items-center justify-center
                bg-[#1f1b18] px-7 py-3.5
                text-[10px] font-medium uppercase tracking-[0.18em]
                text-[#f6f1ea]
                transition-colors duration-300
                hover:bg-[#b45f3c]
              "
            >
              Thử lại
              <span className="ml-3">↻</span>
            </button>
          </div>
        </section>
      )}

      {/* Not found */}
      {!loading && !error && !news && (
        <section className="flex min-h-[75vh] items-center justify-center px-5 py-24">
          <div className="w-full max-w-xl text-center">
            <div className="relative mx-auto mb-8 flex h-24 w-24 items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-[#b45f3c]/20" />
              <div className="absolute inset-3 rounded-full border border-[#b45f3c]/30" />

              <span className="font-serif text-4xl italic text-[#b45f3c]/70">
                404
              </span>
            </div>

            <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#b45f3c]">
              Không tìm thấy
            </span>

            <h1 className="mt-5 font-serif text-3xl leading-tight sm:text-5xl">
              Bài tin không tồn tại.
            </h1>

            <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-[#1f1b18]/50">
              Bài tin có thể đã bị xoá hoặc đường dẫn không chính xác.
              Hãy quay lại trang tin tức để khám phá những nội dung khác.
            </p>

            <Link
              to="/news"
              className="
                mt-8 inline-flex items-center
                bg-[#1f1b18] px-7 py-3.5
                text-[10px] font-medium uppercase tracking-[0.18em]
                text-[#f6f1ea]
                transition-colors duration-300
                hover:bg-[#b45f3c]
              "
            >
              <span className="mr-3">←</span>
              Về trang tin tức
            </Link>
          </div>
        </section>
      )}

      {/* Article */}
      {!loading && news && (
        <article className="pb-20">
          {/* Article header */}
          <header className="relative overflow-hidden border-b border-[#1f1b18]/10">
            <div className="pointer-events-none absolute -right-32 -top-40 h-[450px] w-[450px] rounded-full border border-[#b45f3c]/10" />
            <div className="pointer-events-none absolute -right-20 -top-28 h-[350px] w-[350px] rounded-full border border-[#b45f3c]/10" />

            <div className="relative mx-auto max-w-[1100px] px-5 pb-12 pt-24 sm:px-8 sm:pb-16 md:px-12 md:pt-32 lg:px-20">
              {/* Breadcrumb */}
              <Link
                to="/news"
                className="
                  group inline-flex items-center gap-3
                  text-[10px] font-medium uppercase tracking-[0.2em]
                  text-[#1f1b18]/45 transition-colors duration-300
                  hover:text-[#b45f3c]
                "
              >
                <span className="transition-transform duration-300 group-hover:-translate-x-1">
                  ←
                </span>
                Tất cả tin tức
              </Link>

              {/* Metadata */}
              <div className="mt-12 flex flex-wrap items-center gap-x-5 gap-y-3">
                <NewsTypeBadge type={news.type} />

                <span className="h-1 w-1 rounded-full bg-[#1f1b18]/25" />

                <span className="text-[10px] uppercase tracking-[0.16em] text-[#1f1b18]/40">
                  {fmt(news.publishedAt)}
                </span>
              </div>

              {/* Title */}
              <h1
                className="
                  mt-7 max-w-4xl
                  font-serif text-[clamp(2.25rem,5.5vw,5rem)]
                  leading-[1.08] tracking-tight
                  text-[#1f1b18]
                "
              >
                {news.title}
              </h1>

              {/* Author */}
              <div className="mt-8 flex items-center gap-3">
                <span className="h-px w-8 bg-[#b45f3c]" />

                <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#1f1b18]/45">
                  Ban quản lý làng nghề
                </span>
              </div>

              {/* Decorative bottom label */}
              <div className="mt-12 flex items-center justify-between border-t border-[#1f1b18]/10 pt-5">
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#1f1b18]/30">
                  Bát Tràng · Tin tức & thông báo
                </span>

                <span className="font-serif text-xl italic text-[#b45f3c]/60">
                  vCraft
                </span>
              </div>
            </div>
          </header>

          {/* Article body */}
          <div className="mx-auto max-w-[1100px] px-5 pt-10 sm:px-8 sm:pt-14 md:px-12 lg:px-20">
            {/* Hero image */}
            {heroImg && (
              <figure className="group relative">
                <div className="aspect-[16/9] overflow-hidden bg-[#e9e1d7] sm:aspect-[16/8]">
                  <img
                    src={heroImg}
                    alt={news.title}
                    className="
                      h-full w-full object-cover
                      transition-transform duration-700 ease-out
                      group-hover:scale-[1.02]
                    "
                  />
                </div>

                <figcaption className="mt-3 flex items-center justify-between">
                  <span className="text-[9px] uppercase tracking-[0.16em] text-[#1f1b18]/35">
                    Hình ảnh làng nghề Bát Tràng
                  </span>

                  <span className="text-[9px] uppercase tracking-[0.16em] text-[#1f1b18]/35">
                    01 / {String(images.length).padStart(2, '0')}
                  </span>
                </figcaption>
              </figure>
            )}

            {/* Content */}
            <div className="mx-auto mt-12 max-w-[720px] sm:mt-16">
              <div className="mb-8 flex items-center gap-4">
                <span className="h-px w-8 bg-[#b45f3c]" />

                <span className="text-[9px] font-medium uppercase tracking-[0.22em] text-[#b45f3c]">
                  Nội dung bài viết
                </span>
              </div>

              <div className="space-y-6">
                {paragraphs.length > 0 ? (
                  paragraphs.map((paragraph, index) => (
                    <p
                      key={index}
                      className={`
                        text-[15px] leading-[2]
                        text-[#1f1b18]/75
                        sm:text-base sm:leading-[2.05]
                        ${
                          index === 0
                            ? 'first-letter:float-left first-letter:mr-2 first-letter:font-serif first-letter:text-5xl first-letter:leading-[0.85] first-letter:text-[#b45f3c]'
                            : ''
                        }
                      `}
                    >
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <p className="whitespace-pre-line text-[15px] leading-[2] text-[#1f1b18]/75 sm:text-base">
                    {news.content}
                  </p>
                )}
              </div>
            </div>

            {/* Additional images */}
            {images.length > 1 && (
              <section className="mx-auto mt-16 max-w-[900px] sm:mt-20">
                <div className="mb-7 flex items-end justify-between border-b border-[#1f1b18]/10 pb-4">
                  <div>
                    <span className="text-[9px] uppercase tracking-[0.22em] text-[#b45f3c]">
                      Hình ảnh
                    </span>

                    <h2 className="mt-2 font-serif text-2xl sm:text-3xl">
                      Khoảnh khắc làng nghề
                    </h2>
                  </div>

                  <span className="pb-1 text-[9px] uppercase tracking-[0.16em] text-[#1f1b18]/35">
                    {images.length} hình ảnh
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {images.slice(1).map((img, index) => (
                    <figure
                      key={`${img}-${index}`}
                      className={`
                        group overflow-hidden bg-[#e9e1d7]
                        ${
                          index === 0 && images.length === 2
                            ? 'sm:col-span-2'
                            : ''
                        }
                      `}
                    >
                      <div
                        className={`
                          overflow-hidden
                          ${
                            index === 0 && images.length === 2
                              ? 'aspect-[16/8]'
                              : 'aspect-[4/3]'
                          }
                        `}
                      >
                        <img
                          src={img}
                          alt={`Hình ảnh ${index + 2}`}
                          loading="lazy"
                          className="
                            h-full w-full object-cover
                            transition-transform duration-700 ease-out
                            group-hover:scale-[1.04]
                          "
                        />
                      </div>

                      <figcaption className="flex items-center justify-between border-b border-[#1f1b18]/10 py-3">
                        <span className="text-[9px] uppercase tracking-[0.16em] text-[#1f1b18]/40">
                          Bát Tràng
                        </span>

                        <span className="text-[9px] text-[#1f1b18]/35">
                          {String(index + 2).padStart(2, '0')}
                        </span>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </section>
            )}

            {/* Article footer */}
            <footer className="mx-auto mt-16 max-w-[720px] border-t border-[#1f1b18]/15 pt-7 sm:mt-20">
              <div className="flex flex-wrap items-center justify-between gap-5">
                <div>
                  <span className="text-[9px] uppercase tracking-[0.2em] text-[#1f1b18]/35">
                    Cập nhật lần cuối
                  </span>

                  <p className="mt-2 text-xs text-[#1f1b18]/65">
                    {fmt(news.updatedAt)}
                  </p>
                </div>

                <Link
                  to="/news"
                  className="
                    group inline-flex items-center gap-3
                    text-[10px] font-medium uppercase tracking-[0.16em]
                    text-[#b45f3c]
                  "
                >
                  <span className="transition-transform duration-300 group-hover:-translate-x-1">
                    ←
                  </span>

                  Về trang tin tức
                </Link>
              </div>
            </footer>
          </div>
        </article>
      )}

      <Footer />
    </main>
  );
}
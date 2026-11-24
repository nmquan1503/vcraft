import { useEffect, useState } from 'react';

import { newsApi } from '@/api';
import type { News, NewsType } from '@/types';

import NewsCard from './sections/NewsCard';
import NewsFilter from './sections/NewsFilter';
import Footer from '@/components/layout/Footer';

type FilterValue = NewsType | 'ALL';

function NewsSkeleton() {
  return (
    <div className="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="aspect-[16/10] bg-[#1f1b18]/10" />

          <div className="flex items-center justify-between py-5">
            <div className="h-5 w-28 bg-[#1f1b18]/10" />
            <div className="h-3 w-20 bg-[#1f1b18]/10" />
          </div>

          <div className="space-y-3">
            <div className="h-6 w-full bg-[#1f1b18]/10" />
            <div className="h-6 w-3/4 bg-[#1f1b18]/10" />
          </div>

          <div className="mt-5 space-y-2">
            <div className="h-3 w-full bg-[#1f1b18]/10" />
            <div className="h-3 w-full bg-[#1f1b18]/10" />
            <div className="h-3 w-2/3 bg-[#1f1b18]/10" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function NewsList() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterValue>('ALL');
  const [total, setTotal] = useState(0);
  const [error, setError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(false);

    newsApi
      .list({
        limit: 100,
        type: filter === 'ALL' ? undefined : filter,
      })
      .then((res) => {
        if (cancelled) return;

        setNews(res.data);
        setTotal(res.totalElements);
      })
      .catch(() => {
        if (cancelled) return;

        setError(true);
        setNews([]);
        setTotal(0);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [filter, retryKey]);

  return (
    <main className="min-h-screen bg-[#f6f1ea] text-[#1f1b18]">
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Decorative circles */}
        <div className="pointer-events-none absolute -right-40 -top-36 h-[600px] w-[600px] rounded-full border border-[#b45f3c]/10" />
        <div className="pointer-events-none absolute -right-24 -top-20 h-[440px] w-[440px] rounded-full border border-[#b45f3c]/10" />
        <div className="pointer-events-none absolute -right-8 top-8 h-[280px] w-[280px] rounded-full border border-[#b45f3c]/10" />

        <div className="relative mx-auto max-w-[1440px] px-5 pb-14 pt-28 sm:px-8 sm:pt-32 md:px-12 md:pb-20 lg:px-20">
          {/* Eyebrow */}
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-[#b45f3c]" />

            <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#b45f3c]">
              Tin tức cộng đồng
            </p>
          </div>

          {/* Main heading */}
          <div className="mt-8 flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div className="max-w-3xl">
              <h1 className="font-serif text-[clamp(3.2rem,8vw,7rem)] leading-[0.92] tracking-tight">
                Chuyện
                <br />
                của{' '}
                <em className="font-normal text-[#b45f3c]">
                  làng.
                </em>
              </h1>

              <p className="mt-8 max-w-xl text-[13px] leading-[1.9] text-[#1f1b18]/60 sm:text-sm">
                Những câu chuyện, thông báo và hoạt động từ cộng đồng
                Bát Tràng. Cập nhật giá nguyên liệu, lịch sinh hoạt
                và các chính sách dành cho hộ gia đình làng nghề.
              </p>
            </div>

            {/* Article count */}
            <div className="flex items-center gap-5 border-t border-[#1f1b18]/15 pt-5 md:min-w-[180px] md:border-l md:border-t-0 md:pb-2 md:pl-7 md:pt-0">
              <div>
                <p className="font-serif text-5xl leading-none text-[#b45f3c]">
                  {loading ? '—' : String(total).padStart(2, '0')}
                </p>

                <p className="mt-3 text-[9px] font-medium uppercase tracking-[0.2em] text-[#1f1b18]/40">
                  Bài viết
                </p>
              </div>

              <span className="h-12 w-px bg-[#1f1b18]/10" />

              <p className="max-w-[90px] text-[10px] uppercase leading-[1.8] tracking-[0.12em] text-[#1f1b18]/40">
                Tiếng nói từ làng nghề
              </p>
            </div>
          </div>

          {/* Bottom decoration */}
          <div className="mt-14 flex items-center justify-between border-t border-[#1f1b18]/10 pt-5 sm:mt-20">
            <span className="text-[9px] uppercase tracking-[0.2em] text-[#1f1b18]/35">
              Bát Tràng · Hà Nội
            </span>

            <span className="font-serif text-xl italic text-[#b45f3c]/60">
              vCraft
            </span>
          </div>
        </div>
      </section>

      {/* Filter */}
      <section className="sticky top-0 z-20 border-y border-[#1f1b18]/10 bg-[#f6f1ea]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-5 py-5 sm:px-8 md:flex-row md:items-center md:justify-between md:px-12 lg:px-20">
          <div className="flex items-center gap-3">
            <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#1f1b18]/35">
              Danh mục
            </span>

            <span className="h-px w-6 bg-[#1f1b18]/20" />
          </div>

          <NewsFilter
            active={filter}
            onChange={setFilter}
          />
        </div>
      </section>

      {/* News grid */}
      <section className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 sm:py-16 md:px-12 lg:px-20">
        {/* Section heading */}
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[9px] font-medium uppercase tracking-[0.22em] text-[#b45f3c]">
              Bảng tin làng nghề
            </p>

            <h2 className="mt-3 font-serif text-3xl tracking-tight sm:text-4xl">
              {filter === 'ALL'
                ? 'Tin tức mới nhất'
                : filter === 'PRICE'
                  ? 'Giá nguyên liệu'
                  : filter === 'SCHEDULE'
                    ? 'Lịch sinh hoạt'
                    : 'Chính sách hỗ trợ'}
            </h2>
          </div>

          {!loading && !error && news.length > 0 && (
            <p className="text-[10px] uppercase tracking-[0.15em] text-[#1f1b18]/40">
              Hiển thị {news.length} / {total} bài viết
            </p>
          )}
        </div>

        {/* Loading */}
        {loading && <NewsSkeleton />}

        {/* Error */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center border-y border-[#1f1b18]/10 py-24 text-center">
            <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#b45f3c]">
              Có lỗi xảy ra
            </span>

            <h3 className="mt-5 font-serif text-2xl sm:text-3xl">
              Không thể tải tin tức.
            </h3>

            <p className="mt-3 max-w-md text-sm leading-7 text-[#1f1b18]/50">
              Đã xảy ra lỗi khi kết nối đến máy chủ.
              Vui lòng thử lại sau ít phút.
            </p>

            <button
              type="button"
              onClick={() => setRetryKey((key) => key + 1)}
              className="
                mt-7 inline-flex items-center gap-3
                bg-[#1f1b18] px-7 py-3.5
                text-[10px] font-medium uppercase tracking-[0.16em]
                text-[#f6f1ea]
                transition-colors duration-300
                hover:bg-[#b45f3c]
              "
            >
              Thử lại
              <span>↻</span>
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && news.length === 0 && (
          <div className="relative flex flex-col items-center justify-center overflow-hidden border-y border-[#1f1b18]/10 py-24 text-center sm:py-32">
            <div className="pointer-events-none absolute h-64 w-64 rounded-full border border-[#b45f3c]/10" />
            <div className="pointer-events-none absolute h-44 w-44 rounded-full border border-[#b45f3c]/15" />

            <span className="relative font-serif text-6xl italic text-[#b45f3c]/35">
              B
            </span>

            <h3 className="relative mt-6 font-serif text-2xl text-[#1f1b18]/65 sm:text-3xl">
              Chưa có bài tin nào.
            </h3>

            <p className="relative mt-3 max-w-sm px-4 text-sm leading-7 text-[#1f1b18]/40">
              Hiện chưa có nội dung trong danh mục này.
              Hãy quay lại sau để cập nhật những thông tin mới nhất.
            </p>

            {filter !== 'ALL' && (
              <button
                type="button"
                onClick={() => setFilter('ALL')}
                className="
                  relative mt-7 border-b border-[#b45f3c]
                  pb-1 text-[10px] font-medium uppercase tracking-[0.16em]
                  text-[#b45f3c] transition-opacity hover:opacity-60
                "
              >
                Xem tất cả tin tức →
              </button>
            )}
          </div>
        )}

        {/* News cards */}
        {!loading && !error && news.length > 0 && (
          <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-16">
            {news.map((item) => (
              <NewsCard
                key={item.id}
                news={item}
              />
            ))}
          </div>
        )}

        {/* Bottom note */}
        {!loading && !error && news.length > 0 && (
          <div className="mt-16 flex items-center justify-center gap-4 border-t border-[#1f1b18]/10 pt-8">
            <span className="h-px w-8 bg-[#b45f3c]/50" />

            <p className="text-center text-[9px] uppercase tracking-[0.2em] text-[#1f1b18]/35">
              Cùng gìn giữ và lan tỏa tinh hoa làng nghề
            </p>

            <span className="h-px w-8 bg-[#b45f3c]/50" />
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
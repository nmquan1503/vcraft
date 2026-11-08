import { useEffect, useState } from 'react';
import { newsApi } from '@/api';
import type { News, NewsType } from '@/types';

import NewsCard from './sections/NewsCard';
import NewsFilter from './sections/NewsFilter';
import Footer from '@/components/layout/Footer';

type FilterValue = NewsType | 'ALL';

export default function NewsList() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterValue>('ALL');
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

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
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [filter]);

  return (
    <main className="bg-[#f6f1ea] text-[#1f1b18] min-h-screen">
      {/* Header */}
      <section className="max-w-6xl mx-auto px-6 pt-24 md:pt-32 pb-10">
        <p className="text-[11px] uppercase tracking-[0.3em] text-[#b45f3c] mb-6">
          Tin tức cộng đồng
        </p>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h1 className="font-serif text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] tracking-tight max-w-2xl">
            Chuyện
            <br />
            của <em className="italic text-[#b45f3c]">làng</em>.
          </h1>
          <p className="text-sm text-[#1f1b18]/40 pb-2">
            {loading ? '…' : `${total} bài`}
          </p>
        </div>
        <p className="mt-6 text-sm text-[#1f1b18]/60 leading-relaxed max-w-xl">
          Thông báo từ Ban quản lý làng nghề — giá nguyên liệu, lịch sinh hoạt,
          chính sách hỗ trợ hộ gia đình.
        </p>
      </section>

      {/* Filter */}
      <section className="max-w-6xl mx-auto px-6 pb-4 border-b border-[#1f1b18]/10">
        <NewsFilter active={filter} onChange={setFilter} />
      </section>

      {/* Grid */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        {loading ? (
          <p className="text-sm text-[#1f1b18]/40">Đang tải…</p>
        ) : news.length === 0 ? (
          <div className="py-20 text-center">
            <p className="font-serif text-2xl text-[#1f1b18]/40">
              Chưa có bài tin nào.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {news.map((n) => (
              <NewsCard key={n.id} news={n} />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
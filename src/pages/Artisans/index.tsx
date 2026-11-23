import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { artisanApi } from '@/api';
import type { ArtisanProfile } from '@/types';

import ArtisansHeader from './sections/ArtisansHeader';
import FilterBar from './sections/FilterBar';
import ArtisanGrid from './sections/ArtisanGrid';
import Pagination from './sections/Pagination';
import Footer from '@/components/layout/Footer';
import { PAGE_SIZE } from './constants';

function parsePage(raw: string | null): number {
  const n = Number(raw);
  return Number.isInteger(n) && n >= 1 ? n : 1;
}

function EmptyState({
  search,
  onClear,
}: {
  search: string;
  onClear: () => void;
}) {
  return (
    <section className="max-w-6xl mx-auto px-6 py-24 md:py-32 text-center">
      <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#1f1b18]/5 mb-6">
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
          <circle cx="11" cy="11" r="7" strokeLinecap="round" />
          <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
        </svg>
      </div>
      <p className="font-serif text-xl md:text-2xl text-[#1f1b18]/60">
        {search
          ? <>Không tìm thấy nghệ nhân nào cho &ldquo;{search}&rdquo;</>
          : 'Chưa có nghệ nhân nào'}
      </p>
      <p className="mt-2 text-sm text-[#1f1b18]/40 max-w-md mx-auto">
        {search
          ? 'Thử từ khoá khác, hoặc xoá tìm kiếm để xem toàn bộ danh sách.'
          : 'Danh sách nghệ nhân sẽ xuất hiện ở đây khi có dữ liệu.'}
      </p>
      {search && (
        <button
          type="button"
          onClick={onClear}
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 text-[11px] uppercase tracking-widest border border-[#1f1b18]/20 rounded-full text-[#1f1b18]/70 hover:border-[#b45f3c] hover:text-[#b45f3c] active:scale-[0.97] transition-[border-color,color,transform] duration-200"
        >
          Xoá tìm kiếm
        </button>
      )}
    </section>
  );
}

export default function Artisans() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') ?? '';
  const page = parsePage(searchParams.get('page'));

  const [search, setSearch] = useState(q);

  const [artisans, setArtisans] = useState<ArtisanProfile[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    setSearch(q);
  }, [q]);

  useEffect(() => {
    if (search.trim() === q) return;
    const t = setTimeout(() => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          const v = search.trim();
          if (v) next.set('q', v);
          else next.delete('q');
          next.delete('page');
          return next;
        },
        { replace: true }
      );
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 300);
    return () => clearTimeout(t);
  }, [search, q, setSearchParams]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    artisanApi
      .list({
        page,
        limit: PAGE_SIZE,
        search: q || undefined,
      })
      .then((res) => {
        if (cancelled) return;

        if (res.data.length === 0 && page > 1 && res.totalPages > 0) {
          const target = Math.max(1, res.totalPages);
          setSearchParams(
            (prev) => {
              const next = new URLSearchParams(prev);
              if (target === 1) next.delete('page');
              else next.set('page', String(target));
              return next;
            },
            { replace: true }
          );
          return;
        }

        setArtisans(res.data);
        setTotal(res.totalElements);
        setTotalPages(res.totalPages);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Không thể tải nghệ nhân.');
        setArtisans([]);
        setTotal(0);
        setTotalPages(1);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [q, page, reloadKey, setSearchParams]);

  const handlePageChange = useCallback(
    (nextPage: number) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (nextPage === 1) next.delete('page');
          else next.set('page', String(nextPage));
          return next;
        },
        { replace: false }
      );
    },
    [setSearchParams]
  );

  const handleClearSearch = useCallback(() => {
    setSearch('');
  }, []);

  const showEmpty = !loading && !error && artisans.length === 0;

  return (
    <main className="bg-[#f6f1ea] text-[#1f1b18]">
      <ArtisansHeader total={total} />
      <FilterBar search={search} onSearchChange={setSearch} loading={loading} />

      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {loading
          ? 'Đang tải danh sách nghệ nhân'
          : error
            ? 'Lỗi tải dữ liệu'
            : `${total} nghệ nhân`}
      </span>

      {error ? (
        <section className="max-w-6xl mx-auto px-6 py-24 md:py-32 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#e85555]/10 mb-6">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-[#e85555]"
              aria-hidden="true"
            >
              <path
                d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <p className="font-serif text-xl md:text-2xl text-[#1f1b18]/70">
            Không thể tải nghệ nhân
          </p>
          <p className="mt-2 text-sm text-[#1f1b18]/40 max-w-md mx-auto">{error}</p>
          <button
            type="button"
            onClick={() => setReloadKey((k) => k + 1)}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 text-[11px] uppercase tracking-widest border border-[#1f1b18]/20 rounded-full text-[#1f1b18]/70 hover:border-[#b45f3c] hover:text-[#b45f3c] active:scale-[0.97] transition-[border-color,color,transform] duration-200"
          >
            Thử lại
            <span aria-hidden="true">↻</span>
          </button>
        </section>
      ) : showEmpty ? (
        <EmptyState search={q} onClear={handleClearSearch} />
      ) : (
        <>
          <ArtisanGrid artisans={artisans} loading={loading} />
          <Pagination
            page={page}
            totalPages={totalPages}
            onChange={handlePageChange}
          />
        </>
      )}

      <Footer />
    </main>
  );
}
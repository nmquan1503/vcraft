import { useEffect, useMemo, useState } from 'react';
import { batchApi, artisanApi } from '@/api';
import { getUser } from '@/utils/tokenStorage';
import type { Batch, BatchStatus, ArtisanProfile } from '@/types';

import BatchCard from './sections/BatchCard';
import BatchFilter from './sections/BatchFilter';
import Pagination from './sections/Pagination';
import Footer from '@/components/layout/Footer';

type FilterValue = BatchStatus | 'ALL' | 'MINE';

const PAGE_SIZE = 10;

function BatchSkeleton() {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse overflow-hidden rounded-2xl border border-[#1f1b18]/10 bg-white/40"
        >
          <div className="flex gap-5 p-5 sm:p-6">
            <div className="h-28 w-28 shrink-0 rounded-xl bg-[#1f1b18]/[0.06] sm:h-36 sm:w-36" />

            <div className="flex min-w-0 flex-1 flex-col gap-3 py-1">
              <div className="h-3 w-24 rounded-full bg-[#1f1b18]/[0.07]" />
              <div className="h-5 w-3/4 rounded-full bg-[#1f1b18]/[0.08]" />
              <div className="h-3 w-full rounded-full bg-[#1f1b18]/[0.06]" />
              <div className="h-3 w-2/3 rounded-full bg-[#1f1b18]/[0.06]" />
            </div>
          </div>

          <div className="border-t border-[#1f1b18]/[0.06] px-5 py-4">
            <div className="h-3 w-32 rounded-full bg-[#1f1b18]/[0.06]" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ isMine }: { isMine: boolean }) {
  return (
    <div className="relative overflow-hidden py-24 text-center sm:py-32">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#b45f3c]/10" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#b45f3c]/10" />

      <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#b45f3c]/20 text-[#b45f3c]">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-7 w-7"
          stroke="currentColor"
          strokeWidth="1.2"
        >
          <path
            d="M4 8.5 12 4l8 4.5v8L12 21l-8-4.5v-8Z"
            strokeLinejoin="round"
          />
          <path d="m4.5 8.5 7.5 4.2 7.5-4.2M12 12.7V21" />
        </svg>
      </div>

      <p className="relative mt-7 font-serif text-2xl text-[#1f1b18]/70 sm:text-3xl">
        {isMine
          ? 'Chưa có lô sản xuất nào.'
          : 'Chưa có câu chuyện nào được bắt đầu.'}
      </p>

      <p className="relative mx-auto mt-3 max-w-sm text-sm leading-7 text-[#1f1b18]/40">
        {isMine
          ? 'Những lô gốm do xưởng của bạn tạo ra sẽ xuất hiện tại đây.'
          : 'Các lô sản xuất sẽ được cập nhật tại đây khi nghệ nhân bắt đầu tạo lô mới.'}
      </p>
    </div>
  );
}

export default function Batches() {
  const user = getUser();
  const isArtisan = user?.role === 'ARTISAN';

  const [batches, setBatches] = useState<Batch[]>([]);
  const [artisans, setArtisans] = useState<ArtisanProfile[]>([]);
  const [myArtisanId, setMyArtisanId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const [filter, setFilter] = useState<FilterValue>('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Prefetch artisan names and current artisan profile
  useEffect(() => {
    let cancelled = false;

    const loadArtisans = async () => {
      try {
        const response = await artisanApi.list({ limit: 100 });

        if (!cancelled) {
          setArtisans(response.data);
        }
      } catch (err) {
        console.error('Failed to load artisans:', err);
      }

      if (isArtisan) {
        try {
          const artisan = await artisanApi.getMe();

          if (!cancelled) {
            setMyArtisanId(artisan?.id ?? null);
          }
        } catch (err) {
          console.error('Failed to load artisan profile:', err);
        }
      }
    };

    loadArtisans();

    return () => {
      cancelled = true;
    };
  }, [isArtisan]);

  // Fetch batches
  useEffect(() => {
    let cancelled = false;

    const fetchBatches = async () => {
      setLoading(true);
      setError(false);

      try {
        const isMine = filter === 'MINE';

        const statusParam: BatchStatus | undefined =
          filter === 'IN_PROGRESS' || filter === 'COMPLETED'
            ? filter
            : undefined;

        const res = await batchApi.list({
          page: isMine ? 1 : page,
          limit: isMine ? 100 : PAGE_SIZE,
          status: statusParam,
        });

        if (cancelled) return;

        let data = res.data;
        let total = res.totalElements;
        let pages = res.totalPages;

        if (isMine) {
          if (myArtisanId) {
            data = data.filter((batch) => batch.artisanId === myArtisanId);
          } else {
            data = [];
          }

          total = data.length;
          pages = 1;
        }

        setBatches(data);
        setTotalCount(total);
        setTotalPages(pages);
      } catch (err) {
        console.error('Failed to load batches:', err);

        if (!cancelled) {
          setError(true);
          setBatches([]);
          setTotalCount(0);
          setTotalPages(1);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchBatches();

    return () => {
      cancelled = true;
    };
  }, [filter, page, myArtisanId, refreshKey]);

  const handleFilterChange = (value: FilterValue) => {
    setFilter(value);
    setPage(1);
  };

  const handleRetry = () => {
    setRefreshKey((current) => current + 1);
  };

  // Lookup workshop name by artisanId
  const artisanNameMap = useMemo(() => {
    const map: Record<string, string> = {};

    artisans.forEach((artisan) => {
      map[artisan.id] = artisan.workshopName;
    });

    return map;
  }, [artisans]);

  return (
    <main className="min-h-screen overflow-hidden bg-[#f6f1ea] text-[#1f1b18]">
      {/* Hero */}
      <section className="relative mx-auto max-w-[1440px] px-5 pb-12 pt-24 sm:px-8 sm:pt-28 md:px-12 md:pb-16 lg:px-20 lg:pt-36">
        {/* Decorative elements */}
        <div className="pointer-events-none absolute -right-24 top-20 hidden h-80 w-80 rounded-full border border-[#b45f3c]/10 lg:block" />
        <div className="pointer-events-none absolute -right-12 top-32 hidden h-56 w-56 rounded-full border border-[#b45f3c]/10 lg:block" />

        <div className="relative">
          <div className="mb-8 flex items-center gap-3">
            <span className="h-px w-8 bg-[#b45f3c]" />
            <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#b45f3c] sm:text-[11px]">
              Không gian truy xuất
            </p>
          </div>

          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div className="max-w-3xl">
              <h1 className="font-serif text-[clamp(3rem,7vw,6.5rem)] leading-[0.95] tracking-[-0.045em]">
                Mỗi lô gốm
                <br />
                một{' '}
                <em className="font-normal text-[#b45f3c]">
                  câu chuyện.
                </em>
              </h1>

              <p className="mt-7 max-w-lg text-sm leading-7 text-[#1f1b18]/55 sm:text-base sm:leading-8">
                Theo dấu hành trình của từng sản phẩm gốm Bát Tràng,
                từ những ngày đầu tạo hình đến khi hoàn thiện tại xưởng.
              </p>
            </div>

            <div className="flex items-end gap-4 border-t border-[#1f1b18]/15 pt-5 md:min-w-[150px] md:border-l md:border-t-0 md:pb-2 md:pl-6 md:pt-0">
              <div>
                <p className="font-serif text-4xl leading-none text-[#b45f3c] sm:text-5xl">
                  {loading ? '—' : totalCount.toLocaleString('vi-VN')}
                </p>
                <p className="mt-3 text-[9px] font-medium uppercase tracking-[0.2em] text-[#1f1b18]/45">
                  Lô sản xuất
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter */}
      <section className="sticky top-0 z-20 border-y border-[#1f1b18]/10 bg-[#f6f1ea]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-5 py-5 sm:px-8 md:flex-row md:items-center md:justify-between md:px-12 lg:px-20">
          <div>
            <p className="text-[9px] font-medium uppercase tracking-[0.22em] text-[#1f1b18]/35">
              Khám phá
            </p>
            <p className="mt-1 font-serif text-lg">
              Các lô sản xuất
            </p>
          </div>

          <BatchFilter
            active={filter}
            onChange={handleFilterChange}
            showMine={isArtisan && !!myArtisanId}
          />
        </div>
      </section>

      {/* Batch list */}
      <section className="mx-auto min-h-[420px] max-w-[1440px] px-5 py-12 sm:px-8 sm:py-16 md:px-12 lg:px-20">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-[#b45f3c]">
              Bộ sưu tập
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl">
              {filter === 'MINE'
                ? 'Lô của xưởng'
                : filter === 'IN_PROGRESS'
                  ? 'Đang được tạo tác'
                  : filter === 'COMPLETED'
                    ? 'Những lô đã hoàn thiện'
                    : 'Tất cả các lô'}
            </h2>
          </div>

          {!loading && !error && batches.length > 0 && (
            <p className="hidden text-xs text-[#1f1b18]/40 sm:block">
              {batches.length} / {totalCount} kết quả
            </p>
          )}
        </div>

        {loading ? (
          <BatchSkeleton />
        ) : error ? (
          <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
            <p className="font-serif text-2xl text-[#1f1b18]/70">
              Không thể tải danh sách lô.
            </p>

            <p className="mt-3 max-w-sm text-sm leading-6 text-[#1f1b18]/40">
              Đã có lỗi xảy ra khi kết nối đến máy chủ. Vui lòng thử lại sau.
            </p>

            <button
              type="button"
              onClick={handleRetry}
              className="mt-7 inline-flex items-center gap-2 border-b border-[#b45f3c] pb-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[#b45f3c] transition-colors hover:text-[#1f1b18]"
            >
              Thử tải lại
              <span>↗</span>
            </button>
          </div>
        ) : batches.length === 0 ? (
          <EmptyState isMine={filter === 'MINE'} />
        ) : (
          <>
            <div className="grid gap-5 md:grid-cols-2">
              {batches.map((batch) => (
                <BatchCard
                  key={batch.id}
                  batch={batch}
                  artisanName={artisanNameMap[batch.artisanId]}
                />
              ))}
            </div>

            {filter !== 'MINE' && (
              <Pagination
                page={page}
                totalPages={totalPages}
                onChange={setPage}
              />
            )}
          </>
        )}
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
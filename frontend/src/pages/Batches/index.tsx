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

export default function Batches() {
  const user = getUser();
  const isArtisan = user?.role === 'ARTISAN';

  const [batches, setBatches] = useState<Batch[]>([]);
  const [artisans, setArtisans] = useState<ArtisanProfile[]>([]);
  const [myArtisanId, setMyArtisanId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState<FilterValue>('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Prefetch artisan names + xưởng của tôi
  useEffect(() => {
    artisanApi.list({ limit: 100 }).then((r) => setArtisans(r.data));
    if (isArtisan) {
      artisanApi.getMe().then((a) => setMyArtisanId(a?.id ?? null));
    }
  }, [isArtisan]);

  // Fetch batches
  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    (async () => {
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

        if (isMine && myArtisanId) {
          data = data.filter((b) => b.artisanId === myArtisanId);
          total = data.length;
          pages = 1;
        }

        setBatches(data);
        setTotalCount(total);
        setTotalPages(pages);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [filter, page, myArtisanId]);

  const handleFilterChange = (v: FilterValue) => {
    setFilter(v);
    setPage(1);
  };

  // Lookup tên xưởng theo artisanId
  const artisanNameMap = useMemo(() => {
    const map: Record<string, string> = {};
    artisans.forEach((a) => { map[a.id] = a.workshopName; });
    return map;
  }, [artisans]);

  return (
    <main className="bg-[#f6f1ea] text-[#1f1b18] min-h-screen">
      {/* Header */}
      <section className="max-w-6xl mx-auto px-6 pt-24 md:pt-32 pb-10">
        <p className="text-[11px] uppercase tracking-[0.3em] text-[#b45f3c] mb-6">
          Lô sản xuất
        </p>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h1 className="font-serif text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] tracking-tight max-w-2xl">
            Mỗi lô gốm
            <br />
            một <em className="italic text-[#b45f3c]">câu chuyện</em>.
          </h1>
          <p className="text-sm text-[#1f1b18]/40 pb-2">
            {loading ? '…' : `${totalCount} lô`}
          </p>
        </div>
      </section>

      {/* Filter */}
      <section className="max-w-6xl mx-auto px-6 pb-4 border-b border-[#1f1b18]/10">
        <BatchFilter
          active={filter}
          onChange={handleFilterChange}
          showMine={isArtisan && !!myArtisanId}
        />
      </section>

      {/* List */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        {loading ? (
          <p className="text-sm text-[#1f1b18]/40">Đang tải…</p>
        ) : batches.length === 0 ? (
          <div className="py-20 text-center">
            <p className="font-serif text-2xl text-[#1f1b18]/40">
              {filter === 'MINE'
                ? 'Xưởng bạn chưa có lô sản xuất nào.'
                : 'Chưa có lô sản xuất nào.'}
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {batches.map((b) => (
              <BatchCard
                key={b.id}
                batch={b}
                artisanName={artisanNameMap[b.artisanId]}
              />
            ))}
          </div>
        )}

        {filter !== 'MINE' && (
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        )}
      </section>

      <Footer />
    </main>
  );
}
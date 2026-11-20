import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '@/api/client';
import { toApiError } from '@/api/_helpers';
import type { Batch, BatchStatus, PageResponse } from '@/types';
import BatchCard from './sections/BatchCard';
import BatchFilter from './sections/BatchFilter';
import Pagination from './sections/Pagination';
import Footer from '@/components/layout/Footer';

type FilterValue = BatchStatus | 'ALL' | 'MINE';
export default function Batches() {
  const [filter, setFilter] = useState<FilterValue>('ALL');
  const [page, setPage] = useState(1);
  const [data, setData] = useState<PageResponse<Batch> | null>(null);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  const [loaded, setLoaded] = useState('');
  const query = JSON.stringify([filter, page, retry]);
  useEffect(() => {
    let active = true;
    client.get<PageResponse<Batch>>('/batches', { params: { page, limit: 10, status: filter === 'ALL' || filter === 'MINE' ? undefined : filter } })
      .then(response => { if (active) { setData(response.data); setError(''); } })
      .catch(failure => { if (active) { setError(toApiError(failure).message); setData(null); } })
      .finally(() => { if (active) setLoaded(query); });
    return () => { active = false; };
  }, [filter, page, query]);
  const loading = loaded !== query;
  return <main className="bg-[#f6f1ea] text-[#1f1b18] min-h-screen">
    <section className="max-w-6xl mx-auto px-6 pt-24 md:pt-32 pb-10 space-y-6">
      <p className="text-[11px] uppercase tracking-[0.3em] text-[#b45f3c]">Lô sản xuất của xưởng</p>
      <h1 className="font-serif text-4xl md:text-6xl">Mỗi lô gốm, một câu chuyện.</h1>
      <p>{loading ? 'Đang tải…' : `${data?.totalElements ?? 0} lô`}</p>
      <Link className="underline inline-block" to="/dashboard/artisan/batches/new">+ Tạo lô sản xuất</Link>
      <BatchFilter active={filter} onChange={value => { setFilter(value); setPage(1); }} showMine={false} />
    </section>
    <section className="max-w-6xl mx-auto px-6 py-12">
      {loading ? <p>Đang tải…</p> : error ? <div role="alert" className="space-y-4">
        <p>{error}</p><button className="border rounded px-4 py-2" onClick={() => setRetry(value => value + 1)}>Thử lại</button>
      </div> : <>
        {!data?.data.length ? <p>Xưởng bạn chưa có lô phù hợp.</p> : <div className="grid gap-5 md:grid-cols-2">{data.data.map(batch => <BatchCard key={batch.id} batch={batch} />)}</div>}
        <Pagination page={page} totalPages={data?.totalPages ?? 0} onChange={setPage} />
      </>}
    </section>
    <Footer />
  </main>;
}

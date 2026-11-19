import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { quoteApi } from '@/api';
import { getAccessToken, getUser } from '@/utils/tokenStorage';
import type { QuoteRequest, QuoteStatus } from '@/types';

import QuoteCard from './sections/QuoteCard';
import QuoteFilters from './sections/QuoteFilters';
import Footer from '@/components/layout/Footer';

export default function QuoteList() {
  const navigate = useNavigate();
  const user = getUser();
  const isArtisan = user?.role === 'ARTISAN';
  const variant: 'buyer' | 'artisan' = isArtisan ? 'artisan' : 'buyer';

  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [loadedQuery, setLoadedQuery] = useState<string|null>(null);
  const [page,setPage]=useState(1);
  const [canNext,setCanNext]=useState(false);
  const [status, setStatus] = useState<QuoteStatus | 'ALL'>('ALL');

  const queryKey=JSON.stringify([isArtisan,status,page]);
  const loading=loadedQuery!==queryKey;

  useEffect(() => {
    if (!getAccessToken()) {
      navigate('/login?redirect=/quote', { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    if (!getAccessToken()) return;
    let cancelled = false;

    (async () => {
      try {
        if (isArtisan) {
          const res = await quoteApi.listIncoming({page,limit:10,status:status==='ALL'?undefined:status});
          if (!cancelled) {setQuotes(res);setCanNext(res.length===10);}
        } else {
          const res = await quoteApi.listMine({
            page, limit: 10,
            status: status === 'ALL' ? undefined : status,
          });
          if (!cancelled) {setQuotes(res.data);setCanNext(page<res.totalPages);}
        }
      } finally {
        if (!cancelled) setLoadedQuery(queryKey);
      }
    })();

    return () => { cancelled = true; };
  }, [isArtisan, status, page, queryKey]);

  if (!getAccessToken()) return null;

  return (
    <main className="bg-[#f6f1ea] text-[#1f1b18] min-h-screen">
      <section className="max-w-6xl mx-auto px-6 pt-24 md:pt-32 pb-10">
        <p className="text-[11px] uppercase tracking-[0.3em] text-[#b45f3c] mb-6">
          {isArtisan ? 'Yêu cầu gửi tới xưởng' : 'Yêu cầu báo giá'}
        </p>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h1 className="font-serif text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] tracking-tight max-w-2xl">
            {isArtisan ? (
              <>Đơn đặt<br /><em className="italic text-[#b45f3c]">mua buôn</em>.</>
            ) : (
              <>Yêu cầu<br />của <em className="italic text-[#b45f3c]">bạn</em>.</>
            )}
          </h1>
          {!isArtisan && (
            <Link
              to="/quote/new"
              className="inline-flex items-center bg-[#1f1b18] text-[#f6f1ea] rounded-full px-7 py-3 text-xs uppercase tracking-widest hover:bg-[#b45f3c] transition-colors"
            >
              + Tạo yêu cầu mới
            </Link>
          )}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-4 border-b border-[#1f1b18]/10">
        <QuoteFilters variant={variant} active={status} onChange={value=>{setStatus(value);setPage(1);}} />
      </section>

      <section className="max-w-6xl mx-auto px-6 py-12">
        {loading ? (
          <p className="text-sm text-[#1f1b18]/40">Đang tải…</p>
        ) : quotes.length === 0 ? (
          <div className="py-20 text-center">
            <p className="font-serif text-2xl text-[#1f1b18]/40">
              {isArtisan ? 'Chưa có yêu cầu nào.' : 'Bạn chưa có yêu cầu báo giá nào.'}
            </p>
            {!isArtisan && (
              <Link
                to="/quote/new"
                className="mt-6 inline-flex items-center bg-[#1f1b18] text-[#f6f1ea] rounded-full px-7 py-3 text-xs uppercase tracking-widest hover:bg-[#b45f3c] transition-colors"
              >
                Tạo yêu cầu đầu tiên
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {quotes.map((q) => (
              <QuoteCard key={q.id} quote={q} variant={variant} />
            ))}
          </div>
        )}
      </section>

      <div className="mx-auto max-w-6xl px-6 pb-12 flex items-center gap-4">
        <button disabled={page<=1||loading} onClick={()=>setPage(page-1)} className="border px-4 py-2 disabled:opacity-40">Trang trước</button>
        <span>Trang {page}</span>
        <button disabled={!canNext||loading} onClick={()=>setPage(page+1)} className="border px-4 py-2 disabled:opacity-40">Trang sau</button>
      </div>
      <Footer />
    </main>
  );
}
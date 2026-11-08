import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { traceApi } from '@/api';
import type { TraceStory, QrInfo } from '@/types';

import TraceHero from './sections/TraceHero';
import BatchInfo from './sections/BatchInfo';
import ProductionTimeline from './sections/ProductionTimeline';
import ArtisanFooter from './sections/ArtisanFooter';
import Footer from '@/components/layout/Footer';

export default function Trace() {
  const { batchId } = useParams<{ batchId: string }>();

  const [story, setStory] = useState<TraceStory | null>(null);
  const [qr, setQr] = useState<QrInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!batchId) return;
    let cancelled = false;
    setLoading(true);
    setStory(null);

    (async () => {
      const [s, q] = await Promise.all([
        traceApi.getStory(batchId),
        traceApi.getQr(batchId),
      ]);
      if (cancelled) return;
      setStory(s);
      setQr(q);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [batchId]);

  /* ────── Loading ────── */
  if (loading) {
    return (
      <main className="bg-[#1f1b18] text-[#f6f1ea] min-h-screen pt-32">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#d9a08b]">
            Đang tải câu chuyện…
          </p>
        </div>
      </main>
    );
  }

  /* ────── Not found ────── */
  if (!story) {
    return (
      <main className="bg-[#f6f1ea] text-[#1f1b18] pt-24 md:pt-32">
        <section className="max-w-6xl mx-auto px-6 py-24 text-center">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#b45f3c] mb-4">
            404
          </p>
          <h1 className="font-serif text-3xl md:text-5xl leading-tight">
            Không tìm thấy lô sản phẩm.
          </h1>
          <p className="mt-4 text-sm text-[#1f1b18]/50">
            Mã QR có thể đã hết hạn hoặc không đúng.
          </p>
          <Link
            to="/products"
            className="mt-8 inline-flex items-center bg-[#1f1b18] text-[#f6f1ea] rounded-full px-7 py-3 text-xs uppercase tracking-widest hover:bg-[#b45f3c] transition-colors"
          >
            Về bộ sưu tập
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-[#f6f1ea] text-[#1f1b18]">
      <TraceHero
        batch={story.batch}
        artisan={story.artisan}
        qr={qr}
        totalLogs={story.logs.length}
      />
      <BatchInfo batch={story.batch} />
      <ProductionTimeline logs={story.logs} />
      <ArtisanFooter artisan={story.artisan} />
      <Footer />
    </main>
  );
}
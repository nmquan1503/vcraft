import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';

import { traceApi } from '@/api';
import type { TraceStory, QrInfo } from '@/types';

import TraceHero from './sections/TraceHero';
import BatchInfo from './sections/BatchInfo';
import ProductionTimeline from './sections/ProductionTimeline';
import ArtisanFooter from './sections/ArtisanFooter';
import Footer from '@/components/layout/Footer';

const ease = [0.22, 1, 0.36, 1] as const;

const reveal: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease,
    },
  },
};

function TraceSkeleton() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#1f1b18] text-[#f6f1ea]">
      <section className="relative px-5 pb-20 pt-28 sm:px-8 sm:pt-32 md:px-12 md:pb-28 lg:px-20">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-14 h-3 w-36 animate-pulse rounded-full bg-[#f6f1ea]/10" />

          <div className="grid items-center gap-12 md:grid-cols-12 md:gap-10 lg:gap-20">
            <div className="mx-auto w-full max-w-[300px] sm:max-w-[340px] md:col-span-4 md:mx-0 md:max-w-none">
              <div className="aspect-square animate-pulse rounded-tl-[75px] rounded-br-[75px] bg-[#f6f1ea]/[0.06] sm:rounded-tl-[95px] sm:rounded-br-[95px]" />
            </div>

            <div className="space-y-7 md:col-span-8">
              <div className="h-3 w-40 animate-pulse rounded-full bg-[#d9a08b]/20" />

              <div className="space-y-3">
                <div className="h-12 w-full max-w-xl animate-pulse rounded-lg bg-[#f6f1ea]/10 sm:h-16" />
                <div className="h-12 w-3/4 max-w-md animate-pulse rounded-lg bg-[#f6f1ea]/10 sm:h-16" />
              </div>

              <div className="h-4 w-full max-w-lg animate-pulse rounded-full bg-[#f6f1ea]/10" />
              <div className="h-4 w-2/3 max-w-md animate-pulse rounded-full bg-[#f6f1ea]/10" />

              <div className="grid grid-cols-2 gap-6 border-t border-[#f6f1ea]/10 pt-8 sm:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="space-y-3">
                    <div className="h-2 w-20 animate-pulse rounded-full bg-[#d9a08b]/15" />
                    <div className="h-4 w-24 animate-pulse rounded-full bg-[#f6f1ea]/10" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#f6f1ea]/10 px-5 py-20 sm:px-8 md:px-12 lg:px-20">
        <div className="mx-auto grid max-w-[1440px] gap-12 md:grid-cols-12">
          <div className="space-y-5 md:col-span-4">
            <div className="h-3 w-32 animate-pulse rounded-full bg-[#1f1b18]/10" />
            <div className="h-10 w-48 animate-pulse rounded-lg bg-[#1f1b18]/10" />
          </div>

          <div className="space-y-8 md:col-span-8">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="space-y-4 border-t border-[#1f1b18]/10 pt-6"
              >
                <div className="h-3 w-28 animate-pulse rounded-full bg-[#1f1b18]/10" />
                <div className="h-5 w-48 animate-pulse rounded-full bg-[#1f1b18]/10" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function TraceError({ onRetry }: { onRetry: () => void }) {
  return (
    <main className="flex min-h-screen flex-col bg-[#f6f1ea] text-[#1f1b18]">
      <section className="relative flex flex-1 items-center justify-center overflow-hidden px-5 py-28 sm:px-8 md:py-36">
        <div className="pointer-events-none absolute -right-32 -top-32 h-[450px] w-[450px] rounded-full border border-[#b45f3c]/[0.07]" />
        <div className="pointer-events-none absolute -right-16 -top-16 h-[300px] w-[300px] rounded-full border border-[#b45f3c]/[0.07]" />

        <motion.div
          variants={reveal}
          initial="hidden"
          animate="visible"
          className="relative mx-auto max-w-lg text-center"
        >
          <p className="mb-6 text-[10px] uppercase tracking-[0.3em] text-[#b45f3c]">
            Có lỗi xảy ra
          </p>

          <h1 className="font-serif text-4xl leading-tight tracking-tight sm:text-5xl">
            Không thể tải
            <span className="block italic text-[#b45f3c]">
              câu chuyện.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-sm text-sm leading-[1.9] text-[#1f1b18]/55">
            Đã có sự cố khi tải thông tin truy xuất nguồn gốc. Vui lòng thử
            lại sau ít phút.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center justify-center rounded-full bg-[#1f1b18] px-8 py-3.5 text-[10px] uppercase tracking-[0.18em] text-[#f6f1ea] transition-colors duration-300 hover:bg-[#b45f3c]"
            >
              Thử tải lại
              <span className="ml-3">↻</span>
            </button>

            <Link
              to="/products"
              className="inline-flex items-center justify-center rounded-full border border-[#1f1b18]/15 px-8 py-3.5 text-[10px] uppercase tracking-[0.18em] text-[#1f1b18]/65 transition-colors duration-300 hover:border-[#b45f3c] hover:text-[#b45f3c]"
            >
              Về bộ sưu tập
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}

function TraceNotFound() {
  return (
    <main className="flex min-h-screen flex-col bg-[#f6f1ea] text-[#1f1b18]">
      <section className="relative flex flex-1 items-center justify-center overflow-hidden px-5 py-28 sm:px-8 md:py-36">
        <div className="pointer-events-none absolute -left-40 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full border border-[#b45f3c]/[0.06]" />
        <div className="pointer-events-none absolute -left-20 top-1/2 h-[340px] w-[340px] -translate-y-1/2 rounded-full border border-[#b45f3c]/[0.06]" />

        <motion.div
          variants={reveal}
          initial="hidden"
          animate="visible"
          className="relative mx-auto max-w-lg text-center"
        >
          <p className="mb-6 font-serif text-7xl italic text-[#b45f3c]/25 sm:text-8xl">
            404
          </p>

          <h1 className="font-serif text-3xl leading-tight tracking-tight sm:text-5xl">
            Không tìm thấy
            <span className="block italic text-[#b45f3c]">
              lô sản phẩm.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-sm text-sm leading-[1.9] text-[#1f1b18]/55">
            Mã truy xuất có thể không chính xác hoặc lô sản phẩm không còn
            tồn tại trong hệ thống.
          </p>

          <Link
            to="/products"
            className="group mt-10 inline-flex items-center gap-4 rounded-full bg-[#1f1b18] px-8 py-4 text-[10px] uppercase tracking-[0.18em] text-[#f6f1ea] transition-colors duration-300 hover:bg-[#b45f3c]"
          >
            Về bộ sưu tập
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}

export default function Trace() {
  const { batchId } = useParams<{ batchId: string }>();

  const [story, setStory] = useState<TraceStory | null>(null);
  const [qr, setQr] = useState<QrInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    if (!batchId) {
      setStory(null);
      setQr(null);
      setLoading(false);
      setLoadError(false);
      return;
    }

    setLoading(true);
    setLoadError(false);
    setStory(null);
    setQr(null);

    const loadTrace = async () => {
      const [storyResult, qrResult] = await Promise.allSettled([
        traceApi.getStory(batchId),
        traceApi.getQr(batchId),
      ]);

      if (cancelled) return;

      if (storyResult.status === 'rejected') {
        console.error('Failed to load trace story:', storyResult.reason);
        setStory(null);
        setLoadError(true);
      } else {
        setStory(storyResult.value);
      }

      if (qrResult.status === 'fulfilled') {
        setQr(qrResult.value);
      } else {
        console.error('Failed to load trace QR:', qrResult.reason);
        setQr(null);
      }

      setLoading(false);
    };

    loadTrace();

    return () => {
      cancelled = true;
    };
  }, [batchId, retryCount]);

  if (loading) {
    return <TraceSkeleton />;
  }

  if (loadError) {
    return (
      <TraceError
        onRetry={() => setRetryCount((count) => count + 1)}
      />
    );
  }

  if (!story) {
    return <TraceNotFound />;
  }

  return (
    <main className="min-h-screen overflow-x-clip bg-[#f6f1ea] text-[#1f1b18]">
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
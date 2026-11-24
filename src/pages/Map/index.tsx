import { useCallback, useEffect, useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { mapApi } from '@/api';
import type { MapPin } from '@/types';

import MapHeader from './sections/MapHeader';
import VillageMap from './sections/VillageMap';
import ArtisanSidebar from './sections/ArtisanSidebar';
import Footer from '@/components/layout/Footer';

const ease = [0.22, 1, 0.36, 1] as const;

const reveal: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease,
    },
  },
};

function SidebarSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="flex animate-pulse items-center gap-4 border border-[#1f1b18]/[0.07] p-3 sm:p-4"
        >
          <div className="h-[68px] w-[68px] shrink-0 rounded-tl-[26px] rounded-br-[26px] bg-[#1f1b18]/[0.07] sm:h-[76px] sm:w-[76px]" />

          <div className="min-w-0 flex-1 space-y-3">
            <div className="h-2 w-16 rounded-full bg-[#1f1b18]/10" />
            <div className="h-4 w-3/4 rounded-full bg-[#1f1b18]/10" />
            <div className="h-2 w-24 rounded-full bg-[#1f1b18]/10" />
          </div>
        </div>
      ))}
    </div>
  );
}

function MapSkeleton() {
  return (
    <div className="relative h-[460px] animate-pulse overflow-hidden rounded-tl-[55px] rounded-br-[55px] bg-[#1f1b18]/[0.06] sm:h-[540px] lg:h-[650px]">
      <div className="absolute left-5 top-5 h-9 w-36 rounded-full bg-[#1f1b18]/[0.07]" />

      <div className="absolute left-[35%] top-[30%] h-4 w-4 rounded-full bg-[#b45f3c]/30" />
      <div className="absolute left-[55%] top-[45%] h-4 w-4 rounded-full bg-[#1f1b18]/20" />
      <div className="absolute left-[70%] top-[60%] h-4 w-4 rounded-full bg-[#b45f3c]/30" />

      <div className="absolute bottom-5 left-5 h-10 w-48 rounded-full bg-[#1f1b18]/[0.07]" />
    </div>
  );
}

function MapError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center border border-[#1f1b18]/10 bg-[#1f1b18]/[0.02] px-6 py-12 text-center sm:min-h-[520px]">
      <span className="font-serif text-5xl italic text-[#b45f3c]/60">
        ✳
      </span>

      <p className="mt-5 text-[10px] uppercase tracking-[0.25em] text-[#b45f3c]">
        Kết nối bị gián đoạn
      </p>

      <h2 className="mt-3 font-serif text-2xl text-[#1f1b18] sm:text-3xl">
        Chưa thể tải bản đồ.
      </h2>

      <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#1f1b18]/45">
        Đã xảy ra lỗi khi tải danh sách xưởng gốm. Hãy thử lại sau ít phút.
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-7 inline-flex items-center gap-3 rounded-full bg-[#1f1b18] px-6 py-3 text-[10px] uppercase tracking-[0.16em] text-[#f6f1ea] transition-all duration-300 hover:bg-[#b45f3c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b45f3c] focus-visible:ring-offset-2"
      >
        Thử tải lại
        <span className="text-sm">↗</span>
      </button>
    </div>
  );
}

export default function MapPage() {
  const [pins, setPins] = useState<MapPin[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [openOnly, setOpenOnly] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const fetchPins = async () => {
      setLoading(true);
      setLoadError(false);

      try {
        const res = await mapApi.pins({ openOnly });

        if (cancelled) return;

        setPins(res);

        setActiveId((prev) =>
          prev && res.some((pin) => pin.id === prev) ? prev : null
        );
      } catch (error) {
        if (cancelled) return;

        console.error('Failed to load map pins:', error);
        setLoadError(true);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchPins();

    return () => {
      cancelled = true;
    };
  }, [openOnly, retryCount]);

  const handleSelect = useCallback((id: string) => {
    setActiveId((prev) => (prev === id ? null : id));
  }, []);

  const handleToggleOpenOnly = useCallback(() => {
    setOpenOnly((prev) => !prev);
    setActiveId(null);
  }, []);

  const handleRetry = useCallback(() => {
    setRetryCount((prev) => prev + 1);
  }, []);

  const openCount = pins.filter((pin) => pin.openStatus).length;
  const locatedCount = pins.filter(
    (pin) => pin.lat != null && pin.lng != null
  ).length;

  return (
    <main className="min-h-screen overflow-x-clip bg-[#f6f1ea] text-[#1f1b18]">
      <MapHeader
        total={pins.length}
        openOnly={openOnly}
        onToggleOpenOnly={handleToggleOpenOnly}
        loading={loading}
      />

      <section className="px-5 pb-20 sm:px-8 md:px-12 md:pb-28 lg:px-20">
        <div className="mx-auto max-w-[1440px]">
          {loadError ? (
            <MapError onRetry={handleRetry} />
          ) : (
            <>
              <motion.div
                variants={reveal}
                initial="hidden"
                animate="visible"
                className="mb-6 flex flex-col gap-4 border-b border-[#1f1b18]/10 pb-5 sm:flex-row sm:items-end sm:justify-between"
              >
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-[#b45f3c]">
                    Khám phá không gian
                  </p>

                  <h2 className="mt-2 font-serif text-2xl tracking-tight sm:text-3xl">
                    Những địa chỉ đáng ghé thăm.
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] uppercase tracking-[0.14em] text-[#1f1b18]/40">
                  <span>
                    <strong className="font-medium text-[#1f1b18]">
                      {loading ? '—' : pins.length}
                    </strong>{' '}
                    xưởng
                  </span>

                  <span className="h-3 w-px bg-[#1f1b18]/15" />

                  <span>
                    <strong className="font-medium text-[#b45f3c]">
                      {loading ? '—' : openCount}
                    </strong>{' '}
                    đang mở
                  </span>

                  <span className="h-3 w-px bg-[#1f1b18]/15" />

                  <span>
                    <strong className="font-medium text-[#1f1b18]">
                      {loading ? '—' : locatedCount}
                    </strong>{' '}
                    có vị trí
                  </span>
                </div>
              </motion.div>

              <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-12 md:gap-6 lg:gap-8">
                <motion.aside
                  variants={reveal}
                  initial="hidden"
                  animate="visible"
                  className="order-2 min-w-0 md:order-1 md:col-span-5 lg:col-span-4"
                >
                  <div className="mb-4 flex items-end justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.22em] text-[#1f1b18]/40">
                        Danh sách xưởng
                      </p>

                      <p className="mt-1 font-serif text-xl">
                        Chọn một điểm đến
                      </p>
                    </div>

                    {!loading && (
                      <span className="text-xs text-[#1f1b18]/35">
                        {pins.length} kết quả
                      </span>
                    )}
                  </div>

                  {loading ? (
                    <SidebarSkeleton />
                  ) : (
                    <ArtisanSidebar
                      pins={pins}
                      activeId={activeId}
                      onSelect={setActiveId}
                    />
                  )}
                </motion.aside>

                <motion.div
                  variants={reveal}
                  initial="hidden"
                  animate="visible"
                  className="order-1 min-w-0 md:order-2 md:col-span-7 lg:col-span-8"
                >
                  {loading ? (
                    <MapSkeleton />
                  ) : (
                    <VillageMap
                      pins={pins}
                      activeId={activeId}
                      onMarkerClick={setActiveId}
                    />
                  )}
                </motion.div>
              </div>

              {!loading && pins.length > 0 && (
                <motion.div
                  variants={reveal}
                  initial="hidden"
                  animate="visible"
                  className="mt-8 flex flex-col gap-3 border-t border-[#1f1b18]/10 pt-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <p className="max-w-xl text-xs leading-relaxed text-[#1f1b18]/45">
                    Mỗi điểm đánh dấu là một xưởng gốm tại Bát Tràng. Chọn
                    xưởng trên danh sách hoặc trực tiếp trên bản đồ để khám
                    phá thêm thông tin.
                  </p>

                  <span className="shrink-0 text-[9px] uppercase tracking-[0.2em] text-[#b45f3c]">
                    Bát Tràng · Hà Nội
                  </span>
                </motion.div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
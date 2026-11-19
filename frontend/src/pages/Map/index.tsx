import { useEffect, useState } from 'react';
import { mapApi } from '@/api';
import type { MapPin } from '@/types';

import MapHeader from './sections/MapHeader';
import VillageMap from './sections/VillageMap';
import ArtisanSidebar from './sections/ArtisanSidebar';
import Footer from '@/components/layout/Footer';

export default function MapPage() {
  const [pins, setPins] = useState<MapPin[]>([]);
  const [loading, setLoading] = useState(true);
  const [openOnly, setOpenOnly] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    mapApi
      .pins({ openOnly })
      .then((res) => {
        if (cancelled) return;
        setPins(res);
        setActiveId((prev) =>
          prev && res.some((p) => p.id === prev) ? prev : null
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [openOnly]);

  const handleSelect = (id: string) => {
    setActiveId(id);
  };

  return (
    <main className="bg-[#f6f1ea] text-[#1f1b18]">
      <MapHeader
        total={pins.length}
        openOnly={openOnly}
        onToggleOpenOnly={() => setOpenOnly((v) => !v)}
        loading={loading}
      />

      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1 order-2 md:order-1">
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#1f1b18]/40 mb-3">
              Danh sách xưởng
            </p>
            {loading ? (
              <p className="text-sm text-[#1f1b18]/30 p-4">Đang tải…</p>
            ) : (
              <ArtisanSidebar
                pins={pins}
                activeId={activeId}
                onSelect={handleSelect}
              />
            )}
          </div>

          <div className="md:col-span-2 order-1 md:order-2">
            {loading ? (
              <div className="w-full h-[500px] md:h-[600px] bg-[#1f1b18]/5 flex items-center justify-center text-sm text-[#1f1b18]/30">
                Đang tải bản đồ…
              </div>
            ) : (
              <VillageMap
                pins={pins}
                activeId={activeId}
                onMarkerClick={handleSelect}
              />
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
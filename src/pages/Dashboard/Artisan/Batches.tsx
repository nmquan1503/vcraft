import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { artisanApi, batchApi } from '@/api';
import type { Batch, ArtisanProfile } from '@/types';

import DashboardNav from './sections/DashboardNav';
import BatchStatusBadge from '@/pages/Batches/sections/BatchStatusBadge';
import Footer from '@/components/layout/Footer';

const fmt = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    });
  } catch { return iso; }
};

export default function MyBatches() {
  const [artisan, setArtisan] = useState<ArtisanProfile | null>(null);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const art = await artisanApi.getMe();
      if (cancelled) return;
      setArtisan(art);

      if (art) {
        const res = await batchApi.list({ limit: 100 });
        if (cancelled) return;
        // Filter theo artisanId vì API không có filter trực tiếp
        setBatches(res.data.filter((b) => b.artisanId === art.id));
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <main className="bg-[#f6f1ea] text-[#1f1b18] min-h-screen">
      <section className="max-w-6xl mx-auto px-6 pt-24 md:pt-32 pb-8">
        <p className="text-[11px] uppercase tracking-[0.3em] text-[#b45f3c] mb-4">
          Lô sản xuất
        </p>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h1 className="font-serif text-[clamp(2.5rem,5vw,4rem)] leading-[0.95] tracking-tight">
            Các lô<br />của <em className="italic text-[#b45f3c]">xưởng</em>.
          </h1>
          <Link
            to="/dashboard/artisan/batches/new"
            className="inline-flex items-center bg-[#1f1b18] text-[#f6f1ea] rounded-full px-7 py-3 text-xs uppercase tracking-widest hover:bg-[#b45f3c] transition-colors"
          >
            + Tạo lô mới
          </Link>
        </div>
      </section>

      <DashboardNav />

      <section className="max-w-6xl mx-auto px-6 py-12">
        {loading ? (
          <p className="text-sm text-[#1f1b18]/40">Đang tải…</p>
        ) : !artisan ? (
          <p className="text-sm text-[#1f1b18]/60">Không tìm thấy hồ sơ xưởng.</p>
        ) : batches.length === 0 ? (
          <div className="py-20 text-center">
            <p className="font-serif text-2xl text-[#1f1b18]/40">
              Xưởng chưa có lô sản xuất nào.
            </p>
            <Link
              to="/dashboard/artisan/batches/new"
              className="mt-6 inline-flex items-center bg-[#1f1b18] text-[#f6f1ea] rounded-full px-7 py-3 text-xs uppercase tracking-widest hover:bg-[#b45f3c] transition-colors"
            >
              Tạo lô đầu tiên
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {batches.map((b) => (
              <Link
                key={b.id}
                to={`/dashboard/artisan/batches/${b.id}`}
                className="group block border border-[#1f1b18]/10 hover:border-[#1f1b18]/30 transition-colors"
              >
                <div className="flex gap-4 p-5">
                  <div className="shrink-0 bg-[#f6f1ea] border border-[#1f1b18]/10 p-2">
                    <img
                      src={b.qrCodeUrl}
                      alt={`QR ${b.name}`}
                      className="w-20 h-20"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <BatchStatusBadge status={b.status} />
                    <h3 className="mt-2 font-serif text-lg leading-tight group-hover:text-[#b45f3c] transition-colors">
                      {b.name}
                    </h3>
                    <p className="mt-1 text-[11px] uppercase tracking-widest text-[#1f1b18]/40">
                      {b.quantity} sản phẩm · {fmt(b.createdAt)}
                    </p>
                    <p className="mt-3 text-[10px] uppercase tracking-widest text-[#b45f3c] group-hover:underline">
                      Quản lý nhật ký →
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
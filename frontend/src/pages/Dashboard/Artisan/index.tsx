import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { artisanApi, productApi, batchApi } from '@/api';
import type { ArtisanProfile } from '@/types';

import DashboardNav from './sections/DashboardNav';
import Footer from '@/components/layout/Footer';

export default function ArtisanOverview() {
  const [artisan, setArtisan] = useState<ArtisanProfile | null>(null);
  const [productCount, setProductCount] = useState(0);
  const [batchCount, setBatchCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const art = await artisanApi.getMe();
      if (cancelled) return;
      setArtisan(art);

      if (art) {
        const [productsRes, batchesRes] = await Promise.all([
          productApi.list({ artisanId: art.id, limit: 100 }),
          batchApi.list({ limit: 100 }),
        ]);
        if (cancelled) return;
        setProductCount(productsRes.totalElements);
        setBatchCount(batchesRes.data.filter((b) => b.artisanId === art.id).length);
      }
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="bg-[#f6f1ea] text-[#1f1b18] min-h-screen">
      <section className="max-w-6xl mx-auto px-6 pt-24 md:pt-32 pb-8">
        <p className="text-[11px] uppercase tracking-[0.3em] text-[#b45f3c] mb-4">
          Xưởng của bạn
        </p>
        {loading ? (
          <p className="text-sm text-[#1f1b18]/40">Đang tải…</p>
        ) : !artisan ? (
          <p className="text-sm text-[#1f1b18]/60">
            Không tìm thấy hồ sơ xưởng. Liên hệ ban quản lý.
          </p>
        ) : (
          <>
            <h1 className="font-serif text-[clamp(2.5rem,5vw,4rem)] leading-[0.95] tracking-tight">
              {artisan.ownerName}
            </h1>
            <p className="mt-3 text-sm uppercase tracking-[0.2em] text-[#1f1b18]/50">
              {artisan.workshopName} · {artisan.district}
            </p>
          </>
        )}
      </section>

      <DashboardNav />

      {artisan && (
        <>
          {/* Stats */}
          <section className="max-w-6xl mx-auto px-6 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[#1f1b18]/10 border border-[#1f1b18]/10">
              <div className="p-6 text-center">
                <p className="font-serif text-3xl md:text-4xl">{productCount}</p>
                <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-[#1f1b18]/50">
                  Sản phẩm
                </p>
              </div>
              <div className="p-6 text-center">
                <p className="font-serif text-3xl md:text-4xl">{batchCount}</p>
                <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-[#1f1b18]/50">
                  Lô sản xuất
                </p>
              </div>
              <div className="p-6 text-center">
                <p className="font-serif text-3xl md:text-4xl">
                  {artisan.openStatus ? 'Mở' : 'Đóng'}
                </p>
                <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-[#1f1b18]/50">
                  Trạng thái
                </p>
              </div>
              <div className="p-6 text-center">
                <p className="font-serif text-3xl md:text-4xl">
                  {artisan.certificates.length}
                </p>
                <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-[#1f1b18]/50">
                  Chứng nhận
                </p>
              </div>
            </div>
          </section>

          {/* Actions */}
          <section className="max-w-6xl mx-auto px-6 pb-24">
            <h2 className="font-serif text-2xl mb-6">Thao tác nhanh</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              <Link
                to="/dashboard/artisan/products/new"
                className="border border-[#1f1b18]/15 p-6 hover:border-[#b45f3c] hover:bg-[#b45f3c]/5 transition-colors group"
              >
                <p className="text-[10px] uppercase tracking-widest text-[#b45f3c] mb-3">
                  + Đăng sản phẩm
                </p>
                <p className="font-serif text-xl group-hover:text-[#b45f3c] transition-colors">
                  Thêm tác phẩm mới vào xưởng
                </p>
              </Link>
              <Link
                to="/dashboard/artisan/batches/new"
                className="border border-[#1f1b18]/15 p-6 hover:border-[#b45f3c] hover:bg-[#b45f3c]/5 transition-colors group"
              >
                <p className="text-[10px] uppercase tracking-widest text-[#b45f3c] mb-3">
                  + Tạo lô
                </p>
                <p className="font-serif text-xl group-hover:text-[#b45f3c] transition-colors">
                  Tạo lô sản xuất mới, sinh mã QR
                </p>
              </Link>
              <Link
                to="/dashboard/artisan/profile"
                className="border border-[#1f1b18]/15 p-6 hover:border-[#b45f3c] hover:bg-[#b45f3c]/5 transition-colors group"
              >
                <p className="text-[10px] uppercase tracking-widest text-[#b45f3c] mb-3">
                  ✎ Hồ sơ
                </p>
                <p className="font-serif text-xl group-hover:text-[#b45f3c] transition-colors">
                  Cập nhật câu chuyện gia đình, ảnh xưởng
                </p>
              </Link>
            </div>

            <div className="mt-12 grid sm:grid-cols-2 gap-4">
              <Link
                to="/quote"
                className="border border-[#1f1b18]/10 p-6 hover:bg-[#1f1b18]/5 transition-colors"
              >
                <p className="text-[10px] uppercase tracking-widest text-[#1f1b18]/40 mb-2">
                  Yêu cầu báo giá
                </p>
                <p className="font-serif text-lg">
                  Xem các yêu cầu đang chờ xưởng chào giá →
                </p>
              </Link>
              <Link
                to={`/artisans/${artisan.id}`}
                className="border border-[#1f1b18]/10 p-6 hover:bg-[#1f1b18]/5 transition-colors"
              >
                <p className="text-[10px] uppercase tracking-widest text-[#1f1b18]/40 mb-2">
                  Trang công khai
                </p>
                <p className="font-serif text-lg">
                  Xem xưởng của bạn như khách hàng thấy →
                </p>
              </Link>
            </div>
          </section>
        </>
      )}

      <Footer />
    </main>
  );
}
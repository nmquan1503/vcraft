import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '@/api';
import type { AdminStats } from '@/types';

import AdminNav from './sections/AdminNav';
import StatCard from './sections/StatCard';
import Footer from '@/components/layout/Footer';

export default function AdminOverview() {
  const [stats, setStats] = useState<Partial<AdminStats>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    adminApi
      .getStats()
      .then((res) => {
        if (!cancelled) setStats(res ?? {});
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const num = (v: number | undefined) => (loading ? '…' : v ?? 0);

  return (
    <main className="bg-[#f6f1ea] text-[#1f1b18] min-h-screen">
      <section className="max-w-6xl mx-auto px-6 pt-24 md:pt-32 pb-8">
        <p className="text-[11px] uppercase tracking-[0.3em] text-[#b45f3c] mb-4">
          Ban quản lý làng nghề
        </p>
        <h1 className="font-serif text-[clamp(2.5rem,5vw,4rem)] leading-[0.95] tracking-tight">
          Tổng quan<br />làng <em className="italic text-[#b45f3c]">nghề</em>.
        </h1>
        <p className="mt-4 text-sm text-[#1f1b18]/50 max-w-lg">
          Kiểm duyệt hộ gia đình, quản lý tin tức cộng đồng, theo dõi hoạt động
          của làng gốm Bát Tràng.
        </p>
      </section>

      <AdminNav />

      {/* Stats grid */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Hộ gia đình"
            value={num(stats.totalArtisans)}
            hint={`${stats.pendingArtisans ?? 0} chờ duyệt`}
          />
          <StatCard
            label="Người dùng"
            value={num(stats.totalUsers)}
          />
          <StatCard
            label="Sản phẩm"
            value={num(stats.totalProducts)}
          />
          <StatCard
            label="Yêu cầu báo giá"
            value={num(stats.totalQuotes)}
          />
        </div>
      </section>

      {/* Actions */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <h2 className="font-serif text-2xl mb-6">Thao tác nhanh</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            to="/dashboard/admin/artisans"
            className="border border-[#1f1b18]/15 p-6 hover:border-[#b45f3c] hover:bg-[#b45f3c]/5 transition-colors group"
          >
            <p className="text-[10px] uppercase tracking-widest text-[#b45f3c] mb-3">
              Kiểm duyệt
            </p>
            <p className="font-serif text-xl group-hover:text-[#b45f3c] transition-colors">
              Duyệt hộ gia đình mới đăng ký →
            </p>
            {stats.pendingArtisans ? (
              <p className="mt-2 text-xs text-[#b45f3c]">
                {stats.pendingArtisans} hồ sơ đang chờ
              </p>
            ) : null}
          </Link>

          <Link
            to="/dashboard/admin/news"
            className="border border-[#1f1b18]/15 p-6 hover:border-[#b45f3c] hover:bg-[#b45f3c]/5 transition-colors group"
          >
            <p className="text-[10px] uppercase tracking-widest text-[#b45f3c] mb-3">
              Tin tức
            </p>
            <p className="font-serif text-xl group-hover:text-[#b45f3c] transition-colors">
              Đăng thông báo giá, lịch sinh hoạt →
            </p>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
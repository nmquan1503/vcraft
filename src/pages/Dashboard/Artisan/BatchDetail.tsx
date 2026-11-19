import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { artisanApi, batchApi } from '@/api';
import type { Batch, ArtisanProfile, ProductionLog } from '@/types';

import DashboardNav from './sections/DashboardNav';
import LogForm from './sections/LogForm';
import BatchStatusBadge from '@/pages/Batches/sections/BatchStatusBadge';
import Footer from '@/components/layout/Footer';

const fmt = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString('vi-VN', {
      day: '2-digit', month: 'long', year: 'numeric',
    });
  } catch { return iso; }
};

const fmtTime = (iso: string) => {
  try {
    return new Date(iso).toLocaleTimeString('vi-VN', {
      hour: '2-digit', minute: '2-digit',
    });
  } catch { return ''; }
};

export default function BatchDetail() {
  const { id } = useParams<{ id: string }>();

  const [artisan, setArtisan] = useState<ArtisanProfile | null>(null);
  const [batch, setBatch] = useState<Batch | null>(null);
  const [logs, setLogs] = useState<ProductionLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const reload = async () => {
    if (!id) return;
    const [b, l] = await Promise.all([
      batchApi.getById(id),
      batchApi.listLogs(id),
    ]);
    if (!b) {
      setNotFound(true);
      return;
    }
    setBatch(b);
    setLogs(
      l.sort(
        (a, b) =>
          new Date(a.loggedAt).getTime() - new Date(b.loggedAt).getTime()
      )
    );
  };

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    (async () => {
      await artisanApi.getMe().then((a) => {
        if (!cancelled) setArtisan(a);
      });
      await reload();
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  /* ────── Loading ────── */
  if (loading) {
    return (
      <main className="bg-[#f6f1ea] text-[#1f1b18] pt-32">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-sm text-[#1f1b18]/40">Đang tải…</p>
        </div>
      </main>
    );
  }

  /* ────── Not found ────── */
  if (notFound || !batch) {
    return (
      <main className="bg-[#f6f1ea] text-[#1f1b18] pt-32">
        <section className="max-w-4xl mx-auto px-6 py-24 text-center">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#b45f3c] mb-4">
            404
          </p>
          <h1 className="font-serif text-3xl md:text-5xl leading-tight">
            Không tìm thấy lô.
          </h1>
          <Link
            to="/dashboard/artisan/batches"
            className="mt-8 inline-flex bg-[#1f1b18] text-[#f6f1ea] rounded-full px-7 py-3 text-xs uppercase tracking-widest hover:bg-[#b45f3c] transition-colors"
          >
            Về danh sách lô
          </Link>
        </section>
      </main>
    );
  }

  /* ────── Access check (chỉ chủ xưởng) ────── */
  if (artisan && batch.artisanId !== artisan.id) {
    return (
      <main className="bg-[#f6f1ea] text-[#1f1b18] pt-32">
        <section className="max-w-4xl mx-auto px-6 py-24 text-center">
          <h1 className="font-serif text-3xl md:text-5xl leading-tight">
            Không có quyền truy cập.
          </h1>
          <p className="mt-4 text-sm text-[#1f1b18]/50">
            Lô này thuộc về xưởng khác.
          </p>
          <Link
            to="/dashboard/artisan/batches"
            className="mt-8 inline-flex bg-[#1f1b18] text-[#f6f1ea] rounded-full px-7 py-3 text-xs uppercase tracking-widest hover:bg-[#b45f3c] transition-colors"
          >
            Về danh sách lô
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-[#f6f1ea] text-[#1f1b18] min-h-screen">
      <section className="max-w-6xl mx-auto px-6 pt-24 md:pt-32 pb-8">
        <Link
          to="/dashboard/artisan/batches"
          className="inline-block mb-8 text-[11px] uppercase tracking-[0.25em] text-[#1f1b18]/50 hover:text-[#b45f3c] transition-colors"
        >
          ← Danh sách lô
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <BatchStatusBadge status={batch.status} />
            <h1 className="mt-3 font-serif text-[clamp(2rem,4vw,3.5rem)] leading-[1.05] tracking-tight">
              {batch.name}
            </h1>
            <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-[#1f1b18]/50">
              {batch.quantity} sản phẩm · Bắt đầu {fmt(batch.createdAt)}
            </p>
            {batch.description && (
              <p className="mt-4 text-sm text-[#1f1b18]/60 max-w-xl">
                {batch.description}
              </p>
            )}
          </div>

          <div className="shrink-0">
            <div className="bg-[#1f1b18] p-3">
              <img
                src={batch.qrCodeUrl}
                alt={`QR ${batch.name}`}
                className="w-28 h-28"
              />
            </div>
            <Link
              to={`/trace/${batch.id}`}
              className="mt-2 block text-center text-[10px] uppercase tracking-widest text-[#b45f3c] hover:underline"
            >
              Xem công khai →
            </Link>
          </div>
        </div>
      </section>

      <DashboardNav />

      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#b45f3c] mb-2">
              Nhật ký sản xuất
            </p>
            <h2 className="font-serif text-2xl md:text-3xl">
              {logs.length} công đoạn
            </h2>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center bg-[#1f1b18] text-[#f6f1ea] rounded-full px-6 py-3 text-xs uppercase tracking-widest hover:bg-[#b45f3c] transition-colors"
            >
              + Thêm nhật ký
            </button>
          )}
        </div>

        {showForm && (
          <div className="mb-8">
            <LogForm
              batchId={batch.id}
              onSuccess={async () => {
                setShowForm(false);
                await reload();
              }}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        {/* Timeline */}
        {logs.length === 0 ? (
          <div className="py-16 text-center border-y border-[#1f1b18]/10">
            <p className="font-serif text-xl text-[#1f1b18]/40">
              Chưa có nhật ký nào.
            </p>
            <p className="mt-2 text-sm text-[#1f1b18]/30">
              Thêm log đầu tiên để bắt đầu câu chuyện của lô gốm.
            </p>
          </div>
        ) : (
          <ol className="relative">
            <div
              className="absolute left-[11px] top-2 bottom-2 w-px bg-[#1f1b18]/15"
              aria-hidden="true"
            />
            {logs.map((log, i) => (
              <li key={log.id} className="relative pl-10 pb-10 last:pb-0">
                <span
                  className={`absolute left-0 top-1.5 w-6 h-6 rounded-full flex items-center justify-center ${
                    i === 0
                      ? 'bg-[#b45f3c] text-[#f6f1ea]'
                      : 'bg-[#f6f1ea] border border-[#1f1b18]/30'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      i === 0 ? 'bg-[#f6f1ea]' : 'bg-[#1f1b18]/40'
                    }`}
                  />
                </span>

                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <h3 className="font-serif text-xl">{log.stage}</h3>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#1f1b18]/40">
                    Bước {i + 1} / {logs.length}
                  </span>
                </div>

                <p className="mt-1 text-[11px] uppercase tracking-[0.15em] text-[#b45f3c]/80">
                  {fmt(log.loggedAt)}
                  {fmtTime(log.loggedAt) && (
                    <span className="text-[#1f1b18]/40 ml-2">
                      · {fmtTime(log.loggedAt)}
                    </span>
                  )}
                </p>

                {log.note && (
                  <p className="mt-3 text-sm text-[#1f1b18]/70 leading-relaxed max-w-xl">
                    {log.note}
                  </p>
                )}

                {log.images.length > 0 && (
                  <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-2 max-w-md">
                    {log.images.map((img, idx) => (
                      <div
                        key={idx}
                        className="aspect-square overflow-hidden bg-[#1f1b18]/5"
                      >
                        <img
                          src={img}
                          alt={`${log.stage} ${idx + 1}`}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ol>
        )}
      </section>

      <Footer />
    </main>
  );
}
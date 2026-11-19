import { useState } from 'react';
import { Link } from 'react-router-dom';
import { batchApi } from '@/api';
import type { Batch } from '@/types';

import DashboardNav from './sections/DashboardNav';
import Footer from '@/components/layout/Footer';

const inputCls =
  'w-full bg-transparent border-b border-[#1f1b18]/20 py-2 text-sm placeholder:text-[#1f1b18]/25 focus:outline-none focus:border-[#b45f3c] transition-colors';
const labelCls =
  'block text-[10px] uppercase tracking-[0.25em] text-[#1f1b18]/50 mb-2';

const STAGE_OPTIONS = [
  'Chọn & xử lý đất',
  'Tạo dáng trên bàn xoay',
  'Trang trí hoa văn, phủ men',
  'Nung lò',
  'Thành phẩm',
];

export default function NewBatch() {
  const [form, setForm] = useState({
    name: '',
    description: '',
    quantity: 1,
  });
  const [firstLog, setFirstLog] = useState({
    stage: STAGE_OPTIONS[0],
    note: '',
    timestamp: new Date().toISOString().slice(0, 16),
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<Batch | null>(null);

  const handleSubmit = async () => {
    setError(null);
    if (!form.name.trim()) return setError('Tên lô không được trống.');
    if (form.quantity < 1) return setError('Số lượng phải ≥ 1.');

    setSubmitting(true);
    try {
      const batch = await batchApi.create({
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        quantity: form.quantity,
      });

      // Thêm log đầu tiên
      await batchApi.createLog(batch.id, {
        stage: firstLog.stage,
        note: firstLog.note.trim() || undefined,
        timestamp: new Date(firstLog.timestamp).toISOString(),
      });

      setCreated(batch);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không tạo được lô.');
    } finally {
      setSubmitting(false);
    }
  };

  /* ────── Success screen ────── */
  if (created) {
    return (
      <main className="bg-[#f6f1ea] text-[#1f1b18] min-h-screen">
        <section className="max-w-3xl mx-auto px-6 pt-24 md:pt-32 pb-24">
          <div className="bg-[#1f1b18] text-[#f6f1ea] p-8 md:p-12">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#d9a08b] mb-3">
              ✓ Đã tạo lô thành công
            </p>
            <h1 className="font-serif text-3xl md:text-4xl leading-tight">
              {created.name}
            </h1>

            <div className="mt-8 flex flex-col sm:flex-row items-center gap-8">
              <div className="bg-[#f6f1ea] p-3">
                <img
                  src={created.qrCodeUrl}
                  alt={`QR ${created.name}`}
                  className="w-32 h-32"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm text-[#f6f1ea]/70 leading-relaxed">
                  Mã QR đã được sinh tự động. In mã này lên bao bì sản phẩm để
                  khách quét xem nhật ký sản xuất.
                </p>
                <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-[#d9a08b]">
                  Mã lô: {created.id}
                </p>
              </div>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <Link
                to={`/trace/${created.id}`}
                className="flex-1 text-center bg-[#d9a08b] text-[#1f1b18] rounded-full px-7 py-3 text-xs uppercase tracking-widest hover:bg-[#f6f1ea] transition-colors"
              >
                Xem nhật ký →
              </Link>
              <Link
                to="/dashboard/artisan/batches/new"
                className="flex-1 text-center border border-[#f6f1ea]/20 text-[#f6f1ea] rounded-full px-7 py-3 text-xs uppercase tracking-widest hover:border-[#f6f1ea] transition-colors"
              >
                + Tạo lô khác
              </Link>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  /* ────── Form ────── */
  return (
    <main className="bg-[#f6f1ea] text-[#1f1b18] min-h-screen">
      <section className="max-w-6xl mx-auto px-6 pt-24 md:pt-32 pb-8">
        <p className="text-[11px] uppercase tracking-[0.3em] text-[#b45f3c] mb-4">
          Tạo lô sản xuất
        </p>
        <h1 className="font-serif text-[clamp(2.5rem,5vw,4rem)] leading-[0.95] tracking-tight">
          Bắt đầu<br />một <em className="italic text-[#b45f3c]">mẻ mới</em>.
        </h1>
        <p className="mt-4 text-sm text-[#1f1b18]/50 max-w-lg">
          Hệ thống sẽ sinh mã QR riêng cho lô. Thêm log đầu tiên để bắt đầu
          hành trình của lô gốm.
        </p>
      </section>

      <DashboardNav />

      <section className="max-w-3xl mx-auto px-6 py-12">
        <div className="space-y-8">
          <div>
            <label className={labelCls}>Tên lô *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="VD: Mẻ bình tỳ bà tháng 12/2025"
              className={inputCls}
              disabled={submitting}
            />
          </div>

          <div>
            <label className={labelCls}>Mô tả lô</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className={`${inputCls} resize-none`}
              disabled={submitting}
              placeholder="Lô 10 bình tỳ bà men lam vẽ tay…"
            />
          </div>

          <div>
            <label className={labelCls}>Số lượng sản phẩm *</label>
            <input
              type="number"
              min={1}
              value={form.quantity || ''}
              onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
              className={inputCls}
              disabled={submitting}
            />
          </div>

          <div className="border-t border-[#1f1b18]/10 pt-8">
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#b45f3c] mb-5">
              Log sản xuất đầu tiên
            </p>

            <div className="space-y-6">
              <div>
                <label className={labelCls}>Công đoạn</label>
                <select
                  value={firstLog.stage}
                  onChange={(e) => setFirstLog({ ...firstLog, stage: e.target.value })}
                  className={`${inputCls} cursor-pointer`}
                  disabled={submitting}
                >
                  {STAGE_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelCls}>Thời điểm</label>
                <input
                  type="datetime-local"
                  value={firstLog.timestamp}
                  onChange={(e) => setFirstLog({ ...firstLog, timestamp: e.target.value })}
                  className={inputCls}
                  disabled={submitting}
                />
              </div>

              <div>
                <label className={labelCls}>Ghi chú</label>
                <textarea
                  value={firstLog.note}
                  onChange={(e) => setFirstLog({ ...firstLog, note: e.target.value })}
                  rows={2}
                  className={`${inputCls} resize-none`}
                  disabled={submitting}
                  placeholder="VD: Đất sét trắng Bát Tràng, ủ 3 ngày"
                />
              </div>
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-600 bg-red-50 px-3 py-2 border-l-2 border-red-500">
              {error}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full bg-[#1f1b18] text-[#f6f1ea] rounded-full px-7 py-3 text-xs uppercase tracking-widest hover:bg-[#b45f3c] disabled:opacity-50 transition-colors"
          >
            {submitting ? 'Đang tạo lô…' : 'Tạo lô & sinh QR'}
          </button>
        </div>
      </section>

      <Footer />
    </main>
  );
}
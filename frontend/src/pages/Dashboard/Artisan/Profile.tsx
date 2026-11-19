import { useEffect, useState } from 'react';
import { artisanApi } from '@/api';
import type { ArtisanProfile } from '@/types';

import DashboardNav from './sections/DashboardNav';
import Footer from '@/components/layout/Footer';

const inputCls =
  'w-full bg-transparent border-b border-[#1f1b18]/20 py-2 text-sm placeholder:text-[#1f1b18]/25 focus:outline-none focus:border-[#b45f3c] transition-colors';
const labelCls =
  'block text-[10px] uppercase tracking-[0.25em] text-[#1f1b18]/50 mb-2';

export default function ArtisanProfileEdit() {
  const [artisan, setArtisan] = useState<ArtisanProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    workshopName: '',
    description: '',
    familyHistory: '',
    address: '',
    lat: '',
    lng: '',
    openStatus: false,
    images: [] as string[],
  });

  useEffect(() => {
    (async () => {
      const art = await artisanApi.getMe();
      setArtisan(art);
      if (art) {
        setForm({
          workshopName: art.workshopName,
          description: art.description,
          familyHistory: art.familyHistory,
          address: art.address,
          lat: art.latitude?.toString() ?? '',
          lng: art.longitude?.toString() ?? '',
          openStatus: art.openStatus,
          images: art.images,
        });
      }
      setLoading(false);
    })();
  }, []);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const urls = await artisanApi.uploadImages(Array.from(files));
      setForm((f) => ({ ...f, images: [...f.images, ...urls] }));
    } catch {
      setError('Không upload được ảnh.');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (idx: number) => {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
  };

  const handleSave = async () => {
    setMessage(null);
    setError(null);
    if (!form.workshopName.trim()) return setError('Tên xưởng không được trống.');
    if (!form.address.trim()) return setError('Địa chỉ không được trống.');

    setSaving(true);
    try {
      const updated = await artisanApi.updateMe({
        workshopName: form.workshopName.trim(),
        description: form.description.trim(),
        familyHistory: form.familyHistory.trim(),
        address: form.address.trim(),
        lat: form.lat ? Number(form.lat) : undefined,
        lng: form.lng ? Number(form.lng) : undefined,
        openStatus: form.openStatus,
        images: form.images,
      });
      setArtisan(updated);
      setMessage('✓ Đã lưu hồ sơ xưởng');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="bg-[#f6f1ea] text-[#1f1b18] min-h-screen">
        <section className="max-w-3xl mx-auto px-6 pt-32">
          <p className="text-sm text-[#1f1b18]/40">Đang tải…</p>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-[#f6f1ea] text-[#1f1b18] min-h-screen">
      <section className="max-w-6xl mx-auto px-6 pt-24 md:pt-32 pb-8">
        <p className="text-[11px] uppercase tracking-[0.3em] text-[#b45f3c] mb-4">
          Hồ sơ xưởng
        </p>
        <h1 className="font-serif text-[clamp(2.5rem,5vw,4rem)] leading-[0.95] tracking-tight">
          {artisan?.workshopName ?? 'Xưởng của bạn'}
        </h1>
      </section>

      <DashboardNav />

      <section className="max-w-3xl mx-auto px-6 py-12">
        <div className="space-y-8">
          {/* Open status */}
          <div className="border border-[#1f1b18]/10 p-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Trạng thái đón khách</p>
              <p className="text-xs text-[#1f1b18]/50 mt-1">
                {form.openStatus ? 'Đang mở cửa — khách có thể ghé thăm' : 'Đóng cửa'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, openStatus: !f.openStatus }))}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                form.openStatus ? 'bg-[#b45f3c]' : 'bg-[#1f1b18]/20'
              }`}
              aria-label="Toggle open status"
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  form.openStatus ? 'translate-x-6' : ''
                }`}
              />
            </button>
          </div>

          <div>
            <label className={labelCls}>Tên xưởng *</label>
            <input
              type="text"
              value={form.workshopName}
              onChange={(e) => setForm({ ...form, workshopName: e.target.value })}
              className={inputCls}
              disabled={saving}
            />
          </div>

          <div>
            <label className={labelCls}>Địa chỉ xưởng *</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className={inputCls}
              disabled={saving}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className={labelCls}>Vĩ độ (lat)</label>
              <input
                type="number"
                step="0.0001"
                value={form.lat}
                onChange={(e) => setForm({ ...form, lat: e.target.value })}
                placeholder="20.9812"
                className={inputCls}
                disabled={saving}
              />
            </div>
            <div>
              <label className={labelCls}>Kinh độ (lng)</label>
              <input
                type="number"
                step="0.0001"
                value={form.lng}
                onChange={(e) => setForm({ ...form, lng: e.target.value })}
                placeholder="105.9134"
                className={inputCls}
                disabled={saving}
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Mô tả xưởng</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
              className={`${inputCls} resize-none`}
              disabled={saving}
              placeholder="Dòng men, kỹ thuật, sản phẩm chủ đạo…"
            />
          </div>

          <div>
            <label className={labelCls}>Lịch sử gia đình</label>
            <textarea
              value={form.familyHistory}
              onChange={(e) => setForm({ ...form, familyHistory: e.target.value })}
              rows={3}
              className={`${inputCls} resize-none`}
              disabled={saving}
              placeholder="VD: Gia đình giữ nghề từ thời Lê, trải qua 5 thế hệ"
            />
          </div>

          {/* Images */}
          <div>
            <label className={labelCls}>Ảnh xưởng</label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
              {form.images.map((img, i) => (
                <div key={i} className="relative aspect-square overflow-hidden bg-[#1f1b18]/5 group">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute inset-0 bg-[#1f1b18]/70 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs uppercase tracking-widest"
                  >
                    Xoá
                  </button>
                </div>
              ))}
              <label className="aspect-square border border-dashed border-[#1f1b18]/25 flex flex-col items-center justify-center text-[#1f1b18]/40 cursor-pointer hover:border-[#b45f3c] hover:text-[#b45f3c] transition-colors">
                <span className="text-2xl leading-none">+</span>
                <span className="text-[9px] uppercase tracking-widest mt-1">
                  {uploading ? 'Đang tải' : 'Thêm ảnh'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleUpload(e.target.files)}
                  disabled={uploading || saving}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-600 bg-red-50 px-3 py-2 border-l-2 border-red-500">
              {error}
            </p>
          )}
          {message && (
            <p className="text-xs text-green-700 bg-green-50 px-3 py-2 border-l-2 border-green-500">
              {message}
            </p>
          )}

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSave}
              disabled={saving || uploading}
              className="flex-1 bg-[#1f1b18] text-[#f6f1ea] rounded-full px-7 py-3 text-xs uppercase tracking-widest hover:bg-[#b45f3c] disabled:opacity-50 transition-colors"
            >
              {saving ? 'Đang lưu…' : 'Lưu hồ sơ'}
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
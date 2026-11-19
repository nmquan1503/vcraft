import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productApi, categoryApi, batchApi, artisanApi } from '@/api';
import type { ArtisanProfile, Category, Batch } from '@/types';

import DashboardNav from './sections/DashboardNav';
import Footer from '@/components/layout/Footer';

const inputCls =
  'w-full bg-transparent border-b border-[#1f1b18]/20 py-2 text-sm placeholder:text-[#1f1b18]/25 focus:outline-none focus:border-[#b45f3c] transition-colors';
const labelCls =
  'block text-[10px] uppercase tracking-[0.25em] text-[#1f1b18]/50 mb-2';

export default function NewProduct() {
  const navigate = useNavigate();

  const [artisan, setArtisan] = useState<ArtisanProfile | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [myBatches, setMyBatches] = useState<Batch[]>([]);

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: 0,
    stock: 1,
    categoryId: '',
    batchId: '',
    images: [] as string[],
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const art = await artisanApi.getMe();
      setArtisan(art);

      const [cats, batchesRes] = await Promise.all([
        categoryApi.list(),
        batchApi.list({ limit: 100 }),
      ]);
      setCategories(cats);
      if (art) {
        setMyBatches(batchesRes.data.filter((b) => b.artisanId === art.id));
      }
      setLoading(false);
    })();
  }, []);

  // Upload ảnh tạm (vì chưa có productId) — dùng artisan endpoint
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

  const handleSubmit = async () => {
    setError(null);
    if (!form.name.trim()) return setError('Tên sản phẩm không được trống.');
    if (form.price <= 0) return setError('Giá phải lớn hơn 0.');
    if (form.stock < 1) return setError('Tồn kho phải ≥ 1.');

    setSubmitting(true);
    try {
      const created = await productApi.create({
        name: form.name.trim(),
        description: form.description.trim(),
        price: form.price,
        stock: form.stock,
        categoryId: form.categoryId || undefined,
        batchId: form.batchId || undefined,
        images: form.images,
      });
      navigate(`/products/${created.id}`, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không tạo được sản phẩm.');
    } finally {
      setSubmitting(false);
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

  if (!artisan) {
    return (
      <main className="bg-[#f6f1ea] text-[#1f1b18] min-h-screen">
        <section className="max-w-3xl mx-auto px-6 pt-32">
          <p className="text-sm text-[#1f1b18]/60">
            Không tìm thấy hồ sơ xưởng.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-[#f6f1ea] text-[#1f1b18] min-h-screen">
      <section className="max-w-6xl mx-auto px-6 pt-24 md:pt-32 pb-8">
        <p className="text-[11px] uppercase tracking-[0.3em] text-[#b45f3c] mb-4">
          Đăng sản phẩm
        </p>
        <h1 className="font-serif text-[clamp(2.5rem,5vw,4rem)] leading-[0.95] tracking-tight">
          Thêm tác phẩm<br />vào <em className="italic text-[#b45f3c]">xưởng</em>.
        </h1>
        <p className="mt-4 text-sm text-[#1f1b18]/50 max-w-lg">
          Gắn sản phẩm với một lô để khách quét mã QR xem được nhật ký sản xuất.
        </p>
      </section>

      <DashboardNav />

      <section className="max-w-3xl mx-auto px-6 py-12">
        <div className="space-y-8">
          <div>
            <label className={labelCls}>Tên sản phẩm *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="VD: Bình tỳ bà men lam"
              className={inputCls}
              disabled={submitting}
            />
          </div>

          <div>
            <label className={labelCls}>Mô tả</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
              className={`${inputCls} resize-none`}
              disabled={submitting}
              placeholder="Kích thước, kỹ thuật, dòng men…"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className={labelCls}>Giá (VNĐ) *</label>
              <input
                type="number"
                min={1}
                value={form.price || ''}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                className={inputCls}
                disabled={submitting}
              />
            </div>
            <div>
              <label className={labelCls}>Tồn kho *</label>
              <input
                type="number"
                min={1}
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                className={inputCls}
                disabled={submitting}
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Danh mục</label>
            <select
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              className={`${inputCls} cursor-pointer`}
              disabled={submitting}
            >
              <option value="">— Chọn danh mục —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelCls}>Thuộc lô (tuỳ chọn)</label>
            <select
              value={form.batchId}
              onChange={(e) => setForm({ ...form, batchId: e.target.value })}
              className={`${inputCls} cursor-pointer`}
              disabled={submitting}
            >
              <option value="">— Không gắn lô —</option>
              {myBatches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.quantity} SP)
                </option>
              ))}
            </select>
            {myBatches.length === 0 && (
              <p className="text-xs text-[#1f1b18]/40 mt-2">
                Chưa có lô nào.{' '}
                <Link to="/dashboard/artisan/batches/new" className="text-[#b45f3c] hover:underline">
                  Tạo lô mới →
                </Link>
              </p>
            )}
          </div>

          <div>
            <label className={labelCls}>Ảnh sản phẩm</label>
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
                  disabled={uploading || submitting}
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

          <button
            onClick={handleSubmit}
            disabled={submitting || uploading}
            className="w-full bg-[#1f1b18] text-[#f6f1ea] rounded-full px-7 py-3 text-xs uppercase tracking-widest hover:bg-[#b45f3c] disabled:opacity-50 transition-colors"
          >
            {submitting ? 'Đang đăng…' : 'Đăng sản phẩm'}
          </button>
        </div>
      </section>

      <Footer />
    </main>
  );
}
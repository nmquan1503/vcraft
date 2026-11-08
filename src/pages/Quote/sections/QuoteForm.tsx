import { useEffect, useState } from 'react';
import { categoryApi, artisanApi } from '@/api';
import type { Category, ArtisanProfile } from '@/types';

export interface QuoteFormValues {
  title: string;
  description: string;
  categoryId: string;
  quantity: number;
  unit: string;
  deadline: string;
  targetArtisanIds: string[];
}

interface Props {
  values: QuoteFormValues;
  onChange: (v: QuoteFormValues) => void;
  onSubmit: (submitNow: boolean) => void;
  loading: boolean;
  error: string | null;
}

const UNIT_OPTIONS = ['chiếc', 'bộ', 'cái', 'đôi', 'kg'];

export default function QuoteForm({ values, onChange, onSubmit, loading, error }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [artisans, setArtisans] = useState<ArtisanProfile[]>([]);

  useEffect(() => {
    categoryApi.list().then(setCategories);
    artisanApi.list({ limit: 50 }).then((r) => setArtisans(r.data));
  }, []);

  const set = <K extends keyof QuoteFormValues>(k: K, v: QuoteFormValues[K]) =>
    onChange({ ...values, [k]: v });

  const toggle = (id: string) => {
    const next = values.targetArtisanIds.includes(id)
      ? values.targetArtisanIds.filter((x) => x !== id)
      : [...values.targetArtisanIds, id];
    set('targetArtisanIds', next);
  };

  const inputCls =
    'w-full bg-transparent border-b border-[#1f1b18]/20 py-2 text-sm placeholder:text-[#1f1b18]/25 focus:outline-none focus:border-[#b45f3c] transition-colors';
  const labelCls =
    'block text-[10px] uppercase tracking-[0.25em] text-[#1f1b18]/50 mb-2';

  return (
    <div className="space-y-6">
      <div>
        <label className={labelCls}>Tiêu đề *</label>
        <input
          type="text"
          value={values.title}
          onChange={(e) => set('title', e.target.value)}
          placeholder="VD: Đặt 5.000 chén in logo trường ĐHCN"
          disabled={loading}
          className={inputCls}
        />
      </div>

      <div>
        <label className={labelCls}>Mô tả chi tiết</label>
        <textarea
          value={values.description}
          onChange={(e) => set('description', e.target.value)}
          placeholder="Kích thước, màu men, yêu cầu in ấn, đóng gói…"
          rows={4}
          disabled={loading}
          className={`${inputCls} resize-none`}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label className={labelCls}>Danh mục *</label>
          <select
            value={values.categoryId}
            onChange={(e) => set('categoryId', e.target.value)}
            disabled={loading}
            className={`${inputCls} cursor-pointer`}
          >
            <option value="">— Chọn danh mục —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>Hạn hoàn thành *</label>
          <input
            type="date"
            value={values.deadline}
            onChange={(e) => set('deadline', e.target.value)}
            disabled={loading}
            className={inputCls}
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label className={labelCls}>Số lượng *</label>
          <input
            type="number"
            min={1}
            value={values.quantity || ''}
            onChange={(e) => set('quantity', Number(e.target.value))}
            disabled={loading}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Đơn vị</label>
          <select
            value={values.unit}
            onChange={(e) => set('unit', e.target.value)}
            disabled={loading}
            className={`${inputCls} cursor-pointer`}
          >
            {UNIT_OPTIONS.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelCls}>Gửi tới xưởng *</label>
        <p className="text-xs text-[#1f1b18]/40 mb-3">
          Chọn ít nhất 1 xưởng. Yêu cầu sẽ gửi tới các xưởng này để họ chào giá.
        </p>
        <div className="grid sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto border border-[#1f1b18]/10 p-3">
          {artisans.length === 0 ? (
            <p className="text-sm text-[#1f1b18]/40 col-span-2">Đang tải…</p>
          ) : artisans.map((a) => {
            const checked = values.targetArtisanIds.includes(a.id);
            return (
              <label
                key={a.id}
                className={`flex items-center gap-3 p-3 border cursor-pointer transition-colors ${
                  checked
                    ? 'border-[#b45f3c] bg-[#b45f3c]/5'
                    : 'border-[#1f1b18]/10 hover:border-[#1f1b18]/30'
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(a.id)}
                  disabled={loading}
                  className="accent-[#b45f3c]"
                />
                <div className="min-w-0">
                  <p className="text-sm truncate">{a.workshopName}</p>
                  <p className="text-[10px] uppercase tracking-widest text-[#1f1b18]/40 truncate">
                    {a.ownerName}
                  </p>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {error && (
        <p className="text-xs text-red-600 bg-red-50 px-3 py-2 border-l-2 border-red-500">
          {error}
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <button
          type="button"
          onClick={() => onSubmit(false)}
          disabled={loading}
          className="flex-1 border border-[#1f1b18]/20 rounded-full px-7 py-3 text-xs uppercase tracking-widest hover:border-[#b45f3c] hover:text-[#b45f3c] disabled:opacity-50 transition-colors"
        >
          Lưu nháp
        </button>
        <button
          type="button"
          onClick={() => onSubmit(true)}
          disabled={loading}
          className="flex-1 bg-[#1f1b18] text-[#f6f1ea] rounded-full px-7 py-3 text-xs uppercase tracking-widest hover:bg-[#b45f3c] disabled:opacity-50 transition-colors"
        >
          {loading ? 'Đang gửi…' : 'Gửi yêu cầu'}
        </button>
      </div>
    </div>
  );
}
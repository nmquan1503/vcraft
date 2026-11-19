import { useState } from 'react';

export interface BidFormValues {
  pricePerUnit: number;
  estimatedDays: number;
  note: string;
}

interface Props {
  initial?: Partial<BidFormValues>;
  totalQuantity: number;
  onSubmit: (v: BidFormValues) => Promise<void>;
  onCancel?: () => void;
  submitting: boolean;
  error: string | null;
}

export default function BidForm({
  initial, totalQuantity, onSubmit, onCancel, submitting, error,
}: Props) {
  const [v, setV] = useState<BidFormValues>({
    pricePerUnit: initial?.pricePerUnit ?? 0,
    estimatedDays: initial?.estimatedDays ?? 30,
    note: initial?.note ?? '',
  });

  const total = v.pricePerUnit * totalQuantity;
  const inputCls =
    'w-full bg-transparent border-b border-[#f6f1ea]/20 py-2 text-sm text-[#f6f1ea] placeholder:text-[#f6f1ea]/30 focus:outline-none focus:border-[#d9a08b] transition-colors';
  const labelCls =
    'block text-[10px] uppercase tracking-[0.25em] text-[#d9a08b]/70 mb-2';

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSubmit(v); }}
      className="space-y-6"
    >
      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label className={labelCls}>Đơn giá (VNĐ) *</label>
          <input
            type="number" min={1}
            value={v.pricePerUnit || ''}
            onChange={(e) => setV({ ...v, pricePerUnit: Number(e.target.value) })}
            placeholder="35000"
            disabled={submitting}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Thời gian (ngày) *</label>
          <input
            type="number" min={1}
            value={v.estimatedDays || ''}
            onChange={(e) => setV({ ...v, estimatedDays: Number(e.target.value) })}
            disabled={submitting}
            className={inputCls}
          />
        </div>
      </div>

      {total > 0 && (
        <div className="border border-[#d9a08b]/30 p-4">
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#d9a08b]/70 mb-1">
            Tổng giá trị dự kiến
          </p>
          <p className="font-serif text-2xl text-[#f6f1ea]">
            {total.toLocaleString('vi-VN')} ₫
          </p>
        </div>
      )}

      <div>
        <label className={labelCls}>Ghi chú</label>
        <textarea
          value={v.note}
          onChange={(e) => setV({ ...v, note: e.target.value })}
          placeholder="Cam kết chất lượng, lưu ý đặc biệt…"
          rows={3}
          disabled={submitting}
          className={`${inputCls} resize-none`}
        />
      </div>

      {error && (
        <p className="text-xs text-red-300 bg-red-950/40 px-3 py-2 border-l-2 border-red-500">
          {error}
        </p>
      )}

      <div className="flex gap-3 pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="flex-1 border border-[#f6f1ea]/20 rounded-full px-7 py-3 text-xs uppercase tracking-widest text-[#f6f1ea]/70 hover:text-[#f6f1ea] disabled:opacity-50 transition-colors"
          >
            Huỷ
          </button>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 bg-[#d9a08b] text-[#1f1b18] rounded-full px-7 py-3 text-xs uppercase tracking-widest hover:bg-[#f6f1ea] disabled:opacity-50 transition-colors"
        >
          {submitting ? 'Đang gửi…' : 'Gửi chào giá'}
        </button>
      </div>
    </form>
  );
}
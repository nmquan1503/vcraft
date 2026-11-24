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
  initial,
  totalQuantity,
  onSubmit,
  onCancel,
  submitting,
  error,
}: Props) {
  const [v, setV] = useState<BidFormValues>({
    pricePerUnit: initial?.pricePerUnit ?? 0,
    estimatedDays: initial?.estimatedDays ?? 30,
    note: initial?.note ?? '',
  });

  const total = v.pricePerUnit * totalQuantity;

  const inputCls =
    'w-full rounded-xl border border-[#f6f1ea]/15 bg-[#f6f1ea]/[0.04] px-4 py-3.5 text-sm text-[#f6f1ea] placeholder:text-[#f6f1ea]/25 outline-none transition-all duration-300 focus:border-[#d9a08b]/70 focus:bg-[#f6f1ea]/[0.07] focus:ring-2 focus:ring-[#d9a08b]/10 disabled:cursor-not-allowed disabled:opacity-50';

  const labelCls =
    'mb-2.5 block text-[10px] font-medium uppercase tracking-[0.22em] text-[#d9a08b]/80';

  const formatPrice = (value: number) =>
    value.toLocaleString('vi-VN');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !Number.isFinite(v.pricePerUnit) ||
      !Number.isFinite(v.estimatedDays) ||
      v.pricePerUnit <= 0 ||
      v.estimatedDays <= 0
    ) {
      return;
    }

    onSubmit(v);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-serif text-xl text-[#f6f1ea]">
              Chi tiết chào giá
            </p>
            <p className="mt-1 text-xs leading-relaxed text-[#f6f1ea]/40">
              Cung cấp mức giá và thời gian hoàn thành dự kiến.
            </p>
          </div>

          <span className="shrink-0 rounded-full border border-[#d9a08b]/25 px-3 py-1.5 text-[9px] uppercase tracking-[0.16em] text-[#d9a08b]">
            Báo giá
          </span>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="bid-price" className={labelCls}>
              Đơn giá <span className="text-[#d9a08b]">*</span>
            </label>

            <div className="relative">
              <input
                id="bid-price"
                type="number"
                min={1}
                step={1}
                required
                value={v.pricePerUnit || ''}
                onChange={(e) =>
                  setV((prev) => ({
                    ...prev,
                    pricePerUnit:
                      e.target.value === ''
                        ? 0
                        : Number(e.target.value),
                  }))
                }
                placeholder="35.000"
                disabled={submitting}
                className={`${inputCls} pr-14`}
              />

              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#f6f1ea]/35">
                VNĐ
              </span>
            </div>

            <p className="mt-2 text-[10px] text-[#f6f1ea]/30">
              Giá cho mỗi sản phẩm.
            </p>
          </div>

          <div>
            <label htmlFor="bid-days" className={labelCls}>
              Thời gian <span className="text-[#d9a08b]">*</span>
            </label>

            <div className="relative">
              <input
                id="bid-days"
                type="number"
                min={1}
                step={1}
                required
                value={v.estimatedDays || ''}
                onChange={(e) =>
                  setV((prev) => ({
                    ...prev,
                    estimatedDays:
                      e.target.value === ''
                        ? 0
                        : Number(e.target.value),
                  }))
                }
                placeholder="30"
                disabled={submitting}
                className={`${inputCls} pr-16`}
              />

              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#f6f1ea]/35">
                Ngày
              </span>
            </div>

            <p className="mt-2 text-[10px] text-[#f6f1ea]/30">
              Thời gian hoàn thành đơn hàng.
            </p>
          </div>
        </div>
      </div>

      {total > 0 && (
        <div className="relative overflow-hidden rounded-2xl border border-[#d9a08b]/25 bg-[#d9a08b]/[0.07] p-5 sm:p-6">
          <div className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full border border-[#d9a08b]/10" />
          <div className="pointer-events-none absolute -right-5 -top-7 h-24 w-24 rounded-full border border-[#d9a08b]/10" />

          <div className="relative flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#d9a08b]/70">
                Tổng giá trị dự kiến
              </p>

              <p className="mt-2 font-serif text-3xl tracking-tight text-[#f6f1ea] sm:text-4xl">
                {formatPrice(total)}
                <span className="ml-1 text-base text-[#d9a08b]">₫</span>
              </p>
            </div>

            <div className="text-right">
              <p className="text-[10px] uppercase tracking-[0.16em] text-[#f6f1ea]/35">
                Số lượng
              </p>
              <p className="mt-1 font-serif text-xl text-[#f6f1ea]/80">
                {formatPrice(totalQuantity)}
              </p>
            </div>
          </div>

          <div className="relative mt-5 border-t border-[#d9a08b]/15 pt-3">
            <p className="text-[10px] leading-relaxed text-[#f6f1ea]/40">
              Thành tiền được tính bằng đơn giá nhân với tổng số lượng sản phẩm.
            </p>
          </div>
        </div>
      )}

      <div>
        <div className="mb-2.5 flex items-center justify-between gap-3">
          <label htmlFor="bid-note" className={labelCls.replace('mb-2.5', '')}>
            Ghi chú
          </label>

          <span className="text-[10px] text-[#f6f1ea]/25">
            Không bắt buộc
          </span>
        </div>

        <textarea
          id="bid-note"
          value={v.note}
          onChange={(e) =>
            setV((prev) => ({
              ...prev,
              note: e.target.value,
            }))
          }
          placeholder="Chia sẻ về chất liệu, quy trình sản xuất, cam kết chất lượng hoặc những lưu ý đặc biệt..."
          rows={4}
          disabled={submitting}
          className={`${inputCls} min-h-[110px] resize-y leading-relaxed`}
        />

        <p className="mt-2 text-[10px] text-[#f6f1ea]/30">
          Thông tin bổ sung giúp khách hàng hiểu rõ hơn về đề xuất của bạn.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-red-400/20 bg-red-950/30 px-4 py-3"
        >
          <span className="mt-0.5 text-sm text-red-300">!</span>
          <p className="text-xs leading-relaxed text-red-200/90">
            {error}
          </p>
        </div>
      )}

      <div className="flex flex-col-reverse gap-3 border-t border-[#f6f1ea]/10 pt-5 sm:flex-row">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="rounded-full border border-[#f6f1ea]/20 px-7 py-3.5 text-[10px] font-medium uppercase tracking-[0.18em] text-[#f6f1ea]/65 transition-all duration-300 hover:border-[#f6f1ea]/50 hover:text-[#f6f1ea] disabled:cursor-not-allowed disabled:opacity-40 sm:flex-1"
          >
            Huỷ
          </button>
        )}

        <button
          type="submit"
          disabled={
            submitting ||
            v.pricePerUnit <= 0 ||
            v.estimatedDays <= 0 ||
            !Number.isFinite(v.pricePerUnit) ||
            !Number.isFinite(v.estimatedDays)
          }
          className="group flex items-center justify-center gap-3 rounded-full bg-[#d9a08b] px-7 py-3.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#1f1b18] transition-all duration-300 hover:bg-[#f6f1ea] disabled:cursor-not-allowed disabled:opacity-40 sm:flex-[1.5]"
        >
          {submitting ? (
            <>
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#1f1b18]/25 border-t-[#1f1b18]" />
              Đang gửi...
            </>
          ) : (
            <>
              Gửi chào giá
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
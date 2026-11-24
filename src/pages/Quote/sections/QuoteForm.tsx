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

export default function QuoteForm({
  values,
  onChange,
  onSubmit,
  loading,
  error,
}: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [artisans, setArtisans] = useState<ArtisanProfile[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingArtisans, setLoadingArtisans] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadCategories = async () => {
      try {
        const data = await categoryApi.list();
        if (mounted) setCategories(data);
      } catch {
        if (mounted) {
          setLoadError('Không thể tải danh mục sản phẩm. Vui lòng thử lại.');
        }
      } finally {
        if (mounted) setLoadingCategories(false);
      }
    };

    const loadArtisans = async () => {
      try {
        const response = await artisanApi.list({ limit: 50 });
        if (mounted) setArtisans(response.data);
      } catch {
        if (mounted) {
          setLoadError('Không thể tải danh sách xưởng. Vui lòng thử lại.');
        }
      } finally {
        if (mounted) setLoadingArtisans(false);
      }
    };

    loadCategories();
    loadArtisans();

    return () => {
      mounted = false;
    };
  }, []);

  const set = <K extends keyof QuoteFormValues>(
    key: K,
    value: QuoteFormValues[K],
  ) => {
    onChange({ ...values, [key]: value });
  };

  const toggleArtisan = (id: string) => {
    const next = values.targetArtisanIds.includes(id)
      ? values.targetArtisanIds.filter((item) => item !== id)
      : [...values.targetArtisanIds, id];

    set('targetArtisanIds', next);
  };

  const inputClass =
    'w-full rounded-xl border border-[#1f1b18]/10 bg-white/55 px-4 py-3.5 text-sm text-[#1f1b18] outline-none transition-all duration-300 placeholder:text-[#1f1b18]/25 hover:border-[#1f1b18]/20 focus:border-[#b45f3c]/60 focus:bg-white focus:ring-2 focus:ring-[#b45f3c]/[0.08] disabled:cursor-not-allowed disabled:opacity-50';

  const labelClass =
    'mb-2.5 block text-[9px] font-semibold uppercase tracking-[0.2em] text-[#1f1b18]/55';

  const selectedCount = values.targetArtisanIds.length;
  const isLoadingOptions = loadingCategories || loadingArtisans;

  return (
    <div className="space-y-8 sm:space-y-10">
      <section>
        <div className="mb-6 flex items-start gap-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#b45f3c]/25 bg-[#b45f3c]/[0.06] font-serif text-sm text-[#b45f3c]">
            01
          </div>

          <div>
            <h3 className="font-serif text-xl text-[#1f1b18] sm:text-2xl">
              Thông tin yêu cầu
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-[#1f1b18]/40">
              Mô tả sản phẩm và những yêu cầu bạn muốn xưởng thực hiện.
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label htmlFor="quote-title" className={labelClass}>
              Tiêu đề <span className="text-[#b45f3c]">*</span>
            </label>
            <input
              id="quote-title"
              type="text"
              value={values.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="VD: Đặt 5.000 chén in logo trường ĐHCN"
              disabled={loading}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="quote-description" className={labelClass}>
              Mô tả chi tiết
            </label>
            <textarea
              id="quote-description"
              value={values.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Kích thước, màu men, yêu cầu in ấn, đóng gói và những lưu ý khác..."
              rows={5}
              disabled={loading}
              className={`${inputClass} min-h-[130px] resize-y leading-relaxed`}
            />
            <p className="mt-2 text-[10px] text-[#1f1b18]/30">
              Mô tả càng cụ thể, nghệ nhân càng dễ đưa ra báo giá chính xác.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-[#1f1b18]/[0.08] pt-7">
        <div className="mb-6 flex items-start gap-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#b45f3c]/25 bg-[#b45f3c]/[0.06] font-serif text-sm text-[#b45f3c]">
            02
          </div>

          <div>
            <h3 className="font-serif text-xl text-[#1f1b18] sm:text-2xl">
              Quy mô đơn hàng
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-[#1f1b18]/40">
              Xác định danh mục, số lượng và thời hạn hoàn thành.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="quote-category" className={labelClass}>
              Danh mục <span className="text-[#b45f3c]">*</span>
            </label>
            <select
              id="quote-category"
              value={values.categoryId}
              onChange={(e) => set('categoryId', e.target.value)}
              disabled={loading || loadingCategories}
              className={`${inputClass} cursor-pointer`}
            >
              <option value="">
                {loadingCategories
                  ? 'Đang tải danh mục...'
                  : '— Chọn danh mục —'}
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="quote-deadline" className={labelClass}>
              Hạn hoàn thành <span className="text-[#b45f3c]">*</span>
            </label>
            <input
              id="quote-deadline"
              type="date"
              value={values.deadline}
              onChange={(e) => set('deadline', e.target.value)}
              disabled={loading}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="quote-quantity" className={labelClass}>
              Số lượng <span className="text-[#b45f3c]">*</span>
            </label>
            <input
              id="quote-quantity"
              type="number"
              min={1}
              step={1}
              value={values.quantity || ''}
              onChange={(e) =>
                set(
                  'quantity',
                  e.target.value === '' ? 0 : Number(e.target.value),
                )
              }
              placeholder="VD: 5000"
              disabled={loading}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="quote-unit" className={labelClass}>
              Đơn vị
            </label>
            <select
              id="quote-unit"
              value={values.unit}
              onChange={(e) => set('unit', e.target.value)}
              disabled={loading}
              className={`${inputClass} cursor-pointer`}
            >
              {UNIT_OPTIONS.map((unit) => (
                <option key={unit} value={unit}>
                  {unit.charAt(0).toUpperCase() + unit.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="border-t border-[#1f1b18]/[0.08] pt-7">
        <div className="mb-6 flex items-start gap-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#b45f3c]/25 bg-[#b45f3c]/[0.06] font-serif text-sm text-[#b45f3c]">
            03
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="font-serif text-xl text-[#1f1b18] sm:text-2xl">
              Lựa chọn xưởng
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-[#1f1b18]/40">
              Chọn những xưởng bạn muốn gửi yêu cầu để nhận báo giá.
            </p>
          </div>

          <div className="shrink-0 rounded-full border border-[#b45f3c]/20 bg-[#b45f3c]/[0.06] px-3 py-1.5">
            <span className="font-serif text-sm text-[#b45f3c]">
              {selectedCount}
            </span>
            <span className="ml-1 text-[9px] uppercase tracking-wider text-[#b45f3c]/65">
              đã chọn
            </span>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#1f1b18]/10 bg-white/35">
          <div className="flex items-center justify-between gap-3 border-b border-[#1f1b18]/[0.07] px-4 py-3.5 sm:px-5">
            <p className="text-[9px] font-semibold uppercase tracking-[0.17em] text-[#1f1b18]/45">
              Danh sách xưởng
            </p>
            <span className="text-[10px] text-[#1f1b18]/30">
              {artisans.length} xưởng
            </span>
          </div>

          <div className="max-h-[340px] overflow-y-auto p-3 sm:p-4">
            {loadingArtisans ? (
              <div className="flex flex-col items-center justify-center py-12">
                <span className="h-6 w-6 animate-spin rounded-full border-2 border-[#b45f3c]/20 border-t-[#b45f3c]" />
                <p className="mt-3 text-xs text-[#1f1b18]/40">
                  Đang tải danh sách xưởng...
                </p>
              </div>
            ) : artisans.length === 0 ? (
              <div className="py-10 text-center">
                <p className="font-serif text-lg text-[#1f1b18]/65">
                  Chưa có xưởng nào
                </p>
                <p className="mt-1 text-xs text-[#1f1b18]/35">
                  Vui lòng thử tải lại sau.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {artisans.map((artisan) => {
                  const checked = values.targetArtisanIds.includes(
                    artisan.id,
                  );

                  return (
                    <label
                      key={artisan.id}
                      className={`group flex min-w-0 cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition-all duration-300 ${
                        checked
                          ? 'border-[#b45f3c]/45 bg-[#b45f3c]/[0.07]'
                          : 'border-[#1f1b18]/[0.07] bg-white/40 hover:border-[#b45f3c]/25 hover:bg-white/80'
                      } ${
                        loading
                          ? 'cursor-not-allowed opacity-50'
                          : ''
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleArtisan(artisan.id)}
                        disabled={loading}
                        className="peer sr-only"
                      />

                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all duration-200 ${
                          checked
                            ? 'border-[#b45f3c] bg-[#b45f3c] text-white'
                            : 'border-[#1f1b18]/20 bg-transparent text-transparent group-hover:border-[#b45f3c]/50'
                        }`}
                      >
                        <svg
                          viewBox="0 0 16 16"
                          fill="none"
                          className="h-3 w-3"
                        >
                          <path
                            d="m3.5 8 3 3 6-6"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-[#1f1b18]">
                          {artisan.workshopName}
                        </span>
                        <span className="mt-1 block truncate text-[9px] uppercase tracking-[0.13em] text-[#1f1b18]/40">
                          {artisan.ownerName}
                        </span>
                      </span>

                      {checked && (
                        <span className="shrink-0 text-[8px] font-semibold uppercase tracking-wider text-[#b45f3c]">
                          Đã chọn
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          <div className="border-t border-[#1f1b18]/[0.07] bg-[#1f1b18]/[0.02] px-4 py-3 sm:px-5">
            <p className="text-[10px] leading-relaxed text-[#1f1b18]/40">
              Bạn cần chọn ít nhất một xưởng để gửi yêu cầu chào giá.
            </p>
          </div>
        </div>
      </section>

      {(loadError || error) && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-red-500/15 bg-red-50 px-4 py-3.5"
        >
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-semibold text-red-600">
            !
          </span>
          <p className="text-xs leading-relaxed text-red-700">
            {error || loadError}
          </p>
        </div>
      )}

      <div className="flex flex-col-reverse gap-3 border-t border-[#1f1b18]/10 pt-6 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => onSubmit(false)}
          disabled={loading}
          className="rounded-full border border-[#1f1b18]/15 px-7 py-3.5 text-[9px] font-semibold uppercase tracking-[0.17em] text-[#1f1b18]/65 transition-all duration-300 hover:border-[#b45f3c]/50 hover:bg-[#b45f3c]/[0.04] hover:text-[#b45f3c] disabled:cursor-not-allowed disabled:opacity-40 sm:min-w-[160px]"
        >
          Lưu nháp
        </button>

        <button
          type="button"
          onClick={() => onSubmit(true)}
          disabled={loading || isLoadingOptions}
          className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#1f1b18] px-8 py-3.5 text-[9px] font-semibold uppercase tracking-[0.17em] text-[#f6f1ea] transition-all duration-300 hover:bg-[#b45f3c] disabled:cursor-not-allowed disabled:opacity-40 sm:min-w-[190px]"
        >
          {loading ? (
            <>
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#f6f1ea]/25 border-t-[#f6f1ea]" />
              Đang gửi...
            </>
          ) : (
            <>
              Gửi yêu cầu
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
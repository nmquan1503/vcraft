import { useEffect, useState } from 'react';
import { batchApi } from '@/api';
import type { ProductionLog } from '@/types';

interface Props {
  batchId: string;
  onSuccess: (log: ProductionLog) => void;
  onCancel?: () => void;
}

const STAGE_OPTIONS = [
  'Chọn & xử lý đất',
  'Tạo dáng trên bàn xoay',
  'Trang trí hoa văn',
  'Phủ men',
  'Nung lò',
  'Thành phẩm',
  'Khác',
];

const inputCls =
  'w-full bg-transparent border-b border-[#1f1b18]/20 py-2 text-sm placeholder:text-[#1f1b18]/25 focus:outline-none focus:border-[#b45f3c] transition-colors';
const labelCls =
  'block text-[10px] uppercase tracking-[0.25em] text-[#1f1b18]/50 mb-2';

export default function LogForm({ batchId, onSuccess, onCancel }: Props) {
  const [form, setForm] = useState({
    stage: STAGE_OPTIONS[0],
    customStage: '',
    note: '',
    timestamp: new Date().toISOString().slice(0, 16),
  });
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cleanup preview URLs khi unmount hoặc đổi files
  useEffect(() => {
    return () => {
      previews.forEach((p) => URL.revokeObjectURL(p));
    };
  }, [previews]);

  const handleFiles = (list: FileList | null) => {
    if (!list) return;
    const next = Array.from(list);
    setFiles((prev) => [...prev, ...next]);
    setPreviews((prev) => [
      ...prev,
      ...next.map((f) => URL.createObjectURL(f)),
    ]);
  };

  const removeFile = (idx: number) => {
    URL.revokeObjectURL(previews[idx]);
    setFiles((f) => f.filter((_, i) => i !== idx));
    setPreviews((p) => p.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const stage =
      form.stage === 'Khác' ? form.customStage.trim() : form.stage;
    if (!stage) return setError('Vui lòng chọn hoặc nhập công đoạn.');

    setSubmitting(true);
    try {
      // 1. Tạo log trước (không ảnh)
      const log = await batchApi.createLog(batchId, {
        stage,
        note: form.note.trim() || undefined,
        timestamp: new Date(form.timestamp).toISOString(),
      });

      // 2. Upload ảnh nếu có
      if (files.length > 0) {
        try {
          const urls = await batchApi.uploadLogImages(batchId, log.id, files);
          if (urls.length > 0) {
            await batchApi.updateLog(batchId, log.id, { images: urls });
            log.images = urls;
          }
        } catch {
          // Log đã tạo, chỉ ảnh fail → vẫn OK
          console.warn('Upload ảnh thất bại, log vẫn được tạo');
        }
      }

      onSuccess(log);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thêm được log.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-[#1f1b18]/15 p-6 bg-[#1f1b18]/[0.02]"
    >
      <div className="flex items-center justify-between mb-6">
        <p className="text-[10px] uppercase tracking-[0.25em] text-[#b45f3c]">
          Thêm nhật ký mới
        </p>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-[#1f1b18]/40 hover:text-[#1f1b18] text-xl leading-none"
            aria-label="Đóng"
          >
            ✕
          </button>
        )}
      </div>

      <div className="space-y-5">
        {/* Stage */}
        <div>
          <label className={labelCls}>Công đoạn *</label>
          <select
            value={form.stage}
            onChange={(e) => setForm({ ...form, stage: e.target.value })}
            className={`${inputCls} cursor-pointer`}
            disabled={submitting}
          >
            {STAGE_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {form.stage === 'Khác' && (
          <div>
            <label className={labelCls}>Tên công đoạn</label>
            <input
              type="text"
              value={form.customStage}
              onChange={(e) =>
                setForm({ ...form, customStage: e.target.value })
              }
              placeholder="VD: Đánh bóng"
              className={inputCls}
              disabled={submitting}
            />
          </div>
        )}

        {/* Timestamp */}
        <div>
          <label className={labelCls}>Thời điểm</label>
          <input
            type="datetime-local"
            value={form.timestamp}
            onChange={(e) => setForm({ ...form, timestamp: e.target.value })}
            className={inputCls}
            disabled={submitting}
          />
        </div>

        {/* Note */}
        <div>
          <label className={labelCls}>Ghi chú</label>
          <textarea
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            rows={3}
            placeholder="VD: Đất sét trắng Bát Tràng, ủ 3 ngày"
            className={`${inputCls} resize-none`}
            disabled={submitting}
          />
        </div>

        {/* Images */}
        <div>
          <label className={labelCls}>Ảnh chứng minh</label>
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 mb-2">
            {previews.map((p, i) => (
              <div
                key={i}
                className="relative aspect-square overflow-hidden bg-[#1f1b18]/5 group"
              >
                <img src={p} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="absolute inset-0 bg-[#1f1b18]/70 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] uppercase tracking-widest"
                >
                  Xoá
                </button>
              </div>
            ))}
            <label className="aspect-square border border-dashed border-[#1f1b18]/25 flex flex-col items-center justify-center text-[#1f1b18]/40 cursor-pointer hover:border-[#b45f3c] hover:text-[#b45f3c] transition-colors">
              <span className="text-xl leading-none">+</span>
              <span className="text-[8px] uppercase tracking-widest mt-1">
                Thêm
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleFiles(e.target.files)}
                disabled={submitting}
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
          type="submit"
          disabled={submitting}
          className="w-full bg-[#1f1b18] text-[#f6f1ea] rounded-full px-7 py-3 text-xs uppercase tracking-widest hover:bg-[#b45f3c] disabled:opacity-50 transition-colors"
        >
          {submitting ? 'Đang lưu…' : 'Thêm nhật ký'}
        </button>
      </div>
    </form>
  );
}
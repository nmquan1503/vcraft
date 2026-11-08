import { Link } from 'react-router-dom';
import type { Batch, ArtisanProfile, QrInfo } from '@/types';

interface Props {
  batch: Batch;
  artisan: ArtisanProfile;
  qr: QrInfo | null;
  totalLogs: number;
}

const STATUS_LABEL: Record<string, string> = {
  IN_PROGRESS: 'Đang sản xuất',
  COMPLETED: 'Hoàn thành',
  DRAFT: 'Bản nháp',
};

const formatDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
};

export default function TraceHero({ batch, artisan, qr, totalLogs }: Props) {
  return (
    <section className="bg-[#1f1b18] text-[#f6f1ea] pt-24 md:pt-32 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        <Link
          to="/products"
          className="inline-block mb-12 text-[11px] uppercase tracking-[0.25em] text-[#f6f1ea]/40 hover:text-[#d9a08b] transition-colors"
        >
          ← Về bộ sưu tập
        </Link>

        <div className="grid md:grid-cols-12 gap-12 items-start">
          {/* QR Code */}
          <div className="md:col-span-4 flex justify-center md:justify-start">
            <div className="bg-[#f6f1ea] p-4">
              {qr?.qrCodeUrl ? (
                <img
                  src={qr.qrCodeUrl}
                  alt={`QR lô ${batch.name}`}
                  className="w-52 h-52"
                />
              ) : (
                <div className="w-52 h-52 flex items-center justify-center text-[#1f1b18]/30 text-xs uppercase tracking-widest">
                  Đang tải QR…
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="md:col-span-8">
            <p className="text-[11px] uppercase tracking-[0.35em] text-[#d9a08b] mb-5">
              Truy xuất nguồn gốc
            </p>

            <h1 className="font-serif text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.95] tracking-tight">
              {batch.name}
            </h1>

            {batch.description && (
              <p className="mt-6 text-base text-[#f6f1ea]/60 leading-relaxed max-w-lg">
                {batch.description}
              </p>
            )}

            {/* Meta */}
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-[#f6f1ea]/15 pt-8">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#d9a08b]/70">
                  Nghệ nhân
                </p>
                <p className="mt-2 text-sm text-[#f6f1ea]/90">
                  {artisan.ownerName}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#d9a08b]/70">
                  Xưởng
                </p>
                <p className="mt-2 text-sm text-[#f6f1ea]/90 leading-tight">
                  {artisan.workshopName}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#d9a08b]/70">
                  Số lượng
                </p>
                <p className="mt-2 text-sm text-[#f6f1ea]/90">
                  {batch.quantity} sản phẩm
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#d9a08b]/70">
                  Trạng thái
                </p>
                <p className="mt-2 text-sm text-[#f6f1ea]/90">
                  {STATUS_LABEL[batch.status] ?? batch.status}
                </p>
              </div>
            </div>

            {/* Timeline summary */}
            <div className="mt-8 flex items-center gap-6 text-[11px] uppercase tracking-[0.2em] text-[#f6f1ea]/50">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d9a08b]" />
                {totalLogs} công đoạn
              </span>
              <span>Bắt đầu {formatDate(batch.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
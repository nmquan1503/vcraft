import { Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
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

const ease = [0.22, 1, 0.36, 1] as const;

const reveal: Variants = {
  hidden: {
    opacity: 0,
    y: 28,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.85,
      ease,
    },
  },
};

const imageReveal: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.94,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 1,
      ease,
    },
  },
};

const formatDate = (iso?: string | null) => {
  if (!iso) return 'Chưa cập nhật';

  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) return iso;

  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export default function TraceHero({
  batch,
  artisan,
  qr,
  totalLogs,
}: Props) {
  const status = STATUS_LABEL[batch.status] ?? batch.status;

  return (
    <section className="relative isolate overflow-hidden bg-[#1f1b18] pb-20 pt-28 text-[#f6f1ea] sm:pb-24 sm:pt-32 md:pb-28 md:pt-36">
      <div className="pointer-events-none absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full border border-[#f6f1ea]/[0.045]" />
      <div className="pointer-events-none absolute -right-20 -top-20 h-[400px] w-[400px] rounded-full border border-[#f6f1ea]/[0.045]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-[#d9a08b]/30 to-transparent" />

      <div className="relative mx-auto max-w-[1440px] px-5 sm:px-8 md:px-12 lg:px-20">
        <motion.div
          variants={reveal}
          initial="hidden"
          animate="visible"
        >
          <Link
            to="/products"
            className="group mb-12 inline-flex items-center gap-3 text-[9px] uppercase tracking-[0.24em] text-[#f6f1ea]/45 transition-colors duration-300 hover:text-[#d9a08b] sm:mb-16 sm:text-[10px]"
          >
            <span className="inline-block transition-transform duration-300 group-hover:-translate-x-1">
              ←
            </span>
            Về bộ sưu tập
          </Link>
        </motion.div>

        <div className="grid items-center gap-12 md:grid-cols-12 md:gap-10 lg:gap-20">
          <motion.div
            variants={imageReveal}
            initial="hidden"
            animate="visible"
            className="md:col-span-4"
          >
            <div className="relative mx-auto max-w-[300px] sm:max-w-[340px] md:mx-0 md:max-w-none">
              <div className="absolute -inset-3 rounded-tl-[85px] rounded-br-[85px] border border-[#d9a08b]/25 sm:-inset-4 sm:rounded-tl-[110px] sm:rounded-br-[110px]" />

              <div className="relative overflow-hidden rounded-tl-[75px] rounded-br-[75px] bg-[#f6f1ea] p-5 sm:rounded-tl-[95px] sm:rounded-br-[95px] sm:p-7">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <span className="text-[8px] uppercase tracking-[0.22em] text-[#1f1b18]/45 sm:text-[9px]">
                    Digital traceability
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-[#b45f3c]" />
                </div>

                <div className="flex aspect-square w-full items-center justify-center overflow-hidden bg-white">
                  {qr?.qrCodeUrl ? (
                    <img
                      src={qr.qrCodeUrl}
                      alt={`QR truy xuất lô ${batch.name}`}
                      className="h-full w-full object-contain p-2"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-[#eee7dc] px-5 text-center">
                      <div className="grid grid-cols-3 gap-1 opacity-25">
                        {Array.from({ length: 9 }).map((_, index) => (
                          <span
                            key={index}
                            className={`h-7 w-7 ${
                              [0, 2, 4, 6, 8].includes(index)
                                ? 'bg-[#1f1b18]'
                                : 'border border-[#1f1b18]'
                            }`}
                          />
                        ))}
                      </div>

                      <p className="text-[9px] uppercase tracking-[0.16em] text-[#1f1b18]/45">
                        QR chưa khả dụng
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#1f1b18]/10 pt-4">
                  <span className="text-[8px] uppercase tracking-[0.2em] text-[#1f1b18]/40 sm:text-[9px]">
                    Scan to discover
                  </span>
                  <span className="font-serif text-sm italic text-[#b45f3c]">
                    Bát Tràng
                  </span>
                </div>
              </div>

              <div className="absolute -bottom-9 -right-2 hidden font-serif text-6xl italic text-[#f6f1ea]/[0.07] sm:block md:-right-8 md:text-7xl">
                Origin
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={reveal}
            initial="hidden"
            animate="visible"
            className="min-w-0 md:col-span-8"
          >
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-9 bg-[#d9a08b]" />
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#d9a08b] sm:text-[11px]">
                Truy xuất nguồn gốc
              </p>
            </div>

            <h1 className="max-w-3xl break-words font-serif text-[clamp(2.8rem,6vw,5.5rem)] leading-[1.02] tracking-[-0.04em]">
              {batch.name}
            </h1>

            {batch.description && (
              <p className="mt-6 max-w-xl break-words text-sm leading-[1.9] text-[#f6f1ea]/55 sm:text-base">
                {batch.description}
              </p>
            )}

            <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-7 border-t border-[#f6f1ea]/15 pt-8 sm:grid-cols-4 sm:gap-x-5 sm:gap-y-8">
              <div className="min-w-0">
                <p className="text-[9px] uppercase tracking-[0.2em] text-[#d9a08b]/65 sm:text-[10px]">
                  Nghệ nhân
                </p>
                <p className="mt-3 break-words text-sm leading-relaxed text-[#f6f1ea]/90">
                  {artisan.ownerName}
                </p>
              </div>

              <div className="min-w-0">
                <p className="text-[9px] uppercase tracking-[0.2em] text-[#d9a08b]/65 sm:text-[10px]">
                  Xưởng sản xuất
                </p>
                <p className="mt-3 break-words text-sm leading-relaxed text-[#f6f1ea]/90">
                  {artisan.workshopName}
                </p>
              </div>

              <div className="min-w-0">
                <p className="text-[9px] uppercase tracking-[0.2em] text-[#d9a08b]/65 sm:text-[10px]">
                  Số lượng
                </p>
                <p className="mt-3 break-words text-sm text-[#f6f1ea]/90">
                  {batch.quantity} sản phẩm
                </p>
              </div>

              <div className="min-w-0">
                <p className="text-[9px] uppercase tracking-[0.2em] text-[#d9a08b]/65 sm:text-[10px]">
                  Trạng thái
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <span
                    className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                      batch.status === 'COMPLETED'
                        ? 'bg-emerald-400'
                        : batch.status === 'IN_PROGRESS'
                          ? 'bg-[#d9a08b]'
                          : 'bg-[#f6f1ea]/35'
                    }`}
                  />
                  <span className="break-words text-sm text-[#f6f1ea]/90">
                    {status}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4 border-t border-[#f6f1ea]/10 pt-7">
              <div className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#d9a08b]" />
                <span className="text-[9px] uppercase tracking-[0.18em] text-[#f6f1ea]/55 sm:text-[10px]">
                  {totalLogs} công đoạn
                </span>
              </div>

              <div className="text-[9px] uppercase tracking-[0.18em] text-[#f6f1ea]/45 sm:text-[10px]">
                Bắt đầu {formatDate(batch.createdAt)}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
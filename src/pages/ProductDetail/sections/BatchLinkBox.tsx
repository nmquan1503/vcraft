import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Batch } from '@/types';

interface Props {
  batch: Batch;
}

const STATUS_LABEL: Record<string, string> = {
  IN_PROGRESS: 'Đang sản xuất',
  COMPLETED: 'Hoàn thành',
  DRAFT: 'Bản nháp',
};

const EASE = [0.22, 1, 0.36, 1] as const;
const NOISE_BG =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export default function BatchLinkBox({ batch }: Props) {
  return (
    <section className="max-w-6xl mx-auto px-6 mb-20 md:mb-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="relative overflow-hidden rounded-2xl bg-[#1f1b18] text-[#f6f1ea] shadow-[0_30px_80px_-30px_rgba(31,27,24,0.5)]"
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.08] mix-blend-overlay"
          style={{ backgroundImage: NOISE_BG }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(ellipse 60% 50% at 15% 100%, rgba(217,160,139,0.14) 0%, transparent 60%)',
          }}
          aria-hidden="true"
        />

        <div className="relative grid md:grid-cols-3 gap-8 md:gap-10 items-center p-8 md:p-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
            className="flex justify-center md:justify-start"
          >
            <div className="relative bg-[#f6f1ea] p-3 rounded-xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]">
              <img
                src={batch.qrCodeUrl}
                alt={`QR lô ${batch.name}`}
                className="w-28 h-28 rounded-md"
              />
              <motion.span
                aria-hidden="true"
                initial={{ top: '12%' }}
                animate={{ top: ['12%', '82%', '12%'] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute left-3 right-3 h-px pointer-events-none"
                style={{
                  background:
                    'linear-gradient(90deg, transparent, #b45f3c 20%, #b45f3c 80%, transparent)',
                  boxShadow: '0 0 10px rgba(180,95,60,0.85)',
                }}
              />
            </div>
          </motion.div>

          <div className="md:col-span-2">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#d9a08b] mb-3">
              Truy xuất nguồn gốc
            </p>
            <h3 className="font-serif text-2xl md:text-3xl leading-tight">{batch.name}</h3>

            <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-1.5 text-[11px] uppercase tracking-[0.2em] text-[#f6f1ea]/60">
              <span>{batch.quantity} sản phẩm</span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d9a08b] animate-pulse" />
                {STATUS_LABEL[batch.status] ?? batch.status}
              </span>
            </div>

            {batch.description && (
              <p className="mt-4 text-sm text-[#f6f1ea]/70 leading-relaxed max-w-lg">
                {batch.description}
              </p>
            )}

            <Link
              to={`/trace/${batch.id}`}
              className="group mt-6 inline-flex items-center gap-2 text-[11px] uppercase tracking-widest text-[#d9a08b] hover:text-[#f6f1ea] transition-colors"
            >
              <span className="border-b border-current pb-1">Xem nhật ký sản xuất</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
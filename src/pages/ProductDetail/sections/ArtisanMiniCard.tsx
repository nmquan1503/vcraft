import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ImagePlaceholder from '@/components/ui/ImagePlaceholder';
import type { ArtisanProfile } from '@/types';

interface Props {
  artisan: ArtisanProfile;
}

const EASE = [0.22, 1, 0.36, 1] as const;

export default function ArtisanMiniCard({ artisan }: Props) {
  const img = artisan.images[0] ?? null;

  return (
    <section className="relative bg-[#f6f1ea] py-20 md:py-24">
      <div
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#1f1b18]/10 to-transparent"
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-12 gap-10 md:gap-14 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="md:col-span-4"
          >
            <div className="group aspect-[4/5] overflow-hidden rounded-2xl bg-[#1f1b18]/5 shadow-[0_20px_60px_-30px_rgba(31,27,24,0.25)]">
              {img ? (
                <img
                  src={img}
                  alt={artisan.workshopName}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
                />
              ) : (
                <ImagePlaceholder
                  label={artisan.workshopName}
                  aspect="aspect-[4/5]"
                  tone="sand"
                />
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
            className="md:col-span-8"
          >
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#b45f3c] mb-3">
              Nghệ nhân sản xuất
            </p>
            <h2 className="font-serif text-2xl md:text-4xl leading-tight">
              {artisan.ownerName}
            </h2>
            <p className="mt-2 text-sm uppercase tracking-[0.15em] text-[#1f1b18]/50">
              {artisan.workshopName}
            </p>

            {artisan.description && (
              <p className="mt-5 text-sm text-[#1f1b18]/70 leading-relaxed max-w-xl">
                {artisan.description}
              </p>
            )}

            {artisan.familyHistory && (
              <motion.blockquote
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
                className="relative mt-6 pl-6 md:pl-7"
              >
                <span
                  className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#b45f3c] to-[#b45f3c]/20"
                  aria-hidden="true"
                />
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#b45f3c]/70 mb-1.5">
                  Lịch sử gia đình
                </p>
                <p className="font-serif text-base md:text-lg italic text-[#1f1b18]/80 leading-relaxed">
                  “{artisan.familyHistory}”
                </p>
              </motion.blockquote>
            )}

            <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-[11px] uppercase tracking-[0.15em] text-[#1f1b18]/50">
              <span className="flex items-center gap-1.5">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    artisan.openStatus ? 'bg-green-600 animate-pulse' : 'bg-[#1f1b18]/30'
                  }`}
                />
                {artisan.openStatus ? 'Đang mở cửa' : 'Đóng cửa'}
              </span>
              <span>{artisan.certificates.length} chứng nhận</span>
            </div>

            <Link
              to={`/artisans/${artisan.id}`}
              className="group mt-7 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#1f1b18] hover:text-[#b45f3c] transition-colors"
            >
              <span className="border-b border-current pb-1">Xem hồ sơ đầy đủ</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
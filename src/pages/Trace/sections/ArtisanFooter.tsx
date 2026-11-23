import { Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';

import ImagePlaceholder from '@/components/ui/ImagePlaceholder';
import type { ArtisanProfile } from '@/types';

interface Props {
  artisan: ArtisanProfile;
}

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

export default function ArtisanFooter({ artisan }: Props) {
  const img = artisan.images?.[0] ?? null;

  return (
    <section className="relative isolate overflow-hidden bg-[#1f1b18] py-20 text-[#f6f1ea] sm:py-24 md:py-32">
      <div className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full border border-[#f6f1ea]/[0.05]" />
      <div className="pointer-events-none absolute -right-20 -top-20 h-[360px] w-[360px] rounded-full border border-[#f6f1ea]/[0.05]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-[#d9a08b]/30 to-transparent" />

      <div className="relative mx-auto grid max-w-[1440px] items-center gap-14 px-5 sm:px-8 md:grid-cols-12 md:gap-12 md:px-12 lg:gap-20 lg:px-20">
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="md:col-span-5"
        >
          <div className="relative mx-auto max-w-[360px] md:mx-0 md:max-w-none">
            <div className="absolute -bottom-4 -left-4 h-full w-full rounded-tl-[120px] rounded-br-[120px] border border-[#d9a08b]/40 sm:-bottom-5 sm:-left-5" />

            <div className="relative aspect-[4/5] overflow-hidden rounded-tl-[120px] rounded-br-[120px] bg-[#3b302a]">
              {img ? (
                <img
                  src={img}
                  alt={artisan.workshopName}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out hover:scale-105"
                />
              ) : (
                <ImagePlaceholder
                  label={artisan.workshopName}
                  aspect="aspect-[4/5]"
                  tone="sand"
                  className="h-full w-full"
                />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-[#1f1b18]/75 via-transparent to-[#1f1b18]/10" />

              <div className="absolute bottom-7 left-6 right-6 sm:bottom-9 sm:left-8">
                <p className="text-[9px] uppercase tracking-[0.25em] text-[#d9a08b] sm:text-[10px]">
                  Nghệ nhân Bát Tràng
                </p>

                <h3 className="mt-3 break-words font-serif text-2xl leading-tight text-white sm:text-3xl">
                  {artisan.ownerName}
                </h3>
              </div>
            </div>

            <div className="absolute -right-3 top-10 hidden rounded-full border border-[#d9a08b]/40 bg-[#1f1b18] px-5 py-2.5 sm:block md:-right-5">
              <span className="text-[9px] uppercase tracking-[0.2em] text-[#d9a08b]">
                Made by hand
              </span>
            </div>

            <div className="absolute -bottom-12 right-0 hidden font-serif text-7xl italic text-[#f6f1ea]/[0.07] sm:block md:-right-5 md:text-8xl">
              Artisan
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="min-w-0 md:col-span-7"
        >
          <div className="mb-7 flex items-center gap-3">
            <span className="h-px w-9 bg-[#d9a08b]" />
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#d9a08b] sm:text-[11px]">
              Người làm ra lô gốm này
            </p>
          </div>

          <h2 className="break-words font-serif text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.05] tracking-[-0.035em]">
            {artisan.ownerName}
          </h2>

          <p className="mt-4 break-words text-[10px] uppercase tracking-[0.2em] text-[#f6f1ea]/45 sm:text-[11px]">
            {artisan.workshopName}
          </p>

          {artisan.familyHistory && (
            <div className="relative mt-9 max-w-xl border-l border-[#d9a08b]/50 pl-5 sm:pl-7">
              <span className="absolute -top-5 left-5 font-serif text-5xl leading-none text-[#d9a08b]/30 sm:left-7">
                “
              </span>

              <p className="relative break-words pt-5 font-serif text-lg italic leading-[1.75] text-[#f6f1ea]/70 sm:text-xl">
                {artisan.familyHistory}
              </p>
            </div>
          )}

          <div className="mt-10 grid grid-cols-1 gap-6 border-t border-[#f6f1ea]/15 pt-7 sm:grid-cols-2 sm:gap-8">
            <div>
              <p className="text-[9px] uppercase tracking-[0.22em] text-[#d9a08b]/65 sm:text-[10px]">
                Trạng thái xưởng
              </p>

              <div className="mt-3 flex items-center gap-3">
                <span
                  className={`relative flex h-2 w-2 shrink-0 rounded-full ${
                    artisan.openStatus
                      ? 'bg-emerald-400'
                      : 'bg-[#f6f1ea]/30'
                  }`}
                >
                  {artisan.openStatus && (
                    <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-40" />
                  )}
                </span>

                <span className="text-sm text-[#f6f1ea]/85">
                  {artisan.openStatus ? 'Đang mở cửa' : 'Đóng cửa'}
                </span>
              </div>
            </div>

            <div className="min-w-0">
              <p className="text-[9px] uppercase tracking-[0.22em] text-[#d9a08b]/65 sm:text-[10px]">
                Địa chỉ xưởng
              </p>

              <p className="mt-3 break-words text-sm leading-relaxed text-[#f6f1ea]/70">
                {artisan.address || 'Chưa cập nhật địa chỉ'}
              </p>
            </div>
          </div>

          <div className="mt-10">
            <Link
              to={`/artisans/${artisan.id}`}
              className="group inline-flex items-center gap-5 border-b border-[#d9a08b]/40 pb-3 text-[10px] uppercase tracking-[0.2em] text-[#d9a08b] transition-colors duration-300 hover:border-[#f6f1ea] hover:text-[#f6f1ea] sm:text-[11px]"
            >
              Xem hồ sơ xưởng

              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
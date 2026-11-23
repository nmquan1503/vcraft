import { Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';

import ImagePlaceholder from '@/components/ui/ImagePlaceholder';
import type { ArtisanProfile } from '@/types';

interface Props {
  artisan: ArtisanProfile;
}

const ease = [0.22, 1, 0.36, 1] as const;

const revealText: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease,
    },
  },
};

const imageReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 28,
    scale: 0.97,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 1.15,
      ease,
    },
  },
};

const containerReveal: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

export default function ArtisanHero({ artisan }: Props) {
  const heroImg = artisan.images?.[0] ?? null;

  const metaItems = [
    {
      label: 'Trạng thái',
      content: (
        <span className="inline-flex items-center gap-2">
          <span
            className={`relative h-2 w-2 shrink-0 rounded-full ${
              artisan.openStatus
                ? 'bg-emerald-600'
                : 'bg-[#1f1b18]/30'
            }`}
          >
            {artisan.openStatus && (
              <span className="absolute inset-0 animate-ping rounded-full bg-emerald-600/30" />
            )}
          </span>
          <span>
            {artisan.openStatus ? 'Đang mở cửa' : 'Đóng cửa'}
          </span>
        </span>
      ),
    },
    {
      label: 'Điện thoại',
      content: artisan.phone || 'Chưa cập nhật',
    },
    ...(artisan.certificates?.length
      ? [
          {
            label: 'Chứng nhận',
            content: `${artisan.certificates.length} bằng cấp`,
          },
        ]
      : []),
  ];

  return (
    <section className="relative isolate overflow-hidden bg-[#f6f1ea]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-10 h-[420px] w-[420px] rounded-full border border-[#b45f3c]/[0.07] sm:h-[560px] sm:w-[560px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 top-36 h-[300px] w-[300px] rounded-full border border-[#b45f3c]/[0.06] sm:h-[400px] sm:w-[400px]"
      />

      <div className="relative mx-auto max-w-[1440px] px-5 pb-20 pt-24 sm:px-8 sm:pb-24 sm:pt-28 md:px-12 md:pb-28 md:pt-32 lg:px-20">
        <motion.div
          variants={revealText}
          initial="hidden"
          animate="visible"
        >
          <Link
            to="/artisans"
            className="group mb-10 inline-flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.22em] text-[#1f1b18]/45 transition-colors duration-500 hover:text-[#b45f3c] sm:mb-14 sm:text-[11px]"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#1f1b18]/15 transition-all duration-500 group-hover:-translate-x-1 group-hover:border-[#b45f3c]/40 group-hover:bg-[#b45f3c]/5">
              <span className="text-base transition-transform duration-500 group-hover:-translate-x-0.5">
                ←
              </span>
            </span>
            Tất cả nghệ nhân
          </Link>
        </motion.div>

        <div className="grid items-center gap-14 md:grid-cols-12 md:gap-8 lg:gap-16">
          <motion.div
            className="relative md:col-span-5"
            variants={imageReveal}
            initial="hidden"
            animate="visible"
          >
            <div className="relative mx-auto w-full max-w-[480px] md:mx-0 md:max-w-none">
              <div
                aria-hidden="true"
                className="absolute -bottom-5 -right-4 left-5 top-5 rounded-tl-[120px] rounded-tr-[24px] rounded-bl-[24px] rounded-br-[120px] bg-[#d9a08b]/35 sm:-bottom-6 sm:-right-6 sm:left-7 sm:top-7"
              />

              <div className="group relative aspect-[4/5] overflow-hidden rounded-tl-[110px] rounded-tr-[20px] rounded-bl-[20px] rounded-br-[110px] bg-[#e9ded1] sm:aspect-[3/4] sm:rounded-tl-[150px] sm:rounded-br-[150px]">
                {heroImg ? (
                  <img
                    src={heroImg}
                    alt={artisan.workshopName}
                    loading="eager"
                    className="h-full w-full object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-[1.05]"
                  />
                ) : (
                  <ImagePlaceholder
                    label={artisan.workshopName}
                    aspect="aspect-[4/5] sm:aspect-[3/4]"
                    tone="sand"
                  />
                )}

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1f1b18]/25 via-transparent to-transparent opacity-70" />
              </div>

              <div className="absolute -bottom-7 left-5 flex items-center gap-3 rounded-full border border-[#f6f1ea]/80 bg-[#f6f1ea]/95 px-5 py-3 shadow-[0_8px_30px_rgba(31,27,24,0.07)] backdrop-blur-sm sm:bottom-8 sm:-right-8 sm:left-auto">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#b45f3c]" />
                <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-[#1f1b18]/65 sm:text-[10px]">
                  Bát Tràng · Việt Nam
                </span>
              </div>
            </div>

            <div className="mt-12 flex items-center gap-4 pl-1 text-[9px] uppercase tracking-[0.2em] text-[#1f1b18]/35 sm:mt-10 sm:text-[10px]">
              <span className="shrink-0">Không gian làng nghề</span>
              <span className="h-px flex-1 bg-[#1f1b18]/15" />
              <span className="shrink-0">01 / 01</span>
            </div>
          </motion.div>

          <motion.div
            className="min-w-0 md:col-span-7 md:pl-3 lg:pl-8"
            variants={containerReveal}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              variants={revealText}
              className="mb-6 flex flex-wrap items-center gap-3 text-[10px] font-medium uppercase tracking-[0.28em] text-[#b45f3c] sm:mb-8 sm:text-[11px] sm:tracking-[0.35em]"
            >
              <span>Nghệ nhân</span>
              <span className="text-[#b45f3c]/45">✳</span>
              <span className="text-[#1f1b18]/45">
                {artisan.district}
              </span>
            </motion.div>

            <motion.h1
              variants={revealText}
              className="max-w-3xl break-words font-serif text-[clamp(2.8rem,7vw,6rem)] leading-[0.98] tracking-[-0.045em] text-[#1f1b18]"
            >
              {artisan.ownerName}
            </motion.h1>

            <motion.div
              variants={revealText}
              className="mt-6 flex items-start gap-3 sm:mt-8"
            >
              <span className="mt-3 h-px w-8 shrink-0 bg-[#b45f3c] sm:w-12" />
              <p className="min-w-0 font-serif text-lg italic leading-snug text-[#1f1b18]/70 sm:text-xl md:text-2xl">
                {artisan.workshopName}
              </p>
            </motion.div>

            {artisan.description && (
              <motion.p
                variants={revealText}
                className="mt-7 max-w-xl break-words text-[13px] leading-[2] text-[#1f1b18]/60 sm:mt-9 sm:text-sm md:text-[15px]"
              >
                {artisan.description}
              </motion.p>
            )}

            <motion.div
              variants={revealText}
              className="mt-10 grid grid-cols-2 gap-x-5 gap-y-7 border-t border-[#1f1b18]/10 pt-7 sm:mt-12 sm:grid-cols-3 sm:gap-x-7 sm:gap-y-5"
            >
              {metaItems.map((item) => (
                <div key={item.label} className="min-w-0">
                  <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#1f1b18]/35 sm:text-[10px]">
                    {item.label}
                  </p>
                  <div className="mt-2.5 break-words text-xs leading-relaxed text-[#1f1b18]/75 sm:text-sm">
                    {item.content}
                  </div>
                </div>
              ))}
            </motion.div>

            <motion.div
              variants={revealText}
              className="mt-10 hidden items-center gap-3 text-[#b45f3c]/50 sm:flex"
            >
              <span className="h-px w-10 bg-current" />
              <span className="font-serif text-sm italic">
                Tinh hoa từ đôi bàn tay
              </span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
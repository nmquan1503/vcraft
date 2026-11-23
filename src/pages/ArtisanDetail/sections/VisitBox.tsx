import { Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import type { ArtisanProfile } from '@/types';

interface Props {
  artisan: ArtisanProfile;
}

const ease = [0.22, 1, 0.36, 1] as const;

const revealText: Variants = {
  hidden: {
    opacity: 0,
    y: 22,
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

const containerReveal: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.13,
      delayChildren: 0.08,
    },
  },
};

export default function VisitBox({ artisan }: Props) {
  const hasLocation =
    artisan.latitude != null &&
    artisan.longitude != null;

  return (
    <section className="relative isolate overflow-hidden bg-[#1f1b18] text-[#f6f1ea]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-28 -top-32 h-72 w-72 rounded-full border border-[#f6f1ea]/[0.07] sm:-right-32 sm:-top-40 sm:h-[30rem] sm:w-[30rem]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 -top-16 h-52 w-52 rounded-full border border-[#f6f1ea]/[0.05] sm:-right-16 sm:-top-20 sm:h-80 sm:w-80"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-20 h-64 w-64 rounded-full border border-[#d9a08b]/[0.06] sm:-bottom-48 sm:-left-28 sm:h-96 sm:w-96"
      />

      <div className="relative mx-auto grid max-w-[1440px] items-center gap-10 px-5 py-16 sm:px-8 sm:py-20 md:grid-cols-12 md:gap-8 md:px-12 md:py-24 lg:gap-14 lg:px-20 lg:py-28">
        <motion.div
          variants={containerReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="min-w-0 md:col-span-7"
        >
          <motion.div
            variants={revealText}
            className="mb-5 flex items-center gap-3"
          >
            <span className="h-px w-8 bg-[#d9a08b]" />

            <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-[#d9a08b] sm:text-[11px] sm:tracking-[0.3em]">
              Ghé thăm xưởng
            </p>
          </motion.div>

          <motion.h2
            variants={revealText}
            className="max-w-2xl font-serif text-[clamp(2.3rem,5.2vw,4.3rem)] leading-[1.08] tracking-[-0.035em] text-[#f6f1ea]"
          >
            Đến tận nơi,
            <br />
            xem nghệ nhân{' '}
            <em className="font-normal text-[#d9a08b]">
              làm việc.
            </em>
          </motion.h2>

          <motion.p
            variants={revealText}
            className="mt-6 max-w-lg break-words text-[13px] leading-[1.95] text-[#f6f1ea]/60 sm:mt-8 sm:text-[15px]"
          >
            {artisan.openStatus
              ? 'Xưởng đang mở cửa đón khách. Bạn có thể ghé thăm, xem quy trình và tự tay thử một vòng bàn xoay.'
              : 'Xưởng hiện đang đóng cửa. Theo dõi bản đồ làng nghề để biết khi nào mở lại.'}
          </motion.p>

          <motion.div
            variants={revealText}
            className="mt-8 inline-flex items-center gap-3 border-t border-[#f6f1ea]/15 pt-5 sm:mt-9"
          >
            <span
              className={`relative flex h-2.5 w-2.5 shrink-0 items-center justify-center rounded-full ${
                artisan.openStatus
                  ? 'bg-green-500/20'
                  : 'bg-[#f6f1ea]/10'
              }`}
            >
              {artisan.openStatus && (
                <span className="absolute h-1.5 w-1.5 rounded-full bg-green-400" />
              )}
            </span>

            <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#f6f1ea]/55 sm:text-[10px]">
              {artisan.openStatus
                ? 'Đang mở cửa'
                : 'Hiện đang đóng cửa'}
            </span>
          </motion.div>
        </motion.div>

        <motion.div
          variants={containerReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="min-w-0 border-t border-[#f6f1ea]/15 pt-7 md:col-span-5 md:border-l md:border-t-0 md:pl-8 md:pt-0 lg:pl-12"
        >
          {hasLocation ? (
            <motion.div variants={revealText}>
              <Link
                to="/map"
                className="group inline-flex w-full items-center justify-between gap-5 rounded-full bg-[#d9a08b] px-6 py-4 text-[10px] font-medium uppercase tracking-[0.16em] text-[#1f1b18] transition-all duration-500 hover:bg-[#f6f1ea] sm:w-auto sm:justify-center sm:px-7 sm:text-[11px]"
              >
                <span>Mở bản đồ làng nghề</span>

                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1f1b18]/10 transition-all duration-500 group-hover:translate-x-1 group-hover:bg-[#1f1b18]/15">
                  →
                </span>
              </Link>

              <p className="mt-5 text-[9px] uppercase tracking-[0.2em] text-[#f6f1ea]/35 sm:text-[10px]">
                Khám phá vị trí xưởng
              </p>
            </motion.div>
          ) : (
            <motion.p
              variants={revealText}
              className="text-[10px] uppercase tracking-[0.18em] text-[#f6f1ea]/40 sm:text-[11px]"
            >
              Chưa cập nhật vị trí xưởng
            </motion.p>
          )}

          {artisan.address && (
            <motion.div
              variants={revealText}
              className="mt-8 border-t border-[#f6f1ea]/10 pt-6 sm:mt-10 sm:pt-7"
            >
              <p className="mb-3 text-[9px] font-medium uppercase tracking-[0.22em] text-[#d9a08b]/70 sm:text-[10px]">
                Địa chỉ xưởng
              </p>

              <p className="break-words text-[13px] leading-[1.9] text-[#f6f1ea]/65 sm:text-sm md:max-w-sm">
                {artisan.address}
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
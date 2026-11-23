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
      staggerChildren: 0.14,
      delayChildren: 0.08,
    },
  },
};

export default function ArtisanStory({ artisan }: Props) {
  if (!artisan.familyHistory && !artisan.description) {
    return null;
  }

  return (
    <section className="relative isolate overflow-hidden border-y border-[#1f1b18]/10 bg-[#f6f1ea]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-12 h-64 w-64 rounded-full border border-[#b45f3c]/[0.08] sm:-right-32 sm:h-96 sm:w-96"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 top-28 h-44 w-44 rounded-full border border-[#b45f3c]/[0.06] sm:-right-16 sm:top-40 sm:h-64 sm:w-64"
      />

      <div className="relative mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 md:px-12 md:py-24 lg:px-20 lg:py-28">
        <div className="grid gap-10 md:grid-cols-12 md:gap-8 lg:gap-14">
          <motion.div
            variants={revealText}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="min-w-0 md:col-span-4"
          >
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-8 bg-[#b45f3c]" />

              <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-[#b45f3c] sm:text-[11px] sm:tracking-[0.3em]">
                Câu chuyện xưởng
              </p>
            </div>

            <h2 className="font-serif text-[clamp(2.7rem,5.5vw,4.5rem)] leading-[1.02] tracking-[-0.04em] text-[#1f1b18]">
              Nghề
              <br />
              trong{' '}
              <em className="font-normal text-[#b45f3c]">
                máu.
              </em>
            </h2>

            <div className="mt-7 flex items-center gap-3 sm:mt-8">
              <span className="h-px w-12 bg-[#b45f3c] sm:w-16" />

              <span className="text-[9px] uppercase tracking-[0.2em] text-[#1f1b18]/35">
                Di sản qua thế hệ
              </span>
            </div>
          </motion.div>

          <motion.div
            variants={containerReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="min-w-0 md:col-span-8 md:pt-2"
          >
            {artisan.familyHistory && (
              <motion.blockquote
                variants={revealText}
                className="relative border-l-2 border-[#b45f3c]/60 py-1 pl-5 sm:pl-7 md:pl-9"
              >
                <span
                  aria-hidden="true"
                  className="absolute -left-1 -top-5 font-serif text-5xl leading-none text-[#b45f3c]/20 sm:-top-7 sm:text-6xl"
                >
                  “
                </span>

                <p className="font-serif text-[clamp(1.3rem,2.7vw,2rem)] italic leading-[1.55] text-[#1f1b18]/85">
                  {artisan.familyHistory}
                </p>
              </motion.blockquote>
            )}

            {artisan.description && (
              <motion.div
                variants={revealText}
                className={artisan.familyHistory ? 'mt-8 sm:mt-10 md:mt-12' : ''}
              >
                <div className="mb-4 flex items-center gap-3">
                  <span className="h-px w-5 bg-[#b45f3c]/60" />

                  <span className="text-[9px] font-medium uppercase tracking-[0.22em] text-[#1f1b18]/40">
                    Về xưởng gốm
                  </span>
                </div>

                <p className="max-w-3xl break-words text-[13px] leading-[2] text-[#1f1b18]/70 sm:text-[15px] md:text-base md:leading-[2.05]">
                  {artisan.description}
                </p>
              </motion.div>
            )}

            <motion.div
              variants={revealText}
              className="mt-9 border-t border-[#1f1b18]/10 pt-6 sm:mt-12 sm:pt-8"
            >
              <div className="grid gap-3 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-6 md:grid-cols-[170px_minmax(0,1fr)]">
                <div className="flex items-center gap-3 sm:items-start">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#b45f3c]" />

                  <p className="text-[9px] font-medium uppercase tracking-[0.22em] text-[#1f1b18]/40 sm:pt-0.5 sm:text-[10px] sm:tracking-[0.25em]">
                    Địa chỉ xưởng
                  </p>
                </div>

                <p className="max-w-2xl break-words text-[13px] leading-[1.9] text-[#1f1b18]/80 sm:text-[15px] md:text-base">
                  {artisan.address || 'Chưa cập nhật địa chỉ'}
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
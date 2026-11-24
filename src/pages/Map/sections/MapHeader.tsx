import { motion, type Variants } from 'framer-motion';

interface Props {
  total: number;
  openOnly: boolean;
  onToggleOpenOnly: () => void;
  loading: boolean;
}

const ease = [0.22, 1, 0.36, 1] as const;

const reveal: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
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
      staggerChildren: 0.12,
    },
  },
};

export default function MapHeader({
  total,
  openOnly,
  onToggleOpenOnly,
  loading,
}: Props) {
  return (
    <section className="relative overflow-hidden px-5 pb-10 pt-28 sm:px-8 sm:pt-32 md:px-12 md:pb-14 lg:px-20 lg:pt-36">
      <div className="pointer-events-none absolute -right-24 top-12 h-72 w-72 rounded-full border border-[#b45f3c]/10 sm:-right-16 sm:h-96 sm:w-96" />
      <div className="pointer-events-none absolute -right-12 top-24 h-56 w-56 rounded-full border border-[#b45f3c]/10 sm:h-72 sm:w-72" />

      <motion.div
        variants={containerReveal}
        initial="hidden"
        animate="visible"
        className="relative mx-auto max-w-[1440px]"
      >
        <motion.div
          variants={reveal}
          className="mb-6 flex items-center gap-3"
        >
          <span className="h-px w-8 bg-[#b45f3c]" />

          <p className="text-[10px] uppercase tracking-[0.28em] text-[#b45f3c] sm:text-[11px]">
            Bản đồ làng nghề
          </p>

          <span className="text-[10px] text-[#1f1b18]/30">
            · Bát Tràng, Hà Nội
          </span>
        </motion.div>

        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <motion.div variants={reveal} className="max-w-3xl">
            <h1 className="font-serif text-[clamp(2.8rem,7vw,6.5rem)] leading-[0.94] tracking-[-0.055em] text-[#1f1b18]">
              Tìm về những
              <br />
              <span className="italic text-[#b45f3c]">xưởng gốm.</span>
            </h1>

            <p className="mt-6 max-w-md text-sm leading-relaxed text-[#1f1b18]/55 sm:text-base">
              Theo dấu những người nghệ nhân và khám phá nơi những tác phẩm
              gốm Bát Tràng được tạo nên.
            </p>
          </motion.div>

          <motion.div
            variants={reveal}
            className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between lg:min-w-[340px] lg:flex-col lg:items-end"
          >
            <div className="flex items-baseline gap-3">
              <span className="font-serif text-5xl leading-none tracking-tight text-[#b45f3c] sm:text-6xl">
                {loading ? '—' : String(total).padStart(2, '0')}
              </span>

              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#1f1b18]/45">
                  Xưởng gốm
                </p>
                <p className="mt-1 text-xs text-[#1f1b18]/35">
                  Trong khu vực làng nghề
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onToggleOpenOnly}
              disabled={loading}
              aria-pressed={openOnly}
              className={`group inline-flex min-h-11 items-center justify-center gap-3 rounded-full border px-5 py-3 text-[10px] uppercase tracking-[0.16em] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b45f3c] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f6f1ea] disabled:cursor-not-allowed disabled:opacity-40 sm:min-h-12 ${
                openOnly
                  ? 'border-[#1f1b18] bg-[#1f1b18] text-[#f6f1ea]'
                  : 'border-[#1f1b18]/20 bg-transparent text-[#1f1b18]/65 hover:border-[#b45f3c] hover:text-[#b45f3c]'
              }`}
            >
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full border transition-colors duration-300 ${
                  openOnly
                    ? 'border-[#f6f1ea]/30 bg-[#f6f1ea]/10'
                    : 'border-[#1f1b18]/20 group-hover:border-[#b45f3c]'
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full transition-colors ${
                    openOnly
                      ? 'bg-[#b45f3c]'
                      : 'bg-[#1f1b18]/30 group-hover:bg-[#b45f3c]'
                  }`}
                />
              </span>

              {openOnly ? 'Đang lọc xưởng mở' : 'Chỉ xem xưởng mở'}

              <span
                className={`text-sm transition-transform duration-300 ${
                  openOnly
                    ? 'rotate-45'
                    : 'group-hover:translate-x-0.5'
                }`}
              >
                {openOnly ? '×' : '↗'}
              </span>
            </button>
          </motion.div>
        </div>

        <motion.div
          variants={reveal}
          className="mt-10 flex items-center gap-4 border-t border-[#1f1b18]/10 pt-4"
        >
          <span className="text-[9px] uppercase tracking-[0.2em] text-[#1f1b18]/35">
            Khám phá
          </span>

          <span className="h-px flex-1 bg-[#1f1b18]/10" />

          <span className="text-[9px] uppercase tracking-[0.2em] text-[#1f1b18]/35">
            Một hành trình qua làng nghề
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}
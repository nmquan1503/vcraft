import { motion, type Variants } from 'framer-motion';
import type { Batch } from '@/types';

interface Props {
  batch: Batch;
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
      staggerChildren: 0.1,
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

export default function BatchInfo({ batch }: Props) {
  const items = [
    {
      label: 'Mã lô sản phẩm',
      value: batch.id,
      mono: true,
    },
    {
      label: 'Mã truy xuất',
      value: batch.qrToken,
      mono: true,
    },
    {
      label: 'Ngày bắt đầu',
      value: formatDate(batch.createdAt),
      mono: false,
    },
    {
      label: 'Cập nhật lần cuối',
      value: formatDate(batch.updatedAt),
      mono: false,
    },
  ];

  return (
    <section className="relative isolate overflow-hidden border-y border-[#1f1b18]/10 bg-[#f6f1ea] py-20 sm:py-24 md:py-28">
      <div className="pointer-events-none absolute -right-32 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full border border-[#b45f3c]/[0.07]" />
      <div className="pointer-events-none absolute -right-16 top-1/2 h-[290px] w-[290px] -translate-y-1/2 rounded-full border border-[#b45f3c]/[0.07]" />

      <div className="relative mx-auto grid max-w-[1440px] gap-12 px-5 sm:px-8 md:grid-cols-12 md:gap-10 md:px-12 lg:gap-20 lg:px-20">
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          className="md:col-span-4"
        >
          <div className="mb-6 flex items-center gap-3">
            <span className="h-px w-9 bg-[#b45f3c]" />
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#b45f3c] sm:text-[11px]">
              Về lô sản phẩm
            </p>
          </div>

          <h2 className="max-w-sm font-serif text-[clamp(2.5rem,5vw,3.75rem)] leading-[1.08] tracking-[-0.035em] text-[#1f1b18]">
            Dấu mốc của
            <span className="block italic text-[#b45f3c]">
              một hành trình.
            </span>
          </h2>

          <p className="mt-6 max-w-xs text-sm leading-[1.9] text-[#1f1b18]/55">
            Những thông tin định danh và thời gian ghi nhận quá trình hình
            thành của lô sản phẩm.
          </p>

          <div className="mt-10 hidden items-center gap-4 md:flex">
            <span className="font-serif text-5xl text-[#b45f3c]/20">01</span>
            <span className="h-px w-14 bg-[#b45f3c]/30" />
            <span className="text-[9px] uppercase tracking-[0.22em] text-[#1f1b18]/35">
              Batch information
            </span>
          </div>
        </motion.div>

        <motion.div
          variants={containerReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="min-w-0 md:col-span-8"
        >
          <div className="grid grid-cols-1 gap-x-10 sm:grid-cols-2 sm:gap-x-12">
            {items.map((item, index) => (
              <motion.div
                key={item.label}
                variants={reveal}
                className={`group min-w-0 border-t border-[#1f1b18]/15 py-7 sm:py-8 ${
                  index >= 2 ? 'sm:mt-2' : ''
                }`}
              >
                <div className="mb-5 flex items-center justify-between gap-3">
                  <p className="text-[9px] uppercase tracking-[0.24em] text-[#1f1b18]/45 sm:text-[10px]">
                    {item.label}
                  </p>

                  <span className="font-serif text-sm italic text-[#b45f3c]/50">
                    0{index + 1}
                  </span>
                </div>

                <p
                  title={String(item.value ?? '')}
                  className={`break-all text-sm leading-relaxed text-[#1f1b18]/85 transition-colors duration-300 group-hover:text-[#b45f3c] sm:text-base ${
                    item.mono
                      ? 'font-mono text-[12px] sm:text-[13px]'
                      : 'font-medium'
                  }`}
                >
                  {item.value || 'Chưa cập nhật'}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="mt-3 flex items-center gap-3 border-t border-[#1f1b18]/10 pt-6">
            <span className="h-1.5 w-1.5 rounded-full bg-[#b45f3c]" />
            <p className="text-[9px] uppercase tracking-[0.2em] text-[#1f1b18]/40 sm:text-[10px]">
              Thông tin truy xuất nguồn gốc
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
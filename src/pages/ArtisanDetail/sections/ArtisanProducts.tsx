import { Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';

import ProductCard from '@/components/ui/ProductCard';
import type { Product } from '@/types';

interface Props {
  products: Product[];
  loading: boolean;
  workshopName: string;
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
      delayChildren: 0.1,
    },
  },
};

const itemReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 32,
    scale: 0.985,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.85,
      ease,
    },
  },
};

function ProductSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="relative aspect-[4/5] overflow-hidden rounded-tl-[55px] rounded-br-[55px] bg-[#1f1b18]/[0.06] sm:rounded-tl-[75px] sm:rounded-br-[75px]">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      </div>

      <div className="mt-5 h-3 w-2/3 rounded-full bg-[#1f1b18]/[0.07]" />
      <div className="mt-3 h-3 w-1/3 rounded-full bg-[#1f1b18]/[0.05]" />
    </div>
  );
}

export default function ArtisanProducts({
  products,
  loading,
  workshopName,
}: Props) {
  return (
    <section className="relative isolate overflow-hidden bg-[#f6f1ea]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-48 top-24 h-[420px] w-[420px] rounded-full border border-[#b45f3c]/[0.06] sm:h-[560px] sm:w-[560px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-28 top-44 h-[260px] w-[260px] rounded-full border border-[#b45f3c]/[0.05] sm:h-[380px] sm:w-[380px]"
      />

      <div className="relative mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-24 md:px-12 md:py-28 lg:px-20">
        <div className="mb-12 flex flex-col gap-6 sm:mb-14 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
          <motion.div
            variants={revealText}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="min-w-0"
          >
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-8 bg-[#b45f3c]" />

              <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#b45f3c] sm:text-[11px]">
                Bộ sưu tập
              </p>
            </div>

            <h2 className="max-w-3xl break-words font-serif text-[clamp(2rem,4.5vw,3.8rem)] leading-[1.08] tracking-[-0.035em] text-[#1f1b18]">
              Những tác phẩm
              <br className="hidden sm:block" />
              <span className="italic text-[#b45f3c]">
                {' '}từ {workshopName}.
              </span>
            </h2>

            <p className="mt-5 max-w-md text-xs leading-[1.9] text-[#1f1b18]/50 sm:text-sm">
              Mỗi sản phẩm là một câu chuyện về chất liệu, kỹ thuật
              và đôi bàn tay của người nghệ nhân.
            </p>
          </motion.div>

          {!loading && products.length > 0 && (
            <motion.div
              variants={revealText}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex shrink-0 items-center gap-3 sm:pb-2"
            >
              <span className="font-serif text-4xl italic text-[#b45f3c]/80 sm:text-5xl">
                {String(products.length).padStart(2, '0')}
              </span>

              <span className="text-[9px] uppercase leading-relaxed tracking-[0.2em] text-[#1f1b18]/40 sm:text-[10px]">
                Tác phẩm
                <br />
                được giới thiệu
              </span>
            </motion.div>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-x-7 sm:gap-y-12 lg:grid-cols-3 lg:gap-x-9 lg:gap-y-14">
            {[1, 2, 3].map((item) => (
              <ProductSkeleton key={item} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <motion.div
            variants={revealText}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative overflow-hidden border-y border-[#1f1b18]/10 py-16 sm:py-20"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-10 -top-16 h-64 w-64 rounded-full border border-[#b45f3c]/10"
            />

            <div className="relative max-w-xl">
              <span className="font-serif text-5xl italic text-[#b45f3c]/35">
                ✳
              </span>

              <h3 className="mt-5 font-serif text-2xl leading-snug text-[#1f1b18] sm:text-3xl">
                Những tác phẩm mới đang được chuẩn bị.
              </h3>

              <p className="mt-4 max-w-md text-xs leading-[1.9] text-[#1f1b18]/50 sm:text-sm">
                Xưởng hiện chưa giới thiệu sản phẩm nào.
                Hãy quay lại sau để khám phá những sáng tạo
                tiếp theo từ người nghệ nhân.
              </p>
            </div>
          </motion.div>
        ) : (
          <>
            <motion.div
              variants={containerReveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.06 }}
              className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 sm:gap-x-7 sm:gap-y-14 lg:grid-cols-3 lg:gap-x-9 lg:gap-y-16"
            >
              {products.slice(0, 6).map((product) => (
                <motion.div
                  key={product.id}
                  variants={itemReveal}
                  className="min-w-0"
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>

            {products.length > 6 && (
              <motion.div
                variants={revealText}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="mt-16 flex justify-center sm:mt-20"
              >
                <Link
                  to={`/products?artisanId=${products[0].artisanId}`}
                  className="group inline-flex max-w-full items-center gap-5 rounded-full border border-[#1f1b18]/15 px-7 py-3.5 text-center text-[10px] font-medium uppercase tracking-[0.18em] text-[#1f1b18] transition-all duration-500 hover:border-[#b45f3c] hover:bg-[#b45f3c] hover:text-[#f6f1ea] sm:px-9 sm:text-[11px]"
                >
                  <span>Xem tất cả tác phẩm</span>

                  <span className="transition-transform duration-500 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </motion.div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
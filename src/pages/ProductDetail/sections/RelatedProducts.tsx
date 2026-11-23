import { motion } from 'framer-motion';
import ProductCard from '@/components/ui/ProductCard';
import type { Product } from '@/types';

interface Props {
  products: Product[];
}

const EASE = [0.22, 1, 0.36, 1] as const;

export default function RelatedProducts({ products }: Props) {
  if (products.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-6 pb-20 md:pb-24">
      <div className="relative pt-16 md:pt-20">
        <div
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#1f1b18]/10 to-transparent"
          aria-hidden="true"
        />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.55, ease: EASE }}
          className="mb-10 md:mb-12"
        >
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#b45f3c] mb-3">
            Cùng danh mục
          </p>
          <h2 className="font-serif text-3xl md:text-4xl leading-tight">
            Có thể bạn cũng thích.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {products.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
            >
              <ProductCard product={p} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
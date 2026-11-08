import ProductCard from '@/components/ui/ProductCard';
import type { Product } from '@/types';

interface Props {
  products: Product[];
}

export default function RelatedProducts({ products }: Props) {
  if (products.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-6 pb-24">
      <div className="border-t border-[#1f1b18]/10 pt-16">
        <p className="text-[11px] uppercase tracking-[0.3em] text-[#b45f3c] mb-3">Cùng danh mục</p>
        <h2 className="font-serif text-3xl md:text-4xl leading-tight mb-12">Có thể bạn cũng thích.</h2>
        <div className="grid sm:grid-cols-3 gap-6 md:gap-8">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </section>
  );
}
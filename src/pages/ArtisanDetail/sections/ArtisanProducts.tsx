import { Link } from 'react-router-dom';
import ProductCard from '@/components/ui/ProductCard';
import type { Product } from '@/types';

interface Props {
  products: Product[];
  loading: boolean;
  workshopName: string;
}

export default function ArtisanProducts({
  products,
  loading,
  workshopName,
}: Props) {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20 md:py-28">
      <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#b45f3c] mb-3">
            Tác phẩm
          </p>
          <h2 className="font-serif text-3xl md:text-4xl leading-tight">
            Từ xưởng {workshopName}.
          </h2>
        </div>
        {!loading && products.length > 0 && (
          <p className="text-sm text-[#1f1b18]/40 pb-1">
            {products.length} sản phẩm
          </p>
        )}
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <div className="aspect-[4/5] bg-[#1f1b18]/5" />
              <p className="mt-5 text-sm text-[#1f1b18]/30">Đang tải…</p>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="text-sm text-[#1f1b18]/40">
          Xưởng chưa đăng tải sản phẩm nào.
        </p>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
            {products.slice(0, 6).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          {products.length > 6 && (
            <div className="mt-12 text-center">
              <Link
                to={`/products?artisanId=${products[0].artisanId}`}
                className="inline-flex items-center text-xs uppercase tracking-widest border-b border-[#1f1b18] pb-1 hover:text-[#b45f3c] hover:border-[#b45f3c] transition-colors"
              >
                Xem tất cả sản phẩm của xưởng →
              </Link>
            </div>
          )}
        </>
      )}
    </section>
  );
}
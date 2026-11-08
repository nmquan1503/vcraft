import ProductCard from '@/components/ui/ProductCard';
import ImagePlaceholder from '@/components/ui/ImagePlaceholder';
import type { Product } from '@/types';

interface Props {
  products: Product[];
  loading: boolean;
}

export default function ProductGrid({ products, loading }: Props) {
  // Lưới bất đối xứng: card đầu tiên featured (2 cột), còn lại 1 cột
  const [featured, ...rest] = products;

  if (loading) {
    return (
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i}>
              <ImagePlaceholder
                label={`Sản phẩm ${i + 1}`}
                aspect="aspect-[4/5]"
                tone="clay"
              />
              <p className="mt-5 text-sm text-[#1f1b18]/30">Đang tải…</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="max-w-6xl mx-auto px-6 py-32 text-center">
        <p className="font-serif text-2xl text-[#1f1b18]/40">
          Không tìm thấy sản phẩm nào.
        </p>
        <p className="mt-3 text-sm text-[#1f1b18]/30">
          Thử chọn danh mục khác, hoặc xoá bộ lọc.
        </p>
      </section>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
        {/* Card featured chiếm 2 cột */}
        {featured && (
          <div className="sm:col-span-2">
            <ProductCard product={featured} variant="featured" />
          </div>
        )}

        {/* Các card còn lại */}
        {rest.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
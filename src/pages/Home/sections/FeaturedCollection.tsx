import { Link } from 'react-router-dom';
import ImagePlaceholder from '@/components/ui/ImagePlaceholder';
import type { Product } from '@/types';

interface Props {
  products: Product[];
  loading: boolean;
}

export default function FeaturedCollection({ products, loading }: Props) {
  return (
    <section id="bo-suu-tap" className="bg-[#1f1b18] text-[#f6f1ea] py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-14">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#d9a08b] mb-5">
              N° 02 — Bộ sưu tập
            </p>
            <h2 className="font-serif text-3xl md:text-5xl leading-tight">
              Tuyển chọn từ các xưởng.
            </h2>
          </div>
          <Link
            to="/products"
            className="text-xs uppercase tracking-widest border-b border-[#f6f1ea]/30 pb-1 hover:text-[#d9a08b] transition-colors"
          >
            Xem tất cả sản phẩm
          </Link>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 md:gap-8">
          {loading ? (
            [1, 2, 3].map((i) => (
              <div key={i}>
                <ImagePlaceholder
                  label={`Sản phẩm ${i}`}
                  aspect="aspect-[4/5]"
                  tone="clay"
                />
                <p className="mt-4 text-sm text-[#f6f1ea]/40">Đang tải…</p>
              </div>
            ))
          ) : products.length === 0 ? (
            <p className="col-span-full text-sm text-[#f6f1ea]/40">
              Chưa có sản phẩm nào được đăng tải.
            </p>
          ) : (
            products.map((p) => {
              const img = p.images?.[0];
              return (
                <Link key={p.id} to={`/products/${p.id}`} className="group">
                  {img ? (
                    <div className="aspect-[4/5] overflow-hidden">
                      <img
                        src={img}
                        alt={p.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                    </div>
                  ) : (
                    <ImagePlaceholder
                      label={p.name}
                      aspect="aspect-[4/5]"
                      tone="clay"
                      className="transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  )}
                  <h3 className="mt-4 font-serif text-lg group-hover:text-[#d9a08b] transition-colors">
                    {p.name}
                  </h3>
                  <p className="text-xs text-[#f6f1ea]/40 mt-1">
                    {p.price.toLocaleString('vi-VN')} ₫
                  </p>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
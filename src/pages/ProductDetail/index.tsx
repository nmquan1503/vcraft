import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { productApi, artisanApi, batchApi, reviewApi } from '@/api';
import type { Product, ArtisanProfile, Batch, ReviewListResponse } from '@/types';

import ProductGallery from './sections/ProductGallery';
import ProductInfo from './sections/ProductInfo';
import ArtisanMiniCard from './sections/ArtisanMiniCard';
import BatchLinkBox from './sections/BatchLinkBox';
import ProductReviews from './sections/ProductReviews';
import RelatedProducts from './sections/RelatedProducts';
import Footer from '@/components/layout/Footer';
import ImagePlaceholder from '@/components/ui/ImagePlaceholder';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [artisan, setArtisan] = useState<ArtisanProfile | null>(null);
  const [batch, setBatch] = useState<Batch | null>(null);
  const [reviews, setReviews] = useState<ReviewListResponse | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setProduct(null);

    (async () => {
      const p = await productApi.getById(id);
      if (cancelled) return;
      if (!p) { setLoading(false); return; }
      setProduct(p);

      const [a, b, r, rel] = await Promise.all([
        artisanApi.getById(p.artisanId),
        p.batchId ? batchApi.getById(p.batchId) : Promise.resolve(null),
        reviewApi.listProduct(p.id, { limit: 10 }),
        productApi.list({ categoryId: p.categoryId, limit: 4 }),
      ]);

      if (cancelled) return;
      setArtisan(a);
      setBatch(b);
      setReviews(r);
      setRelated(rel.data.filter(x => x.id !== p.id).slice(0, 3));
      setLoading(false);
    })();

    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <main className="bg-[#f6f1ea] text-[#1f1b18] pt-24 md:pt-32">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 mb-24">
          <ImagePlaceholder label="Đang tải…" aspect="aspect-[4/5]" tone="clay" />
          <div className="space-y-4">
            <div className="h-3 w-32 bg-[#1f1b18]/10" />
            <div className="h-12 w-3/4 bg-[#1f1b18]/10" />
            <div className="h-8 w-40 bg-[#1f1b18]/10" />
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="bg-[#f6f1ea] text-[#1f1b18] pt-24 md:pt-32">
        <section className="max-w-6xl mx-auto px-6 py-24 text-center">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#b45f3c] mb-4">404</p>
          <h1 className="font-serif text-3xl md:text-5xl leading-tight">Không tìm thấy sản phẩm.</h1>
          <Link to="/products" className="mt-8 inline-flex items-center bg-[#1f1b18] text-[#f6f1ea] rounded-full px-7 py-3 text-xs uppercase tracking-widest hover:bg-[#b45f3c] transition-colors">
            Về bộ sưu tập
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-[#f6f1ea] text-[#1f1b18] pt-24 md:pt-32">
      <div className="max-w-6xl mx-auto px-6 mb-10">
        <Link to="/products" className="text-[11px] uppercase tracking-[0.25em] text-[#1f1b18]/50 hover:text-[#b45f3c] transition-colors">
          ← Quay lại bộ sưu tập
        </Link>
      </div>

      <section className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 md:gap-16 mb-20 md:mb-28">
        <ProductGallery images={product.images} productName={product.name} />
        <ProductInfo product={product} />
      </section>

      {artisan && <ArtisanMiniCard artisan={artisan} />}
      {batch && <BatchLinkBox batch={batch} />}
      <ProductReviews data={reviews} loading={false} />
      <RelatedProducts products={related} />

      <Footer />
    </main>
  );
}
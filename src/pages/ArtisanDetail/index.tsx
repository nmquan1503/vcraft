import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { artisanApi, productApi, reviewApi } from '@/api';
import type { ArtisanProfile, Product, ReviewListResponse } from '@/types';

import ArtisanHero from './sections/ArtisanHero';
import ArtisanStory from './sections/ArtisanStory';
import ArtisanProducts from './sections/ArtisanProducts';
import VisitBox from './sections/VisitBox';
import ArtisanReviews from './sections/ArtisanReviews';
import Footer from '@/components/layout/Footer';
import ImagePlaceholder from '@/components/ui/ImagePlaceholder';

export default function ArtisanDetail() {
  const { id } = useParams<{ id: string }>();

  const [artisan, setArtisan] = useState<ArtisanProfile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<ReviewListResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setArtisan(null);
    setProducts([]);
    setReviews(null);

    (async () => {
      const a = await artisanApi.getById(id);
      if (cancelled) return;

      if (!a) {
        setLoading(false);
        return;
      }
      setArtisan(a);

      const [prodRes, revRes] = await Promise.all([
        productApi.list({ artisanId: id, limit: 12 }),
        reviewApi.listArtisan(id, { limit: 10 }),
      ]);

      if (cancelled) return;
      setProducts(prodRes.data);
      setReviews(revRes);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  /* ────── Loading ────── */
  if (loading) {
    return (
      <main className="bg-[#f6f1ea] text-[#1f1b18] pt-24 md:pt-32">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-12 gap-12">
          <div className="md:col-span-5">
            <ImagePlaceholder
              label="Đang tải…"
              aspect="aspect-[3/4]"
              tone="sand"
            />
          </div>
          <div className="md:col-span-7 space-y-4 pt-8">
            <div className="h-3 w-32 bg-[#1f1b18]/10" />
            <div className="h-12 w-3/4 bg-[#1f1b18]/10" />
            <div className="h-6 w-1/2 bg-[#1f1b18]/5" />
          </div>
        </div>
      </main>
    );
  }

  /* ────── Not found ────── */
  if (!artisan) {
    return (
      <main className="bg-[#f6f1ea] text-[#1f1b18] pt-24 md:pt-32">
        <section className="max-w-6xl mx-auto px-6 py-24 text-center">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#b45f3c] mb-4">
            404
          </p>
          <h1 className="font-serif text-3xl md:text-5xl leading-tight">
            Không tìm thấy nghệ nhân.
          </h1>
          <p className="mt-4 text-sm text-[#1f1b18]/50">
            Hồ sơ có thể đã bị xoá hoặc chưa được duyệt.
          </p>
          <Link
            to="/artisans"
            className="mt-8 inline-flex items-center bg-[#1f1b18] text-[#f6f1ea] rounded-full px-7 py-3 text-xs uppercase tracking-widest hover:bg-[#b45f3c] transition-colors"
          >
            Về danh sách nghệ nhân
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-[#f6f1ea] text-[#1f1b18]">
      <ArtisanHero artisan={artisan} />
      <ArtisanStory artisan={artisan} />
      <ArtisanProducts
        products={products}
        loading={false}
        workshopName={artisan.workshopName}
      />
      <VisitBox artisan={artisan} />
      <ArtisanReviews data={reviews} loading={false} />
      <Footer />
    </main>
  );
}
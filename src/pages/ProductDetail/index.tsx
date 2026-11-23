import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { productApi, artisanApi, batchApi, reviewApi } from '@/api';
import type { Product, ArtisanProfile, Batch, ReviewListResponse } from '@/types';

import ProductGallery from './sections/ProductGallery';
import ProductInfo from './sections/ProductInfo';
import ArtisanMiniCard from './sections/ArtisanMiniCard';
import BatchLinkBox from './sections/BatchLinkBox';
import ProductReviews from './sections/ProductReviews';
import RelatedProducts from './sections/RelatedProducts';
import Footer from '@/components/layout/Footer';

const EASE = [0.22, 1, 0.36, 1] as const;

function DetailSkeleton() {
  return (
    <div className="animate-pulse" aria-busy="true" aria-live="polite">
      <div className="max-w-6xl mx-auto px-6 mb-10">
        <div className="h-3 w-40 bg-[#1f1b18]/10 rounded-sm" />
      </div>

      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 md:gap-16 mb-20 md:mb-28">
        <div>
          <div className="aspect-[4/5] bg-[#1f1b18]/5 rounded-2xl" />
          <div className="mt-3 flex gap-2 overflow-hidden">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="w-16 h-16 sm:w-20 sm:h-20 bg-[#1f1b18]/5 rounded-lg shrink-0"
              />
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="h-10 md:h-14 w-4/5 bg-[#1f1b18]/10 rounded-sm" />
          <div className="h-8 w-40 bg-[#1f1b18]/10 rounded-sm" />
          <div className="h-3 w-28 bg-[#1f1b18]/10 rounded-sm" />
          <div className="h-px bg-[#1f1b18]/10 my-8" />
          <div className="space-y-2">
            <div className="h-3 w-full bg-[#1f1b18]/10 rounded-sm" />
            <div className="h-3 w-full bg-[#1f1b18]/10 rounded-sm" />
            <div className="h-3 w-3/4 bg-[#1f1b18]/10 rounded-sm" />
          </div>
          <div className="h-12 w-40 bg-[#1f1b18]/10 rounded-full mt-4" />
        </div>
      </div>
      <span className="sr-only">Đang tải sản phẩm…</span>
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [artisan, setArtisan] = useState<ArtisanProfile | null>(null);
  const [batch, setBatch] = useState<Batch | null>(null);
  const [reviews, setReviews] = useState<ReviewListResponse | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    setProduct(null);
    setArtisan(null);
    setBatch(null);
    setReviews(null);
    setRelated([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    (async () => {
      try {
        const p = await productApi.getById(id);
        if (cancelled) return;
        if (!p) {
          setLoading(false);
          return;
        }
        setProduct(p);

        const [a, b, r, rel] = await Promise.all([
          artisanApi.getById(p.artisanId).catch(() => null),
          p.batchId ? batchApi.getById(p.batchId).catch(() => null) : Promise.resolve(null),
          reviewApi.listProduct(p.id, { limit: 10 }).catch(() => null),
          productApi
            .list({ categoryId: p.categoryId, limit: 4 })
            .catch(() => ({ data: [] as Product[] })),
        ]);

        if (cancelled) return;
        setArtisan(a);
        setBatch(b);
        setReviews(r);
        setRelated(rel.data.filter((x) => x.id !== p.id).slice(0, 3));
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Không thể tải sản phẩm.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="bg-[#f6f1ea] text-[#1f1b18] pt-24 md:pt-32">
        <DetailSkeleton />
      </main>
    );
  }

  if (error) {
    return (
      <main className="bg-[#f6f1ea] text-[#1f1b18] pt-24 md:pt-32">
        <section className="max-w-6xl mx-auto px-6 py-24 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#e85555]/10 mb-6">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-[#e85555]"
              aria-hidden="true"
            >
              <path
                d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="font-serif text-2xl md:text-3xl leading-tight">
            Không thể tải sản phẩm
          </h1>
          <p className="mt-2 text-sm text-[#1f1b18]/45 max-w-md mx-auto">{error}</p>
          <Link
            to="/products"
            className="mt-8 inline-flex items-center bg-[#1f1b18] text-[#f6f1ea] rounded-full px-7 py-3 text-xs uppercase tracking-widest hover:bg-[#b45f3c] active:scale-[0.97] transition-[background-color,transform] duration-300"
          >
            Về bộ sưu tập
          </Link>
        </section>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="bg-[#f6f1ea] text-[#1f1b18] pt-24 md:pt-32">
        <section className="max-w-6xl mx-auto px-6 py-24 text-center">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#b45f3c] mb-4">
            404
          </p>
          <h1 className="font-serif text-3xl md:text-5xl leading-tight">
            Không tìm thấy sản phẩm.
          </h1>
          <Link
            to="/products"
            className="mt-8 inline-flex items-center bg-[#1f1b18] text-[#f6f1ea] rounded-full px-7 py-3 text-xs uppercase tracking-widest hover:bg-[#b45f3c] active:scale-[0.97] transition-[background-color,transform] duration-300"
          >
            Về bộ sưu tập
          </Link>
        </section>
      </main>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={product.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35, ease: EASE }}
        className="bg-[#f6f1ea] text-[#1f1b18] pt-24 md:pt-32"
      >
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="max-w-6xl mx-auto px-6 mb-10"
        >
          <Link
            to="/products"
            className="group inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-[#1f1b18]/50 hover:text-[#b45f3c] transition-colors"
          >
            <span className="transition-transform duration-300 group-hover:-translate-x-1">
              ←
            </span>
            Quay lại bộ sưu tập
          </Link>
        </motion.div>

        <section className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 md:gap-16 mb-20 md:mb-28">
          <ProductGallery images={product.images} productName={product.name} />
          <ProductInfo product={product} />
        </section>

        {artisan && <ArtisanMiniCard artisan={artisan} />}
        {batch && <BatchLinkBox batch={batch} />}
        <ProductReviews data={reviews} loading={false} />
        <RelatedProducts products={related} />

        <Footer />
      </motion.main>
    </AnimatePresence>
  );
}
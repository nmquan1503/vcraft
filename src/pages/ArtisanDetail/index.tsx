import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { artisanApi, productApi, reviewApi } from '@/api';
import type {
  ArtisanProfile,
  Product,
  ReviewListResponse,
} from '@/types';

import ArtisanHero from './sections/ArtisanHero';
import ArtisanStory from './sections/ArtisanStory';
import ArtisanProducts from './sections/ArtisanProducts';
import VisitBox from './sections/VisitBox';
import ArtisanReviews from './sections/ArtisanReviews';

import Footer from '@/components/layout/Footer';
import ImagePlaceholder from '@/components/ui/ImagePlaceholder';

function ArtisanDetailSkeleton() {
  return (
    <main
      className="min-h-screen overflow-hidden bg-[#f6f1ea] pt-24 text-[#1f1b18] sm:pt-28 md:pt-32"
      aria-busy="true"
      aria-label="Đang tải thông tin nghệ nhân"
    >
      <div className="mx-auto max-w-[1440px] px-5 pb-16 sm:px-8 sm:pb-20 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 items-center gap-9 md:grid-cols-12 md:gap-10 lg:gap-16">
          <div className="min-w-0 md:col-span-5">
            <div className="relative mx-auto w-full max-w-[520px] md:mx-0">
              <div className="overflow-hidden rounded-tl-[100px] rounded-br-[100px] sm:rounded-tl-[140px] sm:rounded-br-[140px]">
                <ImagePlaceholder
                  label="Đang tải…"
                  aspect="aspect-[4/5] sm:aspect-[3/4]"
                  tone="sand"
                />
              </div>

              <div className="absolute -bottom-4 -left-3 -z-10 h-full w-full rounded-tl-[100px] rounded-br-[100px] border border-[#b45f3c]/15 sm:-bottom-5 sm:-left-5 sm:rounded-tl-[140px] sm:rounded-br-[140px]" />
            </div>
          </div>

          <div className="flex min-w-0 flex-col justify-center py-2 md:col-span-7 md:py-8">
            <div className="mb-7 h-3 w-28 animate-pulse rounded-full bg-[#1f1b18]/10 sm:mb-9 sm:w-36" />

            <div className="mb-6 space-y-3 sm:space-y-4">
              <div className="h-9 w-full max-w-[520px] animate-pulse rounded-sm bg-[#1f1b18]/10 sm:h-12 md:h-14" />
              <div className="h-9 w-3/4 max-w-[420px] animate-pulse rounded-sm bg-[#1f1b18]/10 sm:h-12 md:h-14" />
            </div>

            <div className="mb-5 h-5 w-2/3 max-w-[320px] animate-pulse rounded-full bg-[#1f1b18]/[0.06]" />

            <div className="max-w-[480px] space-y-3">
              <div className="h-3 w-full animate-pulse rounded-full bg-[#1f1b18]/[0.06]" />
              <div className="h-3 w-5/6 animate-pulse rounded-full bg-[#1f1b18]/[0.06]" />
              <div className="h-3 w-2/3 animate-pulse rounded-full bg-[#1f1b18]/[0.06]" />
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 border-t border-[#1f1b18]/10 pt-6 sm:mt-10">
              <div className="h-12 animate-pulse rounded-sm bg-[#1f1b18]/[0.05]" />
              <div className="h-12 animate-pulse rounded-sm bg-[#1f1b18]/[0.05]" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function ArtisanDetailError({
  onRetry,
}: {
  onRetry: () => void;
}) {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f6f1ea] pt-24 text-[#1f1b18] sm:pt-28 md:pt-32">
      <section className="mx-auto flex min-h-[65vh] max-w-[1440px] items-center justify-center px-5 py-20 sm:px-8 sm:py-24 md:px-12 lg:px-20">
        <div className="w-full max-w-2xl text-center">
          <div className="mb-6 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[#b45f3c]" />

            <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#b45f3c] sm:text-[11px]">
              Có lỗi xảy ra
            </p>

            <span className="h-px w-8 bg-[#b45f3c]" />
          </div>

          <h1 className="font-serif text-[clamp(2rem,5vw,3.8rem)] leading-[1.12] tracking-[-0.03em]">
            Không thể tải
            <br />
            <em className="font-normal text-[#b45f3c]">
              hồ sơ nghệ nhân.
            </em>
          </h1>

          <p className="mx-auto mt-5 max-w-md text-[13px] leading-[1.9] text-[#1f1b18]/55 sm:text-sm">
            Đã xảy ra sự cố khi tải dữ liệu. Vui lòng thử lại
            sau ít phút.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#b45f3c] px-7 py-3.5 text-[10px] font-medium uppercase tracking-[0.18em] text-[#f6f1ea] transition-all duration-300 hover:bg-[#1f1b18] sm:w-auto"
            >
              <span>Thử tải lại</span>
              <span aria-hidden="true">↻</span>
            </button>

            <Link
              to="/artisans"
              className="inline-flex w-full items-center justify-center rounded-full border border-[#1f1b18]/20 px-7 py-3.5 text-[10px] font-medium uppercase tracking-[0.18em] text-[#1f1b18] transition-all duration-300 hover:border-[#b45f3c] hover:text-[#b45f3c] sm:w-auto"
            >
              Danh sách nghệ nhân
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function ArtisanNotFound() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f6f1ea] pt-24 text-[#1f1b18] sm:pt-28 md:pt-32">
      <section className="mx-auto flex min-h-[65vh] max-w-[1440px] items-center justify-center px-5 py-20 sm:px-8 sm:py-24 md:px-12 lg:px-20">
        <div className="w-full max-w-2xl text-center">
          <div className="mb-6 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[#b45f3c]" />

            <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#b45f3c] sm:text-[11px]">
              404 — Không tìm thấy
            </p>

            <span className="h-px w-8 bg-[#b45f3c]" />
          </div>

          <h1 className="font-serif text-[clamp(2.2rem,5.5vw,4.5rem)] leading-[1.08] tracking-[-0.035em]">
            Không tìm thấy
            <br />
            <em className="font-normal text-[#b45f3c]">
              nghệ nhân.
            </em>
          </h1>

          <p className="mx-auto mt-5 max-w-md text-[13px] leading-[1.9] text-[#1f1b18]/55 sm:text-sm">
            Hồ sơ có thể đã bị xoá, chưa được duyệt hoặc
            không còn tồn tại.
          </p>

          <Link
            to="/artisans"
            className="group mt-9 inline-flex items-center gap-5 rounded-full bg-[#1f1b18] px-7 py-3.5 text-[10px] font-medium uppercase tracking-[0.18em] text-[#f6f1ea] transition-all duration-300 hover:bg-[#b45f3c]"
          >
            <span>Về danh sách nghệ nhân</span>

            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </section>
    </main>
  );
}

export default function ArtisanDetail() {
  const { id } = useParams<{ id: string }>();

  const [artisan, setArtisan] = useState<ArtisanProfile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<ReviewListResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    if (!id) {
      setArtisan(null);
      setProducts([]);
      setReviews(null);
      setLoadError(false);
      setLoading(false);

      return;
    }

    const loadData = async () => {
      setLoading(true);
      setLoadError(false);

      setArtisan(null);
      setProducts([]);
      setReviews(null);

      try {
        const artisanData = await artisanApi.getById(id);

        if (cancelled) return;

        if (!artisanData) {
          setArtisan(null);
          return;
        }

        setArtisan(artisanData);

        const [prodResult, reviewResult] = await Promise.allSettled([
          productApi.list({
            artisanId: id,
            limit: 12,
          }),
          reviewApi.listArtisan(id, {
            limit: 10,
          }),
        ]);

        if (cancelled) return;

        setProducts(
          prodResult.status === 'fulfilled'
            ? prodResult.value.data
            : [],
        );

        setReviews(
          reviewResult.status === 'fulfilled'
            ? reviewResult.value
            : null,
        );

        if (prodResult.status === 'rejected') {
          console.error('Failed to load artisan products:', prodResult.reason);
        }

        if (reviewResult.status === 'rejected') {
          console.error('Failed to load artisan reviews:', reviewResult.reason);
        }
      } catch (error) {
        if (cancelled) return;

        console.error('Failed to load artisan detail:', error);
        setLoadError(true);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, [id, retryCount]);

  if (loading) {
    return <ArtisanDetailSkeleton />;
  }

  if (loadError) {
    return (
      <ArtisanDetailError
        onRetry={() => setRetryCount((count) => count + 1)}
      />
    );
  }

  if (!artisan) {
    return <ArtisanNotFound />;
  }

  return (
    <main className="min-h-screen overflow-x-clip bg-[#f6f1ea] text-[#1f1b18]">
      <ArtisanHero artisan={artisan} />

      <ArtisanStory artisan={artisan} />

      <ArtisanProducts
        products={products}
        loading={false}
        workshopName={artisan.workshopName}
      />

      <VisitBox artisan={artisan} />

      <ArtisanReviews
        data={reviews}
        loading={false}
      />

      <Footer />
    </main>
  );
}
import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productApi, categoryApi } from '@/api';
import type { Product, Category } from '@/types';

import ProductsHeader from './sections/ProductsHeader';
import FilterBar from './sections/FilterBar';
import ProductGrid from './sections/ProductGrid';
import Pagination from './sections/Pagination';
import Footer from '@/components/layout/Footer';
import { PAGE_SIZE } from './constants';

const DEFAULT_SORT = 'newest';

function parsePage(raw: string | null): number {
  const n = Number(raw);
  return Number.isInteger(n) && n >= 1 ? n : 1;
}

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryId = searchParams.get('category');
  const sort = searchParams.get('sort') || DEFAULT_SORT;
  const page = parsePage(searchParams.get('page'));

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  // Categories: 1 lần. Fail không chặn products
  useEffect(() => {
    let cancelled = false;
    categoryApi
      .list()
      .then((data) => { if (!cancelled) setCategories(data); })
      .catch(() => { /* silent */ });
    return () => { cancelled = true; };
  }, []);

  // Products: theo filter/sort/page/reload
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    productApi
      .list({
        page,
        limit: PAGE_SIZE,
        categoryId: categoryId ?? undefined,
        sort,
      })
      .then((res) => {
        if (cancelled) return;

        // Out-of-range page → redirect về page cuối
        if (res.data.length === 0 && page > 1 && res.totalPages > 0) {
          const target = Math.max(1, res.totalPages);
          setSearchParams(
            (prev) => {
              const next = new URLSearchParams(prev);
              if (target === 1) next.delete('page');
              else next.set('page', String(target));
              return next;
            },
            { replace: true }
          );
          return;
        }

        setProducts(res.data);
        setTotal(res.totalElements);
        setTotalPages(res.totalPages);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Không thể tải sản phẩm.');
        setProducts([]);
        setTotal(0);
        setTotalPages(1);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [categoryId, sort, page, reloadKey, setSearchParams]);

  const setParams = useCallback(
    (updates: Record<string, string | null>, replace: boolean) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          Object.entries(updates).forEach(([k, v]) => {
            if (v === null || v === '') next.delete(k);
            else next.set(k, v);
          });
          return next;
        },
        { replace }
      );
    },
    [setSearchParams]
  );

  const handleCategoryChange = useCallback(
    (id: string | null) => {
      setParams({ category: id, page: null }, true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [setParams]
  );

  const handleSortChange = useCallback(
    (value: string) => {
      setParams(
        { sort: value === DEFAULT_SORT ? null : value, page: null },
        true
      );
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [setParams]
  );

  const handlePageChange = useCallback(
    (nextPage: number) => {
      setParams({ page: nextPage === 1 ? null : String(nextPage) }, false);
    },
    [setParams]
  );

  return (
    <main className="bg-[#f6f1ea] text-[#1f1b18]">
      <ProductsHeader total={total} />
      <FilterBar
        categories={categories}
        activeCategory={categoryId}
        onCategoryChange={handleCategoryChange}
        sort={sort}
        onSortChange={handleSortChange}
        loading={loading}
      />
      {error ? (
        <section className="max-w-6xl mx-auto px-6 py-24 md:py-32 text-center">
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
          <p className="font-serif text-xl md:text-2xl text-[#1f1b18]/70">
            Không thể tải sản phẩm
          </p>
          <p className="mt-2 text-sm text-[#1f1b18]/40 max-w-md mx-auto">{error}</p>
          <button
            type="button"
            onClick={() => setReloadKey((k) => k + 1)}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 text-[11px] uppercase tracking-widest border border-[#1f1b18]/20 rounded-full text-[#1f1b18]/70 hover:border-[#b45f3c] hover:text-[#b45f3c] active:scale-[0.97] transition-[border-color,color,transform] duration-200"
          >
            Thử lại
            <span aria-hidden="true">↻</span>
          </button>
        </section>
      ) : (
        <>
          <ProductGrid products={products} loading={loading} />
          <Pagination page={page} totalPages={totalPages} onChange={handlePageChange} />
        </>
      )}
      <Footer />
    </main>
  );
}
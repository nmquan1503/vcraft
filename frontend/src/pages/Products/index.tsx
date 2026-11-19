import { useEffect, useState } from 'react';
import { productApi, categoryApi } from '@/api';
import type { Product, Category } from '@/types';

import ProductsHeader from './sections/ProductsHeader';
import FilterBar from './sections/FilterBar';
import ProductGrid from './sections/ProductGrid';
import Pagination from './sections/Pagination';
import Footer from '@/components/layout/Footer';
import { PAGE_SIZE } from './constants';

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);

  // Load categories 1 lần
  useEffect(() => {
    categoryApi.list().then(setCategories);
  }, []);

  // Load products mỗi khi filter/sort/page đổi
  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    productApi
      .list({
        page,
        limit: PAGE_SIZE,
        categoryId: categoryId ?? undefined,
        sort,
      })
      .then((res) => {
        if (cancelled) return;
        setProducts(res.data);
        setTotal(res.totalElements);
        setTotalPages(res.totalPages);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [categoryId, sort, page]);

  const handleCategoryChange = (id: string | null) => {
    setCategoryId(id);
    setPage(1); // reset về trang 1 khi đổi filter
  };

  const handleSortChange = (value: string) => {
    setSort(value);
    setPage(1);
  };

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
      <ProductGrid products={products} loading={loading} />
      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      <Footer />
    </main>
  );
}
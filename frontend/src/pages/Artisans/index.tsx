import { useEffect, useState } from 'react';
import { artisanApi } from '@/api';
import type { ArtisanProfile } from '@/types';

import ArtisansHeader from './sections/ArtisansHeader';
import FilterBar from './sections/FilterBar';
import ArtisanGrid from './sections/ArtisanGrid';
import Pagination from './sections/Pagination';
import Footer from '@/components/layout/Footer';
import { PAGE_SIZE } from './constants';

export default function Artisans() {
  const [artisans, setArtisans] = useState<ArtisanProfile[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loadedQuery, setLoadedQuery] = useState<string|null>(null);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);

  // Debounce search 300ms
  const queryKey=JSON.stringify([page,debouncedSearch]);
  const loading=loadedQuery!==queryKey;

  useEffect(() => {
    const t = setTimeout(() => {setDebouncedSearch(search.trim());setPage(1);}, 300);
    return () => clearTimeout(t);
  }, [search]);


  // Fetch
  useEffect(() => {
    let cancelled = false;

    artisanApi
      .list({
        page,
        limit: PAGE_SIZE,
        search: debouncedSearch || undefined,
      })
      .then((res) => {
        if (cancelled) return;
        setArtisans(res.data);
        setTotal(res.totalElements);
        setTotalPages(res.totalPages);
      })
      .finally(() => {
        if (!cancelled) setLoadedQuery(queryKey);
      });

    return () => {
      cancelled = true;
    };
  }, [page, debouncedSearch, queryKey]);

  return (
    <main className="bg-[#f6f1ea] text-[#1f1b18]">
      <ArtisansHeader total={total} />
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        loading={loading}
      />
      <ArtisanGrid artisans={artisans} loading={loading} />
      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      <Footer />
    </main>
  );
}
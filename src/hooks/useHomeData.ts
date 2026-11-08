import { useEffect, useState } from 'react';
import { productApi, artisanApi } from '@/api';
import type { Product, ArtisanProfile } from '@/types';

interface HomeData {
  products: Product[];
  artisans: ArtisanProfile[];
  loading: boolean;
}

export function useHomeData(): HomeData {
  const [products, setProducts] = useState<Product[]>([]);
  const [artisans, setArtisans] = useState<ArtisanProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      const [prodPage, artisanPage] = await Promise.all([
        productApi.list({ page: 1, limit: 3 }),
        artisanApi.list({ page: 1, limit: 3 }),
      ]);
      if (!alive) return;
      setProducts(prodPage.data);
      setArtisans(artisanPage.data);
      setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, []);

  return { products, artisans, loading };
}
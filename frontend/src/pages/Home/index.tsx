import { useEffect, useState } from 'react';
import { productApi, artisanApi, newsApi, mapApi } from '@/api';
import type { Product, ArtisanProfile, News } from '@/types';

import Hero from './sections/Hero';
import Stats from './sections/Stats';
import VillageStory from './sections/VillageStory';
import FeaturedCollection from './sections/FeaturedCollection';
import ArtisanSpotlight from './sections/ArtisanSpotlight';
import Traceability from './sections/Traceability';
import MapPreview from './sections/MapPreview';
import NewsSection from './sections/NewsSection';
import QuoteBlock from './sections/QuoteBlock';
import SplitCta from './sections/SplitCta';
import Footer from '@/components/layout/Footer';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [artisans, setArtisans] = useState<ArtisanProfile[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [openCount, setOpenCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const [prodRes, artRes, newsRes, pinsRes] = await Promise.all([
        productApi.list({ limit: 3 }),
        artisanApi.list({ limit: 3 }),
        newsApi.list({ limit: 2 }),
        mapApi.pins({ openOnly: true }),
      ]);

      if (cancelled) return;

      setProducts(prodRes.data);
      setArtisans(artRes.data);
      setNews(newsRes.data);
      setOpenCount(pinsRes.length);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="bg-[#f6f1ea] text-[#1f1b18]">
      <Hero />
      <Stats />
      <VillageStory />
      <FeaturedCollection products={products} loading={loading} />
      <ArtisanSpotlight artisans={artisans} loading={loading} />
      <Traceability />
      <MapPreview openCount={openCount} />
      <NewsSection news={news} loading={loading} />
      <QuoteBlock />
      <SplitCta />
      <Footer />
    </main>
  );
}
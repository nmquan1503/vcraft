import type { MapPin, MapPinDetail } from '@/types';
import { mockArtisans } from './data/artisans';
import { mockProducts } from './data/products';
import { mockReviews } from './data/reviews';
import { delay, findById } from './helpers';

export const mapApi = {
  async pins(params: { openOnly?: boolean } = {}): Promise<MapPin[]> {
    await delay();
    let filtered = mockArtisans.filter(
      (a) =>
        a.status === 'APPROVED' &&
        a.latitude !== null &&
        a.longitude !== null
    );
    if (params.openOnly) filtered = filtered.filter((a) => a.openStatus);

    return filtered.map((a) => ({
      id: a.id,
      name: a.workshopName,
      lat: a.latitude,
      lng: a.longitude,
      openStatus: a.openStatus,
      thumbnail: a.images[0] ?? null,
      phone: a.phone,
    }));
  },

  async pinDetail(id: string): Promise<MapPinDetail | null> {
    await delay();
    const artisan = findById(mockArtisans, id);
    if (!artisan || artisan.status !== 'APPROVED') return null;

    const productCount = mockProducts.filter((p) => p.artisanId === id).length;
    const artisanReviews = mockReviews.filter(
      (r) => r.artisanId === id && typeof r.rating === 'number'
    );
    const rating = artisanReviews.length
      ? artisanReviews.reduce((s, r) => s + r.rating, 0) / artisanReviews.length
      : 5.0;

    return {
      id: artisan.id,
      name: artisan.workshopName,
      ownerName: artisan.ownerName,
      address: artisan.address,
      openStatus: artisan.openStatus,
      phone: artisan.phone,
      rating: Math.round(rating * 10) / 10, // 1 chữ số thập phân
      productCount,
      description: artisan.description,
    };
  },
};
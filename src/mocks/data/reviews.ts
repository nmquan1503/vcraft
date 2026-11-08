import type { Review } from '@/types';

export const mockReviews: Review[] = [
  {
    id: 'review-1',
    userId: 'user-buyer-1',
    productId: 'product-1',
    artisanId: null,
    rating: 5,
    comment: 'Bình đẹp, men sáng, đóng gói cẩn thận.',
    images: [],
    createdAt: '2026-01-25T08:00:00Z',
    updatedAt: '2026-01-25T08:00:00Z',
  },
  {
    id: 'review-2',
    userId: 'user-buyer-2',
    productId: null,
    artisanId: 'artisan-1',
    rating: 5,
    comment: 'Nghệ nhân tận tâm, giao hàng đúng hẹn.',
    images: [],
    createdAt: '2026-01-20T08:00:00Z',
    updatedAt: '2026-01-20T08:00:00Z',
  },
  {
    id: 'review-3',
    userId: 'user-buyer-1',
    productId: 'product-2',
    artisanId: null,
    rating: 4,
    comment: 'Ấm đẹp nhưng nắp hơi lỏng.',
    images: [],
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-01-15T08:00:00Z',
  },
];
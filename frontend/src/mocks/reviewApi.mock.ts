import type {
  Review,
  ReviewListResponse,
  CreateReviewPayload,
  UpdateReviewPayload,
  MessageResponse,
} from '@/types';
import { mockReviews } from './data/reviews';
import { delay, paginate, findById, MockApiError } from './helpers';

interface ReviewQuery { page?: number; limit?: number }

let reviews = [...mockReviews];

const listResponse = (list: Review[], page = 1, limit = 10): ReviewListResponse => {
  const avg = list.length > 0 ? list.reduce((s, r) => s + r.rating, 0) / list.length : 5.0;
  return {
    reviews: paginate(list, page, limit),
    avgRating: Math.round(avg * 10) / 10,
  };
};

export const reviewApi = {
  async listProduct(productId: string, params: ReviewQuery = {}): Promise<ReviewListResponse> {
    await delay();
    const filtered = reviews.filter((r) => r.productId === productId);
    return listResponse(filtered, params.page, params.limit);
  },

  async createProduct(productId: string, payload: CreateReviewPayload): Promise<Review> {
    await delay();
    const review: Review = {
      id: `review-${Date.now()}`,
      userId: 'user-buyer-1',
      productId,
      artisanId: null,
      rating: payload.rating,
      comment: payload.comment ?? '',
      images: payload.images ?? [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    reviews = [review, ...reviews];
    return review;
  },

  async updateProduct(
    _productId: string,
    reviewId: string,
    payload: UpdateReviewPayload
  ): Promise<Review> {
    await delay();
    const review = findById(reviews, reviewId);
    if (!review) throw new MockApiError('Không tìm thấy đánh giá', 404);
    const updated: Review = {
      ...review,
      rating: payload.rating,
      comment: payload.comment ?? '',
      updatedAt: new Date().toISOString(),
    };
    reviews = reviews.map((r) => (r.id === reviewId ? updated : r));
    return updated;
  },

  async deleteProduct(_productId: string, reviewId: string): Promise<MessageResponse> {
    await delay();
    reviews = reviews.filter((r) => r.id !== reviewId);
    return { message: 'Deleted review successfully' };
  },

  async listArtisan(artisanId: string, params: ReviewQuery = {}): Promise<ReviewListResponse> {
    await delay();
    const filtered = reviews.filter((r) => r.artisanId === artisanId);
    return listResponse(filtered, params.page, params.limit);
  },

  async createArtisan(artisanId: string, payload: CreateReviewPayload): Promise<Review> {
    await delay();
    const review: Review = {
      id: `review-${Date.now()}`,
      userId: 'user-buyer-1',
      productId: null,
      artisanId,
      rating: payload.rating,
      comment: payload.comment ?? '',
      images: payload.images ?? [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    reviews = [review, ...reviews];
    return review;
  },
};
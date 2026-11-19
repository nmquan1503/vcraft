import client from './client';
import { ENDPOINTS } from './endpoints';
import { safeMutation, safeQuery } from './_helpers';
import type {
  Review,
  ReviewListResponse,
  CreateReviewPayload,
  UpdateReviewPayload,
  MessageResponse,
} from '../types';

const L = (fn: string) => `reviewApi.${fn}`;

const emptyReviewList = (page = 1, limit = 10): ReviewListResponse => ({
  reviews: { data: [], page, limit, totalElements: 0, totalPages: 0 },
  avgRating: 0,
});

interface ReviewQuery {
  page?: number;
  limit?: number;
}

export const reviewApi = {
  listProduct: (
    productId: string,
    params: ReviewQuery = {}
  ): Promise<ReviewListResponse> =>
    safeQuery<ReviewListResponse>(
      () => client.get(ENDPOINTS.PRODUCT.REVIEWS(productId), { params }),
      emptyReviewList(params.page, params.limit),
      L('listProduct')
    ),

  createProduct: (
    productId: string,
    payload: CreateReviewPayload
  ): Promise<Review> =>
    safeMutation<Review>(
      () => client.post(ENDPOINTS.PRODUCT.REVIEWS(productId), payload),
      L('createProduct')
    ),

  updateProduct: (
    productId: string,
    reviewId: string,
    payload: UpdateReviewPayload
  ): Promise<Review> =>
    safeMutation<Review>(
      () => client.put(ENDPOINTS.PRODUCT.REVIEW(productId, reviewId), payload),
      L('updateProduct')
    ),

  deleteProduct: (productId: string, reviewId: string): Promise<MessageResponse> =>
    safeMutation<MessageResponse>(
      () => client.delete(ENDPOINTS.PRODUCT.REVIEW(productId, reviewId)),
      L('deleteProduct')
    ),

  listArtisan: (
    artisanId: string,
    params: ReviewQuery = {}
  ): Promise<ReviewListResponse> =>
    safeQuery<ReviewListResponse>(
      () => client.get(ENDPOINTS.ARTISAN.REVIEWS(artisanId), { params }),
      emptyReviewList(params.page, params.limit),
      L('listArtisan')
    ),

  createArtisan: (
    artisanId: string,
    payload: CreateReviewPayload
  ): Promise<Review> =>
    safeMutation<Review>(
      () => client.post(ENDPOINTS.ARTISAN.REVIEWS(artisanId), payload),
      L('createArtisan')
    ),
};
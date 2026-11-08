import type { PageResponse } from './common';

export interface Review {
  id: string;
  userId: string;
  productId: string | null;
  artisanId: string | null;
  rating: number;
  comment: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ReviewListResponse {
  reviews: PageResponse<Review>;
  avgRating: number;
}

export interface CreateReviewPayload {
  rating: number;
  comment?: string;
  images?: string[];
}

export interface UpdateReviewPayload {
  rating: number;
  comment?: string;
}
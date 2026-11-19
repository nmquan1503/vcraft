import type { BidStatus, QuoteStatus } from './enums';

export interface QuoteRequest {
  id: string;
  buyerId: string;
  categoryId: string;
  title: string;
  description: string;
  quantity: number;
  unit: string;
  deadline: string;
  status: QuoteStatus;
  targetArtisanIds: string[];
  deliveryNote: string | null;
  deliveryImages: string[];
  acceptedBidId: string | null;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface Bid {
  id: string;
  quoteRequestId: string;
  artisanId: string;
  pricePerUnit: number;
  totalPrice: number;
  estimatedDays: number;
  note: string;
  deliveryTerms: string;
  status: BidStatus;
  createdAt: string;
  updatedAt: string;
}

export interface QuoteWithBids {
  quote: QuoteRequest;
  bids: Bid[];
}

export interface CreateQuotePayload {
  title: string;
  description: string;
  quantity: number;
  unit?: string;
  deadline?: string;
  categoryId?: string;
  targetArtisanIds?: string[];
}

export interface UpdateQuotePayload {
  title?: string;
  description?: string;
  quantity?: number;
  deadline?: string;
}

export interface PlaceBidPayload {
  pricePerUnit: number;
  totalPrice?: number;
  estimatedDays: number;
  note?: string;
  deliveryTerms?: string;
}

export interface UpdateBidPayload {
  pricePerUnit?: number;
  estimatedDays?: number;
  note?: string;
}

export interface CompleteDeliveryPayload {
  deliveryNote?: string;
  deliveryImages?: string[];
}
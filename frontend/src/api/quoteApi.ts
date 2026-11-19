import client from './client';
import { ENDPOINTS } from './endpoints';
import { safeMutation, safeQuery, emptyPage } from './_helpers';
import type {
  WorkshopAllocation, BidAllocation, AllocationProgress,
  QuoteRequest,
  QuoteWithBids,
  Bid,
  PageResponse,
  QuoteStatus,
  CreateQuotePayload,
  UpdateQuotePayload,
  PlaceBidPayload,
  UpdateBidPayload,
  CompleteDeliveryPayload,
  MessageResponse,
} from '../types';

const L = (fn: string) => `quoteApi.${fn}`;

interface QuoteQuery {
  page?: number;
  limit?: number;
  status?: QuoteStatus;
}

export const quoteApi = {
  listMine: (params: QuoteQuery = {}): Promise<PageResponse<QuoteRequest>> =>
    safeQuery<PageResponse<QuoteRequest>>(
      () => client.get(ENDPOINTS.QUOTE.LIST, { params }),
      emptyPage<QuoteRequest>(params.page, params.limit),
      L('listMine')
    ),

  getById: (id: string): Promise<QuoteWithBids | null> =>
    safeQuery<QuoteWithBids | null>(
      () => client.get(ENDPOINTS.QUOTE.DETAIL(id)),
      null,
      L('getById')
    ),

  create: (payload: CreateQuotePayload): Promise<QuoteRequest> =>
    safeMutation<QuoteRequest>(
      () => client.post(ENDPOINTS.QUOTE.CREATE, payload),
      L('create')
    ),

  update: (id: string, payload: UpdateQuotePayload): Promise<QuoteRequest> =>
    safeMutation<QuoteRequest>(
      () => client.put(ENDPOINTS.QUOTE.UPDATE(id), payload),
      L('update')
    ),

  submit: (id: string): Promise<QuoteRequest> =>
    safeMutation<QuoteRequest>(
      () => client.patch(ENDPOINTS.QUOTE.SUBMIT(id)),
      L('submit')
    ),

  cancel: (id: string): Promise<MessageResponse> =>
    safeMutation<MessageResponse>(
      () => client.delete(ENDPOINTS.QUOTE.DELETE(id)),
      L('cancel')
    ),

  listIncoming: (params: QuoteQuery = {}): Promise<QuoteRequest[]> =>
    safeQuery<QuoteRequest[]>(
      () => client.get(ENDPOINTS.QUOTE.ARTISAN_INCOMING, { params }),
      [],
      L('listIncoming')
    ),

  placeBid: (quoteId: string, payload: PlaceBidPayload): Promise<Bid> =>
    safeMutation<Bid>(
      () => client.post(ENDPOINTS.QUOTE.BIDS(quoteId), payload),
      L('placeBid')
    ),

  updateBid: (
    quoteId: string,
    bidId: string,
    payload: UpdateBidPayload
  ): Promise<Bid> =>
    safeMutation<Bid>(
      () => client.put(ENDPOINTS.QUOTE.BID(quoteId, bidId), payload),
      L('updateBid')
    ),

  acceptBid: (quoteId: string, bidId: string): Promise<MessageResponse> =>
    safeMutation<MessageResponse>(
      () => client.patch(ENDPOINTS.QUOTE.ACCEPT_BID(quoteId, bidId)),
      L('acceptBid')
    ),

  rejectBid: (quoteId: string, bidId: string): Promise<MessageResponse> =>
    safeMutation<MessageResponse>(
      () => client.patch(ENDPOINTS.QUOTE.REJECT_BID(quoteId, bidId)),
      L('rejectBid')
    ),

  startProduction: (id: string): Promise<QuoteRequest> => safeMutation(
    () => client.patch(ENDPOINTS.QUOTE.START_PRODUCTION(id)), L('startProduction')),
  allocate: (id: string, parts: WorkshopAllocation[]): Promise<QuoteRequest[]> => safeMutation(
    () => client.post(ENDPOINTS.QUOTE.ALLOCATIONS(id), parts), L('allocate')),
  acceptAllocations: (id: string, parts: BidAllocation[]): Promise<QuoteRequest[]> => safeMutation(
    () => client.post(ENDPOINTS.QUOTE.ACCEPT_ALLOCATIONS(id), parts), L('acceptAllocations')),
  allocations: (id: string): Promise<QuoteRequest[]> => safeQuery(
    () => client.get(ENDPOINTS.QUOTE.ALLOCATIONS(id)), [], L('allocations')),
  progress: (id: string): Promise<AllocationProgress | null> => safeQuery(
    () => client.get(ENDPOINTS.QUOTE.PROGRESS(id)), null, L('progress')),

  markDelivered: (
    quoteId: string,
    payload: CompleteDeliveryPayload = {}
  ): Promise<QuoteRequest> =>
    safeMutation<QuoteRequest>(
      () => client.patch(ENDPOINTS.QUOTE.COMPLETE(quoteId), payload),
      L('markDelivered')
    ),

  confirmDelivery: (quoteId: string): Promise<QuoteRequest> =>
    safeMutation<QuoteRequest>(
      () => client.patch(ENDPOINTS.QUOTE.CONFIRM_DELIVERY(quoteId)),
      L('confirmDelivery')
    ),
};
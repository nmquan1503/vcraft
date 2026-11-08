import type {
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
} from '@/types';
import { mockQuotes, mockBids } from './data/quotes';
import { delay, paginate, findById, MockApiError } from './helpers';

interface QuoteQuery { page?: number; limit?: number; status?: QuoteStatus }

let quotes = [...mockQuotes];
let bids = [...mockBids];

const MY_BUYER_ID = 'user-buyer-1';
const MY_ARTISAN_ID = 'artisan-1';

export const quoteApi = {
  async listMine(params: QuoteQuery = {}): Promise<PageResponse<QuoteRequest>> {
    await delay();
    let filtered = quotes.filter((q) => q.buyerId === MY_BUYER_ID);
    if (params.status) filtered = filtered.filter((q) => q.status === params.status);
    return paginate(filtered, params.page, params.limit);
  },

  async getById(id: string): Promise<QuoteWithBids | null> {
    await delay();
    const quote = findById(quotes, id);
    if (!quote) return null;
    return {
      quote,
      bids: bids.filter((b) => b.quoteRequestId === id),
    };
  },

  async create(payload: CreateQuotePayload): Promise<QuoteRequest> {
    await delay();
    const quote: QuoteRequest = {
      id: `quote-${Date.now()}`,
      buyerId: MY_BUYER_ID,
      categoryId: payload.categoryId ?? '',
      title: payload.title,
      description: payload.description,
      quantity: payload.quantity,
      unit: payload.unit ?? '',
      deadline: payload.deadline ?? new Date().toISOString(),
      status: 'DRAFT',
      targetArtisanIds: payload.targetArtisanIds ?? [],
      deliveryNote: null,
      deliveryImages: [],
      acceptedBidId: null,
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    quotes = [quote, ...quotes];
    return quote;
  },

  async update(id: string, payload: UpdateQuotePayload): Promise<QuoteRequest> {
    await delay();
    const quote = findById(quotes, id);
    if (!quote) throw new MockApiError('Không tìm thấy yêu cầu', 404);
    if (quote.status !== 'DRAFT') {
      throw new MockApiError('Chỉ có thể sửa yêu cầu ở trạng thái Draft', 409);
    }
    const updated: QuoteRequest = { ...quote, ...payload, updatedAt: new Date().toISOString() };
    quotes = quotes.map((q) => (q.id === id ? updated : q));
    return updated;
  },

  async submit(id: string): Promise<QuoteRequest> {
    await delay();
    const quote = findById(quotes, id);
    if (!quote) throw new MockApiError('Không tìm thấy yêu cầu', 404);
    const updated: QuoteRequest = {
      ...quote,
      status: 'SENT',
      updatedAt: new Date().toISOString(),
    };
    quotes = quotes.map((q) => (q.id === id ? updated : q));
    return updated;
  },

  async cancel(id: string): Promise<MessageResponse> {
    await delay();
    quotes = quotes.filter((q) => q.id !== id);
    return { message: 'Deleted quote request successfully' };
  },

  async listIncoming(params: QuoteQuery = {}): Promise<QuoteRequest[]> {
    await delay();
    let filtered = quotes.filter((q) => q.targetArtisanIds.includes(MY_ARTISAN_ID));
    if (params.status) filtered = filtered.filter((q) => q.status === params.status);
    return filtered;
  },

  async placeBid(quoteId: string, payload: PlaceBidPayload): Promise<Bid> {
    await delay();
    const quote = findById(quotes, quoteId);
    if (!quote) throw new MockApiError('Không tìm thấy yêu cầu', 404);

    const bid: Bid = {
      id: `bid-${Date.now()}`,
      quoteRequestId: quoteId,
      artisanId: MY_ARTISAN_ID,
      pricePerUnit: payload.pricePerUnit,
      totalPrice: payload.totalPrice ?? payload.pricePerUnit * quote.quantity,
      estimatedDays: payload.estimatedDays,
      note: payload.note ?? '',
      deliveryTerms: payload.deliveryTerms ?? '',
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    bids = [...bids, bid];

    // SENT → BIDDING khi có bid đầu tiên
    if (quote.status === 'SENT') {
      quotes = quotes.map((q) =>
        q.id === quoteId
          ? { ...q, status: 'BIDDING' as QuoteStatus, updatedAt: new Date().toISOString() }
          : q
      );
    }

    return bid;
  },

  async updateBid(
    _quoteId: string,
    bidId: string,
    payload: UpdateBidPayload
  ): Promise<Bid> {
    await delay();
    const bid = findById(bids, bidId);
    if (!bid) throw new MockApiError('Không tìm thấy giá thầu', 404);

    const quote = findById(quotes, bid.quoteRequestId);
    const newPrice = payload.pricePerUnit ?? bid.pricePerUnit;

    const updated: Bid = {
      ...bid,
      ...payload,
      pricePerUnit: newPrice,
      totalPrice: quote ? newPrice * quote.quantity : bid.totalPrice,
      updatedAt: new Date().toISOString(),
    };
    bids = bids.map((b) => (b.id === bidId ? updated : b));
    return updated;
  },

  async acceptBid(quoteId: string, bidId: string): Promise<MessageResponse> {
    await delay();
    quotes = quotes.map((q) =>
      q.id === quoteId
        ? {
            ...q,
            status: 'IN_PRODUCTION' as QuoteStatus,
            acceptedBidId: bidId,
            updatedAt: new Date().toISOString(),
          }
        : q
    );
    bids = bids.map((b) =>
      b.id === bidId
        ? { ...b, status: 'ACCEPTED' }
        : b.quoteRequestId === quoteId && b.status === 'PENDING'
        ? { ...b, status: 'REJECTED' }
        : b
    );
    return { message: 'Đã chấp thuận giá thầu. Đơn hàng chuyển sang trạng thái sản xuất.' };
  },

  async rejectBid(_quoteId: string, bidId: string): Promise<MessageResponse> {
    await delay();
    bids = bids.map((b) => (b.id === bidId ? { ...b, status: 'REJECTED' } : b));
    return { message: 'Đã từ chối giá thầu.' };
  },

  async markDelivered(
    quoteId: string,
    payload: CompleteDeliveryPayload = {}
  ): Promise<QuoteRequest> {
    await delay();
    const quote = findById(quotes, quoteId);
    if (!quote) throw new MockApiError('Không tìm thấy yêu cầu', 404);
    const updated: QuoteRequest = {
      ...quote,
      status: 'DELIVERED',
      deliveryNote: payload.deliveryNote ?? null,
      deliveryImages: payload.deliveryImages ?? [],
      updatedAt: new Date().toISOString(),
    };
    quotes = quotes.map((q) => (q.id === quoteId ? updated : q));
    return updated;
  },

  async confirmDelivery(quoteId: string): Promise<QuoteRequest> {
    await delay();
    const quote = findById(quotes, quoteId);
    if (!quote) throw new MockApiError('Không tìm thấy yêu cầu', 404);
    const updated: QuoteRequest = {
      ...quote,
      status: 'CLOSED',
      updatedAt: new Date().toISOString(),
    };
    quotes = quotes.map((q) => (q.id === quoteId ? updated : q));
    return updated;
  },
};
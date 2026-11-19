import type {
  Order,
  OrderItem,
  PageResponse,
  OrderStatus,
  CreateOrderPayload,
  CancelOrderPayload,
  UpdateOrderStatusPayload,
} from '@/types';
import { mockOrders } from './data/orders';
import { mockProducts } from './data/products';
import { delay, paginate, findById, MockApiError } from './helpers';

interface OrderQuery { page?: number; limit?: number; status?: OrderStatus }

let orders = [...mockOrders];

const MY_BUYER_ID = 'user-buyer-1';

export const orderApi = {
  async listMine(params: OrderQuery = {}): Promise<PageResponse<Order>> {
    await delay();
    let filtered = orders.filter((o) => o.buyerId === MY_BUYER_ID);
    if (params.status) filtered = filtered.filter((o) => o.status === params.status);
    return paginate(filtered, params.page, params.limit);
  },

  async getById(id: string): Promise<Order | null> {
    await delay();
    return findById(orders, id) ?? null;
  },

  async create(payload: CreateOrderPayload): Promise<Order> {
    await delay();
    const id = `order-${Date.now()}`;
    const items: OrderItem[] = mockProducts.slice(0, 2).map((p, i) => ({
      id: `oi-${Date.now()}-${i}`,
      orderId: id,
      productId: p.id,
      artisanId: p.artisanId,
      productName: p.name,
      price: p.price,
      quantity: 1,
    }));
    const order: Order = {
      id,
      buyerId: MY_BUYER_ID,
      shippingAddress: payload.shippingAddress,
      paymentMethod: payload.paymentMethod ?? 'COD',
      note: payload.note ?? null,
      status: 'PENDING',
      totalAmount: items.reduce((s, it) => s + it.price * it.quantity, 0),
      cancelReason: null,
      items,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    orders = [order, ...orders];
    return order;
  },

  async cancel(id: string, payload: CancelOrderPayload = {}): Promise<Order> {
    await delay();
    const order = findById(orders, id);
    if (!order) throw new MockApiError('Không tìm thấy đơn', 404);
    const updated: Order = {
      ...order,
      status: 'CANCELLED',
      cancelReason: payload.reason ?? 'Buyer cancelled',
      updatedAt: new Date().toISOString(),
    };
    orders = orders.map((o) => (o.id === id ? updated : o));
    return updated;
  },

  async updateStatus(id: string, payload: UpdateOrderStatusPayload): Promise<Order> {
    await delay();
    const order = findById(orders, id);
    if (!order) throw new MockApiError('Không tìm thấy đơn', 404);
    const updated: Order = {
      ...order,
      status: payload.status,
      updatedAt: new Date().toISOString(),
    };
    orders = orders.map((o) => (o.id === id ? updated : o));
    return updated;
  },
};
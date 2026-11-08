import client from './client';
import { ENDPOINTS } from './endpoints';
import { safeMutation, safeQuery, emptyPage } from './_helpers';
import type {
  Order,
  PageResponse,
  OrderStatus,
  CreateOrderPayload,
  CancelOrderPayload,
  UpdateOrderStatusPayload,
} from '../types';

const L = (fn: string) => `orderApi.${fn}`;

interface OrderQuery {
  page?: number;
  limit?: number;
  status?: OrderStatus;
}

export const orderApi = {
  listMine: (params: OrderQuery = {}): Promise<PageResponse<Order>> =>
    safeQuery<PageResponse<Order>>(
      () => client.get(ENDPOINTS.ORDER.LIST, { params }),
      emptyPage<Order>(params.page, params.limit),
      L('listMine')
    ),

  getById: (id: string): Promise<Order | null> =>
    safeQuery<Order | null>(
      () => client.get(ENDPOINTS.ORDER.DETAIL(id)),
      null,
      L('getById')
    ),

  create: (payload: CreateOrderPayload): Promise<Order> =>
    safeMutation<Order>(
      () => client.post(ENDPOINTS.ORDER.CREATE, payload),
      L('create')
    ),

  cancel: (id: string, payload: CancelOrderPayload = {}): Promise<Order> =>
    safeMutation<Order>(
      () => client.patch(ENDPOINTS.ORDER.CANCEL(id), payload),
      L('cancel')
    ),

  updateStatus: (id: string, payload: UpdateOrderStatusPayload): Promise<Order> =>
    safeMutation<Order>(
      () => client.patch(ENDPOINTS.ORDER.UPDATE_STATUS(id), payload),
      L('updateStatus')
    ),
};
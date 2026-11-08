import client from './client';
import { ENDPOINTS } from './endpoints';
import { safeMutation, safeQuery } from './_helpers';
import type {
  Cart,
  AddToCartPayload,
  UpdateCartItemPayload,
  MessageResponse,
} from '../types';

const L = (fn: string) => `cartApi.${fn}`;

const emptyCart = (): Cart => ({
  id: '',
  userId: '',
  items: [],
  createdAt: '',
});

export const cartApi = {
  get: (): Promise<Cart> =>
    safeQuery<Cart>(() => client.get(ENDPOINTS.CART.GET), emptyCart(), L('get')),

  addItem: (payload: AddToCartPayload): Promise<Cart> =>
    safeMutation<Cart>(
      () => client.post(ENDPOINTS.CART.ADD_ITEM, payload),
      L('addItem')
    ),

  updateItem: (itemId: string, payload: UpdateCartItemPayload): Promise<Cart> =>
    safeMutation<Cart>(
      () => client.put(ENDPOINTS.CART.UPDATE_ITEM(itemId), payload),
      L('updateItem')
    ),

  deleteItem: (itemId: string): Promise<Cart> =>
    safeMutation<Cart>(
      () => client.delete(ENDPOINTS.CART.DELETE_ITEM(itemId)),
      L('deleteItem')
    ),

  clear: (): Promise<MessageResponse> =>
    safeMutation<MessageResponse>(
      () => client.delete(ENDPOINTS.CART.CLEAR),
      L('clear')
    ),
};
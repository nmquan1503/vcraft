import type {
  Cart,
  CartItem,
  AddToCartPayload,
  UpdateCartItemPayload,
  MessageResponse,
} from '@/types';
import { delay } from './helpers';

let cart: Cart = {
  id: 'cart-1',
  userId: 'user-buyer-1',
  items: [],
  createdAt: new Date().toISOString(),
};

const clone = (): Cart => ({ ...cart, items: cart.items.map((i) => ({ ...i })) });

export const cartApi = {
  async get(): Promise<Cart> {
    await delay();
    return clone();
  },

  async addItem(payload: AddToCartPayload): Promise<Cart> {
    await delay();
    const existing = cart.items.find((i) => i.productId === payload.productId);
    if (existing) {
      cart.items = cart.items.map((i) =>
        i.productId === payload.productId
          ? { ...i, quantity: i.quantity + payload.quantity }
          : i
      );
    } else {
      const newItem: CartItem = {
        id: `ci-${Date.now()}`,
        cartId: cart.id,
        productId: payload.productId,
        quantity: payload.quantity,
        createdAt: new Date().toISOString(),
      };
      cart.items = [...cart.items, newItem];
    }
    return clone();
  },

  async updateItem(itemId: string, payload: UpdateCartItemPayload): Promise<Cart> {
    await delay();
    cart.items = cart.items.map((i) =>
      i.id === itemId ? { ...i, quantity: payload.quantity } : i
    );
    return clone();
  },

  async deleteItem(itemId: string): Promise<Cart> {
    await delay();
    cart.items = cart.items.filter((i) => i.id !== itemId);
    return clone();
  },

  async clear(): Promise<MessageResponse> {
    await delay();
    cart.items = [];
    return { message: 'Cart cleared successfully' };
  },
};
import type { OrderStatus } from './enums';

export interface Order {
  id: string;
  buyerId: string;
  shippingAddress: string;
  paymentMethod: string;
  note: string | null;
  status: OrderStatus;
  totalAmount: number;
  cancelReason: string | null;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  artisanId: string;
  productName: string;
  price: number;
  quantity: number;
}

export interface CreateOrderPayload {
  shippingAddress: string;
  paymentMethod?: string;
  note?: string;
}

export interface CancelOrderPayload {
  reason?: string;
}

export interface UpdateOrderStatusPayload {
  status: OrderStatus;
  note?: string;
}
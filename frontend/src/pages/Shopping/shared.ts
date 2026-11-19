import { toApiError } from '@/api/_helpers';
import type { OrderStatus } from '@/types';
export const money = (value: number) => `${value.toLocaleString('vi-VN')} ₫`;
export const statuses: Record<OrderStatus, string> = { PENDING: 'Chờ xác nhận', CONFIRMED: 'Đã xác nhận', SHIPPING: 'Đang giao', DELIVERED: 'Đã giao', CANCELLED: 'Đã hủy' };
export const nextStatus: Partial<Record<OrderStatus, OrderStatus>> = { PENDING: 'CONFIRMED', CONFIRMED: 'SHIPPING', SHIPPING: 'DELIVERED' };
export const errorMessage = (error: unknown) => toApiError(error).message;
export const button = 'rounded border px-4 py-2 disabled:opacity-40 hover:bg-stone-200';

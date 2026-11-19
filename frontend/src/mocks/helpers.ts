import type { PageResponse } from '@/types';

export const delay = (ms = 250): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export function paginate<T>(
  items: T[],
  page = 1,
  limit = 10
): PageResponse<T> {
  const start = (page - 1) * limit;
  return {
    data: items.slice(start, start + limit),
    page,
    limit,
    totalElements: items.length,
    totalPages: Math.max(1, Math.ceil(items.length / limit)),
  };
}

export function findById<T extends { id: string }>(
  items: T[],
  id: string
): T | undefined {
  return items.find((item) => item.id === id);
}

export class MockApiError extends Error {
  readonly status: number;
  readonly data: unknown;

  constructor(message: string, status = 400, data: unknown = null) {
    super(message);
    this.name = 'MockApiError';
    this.status = status;
    this.data = data;
  }
}
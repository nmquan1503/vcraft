import type { AxiosError, AxiosResponse } from 'axios';
import type { MessageResponse, PageResponse } from '../types';

export class ApiError extends Error {
  readonly status: number;
  readonly data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export const isApiError = (err: unknown): err is ApiError => err instanceof ApiError;

export function toApiError(error: unknown): ApiError {
  if (isApiError(error)) return error;

  const axiosErr = error as AxiosError<{ message?: string; error?: string }>;

  if (axiosErr.response) {
    const body = axiosErr.response.data;
    return new ApiError(
      body?.message ?? body?.error ?? axiosErr.response.statusText ?? 'Request failed',
      axiosErr.response.status,
      body ?? null
    );
  }

  if (axiosErr.request) return new ApiError('Cannot reach server', 0, null);

  return new ApiError(error instanceof Error ? error.message : 'Unknown error', 0, null);
}

export const emptyPage = <T>(page = 1, limit = 10): PageResponse<T> => ({
  data: [],
  page,
  limit,
  totalElements: 0,
  totalPages: 0,
});

export const messageResult = (): MessageResponse => ({ message: '' });

export function toFormData(fields: Record<string, unknown>): FormData {
  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    if (value === undefined || value === null) continue;
    if (Array.isArray(value)) {
      for (const item of value) form.append(key, item as Blob | string);
    } else {
      form.append(key, value as Blob | string);
    }
  }
  return form;
}

export async function safeQuery<T>(
  factory: () => Promise<AxiosResponse<T>>,
  defaultValue: T,
  label: string
): Promise<T> {
  try {
    const res = await factory();
    return res.data ?? defaultValue;
  } catch (error) {
    console.error(`[${label}]`, toApiError(error));
    return defaultValue;
  }
}

export async function safeMutation<T>(
  factory: () => Promise<AxiosResponse<T>>,
  label: string
): Promise<T> {
  try {
    const res = await factory();
    return res.data;
  } catch (error) {
    const apiErr = toApiError(error);
    console.error(`[${label}]`, apiErr);
    throw apiErr;
  }
}
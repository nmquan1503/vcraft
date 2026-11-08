import client from './client';
import { ENDPOINTS } from './endpoints';
import { safeMutation, safeQuery, emptyPage, toFormData } from './_helpers';
import type {
  Product,
  CreateProductPayload,
  UpdateProductPayload,
  MessageResponse,
  PageResponse,
} from '../types';

const L = (fn: string) => `productApi.${fn}`;

interface ProductQuery {
  page?: number;
  limit?: number;
  artisanId?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
}

export const productApi = {
  list: (params: ProductQuery = {}): Promise<PageResponse<Product>> =>
    safeQuery<PageResponse<Product>>(
      () => client.get(ENDPOINTS.PRODUCT.LIST, { params }),
      emptyPage<Product>(params.page, params.limit),
      L('list')
    ),

  getById: (id: string): Promise<Product | null> =>
    safeQuery<Product | null>(
      () => client.get(ENDPOINTS.PRODUCT.DETAIL(id)),
      null,
      L('getById')
    ),

  create: (payload: CreateProductPayload): Promise<Product> =>
    safeMutation<Product>(
      () => client.post(ENDPOINTS.PRODUCT.CREATE, payload),
      L('create')
    ),

  update: (id: string, payload: UpdateProductPayload): Promise<Product> =>
    safeMutation<Product>(
      () => client.put(ENDPOINTS.PRODUCT.UPDATE(id), payload),
      L('update')
    ),

  delete: (id: string): Promise<MessageResponse> =>
    safeMutation<MessageResponse>(
      () => client.delete(ENDPOINTS.PRODUCT.DELETE(id)),
      L('delete')
    ),

  uploadImages: (id: string, files: File[]): Promise<string[]> =>
    safeMutation<string[]>(
      () => client.post(ENDPOINTS.PRODUCT.IMAGES(id), toFormData({ files })),
      L('uploadImages')
    ),
};
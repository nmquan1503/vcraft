import client from './client';
import { ENDPOINTS } from './endpoints';
import { safeMutation, safeQuery } from './_helpers';
import type { Category, CategoryPayload, MessageResponse } from '../types';

const L = (fn: string) => `categoryApi.${fn}`;

export const categoryApi = {
  list: (): Promise<Category[]> =>
    safeQuery<Category[]>(
      () => client.get(ENDPOINTS.CATEGORY.LIST),
      [],
      L('list')
    ),

  create: (payload: CategoryPayload): Promise<Category> =>
    safeMutation<Category>(
      () => client.post(ENDPOINTS.CATEGORY.CREATE, payload),
      L('create')
    ),

  update: (id: string, payload: CategoryPayload): Promise<Category> =>
    safeMutation<Category>(
      () => client.put(ENDPOINTS.CATEGORY.UPDATE(id), payload),
      L('update')
    ),

  delete: (id: string): Promise<MessageResponse> =>
    safeMutation<MessageResponse>(
      () => client.delete(ENDPOINTS.CATEGORY.DELETE(id)),
      L('delete')
    ),
};
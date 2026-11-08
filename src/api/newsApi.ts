import client from './client';
import { ENDPOINTS } from './endpoints';
import { safeMutation, safeQuery, emptyPage } from './_helpers';
import type {
  News,
  NewsType,
  CreateNewsPayload,
  UpdateNewsPayload,
  MessageResponse,
  PageResponse,
} from '../types';

const L = (fn: string) => `newsApi.${fn}`;

interface NewsQuery {
  page?: number;
  limit?: number;
  type?: NewsType;
}

export const newsApi = {
  list: (params: NewsQuery = {}): Promise<PageResponse<News>> =>
    safeQuery<PageResponse<News>>(
      () => client.get(ENDPOINTS.NEWS.LIST, { params }),
      emptyPage<News>(params.page, params.limit),
      L('list')
    ),

  getById: (id: string): Promise<News | null> =>
    safeQuery<News | null>(
      () => client.get(ENDPOINTS.NEWS.DETAIL(id)),
      null,
      L('getById')
    ),

  create: (payload: CreateNewsPayload): Promise<News> =>
    safeMutation<News>(
      () => client.post(ENDPOINTS.NEWS.CREATE, payload),
      L('create')
    ),

  update: (id: string, payload: UpdateNewsPayload): Promise<News> =>
    safeMutation<News>(
      () => client.put(ENDPOINTS.NEWS.UPDATE(id), payload),
      L('update')
    ),

  delete: (id: string): Promise<MessageResponse> =>
    safeMutation<MessageResponse>(
      () => client.delete(ENDPOINTS.NEWS.DELETE(id)),
      L('delete')
    ),
};
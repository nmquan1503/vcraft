import type {
  News,
  NewsType,
  CreateNewsPayload,
  UpdateNewsPayload,
  MessageResponse,
  PageResponse,
} from '@/types';
import { mockNews } from './data/news';
import { delay, paginate, findById, MockApiError } from './helpers';

interface NewsQuery { page?: number; limit?: number; type?: NewsType }

let newsList = [...mockNews];

export const newsApi = {
  async list(params: NewsQuery = {}): Promise<PageResponse<News>> {
    await delay();
    let filtered = newsList;
    if (params.type) filtered = filtered.filter((n) => n.type === params.type);
    return paginate(filtered, params.page, params.limit);
  },

  async getById(id: string): Promise<News | null> {
    await delay();
    return findById(newsList, id) ?? null;
  },

  async create(payload: CreateNewsPayload): Promise<News> {
    await delay();
    const item: News = {
      id: `news-${Date.now()}`,
      authorId: 'user-admin-1',
      title: payload.title,
      content: payload.content,
      type: payload.type,
      images: payload.images ?? [],
      publishedAt: payload.publishedAt ?? new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    newsList = [item, ...newsList];
    return item;
  },

  async update(id: string, payload: UpdateNewsPayload): Promise<News> {
    await delay();
    const item = findById(newsList, id);
    if (!item) throw new MockApiError('Không tìm thấy bài tin', 404);
    const updated: News = { ...item, ...payload, updatedAt: new Date().toISOString() };
    newsList = newsList.map((n) => (n.id === id ? updated : n));
    return updated;
  },

  async delete(id: string): Promise<MessageResponse> {
    await delay();
    newsList = newsList.filter((n) => n.id !== id);
    return { message: 'Deleted news successfully' };
  },
};
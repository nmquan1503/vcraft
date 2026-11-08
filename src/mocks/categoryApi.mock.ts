import type { Category, CategoryPayload, MessageResponse } from '@/types';
import { mockCategories } from './data/categories';
import { delay, findById, MockApiError } from './helpers';

let categories = [...mockCategories];

export const categoryApi = {
  async list(): Promise<Category[]> {
    await delay();
    return categories;
  },

  async create(payload: CategoryPayload): Promise<Category> {
    await delay();
    const cat: Category = {
      id: `cat-${Date.now()}`,
      name: payload.name,
      description: payload.description ?? '',
      icon: payload.icon ?? null,
      createdAt: new Date().toISOString(),
    };
    categories = [...categories, cat];
    return cat;
  },

  async update(id: string, payload: CategoryPayload): Promise<Category> {
    await delay();
    const cat = findById(categories, id);
    if (!cat) throw new MockApiError('Không tìm thấy danh mục', 404);
    const updated: Category = {
      ...cat,
      name: payload.name,
      description: payload.description ?? '',
      icon: payload.icon ?? null,
    };
    categories = categories.map((c) => (c.id === id ? updated : c));
    return updated;
  },

  async delete(id: string): Promise<MessageResponse> {
    await delay();
    categories = categories.filter((c) => c.id !== id);
    return { message: 'Deleted category successfully' };
  },
};
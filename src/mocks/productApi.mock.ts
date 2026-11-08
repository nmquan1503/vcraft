import type {
  Product,
  CreateProductPayload,
  UpdateProductPayload,
  MessageResponse,
  PageResponse,
} from '@/types';
import { mockProducts } from './data/products';
import { delay, paginate, findById, MockApiError } from './helpers';

interface ProductQuery {
  page?: number;
  limit?: number;
  artisanId?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
}

let products = [...mockProducts];

export const productApi = {
  async list(params: ProductQuery = {}): Promise<PageResponse<Product>> {
    await delay();
    let filtered = products;
    if (params.artisanId) filtered = filtered.filter((p) => p.artisanId === params.artisanId);
    if (params.categoryId) filtered = filtered.filter((p) => p.categoryId === params.categoryId);
    if (params.minPrice !== undefined) filtered = filtered.filter((p) => p.price >= params.minPrice!);
    if (params.maxPrice !== undefined) filtered = filtered.filter((p) => p.price <= params.maxPrice!);
    if (params.sort === 'price_asc') filtered = [...filtered].sort((a, b) => a.price - b.price);
    if (params.sort === 'price_desc') filtered = [...filtered].sort((a, b) => b.price - a.price);
    return paginate(filtered, params.page, params.limit);
  },

  async getById(id: string): Promise<Product | null> {
    await delay();
    return findById(products, id) ?? null;
  },

  async create(payload: CreateProductPayload): Promise<Product> {
    await delay();
    const product: Product = {
      id: `product-${Date.now()}`,
      artisanId: 'artisan-1',
      categoryId: payload.categoryId ?? 'cat-1',
      batchId: payload.batchId ?? null,
      name: payload.name,
      description: payload.description ?? '',
      price: payload.price,
      stock: payload.stock,
      images: payload.images ?? [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    products = [product, ...products];
    return product;
  },

  async update(id: string, payload: UpdateProductPayload): Promise<Product> {
    await delay();
    const product = findById(products, id);
    if (!product) throw new MockApiError('Không tìm thấy sản phẩm', 404);
    const updated: Product = {
      ...product,
      ...payload,
      updatedAt: new Date().toISOString(),
    };
    products = products.map((p) => (p.id === id ? updated : p));
    return updated;
  },

  async delete(id: string): Promise<MessageResponse> {
    await delay();
    products = products.filter((p) => p.id !== id);
    return { message: 'Deleted product successfully' };
  },

  async uploadImages(_id: string, files: File[]): Promise<string[]> {
    await delay();
    return files.map((f) => URL.createObjectURL(f));
  },
};
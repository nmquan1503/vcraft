export interface Product {
  id: string;
  artisanId: string;
  categoryId: string;
  batchId: string | null;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductPayload {
  name: string;
  description?: string;
  price: number;
  stock: number;
  categoryId?: string;
  batchId?: string;
  images?: string[];
}

export interface UpdateProductPayload {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  images?: string[];
}
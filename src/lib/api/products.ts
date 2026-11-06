import apiClient from "@/lib/apiClient";
import { PageResponse } from "@/types/common";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  categoryId: string;
  categoryName: string;
  artisanId: string;
  artisanName: string;
  createdAt: string;
}

export const productApi = {
  getAll: (params?: { page?: number; size?: number; search?: string; categoryId?: string }) =>
    apiClient.get<PageResponse<Product>>("/products", { params }).then((r) => r.data),

  getById: (id: string) =>
    apiClient.get<Product>(`/products/${id}`).then((r) => r.data),

  create: (data: FormData) =>
    apiClient.post<Product>("/products", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }).then((r) => r.data),

  update: (id: string, data: Partial<Product>) =>
    apiClient.put<Product>(`/products/${id}`, data).then((r) => r.data),

  delete: (id: string) =>
    apiClient.delete(`/products/${id}`).then((r) => r.data),

  uploadImages: (id: string, files: FormData) =>
    apiClient.post(`/products/${id}/images`, files, {
      headers: { "Content-Type": "multipart/form-data" },
    }).then((r) => r.data),
};

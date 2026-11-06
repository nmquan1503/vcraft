import apiClient from "@/lib/apiClient";

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export const categoryApi = {
  getAll: () =>
    apiClient.get<Category[]>("/categories").then((r) => r.data),

  getById: (id: string) =>
    apiClient.get<Category>(`/categories/${id}`).then((r) => r.data),

  create: (data: { name: string; description?: string }) =>
    apiClient.post<Category>("/categories", data).then((r) => r.data),

  delete: (id: string) =>
    apiClient.delete(`/categories/${id}`).then((r) => r.data),
};

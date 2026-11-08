export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string | null;
  createdAt: string;
}

export interface CategoryPayload {
  name: string;
  description?: string;
  icon?: string;
}
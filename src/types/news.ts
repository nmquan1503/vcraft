import type { NewsType } from './enums';

export interface News {
  id: string;
  authorId: string;
  title: string;
  content: string;
  type: NewsType;
  images: string[];
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNewsPayload {
  title: string;
  content: string;
  type: NewsType;
  publishedAt?: string;
  images?: string[];
}

export interface UpdateNewsPayload {
  title?: string;
  content?: string;
  type?: NewsType;
}
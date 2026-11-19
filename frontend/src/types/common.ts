import type { Role } from './enums';

export interface PageResponse<T> {
  data: T[];
  page: number;
  limit: number;
  totalElements: number;
  totalPages: number;
}

export interface ErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}

export interface MessageResponse {
  message: string;
}

export interface UserInfo {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: Role;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: UserInfo;
}
// ====== Auth Types ======
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterBuyerRequest {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}

export interface RegisterArtisanRequest {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  workshopName: string;
  address: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  role: "BUYER" | "ARTISAN" | "ADMIN";
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: "BUYER" | "ARTISAN" | "ADMIN";
  status: string;
  createdAt: string;
}

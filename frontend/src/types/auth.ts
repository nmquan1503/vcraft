export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterBuyerRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface RegisterArtisanRequest {
  workshopName: string;
  ownerName: string;
  email: string;
  phone?: string;
  address: string;
  lat?: number;
  lng?: number;
  description?: string;
  certificates?: string[];
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}
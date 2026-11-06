import apiClient from "@/lib/apiClient";
import {
  AuthResponse,
  LoginRequest,
  RegisterBuyerRequest,
  RegisterArtisanRequest,
  UserProfile,
} from "@/types/auth";

export const authApi = {
  loginBuyer: (data: LoginRequest) =>
    apiClient.post<AuthResponse>("/auth/login", data).then((r) => r.data),

  registerBuyer: (data: RegisterBuyerRequest) =>
    apiClient.post<AuthResponse>("/auth/register/buyer", data).then((r) => r.data),

  registerArtisan: (data: RegisterArtisanRequest) =>
    apiClient.post<AuthResponse>("/auth/register/artisan", data).then((r) => r.data),

  me: () =>
    apiClient.get<UserProfile>("/auth/me").then((r) => r.data),

  logout: () =>
    apiClient.post("/auth/logout").then((r) => r.data),

  changePassword: (data: { oldPassword: string; newPassword: string }) =>
    apiClient.put("/auth/change-password", data).then((r) => r.data),
};

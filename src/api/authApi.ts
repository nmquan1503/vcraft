import client from './client';
import { ENDPOINTS } from './endpoints';
import { safeMutation, safeQuery } from './_helpers';
import type {
  AuthResponse,
  LoginRequest,
  RegisterArtisanRequest,
  RegisterBuyerRequest,
  ChangePasswordRequest,
  RefreshTokenRequest,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  MessageResponse,
  ArtisanProfile,
  User,
} from '../types';
import { setAuth, clearTokens, getRefreshToken } from '../utils/tokenStorage';

const L = (fn: string) => `authApi.${fn}`;

export const authApi = {
  registerBuyer: async (payload: RegisterBuyerRequest): Promise<AuthResponse> => {
    const data = await safeMutation<AuthResponse>(
      () => client.post(ENDPOINTS.AUTH.REGISTER_BUYER, payload),
      L('registerBuyer')
    );
    setAuth(data);
    return data;
  },

  registerArtisan: (payload: RegisterArtisanRequest): Promise<ArtisanProfile> =>
    safeMutation<ArtisanProfile>(
      () => client.post(ENDPOINTS.AUTH.REGISTER_ARTISAN, payload),
      L('registerArtisan')
    ),

  login: async (payload: LoginRequest): Promise<AuthResponse> => {
    const data = await safeMutation<AuthResponse>(
      () => client.post(ENDPOINTS.AUTH.LOGIN, payload),
      L('login')
    );
    setAuth(data);
    return data;
  },

  logout: async (): Promise<void> => {
    const refreshToken = getRefreshToken();
    const payload: RefreshTokenRequest | undefined = refreshToken
      ? { refreshToken }
      : undefined;
    try {
      await client.post(ENDPOINTS.AUTH.LOGOUT, payload);
    } catch (error) {
      console.error(`[${L('logout')}]`, error);
    } finally {
      clearTokens();
    }
  },

  me: (): Promise<User | null> =>
    safeQuery<User | null>(
      () => client.get(ENDPOINTS.AUTH.ME),
      null,
      L('me')
    ),

  changePassword: (payload: ChangePasswordRequest): Promise<MessageResponse> =>
    safeMutation<MessageResponse>(
      () => client.put(ENDPOINTS.AUTH.CHANGE_PASSWORD, payload),
      L('changePassword')
    ),

  forgotPassword: (payload: ForgotPasswordPayload): Promise<MessageResponse> =>
    safeMutation<MessageResponse>(
      () => client.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, payload),
      L('forgotPassword')
    ),

  resetPassword: (payload: ResetPasswordPayload): Promise<MessageResponse> =>
    safeMutation<MessageResponse>(
      () => client.post(ENDPOINTS.AUTH.RESET_PASSWORD, payload),
      L('resetPassword')
    ),
};
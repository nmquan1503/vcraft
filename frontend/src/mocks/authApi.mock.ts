import type {
  AuthResponse,
  LoginRequest,
  RegisterArtisanRequest,
  RegisterBuyerRequest,
  ChangePasswordRequest,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  MessageResponse,
  ArtisanProfile,
  User,
  UserInfo,
} from '@/types';
import { mockUsers } from './data/users';
import { mockArtisans } from './data/artisans';
import { delay, MockApiError } from './helpers';
import { setAuth, clearTokens } from '@/utils/tokenStorage';

const toUserInfo = (u: User): UserInfo => ({
  id: u.id,
  email: u.email,
  fullName: u.fullName,
  phone: u.phone,
  role: u.role,
});

const makeAuth = (user: User): AuthResponse => ({
  accessToken: `mock-token-${user.id}`,
  refreshToken: `mock-refresh-${user.id}`,
  user: toUserInfo(user),
});

let users = [...mockUsers];
let artisans = [...mockArtisans];

export const authApi = {
  async registerBuyer(payload: RegisterBuyerRequest): Promise<AuthResponse> {
    await delay();
    const user: User = {
      id: `user-${Date.now()}`,
      email: payload.email,
      passwordHash: '***',
      fullName: payload.name,
      phone: payload.phone ?? '',
      role: 'BUYER',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    users = [...users, user];
    const auth = makeAuth(user);
    setAuth(auth);
    return auth;
  },

  async registerArtisan(payload: RegisterArtisanRequest): Promise<ArtisanProfile> {
    await delay();
    const artisan: ArtisanProfile = {
      id: `artisan-${Date.now()}`,
      userId: `user-${Date.now()}`,
      workshopName: payload.workshopName,
      ownerName: payload.ownerName,
      phone: payload.phone ?? '',
      address: payload.address,
      district: 'Gia Lâm',
      latitude: payload.lat ?? null,
      longitude: payload.lng ?? null,
      openStatus: false,
      description: payload.description ?? '',
      familyHistory: '',
      certificates: payload.certificates ?? [],
      images: [],
      status: 'PENDING',
      rejectReason: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    artisans = [...artisans, artisan];
    return artisan;
  },

  async login(payload: LoginRequest): Promise<AuthResponse> {
    await delay();
    const user = users.find((u) => u.email === payload.email);
    if (!user) throw new MockApiError('Email hoặc mật khẩu không đúng', 401);
    if (user.status === 'BLOCKED') {
      throw new MockApiError('Tài khoản đã bị khóa', 403);
    }
    const auth = makeAuth(user);
    setAuth(auth);
    return auth;
  },

  async logout(): Promise<void> {
    await delay(100);
    clearTokens();
  },

  async me(): Promise<User | null> {
    await delay();
    const raw = localStorage.getItem('vcraft_user');
    if (!raw) return null;
    try {
      const info = JSON.parse(raw) as UserInfo;
      return users.find((u) => u.id === info.id) ?? null;
    } catch {
      return null;
    }
  },

  async changePassword(_payload: ChangePasswordRequest): Promise<MessageResponse> {
    await delay();
    return { message: 'Password changed successfully' };
  },

  async forgotPassword(_payload: ForgotPasswordPayload): Promise<MessageResponse> {
    await delay();
    return { message: 'Email hướng dẫn đặt lại mật khẩu đã được gửi' };
  },

  async resetPassword(_payload: ResetPasswordPayload): Promise<MessageResponse> {
    await delay();
    return { message: 'Mật khẩu đã được đặt lại thành công' };
  },
};
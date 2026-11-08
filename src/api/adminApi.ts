import client from './client';
import { ENDPOINTS } from './endpoints';
import { safeMutation, safeQuery, emptyPage } from './_helpers';
import type {
  ArtisanProfile,
  User,
  QuoteRequest,
  PageResponse,
  Role,
  QuoteStatus,
  AdminStats,
} from '../types';

const L = (fn: string) => `adminApi.${fn}`;

interface PageParams {
  page?: number;
  limit?: number;
}

interface UserQuery extends PageParams {
  role?: Role;
  search?: string;
}

interface QuoteQuery extends PageParams {
  status?: QuoteStatus;
}

const reasonBody = (reason?: string) =>
  reason ? { reason } : undefined;

export const adminApi = {
  listPendingArtisans: (
    params: PageParams = {}
  ): Promise<PageResponse<ArtisanProfile>> =>
    safeQuery<PageResponse<ArtisanProfile>>(
      () => client.get(ENDPOINTS.ADMIN.ARTISANS_PENDING, { params }),
      emptyPage<ArtisanProfile>(params.page, params.limit),
      L('listPendingArtisans')
    ),

  approveArtisan: (id: string): Promise<ArtisanProfile> =>
    safeMutation<ArtisanProfile>(
      () => client.patch(ENDPOINTS.ADMIN.ARTISAN_APPROVE(id)),
      L('approveArtisan')
    ),

  rejectArtisan: (id: string, reason?: string): Promise<ArtisanProfile> =>
    safeMutation<ArtisanProfile>(
      () => client.patch(ENDPOINTS.ADMIN.ARTISAN_REJECT(id), reasonBody(reason)),
      L('rejectArtisan')
    ),

  blockArtisan: (id: string, reason?: string): Promise<ArtisanProfile> =>
    safeMutation<ArtisanProfile>(
      () => client.patch(ENDPOINTS.ADMIN.ARTISAN_BLOCK(id), reasonBody(reason)),
      L('blockArtisan')
    ),

  listUsers: (params: UserQuery = {}): Promise<PageResponse<User>> =>
    safeQuery<PageResponse<User>>(
      () => client.get(ENDPOINTS.ADMIN.USERS, { params }),
      emptyPage<User>(params.page, params.limit),
      L('listUsers')
    ),

  blockUser: (id: string, reason?: string): Promise<User> =>
    safeMutation<User>(
      () => client.patch(ENDPOINTS.ADMIN.USER_BLOCK(id), reasonBody(reason)),
      L('blockUser')
    ),

  listAllQuotes: (params: QuoteQuery = {}): Promise<PageResponse<QuoteRequest>> =>
    safeQuery<PageResponse<QuoteRequest>>(
      () => client.get(ENDPOINTS.ADMIN.QUOTES, { params }),
      emptyPage<QuoteRequest>(params.page, params.limit),
      L('listAllQuotes')
    ),

  getStats: (): Promise<AdminStats> =>
    safeQuery<AdminStats>(
      () => client.get(ENDPOINTS.ADMIN.STATS),
      {},
      L('getStats')
    ),
};
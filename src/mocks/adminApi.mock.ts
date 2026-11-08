import type {
  ArtisanProfile,
  User,
  QuoteRequest,
  PageResponse,
  Role,
  QuoteStatus,
  AdminStats,
} from '@/types';
import { mockArtisans } from './data/artisans';
import { mockUsers } from './data/users';
import { mockQuotes } from './data/quotes';
import { delay, paginate, findById, MockApiError } from './helpers';

interface PageParams { page?: number; limit?: number }
interface UserQuery extends PageParams { role?: Role; search?: string }
interface QuoteQuery extends PageParams { status?: QuoteStatus }

let artisans = [...mockArtisans];
let users = [...mockUsers];

export const adminApi = {
  async listPendingArtisans(params: PageParams = {}): Promise<PageResponse<ArtisanProfile>> {
    await delay();
    return paginate(
      artisans.filter((a) => a.status === 'PENDING'),
      params.page,
      params.limit
    );
  },

  async approveArtisan(id: string): Promise<ArtisanProfile> {
    await delay();
    const a = findById(artisans, id);
    if (!a) throw new MockApiError('Không tìm thấy xưởng', 404);
    const updated: ArtisanProfile = { ...a, status: 'APPROVED' };
    artisans = artisans.map((x) => (x.id === id ? updated : x));
    return updated;
  },

  async rejectArtisan(id: string, reason?: string): Promise<ArtisanProfile> {
    await delay();
    const a = findById(artisans, id);
    if (!a) throw new MockApiError('Không tìm thấy xưởng', 404);
    const updated: ArtisanProfile = { ...a, status: 'REJECTED', rejectReason: reason ?? null };
    artisans = artisans.map((x) => (x.id === id ? updated : x));
    return updated;
  },

  async blockArtisan(id: string, reason?: string): Promise<ArtisanProfile> {
    await delay();
    const a = findById(artisans, id);
    if (!a) throw new MockApiError('Không tìm thấy xưởng', 404);
    const updated: ArtisanProfile = { ...a, status: 'BLOCKED', rejectReason: reason ?? null };
    artisans = artisans.map((x) => (x.id === id ? updated : x));
    return updated;
  },

  async listUsers(params: UserQuery = {}): Promise<PageResponse<User>> {
    await delay();
    let filtered = users;
    if (params.role) filtered = filtered.filter((u) => u.role === params.role);
    if (params.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (u) => u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      );
    }
    return paginate(filtered, params.page, params.limit);
  },

  async blockUser(id: string): Promise<User> {
    await delay();
    const u = findById(users, id);
    if (!u) throw new MockApiError('Không tìm thấy người dùng', 404);
    const updated: User = { ...u, status: 'BLOCKED' };
    users = users.map((x) => (x.id === id ? updated : x));
    return updated;
  },

  async listAllQuotes(params: QuoteQuery = {}): Promise<PageResponse<QuoteRequest>> {
    await delay();
    let filtered = mockQuotes;
    if (params.status) filtered = filtered.filter((q) => q.status === params.status);
    return paginate(filtered, params.page, params.limit);
  },

  async getStats(): Promise<AdminStats> {
    await delay();
    return {
      totalUsers: users.length,
      totalArtisans: artisans.length,
      pendingArtisans: artisans.filter((a) => a.status === 'PENDING').length,
      approvedArtisans: artisans.filter((a) => a.status === 'APPROVED').length,
      totalQuotes: mockQuotes.length,
      totalOrders: 0,
    };
  },
};
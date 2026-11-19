import type {
  ArtisanProfile,
  UpdateArtisanPayload,
  LocationPayload,
  OpenStatusPayload,
  MessageResponse,
  PageResponse,
  Order,
} from '@/types';
import { mockArtisans } from './data/artisans';
import { mockOrders } from './data/orders';
import { delay, paginate, findById, MockApiError } from './helpers';

interface ListParams {
  page?: number;
  limit?: number;
  search?: string;
  district?: string;
}

let artisans = [...mockArtisans];

const MY_ARTISAN_ID = 'artisan-1';

export const artisanApi = {
  async list(params: ListParams = {}): Promise<PageResponse<ArtisanProfile>> {
    await delay();
    let filtered = artisans.filter((a) => a.status === 'APPROVED');
    if (params.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter((a) => a.workshopName.toLowerCase().includes(q));
    }
    if (params.district) filtered = filtered.filter((a) => a.district === params.district);
    return paginate(filtered, params.page, params.limit);
  },

  async map(params: { openOnly?: boolean } = {}): Promise<ArtisanProfile[]> {
    await delay();
    let filtered = artisans.filter((a) => a.status === 'APPROVED');
    if (params.openOnly) filtered = filtered.filter((a) => a.openStatus);
    return filtered;
  },

  async getMe(): Promise<ArtisanProfile | null> {
    await delay();
    return findById(artisans, MY_ARTISAN_ID) ?? null;
  },

  async updateMe(payload: UpdateArtisanPayload): Promise<ArtisanProfile> {
    await delay();
    const me = findById(artisans, MY_ARTISAN_ID);
    if (!me) throw new MockApiError('Không tìm thấy hồ sơ', 404);
    const updated: ArtisanProfile = {
      ...me,
      ...payload,
      latitude: payload.lat ?? me.latitude,
      longitude: payload.lng ?? me.longitude,
      updatedAt: new Date().toISOString(),
    };
    artisans = artisans.map((a) => (a.id === MY_ARTISAN_ID ? updated : a));
    return updated;
  },

  async setOpenStatus(payload: OpenStatusPayload): Promise<ArtisanProfile> {
    await delay();
    const me = findById(artisans, MY_ARTISAN_ID);
    if (!me) throw new MockApiError('Không tìm thấy hồ sơ', 404);
    const updated: ArtisanProfile = { ...me, openStatus: payload.openStatus };
    artisans = artisans.map((a) => (a.id === MY_ARTISAN_ID ? updated : a));
    return updated;
  },

  async updateLocation(payload: LocationPayload): Promise<ArtisanProfile> {
    await delay();
    const me = findById(artisans, MY_ARTISAN_ID);
    if (!me) throw new MockApiError('Không tìm thấy hồ sơ', 404);
    const updated: ArtisanProfile = {
      ...me,
      latitude: payload.lat ?? me.latitude,
      longitude: payload.lng ?? me.longitude,
      address: payload.address ?? me.address,
    };
    artisans = artisans.map((a) => (a.id === MY_ARTISAN_ID ? updated : a));
    return updated;
  },

  async uploadImages(files: File[]): Promise<string[]> {
    await delay();
    return files.map((f) => URL.createObjectURL(f));
  },

  async deleteImage(_imageId: string): Promise<MessageResponse> {
    await delay();
    return { message: 'Deleted successfully' };
  },

  async getById(id: string): Promise<ArtisanProfile | null> {
    await delay();
    return findById(artisans, id) ?? null;
  },

  async listMyOrders(
    params: { page?: number; limit?: number; status?: string } = {}
  ): Promise<PageResponse<Order>> {
    await delay();
    let filtered = mockOrders.filter((o) =>
      o.items.some((it) => it.artisanId === MY_ARTISAN_ID)
    );
    if (params.status) filtered = filtered.filter((o) => o.status === params.status);
    return paginate(filtered, params.page, params.limit);
  },
};
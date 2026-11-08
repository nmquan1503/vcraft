import client from './client';
import { ENDPOINTS } from './endpoints';
import { safeMutation, safeQuery, emptyPage, toFormData } from './_helpers';
import type {
  ArtisanProfile,
  UpdateArtisanPayload,
  LocationPayload,
  OpenStatusPayload,
  MessageResponse,
  PageResponse,
  Order,
} from '../types';

const L = (fn: string) => `artisanApi.${fn}`;

interface ListParams {
  page?: number;
  limit?: number;
  search?: string;
  district?: string;
}

export const artisanApi = {
  list: (params: ListParams = {}): Promise<PageResponse<ArtisanProfile>> =>
    safeQuery<PageResponse<ArtisanProfile>>(
      () => client.get(ENDPOINTS.ARTISAN.LIST, { params }),
      emptyPage<ArtisanProfile>(params.page, params.limit),
      L('list')
    ),

  map: (params: { openOnly?: boolean } = {}): Promise<ArtisanProfile[]> =>
    safeQuery<ArtisanProfile[]>(
      () => client.get(ENDPOINTS.ARTISAN.MAP, { params }),
      [],
      L('map')
    ),

  getMe: (): Promise<ArtisanProfile | null> =>
    safeQuery<ArtisanProfile | null>(
      () => client.get(ENDPOINTS.ARTISAN.ME),
      null,
      L('getMe')
    ),

  updateMe: (payload: UpdateArtisanPayload): Promise<ArtisanProfile> =>
    safeMutation<ArtisanProfile>(
      () => client.put(ENDPOINTS.ARTISAN.ME, payload),
      L('updateMe')
    ),

  setOpenStatus: (payload: OpenStatusPayload): Promise<ArtisanProfile> =>
    safeMutation<ArtisanProfile>(
      () => client.patch(ENDPOINTS.ARTISAN.OPEN_STATUS, payload),
      L('setOpenStatus')
    ),

  updateLocation: (payload: LocationPayload): Promise<ArtisanProfile> =>
    safeMutation<ArtisanProfile>(
      () => client.put(ENDPOINTS.ARTISAN.LOCATION, payload),
      L('updateLocation')
    ),

  uploadImages: (files: File[]): Promise<string[]> =>
    safeMutation<string[]>(
      () => client.post(ENDPOINTS.ARTISAN.IMAGES, toFormData({ files })),
      L('uploadImages')
    ),

  deleteImage: (imageId: string): Promise<MessageResponse> =>
    safeMutation<MessageResponse>(
      () => client.delete(ENDPOINTS.ARTISAN.IMAGE(imageId)),
      L('deleteImage')
    ),

  getById: (id: string): Promise<ArtisanProfile | null> =>
    safeQuery<ArtisanProfile | null>(
      () => client.get(ENDPOINTS.ARTISAN.DETAIL(id)),
      null,
      L('getById')
    ),

  listMyOrders: (
    params: { page?: number; limit?: number; status?: string } = {}
  ): Promise<PageResponse<Order>> =>
    safeQuery<PageResponse<Order>>(
      () => client.get(ENDPOINTS.ARTISAN.ORDERS, { params }),
      emptyPage<Order>(params.page, params.limit),
      L('listMyOrders')
    ),
};
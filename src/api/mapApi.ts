import client from './client';
import { ENDPOINTS } from './endpoints';
import { safeQuery } from './_helpers';
import type { MapPin, MapPinDetail } from '../types';

const L = (fn: string) => `mapApi.${fn}`;

export const mapApi = {
  pins: (params: { openOnly?: boolean } = {}): Promise<MapPin[]> =>
    safeQuery<MapPin[]>(
      () => client.get(ENDPOINTS.MAP.PINS, { params }),
      [],
      L('pins')
    ),

  pinDetail: (id: string): Promise<MapPinDetail | null> =>
    safeQuery<MapPinDetail | null>(
      () => client.get(ENDPOINTS.MAP.PIN(id)),
      null,
      L('pinDetail')
    ),
};
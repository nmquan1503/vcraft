import client from './client';
import { ENDPOINTS } from './endpoints';
import { safeQuery } from './_helpers';
import type { HealthResponse } from '../types';

export const healthApi = {
  check: (): Promise<HealthResponse | null> =>
    safeQuery<HealthResponse | null>(
      () => client.get(ENDPOINTS.HEALTH),
      null,
      'healthApi.check'
    ),
};
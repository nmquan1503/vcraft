import type { HealthResponse } from '@/types';
import { delay } from './helpers';

export const healthApi = {
  async check(): Promise<HealthResponse | null> {
    await delay(50);
    return {
      status: 'UP',
      app: 'vCraft Backend (MOCK)',
      timestamp: new Date().toISOString(),
    };
  },
};
import client from './client';
import { ENDPOINTS } from './endpoints';
import { safeQuery } from './_helpers';
import type { TraceStory, QrInfo } from '../types';

const L = (fn: string) => `traceApi.${fn}`;

export const traceApi = {
  getStory: (batchId: string): Promise<TraceStory | null> =>
    safeQuery<TraceStory | null>(
      () => client.get(ENDPOINTS.TRACE.DETAIL(batchId)),
      null,
      L('getStory')
    ),

  getQr: (batchId: string): Promise<QrInfo | null> =>
    safeQuery<QrInfo | null>(
      () => client.get(ENDPOINTS.QR.GET(batchId)),
      null,
      L('getQr')
    ),
};
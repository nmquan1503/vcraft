import type { TraceStory, QrInfo } from '@/types';
import { mockBatches, mockLogs } from './data/batches';
import { mockArtisans } from './data/artisans';
import { delay, findById } from './helpers';

export const traceApi = {
  async getStory(batchId: string): Promise<TraceStory | null> {
    await delay();
    const batch = findById(mockBatches, batchId);
    if (!batch) return null;
    const artisan = findById(mockArtisans, batch.artisanId);
    if (!artisan) return null;
    return {
      batch,
      artisan,
      logs: mockLogs.filter((l) => l.batchId === batchId),
    };
  },

  async getQr(batchId: string): Promise<QrInfo | null> {
    await delay();
    const batch = findById(mockBatches, batchId);
    if (!batch) return null;
    return {
      batchId: batch.id,
      qrCodeUrl: batch.qrCodeUrl,
      downloadUrl: batch.qrCodeUrl,
    };
  },
};
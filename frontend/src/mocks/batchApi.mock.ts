import type {
  Batch,
  BatchStatus,
  ProductionLog,
  CreateBatchPayload,
  UpdateBatchPayload,
  CreateLogPayload,
  UpdateLogPayload,
  MessageResponse,
  PageResponse,
} from '@/types';
import { mockBatches, mockLogs } from './data/batches';
import { delay, paginate, findById, MockApiError } from './helpers';

interface BatchQuery { page?: number; limit?: number; status?: BatchStatus }

let batches = [...mockBatches];
let logs = [...mockLogs];

export const batchApi = {
  async list(params: BatchQuery = {}): Promise<PageResponse<Batch>> {
    await delay();
    let filtered = batches;
    if (params.status) filtered = filtered.filter((b) => b.status === params.status);
    return paginate(filtered, params.page, params.limit);
  },

  async getById(id: string): Promise<Batch | null> {
    await delay();
    return findById(batches, id) ?? null;
  },

  async create(payload: CreateBatchPayload): Promise<Batch> {
    await delay();
    const id = `batch-${Date.now()}`;
    const batch: Batch = {
      id,
      artisanId: 'artisan-1',
      name: payload.name,
      description: payload.description ?? '',
      quantity: payload.quantity,
      status: 'IN_PROGRESS',
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${id}`,
      qrToken: `token-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    batches = [batch, ...batches];
    return batch;
  },

  async update(id: string, payload: UpdateBatchPayload): Promise<Batch> {
    await delay();
    const batch = findById(batches, id);
    if (!batch) throw new MockApiError('Không tìm thấy lô', 404);
    const updated: Batch = { ...batch, ...payload, updatedAt: new Date().toISOString() };
    batches = batches.map((b) => (b.id === id ? updated : b));
    return updated;
  },

  async regenerateQr(id: string): Promise<Batch> {
    await delay();
    const batch = findById(batches, id);
    if (!batch) throw new MockApiError('Không tìm thấy lô', 404);
    const updated: Batch = {
      ...batch,
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${id}-${Date.now()}`,
      qrToken: `token-${Date.now()}`,
      updatedAt: new Date().toISOString(),
    };
    batches = batches.map((b) => (b.id === id ? updated : b));
    return updated;
  },

  async listLogs(batchId: string): Promise<ProductionLog[]> {
    await delay();
    return logs.filter((l) => l.batchId === batchId);
  },

  async createLog(batchId: string, payload: CreateLogPayload): Promise<ProductionLog> {
    await delay();
    const log: ProductionLog = {
      id: `log-${Date.now()}`,
      batchId,
      stage: payload.stage,
      note: payload.note ?? '',
      images: payload.images ?? [],
      loggedAt: payload.timestamp ?? new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    logs = [...logs, log];
    return log;
  },

  async updateLog(
    batchId: string,
    logId: string,
    payload: UpdateLogPayload
  ): Promise<ProductionLog> {
    await delay();
    const log = logs.find((l) => l.id === logId && l.batchId === batchId);
    if (!log) throw new MockApiError('Không tìm thấy mốc nhật ký', 404);
    const updated: ProductionLog = { ...log, ...payload };
    logs = logs.map((l) => (l.id === logId ? updated : l));
    return updated;
  },

  async deleteLog(batchId: string, logId: string): Promise<MessageResponse> {
    await delay();
    logs = logs.filter((l) => !(l.id === logId && l.batchId === batchId));
    return { message: 'Deleted log entry successfully' };
  },

  async uploadLogImages(
    _batchId: string,
    _logId: string,
    files: File[]
  ): Promise<string[]> {
    await delay();
    return files.map((f) => URL.createObjectURL(f));
  },
};
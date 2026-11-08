import client from './client';
import { ENDPOINTS } from './endpoints';
import { safeMutation, safeQuery, emptyPage, toFormData } from './_helpers';
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
} from '../types';

const L = (fn: string) => `batchApi.${fn}`;

interface BatchQuery {
  page?: number;
  limit?: number;
  status?: BatchStatus;
}

export const batchApi = {
  list: (params: BatchQuery = {}): Promise<PageResponse<Batch>> =>
    safeQuery<PageResponse<Batch>>(
      () => client.get(ENDPOINTS.BATCH.LIST, { params }),
      emptyPage<Batch>(params.page, params.limit),
      L('list')
    ),

  getById: (id: string): Promise<Batch | null> =>
    safeQuery<Batch | null>(
      () => client.get(ENDPOINTS.BATCH.DETAIL(id)),
      null,
      L('getById')
    ),

  create: (payload: CreateBatchPayload): Promise<Batch> =>
    safeMutation<Batch>(
      () => client.post(ENDPOINTS.BATCH.CREATE, payload),
      L('create')
    ),

  update: (id: string, payload: UpdateBatchPayload): Promise<Batch> =>
    safeMutation<Batch>(
      () => client.put(ENDPOINTS.BATCH.UPDATE(id), payload),
      L('update')
    ),

  regenerateQr: (id: string): Promise<Batch> =>
    safeMutation<Batch>(
      () => client.post(ENDPOINTS.BATCH.REGEN_QR(id)),
      L('regenerateQr')
    ),

  listLogs: (batchId: string): Promise<ProductionLog[]> =>
    safeQuery<ProductionLog[]>(
      () => client.get(ENDPOINTS.BATCH.LOGS(batchId)),
      [],
      L('listLogs')
    ),

  createLog: (batchId: string, payload: CreateLogPayload): Promise<ProductionLog> =>
    safeMutation<ProductionLog>(
      () => client.post(ENDPOINTS.BATCH.LOGS(batchId), payload),
      L('createLog')
    ),

  updateLog: (
    batchId: string,
    logId: string,
    payload: UpdateLogPayload
  ): Promise<ProductionLog> =>
    safeMutation<ProductionLog>(
      () => client.put(ENDPOINTS.BATCH.LOG(batchId, logId), payload),
      L('updateLog')
    ),

  deleteLog: (batchId: string, logId: string): Promise<MessageResponse> =>
    safeMutation<MessageResponse>(
      () => client.delete(ENDPOINTS.BATCH.LOG(batchId, logId)),
      L('deleteLog')
    ),

  uploadLogImages: (
    batchId: string,
    logId: string,
    files: File[]
  ): Promise<string[]> =>
    safeMutation<string[]>(
      () =>
        client.post(
          ENDPOINTS.BATCH.LOG_IMAGES(batchId, logId),
          toFormData({ files })
        ),
      L('uploadLogImages')
    ),
};
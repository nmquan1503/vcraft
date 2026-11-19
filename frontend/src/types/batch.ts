import type { BatchStatus } from './enums';

export interface Batch {
  id: string;
  artisanId: string;
  name: string;
  description: string;
  quantity: number;
  status: BatchStatus;
  qrCodeUrl: string;
  qrToken: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductionLog {
  id: string;
  batchId: string;
  stage: string;
  note: string;
  images: string[];
  loggedAt: string;
  createdAt: string;
}

export interface CreateBatchPayload {
  name: string;
  description?: string;
  quantity: number;
  productIds?: string[];
}

export interface UpdateBatchPayload {
  name?: string;
  description?: string;
  status?: BatchStatus;
}

export interface CreateLogPayload {
  stage: string;
  note?: string;
  images?: string[];
  timestamp?: string;
}

export interface UpdateLogPayload {
  note?: string;
  images?: string[];
}
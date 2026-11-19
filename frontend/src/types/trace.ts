import type { Product } from './product';
import type { ArtisanProfile } from './artisan';
import type { Batch, ProductionLog } from './batch';

export interface TraceStory {
  batch: Batch;
  artisan: ArtisanProfile;
  logs: ProductionLog[];
  products?: Product[];
}

export interface QrInfo {
  batchId: string;
  qrCodeUrl: string;
  downloadUrl: string;
}
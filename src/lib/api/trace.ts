import apiClient from "@/lib/apiClient";

export interface BatchLog {
  id: string;
  stage: string;
  description: string;
  imageUrls: string[];
  loggedAt: string;
}

export interface TraceInfo {
  batchId: string;
  batchCode: string;
  productName: string;
  artisanName: string;
  workshopName: string;
  startDate: string;
  status: string;
  logs: BatchLog[];
}

export const traceApi = {
  getTrace: (batchId: string) =>
    apiClient.get<TraceInfo>(`/trace/${batchId}`).then((r) => r.data),

  getQr: (batchId: string) =>
    apiClient.get(`/qr/${batchId}`, { responseType: "blob" }).then((r) => r.data),
};

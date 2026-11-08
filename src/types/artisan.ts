import type { ArtisanStatus } from './enums';

export interface ArtisanProfile {
  id: string;
  userId: string;
  workshopName: string;
  ownerName: string;
  phone: string;
  address: string;
  district: string;
  latitude: number | null;
  longitude: number | null;
  openStatus: boolean;
  description: string;
  familyHistory: string;
  certificates: string[];
  images: string[];
  status: ArtisanStatus;
  rejectReason: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateArtisanPayload {
  workshopName?: string;
  description?: string;
  address?: string;
  lat?: number;
  lng?: number;
  openStatus?: boolean;
  images?: string[];
  familyHistory?: string;
  certificates?: string[];
}

export interface LocationPayload {
  lat?: number;
  lng?: number;
  address?: string;
}

export interface OpenStatusPayload {
  openStatus: boolean;
}
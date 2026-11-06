import apiClient from "@/lib/apiClient";

export interface MapPin {
  artisanId: string;
  workshopName: string;
  lat: number;
  lng: number;
  isOpen: boolean;
}

export interface MapPopup {
  artisanId: string;
  workshopName: string;
  ownerName: string;
  address: string;
  phone?: string;
  avatarUrl?: string;
  isOpen: boolean;
  rating: number;
  productCount: number;
}

export const mapApi = {
  getPins: () =>
    apiClient.get<MapPin[]>("/map/pins").then((r) => r.data),

  getPopup: (artisanId: string) =>
    apiClient.get<MapPopup>(`/map/popup/${artisanId}`).then((r) => r.data),
};

export interface MapPin {
  id: string;
  name: string;
  lat: number | null;
  lng: number | null;
  openStatus: boolean;
  thumbnail: string | null;
  phone: string;
}

export interface MapPinDetail {
  id: string;
  name: string;
  ownerName: string;
  address: string;
  openStatus: boolean;
  phone: string;
  rating: number;
  productCount: number;
  description: string;
}
export type Role = 'BUYER' | 'ARTISAN' | 'ADMIN';

export type UserStatus = 'ACTIVE' | 'BLOCKED';

export type ArtisanStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'BLOCKED';

export type BatchStatus = 'IN_PROGRESS' | 'COMPLETED';

export type BidStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export type NewsType = 'PRICE' | 'SCHEDULE' | 'POLICY';

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'SHIPPING'
  | 'DELIVERED'
  | 'CANCELLED';

export type QuoteStatus =
  | 'DRAFT'
  | 'SENT'
  | 'BIDDING'
  | 'ACCEPTED'
  | 'IN_PRODUCTION'
  | 'DELIVERED'
  | 'CLOSED';
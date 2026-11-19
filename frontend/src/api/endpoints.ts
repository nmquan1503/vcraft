export const ENDPOINTS = {
  HEALTH: '/health',

  AUTH: {
    REGISTER_BUYER: '/auth/register/buyer',
    REGISTER_ARTISAN: '/auth/register/artisan',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh-token',
    ME: '/auth/me',
    CHANGE_PASSWORD: '/auth/change-password',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },

  ARTISAN: {
    LIST: '/artisans',
    MAP: '/artisans/map',
    ME: '/artisans/me',
    OPEN_STATUS: '/artisans/me/open-status',
    LOCATION: '/artisans/me/location',
    IMAGES: '/artisans/me/images',
    IMAGE: (id: string) => `/artisans/me/images/${id}`,
    DETAIL: (id: string) => `/artisans/${id}`,
    ORDERS: '/artisans/me/orders',
    REVIEWS: (id: string) => `/artisans/${id}/reviews`,
  },

  PRODUCT: {
    LIST: '/products',
    CREATE: '/products',
    DETAIL: (id: string) => `/products/${id}`,
    UPDATE: (id: string) => `/products/${id}`,
    DELETE: (id: string) => `/products/${id}`,
    IMAGES: (id: string) => `/products/${id}/images`,
    REVIEWS: (id: string) => `/products/${id}/reviews`,
    REVIEW: (id: string, reviewId: string) =>
      `/products/${id}/reviews/${reviewId}`,
  },

  BATCH: {
    LIST: '/batches',
    CREATE: '/batches',
    DETAIL: (id: string) => `/batches/${id}`,
    UPDATE: (id: string) => `/batches/${id}`,
    REGEN_QR: (id: string) => `/batches/${id}/regenerate-qr`,
    LOGS: (id: string) => `/batches/${id}/logs`,
    LOG: (id: string, logId: string) => `/batches/${id}/logs/${logId}`,
    LOG_IMAGES: (id: string, logId: string) =>
      `/batches/${id}/logs/${logId}/images`,
  },

  QUOTE: {
    LIST: '/quotes',
    CREATE: '/quotes',
    DETAIL: (id: string) => `/quotes/${id}`,
    UPDATE: (id: string) => `/quotes/${id}`,
    SUBMIT: (id: string) => `/quotes/${id}/submit`,
    DELETE: (id: string) => `/quotes/${id}`,
    ARTISAN_INCOMING: '/quotes/artisan/incoming',
    BIDS: (id: string) => `/quotes/${id}/bids`,
    BID: (id: string, bidId: string) => `/quotes/${id}/bids/${bidId}`,
    ACCEPT_BID: (id: string, bidId: string) =>
      `/quotes/${id}/bids/${bidId}/accept`,
    REJECT_BID: (id: string, bidId: string) =>
      `/quotes/${id}/bids/${bidId}/reject`,
    COMPLETE: (id: string) => `/quotes/${id}/complete`,
    CONFIRM_DELIVERY: (id: string) => `/quotes/${id}/confirm-delivery`,
  },

  ORDER: {
    LIST: '/orders',
    CREATE: '/orders',
    DETAIL: (id: string) => `/orders/${id}`,
    CANCEL: (id: string) => `/orders/${id}/cancel`,
    UPDATE_STATUS: (id: string) => `/orders/${id}/status`,
  },

  CART: {
    GET: '/cart',
    CLEAR: '/cart',
    ADD_ITEM: '/cart/items',
    UPDATE_ITEM: (id: string) => `/cart/items/${id}`,
    DELETE_ITEM: (id: string) => `/cart/items/${id}`,
  },

  CATEGORY: {
    LIST: '/categories',
    CREATE: '/categories',
    UPDATE: (id: string) => `/categories/${id}`,
    DELETE: (id: string) => `/categories/${id}`,
  },

  MAP: {
    PINS: '/map/pins',
    PIN: (id: string) => `/map/pins/${id}`,
  },

  NEWS: {
    LIST: '/news',
    CREATE: '/news',
    DETAIL: (id: string) => `/news/${id}`,
    UPDATE: (id: string) => `/news/${id}`,
    DELETE: (id: string) => `/news/${id}`,
  },

  TRACE: {
    DETAIL: (batchId: string) => `/trace/${batchId}`,
  },

  QR: {
    GET: (batchId: string) => `/qr/${batchId}`,
  },

  ADMIN: {
    ARTISANS_PENDING: '/admin/artisans/pending',
    ARTISAN_APPROVE: (id: string) => `/admin/artisans/${id}/approve`,
    ARTISAN_REJECT: (id: string) => `/admin/artisans/${id}/reject`,
    ARTISAN_BLOCK: (id: string) => `/admin/artisans/${id}/block`,
    USERS: '/admin/users',
    USER_BLOCK: (id: string) => `/admin/users/${id}/block`,
    QUOTES: '/admin/quotes',
    STATS: '/admin/stats',
  },
} as const;
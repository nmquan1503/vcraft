import { healthApi as realHealthApi } from './healthApi';
import { authApi as realAuthApi } from './authApi';
import { artisanApi as realArtisanApi } from './artisanApi';
import { productApi as realProductApi } from './productApi';
import { batchApi as realBatchApi } from './batchApi';
import { quoteApi as realQuoteApi } from './quoteApi';
import { orderApi as realOrderApi } from './orderApi';
import { cartApi as realCartApi } from './cartApi';
import { categoryApi as realCategoryApi } from './categoryApi';
import { mapApi as realMapApi } from './mapApi';
import { newsApi as realNewsApi } from './newsApi';
import { traceApi as realTraceApi } from './traceApi';
import { reviewApi as realReviewApi } from './reviewApi';
import { adminApi as realAdminApi } from './adminApi';

import { healthApi as mockHealthApi } from '@/mocks/healthApi.mock';
import { authApi as mockAuthApi } from '@/mocks/authApi.mock';
import { artisanApi as mockArtisanApi } from '@/mocks/artisanApi.mock';
import { productApi as mockProductApi } from '@/mocks/productApi.mock';
import { batchApi as mockBatchApi } from '@/mocks/batchApi.mock';
import { quoteApi as mockQuoteApi } from '@/mocks/quoteApi.mock';
import { orderApi as mockOrderApi } from '@/mocks/orderApi.mock';
import { cartApi as mockCartApi } from '@/mocks/cartApi.mock';
import { categoryApi as mockCategoryApi } from '@/mocks/categoryApi.mock';
import { mapApi as mockMapApi } from '@/mocks/mapApi.mock';
import { newsApi as mockNewsApi } from '@/mocks/newsApi.mock';
import { traceApi as mockTraceApi } from '@/mocks/traceApi.mock';
import { reviewApi as mockReviewApi } from '@/mocks/reviewApi.mock';
import { adminApi as mockAdminApi } from '@/mocks/adminApi.mock';

export const USE_MOCK =
  import.meta.env.DEV && import.meta.env.VITE_USE_MOCK === 'true';

export const healthApi = USE_MOCK ? mockHealthApi : realHealthApi;
export const authApi = USE_MOCK ? mockAuthApi : realAuthApi;
export const artisanApi = USE_MOCK ? mockArtisanApi : realArtisanApi;
export const productApi = USE_MOCK ? mockProductApi : realProductApi;
export const batchApi = USE_MOCK ? mockBatchApi : realBatchApi;
export const quoteApi = USE_MOCK ? mockQuoteApi : realQuoteApi;
export const orderApi = USE_MOCK ? mockOrderApi : realOrderApi;
export const cartApi = USE_MOCK ? mockCartApi : realCartApi;
export const categoryApi = USE_MOCK ? mockCategoryApi : realCategoryApi;
export const mapApi = USE_MOCK ? mockMapApi : realMapApi;
export const newsApi = USE_MOCK ? mockNewsApi : realNewsApi;
export const traceApi = USE_MOCK ? mockTraceApi : realTraceApi;
export const reviewApi = USE_MOCK ? mockReviewApi : realReviewApi;
export const adminApi = USE_MOCK ? mockAdminApi : realAdminApi;

export { default as client } from './client';
export { ENDPOINTS } from './endpoints';
export {
  ApiError,
  isApiError,
  toApiError,
  emptyPage,
  messageResult,
  toFormData,
  safeQuery,
  safeMutation,
} from './_helpers';
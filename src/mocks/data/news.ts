import type { News } from '@/types';

export const mockNews: News[] = [
  {
    id: 'news-1',
    authorId: 'user-admin-1',
    title: 'Thông báo giá đất sét trắng tháng 2/2026',
    content:
      'Giá đất sét trắng tăng 5% so với tháng trước. Các hộ gia đình lưu ý kế hoạch nhập nguyên liệu.',
    type: 'PRICE',
    images: [],
    publishedAt: '2026-02-01T08:00:00Z',
    createdAt: '2026-02-01T08:00:00Z',
    updatedAt: '2026-02-01T08:00:00Z',
  },
  {
    id: 'news-2',
    authorId: 'user-admin-1',
    title: 'Lịch cúp điện khu vực xóm 3-5 ngày 15/2',
    content:
      'Điện lực Gia Lâm bảo trì lưới, cúp điện từ 8h-16h ngày 15/2/2026.',
    type: 'SCHEDULE',
    images: [],
    publishedAt: '2026-02-10T08:00:00Z',
    createdAt: '2026-02-10T08:00:00Z',
    updatedAt: '2026-02-10T08:00:00Z',
  },
  {
    id: 'news-3',
    authorId: 'user-admin-1',
    title: 'Chính sách hỗ trợ hộ nghề mới năm 2026',
    content:
      'UBND xã hỗ trợ 30 triệu đồng cho hộ mở xưởng mới, liên hệ BQL để biết chi tiết.',
    type: 'POLICY',
    images: [],
    publishedAt: '2026-01-15T08:00:00Z',
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-01-15T08:00:00Z',
  },
];
import type { Category } from '@/types';

export const mockCategories: Category[] = [
  {
    id: 'cat-1',
    name: 'Ấm chén',
    description: 'Ấm tử sa, chén men lam truyền thống',
    icon: 'tea',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-2',
    name: 'Bình hoa',
    description: 'Bình tỳ bà, lọ hoa men rạn',
    icon: 'flower',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-3',
    name: 'Bát đĩa',
    description: 'Bát đĩa ăn và đĩa trang trí',
    icon: 'plate',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-4',
    name: 'Tượng & linh vật',
    description: 'Tượng nghệ thuật và linh vật phong thủy',
    icon: 'statue',
    createdAt: '2024-01-01T00:00:00Z',
  },
];
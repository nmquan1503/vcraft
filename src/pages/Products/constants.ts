export const SORT_OPTIONS = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'price_asc', label: 'Giá thấp → cao' },
  { value: 'price_desc', label: 'Giá cao → thấp' },
  { value: 'name_asc', label: 'Tên A → Z' },
];

// 1 featured + 12 regular = 2 block × 6 items
// → tablet (2 col): 3 rows × 2 = fill đẹp
// → desktop (3 col): 2 rows × 3 = fill đẹp
export const PAGE_SIZE = 13;
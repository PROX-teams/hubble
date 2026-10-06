import { CategoryType } from '@/shared/types';

export const CATEGORIES: { id: CategoryType; label: string }[] = [
  { id: 'DEVELOPMENT', label: '개발' },
  { id: 'DESIGN', label: '디자인' },
  { id: 'PLANNING', label: '기획' },
  { id: 'MARKETING', label: '마케팅' },
  { id: 'LIFE', label: '일상' },
  { id: 'OTHER', label: '기타' },
];

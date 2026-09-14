import { CategoryType } from '@/shared/types';

export const CATEGORIES: { id: CategoryType; label: string }[] = [
  { id: 'DEVELOPMENT', label: '개발' },
  { id: 'DESIGN', label: '디자인' },
  { id: 'PLANNING', label: '기획' },
  { id: 'MARKETING', label: '마케팅' },
  { id: 'LIFE', label: '일상' },
  { id: 'OTHER', label: '기타' },
];

export const MOCK_STORIES = [
  { id: 1, title: '프론트엔드 공부집' },
  { id: 2, title: '리액트 마스터' },
  { id: 3, title: 'CS 기초 지식' },
];

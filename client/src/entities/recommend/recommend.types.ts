import type { Note } from '@/entities/note/note.types';

/**
 * 인기 크리에이터 인터페이스
 */
export interface TrendingCreator {
  userId: number;
  name: string;
  imageUrl?: string;
  introduction?: string;
  noteCount: number;
  totalLikes: number;
}

/**
 * 메인페이지 추천 API 응답 인터페이스
 */
export interface MainRecommendResponse {
  mostLovedNotes: Note[];
  discoverNotes: Note[];
  creators: TrendingCreator[];
}

import { fetcher } from '@/shared/api/base';
import { API_ENDPOINTS } from '@/shared/api/constants';
import type { MainRecommendResponse, TrendingCreator } from '../recommend.types';
import type { Note } from '@/entities/note/note.types';
import type { Story } from '@/entities/story/story.types';

/**
 * 메인페이지 통합 추천 데이터 조회
 */
export const getMainRecommendations = async (): Promise<MainRecommendResponse> => {
  return fetcher<MainRecommendResponse>(API_ENDPOINTS.RECOMMEND.ALL);
};

/**
 * 1. Most Loved (전체 누적 인기 노트 12개) 독립 조회
 */
export const getMostLovedNotes = async (): Promise<Note[]> => {
  return fetcher<Note[]>(API_ENDPOINTS.RECOMMEND.MOST_LOVED);
};

/**
 * 2. Discover (최근 14일 트렌딩 탐색 노트 16개) 독립 조회
 */
export const getDiscoverNotes = async (): Promise<Note[]> => {
  return fetcher<Note[]>(API_ENDPOINTS.RECOMMEND.DISCOVER);
};

/**
 * 3. Trending Creators (인기 크리에이터 5명) 독립 조회
 */
export const getTrendingCreators = async (): Promise<TrendingCreator[]> => {
  return fetcher<TrendingCreator[]>(API_ENDPOINTS.RECOMMEND.CREATORS);
};

/**
 * 4. Trending Stories (인기 스토리 12개) 독립 조회
 */
export const getPopularStories = async (): Promise<Story[]> => {
  return fetcher<Story[]>(API_ENDPOINTS.RECOMMEND.STORIES);
};

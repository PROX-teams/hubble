import { fetcher } from '@/shared/api/base';
import { API_ENDPOINTS } from '@/shared/api/constants';
import type { MainRecommendResponse } from '../recommend.types';

/**
 * 메인페이지 추천 데이터 (Most Loved 12개, Discover 16개, Creators 5명) 조회
 */
export const getMainRecommendations = async (): Promise<MainRecommendResponse> => {
  return fetcher<MainRecommendResponse>(API_ENDPOINTS.RECOMMEND);
};

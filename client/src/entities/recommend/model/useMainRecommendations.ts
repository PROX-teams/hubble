import { useQuery } from '@tanstack/react-query';
import { getMainRecommendations } from '../api/recommend.api';

/**
 * 메인페이지 추천 데이터 조회를 담당하는 TanStack Query 훅
 */
export const useMainRecommendations = () => {
  return useQuery({
    queryKey: ['mainRecommendations'],
    queryFn: getMainRecommendations,
    staleTime: 1000 * 60 * 5, // 5분 캐시
    gcTime: 1000 * 60 * 30,
  });
};

import { useQuery } from '@tanstack/react-query';
import { CategoryType } from '@/shared/types';
import { getGraphData } from './graph.api';
import { GraphResponse } from '../model/graph.types';

/**
 * 카테고리별 노드 그래프 데이터를 조회하는 TanStack Query 훅
 */
export function useGraphQuery(category: CategoryType = 'DEVELOPMENT') {
  return useQuery<GraphResponse>({
    queryKey: ['node-graph', category],
    queryFn: () => getGraphData(category),
    staleTime: 1000 * 60 * 5, // 5분간 캐시 유지 (카테고리 탭 전환 시 0ms 즉각 반응)
    refetchOnWindowFocus: false,
  });
}

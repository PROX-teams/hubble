import { fetcher } from '@/shared/api/base';
import { API_ENDPOINTS } from '@/shared/api/constants';
import { CategoryType } from '@/shared/types';
import { GraphExpansionResponse, GraphResponse } from '../model/graph.types';

/**
 * 카테고리별 탐색 시작점과 대표 태그 조회
 */
export const getGraphData = async (category: CategoryType = 'DEVELOPMENT'): Promise<GraphResponse> => {
  return fetcher<GraphResponse>(`${API_ENDPOINTS.GRAPH}?category=${category}`);
};

export const getGraphNeighbors = async (
  category: CategoryType,
  tagName: string,
  excludedTagNames: string[],
  limit = 6
): Promise<GraphExpansionResponse> => {
  const params = new URLSearchParams({ category, tagName, limit: String(limit) });
  excludedTagNames.forEach((name) => params.append('exclude', name));
  return fetcher<GraphExpansionResponse>(`${API_ENDPOINTS.GRAPH}/neighbors?${params.toString()}`);
};

import { fetcher } from '@/shared/api/base';
import { API_ENDPOINTS } from '@/shared/api/constants';
import type { SearchResponse, GetSearchParams } from '../search.types';

/**
 * 통합 검색 API 호출 (태그 목록, 스토리 Slice, 노트 Slice)
 */
export const getIntegratedSearch = async (
  params: GetSearchParams = {}
): Promise<SearchResponse> => {
  const { keyword, page = 0, size = 10 } = params;

  const queryParams = new URLSearchParams({
    page: String(page),
    size: String(size),
    ...(keyword && keyword.trim().length > 0 && { keyword: keyword.trim() }),
  });

  return fetcher<SearchResponse>(`${API_ENDPOINTS.SEARCH}?${queryParams.toString()}`);
};

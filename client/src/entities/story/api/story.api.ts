import { fetcher } from '@/shared/api/base';
import { API_ENDPOINTS } from '@/shared/api/constants';
import type { PageResponse, CategoryType, SortType } from '@/shared/types/api.types';
import type { Story } from '../story.types';

export interface GetStoriesParams {
  category?: CategoryType;
  keyword?: string;
  sortType?: SortType;
  page?: number;
  size?: number;
}

/**
 * 스토리 목록 조회 (무한 스크롤 및 필터링)
 */
export const getStories = async (params: GetStoriesParams): Promise<PageResponse<Story>> => {
  const queryParams = new URLSearchParams();
  
  if (params.category) queryParams.append('category', params.category);
  if (params.keyword) queryParams.append('keyword', params.keyword);
  if (params.page !== undefined) queryParams.append('page', params.page.toString());
  if (params.size !== undefined) queryParams.append('size', params.size.toString());

  // 정렬 파라미터 변환
  if (params.sortType) {
    switch (params.sortType) {
      case 'mostLiked':
        queryParams.append('sort', 'likeCount,desc');
        break;
      case 'mostViewed':
        // 스토리에도 viewCount가 있다면 사용, 없다면 다른 기준 고려
        queryParams.append('sort', 'viewCount,desc');
        break;
      case 'latest':
      default:
        queryParams.append('sort', 'createdAt,desc');
        break;
    }
  }

  const queryString = queryParams.toString();
  const url = queryString ? `${API_ENDPOINTS.STORY}?${queryString}` : API_ENDPOINTS.STORY;

  return fetcher<PageResponse<Story>>(url);
};

/**
 * 단일 스토리 상세 조회
 */
export const getStoryDetail = async (id: number): Promise<Story> => {
  return fetcher<Story>(`${API_ENDPOINTS.STORY}/${id}`);
};

/**
 * 내 스토리 목록 조회 (로그인한 사용자가 작성한 스토리)
 */
export const getMyStories = async (page = 0, size = 50): Promise<PageResponse<Story>> => {
  return fetcher<PageResponse<Story>>(`${API_ENDPOINTS.STORY}/me?page=${page}&size=${size}`);
};

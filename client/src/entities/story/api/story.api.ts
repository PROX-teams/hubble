import { fetcher } from '@/shared/api/base';
import { API_ENDPOINTS } from '@/shared/api/constants';
import type { PageResponse, CategoryType, SortType } from '@/shared/types';
import type { Story, StoryCreateRequest } from '../story.types';

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
 * 새로운 스토리 생성
 */
export const createStory = async (data: StoryCreateRequest): Promise<Story> => {
  return fetcher<Story>(API_ENDPOINTS.STORY, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

/**
 * 스토리 수정
 */
export const updateStory = async (
  storyId: number,
  data: StoryCreateRequest
): Promise<Story> => {
  return fetcher<Story>(`${API_ENDPOINTS.STORY}/${storyId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

/**
 * 스토리 삭제
 */
export const deleteStory = async (storyId: number): Promise<void> => {
  return fetcher<void>(`${API_ENDPOINTS.STORY}/${storyId}`, {
    method: 'DELETE',
  });
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

/**
 * 좋아요 많은 스토리 Top 10 조회
 */
export const getTop10LikedStories = async (): Promise<Story[]> => {
  return fetcher<Story[]>(`${API_ENDPOINTS.STORY}/top10`);
};

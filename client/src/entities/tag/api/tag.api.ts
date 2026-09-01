import { fetcher } from '@/shared/api/base';
import { API_ENDPOINTS } from '@/shared/api/constants';
import type { TagCount } from '../tag.types';

/**
 * 사용자의 태그별 게시글 수 통계 조회 (userId 미전달 시 본인 태그 조회)
 */
export const getTags = async (userId?: number): Promise<TagCount[]> => {
  const url = userId
    ? `${API_ENDPOINTS.NOTE}/user/${userId}/tags`
    : `${API_ENDPOINTS.NOTE}/me/tags`;

  return fetcher<TagCount[]>(url);
};

export const getMyTags = getTags;

import { fetcher } from '@/shared/api/base';
import { API_ENDPOINTS } from '@/shared/api/constants';
import type { PageResponse, CategoryType, SortType } from '@/shared/types/api.types';
import type { Note, NoteCreateRequest } from '../note.types';

export interface GetNotesParams {
  category?: CategoryType;
  tagName?: string;
  keyword?: string;
  sortType?: SortType;
  page?: number;
  size?: number;
}

/**
 * 노트 목록 조회 (무한 스크롤 및 필터링)
 */
export const getNotes = async (params: GetNotesParams): Promise<PageResponse<Note>> => {
  const queryParams = new URLSearchParams();
  
  if (params.category) queryParams.append('category', params.category);
  if (params.tagName) queryParams.append('tagName', params.tagName);
  if (params.keyword) queryParams.append('keyword', params.keyword);
  if (params.page !== undefined) queryParams.append('page', params.page.toString());
  if (params.size !== undefined) queryParams.append('size', params.size.toString());

  // 정렬 파라미터 변환 (Spring Data JPA의 sort=field,direction 형식에 맞춤)
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
  const url = queryString ? `${API_ENDPOINTS.NOTE}?${queryString}` : API_ENDPOINTS.NOTE;

  return fetcher<PageResponse<Note>>(url);
};

/**
 * 새 노트 생성
 */
export const createNote = async (data: NoteCreateRequest): Promise<Note> => {
  return fetcher<Note>(API_ENDPOINTS.NOTE, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

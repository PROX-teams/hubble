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
 * 단일 노트 상세 정보 조회
 */
export const getNoteDetail = async (id: number): Promise<Note> => {
  return fetcher<Note>(`${API_ENDPOINTS.NOTE}/${id}`);
};

/**
 * 북마크한 노트 목록 조회
 */
export const getBookmarkedNotes = async (page = 0, size = 10): Promise<PageResponse<Note>> => {
  return fetcher<PageResponse<Note>>(`${API_ENDPOINTS.NOTE}/bookmarks?page=${page}&size=${size}`);
};

/**
 * 내 노트 목록 조회
 */
export const getMyNotes = async (page = 0, size = 50): Promise<PageResponse<Note>> => {
  return fetcher<PageResponse<Note>>(`${API_ENDPOINTS.NOTE}/me?page=${page}&size=${size}`);
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

/**
 * 조회수 많은 노트 Top 10 조회
 */
export const getTop10ViewedNotes = async (): Promise<Note[]> => {
  return fetcher<Note[]>(`${API_ENDPOINTS.NOTE}/top10/view`);
};

/**
 * 좋아요 많은 노트 Top 10 조회
 */
export const getTop10LikedNotes = async (): Promise<Note[]> => {
  return fetcher<Note[]>(`${API_ENDPOINTS.NOTE}/top10/like`);
};

/**
 * 노트 좋아요 토글
 */
export const toggleLikeNote = async (id: number): Promise<void> => {
  return fetcher<void>(`${API_ENDPOINTS.NOTE}/${id}/like`, {
    method: 'POST',
  });
};

/**
 * 노트 북마크 토글
 */
export const toggleBookmarkNote = async (id: number): Promise<void> => {
  return fetcher<void>(`${API_ENDPOINTS.NOTE}/${id}/bookmark`, {
    method: 'POST',
  });
};

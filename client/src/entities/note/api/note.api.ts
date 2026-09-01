import { fetcher } from '@/shared/api/base';
import { API_ENDPOINTS } from '@/shared/api/constants';
import type { PageResponse, SliceResponse, CategoryType, SortType } from '@/shared/types';
import type {
  Note,
  NoteCreateRequest,
  GetNotebookNotesParams,
  NoteHistoryItem,
  GetRecentUpdatesParams,
} from '../note.types';

export interface GetNotesParams {
  category?: CategoryType;
  tagName?: string;
  keyword?: string;
  sortType?: SortType;
  page?: number;
  size?: number;
}

const SORT_PARAM_MAP: Record<SortType, string> = {
  mostLiked: 'likeCount,desc',
  mostViewed: 'viewCount,desc',
  latest: 'createdAt,desc',
};

/**
 * 전체 노트 목록 조회 (무한 스크롤 및 필터링)
 */
export const getNotes = async (params: GetNotesParams = {}): Promise<PageResponse<Note>> => {
  const { category, tagName, keyword, sortType, page = 0, size = 10 } = params;

  const queryParams = new URLSearchParams({
    page: String(page),
    size: String(size),
    ...(category && { category }),
    ...(tagName && { tagName }),
    ...(keyword && { keyword }),
    ...(sortType && { sort: SORT_PARAM_MAP[sortType] }),
  });

  return fetcher<PageResponse<Note>>(`${API_ENDPOINTS.NOTE}?${queryParams.toString()}`);
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
  const queryParams = new URLSearchParams({ page: String(page), size: String(size) });
  return fetcher<PageResponse<Note>>(`${API_ENDPOINTS.NOTE}/bookmarks?${queryParams.toString()}`);
};

/**
 * 사용자별 노트북 목록 조회 (userId 전달 시 특정 유저, 미전달 시 본인 노트 조회)
 */
export const getNotebookNotes = async (
  params: GetNotebookNotesParams = {}
): Promise<PageResponse<Note>> => {
  const { userId, tagName, sortType, page = 0, size = 12 } = params;

  const queryParams = new URLSearchParams({
    page: String(page),
    size: String(size),
    ...(tagName && { tagName }),
    ...(sortType && { sort: SORT_PARAM_MAP[sortType] }),
  });

  const baseUrl = userId ? `${API_ENDPOINTS.NOTE}/user/${userId}` : `${API_ENDPOINTS.NOTE}/me`;
  return fetcher<PageResponse<Note>>(`${baseUrl}?${queryParams.toString()}`);
};

export const getMyNotes = getNotebookNotes;

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
 * 기존 노트 수정
 */
export const updateNote = async (
  id: number,
  data: NoteCreateRequest
): Promise<Note> => {
  return fetcher<Note>(`${API_ENDPOINTS.NOTE}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

/**
 * 노트 삭제
 */
export const deleteNote = async (id: number): Promise<void> => {
  return fetcher<void>(`${API_ENDPOINTS.NOTE}/${id}`, {
    method: 'DELETE',
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

/**
 * 로그인 사용자의 최근 수정 노트 이력 조회 (Slice 무한스크롤)
 */
export const getRecentUpdates = async (
  params: GetRecentUpdatesParams = {}
): Promise<SliceResponse<NoteHistoryItem>> => {
  const { page = 0, size = 10 } = params;
  const queryParams = new URLSearchParams({
    page: String(page),
    size: String(size),
  });

  return fetcher<SliceResponse<NoteHistoryItem>>(
    `${API_ENDPOINTS.NOTE}/me/recent-updates?${queryParams.toString()}`
  );
};

import { queryOptions } from '@tanstack/react-query';
import {
  getNoteDetail,
  getNotebookNotes,
  getBookmarkedNotes,
} from '../api/note.api';
import type { GetNotebookNotesParams } from '../note.types';

/**
 * 노트 도메인 Query Key Factory & Query Options
 * - 쿼리 키 계층화(Hierarchy)를 통한 정밀한 캐시 무효화 및 일괄 갱신 지원
 * - queryKey, queryFn, staleTime 캐시 정책의 단일 진실 공급원(SSOT) 구축
 * - queryOptions 활용으로 반환 타입 자동 추론 및 서버/클라이언트 키 불일치 방지
 */
export const noteQueries = {
  all: ['notes'] as const,

  // 목록 계층 (My Note, User Note)
  lists: () => [...noteQueries.all, 'list'] as const,
  list: (params: GetNotebookNotesParams = {}) =>
    queryOptions({
      queryKey: [...noteQueries.lists(), { userId: params.userId ?? 'me', ...params }],
      queryFn: () => getNotebookNotes(params),
      staleTime: 1000 * 60 * 3, // 3분 캐시
    }),

  // 상세 계층 (단일 노트 뷰어 / 에디터 초기화)
  details: () => [...noteQueries.all, 'detail'] as const,
  detail: (noteId: number | null) =>
    queryOptions({
      queryKey: [...noteQueries.details(), noteId],
      queryFn: () => getNoteDetail(noteId!),
      enabled: Boolean(noteId),
      staleTime: 1000 * 60 * 5, // 5분 캐시
    }),

  // 북마크 계층
  bookmarks: () => [...noteQueries.all, 'bookmarks'] as const,
  bookmarkList: (page = 0, size = 50) =>
    queryOptions({
      queryKey: [...noteQueries.bookmarks(), { page, size }],
      queryFn: () => getBookmarkedNotes(page, size),
      staleTime: 1000 * 60 * 3, // 3분 캐시
    }),
};

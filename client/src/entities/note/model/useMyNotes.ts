import { useQuery } from '@tanstack/react-query';
import { getNotebookNotes } from '../api/note.api';
import { useAuthStore } from '@/entities/user/model/useAuthStore';
import type { GetNotebookNotesParams } from '../note.types';

/**
 * 노트북 목록 조회 React Query 훅 (userId 전달 시 특정 유저, 미전달 시 본인 노트 조회)
 */
export const useNotebookNotes = (params: GetNotebookNotesParams = {}) => {
  const { isLoggedIn } = useAuthStore();
  const { userId, tagName, sortType, page = 0, size = 100 } = params;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['notebookNotes', { userId: userId ?? 'me', tagName, sortType, page, size }],
    queryFn: () => getNotebookNotes({ userId, tagName, sortType, page, size }),
    // 특정 유저 조회는 비로그인도 열람 가능, 본인 조회는 로그인 상태 필요
    enabled: userId !== undefined ? true : isLoggedIn,
  });

  return {
    notes: data?.content || [],
    totalElements: data?.totalElements || 0,
    totalPages: data?.totalPages || 0,
    isLoading,
    isError,
    error,
  };
};

export const useMyNotes = useNotebookNotes;

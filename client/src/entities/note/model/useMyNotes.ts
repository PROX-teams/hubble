import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/entities/user/model/useAuthStore';
import { noteQueries } from './noteQueries';
import type { GetNotebookNotesParams } from '../note.types';

/**
 * 노트북 목록 조회 React Query 훅 (userId 전달 시 특정 유저, 미전달 시 본인 노트 조회)
 */
export const useNotebookNotes = (params: GetNotebookNotesParams = {}) => {
  const { isLoggedIn } = useAuthStore();
  const { userId, tagName, sortType, page = 0, size = 100 } = params;

  const queryOption = noteQueries.list({ userId, tagName, sortType, page, size });

  const { data, isLoading, isError, error } = useQuery({
    ...queryOption,
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

'use client';

import { useQuery } from '@tanstack/react-query';
import { noteQueries } from '@/entities/note/model/noteQueries';

/**
 * 특정 노트의 상세 정보를 가져오는 커스텀 훅입니다.
 * @param noteId - 조회할 노트의 ID
 * @returns { note, isLoading, isError, error } - 쿼리 결과 상태
 */
export const useNoteDetail = (noteId: number | null) => {
  const { data: note, isLoading, isError, error } = useQuery(
    noteQueries.detail(noteId)
  );

  return {
    note,
    isLoading,
    isError,
    error,
  };
};

'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleLikeNote, toggleBookmarkNote } from '@/entities/note/api/note.api';

export const useNoteInteraction = (noteId: number) => {
  const queryClient = useQueryClient();

  // 1. 좋아요 토글 Mutation
  const likeMutation = useMutation({
    mutationFn: () => toggleLikeNote(noteId),
    onSuccess: () => {
      // 노트 데이터 최신화
      queryClient.invalidateQueries({ queryKey: ['note', noteId] });
      // 목록 데이터도 최신화해야 할 경우를 대비
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  // 2. 북마크 토글 Mutation
  const bookmarkMutation = useMutation({
    mutationFn: () => toggleBookmarkNote(noteId),
    onSuccess: () => {
      // 노트 데이터 최신화
      queryClient.invalidateQueries({ queryKey: ['note', noteId] });
      // 북마크 목록 데이터 최신화
      queryClient.invalidateQueries({ queryKey: ['notes', 'bookmarks'] });
    },
  });

  return {
    toggleLike: likeMutation.mutate,
    isLikePending: likeMutation.isPending,
    toggleBookmark: bookmarkMutation.mutate,
    isBookmarkPending: bookmarkMutation.isPending,
  };
};

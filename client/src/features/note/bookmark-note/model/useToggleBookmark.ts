import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleBookmarkNote } from '@/entities/note/api/note.api';
import { useAuthStore } from '@/entities/user/model/useAuthStore';

export const useToggleBookmark = (noteId: number) => {
  const queryClient = useQueryClient();
  const { isLoggedIn } = useAuthStore();

  return useMutation({
    mutationFn: () => toggleBookmarkNote(noteId),
    onMutate: () => {
      if (!isLoggedIn) {
        alert('로그인이 필요한 서비스입니다.');
        throw new Error('Unauthorized');
      }
    },
    onSuccess: () => {
      // 내 북마크 목록 및 노트 상세 캐시 즉시 갱신
      queryClient.invalidateQueries({ queryKey: ['bookmarkedNotes'] });
      queryClient.invalidateQueries({ queryKey: ['note', noteId] });
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
    onError: (error) => {
      if (error.message !== 'Unauthorized') {
        alert('북마크 처리에 실패했습니다. 다시 시도해 주세요.');
      }
    },
  });
};

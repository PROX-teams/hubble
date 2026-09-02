import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleLikeNote } from '@/entities/note/api/note.api';
import { useAuthStore } from '@/entities/user/model/useAuthStore';

export const useToggleLike = (noteId: number) => {
  const queryClient = useQueryClient();
  const { isLoggedIn } = useAuthStore();

  return useMutation({
    mutationFn: () => toggleLikeNote(noteId),
    onMutate: () => {
      if (!isLoggedIn) {
        alert('로그인이 필요한 서비스입니다.');
        throw new Error('Unauthorized');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['note', noteId] });
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
    onError: (error) => {
      if (error.message !== 'Unauthorized') {
        alert('좋아요 처리에 실패했습니다. 다시 시도해 주세요.');
      }
    },
  });
};

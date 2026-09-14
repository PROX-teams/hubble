import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/entities/user/model/useAuthStore';
import { useNoteEditorStore } from '@/features/note/write-note/model/useNoteEditorStore';
import { createNote, updateNote } from '@/entities/note/api/note.api';

export const usePublishNote = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isLoggedIn } = useAuthStore();

  const handlePublish = async () => {
    if (!isLoggedIn) {
      alert('로그인이 필요한 서비스입니다.');
      router.push('/login');
      return;
    }

    // 제목과 본문은 발행 시점에 지연 평가(Pull)로 수거
    const {
      noteId,
      category,
      tag,
      imageUrl,
      storyId,
      getTitle,
      getContent,
      reset,
    } = useNoteEditorStore.getState();

    const currentTitle = getTitle();
    const currentContent = getContent();

    if (!currentTitle.trim() || !currentContent.trim()) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    try {
      const payload = {
        title: currentTitle,
        content: currentContent,
        category,
        tag,
        imageUrl,
        storyId: storyId || undefined,
      };

      const isEdit = Boolean(noteId);

      if (isEdit && noteId) {
        await updateNote(noteId, payload);
        alert('노트가 수정되었습니다.');
        queryClient.invalidateQueries({ queryKey: ['noteDetail', noteId] });
      } else {
        await createNote(payload);
        alert('노트가 게시되었습니다.');
      }

      queryClient.invalidateQueries({ queryKey: ['notebookNotes'] });
      queryClient.invalidateQueries({ queryKey: ['recentUpdatesInfinite'] });
      reset();
      router.push('/thread');
    } catch (error) {
      console.error('Failed to save note:', error);
      alert(noteId ? '노트 수정 중 오류가 발생했습니다.' : '노트 게시 중 오류가 발생했습니다.');
    }
  };

  return { handlePublish };
};

import { invalidateContent } from '@/shared/api/invalidateContent';
import { beginPublication, readPendingPublication, clearPendingPublication, publicationFingerprint, publishWithRetry } from '@/features/note/write-note/model/publicationRecovery';
import { ApiError } from '@/shared/api/base';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

import { useAuthStore } from '@/entities/user/model/useAuthStore';
import { useNoteEditorStore } from '@/features/note/write-note/model/useNoteEditorStore';
import { useNoteDraft, waitForDraftSave } from '@/features/note/write-note/model/useNoteDraft';
import { resolvePublication, updateNote } from '@/entities/note/api/note.api';
import { noteQueries } from '@/entities/note/model/noteQueries';

export const usePublishNote = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isLoggedIn } = useAuthStore();
  const { clearDraft } = useNoteDraft();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePublish = async () => {
    // Allow pending-result reconciliation even when a draft was changed elsewhere.
    const actorId = useAuthStore.getState().user?.id;
    const hasPending = actorId ? Boolean(readPendingPublication(actorId)) : false;
    if (useNoteEditorStore.getState().isPublishing || (useNoteEditorStore.getState().draftConflict && !hasPending)) return;

    // 2. 네트워크 오프라인 상태 사전 감지
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      alert(
        '인터넷 연결이 오프라인 상태입니다. 네트워크 연결을 확인해 주세요. 작성 중인 글은 로컬에 안전하게 보관 중입니다.'
      );
      return;
    }

    if (!isLoggedIn) {
      alert('로그인이 필요한 서비스입니다.');
      router.push('/login');
      return;
    }

    useNoteEditorStore.getState().setIsPublishing(true);
    setIsSubmitting(true);
    try {
      await waitForDraftSave();
    } catch {
      useNoteEditorStore.getState().setIsPublishing(false);
      setIsSubmitting(false);
      alert('임시저장에 실패했습니다. 다시 게시해 주세요.');
      return;
    }

    if (useNoteEditorStore.getState().draftConflict && !hasPending) {
      useNoteEditorStore.getState().setIsPublishing(false);
      setIsSubmitting(false);
      return;
    }

    // 제목과 본문은 발행 시점에 지연 평가(Pull)로 수거
    const {
      noteId,
      activeDraftId,
      draftVersion,
      noteVersion,
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

    // 3. HTML 태그 껍데기(<p></p>) 통과 버그 방지: 순수 텍스트 추출 검증
    const plainTextContent = currentContent.replace(/<[^>]*>?/gm, '').trim();

    if (!currentTitle.trim() || !plainTextContent) {
      alert('제목과 본문 내용을 모두 입력해주세요.');
      useNoteEditorStore.getState().setIsPublishing(false);
      setIsSubmitting(false);
      return;
    }

    // 4. Base64 이미지로 인한 DB VARCHAR(255) Data Truncation 500 에러 방어
    if (imageUrl && imageUrl.startsWith('data:image') && imageUrl.length > 255) {
      alert('커버 이미지는 파일 직접 첨부 대신 이미지 URL 링크로 입력해 주세요. (서버 컬럼 규격 제한)');
      useNoteEditorStore.getState().setIsPublishing(false);
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);
    const userId = useAuthStore.getState().user?.id;
    let submittedNewRequest = false;
    try {
      const payload = {
        draftId: activeDraftId ? Number(activeDraftId) : undefined,
        draftVersion: activeDraftId ? draftVersion : undefined,
        noteVersion: noteId ? noteVersion : undefined,
        title: currentTitle,
        content: currentContent,
        category,
        tag,
        imageUrl: imageUrl || undefined,
        storyId: storyId || undefined,
      };


      const isEdit = Boolean(noteId);

      if (isEdit && noteId) {
        await updateNote(noteId, payload);
        alert('노트가 수정되었습니다.');
        // 1. 해당 노트 상세 캐시 무효화 (기존 'noteDetail' 오타 해결)
        queryClient.invalidateQueries({ queryKey: noteQueries.detail(noteId).queryKey });
        // 2. 북마크 목록에서도 변경 내용이 반영되도록 무효화
        queryClient.invalidateQueries({ queryKey: noteQueries.bookmarks() });
      } else {
        if (!userId) throw new Error('로그인이 필요합니다.');
        const previous = readPendingPublication(userId);
        if (previous) {
          const result = await resolvePublication(previous.key);
          clearPendingPublication(userId);
          if (result.state === 'completed') {
            void invalidateContent(queryClient);
            if (previous.fingerprint !== publicationFingerprint(payload)) {
              // Never send an old body or discard the user's new edits.
              clearDraft();
              useNoteEditorStore.getState().setDraftConflict(false);
              alert('이전 글은 이미 게시되었습니다. 지금 작성한 내용은 유지했습니다. 게시된 글을 확인한 뒤 수정하거나 새 글로 게시해 주세요.');
              return;
            }
            alert('글이 이미 게시되어 있어 결과를 확인했습니다.');
            clearDraft();
            reset();
            router.push('/thread');
            return;
          }
          // The old key is cancelled server-side, so a late request cannot create a duplicate.
        }
        const attempt = beginPublication(userId, payload);
        submittedNewRequest = true;
        await publishWithRetry(payload, attempt.key);
        clearPendingPublication(userId);
        alert('노트가 게시되었습니다.');
      }

      // 3. 내 노트 목록 및 홈 최신글 목록 일괄 무효화
      queryClient.invalidateQueries({ queryKey: noteQueries.lists() });
      queryClient.invalidateQueries({ queryKey: ['recentUpdatesInfinite'] });
      queryClient.invalidateQueries({ queryKey: ['drafts'] });
      void invalidateContent(queryClient);
      clearDraft();
      reset();
      router.push('/thread');
    } catch (error) {
      if (submittedNewRequest && !noteId && userId && error instanceof ApiError && [400, 401, 403, 404, 409, 422].includes(error.status)) {
        clearPendingPublication(userId);
      }
      if (error instanceof ApiError && error.status === 409) {
        useNoteEditorStore.getState().setDraftConflict(true);
        alert(error.message);
        return;
      }
      console.error('Failed to save note:', error);
      alert(noteId ? '노트 수정 중 오류가 발생했습니다.' : '게시 결과를 확인하지 못했습니다. 작성 내용은 유지됩니다. 다음 게시 시 이전 처리 결과를 먼저 확인합니다.');
    } finally {
      useNoteEditorStore.getState().setIsPublishing(false);
      setIsSubmitting(false);
    }
  };

  return { handlePublish, isSubmitting };
};

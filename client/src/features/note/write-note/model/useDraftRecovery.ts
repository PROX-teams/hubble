'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { draftApi } from '../api/draftApi';
import { useNoteEditorStore } from './useNoteEditorStore';

export function setDraftUrl(id: string | null) {
  const url = new URL(window.location.href);
  if (!/^\/notebook\/(new|\d+\/edit)$/.test(url.pathname)) return;
  if (id) url.searchParams.set('draftId', id);
  else url.searchParams.delete('draftId');
  window.history.replaceState(window.history.state, '', url);
}

export function useDraftRecovery() {
  const pathname = usePathname();
  const draftId = useSearchParams().get('draftId');
  const activeDraftId = useNoteEditorStore((state) => state.activeDraftId);
  const isRestoring = useNoteEditorStore((state) => state.isRestoringDraft);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const state = useNoteEditorStore.getState();
    const id = draftId;
    setError(null);

    if (!id || id === state.activeDraftId) {
      state.setIsRestoringDraft(false);
      return;
    }

    state.setIsRestoringDraft(true);
    if (!/^[1-9]\d*$/.test(id) || !Number.isSafeInteger(Number(id))) {
      setError('임시저장 번호가 올바르지 않습니다.');
      return;
    }

    draftApi.getDraft(Number(id)).then((draft) => {
      if (cancelled) return;
      const expectedPath = draft.noteId ? `/notebook/${draft.noteId}/edit` : '/notebook/new';
      if (pathname !== expectedPath) throw new Error('임시저장 글의 편집 주소가 일치하지 않습니다.');
      useNoteEditorStore.getState().initDraft({
        ...draft,
        id: String(draft.id),
        tag: draft.tags,
      });
      useNoteEditorStore.getState().setIsRestoringDraft(false);
    }).catch(() => {
      if (!cancelled) setError('임시저장 글을 불러오지 못했습니다. 다시 불러오거나 임시저장 목록에서 글을 선택해 주세요.');
      // Keep save and publish blocked until the selected draft has been restored.
    });

    return () => { cancelled = true; };
  }, [pathname, draftId, activeDraftId, attempt]);

  return { isRestoring, error, retry: () => setAttempt((value) => value + 1) };
}

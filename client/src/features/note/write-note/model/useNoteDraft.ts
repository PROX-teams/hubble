'use client';

import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/entities/user/model/useAuthStore';
import { draftApi, DraftResponseDto, DraftSaveRequestDto } from '../api/draftApi';
import { useNoteEditorStore } from './useNoteEditorStore';
import { readPendingPublication } from './publicationRecovery';
import { ApiError } from '@/shared/api/base';
import type { CategoryType } from '@/shared/types';

export interface NoteDraftItem {
  id: number;
  version: number;
  noteId?: number | null;
  baseNoteVersion?: number | null;
  title: string;
  content: string;
  category?: CategoryType;
  tag?: string[];
  imageUrl?: string;
  storyId?: number | null;
  savedAt: string; // ISO 8601
}

/**
 * 에디터에서 백엔드 DB로 임시저장을 수행할 때 사용하는 실무 표준 훅
 */
let pendingDraftSave: Promise<unknown> | null = null;
export const waitForDraftSave = async () => {
  await pendingDraftSave;
};

export const useNoteDraft = () => {
  const { isLoggedIn } = useAuthStore();
  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: (data: DraftSaveRequestDto) => draftApi.saveDraft(data),
    onSuccess: (savedDraft: DraftResponseDto) => {
      useNoteEditorStore.getState().setActiveDraftId(String(savedDraft.id));
      useNoteEditorStore.getState().setDraftVersion(savedDraft.version);
      queryClient.invalidateQueries({ queryKey: ['drafts'] });
    },
  });

  const saveDraft = useCallback(
    async (options?: { silent?: boolean }) => {
      const isSilent = options?.silent ?? false;

      if (!isLoggedIn) {
        if (!isSilent) {
          alert('로그인이 필요한 서비스입니다.');
        }
        return false;
      }

      const actorId = useAuthStore.getState().user?.id;
      if (actorId && readPendingPublication(actorId)) return false;
      if (useNoteEditorStore.getState().isPublishing || useNoteEditorStore.getState().draftConflict) return false;
      // Share the in-flight save across manual and automatic save hooks.
      if (pendingDraftSave) {
        try { await pendingDraftSave; } catch { /* Allow a fresh save after failure. */ }
        return saveDraft(options);
      }
      const state = useNoteEditorStore.getState();
      const title = state.getTitle();
      const content = state.getContent();

      if (!title.trim() && !content.trim()) {
        if (!isSilent) {
          alert('임시저장할 내용(제목 또는 본문)이 없습니다.');
        }
        return false;
      }

      try {
        const rawId = state.activeDraftId;
        const parsedId = rawId ? Number(rawId) : null;
        const validId = parsedId && !isNaN(parsedId) ? parsedId : null;

        const pending = saveMutation.mutateAsync({
          id: validId,
          version: validId ? state.draftVersion : undefined,
          noteId: state.noteId,
          baseNoteVersion: state.noteVersion,
          title: title.trim() || '제목 없는 임시글',
          content,
          category: state.category,
          tags: state.tag,
          imageUrl: state.imageUrl,
          storyId: state.storyId,
        });
        pendingDraftSave = pending;
        try { await pending; }
        finally { if (pendingDraftSave === pending) pendingDraftSave = null; }

        if (!isSilent) {
          alert('작성 중인 내용이 서버에 안전하게 임시저장되었습니다.');
        }
        return true;
      } catch (e) {
        if (e instanceof ApiError && e.status === 409) {
          useNoteEditorStore.getState().setDraftConflict(true);
          queryClient.invalidateQueries({ queryKey: ['drafts'] });
          return false;
        }
        console.error('[Draft] Failed to save draft to backend:', e);
        if (!isSilent) {
          alert('임시저장에 실패했습니다.');
        }
        return false;
      }
    },
    [isLoggedIn, saveMutation]
  );

  const clearDraft = useCallback((_draftId?: string) => {
    useNoteEditorStore.getState().setActiveDraftId(null);
  }, []);

  return {
    saveDraft,
    clearDraft,
    isSaving: saveMutation.isPending,
  };
};

/**
 * 좌측 사이드바(Save 탭)에서 로그인 유저의 임시저장 목록을 조회/삭제하는 훅
 */
export const useDraftList = () => {
  const { isLoggedIn } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: rawDrafts = [], isLoading } = useQuery({
    queryKey: ['drafts'],
    queryFn: draftApi.getDrafts,
    enabled: isLoggedIn,
  });

  const drafts: NoteDraftItem[] = rawDrafts.map((d) => ({
    id: d.id,
    version: d.version,
    noteId: d.noteId,
    baseNoteVersion: d.baseNoteVersion,
    title: d.title,
    content: d.content,
    category: d.category,
    tag: d.tags,
    imageUrl: d.imageUrl,
    storyId: d.storyId,
    savedAt: d.savedAt,
  }));

  const deleteMutation = useMutation({
    mutationFn: (id: number) => draftApi.deleteDraft(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drafts'] });
    },
  });

  const clearAllMutation = useMutation({
    mutationFn: draftApi.clearAllDrafts,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drafts'] });
    },
  });

  return {
    drafts,
    isLoading,
    isLoggedIn,
    deleteDraft: (id: number) => deleteMutation.mutate(id),
    clearAllDrafts: () => clearAllMutation.mutate(),
  };
};

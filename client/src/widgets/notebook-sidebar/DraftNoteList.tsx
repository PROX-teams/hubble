'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useDraftList, NoteDraftItem } from '@/features/note/write-note/model/useNoteDraft';
import { useNoteEditorStore } from '@/features/note/write-note/model/useNoteEditorStore';
import NoteCard from '@/entities/note/ui/note-card/NoteCard';
import { NoteCardSkeleton } from '@/entities/note/ui/note-card/NoteCardSkeleton';
import RemoveIcon from '@/shared/assets/icons/common/remove-tag.svg';
import * as S from './MyNoteList.css';

/**
 * 좌측 사이드바 - 임시저장(Save) 탭 목록 위젯
 * - 백엔드 DB 영속화 기반 유저별 완벽 격리 초안 목록
 * - 비로그인 유저 접근 시 "로그인이 필요한 서비스입니다." 가드 노출
 * - 클릭 시 현재 작성 중인 글 덮어쓰기 방지 가드(Confirm) 후 에디터로 데이터 복원
 * - 각 카드별 개별 삭제(✕) 버튼 및 상단 전체 비우기 지원
 */
export const DraftNoteList = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { drafts, deleteDraft, clearAllDrafts, isLoading, isLoggedIn } = useDraftList();
  const initDraft = useNoteEditorStore((state) => state.initDraft);

  // 1. 로딩 상태 스켈레톤 노출
  if (isLoading) {
    return (
      <div className={S.container}>
        <div className={S.noteListWrapper}>
          {Array.from({ length: 3 }).map((_, index) => (
            <NoteCardSkeleton key={index} variant="compact" />
          ))}
        </div>
      </div>
    );
  }

  // 2. 비로그인 접근 차단 가드
  if (!isLoggedIn) {
    return (
      <div className={S.container}>
        <div style={{ padding: '40px 20px', color: '#888', textAlign: 'center' }}>
          로그인이 필요한 서비스입니다.
        </div>
      </div>
    );
  }

  // 초안 선택 시 덮어쓰기 방지 가드 적용
  const handleSelectDraft = (e: React.MouseEvent, draft: NoteDraftItem) => {
    e.preventDefault();

    const state = useNoteEditorStore.getState();
    if (state.isPublishing) return;
    const currentTitle = state.getTitle();
    const currentContent = state.getContent();

    const hasUnsavedContent =
      Boolean(currentTitle.trim()) ||
      Boolean(currentContent.replace(/<[^>]*>?/gm, '').trim());

    if (hasUnsavedContent) {
      const confirmLoad = window.confirm(
        '작성 중인 내용이 사라집니다. 이 임시저장 글을 불러오시겠습니까?'
      );
      if (!confirmLoad) return;
    }

    initDraft({
      ...draft,
      id: String(draft.id),
    });

    const target = draft.noteId ? `/notebook/${draft.noteId}/edit` : '/notebook/new';
    if (pathname !== target) router.push(target);
  };

  const handleDelete = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('이 임시저장 글을 삭제하시겠습니까?')) {
      deleteDraft(id);
    }
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.confirm('임시저장된 모든 글을 삭제하시겠습니까?')) {
      clearAllDrafts();
    }
  };

  return (
    <div className={S.container}>
      {/* 상단 개수 헤더 및 전체 비우기 */}
      {drafts.length > 0 && (
        <div className={S.draftHeader}>
          <span className={S.draftTitleText}>
            임시저장 ({drafts.length})
          </span>
          <button
            type="button"
            className={S.clearAllBtn}
            onClick={handleClearAll}
          >
            모두 비우기
          </button>
        </div>
      )}

      {/* 초안 목록 렌더링 */}
      <div className={S.noteListWrapper}>
        {drafts.length > 0 ? (
          drafts.map((draft) => (
            <div
              key={draft.id}
              style={{ position: 'relative', width: '100%' }}
              onClick={(e) => handleSelectDraft(e, draft)}
            >
              <NoteCard
                variant="compact"
                href="#"
                data={{
                  id: draft.id,
                  version: draft.version,
                  title: draft.title || '제목 없는 임시글',
                  description: draft.content || '',
                  author: '임시저장',
                  date: draft.savedAt ? draft.savedAt.slice(0, 10) : '',
                  likeCount: 0,
                }}
              />
              {/* 카드 우측 상단 개별 삭제 버튼 */}
              <button
                type="button"
                className={S.deleteIconBtn}
                onClick={(e) => handleDelete(e, draft.id)}
                title="임시저장 삭제"
                aria-label="임시저장 삭제"
              >
                <RemoveIcon width={12} height={12} />
              </button>
            </div>
          ))
        ) : (
          <div className={S.emptyText}>
            임시저장된 노트가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default DraftNoteList;

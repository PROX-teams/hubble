'use client';

import React from 'react';
import Button from '@/shared/ui/button/button/Button';
import { useNoteEditorStore } from '@/features/note/write-note/model/useNoteEditorStore';
import { useNoteDraft } from '@/features/note/write-note/model/useNoteDraft';
import { usePublishNote } from './model/usePublishNote';
import { CategoryStorySection } from './ui/sections/CategoryStorySection';
import { TagEditorSection } from './ui/sections/TagEditorSection';
import { CoverImageSection } from './ui/sections/CoverImageSection';
import * as s from './NotebookMetaEditor.css';

export const NotebookMetaEditor = () => {
  const draftConflict = useNoteEditorStore((state) => state.draftConflict);
  const isPublishing = useNoteEditorStore((state) => state.isPublishing);
  const isEdit = Boolean(useNoteEditorStore((state) => state.noteId));
  const { handlePublish, isSubmitting } = usePublishNote();
  const { saveDraft } = useNoteDraft();

  return (
    <div className={s.sidebarContainer}>
      {/* 1. 카테고리 및 스토리 연결 (실제 API 연동) */}
      <CategoryStorySection />

      {/* 2. 태그 추가 및 목록 */}
      <TagEditorSection />

      {/* 3. 커버 이미지 업로드 */}
      <CoverImageSection />

      {draftConflict && (
        <p role="alert">
          다른 곳에서 초안 또는 게시글을 수정했습니다. 작성 내용은 화면에 유지되며 자동저장을 멈췄습니다.
          현재 내용을 복사해 보관한 뒤, 최신 초안 또는 게시글을 다시 열어 주세요.
        </p>
      )}

      {/* 4. 하단 발행/저장 액션 버튼 그룹 */}
      <div className={s.buttonGroup}>
        <Button variants="neutral" size="lg" onClick={() => saveDraft()} disabled={isPublishing || draftConflict}>
          임시저장
        </Button>

        <Button
          variants="colored"
          size="lg"
          onClick={handlePublish}
          disabled={isPublishing || draftConflict}
        >
          {isSubmitting ? '저장 중...' : isEdit ? '수정 완료' : '게시하기'}
        </Button>
      </div>
    </div>
  );

};

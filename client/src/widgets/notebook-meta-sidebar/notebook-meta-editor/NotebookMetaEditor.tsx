'use client';

import React from 'react';
import { Textarea } from '@/shared/ui/input/textarea/Textarea';
import Button from '@/shared/ui/button/button/Button';
import { useNoteEditorStore } from '@/features/note/write-note/model/useNoteEditorStore';
import { usePublishNote } from './model/usePublishNote';
import { CategoryStorySection } from './ui/sections/CategoryStorySection';
import { TagEditorSection } from './ui/sections/TagEditorSection';
import { CoverImageSection } from './ui/sections/CoverImageSection';
import * as s from './NotebookMetaEditor.css';

export const NotebookMetaEditor = () => {
  const isEdit = Boolean(useNoteEditorStore((state) => state.noteId));
  const { handlePublish } = usePublishNote();

  return (
    <div className={s.sidebarContainer}>
      {/* 1. 카테고리 및 스토리 연결 */}
      <CategoryStorySection />

      {/* 2. 노트 소개 */}
      <section className={s.section}>
        <h3 className={s.sectionTitle}>노트 소개</h3>
        <Textarea
          placeholder="노트에 대한 짧은 소개글을 작성해주세요 (현재는 본문 내용이 저장됩니다)"
          variant="solid"
          size="md"
          disabled
        />
      </section>

      {/* 3. 태그 추가 및 목록 */}
      <TagEditorSection />

      {/* 4. 커버 이미지 업로드 */}
      <CoverImageSection />

      {/* 5. 하단 발행/저장 액션 버튼 그룹 */}
      <div className={s.buttonGroup}>
        <Button variants="neutral" size="lg">
          임시저장
        </Button>
        <Button variants="colored" size="lg" onClick={handlePublish}>
          {isEdit ? '수정 완료' : '게시하기'}
        </Button>
      </div>
    </div>
  );
};

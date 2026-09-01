'use client';

import React from 'react';
import type { Note } from '@/entities/note/note.types';
import NoteCard from '@/entities/note/ui/note-card/NoteCard';
import * as S from './NotebookNoteGrid.css';

interface NotebookNoteGridProps {
  notes?: Note[];
  isLoading?: boolean;
}

/**
 * 3열 반응형 노트 카드 그리드 컴포넌트
 */
export const NotebookNoteGrid = ({
  notes = [],
  isLoading = false,
}: NotebookNoteGridProps) => {
  if (isLoading) {
    return (
      <div className={S.emptyState}>
        <p>노트를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className={S.emptyState}>
        <p>등록된 노트가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className={S.grid}>
      {notes.map((note, index) => (
        <NoteCard
          key={note.id}
          data={note}
          imageUrl={note.imageUrl}
          variant="large"
          priority={index < 8}
        />
      ))}
    </div>
  );
};

export default NotebookNoteGrid;

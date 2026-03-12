'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getNoteDetail } from '@/entities/note/api/note.api';
import Tag from '@/shared/ui/tag/Tag';
import * as s from './page.css';

const CATEGORY_MAP: Record<string, string> = {
  DEVELOPMENT: '개발',
  DESIGN: '디자인',
  PLANNING: '기획',
  MARKETING: '마케팅',
  LIFE: '일상',
  OTHER: '기타',
};

export default function NotebookDetailPage() {
  const params = useParams();
  const noteId = Number(params.id);

  const { data: note, isLoading, error } = useQuery({
    queryKey: ['note', noteId],
    queryFn: () => getNoteDetail(noteId),
    enabled: !!noteId,
  });

  if (isLoading) {
    return (
      <div className={s.loadingContainer}>
        노트를 불러오는 중입니다...
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className={s.loadingContainer}>
        노트를 찾을 수 없거나 불러오는 데 실패했습니다.
      </div>
    );
  }

  return (
    <div className={s.container}>
      <header className={s.header}>
        {note.category && (
          <span className={s.category}>{CATEGORY_MAP[note.category] || note.category}</span>
        )}
        <h1 className={s.title}>{note.title}</h1>
        <div className={s.meta}>
          <span className={s.author}>By {note.author || '익명'}</span>
        </div>
        {note.tag && note.tag.length > 0 && (
        <div className={s.tagList}>
          {note.tag.map((tagName) => (
            <Tag key={tagName} label={tagName} />
          ))}
        </div>
      )}
      </header>

      {/* Tiptap HTML 콘텐츠 렌더링 */}
      <div 
        className={s.content}
        dangerouslySetInnerHTML={{ __html: note.description || '' }}
      />
    </div>
  );
}

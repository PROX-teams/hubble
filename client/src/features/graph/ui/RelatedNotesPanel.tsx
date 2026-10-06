'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { CategoryType } from '@/shared/types';
import { getNotes } from '@/entities/note/api/note.api';
import NoteCard from '@/entities/note/ui/note-card/NoteCard';
import { Skeleton } from '@/shared/ui/skeleton/Skeleton';
import * as S from './RelatedNotesPanel.css';

interface RelatedNotesPanelProps {
  category: CategoryType;
  selectedTag?: string;
  page?: number;
  onPageInfoChange?: (info: { totalPages: number; isFirst: boolean; isLast: boolean }) => void;
}

export function RelatedNotesPanel({
  category,
  selectedTag,
  page = 0,
  onPageInfoChange,
}: RelatedNotesPanelProps) {
  // 선택된 카테고리, 태그 및 현재 페이지(page) 기반 노트 목록 조회 (size=6)
  const { data: notesData, isLoading, isError, refetch } = useQuery({
    queryKey: ['graph-related-notes', category, selectedTag, page],
    queryFn: () =>
      getNotes({
        category,
        tagName: selectedTag || undefined,
        sortType: 'latest',
        page,
        size: 6, // 화면 높이에 딱 맞는 카드 6개 페이지네이션
      }),
    staleTime: 1000 * 60 * 3, // 3분간 캐시
  });

  // 부모에게 페이지네이션 메타데이터 전달 (<< >> 비활성화/활성화 제어)
  React.useEffect(() => {
    if (isError && onPageInfoChange) {
      onPageInfoChange({ totalPages: Math.max(1, page + 1), isFirst: page === 0, isLast: true });
      return;
    }
    if (notesData && onPageInfoChange) {
      onPageInfoChange({
        totalPages: notesData.totalPages || 1,
        isFirst: notesData.first !== undefined ? notesData.first : page === 0,
        isLast: notesData.last !== undefined ? notesData.last : page >= (notesData.totalPages || 1) - 1,
      });
    }
  }, [notesData, isError, page, onPageInfoChange]);

  const notes = notesData?.content || [];

  return (
    <aside className={S.panelContainer} aria-label="연관 노트 목록">
      {/* 노트 카드 리스트: 화면설계서와 동일하게 상단부터 카드 순차 나열 */}
      <div className={S.listWrapper}>
        {isLoading ? (
          // 로딩 스켈레톤
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} width="100%" height="96px" borderRadius="12px" />
          ))
        ) : isError ? (
          <div className={S.emptyState} role="alert">
            <span>노트 목록을 불러오지 못했습니다.</span>
            <button type="button" className={S.retryButton} onClick={() => void refetch()}>
              다시 시도
            </button>
          </div>
        ) : notes.length > 0 ? (
          notes.map((note) => (
            <NoteCard
              key={note.id}
              data={note}
              imageUrl={note.imageUrl}
              variant="wide" // 👈 화면설계서 지정 382x96 와이드 카드
            />
          ))
        ) : (
          <div className={S.emptyState}>
            {selectedTag
              ? `"${selectedTag}" 태그에 등록된 연관 노트가 없습니다.`
              : '현재 카테고리에 등록된 노트가 없습니다.'}
          </div>
        )}
      </div>
    </aside>
  );
}

'use client';

import React, { useState, useMemo } from 'react';
import clsx from 'clsx';
import type { Note } from '@/entities/note/note.types';
import NoteCard from '@/entities/note/ui/note-card/NoteCard';
import Tag from '@/shared/ui/tag/Tag';
import { Dropdown } from '@/shared/ui/dropdown/Dropdown';
import type { SortType } from '@/shared/types/api.types';
import * as S from './NotebookNoteGrid.css';

interface FilterChipItem {
  id: string;
  name: string;
  count: number;
}

interface NotebookNoteGridProps {
  title?: string;
  notes?: Note[];
  filterTags?: FilterChipItem[];
}

const SORT_OPTIONS: Record<string, { label: string; value: SortType }> = {
  mostViewed: { label: 'Most Viewed', value: 'mostViewed' },
  latest: { label: 'Latest', value: 'latest' },
  mostLiked: { label: 'Most Liked', value: 'mostLiked' },
};

export const NotebookNoteGrid = ({
  title = 'FrontEnd 공부집',
  notes = [],
  filterTags,
}: NotebookNoteGridProps) => {
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [sortType, setSortType] = useState<SortType>('mostViewed');

  // 태그 목록이 전달되지 않은 경우, 노트 데이터에서 자동 추출
  const computedTags: FilterChipItem[] = useMemo(() => {
    if (filterTags && filterTags.length > 0) return filterTags;

    const tagCountMap: Record<string, number> = {};
    notes.forEach((note) => {
      if (note.tag && Array.isArray(note.tag)) {
        note.tag.forEach((t) => {
          tagCountMap[t] = (tagCountMap[t] || 0) + 1;
        });
      }
      if (note.category) {
        tagCountMap[note.category] = (tagCountMap[note.category] || 0) + 1;
      }
    });

    const list = Object.entries(tagCountMap).map(([name, count]) => ({
      id: name,
      name,
      count,
    }));

    // 기본 태그 목록 fallback (데이터가 부족할 때 시안 형태 유지)
    if (list.length === 0) {
      return [
        { id: 'Frontend', name: 'Frontend', count: 102 },
        { id: 'Kotlin', name: 'Kotlin', count: 78 },
        { id: '코딩 테스트', name: '코딩 테스트', count: 41 },
        { id: '개발 일지', name: '개발 일지', count: 33 },
        { id: '취업 준비', name: '취업 준비', count: 31 },
        { id: '회고록', name: '회고록', count: 22 },
        { id: 'DevOps', name: 'DevOps', count: 20 },
        { id: 'SEO', name: 'SEO', count: 14 },
        { id: 'Backend', name: 'Backend', count: 4 },
      ];
    }

    return list;
  }, [filterTags, notes]);

  // 필터링 및 정렬된 노트 목록
  const displayedNotes = useMemo(() => {
    let result = [...notes];

    // 태그 필터링
    if (selectedTag !== 'all') {
      result = result.filter(
        (note) =>
          note.tag?.includes(selectedTag) || note.category === selectedTag
      );
    }

    // 정렬
    if (sortType === 'mostViewed') {
      result.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
    } else if (sortType === 'mostLiked') {
      result.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0));
    } else if (sortType === 'latest') {
      result.sort(
        (a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()
      );
    }

    return result;
  }, [notes, selectedTag, sortType]);

  const currentSortLabel =
    Object.values(SORT_OPTIONS).find((opt) => opt.value === sortType)?.label ||
    'Most Viewed';

  return (
    <div className={S.container}>
      {/* 1. 상단 타이틀 및 정렬 섹션 */}
      <div className={S.headerSection}>
        <div className={S.titleGroup}>
          <h1 className={S.pageTitle}>{title}</h1>
          <p className={S.noteCount}>{notes.length}개의 노트</p>
        </div>

        <div className={S.sortSection}>
          <Dropdown>
            <Dropdown.Trigger size="xl" variant="surface">
              <Dropdown.Value>{() => currentSortLabel}</Dropdown.Value>
              <Dropdown.Icon />
            </Dropdown.Trigger>
            <Dropdown.Menu>
              {Object.entries(SORT_OPTIONS).map(([key, option]) => (
                <Dropdown.Option
                  key={key}
                  optionId={key}
                  onClick={() => setSortType(option.value)}
                >
                  {option.label}
                </Dropdown.Option>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      {/* 2. 카테고리 / 태그 필터 칩 바 (디자인 시스템 Tag 활용) */}
      {computedTags.length > 0 && (
        <div className={S.filterBar}>
          {computedTags.map((tag) => {
            const isActive = selectedTag === tag.name;
            return (
              <Tag
                key={tag.id}
                label={tag.name}
                count={tag.count}
                className={clsx(S.tagItem, isActive && S.activeTagItem)}
                onClick={() =>
                  setSelectedTag(isActive ? 'all' : tag.name)
                }
              />
            );
          })}
        </div>
      )}

      {/* 3. 3열 노트 카드 그리드 */}
      {displayedNotes.length > 0 ? (
        <div className={S.grid}>
          {displayedNotes.map((note, index) => (
            <NoteCard
              key={note.id}
              data={note}
              imageUrl={note.imageUrl}
              variant="large"
              priority={index < 8}
            />
          ))}
        </div>
      ) : (
        <div className={S.emptyState}>
          <p>등록된 노트가 없습니다.</p>
        </div>
      )}
    </div>
  );
};

export default NotebookNoteGrid;

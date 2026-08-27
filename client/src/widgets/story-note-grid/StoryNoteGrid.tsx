"use client";

import React, { useState, useMemo } from "react";
import clsx from "clsx";
import Tag from "@/shared/ui/tag/Tag";
import NoteCard from "@/entities/note/ui/note-card/NoteCard";
import type { Note } from "@/entities/note/note.types";
import * as S from "./StoryNoteGrid.css";

export interface StoryNoteGridProps {
  notes: Note[];
  /**
   * NoteCard의 variant (기본값: "small")
   */
  cardVariant?: "small" | "large" | "wide" | "compact";
  className?: string;
}

/**
 * 스토리 내의 노트들을 태그 필터와 함께 4열 그리드로 보여주는 공통 위젯 컴포넌트
 * (스토리 상세 모달 및 타인 스토리북 페이지에서 공용으로 사용)
 */
export const StoryNoteGrid = ({
  notes = [],
  cardVariant = "small",
  className,
}: StoryNoteGridProps) => {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // 노트 데이터들로부터 태그 집계 계산
  const tagList = useMemo(() => {
    const tagCountMap: Record<string, number> = {};

    notes.forEach((note) => {
      if (Array.isArray(note.tag)) {
        note.tag.forEach((t) => {
          tagCountMap[t] = (tagCountMap[t] || 0) + 1;
        });
      }
    });

    return Object.entries(tagCountMap)
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count);
  }, [notes]);

  // 선택된 태그에 따른 필터링
  const filteredNotes = useMemo(() => {
    if (!selectedTag) return notes;
    return notes.filter((note) =>
      Array.isArray(note.tag) && note.tag.includes(selectedTag)
    );
  }, [notes, selectedTag]);

  const handleTagClick = (tagLabel: string) => {
    setSelectedTag((prev) => (prev === tagLabel ? null : tagLabel));
  };

  return (
    <div className={clsx(S.container, className)}>
      {/* 상단 태그 칩 필터 목록 */}
      {tagList.length > 0 && (
        <div className={S.tagListWrapper}>
          {tagList.map(({ label, count }) => {
            const isSelected = selectedTag === label;
            return (
              <Tag
                key={label}
                label={label}
                count={count}
                className={clsx(S.tagItem, isSelected && S.activeTagItem)}
                onClick={() => handleTagClick(label)}
              />
            );
          })}
        </div>
      )}

      {/* 4열 노트 카드 그리드 */}
      {filteredNotes.length > 0 ? (
        <div className={S.grid}>
          {filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              data={note}
              imageUrl={note.imageUrl}
              variant={cardVariant}
            />
          ))}
        </div>
      ) : (
        <div className={S.emptyState}>
          {selectedTag
            ? `"${selectedTag}" 태그에 해당하는 노트가 없습니다.`
            : "등록된 노트가 없습니다."}
        </div>
      )}
    </div>
  );
};

export default StoryNoteGrid;

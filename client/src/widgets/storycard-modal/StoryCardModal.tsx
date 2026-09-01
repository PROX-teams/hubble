"use client";

import React, { useMemo } from "react";
import Modal from "@/shared/ui/modal/modal/Modal";
import { formatDate } from "@/shared/lib/utils/date";
import type { Story } from "@/entities/story/story.types";
import type { Note } from "@/entities/note/note.types";
import { StoryNoteGrid } from "@/widgets/story-note-grid/StoryNoteGrid";
import { StoryCardModalHeader } from "./StoryCardModalHeader";
import * as S from "./StoryCardModal.css";

export interface StoryCardModalProps {
  story: Story;
  notes?: Note[];
  onClose: () => void;
  actionSlot?: React.ReactNode;
}

/**
 * StoryCardModal 컴포넌트
 *
 * 스토리 카드 클릭 시 해당 스토리에 포함된 노트 목록을 태그 필터와 함께 표시하는 모달입니다.
 */
export const StoryCardModal = ({
  story,
  notes = [],
  onClose,
  actionSlot,
}: StoryCardModalProps) => {
  // 실제 노트 중 가장 최근 수정일 계산
  const latestDate = useMemo(() => {
    const validDates = notes
      .map((n) => n.date)
      .filter((d): d is string => Boolean(d));

    if (validDates.length === 0) return undefined;

    const sorted = [...validDates].sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime()
    );
    return formatDate(sorted[0]);
  }, [notes]);

  const noteCount = story.articleIds?.length ?? notes.length;

  return (
    <Modal hide={onClose} hideOnClickOutside className={S.modal}>
      {/* 모달 상단 헤더 */}
      <StoryCardModalHeader
        title={story.title}
        icon={story.icon}
        noteCount={noteCount}
        latestDate={latestDate}
        actionSlot={actionSlot}
      />

      {/* 모달 본문 (태그 필터 바 + 4열 노트 그리드) */}
      <div className={S.contentWrapper}>
        <StoryNoteGrid notes={notes} />
      </div>
    </Modal>
  );
};

export default StoryCardModal;

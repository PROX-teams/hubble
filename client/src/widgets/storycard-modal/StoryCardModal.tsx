"use client";

import React, { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Modal from "@/shared/ui/modal/modal/Modal";
import { formatDate } from "@/shared/lib/utils/date";
import type { Story } from "@/entities/story/story.types";
import type { Note } from "@/entities/note/note.types";
import { StoryNoteGrid } from "@/widgets/story-note-grid/StoryNoteGrid";
import { StoryCardModalHeader } from "./StoryCardModalHeader";
import { CreateStoryModal } from "@/features/story/create-story/ui/CreateStoryModal";
import { deleteStory } from "@/entities/story/api/story.api";
import { useAuthStore } from "@/entities/user/model/useAuthStore";
import * as S from "./StoryCardModal.css";

// 더보기(케밥) SVG 아이콘
const MoreIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    <circle cx="6" cy="12" r="1.5" fill="currentColor" />
    <circle cx="18" cy="12" r="1.5" fill="currentColor" />
  </svg>
);

export interface StoryCardModalProps {
  story: Story;
  notes?: Note[];
  onClose: () => void;
  actionSlot?: React.ReactNode;
}

/**
 * StoryCardModal 컴포넌트
 *
 * 스토리 상세 조회 및 스토리 수정/삭제 케밥 메뉴를 지원합니다.
 */
export const StoryCardModal = ({
  story,
  notes = [],
  onClose,
  actionSlot,
}: StoryCardModalProps) => {
  const queryClient = useQueryClient();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // 스토리 삭제 mutation
  const { mutate: handleDeleteStory, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteStory(story.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myStories"] });
      queryClient.invalidateQueries({ queryKey: ["stories"] });
      onClose();
    },
    onError: (error) => {
      alert("스토리 삭제에 실패했습니다.");
      console.error(error);
    },
  });

  const onClickDelete = () => {
    setIsMenuOpen(false);
    if (
      window.confirm(
        "스토리를 삭제하시겠습니까? 소속된 노트는 삭제되지 않고 스토리 미지정 상태로 유지됩니다."
      )
    ) {
      handleDeleteStory();
    }
  };

  const onClickEdit = () => {
    setIsMenuOpen(false);
    setIsEditModalOpen(true);
  };

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

  // 현재 로그인 사용자 및 스토리 소유자(작성자) 여부 검증
  const currentUser = useAuthStore((state) => state.user);
  const isOwner = Boolean(
    currentUser &&
      ((story.authorId && currentUser.id === story.authorId) ||
        (story.author && currentUser.nickname === story.author))
  );

  const defaultActionSlot = isOwner ? (
    <div className={S.moreMenuWrapper}>
      <button
        type="button"
        className={S.moreButton}
        aria-label="더보기"
        onClick={() => setIsMenuOpen((prev) => !prev)}
      >
        <MoreIcon />
      </button>

      {isMenuOpen && (
        <div className={S.dropdownMenu}>
          <button
            type="button"
            className={S.dropdownItem}
            onClick={onClickEdit}
          >
            스토리 수정
          </button>
          <button
            type="button"
            className={S.deleteItem}
            onClick={onClickDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "삭제 중..." : "스토리 삭제"}
          </button>
        </div>
      )}
    </div>
  ) : null;

  return (
    <>
      <Modal hide={onClose} hideOnClickOutside className={S.modal}>
        {/* 모달 상단 헤더 */}
        <StoryCardModalHeader
          title={story.title}
          icon={story.icon}
          noteCount={noteCount}
          latestDate={latestDate}
          actionSlot={actionSlot ?? defaultActionSlot}
        />

        {/* 모달 본문 (태그 필터 바 + 4열 노트 그리드) */}
        <div className={S.contentWrapper}>
          <StoryNoteGrid notes={notes} />
        </div>
      </Modal>

      {/* 수정 클릭 시 열리는 스토리 편집 모달 (작성자 본인일 때만 마운트) */}
      {isOwner && (
        <CreateStoryModal
          isOpen={isEditModalOpen}
          initialStory={story}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </>
  );
};

export default StoryCardModal;

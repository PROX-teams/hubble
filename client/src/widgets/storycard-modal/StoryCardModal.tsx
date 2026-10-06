"use client";

import { invalidateContent } from '@/shared/api/invalidateContent';

import React, { useMemo, useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Modal from "@/shared/ui/modal/modal/Modal";
import { formatDate } from "@/shared/lib/utils/date";
import type { Story } from "@/entities/story/story.types";
import type { Note } from "@/entities/note/note.types";
import { getNoteDetail } from "@/entities/note/api/note.api";
import { StoryNoteGrid } from "@/widgets/story-note-grid/StoryNoteGrid";
import { StoryCardModalHeader } from "./StoryCardModalHeader";
import { CreateStoryModal } from "@/features/story/create-story/ui/CreateStoryModal";
import { deleteStory, getStoryDetail } from "@/entities/story/api/story.api";
import { useAuthStore } from "@/entities/user/model/useAuthStore";
import { useSearchModalStore } from "@/features/search/search-contents/model/useSearchModalStore";
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
  storyId?: number;
  story?: Story;
  notes?: Note[];
  onClose: () => void;
  actionSlot?: React.ReactNode;
}

/**
 * StoryCardModal 컴포넌트
 *
 * 스토리 상세 조회 및 스토리 수정/삭제 케밥 메뉴를 지원합니다.
 * 모달 내 노트 클릭 또는 라우트 이동 시 스토리 모달 및 검색 모달을 자동으로 닫고 탈출합니다.
 */
export const StoryCardModal = ({
  storyId: propStoryId,
  story: initialStory,
  notes: propNotes,
  onClose,
  actionSlot,
}: StoryCardModalProps) => {
  const queryClient = useQueryClient();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const pathname = usePathname();
  const initialPathnameRef = useRef(pathname);
  const { closeSearch } = useSearchModalStore();

  // 모달 내의 노트를 클릭하여 라우트(URL)가 변경되면 모달들을 자동으로 닫고 탈출
  useEffect(() => {
    if (initialPathnameRef.current !== pathname) {
      void invalidateContent(queryClient);
      onClose();
      closeSearch();
    }
  }, [pathname, onClose, closeSearch]);

  // 노트 링크 클릭 시 즉시 모달 닫기
  const handleContentClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement | null;
    if (target?.closest("a")) {
      void invalidateContent(queryClient);
      onClose();
      closeSearch();
    }
  };

  const storyId = propStoryId ?? initialStory?.id;

  // 1. 스토리 상세 정보 조회 (initialStory가 있으면 0ms 즉시 헤더 렌더링)
  const { data: currentStory = initialStory } = useQuery({
    queryKey: ["storyDetail", storyId],
    queryFn: () => getStoryDetail(storyId!),
    enabled: Boolean(storyId),
    initialData: initialStory,
    staleTime: 1000 * 60 * 3,
  });

  // 2. 외부에서 주입된 notes가 있는지 확인
  const hasExternalNotes = Boolean(propNotes && propNotes.length > 0);

  // 3. 스토리 소속 노트를 독립 페칭
  const articleIds = currentStory?.articleIds;
  const { data: fetchedNotes = [], isLoading: isNotesLoading } = useQuery({
    queryKey: ["storyNotes", storyId, articleIds],
    queryFn: async () => {
      if (!articleIds || articleIds.length === 0) return [];
      return Promise.all(articleIds.map((id) => getNoteDetail(id)));
    },
    enabled: !hasExternalNotes && Boolean(articleIds && articleIds.length > 0),
    staleTime: 1000 * 60 * 3,
  });

  const effectiveNotes = useMemo(
    () => (hasExternalNotes ? (propNotes ?? []) : fetchedNotes),
    [hasExternalNotes, propNotes, fetchedNotes]
  );

  // 스토리 삭제 mutation
  const { mutate: handleDeleteStory, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteStory(storyId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myStories"] });
      queryClient.invalidateQueries({ queryKey: ["stories"] });
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["drafts"] });
      queryClient.invalidateQueries({ queryKey: ["recentUpdatesInfinite"] });
      void invalidateContent(queryClient);
      onClose();
    },
    onError: (error) => {
      alert(error instanceof Error ? error.message : "스토리 삭제에 실패했습니다.");
      console.error(error);
    },
  });

  const onClickDelete = () => {
    setIsMenuOpen(false);
    if (
      window.confirm(
        "스토리를 삭제하시겠습니까? 소속된 노트와 임시저장 글은 기본 스토리로 이동합니다."
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
    const validDates = effectiveNotes
      .map((n) => n.date)
      .filter((d): d is string => Boolean(d));

    if (validDates.length === 0) return undefined;

    const sorted = [...validDates].sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime()
    );
    return formatDate(sorted[0]);
  }, [effectiveNotes]);

  const noteCount = currentStory?.articleIds?.length ?? effectiveNotes.length;

  // 현재 로그인 사용자 및 스토리 소유자(작성자) 여부 검증
  const currentUser = useAuthStore((state) => state.user);
  const isOwner = Boolean(
    currentUser &&
      currentStory &&
      ((currentStory.authorId && currentUser.id === currentStory.authorId) ||
        (currentStory.author && currentUser.nickname === currentStory.author))
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

  if (!currentStory) {
    return (
      <Modal hide={onClose} hideOnClickOutside className={S.modal}>
        <div style={{ padding: "48px 0", textAlign: "center", opacity: 0.6, fontSize: "0.95rem" }}>
          스토리를 불러오는 중...
        </div>
      </Modal>
    );
  }

  return (
    <>
      <Modal hide={onClose} hideOnClickOutside className={S.modal}>
        {/* 모달 상단 헤더 */}
        <StoryCardModalHeader
          title={currentStory.title}
          icon={currentStory.icon}
          noteCount={noteCount}
          latestDate={latestDate}
          actionSlot={actionSlot ?? defaultActionSlot}
        />

        {/* 모달 본문 (태그 필터 바 + 4열 노트 그리드) */}
        <div className={S.contentWrapper} onClickCapture={handleContentClickCapture}>
          {isNotesLoading ? (
            <div style={{ textAlign: "center", padding: "48px 0", opacity: 0.6, fontSize: "0.95rem" }}>
              스토리의 노트를 불러오는 중...
            </div>
          ) : (
            <StoryNoteGrid notes={effectiveNotes} />
          )}
        </div>
      </Modal>

      {/* 수정 클릭 시 열리는 스토리 편집 모달 (작성자 본인일 때만 마운트) */}
      {isOwner && (
        <CreateStoryModal
          isOpen={isEditModalOpen}
          initialStory={currentStory}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </>
  );
};

export default StoryCardModal;

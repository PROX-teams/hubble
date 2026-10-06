"use client";

import React, { useState, useMemo, Suspense } from "react";
import clsx from "clsx";
import Button from "@/shared/ui/button/button/Button";
import Tag from "@/shared/ui/tag/Tag";
import { CreatorProfileCard } from "@/widgets/creator-profile/ui/CreatorProfileCard";
import StoryCard from "@/entities/story/ui/story-card/StoryCard";
import { StoryCardModal } from "@/widgets/storycard-modal/StoryCardModal";
import { CreateStoryModal } from "@/features/story/create-story/ui/CreateStoryModal";
import { useInfiniteMyStories } from "@/entities/story/model/useMyStories";
import { useMyNotes } from "@/entities/note/model/useMyNotes";
import { useAuthStore } from "@/entities/user/model/useAuthStore";
import { useUserProfile } from "@/entities/user/model/useUserProfile";
import { calculateTagCounts, filterStoriesByTag } from "@/entities/note/model/tagUtils";
import { AuthGuard } from "@/features/auth/AuthGuard";
import { InfiniteScrollTrigger } from "@/features/infinite-scroll/ui/InfiniteScrollTrigger";
import { useStorybookFilters } from "@/features/story/view-story/model/useStorybookFilters";
import * as S from "./page.css";

function StorybookContent() {
  const { selectedTag, storyId, setSelectedTag, setStoryId, resetFilters } =
    useStorybookFilters();
  const [isCreateStoryModalOpen, setIsCreateStoryModalOpen] = useState(false);

  // 1. 로그인 유저 정보 및 최신 프로필 훅
  const { user: authUser } = useAuthStore();
  const { userProfile } = useUserProfile(authUser?.id);
  const currentUser = userProfile || authUser;

  // 2. 실제 백엔드 API 연동 (본인 스토리 무한스크롤 및 노트)
  const {
    stories,
    isLoading: isStoriesLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteMyStories(12);
  const { notes, isLoading: isNotesLoading } = useMyNotes({ size: 100 });

  // 3. 본인 노트들로부터 태그 집계 (공통 유틸 재사용)
  const tagList = useMemo(() => calculateTagCounts(notes), [notes]);

  // 4. 선택된 태그에 따른 스토리 필터링
  const filteredStories = useMemo(
    () => filterStoriesByTag(stories, notes, selectedTag),
    [stories, notes, selectedTag]
  );

  const isLoading = isStoriesLoading || isNotesLoading;

  const handleTagClick = (tagLabel: string) => {
    setSelectedTag(selectedTag === tagLabel ? null : tagLabel);
  };

  const handleResetFilter = () => {
    resetFilters();
  };

  return (
    <>
      {/* 메인 콘텐츠 영역 (왼쪽 패딩 0 유지, 오른쪽 패딩 180px 확장) */}
      <div className={S.container}>
        {/* 본인 프로필 헤더 및 2단 그리드 (About + Contribution Log 카드) */}
        {currentUser && (
          <CreatorProfileCard
            userId={currentUser.id}
            creator={currentUser}
            notes={notes}
          />
        )}

        {/* Story Book 섹션 (타이틀 + 새 스토리 버튼 + 태그 목록 + 스토리 그리드) */}
        <section className={S.storySection}>
          <div className={S.headerSection}>
            <div className={S.titleRow}>
              <div className={S.titleLeftGroup}>
                <h2 className={S.pageTitle}>Story Book</h2>
                {selectedTag && (
                  <div className={S.filterBadge}>
                    <span>#{selectedTag} 필터 적용 중</span>
                    <button
                      type="button"
                      className={S.clearFilterBtn}
                      onClick={handleResetFilter}
                      aria-label="태그 필터 해제"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              {/* 스토리 생성 버튼 */}
              <Button
                variants="colored"
                size="sm"
                onClick={() => setIsCreateStoryModalOpen(true)}
              >
                New
              </Button>
            </div>

            {/* 스토리북 서브 타이틀 아래 태그 목록 (모달 내부 태그 나열 스타일) */}
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
          </div>

          {/* 스토리 카드 그리드 (태그 필터링 적용) */}
          <div className={S.storyGrid}>
            {isLoading && <div>스토리를 불러오는 중입니다...</div>}
            {!isLoading && filteredStories.length === 0 && (
              <div className={S.emptyStoryText}>
                {selectedTag
                  ? `"${selectedTag}" 태그에 해당하는 스토리가 없습니다.`
                  : "아직 생성된 스토리가 없습니다."}
              </div>
            )}
            {!isLoading &&
              filteredStories.map((story) => (
                <StoryCard
                  key={story.id}
                  data={story}
                  density="compact"
                  onClick={() => setStoryId(story.id)}
                />
              ))}
          </div>

          {/* 무한 스크롤 트리거 */}
          <InfiniteScrollTrigger
            hasNextPage={!!hasNextPage}
            fetchNextPage={fetchNextPage}
            isFetching={isFetchingNextPage}
          />
        </section>

        {/* 메인 스토리 카드 클릭 시 열리는 상세 모달 (URL storyId 기반) */}
        {storyId && (
          <StoryCardModal
            storyId={storyId}
            story={stories.find((s) => s.id === storyId)}
            onClose={() => setStoryId(null)}
          />
        )}

        {/* 사이드바 폴더 버튼 클릭 시 열리는 스토리 생성 모달 */}
        <CreateStoryModal
          isOpen={isCreateStoryModalOpen}
          onClose={() => setIsCreateStoryModalOpen(false)}
        />
      </div>
    </>
  );
}

export default function StorybookPage() {
  return (
    <AuthGuard>
      <Suspense fallback={<div style={{ padding: "40px", color: "var(--color-gray-400)" }}>Loading Storybook...</div>}>
        <StorybookContent />
      </Suspense>
    </AuthGuard>
  );
}

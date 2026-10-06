"use client";

import React, { useMemo, Suspense } from "react";
import clsx from "clsx";
import { useParams } from "next/navigation";
import Tag from "@/shared/ui/tag/Tag";
import { CreatorProfileCard } from "@/widgets/creator-profile/ui/CreatorProfileCard";
import StoryCard from "@/entities/story/ui/story-card/StoryCard";
import { StoryCardModal } from "@/widgets/storycard-modal/StoryCardModal";
import { useUserProfile } from "@/entities/user/model/useUserProfile";
import { useInfiniteUserStories } from "@/entities/story/model/useUserStories";
import { useNotebookNotes } from "@/entities/note/model/useMyNotes";
import { calculateTagCounts, filterStoriesByTag } from "@/entities/note/model/tagUtils";
import { InfiniteScrollTrigger } from "@/features/infinite-scroll/ui/InfiniteScrollTrigger";
import { useStorybookFilters } from "@/features/story/view-story/model/useStorybookFilters";
import * as S from "./page.css";

function CreatorStorybookContent() {
  const params = useParams();
  const rawUserId = params?.userId;
  const userId = typeof rawUserId === "string" ? parseInt(rawUserId, 10) : Number(rawUserId);

  const { selectedTag, storyId, setSelectedTag, setStoryId, resetFilters } =
    useStorybookFilters();

  // 1. 크리에이터 프로필 커스텀 훅
  const { userProfile: creator } = useUserProfile(userId);

  // 2. 해당 크리에이터의 스토리 목록 무한스크롤 커스텀 훅
  const {
    stories,
    isLoading: isStoriesLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteUserStories(userId, 12);

  // 3. 해당 크리에이터의 작성 노트 목록 커스텀 훅 (스토리 모달 연동 및 태그 집계용)
  const { notes, isLoading: isNotesLoading } = useNotebookNotes({ userId, size: 100 });

  // 4. 노트들로부터 태그 빈도수 계산
  const tagList = useMemo(() => calculateTagCounts(notes), [notes]);

  // 5. 선택된 태그에 따른 스토리 필터링
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
        {/* 크리에이터 프로필 헤더 및 2단 그리드 (About + Contribution Log 카드) */}
        <CreatorProfileCard
          userId={userId}
          creator={creator}
          notes={notes}
        />

        {/* Story Book 섹션 (타이틀 + 태그 목록 + 스토리 그리드) */}
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
      </div>
    </>
  );
}

export default function CreatorStorybookPage() {
  return (
    <Suspense fallback={<div style={{ padding: "40px", color: "var(--color-gray-400)" }}>Loading Creator Storybook...</div>}>
      <CreatorStorybookContent />
    </Suspense>
  );
}

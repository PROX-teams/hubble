"use client";

import React, { useState } from "react";
import { StorySidebar } from "@/widgets/story-sidebar/StorySidebar";
import StoryCard from "@/entities/story/ui/story-card/StoryCard";
import type { Story } from "@/entities/story/story.types";
import { UpdateHistory } from "@/widgets/update-history/UpdateHistory";
import { StoryCardModal } from "@/widgets/storycard-modal/StoryCardModal";
import { CreateStoryModal } from "@/features/story/create-story/ui/CreateStoryModal";
import { useMyStories } from "@/entities/story/model/useMyStories";
import { useMyNotes } from "@/entities/note/model/useMyNotes";
import { AuthGuard } from "@/features/auth/AuthGuard";
import * as S from "./page.css";

function StorybookContent() {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [isCreateStoryModalOpen, setIsCreateStoryModalOpen] = useState(false);

  // 1. 실제 백엔드 API 연동
  const { stories, isLoading: isStoriesLoading } = useMyStories();
  const { notes, isLoading: isNotesLoading } = useMyNotes({ size: 100 });

  const isLoading = isStoriesLoading || isNotesLoading;

  return (
    <>
      {/* 좌측 고정 스토리 사이드바 (폴더 버튼 클릭 시 모달 열기) */}
      <StorySidebar
        stories={stories}
        notes={notes}
        onAddStory={() => setIsCreateStoryModalOpen(true)}
      />

      {/* 메인 콘텐츠 영역 */}
      <div className={S.container}>
        {/* 상단 페이지 타이틀 영역 */}
        <div className={S.headerSection}>
          <h1 className={S.pageTitle}>Story Book</h1>
          <p className={S.pageSubtitle}>당신만의 스토리를 만들어 보세요.</p>
        </div>

        {/* 스토리 카드 그리드 */}
        <section className={S.storyGrid}>
          {isLoading && <div>스토리를 불러오는 중입니다...</div>}
          {!isLoading && stories.length === 0 && (
            <div className={S.emptyStoryText}>아직 생성된 스토리가 없습니다.</div>
          )}
          {!isLoading &&
            stories.map((story) => (
              <StoryCard
                key={story.id}
                data={story}
                density="comfortable"
                onClick={() => setSelectedStory(story)}
              />
            ))}
        </section>

        {/* 하단 최근 노트 업데이트 이력 섹션 (Slice 무한 스크롤 지원) */}
        <UpdateHistory />

        {/* 메인 스토리 카드 클릭 시 열리는 상세 모달 */}
        {selectedStory && (
          <StoryCardModal
            story={selectedStory}
            notes={notes.filter((n) => selectedStory.articleIds?.includes(n.id))}
            onClose={() => setSelectedStory(null)}
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
      <StorybookContent />
    </AuthGuard>
  );
}
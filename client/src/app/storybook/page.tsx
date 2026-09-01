"use client";

import React, { useState, useMemo } from "react";
import { StorySidebar } from "@/widgets/story-sidebar/StorySidebar";
import StoryCard from "@/entities/story/ui/story-card/StoryCard";
import type { Story } from "@/entities/story/story.types";
import { UpdateHistory } from "@/widgets/update-history/UpdateHistory";
import type { HistoryCardData } from "@/entities/note/ui/history-card/HistoryCard";
import { StoryCardModal } from "@/widgets/storycard-modal/StoryCardModal";
import { useMyStories } from "@/entities/story/model/useMyStories";
import { useMyNotes } from "@/entities/note/model/useMyNotes";
import { AuthGuard } from "@/features/auth/AuthGuard";
import * as S from "./page.css";

function StorybookContent() {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  // 1. 실제 백엔드 API 연동
  const { stories, isLoading: isStoriesLoading } = useMyStories();
  const { notes, isLoading: isNotesLoading } = useMyNotes({ size: 100 });

  // 2. 실제 노트 목록 기반 최근 업데이트 히스토리 계산 (최신순 7건)
  const historyItems: HistoryCardData[] = useMemo(() => {
    if (!notes || notes.length === 0) return [];

    return [...notes]
      .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime())
      .slice(0, 7)
      .map((note) => {
        const parentStory = stories.find((s) => s.articleIds?.includes(note.id));
        return {
          id: note.id,
          title: note.title,
          storyTitle: parentStory?.title ?? "스토리 미지정",
          date: note.date || "",
        };
      });
  }, [notes, stories]);

  const isLoading = isStoriesLoading || isNotesLoading;

  return (
    <>
      {/* 좌측 고정 스토리 사이드바 (실제 스토리 및 소속 노트 목록 바인딩) */}
      <StorySidebar stories={stories} notes={notes} />

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

        {/* 하단 최근 노트 업데이트 이력 섹션 */}
        {historyItems.length > 0 && <UpdateHistory items={historyItems} />}

        {/* 메인 스토리 카드 클릭 시 열리는 상세 모달 */}
        {selectedStory && (
          <StoryCardModal
            story={selectedStory}
            notes={notes.filter((n) => selectedStory.articleIds?.includes(n.id))}
            onClose={() => setSelectedStory(null)}
          />
        )}
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
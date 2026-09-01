"use client";

import React, { useState } from "react";
import { StorySidebar } from "@/widgets/story-sidebar/StorySidebar";
import StoryCard from "@/entities/story/ui/story-card/StoryCard";
import type { Story } from "@/entities/story/story.types";
import type { Note } from "@/entities/note/note.types";
import { UpdateHistory } from "@/widgets/update-history/UpdateHistory";
import type { HistoryCardData } from "@/entities/note/ui/history-card/HistoryCard";
import { StoryCardModal } from "@/widgets/storycard-modal/StoryCardModal";
import storyMock from "@/shared/mock/story.json";
import articleMock from "@/shared/mock/article.json";
import * as S from "./page.css";

// 목업 스토리 목록 (사진 1 참고)
const mockStories: Story[] = [
  {
    id: 1,
    title: storyMock.title,
    description: storyMock.description,
    category: storyMock.category,
    icon: storyMock.icon,
    articleIds: [1, 2, 3, 4],
  },
  {
    id: 2,
    title: "PROX FE 피어리뷰",
    description:
      "팀 내 프론트엔드 코드 리뷰 및 피어리뷰 기록을 아카이빙하는 스토리입니다.",
    category: "프론트엔드",
    icon: "chart",
    articleIds: [5, 6],
  },
  {
    id: 3,
    title: "코딩테스트",
    description: "알고리즘 및 코딩테스트 풀이 모음집입니다.",
    category: "알고리즘",
    icon: "chart",
    articleIds: [7, 8],
  },
  {
    id: 4,
    title: "백준 문제풀이",
    description: "백준 온라인 저지 문제 풀이 기록입니다.",
    category: "알고리즘",
    icon: "chart",
    articleIds: [],
  },
];

// 목업 노트 목록
const mockNotes: Note[] = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  title: `${i + 1}. 토스 PM 출신의 IA 및 화면설계서 실무 파일`,
  author: articleMock.author,
  date: "2025.06.29",
  likeCount: 32,
  description: articleMock.description,
  imageUrl: articleMock.imageUrl,
  tag: ["Frontend", "SEO", "Code Review", i % 2 === 0 ? "Kotlin" : "Java"],
}));

// 목업 최근 업데이트 히스토리 (사진 1 하단)
const mockHistoryItems: HistoryCardData[] = Array.from({ length: 7 }, (_, i) => ({
  id: i + 1,
  title: "프론트엔드 Atomic Component 개념 정리",
  storyTitle: "프론트엔드 공부집",
  date: "2025.06.29",
}));

export default function StorybookPage() {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  return (
    <>
      {/* 좌측 고정 스토리 사이드바 (스토리 클릭 시 아코디언으로 소속 노트 목록이 펼쳐짐) */}
      <StorySidebar stories={mockStories} notes={mockNotes} />

      {/* 메인 콘텐츠 영역 */}
      <div className={S.container}>
        {/* 상단 페이지 타이틀 영역 */}
        <div className={S.headerSection}>
          <h1 className={S.pageTitle}>Story Book</h1>
          <p className={S.pageSubtitle}>당신만의 스토리를 만들어 보세요.</p>
        </div>

        {/* 스토리 카드 그리드 (클릭 시에만 상세 모달 오픈) */}
        <section className={S.storyGrid}>
          {mockStories.map((story) => (
            <StoryCard
              key={story.id}
              data={story}
              density="comfortable"
              onClick={() => setSelectedStory(story)}
            />
          ))}
        </section>

        {/* 하단 최근 노트 업데이트 이력 섹션 */}
        <UpdateHistory items={mockHistoryItems} />

        {/* 메인 스토리 카드 클릭 시 열리는 상세 모달 */}
        {selectedStory && (
          <StoryCardModal
            story={selectedStory}
            notes={mockNotes.filter((n) => selectedStory.articleIds?.includes(n.id))}
            onClose={() => setSelectedStory(null)}
          />
        )}
      </div>
    </>
  );
}
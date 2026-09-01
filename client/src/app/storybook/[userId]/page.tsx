"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import StoryCard from "@/entities/story/ui/story-card/StoryCard";
import type { Story } from "@/entities/story/story.types";
import type { Note } from "@/entities/note/note.types";
import { StoryCardModal } from "@/widgets/storycard-modal/StoryCardModal";
import articleMock from "@/shared/mock/article.json";
import * as S from "./page.css";

// 타인의 여러 스토리북 목록 (사진 1과 유사한 스토리 카드들)
const mockOtherUserStories: Story[] = [
  {
    id: 1,
    title: "FrontEnd 공부집",
    description:
      "포스트 31개를 학습하는 시리즈 단위의 학습일지입니다.\nSEO부터 UI 컴포넌트, DevOps 등 프론트엔드 전반의 학습 내용을 기록합니다.",
    category: "프론트엔드",
    icon: "chart",
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

// 목업 노트 목록 (모달 오픈 시 표시될 노트들)
const mockNotes: Note[] = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  title: "토스 PM 출신의 IA 및 화면설계서 실무 파일",
  author: "PROX 팀블로그",
  date: "2025.06.29",
  likeCount: 32,
  description:
    "네이버 CTO 출신 프론트엔드의 Next.js를 구현하는 방법에 대해 작성하였습니다. 네이버 CTO 출신 프론트엔드의 Next.js를 구현하는",
  imageUrl: articleMock.imageUrl,
  tag: ["Frontend", "SEO", "Code Review"],
}));

/**
 * 타인의 여러 스토리북 목록 조회 페이지 (/storybook/[userId])
 */
export default function OtherUserStorybookPage() {
  const params = useParams();
  const userId = params?.userId as string;
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  return (
    <div className={S.container}>
      {/* 1. 상단 유저 스토리북 헤더 */}
      <div className={S.headerSection}>
        <h1 className={S.pageTitle}>PROX 팀블로그&apos;s Story Book</h1>
        <p className={S.pageSubtitle}>총 {mockOtherUserStories.length}개의 스토리를 연재 중입니다.</p>
      </div>

      {/* 2. 해당 유저의 여러 스토리북 카드 목록 그리드 */}
      <section className={S.storyGrid}>
        {mockOtherUserStories.map((story) => (
          <StoryCard
            key={story.id}
            data={story}
            density="comfortable"
            onClick={() => setSelectedStory(story)}
          />
        ))}
      </section>

      {/* 3. 스토리 카드 클릭 시 열리는 상세 모달 */}
      {selectedStory && (
        <StoryCardModal
          story={selectedStory}
          notes={mockNotes.filter((n) => selectedStory.articleIds?.includes(n.id))}
          onClose={() => setSelectedStory(null)}
        />
      )}
    </div>
  );
}

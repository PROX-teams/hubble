'use client';

import React, { useState } from 'react';
import StoryCard from '@/entities/story/ui/story-card/StoryCard';
import { StoryCardSkeleton } from '@/entities/story/ui/story-card/StoryCardSkeleton';
import { StoryCardModal } from '@/widgets/storycard-modal/StoryCardModal';
import { usePopularStories } from '@/entities/recommend/model/useMainRecommendations';
import { RecommendCarouselSection } from '@/widgets/recommend-carousel-section/RecommendCarouselSection';
import type { Story } from '@/entities/story/story.types';
import * as s from './TrendingStoriesSection.css';

/**
 * 메인 페이지 Trending Stories(인기 스토리) 추천 캐러셀 위젯
 * - 자체 쿼리 훅(usePopularStories)을 통해 데이터를 자율적으로 페칭 및 렌더링
 * - 캐러셀, 스켈레톤, 카드 렌더링 및 카드 클릭 시 상세 모달(StoryCardModal) 상태를 캡슐화
 */
export const TrendingStoriesSection = () => {
  const { stories, isLoading } = usePopularStories();
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  return (
    <>
      <RecommendCarouselSection
        title="Trending Stories"
        isLoading={isLoading}
        items={stories}
        visibleCount={3}
        widthVariant="full"
        gap={24}
        emptyMessage="등록된 추천 스토리가 없습니다."
        renderSkeleton={() => (
          <div className={s.skeletonItemFlex}>
            <StoryCardSkeleton density="comfortable" />
          </div>
        )}
        renderItem={(story) => (
          <div className={s.storyItemWrapper}>
            <StoryCard
              data={story}
              density="comfortable"
              onClick={() => setSelectedStory(story)}
            />
          </div>
        )}
      />

      {/* 스토리 상세 모달 */}
      {selectedStory && (
        <StoryCardModal
          story={selectedStory}
          onClose={() => setSelectedStory(null)}
        />
      )}
    </>
  );
};

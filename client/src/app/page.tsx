'use client';

import { useState } from 'react';
import NoteCard from '@/entities/note/ui/note-card/NoteCard';
import { MainBanner } from '@/widgets/main-banner/MainBanner';
import { useMainRecommendations } from '@/entities/recommend/model/useMainRecommendations';
import { NoteCardSkeleton } from '@/entities/note/ui/note-card/NoteCardSkeleton';
import StoryCard from '@/entities/story/ui/story-card/StoryCard';
import { StoryCardSkeleton } from '@/entities/story/ui/story-card/StoryCardSkeleton';
import { StoryCardModal } from '@/widgets/storycard-modal/StoryCardModal';
import { RecommendCarouselSection } from '@/widgets/recommend-carousel-section/RecommendCarouselSection';
import { TrendingCreatorsSection } from '@/widgets/trending-creators-section/TrendingCreatorsSection';
import type { Story } from '@/entities/story/story.types';
import * as s from './page.css';

export default function MainPage() {
  const {
    mostLovedNotes,
    isMostLovedLoading,
    discoverNotes,
    isDiscoverLoading,
    creators,
    isCreatorsLoading,
    popularStories,
    isStoriesLoading,
  } = useMainRecommendations();

  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  return (
    <div className={s.pageContainer}>
      {/* 1. 상단 배너 */}
      <MainBanner />

      {/* 2. Most Loved와 Trending Creators의 2단 레이아웃 */}
      <div className={s.middleSection}>
        {/* Most Loved 추천 캐러셀 (독립 로딩) */}
        <RecommendCarouselSection
          title="Most Loved"
          isLoading={isMostLovedLoading}
          items={mostLovedNotes}
          visibleCount={4}
          emptyMessage="등록된 인기 노트가 없습니다."
          keyExtractor={(note) => note.id}
          renderSkeleton={() => <NoteCardSkeleton variant="small" />}
          renderItem={(note, { isPriority }) => (
            <NoteCard
              data={note}
              imageUrl={note.imageUrl}
              variant="small"
              priority={isPriority}
            />
          )}
        />

        {/* Trending Creators 추천 섹션 (독립 로딩 위젯) */}
        <TrendingCreatorsSection
          creators={creators}
          isLoading={isCreatorsLoading}
        />
      </div>

      <div className={s.divider} />

      {/* 3. Discover 추천 캐러셀 (독립 로딩) */}
      <RecommendCarouselSection
        title="Discover"
        isLoading={isDiscoverLoading}
        items={discoverNotes}
        visibleCount={4}
        emptyMessage="등록된 추천 노트가 없습니다."
        keyExtractor={(note) => note.id}
        renderSkeleton={() => <NoteCardSkeleton variant="small" />}
        renderItem={(note, { isPriority }) => (
          <NoteCard
            data={note}
            imageUrl={note.imageUrl}
            variant="small"
            priority={isPriority}
          />
        )}
      />

      <div className={s.divider} />

      {/* 4. Trending Stories 추천 캐러셀 (독립 로딩) */}
      <RecommendCarouselSection
        title="Trending Stories"
        isLoading={isStoriesLoading}
        items={popularStories}
        visibleCount={3}
        emptyMessage="등록된 추천 스토리가 없습니다."
        skeletonVariant="wide"
        keyExtractor={(story) => story.id}
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
    </div>
  );
}

'use client';

import { useState, useMemo } from 'react';
import NoteCard from '@/entities/note/ui/note-card/NoteCard';
import { MainBanner } from '@/widgets/main-banner/MainBanner';
import CreatorCard from '@/entities/user/ui/creator-card/CreatorCard';
import { useMainRecommendations } from '@/entities/recommend/model/useMainRecommendations';
import { NoteCardSkeleton } from '@/entities/note/ui/note-card/NoteCardSkeleton';
import { CreatorCardSkeleton } from '@/entities/user/ui/creator-card/CreatorCardSkeleton';
import StoryCard from '@/entities/story/ui/story-card/StoryCard';
import { StoryCardSkeleton } from '@/entities/story/ui/story-card/StoryCardSkeleton';
import { StoryCardModal } from '@/widgets/storycard-modal/StoryCardModal';
import { RecommendCarouselSection } from '@/widgets/recommend-carousel-section/RecommendCarouselSection';
import type { Story } from '@/entities/story/story.types';
import * as s from './page.css';

export default function MainPage() {
  const { data, isLoading } = useMainRecommendations();

  const mostLovedNotes = data?.mostLovedNotes ?? [];
  const discoverNotes = data?.discoverNotes ?? [];
  const creators = data?.creators ?? [];
  const popularStories = data?.popularStories ?? [];

  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  // 인기 노트와 추천 노트 간 ID 중복을 안전하게 제거하여 모달 key 충돌 방지
  const allNotes = useMemo(() => {
    const noteMap = new Map<number, (typeof mostLovedNotes)[number]>();
    mostLovedNotes.forEach((note) => noteMap.set(note.id, note));
    discoverNotes.forEach((note) => noteMap.set(note.id, note));
    return Array.from(noteMap.values());
  }, [mostLovedNotes, discoverNotes]);

  return (
    <div className={s.pageContainer}>
      {/* 1. 상단 배너 */}
      <MainBanner />

      {/* 2. Most Loved와 Trending Creators의 2단 레이아웃 */}
      <div className={s.middleSection}>
        {/* Most Loved 추천 캐러셀 */}
        <RecommendCarouselSection
          title="Most Loved"
          isLoading={isLoading}
          items={mostLovedNotes}
          visibleCount={4}
          emptyMessage="등록된 인기 노트가 없습니다."
          skeleton={
            <div className={s.skeletonRow}>
              {Array.from({ length: 4 }).map((_, i) => (
                <NoteCardSkeleton key={i} variant="small" />
              ))}
            </div>
          }
          renderItem={(note) => (
            <NoteCard key={note.id} data={note} variant="small" />
          )}
        />

        {/* Trending Creators 섹션 */}
        <aside className={s.creatorsSection}>
          <h2 className={s.sectionTitle}>Trending Creators</h2>
          <div className={s.creatorsWrapper}>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <CreatorCardSkeleton key={i} />
              ))
            ) : creators.length === 0 ? (
              <div>등록된 크리에이터가 없습니다.</div>
            ) : (
              creators.map((creator) => (
                <CreatorCard
                  key={creator.userId}
                  userId={creator.userId}
                  name={creator.name}
                  imageUrl={creator.imageUrl}
                  introduction={creator.introduction}
                />
              ))
            )}
          </div>
        </aside>
      </div>

      <div className={s.divider} />

      {/* 3. Discover 추천 캐러셀 */}
      <RecommendCarouselSection
        title="Discover"
        isLoading={isLoading}
        items={discoverNotes}
        visibleCount={4}
        emptyMessage="등록된 추천 노트가 없습니다."
        skeleton={
          <div className={s.skeletonRow}>
            {Array.from({ length: 4 }).map((_, i) => (
              <NoteCardSkeleton key={i} variant="small" />
            ))}
          </div>
        }
        renderItem={(note) => (
          <NoteCard key={note.id} data={note} variant="small" />
        )}
      />

      <div className={s.divider} />

      {/* 4. Trending Stories 추천 캐러셀 */}
      <RecommendCarouselSection
        title="Trending Stories"
        isLoading={isLoading}
        items={popularStories}
        visibleCount={3}
        emptyMessage="등록된 추천 스토리가 없습니다."
        skeleton={
          <div className={s.skeletonRowWide}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className={s.skeletonItemFlex}>
                <StoryCardSkeleton density="comfortable" />
              </div>
            ))}
          </div>
        }
        renderItem={(story) => (
          <div key={story.id} className={s.storyItemWrapper}>
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
          notes={allNotes.filter((n) =>
            selectedStory.articleIds?.includes(n.id)
          )}
          onClose={() => setSelectedStory(null)}
        />
      )}
    </div>
  );
}

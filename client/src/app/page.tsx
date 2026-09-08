'use client';

import { useState, useMemo, useRef } from 'react';
import { Carousel, type CarouselRef } from "@/shared/ui/carousel/Carousel";
import { CarouselButton } from "@/shared/ui/carousel/CarouselButton";
import NoteCard from "@/entities/note/ui/note-card/NoteCard";
import { MainBanner } from '@/widgets/main-banner/MainBanner';
import CreatorCard from '@/entities/user/ui/creator-card/CreatorCard';
import { useMainRecommendations } from '@/entities/recommend/model/useMainRecommendations';
import { NoteCardSkeleton } from '@/entities/note/ui/note-card/NoteCardSkeleton';
import { CreatorCardSkeleton } from '@/entities/user/ui/creator-card/CreatorCardSkeleton';
import StoryCard from '@/entities/story/ui/story-card/StoryCard';
import { StoryCardSkeleton } from '@/entities/story/ui/story-card/StoryCardSkeleton';
import { StoryCardModal } from '@/widgets/storycard-modal/StoryCardModal';
import type { Story } from '@/entities/story/story.types';
import * as s from './page.css';

export default function MainPage() {
  const mostLovedRef = useRef<CarouselRef>(null);
  const discoverRef = useRef<CarouselRef>(null);
  const storiesRef = useRef<CarouselRef>(null);

  const { data, isLoading } = useMainRecommendations();

  const mostLovedNotes = data?.mostLovedNotes ?? [];
  const discoverNotes = data?.discoverNotes ?? [];
  const creators = data?.creators ?? [];
  const popularStories = data?.popularStories ?? [];

  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  const allNotes = useMemo(
    () => [...mostLovedNotes, ...discoverNotes],
    [mostLovedNotes, discoverNotes]
  );

  return (
    <div className={s.pageContainer}>
      {/* 1. 상단 배너: 빈 공간 없이 전체 너비 채움 */}
      <MainBanner />

      {/* 2. Most Loved와 Trending Creators의 위치를 수평으로 맞춘 2단 레이아웃 */}
      <div className={s.middleSection}>
        {/* Most Loved 섹션 */}
        <section className={s.contentSection}>
          <div className={s.sectionHeader}>
            <h2 className={s.sectionTitle}>Most Loved</h2>
            <div className={s.buttonGroup}>
              <CarouselButton 
                direction="prev" 
                onClick={() => mostLovedRef.current?.prev()} 
                disabled={isLoading || mostLovedNotes.length <= 4}
              />
              <CarouselButton 
                direction="next" 
                onClick={() => mostLovedRef.current?.next()} 
                disabled={isLoading || mostLovedNotes.length <= 4}
              />
            </div>
          </div>

          <div className={s.carouselWrapper}>
            {isLoading ? (
              <div style={{ display: 'flex', gap: '16px' }}>
                {Array.from({ length: 4 }).map((_, i) => (
                  <NoteCardSkeleton key={i} variant="small" />
                ))}
              </div>
            ) : mostLovedNotes.length === 0 ? (
              <div>등록된 인기 노트가 없습니다.</div>
            ) : (
              <Carousel ref={mostLovedRef} visibleCount={4} interval={4000}>
                {mostLovedNotes.map((note) => (
                  <NoteCard 
                    key={note.id} 
                    data={note} 
                    variant="small"
                  />
                ))}
              </Carousel>
            )}
          </div>
        </section>

        {/* Trending Creators 섹션 (Most Loved와 상단 위치 일치) */}
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

      {/* 구분선 */}
      <div className={s.divider} />

      {/* 3. 하단 Discover 캐러셀 섹션 */}
      <section className={s.contentSection}>
        <div className={s.sectionHeader}>
          <h2 className={s.sectionTitle}>Discover</h2>
          <div className={s.buttonGroup}>
            <CarouselButton 
              direction="prev" 
              onClick={() => discoverRef.current?.prev()} 
              disabled={isLoading || discoverNotes.length <= 4}
            />
            <CarouselButton 
              direction="next" 
              onClick={() => discoverRef.current?.next()} 
              disabled={isLoading || discoverNotes.length <= 4}
            />
          </div>
        </div>
        <div className={s.carouselWrapper}>
          {isLoading ? (
            <div style={{ display: 'flex', gap: '16px' }}>
              {Array.from({ length: 4 }).map((_, i) => (
                <NoteCardSkeleton key={i} variant="small" />
              ))}
            </div>
          ) : discoverNotes.length === 0 ? (
            <div>등록된 추천 노트가 없습니다.</div>
          ) : (
            <Carousel ref={discoverRef} visibleCount={4} interval={4000}>
              {discoverNotes.map((note) => (
                <NoteCard 
                  key={note.id} 
                  data={note} 
                  variant="small"
                />
              ))}
            </Carousel>
          )}
        </div>
      </section>

      {/* 구분선 */}
      <div className={s.divider} />

      {/* 4. Trending Stories 추천 캐러셀 섹션 */}
      <section className={s.contentSection}>
        <div className={s.sectionHeader}>
          <h2 className={s.sectionTitle}>Trending Stories</h2>
          <div className={s.buttonGroup}>
            <CarouselButton 
              direction="prev" 
              onClick={() => storiesRef.current?.prev()} 
              disabled={isLoading || popularStories.length <= 3}
            />
            <CarouselButton 
              direction="next" 
              onClick={() => storiesRef.current?.next()} 
              disabled={isLoading || popularStories.length <= 3}
            />
          </div>
        </div>
        <div className={s.carouselWrapper}>
          {isLoading ? (
            <div style={{ display: 'flex', gap: '24px' }}>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} style={{ flex: 1 }}>
                  <StoryCardSkeleton density="comfortable" />
                </div>
              ))}
            </div>
          ) : popularStories.length === 0 ? (
            <div>등록된 추천 스토리가 없습니다.</div>
          ) : (
            <Carousel ref={storiesRef} visibleCount={3} interval={4000}>
              {popularStories.map((story) => (
                <div key={story.id} className={s.storyItemWrapper}>
                  <StoryCard 
                    data={story} 
                    density="comfortable"
                    onClick={() => setSelectedStory(story)}
                  />
                </div>
              ))}
            </Carousel>
          )}
        </div>
      </section>

      {/* 스토리 상세 모달 (기존 storybook 및 SearchContents와 동일한 실무 표준) */}
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

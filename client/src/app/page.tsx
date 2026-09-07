'use client';

import { useRef } from 'react';
import { Carousel, type CarouselRef } from "@/shared/ui/carousel/Carousel";
import { CarouselButton } from "@/shared/ui/carousel/CarouselButton";
import NoteCard from "@/entities/note/ui/note-card/NoteCard";
import { MainBanner } from '@/widgets/main-banner/MainBanner';
import CreatorCard from '@/entities/user/ui/creator-card/CreatorCard';
import { useMainRecommendations } from '@/entities/recommend/model/useMainRecommendations';
import { NoteCardSkeleton } from '@/entities/note/ui/note-card/NoteCardSkeleton';
import { CreatorCardSkeleton } from '@/entities/user/ui/creator-card/CreatorCardSkeleton';
import * as s from './page.css';

export default function MainPage() {
  const mostLovedRef = useRef<CarouselRef>(null);
  const discoverRef = useRef<CarouselRef>(null);

  const { data, isLoading } = useMainRecommendations();

  const mostLovedNotes = data?.mostLovedNotes ?? [];
  const discoverNotes = data?.discoverNotes ?? [];
  const creators = data?.creators ?? [];

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
    </div>
  );
}


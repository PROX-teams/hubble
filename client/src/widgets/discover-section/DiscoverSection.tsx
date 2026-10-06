'use client';

import React from 'react';
import NoteCard from '@/entities/note/ui/note-card/NoteCard';
import { NoteCardSkeleton } from '@/entities/note/ui/note-card/NoteCardSkeleton';
import { useDiscoverNotes } from '@/entities/recommend/model/useMainRecommendations';
import { RecommendCarouselSection } from '@/widgets/recommend-carousel-section/RecommendCarouselSection';
/**
 * 메인 페이지 Discover(최근 14일 트렌딩 탐색 노트) 추천 캐러셀 위젯
 * - 자체 쿼리 훅(useDiscoverNotes)을 통해 데이터를 자율적으로 페칭 및 렌더링
 */
export const DiscoverSection = () => {
  const { notes, isLoading } = useDiscoverNotes();

  return (
    <RecommendCarouselSection
      title="Discover"
      isLoading={isLoading}
      items={notes}
      visibleCount={3}
      widthVariant="full"
      emptyMessage="등록된 추천 노트가 없습니다."
      renderSkeleton={() => <NoteCardSkeleton variant="large" />}
      renderItem={(note, { isPriority }) => (
        <NoteCard
          data={note}
          imageUrl={note.imageUrl}
          variant="large"
          priority={isPriority}
        />
      )}
    />
  );
};

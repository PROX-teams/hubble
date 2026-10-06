'use client';

import React from 'react';
import NoteCard from '@/entities/note/ui/note-card/NoteCard';
import { NoteCardSkeleton } from '@/entities/note/ui/note-card/NoteCardSkeleton';
import { useMostLovedNotes } from '@/entities/recommend/model/useMainRecommendations';
import { RecommendCarouselSection } from '@/widgets/recommend-carousel-section/RecommendCarouselSection';
/**
 * 메인 페이지 Most Loved(전체 누적 인기 노트) 추천 캐러셀 위젯
 * - 자체 쿼리 훅(useMostLovedNotes)을 통해 데이터를 자율적으로 페칭 및 렌더링
 */
export const MostLovedSection = () => {
  const { notes, isLoading } = useMostLovedNotes();

  return (
    <RecommendCarouselSection
      title="Most Loved"
      isLoading={isLoading}
      items={notes}
      visibleCount={3}
      widthVariant="compact"
      emptyMessage="등록된 인기 노트가 없습니다."
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
  );
};

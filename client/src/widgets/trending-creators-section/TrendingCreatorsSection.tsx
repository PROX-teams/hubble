'use client';

import React from 'react';
import CreatorCard from '@/entities/user/ui/creator-card/CreatorCard';
import { CreatorCardSkeleton } from '@/entities/user/ui/creator-card/CreatorCardSkeleton';
import type { TrendingCreator } from '@/entities/recommend/recommend.types';
import * as s from './TrendingCreatorsSection.css';

interface TrendingCreatorsSectionProps {
  creators: TrendingCreator[];
  isLoading: boolean;
  skeletonCount?: number;
  emptyMessage?: string;
}

/**
 * 메인 페이지 인기 크리에이터(Trending Creators) 사이드바 위젯
 * - FSD 아키텍처 원칙에 따라 레이아웃과 스타일을 위젯 내부로 캡슐화
 * - 로딩(Skeleton), 빈 데이터(Empty), 실제 리스트 렌더링 상태를 자체 통제
 */
export const TrendingCreatorsSection = ({
  creators,
  isLoading,
  skeletonCount = 5,
  emptyMessage = '등록된 크리에이터가 없습니다.',
}: TrendingCreatorsSectionProps) => {
  return (
    <aside className={s.creatorsSection}>
      <h2 className={s.sectionTitle}>Trending Creators</h2>
      <div className={s.creatorsWrapper}>
        {isLoading ? (
          Array.from({ length: skeletonCount }).map((_, i) => (
            <CreatorCardSkeleton key={`creator-skeleton-${i}`} />
          ))
        ) : creators.length === 0 ? (
          <div className={s.emptyMessage}>{emptyMessage}</div>
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
  );
};
